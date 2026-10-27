# Nach einem Push: wartet, bis die erste Adresse live antwortet (höchstens 10 Minuten), und meldet dann den Status aller Adressen.
#   perl skripte/live-pruefen.pl /buecher/antifragilitaet-2012/ /sachbuch/ …
# Pfade relativ zu https://wasdenkenkis.de; jede Abfrage mit ?t=<Zeit>, damit kein alter Stand aus einem Zwischenspeicher kommt.
# Als Skript statt Schleife im Befehl, damit der Aufruf ohne Rückfrage der App läuft (CLAUDE.md, 2026-10-27).
use strict; use warnings;
# Vollständige Adressen (http…) werden ohne Warten einmal abgefragt – z. B. Quellen-Links in Texten der Instanzen:
#   perl skripte/live-pruefen.pl https://www.worldbank.org/… https://news.un.org/…
my @pfade = @ARGV or die "Aufruf: perl skripte/live-pruefen.pl <pfad> [<pfad> …]\n";
my $basis = 'https://wasdenkenkis.de';
sub status {
  my $p = shift;
  my $url = $p =~ m{^https?://} ? $p : "$basis$p?t=" . time;
  return `curl -s -L -o /dev/null -A "Mozilla/5.0" -w "%{http_code}" "$url"`;
}
unless ($pfade[0] =~ m{^https?://}) {
  my $versuch = 0;
  until (status($pfade[0]) eq '200') {
    die "$pfade[0] nach 10 Minuten noch nicht live\n" if ++$versuch >= 40;
    sleep 15;
  }
  print "live nach ", $versuch + 1, " Versuch(en)\n";
}
printf "%s %s\n", status($_), $_ for @pfade;
