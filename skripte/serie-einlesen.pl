#!/usr/bin/perl
# Baut Folgenbesprechungen einer Serie als Zweitstimmen ein (seit 2026-11-11; vorher je Staffel ein Wegwerf-Skript,
# Sven: „musst du es mal wieder refaktorieren?“ – „Alle drei“).
#
#   perl skripte/serie-einlesen.pl --ordner mad-men --serie mad-men-2007 --modell GPT --version GPT-6 \
#        --instanz "22.10.2026 - 21:05 - Filmserien" [--versalien tabelle.txt] [--ziel <ordner>] [--schreiben] <dateien…>
#
# Ohne --schreiben nur Prüfung und Bericht. Ziel: content/serienkritiken/<ordner>/s<SS>e<FF>-<modell klein>.md
# (--ziel nur für Tests). Folge aus dem Dateinamen: 7x08, 7,8, 5-01, s07e08.
#
# Zwei Lieferformate:
#  md   – [n] Modell / # Serie – S.F: Titel / *Untertitel* / ## Titel / Abschnitte ### oder ## / **Persönliche Bewertung: x / 10**
#  klar – Svens Kopie aus dem Chat: (evtl. „[n] Modell“ oder „Modell“) / Serie – S.F: … / Untertitel / Titel /
#         Überschriften „N. …“ fortlaufend ab 1 / „Persönliche Bewertung: x / 10“
# Regeln (CLAUDE.md, notizen/filme-serien-podcasts.md):
#  - Kopf weg; Titel -> title; Untertitel + „.“ -> description; Abschnitte -> „## “; Bewertung -> „## Persönliche Bewertung: …“
#  - „---“ weg; Byline „Modell · Datum“ bleibt; alles nach der Byline (Kopier-Reste wie „Als Nächstes: …“) weg und gemeldet
#  - Fließtextzeilen direkt untereinander (klar) mechanisch mit Leerzeile trennen, gemeldet
#  - Versalien-Zeilen (Mad Men): nur mit --versalien (Zeilen „ALT => Neu“), geprüft uc(neu) = alt (ß = SS); sonst Abbruch
#  - Wortvergleich Quelle (ohne Kopf und entfernte Zeilen, ohne # und *) <-> title + Text; Abweichung = Abbruch
#  - folgentitel aus einer vorhandenen Seite derselben Folge; date = Dateizeit; Bewertung mit Punkt in `wertung`
use strict; use warnings; use utf8;
use POSIX qw(strftime);
use Getopt::Long;
use Encode qw(decode);
binmode STDOUT, ':encoding(UTF-8)'; binmode STDERR, ':encoding(UTF-8)';
@ARGV = map { decode('UTF-8', $_) } @ARGV;

my %o = (ziel => '');
GetOptions(\%o, 'ordner=s', 'serie=s', 'modell=s', 'version=s', 'instanz=s', 'versalien=s', 'ziel=s', 'schreiben')
    or die "Optionen falsch\n";
for (qw(ordner serie modell version instanz)) { die "--$_ fehlt\n" unless defined $o{$_} }
die "keine Dateien angegeben\n" unless @ARGV;
my $quelle_ordner = "content/serienkritiken/$o{ordner}";
my $ziel = $o{ziel} || $quelle_ordner;
die "$quelle_ordner fehlt\n" unless -d $quelle_ordner;
my $endung = lc $o{modell};
my $M = quotemeta $o{modell};

# Versalien-Tabelle
my %versal;
if ($o{versalien}) {
    open my $v, '<:encoding(UTF-8)', $o{versalien} or die "$o{versalien}: $!";
    while (<$v>) { chomp; s/\r$//; next unless /\S/; my ($alt, $neu) = split / => /, $_, 2;
        my $probe = uc $neu; $probe =~ s/ß/SS/g; (my $a2 = $alt) =~ s/ß/SS/g;
        die "Versalien: „$neu“ ist nicht nur anders geschrieben als „$alt“\n" unless $probe eq $a2;
        $versal{$alt} = $neu; }
}
sub versal { my $l = shift; my $b = () = $l =~ /\p{L}/g; my $g = () = $l =~ /\p{Lu}/g; return $b > 3 && $g == $b; }
sub woerter { my $t = shift; $t =~ s/[#*]//g; return grep { length } split /\s+/, $t; }

# Folgentitel aus vorhandenen Seiten
my %folgentitel;
for my $f (glob("$quelle_ordner/s*.md")) {
    open my $fh, '<:encoding(UTF-8)', $f or die; my $t = do { local $/; <$fh> }; close $fh;
    my ($s) = $t =~ /^staffel = (\d+)$/m; my ($e) = $t =~ /^folge = (\d+)$/m; my ($ft) = $t =~ /^folgentitel = "(.*)"$/m;
    $folgentitel{"$s.$e"} //= $ft if defined $s && defined $e && defined $ft;
}

my ($fehler, $n) = (0, 0);
my @plan;
for my $f (@ARGV) {
    my ($st, $fo);
    if    ($f =~ /(\d+)x(\d+)/)          { ($st, $fo) = ($1, $2) }
    elsif ($f =~ m{(?:^|/)(\d+),(\d+)\.}) { ($st, $fo) = ($1, $2) }
    elsif ($f =~ m{(?:^|/)(\d+)-(\d+)\.}) { ($st, $fo) = ($1, $2) }
    elsif ($f =~ /s(\d+)e(\d+)/i)        { ($st, $fo) = ($1, $2) }
    else { die "$f: Staffel/Folge nicht im Dateinamen\n" }
    $st += 0; $fo += 0;
    open my $fh, '<:encoding(UTF-8)', $f or die "$f: $!";
    my @z = <$fh>; close $fh; chomp @z; s/\r$// for @z; s/^\x{FEFF}// for $z[0];
    my @quelle = @z;
    my (@kopf, $titel, $untertitel, @koerper, @entfernt, @meldung, $wertung, $byline_gesehen);
    my $art = (grep { /^# / } @z[0 .. ($#z < 6 ? $#z : 6)]) ? 'md' : 'klar';

    # Kopf
    while (@z && ($z[0] =~ /^\s*$/ || $z[0] =~ /^(\[\d+\] )?$M\S*\s*$/)) { push @kopf, shift @z }
    if ($art eq 'md') {
        while (@z && ($z[0] =~ /^\s*$/ || $z[0] =~ /^# / || $z[0] =~ /^\*[^*].*\*$/)) {
            ($untertitel) = $z[0] =~ /^\*(.+)\*$/ if $z[0] =~ /^\*[^*]/;
            push @kopf, shift @z;
        }
        my $tz = shift @z;   # Titelzeile zählt im Wortvergleich mit (steht als title auf der Seite)
        die "$f: Titelzeile „## …“ erwartet, gefunden „$tz“\n" unless $tz =~ /^## (.+)$/;
        $titel = $1;
    } else {
        my $k = shift @z; push @kopf, $k;
        die "$f: Kopfzeile „… $st.$fo: …“ erwartet, gefunden „$k“\n" unless $k =~ /\b$st\.$fo\b/;
        $untertitel = shift @z; push @kopf, $untertitel;
        push @kopf, shift @z while @z && $z[0] =~ /^\s*$/;
        $titel = shift @z;
    }
    $titel = $versal{$titel} // ($o{versalien} && versal($titel) ? die "$f: Titel in Versalien ohne Tabelleneintrag: $titel\n" : $titel);
    die "$f: Titel in Versalien – Tabelle mit --versalien angeben: $titel\n" if versal($titel);

    my $nr = 1; my $vorher_text = 0;
    for my $l (@z) {
        if ($byline_gesehen) { push @entfernt, $l if $l =~ /\S/; next; }
        if ($l =~ /^\s*(---|\*\*\*|___)\s*$/) { push @entfernt, $l; $vorher_text = 0; next; }
        if ($l =~ /^$M\S* · /) { push @koerper, '' if @koerper && $koerper[-1] ne ''; push @koerper, $l; $byline_gesehen = 1; next; }
        if ($l =~ /^(?:\*\*)?(Persönliche Bewertung: ([\d,]+) \/ 10\.?)(?:\*\*)?\s*$/) {
            ($wertung = $2) =~ tr/,/./;
            push @koerper, '' if @koerper && $koerper[-1] ne '';
            push @koerper, "## $1", ''; $vorher_text = 0; next;
        }
        my $ueber;
        if ($art eq 'md') { ($ueber) = $l =~ /^#{2,3} (.+)$/ }
        elsif ($l =~ /^$nr\. \S/) { $ueber = $l; $nr++ }
        if (defined $ueber) {
            if (versal($ueber)) {
                die "$f: Überschrift in Versalien – Tabelle mit --versalien angeben: $ueber\n" unless exists $versal{$ueber};
                $ueber = $versal{$ueber}; push @meldung, "Versalien: $ueber";
            }
            push @koerper, '' if @koerper && $koerper[-1] ne '';
            push @koerper, "## $ueber", ''; $vorher_text = 0; next;
        }
        if ($l =~ /^\s*$/) { push @koerper, ''; $vorher_text = 0; next; }
        die "$f: Zeile in Versalien – Tabelle mit --versalien angeben: $l\n" if versal($l) && !exists $versal{$l};
        if (exists $versal{$l}) { push @meldung, "Versalien: $versal{$l}"; $l = $versal{$l} }
        if ($vorher_text) { push @koerper, ''; push @meldung, 'Naht: ' . substr($l, 0, 60) }
        push @koerper, $l; $vorher_text = ($art eq 'klar');
    }
    die "$f: keine „Persönliche Bewertung“ gefunden\n" unless defined $wertung;
    my $text = join("\n", @koerper); $text =~ s/\n{3,}/\n\n/g; $text =~ s/^\s+//; $text =~ s/\s+$//;

    # Wortvergleich (Versalien-Zeilen in der Quelle durch die neue Schreibweise ersetzt)
    my %kopf_weg = map { $_ => 1 } @kopf; my $offen = 1; my @qw;
    for my $l (@quelle) {
        if ($offen && $kopf_weg{$l}) { next } $offen = 0;
        next if grep { $_ eq $l } @entfernt;
        my $x = $l; $x =~ s/^(?:\*\*)?(.*?)(?:\*\*)?$/$1/; $x =~ s/^#+ //;
        $x = $versal{$x} if exists $versal{$x};
        push @qw, woerter($x);
    }
    my @sw = (woerter($titel), woerter($text));
    my $gleich = join(' ', @qw) eq join(' ', @sw);
    unless ($gleich) {
        $fehler++;
        my $i = 0; $i++ while $i < @qw && $i < @sw && $qw[$i] eq $sw[$i];
        my $a = $i > 3 ? $i - 3 : 0;
        print "      Wortvergleich ab Wort $i: Quelle „", join(' ', grep { defined } @qw[$a .. $i + 4]),
              "“ – Seite „", join(' ', grep { defined } @sw[$a .. $i + 4]), "“\n";
    }

    my $ft = $folgentitel{"$st.$fo"} // die "$f: kein folgentitel für $st.$fo in $quelle_ordner\n";
    my $datum = strftime('%Y-%m-%dT%H:%M:00%z', localtime((stat $f)[9])); $datum =~ s/(\d\d)$/:$1/;
    my $beschr = ($untertitel // 'Meine subjektive Betrachtung') . '.';
    (my $tq = $titel) =~ s/(["\\])/\\$1/g;
    my $nummer = sprintf '%d%02d', $st, $fo;
    my $seite = "+++\ntitle = \"$tq\"\ndescription = \"$beschr\"\ndate = $datum\nmodelle = [\"$o{modell}\"]\n"
        . "modell = \"$o{version}\"\ninstanz = \"$o{instanz}\"\nherkunft = \"eingebracht\"\nserien = [\"$o{serie}\"]\n"
        . "staffel = $st\nfolge = $fo\nnummer = $nummer\nfolgentitel = \"$ft\"\nzweitstimme = true\nwertung = \"$wertung\"\n+++\n\n$text\n";
    my $datei = sprintf '%s/s%02de%02d-%s.md', $ziel, $st, $fo, $endung;
    printf "%d.%-2d %-4s %-9s %5d Wörter  Wertung %-4s %s  %s\n", $st, $fo, $art, ($gleich ? 'gleich' : 'UNGLEICH'),
        scalar(@sw), $wertung, $datum, ($byline_gesehen ? 'mit Byline' : 'ohne Byline');
    print "      Kopf weg: ", join(' / ', grep { /\S/ } @kopf[0 .. ($#kopf > 1 ? 1 : $#kopf)]), "\n";
    print "      entfernt: ", join(' / ', @entfernt), "\n" if @entfernt;
    print "      $_\n" for @meldung;
    push @plan, [$datei, $seite];
    $n++;
}
print "$n Dateien, Fehler: $fehler\n";
exit 1 if $fehler;
if ($o{schreiben}) {
    for (@plan) { open my $out, '>:encoding(UTF-8)', $_->[0] or die "$_->[0]: $!"; print $out $_->[1]; close $out; }
    print "geschrieben nach $ziel\n";
}
