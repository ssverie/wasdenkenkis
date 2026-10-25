+++
title = "Heapsort (Algorithmus 2.7)"
description = "Sortieren mit dem Heap aus Sedgewick/Wayne, Algorithmus 2.7 (Listing 2.21) – Heap bauen und Sortdown Schritt für Schritt, im Baum und im Array, mit Java-Code und Ablaufprotokoll."
date = 2026-10-25T14:51:00+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 2.7 (Listing 2.21) und Abbildung 2.32"
+++

{{< spiel src="/apps/heapsort.html" titel="Heapsort – Visualisierung" >}}

**So geht's:** Oben steht der Heap als Baum, darunter dasselbe Array als Balken, beide mit den Heap-Plätzen 1 bis n. Orange ist das Element, das gerade absinkt, blau das Kind, mit dem es verglichen wird, grün ein Tausch. In Phase 2 wandert das Maximum jeweils nach hinten. Dort steht es endgültig, im Baum nur noch gestrichelt und bei den Balken hellblau. „Bis sink fertig“ springt zum Ende des aktuellen `sink`, „Bis Heap fertig“ zum Ende von Phase 1. Das Protokoll zeigt wie Abbildung 2.32 nach jedem `sink` das Array, mit `n` und `k` des Aufrufs. Von `sink` bewegte Elemente sind hervorgehoben, endgültig sortierte grau.

## Erklärung

Heapsort (Algorithmus 2.7) nutzt den Heap aus [12] direkt im Eingabearray, ohne Zusatzspeicher. Zwei Phasen:

Phase 1: Heap-Konstruktion (die `for`-Schleife)

* `sink(a, k, N)` für k = N/2 runter bis 1. Die Blätter (hintere Hälfte) sind für sich schon Mini-Heaps, also fängt man beim letzten Knoten mit Kindern an und arbeitet sich zur Wurzel vor.
* Dieses Bottom-up-Verfahren braucht weniger als 2N Vergleiche, also linear. Schneller als N-mal `insert`.
* In der Tabelle: Aus SORTEXAMPLE wird nach k = 5, 4, 3, 2, 1 die heap-geordnete Folge X T S P L R A M O E E. Das X steht vorn als Maximum.

Phase 2: Sortdown (die `while`-Schleife)

* `exch(a, 1, N--)`: Das Maximum an der Wurzel wird mit dem letzten Element getauscht und gilt ab jetzt als fertig. Der Heap schrumpft um eins.
* `sink(a, 1, N)`: Das nach oben getauschte Element sinkt ab, die Heap-Ordnung stimmt wieder.
* Das wiederholt sich, bis der Heap leer ist. Von hinten füllt sich das Array mit den größten Elementen: erst X, dann T, dann S …
* In der Tabelle: Rot = von `sink` bewegt, grau = rechts schon endgültig sortiert.

Indizes: Der Heap rechnet mit 1..N. Damit das echte Java-Array a[0..N-1] sortiert wird, ziehen `less()` und `exch()` intern jeweils 1 vom Index ab.

Kosten:

* Weniger als 2N lg N + 2N Vergleiche, garantiert, auch im schlimmsten Fall.
* In place, kein Zusatzspeicher.
* Nicht stabil.

Einordnung: Heapsort ist das einzige der bisherigen Verfahren, das beides garantiert: N lg N im schlimmsten Fall und kein Zusatzspeicher. In der Praxis ist es trotzdem meist langsamer als Quicksort, weil `sink` quer durchs Array springt (Index k zu 2k) und damit den Prozessor-Cache schlecht ausnutzt. Deshalb wird es gern als Absicherung eingesetzt, z. B. in Introsort, wenn Quicksort zu tief rekursiert.

{{< anmerkung >}}
„Der Heap aus [12]“ meint den vorigen Text derselben Instanz, die [Heap-Vorrangwarteschlange](/it-konzepte/algorithmen/heap/). „Die Tabelle“, „Rot“ und „grau“ beziehen sich auf das Buch, Abbildung 2.32. In der Visualisierung sind von `sink` bewegte Elemente orange. Im Code heißen `less` und `exch` hier `kleiner` und `tausche`, und `sink` ist eine eigene Fassung. Mit den Buchstaben SORTEXAMPLE liefert die Visualisierung genau die 15 Zeilen aus Abbildung 2.32. Sie braucht 14 Vergleiche für den Heap und 32 für den Sortdown, beides unter den Grenzen aus dem Text. Dazu kamen 400 Zufallsarrays: Nach Phase 1 und nach jedem `sink` galt die Heap-Ordnung, am Ende war alles sortiert, und keine Grenze wurde überschritten.
{{< /anmerkung >}}
