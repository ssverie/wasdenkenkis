# Verteilt die Algorithmen-Seiten auf die Kapitel des Buchs (2026-10-28, Sven: „6 Kacheln bei Algos: 1 Grundlagen,
# 2 Sortieren, 3 Suchen, 4 Graphen, 5 Strings, 6 Im Kontext“). Kapitel = Hunderterstelle von `reihenfolge` (110 → 1, 270 → 2 …).
# Jede Seite wandert per `git mv` nach content/it-konzepte/algorithmen/<kapitel>/ und bekommt die alte Adresse als Alias dazu.
#   perl skripte/algorithmen-kapitel.pl          (einmalig; bricht ab, wenn eine Seite kein Kapitel hat)
use strict; use warnings; use utf8;
binmode STDOUT, ':encoding(UTF-8)';
my %kapitel = (1 => 'grundlagen', 2 => 'sortieren', 3 => 'suchen', 4 => 'graphen', 5 => 'strings', 6 => 'kontext');
my $basis = 'content/it-konzepte/algorithmen';
my $n = 0;
for my $datei (sort glob("$basis/*.md")) {
  next if $datei =~ m{/_index\.md$};
  open my $f, '<:encoding(UTF-8)', $datei or die; local $/; my $t = <$f>; close $f;
  my ($r) = $t =~ /^reihenfolge = (\d+)/m or die "$datei: keine reihenfolge\n";
  my $k = $kapitel{ int($r / 100) } or die "$datei: Kapitel zu reihenfolge $r unbekannt\n";
  (my $name = $datei) =~ s{^.*/|\.md$}{}g;
  my $alt = "/it-konzepte/algorithmen/$name/";
  if ($t =~ /^aliases = \[(.*)\]$/m) { my $liste = $1; $t =~ s/^aliases = \[.*\]$/aliases = [$liste, "$alt"]/m; }
  else { $t =~ s/\A\+\+\+\n/+++\naliases = ["$alt"]\n/ or die "$datei: Front-Matter unerwartet\n"; }
  mkdir "$basis/$k";
  system('git', 'mv', $datei, "$basis/$k/$name.md") == 0 or die "git mv $datei\n";
  open my $o, '>:encoding(UTF-8)', "$basis/$k/$name.md" or die; print $o $t; close $o;
  printf "%-24s %3d -> %s\n", $name, $r, $k; $n++;
}
print "$n Seiten verteilt\n";
