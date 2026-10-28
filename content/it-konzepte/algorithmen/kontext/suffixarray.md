+++
title = "Suffixarray (Algorithmus 6.2)"
description = "Das Suffixarray aus Sedgewick/Wayne, Algorithmus 6.2 (Listing 6.9 mit lcp() aus Listing 6.6) – alle Suffixe sortieren, den längsten sich wiederholenden Teilstring über benachbarte Suffixe finden (Listing 6.7) und mit rank() und Binärsuche Schlüsselwörter im Kontext suchen (Listing 6.8), am Beispiel aus Abbildung 6.14."
date = 2026-10-28T22:19:00+01:00
reihenfolge = 620
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 6.2 (Listing 6.6 bis 6.9)"
+++

{{< spiel src="/apps/suffixarray.html" titel="Suffixarray – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Text aus Abbildung 6.14, „it was the best of times it was the“. Oben steht der Text mit den Positionen, darunter die Tabelle. Zuerst zeigt sie die Suffixe in Textreihenfolge, nach `Quick3way.sort` sortiert, mit `index(i)`. **LRS:** Für jedes i vergleicht `lcp(i)` das Suffix mit seinem Vorgänger. Der gemeinsame Anfang ist grün, das erste verschiedene Zeichen rot, und im Text oben sind beide Stellen grün markiert. Danach zeigt die App `select(9)`, `index(9)` und `lcp(20)` wie in der Abbildung. **KWIC:** `rank("th")` sucht binär, der blaue Bereich ist lo bis hi, orange ist mid. Grün sind die Treffer, gelb im Text der Ausschnitt, den KWIC ausgibt. „tinyTale.txt“ ist das LRS-Beispiel aus dem Buch, „banana“ das Beispiel der Instanz. Unter „ausführen“ kann man einen eigenen Text, eine Abfrage und die Zahl der Kontextzeichen eingeben. „Bis fertig“ springt jeweils ans Ende eines Abschnitts.

## Erklärung

**Suffixarray (Algorithmus 6.2)**, Klasse `SuffixArray`. Kapitel 6 „Im Kontext“, Abschnitt über Stringverarbeitung. Ein Suffixarray ist eine Struktur, mit der man sehr schnell Fragen über alle Teilstrings eines langen Texts beantworten kann.

**Idee:**
- Ein **Suffix** ist ein Endstück des Texts ab einer Position i.
- Alle N Suffixe werden erzeugt und **sortiert**.
- Jeder Teilstring des Texts ist der Anfang (Präfix) eines Suffixes. Nach dem Sortieren stehen Suffixe mit gleichem Anfang direkt untereinander. Damit wird Suchen eine binäre Suche, und Wiederholungen findet man unter benachbarten Einträgen.

**Kleines Beispiel** (eigene Rechnung), Text „banana“:

| i | Suffix (sortiert) | index(i) | lcp(i) |
|---|---|---|---|
| 0 | a | 5 | – |
| 1 | ana | 3 | 1 |
| 2 | anana | 1 | 3 |
| 3 | banana | 0 | 0 |
| 4 | na | 4 | 0 |
| 5 | nana | 2 | 2 |

**Der Code:**
- Konstruktor: `suffixes[i] = s.substring(i)` für alle i, dann sortieren mit `Quick3way.sort`. Das ist das 3-Wege-Quicksort aus Kapitel 2.3, eine Variante von [\[11\]]({{< relref "quicksort" >}}), die gut mit vielen gleichen Anfängen zurechtkommt.
- `length()`: N.
- `select(i)`: das i-kleinste Suffix.
- `index(i)`: wo dieses Suffix im Originaltext beginnt. Trick: Ein Suffix der Länge k beginnt an Position N − k, also `N − suffixes[i].length()`.
- `lcp(i)` (longest common prefix): Länge des gemeinsamen Anfangs von Suffix i und seinem Vorgänger i − 1. Die Hilfsmethode `lcp(s, t)` (Listing 6.6) vergleicht einfach Zeichen für Zeichen, bis sie sich unterscheiden.
- `rank(key)`: Anzahl der Suffixe, die kleiner als `key` sind. Das ist Wort für Wort die binäre Suche aus `BinarySearchST` [\[23\]]({{< relref "binaere-suche-st" >}}).

**Anwendung 1: längster sich wiederholender Teilstring** (LRS)
- Gesucht: die längste Zeichenfolge, die mindestens zweimal im Text vorkommt.
- Brute Force: jedes Paar von Positionen vergleichen, mindestens quadratisch. Für ein Genom oder ein ganzes Buch nicht machbar.
- Mit Suffixarray: sortieren, dann das größte `lcp(i)` suchen. Zwei Suffixe mit langem gemeinsamem Anfang stehen nach dem Sortieren zwangsläufig nebeneinander.
- Bei „banana“: maximales lcp ist 3 bei i = 2, der längste wiederholte Teilstring ist also **ana**.

**Anwendung 2: KWIC** (keyword in context, Schlüsselwort im Kontext)
- Gesucht: alle Vorkommen eines Suchbegriffs mit etwas Text links und rechts davon, wie eine Konkordanz.
- `rank(query)` liefert das erste Suffix ≥ query. Von dort weiterlaufen, solange die Suffixe mit `query` beginnen. `index(i)` liefert jeweils die Textposition, um den Kontext auszugeben.
- Nach einmaligem Sortieren kostet jede Suche nur noch etwa lg N Stringvergleiche.

**Kosten:**
- Sortieren mit 3-Wege-Quicksort: für typische Texte etwa 2 N ln N Zeichenvergleiche. Meist reichen wenige Anfangszeichen, um zwei Suffixe zu unterscheiden.
- Schlimmster Fall: Texte mit sehr langen Wiederholungen, etwa „aaaa…a“ oder ein Text, der zweimal hintereinander steht. Dann müssen Vergleiche weit in die Suffixe hineinlesen und das Sortieren wird quadratisch.
- `rank`: lg N Stringvergleiche.

**Die Fußnote ist wichtig.** Die Eleganz des Codes beruht darauf, dass `substring()` in alten Java-Versionen in konstanter Zeit und mit konstantem Speicher lief: Ein Teilstring war nur ein Verweis auf das Original plus Anfang und Länge. Seit Java 7 Update 6 kopiert `substring()` die Zeichen. Dann braucht schon das Erzeugen aller Suffixe etwa N²/2 Zeichen an Zeit und Speicher, bei einem Text mit einer Million Zeichen also rund 500 Milliarden Zeichen. Heute speichert man deshalb nur die **Startindizes** (`int[]`) und vergleicht über `charAt(i + d)` direkt im Originaltext.

**Verbesserungen** (im Buch erwähnt): Es gibt Verfahren, die das Suffixarray auch im schlimmsten Fall schnell aufbauen, etwa Manber-Myers mit N log N, sowie inzwischen auch lineare Algorithmen. Sie werden in der Bioinformatik (Genomvergleich), Volltextsuche und Datenkomprimierung eingesetzt, z. B. bei der Burrows-Wheeler-Transformation in bzip2.

**Bezüge zu früheren Algorithmen:**
- Sortieren: 3-Wege-Quicksort (Kapitel 2.3), verwandt mit [\[45\]]({{< relref "quick3string" >}}).
- `rank`: binäre Suche aus [\[23\]]({{< relref "binaere-suche-st" >}}).
- Gegenüber Tries [\[46\]]({{< relref "trie" >}}), [\[47\]]({{< relref "tst" >}}): Ein Suffixtrie kann dasselbe, braucht aber ein Vielfaches an Speicher. Das Suffixarray ist die platzsparende Variante.

**Kapitel 6 bisher:**
- Algorithmus 6.1: B-Baum [\[54\]]({{< relref "btree" >}})
- Algorithmus 6.2: Suffixarray [55]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Für den Text aus Abbildung 6.14 stimmen alle 35 Zeilen der Tabelle, `index(i)` und `lcp(i)`. Auch die Markierungen der Abbildung kommen so heraus:

- `select(9)` ist „as the best of times it was the“ mit `index(9)` = 4.
- `lcp(20)` ist 10, der längste wiederholte Teilstring ist „it was the“.
- `rank("th")` ist 30. Die Binärsuche läuft dabei über die Bereiche 0–34, 18–34, 27–34, 27–29 und 29–29.

Die „banana“-Tabelle der Instanz stimmt ebenfalls.

**LRS mit tinyTale.txt:** Im Buch steht als Ausgabe „st of times it was the“. Listing 6.7 liest den Text aber mit `StdIn.readAll()` unverändert, mit den Zeilenenden. Dann kommt „it was the season of “ heraus, 21 Zeichen, so zeigt es auch die App. Denn das zweite „…st of times“ steht am Zeilenende, „worst of times“, und danach folgt ein Zeilenende statt eines Leerzeichens. Ersetzt man vorher jeden Leerraum durch ein Leerzeichen, wie KWIC es tut, kommt die Ausgabe aus dem Buch heraus, mit einem Leerzeichen am Ende. Beides habe ich mit Java nachgerechnet. Die Buchausgabe stammt also wohl von einer Fassung, die den Text so vorbereitet.

**KWIC:** In Listing 6.8 steht `Math.min(N-1, …)`. Dadurch gibt `substring(from, to)` das letzte Zeichen des Texts nie aus. Bei Abbildung 6.14 mit „th“ und 5 Kontextzeichen endet die erste Zeile deshalb mit „th“ statt „the“. Die App macht es wie im Listing. Das Beispiel aus dem Buch mit tale.txt, dem ganzen Roman, kann ich nicht nachrechnen, die Datei liegt mir nicht vor.

**Code:** Der Java-Code ist der aus Listing 6.9. Statt des Verweises „Siehe Listing 6.6“ steht dort gleich `lcp(s, t)` aus Listing 6.6. Dazu kommen die beiden Clients aus Listing 6.7 und 6.8. `Quick3way.sort` ist Algorithmus 2.5 und steht nicht im Kasten. Jedes richtige Sortierverfahren liefert dasselbe Array, die App sortiert in einem Schritt.

**Tests:** Geprüft habe ich mit Java 21 und 400 Zufallstexten mit bis zu 51 Zeichen, auch mit vielen gleichen Zeichen und mehrfachen Leerzeichen, und je zwei Abfragen. Die Länge des LRS stimmt jedes Mal mit der Brute-Force-Lösung aus dem Buch überein, die alle Paare von Positionen vergleicht. Java und Visualisierung liefern jedes Mal dieselben Werte für `index(i)` und `lcp(i)`, denselben LRS und dieselbe KWIC-Ausgabe.
{{< /anmerkung >}}
