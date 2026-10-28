+++
aliases = ["/it-konzepte/algorithmen/binaere-suche-st/"]
title = "Binäre Suche in geordnetem Array (Algorithmus 3.2)"
description = "Die Symboltabelle als geordnetes Array aus Sedgewick/Wayne, Algorithmus 3.2 (Listings 3.5, 3.7, 3.8) – rank mit lo, hi und mid Schritt für Schritt wie in Abbildung 3.6, das Verschieben beim Einfügen und die geordneten Operationen min, max, select, ceiling, floor und keys."
date = 2026-10-27T13:00:00+01:00
reihenfolge = 320
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 3.2 (Listings 3.5, 3.7, 3.8)"
+++

{{< spiel src="/apps/binaere-suche-st.html" titel="Binäre Suche in geordnetem Array – Visualisierung" >}}

**So geht's:** Beim Öffnen ist derselbe Testclient geladen wie bei der [sequenziellen Suche]({{< relref "sequenzielle-suche" >}}): Die Buchstaben von SEARCHEXAMPLE kommen mit `put` in die Tabelle, der Wert ist die Position im Wort. „Abspielen“ oder „Schritt“ zeigt jeden Vergleich in `rank`: Die Marken lo, hi und mid stehen über den beiden Arrays, keys[mid] ist blau, alles außerhalb von lo..hi wird blass. Ist der Schlüssel neu, rücken die größeren Einträge einzeln eine Stelle nach rechts (grün), dann kommt der neue orange an seinen Platz. Oben kann man eigene Schlüssel eintragen und suchen und die geordneten Operationen ausprobieren: `min`, `max`, `select(k)`, `ceiling`, `floor` und `keys` für einen Bereich. Das Protokoll zeigt jedes `rank` wie Abbildung 3.6 und darunter alle Operationen mit Vergleichen und verschobenen Einträgen. „↺ Neu starten“ lädt den Testclient neu.

## Erklärung

**Binäre Suche in geordnetem Array (Algorithmus 3.2)**, Klasse `BinarySearchST`. Gleiche Aufgabe wie [\[22\]]({{< relref "sequenzielle-suche" >}}), aber die Schlüssel liegen sortiert in einem Array. Dadurch geht Suchen viel schneller.

**Aufbau (Listing 3.5):**
- Zwei parallele Arrays: `keys[]` (sortiert) und `vals[]`. Zu `keys[i]` gehört `vals[i]`.
- `Key extends Comparable<Key>`: Schlüssel müssen vergleichbar sein, `equals()` reicht nicht mehr.
- Größenanpassung wie bei Algorithmus 1.1 [\[14\]]({{< relref "stapel" >}}), hier weggelassen.

**Das Herzstück: `rank(key)` (Listing 3.7)**
- Liefert die Anzahl der Schlüssel, die kleiner als `key` sind.
- Klassische binäre Suche: Mitte anschauen. Kleiner → links weiter (`hi = mid-1`), größer → rechts weiter (`lo = mid+1`), gleich → `mid` zurück.
- Endet die Schleife ohne Treffer, ist `lo` genau die Stelle, an die der Schlüssel gehören würde.

**Abbildung 3.6** (keys = A C E H L M P R S X):
- Suche nach P: mid 4 (L) zu klein → mid 7 (R) zu groß → mid 5 (M) zu klein → mid 6 (P) Treffer, Rückgabe 6.
- Suche nach Q: gleicher Weg bis mid 6 (P), zu klein, lo wird 7, lo > hi, Rückgabe 7. Genau 7 Schlüssel sind kleiner als Q, und an Index 7 müsste Q eingefügt werden.

**`get` und `put`:**
- `get`: `rank` aufrufen, steht an dieser Stelle der Schlüssel, Wert zurück, sonst `null`.
- `put`: `rank` aufrufen. Schlüssel vorhanden → Wert überschreiben. Sonst alle größeren Einträge eine Stelle nach rechts schieben und den neuen an Position i einsetzen. Das Verschieben ist der teure Teil.

**Geordnete Operationen (Listing 3.8)**, praktisch geschenkt, weil alles sortiert ist:
- `min()`: `keys[0]`, `max()`: `keys[N-1]`, `select(k)`: `keys[k]`.
- `ceiling(key)`: kleinster Schlüssel ≥ key, einfach `keys[rank(key)]`. (Kleiner Haken im Buchcode: Ist key größer als alle Schlüssel, ist `rank` = N und der Zugriff geht über das Array hinaus. Da gehört eigentlich eine Prüfung hin.)
- `keys(lo, hi)`: alle Schlüssel im Bereich, gesammelt in einer Queue aus [\[16\]]({{< relref "warteschlange" >}}).
- `floor()` und `delete()` sind Übungen (3.1.17 und 3.1.16).

**Kosten:**
- Suche: höchstens lg N + 1 Vergleiche, egal ob erfolgreich oder nicht.
- Einfügen: im schlimmsten Fall ~2N Arrayzugriffe wegen des Verschiebens.
- N Einfügungen in leere Tabelle: quadratisch.

**Vergleich mit [\[22\]]({{< relref "sequenzielle-suche" >}}):**

| | Suche | Einfügen | geordnete Ops |
|---|---|---|---|
| Sequenziell (3.1) | N | N | nein |
| Binär (3.2) | lg N | N | ja, schnell |

Suchen ist gelöst, Einfügen nicht. Genau das löst als Nächstes der binäre Suchbaum (Algorithmus 3.3): logarithmisches Suchen und Einfügen.

{{< anmerkung >}}
Die Nummern im Text meinen Seiten hier: [22] die [sequenzielle Suche]({{< relref "sequenzielle-suche" >}}), [14] den [Stapel mit Array]({{< relref "stapel" >}}) (Algorithmus 1.1), [16] die [Warteschlange]({{< relref "warteschlange" >}}) (Algorithmus 1.3). Die [binäre Suche]({{< relref "binaere-suche" >}}) aus Kapitel 1 sucht in einem Array von Zahlen; hier ist dieselbe Idee das Herzstück einer Symboltabelle. Farben im Buch: schwarz = a[lo..hi], rot = a[mid]; in der Visualisierung ist alles außerhalb von lo..hi blass und keys[mid] blau.

Zum „kleinen Haken“ bei `ceiling()`: Er steckt im Buchcode, schlägt aber nicht immer zu. Ist im Array hinter den N Schlüsseln noch Platz frei, steht an `keys[N]` einfach `null`, und der Buchcode liefert dann zufällig das richtige `null`. Über das Array hinaus geht der Zugriff nur, wenn es gerade voll ist.

Der Java-Code der Visualisierung ist eine eigene Fassung (`BinaereSucheST`, feste Kapazität 12 statt Größenanpassung). Drei Stellen weichen bewusst vom Buch ab: `ceiling()` hat die fehlende Prüfung auf `i == n`; `floor()` ist eine eigene Lösung von Übung 3.1.17; `keys(von, bis)` rechnet `rank(bis)` nur einmal aus (im Buch steht `rank(hi)` in der Schleifenbedingung und läuft jede Runde neu) und liefert für einen leeren Bereich nichts – der Buchcode gibt bei `keys(X, A)` sonst A zurück, weil `contains(hi)` stimmt. `delete()` (Übung 3.1.16) fehlt. Beim Testclient zählt die Visualisierung 39 Vergleiche (die sequenzielle Suche brauchte 64) und 20 verschobene Einträge. Der Code ist mit Java 21.0.8 ausgeführt: Tabelle, `get`, `rank`, `ceiling`, `floor`, `min`, `max`, `select` und `keys` liefern dasselbe wie die Visualisierung.
{{< /anmerkung >}}
