# Begrenzt einzeilige CSS-Regeln auf .erklaert (auch innerhalb von @media); @keyframes und Kommentare bleiben.
use strict; use warnings; use utf8;
binmode STDIN, ':encoding(UTF-8)'; binmode STDOUT, ':encoding(UTF-8)';
sub begrenzen {
  my $s = shift;
  return $s if $s =~ /^\s*(from|to|\d+%)/;
  return join(', ', map { my $x = $_; $x =~ s/^\s+|\s+$//g; ".erklaert $x" } split(/,/, $s));
}
while (my $z = <STDIN>) {
  next if $z =~ /<\/style>/;
  if ($z =~ /^\s*\@keyframes/ || $z =~ /^\s*\/\*/ || $z =~ /^\s*$/) { print $z; next; }
  $z =~ s/(^|[{}])(\s*)([^{}\@;]+?)\s*\{/$1.$2.begrenzen($3).'{'/ge;
  print $z;
}
