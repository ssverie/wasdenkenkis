#!/usr/bin/perl
# Liest eine gelieferte Sprachseite (input\<sprache>-100.html, Format wie englisch-100.html:
# const SPRACHE = "en-GB"; const WORTSCHATZ = { "Gruppe": [["wort","deutsch"], …], … };
# Sprachen mit eigener Schrift wie Thai liefern [["wort","umschrift","deutsch"], …],
# Japanisch [["wort","kana","umschrift","deutsch"], …] (gesprochen wird die Kana-Lesung))
# und schreibt data/sprachen/<sprache>.toml für die Rubrik Sprachen.
# Aufruf: perl skripte/sprache-einlesen.pl input/englisch-100.html [Anzeigename]
# (Anzeigename nur nötig, wenn <title> keinen deutschen Namen hat, z. B. bei Deutsch: <title>German …)
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));

my $datei = shift or die "Aufruf: perl skripte/sprache-einlesen.pl <datei.html> [Anzeigename]\n";
my $name_vorgabe = shift;
open my $fh, '<', $datei or die "$datei: $!\n";
my $html = do { local $/; <$fh> };
close $fh;

my ($schluessel, $umfang) = $datei =~ m{([^/\\]+?)(?:-(\d+))?\.html?$}i or die "Dateiname?\n";
$schluessel = lc $schluessel;
# <sprache>-100.html → data/sprachen/, <sprache>-1000.html → data/sprachen1000/ (Seite: datenbereich = "sprachen1000")
my $bereich = ($umfang && $umfang >= 1000) ? "sprachen$umfang" : 'sprachen';
my ($code) = $html =~ /const\s+SPRACHE\s*=\s*"([^"]+)"/ or die "SPRACHE fehlt\n";
my ($titel) = $html =~ /<title>\s*([^<–-]+?)\s*[–-]/;
$titel //= ucfirst $schluessel;
$titel = $name_vorgabe if defined $name_vorgabe;
# Schrift von rechts nach links (Arabisch): const RECHTS_NACH_LINKS = true;
my $rtl = $html =~ /const\s+RECHTS_NACH_LINKS\s*=\s*true/ ? 1 : 0;
my ($block) = $html =~ /const\s+WORTSCHATZ\s*=\s*\{(.*?)\n\};/s or die "WORTSCHATZ fehlt\n";

my $str = qr/"((?:[^"\\]|\\.)*)"/;
my (@gruppen, $n);
while ($block =~ /\G.*?(?:$str\s*:\s*\[|\[\s*$str\s*,\s*$str\s*(?:,\s*$str\s*)?(?:,\s*$str\s*)?\])/gcs) {
  if (defined $1) { push @gruppen, { name => $1, woerter => [] }; next }
  die "Wort vor der ersten Gruppe\n" unless @gruppen;
  # In den Daten immer [wort, deutsch], [wort, deutsch, umschrift] oder [wort, deutsch, umschrift, kana]
  # – Index 1 ist stets die Übersetzung, Index 3 (falls da) die Lesung, die vorgelesen wird
  push @{ $gruppen[-1]{woerter} },
      defined $5 ? [$2, $5, $4, $3]
    : defined $4 ? [$2, $4, $3]
    :              [$2, $3];
  $n++;
}
die "Keine Wörter gefunden\n" unless $n;

sub toml { my $s = shift; $s =~ s/\\"/"/g; $s =~ s/\\/\\\\/g; $s =~ s/"/\\"/g; qq("$s") }

my $ziel = "data/$bereich/$schluessel.toml";
mkdir "data/$bereich";
open my $out, '>', $ziel or die "$ziel: $!\n";
print $out "# $titel – die ", ($umfang // 100), " wichtigsten Wörter. Erzeugt aus $datei mit skripte/sprache-einlesen.pl; nicht von Hand ändern.\n";
print $out "name = ", toml($titel), "\nsprache = ", toml($code), "\n";
print $out "rtl = true\n" if $rtl;
for my $g (@gruppen) {
  print $out "\n[[gruppe]]\nname = ", toml($g->{name}), "\nwoerter = [\n";
  print $out "  [", join(", ", map { toml($_) } @$_), "],\n" for @{ $g->{woerter} };
  print $out "]\n";
}
close $out;
printf "%s: %s (%s), %d Gruppen, %d Wörter\n", $ziel, $titel, $code, scalar @gruppen, $n;
