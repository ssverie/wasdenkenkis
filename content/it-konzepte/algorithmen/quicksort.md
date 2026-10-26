+++
title = "Quicksort (Algorithmus 2.5)"
description = "Sortieren durch Zerlegen aus Sedgewick/Wayne, Algorithmus 2.5 (Listing 2.12) – Schritt für Schritt durch partition und Rekursion, mit Java-Code, Rekursionsbaum und Ablaufprotokoll."
date = 2026-10-25T14:38:00+01:00
reihenfolge = 250
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 2.5 (Listing 2.12) und Abbildung 2.17"
+++

{{< spiel src="/apps/quicksort.html" titel="Quicksort – Visualisierung" >}}

**So geht's:** Orange ist das Pivot `v = a[lo]`. Die Zeiger `i` (von links) und `j` (von rechts) laufen aufeinander zu, das gerade verglichene Element ist blau, noch nicht angesehene Elemente sind grau. Getauscht wird grün. Hellblau sind die Elemente, die schon endgültig stehen. Oben zeigt der Rekursionsbaum jeden Aufruf `sortiere(a, lo, hi)` als Streifen über seinen Plätzen. „Bis Tausch“ springt zum nächsten Tausch, „Bis Pivot platziert“ zum Ende der nächsten Partition. Das Protokoll zeigt wie Abbildung 2.17 `lo`, `j`, `hi` und das Array nach jedem Aufruf. Zum Ausprobieren: „vorher mischen“ ausschalten und „schon sortiert“ wählen. Dann ist das Pivot jedes Mal das kleinste Element, der Baum wird zur Treppe, und die Vergleiche steigen auf den schlimmsten Fall.

## Erklärung

Quicksort (Algorithmus 2.5) ist ebenfalls „Teile und herrsche“, aber spiegelverkehrt zu Mergesort: Mergesort teilt stumpf in der Mitte und leistet die Arbeit beim Zusammenführen. Quicksort leistet die Arbeit beim Aufteilen, danach muss nichts mehr zusammengeführt werden.

Der Code:

* `StdRandom.shuffle(a)`: Das Array wird zuerst zufällig gemischt. Das klingt seltsam, schützt aber vor dem schlimmsten Fall (z. B. bereits sortierte Eingabe).
* `partition(a, lo, hi)` (Listing 2.13, hier nicht abgedruckt) nimmt ein Pivot-Element, hier `a[lo]`, und ordnet so um, dass links davon nur Kleinere und rechts nur Größere stehen. Das Pivot sitzt danach an Position `j` endgültig richtig.
* Dann rekursiv links `lo..j-1` und rechts `j+1..hi` sortieren. Fertig, kein Merge nötig.

Partitionieren im Kern: Ein Zeiger läuft von links, bis er ein Element ≥ Pivot findet, einer von rechts, bis er eins ≤ Pivot findet. Die beiden werden getauscht. Wenn sich die Zeiger kreuzen, kommt das Pivot an die Kreuzungsstelle.

Die Tabelle (QUICKSORTEXAMPLE, nach dem Mischen KRATELEPUIMQCXOS):

* Erste Zeile `lo=0, j=5, hi=15`: Pivot K landet an Index 5. Links davon E C A I E, alle kleiner, rechts alles größer.
* Dann links weiter mit `lo=0, hi=4`: Pivot E landet an Index 3, und so fort.
* Rot = das Pivot an seiner endgültigen Position.
* Zeilen ohne `j` (z. B. lo=1, hi=1): Teilarrays der Größe 1, da wird nicht partitioniert.

Kosten:

* Durchschnitt: etwa 1,39 N lg N Vergleiche, also rund 39 % mehr als Mergesort. In der Praxis trotzdem meist schneller, weil die innere Schleife extrem knapp ist und kaum Daten bewegt.
* Schlimmster Fall: ~N²/2, wenn das Pivot immer das kleinste oder größte Element ist. Durch das Mischen praktisch ausgeschlossen.
* Speicher: in place, nur Rekursionsstapel (im Schnitt lg N).
* Nicht stabil.

Mergesort vs. Quicksort: Mergesort garantiert N lg N und ist stabil, braucht aber ein Zusatzarray der Größe N. Quicksort kommt ohne aus und ist im Mittel schneller, verlässt sich dafür auf den Zufall.

{{< anmerkung >}}
„Die Tabelle“ und „Rot“ meinen das Buch, Abbildung 2.17. In der Visualisierung ist das Pivot im Protokoll orange. `sort` heißt im Code `sortiere`, `StdRandom.shuffle` heißt `mische`. `partition` ist eine eigene Fassung, weil Listing 2.13 nicht mit abgedruckt war. Schaltet man „vorher mischen“ aus und gibt die schon gemischte Folge KRATELEPUIMQCXOS ein, liefert die Visualisierung genau die 16 Zeilen aus Abbildung 2.17, mit 68 Vergleichen. 1,39 N lg N und N²/2 sind Näherungen für große N. Bei 16 Zahlen braucht Quicksort im Mittel genau gerechnet etwa 69 Vergleiche statt 89, im schlimmsten Fall 150 statt 128. Der Zähler zeigt deshalb die genauen Werte für die gewählte Größe.
{{< /anmerkung >}}
