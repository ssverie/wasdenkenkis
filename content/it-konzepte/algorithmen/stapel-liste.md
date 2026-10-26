+++
title = "Stapel mit verketteter Liste (Algorithmus 1.2)"
description = "Der Stapel als Kette von Knoten aus Sedgewick/Wayne, Algorithmus 1.2 (Listing 1.39) – push und pop Zeile für Zeile an der Kette, mit Java-Code, Iterator und Protokoll."
date = 2026-10-26T11:51:00+01:00
reihenfolge = 120
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 1.2 (Listing 1.39)"
+++

{{< spiel src="/apps/stapel-liste.html" titel="Stapel mit verketteter Liste – Visualisierung" >}}

**So geht's:** Die Bedienung ist dieselbe wie beim [Stapel mit Array]({{< relref "stapel" >}}), damit man beide vergleichen kann: Oben ein Wort mit `push` drauflegen, ein Zufallswort nehmen oder mit `pop()` das oberste herunterholen, und jede Operation läuft danach Schritt für Schritt ab, vor und zurück. Statt eines Arrays steht hier die Kette: `first` zeigt auf den obersten Knoten, jeder Knoten besteht aus Wert und `next`, der Pfeil führt zum Knoten darunter, am Ende steht `null`. Beim `push` sieht man die vier Zeilen einzeln: Der neue Knoten hängt kurz allein, bis `first.next = altesErstes` die Kette wieder schließt. Beim `pop()` bleibt der alte Knoten blass stehen, bis er verschwindet. „for (x : stapel)“ läuft die Kette von `first` aus entlang, das „Buchbeispiel“ spielt `tobe.txt` ab. Anders als beim Array wird hier nie umkopiert.

## Erklärung

Stapel mit verketteter Liste (Algorithmus 1.2), Klasse `Stack`. Gleiche Schnittstelle wie [\[14\]]({{< relref "stapel" >}}), aber statt eines Arrays eine Kette von Knoten.

Aufbau:

* `Node` ist ein Knoten mit zwei Feldern: `item` (der Wert) und `next` (Verweis auf den nächsten Knoten darunter).
* `first` zeigt auf den obersten Knoten. Leerer Stapel: `first == null`.
* `N` zählt mit, damit `size()` nicht die ganze Kette ablaufen muss.

Die Operationen:

* `push(item)`: Alten Kopf merken, neuen Knoten anlegen, Wert rein, `next` auf den alten Kopf. Der neue Knoten ist jetzt `first`.
* `pop()`: Wert aus `first` holen, `first` auf `first.next` umhängen. Der alte Knoten hängt an nichts mehr und wird vom Garbage Collector abgeräumt, deshalb hier kein `null`-Setzen nötig.

Der Testclient liest Wörter, legt jedes auf den Stapel, und bei `-` wird eins heruntergenommen und ausgegeben:

* `to be or not to -` → gibt „to“ aus
* `be -` → „be“, `-` → „not“
* `that -` → „that“, `- -` → „or“, „be“
* `is` bleibt liegen, zusammen mit dem ersten „to“ → 2 left on stack

Kosten:

* `push` und `pop` immer konstant, und zwar garantiert im schlimmsten Fall, nicht nur amortisiert wie beim Resizing-Array.
* Speicher proportional zu N, nichts wird vorab reserviert.

Liste vs. Array [\[14\]]({{< relref "stapel" >}}):

* Liste: jede Operation konstant, kein Umkopieren, aber pro Element ein eigenes Objekt mit Overhead (rund 40 Byte pro Knoten in Java) und verstreut im Speicher.
* Array: amortisiert konstant, ab und zu ein teures `resize`, dafür kompakt und cachefreundlich, in der Praxis oft schneller.

Für die Iteration fehlt hier noch der Code aus Listing 1.42 (Bag), der läuft einfach von `first` über `next` die Kette entlang.

{{< anmerkung >}}
Die Nummer [14] meint den [Stapel mit Array]({{< relref "stapel" >}}) hier auf der Seite. Im Code der Visualisierung heißt `oldfirst` aus dem Buch `altesErstes`, und `N` heißt `n`. Den Iterator zeigt das Listing nur als Verweis auf Listing 1.42. Hier steht deshalb eine eigene Fassung, `KetteEntlang`, die genau das tut, was der Text beschreibt. Die Anzeige rechnet mit 40 Byte je Knoten, der Zahl aus dem Text. Geprüft habe ich die Visualisierung mit 3.000 zufälligen `push`- und `pop`-Operationen gegen einen einfachen Vergleichsstapel: Die Kette und die Iteration stimmten jedes Mal. Beim Buchbeispiel liefert `pop()` „to be not that or be“, und zwei Wörter bleiben liegen, „is“ über „to“, genau wie in der Ausgabe unter dem Listing.
{{< /anmerkung >}}
