+++
aliases = ["/it-konzepte/algorithmen/mergesort/"]
title = "Top-Down-Mergesort (Algorithmus 2.4)"
description = "Sortieren durch Mischen aus Sedgewick/Wayne, Algorithmus 2.4 (Listing 2.10) – Schritt für Schritt durch Rekursion und merge, mit Java-Code, Hilfsarray und Ablaufprotokoll."
date = 2026-10-25T14:28:00+01:00
reihenfolge = 240
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 2.4 (Listing 2.10) und Abbildung 2.11"
+++

{{< spiel src="/apps/mergesort.html" titel="Top-Down-Mergesort – Visualisierung" >}}

**So geht's:** Oben steht der Rekursionsbaum: Jeder Streifen ist ein Aufruf `sortiere(a, lo, hi)` über genau den Plätzen, die er sortiert. Orange ist der aktuelle Aufruf, blau umrandet sind die Aufrufe, die auf seine Rückkehr warten, hellblau die fertigen. Unter den Balken steht das Hilfsarray `aux`: Beim `merge` wird der Bereich dorthin kopiert, dann wandert Schritt für Schritt das kleinere der beiden vorderen Elemente (orange, sein Vergleichspartner blau) zurück nach `a[k]` (grün). „Bis gemergt“ springt zum Ende des nächsten `merge`. Das Protokoll zeigt wie Abbildung 2.11 das Array nach jedem `merge`, eingerückt nach Rekursionstiefe.

## Erklärung

Top-Down-Mergesort (Algorithmus 2.4) arbeitet nach „Teile und herrsche“: Array halbieren, beide Hälften rekursiv sortieren, dann die zwei sortierten Hälften zu einem sortierten Ganzen zusammenführen (mergen).

Der Code:

* `aux` ist ein Hilfsarray, das nur einmal angelegt wird, damit nicht bei jedem Rekursionsschritt neuer Speicher entsteht.
* `sort(a, lo, hi)`: Ist der Bereich höchstens ein Element groß (`hi <= lo`), ist er schon sortiert, Rekursion endet.
* Sonst Mitte berechnen, linke Hälfte `lo..mid` sortieren, rechte Hälfte `mid+1..hi` sortieren, dann `merge`.
* `merge` (Listing 2.9, hier nicht abgedruckt) kopiert den Bereich nach `aux` und läuft mit zwei Zeigern durch beide Hälften. Jeweils das kleinere der beiden vorderen Elemente kommt zurück nach `a`.

Die Tabelle zeigt jeden `merge`-Aufruf an MERGESORTEXAMPLE:

* `merge(a, 0, 0, 1)`: M und E → E M
* `merge(a, 2, 2, 3)`: R und G → G R
* `merge(a, 0, 1, 3)`: EM + GR → E G M R
* So wächst es von unten: erst Paare, dann Vierer, dann Achter, zuletzt `merge(a, 0, 7, 15)` mit den beiden sortierten Hälften EEGMORRS und AEELMPTX zum Endergebnis.

Kosten:

* Vergleiche: zwischen ½ N lg N und N lg N, und zwar garantiert, auch im schlimmsten Fall. Das ist der große Sprung gegenüber den N² der elementaren Verfahren.
* Zusatzspeicher: proportional zu N für `aux`. Das ist der Haken, Mergesort sortiert nicht in place.
* Stabil: Gleiche Elemente behalten ihre Reihenfolge.

Rekursionsbaum: lg N Ebenen, auf jeder Ebene wird insgesamt N mal gemergt, daher N lg N. Genau das beschreibt der Text unten auf der Seite mit den 2^k Teilarrays auf Ebene k.

{{< anmerkung >}}
„Die Tabelle“ und „der Text unten auf der Seite“ meinen das Buch, Abbildung 2.11 und den Absatz darunter. `sort` heißt im Code der Visualisierung `sortiere`, und `merge` ist eine eigene Fassung, weil Listing 2.9 nicht mit abgedruckt war. In der Visualisierung stehen Zahlen statt Buchstaben. Mit den Buchstaben MERGESORTEXAMPLE liefert sie genau die 15 Zeilen aus Abbildung 2.11 und braucht dafür 45 Vergleiche. Die Grenzen ½ N lg N und N lg N gelten im Buch für Zweierpotenzen wie 16. Bei 10, 12 oder 20 Zahlen kann ein schon sortiertes Array knapp unter ½ N lg N bleiben. Darum zeigt der Zähler die genauen Grenzen für die gewählte Größe.
{{< /anmerkung >}}
