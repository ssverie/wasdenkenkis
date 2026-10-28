+++
title = "Erreichbarkeit in Digraphen (Algorithmus 4.4)"
description = "Die Erreichbarkeit in gerichteten Graphen aus Sedgewick/Wayne, Algorithmus 4.4 (Listing 4.13) – Tiefensuche entlang der Pfeile, ab einem oder mehreren Startknoten, am Digraphen tinyDG mit dem Ablauf aus Abbildung 4.32 und den drei Testläufen des Buchs."
date = 2026-10-28T11:12:00+01:00
reihenfolge = 440
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.4 (Listing 4.13)"
+++

{{< spiel src="/apps/erreichbarkeit.html" titel="Erreichbarkeit in Digraphen – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft die Tiefensuche ab Knoten 0 wie in Abbildung 4.32. Mit „Abspielen“ oder „Schritt“ geht es Aufruf für Aufruf. Orange ist der laufende `dfs`-Aufruf, orange umrandet sind die Aufrufe, die auf ihn warten (rechts als Aufrufstapel). Blau ist die Kante, die gerade geprüft wird. Kanten, über die die Suche weitergegangen ist, werden schwarz. Was am Ende grün ist, ist erreichbar, der Rest wird blass. Rechts unten entsteht das Protokoll im Stil der Abbildung („dfs(0)“, „prüfe 5“, „2 fertig“). Die Knöpfe oben spielen die drei Testläufe des Buchs nach: Bei `1 2 6` sieht man, dass der Bag die Startknoten rückwärts herausgibt und die erste Suche bei 6 beginnt. Mit „ab s“ lässt sich ein beliebiger Startknoten wählen, „Zufallsgraph“ erzeugt einen neuen Digraphen. „↺ Neu starten“ springt zurück zu Abbildung 4.32.

## Erklärung

Erreichbarkeit in Digraphen (Algorithmus 4.4), Klasse `DirectedDFS`. Jetzt Abschnitt 4.2, gerichtete Graphen (Digraphen). Kanten haben eine Richtung: v→w heißt, man kommt von v nach w, aber nicht automatisch zurück.

Was sich ändert: Eigentlich nichts am Code. `G.adj(v)` liefert jetzt nur die Knoten, auf die v zeigt (ausgehende Kanten). Die Tiefensuche ist Wort für Wort dieselbe wie in [\[30\]]({{< relref "tiefensuche" >}}), nur ohne `edgeTo`. Die Frage lautet: Welche Knoten sind von s aus erreichbar?

Der Code:

* `marked[]`: erreichbar ja/nein.
* Konstruktor 1: Tiefensuche ab einem Startknoten s.
* Konstruktor 2: ab einer Menge von Startknoten. Für jeden noch unmarkierten Startknoten eine Tiefensuche. Ergebnis: alles, was von irgendeinem der Startknoten erreichbar ist.
* `marked(v)`: Ist v erreichbar?

Die Testläufe (tinyDG.txt):

* Start 1 → nur 1. Knoten 1 hat keine ausgehenden Kanten.
* Start 2 → 0 1 2 3 4 5.
* Start 1, 2, 6 → 0 1 2 3 4 5 6 9 10 11 12. Nur 7 und 8 sind nicht erreichbar.
* Asymmetrie: Von 0 kommt man zu 1, von 1 aber nicht zu 0. Im ungerichteten Graphen [\[32\]]({{< relref "komponenten" >}}) wäre das unmöglich.

Abbildung 4.32 (Tiefensuche ab 0):

* dfs(0): Nachbarn 5 und 1, zuerst 5.
* dfs(5): Nachbar 4.
* dfs(4): Nachbarn 3 und 2, zuerst 3.
* dfs(3): prüfe 5 (schon markiert), dann 2 → dfs(2).
* dfs(2): prüfe 0, prüfe 3, beide markiert → 2 fertig.
* Zurück: 3 fertig, in 4 prüfe 2 (markiert), 4 fertig, 5 fertig.
* dfs(1): keine Nachbarn → 1 fertig, 0 fertig.
* Markiert: 0 bis 5. Die rechte Hälfte (6 bis 12) wird nie berührt, obwohl 6→0 eine Kante ist, denn sie zeigt in die falsche Richtung.

Satz D: Die Tiefensuche markiert alle von den Startknoten erreichbaren Knoten in Zeit proportional zur Summe der Ausgangsgrade der markierten Knoten.

Anwendung: Mark-and-Sweep-Speicherbereinigung:

* Objekte sind Knoten, Referenzen sind gerichtete Kanten.
* Startknoten sind die direkt zugänglichen Objekte (Variablen auf dem Stack, statische Felder).
* Phase 1 (Mark): genau diese Mehrfachstart-Tiefensuche, alles Erreichbare wird markiert.
* Phase 2 (Sweep): Alles Unmarkierte kann vom Programm nie mehr erreicht werden und wird freigegeben.
* Genau deshalb das `null`-Setzen gegen Loitering in [\[12\]]({{< relref "heap" >}}) und [\[14\]]({{< relref "stapel" >}}): Eine vergessene Referenz macht ein Objekt erreichbar, und der Garbage Collector darf es dann nicht abräumen.

Stand Kapitel 4:

* Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
* Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
* Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
* Algorithmus 4.4: Erreichbarkeit in Digraphen [33]

{{< anmerkung >}}
**Ein Druckfehler im Buch, mit Java nachgeprüft:** Der dritte Testlauf gibt nicht „0 1 2 3 4 5 6 9 10 11 12“ aus, sondern **0 1 2 3 4 5 6 8 9 10 11 12**. In der Datei `tinyDG.txt` (Buch-Website) stehen die Kanten 6→8 und 8→6, also ist 8 von 6 aus erreichbar. Der Satz „Nur 7 und 8 sind nicht erreichbar“ übernimmt den Fehler aus dem Buch – nicht erreichbar ist nur 7. Die drei anderen Läufe (1, 2 und 0) stimmen mit dem Buch überein. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 Zufallsdigraphen: Die erreichten Knoten sind in Java und Visualisierung gleich, und die Zahl der geprüften Kanten ist in jedem Fall genau die Summe der Ausgangsgrade der markierten Knoten (Satz D). Wie im Buch steht der Code der Visualisierung in einer eigenen Fassung (Klasse `Erreichbarkeit`), und `main()` nimmt die Kanten von tinyDG direkt im Code statt aus der Datei. „Nachbarn“ im Erklärtext meint hier die Nachfolger, also die Knoten, auf die ein Pfeil zeigt.
{{< /anmerkung >}}
