+++
aliases = ["/it-konzepte/algorithmen/union-find-gewichtet/"]
title = "Gewichtetes Quick-Union (Algorithmus 1.5, Fortsetzung)"
description = "Die Union-Find-Variante aus der Praxis nach Sedgewick/Wayne, Algorithmus 1.5 (Fortsetzung, Listing 1.57) – der kleinere Baum kommt unter den größeren, Abbildung 1.61 mit Referenz- und Worst-Case-Eingabe Schritt für Schritt und Satz H zum Nachprüfen."
date = 2026-10-26T13:16:00+01:00
reihenfolge = 151
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 1.5, Fortsetzung (Listing 1.57, Abbildung 1.61, Satz H)"
+++

{{< spiel src="/apps/union-find-gewichtet.html" titel="Gewichtetes Quick-Union – Visualisierung" >}}

**So geht's:** Oben eine der Eingaben aus Abbildung 1.61 wählen und mit „Abspielen“ oder „Schritt“ durchgehen. Die Referenzeingabe ist `tinyUF.txt`, der Worst Case vereinigt immer gleich große Bäume, mit 8 Knoten wie im Buch oder mit 16. Über jeder Wurzel steht ihre Größe `sz`. Im Array ist `sz` bei Knoten blass, die keine Wurzel mehr sind, denn dort gilt der Wert nicht mehr. Bei jedem `union` wird grün markiert, welche Knoten eine Ebene tiefer rutschen. Der Kasten „Satz H nachgeprüft“ zeigt für jeden Knoten, wie sein Baum gewachsen ist. An jedem ↓ rutscht der Knoten eine Ebene tiefer, und sein Baum wird dabei mindestens doppelt so groß, darum nie tiefer als lg N. In der Titelzeile steht zum Vergleich, welche Höhe dieselben Paare mit einfachem Quick-Union ergäben. Eigene Paare gehen mit `union(p, q)` und `connected(p, q)`, „↺ Neu starten“ setzt alles zurück. Alle drei Varianten nebeneinander zeigt die Seite [Union-Find]({{< relref "union-find" >}}).

## Erklärung

Gewichtetes Quick-Union (Algorithmus 1.5, Fortsetzung, Listing 1.57): die Variante, die in der Praxis wirklich benutzt wird.

Der Code:

* `id[]`: Elternknoten. Ist `id[p] == p`, ist p eine Wurzel.
* `sz[]`: Größe des Baums, nur für Wurzeln aussagekräftig. Anfangs alle 1.
* `find(p)`: `while (p != id[p]) p = id[p];` läuft die Elternkette hoch bis zur Wurzel.
* `union(p, q)`: Beide Wurzeln i und j suchen. Gleich → schon verbunden, fertig. Sonst wird die Wurzel des kleineren Baums unter die des größeren gehängt und dessen `sz` um die kleinere Größe erhöht. `count--`.
* Das ist der einzige Unterschied zu Quick-Union: eine `if`-Abfrage auf `sz`. Kleiner Aufwand, große Wirkung.

Die Ausgaben oben links: mediumUF.txt (625 Knoten) ergibt 3 Komponenten, largeUF.txt (Millionen Knoten) 6 Komponenten. Mit Quick-Find wäre largeUF praktisch nicht machbar.

Abbildung 1.61:

* Links, Referenzeingabe (tinyUF): Die Bäume bleiben flach, weil kleine immer unter große gehängt werden.
* Rechts, Worst-Case-Eingabe mit 8 Knoten: 0-1, 2-3, 4-5, 6-7 (vier Paare), dann 0-2, 4-6 (zwei Vierer), dann 0-4 (ein Achter). Es werden immer gleich große Bäume vereinigt, das treibt die Höhe maximal hoch. Trotzdem nur Höhe 3 = lg 8.

Satz H: In einem Wald aus N Knoten ist die Tiefe jedes Knotens höchstens lg N.

Beweis (Induktion): Man zeigt stärker, dass ein Baum der Größe k höchstens Höhe lg k hat.

* Anfang: k = 1, Höhe 0 = lg 1.
* Schritt: Vereinigt werden Bäume der Größe i ≤ j, zusammen k = i + j. Nur die Knoten im kleineren Baum werden eine Ebene tiefer. Deren neue Tiefe ist höchstens 1 + lg i = lg(2i) ≤ lg(i + j) = lg k, weil i ≤ j.

Intuition dahinter: Ein Knoten rutscht nur dann eine Ebene tiefer, wenn sein Baum unter einen mindestens gleich großen gehängt wird. Dabei verdoppelt sich die Größe seines Baums mindestens. Verdoppeln kann man von 1 aus höchstens lg N-mal, bis N erreicht ist, also ist die Tiefe höchstens lg N.

Folge: `find`, `connected` und `union` kosten höchstens proportional zu lg N. Bei einer Million Knoten sind das maximal etwa 20 Schritte statt bis zu einer Million bei einfachem Quick-Union.

{{< anmerkung >}}
Anders als Listing 1.54 zeigt Listing 1.57 `find` und `union` vollständig. Der Code der Visualisierung ist trotzdem eine eigene Fassung mit denselben Regeln: Bei gleich großen Bäumen kommt der Baum von q unter den von p. Zu den Dateien: `largeUF.txt` hat laut erster Zeile der Datei genau eine Million Knoten, die Millionen stecken in den Paaren. Die Worst-Case-Eingabe mit 16 Knoten steht nicht im Buch. Sie setzt das Muster der 8 Knoten fort. Geprüft habe ich die Visualisierung mit beiden Eingaben aus Abbildung 1.61: Bei tinyUF bleiben 2 Komponenten, bei 8 Knoten ist die Höhe genau 3, bei 16 genau 4. Dazu kamen 300 Folgen aus zufälligen Paaren mit 8, 10 und 16 Knoten. Komponenten, `connected` und `sz` stimmten jedes Mal mit einer Vergleichsrechnung, keine Tiefe war größer als lg N, und bei jedem Absinken wurde der Baum des Knotens mindestens doppelt so groß.
{{< /anmerkung >}}
