+++
title = "Zusammenhangskomponenten (Algorithmus 4.3)"
description = "Die Zusammenhangskomponenten aus Sedgewick/Wayne, Algorithmus 4.3 (Listing 4.8) – die for-Schleife des Konstruktors, je Komponente eine Tiefensuche, id[] und count Schritt für Schritt, dazu connected(v, w), am Graphen tinyG aus dem Buch."
date = 2026-10-27T19:51:00+01:00
reihenfolge = 430
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.3 (Listing 4.8)"
+++

{{< spiel src="/apps/komponenten.html" titel="Zusammenhangskomponenten – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit dem Graphen tinyG aus dem Buch: erst entsteht der Graph Kante für Kante, dann arbeitet der Konstruktor. Seine for-Schleife geht die Knoten der Reihe nach durch (gestrichelt umrandet, Marke „s“). Trifft sie auf einen unmarkierten Knoten, startet dort eine Tiefensuche – Aufruf für Aufruf wie bei der [Tiefensuche]({{< relref "tiefensuche" >}}), orange der laufende Aufruf, orange umrandet die wartenden, blau der Nachbar, der gerade geprüft wird. Jeder erreichte Knoten bekommt `id[v] = count` und die Farbe seiner Komponente; ist die Suche fertig, zählt `count++` weiter. „Bis fertig“ springt jeweils bis zum Ende einer Komponente. Am Ende sammelt der Testclient die Knoten in Bags und gibt sie aus – rückwärts, wie im Buch. Oben lässt sich mit `connected(v, w)` jede Frage stellen oder ein Zufallsgraph erzeugen, der meist in mehrere Teile zerfällt. „↺ Neu starten“ lädt den Testclient neu.

## Erklärung

**Zusammenhangskomponenten (Algorithmus 4.3)**, Klasse `CC` (connected components). Frage: In welche unabhängigen Teile zerfällt der Graph, und liegen zwei Knoten im selben Teil?

**Der Code:**
- `marked[]`: besucht oder nicht.
- `id[]`: Nummer der Komponente für jeden Knoten.
- `count`: Anzahl der Komponenten bisher.
- Konstruktor: Alle Knoten der Reihe nach durchgehen. Trifft man auf einen unmarkierten, startet man von dort eine Tiefensuche und zählt danach `count` hoch.
- `dfs(G, v)`: wie in [\[30\]]({{< relref "tiefensuche" >}}), nur dass statt `edgeTo` jetzt `id[v] = count` gesetzt wird. Jeder Knoten, den diese Suche erreicht, bekommt die aktuelle Komponentennummer.
- `connected(v, w)`: `id[v] == id[w]`. Genau wie bei Union-Find [\[19\]]({{< relref "union-find" >}}).

**Das Beispiel tinyG.txt** (13 Knoten, 13 Kanten):
- Tiefensuche ab 0 erreicht 0 bis 6 → alle bekommen id 0.
- Nächster unmarkierter ist 7 → erreicht 7 und 8 → id 1.
- Nächster unmarkierter ist 9 → erreicht 9 bis 12 → id 2.
- Ergebnis: 3 Komponenten.
- Die Ausgabe zeigt die Knoten jeder Komponente rückwärts (6 5 4 3 2 1 0), weil der Testclient sie in Bags [\[17\]]({{< relref "bag" >}}) sammelt und `add` immer vorne einfügt.

**Satz C:** Vorverarbeitung in Zeit und Speicher proportional zu V + E. Danach beantwortet `connected()` jede Anfrage in konstanter Zeit.

**CC vs. Union-Find [\[19\]]({{< relref "union-find" >}}), [\[21\]]({{< relref "union-find-gewichtet" >}}):** Beide lösen dasselbe Problem mit derselben `id[]`-Idee, aber in unterschiedlichen Situationen.

| | CC (Tiefensuche, 4.3) | Union-Find (1.5) |
|---|---|---|
| Voraussetzung | ganzer Graph liegt vor | Kanten kommen nacheinander rein |
| Vorverarbeitung | V + E | keine |
| Anfrage `connected` | konstant | fast konstant (lg N bzw. mit Pfadkomprimierung praktisch konstant) |
| Neue Kante später | alles neu berechnen | einfach `union` |
| Pfad ausgeben | über DFS möglich | nicht möglich |

Faustregel aus dem Buch: Graph fest und viele Anfragen → CC. Graph wächst laufend → Union-Find. In der Praxis ist Union-Find oft schneller, weil kein vollständiger Graph aufgebaut werden muss.

**Stand Kapitel 4:**
- Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
- Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
- Algorithmus 4.3: Zusammenhangskomponenten [32]

{{< anmerkung >}}
Die Nummern im Text meinen Seiten hier: [30] die [Tiefensuche]({{< relref "tiefensuche" >}}), [31] die [Breitensuche]({{< relref "breitensuche" >}}), [19] [Union-Find]({{< relref "union-find" >}}), [21] das [gewichtete Quick-Union]({{< relref "union-find-gewichtet" >}}), [17] den [Bag]({{< relref "bag" >}}); [32] ist diese Seite.

Der Java-Code der Visualisierung ist eine eigene Fassung (`Komponenten` statt `CC`). Die Klasse `Graph` ist dieselbe wie bei Tiefen- und Breitensuche (Zeile für Zeile verglichen). Der Testclient ist selbst geschrieben, weil Listing 4.7 nicht mitgeliefert war; er sammelt die Knoten wie im Buch in Bags (der `Bag` aus [Algorithmus 1.4]({{< relref "bag" >}}), unverändert) und schreibt „3 Komponenten“ statt „3 components“.

Mit Java 21.0.8 übersetzt und ausgeführt: Die Ausgabe gleicht der im Buch (6 5 4 3 2 1 0, 8 7, 12 11 10 9), ebenso die Adjazenzlisten von tinyG. Für 400 Zufallsgraphen, auch mit Schleifen und Mehrfachkanten, liefern Java und Visualisierung dieselben `id[]`, `count` und Ausgaben (gleiche SHA-256-Summe). Unabhängig nachgeprüft mit einem einfachen Union-Find: gleiche Einteilung, gleiche Zahl der Komponenten und dieselbe Antwort von `connected()` für alle Knotenpaare. Die Tiefensuchen prüfen zusammen jedes Mal genau 2E Nachbarn – jede Kante von beiden Seiten –, dazu läuft die for-Schleife einmal über alle V Knoten: V + E, wie es Satz C sagt.
{{< /anmerkung >}}
