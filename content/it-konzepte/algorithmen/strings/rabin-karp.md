+++
title = "Rabin-Karp (Algorithmus 5.8)"
description = "Die Rabin-Karp-Fingerprint-Suche aus Sedgewick/Wayne, Algorithmus 5.8 (Listing 5.21 und 5.22) – Hash des Musters nach dem Horner-Schema, dann ein rollender Hash über den Text, am Zahlenbeispiel 26535 in 3141592653589793 wie in Abbildung 5.47."
date = 2026-10-28T20:13:00+01:00
reihenfolge = 580
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.8 (Listing 5.21 und 5.22)"
+++

{{< spiel src="/apps/rabin-karp.html" titel="Rabin-Karp – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft das Zahlenbeispiel aus dem Buch: Muster 26535 im Text 3141592653589793, gerechnet wie in Abbildung 5.47, also jede Ziffer als Zahl, R = 10 und Q = 997. Zuerst berechnet der Konstruktor RM = 10⁴ % 997 = 30 und den Hash des Musters nach dem Horner-Schema (Abbildung 5.45). Dann bekommen die ersten fünf Textzeichen ihren Hash. Danach rückt das Fenster Zeichen für Zeichen weiter: Die führende Ziffer fällt heraus (orange), die neue kommt dazu (blau), und rechts steht die Rechnung mit echten Zahlen. Sind die Hashwerte gleich, wird das Fenster grün. „Kollision“ zeigt, warum Monte Carlo irren kann. Im Text steht 01610, das hat ebenfalls den Hash 613, und die Suche meldet dort einen falschen Treffer, rot markiert. „Text mit R = 256“ rechnet wie der Java-Code mit Zeichencodes. Eigene Muster und Texte gibst du oben ein, Ziffern für die Rechenart wie im Buch, beliebige Zeichen für die Rechenart wie im Code.

## Erklärung

**Rabin-Karp-Fingerprint-Suche (Algorithmus 5.8)**, Klasse `RabinKarp`. Teilstringsuche über **Hashing** statt über Zeichenvergleiche.

**Idee:**

- Aus dem Muster einen Hashwert berechnen (den „Fingerabdruck“).
- Im Text für jedes Fenster der Länge M ebenfalls den Hashwert berechnen und vergleichen.
- Gleicher Hash → (fast sicher) Treffer.
- Der Trick: Der Hash des nächsten Fensters lässt sich aus dem vorigen in **konstanter Zeit** ausrechnen, ohne alle M Zeichen neu anzuschauen.

**Der Hash:**

- Die M Zeichen werden als Zahl zur Basis R = 256 aufgefasst, modulo einer großen Primzahl Q. Berechnet mit dem Horner-Schema (Listing 5.21, hier nicht abgedruckt).
- Q wird zufällig gewählt (`longRandomPrime()`), damit kein böswilliger Text gezielt Kollisionen erzeugen kann.
- `RM` = R^(M−1) mod Q, vorab berechnet. Das ist der Stellenwert der vordersten „Ziffer“.

**Rollender Hash**, zuerst im Dezimalsystem ohne Modulo zur Anschauung: Text 31415926, Fensterlänge 3.

- Erstes Fenster 314.
- Nächstes: führende Ziffer weg, eine Stelle nach links, neue Ziffer dran: (314 − 3 · 100) · 10 + 1 = **141**.
- Nächstes: (141 − 1 · 100) · 10 + 5 = **415**.
- Genau das machen die zwei Zeilen in der Schleife, nur mit Basis 256 und modulo Q:
  - `txtHash = (txtHash + Q − RM · altesZeichen % Q) % Q` entfernt die führende Ziffer. Das `+ Q` verhindert negative Zwischenwerte.
  - `txtHash = (txtHash · R + neuesZeichen) % Q` hängt die neue an.

**Monte Carlo vs. Las Vegas** (die Methode `check`):

- **Monte Carlo** (wie abgedruckt, `check` liefert immer `true`): Gleicher Hash wird als Treffer gewertet. Garantiert linear, aber mit einer winzigen Wahrscheinlichkeit falsch (etwa 1/Q, bei Q in der Größenordnung von 10^20 praktisch nie).
- **Las Vegas:** `check` vergleicht bei gleichem Hash tatsächlich die Zeichen. Immer korrekt, und mit extrem hoher Wahrscheinlichkeit trotzdem linear.
- Behauptung P im Buch fasst genau das zusammen.

**Kosten:** Linear in N, aber mit einer relativ langen inneren Schleife: pro Textzeichen mehrere Multiplikationen und Modulo-Operationen. In der Praxis deshalb oft langsamer als die anderen Verfahren. Dafür kein Zusatzspeicher und leicht erweiterbar, etwa auf die Suche nach vielen Mustern gleichzeitig oder auf zweidimensionale Muster.

**Die Teilstringsuche im Überblick** (nach Tabelle 5.11 im Buch):

| Verfahren | Schlimmster Fall | Typisch | Zurück im Text | Immer korrekt | Zusatzspeicher |
|---|---|---|---|---|---|
| Brute Force | M · N | 1,1 N | ja | ja | 1 |
| KMP, voller Automat (5.6) | 2N | 1,1 N | nein | ja | M · R |
| Boyer-Moore, nur Heuristik (5.7) | M · N | N / M | ja | ja | R |
| Rabin-Karp Monte Carlo (5.8) | 7N | 7N | nein | sehr wahrscheinlich | 1 |
| Rabin-Karp Las Vegas (5.8) | 7N, sehr wahrscheinlich | 7N | ja | ja | 1 |

Faustregel: Brute Force reicht oft. Garantie oder Datenstrom → KMP. Lange Muster in normalem Text → Boyer-Moore. Viele Muster oder ungewöhnliche Strukturen → Rabin-Karp.

**Kapitel 5 bisher:**

- Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
- Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
- Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
- Algorithmus 5.4: Trie-Symboltabelle [\[46\]]({{< relref "trie" >}})
- Algorithmus 5.5: TST-Symboltabelle [\[47\]]({{< relref "tst" >}})
- Algorithmus 5.6: Knuth-Morris-Pratt [\[48\]]({{< relref "kmp" >}})
- Algorithmus 5.7: Boyer-Moore [\[49\]]({{< relref "boyer-moore" >}})
- Algorithmus 5.8: Rabin-Karp [50]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Mit R = 10 und Q = 997 kommen alle Zahlen aus dem Buch genauso heraus. RM ist 30. Der Hash des Musters 26535 läuft über 2, 26, 265 und 659 bis 613 (Abbildung 5.45). Die Fenster im Text haben die Hashes 3, 31, 314, 150, 508, 201, 715, 971, 442, 929 und 613, Treffer bei 6 (Abbildung 5.47). Die Abbildung schreibt den Rollschritt als eine Formel, zum Beispiel ((508 + 3 · (997 − 30)) · 10 + 9) % 997. Die Visualisierung rechnet ihn wie der Code in zwei Zeilen. Das Ergebnis ist dasselbe, 201.

**Zu „Q in der Größenordnung von 10^20“:** Das steht so im Buch, und die Instanz übernimmt es. Mit `long` geht das aber nicht. Ein `long` reicht nur bis etwa 9,2 · 10^18, und `txtHash*R` darf nicht überlaufen, also muss Q noch weit darunter bleiben. Auf der Website zum Buch liefert `longRandomPrime()` deshalb eine zufällige Primzahl mit 31 Bit, also etwa 2 · 10^9. So habe ich die Methode auch geschrieben, im Buch ist sie nur eine Übung (5.3.33). Die Wahrscheinlichkeit einer Kollision je Fenster liegt dann bei etwa 1/Q, also ungefähr 10^-9 statt 10^-20. Das ist immer noch klein, aber nicht „praktisch nie“. Wie schnell es mit kleinem Q schiefgeht, zeigt der Knopf „Kollision“: Bei Q = 997 hat 01610 denselben Hash wie 26535, denn 1610 = 613 + 997.

Für die Rechenart wie im Code nimmt die Visualisierung Q fest gleich 2147483647 statt zufällig, damit die Zahlen beim Abspielen gleich bleiben. Ist der Text kürzer als das Muster, liest `hash(txt, M)` über das Textende hinaus, und Java wirft eine `StringIndexOutOfBoundsException`. Die Visualisierung fängt das ab und meldet es. `main()` ist der Testclient aus Listing 5.19, `hash()` steht in Listing 5.21.

Geprüft habe ich mit Java 21 und 500 zufälligen Mustern und Texten, das Muster wurde 232-mal gefunden. Q war jedes Mal eine Primzahl mit 31 Bit, und jede Suche lieferte dasselbe wie `indexOf`. Bei festem Q stimmen `RM` und der Hash des Musters in Java und Visualisierung überein, ebenso die Ergebnisse.
{{< /anmerkung >}}
