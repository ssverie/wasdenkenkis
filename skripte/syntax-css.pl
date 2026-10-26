# Schreibt assets/css/syntax.css (Syntax-Hervorhebung der IT-Übungen) aus den Chroma-Stilen von Hugo:
#   perl skripte/syntax-css.pl > assets/css/syntax.css
# Hell = github, dunkel = github-dark (in @media prefers-color-scheme: dark). Hintergrund und Grundfarbe kommen von
# der Seite, darum ohne Background/PreWrapper. Wichtig: Färbt das helle Schema eine Klasse, das dunkle aber nicht
# (z. B. .n für Namen, .p für Satzzeichen), bliebe im Dunkeln die helle, dunkle Farbe stehen – solche Klassen
# bekommen im dunklen Teil „color: inherit“ (gefunden am 2026-10-26: Klammern und println fast unsichtbar).
use strict; use warnings;
my $hugo = 'tools/hugo.exe';
sub regeln {
  my $stil = shift;
  my @r;
  for (`$hugo gen chromastyles --style=$stil`) {
    s/\r?\n\z//;
    next if /^\/\* Generated/ || /\/\* (Background|PreWrapper) \*\// || /^\s*$/;
    push @r, $_;
  }
  return @r;
}
my @hell = regeln('github');
my @dunkel = regeln('github-dark');
my $selektor = sub { my ($s) = $_[0] =~ /\*\/\s*(.*?)\s*\{/; return $s // '' };
my %im_dunkeln = map { $selektor->($_) => 1 } @dunkel;
my @ergaenzt = map { my $s = $selektor->($_); ($s && !$im_dunkeln{$s} && /color:/) ? "/* zurück auf Grundfarbe */ $s { color: inherit }" : () } @hell;

print "/* Syntax-Hervorhebung (Chroma, von Hugo beim Bauen erzeugt – kein Skript im Browser).\n",
      "   Erzeugt mit: perl skripte/syntax-css.pl > assets/css/syntax.css (hell: github, dunkel: github-dark).\n",
      "   Eingebunden in layouts/uebung.html. Nicht von Hand ändern. */\n";
print "$_\n" for @hell;
print "\@media (prefers-color-scheme: dark) {\n";
print "  $_\n" for @ergaenzt, @dunkel;
print "}\n";
