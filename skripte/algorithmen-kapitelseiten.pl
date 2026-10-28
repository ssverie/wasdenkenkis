# Legt die sechs Kapitelseiten der Algorithmen an (2026-10-28, Sven). Einmalig; vorhandene Dateien werden nicht überschrieben.
use strict; use warnings; use utf8;
my @k = (
  ['grundlagen', 'Grundlagen', 'Kapitel 1 des Buchs: binäre Suche, Stapel, Warteschlange, Bag und Union-Find.'],
  ['sortieren', 'Sortieren', 'Kapitel 2 des Buchs: Selectionsort, Insertionsort, Shellsort, Mergesort, Quicksort, Heap und Heapsort.'],
  ['suchen', 'Suchen', 'Kapitel 3 des Buchs: Symboltabellen – sequenzielle und binäre Suche, Suchbäume, Rot-Schwarz-Bäume und Hashing.'],
  ['graphen', 'Graphen', 'Kapitel 4 des Buchs: Tiefensuche, Breitensuche und Zusammenhangskomponenten.'],
  ['strings', 'Strings', 'Kapitel 5 des Buchs.'],
  ['kontext', 'Im Kontext', 'Kapitel 6 des Buchs.'],
);
my $w = 0;
for (@k) {
  my ($ordner, $titel, $beschr) = @$_; $w++;
  my $d = "content/it-konzepte/algorithmen/$ordner/_index.md";
  if (-e $d) { print "vorhanden: $d\n"; next; }
  mkdir "content/it-konzepte/algorithmen/$ordner";
  open my $o, '>:encoding(UTF-8)', $d or die;
  print $o "+++\ntitle = \"$titel\"\ndescription = \"$beschr\"\nweight = $w\noben = \"/it-konzepte/algorithmen\"\nsortieren_nach = \"reihenfolge\"   # wie bisher nach Algorithmus-Nummer absteigend (Sven, 2026-10-26)\neinheit = [\"Algorithmus\", \"Algorithmen\"]\n+++\n";
  close $o; print "angelegt: $d\n";
}
