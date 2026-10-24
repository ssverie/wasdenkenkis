+++
title = "Selectionsort (Algorithmus 2.1)"
description = "Sortieren durch Auswählen aus Sedgewick/Wayne, Algorithmus 2.1 (Listing 2.4) – Schritt für Schritt, mit Java-Code und Ablaufprotokoll."
date = 2026-10-24T17:20:00+02:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 2.1 (Listing 2.4) und Abbildung 2.1"
+++

{{< spiel src="/apps/selectionsort.html" titel="Selectionsort – Visualisierung" >}}

**So geht's:** Mit „Schritt“ einzeln durchgehen, mit „Bis Tausch“ zum Ende des nächsten Durchlaufs springen oder alles abspielen lassen. Blau ist das Element `a[j]`, das gerade geprüft wird, orange das bisher kleinste `a[min]`, grau der fertige Teil links von `i`. Rechts wächst das Ablaufprotokoll wie in Abbildung 2.1 des Buchs: je Durchlauf `i`, `min` und der Inhalt des Arrays direkt nach dem Tausch. Unter „Anordnung“ lässt sich ein schon sortiertes oder umgekehrtes Array wählen. Die Zahl der Vergleiche bleibt dabei immer gleich.

## Erklärung

Selectionsort in einem Satz: Such das kleinste Element, tausch es nach vorn, dann such das kleinste im Rest, tausch es an Position 2, und so weiter.

Der Code:

* Äußere Schleife `i` geht Position für Position durch.
* Innere Schleife `j` durchsucht den unsortierten Rest ab `i+1` und merkt sich in `min` den Index des kleinsten Elements.
* `exch(a, i, min)` tauscht dieses Minimum an Stelle `i`. Danach ist alles links von `i+1` fertig und wird nie wieder angefasst.

Die Tabelle zeigt das am Wort SORTEXAMPLE:

* Zeile 0: Kleinstes ist das A an Index 6 → tausch mit S an Index 0.
* Zeile 1: Im Rest ist das E an Index 4 am kleinsten → tausch mit O an Index 1.
* Rot = das gefundene Minimum, schwarz = wird noch durchsucht, grau = steht bereits endgültig richtig.

Kosten:

* Vergleiche: etwa N²/2, und zwar immer, egal ob das Array schon sortiert ist oder nicht. Das ist die Schwäche.
* Tauschoperationen: genau N, also linear. Das ist die Stärke, auf die der Abschnitt oben anspielt. Kein anderes elementares Verfahren bewegt so wenig Daten, was sich lohnt, wenn Verschieben teuer ist (z. B. große Datensätze).

{{< anmerkung >}}
Die Erklärung bezieht sich auf das Buch: „die Tabelle“ und die Farben Rot, Schwarz und Grau meinen Abbildung 2.1, „der Abschnitt oben“ den Absatz „Die Datenverschiebung ist minimal“, und `exch` ist die Tauschmethode aus dem Buch. In der Visualisierung heißt sie `tausche`, das Minimum ist orange, und statt SORTEXAMPLE stehen Zahlen.
{{< /anmerkung >}}
