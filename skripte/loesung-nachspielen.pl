#!/usr/bin/perl
# Spielt die Hauptlinie (Feld  loesung = "…") jeder Schachaufgabe gegen ihre FEN nach und meldet den ersten Zug,
# der nicht passt – meist ein Lesefehler im Diagramm oder ein Abschreibfehler in der Lösung.
# Aufruf: perl skripte/loesung-nachspielen.pl data/schach/<buch>.toml [<loes.txt>] [<fen-ersatz.txt>]
#   ohne loes.txt: alle Aufgaben der TOML-Datei, die schon eine Lösung haben
#   mit loes.txt:  Zeilen "nr|zug|partie|turnier|loesung|…" (Lösung im 5. Feld), FEN aus der TOML-Datei
#   fen-ersatz.txt: Zeilen "<nr> <fen>", ersetzen die FEN zum Testen von Korrekturen
# Geprüft wird je Zug: passende Figur der Seite am Zug vorhanden, Weg frei, Schlagzug nur auf gegnerische Figur,
# eigener König danach nicht im Schach, "+"/"#" genau dann, wenn der Gegner im Schach steht. Nicht geprüft:
# Rochaderechte (nur ob König und Turm stehen), Matt, Patt. Deutsche Figurenbuchstaben K D T L S, Umwandlung "c8D".
# Wörter in Klammern, Bewertungen (+–, –+, ±, ∓, =) und Ergebnisse (1-0, 0-1) werden übersprungen.
# Gibt am Ende die Zahl der Fehler aus.
use strict;
use warnings;
use utf8;
binmode STDOUT, ':encoding(UTF-8)';

my ($datei, $loesdatei, $ersatzdatei) = @ARGV;
die "Aufruf: perl skripte/loesung-nachspielen.pl data/schach/<buch>.toml [<loes.txt>] [<fen-ersatz.txt>]\n" unless $datei;
my (%fen, %loes, $nr);
open my $fa, '<:encoding(UTF-8)', $datei or die "Kann $datei nicht lesen: $!\n";
while (<$fa>) {
    $nr = $1 if /^nr = (\d+)/;
    $fen{$nr} = $1 if /^fen = "(.+)"/;
    $loes{$nr} = $1 if /^loesung = "(.+)"/;
}
close $fa;
if ($loesdatei) {
    %loes = ();
    open my $in, '<:encoding(UTF-8)', $loesdatei or die "Kann $loesdatei nicht lesen: $!\n";
    while (my $z = <$in>) { $z =~ s/\s+$//; next unless $z; my @f = split /\|/, $z, -1; $loes{$f[0]} = $f[4]; }
}
if ($ersatzdatei) {
    open my $e, '<:encoding(UTF-8)', $ersatzdatei or die "Kann $ersatzdatei nicht lesen: $!\n";
    while (<$e>) { $fen{$1} = $2 if /^(\d+) (.+?)\s*$/; }
}
my %de = (K => 'K', D => 'Q', T => 'R', L => 'B', S => 'N');
my ($ok, $fehler) = (0, 0);
for my $n (sort { $a <=> $b } keys %loes) {
    my $fe = $fen{$n};
    unless ($fe) { print "$n: keine FEN\n"; $fehler++; next }
    my ($brett, $seite) = split / /, $fe;
    my %b; my $r = 8;
    for my $reihe (split m{/}, $brett) {
        my $c = 0;
        for my $ch (split //, $reihe) { if ($ch =~ /\d/) { $c += $ch } else { $b{chr(97 + $c) . $r} = $ch; $c++ } }
        $r--;
    }
    my $w = $seite eq 'w' ? 1 : 0;
    my $ep = '';
    my $erg = 'ok';
    (my $linie = $loes{$n}) =~ s/\([^)]*\)//g;
    unless ($linie =~ /[a-h][1-8]|[0O]-[0O]/) { print "$n: keine Züge\n"; $fehler++; next }    # leere Lösung nie „in Ordnung“
    for my $t (split /\s+/, $linie) {
        $t =~ s/^\d+\.(\.\.)?//;
        next if $t eq '';
        next if $t =~ /^(1-0|0-1|½-½|=|\+–|–\+|±|∓|\+-|-\+|\+=|=\+|∞)$/;
        my $schach = $t =~ /[+#]/;
        (my $s = $t) =~ s/[!?+#]+$//;
        my $fehl = zug(\%b, $w, $s, \$ep);
        if ($fehl) { $erg = "$t: $fehl"; last }
        if (im_schach(\%b, $w)) { $erg = "$t: eigener König steht danach im Schach"; last }
        my $gibt = im_schach(\%b, 1 - $w);
        if ($schach && !$gibt) { $erg = "$t: kein Schach"; last }
        if (!$schach && $gibt) { $erg = "$t: gibt Schach ohne +"; last }
        $w = 1 - $w;
    }
    if ($erg eq 'ok') { $ok++ } else { $fehler++; print "$n: $erg\n" }
}
print "nachgespielt: $ok in Ordnung\n";
print "$fehler\n";

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

# Führt den Zug $s (ohne !?+#) aus; gibt '' oder eine Fehlermeldung zurück.
sub zug {
    my ($b, $w, $s, $epref) = @_;
    my $grund = $w ? 1 : 8;
    if ($s =~ /^[0O]-[0O](-[0O])?$/) {
        my $lang = defined $1;
        my ($k, $t) = $w ? ('K', 'R') : ('k', 'r');
        return 'Rochade: König nicht auf e' . $grund unless ($b->{"e$grund"} // '') eq $k;
        my ($tv, $tn, $kn) = $lang ? ("a$grund", "d$grund", "c$grund") : ("h$grund", "f$grund", "g$grund");
        return 'Rochade: Turm fehlt' unless ($b->{$tv} // '') eq $t;
        delete $b->{"e$grund"}; delete $b->{$tv};
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
