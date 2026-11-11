#!/usr/bin/perl
# Erzeugt den Datenblock einer KI-Partie für data/schach/ki-partien.toml (seit 2026-11-11; vorher je Partie Wegwerf-Skripte).
#
#   perl skripte/ki-partie-daten.pl <partie.pgn> <seite.html> <kapitel> <slug> "<partie>" "<turnier>" [<fen>]
#
# Gibt [[kapitel]] + [[aufgabe]] + [[aufgabe.kommentare]] auf STDOUT aus (anhängen von Hand nach Prüfung).
# - Hauptlinie und Varianten aus der PGN (englische SAN → K D T L S, O-O → 0-0, e8=Q → e8D); Varianten = die Klammern der
#   Hauptlinie (verschachtelte Klammern werden übergangen); steht im Kommentar einer Variante „zurückgenommen“, bekommt sie
#   „ (zurückgenommen)“ angehängt (wie Kapitel 1 und 5).
# - bewertungen = erster Wert im Kommentar nach jedem Hauptzug (+0.39, -M3, +M16); Anzahl muss = Halbzüge sein.
# - Kommentare aus der Seite der Instanz: jeder <p> ohne Klasse und jede <div class="korr"> nach einer Zugzeile
#   (<span class="mv">) hängt am letzten Zug dieser Zeile; Engine-Kästen mit art = "engine"; h2, Diagramme, Bildunterschriften
#   (p.cap) übersprungen; ab der Überschrift „Was ich mitnehme“ nichts mehr.
# - Prüft: Züge der Zugzeilen = PGN-Hauptlinie, Bewertungen der Zugzeilen = PGN-Bewertungen. Abweichung = Abbruch.
use strict; use warnings; use utf8;
use Encode qw(decode);
binmode STDOUT, ':encoding(UTF-8)'; binmode STDERR, ':encoding(UTF-8)';
@ARGV = map { decode('UTF-8', $_) } @ARGV;
my ($pgnf, $htmlf, $kap, $slug, $partie, $turnier, $fen) = @ARGV;
die "Aufruf: perl skripte/ki-partie-daten.pl <pgn> <html> <kapitel> <slug> \"<partie>\" \"<turnier>\" [<fen>]\n" unless defined $turnier;
$fen //= 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

sub lies { my $d = shift; open my $f, '<:encoding(UTF-8)', $d or die "$d: $!"; local $/; my $t = <$f>; close $f; $t =~ s/^\x{FEFF}//; return $t }
sub deutsch {
    my $z = shift;
    $z =~ s/^O-O-O/0-0-0/; $z =~ s/^O-O/0-0/;
    $z =~ s/=([QRBN])/$1/;
    $z =~ tr/QRBN/DTLS/;
    return $z;
}

# --- PGN zerlegen ---
my $pgn = lies($pgnf);
my ($ergebnis) = $pgn =~ /\[Result "([^"]+)"\]/;
$pgn =~ s/^\[.*\]\s*$//mg;
my @tok;
while ($pgn =~ /\G\s*(\{[^}]*\}|\(|\)|\$\d+|\d+\.(?:\.\.)?|[^\s(){}]+)/gc) { push @tok, $1 }
my (@haupt, @bew, @var);   # haupt: Züge (deutsch); bew: Bewertung je Halbzug; var: [Startindex, [Züge], Kommentartext]
my $tiefe = 0; my $aktvar;
for my $t (@tok) {
    if ($t eq '(') {
        $tiefe++;
        if ($tiefe == 1) { $aktvar = [scalar(@haupt) - 1, [], '']; push @var, $aktvar }
        next;
    }
    if ($t eq ')') { $tiefe--; next }
    next if $t =~ /^\$\d+$/ || $t =~ /^\d+\.(\.\.)?$/;
    if ($t =~ /^\{\s*(.*?)\s*\}$/s) {
        my $k = $1;
        if ($tiefe == 0) {
            my ($w) = $k =~ /^([+-]?(?:\d+\.\d+|M\d+))/;
            $bew[$#haupt] //= $w if defined $w;
        } elsif ($tiefe == 1) { $aktvar->[2] .= " $k" }
        next;
    }
    next if $t =~ /^(1-0|0-1|1\/2-1\/2|\*)$/;
    if ($tiefe == 0) { push @haupt, deutsch($t) }
    elsif ($tiefe == 1) { push @{ $aktvar->[1] }, deutsch($t) }
}
die "Bewertungen: " . scalar(grep { defined } @bew) . " für " . scalar(@haupt) . " Halbzüge\n"
    unless @bew == @haupt && !grep { !defined } @bew;

sub linie {   # Züge ab Halbzug-Index $i mit Nummern
    my ($i, @z) = @_;
    my @o;
    for my $k (0 .. $#z) {
        my $h = $i + $k; my $nr = int($h / 2) + 1;
        if ($h % 2 == 0) { push @o, "$nr.$z[$k]" }
        elsif ($k == 0) { push @o, "$nr...$z[$k]" }
        else { push @o, $z[$k] }
    }
    return join ' ', @o;
}
my $loesung = linie(0, @haupt) . ($ergebnis && $ergebnis ne '*' ? " $ergebnis" : '');
my @varianten;
for my $v (@var) {
    my ($i, $z, $k) = @$v;
    next unless @$z;
    my $s = linie($i, @$z);
    $s .= ' (zurückgenommen)' if $k =~ /zurückgenommen/;
    push @varianten, $s;
}

# --- Seite der Instanz ---
my $h = lies($htmlf);
$h =~ s{<svg.*?</svg>}{}gs;
my (@komm, $letzter, @mvzuege, @mvbew);
while ($h =~ m{<(h2)>(.*?)</h2>|<p><span class="mv">(.*?)</span></p>|<p>(.*?)</p>|<div class="korr">(.*?)</div>}gs) {
    if (defined $1) { last if $2 =~ /Was ich mitnehme/; next }
    if (defined $3) {
        my $zl = $3;
        my @ev = $zl =~ m{<span class="ev">([^<]*)</span>}g;
        (my $nur = $zl) =~ s{<span class="ev">[^<]*</span>}{}g;
        my @z = map { s/…/.../r } grep { /\S/ } split /\s+/, $nur;
        push @mvzuege, @z; push @mvbew, @ev;
        $letzter = $z[-1];
        next;
    }
    next unless defined $letzter;
    if (defined $4) { push @komm, [$letzter, '', $4] }
    else { push @komm, [$letzter, 'engine', $5] }
}
# Zugzeilen gegen PGN
my @soll = split / /, linie(0, @haupt);
my @ist;
for my $z (@mvzuege) { push @ist, $z }
my $gleich = join(' ', map { s/^\d+\.(\.\.)?//r } @ist) eq join(' ', @haupt);
die "Zugzeilen der Seite ≠ PGN-Hauptlinie\n" unless $gleich;
die "Bewertungen der Seite ≠ PGN (" . scalar(@mvbew) . " gegen " . scalar(@bew) . ")\n"
    unless join(' ', @mvbew) eq join(' ', @bew);
for (@komm) { die "Kommentar enthält ''' – von Hand setzen\n" if $_->[2] =~ /'''/ }

# --- Ausgabe ---
my $q = sub { my $s = shift; $s =~ s/(["\\])/\\$1/g; "\"$s\"" };
print "\n[[kapitel]]\nnr = $kap\ntitel = \"Partien\"\nslug = \"$slug\"\n\n";
print "[[aufgabe]]\nnr = $kap\nkapitel = $kap\nfen = \"$fen\"\npartie = ", $q->($partie), "\nturnier = ", $q->($turnier), "\n";
print "loesung = ", $q->($loesung), "\n";
print "varianten = [", join(', ', map { $q->($_) } @varianten), "]\n";
print "bewertungen = \"", join(' ', map { /^[+-]/ ? $_ : "+$_" } @bew), "\"\n";
for my $k (@komm) {
    print "\n[[aufgabe.kommentare]]\nnach = \"$k->[0]\"\n";
    print "art = \"engine\"\n" if $k->[1];
    print "text = '''$k->[2]'''\n";
}
printf STDERR "Halbzüge %d, Varianten %d, Bewertungen %d, Kommentare %d (Engine %d), Ergebnis %s\n",
    scalar(@haupt), scalar(@varianten), scalar(@bew), scalar(@komm), scalar(grep { $_->[1] } @komm), $ergebnis // '?';
