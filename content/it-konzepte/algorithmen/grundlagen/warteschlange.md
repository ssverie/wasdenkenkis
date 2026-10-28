+++
aliases = ["/it-konzepte/algorithmen/warteschlange/"]
title = "FIFO-Warteschlange (Algorithmus 1.3)"
description = "Die Warteschlange als Kette mit zwei Zeigern aus Sedgewick/Wayne, Algorithmus 1.3 (Listing 1.41) – enqueue hinten, dequeue vorn, die beiden Sonderfälle bei leerer Schlange Schritt für Schritt, mit Java-Code und Protokoll."
date = 2026-10-26T12:31:00+01:00
reihenfolge = 130
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 1.3 (Listing 1.41)"
+++

{{< spiel src="/apps/warteschlange.html" titel="FIFO-Warteschlange – Visualisierung" >}}

**So geht's:** Oben ein Wort mit `enqueue` hinten anhängen, ein Zufallswort nehmen oder mit `dequeue()` vorn das älteste herausnehmen. Jede Operation läuft danach Schritt für Schritt ab, vor und zurück. Die Kette läuft von `first` (links, hier wird entnommen) bis `last` (rechts, hier wird angehängt), darunter steht, wohin die Zeiger gerade zeigen, auch wenn sie `null` sind. Beim `enqueue` steht der neue Knoten erst allein rechts, bis er angekettet wird. Die beiden Sonderfälle aus dem Text sieht man, wenn man die Schlange leert und wieder füllt: Beim letzten `dequeue()` zeigt `last` kurz noch auf den alten Knoten. Das „Buchbeispiel“ spielt dieselbe Eingabe ab wie beim [Stapel]({{< relref "stapel-liste" >}}), „↺ Neu starten“ setzt alles zurück.

## Erklärung

FIFO-Warteschlange (Algorithmus 1.3), Klasse `Queue`. First In, First Out: Was zuerst reinkommt, geht zuerst raus, wie eine Schlange an der Kasse. Gleiche Knotenstruktur wie der Stapel in [\[15\]]({{< relref "stapel-liste" >}}), aber mit zwei Zeigern.

Aufbau:

* `first` zeigt auf den ältesten Knoten (dort wird entnommen).
* `last` zeigt auf den neuesten Knoten (dort wird angehängt).
* Die Kette läuft von `first` über `next` bis `last`, dessen `next` ist `null`.

Die Operationen:

* `enqueue(item)`: Neuen Knoten anlegen, `next = null`, er wird `last`. Dann der alte letzte Knoten per `oldlast.next = last` mit ihm verbinden.
* `dequeue()`: Wert aus `first` holen, `first` auf `first.next` umhängen. Identisch zu `pop()` beim Stapel.

Die zwei Sonderfälle, an denen man sich gern verhaut:

* Einfügen in eine leere Schlange: Es gibt kein `oldlast`, an das man anhängen könnte. Stattdessen muss `first` auch auf den neuen Knoten zeigen. Deshalb `if (isEmpty()) first = last`. Das funktioniert, weil `first` zu dem Zeitpunkt noch `null` ist.
* Entnehmen des letzten Elements: Danach ist `first == null`, aber `last` zeigt noch auf den alten Knoten. Deshalb `if (isEmpty()) last = null`, sonst Loitering und ein falscher Zustand beim nächsten `enqueue`.

Mit dem Testclient (gleiche Eingabe wie in [\[15\]]({{< relref "stapel-liste" >}})) sieht man den Unterschied:

* Stapel: to be not that or be
* Schlange: to be or not to be, übrig bleiben „that“ und „is“

Die Schlange gibt die Wörter in Eingabereihenfolge zurück, der Stapel umgekehrt.

Kosten: `enqueue` und `dequeue` konstant im schlimmsten Fall, Speicher proportional zu N. Ohne `last` müsste man zum Anhängen jedes Mal die ganze Liste durchlaufen, das wäre linear.

Die drei Grundlagen-Algorithmen im Überblick:

* Algorithmus 1.1: Stapel mit Resizing-Array (LIFO)
* Algorithmus 1.2: Stapel mit verketteter Liste (LIFO)
* Algorithmus 1.3: Warteschlange mit verketteter Liste (FIFO)

{{< anmerkung >}}
Die Nummer [15] meint den [Stapel mit verketteter Liste]({{< relref "stapel-liste" >}}) hier auf der Seite. Im Code der Visualisierung heißt `oldlast` aus dem Buch `altesLetztes`, und `N` heißt `n`. Den Iterator zeigt das Listing nur als Verweis auf Listing 1.42, deshalb steht hier eine eigene Fassung. Geprüft habe ich die Visualisierung mit 3.000 zufälligen `enqueue`- und `dequeue`-Operationen gegen eine einfache Vergleichsschlange: Die Kette, die Zeiger `first` und `last` und die Iteration stimmten jedes Mal. Beide Sonderfälle laufen so ab, wie der Text sie beschreibt. Beim Buchbeispiel liefert `dequeue()` „to be or not to be“, „that“ und „is“ bleiben übrig.
{{< /anmerkung >}}
