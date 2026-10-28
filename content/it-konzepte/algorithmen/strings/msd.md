+++
title = "MSD-Sortierverfahren (Algorithmus 5.2)"
description = "Das MSD-Sortierverfahren aus Sedgewick/Wayne, Algorithmus 5.2 (Listing 5.4 und 5.5) – Strings beliebiger Länge vom ersten Zeichen aus sortiert, Gruppe für Gruppe rekursiv, mit Insertionsort für kleine Teilarrays, an „she sells seashells …“ wie in Abbildung 5.12 und 5.13."
date = 2026-10-28T17:53:00+01:00
reihenfolge = 520
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.2 (Listing 5.4 und 5.5)"
+++

{{< spiel src="/apps/msd.html" titel="MSD-Sortierverfahren – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit den 14 Strings aus Abbildung 5.12 und M = 0 wie in Abbildung 5.13. Jeder Aufruf `sort(a, lo, hi, d)` bearbeitet den blau markierten Bereich und sortiert nach dem Zeichen an Position d, das rot ist. Ein rotes ▪ heißt, dass der String dort schon zu Ende ist (`charAt` liefert −1). In der Mitte stehen `count[]` (nur die vorkommenden Werte, mit dem echten Index bei R = 256) und darunter der Aufrufstapel, rechts `aux[]`. Nach Zählen, Aufsummieren, Verteilen und Zurückkopieren zeigt die Tabelle die Gruppen, und für jede Gruppe kommt ein rekursiver Aufruf mit d + 1. Grün sind Plätze, die endgültig stehen. Mit M = 3 oder M = 15 gehen kleine Teilarrays an Insertionsort aus Listing 5.5. Bei M = 15 sortiert schon der erste Aufruf alle 14 Strings so. Das Protokoll listet die Aufrufe eingerückt nach Rekursionstiefe, mit der Größe jeder Gruppe. „Zufallsdaten“ erzeugt kurze Strings aus a, b und c mit vielen gemeinsamen Präfixen, „↺ Neu starten“ springt zurück zum Beispiel aus dem Buch.

## Erklärung

**MSD-Sortierverfahren (Algorithmus 5.2)**, Klasse `MSD`. *Most significant digit first*: Sortiert wird vom **ersten** Zeichen aus nach rechts. Damit gehen auch Strings **unterschiedlicher Länge**, was LSD [\[43\]]({{< relref "lsd" >}}) nicht kann.

**Idee:**

- Nach dem ersten Zeichen mit schlüsselindiziertem Zählen sortieren. Dadurch entstehen Gruppen: alle mit a vorn, alle mit b vorn …
- Jede Gruppe für sich **rekursiv** nach dem zweiten Zeichen sortieren, deren Untergruppen nach dem dritten, und so weiter.
- Wie Quicksort [\[11\]]({{< relref "quicksort" >}}) arbeitet es von oben nach unten, nur dass in bis zu R Teile statt in zwei aufgeteilt wird.

**Der Code:**

- `charAt(s, d)`: liefert das d-te Zeichen oder **−1**, wenn der String schon zu Ende ist. Dadurch gilt das Stringende als kleiner als jedes Zeichen, und „she“ kommt vor „shells“.
- Weil es jetzt R + 1 mögliche Werte gibt (−1 bis 255), ist `count` R + 2 groß und alle Indizes sind um eins verschoben (`+ 2` beim Zählen, `+ 1` beim Verteilen).
- Dann dieselben Schritte wie in [\[43\]]({{< relref "lsd" >}}): zählen, in Indizes umwandeln, verteilen, zurückkopieren. Aber nur im Bereich `lo..hi`.
- Danach für jedes Zeichen r rekursiv das Teilarray mit diesem Zeichen an Position d sortieren, jetzt ab Position d + 1.
- Die Gruppe der Strings, die bei d schon enden, wird nicht weiter sortiert: Die sind alle gleich.

**Wechsel zu Insertionsort bei kleinen Teilarrays (M = 15):**

- Jeder Rekursionsaufruf legt ein `count`-Array der Größe R + 2 an und läuft es durch. Bei R = 256 ist das für ein Teilarray mit zwei oder drei Strings absurd teuer, bei Unicode (R = 65536) erst recht.
- Und es gibt sehr viele winzige Teilarrays, weil die Aufteilung so breit ist.
- Deshalb ab höchstens 15 Elementen Insertionsort [\[3\]]({{< relref "insertionsort" >}}), in einer Variante, die erst ab Zeichen d vergleicht. Das macht MSD laut Buch erst praktikabel.

**Kosten:**

- Zufällige Strings: Untersucht werden im Schnitt nur etwa N log_R N Zeichen. Meist reichen wenige Anfangszeichen, um die Strings auseinanderzuhalten, der Rest wird nie angeschaut. Das ist sublinear in der Gesamtzahl der Zeichen.
- Schlimmster Fall: viele gleiche Strings oder lange gemeinsame Präfixe. Dann muss jedes Zeichen angefasst werden, und für jedes Zeichen der gemeinsamen Präfixe entstehen Rekursionsebenen mit leeren `count`-Durchläufen.
- Speicher: N für `aux`, dazu pro Rekursionsebene ein `count` der Größe R. Die Tiefe ist höchstens die Länge des längsten Strings W, also etwa N + R · W.

**LSD vs. MSD:**

| | LSD (5.1) | MSD (5.2) |
|---|---|---|
| Richtung | rechts nach links | links nach rechts |
| Stringlängen | alle gleich (W) | beliebig |
| Aufbau | W Durchgänge über alles | rekursiv, Gruppen verfeinern |
| Zeichen angeschaut | alle, W · N | oft nur wenige pro String |
| Schwachstelle | – | kleine Teilarrays, lange gemeinsame Präfixe, großes R |
| Zusatzspeicher | N + R | N + R · W |

Die Schwächen von MSD (Speicher pro Ebene, Probleme mit gleichen Präfixen) behebt der nächste Algorithmus: 3-Wege-Quicksort für Strings (Algorithmus 5.3).

**Kapitel 5 bisher:**

- Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
- Algorithmus 5.2: MSD-Sortierverfahren [44]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Mit M = 0 erzeugt die Visualisierung den oberen Aufruf aus Abbildung 5.12 genauso. Nach dem Verteilen steht „are by she sells seashells sea shore shells she sells surely seashells the the“ da, und die Gruppen sind `sort(a, 2, 11, 1)` für s und `sort(a, 12, 13, 1)` für t. Auch die Spalten von Abbildung 5.13 kommen so heraus, bis zur langen Kette für die beiden gleichen „seashells“. Die Abbildungen rechnen allerdings mit dem Kleinbuchstaben-Alphabet (R = 26) und M = 0, das Listing mit R = 256 und M = 15. Die Visualisierung nimmt R = 256 wie das Listing. Gruppen und Aufrufe sind dieselben, nur die Indizes in `count[]` sind andere, zum Beispiel 117 statt 20 für die s-Gruppe. M ist in der Visualisierung wählbar, darum ist es im Java-Code nicht `final` wie im Buch. Der Testclient `main()` und `exch()` sind von mir, beide druckt das Buch nicht ab. Genau genommen bedeutet `hi <= lo + M` Teilarrays bis M + 1 Strings, also bis 16 und nicht bis 15. Das Buch selbst merkt in einer Fußnote an, dass `substring()` in `less()` seit Java 7 Update 6 den Teilstring kopiert und damit nicht mehr konstante Zeit braucht. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 zufälligen Feldern: bis 40 Strings, Länge 0 bis 8, auch leere Strings, M = 0, 1, 3 und 15, jedes zehnte Feld mit Zeichen quer durch die Codes 1 bis 255. Das Ergebnis ist jedes Mal gleich `Arrays.sort`, und Java und Visualisierung liefern dasselbe.
{{< /anmerkung >}}
