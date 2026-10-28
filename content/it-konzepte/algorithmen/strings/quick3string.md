+++
title = "3-Wege-Quicksort für Strings (Algorithmus 5.3)"
description = "Der 3-Wege-Quicksort für Strings aus Sedgewick/Wayne, Algorithmus 5.3 (Listing 5.6) – Partitionierung in kleiner, gleich und größer nach einem einzigen Zeichen, der Gleich-Teil geht mit dem nächsten Zeichen weiter, an „she sells seashells …“ wie in Abbildung 5.18."
date = 2026-10-28T18:23:00+01:00
reihenfolge = 530
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.3 (Listing 5.6)"
+++

{{< spiel src="/apps/quick3string.html" titel="3-Wege-Quicksort für Strings – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit den 14 Strings aus Abbildung 5.18. Jeder Aufruf `sort(a, lo, hi, d)` bearbeitet den blau markierten Bereich, und das Zeichen an Position d ist rot. Ein rotes ▪ heißt, dass der String dort schon zu Ende ist. Rechts stehen v, das Zeichen von `a[lo]`, und das gerade geprüfte Zeichen t. Neben `a[]` stehen die Zeiger `lt`, `i` und `gt`. Während der Partitionierung färbt sich der Bereich: blau ist kleiner als v, gelb gleich, lila größer, dazwischen liegt das noch Ungeprüfte. Danach folgen drei rekursive Aufrufe, Kleiner- und Größer-Teil wieder mit d, der Gleich-Teil mit d + 1. Grün sind Plätze, die endgültig stehen. Der Aufrufstapel zeigt, in welchem Teil der Eltern-Aufruf gerade steckt, das Protokoll listet jede Partitionierung eingerückt nach Rekursionstiefe. Oben zählt die App die Zeichenvergleiche. „Zufallsdaten“ erzeugt kurze Strings aus a, b und c mit vielen gemeinsamen Präfixen, „↺ Neu starten“ springt zurück zum Beispiel aus dem Buch.

## Erklärung

**3-Wege-Quicksort für Strings (Algorithmus 5.3)**, Klasse `Quick3string`. Eine Kreuzung aus Quicksort [\[11\]]({{< relref "quicksort" >}}) und MSD [\[44\]]({{< relref "msd" >}}): Partitioniert wird wie bei Quicksort, aber immer nur nach **einem Zeichen** an Position d, wie bei MSD.

**Idee:**

- Partitionszeichen v ist das d-te Zeichen des ersten Strings `a[lo]`.
- Das Teilarray wird in **drei** Teile zerlegt (3-Wege-Partitionierung nach Dijkstra): d-tes Zeichen kleiner als v, gleich v, größer als v.
- Rekursion:
  - kleiner und größer: wieder ab Position **d** (das Zeichen ist noch nicht sortiert),
  - gleich: ab Position **d + 1** (dieses Zeichen ist bei allen gleich, also weiter zum nächsten).
- Gleich-Teil nur, wenn v ≥ 0. Bei v = −1 (Stringende) sind die Strings komplett gleich, nichts mehr zu tun.

**Der Code:**

- `lt`, `i`, `gt` sind drei Zeiger. Links von `lt` liegt alles Kleinere, zwischen `lt` und `i` alles Gleiche, rechts von `gt` alles Größere, dazwischen das noch Ungeprüfte.
- Zeichen kleiner → nach links tauschen, beide Zeiger vor. Größer → nach rechts tauschen, `gt` zurück. Gleich → nur `i` vor.
- `charAt` liefert wie bei MSD −1 am Stringende.

**Abbildung 5.18** (she sells seashells by the sea shore …):

- Erste Partitionierung nach dem ersten Zeichen von „she“, also s: kleiner sind by, are; gleich sind alle s-Wörter; größer sind the, the.
- Der große s-Block wird ab dem zweiten Zeichen weiterbearbeitet (e, h, u …), die Ränder ab dem ersten.
- Graue Balken = leere Teilarrays. Wo das Stringende erreicht ist, gibt es keinen weiteren Aufruf, etwa bei she, sea, the.
- Bei seashells und sells sieht man, wie die gleichen Präfixe einfach Zeichen für Zeichen abgearbeitet werden, ohne die Gruppe zu zerlegen.

**Kosten** (Satz E im Buch): Für N zufällige Strings im Schnitt etwa 2 N ln N Zeichenvergleiche.

**Warum besser als MSD [\[44\]]({{< relref "msd" >}})?**

- Kein `count`-Array pro Aufruf, also kein Zusatzspeicher außer dem Rekursionsstapel.
- Immer nur drei Teile statt R + 1, also keine Flut leerer Teilarrays, egal wie groß das Alphabet ist.
- Lange gemeinsame Präfixe sind kein Problem: Sie landen im Gleich-Teil und werden mit d + 1 einfach durchgereicht.

**Warum besser als normales Quicksort [\[11\]]({{< relref "quicksort" >}})?**

- Normales Quicksort vergleicht ganze Strings mit `compareTo()`. Das läuft jedes Mal von vorn über die gemeinsamen Präfixe. Bei URLs wie „edu.princeton.cs…“ heißt das: immer wieder dieselben 14 Zeichen.
- 3-Wege-Quicksort für Strings schaut jedes Präfix-Zeichen nur einmal an und geht dann weiter.

**Die Verbesserungen im Text:**

- **Kleine Teilarrays:** Wechsel zu Insertionsort (Listing 5.5), der gleiche Anfangszeichen überspringt. Bringt etwas, aber weniger als bei MSD, weil hier ohnehin keine teuren `count`-Arrays anfallen.
- **Begrenztes Alphabet:** lohnt sich hier nicht. Der Zusatzcode säße in der inneren Schleife und würde mehr kosten als bringen.
- **Randomisierung:** Wie bei jedem Quicksort vorher mischen oder das Partitionselement zufällig wählen. Schützt vor dem schlimmsten Fall bei vorsortierter Eingabe.
- **Schlussgedanke:** Alle Vergleichsverfahren aus Kapitel 2 sind bei Strings eigentlich schon eine Art MSD, weil `compareTo()` die Zeichen von links nach rechts liest und beim ersten Unterschied aufhört.

**Die drei Stringsortierverfahren:**

| | LSD (5.1) | MSD (5.2) | 3-Wege-Quicksort (5.3) |
|---|---|---|---|
| Richtung | rechts nach links | links nach rechts | links nach rechts |
| Stringlängen | alle gleich | beliebig | beliebig |
| Aufteilung | R Fächer, W Durchgänge | R + 1 Fächer, rekursiv | 3 Teile, rekursiv |
| Stabil | ja | ja | nein |
| Zusatzspeicher | N + R | N + R · W | Rekursionsstapel (W + lg N) |
| Stark bei | kurze, gleich lange Schlüssel | zufällige Strings, kleines R | lange gemeinsame Präfixe, großes R |
| Schwach bei | ungleich langen Strings | vielen kleinen Teilarrays, großem R | – (allgemein guter Standard) |

**Kapitel 5 bisher:**

- Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
- Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
- Algorithmus 5.3: 3-Wege-Quicksort für Strings [45]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die Visualisierung erzeugt die ersten Spalten von Abbildung 5.18 genauso. Nach der ersten Partitionierung steht „by are seashells she seashells sea shore surely shells she sells sells the the“ da, nach der zweiten im s-Block „seashells sells seashells sea sells | shells she surely shore she“, und am Ende kommt die sortierte Ausgabe. Der Java-Code ist der aus dem Listing, nur `exch()` und den Testclient `main()` habe ich selbst geschrieben, beide druckt das Buch nicht ab. Die Zahl der Zeichenvergleiche oben zählt jedes `charAt(a[i], d)`, das mit v verglichen wird. Für die 14 Strings aus dem Buch sind es 53. Die 2 N ln N aus Satz E gelten für zufällige Strings, nicht für dieses Beispiel. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 400 zufälligen Feldern: bis 40 Strings, Länge 0 bis 8, auch leere und viele gleiche Strings, jedes zehnte Feld mit Zeichen quer durch die Codes 1 bis 255. Das Ergebnis ist jedes Mal gleich `Arrays.sort`, und Java und Visualisierung liefern dasselbe.
{{< /anmerkung >}}
