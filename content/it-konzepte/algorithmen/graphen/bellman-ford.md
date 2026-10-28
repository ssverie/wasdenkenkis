+++
title = "Bellman-Ford mit Warteschlange (Algorithmus 4.11)"
description = "Der warteschlangenbasierte Bellman-Ford-Algorithmus aus Sedgewick/Wayne, Algorithmus 4.11 (Listing 4.36 bis 4.38) – kürzeste Pfade auch mit negativen Gewichten, negative Zyklen werden erkannt, an tinyEWDn und tinyEWDnc wie in Abbildung 4.91 und 4.92."
date = 2026-10-28T16:17:00+01:00
reihenfolge = 510
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.11 (Listing 4.36 bis 4.38)"
+++

{{< spiel src="/apps/bellman-ford.html" titel="Bellman-Ford mit Warteschlange – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit tinyEWDn und Start s = 0 wie in Abbildung 4.91: derselbe Digraph wie bei Dijkstra, aber die drei Kanten aus 6 sind negativ. Rechts stehen `edgeTo[]`, `distTo[]` und `onQ[]`, darunter die Warteschlange (links wird entnommen, rechts eingereiht, darunter der Durchlauf). Der Knoten, dessen Kanten gerade relaxiert werden, ist orange. Rot umrandet sind die Knoten in der Warteschlange, grün alle, zu denen schon ein Weg bekannt ist. Die gerade geprüfte Kante ist blau gestrichelt, schwarz sind die Kanten in `edgeTo[]`, grau gestrichelt die nicht auswählbaren. Wird ein Abstand durch eine negative Kante kleiner, sind die Abstände dahinter „nicht länger gültig“, sie stehen dann durchgestrichen in der Tabelle, bis ein späterer Durchlauf sie korrigiert. Bei jedem V-ten `relax`-Aufruf prüft `findNegativeCycle()` die Kanten aus `edgeTo[]` auf einen Zyklus. „tinyEWDnc“ zeigt den Fall aus Abbildung 4.92, bei dem 4→5→4 ein negativer Zyklus ist: Er wird rot, die Schleife bricht ab, und `main()` gibt den Zyklus aus. „ab s“ startet von einem anderen Knoten aus, „Zufallsgraph“ erzeugt einen neuen Digraphen mit negativen Gewichten, manchmal auch mit negativem Zyklus, „↺ Neu starten“ springt zurück zu tinyEWDn.

## Erklärung

**Bellman-Ford, warteschlangenbasiert (Algorithmus 4.11)**, Klasse `BellmanFordSP`. Das allgemeinste Kürzeste-Pfade-Verfahren: beliebige Digraphen, auch mit Zyklen, und auch mit **negativen** Gewichten.

**Das Problem mit negativen Gewichten:**

- Dijkstra [\[39\]]({{< relref "dijkstra" >}}) versagt, weil ein schon als endgültig entnommener Knoten später über eine negative Kante doch noch billiger erreichbar sein kann.
- Schlimmer: ein **negativer Zyklus**, also ein Kreis, dessen Gewichtssumme negativ ist. Läuft man ihn immer wieder, wird der Pfad beliebig kurz. Kürzeste Pfade sind dann für alle Knoten, die über diesen Zyklus erreichbar sind, gar nicht definiert.
- Bellman-Ford findet entweder die kürzesten Pfade oder meldet einen negativen Zyklus.

**Grundidee Bellman-Ford:** V Durchläufe, in jedem alle Kanten relaxieren. Nach k Durchläufen sind alle kürzesten Pfade mit höchstens k Kanten richtig. Ein kürzester Pfad ohne Zyklus hat höchstens V − 1 Kanten, also reichen V Durchläufe. Kostet E · V.

**Die Verbesserung mit Warteschlange:** Die meisten Relaxierungen bringen nichts. Eine Kante v→w kann nur dann etwas verbessern, wenn sich `distTo[v]` im letzten Durchgang geändert hat. Also merkt man sich nur diese Knoten in einer Warteschlange [\[16\]]({{< relref "warteschlange" >}}).

**Der Code:**

- `distTo`, `edgeTo` wie gehabt.
- `queue`: Knoten, deren Kanten noch relaxiert werden müssen.
- `onQ[]`: Steht der Knoten schon in der Schlange? Verhindert Duplikate.
- `cost`: zählt die `relax`-Aufrufe.
- `cycle`: speichert einen gefundenen negativen Zyklus.
- Start: s einreihen. Dann solange die Schlange nicht leer ist **und** kein negativer Zyklus gefunden wurde: Knoten herausnehmen, `onQ` zurücksetzen, relaxieren.

**`relax` (Listing 4.36, hier nicht abgedruckt):**

- Wie bei Dijkstra: Ist `distTo[v] + Gewicht < distTo[w]`, dann `distTo[w]` und `edgeTo[w]` aktualisieren.
- Neu: w nur dann einreihen, wenn es nicht schon drin ist (`onQ`).
- Nach jeweils V Aufrufen wird `findNegativeCycle()` angestoßen.

**Negative Zyklen finden (Listing 4.38):**

- Aus den aktuellen `edgeTo`-Kanten wird ein Hilfsgraph gebaut und per Tiefensuche auf einen Zyklus geprüft, mit derselben `onStack`-Technik wie bei `DirectedCycle` [\[34\]]({{< relref "topologisch" >}}).
- Ohne negativen Zyklus ist `edgeTo` immer ein Baum. Taucht darin ein Zyklus auf, muss er negativ sein.
- Ohne diese Prüfung würde der Algorithmus bei einem negativen Zyklus endlos laufen, weil sich die Abstände immer weiter verringern.

**Satz W:** Die warteschlangenbasierte Version braucht im schlimmsten Fall Zeit proportional zu E · V und Zusatzspeicher proportional zu V. In der Praxis ist sie meist deutlich schneller, oft nahe E + V.

**Anwendung im Buch: Arbitrage.** Wechselkurse als Graph: Knoten sind Währungen, Kanten Umtauschkurse. Nimmt man als Gewicht den negativen Logarithmus des Kurses, wird aus Multiplizieren ein Addieren. Ein negativer Zyklus bedeutet dann eine Umtauschkette, an deren Ende man mehr Geld hat als am Anfang.

**Die drei Kürzeste-Pfade-Verfahren:**

| | Dijkstra (4.9) | Azyklisch (4.10) | Bellman-Ford (4.11) |
|---|---|---|---|
| Graph | beliebig | nur DAG | beliebig |
| Gewichte | nicht negativ | beliebig | beliebig |
| Negative Zyklen | – | gibt es nicht | werden erkannt |
| Zeit worst case | E log V | E + V | E · V |
| Zeit praktisch | E log V | E + V | meist E + V |
| Zusatzspeicher | V | V | V |

Faustregel: DAG → azyklisch. Keine negativen Gewichte → Dijkstra. Sonst Bellman-Ford.

**Kapitel 4 komplett:**

- Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
- Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
- Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
- Algorithmus 4.4: Erreichbarkeit in Digraphen [\[33\]]({{< relref "erreichbarkeit" >}})
- Algorithmus 4.5: Topologisches Sortieren [\[34\]]({{< relref "topologisch" >}})
- Algorithmus 4.6: Starke Komponenten nach Kosaraju [\[35\]]({{< relref "kosaraju" >}}), [\[36\]]({{< relref "kosaraju#ergänzung" >}})
- Algorithmus 4.7: Minimaler Spannbaum nach Prim [\[37\]]({{< relref "prim" >}})
- Algorithmus 4.8: Minimaler Spannbaum nach Kruskal [\[38\]]({{< relref "kruskal" >}})
- Algorithmus 4.9: Kürzeste Pfade nach Dijkstra [\[39\]]({{< relref "dijkstra" >}})
- Algorithmus 4.10: Kürzeste Pfade in azyklischen Digraphen [\[41\]]({{< relref "azyklisch" >}})
- Algorithmus 4.11: Bellman-Ford [42]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Mit tinyEWDn läuft die Visualisierung genau wie die Aufzählung zu Abbildung 4.91. Es sind elf `relax`-Aufrufe in acht Durchläufen, die Warteschlange ist der Reihe nach 0 · 2 4 · 7 5 · 3 1 · 6 · 4 · 5 · 1. Die Abstände von 5 und 1 sind nach 6→4 „nicht länger gültig“, und die Kanten von 4, 5 und 1 werden je zweimal relaxiert. Das Ergebnis ist der lange Pfad von 0 bis 1 aus der letzten Momentaufnahme. Mit tinyEWDnc läuft sie wie Abbildung 4.92 bis zur Warteschlange 3 1 4 mit `distTo[4]` = 0,07 (Länge von 0→4→5→4). Die letzte Momentaufnahme zeigt schon einen weiteren Umlauf durch den Zyklus. So weit kommt der Code aus Listing 4.36 nicht: `cost++ % G.V() == 0` prüft schon beim ersten Aufruf, dann beim neunten, siebzehnten usw. Beim neunten Aufruf, `relax(6)` mit cost = 8, stehen 4→5 und 5→4 schon in `edgeTo[]`. `findNegativeCycle()` findet den Zyklus, und die Schleife endet, während die Warteschlange noch 7 5 enthält. Dass sie nicht leer wird, schreibt auch das Buch. Die Klasse `EdgeWeightedCycleFinder` aus Listing 4.38 ist im Buch nicht abgedruckt (Übung). Ich habe sie selbst geschrieben, mit derselben `onStack`-Technik wie die Zyklensuche beim topologischen Sortieren. `pathTo` ist wie bei Dijkstra, `Queue` ist die aus Algorithmus 1.3. Den Testclient mit dem Schalter „nc“ habe ich ebenfalls selbst geschrieben, denn das Buch druckt hier keine Ausgabe. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 Zufallsdigraphen mit vielen negativen Gewichten, Schleifen und doppelten Kanten, 75 davon mit negativem Zyklus. Die Ausgabe ist in Java und Visualisierung gleich. Ein negativer Zyklus wird genau dann gemeldet, wenn der klassische Bellman-Ford mit V Runden einen von s aus erreichbaren findet. Der gemeldete Zyklus ist jedes Mal geschlossen und negativ, und ohne Zyklus stimmen alle Abstände mit dem klassischen Bellman-Ford überein.
{{< /anmerkung >}}
