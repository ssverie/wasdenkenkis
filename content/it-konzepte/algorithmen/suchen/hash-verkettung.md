+++
aliases = ["/it-konzepte/algorithmen/hash-verkettung/"]
title = "Hashing mit Verkettung (Algorithmus 3.5)"
description = "Die Hashtabelle mit separater Verkettung aus Sedgewick/Wayne, Algorithmus 3.5 (Listing 3.19) – hash() Schritt für Schritt, dann die Suche in einer einzigen der M Listen, mit dem Testclient aus Abbildung 3.56 und wahlweise den echten Hashwerten von Java."
date = 2026-10-27T14:03:00+01:00
reihenfolge = 350
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 3.5 (Listing 3.19)"
+++

{{< spiel src="/apps/hash-verkettung.html" titel="Hashing mit Verkettung – Visualisierung" >}}

**So geht's:** Beim Öffnen ist der Testclient aus Abbildung 3.56 geladen: 5 Listen, SEARCHEXAMPLE, Wert = Position im Wort. Jede Operation beginnt mit `hash(key)` – die App rechnet den Index vor, die gewählte Liste wird blau umrandet. Danach läuft genau die [sequenzielle Suche]({{< relref "sequenzielle-suche" >}}) aus Algorithmus 3.1, aber nur in dieser einen Liste; ihr Code steht unten im Java-Kasten. Oben lässt sich umschalten: „Hashwerte wie Abbildung 3.56“ oder „Java hashCode()“, dazu die Zahl der Listen M (bei M = 1 ist alles wieder eine einzige Liste). Das Protokoll ist aufgebaut wie die Tabelle links in der Abbildung: Schlüssel, Hash, Ergebnis.

## Erklärung

**Hashing mit Verkettung (Algorithmus 3.5)**, Klasse `SeparateChainingHashST`. Ganz anderer Ansatz als die Bäume: Statt zu vergleichen, wird aus dem Schlüssel direkt berechnet, wo er liegt.

**Zwei Bausteine:**
- **Hashfunktion:** macht aus einem Schlüssel einen Arrayindex zwischen 0 und M−1.
- **Kollisionsauflösung:** Was tun, wenn zwei Schlüssel auf denselben Index fallen? Hier: Jeder Index bekommt seine eigene verkettete Liste, und alle kollidierenden Schlüssel landen darin.

**Der Code (Listing 3.19):**
- `st[]` ist ein Array aus M Objekten vom Typ `SequentialSearchST`, also genau den ungeordneten Listen aus Algorithmus 3.1 [\[22\]]({{< relref "sequenzielle-suche" >}}). Wiederverwertung statt Neuschreiben.
- Standard ist M = 997 (eine Primzahl, verteilt besser).
- `hash(key)`: `(key.hashCode() & 0x7fffffff) % M`. Das `& 0x7fffffff` löscht das Vorzeichenbit, weil `hashCode()` negativ sein kann und ein negativer Index knallen würde. Dann modulo M.
- `get` und `put`: Index berechnen, dann einfach `get`/`put` der Liste an diesem Index aufrufen. Mehr nicht.
- Der Cast `(SequentialSearchST<Key, Value>[])` ist wieder nötig, weil Java keine generischen Arrays erzeugen kann, wie schon in [\[14\]]({{< relref "stapel" >}}) und [\[23\]]({{< relref "binaere-suche-st" >}}).

**Abbildung 3.56** (M = 5, SEARCHEXAMPLE, Wert = Position):
- Hashwerte: S→2, E→0, A→0, R→4, C→4, H→4, X→2, M→4, P→3, L→3.
- Liste 0: A 8, E 12 (E und A je mehrfach eingefügt, Werte überschrieben)
- Liste 1: leer
- Liste 2: X 7, S 0
- Liste 3: L 11, P 10
- Liste 4: M 9, H 5, C 4, R 3
- Neue Schlüssel stehen jeweils vorn in ihrer Liste, wie bei [\[22\]]({{< relref "sequenzielle-suche" >}}).

**Kosten:**
- N Schlüssel auf M Listen: Durchschnittslänge N/M, unabhängig davon, wie sie sich verteilen.
- Unter der Annahme gleichmäßiger Verteilung (Annahme J im Buch) sind fast alle Listen tatsächlich nahe N/M lang. Suche und Einfügen kosten dann rund N/M Vergleiche.
- Wählt man M proportional zu N, z. B. so, dass N/M zwischen 2 und 8 bleibt, ist das **konstante Zeit** im Schnitt. Dazu das Array mitwachsen lassen wie in [\[14\]]({{< relref "stapel" >}}) (Übung).
- Laut Buch mit 997 Listen etwa 1000-mal schneller als eine einzelne Liste.
- Schlimmster Fall: schlechte Hashfunktion, alle Schlüssel in einer Liste, wieder N.

**Der Preis:** Die Schlüssel liegen wild verstreut. Geordnete Operationen wie `min`, `max`, `floor`, `rank`, `select` oder Bereichssuche gehen nur durch Absuchen aller Listen. Die Bäume aus [\[24\]]({{< relref "bst" >}}) und [\[25\]]({{< relref "rot-schwarz" >}}) können das, Hashing nicht.

**Stand Kapitel 3:**

| | Suche | Einfügen | geordnete Ops |
|---|---|---|---|
| 3.1 Sequenziell | N | N | nein |
| 3.2 Binäre Suche | lg N | N | ja |
| 3.3 BST | lg N Schnitt, N worst | lg N Schnitt, N worst | ja |
| 3.4 Rot-Schwarz | ≤ 2 lg N garantiert | ≤ 2 lg N garantiert | ja |
| 3.5 Hashing Verkettung | N/M, praktisch konstant | N/M, praktisch konstant | nein |

Faustregel: Ordnung gebraucht → Rot-Schwarz-Baum (`TreeMap`). Nur schnell suchen → Hashing (`HashMap`). Als Nächstes kommt Algorithmus 3.6, Hashing mit linearer Sondierung, also ohne Listen, alles in einem Array.

{{< anmerkung >}}
Die Nummern im Text meinen Seiten hier: [22] die [sequenzielle Suche]({{< relref "sequenzielle-suche" >}}), [14] den [Stapel mit Array]({{< relref "stapel" >}}), [23] die [binäre Suche in geordnetem Array]({{< relref "binaere-suche-st" >}}), [24] den [binären Suchbaum]({{< relref "bst" >}}), [25] den [Rot-Schwarz-Baum]({{< relref "rot-schwarz" >}}).

Zu den Hashwerten in Abbildung 3.56: Sie sind nicht das, was der Code mit Java tatsächlich ausrechnet. Ein String aus einem Buchstaben hat als `hashCode()` den Zeichencode, „S“ also 83, und 83 % 5 = 3 – nicht 2 wie in der Abbildung. Mit Javas Werten (S 3, E 4, A 0, R 2, C 2, H 2, X 3, M 2, P 0, L 1) sehen die Listen anders aus: Liste 0: P 10, A 8 · Liste 1: L 11 · Liste 2: M 9, H 5, C 4, R 3 · Liste 3: X 7, S 0 · Liste 4: E 12. Das Buch nimmt die Hashwerte für das Beispiel offenbar einfach an; das Prinzip ändert sich dadurch nicht. In der Visualisierung lässt sich beides einstellen.

Der Java-Code der Visualisierung ist eine eigene Fassung (`HashVerkettung` statt `SeparateChainingHashST`, `m` statt `M`, `size()` über die Listen). Die Listen sind unverändert die `SequenzielleSucheST` von der Seite zur sequenziellen Suche. Der Code ist mit Java 21.0.8 ausgeführt: Für M = 1, 5, 7, 11 und 13 baut er dieselben Listen wie die Visualisierung, `get` und `size` stimmen in Zufallsfolgen mit `java.util.HashMap` überein, und ein String mit negativem `hashCode()` (`Integer.MIN_VALUE`) landet dank `& 0x7fffffff` an einem gültigen Index. Beim Testclient braucht die Tabelle mit den Werten der Abbildung 14 Vergleiche; mit M = 1 sind es genau die 64 der sequenziellen Suche.
{{< /anmerkung >}}
