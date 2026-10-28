+++
title = "TST-Symboltabelle (Algorithmus 5.5)"
description = "Der ternäre Suchtrie aus Sedgewick/Wayne, Algorithmus 5.5 (Listing 5.13) – pro Knoten ein Zeichen und drei Verweise statt R, put und get Zeichen für Zeichen, am TST aus Abbildung 5.29."
date = 2026-10-28T18:52:00+01:00
reihenfolge = 550
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.5 (Listing 5.13)"
+++

{{< spiel src="/apps/tst.html" titel="TST-Symboltabelle – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit den 16 Wörtern, aus denen der TST in Abbildung 5.29 entsteht. Zuerst kommt `put` für „she sells sea shells by the sea shore the shells she sells are surely sea shells“, spätere Wörter überschreiben dabei die Werte früherer. Danach folgt `get("sea")` wie in der Abbildung, dann `get` für shells, surely und are, und für „shell“ und „shelter“, die es nicht gibt. Jeder Knoten zeigt sein Zeichen c. Durchgezogene Linien sind `mid`-Verweise, dort geht es zum nächsten Zeichen. Gestrichelte Linien sind `left` und `right`, dort bleibt das Zeichen dasselbe. Die rote Zahl ist `val`. Rechts steht der Vergleich am aktuellen Knoten und nach jedem `get` die Zahl der Zeichenvergleiche. Darunter steht der Speicher, verglichen mit dem R-Wege-Trie für dieselben Schlüssel. „sortiert eingefügt“ zeigt den schlimmsten Fall: a bis h nacheinander ergeben eine Kette nach rechts. Über die zweite Zeile führst du eigene `put`- und `get`-Aufrufe aus. „Zufallsschlüssel“ erzeugt kurze Strings aus a, e, h, s und t, „↺ Neu starten“ springt zurück zum Beispiel.

## Erklärung

**TST-Symboltabelle (Algorithmus 5.5)**, Klasse `TST`, ternärer Suchtrie. Löst das Speicherproblem des R-Wege-Tries [\[46\]]({{< relref "trie" >}}): pro Knoten **drei** Verweise statt R.

**Aufbau eines Knotens:**

- `c`: ein Zeichen, ausdrücklich gespeichert (im R-Wege-Trie war das Zeichen nur durch die Position im Array gegeben).
- `left`: Teiltrie für Schlüssel, deren aktuelles Zeichen **kleiner** als c ist.
- `mid`: Teiltrie für Schlüssel, deren aktuelles Zeichen **gleich** c ist. Hier geht es zum nächsten Zeichen.
- `right`: Teiltrie für **größere** Zeichen.
- `val`: Wert, falls hier ein Schlüssel endet. Diesmal direkt als `Value`, kein `Object`-Cast nötig, weil kein generisches Array im Spiel ist.

**Bildlich:** Jede Ebene eines R-Wege-Tries mit ihren bis zu R Verzweigungen wird durch einen kleinen binären Suchbaum über die Zeichen ersetzt. Nur über `mid` kommt man zum nächsten Zeichen.

**Die Operationen**, wieder im BST-Rekursionsmuster [\[24\]]({{< relref "bst" >}}):

- `get`: Zeichen an Position d mit `x.c` vergleichen.
  - kleiner → nach links, **gleiches d**,
  - größer → nach rechts, **gleiches d**,
  - gleich und noch nicht letztes Zeichen → nach `mid`, **d + 1**,
  - gleich und letztes Zeichen → dieser Knoten, `val` zurückgeben.
- `put`: genauso absteigen. Fehlt ein Knoten, neuen mit dem aktuellen Zeichen anlegen. Am letzten Zeichen `val` setzen.

**Die schöne Parallele:**

- Quicksort [\[11\]]({{< relref "quicksort" >}}) verhält sich zum binären Suchbaum [\[24\]]({{< relref "bst" >}})
- wie 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}}) zum TST.
- In beiden Fällen entspricht die Rekursionsstruktur des Sortierverfahrens genau der Baumstruktur: kleiner links, gleich in der Mitte mit nächstem Zeichen, größer rechts.

**Kosten:**

- Speicher: 3 Verweise pro Knoten, also etwa 3N bis 3NL insgesamt. Bei R = 256 ein Bruchteil des R-Wege-Tries, bei Unicode der Unterschied zwischen machbar und unmöglich.
- Suchtreffer bei zufälligen Schlüsseln: etwa L + ln N Knoten (L Schritte über `mid` plus die Wege nach links und rechts).
- Erfolglose Suche: meist nur etwa ln N.
- Schlimmster Fall: Wie ein unbalancierter BST kann der TST entarten, etwa bei sortierter Einfügereihenfolge. Abhilfe im Buch: an der Wurzel R- oder R²-Wege-Verzweigung (Hybrid), oder balancieren.
- **Unabhängig vom Alphabet:** Die Kosten hängen nicht von R ab.

**Gleiche Stringoperationen wie beim Trie:** `keysWithPrefix`, `longestPrefixOf`, `keysThatMatch`, sortiertes `keys()`. Alles funktioniert analog.

**Trie vs. TST:**

| | R-Wege-Trie (5.4) | TST (5.5) |
|---|---|---|
| Verweise pro Knoten | R | 3 |
| Speicher | N · R bis N · R · L | 3N bis 3NL |
| Suchtreffer | L | ≈ L + ln N |
| Erfolglose Suche | ≈ log_R N | ≈ ln N |
| Abhängig von R | stark (Speicher) | nein |
| Gut für | kleine Alphabete, kurze Schlüssel | große Alphabete, allgemeiner Einsatz |

**Kapitel 5 bisher:**

- Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
- Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
- Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
- Algorithmus 5.4: Trie-Symboltabelle [\[46\]]({{< relref "trie" >}})
- Algorithmus 5.5: TST-Symboltabelle [47]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Nach den 16 `put` sieht der TST aus wie in Abbildung 5.29, Knoten für Knoten mit denselben Werten: 27 Knoten, an der Wurzel s mit b links und t rechts, darunter are 12, by 4, sea 14, sells 11, she 10, shells 15, shore 7, surely 13 und the 8. `get("sea")` nimmt denselben Weg wie die Pfeile der Abbildung: s über mid, h nach links, e über mid, l nach links, a mit Wert 14. Das sind 5 Zeichenvergleiche für 3 Zeichen. Der R-Wege-Trie mit denselben Schlüsseln braucht 28 Knoten mit je 256 Verweisen, also 7.168 Verweise, der TST 81. Das Listing druckt die öffentliche `get`-Methode nicht ab („entspricht der für Tries“). Ich habe sie wie beim Trie geschrieben, nur ohne Cast. Der Testclient `main()` ist ebenfalls von mir. Ein leerer Schlüssel geht beim TST nicht: `put` und `get` rufen sofort `key.charAt(0)` auf, das wirft eine Ausnahme. Die Eingabezeile der Visualisierung lehnt ihn deshalb ab. `keysWithPrefix` und die anderen Stringoperationen fehlen hier, weil das Buch sie beim TST nicht abdruckt. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 300 zufälligen Folgen von `put` und `get` mit 2184 Abfragen, auch mit Zeichen bis Code 1000. Die Kosten hängen ja nicht von R ab. Jede Antwort stimmt mit einer `HashMap` überein, und Java und Visualisierung liefern dasselbe.
{{< /anmerkung >}}
