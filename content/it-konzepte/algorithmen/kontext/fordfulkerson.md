+++
title = "Ford-Fulkerson, kürzester augmentierender Pfad (Algorithmus 6.3)"
description = "Der Max-Fluss-Algorithmus nach Ford-Fulkerson mit kürzestem augmentierendem Pfad aus Sedgewick/Wayne, Algorithmus 6.3 (Listing 6.11 bis 6.13) – Breitensuche im Restnetzwerk, Engpass, Augmentieren und am Ende der minimale Schnitt, am Beispiel tinyFN.txt aus den Abbildungen 6.21 und 6.22."
date = 2026-10-28T22:50:00+01:00
reihenfolge = 630
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 6.3 (Listing 6.11 bis 6.13)"
+++

{{< spiel src="/apps/fordfulkerson.html" titel="Ford-Fulkerson – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft tinyFN.txt mit dem Code, wie er im Buch steht. Links ist das Flussnetzwerk, an jeder Kante Fluss/Kapazität, rot sind Kanten mit Fluss. Rechts ist das Restnetzwerk. Graue Pfeile sind Vorwärtskanten mit der Restkapazität, rote Pfeile Rückwärtskanten mit dem Fluss, den man zurücknehmen kann. Jede Runde ist eine Breitensuche: Der orange Knoten wird gerade bearbeitet, die orange Kante gerade geprüft, markierte Knoten sind hellblau und `edgeTo[]` blau. Erreicht die Suche t, wird der augmentierende Pfad blau, und der Engpass fließt dazu. Am Ende sind die markierten Knoten grün, das ist die s-Seite des minimalen Schnitts. „wie Abbildung 6.22“ stellt die Adjazenzlisten auf Einfügereihenfolge um, dann kommen genau die drei Pfade aus der Abbildung heraus (siehe Anmerkung). „Beispiel der Instanz“ ist das kleine Netz aus dem Text, „Zufallsnetz“ ein zufälliges.

## Erklärung

Ford-Fulkerson, kürzester augmentierender Pfad (Algorithmus 6.3), Klasse `FordFulkerson`. Kapitel 6, Abschnitt Netzwerkfluss. Mit dem kürzesten Pfad heißt die Variante auch Edmonds-Karp (1972).

Das Problem: maximaler Fluss

* Ein Flussnetzwerk ist ein gerichteter Graph, in dem jede Kante eine Kapazität hat: wie viel höchstens durchfließen kann, z. B. Wasser, Öl, Datenrate oder Waren.
* Es gibt eine Quelle s und eine Senke t.
* Ein Fluss muss zwei Regeln einhalten:
   * Kapazität: Auf keiner Kante fließt mehr als ihre Kapazität.
   * Erhaltung: In jeden Knoten außer s und t fließt genauso viel hinein wie heraus.
* Gesucht ist der Fluss, bei dem möglichst viel von s nach t kommt.

Restnetzwerk (Residualgraph): Das Herzstück des Verfahrens. Zu jeder Kante v→w mit Fluss f und Kapazität c gibt es zwei Möglichkeiten:

* Vorwärts v→w: Es passt noch c − f dazu.
* Rückwärts w→v: Es lassen sich bis zu f wieder zurücknehmen.
* Die Rückwärtskanten sind entscheidend. Durch sie kann der Algorithmus eine früher getroffene ungünstige Wahl wieder korrigieren.
* `FlowEdge` regelt das intern:
   * `residualCapacityTo(v)`: Ist v das Ziel der Kante, liefert sie c − f (vorwärts). Ist v der Startpunkt, liefert sie f (rückwärts).
   * `addResidualFlowTo(v, delta)`: Je nach Richtung wird der Fluss erhöht oder verringert.

Augmentierender Pfad: Ein Weg von s nach t im Restnetzwerk, auf dem jede Kante Restkapazität > 0 hat. Gibt es einen, lässt sich der Fluss erhöhen.

Der Code:

* Solange `hasAugmentingPath(G, s, t)` einen Pfad findet:
   * Engpass berechnen: über `edgeTo` von t zurück bis s laufen und die kleinste Restkapazität auf dem Weg bestimmen (`bottle`).
   * Augmentieren: auf demselben Weg zurück, auf jeder Kante `addResidualFlowTo(v, bottle)`.
   * `value += bottle`.
* `hasAugmentingPath` (Listing 6.12, im Hintergrund durchscheinend) ist die Breitensuche aus Algorithmus 4.2 [\[31\]]({{< relref "breitensuche" >}}) mit `marked[]`, `edgeTo[]` und Warteschlange [\[16\]]({{< relref "warteschlange" >}}). Einziger Unterschied: Eine Kante zählt nur, wenn ihre Restkapazität in diese Richtung größer als 0 ist. Weil es eine Breitensuche ist, wird immer der Pfad mit den wenigsten Kanten genommen.
* `inCut(v)`: `marked[v]` nach der letzten, erfolglosen Suche. Siehe Schnitt unten.
* Der Testclient gibt alle Kanten mit Fluss > 0 und den Gesamtwert aus.

Warum Rückwärtskanten nötig sind (eigenes Beispiel): s = 0, t = 3, Kanten 0→1, 0→2, 1→2, 1→3, 2→3, alle mit Kapazität 1.

* Angenommen, man nimmt zuerst den Pfad 0→1→2→3 (Fluss 1). Danach sind 0→1 und 2→3 voll, und vorwärts geht scheinbar nichts mehr.
* Im Restnetzwerk gibt es aber die Rückwärtskante 2→1. Pfad 0→2→1→3 bringt noch einmal 1: Der Fluss über 1→2 wird dabei zurückgenommen und umgeleitet.
* Ergebnis 2, das Maximum. Ohne Rückwärtskanten wäre man bei 1 stecken geblieben.
* Die Breitensuche hätte hier übrigens gleich die kurzen Pfade 0→1→3 und 0→2→3 genommen. Im Allgemeinen ist das Zurücknehmen trotzdem unverzichtbar.

Max-Flow-Min-Cut-Theorem:

* Ein s-t-Schnitt teilt die Knoten in eine Seite mit s und eine mit t. Seine Kapazität ist die Summe der Kapazitäten aller Kanten von der s-Seite zur t-Seite.
* Kein Fluss kann größer sein als irgendein Schnitt, denn alles muss irgendwo über den Schnitt.
* Das Theorem sagt: Der maximale Fluss ist gleich dem minimalen Schnitt. Gleichbedeutend: Ein Fluss ist genau dann maximal, wenn es keinen augmentierenden Pfad mehr gibt.
* Den minimalen Schnitt bekommt man gratis: Nach der letzten Breitensuche bilden die markierten Knoten (`inCut`) die s-Seite.

Kosten:

* Mit kürzesten augmentierenden Pfaden gibt es höchstens E · V / 2 Augmentierungen. Jede kostet eine Breitensuche (E + V), insgesamt im schlimmsten Fall also etwa V · E².
* In der Praxis ist es meist viel schneller, weil weit weniger Pfade gebraucht werden.
* Ohne die Regel „kürzester Pfad“ kann Ford-Fulkerson bei ungünstiger Pfadwahl extrem viele Augmentierungen brauchen, bei irrationalen Kapazitäten sogar nie enden. Genau deshalb die Breitensuche.

Anwendungen: Transport- und Versorgungsnetze, Datennetze, Bildsegmentierung (minimaler Schnitt trennt Vordergrund und Hintergrund) und vor allem als Werkzeug für andere Probleme. Das beste Beispiel ist das bipartite Matching, etwa Bewerber auf Stellen verteilen: Quelle an alle Bewerber, alle Stellen an die Senke, alle Kapazitäten 1, und der maximale Fluss ist die größte Zuordnung. Genau dieses „Problem A auf Problem B zurückführen“ ist das Thema des folgenden Abschnitts über Reduktion.

Bezüge: Breitensuche [\[31\]]({{< relref "breitensuche" >}}), Warteschlange [\[16\]]({{< relref "warteschlange" >}}), `edgeTo`-Pfadrückverfolgung wie in [\[30\]]({{< relref "tiefensuche" >}}) und [\[39\]]({{< relref "dijkstra" >}}). Die Schnitteigenschaft der MSTs [\[37\]]({{< relref "prim" >}}) ist ein entfernter Verwandter des Schnittbegriffs hier.

Kapitel 6:

* Algorithmus 6.1: B-Baum [\[54\]]({{< relref "btree" >}})
* Algorithmus 6.2: Suffixarray [\[55\]]({{< relref "suffixarray" >}})
* Algorithmus 6.3: Ford-Fulkerson (Max-Fluss) [56]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** tinyFN.txt hat 6 Knoten und 8 Kanten wie in Abbildung 6.21. Die Datei selbst steht nicht im Buch, ich habe sie von der Website zum Buch genommen (algs4.cs.princeton.edu, abgerufen am 28.10.2026). Am Ende stimmt alles mit dem Buch überein: Fluss 4.0, auf jeder Kante derselbe Fluss wie in der Ausgabe des Testclients, und der Schnitt {0, 2} wie im letzten Bild von Abbildung 6.22.

**Code und Abbildung 6.22 gehen verschiedene Wege:** Welchen von mehreren gleich kurzen Pfaden die Breitensuche nimmt, hängt von der Reihenfolge in den Adjazenzlisten ab. `FlowNetwork` steht nicht im Buch. Wie `EdgeWeightedDigraph` legt es die Kanten in eine `Bag`, und die liefert die zuletzt eingefügte Kante zuerst. Die Ausgabe des Testclients mit 0->2 vor 0->1 zeigt diese Reihenfolge.

- **Mit `Bag`**, wie im Code, findet die Suche vier Pfade mit je 1: 0→2→4→5, 0→2→3→5, 0→1→4→5 und 0→1→3→5.
- **Abbildung 6.22** zeigt drei Pfade: 0→1→3→5 mit 2, 0→2→4→5 mit 1 und 0→2→3→1→4→5 mit 1, mit der Rückwärtskante 3→1. Genau das kommt heraus, wenn die Listen die Kanten in der Reihenfolge der Datei halten. Nach den ersten beiden Pfaden ist das der Fluss aus Abbildung 6.21. In der App ist das der Knopf „wie Abbildung 6.22“.

Der Endfluss ist in beiden Fällen derselbe.

**Ausgabe des Testclients:** Sie passt zu keiner festen Reihenfolge. Bei Knoten 0 und 1 steht die zuletzt eingefügte Kante vorn, bei Knoten 2 steht 2->3 vor 2->4. Außerdem zeigt das Buch eine Nachkommastelle (3.0 2.0), `toString()` schreibt mit `%.2f` aber zwei (3.00 2.00). Die App gibt aus, was der Code ausgibt. Auf einem deutsch eingestellten Rechner schreibt Java dort übrigens 3,00, denn `String.format` richtet sich nach der Spracheinstellung.

**Code:** `FordFulkerson` ist der aus Listing 6.13 mit `hasAugmentingPath()` aus Listing 6.12, `FlowEdge` der aus Listing 6.11. `other()` steht dort nur als „wie für Edge“, ausgeschrieben ist es meine Fassung. `FlowNetwork` ist meine Fassung wie `EdgeWeightedDigraph`, jede Kante steht in den Listen beider Endpunkte. Ohne das fände die Suche keine Rückwärtskanten.

**Zum Text:** Das Beispiel der Instanz stimmt. Mit der Breitensuche nimmt der Algorithmus gleich 0→2→3 und 0→1→3, das zeigt der Knopf „Beispiel der Instanz“. Am Ende stand im Chat noch „Soweit ich weiß, ist 6.3 der letzte nummerierte Algorithmus im Buch.“ – eine Bemerkung an Sven, nicht Teil des Textes, darum nicht übernommen.

**Tests:** Geprüft habe ich mit Java 21 und 500 Zufallsnetzen mit bis zu 8 Knoten und 14 Kanten, auch mit parallelen Kanten. Der Wert stimmt jedes Mal mit dem minimalen Schnitt überein, den ich über alle Teilmengen der Knoten nachgerechnet habe. Java und Visualisierung geben jedes Mal genau dasselbe aus.
{{< /anmerkung >}}
