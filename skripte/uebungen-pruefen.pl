# IT-Übungen prüfen: Jede Aufgabe „Was gibt der Code aus?“ aus einer gelieferten JSON-Datei wird mit dem vorhandenen
# JDK ausgeführt (java Main.java, ohne Build-Tool, nichts installieren) und die Ausgabe mit "answer" verglichen.
# Außerdem: correctIndex zeigt auf answer, die vier Antworten sind verschieden.
#
#   perl skripte/uebungen-pruefen.pl input/<datei>.json <testordner>
#
# Bei Abweichung zeigt das Skript die echte Ausgabe; bei englischer Spracheinstellung wird ein zweites Mal gerechnet
# (wie bei den Design Patterns: printf/String.format nehmen das Zahlenformat der Systemsprache). Testordner danach löschen.
use strict; use warnings;
use JSON::PP;
binmode STDOUT, ':encoding(UTF-8)';

my ($datei, $test) = @ARGV;
die "Aufruf: perl skripte/uebungen-pruefen.pl input/<datei>.json <testordner>\n" unless $datei && $test;
open my $fh, '<:raw', $datei or die "$datei: $!"; my $j = JSON::PP->new->utf8->decode(do { local $/; <$fh> }); close $fh;
mkdir $test unless -d $test;

my ($gut, $schlecht) = (0, 0);
for my $t (@{ $j->{tasks} }) {
  my @probleme;
  push @probleme, "correctIndex zeigt nicht auf answer" if ($t->{options}[$t->{correctIndex}] // '') ne $t->{answer};
  my %doppelt; $doppelt{$_}++ for @{ $t->{options} };
  push @probleme, "doppelte Antwort" if grep { $_ > 1 } values %doppelt;
  my ($klasse) = $t->{code} =~ /public\s+(?:final\s+)?class\s+(\w+)/;
  $klasse //= 'Main';
  my $ordner = "$test/$t->{id}"; mkdir $ordner unless -d $ordner;
  open my $o, '>:encoding(UTF-8)', "$ordner/$klasse.java" or die $!; print $o $t->{code}, "\n"; close $o;
  my $lauf = sub {
    my $extra = shift // '';
    my $aus = `cd "$ordner" && java -Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 $extra $klasse.java 2>&1`;
    utf8::decode($aus); $aus =~ s/\r//g; $aus =~ s/\s+\z//; return $aus;
  };
  my $ist = $lauf->();
  (my $soll = $t->{answer}) =~ s/\s+\z//;
  my $hinweis = '';
  if ($ist ne $soll) {
    my $en = $lauf->('-Duser.language=en -Duser.country=US');
    if ($en eq $soll) { $hinweis = ' (nur mit englischer Spracheinstellung)'; }
    else { push @probleme, "Ausgabe weicht ab:\n--- answer:\n$soll\n--- java:\n$ist"; }
  }
  if (@probleme) { $schlecht++; print "$t->{id} $t->{title}: ", join("\n  ", @probleme), "\n"; }
  else { $gut++; print "$t->{id} ok$hinweis\n"; }
}
print "\n$gut von ", $gut + $schlecht, " Aufgaben stimmen.\n";
