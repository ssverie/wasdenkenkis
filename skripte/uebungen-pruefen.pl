# IT-Übungen prüfen: Jede Aufgabe einer gelieferten JSON-Datei wird mit dem vorhandenen JDK ausgeführt
# (java Main.java, ohne Build-Tool, nichts installieren). Zwei Formate:
#   „Was gibt der Code aus?“ (Feld answer): Programm ausführen, Ausgabe mit answer vergleichen,
#       dazu correctIndex zeigt auf answer.
#   „Fehler finden“ (Felder demo, fixedCode, bugLines): fehlerhafte und korrigierte Methode je in eine Klasse Main
#       setzen, demo.call ausführen und mit demo.buggyResult bzw. demo.fixedResult vergleichen (Exception = ihr
#       einfacher Name; void-Methoden: Ergebnis ist das veränderte Argument); bugLines mit den Zeilen vergleichen,
#       in denen sich code und fixedCode unterscheiden.
# Immer: die vier Antworten sind verschieden, correctIndex liegt im Bereich.
#
#   perl skripte/uebungen-pruefen.pl input/<datei>.json <testordner>
#
# Bei Abweichung wird ein zweites Mal mit englischer Spracheinstellung gerechnet (printf/String.format nehmen das
# Zahlenformat der Systemsprache). Testordner danach löschen.
use strict; use warnings; use utf8;
use JSON::PP;
use File::Path qw(make_path);
binmode STDOUT, ':encoding(UTF-8)';

my ($datei, $test) = @ARGV;
die "Aufruf: perl skripte/uebungen-pruefen.pl input/<datei>.json <testordner>\n" unless $datei && $test;
open my $fh, '<:raw', $datei or die "$datei: $!"; my $j = JSON::PP->new->utf8->decode(do { local $/; <$fh> }); close $fh;
mkdir $test unless -d $test;

sub starte {
  my ($ordner, $klasse, $quelle) = @_;
  make_path($ordner);
  open my $o, '>:encoding(UTF-8)', "$ordner/$klasse.java" or die $!; print $o $quelle, "\n"; close $o;
  my @laeufe;
  for my $extra ('', '-Duser.language=en -Duser.country=US') {
    my $aus = `cd "$ordner" && java -Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 $extra $klasse.java 2>&1`;
    utf8::decode($aus); $aus =~ s/\r//g; $aus =~ s/\s+\z//; push @laeufe, $aus;
  }
  return @laeufe;      # (Systemsprache, Englisch)
}
sub vergleiche {
  my ($was, $soll, $de, $en, $probleme, $hinweise) = @_;
  $soll =~ s/\s+\z//;
  return if $de eq $soll;
  if ($en eq $soll) { push @$hinweise, "$was nur mit englischer Spracheinstellung"; return; }
  push @$probleme, "$was weicht ab:\n--- erwartet:\n$soll\n--- java:\n$de";
}

# Klasse Main mit der Methode (bzw. Hilfsklasse) aus der Aufgabe und einem main, das demo.call ausführt
sub demo_programm {
  my ($code, $call) = @_;
  my ($name) = $call =~ /^(\w+)\(/;
  my $void = defined $name && $code =~ /static\s+void\s+\Q$name\E\s*\(/;
  my $rumpf;
  if ($void) {
    (my $arg = $call) =~ s/^\w+\((.*)\)$/$1/s;
    $rumpf = "var arg = $arg;\n            $name(arg);\n            System.out.println(String.valueOf(arg));";
  } else {
    $rumpf = "Object ergebnis = $call;\n            System.out.println(String.valueOf(ergebnis));";
  }
  (my $eingerueckt = $code) =~ s/^/    /mg;
  return join "\n",
    'import java.util.*;', 'import java.math.*;', 'import java.time.*;', 'import java.time.format.*;', 'import java.util.stream.*;', '',
    'public class Main {', $eingerueckt, '',
    '    public static void main(String[] args) {',
    '        try {',
    "            $rumpf",
    '        } catch (Throwable e) {',
    '            System.out.println(e.getClass().getSimpleName());',
    '        }',
    '    }',
    '}';
}

my ($gut, $schlecht) = (0, 0);
for my $t (@{ $j->{tasks} }) {
  my (@probleme, @hinweise);
  my $n = scalar @{ $t->{options} };
  push @probleme, "correctIndex außerhalb der Antworten" unless defined $t->{correctIndex} && $t->{correctIndex} >= 0 && $t->{correctIndex} < $n;
  my %doppelt; $doppelt{$_}++ for @{ $t->{options} };
  push @probleme, "doppelte Antwort" if grep { $_ > 1 } values %doppelt;
  my $ordner = "$test/$t->{id}";
  if (defined $t->{answer} && !defined $t->{code}) {
    # Textaufgabe ohne Code (z. B. Testdesign: scenario + answer) – hier lässt sich nur die Stimmigkeit prüfen
    push @probleme, "correctIndex zeigt nicht auf answer" if ($t->{options}[$t->{correctIndex}] // '') ne $t->{answer};
    push @hinweise, 'ohne Code – nicht ausführbar, Lösung von Hand nachrechnen';
  } elsif (defined $t->{answer}) {
    push @probleme, "correctIndex zeigt nicht auf answer" if ($t->{options}[$t->{correctIndex}] // '') ne $t->{answer};
    my ($klasse) = $t->{code} =~ /public\s+(?:final\s+)?class\s+(\w+)/;
    my ($de, $en) = starte($ordner, $klasse // 'Main', $t->{code});
    vergleiche('Ausgabe', $t->{answer}, $de, $en, \@probleme, \@hinweise);
  } elsif ($t->{demo}) {
    my ($kde, $ken) = starte("$ordner/fehlerhaft", 'Main', demo_programm($t->{code}, $t->{demo}{call}));
    vergleiche('fehlerhafte Fassung', $t->{demo}{buggyResult}, $kde, $ken, \@probleme, \@hinweise);
    my ($rde, $ren) = starte("$ordner/korrigiert", 'Main', demo_programm($t->{fixedCode}, $t->{demo}{call}));
    vergleiche('korrigierte Fassung', $t->{demo}{fixedResult}, $rde, $ren, \@probleme, \@hinweise);
    # bugLines = Zeilen (ab 1), in denen sich fehlerhafte und korrigierte Fassung unterscheiden
    my @a = split /\n/, $t->{code}, -1; my @b = split /\n/, $t->{fixedCode}, -1;
    if (@a == @b) {
      my @diff = grep { $a[$_ - 1] ne $b[$_ - 1] } 1 .. @a;
      my $angegeben = join ',', @{ $t->{bugLines} || [] };
      push @hinweise, "bugLines $angegeben, geändert sind Zeilen " . join(',', @diff) if join(',', @diff) ne $angegeben;
    } else {
      push @hinweise, 'korrigierte Fassung hat ' . (@b - @a > 0 ? '+' : '') . (@b - @a) . ' Zeilen, bugLines ' . join(',', @{ $t->{bugLines} || [] });
    }
  } else {
    push @probleme, 'weder answer noch demo – Format unbekannt';
  }
  if (@probleme) { $schlecht++; print "$t->{id} $t->{title}: ", join("\n  ", @probleme), "\n"; }
  else { $gut++; print "$t->{id} ok", (@hinweise ? ' (' . join('; ', @hinweise) . ')' : ''), "\n"; }
}
print "\n$gut von ", $gut + $schlecht, " Aufgaben stimmen.\n";
