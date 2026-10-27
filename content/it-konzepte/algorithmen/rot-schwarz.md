+++
title = "Rot-Schwarz-Baum (Algorithmus 3.4)"
description = "Der linksgerichtete Rot-Schwarz-Baum aus Sedgewick/Wayne, Algorithmus 3.4 (Listing 3.16) – put Schritt für Schritt mit rotateLeft, rotateRight und flipColors auf dem Rückweg, daneben derselbe Baum als 2-3-Baum, mit beiden Einfügefolgen aus Abbildung 3.46."
date = 2026-10-27T13:47:00+01:00
reihenfolge = 340
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 3.4 (Listing 3.16)"
+++

{{< spiel src="/apps/rot-schwarz.html" titel="Rot-Schwarz-Baum – Visualisierung" >}}

**So geht's:** Beim Öffnen ist der Testclient geladen (links in Abbildung 3.46), „Aufsteigend ACEHLMPRSX“ zeigt die rechte Spalte. „Abspielen“ oder „Schritt“ zeigt jeden Aufruf von `put`: abwärts wie im [binären Suchbaum]({{< relref "bst" >}}), auf dem Rückweg dann die drei Regeln – jede Rotation und jeder Farbwechsel ist ein eigener Schritt. Rote Referenzen sind dick und rot gezeichnet. Eine gestrichelte Kante heißt: Der Aufruf hat seinen Teilbaum schon umgebaut, der Aufrufer hängt ihn aber erst beim Rücksprung ein. Unter dem Baum steht derselbe Baum als 2-3-Baum – dort sieht man, wie ein temporärer 4-Knoten (rot gestrichelt) aufgespalten wird und der Baum nur an der Wurzel wächst. Die Titelzeile vergleicht die Höhe mit einem einfachen Suchbaum bei derselben Einfügereihenfolge.

## Erklärung

**Rot-Schwarz-Baum (Algorithmus 3.4)**, Klasse `RedBlackBST`. Ein BST aus [\[24\]]({{< relref "bst" >}}), der sich beim Einfügen selbst ausbalanciert. Damit ist logarithmische Laufzeit garantiert, auch im schlimmsten Fall.

**Die Idee dahinter: 2-3-Bäume**
- Ein 2-3-Baum hat Knoten mit einem Schlüssel (2 Kinder) oder zwei Schlüsseln (3 Kinder). Er wächst nur an der Wurzel nach oben und ist dadurch immer perfekt balanciert: Alle Blätter liegen auf gleicher Tiefe.
- Der Rot-Schwarz-Baum bildet das als normalen Binärbaum nach. Eine **rote Referenz** klebt zwei Knoten zu einem 3-Knoten zusammen. **Schwarze Referenzen** sind die echten Kanten des 2-3-Baums.

**Die Regeln** (linksgerichtete Variante):
- Rote Referenzen zeigen immer nach links.
- Kein Knoten hat zwei rote Referenzen.
- Perfekte Schwarz-Balance: Jeder Pfad von der Wurzel zu einem `null` enthält gleich viele schwarze Referenzen.

**Die Hilfsoperationen:**
- `isRed(h)`: Farbe der Referenz zu h, `null` gilt als schwarz.
- `rotateLeft(h)`: Eine nach rechts zeigende rote Referenz wird nach links gedreht. Das rechte Kind wird zum neuen Teilbaum-Kopf, h wird sein linkes Kind. Die Sortierung bleibt erhalten.
- `rotateRight(h)`: spiegelbildlich.
- `flipColors(h)`: Beide Kinder rot → beide schwarz, h selbst rot. Das spaltet einen temporären 4-Knoten auf und reicht den mittleren Schlüssel nach oben weiter, genau wie im 2-3-Baum.

**`put` (Listing 3.16):** Identisch zum BST, plus drei Zeilen auf dem Rückweg der Rekursion:
1. Rechtes Kind rot, linkes nicht → `rotateLeft`. Rot muss links liegen.
2. Linkes Kind und dessen linkes Kind beide rot → `rotateRight`. Zwei rote hintereinander werden zu einem Knoten mit zwei roten Kindern.
3. Beide Kinder rot → `flipColors`. Rot wandert eine Ebene nach oben.
- Neue Knoten kommen immer **rot** hinzu (sie werden mit einem bestehenden Knoten verklebt).
- Am Ende `root.color = BLACK`. Färbt ein Flip die Wurzel rot, wird sie wieder schwarz gesetzt, und genau dann wächst der Baum um eine Ebene.

**Abbildung 3.46:**
- Links: SEARCHXMPL in normaler Reihenfolge eingefügt.
- Rechts: ACEHLMPRSX in **aufsteigender** Reihenfolge. Beim einfachen BST [\[24\]]({{< relref "bst" >}}) gäbe das eine Kette der Höhe 10. Hier entsteht trotzdem ein flacher, ausgewogener Baum. Das ist der ganze Punkt.

**Kosten:**
- Höhe höchstens 2 lg N (Pfade mit abwechselnd rot und schwarz sind maximal doppelt so lang wie rein schwarze).
- In der Praxis Suche nahe 1,0 lg N, also fast optimal.
- Suchen, Einfügen, Löschen und alle geordneten Operationen logarithmisch, garantiert. Löschen ist deutlich komplizierter und hier nicht abgedruckt.
- `get` ist unverändert aus dem BST, die Farben stören beim Suchen nicht.

**Stand Kapitel 3:**

| | Suche | Einfügen | geordnete Ops |
|---|---|---|---|
| 3.1 Sequenziell | N | N | nein |
| 3.2 Binäre Suche | lg N | N | ja |
| 3.3 BST | lg N Schnitt, N worst | lg N Schnitt, N worst | ja |
| 3.4 Rot-Schwarz | ≤ 2 lg N garantiert | ≤ 2 lg N garantiert | ja |

Das ist die Struktur hinter Javas `TreeMap`. Als Nächstes kommen Hashtabellen (3.5 und 3.6): im Schnitt konstante Zeit, dafür ohne Ordnung.

{{< anmerkung >}}
[24] meint den [binären Suchbaum]({{< relref "bst" >}}) hier auf der Seite. Im Buch sind rote Referenzen rot gezeichnet, in der Visualisierung zusätzlich dick.

Zu `TreeMap`: Sie ist tatsächlich ein Rot-Schwarz-Baum, aber nicht die linksgerichtete Variante aus dem Buch. Laut Javadoc folgt sie den Algorithmen aus Cormen, Leiserson und Rivest, *Introduction to Algorithms* – dort dürfen rote Knoten auch rechts hängen, und das Einfügen arbeitet mit Elternzeigern statt mit Rekursion. Die Garantie ist dieselbe: Höhe höchstens 2 lg N.

Die Höhe zählt die Visualisierung wie beim [binären Suchbaum]({{< relref "bst" >}}) in Kanten (nur die Wurzel: Höhe 0). Die Kette aus ACEHLMPRSX hat darum Höhe 9 – „Höhe 10“ im Text meint dasselbe, in Knoten gezählt.

Der Java-Code der Visualisierung ist eine eigene Fassung (`RotSchwarzBaum` statt `RedBlackBST`). `isRed`, `rotateLeft`, `rotateRight`, `flipColors` und `size` stehen im Listing nur als Verweis auf Abbildungen, sie sind hier selbst geschrieben; `get` ist zum Ausprobieren dabei. Der Code ist mit Java 21.0.8 ausgeführt: 20.000 Einfügungen in Zufallsfolgen, nach jeder alle drei Regeln, die Schwarz-Balance und Höhe ≤ 2 lg N geprüft, Inhalt gegen `java.util.TreeMap`; die Visualisierung zeigt nach jedem `put` genau den Baum, den Java baut (auch die Endstände aus Abbildung 3.46). Beim Testclient: Höhe 3 statt 5 im einfachen Suchbaum, dafür 6 × `rotateLeft`, 3 × `rotateRight` und 4 × `flipColors`.
{{< /anmerkung >}}
