+++
aliases = ["/it-konzepte/algorithmen/shellsort/"]
title = "Shellsort (Algorithmus 2.3)"
description = "Insertionsort mit Sprüngen aus Sedgewick/Wayne, Algorithmus 2.3 (Listing 2.8) – Schritt für Schritt durch die Abstände 13, 4 und 1, mit Java-Code und Ablaufprotokoll."
date = 2026-10-24T17:40:00+02:00
reihenfolge = 230
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 2.3 (Listing 2.8) und Abbildung 2.5"
+++

{{< spiel src="/apps/shellsort.html" titel="Shellsort – Visualisierung" >}}

**So geht's:** Oben steht der aktuelle Abstand `h`. Die Balken der Teilfolge, die gerade sortiert wird, sind hervorgehoben, die übrigen blass. Orange ist das Element, das springt, blau sein Vergleichspartner `h` Plätze weiter links. „Bis eingefügt“ springt zum nächsten Element, „Bis h fertig“ zum Ende eines ganzen Durchlaufs. Das Protokoll rechts zeigt wie Abbildung 2.5 die Eingabe und das Array nach jedem Durchlauf. Bei Größe 16 laufen die Abstände wie im Buch: 13, 4, 1. Der Zähler vergleicht die Tausche mit denen, die Insertionsort für dasselbe Array bräuchte.

## Erklärung

Shellsort ist Insertionsort mit Sprüngen. Die Schwäche von Insertionsort: Ein Element wandert immer nur eine Position pro Tausch. Steht ein kleines Element ganz hinten, braucht es N Tausche bis nach vorn. Shellsort lässt Elemente erst in großen Sprüngen wandern und verfeinert dann.

Der Code:

* Erst wird der Startabstand `h` berechnet: Folge 1, 4, 13, 40, 121 … (h = 3h+1), solange h < N/3.
* Dann läuft im Kern genau Insertionsort, nur dass statt mit `j-1` mit `j-h` verglichen und getauscht wird. Das Array wird also „h-sortiert“: Jede Teilfolge aus jedem h-ten Element ist sortiert.
* Danach `h = h/3`, also 13 → 4 → 1. Der letzte Durchlauf mit h=1 ist ganz normales Insertionsort.

Das Beispiel (16 Elemente, also Start mit h=13):

* 13-sortiert: Verglichen werden nur Paare im Abstand 13. S (Index 0) und P (Index 13) werden getauscht, der Rest passt schon.
* 4-sortiert: Vier verschränkte Teilfolgen (Index 0,4,8,12 / 1,5,9,13 usw.) werden je für sich sortiert. Kleine Buchstaben sind jetzt grob vorn, große grob hinten.
* 1-sortiert: Das Array ist schon fast sortiert, also hat es wenige Inversionen, und genau da ist Insertionsort nahezu linear.

Warum das so viel bringt: Große h räumen viele Inversionen mit wenigen Tauschen ab, kleine h erledigen den Feinschliff auf einem fast sortierten Array. Das Ergebnis im Buch: bei 100.000 Zufallszahlen etwa 600-mal schneller als Insertionsort.

Kosten: Mit der Folge 3h+1 im schlimmsten Fall etwa N^(3/2) Vergleiche, also deutlich unter N². Eine exakte Analyse für den Durchschnittsfall gibt es nicht, darauf spielt der Satz oben auf der Seite an. Wie gut es läuft, hängt stark von der Abstandsfolge ab, und welche die beste ist, ist bis heute offen.

Praktisch: Kein Zusatzspeicher, wenig Code, für mittelgroße Arrays sehr ordentlich. Deshalb wird es gern in eingebetteten Systemen oder als Fallback benutzt, wo man kein Quicksort oder Mergesort will.

{{< anmerkung >}}
„Das Beispiel“ mit S und P und „der Satz oben auf der Seite“ beziehen sich auf das Buch, Abbildung 2.5 und die Zeilen darüber. In der Visualisierung stehen Zahlen statt Buchstaben. Mit den Buchstaben SHELLSORTEXAMPLE liefert sie genau die drei Zeilen aus dem Buch und braucht dafür 35 Tausche, Insertionsort bräuchte 59. Der Abstand von Faktor 600 aus dem Buch zeigt sich erst bei großen Arrays, bei 16 Zahlen ist der Gewinn klein.
{{< /anmerkung >}}
