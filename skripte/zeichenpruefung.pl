# Zeichenprüfung vor jedem Push (Sven, 2026-10-25): zählt in CLAUDE.md und (seit 2026-10-28) in notizen/*.md zerstörte Umlaute
# (byteweise A-Tilde bzw. a-Zirkumflex + Euro, an denen man falsch kodierte UTF-8-Zeichen erkennt). Muss 0 ausgeben.
#   perl skripte/zeichenpruefung.pl          (als Datei, damit der Aufruf ohne Rückfrage der App läuft)
#   perl skripte/zeichenpruefung.pl <datei>  (nur diese Datei)
use strict; use warnings;
my @dateien = @ARGV ? @ARGV : ('CLAUDE.md', sort glob('notizen/*.md'));
my $n = 0;
for my $datei (@dateien) {
  open my $f, '<:raw', $datei or die "$datei: $!\n";
  while (my $z = <$f>) { if ($z =~ /\xC3\x83|\xC3\xA2\xE2\x82\xAC/) { $n++; print STDERR "$datei:$.\n"; } }
  close $f;
}
print "$n\n";
exit($n ? 1 : 0);
