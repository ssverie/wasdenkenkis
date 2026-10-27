# Wandelt eine .docx-Datei wortgetreu in Markdown um (Text unverändert) – Perl-Fassung von docx2md.ps1 (seit 2026-10-27,
# weil PowerShell-Skripte unter Windows standardmäßig gesperrt sind und wir die Sperre nicht aufheben).
# Übernimmt: Überschriften (Title/Heading1-3), nummerierte und Aufzählungslisten, Links, Fett/Kursiv, Tabellen.
# Absätze mit Formatvorlage "Subtitle" werden kursiv.
#
# Aufruf:  perl skripte/docx2md.pl <datei.docx> [Ebene] > ausgabe.md
#   Ebene: um wie viele Stufen Überschriften tiefer gesetzt werden (Heading1 -> ## bei 1), Standard 1
use strict; use warnings;
use IO::Uncompress::Unzip qw(unzip $UnzipError);
use Encode qw(decode);

my $docx = shift or die "Aufruf: perl skripte/docx2md.pl <datei.docx> [Ebene]\n";
my $ebene = shift // 1;
binmode STDOUT, ':encoding(UTF-8)';

sub lies {
  my $name = shift; my $daten;
  unzip($docx => \$daten, Name => $name) or return undef;
  return decode('UTF-8', $daten);
}
my $doc  = lies('word/document.xml') // die "$docx: kein word/document.xml ($UnzipError)\n";
my $rels = lies('word/_rels/document.xml.rels') // '';
my $num  = lies('word/numbering.xml') // '';

sub xml { my $s = shift; $s =~ s/&lt;/</g; $s =~ s/&gt;/>/g; $s =~ s/&quot;/"/g; $s =~ s/&apos;/'/g;
  $s =~ s/&#x([0-9a-fA-F]+);/chr(hex $1)/ge; $s =~ s/&#(\d+);/chr($1)/ge; $s =~ s/&amp;/&/g; return $s; }

# Link-Ziele
my %links;
$links{$1} = xml($2) while $rels =~ /Id="(rId\d+)"[^>]*Target="([^"]+)"/g;

# Listenart je numId (decimal = nummeriert, sonst Aufzählung)
my (%abstrakt, %listenArt);
while ($num =~ m{<w:abstractNum\b[^>]*w:abstractNumId="(\d+)"[^>]*>(.*?)</w:abstractNum>}sg) {
  my ($id, $inhalt) = ($1, $2);
  my ($fmt) = $inhalt =~ m{<w:lvl\b[^>]*w:ilvl="0"[^>]*>.*?<w:numFmt\b[^>]*w:val="([^"]+)"}s;
  $abstrakt{$id} = $fmt // 'bullet';
}
while ($num =~ m{<w:num\b[^>]*w:numId="(\d+)"[^>]*>(.*?)</w:num>}sg) {
  my ($id, $inhalt) = ($1, $2);
  my ($abs) = $inhalt =~ m{<w:abstractNumId\b[^>]*w:val="(\d+)"};
  $listenArt{$id} = defined $abs ? ($abstrakt{$abs} // 'bullet') : 'bullet';
}

sub maskiere { my $t = shift; $t =~ s/([\\`*_~|<>\[\]])/\\$1/g; return $t; }
sub an { my ($rpr, $tag) = @_; return $rpr =~ m{<w:$tag(?=[\s/>])(?![^>]*w:val="(?:0|false)")[^>]*/?>}; }

sub lauf {
  my $r = shift;
  my $t = '';
  while ($r =~ m{<w:t\b[^>]*>(.*?)</w:t>|<w:t\b[^>]*/>|<w:(tab|br)\b[^>]*/>}sg) {
    if (defined $2) { $t .= ' ' } elsif (defined $1) { $t .= xml($1) }
  }
  return '' unless length $t;
  $t = maskiere($t);
  my ($rpr) = $r =~ m{<w:rPr>(.*?)</w:rPr>}s; $rpr //= '';
  if ($t =~ /\S/) {
    $t = "**$t**" if an($rpr, 'b');
    $t = "*$t*" if an($rpr, 'i');
  }
  return $t;
}
sub lauftext {
  my $p = shift;
  my $aus = '';
  while ($p =~ m{(<w:hyperlink\b([^>]*)>(.*?)</w:hyperlink>)|(<w:r\b[^>]*>.*?</w:r>)}sg) {
    if (defined $1) {
      my ($attr, $inhalt) = ($2, $3);
      my $text = lauftext($inhalt);
      my ($rid) = $attr =~ /r:id="([^"]+)"/;
      $aus .= ($rid && exists $links{$rid}) ? "[$text]($links{$rid})" : $text;
    } else {
      $aus .= lauf($4);
    }
  }
  $aus =~ s/\*\*\*\*//g;   # aneinanderstoßende Fett-Läufe verbinden ("**a****b**" -> "**ab**")
  return $aus;
}
sub trim { my $s = shift; $s =~ s/^\s+|\s+$//g; return $s; }

my ($body) = $doc =~ m{<w:body>(.*)</w:body>}s or die "$docx: kein <w:body>\n";
my @aus; my %zaehler; my $letzteListe;
while ($body =~ m{(<w:tbl>.*?</w:tbl>)|(<w:p\b[^>]*/>)|(<w:p\b[^>]*>.*?</w:p>)}sg) {
  if (defined $1) {
    my $tbl = $1;
    if (defined $letzteListe) { push @aus, ''; undef $letzteListe; }
    my $erste = 1;
    while ($tbl =~ m{<w:tr\b[^>]*>(.*?)</w:tr>}sg) {
      my $tr = $1; my @zellen;
      while ($tr =~ m{<w:tc\b[^>]*>(.*?)</w:tc>}sg) {
        my $tc = $1; my @ps;
        push @ps, trim(lauftext($1)) while $tc =~ m{<w:p\b[^>]*>(.*?)</w:p>}sg;
        (my $z = join(' ', @ps)) =~ s/\|/\\|/g;
        push @zellen, $z;
      }
      push @aus, '| ' . join(' | ', @zellen) . ' |';
      if ($erste) { push @aus, '|' . join('|', ('---') x @zellen) . '|'; $erste = 0; }
    }
    push @aus, '';
    next;
  }
  next if defined $2;
  my $p = $3;
  my $text = trim(lauftext($p));
  next unless length $text;
  my ($stil) = $p =~ m{<w:pStyle\b[^>]*w:val="([^"]+)"}; $stil //= '';
  my ($numId) = $p =~ m{<w:numPr>.*?<w:numId\b[^>]*w:val="(\d+)"}s;
  my ($nid, $art);
  if ($stil eq 'ListNumber' && !defined $numId) { ($art, $nid) = ('decimal', 'ListNumber') }
  elsif ($stil eq 'ListBullet' && !defined $numId) { ($art, $nid) = ('bullet', 'ListBullet') }
  elsif (defined $numId) { $nid = $numId; $art = $listenArt{$nid} // 'bullet' }
  if (defined $nid) {
    if (!defined $letzteListe || $letzteListe ne $nid) { push @aus, '' if @aus && $aus[-1] ne ''; $zaehler{$nid} = 0; }
    $zaehler{$nid}++;
    my $marke = $art eq 'decimal' ? "$zaehler{$nid}." : '-';
    push @aus, "$marke $text"; $letzteListe = $nid; next;
  }
  if (defined $letzteListe) { push @aus, ''; undef $letzteListe; }
  if ($stil =~ /^(?:Title|Heading(\d))$/) {
    my $stufe = $stil eq 'Title' ? 1 : $1;
    (my $h = $text) =~ s/\\//g;
    push @aus, ('#' x ($stufe + $ebene > 6 ? 6 : $stufe + $ebene)) . " $h", '';
  } elsif ($stil eq 'Subtitle') {
    push @aus, "*$text*", '';
  } else {
    push @aus, $text, '';
  }
}
my $ergebnis = join("\n", @aus);
$ergebnis =~ s/\n{3,}/\n\n/g;
print trim($ergebnis), "\n";
