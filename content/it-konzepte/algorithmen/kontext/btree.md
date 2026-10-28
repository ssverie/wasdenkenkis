+++
title = "B-Baum (Algorithmus 6.1)"
description = "Der B-Baum aus Sedgewick/Wayne, Algorithmus 6.1 (Listing 6.5) – Seiten mit bis zu M Schlüsseln, Suche mit einer Seite pro Ebene, Einfügen unten mit Teilung voller Seiten auf dem Rückweg, am Beispiel der B-Bäume der Ordnung 6 aus den Abbildungen 6.7 bis 6.9."
date = 2026-10-28T21:54:00+01:00
reihenfolge = 610
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 6.1 (Listing 6.5)"
+++

{{< spiel src="/apps/btree.html" titel="B-Baum – Visualisierung" >}}

**So geht's:** Beim Öffnen baut der Testclient den B-Baum der Ordnung M = 6 aus Abbildung 6.7 auf und sucht dann E wie in Abbildung 6.8 und G. Jede Seite ist ein Kasten mit M Fächern, „*“ ist der Wächter. Blau ist der Weg von der Wurzel, orange die Seite, an der der Code gerade arbeitet. Gelb ist der Eintrag, dem `next()` folgt. Eine Seite mit M Schlüsseln ist übergelaufen und rot gestrichelt. Im nächsten Schritt teilt `split()` sie, die neue Seite ist orange gepunktet. „Abbildung 6.9“ baut den oberen Baum dieser Abbildung auf und fügt dann A ein. Dabei laufen erst eine externe Seite und dann die Wurzel über, und der Baum wächst oben. Unter dem Baum stehen die Seiten, die die Operation angefasst hat, das sind die Sondierungen. Mit M = 4 sieht man kleinere Seiten und mehr Teilungen. Unter „add“ und „contains“ kann man eigene Schlüssel einfügen oder suchen. Auf dem Handy lässt sich der Baum seitlich verschieben.

## Erklärung

**B-Baum (Algorithmus 6.1)**, Klasse `BTreeSET`. Kapitel 6, „Im Kontext“. Es geht um Suchen in Datenmengen, die so groß sind, dass sie nicht in den Arbeitsspeicher passen, sondern auf der Festplatte liegen.

**Das Kostenmodell ändert sich:** Ein Zugriff auf die Festplatte (eine **Sondierung**) ist um Größenordnungen teurer als alles, was im Arbeitsspeicher passiert. Gezählt werden deshalb nur noch Seitenzugriffe, Vergleiche spielen kaum eine Rolle. Ziel: so wenige Seiten wie möglich anfassen.

**Die Idee:** Eine Verallgemeinerung des 2-3-Baums aus [\[25\]]({{< relref "rot-schwarz" >}}). Statt 2 oder 3 Verweisen pro Knoten hat jeder Knoten (eine **Seite**, also ein Festplattenblock) bis zu **M** Verweise, z. B. M = 1000. Der Baum wird dadurch extrem flach.

**Aufbau:**
- **Externe Seiten** (unterste Ebene): enthalten die eigentlichen Schlüssel (bzw. Daten).
- **Interne Seiten:** enthalten Kopien von Schlüsseln, jeweils mit einem Verweis auf eine Seite darunter. Jeder Schlüssel ist der kleinste in seinem Teilbaum.
- Jede Seite außer der Wurzel ist mindestens halb voll (M/2) und höchstens voll (M−1 nach einer Teilung).
- **Wächter (Sentinel):** Im Konstruktor wird ein Schlüssel eingefügt, der kleiner als alle anderen ist. Damit hat jede Seite einen Eintrag, der ≤ jedem Suchschlüssel ist, und `next(key)` findet immer einen passenden Teilbaum.

**Die Page-API** (Tabelle 6.2), auf die sich der Code stützt:
- `Page(bottom)`: neue Seite, extern oder intern.
- `close()`: Seite schließen, also auf die Festplatte zurückschreiben.
- `add(key)` / `add(page)`: Schlüssel bzw. Verweis auf eine Seite einfügen.
- `isExternal()`, `contains(key)`, `isFull()`.
- `next(key)`: der Teilbaum, in dem der Schlüssel liegen muss.
- `split()`: die größere Hälfte der Schlüssel auf eine neue Seite verschieben und diese zurückgeben.

**`contains(key)`:** Von der Wurzel aus über `next(key)` nach unten. Auf der externen Seite nachsehen, ob der Schlüssel da ist. Ein Pfad, eine Seite pro Ebene.

**`add(key)`**, rekursiv:
- Auf der externen Seite: Schlüssel einfügen, fertig.
- Sonst: über `next(key)` in die passende Seite absteigen und dort rekursiv einfügen.
- **Auf dem Rückweg:** Ist die Kindseite dabei voll geworden, wird sie geteilt (`split()`) und der Verweis auf die neue Hälfte in die aktuelle Seite eingetragen. Dadurch kann auch diese voll werden, und das Spiel geht eine Ebene höher weiter. Danach `next.close()`.
- **Wurzel voll:** Sie wird geteilt und es entsteht eine neue Wurzel mit genau zwei Verweisen (linke und rechte Hälfte). Nur so wächst der Baum in der Höhe, und zwar **oben**, genau wie beim 2-3-Baum. Deshalb liegen alle externen Seiten immer auf derselben Tiefe, der Baum ist perfekt balanciert.

**Satz B:** Suchen oder Einfügen in einem B-Baum der Ordnung M mit N Schlüsseln braucht zwischen log_M N und log_{M/2} N Sondierungen, in der Praxis also eine konstante Zahl.
- Beweis: Jede innere Seite außer der Wurzel hat zwischen M/2 und M Verweise. Die Höhe liegt also zwischen der eines vollständigen Baums mit Verzweigungsgrad M und der mit Verzweigungsgrad M/2.
- Konkret bei M = 1000: Für bis zu 62,5 Milliarden Schlüssel braucht man höchstens 4 Sondierungen (500⁴ = 6,25 · 10¹⁰).
- Hält man die Wurzel ständig im Arbeitsspeicher, ist es eine Sondierung weniger. In der Praxis wird die Wurzel ohnehin am häufigsten benutzt und landet automatisch im Cache.

**Speicher:** Weil Seiten nur halb bis ganz voll sind, bleibt Platz frei. Bei zufälligen Schlüsseln braucht ein B-Baum im Schnitt etwa 1,44 · N/M Seiten. Die Seiten sind also durchschnittlich zu rund 69 % gefüllt (ln 2), etwa 31 % bleiben leer. Das ist der Preis dafür, dass beim Einfügen nur selten geteilt werden muss.

**Einordnung:**

| | 2-3-Baum / Rot-Schwarz (3.4) | B-Baum (6.1) |
|---|---|---|
| Verweise pro Knoten | 2 bis 3 | M/2 bis M (z. B. 1000) |
| Höhe | ≈ lg N | ≈ log_M N, praktisch 3 bis 4 |
| Kostenmaß | Vergleiche | Seitenzugriffe auf die Platte |
| Wachstum | an der Wurzel | an der Wurzel |
| Einsatz | Arbeitsspeicher (`TreeMap`) | Datenbanken, Dateisysteme |

Der 2-3-Baum ist damit nichts anderes als ein B-Baum der Ordnung 3. Die Variante im Buch, bei der alle Schlüssel auf der untersten Ebene liegen und die inneren Seiten nur Kopien zum Wegweisen tragen, heißt in der Praxis meist **B+-Baum**. Fast jede relationale Datenbank (Indizes) und viele Dateisysteme (NTFS, ext4-Verzeichnisse, Btrfs, APFS) arbeiten damit.

**Kapitel 6 bisher:**
- Algorithmus 6.1: B-Baum [54]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die App baut die Bäume aus den Abbildungen Seite für Seite nach:

- Abbildung 6.7: Wurzel \* K, darunter \* D H und K Q U, unten \* B C, D E F, H I J, K M N O P, Q R T und U W X Y.
- Abbildung 6.8: contains("E") geht über \* und D zur Seite D E F, drei Sondierungen.
- Abbildung 6.9, oben: Wurzel \* H K Q U über \* B C E F, H I J, K M N O P, Q R T und U W X.
- Abbildung 6.9, Einfügen von A: Die Seite \* A B C E F läuft über und wird zu \* A B und C E F. Dann läuft die Wurzel \* C H K Q U über. Neue Wurzel \* K über \* C H und K Q U, genau wie im untersten Bild.

Die Reihenfolge, in der die Schlüssel eingefügt werden, steht nicht im Buch. Ich habe für beide Abbildungen eine Folge gewählt, die genau diese Bäume ergibt, sie steht im Protokoll der App. Abbildung 6.8 zeigt die rechte untere Seite als U W X, Abbildung 6.7 denselben Baum mit U W X Y. Für die Suche nach E spielt das keine Rolle.

**Zum Text:** „Der 2-3-Baum ist nichts anderes als ein B-Baum der Ordnung 3“ passt nicht ganz zur Definition im Buch. Dort ist M gerade, und ein Knoten hat zwischen M/2 und M − 1 Referenzen. Die Form des 2-3-Baums, also 2 oder 3 Referenzen je Knoten, ergibt sich bei M = 4. Das kann man in der App mit M = 4 ausprobieren. Außerdem stehen beim 2-3-Baum die Schlüssel in den inneren Knoten, beim B-Baum des Buchs nur Kopien. Die Zahlen zum Speicher (1,44 · N/M Seiten) stehen nicht auf den Seiten, die ich gesehen habe. Die habe ich nicht nachgeprüft.

**Code:** `BTreeSET` ist der aus Listing 6.5, `main()` ist von mir. `Page` steht nicht im Buch, es verweist dafür auf Übung 6.15. Meine Fassung folgt der API in Tabelle 6.2 und hält die Schlüssel sortiert in einem Array wie `BinarySearchST` [\[23\]]({{< relref "binaere-suche-st" >}}). `isFull()` meldet eine übergelaufene Seite mit M Schlüsseln. `split()` schiebt die M/2 größten auf eine neue Seite, `close()` tut im Arbeitsspeicher nichts. Fügt man einen Schlüssel ein zweites Mal ein, bleibt die Seite unverändert, denn eine Menge enthält jeden Schlüssel nur einmal.

**Tests:** Geprüft habe ich mit Java 21 und 300 Zufallsfolgen mit M = 4, 6 und 8 und bis zu 60 Operationen, darunter 2370 Abfragen. `contains()` stimmt jedes Mal mit `java.util.TreeSet` überein. Nach jeder Folge habe ich geprüft: Alle externen Seiten liegen gleich tief, jede Seite außer der Wurzel hat zwischen M/2 und M − 1 Schlüssel, und jeder Eintrag einer internen Seite ist der kleinste Schlüssel seines Teilbaums. Java und Visualisierung bauen dabei jedes Mal genau denselben Baum.
{{< /anmerkung >}}
