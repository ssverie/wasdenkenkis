+++
title = "Huffman-Komprimierung (Algorithmus 5.10)"
description = "Die Huffman-Komprimierung aus Sedgewick/Wayne, Algorithmus 5.10 (Listing 5.33 bis 5.40) – Häufigkeiten zählen, mit einer Min-Vorrangwarteschlange den Trie bauen, Codewörter ablesen, Trie und Text als Bitfolge schreiben und mit expand() wieder lesen, am Beispiel ABRACADABRA! wie in Abbildung 5.65."
date = 2026-10-28T21:14:00+01:00
reihenfolge = 600
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.10 (Listing 5.33 bis 5.40)"
+++

{{< spiel src="/apps/huffman.html" titel="Huffman-Komprimierung – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft abra.txt mit ABRACADABRA!, das Beispiel aus Abbildung 5.65. Oben steht die Eingabe. Die App geht `compress()` Abschnitt für Abschnitt durch, „Bis fertig“ springt jeweils ans Ende eines Abschnitts. **Zählen:** Die Tabelle rechts füllt sich mit `freq`. **buildTrie:** Das Bild zeigt alle Bäume, die gerade in der Vorrangwarteschlange stehen, mit ihrer Häufigkeit. Darunter steht der Heap `pq[1..n]`, in dem z. B. {!C}:2 ein Baum mit den Blättern ! und C ist. Orange umrandet sind die beiden Bäume x und y, die `delMin()` gerade herausgenommen hat. **buildCode:** Der Weg von der Wurzel ist das Codewort, die Tabelle bekommt die Spalte „Code“. **Schreiben:** Unten erscheint die Ausgabe Bit für Bit. Blau sind die Knotenbits des Tries, dahinter je Blatt das Zeichen in 8 Bit, grau die Anzahl in 32 Bit. Die Codewörter sind abwechselnd orange und lila, damit man sieht, wo eins aufhört. **expand:** Der Empfänger liest dieselben Bits wieder. Der Trie entsteht neu, diesmal ohne `freq`, und jedes Codewort führt von der Wurzel zu einem grünen Blatt. Rechts unten steht die Konsole wie in Abbildung 5.69. „tinytinyTale.txt“ ist das zweite Beispiel aus dieser Abbildung. Eigene Texte dürfen ASCII-Zeichen ohne Umlaute enthalten, z. B. MISSISSIPPI.

## Erklärung

Huffman-Komprimierung (Algorithmus 5.10), Klasse `Huffman`. Abschnitt 5.5, Datenkomprimierung.

Idee: Normalerweise belegt jedes Zeichen 8 Bit. Huffman gibt häufigen Zeichen kurze Bitfolgen und seltenen lange. Im Durchschnitt wird es kürzer.

Präfixfreier Code: Damit man beim Dekodieren weiß, wo ein Zeichen endet, darf kein Code der Anfang eines anderen sein. Das erreicht man mit einem Trie [\[46\]]({{< relref "trie" >}}):

* Blätter sind die Zeichen.
* Der Weg von der Wurzel zum Blatt ist der Code: links = 0, rechts = 1.
* Weil Zeichen nur an Blättern sitzen, ist automatisch kein Code Präfix eines anderen.

`compress()` in sechs Schritten:

1. Eingabe komplett einlesen.
2. Häufigkeiten zählen (`freq[]`), wie beim schlüsselindizierten Zählen [\[43\]]({{< relref "lsd" >}}).
3. Trie bauen (`buildTrie`, hier nicht abgedruckt): Jedes vorkommende Zeichen wird ein Einzelknoten mit seiner Häufigkeit, alle kommen in eine Min-Vorrangwarteschlange [\[12\]]({{< relref "heap" >}}). Dann immer die zwei seltensten herausnehmen, unter einem neuen Knoten zusammenfassen (Häufigkeit = Summe) und den wieder einfügen. Bis nur noch einer übrig ist, die Wurzel.
4. Codetabelle (`buildCode`): Trie rekursiv durchlaufen, den Pfad als String aus 0 und 1 mitführen, am Blatt eintragen. Danach ist Kodieren ein einfaches Nachschlagen.
5. Trie ausgeben (`writeTrie`), denn der Empfänger braucht ihn zum Dekodieren. In Präorder: Blatt = Bit 1 plus das Zeichen in 8 Bit, innerer Knoten = Bit 0. Dazu die Anzahl der Zeichen.
6. Eingabe kodieren: Für jedes Zeichen seinen Code nachschlagen und Bit für Bit schreiben.

`expand()` (im Text, hier nicht abgedruckt): Trie einlesen, Länge einlesen. Dann für jedes Zeichen an der Wurzel beginnen, je nach Bit links oder rechts gehen, bis ein Blatt erreicht ist, Zeichen ausgeben, wieder zur Wurzel.

Beispiel (eigene Rechnung): ABRACADABRA! hat A 5×, B 2×, R 2×, C, D, ! je 1×.

* Zusammenfassen: zwei Einer → 2, Einer + Zweier → 3, B + R → 4, 3 + 4 → 7, A + 7 → 12 (Wurzel).
* A bekommt 1 Bit, B und R je 3, die drei Seltenen 3 bzw. 4 Bit.
* Kodierte Nutzdaten: 28 Bit statt 12 · 8 = 96. Bei so einer kurzen Eingabe frisst allerdings der mitgeschickte Trie den Gewinn wieder auf. Bei längeren Texten fällt er nicht mehr ins Gewicht.

Satz im Buch: Der Huffman-Code ist ein optimaler präfixfreier Code. Kein anderer präfixfreier Code mit Einzelzeichen kodiert diese Eingabe in weniger Bits. Beweis per Induktion: Die beiden seltensten Zeichen können in einem optimalen Code immer Geschwister ganz unten sein.

Kosten: Kodieren proportional zu N + R log R (Häufigkeiten zählen, Heap mit bis zu R Knoten). Zwei Durchgänge über die Eingabe nötig: einmal zählen, einmal kodieren.

Einordnung:

* Wirkt bei Text typischerweise mit Einsparungen um die 40 %, abhängig von der Zeichenverteilung.
* Schwäche: Kodiert nur einzelne Zeichen. Wiederholte Folgen wie ganze Wörter nutzt Huffman nicht aus. Genau das macht LZW, der nächste Algorithmus 5.11.
* Huffman steckt in Formaten wie JPEG, MP3 und ZIP (dort kombiniert mit LZ-Verfahren).

Kapitel 5 bisher:

* Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
* Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
* Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
* Algorithmus 5.4: Trie-Symboltabelle [\[46\]]({{< relref "trie" >}})
* Algorithmus 5.5: TST-Symboltabelle [\[47\]]({{< relref "tst" >}})
* Algorithmus 5.6: Knuth-Morris-Pratt [\[48\]]({{< relref "kmp" >}})
* Algorithmus 5.7: Boyer-Moore [\[49\]]({{< relref "boyer-moore" >}})
* Algorithmus 5.8: Rabin-Karp [\[50\]]({{< relref "rabin-karp" >}})
* Algorithmus 5.9: Reguläre Ausdrücke mit NEA [\[51\]]({{< relref "nfa" >}})
* Algorithmus 5.10: Huffman-Komprimierung [52]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Mit dem Heap aus Algorithmus 2.6 kommt für ABRACADABRA! genau der Trie aus Abbildung 5.65 heraus: A 0, D 100, ! 1010, C 1011, R 110, B 111. Die Rechnung der Instanz stimmt, auch die 28 Bit Nutzdaten. Bei gleicher Häufigkeit entscheidet die Lage im Heap, welcher Baum zuerst herauskommt, darum ist R links von B und ! links von C. Die ganze Ausgabe hat 120 Bit wie im Testfall von Abbildung 5.69: 59 Bit Trie, 32 Bit Anzahl, 28 Bit Codewörter und 1 Füllbit bis zum vollen Byte. Bei tinytinyTale.txt stimmen alle sechs Zeilen der Bitfolge in Abbildung 5.69 mit der Ausgabe hier überein, 352 Bit.

**Drei Ungereimtheiten in Abbildung 5.69:** Beim Testfall abra.txt steht in der ersten Zeile der Bitfolge an der Stelle des „!“ das Zeichen 00001010, das ist das Zeilenende. Die Bits im Buch stammen also aus einer Datei „ABRACADABRA“ mit Zeilenende, obwohl darüber „ABRACADABRA!“ steht. Der Trie hat dieselbe Form, weil das Zeilenende wie „!“ einmal vorkommt und vor A sortiert ist. Darum ist die zweite Zeile gleich. Mit dieser Eingabe liefert die App auch die erste Zeile aus dem Buch Bit für Bit. Beim Beispiel tinytinyTale.txt steht „352/404 = 86%, auch wenn 137 Bits für den Trie“.

- Der Text hat 51 Zeichen mit Zeilenende, also 408 Bit, wie die Überschrift „Beispiel aus dem Text (408 Bits)“ sagt. 352/408 sind die 86 %.
- Der Trie braucht 139 Bit, nicht 137. Er hat 14 Blätter zu je 9 Bit und 13 innere Knoten zu je 1 Bit. Allgemein braucht ein Trie mit L Blättern 10·L − 1 Bit, 137 ist damit gar nicht möglich. Die 352 Bit setzen sich zusammen aus 139 Bit Trie, 32 Bit Anzahl, 176 Bit Codewörtern und 5 Füllbits.

**Zum Text:** `buildTrie` und `expand()` sind im Buch abgedruckt, als Listing 5.37 und 5.34, und stehen in der App im Java-Code. Die „um die 40 %“ Einsparung sind eher vorsichtig. In Abbildung 5.69 schrumpft das erste Kapitel von „A Tale of Two Cities“ auf 53 % und der ganze Roman auf 52 %. Das sind etwa 47 bis 48 % Ersparnis.

**Code:** Der Java-Code ist der aus den Listings: `Node` aus 5.33, `expand()` aus 5.34, `buildCode` aus 5.35, `buildTrie` aus 5.37, `writeTrie` aus 5.38, `readTrie` aus 5.39 und `compress()` aus 5.40. Von `buildCode` steht nur die rekursive Fassung da, denn `compress()` ruft sie in Listing 5.40 direkt auf. `main()` ist von mir, so wie die Aufrufe `java Huffman -` und `java Huffman +` in Abbildung 5.69. `MinPQ` steht nicht im Buch. Die App nimmt `MaxPQ` aus Algorithmus 2.6 [\[12\]]({{< relref "heap" >}}) mit umgedrehtem Vergleich. `BinaryStdIn` und `BinaryStdOut` sind in der App eine Kette von Bits: Ein `char` sind 8 Bit, ein `int` 32 Bit, und `close()` füllt mit Nullen bis zum vollen Byte auf.

**Tests:** Geprüft habe ich mit Java 21 und 1000 Zufallstexten mit bis zu 40 Zeichen aus bis zu zehn Buchstaben, ungleich verteilt. Java und Visualisierung schreiben jedes Mal dieselben Bits, und `expand()` liefert jedes Mal genau die Eingabe zurück.
{{< /anmerkung >}}
