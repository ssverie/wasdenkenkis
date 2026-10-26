+++
title = "Bag / Multimenge (Algorithmus 1.4)"
description = "Die Multimenge als Kette aus Sedgewick/Wayne, Algorithmus 1.4 (Listing 1.42) – hineinlegen mit add und durchlaufen mit dem Iterator, Schritt für Schritt bis zu Mittelwert und Standardabweichung, mit Java-Code und Protokoll."
date = 2026-10-26T12:37:00+01:00
reihenfolge = 140
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 1.4 (Listing 1.42)"
+++

{{< spiel src="/apps/bag.html" titel="Bag / Multimenge – Visualisierung" >}}

**So geht's:** Oben eine Zahl mit `add` in den Bag legen oder eine Zufallszahl nehmen. `add` sieht genauso aus wie `push` beim [Stapel]({{< relref "stapel-liste" >}}). Herausnehmen kann man nichts, nur durchlaufen: „for (x : bag)“ zeigt den Iterator, wie `aktuell` von `first` über `next` wandert. „Mittelwert & Standardabweichung“ ist der typische Anwendungsfall: Ein kleiner Client läuft zweimal über alle Werte, einmal für die Summe, einmal für die Abweichungen, und man sieht die Zwischensumme Knoten für Knoten. Die „Beispielwerte“ sind zehn Messwerte, „↺ Neu starten“ setzt alles zurück.

## Erklärung

Bag / Multimenge (Algorithmus 1.4). Die einfachste der vier Strukturen: Man kann Elemente hineinwerfen und alle durchlaufen, aber nichts gezielt herausnehmen. Die Reihenfolge spielt keine Rolle, Duplikate sind erlaubt.

Aufbau:

* Verkettete Liste wie beim Stapel [\[15\]]({{< relref "stapel-liste" >}}), nur `first`.
* `add(item)` ist Wort für Wort `push()`: neuer Knoten vorne dran.
* Kein `pop`, kein `dequeue`. `isEmpty()` und `size()` wie beim Stapel, daher hier weggelassen.

Der Iterator, das eigentlich Neue auf der Seite:

* `implements Iterable<Item>` plus `iterator()` macht `for (Item x : bag)` möglich.
* `ListIterator` hält einen Zeiger `current`, der bei `first` startet.
* `hasNext()`: Gibt es noch einen Knoten (`current != null`)?
* `next()`: Wert holen, `current` auf `current.next` weiterschieben.
* `remove()`: leer, nicht unterstützt.

Wofür? Immer wenn man nur sammeln und später auswerten will, z. B. Messwerte einlesen und dann Mittelwert und Standardabweichung berechnen. Später im Buch (Kapitel 4) sind die Adjazenzlisten der Graphen genau solche Bags: Für jeden Knoten werden die Nachbarn gesammelt, die Reihenfolge ist egal.

Bezug zu den anderen: Genau dieser Iterator-Code ist das, was in [\[15\]]({{< relref "stapel-liste" >}}) und [\[16\]]({{< relref "warteschlange" >}}) fehlte. Stapel und Schlange mit verketteter Liste bekommen ihn eins zu eins dazu. Im Fließtext steht übrigens „Algorithmen 1.1 und 1.2“, gemeint sind aber die Listenversionen 1.2 und 1.3. Algorithmus 1.1 hat seinen eigenen `ReverseArrayIterator` schon dabei.

Kapitel 1.3 komplett:

* Algorithmus 1.1: Stapel mit Resizing-Array (LIFO)
* Algorithmus 1.2: Stapel mit verketteter Liste (LIFO)
* Algorithmus 1.3: Warteschlange mit verketteter Liste (FIFO)
* Algorithmus 1.4: Bag mit verketteter Liste (Reihenfolge egal, nur hinzufügen und durchlaufen)

{{< anmerkung >}}
Die Nummern [15] und [16] meinen den [Stapel mit verketteter Liste]({{< relref "stapel-liste" >}}) und die [FIFO-Warteschlange]({{< relref "warteschlange" >}}) hier auf der Seite. Im Code der Visualisierung heißt der `ListIterator` aus dem Buch `KetteEntlang`, `current` heißt `aktuell` und `oldfirst` heißt `altesErstes`. Anders als im Listing stehen `isEmpty()` und `size()` mit drin, weil der Client `size()` braucht. Der Client `Messwerte` ist eine eigene Fassung des Anwendungsfalls aus dem Text. Die zehn Beispielwerte stammen aus dem Bag-Client `Stats` der englischen Buchausgabe: Mittelwert 100,60, Standardabweichung 10,51, und genau das rechnet die Visualisierung aus. Geprüft habe ich sie mit 200 zufälligen Füllungen: Die Kette, die Iteration und beide Kennzahlen stimmten jedes Mal mit einer direkten Rechnung überein.
{{< /anmerkung >}}
