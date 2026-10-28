+++
title = "Starke Komponenten nach Kosaraju (Algorithmus 4.6)"
description = "Der Kosaraju-Algorithmus aus Sedgewick/Wayne, Algorithmus 4.6 (Listing 4.17) – erst die umgekehrte Postorder des umgedrehten Digraphen, dann Tiefensuchen in genau dieser Reihenfolge, am Digraphen tinyDG."
date = 2026-10-28T11:47:00+01:00
reihenfolge = 460
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.6 (Listing 4.17)"
+++

{{< spiel src="/apps/kosaraju.html" titel="Starke Komponenten nach Kosaraju – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit tinyDG, demselben Digraphen wie bei der [Erreichbarkeit]({{< relref "erreichbarkeit" >}}). **Phase 1:** `G.reverse()` dreht Knoten für Knoten alle Pfeile um, das Bild zeigt dann den umgekehrten Digraphen R. Darauf läuft die Tiefensuche aus dem topologischen Sortieren. Grün sind die besuchten Knoten, blau die fertigen. Jeder fertige Knoten kommt oben auf den Stapel `reversePost`. **Phase 2:** Die Pfeile zeigen wieder richtig herum. Die Startknoten kommen jetzt in der Reihenfolge des Stapels (oben rechts, der laufende gestrichelt umrandet). Jede Tiefensuche färbt genau eine starke Komponente, und wo sie auf eine früher gefundene Komponente stößt, geht sie nicht weiter. Unten im Protokoll steht am Ende der Kerndigraph. `stronglyConnected(v, w)` fragt zwei Knoten ab – voreingestellt 0 und 1, der Fall aus dem Erklärtext. „Zufallsgraph“ erzeugt einen neuen Digraphen, „↺ Neu starten“ springt zurück zu tinyDG.

## Erklärung

Starke Zusammenhangskomponenten, Kosaraju-Algorithmus (Algorithmus 4.6), Klasse `KosarajuSCC`. Das Gegenstück zu den Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}}), aber für gerichtete Graphen.

Stark verbunden: v und w sind stark verbunden, wenn es einen Weg v→w und einen Weg w→v gibt. Eine starke Komponente ist eine größtmögliche Knotenmenge, in der jeder jeden erreicht und zurück. Jeder Zyklus liegt komplett in einer starken Komponente.

Der Code ist fast identisch zu `CC` [\[32\]]({{< relref "komponenten" >}}). Nur zwei Unterschiede:

1. Vorab: `DepthFirstOrder` aus [\[34\]]({{< relref "topologisch" >}}) auf dem umgekehrten Digraphen (`G.reverse()`, alle Kanten umgedreht). Daraus die umgekehrte Postorder.
2. Die Startknoten für die Tiefensuchen werden nicht in der Reihenfolge 0, 1, 2 … genommen, sondern in genau dieser berechneten Reihenfolge.

* Alles andere gleich: Jede Tiefensuche im Original-Graphen markiert genau eine starke Komponente und gibt allen ihren Knoten dieselbe `id`. `stronglyConnected(v, w)` ist `id[v] == id[w]`.

Ergebnis für tinyDG.txt, 5 starke Komponenten:

* {1}
* {0, 5, 4, 3, 2}
* {11, 12, 9, 10}
* {6}
* {8, 7}
* Vergleich [\[33\]]({{< relref "erreichbarkeit" >}}): Von 0 aus war 1 erreichbar, aber von 1 nicht zurück zu 0. Deshalb liegen sie in verschiedenen Komponenten.

Warum funktioniert das?

* Fasst man jede starke Komponente zu einem Knoten zusammen, entsteht ein DAG (Kerndigraph). Zyklen zwischen Komponenten kann es nicht geben, sonst wären sie ja eine.
* Das Problem bei normaler Tiefensuche: Startet sie in einer Komponente, die Kanten zu anderen hat, läuft sie in diese hinüber und vermischt Komponenten.
* Die Lösung: Man muss in einer Komponente starten, aus der keine Kante zu einer noch unbesuchten anderen führt (eine „Senke“ im Kerndigraphen). Dann bleibt die Suche drin.
* Die umgekehrte Postorder des umgekehrten Graphen liefert genau so eine Reihenfolge: Sie ist eine topologische Ordnung des Kerndigraphen von hinten nach vorn. Jede Tiefensuche startet also in einer Komponente, deren Ausgänge schon alle markiert sind.

Satz H: Der Kosaraju-Algorithmus berechnet die starken Komponenten korrekt, mit Vorverarbeitung in Zeit und Speicher proportional zu V + E. Danach beantwortet `stronglyConnected` jede Anfrage in konstanter Zeit.

Anwendungen: Nahrungsnetze in der Ökologie (welche Arten voneinander abhängen), Webgraph (Seitengruppen, die sich gegenseitig verlinken), Softwaremodule (zyklische Abhängigkeiten finden, die man auflösen sollte).

Bemerkenswert: Zwei Tiefensuchen hintereinander, ein umgedrehter Graph, und das schwierig klingende Problem ist in linearer Zeit gelöst. Der Code ist kaum länger als für ungerichtete Komponenten.

Stand Kapitel 4:

* Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
* Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
* Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
* Algorithmus 4.4: Erreichbarkeit in Digraphen [\[33\]]({{< relref "erreichbarkeit" >}})
* Algorithmus 4.5: Topologisches Sortieren [\[34\]]({{< relref "topologisch" >}})
* Algorithmus 4.6: Starke Komponenten nach Kosaraju [35]

{{< anmerkung >}}
**tinyDG: Buch und Datei unterscheiden sich, mit Java nachgeprüft.** Mit der Datei `tinyDG.txt` von der Website zum Buch kommen nicht {6} und {8, 7} heraus, sondern **{6, 8} und {7}**. In der Datei stehen die Kanten 6→8 und 8→6. Zu Knoten 7 führt dagegen keine einzige Kante, also kann 7 mit niemandem stark verbunden sein. Dieselbe Ausgabe steht in `KosarajuSharirSCC.java` auf der Buch-Website. Die Visualisierung rechnet mit der Datei (wie schon bei der Erreichbarkeit). Die Angaben im Buch passen zu einem tinyDG, in dem 7→8 und 8→7 statt 6→8 und 8→6 stehen. Das würde auch erklären, warum dort beim Lauf „1 2 6“ der Erreichbarkeit die 8 fehlt. Die übrigen drei Komponenten stimmen. Dass in der Ausgabe der Visualisierung „5 4 3 2 0“ statt „0 5 4 3 2“ steht, liegt am Testclient: Er sammelt die Knoten in einem Bag, und der gibt sie rückwärts heraus. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 Zufallsdigraphen (auch Schleifen und doppelte Kanten): Die Komponenten sind in Java und Visualisierung gleich und stimmen jedes Mal mit einer unabhängigen Rechnung über gegenseitige Erreichbarkeit überein. Außerdem führt jede Kante zwischen zwei Komponenten von einer später gefundenen zu einer früher gefundenen – die erste Suche startet also wirklich in einer Senke. Wie im Buch steht der Code in einer eigenen Fassung (Klasse `StarkeKomponenten`, `TiefensucheOrdnung` statt `DepthFirstOrder`), und `Digraph` hat dafür ein `reverse()` bekommen.
{{< /anmerkung >}}
