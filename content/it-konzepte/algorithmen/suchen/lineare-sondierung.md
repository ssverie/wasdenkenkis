+++
aliases = ["/it-konzepte/algorithmen/lineare-sondierung/"]
title = "Hashing mit linearer Sondierung (Algorithmus 3.6)"
description = "Die Hashtabelle mit linearer Sondierung aus Sedgewick/Wayne, Algorithmus 3.6 (Listing 3.20) – jede Sondierung einzeln, Cluster, Löschen mit Neu-Einfügen des Clusters und Verdoppeln der Tabelle, mit dem Testclient aus Abbildung 3.59."
date = 2026-10-27T14:12:00+01:00
reihenfolge = 360
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 3.6 (Listing 3.20)"
+++

{{< spiel src="/apps/lineare-sondierung.html" titel="Hashing mit linearer Sondierung – Visualisierung" >}}

**So geht's:** Beim Öffnen ist der Testclient aus Abbildung 3.59 geladen: 16 Plätze, SEARCHEXAMPLE, Wert = Position im Wort. Jede Operation beginnt bei `h = hash(key)`, dann zeigt jeder Schritt eine Sondierung: belegter Platz, Vergleich, weiter nach rechts – am Ende des Arrays vorn weiter. Oben steht neben Füllgrad und längstem Cluster, wie viele Sondierungen bei diesem Füllgrad im Schnitt zu erwarten sind. Mit `delete` sieht man, warum Löschen knifflig ist: Der Rest des Clusters wird Schlüssel für Schlüssel neu eingefügt. Der Modus „Java, wie Listing 3.20“ rechnet mit Javas echtem `hashCode()` und verdoppelt ab halb voll – die neue Tabelle füllt sich dann sichtbar unter der alten.

## Erklärung

**Hashing mit linearer Sondierung (Algorithmus 3.6)**, Klasse `LinearProbingHashST`. Gleiche Hashfunktion wie in [\[26\]]({{< relref "hash-verkettung" >}}), aber keine Listen. Alles liegt direkt in zwei parallelen Arrays `keys[]` und `vals[]`, wie bei der binären Suche [\[23\]]({{< relref "binaere-suche-st" >}}).

**Kollisionsauflösung durch Sondieren:** Ist der berechnete Platz belegt, nimm einfach den nächsten freien rechts daneben. Am Arrayende geht es bei 0 weiter (`(i + 1) % M`). Leere Plätze sind `null`.

**Der Code (Listing 3.20):**
- Startgröße M = 16.
- `put`: Ist die Tabelle halb voll (`N >= M/2`), erst verdoppeln. Dann ab `hash(key)` nach rechts laufen, bis entweder der Schlüssel gefunden ist (Wert überschreiben) oder ein `null` kommt (dort einfügen, `N++`).
- `get`: Ab `hash(key)` nach rechts laufen. Schlüssel gefunden → Wert. `null` erreicht → erfolglos, denn wäre der Schlüssel da, hätte er spätestens hier stehen müssen.
- `resize` (Listing 3.22) kann nicht einfach umkopieren wie in [\[14\]]({{< relref "stapel" >}}): Die Positionen hängen von M ab, also muss jeder Schlüssel in die neue Tabelle neu eingefügt werden.

**Abbildung 3.59** (M = 16, SEARCHEXAMPLE):
- Die meisten landen direkt: S→6, E→10, A→4, R→14, C→5, X→15, M→1.
- H hat Hash 4: Platz 4 (A), 5 (C), 6 (S) belegt → H landet auf 7. Schwarz = beim Sondieren angeschaut.
- P hat Hash 14: 14 (R), 15 (X) belegt, Umbruch → P landet auf 0.
- L hat Hash 6: 6 (S), 7 (H) belegt → L landet auf 8.
- Endstand: 0 P, 1 M, 4 A, 5 C, 6 S, 7 H, 8 L, 10 E, 14 R, 15 X.

**Cluster:** Zusammenhängende Blöcke belegter Plätze, hier etwa 4 bis 8. Sie sind das Kernproblem: Jeder Schlüssel, der irgendwo in den Cluster hasht, verlängert ihn. Große Cluster wachsen dadurch schneller als kleine.

**Löschen ist knifflig:** Einfach `null` setzen geht nicht. Löscht man C auf Platz 5, bricht eine Suche nach H (Hash 4) bei 5 ab und findet H auf 7 nie. Lösung: Nach dem Löschen alle Schlüssel rechts davon bis zum Clusterende neu einfügen (Listing 3.21).

**Kosten** mit Füllgrad α = N/M:
- Erfolgreiche Suche: etwa ½ (1 + 1/(1 − α)) Sondierungen.
- Erfolglose Suche/Einfügen: etwa ½ (1 + 1/(1 − α)²).
- Bei α = ½: rund 1,5 bzw. 2,5 Sondierungen. Geht α gegen 1, explodiert es.
- Deshalb Resizing: verdoppeln ab halb voll, halbieren unter ein Achtel. So bleibt α zwischen ⅛ und ½, und alles ist im Schnitt konstant.

**Sondierung vs. Verkettung [\[26\]]({{< relref "hash-verkettung" >}}):**
- Sondierung: kein Listen-Overhead, alles in einem Array, cachefreundlich, oft schneller. Aber Tabelle muss deutlich größer als N bleiben, Löschen ist umständlich.
- Verkettung: Füllgrad darf auch über 1 liegen, Löschen einfach. Dafür Extra-Objekte pro Eintrag.

**Kapitel 3 komplett:**

| | Suche | Einfügen | geordnete Ops |
|---|---|---|---|
| 3.1 Sequenziell | N | N | nein |
| 3.2 Binäre Suche | lg N | N | ja |
| 3.3 BST | lg N Schnitt, N worst | lg N Schnitt, N worst | ja |
| 3.4 Rot-Schwarz | ≤ 2 lg N garantiert | ≤ 2 lg N garantiert | ja |
| 3.5 Hashing Verkettung | praktisch konstant | praktisch konstant | nein |
| 3.6 Hashing Sondierung | praktisch konstant | praktisch konstant | nein |

Javas `HashMap` nutzt übrigens Verkettung, Pythons `dict` Sondierung (allerdings nicht linear).

{{< anmerkung >}}
Die Nummern im Text meinen Seiten hier: [26] [Hashing mit Verkettung]({{< relref "hash-verkettung" >}}), [23] die [binäre Suche in geordnetem Array]({{< relref "binaere-suche-st" >}}), [14] den [Stapel mit Array]({{< relref "stapel" >}}).

Abbildung 3.59 und Listing 3.20 passen an einer Stelle nicht zusammen: Nach S, E, A, R, C, H, X und M stehen 8 Schlüssel in der Tabelle, also N = M/2 – das Listing würde vor dem Einfügen von P auf M = 32 verdoppeln. Die Abbildung zeigt den Ablauf ohne Verdoppeln, bis zum Ende mit M = 16. Dazu kommt wie bei [Algorithmus 3.5]({{< relref "hash-verkettung" >}}): Die Hashwerte der Abbildung sind nicht die von Java („S“.hashCode() = 83, 83 % 16 = 3, nicht 6). Die Visualisierung hat darum zwei Modi: „wie Abbildung 3.59“ (Hashwerte des Buchs, ohne Verdoppeln) und „Java, wie Listing 3.20“. Im zweiten Modus verdoppelt der Testclient tatsächlich vor P und endet mit m = 32: 1 A, 3 C, 5 E, 8 H, 12 L, 13 M, 16 P, 18 R, 19 S, 24 X.

Zu `HashMap`: Sie verkettet tatsächlich, wandelt aber seit Java 8 eine Liste, die zu lang wird (ab 8 Einträgen, wenn die Tabelle mindestens 64 Plätze hat), in einen Rot-Schwarz-Baum um – dann kostet auch der schlimmste Fall nur noch lg N statt N.

Der Java-Code der Visualisierung ist eine eigene Fassung (`LineareSondierung` statt `LinearProbingHashST`, `n`/`m` statt `N`/`M`). `resize` (Listing 3.22) und `delete` (Listing 3.21) waren nicht mitgeliefert; sie folgen hier der Beschreibung im Text. Der Code ist mit Java 21.0.8 ausgeführt: 32.000 zufällige `put`, `delete` und `get` gegen `java.util.HashMap` ohne Fehler, der Füllgrad blieb dabei immer höchstens ½; eine feste Folge mit Verdoppeln, Löschen und zweimaligem Halbieren ergibt in Java und in der Visualisierung Zug um Zug dieselbe Tabelle. Das Lösch-Beispiel aus dem Text geht auf: Nach `delete(C)` rückt H von Platz 7 auf 5 nach, und `get(H)` findet es.
{{< /anmerkung >}}
