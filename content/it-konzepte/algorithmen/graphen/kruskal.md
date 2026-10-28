+++
title = "Minimaler Spannbaum nach Kruskal (Algorithmus 4.8)"
description = "Der MST-Algorithmus von Kruskal aus Sedgewick/Wayne, Algorithmus 4.8 (Listing 4.25) – alle Kanten nach Gewicht aus einer Vorrangwarteschlange, Union-Find verwirft jede, die einen Zyklus schlösse, am Graphen tinyEWG."
date = 2026-10-28T12:41:00+01:00
reihenfolge = 480
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.8 (Listing 4.25)"
+++

{{< spiel src="/apps/kruskal.html" titel="Minimaler Spannbaum nach Kruskal – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit tinyEWG, demselben Graphen wie bei [Prim]({{< relref "prim" >}}). Erst kommen alle Kanten in die Vorrangwarteschlange. Dann holt `delMin()` Runde für Runde die leichteste Kante, sie ist blau gestrichelt. Liegen beide Enden schon im selben Baum, leuchtet der Weg rot auf, den es zwischen ihnen schon gibt, und die Kante wird verworfen (danach rot gepunktet). Sonst verschmilzt `union` die beiden Bäume, und die Kante wird schwarz. Die Knoten eines Baums haben dieselbe Farbe, so sieht man den Wald zusammenwachsen. Rechts steht die Tabelle aus dem Erklärtext, sie füllt sich Kante für Kante. Unter dem Graphen stehen `id[]` und `sz[]` des Union-Find. „Zufallsgraph“ erzeugt einen neuen Graphen, manchmal aus zwei Teilen, dann entsteht ein Spannwald. „↺ Neu starten“ springt zurück zu tinyEWG.

## Erklärung

**Minimaler Spannbaum nach Kruskal (Algorithmus 4.8)**, Klasse `KruskalMST`. Gleiche Aufgabe wie Prim [\[37\]]({{< relref "prim" >}}), anderer Weg.

**Idee:** Alle Kanten nach Gewicht sortiert durchgehen, von der leichtesten an. Jede Kante nehmen, die keinen Zyklus mit den schon gewählten bildet. Aufhören, sobald V − 1 Kanten beisammen sind.

- Prim lässt **einen** Baum von einem Startknoten aus wachsen.
- Kruskal baut einen **Wald** aus vielen kleinen Bäumen, die nach und nach zusammenwachsen, bis einer übrig ist.

**Der Code** ist ein Zusammenspiel von drei Strukturen aus früheren Kapiteln:

- `MinPQ<Edge>`: Vorrangwarteschlange [\[12\]]({{< relref "heap" >}}), hier als Min-Heap, enthält alle Kanten. `delMin` liefert immer die leichteste noch nicht geprüfte.
- `UF`: Union-Find [\[19\]]({{< relref "union-find" >}}), [\[21\]]({{< relref "union-find-gewichtet" >}}). Prüft, ob die beiden Endpunkte schon im selben Baum liegen.
- `Queue<Edge> mst`: Warteschlange [\[16\]]({{< relref "warteschlange" >}}), sammelt die gewählten Kanten.
- Schleife: leichteste Kante v–w holen. `uf.connected(v, w)` → beide schon verbunden, die Kante würde einen Zyklus schließen, verwerfen. Sonst `uf.union(v, w)` (zwei Bäume verschmelzen) und Kante ins Ergebnis.

**Ablauf für tinyEWG.txt** (8 Knoten, 16 Kanten), Kanten nach Gewicht:

| Kante | Gewicht | Ergebnis |
|---|---|---|
| 0-7 | 0,16 | ✓ |
| 2-3 | 0,17 | ✓ |
| 1-7 | 0,19 | ✓ |
| 0-2 | 0,26 | ✓ |
| 5-7 | 0,28 | ✓ |
| 1-3 | 0,29 | ✗ Zyklus (1-7-0-2-3) |
| 1-5 | 0,32 | ✗ Zyklus |
| 2-7 | 0,34 | ✗ Zyklus |
| 4-5 | 0,35 | ✓ |
| 1-2 | 0,36 | ✗ Zyklus |
| 4-7 | 0,37 | ✗ Zyklus |
| 0-4 | 0,38 | ✗ Zyklus |
| 6-2 | 0,40 | ✓ → 7 Kanten, fertig |

Gesamtgewicht 1,81. Die schwereren Kanten (3-6, 6-0, 6-4) werden gar nicht mehr angeschaut. Die MST-Kanten kommen automatisch aufsteigend nach Gewicht heraus.

**Warum korrekt?** Wieder die Schnitteigenschaft aus [\[37\]]({{< relref "prim" >}}): Verbindet die Kante v–w zwei verschiedene Bäume, betrachte den Schnitt zwischen dem Baum von v und dem Rest. Alle leichteren Kanten sind schon verarbeitet, also ist v–w die leichteste kreuzende Kante und gehört zum MST.

**Satz O:** Kruskal braucht Speicher proportional zu E und Zeit proportional zu E log E im schlimmsten Fall. Die Kosten stecken im Heap (E-mal einfügen und entnehmen), die Union-Find-Operationen fallen dagegen kaum ins Gewicht.

**Prim vs. Kruskal:**

| | Prim eager (4.7) | Kruskal (4.8) |
|---|---|---|
| Vorgehen | ein Baum wächst ab Knoten 0 | Wald verschmilzt |
| Kernstrukturen | indizierte Vorrangwarteschlange | Vorrangwarteschlange + Union-Find |
| Zeit | E log V | E log E |
| Speicher | V | E |
| Nicht zusammenhängender Graph | nur Komponente von 0 | liefert automatisch einen Spannwald |

E log E und E log V sind übrigens praktisch dasselbe, weil E höchstens V² ist und damit log E höchstens 2 log V. In der Praxis ist Kruskal meist etwas langsamer als Prim, weil zusätzlich Union-Find-Operationen anfallen, dafür ist er sehr einfach zu verstehen.

**Stand Kapitel 4:**

- Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
- Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
- Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
- Algorithmus 4.4: Erreichbarkeit in Digraphen [\[33\]]({{< relref "erreichbarkeit" >}})
- Algorithmus 4.5: Topologisches Sortieren [\[34\]]({{< relref "topologisch" >}})
- Algorithmus 4.6: Starke Komponenten nach Kosaraju [\[35\]]({{< relref "kosaraju" >}}), [36]
- Algorithmus 4.7: Minimaler Spannbaum nach Prim [\[37\]]({{< relref "prim" >}})
- Algorithmus 4.8: Minimaler Spannbaum nach Kruskal [38]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die Visualisierung gibt dieselben acht Zeilen aus wie das Buch unter Listing 4.25 (0-7 0.16 bis 6-2 0.40, dann 1.81). Ihre Tabelle stimmt Zeile für Zeile mit der im Erklärtext überein. Das Listing nimmt `UF`. Ich habe stattdessen das gewichtete Union-Find aus Algorithmus 1.5 eingesetzt ([\[21\]]({{< relref "union-find-gewichtet" >}})), das liefert dasselbe Ergebnis. `MinPQ`, `edges()` im Graphen und `weight()` sind eigene Fassungen, `Edge` und `EdgeWeightedGraph` sind dieselben wie bei Prim. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 Zufallsgraphen (auch mit gleichen Gewichten, Schleifen, doppelten Kanten und mehreren Teilen): Die gewählten Kanten sind in Java und Visualisierung gleich, in derselben Reihenfolge. Das Gesamtgewicht stimmt jedes Mal mit einer unabhängigen Rechnung nach Prim je Teilgraph überein, und die Kanten kommen immer aufsteigend nach Gewicht. Beim Verweis „[36]“ fehlt mir weiter der Text der Instanz, darum ist er nicht verlinkt.
{{< /anmerkung >}}
