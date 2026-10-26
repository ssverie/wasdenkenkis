# Enterprise Integration Patterns einlesen (Lieferung der Instanz „26.10.2026 - 13:39 - GoF-Designmuster in Java“, 2026-10-27):
#   perl skripte/eip-einlesen.pl input/eip-patterns/eip
# Je Kapitel NN-<name>.html ein Page-Bundle content/it-konzepte/integration-patterns/<name>/ (index.md + inhalt-html.txt),
# die Übersicht index.html als _index.md + inhalt-html.txt der Rubrik, die (in allen Kapiteln gleichen) Stile als assets/css/eip.css.
# Übernommen wird der <article> unverändert; entfernt werden nur <h1> (→ title) und p.kategorie (→ description),
# umgeschrieben nur die Links zwischen den Dateien. Danach Vergleich: Artikel ohne href-Werte muss gleich bleiben.
use strict; use warnings; use utf8;
use File::Path qw(make_path);
use POSIX qw(strftime);
binmode STDOUT, ':encoding(UTF-8)';

my $quelle = shift or die "Aufruf: perl skripte/eip-einlesen.pl <ordner>\n";
my $ziel = 'content/it-konzepte/integration-patterns';
my $basis = '/it-konzepte/integration-patterns/';
my $instanz = '26.10.2026 - 13:39 - GoF-Designmuster in Java';

sub lies { my $d = shift; open my $f, '<:encoding(UTF-8)', $d or die "$d: $!\n"; local $/; my $t = <$f>; close $f; $t =~ s/\r\n/\n/g; return $t; }
sub schreib { my ($d, $t) = @_; open my $f, '>:encoding(UTF-8)', $d or die "$d: $!\n"; print $f $t; close $f; }
sub datum { my $d = shift; my $z = strftime('%Y-%m-%dT%H:%M:00%z', localtime((stat $d)[9])); $z =~ s/(\d\d)$/:$1/; return $z; }
sub links {
  my $t = shift;
  $t =~ s/href="index\.html"/href="$basis"/g;
  $t =~ s/href="\d\d-([a-z-]+)\.html(#[^"]*)?"/'href="' . $basis . $1 . '\/' . ($2 \/\/ '') . '"'/ge;
  die "Link nicht umgeschrieben: $1\n" if $t =~ /href="([^"#\/][^"]*\.html[^"]*)"/;
  return $t;
}
sub ohne_href { my $t = shift; $t =~ s/href="[^"]*"/href=""/g; return $t; }
sub artikel { my ($t, $klasse, $d) = @_; $t =~ /(<article class="$klasse">.*?<\/article>)/s or die "$d: kein <article class=\"$klasse\">\n"; return $1; }
sub front {
  my %f = @_;
  my $fm = "+++\n";
  for my $k (qw(title description date weight layout oben einheit)) {
    next unless defined $f{$k};
    $fm .= $k =~ /^(date|weight)$/ ? "$k = $f{$k}\n" : $k eq 'einheit' ? "$k = $f{$k}\n" : "$k = \"$f{$k}\"\n";
  }
  $fm .= qq{modelle = ["Claude"]\nmodell = "Claude Opus 5.5"\nmodell_id = "claude-opus-5-5"\nherkunft = "eingebracht"\ninstanz = "$instanz"\n};
  $fm .= qq{kontext = "$f{kontext}"\n} if $f{kontext};
  $fm .= "\n[build]\n  publishResources = false\n+++\n\n{{< einbetten \"inhalt-html.txt\" >}}\n";
  return $fm;
}

my @kapitel = sort glob("$quelle/[0-9][0-9]-*.html");
die "keine Kapitel in $quelle\n" unless @kapitel;
my $css;
for my $d (@kapitel) {
  my ($nr, $name) = $d =~ /(\d\d)-([a-z-]+)\.html$/ or die "$d: Dateiname\n";
  my $t = lies($d);
  my ($stil) = $t =~ /<style>\n?(.*?)<\/style>/s or die "$d: kein <style>\n";
  die "$d: Stile weichen vom ersten Kapitel ab\n" if defined $css && $stil ne $css;
  $css = $stil;
  my $a = artikel($t, 'eip', $d);
  my ($titel) = $a =~ /<h1>([^<]+)<\/h1>/ or die "$d: kein <h1>\n";
  my ($kat) = $a =~ /<p class="kategorie">([^<]+)<\/p>/ or die "$d: keine p.kategorie\n";
  my $rest = $a;
  $rest =~ s/<h1>[^<]+<\/h1>\n// or die; $rest =~ s/<p class="kategorie">[^<]+<\/p>\n// or die;
  my $neu = links($rest);
  die "$d: Vergleich fehlgeschlagen\n" unless ohne_href($neu) eq ohne_href($rest);
  my $dir = "$ziel/$name"; make_path($dir);
  # Was unter dem Einbetten steht (Anmerkungen der Redaktion), bleibt bei neuer Lieferung erhalten
  my $nachher = '';
  if (-e "$dir/index.md") { ($nachher) = lies("$dir/index.md") =~ /\{\{< einbetten "inhalt-html\.txt" >\}\}\n(.*)\z/s; $nachher //= ''; }
  schreib("$dir/inhalt-html.txt", "$neu\n");
  schreib("$dir/index.md", front(title => $titel, description => $kat, date => datum($d), weight => $nr + 0,
    kontext => "Reihe „Enterprise Integration Patterns“ nach Hohpe und Woolf, Kapitelseite mit Diagrammen der Instanz, unverändert übernommen") . $nachher);
  my $n = () = $neu =~ /<h2 id="(?!vergleich|zusammenspiel)/g;
  print "$nr $name: „$titel“ – $kat – $n Muster-Abschnitte, Text gleich\n";
}

# Übersicht
my $t = lies("$quelle/index.html");
my ($istil) = $t =~ /<style>\n?(.*?)<\/style>/s or die "index: kein <style>\n";
my $a = artikel($t, 'eip-index', 'index');
my ($titel) = $a =~ /<h1>([^<]+)<\/h1>/ or die "index: kein <h1>\n";
my $rest = $a; $rest =~ s/<h1>[^<]+<\/h1>\n// or die;
my $neu = links($rest);
die "index: Vergleich fehlgeschlagen\n" unless ohne_href($neu) eq ohne_href($rest);
make_path($ziel);
schreib("$ziel/inhalt-html.txt", "$neu\n");
schreib("$ziel/_index.md", front(title => $titel,
  description => 'Die 65 Muster von Hohpe und Woolf, wie Systeme über Nachrichten zusammenarbeiten – in acht Kapiteln mit Diagrammen.',
  date => datum("$quelle/index.html"), layout => 'integration-patterns', oben => '/wissen/it', einheit => '["Kapitel", "Kapitel"]'));
my $m = () = $neu =~ /<td class="n">/g;
print "Übersicht: „$titel“ – $m Muster in der Liste, Text gleich\n";

# Stile: Variablen und Regeln auf .eip begrenzen, body-Regel weg (macht das Seitenlayout)
my $aus = "/* Enterprise Integration Patterns – Stile der Lieferung (alle Kapitel gleich), von skripte/eip-einlesen.pl auf .eip begrenzt.\n"
        . "   Angleichungen an die Seite stehen in eip-seite.css, nicht hier (überleben so jede neue Lieferung). */\n";
for my $teil ([$css, '.eip'], [$istil, '.eip-index']) {
  my ($s, $k) = @$teil;
  $s =~ s/^\s*body \{[^\n]*\}\n//m;
  $s =~ s/:root:not\(\[data-theme="light"\]\) \{/$k {/g;
  $s =~ s/:root \{/$k {/g;
  # einzeilige Regeln „sel { … }“ und Regeln in @media: Selektoren begrenzen
  $s =~ s/(^|[{}])(\s*)([^{}\@;\/]+?)\s*\{/$1 . $2 . begrenze($3, $k) . ' {'/ge;
  $aus .= $s;
}
sub begrenze {
  my ($sel, $k) = @_;
  return $sel if $sel eq $k;
  return join(', ', map { my $x = $_; $x =~ s/^\s+|\s+$//g; $x eq $k ? $x : "$k $x" } split /,(?![^(]*\))/, $sel);
}
schreib('assets/css/eip.css', $aus);
print "Stile: assets/css/eip.css\n";
