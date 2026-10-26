# Erzeugt aus input/<reihe>/<eintrag>/index.html je ein Hugo-Bundle unter content/<reihe>/<eintrag>/
# (index.md, inhalt-html.txt, stil.css, skript.js). Die Übersicht wird zur Rubrikseite content/<reihe>/:
# bei erklaert der Ordner lesereihenfolge/, sonst eine index.html direkt in input/<reihe>/.
# Aufruf aus dem Projektordner: perl skripte/begriffe-erzeugen.pl [erklaert|philosophie|it] (Standard: erklaert),
# danach je stil-roh.css mit skripte/css-begrenzen.pl zu stil.css machen
use strict; use warnings; use utf8;
use open qw(:std :encoding(UTF-8));

my $reihe  = shift // 'erklaert';
my $quelle = "input/$reihe";
# Die IT-Reihe der Instanz heißt „IT-Begriffe“ und verlinkt unter /it/ – auf der Seite ist das die Rubrik IT-Konzepte (/it-konzepte/)
my %zielordner = (it => 'it-konzepte');
my %titel_uebersicht = (erklaert => 'KI-Begriffe', it => 'Grundlagen');   # IT: Kachel „Grundlagen“ unter IT-Konzepte (seit 2026-10-26)
my $ziel   = "content/" . ($zielordner{$reihe} // $reihe);
# Frühere Platzhalter-Unterbereiche von IT-Konzepte leiten auf den passenden Eintrag um (Adressen stabil halten)
my %aliase = (
  'betriebssystem'          => ['/it-konzepte/betriebssysteme/'],
  'relationale-datenbanken' => ['/it-konzepte/datenbanken/'],
  'compiler-jit'            => ['/it-konzepte/compiler/', '/it-konzepte/interpreter/'],
);
# Datum = wann der Beitrag auf die Seite kam: vorhandene Seiten behalten ihr Datum (aus ihrer index.md),
# neue bekommen die Dateizeit der gelieferten index.html.
sub altesDatum {
  my $f = shift; return undef unless -f $f;
  my $t = lesen($f); return $t =~ /^date = (\S+)$/m ? $1 : undef;
}
sub dateizeit {
  my @t = localtime((stat(shift))[9]);
  return sprintf('%04d-%02d-%02dT%02d:%02d:%02d+02:00', $t[5]+1900, $t[4]+1, $t[3], $t[2], $t[1], $t[0]);
}

sub lesen { my $f = shift; open(my $h, '<', $f) or die "$f: $!"; local $/; my $t = <$h>; close $h; return $t; }
sub schreiben { my ($f, $t) = @_; open(my $h, '>', $f) or die "$f: $!"; print $h $t; close $h; }
sub text { my $s = shift; $s =~ s/<br\s*\/?>/ /gi; $s =~ s/<[^>]+>//g; $s =~ s/&nbsp;/ /g; $s =~ s/&lt;/</g; $s =~ s/&gt;/>/g; $s =~ s/&amp;/&/g; $s =~ s/\s+/ /g; $s =~ s/^ | $//g; return $s; }
sub toml { my $s = shift; $s =~ s/\\/\\\\/g; $s =~ s/"/\\"/g; return $s; }

opendir(my $d, $quelle) or die; my @begriffe = sort grep { !/^\./ && -f "$quelle/$_/index.html" } readdir($d); closedir $d;
unshift @begriffe, '' if -f "$quelle/index.html";   # Übersicht direkt im Reihen-Ordner
for my $b (@begriffe) {
  my $quelldatei = $b eq '' ? "$quelle/index.html" : "$quelle/$b/index.html";
  my $html = lesen($quelldatei);
  my ($titel)  = $html =~ m{<h1>(.*?)</h1>}s;
  my ($lead)   = $html =~ m{<p class="lead">(.*?)</p>}s;
  my ($kontext)= $html =~ m{<dt>Kontext</dt><dd>(.*?)</dd>}s;
  my ($prompt) = $html =~ m{<details class="prompt">.*?<blockquote>(.*?)</blockquote>}s;
  # Artikelkörper: nach Meta-Kasten (und Prompt) bis vor die Fußzeile
  my ($artikel) = $html =~ m{<article class="erklaert">(.*?)</article>}s or die "$b: kein Artikel";
  $artikel =~ s{^.*?<dl class="meta">.*?</dl>\s*}{}s or die "$b: kein Meta-Kasten";
  $artikel =~ s{^<details class="prompt">.*?</details>\s*}{}s;
  $artikel =~ s{\s*<p class="foot">.*?</p>\s*$}{\n}s or die "$b: keine Fußzeile";
  # Ohne seiteneigene Stile keine stil.css: eine Datei nur aus Kommentaren wird beim Minifizieren leer,
  # Hugo rechnet den SRI-Hash dann über den leeren Inhalt und der Browser blockt die ausgelieferte Datei.
  my ($css) = $html =~ m{(/\* ---- Seitenspezifisch.*?)</style>}s;
  my ($js)  = $html =~ m{<script>\n?(.*?)</script>}s;   # optional (z. B. Werkstattbericht ohne Mitmach-Elemente)

  # Interne Links der Reihe auf den Zielordner umbiegen (/it/… → /it-konzepte/…), auch im Skript
  if (my $z = $zielordner{$reihe}) {
    $artikel =~ s{(href=["'])/\Q$reihe\E/}{$1/$z/}g;
    $js =~ s{(href=["'])/\Q$reihe\E/}{$1/$z/}g if defined $js;
  }
  # Hugos JS-Minifizierer fasst „const a=…; const [x,y]=…a…“ zusammen und vertauscht dabei die Reihenfolge
  # (ReferenceError beim Laden). Abhilfe: die erste Deklaration als let – andere Art, wird nicht zusammengefasst.
  if (defined $js) {
    $js =~ s{const\s+(\w+)(\s*=[^;\n]*;\s*\n?\s*const\s*\[[^\]]*\]\s*=[^;\n]*\b\1\b)}{let $1$2}g
      and print "  ($b: const → let wegen Minifizierer)\n";
  }

  my $istUebersicht = ($b eq 'lesereihenfolge' || $b eq '');
  my $dir = $istUebersicht ? $ziel : "$ziel/$b";
  mkdir $dir unless -d $dir;
  schreiben("$dir/inhalt-html.txt", "<div class=\"erklaert\">\n$artikel</div>\n");
  if (defined $css) { schreiben("$dir/stil-roh.css", $css); } else { unlink "$dir/stil.css"; }
  if (defined $js) { schreiben("$dir/skript.js", $js); } else { unlink "$dir/skript.js"; }

  my $fm = "+++\n";
  $fm .= "title = \"" . toml($istUebersicht && $titel_uebersicht{$reihe} ? $titel_uebersicht{$reihe} : text($titel)) . "\"\n";
  $fm .= "description = \"" . toml(text($lead)) . "\"\n";
  my $mdDatei = $istUebersicht ? "$dir/_index.md" : "$dir/index.md";
  $fm .= "date = " . (altesDatum($mdDatei) // dateizeit($quelldatei)) . "\n";
  $fm .= "modelle = [\"Claude\"]\nmodell = \"Claude Opus 5.5\"\nmodell_id = \"claude-opus-5-5\"\nherkunft = \"eingebracht\"\n";
  $fm .= "kontext = \"" . toml(text($kontext)) . "\"\n" if $kontext;
  $fm .= "prompt = \"" . toml(text($prompt)) . "\"\n" if $prompt;
  if ($b eq 'was-ist-ein-sprachmodell') { $fm .= "thema = \"sprachmodell\"\nfassung = 2\n"; }
  # Werkstattbericht der Instanz: kein Begriff, erscheint auf der Übersicht unter „In eigener Sache“
  if ($b eq 'wie-diese-reihe-entstand') { $fm .= "eigene_sache = true\n"; }
  if (my $al = $aliase{$b}) { $fm .= "aliases = [" . join(', ', map { "\"$_\"" } @$al) . "]\n" if $reihe eq 'it'; }
  if ($istUebersicht) {
    $fm .= "aliases = [\"/erklaert/lesereihenfolge/\"]\n" if $reihe eq 'erklaert';
    # Seit 2026-10-26 ist die IT-Übersicht die Kachel „Grundlagen“ unter Wissen › IT-Konzepte (/wissen/it/);
    # Rückweg und Menü stehen im Template bzw. in hugo.toml, nicht hier
    $fm .= "layout = \"begriffe-uebersicht\"\n";
  }
  $fm .= "stile = [\"stil.css\"]\n" if defined $css;
  $fm .= "skripte = [\"skript.js\"]\n" if defined $js;
  $fm .= "\n";
  $fm .= "# Nur die tatsächlich verwendeten (fingerprinteten) Dateien veröffentlichen\n[build]\n  publishResources = false\n+++\n\n";
  $fm .= "{{< einbetten \"inhalt-html.txt\" >}}\n";
  schreiben($istUebersicht ? "$dir/_index.md" : "$dir/index.md", $fm);
  printf "%-26s %s | %d Zeichen Artikel | Kontext: %s\n", ($b eq '' ? '(Übersicht)' : $b), text($titel), length($artikel), ($kontext ? 'ja' : 'nein');
}
