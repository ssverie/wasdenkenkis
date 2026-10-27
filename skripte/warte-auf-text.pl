# Wartet nach einem Push, bis eine Seite einen bestimmten Text enthält (alle 10 s, höchstens 6 Minuten).
# Für Änderungen an Seiten, die schon vorher 200 lieferten (live-pruefen.pl sieht dort nur den Status).
#   perl skripte/warte-auf-text.pl /podcasts/kanaele/ki/ "Sandeep Swadia"
use strict; use warnings;
my ($pfad, $text) = @ARGV;
defined $text or die "Aufruf: perl skripte/warte-auf-text.pl <pfad> <text>\n";
my $url = $pfad =~ m{^https?://} ? $pfad : "https://wasdenkenkis.de$pfad";
for my $versuch (1 .. 36) {
  my $seite = `curl -s -H "Cache-Control: no-cache" "$url?nc=$versuch$$"`;
  if (index($seite, $text) >= 0) { print "gefunden nach $versuch Versuch(en): $url\n"; exit 0; }
  sleep 10;
}
print "NICHT gefunden nach 6 Minuten: $url\n"; exit 1;
