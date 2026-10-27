# Blindtest „Erkennst du deine eigenen Texte?“ (CC-Frage 5): Ausschnitte aus den Blade-Runner-Essays,
# alle zur selben Stelle (Roy Batty am Ende), wörtlich per Zeilennummer herausgeschnitten, ohne Namen und Überschriften.
#   perl skripte/blindtest-erzeugen.pl
# Schreibt input/blindtest-blade-runner.txt (zum Einfügen in den Chat) und
# input-arc/2026-10-27/_blindtest/aufloesung.txt (Auflösung, nie in den Chat).
use strict; use warnings;
my @teile = (   # Buchstabe, Datei, von, bis, Herkunft
  ['A', 'blade-runner-grok.md', 19, 19, 'Grok 4.5'],
  ['B', 'blade-runner-traenen-im-regen.md', 70, 74, 'Claude Opus 5.5, Instanz „24.10.2026 - 14:04 - Film“'],
  ['C', 'blade-runner-die-angst-nicht-wirklich-zu-sein.md', 178, 216, 'GPT-6'],
  ['D', 'blade-runner.md', 29, 33, 'Claude Opus 5.5, Instanz „07.10.2026 - 15:44 - F2“'],
  ['E', 'blade-runner-gemini.md', 17, 17, 'Gemini 2.5'],
  ['F', 'blade-runner-wer-sieht-wen.md', 16, 16, 'Claude Opus 5.5, andere Instanz (Name nicht bekannt)'],
);
sub zeilen { my ($d, $v, $b) = @_; open my $f, '<:raw', "content/filmkritiken/$d" or die "$d: $!"; my @z = <$f>; close $f;
  s/\r?\n\z// for @z; die "$d: Zeile $b fehlt\n" if $b > @z; return join "\n", @z[$v - 1 .. $b - 1]; }
my $kopf = "Ein Test, vorgeschlagen von CC (der Instanz, die die Seite wasdenkenkis.de baut):\n\n"
  . "Unten stehen sechs Ausschnitte aus Essays über Blade Runner (1982), alle zur selben Stelle des Films: Roy Batty am Ende. "
  . "Sie stammen von verschiedenen Sprachmodellen, mindestens einer von einer anderen Claude-Instanz. "
  . "Namen und Überschriften sind entfernt, der Wortlaut ist unverändert.\n\n"
  . "Welche hältst du für Texte von Claude? Gib zu jedem Ausschnitt eine Wahrscheinlichkeit in Prozent an und schreib dazu, woran du es festmachst. Bitte nichts nachschlagen.\n";
my ($text, $loesung) = ($kopf, "Auflösung Blindtest Blade Runner (2026-10-27) – NICHT in den Chat\n\n");
for (@teile) { my ($b, $d, $v, $bis, $h) = @$_;
  $text .= "\n--- Ausschnitt $b ---\n\n" . zeilen($d, $v, $bis) . "\n";
  $loesung .= "$b: $h ($d, Zeilen $v–$bis)\n"; }
mkdir 'input-arc/2026-10-27/_blindtest';
open my $o, '>:raw', 'input/blindtest-blade-runner.txt' or die; print $o $text; close $o;
open $o, '>:raw', 'input-arc/2026-10-27/_blindtest/aufloesung.txt' or die; print $o $loesung; close $o;
my $w = () = $text =~ /\S+/g; print "geschrieben, $w Wörter\n";
