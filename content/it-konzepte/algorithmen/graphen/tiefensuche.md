+++
aliases = ["/it-konzepte/algorithmen/tiefensuche/"]
title = "Tiefensuche für Pfade (Algorithmus 4.1)"
description = "Die Tiefensuche aus Sedgewick/Wayne, Algorithmus 4.1 (Listing 4.5) – dfs Aufruf für Aufruf mit Aufrufstapel, marked[] und edgeTo[], der Baum aus edgeTo[] und pathTo(v) mit dem Stapel, am Graphen aus Abbildung 4.16."
date = 2026-10-27T19:03:00+01:00
reihenfolge = 410
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.1 (Listing 4.5)"
+++

{{< spiel src="/apps/tiefensuche.html" titel="Tiefensuche für Pfade – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit dem Graphen aus Abbildung 4.16. Zuerst entsteht der Graph Kante für Kante, und man sieht, warum die Nachbarn in den Adjazenzlisten in umgekehrter Reihenfolge stehen. Dann folgt die Tiefensuche ab Knoten 0, mit „Abspielen“ oder „Schritt“ Aufruf für Aufruf. Orange ist der laufende `dfs`-Aufruf, orange umrandet sind die Aufrufe, die auf ihn warten (rechts als Aufrufstapel). Blau ist der Nachbar, der gerade geprüft wird. Jede neue Kante in `edgeTo[]` wird schwarz und erscheint unten im Baum. Danach gibt `main()` für jeden Knoten den Pfad aus; `pathTo(5)` wird dabei ausführlich gezeigt, wie in Abbildung 4.16: Der Stapel füllt sich von 5 rückwärts bis 0, der Pfad leuchtet grün. Oben lässt sich ein anderer Startknoten wählen, ein beliebiger Pfad mit `pathTo(v)` ansehen oder ein Zufallsgraph erzeugen, in dem manche Knoten oft gar nicht erreichbar sind. „↺ Neu starten“ lädt den Testclient neu.

## Erklärung

Tiefensuche für Pfade (Algorithmus 4.1), Klasse `DepthFirstPaths`. Kapitel 4, Graphen. Frage: Gibt es einen Weg vom Startknoten s zu Knoten v, und wenn ja, welchen?

Grundlage: Der Graph speichert für jeden Knoten seine Nachbarn in einer Adjazenzliste, das sind die Bags aus [\[17\]]({{< relref "bag" >}}). `G.adj(v)` liefert die Nachbarn von v.

Aufbau:

* `marked[]`: Wurde der Knoten schon besucht?
* `edgeTo[]`: Über welchen Knoten wurde er zum ersten Mal erreicht? `edgeTo[w] = v` heißt: Kante v–w war der Weg zu w.
* `s`: Startknoten.

`dfs(G, v)`, der Kern:

* v markieren.
* Für jeden Nachbarn w: Noch nicht besucht → `edgeTo[w] = v` merken, dann rekursiv `dfs(G, w)`.
* Bildlich: In einem Labyrinth immer so tief wie möglich in einen Gang, erst bei einer Sackgasse zurück zur letzten Abzweigung (Trémaux-Verfahren, im Buch vorher beschrieben).

`edgeTo[]` ist ein Baum in Elternverweis-Darstellung, wie `id[]` beim Union-Find [\[19\]]({{< relref "union-find" >}}): Jeder Knoten zeigt auf seinen Vorgänger, die Wurzel ist s.

Abbildung 4.16 (Start 0):

* Die Tiefensuche fügt die Kanten 0–2, 2–1, 2–3, 3–5, 3–4 in dieser Reihenfolge hinzu.
* `edgeTo`: 1→2, 2→0, 3→2, 4→3, 5→3. Daraus der Baum rechts: 0 oben, darunter 2, darunter 1 und 3, unter 3 die 4 und 5.

`pathTo(v)`:

* Kein Pfad → `null`.
* Sonst von v aus über `edgeTo` zur Wurzel hochlaufen und jeden Knoten auf einen Stapel [\[15\]]({{< relref "stapel-liste" >}}) legen, am Ende s.
* Weil der Stapel LIFO ist, kommt der Pfad beim Iterieren in der richtigen Reihenfolge heraus: von s nach v.
* Für v = 5: push 5, dann 3, dann 2, dann 0 → Pfad 0 2 3 5.

Satz A:

* Die Tiefensuche markiert alle mit s verbundenen Knoten in Zeit proportional zur Summe ihrer Grade, also V + E.
* `pathTo(v)` liefert den Pfad in Zeit proportional zu seiner Länge.

Wichtige Einschränkung: Die Tiefensuche findet einen Pfad, nicht unbedingt den kürzesten. Im Beispiel gibt es eine direkte Kante 0–5, trotzdem liefert sie 0 2 3 5, weil sie über 2 zuerst tief hineingelaufen ist. Den kürzesten Pfad (wenigste Kanten) liefert die Breitensuche, Algorithmus 4.2. Sie arbeitet mit einer Warteschlange [\[16\]]({{< relref "warteschlange" >}}) statt mit Rekursion.

{{< anmerkung >}}
Die Nummern im Text meinen Seiten hier: [17] den [Bag]({{< relref "bag" >}}), [19] [Union-Find]({{< relref "union-find" >}}), [15] den [Stapel mit verketteter Liste]({{< relref "stapel-liste" >}}), [16] die [Warteschlange]({{< relref "warteschlange" >}}).

Der Java-Code der Visualisierung ist eine eigene Fassung (`TiefensuchePfade` statt `DepthFirstPaths`). Die Klasse `Graph` war nicht mitgeliefert und ist hier selbst geschrieben. Sie benutzt den `Bag` aus [Algorithmus 1.4]({{< relref "bag" >}}), `pathTo` den `Stack` aus [Algorithmus 1.2]({{< relref "stapel-liste" >}}), beide unverändert aus den Visualisierungen dieser Seiten. Der Code ist mit Java 21.0.8 übersetzt und ausgeführt: `main()` gibt dieselben sechs Pfade aus wie die Visualisierung (0, 0-2-1, 0-2, 0-2-3, 0-2-3-4, 0-2-3-5), und der Ablauf stimmt mit Abbildung 4.16 überein. Für 400 Zufallsgraphen, auch mit Schleifen und Mehrfachkanten, liefern Java und Visualisierung dieselben `edgeTo[]` und Pfade (gleiche SHA-256-Summe). Die Zahl der geprüften Nachbarn war dabei jedes Mal genau die Summe der Grade der markierten Knoten, wie Satz A sagt.

Zur Anzeige: In Java steht in `edgeTo[]` anfangs überall 0, auch beim Startknoten, der nie einen Eintrag bekommt. Die Visualisierung zeigt dort „–“, solange nichts eingetragen ist, so wie die Abbildungen im Buch leere Felder zeigen.
{{< /anmerkung >}}
