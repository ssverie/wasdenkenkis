# Baut Menschheit-Essays von GPT-6 (Instanz „25.10.2026 - 11:07 - Fragen2“) ein – seit Frage 26 im Format
#   „Menschheit – Frage N von 50“ (auch in Versalien), Frage (evtl. in Versalien), Folgefrage(n), Autorzeile „Ein Essay aus der Perspektive von GPT-6 · Datum“.
#   perl skripte/menschheit-einlesen.pl <tabelle.txt> <datei.txt> <seitenname> [<datei.txt> <seitenname> …]
# tabelle.txt: je Zeile „VERSALIEN<TAB>Normal“ für Überschriften und Fragen in Versalien (Fragen ohne Tabelleneintrag bleiben, wie sie sind).
# Titel = Frage, description = Folgefrage(n), frage = beides; Autorzeile fällt weg; „N. VERSALIEN“ -> „## N. Normal“.
# Wortvergleich gegen die Lieferung ohne Groß-/Kleinschreibung und mit ß = ss; Abbruch ohne zu schreiben bei Abweichung.
use strict; use warnings; use utf8;
use POSIX qw(strftime);
use Encode qw(decode);
binmode STDOUT, ':encoding(UTF-8)';
@ARGV >= 3 && @ARGV % 2 == 1 or die "Aufruf: perl skripte/menschheit-einlesen.pl <tabelle.txt> <datei.txt> <seitenname> […]\n";
my $tabelle = shift;
sub lies { my $d = shift; open my $f, '<:encoding(UTF-8)', $d or die "$d: $!"; local $/; my $t = <$f>; close $f; $t =~ s/\r\n/\n/g; return $t; }
my %normal;
for (split /\n/, lies($tabelle)) { next unless /\S/; my ($v, $n) = split /\t/; die "Tabellenzeile ohne Tab: $_\n" unless defined $n; $normal{$v} = $n; }
sub vgl { my $t = lc shift; $t =~ s/ß/ss/g; return join ' ', $t =~ /\S+/g; }
while (my ($datei, $name) = splice @ARGV, 0, 2) {
  my $roh = lies($datei);
  $roh =~ /\A(Menschheit – Frage (\d+) von 50)\n\n(.+?)\n\n(Ein Essay aus der Perspektive von GPT-6 · [^\n]+)\n\n/si or die "$datei: Kopf unerwartet\n";
  my ($kopf, $nr, $block, $autor) = ($1, $2, $3, $4);
  my $rest = substr($roh, $+[0]);
  my @zeilen = grep { /\S/ } split /\n/, $block;
  my $frage = shift @zeilen;
  my $titel = $normal{$frage} // $frage;
  die "$datei: Frage in Versalien ohne Tabelleneintrag: $frage\n" if $titel !~ /\p{Ll}/;
  my $beschreibung = join ' ', @zeilen;
  my $n = 0;
  $rest =~ s/^(\d+)\. ([^\n\p{Ll}]{4,})$/exists $normal{$2} ? do { $n++; "## $1. $normal{$2}" } : die "$datei: Überschrift ohne Tabelle: $2\n"/mge;
  (my $ohne = $rest) =~ s/^## //mg;
  # Vergleich: Lieferung (Original) gegen Kopf + Rest der neuen Seite, beides ohne Groß-/Kleinschreibung
  my $orig = vgl($roh);
  my $neu = vgl(join ' ', $kopf, $titel, @zeilen, $autor, $ohne);
  my $gleich = $orig eq $neu;
  my $datum = strftime('%Y-%m-%dT%H:%M:%S%z', localtime((stat $datei)[9])); $datum =~ s/(\d\d)$/:$1/;
  my $woerter = () = $roh =~ /\S+/g;
  printf "%s: Frage %d, %d Überschriften, %d Wörter %s, date %s\n", $name, $nr, $n, $woerter, $gleich ? 'gleich' : 'VERSCHIEDEN', $datum;
  die "Wortvergleich fehlgeschlagen\n" unless $gleich;
  open my $f, '>:encoding(UTF-8)', "content/fragen/$name.md" or die;
  print $f "+++\ntitle = \"$titel\"\n" . ($beschreibung ? "description = \"$beschreibung\"\n" : '')
    . "date = $datum\nmodelle = [\"GPT\"]\nmodell = \"GPT-6\"\nherkunft = \"eingebracht\"\ninstanz = \"25.10.2026 - 11:07 - Fragen2\"\nfrage = \""
    . ($beschreibung ? "$titel $beschreibung" : $titel) . "\"\n+++\n\n$rest";
  close $f;
  print "  text = \"" . ($beschreibung ? "$titel $beschreibung" : $titel) . "\"\n";
}
