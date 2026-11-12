# Wartet nach einem Push, bis eine Seite einen bestimmten Text enthält (alle 10 s, höchstens 3 Minuten – Sven, 2026-10-28).
# Für Änderungen an Seiten, die schon vorher 200 lieferten (live-pruefen.pl sieht dort nur den Status).
#   perl skripte/warte-auf-text.pl /podcasts/kanaele/ki/ "Sandeep Swadia"
# Achtung: Die Live-Seite ist verdichtet (minify) – Anführungszeichen um HTML-Attribute fehlen dort.
# Darum nur nach sichtbarem Text suchen, nie nach HTML wie href="…" (am 2026-10-28 wartete das Skript so vergeblich).
# Optional dritter Wert = Minuten (seit 2026-11-11, GitHub-Störung bei Actions/Pages): ab 4 Minuten wird nur noch jede Minute geprüft,
#   perl skripte/warte-auf-text.pl /schach/ki-partien/ "Beitrag 2: Essay" 120   (im Hintergrund laufen lassen)
use strict; use warnings;
my ($pfad, $text, $minuten) = @ARGV;
defined $text or die "Aufruf: perl skripte/warte-auf-text.pl <pfad> <text> [minuten]\n";
$minuten //= 3;
my $takt = $minuten > 3 ? 60 : 10;
my $versuche = int($minuten * 60 / $takt);
warn "Hinweis: Der Suchtext enthält HTML-Zeichen (\" < > =) – auf der verdichteten Live-Seite fehlen Anführungszeichen, eher sichtbaren Text nehmen.\n" if $text =~ /["<>=]/;
my $url = $pfad =~ m{^https?://} ? $pfad : "https://wasdenkenkis.de$pfad";
for my $versuch (1 .. $versuche) {
  my $seite = `curl -s -H "Cache-Control: no-cache" "$url?nc=$versuch$$"`;
  if (index($seite, $text) >= 0) { print "gefunden nach $versuch Versuch(en): $url\n"; exit 0; }
  sleep $takt;
}
print "NICHT gefunden nach $minuten Minuten: $url – Push prüfen, oder der Suchtext passt nicht zur verdichteten Seite.\n"; exit 1;
