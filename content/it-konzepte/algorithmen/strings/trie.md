+++
title = "Trie-Symboltabelle (Algorithmus 5.4)"
description = "Die Trie-Symboltabelle aus Sedgewick/Wayne, Algorithmus 5.4 (Listing 5.8 bis 5.10) – ein R-Wege-Trie mit put und get, dazu Schlüssel sammeln nach Präfix und nach Muster mit Platzhaltern, an „she sells sea shells by the sea shore“ wie in Abbildung 5.23."
date = 2026-10-28T18:42:00+01:00
reihenfolge = 540
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.4 (Listing 5.8 bis 5.10)"
+++

{{< spiel src="/apps/trie.html" titel="Trie-Symboltabelle – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient: Zuerst fügt `put` die Schlüssel „she sells sea shells by the sea shore“ ein, Wert ist jeweils der Platz in der Eingabe. Danach folgen `keys()`, `keysWithPrefix("sh")`, `keysThatMatch(".he")` und `get("shell")`. Das Zeichen steht jeweils am Knoten, die rote Zahl daneben ist `val`, und Knoten mit Wert sind dicker umrandet. Orange ist der Knoten, an dem die Operation gerade steht, ein neu angelegter Knoten blinkt orange auf. Blau ist der Weg von der Wurzel, grün sind gefundene oder gesammelte Schlüssel. Rechts füllt sich beim Sammeln die Warteschlange q, darunter steht, wie viele Verweise der Trie belegt, und wie viele davon wirklich auf einen Knoten zeigen. Das Protokoll zeigt beim Sammeln wie Abbildung 5.23 je Aufruf von `collect()` den Schlüssel und den Inhalt von q. Über die zweite Zeile führst du eigene Operationen aus: `put` (Wert ist die nächste Nummer), `get`, `keysWithPrefix` oder `keysThatMatch` mit „.“ als Platzhalter. Die App spielt alles noch einmal ab und springt zu deiner Operation. „Zufallsschlüssel“ füllt den Trie mit kurzen Strings aus a, e, h, s und t, „↺ Neu starten“ springt zurück zum Beispiel aus dem Buch.

## Erklärung

**Trie-Symboltabelle (Algorithmus 5.4)**, Klasse `TrieST`. Eine Symboltabelle wie in Kapitel 3, aber speziell für String-Schlüssel. Name von *re**trie**val*.

**Aufbau:**

- Ein Baum, in dem jeder Knoten R = 256 Verweise hat, einen pro möglichem Zeichen (R-Wege-Trie).
- Die Schlüssel stehen **nirgends ausdrücklich** gespeichert. Ein Schlüssel ist der Weg von der Wurzel bis zu einem Knoten: Für „she“ geht man von der Wurzel über den Verweis `s`, dann `h`, dann `e`.
- An dem Knoten, an dem ein Schlüssel endet, steht sein Wert in `val`. Steht dort `null`, ist dieser Weg nur ein Präfix anderer Schlüssel, aber selbst kein Schlüssel.
- `val` ist vom Typ `Object` und wird in `get` nach `Value` gecastet, aus demselben Grund wie in [\[14\]]({{< relref "stapel" >}}), [\[23\]]({{< relref "binaere-suche-st" >}}) und [\[26\]]({{< relref "hash-verkettung" >}}): Java erlaubt keine Arrays generischer Typen.

**Die Operationen**, im gleichen Rekursionsmuster wie beim BST [\[24\]]({{< relref "bst" >}}):

- `get(key)`: Zeichen für Zeichen dem Verweis `next[c]` folgen. Stößt man auf `null`, gibt es den Schlüssel nicht. Ist man nach dem letzten Zeichen angekommen (`d == key.length()`), den Wert dort zurückgeben, gegebenenfalls `null`.
- `put(key, val)`: Genauso absteigen, fehlende Knoten unterwegs neu anlegen. Am Ende `val` setzen. Wie beim BST gibt jede Ebene ihren Knoten zurück und der Aufrufer hängt ihn ein.

**Kosten:**

- Suchtreffer und Einfügen: höchstens L + 1 Knoten, wobei L die Schlüssellänge ist. **Unabhängig von N!** Ob 1000 oder eine Milliarde Schlüssel in der Tabelle stehen, macht keinen Unterschied.
- Erfolglose Suche: meist noch viel schneller. Bei zufälligen Schlüsseln bricht sie nach etwa log_R N Zeichen ab, weil dort schon ein `null`-Verweis kommt.
- **Speicher ist das große Problem:** Jeder Knoten hat R Verweise, die meisten davon `null`. Pro Schlüssel kommen grob zwischen R und R · L Verweise zusammen. Bei R = 256 ist das viel, bei Unicode (R = 65536) untragbar. Das ist der Grund für den nächsten Algorithmus.

**`size()`, Hinweis oben auf der Seite:** Lazy, also bei jedem Aufruf durch den ganzen Trie zählen, ist lehrreich, aber langsam. Besser eager: einen Zähler mitführen, wie N im BST.

**Was Tries zusätzlich können** (die folgenden Seiten im Buch, Tabelle 5.6):

- `keysWithPrefix("sh")`: alle Schlüssel mit diesem Präfix. Einfach zum Knoten für „sh“ laufen und darunter alles einsammeln. Gut für Autovervollständigung.
- `longestPrefixOf("shellsort")`: längster Schlüssel, der Präfix der Eingabe ist, hier „shells“. Anwendung: Routing nach IP-Adressen.
- `keysThatMatch(".he")`: Muster mit Platzhaltern, z. B. she, the.
- `keys()`: alle Schlüssel, und zwar sortiert, weil die Verweise in Zeichenreihenfolge durchlaufen werden.
- `delete`: Wert auf `null` setzen und leer gewordene Knoten rückwärts entfernen.

**Einordnung neben Kapitel 3:**

| | Suche | Einfügen | Speicher | Stringoperationen |
|---|---|---|---|---|
| Rot-Schwarz-Baum (3.4) | lg N Vergleiche ganzer Strings | lg N | N | nein |
| Hashing (3.5/3.6) | konstant, aber Hash über ganzen String | konstant | N | nein |
| R-Wege-Trie (5.4) | L, unabhängig von N | L | N · R bis N · R · L | Präfix, Muster, sortiert |

Die Speicherfrage löst als Nächstes der ternäre Suchtrie (TST, Algorithmus 5.5): pro Knoten nur drei Verweise statt R.

**Kapitel 5 bisher:**

- Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
- Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
- Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
- Algorithmus 5.4: Trie-Symboltabelle [46]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Nach den acht `put` sieht der Trie aus wie in Abbildung 5.23, mit 20 Knoten und den Werten by 4, sea 6, sells 1, she 0, shells 3, shore 7, the 5. Das zweite „sea“ überschreibt die 2 mit der 6. `keys()` sammelt in derselben Reihenfolge wie die Abbildung, und q wächst genauso. Eine Kleinigkeit: Zwischen „she“ und „shell“ besucht `collect()` zwingend auch „shel“, denn der Knoten liegt auf dem Weg. Auf Svens Foto der Abbildung steht diese Zeile nicht. `keysWithPrefix("sh")` liefert she shells shore, `keysThatMatch(".he")` liefert she the, wie im Erklärtext. Der Java-Code ist der aus Listing 5.8 bis 5.10, `Queue` ist die aus Algorithmus 1.3. Den Testclient `main()` und die Hilfsmethode `liste()` habe ich selbst geschrieben. `longestPrefixOf()` und `delete()` fehlen in der Visualisierung, weil ich deren Listings nicht habe. Die Warnung „unchecked“ beim Übersetzen kommt vom Cast `(Value) x.val` – das ist der Punkt aus dem Erklärtext. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 300 zufälligen Folgen mit 2006 Abfragen (`get`, `keys`, `keysWithPrefix`, `keysThatMatch`), auch mit dem leeren Schlüssel und Zeichen quer durch die Codes 1 bis 255. Jede Antwort stimmt mit einer `TreeMap` überein, und Java und Visualisierung liefern dasselbe.
{{< /anmerkung >}}
