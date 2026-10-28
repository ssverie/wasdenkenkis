+++
title = "Knuth-Morris-Pratt (Algorithmus 5.6)"
description = "Die Knuth-Morris-Pratt-Teilstringsuche aus Sedgewick/Wayne, Algorithmus 5.6 (Listing 5.18) – erst den Automaten aus dem Muster bauen, dann den Text Zeichen für Zeichen hindurchschicken, ohne je zurückzulesen, am Testlauf AACAA aus dem Buch."
date = 2026-10-28T19:07:00+01:00
reihenfolge = 560
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.6 (Listing 5.18 und 5.19)"
+++

{{< spiel src="/apps/kmp.html" titel="Knuth-Morris-Pratt – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testlauf aus dem Buch: Muster AACAA im Text AABRAACADABRAACAADABRA. **Teil 1, der Konstruktor:** Spalte für Spalte entsteht die Tabelle `dfa[c][j]`. Hellblau sind die aus Spalte X kopierten Einträge (Nichtübereinstimmung), orange ist der neu gesetzte Übereinstimmungsfall, X selbst ist gestrichelt umrandet. Darüber wächst der Automat mit. Gerade Pfeile führen einen Zustand weiter, Bögen und Schleifen springen zurück, Übergänge nach 0 sind weggelassen. **Teil 2, die Suche:** Jedes Textzeichen schickt den Automaten in einen neuen Zustand. Der benutzte Übergang leuchtet blau, und unter dem Text stehen die Musterzeichen, die gerade passen. Am Ende wird das gefundene Stück grün. „ABABAC“ baut den Automaten aus Abbildung 5.39 und sucht damit in BCBAABACAABABACAA. Eigene Muster (bis 10 Zeichen) und Texte (bis 40) gibst du oben ein, „↺ Neu starten“ springt zurück zum Testlauf.

## Erklärung

Knuth-Morris-Pratt-Teilstringsuche (Algorithmus 5.6), Klasse `KMP`. Abschnitt 5.3. Aufgabe: Ein Muster der Länge M in einem Text der Länge N finden, wie Strg+F.

Ausgangspunkt Brute Force: Muster an jeder Position anlegen und Zeichen für Zeichen vergleichen. Bei einem Fehlschlag eine Stelle weiter im Text und von vorn. Im schlimmsten Fall etwa N · M Vergleiche, und man muss im Text zurückspringen.

KMP-Idee: Bei einem Fehlschlag weiß man schon, welche Zeichen zuletzt im Text standen, nämlich die passenden Musterzeichen. Daraus lässt sich vorab berechnen, wie weit das Muster schon „angefangen“ sein kann. Der Text wird dadurch nie zurückgelesen, jedes Textzeichen genau einmal.

Umgesetzt als DEA (deterministischer endlicher Automat):

* Zustände 0 bis M. Zustand j heißt: Die ersten j Musterzeichen passen gerade.
* `dfa[c][j]`: In welchen Zustand geht es, wenn im Zustand j das Zeichen c gelesen wird?
* Zustand M erreicht → Muster gefunden.

Konstruktion im Konstruktor:

* `dfa[pat.charAt(0)][0] = 1`: Im Startzustand führt nur das erste Musterzeichen weiter.
* `X` ist der Neustartzustand: der Zustand, in dem der Automat wäre, wenn er das Muster ohne sein erstes Zeichen gelesen hätte (`pat[1..j-1]`).
* Für jede Position j:
   * Nichtübereinstimmung: alle Übergänge aus Spalte X kopieren. Bei einem falschen Zeichen verhält man sich so, als wäre man im Zustand X.
   * Übereinstimmung: `dfa[pat[j]][j] = j + 1`.
   * X weiterschalten: `X = dfa[pat[j]][X]`.
* Kleines Beispiel für AACAA: Im Zustand 2 (AA gelesen) führt C zu 3. Ein weiteres A führt zu 2, weil von „AAA“ die letzten beiden A wieder als Anfang taugen. B führt zurück auf 0.

`search(txt)`: Text Zeichen für Zeichen durch den Automaten schicken. Erreicht `j` den Wert M, ist das Muster bei `i − M` gefunden. Sonst wird N zurückgegeben (nicht gefunden).

Testlauf: Muster AACAA im Text AABRAACADABRAACAADABRA. Bei Position 4 steht AACAD, das scheitert am letzten Zeichen. Gefunden wird es bei Position 12. Der Automat musste dazu nie im Text zurück.

Satz N: KMP greift auf höchstens M + N Zeichen zu. Der Aufbau des Automaten kostet Zeit und Speicher proportional zu R · M. Den Faktor R kann man mit einer Variante ohne vollständige Tabelle loswerden (Übung).

Praxis:

* Theoretisch wichtig wegen der linearen Garantie im schlimmsten Fall.
* In der Praxis selten schneller als Brute Force, weil normale Texte und Muster kaum Selbstwiederholungen haben und Brute Force meist nach einem Zeichen abbricht.
* Echter Vorteil: kein Zurücksetzen im Text. Damit geht Suchen in einem Datenstrom, den man nicht puffern will oder kann.

Als Nächstes Boyer-Moore (Algorithmus 5.7), der das Muster von rechts nach links vergleicht und in der Praxis oft große Sprünge macht.

Kapitel 5 bisher:

* Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
* Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
* Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
* Algorithmus 5.4: Trie-Symboltabelle [\[46\]]({{< relref "trie" >}})
* Algorithmus 5.5: TST-Symboltabelle [\[47\]]({{< relref "tst" >}})
* Algorithmus 5.6: Knuth-Morris-Pratt [48]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die Ausgabe ist dieselbe wie unter Listing 5.18: AACAA steht unter Position 12 des Texts. Die Aussagen des Erklärtexts kommen in der Visualisierung genauso heraus. Im Zustand 2 führt C zu 3, A zu 2 und B zu 0. Ab Position 4 kommt der Automat bis Zustand 4 und fällt bei D zurück. Mit ABABAC entsteht die Tabelle genau wie in Abbildung 5.39. Spalte für Spalte stehen dort dieselben Werte, und X, aus dem kopiert wird, steht wie der Pfeil der Abbildung auf 0, 0, 1, 2, 3. Am Ende ergibt sich A 1 1 3 1 5 1, B 0 2 0 4 0 4, C 0 0 0 0 0 6. Nach der letzten Spalte wird X noch auf `dfa['C'][3]` = 0 gesetzt. Der Buchtext sagt dazu, dass dieser Wert nicht mehr verwendet wird. `main()` ist der Testclient aus Listing 5.19, nur mit `System.out` statt `StdOut` aus der Bibliothek zum Buch und mit Vorgabewerten, damit er ohne Argumente läuft. Wird das Muster nicht gefunden, liefert `search` N, und die Musterzeile steht dann hinter dem Text. Geprüft habe ich den Java-Code der Visualisierung mit Java 21 und 500 zufälligen Mustern und Texten aus kleinen Alphabeten, das Muster wurde 242-mal gefunden. Jeder Eintrag der Tabelle, für alle 256 Zeichen, stimmt mit der Definition überein: Gemeint ist das längste Anfangsstück des Musters, mit dem `pat[0..j-1]` plus c endet. Jede Suche liefert dasselbe wie `indexOf`, und Java und Visualisierung liefern dasselbe. Die Absätze habe ich nur an den Zeilenwechseln des Erklärtexts gesetzt.
{{< /anmerkung >}}
