#!/usr/bin/perl
# Prüft FEN-Stellungen auf Plausibilität: je Zeile "<nr> <fen>" (oder nur "<fen>").
# Aufruf: perl skripte/fen-pruefen.pl <datei>   – oder: perl skripte/fen-pruefen.pl data/schach/<buch>.toml
# Bei TOML-Dateien werden alle Zeilen  fen = "…"  geprüft (mit der Nummer aus  nr = …  davor).
# Prüft: 8 Reihen à 8 Felder, je ein König, keine Bauern auf Reihe 1/8, höchstens 8 Bauern und 16 Steine
# je Seite, Seite nicht am Zug steht nicht im Schach, Könige nicht nebeneinander. Gibt die Zahl der Fehler aus.
use strict;
use warnings;

my $datei = shift or die "Aufruf: perl skripte/fen-pruefen.pl <datei>\n";
open my $fh, '<:encoding(UTF-8)', $datei or die "Kann $datei nicht lesen: $!\n";
my @stellungen;
my $nr = '';
while (my $z = <$fh>) {
    chomp $z;
    if ($z =~ /^\s*nr\s*=\s*(\d+)/) { $nr = $1; next }
    if ($z =~ /^\s*fen\s*=\s*"([^"]+)"/) { push @stellungen, [$nr, $1]; next }
    next if $z =~ /^\s*(#|$)/;
    next if $datei =~ /\.toml$/;
    if ($z =~ /^\s*(\d+)\s+(\S.*)$/) { push @stellungen, [$1, $2] }
    else { push @stellungen, ['?', $z] }
}
close $fh;

my $fehler = 0;
for my $s (@stellungen) {
    my ($n, $fen) = @$s;
    my @f = pruefe($fen);
    if (@f) { $fehler++; print "Nr. $n: ", join('; ', @f), "\n" }
}
print "$fehler\n";
exit($fehler ? 1 : 0);

sub pruefe {
    my ($fen) = @_;
    my @teile = split ' ', $fen;
    my @f;
    return ("FEN unvollständig") if @teile < 2;
    return ("Seite am Zug muss w oder b sein") unless $teile[1] =~ /^[wb]$/;
    my @reihen = split '/', $teile[0];
    return ("nicht 8 Reihen") if @reihen != 8;
    my %brett;   # "x,y" (x 0..7 = a..h, y 0..7 = Reihe 1..8) => Figur
    for my $i (0 .. 7) {
        my $y = 7 - $i;
        my $x = 0;
        for my $c (split //, $reihen[$i]) {
            if ($c =~ /[1-8]/) { $x += $c }
            elsif ($c =~ /[KQRBNPkqrbnp]/) { $brett{"$x,$y"} = $c if $x < 8; $x++ }
            else { push @f, "unbekanntes Zeichen $c"; $x++ }
        }
        push @f, "Reihe " . ($y + 1) . " hat $x Felder" if $x != 8;
    }
    return @f if @f;
    my %zahl;
    $zahl{$_}++ for values %brett;
    push @f, "weißer König " . ($zahl{K} // 0) . "-mal" if ($zahl{K} // 0) != 1;
    push @f, "schwarzer König " . ($zahl{k} // 0) . "-mal" if ($zahl{k} // 0) != 1;
    for my $feld (keys %brett) {
        my ($x, $y) = split /,/, $feld;
        push @f, "Bauer auf " . chr(97 + $x) . ($y + 1) if lc $brett{$feld} eq 'p' && ($y == 0 || $y == 7);
    }
    my ($w, $b) = (0, 0);
    for my $p (values %brett) { if ($p =~ /[A-Z]/) { $w++ } else { $b++ } }
    push @f, "Weiß hat $w Steine" if $w > 16;
    push @f, "Schwarz hat $b Steine" if $b > 16;
    push @f, "Weiß hat $zahl{P} Bauern" if ($zahl{P} // 0) > 8;
    push @f, "Schwarz hat $zahl{p} Bauern" if ($zahl{p} // 0) > 8;
    return @f if @f;
    my ($kw) = grep { $brett{$_} eq 'K' } keys %brett;
    my ($ks) = grep { $brett{$_} eq 'k' } keys %brett;
    my ($ax, $ay) = split /,/, $kw;
    my ($bx, $by) = split /,/, $ks;
    push @f, "Könige stehen nebeneinander" if abs($ax - $bx) <= 1 && abs($ay - $by) <= 1;
    # Rochaderechte passen zur Stellung (König und Turm auf ihren Ausgangsfeldern)
    my %rochade = (K => ['4,0', 'K', '7,0', 'R'], Q => ['4,0', 'K', '0,0', 'R'], k => ['4,7', 'k', '7,7', 'r'], q => ['4,7', 'k', '0,7', 'r']);
    my $recht = $teile[2] // '-';
    for my $c (split //, $recht) {
        next if $c eq '-';
        my $r = $rochade{$c} or do { push @f, "unbekanntes Rochaderecht $c"; next };
        push @f, "Rochaderecht $c passt nicht zur Stellung"
            unless ($brett{$r->[0]} // '') eq $r->[1] && ($brett{$r->[2]} // '') eq $r->[3];
    }
    # Die Seite, die nicht am Zug ist, darf nicht im Schach stehen.
    my $amzug = $teile[1];
    my ($zx, $zy, $angreifer) = $amzug eq 'w' ? ($bx, $by, 'w') : ($ax, $ay, 's');
    push @f, ($amzug eq 'w' ? 'Schwarz' : 'Weiß') . " steht im Schach, obwohl " . ($amzug eq 'w' ? 'Weiß' : 'Schwarz') . " am Zug ist"
        if angegriffen(\%brett, $zx, $zy, $angreifer);
    return @f;
}

sub angegriffen {
    my ($brett, $x, $y, $seite) = @_;   # $seite = w|s: wird das Feld von dieser Seite angegriffen?
    my $eigen = sub { my $p = shift; defined $p && ($seite eq 'w' ? $p =~ /[A-Z]/ : $p =~ /[a-z]/) };
    my $art = sub { lc shift };
    my $an = sub { my ($i, $j) = @_; return undef if $i < 0 || $i > 7 || $j < 0 || $j > 7; $brett->{"$i,$j"} };
    # Bauern
    my $dy = $seite eq 'w' ? -1 : 1;
    for my $dx (-1, 1) { my $p = $an->($x + $dx, $y + $dy); return 1 if $eigen->($p) && $art->($p) eq 'p' }
    # Springer
    for my $d ([1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]) {
        my $p = $an->($x + $d->[0], $y + $d->[1]); return 1 if $eigen->($p) && $art->($p) eq 'n';
    }
    # König
    for my $i (-1 .. 1) { for my $j (-1 .. 1) { next unless $i || $j;
        my $p = $an->($x + $i, $y + $j); return 1 if $eigen->($p) && $art->($p) eq 'k' } }
    # Linien und Diagonalen
    for my $d ([1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]) {
        my ($i, $j) = ($x + $d->[0], $y + $d->[1]);
        while ($i >= 0 && $i <= 7 && $j >= 0 && $j <= 7) {
            my $p = $brett->{"$i,$j"};
            if (defined $p) {
                if ($eigen->($p)) {
                    my $a = $art->($p);
                    my $gerade = $d->[0] == 0 || $d->[1] == 0;
                    return 1 if $a eq 'q' || ($gerade && $a eq 'r') || (!$gerade && $a eq 'b');
                }
                last;
            }
            $i += $d->[0]; $j += $d->[1];
        }
    }
    return 0;
}
