+++
aliases = ["/it-konzepte/algorithmen/bst/"]
title = "Binärer Suchbaum (Algorithmus 3.3)"
description = "Die Symboltabelle als binärer Suchbaum aus Sedgewick/Wayne, Algorithmus 3.3 (Listings 3.9–3.13, 3.15) – jeder rekursive Aufruf einzeln mit Aufrufstapel: Suchen, Einfügen, min, max, floor, ceiling, select, rank, deleteMin, Löschen nach Hibbard und die Bereichssuche aus Abbildung 3.21."
date = 2026-10-27T13:28:00+01:00
reihenfolge = 330
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 3.3 (Listings 3.9–3.13, 3.15)"
+++

{{< spiel src="/apps/bst.html" titel="Binärer Suchbaum – Visualisierung" >}}

**So geht's:** Beim Öffnen ist wieder der Testclient geladen: SEARCHEXAMPLE kommt mit `put` in den Baum, am Ende steht der Baum aus Abbildung 3.21. „Abspielen“ oder „Schritt“ zeigt jeden rekursiven Aufruf einzeln: Der blaue Knoten ist das `x` des laufenden Aufrufs, umrandete Knoten sind schon verglichen, unter dem Baum steht der Aufrufstapel. Auf dem Rückweg sieht man das Muster aus dem Text: Jeder Aufrufer hängt das Ergebnis wieder ein (`x.left = …`) und rechnet sein `N` neu. Klein am Knoten stehen oben rechts `N` und darunter der Wert. Oben kann man eigene Schlüssel eintragen, suchen und löschen und die geordneten Operationen ausprobieren – für Abbildung 3.21 `keys` mit F bis T. „Sortiert A–J“ zeigt den schlimmsten Fall, „↺ Neu starten“ lädt den Testclient neu.

## Erklärung

**Binärer Suchbaum, BST (Algorithmus 3.3)**. Ziel: Suchen und Einfügen beide logarithmisch, plus alle geordneten Operationen. Das ist die Antwort auf die Schwäche von [\[23\]]({{< relref "binaere-suche-st" >}}).

**Aufbau (Listing 3.9):**
- Jeder Knoten hat `key`, `val`, `left`, `right` und `N` (Anzahl Knoten im Teilbaum darunter, inklusive sich selbst).
- BST-Eigenschaft: Im linken Teilbaum alle Schlüssel kleiner, im rechten alle größer.
- `size(x)` liefert `x.N`, für `null` 0. Fast alles Weitere stützt sich darauf.

**Das Rekursionsmuster**, das sich durch alle Listings zieht: Die private Methode bekommt einen Knoten und gibt einen Knoten zurück. Der Aufrufer hängt das Ergebnis wieder ein (`x.left = put(x.left, …)`). So werden Änderungen im Baum automatisch nach oben weitergereicht, und auf dem Rückweg wird `N` neu berechnet.

**Suchen und Einfügen (Listing 3.10):**
- `get`: Schlüssel vergleichen, kleiner → links, größer → rechts, gleich → Wert. Bei `null` erfolglos.
- `put`: Genauso absteigen. Gleich → Wert überschreiben. Bei `null` angekommen → neuen Knoten mit N = 1 erzeugen und zurückgeben, der Elternknoten hängt ihn ein.

**min, max, floor, ceiling (Listing 3.11):**
- `min`: immer links, bis es nicht weitergeht. `max` spiegelbildlich rechts.
- `floor(key)` (größter Schlüssel ≤ key): Ist key kleiner als der Knoten, muss der floor links liegen. Ist er gleich, Treffer. Ist er größer, könnte rechts noch ein passender sein. Findet sich dort keiner, ist der aktuelle Knoten der floor.
- `ceiling` spiegelbildlich.

**select und rank (Listing 3.12):**
- `select(k)` (Schlüssel mit Rang k): t = Größe des linken Teilbaums. t > k → links suchen. t < k → rechts suchen nach Rang k − t − 1 (linker Teilbaum und Knoten selbst abziehen). t = k → dieser Knoten. Genau dafür wird `N` gebraucht.
- `rank(key)` umgekehrt: Geht man nach rechts, werden linker Teilbaum plus 1 dazugezählt.

**Löschen (Listing 3.13):**
- `deleteMin`: links runter bis zum Knoten ohne linkes Kind, stattdessen dessen rechtes Kind zurückgeben. Der Knoten fällt raus.
- `delete(key)` nach **Hibbard**, drei Fälle:
  - kein Kind oder nur eins: einfach das andere Kind zurückgeben.
  - zwei Kinder: Den Knoten durch seinen **Nachfolger** ersetzen, das ist das Minimum im rechten Teilbaum. Der Nachfolger wird dort per `deleteMin` entfernt, bekommt den restlichen rechten Teilbaum und den alten linken Teilbaum.
- Schwachpunkt: Immer den Nachfolger zu nehmen ist unsymmetrisch. Nach vielen Lösch- und Einfügeoperationen wird der Baum schief (Höhe ~√N statt lg N). Abhilfe laut Buch: zufällig Vorgänger oder Nachfolger nehmen.

**Bereichssuche (Listing 3.15):**
- `keys(lo, hi)` ist eine Inorder-Traversierung (links, Knoten, rechts), die Teilbäume außerhalb des Bereichs abschneidet. Ergebnis kommt sortiert in eine Queue [\[16\]]({{< relref "warteschlange" >}}).
- Abbildung 3.21, Bereich [F..T]: E, S, X sind rot, die werden verglichen, liegen aber außerhalb. H, L, M, P, R sind schwarz, die kommen in die Ausgabe. A und C (grau) werden gar nicht besucht, weil schon bei E klar ist, dass links nichts im Bereich liegt.

**Satz E:** Alle Operationen kosten im schlimmsten Fall proportional zur Baumhöhe, denn jede läuft einen oder zwei Pfade von der Wurzel nach unten.

**Was heißt das konkret?**
- Zufällige Einfügereihenfolge: Suche im Schnitt etwa 1,39 lg N Vergleiche, also logarithmisch.
- Ungünstige Reihenfolge, z. B. schon sortierte Eingabe: Jeder neue Knoten hängt rechts am letzten, der Baum entartet zur Liste, Höhe N. Dann ist man wieder bei [\[22\]]({{< relref "sequenzielle-suche" >}}).

**Stand Kapitel 3:**

| | Suche | Einfügen | geordnete Ops |
|---|---|---|---|
| 3.1 Sequenziell | N | N | nein |
| 3.2 Binäre Suche | lg N | N | ja |
| 3.3 BST | lg N im Schnitt, N worst | lg N im Schnitt, N worst | ja |

Fehlt noch die Garantie für den schlimmsten Fall. Die liefert der balancierte Baum, als Nächstes der Rot-Schwarz-Baum (Algorithmus 3.4).

{{< anmerkung >}}
Die Nummern im Text meinen Seiten hier: [23] die [binäre Suche in geordnetem Array]({{< relref "binaere-suche-st" >}}), [22] die [sequenzielle Suche]({{< relref "sequenzielle-suche" >}}), [16] die [Warteschlange]({{< relref "warteschlange" >}}). Farben in Abbildung 3.21: rot = verglichen, aber außerhalb; schwarz = im Bereich; grau = nicht besucht – in der Visualisierung umrandet, grün und ohne Markierung.

Eine Stelle im Text stimmt nicht ganz: S gehört bei [F..T] nicht zu den roten Schlüsseln, sondern zu den schwarzen – F < S < T, also kommt S in die Ausgabe (in der Abbildung ist S auch schwarz). Rot sind nur E und X. Die Ausgabe ist H L M P R S; so liefert es auch der Java-Code.

Die Höhe zählt die Visualisierung wie das Buch: Tiefe des tiefsten Knotens, die Wurzel allein hat Höhe 0. Bei „Sortiert A–J“ steht darum Höhe 9 bei 10 Knoten – „Höhe N“ im Text meint dasselbe, in Knoten gezählt.

Der Java-Code der Visualisierung ist eine eigene Fassung (`Suchbaum` statt `BST`, eigene Kommentare, `deleteMax()` und `keys()` ohne Argumente weggelassen); die Logik folgt den Listings. Höchstens 16 Knoten, damit der Baum auf den Bildschirm passt. Der Code ist mit Java 21.0.8 ausgeführt und gegen `java.util.TreeMap` geprüft. Beim Testclient zählt die Visualisierung 33 Vergleiche (sequenzielle Suche: 64, binäre Suche im Array: 39 und 20 Verschiebungen).
{{< /anmerkung >}}
