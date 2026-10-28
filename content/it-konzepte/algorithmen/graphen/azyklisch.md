+++
title = "Kürzeste Pfade in azyklischen Digraphen (Algorithmus 4.10)"
description = "AcyclicSP aus Sedgewick/Wayne, Algorithmus 4.10 (Listing 4.34) – kürzeste Pfade in einem kantengewichteten DAG, Knoten für Knoten in topologischer Reihenfolge relaxiert, auch mit negativen Gewichten, am Digraphen tinyEWDAG wie in Abbildung 4.77."
date = 2026-10-28T14:50:00+01:00
reihenfolge = 500
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.10 (Listing 4.34)"
+++

{{< spiel src="/apps/azyklisch.html" titel="Kürzeste Pfade in azyklischen Digraphen – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit tinyEWDAG und Start s = 5, in derselben Lage wie in Abbildung 4.77. Die Zahlen an den Pfeilen sind die Gewichte. Zuerst berechnet `Topological` die Ordnung 5 1 3 6 4 7 0 2 (rechts unter der Tabelle). Dann kommt jeder Knoten genau einmal dran, in dieser Reihenfolge: Der laufende ist orange, die erledigten sind grün. `relax` prüft seine ausgehenden Kanten, die gerade geprüfte ist blau gestrichelt. Wird ein Weg kürzer, ändern sich `edgeTo[]` und `distTo[]` rechts. Rot sind Kanten, die nur vorläufig im Baum stehen, weil ihr Zielknoten noch nicht dran war. Schwarz ist der fertige Baum der kürzesten Pfade, grau gestrichelt sind Kanten, die nicht auswählbar sind (sie bringen nichts oder wurden verdrängt, wie 6→0 und 6→2). Am Ende zeigt die Ausgabe für jeden Knoten seinen Pfad, er leuchtet dabei orange auf. „ab s“ startet von einem anderen Knoten aus, „Zufalls-DAG“ erzeugt einen neuen azyklischen Digraphen, auch mit negativen Gewichten, „↺ Neu starten“ springt zurück zu tinyEWDAG.

## Erklärung

**Kürzeste Pfade in kantengewichteten azyklischen Digraphen (Algorithmus 4.10)**, Klasse `AcyclicSP`. Gleiche Aufgabe wie Dijkstra [\[39\]]({{< relref "dijkstra" >}}), aber für den Sonderfall ohne Zyklen (DAG). Dann geht es schneller, einfacher und sogar mit negativen Gewichten.

**Idee:** Die Knoten in topologischer Reihenfolge [\[34\]]({{< relref "topologisch" >}}) relaxieren. Kommt man zu Knoten v, sind alle Kanten, die *in* v hineinführen, schon von ihren Vorgängern relaxiert worden. `distTo[v]` ist also bereits endgültig, bevor v seine eigenen Kanten weitergibt.

**Der Code:**

- `distTo` und `edgeTo` wie bei Dijkstra, Anfang unendlich, `distTo[s] = 0`.
- `Topological` aus Algorithmus 4.5, hier für kantengewichtete Digraphen überladen.
- Dann einfach: für jeden Knoten in topologischer Reihenfolge `relax(G, v)`. Fertig.
- Keine Vorrangwarteschlange, kein `marked[]`. Jeder Knoten und jede Kante wird genau einmal angefasst, ein Knoten wird nie ein zweites Mal relaxiert.

**Abbildung 4.77** (tinyEWDAG.txt, Start 5), topologische Ordnung **5 1 3 6 4 7 0 2**:

| Knoten | Was passiert |
|---|---|
| 5 | Kanten 5→1, 5→4, 5→7 kommen in den Baum |
| 1 | 1→3 kommt hinzu |
| 3 | 3→6 kommt hinzu; 3→7 nicht, 7 ist über 5→7 schon kürzer erreichbar |
| 6 | 6→2 und 6→0 kommen vorläufig hinzu; 6→4 nicht |
| 4 | 4→0 kommt hinzu und verdrängt 6→0; 4→7 nicht |
| 7 | 7→2 kommt hinzu und verdrängt 6→2 |
| 0 | 0→2 bringt nichts |
| 2 | letzter Knoten, keine ausgehenden Kanten |

**Ergebnis** (Testlauf):

| Ziel | Abstand | Pfad |
|---|---|---|
| 0 | 0,73 | 5→4 (0,35), 4→0 (0,38) |
| 1 | 0,32 | 5→1 |
| 2 | 0,62 | 5→7 (0,28), 7→2 (0,34) |
| 3 | 0,61 | 5→1 (0,32), 1→3 (0,29) |
| 4 | 0,35 | 5→4 |
| 5 | 0,00 | – |
| 6 | 1,13 | 5→1 (0,32), 1→3 (0,29), 3→6 (0,52) |
| 7 | 0,28 | 5→7 |

Man sieht gut, dass Kanten vorläufig in den Baum kommen und später ersetzt werden (6→0, 6→2). Bei Dijkstra wäre das nicht passiert, weil er nach Abstand und nicht nach topologischer Ordnung vorgeht. Das Ergebnis ist dasselbe.

**Satz S:** In einem kantengewichteten DAG findet dieses Verfahren die kürzesten Pfade in Zeit proportional zu E + V, also linear. Gewichte dürfen negativ sein, weil die Korrektheit nur von der Reihenfolge abhängt, nicht vom Vorzeichen.

**Längste Pfade gibt es gratis dazu:** Alle Gewichte negieren, kürzeste Pfade berechnen, Vorzeichen zurückdrehen. Das ist der kürzeste Pfad der negierten Kopie und zugleich der längste im Original. In Graphen mit Zyklen ist das Längste-Pfade-Problem dagegen schwer, im DAG ist es linear. Anwendung im Buch kurz danach: die **Methode des kritischen Pfads** für Ablaufplanung mit Dauern, etwa im Projektmanagement. Der längste Pfad durch die Aufgaben bestimmt die Mindestdauer des Projekts.

**Vergleich der Kürzeste-Pfade-Verfahren bisher:**

| | Dijkstra (4.9) | Azyklisch (4.10) |
|---|---|---|
| Graph | beliebig | nur DAG |
| Gewichte | nicht negativ | beliebig |
| Reihenfolge | nach Abstand (Vorrangwarteschlange) | topologisch |
| Zeit | E log V | E + V |

**Stand Kapitel 4:**

- Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
- Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
- Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
- Algorithmus 4.4: Erreichbarkeit in Digraphen [\[33\]]({{< relref "erreichbarkeit" >}})
- Algorithmus 4.5: Topologisches Sortieren [\[34\]]({{< relref "topologisch" >}})
- Algorithmus 4.6: Starke Komponenten nach Kosaraju [\[35\]]({{< relref "kosaraju" >}}), [\[36\]]({{< relref "kosaraju#ergänzung" >}})
- Algorithmus 4.7: Minimaler Spannbaum nach Prim [\[37\]]({{< relref "prim" >}})
- Algorithmus 4.8: Minimaler Spannbaum nach Kruskal [\[38\]]({{< relref "kruskal" >}})
- Algorithmus 4.9: Kürzeste Pfade nach Dijkstra [\[39\]]({{< relref "dijkstra" >}})
- Algorithmus 4.10: Kürzeste Pfade in azyklischen Digraphen [41]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die Visualisierung gibt dieselben acht Zeilen aus wie das Buch unter Listing 4.34 (5 to 0 (0.73) bis 5 to 7 (0.28)). Die Ordnung 5 1 3 6 4 7 0 2 und die Spalten `edgeTo[]` aus Abbildung 4.77 kommen genauso heraus, auch dass 6→0 und 6→2 erst in den Baum kommen und dann verdrängt werden. Zu „Bei Dijkstra wäre das nicht passiert“: Für tinyEWDAG ab 5 stimmt das, Dijkstra nimmt die Knoten in der Reihenfolge 5 7 1 4 3 2 0 6 und ersetzt dabei keine Kante. Allgemein kann aber auch Dijkstra eine Kante in `edgeTo[]` noch ersetzen, solange ihr Zielknoten in der Warteschlange steht. Dafür gibt es dort `pq.change()`. Endgültig ist bei beiden Verfahren erst der Knoten, der gerade drankommt. Das Listing verweist für `relax` und `pathTo` auf Listing 4.30 und 4.31, und `Topological` für kantengewichtete Digraphen ist im Buch eine Übung (4.4.12). `relax` und `pathTo` sind darum wie bei Dijkstra, nur ohne Warteschlange. `Topological` ist eine eigene Fassung, die Zyklen in derselben Tiefensuche erkennt, und die Zeile „kein Pfad“ für unerreichbare Knoten im Testclient ist ebenfalls von mir. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 zufälligen DAGs, davon ein Drittel der Kanten mit negativem Gewicht, auch mit doppelten Kanten, Gewicht 0 und unerreichbaren Knoten. Die Ausgabe ist in Java und Visualisierung gleich, und jeder Abstand stimmt mit einer unabhängigen Rechnung nach Bellman-Ford überein. Jede Kante führt in der Ordnung nach vorn, und ein Digraph mit Zyklus wird erkannt.
{{< /anmerkung >}}
