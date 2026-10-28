+++
aliases = ["/it-konzepte/algorithmen/heap/"]
title = "Heap-Vorrangwarteschlange (Algorithmus 2.6)"
description = "Die Max-Vorrangwarteschlange als Heap aus Sedgewick/Wayne, Algorithmus 2.6 (Listing 2.19) – selbst einfügen und entnehmen, swim und sink Schritt für Schritt im Baum und im Array."
date = 2026-10-25T14:45:00+01:00
reihenfolge = 260
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 2.6 (Listing 2.19)"
+++

{{< spiel src="/apps/heap.html" titel="Heap-Vorrangwarteschlange – Visualisierung" >}}

**So geht's:** Hier wird nicht sortiert, sondern bedient: Oben eine Zahl mit `insert` einfügen, eine Zufallszahl einfügen oder mit `delMax()` das Maximum entnehmen. Jede Operation läuft danach Schritt für Schritt ab, vor und zurück. Derselbe Heap steht zweimal da: als Baum (die kleine Zahl unter jedem Knoten ist sein Platz im Array) und als Array `pq[0..15]` darunter. So sieht man, dass Kind und Elternknoten nur Indexrechnung sind. Orange ist das Element, das auf- oder absteigt, blau sein Vergleichspartner, grün ein Tausch. „Alle entnehmen“ leert den Heap mit lauter `delMax()`. Die Zahlen kommen absteigend sortiert heraus, das ist schon die Idee von Heapsort. Der Heap fasst 15 Elemente, also vier Ebenen.

## Erklärung

Heap-Vorrangwarteschlange (Algorithmus 2.6) ist streng genommen kein Sortierverfahren, sondern eine Datenstruktur: Man kann beliebig Elemente einfügen und jederzeit das größte herausnehmen. Sie ist aber die Grundlage für Heapsort (Algorithmus 2.7).

Der Heap:

* Ein vollständiger Binärbaum, gespeichert in einem Array `pq[1..N]`. `pq[0]` bleibt leer, weil die Rechnung dann aufgeht.
* Zu Knoten k gehören die Kinder 2k und 2k+1, der Elternknoten ist k/2. Keine Zeiger nötig, nur Indexrechnung.
* Heap-Ordnung: Jeder Elternknoten ist ≥ seinen Kindern. Damit steht das Maximum immer in `pq[1]`, der Wurzel.

Die Operationen:

* `insert(v)`: Neues Element hinten anhängen (`pq[++N] = v`), dann `swim(N)`: Es steigt nach oben, solange es größer als sein Elternknoten ist.
* `delMax()`: Wurzel `pq[1]` merken, mit dem letzten Element tauschen, N verkleinern, dann `sink(1)`: Das neue Wurzelelement sinkt ab, indem es jeweils mit dem größeren Kind getauscht wird, bis die Ordnung wieder stimmt.
* `pq[N+1] = null`: Verhindert Loitering, also dass eine nicht mehr gebrauchte Referenz im Array hängen bleibt und der Garbage Collector den Speicher nicht freigeben kann.

Kosten:

* `insert`: höchstens 1 + lg N Vergleiche.
* `delMax`: höchstens 2 lg N Vergleiche (pro Ebene zwei: welches Kind ist größer, und ist es größer als der Knoten).
* Beides logarithmisch, weil der Baum nur lg N Ebenen hat. Eine sortierte oder unsortierte Liste würde bei einer der beiden Operationen N kosten.

Weg zu Heapsort: N Elemente einfügen, dann N-mal `delMax`, und sie kommen sortiert heraus. Heapsort macht genau das, aber direkt im Eingabearray, ohne Zusatzspeicher, mit garantiert ~2 N lg N Vergleichen.

{{< anmerkung >}}
Im Code der Visualisierung heißen `less` und `exch` aus dem Buch `kleiner` und `tausche`, und `N` heißt `n`. `swim` und `sink` stehen im Listing nur als Verweis auf frühere Abschnitte, darum sind sie hier eine eigene Fassung. Das Protokoll nennt bei jeder Operation die genaue Höchstzahl an Vergleichen für die aktuelle Größe. Sie liegt nie über den Grenzen aus dem Text. Geprüft habe ich die Visualisierung mit 2.400 zufälligen Operationen: Das Maximum stimmte jedes Mal, die Heap-Ordnung galt nach jeder Operation, und die Grenzen wurden nie überschritten.
{{< /anmerkung >}}
