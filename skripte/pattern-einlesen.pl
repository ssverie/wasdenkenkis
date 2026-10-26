# Design Patterns einlesen (Reihe der Instanz „26.10.2026 - 13:39 - GoF-Designmuster in Java“, Claude Opus 5.5)
#
#   perl skripte/pattern-einlesen.pl input/<Muster>.html <testordner>
#
# Liest die gelieferte HTML-Seite (h1, p.kategorie, h2, p, ul/li, pre/code), schreibt sie als Markdown nach
# content/it-konzepte/design-patterns/<schluessel>.md (Schlüssel und Kurzbeschreibung aus data/designpatterns.toml,
# Abgleich über den Namen in <h1>) und prüft zweierlei, bevor irgendetwas geschrieben wird:
#   1. Wortvergleich: Die Wörter der Seite (ohne Tags) und die des Markdowns (ohne Markdown-Zeichen) sind gleich.
#   2. Java: Der Quellcode wird im Testordner mit dem vorhandenen JDK gestartet (java <Datei>.java, ohne Build-Tool,
#      nichts wird installiert) und seine Ausgabe mit dem Abschnitt „Ausgabe“ der Seite verglichen.
# Den Testordner (im Projekt, z. B. test-dp) danach löschen.
use strict; use warnings; use utf8;
use POSIX qw(strftime);
use JSON::PP;
binmode STDOUT, ':encoding(UTF-8)';

my ($seite, $test) = @ARGV;
die "Aufruf: perl skripte/pattern-einlesen.pl input/<Muster>.html <testordner>\n" unless $seite && $test;

open my $fh, '<:encoding(UTF-8)', $seite or die "$seite: $!"; my $h = do { local $/; <$fh> }; close $fh;
my ($artikel) = $h =~ m{<article[^>]*>(.*?)</article>}s or die "kein <article>\n";

sub ent { my $s = shift; $s =~ s/&lt;/</g; $s =~ s/&gt;/>/g; $s =~ s/&quot;/"/g; $s =~ s/&#39;/'/g; $s =~ s/&amp;/&/g; return $s; }
# Inline-Auszeichnung: strong → **, em → *, code → `
sub inline {
  my $s = shift;
  $s =~ s{<strong>(.*?)</strong>}{**$1**}gs;
  $s =~ s{<em>(.*?)</em>}{*$1*}gs;
  $s =~ s{<code>(.*?)</code>}{`$1`}gs;
  die "unbekanntes Tag in: $s\n" if $s =~ /<[a-z]/i;
  $s =~ s/\s+/ /g; $s =~ s/^ | $//g;
  return ent($s);
}

my ($titel) = $artikel =~ m{<h1>(.*?)</h1>}s or die "kein <h1>\n"; $titel = ent($titel);
my $md = '';
my $rest = $artikel;
$rest =~ s{<h1>.*?</h1>}{}s;
my ($klasse, $java, $ausgabe);
while ($rest =~ m{\G\s*(<p class="kategorie">(.*?)</p>|<h2>(.*?)</h2>|<p>(.*?)</p>|<ul>(.*?)</ul>|<pre><code(?: class="language-java")?>(.*?)</code></pre>)}gsc) {
  if    (defined $2) { $md .= "*" . inline($2) . "*\n\n"; }
  elsif (defined $3) { $md .= "## " . inline($3) . "\n\n"; }
  elsif (defined $4) { $md .= inline($4) . "\n\n"; }
  elsif (defined $5) { my $ul = $5; $md .= "- " . inline($1) . "\n" while $ul =~ m{<li>(.*?)</li>}gs; $md .= "\n"; }
  elsif (defined $6) {
    my $code = ent($6);
    if ($1 =~ /language-java/) { $java = $code; } else { $ausgabe = $code; }
    $md .= "```\n$code\n```\n\n";
  }
}
my $uebrig = substr($rest, pos($rest) // 0); $uebrig =~ s/\s+//g;
die "nicht erkannter Rest der Seite: " . substr($uebrig, 0, 200) . "\n" if $uebrig ne '';
die "kein Java-Code\n" unless defined $java;
die "keine Ausgabe\n" unless defined $ausgabe;

# Eintrag in data/designpatterns.toml über den Namen finden
open my $t, '<:encoding(UTF-8)', 'data/designpatterns.toml' or die $!; my $toml = do { local $/; <$t> }; close $t;
my ($schluessel, $text, $nummer, $gruppe, $sogehts);
for my $block (split /\[\[muster\]\]/, $toml) {
  my %f = $block =~ /^(\w+) = "?(.*?)"?$/mg;
  if (($f{name} // '') eq $titel) { ($schluessel, $text, $nummer, $gruppe, $sogehts) = @f{qw(schluessel text nummer gruppe sogehts)}; last; }
}
die "„$titel“ steht nicht in data/designpatterns.toml\n" unless $schluessel;

# 1. Wortvergleich
# HTML: Inline-Tags ersatzlos (Satzzeichen kleben am Wort wie im Markdown), Block-Tags als Leerraum
sub woerter_html { my $s = shift; $s =~ s{</?(?:strong|em)>}{}g; $s =~ s{(?<!<pre>)</?code[^>]*>}{}g; $s =~ s/<[^>]+>/ /g; $s = ent($s); return grep { length } split /\s+/, $s; }
# Markdown: Auszeichnung nur außerhalb der Codeblöcke entfernen – Sternchen im Java-Code (z. B. /* */) bleiben
sub woerter_md {
  my @teile = split /^```\n/m, shift; my @w;
  for my $i (0 .. $#teile) {
    my $s = $teile[$i];
    unless ($i % 2) { $s =~ s/^## |^- //mg; $s =~ s/\*\*|`//g; $s =~ s/(?<![\w*])\*(?=\S)|(?<=\S)\*(?![\w*])//g; }
    push @w, grep { length } split /\s+/, $s;
  }
  return @w;
}
my @a = woerter_html($artikel); my @b = (woerter_html("<h1>$titel</h1>"), woerter_md($md));
for my $i (0 .. ($#a > $#b ? $#a : $#b)) {
  next if defined $a[$i] && defined $b[$i] && $a[$i] eq $b[$i];
  die "Wortvergleich: Abweichung bei Wort $i: „" . ($a[$i] // '–') . "“ / „" . ($b[$i] // '–') . "“\n";
}
print "Wortvergleich: ", scalar(@a), " Wörter identisch\n";

# 2. Java ausführen
my ($name) = $java =~ /public\s+(?:final\s+)?class\s+(\w+)/ or die "keine public class\n";
mkdir $test unless -d $test;
open my $o, '>:encoding(UTF-8)', "$test/$name.java" or die $!; print $o $java, "\n"; close $o;
my $ist = `cd "$test" && java -Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8 $name.java 2>&1`;
die "java $name.java endete mit Fehler:\n$ist" if $?;
utf8::decode($ist); $ist =~ s/\r//g; $ist =~ s/\s+\z//;
(my $soll = $ausgabe) =~ s/\r//g; $soll =~ s/\s+\z//;
if ($ist ne $soll) { die "Ausgabe weicht ab.\n--- Seite:\n$soll\n--- java:\n$ist\n"; }
my ($version) = `java -version 2>&1` =~ /version "([^"]+)"/;
print "Java $version: Ausgabe von $name.java identisch mit der Seite\n";

# Seite schreiben
my $datum = strftime('%Y-%m-%dT%H:%M:00%z', localtime((stat $seite)[9])); $datum =~ s/(\d\d)(\d\d)$/$1:$2/;
my $fm = "+++\n"
  . "title = \"$titel\"\n"
  . "description = \"" . ucfirst($text) . "\"\n"
  . "date = $datum\n"
  . "nummer = $nummer\n"
  . "gruppe = \"$gruppe\"\n"
  . "modelle = [\"Claude\"]\n"
  . "modell = \"Claude Opus 5.5\"\n"
  . "modell_id = \"claude-opus-5-5\"\n"
  . "herkunft = \"eingebracht\"\n"
  . "instanz = \"26.10.2026 - 13:39 - GoF-Designmuster in Java\"\n"
  . "kontext = \"Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster $nummer von 23 · Kurzbeschreibung aus der Liste der Instanz"
  . (-e "static/apps/muster/$schluessel.html" ? " · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)" : "") . "\"\n"
  . "+++\n\n";
# Code der Instanz für die Ablauf-Visualisierung (static/apps/muster/<schluessel>.html liest ihn aus <schluessel>-code.js),
# damit Seite und Visualisierung nachweislich denselben Code zeigen
mkdir 'static/apps/muster' unless -d 'static/apps/muster';
open my $cj, '>:encoding(UTF-8)', "static/apps/muster/$schluessel-code.js" or die $!;
print $cj "// Java-Code der Instanz zu „$titel“, unverändert aus der Lieferung – geschrieben von skripte/pattern-einlesen.pl, nicht von Hand ändern\n",
  "window.MUSTER_CODE = ", JSON::PP->new->encode([split /\n/, $java, -1]), ";\n";
close $cj;
# Gibt es schon eine Ablauf-Visualisierung, steht sie oben auf der Seite (wie bei den Algorithmen)
if (-e "static/apps/muster/$schluessel.html") {
  $fm .= "{{< spiel src=\"/apps/muster/$schluessel.html\" titel=\"$titel – Ablauf\" link=\"Im Vollbild öffnen\" >}}\n\n";
  $fm .= "**So geht's:** $sogehts\n\n" if $sogehts;
}
my $anm = "{{< anmerkung >}}\nDen Quellcode habe ich unverändert mit Java $version ausgeführt (`java $name.java`, ohne Build-Tool). "
  . "Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.\n{{< /anmerkung >}}\n";
my $ziel = "content/it-konzepte/design-patterns/$schluessel.md";
open $o, '>:encoding(UTF-8)', $ziel or die $!; print $o $fm, $md, $anm; close $o;
print "geschrieben: $ziel\n";
