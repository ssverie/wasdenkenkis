# Muster-Reihen der GoF-Instanz („26.10.2026 - 13:39 - GoF-Designmuster in Java“) einlesen – Kapitelseiten als fertiges HTML:
#   perl skripte/reihe-einlesen.pl eip    input/eip-patterns/eip     (Enterprise Integration Patterns, seit 2026-10-27)
#   perl skripte/reihe-einlesen.pl muster input/muster               (Software-Muster jenseits von GoF, seit 2026-10-27)
# Je Kapitel N-<name>.html ein Page-Bundle <ziel>/<name>/ (index.md + inhalt-html.txt), die Übersicht index.html als
# _index.md + inhalt-html.txt der Rubrik, die (in allen Kapiteln gleichen) Stile auf die Wrapper-Klasse begrenzt nach assets/css/.
# Übernommen wird der <article> unverändert; entfernt werden nur <h1> (→ title) und p.kategorie (→ description),
# umgeschrieben nur die Links zwischen den Dateien. Danach Vergleich: Artikel ohne href-Werte muss gleich bleiben.
# Was unter dem Einbetten steht (Anmerkungen der Redaktion), bleibt bei neuer Lieferung erhalten.
use strict; use warnings; use utf8;
use File::Path qw(make_path);
use POSIX qw(strftime);
binmode STDOUT, ':encoding(UTF-8)';

my %REIHE = (
  eip => {
    ziel => 'content/it-konzepte/integration-patterns', basis => '/it-konzepte/integration-patterns/',
    klasse => 'eip', index => 'eip-index', css => 'assets/css/eip.css', name => 'Enterprise Integration Patterns',
    beschreibung => 'Die 65 Muster von Hohpe und Woolf, wie Systeme über Nachrichten zusammenarbeiten – in acht Kapiteln mit Diagrammen.',
    kontext => 'Reihe „Enterprise Integration Patterns“ nach Hohpe und Woolf, Kapitelseite mit Diagrammen der Instanz, unverändert übernommen',
  },
  muster => {
    ziel => 'content/it-konzepte/weitere-muster', basis => '/it-konzepte/weitere-muster/',
    klasse => 'muster', index => 'muster-index', css => 'assets/css/muster.css', name => 'Software-Muster jenseits von GoF',
    beschreibung => '53 Entwurfs- und Architekturmuster, die nicht im GoF-Buch stehen – in sieben Kapiteln mit Diagrammen, die meisten mit lauffähigem Java 21.',
    kontext => 'Reihe „Software-Muster jenseits von GoF“, Kapitelseite mit Diagrammen und Java-21-Beispielen der Instanz, unverändert übernommen',
  },
);
my $reihe = shift // ''; my $R = $REIHE{$reihe} or die "Aufruf: perl skripte/reihe-einlesen.pl eip|muster <ordner>\n";
my $quelle = shift or die "Quellordner fehlt\n";
my ($ziel, $basis) = @$R{qw(ziel basis)};
my $instanz = '26.10.2026 - 13:39 - GoF-Designmuster in Java';

sub lies { my $d = shift; open my $f, '<:encoding(UTF-8)', $d or die "$d: $!\n"; local $/; my $t = <$f>; close $f; $t =~ s/\r\n/\n/g; return $t; }
sub schreib { my ($d, $t) = @_; open my $f, '>:encoding(UTF-8)', $d or die "$d: $!\n"; print $f $t; close $f; }
sub datum { my $d = shift; my $z = strftime('%Y-%m-%dT%H:%M:00%z', localtime((stat $d)[9])); $z =~ s/(\d\d)$/:$1/; return $z; }
sub links {
  my $t = shift;
  $t =~ s/href="index\.html"/href="$basis"/g;
  # Verweise auf die Schwester-Reihe der Instanz (../eip/…) zeigen auf unsere Integration Patterns
  $t =~ s/href="\.\.\/eip\/index\.html"/href="\/it-konzepte\/integration-patterns\/"/g;
  $t =~ s/href="\.\.\/eip\/\d+-([a-z-]+)\.html(#[^"]*)?"/'href="\/it-konzepte\/integration-patterns\/' . $1 . '\/' . ($2 \/\/ '') . '"'/ge;
  $t =~ s/href="\d+-([a-z-]+)\.html(#[^"]*)?"/'href="' . $basis . $1 . '\/' . ($2 \/\/ '') . '"'/ge;
  die "Link nicht umgeschrieben: $1\n" if $t =~ /href="([^"#\/][^"]*\.html[^"]*)"/;
  return $t;
}
sub ohne_href { my $t = shift; $t =~ s/href="[^"]*"/href=""/g; return $t; }
sub artikel { my ($t, $klasse, $d) = @_; $t =~ /(<article class="$klasse">.*?<\/article>)/s or die "$d: kein <article class=\"$klasse\">\n"; return $1; }
sub nachher {
  my $d = shift; return '' unless -e $d;
  my ($n) = lies($d) =~ /\{\{< einbetten "inhalt-html\.txt" >\}\}\n(.*)\z/s; return $n // '';
}
sub front {
  my %f = @_;
  my $fm = "+++\n";
  for my $k (qw(title description date weight layout oben einheit)) {
    next unless defined $f{$k};
    $fm .= $k =~ /^(date|weight|einheit)$/ ? "$k = $f{$k}\n" : "$k = \"$f{$k}\"\n";
  }
  $fm .= qq{modelle = ["Claude"]\nmodell = "Claude Opus 5.5"\nmodell_id = "claude-opus-5-5"\nherkunft = "eingebracht"\ninstanz = "$instanz"\n};
  $fm .= qq{kontext = "$f{kontext}"\n} if $f{kontext};
  $fm .= "\n[build]\n  publishResources = false\n+++\n\n{{< einbetten \"inhalt-html.txt\" >}}\n";
  return $fm;
}

my @kapitel = sort { ($a =~ m{/(\d+)-})[0] <=> ($b =~ m{/(\d+)-})[0] } glob("$quelle/[0-9]*-*.html");
die "keine Kapitel in $quelle\n" unless @kapitel;
my $css;
for my $d (@kapitel) {
  my ($nr, $name) = $d =~ /(\d+)-([a-z-]+)\.html$/ or die "$d: Dateiname\n";
  my $t = lies($d);
  my ($stil) = $t =~ /<style>\n?(.*?)<\/style>/s or die "$d: kein <style>\n";
  die "$d: Stile weichen vom ersten Kapitel ab\n" if defined $css && $stil ne $css;
  $css = $stil;
  my $a = artikel($t, $R->{klasse}, $d);
  my ($titel) = $a =~ /<h1>([^<]+)<\/h1>/ or die "$d: kein <h1>\n";
  my ($kat) = $a =~ /<p class="kategorie">([^<]+)<\/p>/ or die "$d: keine p.kategorie\n";
  my $rest = $a;
  $rest =~ s/<h1>[^<]+<\/h1>\n// or die; $rest =~ s/<p class="kategorie">[^<]+<\/p>\n// or die;
  my $neu = links($rest);
  die "$d: Vergleich fehlgeschlagen\n" unless ohne_href($neu) eq ohne_href($rest);
  my $dir = "$ziel/$name"; make_path($dir);
  my $alt = nachher("$dir/index.md");
  schreib("$dir/inhalt-html.txt", "$neu\n");
  schreib("$dir/index.md", front(title => $titel, description => $kat, date => datum($d), weight => $nr + 0, kontext => $R->{kontext}) . $alt);
  my $n = () = $neu =~ /<h2 id="(?!vergleich|zusammenspiel)/g;
  my $c = () = $neu =~ /<details class="code">/g;
  print "$nr $name: „$titel“ – $kat – $n Abschnitte" . ($c ? ", $c mit Java-Code" : '') . ", Text gleich\n";
}

# Übersicht
my $t = lies("$quelle/index.html");
my ($istil) = $t =~ /<style>\n?(.*?)<\/style>/s or die "index: kein <style>\n";
my $a = artikel($t, $R->{index}, 'index');
my ($titel) = $a =~ /<h1>([^<]+)<\/h1>/ or die "index: kein <h1>\n";
my $rest = $a; $rest =~ s/<h1>[^<]+<\/h1>\n// or die;
my $neu = links($rest);
die "index: Vergleich fehlgeschlagen\n" unless ohne_href($neu) eq ohne_href($rest);
make_path($ziel);
my $alt = nachher("$ziel/_index.md");
schreib("$ziel/inhalt-html.txt", "$neu\n");
schreib("$ziel/_index.md", front(title => $titel, description => $R->{beschreibung}, date => datum("$quelle/index.html"),
  layout => 'reihe-uebersicht', oben => '/wissen/it', einheit => '["Kapitel", "Kapitel"]') . $alt);
my $m = () = $neu =~ /<td class="n">/g;
print "Übersicht: „$titel“ – $m Muster in der Liste, Text gleich\n";

# Stile: Variablen und Regeln auf die Wrapper-Klasse begrenzen, body-Regel weg (macht das Seitenlayout)
my $aus = "/* $R->{name} – Stile der Lieferung (alle Kapitel gleich), von skripte/reihe-einlesen.pl auf .$R->{klasse} begrenzt.\n"
        . "   Angleichungen an die Seite stehen in reihe-seite.css, nicht hier (überleben so jede neue Lieferung). */\n";
for my $teil ([$css, ".$R->{klasse}"], [$istil, ".$R->{index}"]) {
  my ($s, $k) = @$teil;
  $s =~ s/^\s*body \{[^\n]*\}\n//m;
  $s =~ s/:root:not\(\[data-theme="light"\]\) \{/$k {/g;
  $s =~ s/:root \{/$k {/g;
  $s =~ s/(^|[{}])(\s*)([^{}\@;\/]+?)\s*\{/$1 . $2 . begrenze($3, $k) . ' {'/ge;
  $aus .= $s;
}
sub begrenze {
  my ($sel, $k) = @_;
  return $sel if $sel eq $k;
  return join(', ', map { my $x = $_; $x =~ s/^\s+|\s+$//g; $x eq $k ? $x : "$k $x" } split /,(?![^(]*\))/, $sel);
}
schreib($R->{css}, $aus);
print "Stile: $R->{css}\n";
