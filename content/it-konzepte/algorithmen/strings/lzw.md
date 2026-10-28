+++
title = "LZW-Komprimierung (Algorithmus 5.11)"
description = "Die LZW-Komprimierung aus Sedgewick/Wayne, Algorithmus 5.11 (Listing 5.41 und 5.42) – mit longestPrefixOf() im TST die längste bekannte Folge finden, ihr 12-Bit-Codewort schreiben und die Folge plus nächstes Zeichen neu eintragen; expand() baut die Tabelle beim Lesen wieder auf, samt der kniffligen Situation bei ABABABA."
date = 2026-10-28T21:29:00+01:00
reihenfolge = 610
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.11 (Listing 5.41 und 5.42)"
+++

{{< spiel src="/apps/lzw.html" titel="LZW-Komprimierung – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft abraLZW.txt mit ABRACADABRABRABRA, das Beispiel unter Listing 5.41. **compress():** Im Eingabeband ist der längste Präfix s grün, den `longestPrefixOf()` gefunden hat. Orange umrandet ist das nächste Zeichen, mit dem s als neue Folge in die Tabelle kommt. Darunter wachsen die Codewörter mit, blau sind die für ganze Folgen. Rechts steht die Codetabelle mit den gelernten Folgen ab 101 (hex). Die Einzelzeichen 00 bis FF und 100 für das Dateiende sind nicht aufgeführt. **expand():** Dieselben Codewörter werden wieder gelesen, das aktuelle ist orange. Die Tabelle entsteht dabei noch einmal, jeder Eintrag einen Schritt später als beim Komprimieren. „ababLZW.txt“ zeigt die knifflige Situation: Codewort 103 kommt an, bevor der Dekodierer es eingetragen hat. Die App zeigt das rot. Rechts unten steht die Konsole wie im Buch, mit dem HexDump. Eigene Texte dürfen ASCII-Zeichen ohne Umlaute enthalten. Wiederholungen lohnen sich, z. B. TOBEORNOTTOBEORTOBEORNOT.

## Erklärung

**LZW-Komprimierung (Algorithmus 5.11)**, Klasse `LZW` (Lempel-Ziv-Welch). Das Gegenstück zu Huffman [\[52\]]({{< relref "huffman" >}}): Huffman gibt einzelnen Zeichen Codes unterschiedlicher Länge. LZW gibt dagegen ganzen, sich wiederholenden **Zeichenfolgen** Codes **fester** Länge, und zwar 12 Bit.

**Grundidee:**
- Eine Codetabelle startet mit allen 256 Einzelzeichen.
- Beim Lesen wird immer die **längste** Zeichenfolge gesucht, die schon in der Tabelle steht, und deren Code ausgegeben.
- Danach kommt diese Folge **plus das nächste Zeichen** als neuer Eintrag in die Tabelle.
- Die Tabelle wird **nicht** mitgeschickt. Der Dekodierer baut sie beim Lesen genauso wieder auf. Bei Huffman musste der Trie dagegen mitgeschickt werden.

**Konstanten:**
- `R = 256`: Eingabezeichen (8 Bit).
- `L = 4096 = 2^12`: Anzahl möglicher Codewörter.
- `W = 12`: Breite eines Codeworts in Bit.
- Codewort `R` (hex 100) steht für Dateiende, neue Einträge beginnen bei R + 1 (hex 101).

**`compress()` (Listing 5.41):**
- Die Codetabelle ist ein TST [\[47\]]({{< relref "tst" >}}) mit `Integer` als Wert. Gewählt wurde er wegen `longestPrefixOf()` aus [\[46\]]({{< relref "trie" >}}): genau die Operation, die LZW braucht.
- Schleife:
  - `s = st.longestPrefixOf(input)`: längster bekannter Anfang der Resteingabe.
  - Seinen Code mit 12 Bit ausgeben.
  - Ist noch Eingabe übrig und die Tabelle nicht voll: `s` plus nächstes Zeichen mit dem nächsten freien Code eintragen.
  - Eingabe um `s` kürzen.
- Am Ende Codewort R für Dateiende.

**Ablauf ABRACADABRABRABRA** (eigene Nachrechnung, passt zum HexDump):

| Längster Präfix | Ausgabe | Neuer Eintrag |
|---|---|---|
| A | 041 | AB = 101 |
| B | 042 | BR = 102 |
| R | 052 | RA = 103 |
| A | 041 | AC = 104 |
| C | 043 | CA = 105 |
| A | 041 | AD = 106 |
| D | 044 | DA = 107 |
| AB | 101 | ABR = 108 |
| RA | 103 | RAB = 109 |
| BR | 102 | BRA = 10A |
| ABR | 108 | ABRA = 10B |
| A | 041 | – (Eingabe zu Ende) |
| EOF | 100 | |

- Der HexDump `04 10 42 05 20 41 …` ergibt in 3er-Gruppen gelesen genau 041 042 052 041 043 041 044 101 103 102 108 041 100.
- 13 Codewörter × 12 Bit sind 156 Bit. Es werden 160 ausgegeben, weil `close()` auf volle Bytes auffüllt.
- Unkomprimiert wären es 17 × 8 = 136 Bit. Bei so kurzen Texten lohnt LZW sich also nicht. Der Gewinn kommt erst bei langen Eingaben, wenn die Tabelle lange Folgen enthält.

**`expand()` (Listing 5.42):**
- Hier reicht ein einfaches `String[]` als Tabelle, denn man schlägt jetzt **vom Code zum String** nach, also über den Arrayindex.
- Einzelzeichen eintragen, Platz R für Dateiende freihalten.
- Schleife:
  - Aktuellen String `val` ausgeben.
  - Nächstes Codewort lesen, bei R Schluss.
  - `s = st[codeword]`.
  - Neuen Eintrag anlegen: `val` + erstes Zeichen von `s`.
  - `val = s`.
- Der Dekodierer läuft dem Kodierer **einen Schritt hinterher**. Das letzte Zeichen eines neuen Eintrags (das Vorausschauzeichen) kennt er erst, wenn er das nächste Codewort gelesen hat.

**Die knifflige Situation**, `if (i == codeword)`:
- Manchmal liest der Dekodierer ein Codewort, das er selbst noch gar nicht eingetragen hat. Der Kodierer hat es im Schritt davor angelegt und sofort benutzt.
- Beispiel ABABABA:
  - Kodierer gibt aus: 041 (A), 042 (B), 101 (AB) und legt dabei ABA = 103 an.
  - Dann gibt er 103 (ABA) aus.
  - Der Dekodierer hat beim Lesen von 103 erst bis 102 eingetragen.
- Lösung: Der fehlende Eintrag muss `val` plus ein Zeichen sein. Dieses Zeichen ist das erste Zeichen des nächsten Strings, und der beginnt selbst mit `val`. Also ist `s = val + val.charAt(0)`, hier AB + A = ABA.
- Das ist der Fehler, den das Buch als „subtil“ bezeichnet: Er tritt nur bei solchen Wiederholungsmustern auf und wird leicht übersehen.

**Kosten und Grenzen:**
- Komprimieren und Dekomprimieren in Zeit etwa proportional zur Eingabelänge. Jedes Eingabezeichen wird im TST bzw. Array nur einmal angefasst.
- Nach 4096 Einträgen ist die Tabelle voll. Dann werden keine neuen Folgen mehr gelernt, auch wenn sich die Daten ändern.
- Verbesserungen laut Buch (Übungen): Codewortbreite variabel wachsen lassen, die Tabelle bei Bedarf leeren und neu aufbauen.

**Huffman vs. LZW:**

| | Huffman (5.10) | LZW (5.11) |
|---|---|---|
| Kodiert | einzelne Zeichen | Zeichenfolgen |
| Codelänge | variabel | fest (12 Bit) |
| Tabelle | Trie, wird mitgeschickt | wird beim Dekodieren rekonstruiert |
| Durchgänge | zwei (zählen, kodieren) | einer |
| Nutzt | Zeichenhäufigkeiten | Wiederholungen |
| Einsatz | JPEG, MP3, in ZIP | GIF, TIFF, Unix `compress` |

**Kapitel 5 komplett:**
- Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
- Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
- Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
- Algorithmus 5.4: Trie-Symboltabelle [\[46\]]({{< relref "trie" >}})
- Algorithmus 5.5: TST-Symboltabelle [\[47\]]({{< relref "tst" >}})
- Algorithmus 5.6: Knuth-Morris-Pratt [\[48\]]({{< relref "kmp" >}})
- Algorithmus 5.7: Boyer-Moore [\[49\]]({{< relref "boyer-moore" >}})
- Algorithmus 5.8: Rabin-Karp [\[50\]]({{< relref "rabin-karp" >}})
- Algorithmus 5.9: Reguläre Ausdrücke mit NEA [\[51\]]({{< relref "nfa" >}})
- Algorithmus 5.10: Huffman-Komprimierung [\[52\]]({{< relref "huffman" >}})
- Algorithmus 5.11: LZW-Komprimierung [53]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die App schreibt für abraLZW.txt genau den HexDump unter Listing 5.41, `04 10 42 05 20 41 04 30 41 04 41 01 10 31 02 10 80 41 10 00`, 160 Bit. Die Tabelle der Instanz stimmt Zeile für Zeile, auch die Codewörter 101 bis 10B. Für ababLZW.txt ergeben sich die Codewörter 041 042 101 103 100, und beim Lesen von 103 tritt genau einmal die knifflige Situation auf. `expand()` gibt in beiden Fällen den Text zurück wie unter Listing 5.42.

**Zum Text:** Die Instanz schreibt, jedes Eingabezeichen werde im TST nur einmal angefasst. Für die Zeichen der Eingabe stimmt das, aber nicht für die Knoten im TST. Die 256 Einzelzeichen kommen der Reihe nach 0, 1, 2 … hinein. Die oberste Ebene des TST wird dadurch eine lange Kette nach rechts, wie ein BST nach sortiertem Einfügen. In der App zeigt jeder Aufruf von `longestPrefixOf()` die besuchten Knoten. Für das erste A sind es schon 66, für R 83. An der Zeit proportional zur Eingabe ändert das nichts, denn die Kette ist höchstens 256 Knoten lang. Es ist aber ein großer konstanter Faktor.

**Entfernt:** Vor dem Erklärtext stand im Chat „Die vorige Antwort ist leer geblieben, hier ist 5.11.“ – eine Bemerkung an Sven, nicht Teil des Textes.

**Code:** Der Java-Code ist der aus Listing 5.41 und 5.42, `main()` ist von mir wie bei Huffman. Die TST-Klasse ist die aus Algorithmus 5.5 [\[47\]]({{< relref "tst" >}}). `longestPrefixOf()` druckt das Buch nur für den Trie ab, als Listing 5.11. Für den TST habe ich es nach diesem Vorbild umgebaut, es steht unten im Code-Kasten der App. Statt `x.next[c]` geht `search()` bei kleinerem oder größerem Zeichen nach links oder rechts, ohne `d` zu erhöhen. Nur bei Gleichheit geht es über `mid` weiter. Ein Wert am Knoten zählt hier als Schlüssel der Länge d + 1, beim Trie als Länge d. `BinaryStdIn` und `BinaryStdOut` sind in der App eine Kette von Bits: `write(x, W)` schreibt die unteren 12 Bit, `readInt(W)` liest 12 Bit, und `close()` füllt mit Nullen bis zum vollen Byte auf.

**Tests:** Geprüft habe ich mit Java 21 und 1000 Zufallstexten mit bis zu 60 Zeichen aus bis zu vier Buchstaben. In 803 davon kommt die knifflige Situation vor. Dazu kamen drei Texte mit 20.000 Zeichen aus 26 Buchstaben, bei denen die Tabelle mit 4096 Einträgen voll wird. Java und Visualisierung schreiben jedes Mal dieselben Bits, und `expand()` liefert jedes Mal genau die Eingabe zurück.
{{< /anmerkung >}}
