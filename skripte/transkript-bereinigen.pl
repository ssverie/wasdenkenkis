#!/usr/bin/perl
# Bereinigt ein von YouTube kopiertes Transkript („Transkript anzeigen“ → alles markieren → kopieren).
# Versteht zwei Kopierformate:
#   A: „Kapitel 3: Titel“, je Abschnitt drei Zeilen (Zeit, Vorlesefassung „1 Minute, 3 Sekunden“, Text), am Ende Schaltflächentext
#   B: Kapitel als freie Zeile („Intro: Wie der Krieg …“), je Abschnitt zwei Zeilen (Zeit, Text)
# Kapitel = jede Zeile, die nicht Zeit, Vorlesezeile oder Abschnittstext ist.
# Ergebnis: Kopf, Kapitel als eigene Zeilen mit Leerzeile davor, je Abschnitt „[Zeit] Text“. Wortlaut unverändert.
# Aufruf:  perl skripte/transkript-bereinigen.pl <kopie.txt> <ziel.txt> <kopfzeilen-datei>
# Die Kopfzeilen-Datei enthält den Kopf (Video, Kanal, Titel …) und wird unverändert vorangestellt.
use strict; use warnings; use utf8;
binmode STDOUT, ':utf8';
my ($kopie, $ziel, $kopf) = @ARGV;
die "Aufruf: perl skripte/transkript-bereinigen.pl <kopie.txt> <ziel.txt> <kopfzeilen-datei>\n" unless $kopf;

open my $in, '<:utf8', $kopie or die "$kopie: $!";
my @z = grep { /\S/ } map { s/\r?\n\z//r =~ s/\x{FEFF}//gr =~ s/\s+$//r } <$in>; close $in;
my $zeit = qr/^\d+(?::\d\d)+$/;
my $vorlesen = qr/^\d+ (Sekunde|Minute|Stunde)/;
my %schaltflaeche = map { $_ => 1 } ('Mit Video synchronisieren', 'Transkript', 'In diesem Video', 'Kapitel', 'Im Transkript suchen');
my (@aus, $abschnitte, @kapitel);
for (my $i = 0; $i < @z; $i++) {
  my $l = $z[$i];
  if ($l =~ $zeit && $i + 1 < @z) {
    my $t = $i + 1;
    $t++ if $z[$t] =~ $vorlesen && $t + 1 < @z;            # Format A: Vorlesezeile überspringen
    my $text = $z[$t] =~ s/\x{200B}//gr =~ s/\x{A0}/ /gr =~ s/\s+/ /gr =~ s/^ | $//gr;
    push @aus, "[$l] $text"; $abschnitte++; $i = $t; next;
  }
  next if $schaltflaeche{$l};
  push @aus, '', $l; push @kapitel, $l;                    # Kapitelüberschrift
}
shift @aus while @aus && $aus[0] eq '';
open my $k, '<:utf8', $kopf or die "$kopf: $!"; my $kopftext = do { local $/; <$k> }; close $k;
$kopftext =~ s/\s*\z/\n/;
open my $out, '>:utf8', $ziel or die "$ziel: $!";
print $out $kopftext, "\n", join("\n", @aus), "\n";
close $out;
print "Abschnitte: ", $abschnitte // 0, ", Kapitel: ", scalar(@kapitel), "\n";
print "  $_\n" for @kapitel;
