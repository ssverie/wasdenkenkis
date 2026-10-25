#!/usr/bin/perl
# Bereinigt ein von YouTube kopiertes Transkript („Transkript anzeigen“ → alles markieren → kopieren).
# Kopie:   Kapitelzeilen, je Abschnitt drei Zeilen (Zeit, Vorlesefassung der Zeit, Text), am Ende „Mit Video synchronisieren“.
# Ergebnis: Kopf, Kapitel als eigene Zeilen mit Leerzeile davor, je Abschnitt „[Zeit] Text“.
# Aufruf:  perl skripte/transkript-bereinigen.pl <kopie.txt> <ziel.txt> <kopfzeilen-datei>
# Die Kopfzeilen-Datei enthält den Kopf (Video, Kanal, Titel …) und wird unverändert vorangestellt.
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8';
my ($kopie, $ziel, $kopf) = @ARGV;
die "Aufruf: perl skripte/transkript-bereinigen.pl <kopie.txt> <ziel.txt> <kopfzeilen-datei>\n" unless $kopf;

open my $in, '<:utf8', $kopie or die "$kopie: $!";
my @z = map { s/\r?\n\z//r =~ s/\x{FEFF}//gr } <$in>; close $in;
my (@aus, $abschnitte, $kapitel, @unbekannt);
for (my $i = 0; $i < @z; $i++) {
  my $l = $z[$i];
  next unless $l =~ /\S/;
  if ($l =~ /^Kapitel \d+:/) { push @aus, '', $l; $kapitel++; next }
  if ($l =~ /^\d+(?::\d\d)+$/ && $i + 2 < @z && $z[$i + 1] =~ /^\d+ (Sekunde|Minute|Stunde)/) {
    my $t = $z[$i + 2] =~ s/\x{200B}//gr =~ s/\x{A0}/ /gr =~ s/\s+/ /gr =~ s/^ | $//gr;
    push @aus, "[$l] $t"; $abschnitte++; $i += 2; next;
  }
  next if $l =~ /^(Mit Video synchronisieren|Transkript|In diesem Video|Kapitel|Im Transkript suchen)$/;   # Schaltflächen
  push @unbekannt, $l;
}
shift @aus while @aus && $aus[0] eq '';
open my $k, '<:utf8', $kopf or die "$kopf: $!"; my $kopftext = do { local $/; <$k> }; close $k;
$kopftext =~ s/\s*\z/\n/;
open my $out, '>:utf8', $ziel or die "$ziel: $!";
print $out $kopftext, "\n", join("\n", @aus), "\n";
close $out;
print "Abschnitte: ", $abschnitte // 0, ", Kapitel: ", $kapitel // 0, "\n";
print "Nicht zugeordnet (bitte ansehen): $_\n" for @unbekannt;
