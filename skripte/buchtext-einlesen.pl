# Baut einen Essay zu einem Buch aus einer Word-Datei (Claude Docs) ein – seit 2026-10-27 für die Lieferungen der Instanz „Sachbuch“,
# seit 2026-10-29 auch „IT-Books“ (deren Kopf hat zwischen Titel und Datumszeile einen Untertitel -> description).
#   perl skripte/buchtext-einlesen.pl "<Anfang des Dateinamens in input/>" <buchschluessel> <seitenname> "<instanz>" "<kontext>"
# - Umwandlung mit skripte/docx2md.pl (Ebene 0); Kopf: „# Titel“ (wortgleich -> title) und Datumszeile „Oct 27, 2026 · @Sven“ (fällt weg)
# - Wortvergleich Word-Text <-> Markdown, bei Abweichung Abbruch ohne zu schreiben
# - eingebettete Bilder (Markierung aus docx2md.pl) -> Page-Bundle content/buchtexte/<seitenname>/ mit bild-N.<endung>
#   und Shortcode {{< bild >}} an der Stelle der Zeichnung; ohne Bilder content/buchtexte/<seitenname>.md
# - date = Dateizeit der Lieferung; Modell Claude Opus 5.5 (Svens Standard für Claude-Docs-Lieferungen)
# Anmerkungen, die unter dem Text stehen, bleiben beim erneuten Einlesen erhalten.
use strict; use warnings; use utf8;
use IO::Uncompress::Unzip qw(unzip);
use Encode qw(decode encode);
use POSIX qw(strftime);
use File::Path qw(make_path);
binmode STDOUT, ':encoding(UTF-8)'; binmode STDERR, ':encoding(UTF-8)';

my ($anfang, $schluessel, $name, $instanz, $kontext) = map { decode('UTF-8', $_) } @ARGV;
die "Aufruf: perl skripte/buchtext-einlesen.pl \"<Dateianfang>\" <buchschluessel> <seitenname> \"<instanz>\" \"<kontext>\"\n" unless defined $kontext;
die "Buchseite content/buecher/$schluessel/_index.md fehlt\n" unless -e "content/buecher/$schluessel/_index.md";

my ($datei) = grep { decode('UTF-8', $_) =~ /^input\/\Q$anfang\E/ } glob('input/*.docx') or die "„$anfang“: keine passende .docx in input/\n";
my $datum = strftime('%Y-%m-%dT%H:%M:%S%z', localtime((stat $datei)[9])); $datum =~ s/(\d\d)$/:$1/;

sub xml { my $s = shift; $s =~ s/&lt;/</g; $s =~ s/&gt;/>/g; $s =~ s/&quot;/"/g; $s =~ s/&apos;/'/g; $s =~ s/&amp;/&/g; return $s; }
sub woerter { my $s = shift; return [ $s =~ /\S+/g ]; }
sub lies { my $d = shift; open my $f, '<:encoding(UTF-8)', $d or die "$d: $!"; local $/; my $t = <$f>; close $f; return $t; }

open(my $p, '-|', 'perl', 'skripte/docx2md.pl', $datei, '0') or die; my $md = do { local $/; <$p> }; close $p or die "Umwandlung fehlgeschlagen\n";
$md = decode('UTF-8', $md);
$md =~ s/^# ([^\n]+)\n\n(?:([^\n]+)\n\n)?\w{3} \d\d?, \d{4} · \@Sven\n\n//s or die "Kopf unerwartet (Titel, Datumszeile)\n";
my ($titel, $untertitel) = ($1, $2);   # Untertitel (seit 2026-10-29, IT-Books) -> description, ohne Kursiv-Sterne
die "Titel enthält \\ oder \"\n" if $titel =~ /[\\"]/;
if (defined $untertitel) { $untertitel =~ s/(?<!\\)\*//g; die "Untertitel enthält \\ oder \"\n" if $untertitel =~ /[\\"]/; }

# Wortvergleich
my $roh; unzip($datei => \$roh, Name => 'word/document.xml') or die; $roh = decode('UTF-8', $roh);
my @abs;
while ($roh =~ m{<w:p\b[^>]*>(.*?)</w:p>}sg) {
  my $q = $1; my $t = '';
  $t .= defined $1 ? xml($1) : ' ' while $q =~ m{<w:t\b[^>]*>(.*?)</w:t>|<w:(?:tab|br)\b[^>]*/>}sg;
  push @abs, $t if $t =~ /\S/;
}
shift @abs for 1 .. (defined $untertitel ? 3 : 2);
my $ist = $md;
my @code; $ist =~ s/^```\w*\n(.*?)\n```$/push @code, $1; "\x{E000}$#code\x{E000}"/mgse;   # Codeblöcke unverändert vergleichen
$ist =~ s/(?<!\\)`([^`\n]+)`/push @code, $1; "\x{E000}$#code\x{E000}"/ge;               # ebenso Code im Fließtext
$ist =~ s/^<!-- bild: .*? -->$//mg;
$ist =~ s/(?<!\\)\[((?:\\.|[^\]\\])*)\]\([^)\s]*\)/$1/g;   # Links: nur der sichtbare Text zählt
$ist =~ s/^(?:\d+\.|-) //mg; $ist =~ s/^#+ //mg; $ist =~ s/^\|[-|]+\|$//mg;
$ist =~ s/(?<!\\)\|/ /g; $ist =~ s/(?<!\\)\*//g; $ist =~ s/\\(.)/$1/g;
$ist =~ s/\x{E000}(\d+)\x{E000}/$code[$1]/g;
my ($a, $b) = (woerter(join ' ', @abs), woerter($ist));
unless ("@$a" eq "@$b") {
  my $i = 0; $i++ while $i < @$a && $i < @$b && $a->[$i] eq $b->[$i];
  die "Wortvergleich weicht ab bei Wort $i: Word „@{$a}[$i .. $i+5]“ – Markdown „@{$b}[$i .. $i+5]“\n";
}

# Bilder
my @bilder;
$md =~ s{^<!-- bild: (\S+) \| (.*?) -->$}{
  my ($quelle, $alt) = ($1, $2); my ($endung) = $quelle =~ /\.(\w+)$/; my $nr = @bilder + 1;
  push @bilder, [ "word/$quelle", "bild-$nr.$endung" ];
  $alt =~ s/"/'/g;
  qq({{< bild src="bild-$nr.$endung" alt="$alt" >}})
}mge;
my $ziel = @bilder ? "content/buchtexte/$name/index.md" : "content/buchtexte/$name.md";
die "Es gibt schon content/buchtexte/$name.md – mit Bildern wird daraus ein Ordner, bitte von Hand klären\n" if @bilder && -e "content/buchtexte/$name.md";
if (@bilder) {
  make_path("content/buchtexte/$name");
  for my $bl (@bilder) { unzip($datei => "content/buchtexte/$name/$bl->[1]", Name => $bl->[0]) or die "Bild $bl->[0] fehlt\n"; }
}
my $alt = '';
if (-e $ziel) { ($alt) = lies($ziel) =~ /(\n\{\{< anmerkung >\}\}.*)\z/s; $alt //= ''; }

my $fm = <<"FM";
+++
title = "$titel"
${\ (defined $untertitel ? qq(description = "$untertitel"\n) : '')}date = $datum
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "$instanz"
kontext = "$kontext"
buecher = ["$schluessel"]
+++

FM
$md =~ s/\s+\z/\n/;
open my $f, '>:encoding(UTF-8)', $ziel or die; print $f $fm, $md, $alt; close $f;
printf "%s: „%s“ – %d Wörter gleich, %d Bild(er), date %s\n", $ziel, $titel, scalar(@$a), scalar(@bilder), $datum;
