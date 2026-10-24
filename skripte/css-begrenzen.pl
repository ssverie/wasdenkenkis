# Begrenzt einzeilige CSS-Regeln auf .erklaert (auch innerhalb von @media); @keyframes und Kommentare bleiben.
use strict; use warnings; use utf8;
binmode STDIN, ':encoding(UTF-8)'; binmode STDOUT, ':encoding(UTF-8)';
sub begrenzen {
  my $s = shift;
  return $s if $s =~ /^\s*(from|to|\d+%)/;
  # Theme-Präfixe der Lieferung (:root[data-theme="dark"] X, :root:not([data-theme="light"]) X) bleiben vorn:
  # daraus wird ":root… .erklaert X" statt des nie greifenden ".erklaert :root… X" (IT-Reihe, 2026-10-25)
  return join(', ', map { my $x = $_; $x =~ s/^\s+|\s+$//g; $x =~ /^(:root\S*)\s+(.+)$/ ? "$1 .erklaert $2" : ".erklaert $x" } split(/,(?![^(]*\))/, $s));
}
while (my $z = <STDIN>) {
  next if $z =~ /<\/style>/;
  if ($z =~ /^\s*\@keyframes/ || $z =~ /^\s*\/\*/ || $z =~ /^\s*$/) { print $z; next; }
  $z =~ s/(^|[{}])(\s*)([^{}\@;]+?)\s*\{/$1.$2.begrenzen($3).'{'/ge;
  print $z;
}
