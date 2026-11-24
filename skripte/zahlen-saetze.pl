use strict; use warnings; use utf8;
binmode STDOUT, ':encoding(UTF-8)';
# Zieht für die Faktenprüfung aus Texten alle Sätze mit Zahlen oder Zahlwörtern heraus (ohne Front-Matter und ohne Quellenliste).
#   perl skripte/zahlen-saetze.pl content/buchtexte/<name>.md [weitere …]
# Seit 2026-11-24 (Sven: keine Agenten mehr, die Befehle ausführen) – danach die Funde gezielt gegen Wikipedia prüfen.
die "Aufruf: perl skripte/zahlen-saetze.pl <datei.md> …\n" unless @ARGV;
for my $datei (@ARGV) {
  open my $h, '<:encoding(UTF-8)', $datei or die "$datei: $!"; local $/; my $t = <$h>; close $h;
  $t =~ s/^\+\+\+.*?\+\+\+//s; $t =~ s/## Quellen.*//s;
  print "===== $datei\n";
  for my $s (split /(?<=[.!?“])\s+/, $t) {
    next unless $s =~ /\d|zwanzig|dreißig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig|hundert|tausend|Million/;
    $s =~ s/\s+/ /g; print "- ", substr($s, 0, 260), "\n";
  }
}
