#!/usr/bin/perl
# Liest eine gelieferte Sprachseite (input\<sprache>-100.html, Format wie englisch-100.html:
# const SPRACHE = "en-GB"; const WORTSCHATZ = { "Gruppe": [["wort","deutsch"], …], … })
# und schreibt data/sprachen/<sprache>.toml für die Rubrik Sprachen.
# Aufruf: perl skripte/sprache-einlesen.pl input/englisch-100.html
use strict;
use warnings;
use utf8;
use open qw(:std :encoding(UTF-8));

my $datei = shift or die "Aufruf: perl skripte/sprache-einlesen.pl <datei.html>\n";
open my $fh, '<', $datei or die "$datei: $!\n";
my $html = do { local $/; <$fh> };
close $fh;

my ($schluessel) = $datei =~ m{([^/\\]+?)(?:-\d+)?\.html?$}i or die "Dateiname?\n";
$schluessel = lc $schluessel;
my ($code) = $html =~ /const\s+SPRACHE\s*=\s*"([^"]+)"/ or die "SPRACHE fehlt\n";
my ($titel) = $html =~ /<title>\s*([^<–-]+?)\s*[–-]/;
$titel //= ucfirst $schluessel;
my ($block) = $html =~ /const\s+WORTSCHATZ\s*=\s*\{(.*?)\n\};/s or die "WORTSCHATZ fehlt\n";

my $str = qr/"((?:[^"\\]|\\.)*)"/;
my (@gruppen, $n);
while ($block =~ /\G.*?(?:$str\s*:\s*\[|\[\s*$str\s*,\s*$str\s*\])/gcs) {
  if (defined $1) { push @gruppen, { name => $1, woerter => [] }; next }
  die "Wort vor der ersten Gruppe\n" unless @gruppen;
  push @{ $gruppen[-1]{woerter} }, [$2, $3];
  $n++;
}
die "Keine Wörter gefunden\n" unless $n;

sub toml { my $s = shift; $s =~ s/\\"/"/g; $s =~ s/\\/\\\\/g; $s =~ s/"/\\"/g; qq("$s") }

my $ziel = "data/sprachen/$schluessel.toml";
mkdir 'data/sprachen';
open my $out, '>', $ziel or die "$ziel: $!\n";
print $out "# $titel – die 100 wichtigsten Wörter. Erzeugt aus $datei mit skripte/sprache-einlesen.pl; nicht von Hand ändern.\n";
print $out "name = ", toml($titel), "\nsprache = ", toml($code), "\n";
for my $g (@gruppen) {
  print $out "\n[[gruppe]]\nname = ", toml($g->{name}), "\nwoerter = [\n";
  print $out "  [", toml($_->[0]), ", ", toml($_->[1]), "],\n" for @{ $g->{woerter} };
  print $out "]\n";
}
close $out;
printf "%s: %s (%s), %d Gruppen, %d Wörter\n", $ziel, $titel, $code, scalar @gruppen, $n;
