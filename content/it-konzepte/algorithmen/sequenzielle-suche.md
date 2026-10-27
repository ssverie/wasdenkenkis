+++
title = "Sequenzielle Suche (Algorithmus 3.1)"
description = "Die Symboltabelle als ungeordnete verkettete Liste aus Sedgewick/Wayne, Algorithmus 3.1 (Listing 3.4) – put und get Schritt für Schritt, jeder Vergleich einzeln, mit dem Testclient SEARCHEXAMPLE wie in Abbildung 3.3."
date = 2026-10-27T12:32:00+01:00
reihenfolge = 310
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 3.1 (Listing 3.4)"
+++

{{< spiel src="/apps/sequenzielle-suche.html" titel="Sequenzielle Suche – Visualisierung" >}}

**So geht's:** Beim Öffnen ist der Testclient aus dem Buch geladen: Die Buchstaben von SEARCHEXAMPLE kommen nacheinander mit `put` in die Tabelle, der Wert ist die Position im Wort. „Abspielen“ oder „Schritt“ zeigt jeden einzelnen Vergleich: Der blaue Knoten wird gerade mit dem gesuchten Schlüssel verglichen, umrandete Knoten wurden schon angeschaut. Ein neuer Schlüssel kommt orange vorne an die Liste, bei einem vorhandenen wird nur der Wert ersetzt (grün, mit altem und neuem Wert), und die Knoten dahinter bleiben blass, weil die Suche beim Treffer aufhört. Oben kann man eigene Schlüssel mit `put` eintragen und mit `get` suchen. Der Zähler zeigt, wie viele Vergleiche es waren, das Protokoll ist aufgebaut wie Abbildung 3.3. „↺ Neu starten“ lädt den Testclient neu.

## Erklärung

Sequenzielle Suche in ungeordneter verketteter Liste (Algorithmus 3.1), Klasse `SequentialSearchST`. Jetzt beginnt Kapitel 3, Suchen. Grundbegriff ist die Symboltabelle: Sie speichert Schlüssel-Wert-Paare und beantwortet „Welcher Wert gehört zu diesem Schlüssel?“. In Java entspricht das einer Map.

Aufbau:

* Verkettete Liste wie beim Bag [\[17\]]({{< relref "bag" >}}), aber jeder Knoten hat drei Felder: `key`, `val`, `next`.
* `first` zeigt auf den ersten Knoten. Die Reihenfolge ist egal, deshalb „ungeordnet“.

Die Operationen:

* `get(key)`: Liste von vorn durchlaufen, jeden Schlüssel mit `equals()` vergleichen. Treffer → Wert zurück. Ende erreicht → `null` (erfolglose Suche).
* `put(key, val)`: Erst genauso suchen. Schlüssel gefunden → nur den Wert überschreiben. Nicht gefunden → neuen Knoten vorne einfügen: `first = new Node(key, val, first)`.
* Wichtig: Jeder Schlüssel steht höchstens einmal in der Tabelle, ein `put` mit vorhandenem Schlüssel ersetzt den alten Wert.

Abbildung 3.3 (Testclient mit SEARCHEXAMPLE, Wert = Position im Wort):

* S 0, E 1, A 2, R 3 … werden jeweils vorne angehängt (rot = neu).
* Schwarz = Knoten, die bei der Suche angeschaut wurden. Vor jedem Einfügen wird bis zum Ende gesucht, also wird die Liste komplett schwarz.
* E 6: E gibt es schon, also kein neuer Knoten, nur der Wert 1 wird zu 6 (umkreist). Grau = danach nicht mehr berührt, weil die Suche beim Treffer abbricht.
* Ebenso A 8 (vorher 2) und E 12 (vorher 6).
* Am Ende 10 verschiedene Schlüssel, obwohl 13 Eingaben.

Kosten:

* Erfolglose Suche: N Vergleiche, immer die ganze Liste.
* Erfolgreiche Suche: im schlimmsten Fall N, im Schnitt etwa N/2.
* Einfügen eines neuen Schlüssels: N, weil vorher geprüft werden muss, ob es ihn schon gibt.
* N Einfügungen in eine leere Tabelle: rund N²/2 Vergleiche, also quadratisch.

Einordnung: Einfach und für kleine Tabellen in Ordnung, für große unbrauchbar. Genau dieses Grundproblem treibt Kapitel 3 an: Als Nächstes kommt die binäre Suche in einem geordneten Array (Algorithmus 3.2), dann Suchbäume und Hashtabellen. Die Bag-Liste aus [\[17\]]({{< relref "bag" >}}) und diese Symboltabelle sind übrigens fast dieselbe Struktur, nur dass hier zu jedem Element ein Schlüssel kommt und vor dem Einfügen gesucht wird.

{{< anmerkung >}}
Die Nummer [17] meint den [Bag]({{< relref "bag" >}}) hier auf der Seite. Die Farben im Text sind die des Buchs; in der Visualisierung ist „rot = neu“ orange, „schwarz = angeschaut“ ein umrandeter Knoten, der „umkreiste“ Wert grün mit altem und neuem Wert, und „grau“ ist blass. Im Code heißt die Klasse `SequenzielleSucheST`, die Schleife in `put()` läuft über `y` statt `x`, damit man `get` und `put` im Ablauf auseinanderhalten kann, und `size()` ist schon eingebaut (im Buch eine Übung). Beim Testclient zählt die Visualisierung 64 Vergleiche für die 13 Eingaben.
{{< /anmerkung >}}
