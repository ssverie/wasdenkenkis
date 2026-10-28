+++
aliases = ["/it-konzepte/algorithmen/breitensuche/"]
title = "Breitensuche für Pfade (Algorithmus 4.2)"
description = "Die Breitensuche aus Sedgewick/Wayne, Algorithmus 4.2 (Listing 4.6) – Knoten für Knoten aus der Warteschlange, Abstände als Ebenen im Baum aus edgeTo[], kürzeste Pfade mit pathTo(v) und der direkte Vergleich mit der Tiefensuche am selben Graphen."
date = 2026-10-27T19:32:00+01:00
reihenfolge = 420
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.2 (Listing 4.6)"
+++

{{< spiel src="/apps/breitensuche.html" titel="Breitensuche für Pfade – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit demselben Graphen wie bei der [Tiefensuche]({{< relref "tiefensuche" >}}). Mit „Abspielen“ oder „Schritt“ wird Knoten für Knoten vorn aus der Warteschlange genommen (orange), seine Nachbarn werden der Reihe nach geprüft (blau). Wer noch nicht markiert ist, bekommt seine Kante in `edgeTo[]`, wird sofort markiert und stellt sich hinten an. Gestrichelt umrandet sind die Knoten, die in der Schlange warten. Unter jedem Knoten der Schlange steht sein Abstand d vom Start: erst alle mit Abstand 1, dann alle mit 2. Der Baum aus `edgeTo[]` wächst Ebene für Ebene, jede Ebene ist ein Abstand. „Bis fertig“ springt bis zum Ende des aktuellen Knotens. Danach gibt `main()` alle Pfade aus, `pathTo(5)` ausführlich: Diesmal kommt 0 5 heraus, bei der Tiefensuche war es 0 2 3 5. Oben lassen sich ein anderer Startknoten, ein beliebiger Pfad oder ein Zufallsgraph wählen; bei jedem Pfad sagt die Visualisierung, was die Tiefensuche im selben Graphen liefern würde. „↺ Neu starten“ lädt den Testclient neu.

## Erklärung

**Breitensuche für Pfade (Algorithmus 4.2)**, Klasse `BreadthFirstPaths`. Gleiche Aufgabe wie [\[30\]]({{< relref "tiefensuche" >}}), aber mit Garantie: Der gefundene Pfad hat die **wenigsten Kanten**.

**Idee:** Nicht tief hinein, sondern ringförmig nach außen. Erst alle Nachbarn von s (Abstand 1), dann deren Nachbarn (Abstand 2) und so weiter. Wie eine Welle, die sich vom Startpunkt ausbreitet.

**Der Code:**
- Gleiche Felder wie bei der Tiefensuche: `marked[]`, `edgeTo[]`, `s`.
- Statt Rekursion eine **Warteschlange** [\[16\]]({{< relref "warteschlange" >}}).
- s markieren und einreihen.
- Solange die Schlange nicht leer ist: vorderen Knoten v herausnehmen, alle unmarkierten Nachbarn w bekommen `edgeTo[w] = v`, werden markiert und hinten eingereiht.
- Wichtig: Markiert wird schon beim **Einreihen**, nicht erst beim Herausnehmen. Sonst könnte derselbe Knoten mehrfach in die Schlange geraten.
- `hasPathTo` und `pathTo` sind identisch zur Tiefensuche, mit Stapel über `edgeTo` zurück zur Wurzel.

**Ablauf am selben Graphen** wie in [\[30\]]({{< relref "tiefensuche" >}}) (Start 0, im Hintergrund der Seite angedeutet):
- 0 herausnehmen → Nachbarn 2, 1, 5 einreihen, jeweils `edgeTo = 0`.
- 2 herausnehmen → 0 und 1 schon markiert, 3 und 4 einreihen, `edgeTo = 2`.
- 1, 5, 3, 4 herausnehmen → alle Nachbarn schon markiert, nichts Neues.
- `edgeTo`: 1→0, 2→0, 3→2, 4→2, 5→0.
- `pathTo(5)` liefert jetzt **0 5**, die direkte Kante. Die Tiefensuche lieferte 0 2 3 5.

**Satz B:**
- Für jeden mit s verbundenen Knoten v liefert die Breitensuche einen kürzesten Pfad (wenigste Kanten).
- Laufzeit im schlimmsten Fall proportional zu V + E.
- Warum kürzest? Die Schlange enthält immer erst alle Knoten mit Abstand k, dann die mit k + 1. Ein Knoten wird beim ersten Erreichen markiert, und das geschieht zwangsläufig über den kürzesten Weg.

**Tiefensuche vs. Breitensuche:**

| | Tiefensuche (4.1) | Breitensuche (4.2) |
|---|---|---|
| Datenstruktur | Stapel (implizit über Rekursion) | Warteschlange |
| Vorgehen | so tief wie möglich, dann zurück | ringförmig nach Abstand |
| Pfad | irgendeiner | kürzester (Kantenzahl) |
| Laufzeit | V + E | V + E |
| Baum `edgeTo` | lang und schmal | flach und breit |

Der einzige echte Unterschied ist die Datenstruktur: Stapel (LIFO) ergibt Tiefensuche, Schlange (FIFO) ergibt Breitensuche. Genau das zeigt, warum Kapitel 1.3 mit Stapel und Warteschlange die Grundlage für alles Spätere ist.

{{< anmerkung >}}
Die Nummern im Text meinen Seiten hier: [30] die [Tiefensuche für Pfade]({{< relref "tiefensuche" >}}), [16] die [Warteschlange]({{< relref "warteschlange" >}}).

Zum letzten Satz eine Einschränkung: Ersetzt man in diesem Code nur die Warteschlange durch einen Stapel, entsteht keine Tiefensuche. Weil schon beim Einlegen markiert wird, bekommen alle Nachbarn eines Knotens ihren `edgeTo`-Eintrag sofort, bevor der Stapel in die Tiefe geht. Am Beispielgraphen liefert diese Variante 1→0, 2→0, 3→5, 4→3, 5→0, die Tiefensuche dagegen 1→2, 2→0, 3→2, 4→3, 5→3. Mit Java nachgeprüft: In 129 von 400 Zufallsgraphen weicht die Stapel-Variante von der Tiefensuche ab. Eine echte Tiefensuche mit eigenem Stapel muss sich merken, wie weit sie in der Nachbarliste jedes Knotens schon gekommen ist, so wie es die Rekursion von selbst tut. Der Kern der Aussage stimmt trotzdem: LIFO geht in die Tiefe, FIFO in die Breite.

Der Java-Code der Visualisierung ist eine eigene Fassung (`BreitensuchePfade` statt `BreadthFirstPaths`). Die Klasse `Graph` ist dieselbe wie bei der Tiefensuche (geprüft: Zeile für Zeile gleich). Die `Queue` stammt aus [Algorithmus 1.3]({{< relref "warteschlange" >}}), der `Stack` aus [Algorithmus 1.2]({{< relref "stapel-liste" >}}), beide unverändert aus den Visualisierungen dieser Seiten. `pathTo` steht im Listing nur als Verweis auf die Tiefensuche und ist hier ausgeschrieben.

Mit Java 21.0.8 übersetzt und ausgeführt: `main()` gibt dieselben Pfade aus wie die Visualisierung (0, 0-1, 0-2, 0-2-3, 0-2-4, 0-5), der Ablauf entspricht dem Text (herausgenommen in der Reihenfolge 0 2 1 5 3 4). Für 400 Zufallsgraphen, auch mit Schleifen und Mehrfachkanten, liefern Java und Visualisierung dieselben `edgeTo[]` und Pfade (gleiche SHA-256-Summe). Jeder Pfad ist so lang wie der kürzeste Abstand, unabhängig nachgerechnet mit dem Verfahren von Floyd und Warshall (Satz B). In jedem einzelnen Schritt standen die Knoten in der Schlange nach Abstand geordnet, nie mehr als eins auseinander und keiner doppelt, wie es die Begründung im Text sagt.
{{< /anmerkung >}}
