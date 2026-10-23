# Erzeugt aus input/erklaert/<begriff>/index.html je ein Hugo-Bundle unter content/erklaert/<begriff>/
# (index.md, inhalt-html.txt, stil.css, skript.js). Die Lesereihenfolge wird zur Rubrikseite content/erklaert/.
# Aufruf aus dem Projektordner: perl skripte/begriffe-erzeugen.pl, danach je stil-roh.css mit skripte/css-begrenzen.pl zu stil.css machen
use strict; use warnings; use utf8;
use open qw(:std :encoding(UTF-8));

my $quelle = 'input/erklaert';
my $ziel   = 'content/erklaert';
# Datum = wann der Beitrag auf die Seite kam: vorhandene Seiten behalten ihr Datum
my %datum = (
  'was-ist-ein-sprachmodell' => '2026-10-22T11:50:00+02:00',
  'token'                    => '2026-10-22T14:14:00+02:00',
  'parameter'                => '2026-10-22T15:40:00+02:00',
  'kontextfenster'           => '2026-10-22T15:47:00+02:00',
);
my $neu = '2026-10-23T11:23:00+02:00';

sub lesen { my $f = shift; open(my $h, '<', $f) or die "$f: $!"; local $/; my $t = <$h>; close $h; return $t; }
sub schreiben { my ($f, $t) = @_; open(my $h, '>', $f) or die "$f: $!"; print $h $t; close $h; }
sub text { my $s = shift; $s =~ s/<[^>]+>//g; $s =~ s/&nbsp;/ /g; $s =~ s/&lt;/</g; $s =~ s/&gt;/>/g; $s =~ s/&amp;/&/g; $s =~ s/\s+/ /g; $s =~ s/^ | $//g; return $s; }
sub toml { my $s = shift; $s =~ s/\\/\\\\/g; $s =~ s/"/\\"/g; return $s; }

opendir(my $d, $quelle) or die; my @begriffe = sort grep { -f "$quelle/$_/index.html" } readdir($d); closedir $d;
for my $b (@begriffe) {
  my $html = lesen("$quelle/$b/index.html");
  my ($titel)  = $html =~ m{<h1>(.*?)</h1>}s;
  my ($lead)   = $html =~ m{<p class="lead">(.*?)</p>}s;
  my ($kontext)= $html =~ m{<dt>Kontext</dt><dd>(.*?)</dd>}s;
  my ($prompt) = $html =~ m{<details class="prompt">.*?<blockquote>(.*?)</blockquote>}s;
  # Artikelkörper: nach Meta-Kasten (und Prompt) bis vor die Fußzeile
  my ($artikel) = $html =~ m{<article class="erklaert">(.*?)</article>}s or die "$b: kein Artikel";
  $artikel =~ s{^.*?<dl class="meta">.*?</dl>\s*}{}s or die "$b: kein Meta-Kasten";
  $artikel =~ s{^<details class="prompt">.*?</details>\s*}{}s;
  $artikel =~ s{\s*<p class="foot">.*?</p>\s*$}{\n}s or die "$b: keine Fußzeile";
  my ($css) = $html =~ m{(/\* ---- Seitenspezifisch.*?)</style>}s;
  $css //= "/* keine seiteneigenen Stile – alles steht im gemeinsamen Stylesheet */\n";
  my ($js)  = $html =~ m{<script>\n?(.*?)</script>}s or die "$b: kein Skript";

  my $istUebersicht = ($b eq 'lesereihenfolge');
  my $dir = $istUebersicht ? $ziel : "$ziel/$b";
  mkdir $dir unless -d $dir;
  schreiben("$dir/inhalt-html.txt", "<div class=\"erklaert\">\n$artikel</div>\n");
  schreiben("$dir/stil-roh.css", $css);
  schreiben("$dir/skript.js", $js);

  my $fm = "+++\n";
  $fm .= "title = \"" . toml($istUebersicht ? 'KI-Begriffe' : text($titel)) . "\"\n";
  $fm .= "description = \"" . toml(text($lead)) . "\"\n";
  $fm .= "date = " . ($datum{$b} // $neu) . "\n";
  $fm .= "modelle = [\"Claude\"]\nmodell = \"Claude Opus 5.5\"\nmodell_id = \"claude-opus-5-5\"\nherkunft = \"eingebracht\"\n";
  $fm .= "kontext = \"" . toml(text($kontext)) . "\"\n" if $kontext;
  $fm .= "prompt = \"" . toml(text($prompt)) . "\"\n" if $prompt;
  if ($b eq 'was-ist-ein-sprachmodell') { $fm .= "thema = \"sprachmodell\"\nfassung = 2\n"; }
  if ($istUebersicht) { $fm .= "aliases = [\"/erklaert/lesereihenfolge/\"]\nlayout = \"begriffe-uebersicht\"\n"; }
  $fm .= "stile = [\"stil.css\"]\nskripte = [\"skript.js\"]\n\n";
  $fm .= "# Nur die tatsächlich verwendeten (fingerprinteten) Dateien veröffentlichen\n[build]\n  publishResources = false\n+++\n\n";
  $fm .= "{{< einbetten \"inhalt-html.txt\" >}}\n";
  schreiben($istUebersicht ? "$dir/_index.md" : "$dir/index.md", $fm);
  printf "%-26s %s | %d Zeichen Artikel | Kontext: %s\n", $b, text($titel), length($artikel), ($kontext ? 'ja' : 'nein');
}
