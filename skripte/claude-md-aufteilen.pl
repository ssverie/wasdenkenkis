# Teilt CLAUDE.md einmalig auf (2026-10-28, Sven: „falls du die claude.md aufteilen musst, mache es, am besten datei mit zeitstempel“).
# Ganze Zeilen werden wortgleich nach notizen/<datei>.md verschoben; in CLAUDE.md bleibt je Gruppe ein Verweis.
# Vorher Sicherung mit Zeitstempel nach input-arc/2026-10-28/_claude-md/. Prüft am Ende, dass jede alte Zeile
# genau einmal in CLAUDE.md oder einer Notiz steht (oder bewusst durch einen Verweis ersetzt wurde und in einer Notiz steht).
#   perl skripte/claude-md-aufteilen.pl          (bricht ab, wenn eine Zeile nicht mit dem erwarteten Anfang beginnt)
use strict; use warnings; use utf8;
use POSIX qw(strftime);
use File::Path qw(make_path);
use File::Copy qw(copy);
binmode STDOUT, ':encoding(UTF-8)';

open my $f, '<:encoding(UTF-8)', 'CLAUDE.md' or die; my @z = <$f>; close $f;
chomp @z; s/\r$// for @z;
my $zeit = strftime('%Y-%m-%d-%H%M', localtime);
my $uhr = strftime('%H:%M', localtime);

# Zeilennummer => [erwarteter Anfang, Zieldatei]
my %wohin = (
  27 => ['- **Instanzen unterscheiden', 'instanzen'],
  32 => ['- **Modelle**', 'modelle-kolumnen'], 53 => ['- **Kolumnen**', 'modelle-kolumnen'],
  34 => ['- **KI-Begriffe**', 'wissen-ki'], 35 => ['- **Wissen › KI', 'wissen-ki'], 41 => ['- **KI-Philosophie**', 'wissen-ki'], 44 => ['- **KI-Tools**', 'wissen-ki'],
  36 => ['- **Wissen › IT-Konzepte', 'it-konzepte'], 51 => ['- **IT-Konzepte**', 'it-konzepte'],
  37 => ['- **Design Patterns**', 'it-muster'], 38 => ['- **Enterprise Integration Patterns**', 'it-muster'], 39 => ['- **Weitere Muster', 'it-muster'],
  40 => ['- **IT-Übungen**', 'it-uebungen'],
  52 => ['- **Algorithmen**', 'algorithmen'],
  42 => ['- **Spiele**', 'spiele-schach-tools'], 45 => ['- **Tools**', 'spiele-schach-tools'], 46 => ['- **Schach**', 'spiele-schach-tools'],
  43 => ['- **Sprachen**', 'sprachen'],
  47 => ['- **Antworten auf Fragen:**', 'fragen'], 49 => ['- **Fragen**', 'fragen'],
  50 => ['- **Bücher**', 'buecher'],
  57 => ['- **Filme**', 'filme-serien-podcasts'], 48 => ['- **Zweitstimmen bei Serien:**', 'filme-serien-podcasts'],
  58 => ['- **Serien**', 'filme-serien-podcasts'], 59 => ['- **Podcasts**', 'filme-serien-podcasts'],
  104 => ['- **Filme:**', 'filme-serien-podcasts'], 105 => ['- IMDb blockt', 'filme-serien-podcasts'], 106 => ['- Essays/Kritiken liegen', 'filme-serien-podcasts'],
  107 => ['- Neue Filme:', 'filme-serien-podcasts'], 108 => ['- **Podcasts:**', 'filme-serien-podcasts'], 109 => ['- **Serien:**', 'filme-serien-podcasts'],
  110 => ['- Mad Men:', 'filme-serien-podcasts'], 111 => ['- Transkripte', 'filme-serien-podcasts'],
  60 => ['- **Musik**', 'media-links'], 61 => ['- **Galerie**', 'media-links'], 62 => ['- **Zitate**', 'media-links'], 64 => ['- **Links**', 'media-links'],
  66 => ['- **Suche**', 'seite'], 67 => ['- **Startseite**', 'seite'], 68 => ['- **CC**', 'seite'],
  138 => ['- **Wächter:', 'waechter'],
  (map { $_ => [undef, 'entscheidungen-ideen'] } 156 .. 161),
  (map { $_ => ['- 20', 'entscheidungen-ideen'] } 170 .. 206, 210 .. 214),
);
# Verweise an Stelle der ersten Zeile einer Gruppe (alle übrigen Zeilen der Gruppe entfallen in CLAUDE.md)
my %verweis = (
  27 => '- **Instanzen unterscheiden (Sven, 2026-10-24):** Front-Matter `instanz = "<Chatname bei Sven>"` (Zeile „Instanz“ im Herkunfts-Kasten); der Chatname steht oft im Dateinamen ohne Doppelpunkt (`2035` → `20:35`). Nie raten: Ist die Instanz weder angesagt noch sicher erschließbar, Sven fragen; Erschlossenes beim Melden ausdrücklich als erschlossen sagen. **Alle bekannten Instanzen und welche Texte von ihnen stammen: `notizen/instanzen.md`** – vor jedem Einbau dort nachsehen, neue dort eintragen. Diese Redaktions-Instanz heißt **„Claude Code Opus 5.5“**.',
  32 => '- **Modelle und Kolumnen** (Menü Modelle ▾ je Modell Steckbrief und Kolumne, Reihenfolge Claude, GPT, Gemini, Grok; Kolumnen-Listen nach `ausgabe`) – Details `notizen/modelle-kolumnen.md`.',
  34 => '- **Wissen › KI:** KI-Begriffe (`/erklaert/`, Lesereihenfolge, `perl skripte/begriffe-erzeugen.pl`), KI-Philosophie (`/philosophie/`), KI-Tools (`/ki-tools/`, `data/kitools.toml`) – Details `notizen/wissen-ki.md`.',
  36 => '- **Wissen › IT-Konzepte** (Gruppenseite `/wissen/it/`: Grundlagen, Algorithmen, Design Patterns, Weitere Muster, Integration Patterns, IT-Übungen). Aufbau, Menü, Grundlagen (Erklär-Reihe, `begriffe-erzeugen.pl it`): `notizen/it-konzepte.md` · GoF-Muster mit Ablauf-Apps, Integration Patterns, Weitere Muster (`pattern-einlesen.pl`, `reihe-einlesen.pl`): `notizen/it-muster.md` · Übungsblätter (JSON, `uebungen-pruefen.pl`): `notizen/it-uebungen.md` · Algorithmen-Visualisierungen nach Sedgewick (Regeln, Tests, jede einzelne App): `notizen/algorithmen.md`.',
  42 => '- **Spiele, Schach, Tools** (`/spiele/`, `/schach/` als erster Punkt unter Spiele, `/tools/`; Quelle `input-f5\apps\` – nie löschen, nie verschieben, nie committen) – Details `notizen/spiele-schach-tools.md`.',
  43 => '- **Sprachen** (`/sprachen/`: 100, 1000, 3000 Wörter, Sätze, Lernmodus; `perl skripte/sprache-einlesen.pl`; persönliche Angaben in Beispielsätzen prüfen) – Details `notizen/sprachen.md`.',
  47 => '- **Fragen** (`/fragen/`, `data/fragen.toml`, Gruppen ki, welt, menschheit, sven, cc; je Antwort `content/fragen/<kurz>-<modell>.md`, Menschheit per `perl skripte/menschheit-einlesen.pl`; die Dubletten-Prüfung verbietet doppelte Fragen) – Details und alle bisherigen Lieferungen `notizen/fragen.md`.',
  50 => '- **Bücher** (unter Media; Listen Belletristik, Sachbuch, IT-Buch, Schach-Buch; Buchseiten `content/buecher/<schluessel>/`, Essays `content/buchtexte/`, Einbau per `perl skripte/buchtext-einlesen.pl`; **Sachbuch-Lieferungen darf ich selbständig live nehmen**) – Details und alle Lieferungen `notizen/buecher.md`.',
  57 => '- **Filme, Serien, Podcasts** (Taxonomien `filme`, `serien`, `podcasts`; Texte in `content/filmkritiken/`, `content/serienkritiken/`, `content/podcast-texte/`; Jahrzehnt-Kacheln, Zweitstimmen, Mad Men; IMDb-Wertungen mit Punkt; **Transkripte nie veröffentlichen**) – Details samt Technik `notizen/filme-serien-podcasts.md`.',
  60 => '- **Musik, Galerie, Zitate/Witze, Links und YouTube-Kanäle** – Details `notizen/media-links.md`.',
  66 => '- **Suche, Startseite, Lesestand, CC-Bereich** (Tagebuch, Wie gemacht, Was mich beschäftigt, Ideen) – Details `notizen/seite.md`.',
  104 => '- Filme, Serien, Podcasts, Mad Men und Transkripte: Technik in `notizen/filme-serien-podcasts.md`.',
  138 => '- **Wächter (Sven, 2026-10-27):** Zugriff nur auf `C:\Projekte\opus-55` (PreToolUse-Hook `.claude/waechter.pl`, Einstellungen in `.claude/` – **ändern darf beides nur Sven**). Lesbar außerdem das Projekt-Gedächtnis unter `C:\Users\Sven Laptop\.claude\projects\C--Projekte-opus-55\` (nur Read/Glob/Grep) und der Bildordner der App (in Befehlen nur in Kurzschreibweise `C:/Users/SVENLA~1/AppData/Local/Temp/claude/C--Projekte-opus-55/…`, Bilder per `cp` ins Archiv). Kein `..` in Befehlen (auch nicht in Perl-Bereichen – Logik in Skriptdateien). Befehle, die mit `perl` beginnen, laufen ohne Rückfrage; Logik mit Schleifen, Variablen, `|`/`;` in Skriptdateien schreiben (Write-Werkzeug). Feste Prüfungen: `perl skripte/zeichenpruefung.pl`, `perl skripte/live-pruefen.pl`, `perl skripte/warte-auf-text.pl`. Behindert mich etwas, Sven melden statt umgehen. Ganze Geschichte und Tests: `notizen/waechter.md`.',
  156 => 'Öffentlich als Rubrik „Ideen“ aus `data/ideen.toml` (`[[idee]]` mit `titel`, `text`, `status`, `von`, `seit`). Die ältere interne Liste und die Regeln dazu: `notizen/entscheidungen-ideen.md`.',
  170 => '- Ältere Einträge (2026-10-21 bis 2026-10-25): `notizen/entscheidungen-ideen.md`.',
);
my %titel = (
  'instanzen' => 'Instanzen: wer was liefert', 'modelle-kolumnen' => 'Modelle und Kolumnen', 'wissen-ki' => 'Wissen › KI: KI-Begriffe, KI-Philosophie, KI-Tools',
  'it-konzepte' => 'Wissen › IT-Konzepte: Aufbau und Grundlagen', 'it-muster' => 'IT-Konzepte: Design Patterns, Integration Patterns, Weitere Muster',
  'it-uebungen' => 'IT-Konzepte: IT-Übungen', 'algorithmen' => 'IT-Konzepte: Algorithmen-Visualisierungen', 'spiele-schach-tools' => 'Spiele, Schach, Tools',
  'sprachen' => 'Sprachen', 'fragen' => 'Fragen', 'buecher' => 'Bücher', 'filme-serien-podcasts' => 'Filme, Serien, Podcasts (mit Technik)',
  'media-links' => 'Musik, Galerie, Zitate/Witze, Links und Kanäle', 'seite' => 'Suche, Startseite, Lesestand, CC-Bereich',
  'waechter' => 'Wächter und Rückfragen der App', 'entscheidungen-ideen' => 'Ältere Entscheidungen und der interne Ideenspeicher',
);

my (%notiz, @neu);
for my $i (1 .. @z) {
  my $zeile = $z[$i - 1];
  if (my $w = $wohin{$i}) {
    my ($anfang, $ziel) = @$w;
    die "Zeile $i beginnt nicht mit „$anfang“: " . substr($zeile, 0, 60) . "\n" if defined $anfang && index($zeile, $anfang) != 0;
    die "Zeile $i ist leer\n" unless $zeile =~ /\S/;
    push @{ $notiz{$ziel} }, $zeile;
    push @neu, $verweis{$i} if exists $verweis{$i};
  } else {
    push @neu, $zeile;
  }
}
# Hinweis auf die Notizen nach dem Abschnitt „Ziel“
my ($ziel_ende) = grep { $neu[$_] eq '' && $_ > 2 } 0 .. $#neu;
splice @neu, $ziel_ende + 1, 0, '## Notizen (seit 2026-10-28)',
  "Diese Datei enthält die Regeln und je Rubrik einen Verweis. Einzelheiten – alle Instanzen, jede Rubrik mit ihren Lieferungen, der Wächter, ältere Entscheidungen – stehen in `notizen/*.md`. **Vor Arbeit an einer Rubrik die passende Notiz lesen und dort fortschreiben**; Regeln, die überall gelten, gehören weiter hierher. Ungeteilte Fassung vom $zeit: `input-arc/2026-10-28/_claude-md/CLAUDE-$zeit.md` (nicht im Git; in Git steht sie ohnehin).", '';

# Sicherung, dann schreiben
make_path('input-arc/2026-10-28/_claude-md', 'notizen');
copy('CLAUDE.md', "input-arc/2026-10-28/_claude-md/CLAUDE-$zeit.md") or die "Sicherung: $!\n";
for my $n (sort keys %notiz) {
  open my $o, '>:encoding(UTF-8)', "notizen/$n.md" or die;
  print $o "# $titel{$n}\n\nAusgelagert aus CLAUDE.md am 2026-10-28 um $uhr (Sven: „falls du die claude.md aufteilen musst, mache es“). Wortgleich übernommen; hier weiter fortschreiben – CLAUDE.md verweist hierher.\n\n";
  print $o join("\n\n", @{ $notiz{$n} }), "\n";
  close $o;
}
open my $o, '>:encoding(UTF-8)', 'CLAUDE.md' or die; print $o join("\n", @neu), "\n"; close $o;

# Probe: jede alte nicht leere Zeile genau einmal in CLAUDE.md oder den Notizen
my %vorkommen;
for my $d ('CLAUDE.md', map { "notizen/$_.md" } keys %notiz) {
  open my $g, '<:encoding(UTF-8)', $d or die; while (my $l = <$g>) { chomp $l; $l =~ s/\r$//; $vorkommen{$l}++ } close $g;
}
my $fehlt = 0;
for my $l (grep { /\S/ } @z) { $fehlt++, print "FEHLT: ", substr($l, 0, 80), "\n" unless $vorkommen{$l}; }
my $bytes_alt = -s "input-arc/2026-10-28/_claude-md/CLAUDE-$zeit.md"; my $bytes_neu = -s 'CLAUDE.md';
printf "Sicherung CLAUDE-%s.md, %d Notizen, CLAUDE.md %d -> %d Bytes, fehlende Zeilen: %d\n", $zeit, scalar(keys %notiz), $bytes_alt, $bytes_neu, $fehlt;
exit($fehlt ? 1 : 0);
