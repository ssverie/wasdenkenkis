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

## Ergänzung

Nein, an der Erklärung in [\[35\]](#erklärung) ändert sich nichts. Die zwei Seiten liefern drei Ergänzungen: den konkreten Ablauf, den formalen Beweis und eine historische Einordnung.

**1\. Ablauf (Abbildung 4.46):**

* Erste Tiefensuche im umgekehrten Digraphen, Knoten in normaler Reihenfolge 0, 1, 2 … geprüft. Aus ihr ergibt sich die umgekehrte Postorder (in der Abbildung von unten nach oben gelesen): 1 0 2 4 5 3 11 9 12 10 6 7 8.
* Zweite Tiefensuche im ursprünglichen Digraphen, Startknoten in genau dieser Reihenfolge:
   * dfs(1) → nur 1 (keine ausgehenden Kanten)
   * dfs(0) → markiert 0, 5, 4, 3, 2
   * 2, 4, 5, 3 schon markiert, übersprungen
   * dfs(11) → markiert 11, 12, 9, 10
   * 9, 12, 10 übersprungen
   * dfs(6) → nur 6 (prüft 9, 4, 0, alle schon markiert, also in anderen Komponenten)
   * dfs(7) → markiert 7, 8
* Ergebnis: genau die 5 Komponenten aus dem Testlauf. Sieht man schön bei dfs(6): Es hat Kanten in andere Komponenten, aber die sind schon „verbraucht“. Genau das bewirkt die Reihenfolge.

**2\. Beweis (Satz H, Abbildung 4.45):** Er zeigt zwei Richtungen für jede Tiefensuche dfs(G, s) im Konstruktor.

* Jeder mit s stark verbundene Knoten v wird erreicht. Widerspruch: Wäre v schon vorher markiert worden, hätte dessen Suche s über den Pfad v→s ebenfalls erreicht. Dann wäre s schon markiert und `dfs(G, s)` würde gar nicht aufgerufen.
* Jeder erreichte Knoten v ist mit s stark verbunden. Von s nach v gibt es einen Pfad, sonst wäre v nicht erreicht worden. Zu zeigen bleibt v→s in G, gleichbedeutend mit s→v im umgekehrten Graphen G^R. Weil s in der Reihenfolge vor v kommt, endete dfs(G^R, v) vor dfs(G^R, s). Zwei Fälle:
   * dfs(G^R, v) lief komplett vor dem Aufruf von dfs(G^R, s) ab: unmöglich, denn G^R enthält einen Pfad v→s (umgedrehter Pfad s→v aus G), die Suche ab v hätte s also erreicht.
   * dfs(G^R, v) wurde während dfs(G^R, s) aufgerufen und endete davor: Dann wurde v von s aus erreicht, also gibt es in G^R einen Pfad s→v. Fertig.

**3\. Einordnung:**

* Abbildung 4.47 ist ein größerer Ausschnitt eines Webgraphen mit der Frage nach der Anzahl starker Komponenten, eine Übungsaufgabe zum Selbstrechnen.
* Historisch: Ob starke Komponenten so effizient lösbar sind wie normale Komponenten, war lange offen. R. E. Tarjan zeigte das in den 1970ern (Tarjans Algorithmus, eine Tiefensuche mit Zusatzbuchhaltung). Kosarajus Variante kam später und ist mit zwei schlichten Tiefensuchen deutlich einfacher zu programmieren, aber laut Buch schwerer zu verstehen.

{{< anmerkung >}}
**Zur Ergänzung:** Den Ablauf aus Teil 1 zeigt die Visualisierung genau so, auch bei dfs(6): Der Bag gibt die Kanten 6→0, 6→4 und 6→9 rückwärts heraus, darum prüft die Suche 9, 4 und 0 in dieser Reihenfolge.

**Mit dem Buch abgeglichen:** Die Visualisierung rechnet mit tinyDG in der Fassung des Buchs. Beide Ablaufprotokolle aus Abbildung 4.46 kommen Zeile für Zeile genauso heraus, ebenso die Startreihenfolge 1 0 2 4 5 3 11 9 12 10 6 7 8 und die fünf Komponenten aus dem Erklärtext. Die Datei `tinyDG.txt` auf der Website zum Buch hat statt 7→8, 8→7 und 8→9 die Kanten 6→8, 8→6 und 7→9. Mit ihr kämen {6, 8} und {7} heraus, so steht es auch in `KosarajuSharirSCC.java` auf der Website. Die Visualisierung gibt „5 4 3 2 0“ und „12 11 10 9“ aus, das Buch druckt „0 5 4 3 2“ und „11 12 9 10“. Das liegt nicht an der Visualisierung. Laut Buch nimmt `main()` den Testclient aus Listing 4.7, und der legt die Knoten der Reihe nach in einen Bag (`components[cc.id(v)].add(v)`). Der Bag gibt sie rückwärts heraus, also genau „5 4 3 2 0“ und „12 11 10 9“. Die abgedruckte Reihenfolge kommt nicht aus diesem Client. Die Knoten jeder Komponente stimmen trotzdem. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 (Ausgabe für tinyDG) und 400 Zufallsdigraphen, auch mit Schleifen und doppelten Kanten: Die Komponenten sind in Java und Visualisierung gleich und stimmen jedes Mal mit einer unabhängigen Rechnung über gegenseitige Erreichbarkeit überein. Außerdem führt jede Kante zwischen zwei Komponenten von einer später gefundenen zu einer früher gefundenen – die erste Suche startet also wirklich in einer Senke. Wie im Buch steht der Code in einer eigenen Fassung (Klasse `StarkeKomponenten`, `TiefensucheOrdnung` statt `DepthFirstOrder`), und `Digraph` hat dafür ein `reverse()` bekommen.
{{< /anmerkung >}}
