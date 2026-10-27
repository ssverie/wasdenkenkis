# Zeichenprüfung vor jedem Push (Sven, 2026-10-25): zählt in CLAUDE.md zerstörte Umlaute (byteweise A-Tilde bzw.
# a-Zirkumflex + Euro, an denen man falsch kodierte UTF-8-Zeichen erkennt). Muss 0 ausgeben.
#   perl skripte/zeichenpruefung.pl          (als Datei, damit der Aufruf ohne Rückfrage der App läuft)
use strict; use warnings;
my $datei = shift // 'CLAUDE.md';
open my $f, '<:raw', $datei or die "$datei: $!\n";
my $n = 0;
while (my $z = <$f>) { $n++ if $z =~ /\xC3\x83|\xC3\xA2\xE2\x82\xAC/; }
close $f;
print "$n\n";
exit($n ? 1 : 0);
