+++
aliases = ["/it-konzepte/algorithmen/union-find/"]
title = "Union-Find (Algorithmus 1.5)"
description = "Dynamische Zusammenhangskomponenten aus Sedgewick/Wayne, Algorithmus 1.5 (Listing 1.54) – Quick-Find, Quick-Union und gewichtetes Quick-Union zum Umschalten, find und union Schritt für Schritt mit Bäumen, id[] und Arrayzugriffen, dazu der Testclient mit tinyUF.txt."
date = 2026-10-26T12:57:00+01:00
reihenfolge = 150
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 1.5 (Listing 1.54)"
+++

{{< spiel src="/apps/union-find.html" titel="Union-Find – Visualisierung" >}}

**So geht's:** Oben die Variante wählen: Quick-Find, Quick-Union oder gewichtetes Quick-Union. Beim Öffnen und bei jedem Wechsel ist `tinyUF.txt` geladen und läuft mit „Abspielen“ oder „Schritt“ durch den Testclient. Für jedes Paar fragt er erst `connected`, nur wenn nötig folgt `union`, und unten wächst die Ausgabe wie im Buch bis „2 components“. Die Bäume zeigen, wer an wem hängt, darunter steht dasselbe als `id[]` (bei der gewichteten Variante auch `sz[]`). Beim Schritt für Schritt sieht man `find` von Knoten zu Knoten zur Wurzel laufen. Der Zähler nennt die Arrayzugriffe, das Kostenmaß des Buchs. Am deutlichsten wird der Unterschied beim „Schlimmsten Fall“: Mit Quick-Union entsteht daraus eine lange Kette, gewichtet bleibt der Baum flach. Eigene Paare gehen mit `union(p, q)` und `connected(p, q)`, „↺ Neu starten“ setzt die gewählte Variante zurück. Die Fortsetzung mit Abbildung 1.61 und Satz H steht unter [Gewichtetes Quick-Union]({{< relref "union-find-gewichtet" >}}).

## Erklärung

**Union-Find (Algorithmus 1.5)** löst das Problem der dynamischen Zusammenhangskomponenten: Es kommen Paare p q rein, die „verbunden“ werden. Die Frage ist jederzeit: Sind zwei Knoten über irgendeine Kette miteinander verbunden? Beispiele: Rechner im Netz, Pixel in einem Bild, Personen in einem sozialen Netz.

**Das Gerüst:**
- `id[]`: pro Knoten eine Komponenten-ID. Anfangs `id[i] = i`, jeder Knoten ist seine eigene Komponente.
- `count`: Anzahl der Komponenten, startet bei N und sinkt bei jeder echten Vereinigung um 1.
- `connected(p, q)`: einfach `find(p) == find(q)`.
- Invariante: `find()` liefert für alle Knoten einer Komponente denselben Wert. `union()` muss das aufrechterhalten.

**Der Testclient:** Liest N, dann Paare. Sind sie schon verbunden, wird das Paar ignoriert. Sonst `union` und Ausgabe. Bei tinyUF.txt (10 Knoten, 11 Paare) werden 8 Verbindungen ausgegeben, 3 Paare waren schon über Umwege verbunden. Ergebnis: 2 Komponenten.

**Die drei Varianten für find/union:**

- **Quick-Find (S. 245):** `id[p]` ist direkt die Komponente. `find` ist ein Arrayzugriff, also konstant. `union` muss aber das ganze Array durchlaufen und alle IDs der einen Komponente umschreiben, also N pro Vereinigung. Bei N Vereinigungen quadratisch, für große Eingaben unbrauchbar.

- **Quick-Union (S. 247):** `id[p]` zeigt auf einen Elternknoten, jede Komponente ist ein Baum. `find` läuft hoch bis zur Wurzel (`id[p] == p`). `union` hängt einfach eine Wurzel unter die andere, eine einzige Zuweisung. Problem: Die Bäume können zu langen Ketten entarten, dann kostet `find` wieder N.

- **Gewichtetes Quick-Union (S. 252):** Zusätzliches Array `sz[]` mit der Baumgröße. Bei `union` wird immer der kleinere Baum unter den größeren gehängt. Dadurch bleibt die Höhe höchstens lg N, also `find` und `union` logarithmisch. Damit gehen auch Millionen Knoten problemlos.

**Kostenüberblick:**

| Variante | find | union |
|---|---|---|
| Quick-Find | 1 | N |
| Quick-Union | Baumhöhe (bis N) | Baumhöhe |
| Gewichtet | lg N | lg N |

Noch besser wird es mit Pfadkomprimierung (jeder Knoten auf dem Weg zur Wurzel wird direkt an die Wurzel gehängt), dann ist es praktisch konstant. Das steht im Buch als Übung.

{{< anmerkung >}}
Das Listing 1.54 zeigt nur das Gerüst mit `id[]`, `count`, `connected` und dem Testclient. Für `find` und `union` verweist es auf S. 245, 247 und 252, und diese Seiten lagen nicht vor. Die Instanz erklärt die drei Varianten aus ihrer Kenntnis des Buchs, und im Code der Visualisierung stehen eigene Fassungen. Bei gleich großen Bäumen hängt die gewichtete Variante den Baum von q unter den von p. Gezählt werden Arrayzugriffe auf `id[]` und `sz[]`: Bei Quick-Find kostet `find` einen Zugriff, bei den Baumvarianten 1 plus zweimal die Tiefe des Knotens. Geprüft habe ich alle drei Varianten mit tinyUF.txt: Ausgegeben werden die acht Paare 4 3, 3 8, 6 5, 9 4, 2 1, 5 0, 7 2, 6 1, übersprungen 8 9, 1 0, 6 7, am Ende stehen „2 components“. Dazu kamen je 300 Folgen aus 30 zufälligen Paaren. Komponentenzahl, `connected` und die Invariante stimmten jedes Mal mit einer einfachen Vergleichsrechnung überein, und die gewichteten Bäume wurden nie höher als lg N.
{{< /anmerkung >}}
