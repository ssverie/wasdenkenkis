#!/usr/bin/perl
# Spielt die Hauptlinie (Feld  loesung = "…") jeder Schachaufgabe gegen ihre FEN nach und meldet den ersten Zug,
# der nicht passt – meist ein Lesefehler im Diagramm oder ein Abschreibfehler in der Lösung.
# Aufruf: perl skripte/loesung-nachspielen.pl [--varianten] data/schach/<buch>.toml [<loes.txt>] [<fen-ersatz.txt>]
#   ohne loes.txt: alle Aufgaben der TOML-Datei, die schon eine Lösung haben
#   --varianten: zusätzlich die Varianten (Feld varianten) – nur für Bücher, deren Varianten alle mit Zugnummer
#                von der Hauptlinie abzweigen (Gallagher); Rizzitano hat Untervarianten, die nur die Seite auflöst
#   mit loes.txt:  Zeilen "nr|zug|partie|turnier|loesung|…" (Lösung im 5. Feld), FEN aus der TOML-Datei
#   fen-ersatz.txt: Zeilen "<nr> <fen>", ersetzen die FEN zum Testen von Korrekturen
# Geprüft wird je Zug: passende Figur der Seite am Zug vorhanden, Weg frei, Schlagzug nur auf gegnerische Figur,
# eigener König danach nicht im Schach, "+"/"#" genau dann, wenn der Gegner im Schach steht, und bei "#", dass der
# Gegner keinen legalen Zug mehr hat (Matt). Nicht geprüft: Rochaderechte (nur ob König und Turm stehen), Patt.
# Deutsche Figurenbuchstaben K D T L S, Umwandlung "c8D".
# Varianten (seit 2026-11-03): Eine Variante beginnt mit Zugnummer ("4...Kg7", "2.Dd8+"); vorangestellt wird die
# Hauptlinie bis vor diesen Zug. Varianten, die von einer anderen Variante abzweigen, stehen als volle Linie ab Zug 1.
# Wörter in Klammern, Bewertungen (+–, –+, ±, ∓, =) und Ergebnisse (1-0, 0-1) werden übersprungen.
# Gibt am Ende die Zahl der Fehler aus.
use strict;
use warnings;
use utf8;
binmode STDOUT, ':encoding(UTF-8)';

my $mit_var = (@ARGV && $ARGV[0] eq '--varianten') ? shift @ARGV : '';
my ($datei, $loesdatei, $ersatzdatei) = @ARGV;
die "Aufruf: perl skripte/loesung-nachspielen.pl data/schach/<buch>.toml [<loes.txt>] [<fen-ersatz.txt>]\n" unless $datei;
my (%fen, %loes, %var, $nr);
open my $fa, '<:encoding(UTF-8)', $datei or die "Kann $datei nicht lesen: $!\n";
while (<$fa>) {
    $nr = $1 if /^nr = (\d+)/;
    $fen{$nr} = $1 if /^fen = "(.+)"/;
    $loes{$nr} = $1 if /^loesung = "(.+)"/;
    if ($mit_var && /^varianten = \[(.*)\]/) { my $l = $1; $var{$nr} = [ $l =~ /"([^"]*)"/g ] }
}
close $fa;
if ($loesdatei) {
    %loes = (); %var = ();
    open my $in, '<:encoding(UTF-8)', $loesdatei or die "Kann $loesdatei nicht lesen: $!\n";
    while (my $z = <$in>) { $z =~ s/\s+$//; next unless $z; my @f = split /\|/, $z, -1; $loes{$f[0]} = $f[4]; }
}
if ($ersatzdatei) {
    open my $e, '<:encoding(UTF-8)', $ersatzdatei or die "Kann $ersatzdatei nicht lesen: $!\n";
    while (<$e>) { $fen{$1} = $2 if /^(\d+) (.+?)\s*$/; }
}
my %de = (K => 'K', D => 'Q', T => 'R', L => 'B', S => 'N');
my ($ok, $fehler, $vok, $vfehler) = (0, 0, 0, 0);
for my $n (sort { $a <=> $b } keys %loes) {
    my $fe = $fen{$n};
    unless ($fe) { print "$n: keine FEN\n"; $fehler++; next }
    my $erg = spiele($fe, $loes{$n});
    if ($erg eq 'ok') { $ok++ } else { $fehler++; print "$n: $erg\n" }
    next unless $var{$n};
    my @h = zuege($loes{$n});
    my $i = 0;
    for my $v (@{ $var{$n} }) {
        $i++;
        my ($vn, $vs) = $v =~ /^(\d+)(\.\.\.|\.)/;
        unless ($vn) { print "$n/V$i: Variante ohne Zugnummer\n"; $vfehler++; next }
        $vs = $vs eq '...' ? 1 : 0;
        my @vor = map { $_->[2] } grep { $_->[0] < $vn || ($_->[0] == $vn && $_->[1] < $vs) } @h;
        my $ve = spiele($fe, join(' ', @vor, $v));
        if ($ve eq 'ok') { $vok++ } else { $vfehler++; print "$n/V$i ($v): $ve\n" }
    }
}
print "nachgespielt: $ok in Ordnung\n";
print "Varianten: $vok in Ordnung, $vfehler Fehler\n" if $vok || $vfehler;
print $fehler + $vfehler, "\n";

# Zerlegt eine Linie in [Zugnummer, Seite (0 = Weiß, 1 = Schwarz), Zug mit Nummer].
sub zuege {
    my ($linie) = @_;
    $linie =~ s/\([^)]*\)//g;
    my (@h, $num, $seite);
    for my $w (split /\s+/, $linie) {
        next if $w eq '' || $w =~ /^(1-0|0-1|½-½)$/;
        if ($w =~ /^(\d+)\.\.\.(.*)$/) { ($num, $seite) = ($1, 1); push @h, [$num, 1, "$1...$2"] if $2 ne ''; next }
        if ($w =~ /^(\d+)\.(.+)$/) { ($num, $seite) = ($1, 0); push @h, [$num, 0, "$1.$2"]; next }
        next unless defined $num;
        $seite = 1 - $seite; $num++ if $seite == 0;
        push @h, [$num, $seite, $w];
    }
    return @h;
}

# Spielt eine Linie gegen eine FEN nach; gibt 'ok' oder die Fehlermeldung zurück.
sub spiele {
    my ($fe, $linie0) = @_;
    my ($brett, $seite) = split / /, $fe;
    my %b; my $r = 8;
    for my $reihe (split m{/}, $brett) {
        my $c = 0;
        for my $ch (split //, $reihe) { if ($ch =~ /\d/) { $c += $ch } else { $b{chr(97 + $c) . $r} = $ch; $c++ } }
        $r--;
    }
    my $w = $seite eq 'w' ? 1 : 0;
    my $ep = '';
    (my $linie = $linie0) =~ s/\([^)]*\)//g;
    return 'keine Züge' unless $linie =~ /[a-h][1-8]|[0O]-[0O]/;    # leere Lösung nie „in Ordnung“
    for my $t (split /\s+/, $linie) {
        $t =~ s/^\d+\.(\.\.)?//;
        next if $t eq '';
        next if $t =~ /^(1-0|0-1|½-½|=|\+–|–\+|±|∓|\+-|-\+|\+=|=\+|∞)$/;
        my $schach = $t =~ /[+#]/;
        my $matt = $t =~ /#/;
        (my $s = $t) =~ s/[!?+#]+$//;
        my $fehl = zug(\%b, $w, $s, \$ep);
        return "$t: $fehl" if $fehl;
        return "$t: eigener König steht danach im Schach" if im_schach(\%b, $w);
        my $gibt = im_schach(\%b, 1 - $w);
        return "$t: kein Schach" if $schach && !$gibt;
        return "$t: gibt Schach ohne +" if !$schach && $gibt;
        $w = 1 - $w;
        return "$t: kein Matt, der Gegner hat noch einen Zug" if $matt && hat_zug(\%b, $w, $ep);
    }
    return 'ok';
}

sub feld { my ($f, $r) = @_; return undef if $f < 0 || $f > 7 || $r < 1 || $r > 8; return chr(97 + $f) . $r }
sub eigen { my ($p, $w) = @_; return 0 unless defined $p; return $w ? ($p =~ /[A-Z]/) : ($p =~ /[a-z]/) }

# Kann eine Figur vom Typ $typ (K Q R B N) von $von nach $nach ziehen (ohne Bauern)?
sub erreicht {
    my ($b, $von, $nach, $typ) = @_;
    my ($vf, $vr) = (ord(substr($von, 0, 1)) - 97, substr($von, 1, 1));
    my ($nf, $nr2) = (ord(substr($nach, 0, 1)) - 97, substr($nach, 1, 1));
    my ($df, $dr) = ($nf - $vf, $nr2 - $vr);
    return 0 if !$df && !$dr;
    return abs($df) * abs($dr) == 2 if $typ eq 'N';
    return abs($df) <= 1 && abs($dr) <= 1 if $typ eq 'K';
    my $gerade = (!$df || !$dr);
    my $diag = (abs($df) == abs($dr));
    return 0 if $typ eq 'R' && !$gerade;
    return 0 if $typ eq 'B' && !$diag;
    return 0 if $typ eq 'Q' && !$gerade && !$diag;
    my ($sf, $sr) = ($df <=> 0, $dr <=> 0);
    my ($f, $r) = ($vf + $sf, $vr + $sr);
    while ($f != $nf || $r != $nr2) { return 0 if defined $b->{feld($f, $r)}; $f += $sf; $r += $sr; }
    return 1;
}

# Wird $feld von Seite $w (1 = Weiß) angegriffen?
sub angegriffen {
    my ($b, $feld, $w) = @_;
    my ($ff, $fr) = (ord(substr($feld, 0, 1)) - 97, substr($feld, 1, 1));
    for my $q (keys %$b) {
        my $p = $b->{$q};
        next unless eigen($p, $w);
        my $typ = uc $p;
        if ($typ eq 'P') {
            my ($qf, $qr) = (ord(substr($q, 0, 1)) - 97, substr($q, 1, 1));
            return 1 if $fr == $qr + ($w ? 1 : -1) && abs($ff - $qf) == 1;
            next;
        }
        return 1 if erreicht($b, $q, $feld, $typ);
    }
    return 0;
}

sub im_schach {
    my ($b, $w) = @_;
    my $k = $w ? 'K' : 'k';
    my ($ks) = grep { $b->{$_} eq $k } keys %$b;
    return 0 unless $ks;
    return angegriffen($b, $ks, 1 - $w);
}

# Hat Seite $w (1 = Weiß) mindestens einen legalen Zug? (Rochade zählt nicht – aus dem Schach ohnehin verboten.)
sub hat_zug {
    my ($b, $w, $ep) = @_;
    for my $q (keys %$b) {
        my $p = $b->{$q};
        next unless eigen($p, $w);
        my $typ = uc $p;
        my ($qf, $qr) = (ord(substr($q, 0, 1)) - 97, substr($q, 1, 1));
        my @ziele;
        if ($typ eq 'P') {
            my $d = $w ? 1 : -1;
            my $z = feld($qf, $qr + $d);
            if ($z && !defined $b->{$z}) {
                push @ziele, $z;
                my $z2 = feld($qf, $qr + 2 * $d);
                push @ziele, $z2 if $z2 && !defined $b->{$z2} && $qr == ($w ? 2 : 7);
            }
            for my $df (-1, 1) {
                my $s = feld($qf + $df, $qr + $d);
                next unless $s;
                push @ziele, $s if (defined $b->{$s} && !eigen($b->{$s}, $w)) || ($ep && $s eq $ep);
            }
        } else {
            for my $f (0 .. 7) {
                for my $r (1 .. 8) {
                    my $z = feld($f, $r);
                    next if defined $b->{$z} && eigen($b->{$z}, $w);
                    push @ziele, $z if erreicht($b, $q, $z, $typ);
                }
            }
        }
        for my $z (@ziele) {
            my %c = %$b;
            my $pp = delete $c{$q};
            delete $c{substr($z, 0, 1) . $qr} if $typ eq 'P' && $ep && $z eq $ep && !defined $b->{$z};
            $c{$z} = $pp;
            return 1 unless im_schach(\%c, $w);
        }
    }
    return 0;
}

# Führt den Zug $s (ohne !?+#) aus; gibt '' oder eine Fehlermeldung zurück.
sub zug {
    my ($b, $w, $s, $epref) = @_;
    my $grund = $w ? 1 : 8;
    if ($s =~ /^[0O]-[0O](-[0O])?$/) {
        my $lang = defined $1;
        my ($k, $t) = $w ? ('K', 'R') : ('k', 'r');
        # Auch Chess960: König irgendwo auf der Grundreihe, Turm = der äußerste auf der Rochadeseite;
        # danach steht der König auf c/g, der Turm auf d/f (wie im normalen Schach).
        my ($kf) = grep { ($b->{"$_$grund"} // '') eq $k } 'a' .. 'h';
        return 'Rochade: König nicht auf der Grundreihe' unless defined $kf;
        my @seite = $lang ? grep { $_ lt $kf } 'a' .. 'h' : reverse grep { $_ gt $kf } 'a' .. 'h';
        my ($tf) = grep { ($b->{"$_$grund"} // '') eq $t } @seite;
        return 'Rochade: Turm fehlt' unless defined $tf;
        my ($tn, $kn) = $lang ? ("d$grund", "c$grund") : ("f$grund", "g$grund");
        delete $b->{"$kf$grund"}; delete $b->{"$tf$grund"};
        $b->{$kn} = $k; $b->{$tn} = $t; $$epref = '';
        return '';
    }
    my ($fig, $vf, $vr, $x, $nach, $um) = $s =~ /^([KDTLS])?([a-h])?([1-8])?(x)?([a-h][1-8])=?([DTLS])?$/
        or return 'nicht lesbar';
    my $ziel = $b->{$nach};
    if ($x) {
        return 'Schlagzug, aber Zielfeld leer' if !defined $ziel && !(!$fig && $nach eq $$epref);
        return 'schlägt eigene Figur' if defined $ziel && eigen($ziel, $w);
    } else {
        return 'Zielfeld besetzt' if defined $ziel;
    }
    my @kand;
    if (!$fig) {
        my $p = $w ? 'P' : 'p';
        my $d = $w ? 1 : -1;
        my ($nf, $nr2) = (ord(substr($nach, 0, 1)) - 97, substr($nach, 1, 1));
        if ($x) {
            return 'Bauernschlag ohne Ausgangslinie' unless $vf;
            my $q = feld(ord($vf) - 97, $nr2 - $d);
            push @kand, $q if $q && ($b->{$q} // '') eq $p && abs(ord($vf) - 97 - $nf) == 1;
        } else {
            my $q = feld($nf, $nr2 - $d);
            if ($q && ($b->{$q} // '') eq $p) { push @kand, $q }
            elsif ($q && !defined $b->{$q}) {
                my $q2 = feld($nf, $nr2 - 2 * $d);
                push @kand, $q2 if $q2 && ($b->{$q2} // '') eq $p && $nr2 == ($w ? 4 : 5);
            }
        }
    } else {
        my $typ = $de{$fig};
        my $p = $w ? $typ : lc $typ;
        for my $q (keys %$b) {
            next unless $b->{$q} eq $p;
            next if $vf && substr($q, 0, 1) ne $vf;
            next if $vr && substr($q, 1, 1) ne $vr;
            push @kand, $q if erreicht($b, $q, $nach, $typ);
        }
    }
    return 'keine passende Figur' unless @kand;
    if (@kand > 1) {    # gefesselte Figuren aussortieren
        @kand = grep { my %c = %$b; my $p = delete $c{$_}; $c{$nach} = $p; !im_schach(\%c, $w) } @kand;
        return 'mehrdeutig: ' . join(',', @kand) if @kand > 1;
        return 'nur gefesselte Figuren' unless @kand;
    }
    my $von = $kand[0];
    my $p = delete $b->{$von};
    delete $b->{substr($nach, 0, 1) . substr($von, 1, 1)} if !$fig && $x && !defined $ziel;    # en passant
    $$epref = (!$fig && abs(substr($nach, 1, 1) - substr($von, 1, 1)) == 2)
        ? substr($nach, 0, 1) . ((substr($nach, 1, 1) + substr($von, 1, 1)) / 2) : '';
    if ($um) { $p = $w ? $de{$um} : lc $de{$um} }
    elsif (!$fig && substr($nach, 1, 1) == ($w ? 8 : 1)) { return 'Umwandlung ohne Figur' }
    $b->{$nach} = $p;
    return '';
}
