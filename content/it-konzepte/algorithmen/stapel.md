+++
title = "LIFO-Stapel mit Arrays variabler Größe (Algorithmus 1.1)"
description = "Der Stapel mit mitwachsendem Array aus Sedgewick/Wayne, Algorithmus 1.1 (Listing 1.37) – push, pop und das Umziehen in ein doppelt oder halb so großes Array Schritt für Schritt, mit Java-Code und Protokoll."
date = 2026-10-26T10:39:00+01:00
reihenfolge = 110
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 1.1 (Listing 1.37)"
+++

{{< spiel src="/apps/stapel.html" titel="LIFO-Stapel mit Arrays variabler Größe – Visualisierung" >}}

**So geht's:** Oben ein Wort mit `push` auf den Stapel legen, ein Zufallswort nehmen oder mit `pop()` das oberste Element herunterholen. Jede Operation läuft danach Schritt für Schritt ab, vor und zurück. Das Array `a` zeigt alle Plätze bis `a.length`. Freie Plätze sind gestrichelt, die Leiste darunter zeigt, wie voll es ist. Ist das Array voll, zieht der Stapel um: Darunter erscheint das neue, doppelt so große Array, und jede einzelne Kopie ist ein eigener Schritt. Beim `pop()` geht es umgekehrt, sobald nur noch ein Viertel belegt ist. „for (x : stapel)“ zeigt den Iterator, der von oben nach unten läuft. Das „Buchbeispiel“ spielt die Eingabe `to be or not to - be - - that - - - is` ab, jedes Wort ist ein `push`, jeder Strich ein `pop()`. Der Zähler rechnet mit, wie viele Kopien im Schnitt auf eine Operation kommen.

## Erklärung

LIFO-Stapel mit Arrays variabler Größe (Algorithmus 1.1), Klasse `ResizingArrayStack`. Ein Stack (Last In, First Out): Was zuletzt draufgelegt wurde, kommt zuerst wieder runter. Das Besondere ist, dass das Array mitwächst und mitschrumpft.

Aufbau:

* `a[]` hält die Elemente, `N` zählt sie. Das oberste Element liegt in `a[N-1]`.
* Generisch über `Item`, also für jeden Typ nutzbar.
* `(Item[]) new Object[1]`: Java erlaubt kein `new Item[]` bei generischen Typen, daher der Umweg über `Object[]` mit Cast.

Die Operationen:

* `push(item)`: Ist das Array voll (`N == a.length`), wird es per `resize(2*a.length)` verdoppelt. Dann `a[N++] = item`.
* `pop()`: Oberstes Element holen mit `a[--N]`, Platz auf `null` setzen (gegen Loitering, wie in [\[12\]]({{< relref "heap" >}})). Ist das Array danach nur noch zu einem Viertel gefüllt, wird es per `resize(a.length/2)` halbiert.
* `resize(max)`: Neues Array der Größe `max` anlegen und alle N Elemente umkopieren.

Warum Viertel und nicht Hälfte? Würde man schon bei halb voll halbieren, könnte ein Wechsel von push/pop genau an der Grenze ständig verdoppeln und halbieren, jedes Mal mit komplettem Umkopieren (Thrashing). Mit der Viertel-Regel ist das Array nach dem Halbieren wieder halb voll, also mit Puffer in beide Richtungen.

Kosten:

* Einzelne `push`/`pop` sind meist konstant. Ein `resize` kostet N, kommt aber so selten vor, dass es sich verteilt: amortisiert konstante Zeit pro Operation.
* Speicher: Das Array ist immer zwischen 25 % und 100 % gefüllt, also nie mehr als viermal so groß wie nötig.

Iterator:

* `implements Iterable<Item>` erlaubt `for (Item x : stack)`.
* `ReverseArrayIterator` läuft von `N-1` runter auf 0, also von oben nach unten im Stapel, passend zu LIFO.
* `remove()` bleibt leer, weil Entfernen beim Iterieren nicht unterstützt wird.

Einordnung: Das ist das Grundmuster, das später überall auftaucht, auch die Heap-Vorrangwarteschlange [\[12\]]({{< relref "heap" >}}) könnte statt des festen `maxN` genau dieses Resizing nutzen. Darauf verweist der Text dort mit Übung 2.4.19.

{{< anmerkung >}}
Die Nummer [12] meint die [Heap-Vorrangwarteschlange]({{< relref "heap" >}}) hier auf der Seite. Im Code der Visualisierung heißt `resize` aus dem Buch `umziehen`, der `ReverseArrayIterator` heißt `VonObenNachUnten`, und `N` heißt `n`. Die Visualisierung fasst höchstens 16 Elemente. Das Array wächst also über 1, 2, 4 und 8 bis auf 16 Plätze. Geprüft habe ich sie mit 3.000 zufälligen `push`- und `pop`-Operationen gegen einen einfachen Vergleichsstapel. Der Inhalt stimmte jedes Mal, das Array war nach jeder Operation zu mehr als einem Viertel gefüllt, und der Iterator lief immer von oben nach unten. Beim Buchbeispiel liefert `pop()` „to be not that or be“, am Ende liegen „to is“ in einem Array mit zwei Plätzen. 16 `push` hintereinander kopieren zusammen 15 Elemente um (1 + 2 + 4 + 8), also weniger als zwei pro Operation.
{{< /anmerkung >}}
