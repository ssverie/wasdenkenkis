+++
title = "Kürzeste Pfade nach Dijkstra (Algorithmus 4.9)"
description = "Der Dijkstra-Algorithmus aus Sedgewick/Wayne, Algorithmus 4.9 (Listing 4.32) – kürzeste Pfade ab einem Startknoten in einem gerichteten, kantengewichteten Graphen, Knoten für Knoten aus einer indizierten Vorrangwarteschlange, am Digraphen tinyEWD wie in Abbildung 4.74."
date = 2026-10-28T12:59:00+01:00
reihenfolge = 490
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.9 (Listing 4.32)"
+++

{{< spiel src="/apps/dijkstra.html" titel="Kürzeste Pfade nach Dijkstra – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit tinyEWD und Start s = 0, in derselben Lage wie in Abbildung 4.74. Die Zahlen an den Pfeilen sind die Gewichte. Jede Runde beginnt mit `pq.delMin()`: Der Knoten mit dem kleinsten `distTo` wird orange, sein Abstand ist damit endgültig (danach grün). Dann relaxiert `relax` seine ausgehenden Kanten, die gerade geprüfte ist blau gestrichelt. Wird ein Weg kürzer, ändern sich `edgeTo[]` und `distTo[]` rechts, und der Knoten kommt in die Warteschlange oder rückt darin nach oben. Rot umrandet sind die Knoten in der Warteschlange, ihre rote Kante ist die bisher beste letzte Kante. Schwarz ist der Baum der kürzesten Pfade. Am Ende zeigt die Ausgabe für jeden Knoten seinen Pfad, er leuchtet dabei orange auf. „ab s“ startet von einem anderen Knoten aus, „Zufallsgraph“ erzeugt einen neuen Digraphen, „↺ Neu starten“ springt zurück zu tinyEWD.

## Erklärung

**Kürzeste Pfade nach Dijkstra (Algorithmus 4.9)**, Klasse `DijkstraSP`. Abschnitt 4.4. Jetzt ein **gerichteter, kantengewichteter** Graph. Gesucht: die kürzesten Pfade von einem Startknoten s zu allen anderen, gemessen an der Summe der Kantengewichte (nicht an der Kantenzahl wie bei der Breitensuche [\[31\]]({{< relref "breitensuche" >}})).

**Voraussetzung:** Alle Gewichte sind nicht negativ.

**Grundoperation: Relaxierung**

- `distTo[w]`: Länge des bisher kürzesten bekannten Pfads von s nach w.
- `edgeTo[w]`: letzte Kante auf diesem Pfad.
- Für eine Kante v→w prüft man: Ist der Weg über v kürzer als das bisher Bekannte, also `distTo[v] + Gewicht < distTo[w]`? Wenn ja, `distTo[w]` und `edgeTo[w]` aktualisieren. Das ist „relaxieren“: Die Schätzung wird lockerer, sprich besser.

**Der Code:**

- Anfangs alle `distTo` unendlich, nur `distTo[s] = 0`.
- s in die indizierte Vorrangwarteschlange [\[37\]]({{< relref "prim" >}}).
- Solange nicht leer: Knoten mit kleinstem `distTo` herausnehmen und alle seine ausgehenden Kanten relaxieren.
- Wird `distTo[w]` verbessert: w in der Schlange einfügen oder Schlüssel senken.

**Fast identisch mit Prim [\[37\]]({{< relref "prim" >}}).** Der einzige echte Unterschied steckt in einer Zeile:

- Prim: Schlüssel ist das Gewicht der **einzelnen Kante** zum Baum (`e.weight()`).
- Dijkstra: Schlüssel ist die **Gesamtlänge** des Pfads von s (`distTo[v] + e.weight()`).
- Prim baut den leichtesten Baum, Dijkstra den Baum der kürzesten Wege. Das sind im Allgemeinen verschiedene Bäume.

**Abbildung 4.74** (tinyEWD.txt, Start 0), Reihenfolge des Herausnehmens:

| Schritt | Knoten raus | Abstand | über Kante | Neu in die Schlange |
|---|---|---|---|---|
| 1 | 0 | 0,00 | – | 2 (0,26), 4 (0,38) |
| 2 | 2 | 0,26 | 0→2 | 7 (0,60) |
| 3 | 4 | 0,38 | 0→4 | 5 (0,73); 4→7 bringt nichts |
| 4 | 7 | 0,60 | 2→7 | 3 (0,99); 7→5 bringt nichts |
| 5 | 5 | 0,73 | 4→5 | 1 (1,05); 5→7 bringt nichts |
| 6 | 3 | 0,99 | 7→3 | 6 (1,51) |
| 7 | 1 | 1,05 | 5→1 | 1→3 bringt nichts |
| 8 | 6 | 1,51 | 3→6 | – |

Die Knoten kommen in aufsteigender Reihenfolge ihres Abstands zu s heraus. Beispielpfad zu 6: 0→2→7→3→6, Länge 0,26 + 0,34 + 0,39 + 0,52 = 1,51. Für jede Baumkante v→w gilt `distTo[w] = distTo[v] + Gewicht(v→w)`.

**Warum korrekt?** Wird v aus der Schlange genommen, hat es den kleinsten `distTo` aller noch offenen Knoten. Jeder andere Weg zu v müsste über einen dieser offenen Knoten laufen, der schon mindestens so weit weg ist, und weil Gewichte nicht negativ sind, kann es danach nicht kürzer werden. Also ist `distTo[v]` ab diesem Moment endgültig.

**Satz R:** Dijkstra berechnet den Kürzeste-Pfade-Baum mit Zusatzspeicher proportional zu V und Zeit proportional zu E log V im schlimmsten Fall.

**Grenzen und was folgt:**

- Negative Gewichte → Dijkstra kann falsch liegen, weil ein „endgültiger“ Knoten später doch noch billiger erreicht werden könnte. Dafür Bellman-Ford (Algorithmus 4.11).
- Azyklischer Digraph → schneller und einfacher über topologische Ordnung [\[34\]]({{< relref "topologisch" >}}), linear und auch mit negativen Gewichten (Algorithmus 4.10).
- Typische Anwendung: Routenplanung, Netzwerk-Routing.

**Stand Kapitel 4:**

- Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
- Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
- Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
- Algorithmus 4.4: Erreichbarkeit in Digraphen [\[33\]]({{< relref "erreichbarkeit" >}})
- Algorithmus 4.5: Topologisches Sortieren [\[34\]]({{< relref "topologisch" >}})
- Algorithmus 4.6: Starke Komponenten nach Kosaraju [\[35\]]({{< relref "kosaraju" >}}), [\[36\]]({{< relref "kosaraju#ergänzung" >}})
- Algorithmus 4.7: Minimaler Spannbaum nach Prim [\[37\]]({{< relref "prim" >}})
- Algorithmus 4.8: Minimaler Spannbaum nach Kruskal [\[38\]]({{< relref "kruskal" >}})
- Algorithmus 4.9: Kürzeste Pfade nach Dijkstra [39]

{{< anmerkung >}}
**Berichtigte Fassung:** In der ersten Fassung hatte die Instanz bei Knoten 6 vom Foto 1,49 statt 1,51 abgelesen und war mitten im Absatz darüber gestolpert. Auf Nachfrage hat sie Tabelle und Absatz berichtigt, hier steht die berichtigte Fassung. Die Tabelle stimmt jetzt ganz mit der Visualisierung überein und mit `DijkstraSP.java` auf der Website zum Buch (0,99 + 0,52 = 1,51). Das Listing zeigt `pathTo` nur als Verweis (Listing 4.31) und keinen Testclient. `pathTo` (mit dem Stapel aus Algorithmus 1.2), `main()`, `DirectedEdge` und `EdgeWeightedDigraph` habe ich darum selbst geschrieben, `IndexMinPQ` ist dieselbe wie bei Prim. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 Zufallsdigraphen (auch Gewicht 0, Schleifen, doppelte Kanten, unerreichbare Knoten, Start zufällig): Die Ausgabe ist in Java und Visualisierung gleich. Jeder Abstand stimmt mit einer unabhängigen Rechnung nach Bellman-Ford überein, die Knoten kommen immer in aufsteigendem Abstand aus der Warteschlange, und der Heap ist in jedem Schritt in Ordnung.{{< /anmerkung >}}
