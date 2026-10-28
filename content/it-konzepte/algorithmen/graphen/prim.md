+++
title = "Minimaler Spannbaum nach Prim (Algorithmus 4.7)"
description = "Der MST-Algorithmus von Prim in der Eager-Version aus Sedgewick/Wayne, Algorithmus 4.7 (Listing 4.24) – der Baum wächst ab Knoten 0, eine indizierte Vorrangwarteschlange hält je Knoten die beste Verbindung, am Graphen tinyEWG mit dem Ablauf aus Abbildung 4.61."
date = 2026-10-28T12:30:00+01:00
reihenfolge = 470
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.7 (Listing 4.24)"
+++

{{< spiel src="/apps/prim.html" titel="Minimaler Spannbaum nach Prim – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit tinyEWG, in derselben Lage wie in Abbildung 4.61. Die Zahlen an den Kanten sind die Gewichte. Jede Runde beginnt mit `pq.delMin()`: Der Knoten mit der leichtesten Verbindung zum Baum kommt dazu, seine Kante ist dick rot. Danach prüft `visit` alle Kanten dieses Knotens, die gerade geprüfte ist blau gestrichelt. Grün sind die Knoten im Baum, schwarz die Kanten des minimalen Spannbaums. Rot umrandet sind die Knoten in der Warteschlange, ihre rote Kante ist die bisher beste Verbindung zum Baum. Kanten zwischen zwei Baumknoten werden blass. Rechts stehen `edgeTo[]` und `distTo[]` wie in der Abbildung, darunter die indizierte Vorrangwarteschlange: oben der Heap, unten das Zusatzarray `qp[]`, über das `change` die Position eines Knotens im Heap sofort findet. Im Protokoll sammeln sich die Tabellen der Abbildung. „Zufallsgraph“ erzeugt einen neuen zusammenhängenden Graphen, „↺ Neu starten“ springt zurück zu tinyEWG.

## Erklärung

**Minimaler Spannbaum nach Prim, Eager-Version (Algorithmus 4.7)**, Klasse `PrimMST`. Abschnitt 4.3, kantengewichtete Graphen.

**Das Problem:** Ungerichteter Graph, jede Kante hat ein Gewicht (Kosten, Länge). Gesucht ist ein **minimaler Spannbaum (MST)**: eine Auswahl von Kanten, die alle Knoten verbindet, keinen Zyklus enthält (also ein Baum mit V − 1 Kanten) und das kleinstmögliche Gesamtgewicht hat. Beispiele: Stromnetz, Leitungen, Straßen so legen, dass alles verbunden ist und am wenigsten kostet.

**Grundlage: die Schnitteigenschaft.** Teilt man die Knoten in zwei Gruppen, gehört die leichteste Kante, die beide Gruppen verbindet (kreuzende Kante), immer zum MST.

**Prims Idee:** Baum ab Knoten 0 wachsen lassen. Die Gruppen sind „im Baum“ und „noch nicht im Baum“. In jedem Schritt die leichteste kreuzende Kante nehmen und ihren Nicht-Baum-Knoten hinzufügen. Nach V − 1 Schritten ist der Baum fertig. Nach der Schnitteigenschaft ist jede so gewählte Kante richtig.

**Der Code:**

- `marked[v]`: v ist schon im Baum.
- `edgeTo[w]`: die bisher beste (leichteste) Kante vom Baum zu w.
- `distTo[w]`: deren Gewicht. Anfangs unendlich, für Knoten 0 null.
- `pq`: eine **indizierte Vorrangwarteschlange** (IndexMinPQ). Index ist der Knoten, Schlüssel sein `distTo`. Sie enthält die Nicht-Baum-Knoten, die schon eine Verbindung zum Baum haben.
- Hauptschleife: Knoten mit kleinstem `distTo` herausnehmen (`delMin`) und mit `visit` in den Baum holen.
- `visit(v)`: v markieren. Für jede Kante v–w: Ist w schon im Baum, überspringen. Ist die Kante leichter als die bisher beste Verbindung zu w, dann `edgeTo[w]` und `distTo[w]` aktualisieren und w in der Warteschlange einfügen bzw. seinen Schlüssel senken (`change`).

**Indizierte Vorrangwarteschlange:** Wie der Heap aus [\[12\]]({{< relref "heap" >}}), aber man kann zusätzlich über den Index den Schlüssel eines bestimmten Elements ändern und abfragen, ob es enthalten ist. Dafür führt sie intern ein Zusatzarray, das zu jedem Index die Position im Heap kennt.

**Lazy vs. Eager:**

| | Lazy (LazyPrimMST, vorher im Buch) | Eager (Algorithmus 4.7) |
|---|---|---|
| Warteschlange enthält | alle kreuzenden Kanten, auch veraltete | pro Nicht-Baum-Knoten nur die beste Kante |
| Veraltete Einträge | bleiben drin, werden beim Herausnehmen verworfen | gibt es nicht, Schlüssel wird gesenkt |
| Größe der Schlange | bis E | bis V |
| Zeit | E log E | E log V |
| Zusatzspeicher | E | V |

**Satz N:** Die Eager-Version braucht Zusatzspeicher proportional zu V und im schlimmsten Fall Zeit proportional zu E log V.

**Hinweise:**

- Ist der Graph nicht zusammenhängend, liefert der Code nur den Spannbaum der Komponente von 0 (einen Spannwald gäbe es mit einem Start pro Komponente, wie in [\[32\]]({{< relref "komponenten" >}})).
- `distTo` ist hier das Gewicht einer **einzelnen** Kante zum Baum, nicht eine Pfadlänge. Genau an diesem Punkt unterscheidet sich später Dijkstra (Algorithmus 4.9), der sonst fast gleich aussieht.
- Als Nächstes kommt Kruskal (Algorithmus 4.8): gleiche Aufgabe, aber Kanten global nach Gewicht sortiert und mit Union-Find [\[21\]]({{< relref "union-find-gewichtet" >}}) auf Zyklen geprüft.

**Stand Kapitel 4:**

- Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
- Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
- Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
- Algorithmus 4.4: Erreichbarkeit in Digraphen [\[33\]]({{< relref "erreichbarkeit" >}})
- Algorithmus 4.5: Topologisches Sortieren [\[34\]]({{< relref "topologisch" >}})
- Algorithmus 4.6: Starke Komponenten nach Kosaraju [\[35\]]({{< relref "kosaraju" >}}), [\[36\]]({{< relref "kosaraju#ergänzung" >}})
- Algorithmus 4.7: Minimaler Spannbaum nach Prim [37]

{{< anmerkung >}}
**Mit Abbildung 4.61 und Java abgeglichen:** Die acht Tabellen `edgeTo[]`/`distTo[]` der Abbildung kommen in der Visualisierung genauso heraus, die Knoten in derselben Reihenfolge 0, 7, 1, 2, 3, 5, 4, 6. Diesmal stimmt das tinyEWG des Buchs mit der Datei `tinyEWG.txt` auf der Website zum Buch überein. Das Listing zeigt nur `PrimMST`, `edges()` und `weight()` sind dort Übungen. Diese beiden und `Edge`, `EdgeWeightedGraph` und `IndexMinPQ` habe ich darum in eigenen Fassungen geschrieben. `main()` gibt die sieben Kanten und das Gesamtgewicht 1.81 aus. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 Zufallsgraphen (auch mit gleichen Gewichten, Schleifen, doppelten Kanten und Knoten ohne Verbindung): `edgeTo` und `distTo` sind in Java und Visualisierung gleich. Das Gesamtgewicht stimmt jedes Mal mit einer unabhängigen Rechnung nach Kruskal überein, und Heap und `qp[]` sind in jedem Schritt in Ordnung.{{< /anmerkung >}}
