+++
title = "LSD-Sortierverfahren (Algorithmus 5.1)"
description = "Das LSD-Sortierverfahren aus Sedgewick/Wayne, Algorithmus 5.1 (Listing 5.3) – gleich lange Strings von der letzten Zeichenposition zur ersten sortiert, jeder Durchgang ein schlüsselindiziertes Zählen, an den 13 Kennzeichen aus dem Buch."
date = 2026-10-28T17:21:00+01:00
reihenfolge = 510
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.1 (Listing 5.3)"
+++

{{< spiel src="/apps/lsd.html" titel="LSD-Sortierverfahren – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit den 13 Kennzeichen aus der Abbildung zu Listing 5.3. Jeder Durchgang sortiert nach einem Zeichen, angefangen beim letzten, und das Zeichen an der Stelle d ist rot. Links steht `a[]`, in der Mitte `count[]` (nur die Zeichen, die in dieser Spalte vorkommen), rechts `aux[]`. Zuerst zählt `count[c+1]++` die Häufigkeiten, dann macht das Aufsummieren daraus Startplätze, dann wandert jeder String der Reihe nach an `aux[count[c]++]`, und am Ende wird zurückkopiert. Die kleine Zahl #k ist der Platz eines Strings in der Eingabe: Bei gleichen Zeichen behalten die Strings ihre Reihenfolge, so sieht man die Stabilität. Das Protokoll baut Spalte für Spalte die Abbildung aus dem Buch nach. „Bis fertig“ springt ans Ende der jeweiligen Phase, „Zufallsdaten“ erzeugt gleich lange Strings aus einem kleinen Alphabet, „↺ Neu starten“ springt zurück zu den Kennzeichen.

## Erklärung

LSD-Sortierverfahren (Algorithmus 5.1), Klasse `LSD`. Kapitel 5, Strings. LSD steht für least significant digit first: Sortiert wird von der letzten Zeichenposition zur ersten. Voraussetzung: Alle Strings haben genau dieselbe Länge W, z. B. Kfz-Kennzeichen, Telefonnummern, Kontonummern.

Baustein: schlüsselindiziertes Zählen (vorher im Buch als Listing 5.2). Sortiert nach einem einzelnen Zeichen, ohne einen einzigen Vergleich, in vier Schritten:

1. Häufigkeiten zählen: `count[c + 1]++` für jedes Zeichen c. Das `+ 1` ist ein Trick für Schritt 2.
2. In Startindizes umwandeln: Aufsummieren (`count[r+1] += count[r]`). Danach steht in `count[r]`, ab welcher Position die Strings mit Zeichen r im Ergebnis beginnen.
3. Verteilen: Jeden String an `aux[count[c]++]` schreiben. Das `++` rückt den nächsten Platz für dieses Zeichen weiter.
4. Zurückkopieren nach `a[]`.

* R = 256 ist die Alphabetgröße (erweitertes ASCII).

Entscheidend: Das Verfahren ist stabil. Gleiche Zeichen behalten ihre bisherige Reihenfolge, weil das Verteilen von vorn nach hinten durchläuft. Genau das macht LSD möglich.

LSD selbst: Für d = W−1 runter bis 0 einmal schlüsselindiziertes Zählen nach dem d-ten Zeichen. Mehr nicht.

Warum funktioniert es? Nach dem Durchgang für Position d sind die Strings nach ihren letzten W − d Zeichen sortiert. Der nächste Durchgang sortiert nach dem Zeichen davor. Bei Gleichheit dort bleibt dank Stabilität die Reihenfolge aus den früheren Durchgängen erhalten, also die Sortierung nach den hinteren Zeichen. Nach dem letzten Durchgang (d = 0) ist alles vollständig sortiert.

Das Beispiel (13 Kennzeichen, W = 7):

* d = 6: nach dem letzten Zeichen. Alle mit Endziffer 0 vorn (2IYE230, 3CIO720, 1ICK750, 1ICK750, 3CIO720), dann 3, 4, 5, 8, 9. Die Nuller stehen untereinander in derselben Reihenfolge wie in der Eingabe, das ist die Stabilität.
* d = 5 bis d = 1: jeweils eine Position weiter nach links.
* d = 0: nach dem ersten Zeichen. Ergebnis: 1ICK750 (2×), 1OHV845 (3×), 2IYE230, 2RLA629 (2×), 3ATW723, 3CIO720 (2×), 4JZY524, 4PGC938.
* Rot ist in jeder Spalte das Zeichen, nach dem gerade sortiert wurde.

Kosten (Satz B im Buch): etwa 7WN + 3WR Arrayzugriffe, Zusatzspeicher N + R.

* Für feste W und R ist das linear in N.
* Das schlägt die N lg N aller Vergleichsverfahren aus Kapitel 2 (Mergesort [\[10\]]({{< relref "mergesort" >}}), Quicksort [\[11\]]({{< relref "quicksort" >}}), Heapsort [\[13\]]({{< relref "heapsort" >}})). Kein Widerspruch zur N-lg-N-Untergrenze: Die gilt nur für Verfahren, die über `compareTo()` vergleichen. LSD vergleicht nie, es nutzt die Zeichen direkt als Arrayindex.

Herkunft: Genau so arbeiteten mechanische Lochkarten-Sortiermaschinen. Der Stapel wurde nach der letzten Spalte in Fächer verteilt, wieder eingesammelt, dann nach der vorletzten Spalte und so weiter.

Einordnung: Ideal für gleich lange Schlüssel mit kleinem Alphabet. Für Strings unterschiedlicher Länge folgt als Nächstes MSD (Algorithmus 5.2), das von links nach rechts arbeitet.

Kapitel 5 bisher:

* Algorithmus 5.1: LSD-Sortierverfahren [43]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die Visualisierung erzeugt alle sieben Spalten der Abbildung zu Listing 5.3 Zeichen für Zeichen genauso, von d = 6 bis zur Ausgabe. Der Java-Code ist der aus dem Listing. Nur den Testclient `main()` habe ich ergänzt, weil das Listing keinen hat. Geprüft habe ich ihn mit Java 21 und 400 zufälligen Feldern: bis 40 Strings, Länge 1 bis 8, verschiedene Alphabete, jedes zehnte Feld mit Zeichen quer durch die Codes 1 bis 255. Das Ergebnis ist jedes Mal gleich `Arrays.sort`, Java und Visualisierung liefern dasselbe, und jeder einzelne Durchgang ist eine stabile Sortierung nach dem Zeichen d. Die Absätze habe ich nur an den Zeilenwechseln des Erklärtexts gesetzt, der Wortlaut ist unverändert.
{{< /anmerkung >}}
