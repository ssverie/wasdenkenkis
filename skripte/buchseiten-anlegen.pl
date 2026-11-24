use strict; use warnings; use utf8;
# Legt Buchseiten content/buecher/<schluessel>/_index.md an (seit 2026-11-24; vorher dreimal als Wegwerf-Skript).
#   perl skripte/buchseiten-anlegen.pl <daten.txt> [<liste>] [<abgerufen JJJJ-MM-TT>]
# <liste> = belletristik (Vorgabe) | sachbuch | it-buch/klassik | it-buch/ki
# daten.txt: je Buch ein Block „feld = wert“ (schluessel, titel, autor, jahr, erschienen, gattung, wikipedia, description),
# Blöcke durch Leerzeilen getrennt. Werte ohne " (dafür „…“). Bricht ab, wenn es die Seite schon gibt.
use POSIX qw(strftime);
binmode STDOUT, ':encoding(UTF-8)';
my ($datei, $liste, $abgerufen) = @ARGV;
die "Aufruf: perl skripte/buchseiten-anlegen.pl <daten.txt> [<liste>] [<abgerufen>]\n" unless $datei;
$liste //= 'belletristik';
$abgerufen //= strftime('%Y-%m-%d', localtime);
open my $f, '<:encoding(UTF-8)', $datei or die "$datei: $!"; local $/ = ''; my @bloecke = <$f>; close $f;
for my $b (@bloecke) {
  my %d; for (split /\n/, $b) { next unless /\S/; /^(\w+) = (.*)$/ or die "Zeile: $_\n"; $d{$1} = $2; }
  for (qw(schluessel titel autor jahr erschienen gattung wikipedia description)) { die "$_ fehlt\n" unless defined $d{$_}; }
  for (qw(titel autor erschienen gattung wikipedia description)) { die "$_ enthält \"\n" if $d{$_} =~ /"/; }
  my $pfad = "content/buecher/$d{schluessel}";
  die "$pfad gibt es schon\n" if -e "$pfad/_index.md";
  mkdir $pfad or die "$pfad: $!";
  open my $o, '>:encoding(UTF-8)', "$pfad/_index.md" or die $!;
  print $o "+++\ntitle = \"$d{titel} ($d{jahr})\"\nlinkTitle = \"$d{titel}\"\ndescription = \"$d{description}\"\nautor = \"$d{autor}\"\njahr = $d{jahr}\nerschienen = \"$d{erschienen}\"\ngattung = \"$d{gattung}\"\nliste = \"$liste\"\nwikipedia = \"$d{wikipedia}\"\nabgerufen = $abgerufen\n+++\n";
  close $o; print "angelegt: $pfad\n";
}
