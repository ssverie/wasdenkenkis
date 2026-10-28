+++
title = "Boyer-Moore (Algorithmus 5.7)"
description = "Die Teilstringsuche nach Boyer-Moore mit Vorkommensheuristik aus Sedgewick/Wayne, Algorithmus 5.7 (Listing 5.20) – das Muster von rechts nach links vergleichen und bei einer Abweichung weit springen, am Beispiel NEEDLE aus dem Buch."
date = 2026-10-28T19:28:00+01:00
reihenfolge = 570
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.7 (Listing 5.20)"
+++

{{< spiel src="/apps/boyer-moore.html" titel="Boyer-Moore – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft das Beispiel aus dem Erklärtext: Muster NEEDLE im Text FINDINAHAYSTACKNEEDLEINA. Zuerst füllt der Konstruktor die Sprungtabelle `right[]`, jedes Zeichen bekommt die Position seines rechtesten Vorkommens im Muster. Dann liegt das Muster unter dem Text, und verglichen wird von rechts. Blau ist das gerade verglichene Paar, grün, was schon passt, orange die Abweichung. Das rechteste Vorkommen des abweichenden Zeichens im Muster ist gestrichelt umrandet, sein Eintrag in `right[]` leuchtet blau. Danach springt das Muster um `skip` weiter. Grau bleiben Textzeichen, die nie angeschaut werden. Oben zählt die App die Zeichenvergleiche. „schlimmster Fall“ zeigt BAAAAA in lauter A: Dort rückt das Muster immer nur um 1, und jede Lage kostet alle M Vergleiche. Eigene Muster und Texte gibst du oben ein, „↺ Neu starten“ springt zurück zu NEEDLE.

## Erklärung

**Boyer-Moore, Vorkommensheuristik (Algorithmus 5.7)**, Klasse `BoyerMoore`. Gleiche Aufgabe wie KMP [\[48\]]({{< relref "kmp" >}}), aber die Musterzeichen werden **von rechts nach links** verglichen. Das erlaubt große Sprünge im Text.

**Idee:**

- Muster an Position i anlegen, Vergleich beim **letzten** Musterzeichen beginnen.
- Bei einer Abweichung schaut man sich das Textzeichen an, das sie verursacht hat:
  - **Kommt es im Muster gar nicht vor:** Das Muster kann an keiner Position passen, die dieses Zeichen überdeckt. Also ganz daran vorbei springen.
  - **Kommt es im Muster vor:** Das Muster so weit verschieben, dass sein **am weitesten rechts liegendes** Vorkommen dieses Zeichens unter dem Textzeichen steht.
  - **Liegt dieses Vorkommen rechts von der aktuellen Stelle:** Die Verschiebung wäre null oder rückwärts. Dann einfach um 1 weiter, damit es vorangeht.

**Der Code:**

- Konstruktor: Sprungtabelle `right[]`. Für jedes Zeichen die Position seines rechtesten Vorkommens im Muster, −1 wenn es nicht vorkommt.
- `search`: Für jede Position i Muster von hinten (j = M−1) nach vorn vergleichen.
  - Abweichung: `skip = j − right[Textzeichen]`. Ist `skip < 1`, dann 1.
  - Kommt `skip = 0` heraus (keine Abweichung), ist das Muster bei i gefunden.
- Die drei Fälle von oben stecken alle in dieser einen Formel: Bei −1 ergibt sich j + 1, also am Zeichen vorbei.

**Beispiel** (eigene Rechnung): Muster NEEDLE, Text FINDINAHAYSTACKNEEDLEINA.

- `right`: N = 0, E = 5, D = 3, L = 4, alle anderen −1.
- i = 0: Muster-E gegen Text-N (Position 5). N steht im Muster ganz links → skip 5 − 0 = 5.
- i = 5: E gegen S. S kommt im Muster nicht vor → skip 5 − (−1) = 6.
- i = 11: E passt, dann L gegen N → skip 4 − 0 = 4.
- i = 15: NEEDLE passt komplett → gefunden bei 15.
- Nur 10 Zeichenvergleiche für 24 Textzeichen. Große Teile des Texts werden nie angeschaut.

**Kosten:**

- Typischer Fall: etwa **N / M** Zeichenvergleiche. Das ist sublinear, und je **länger** das Muster, desto **schneller** die Suche. Bei großem Alphabet und normalem Text der Regelfall.
- Schlimmster Fall mit dieser Heuristik allein: N · M, etwa bei einem Text aus lauter A und einem Muster wie BAAAAA.
- Die vollständige Boyer-Moore-Version kombiniert die Vorkommensheuristik mit einer KMP-ähnlichen Tabelle für bereits passende Endstücke und garantiert dann linear im schlimmsten Fall.

**KMP vs. Boyer-Moore:**

| | KMP (5.6) | Boyer-Moore (5.7) |
|---|---|---|
| Vergleichsrichtung | links nach rechts | rechts nach links |
| Vorberechnung | Automat, R · M | Sprungtabelle, R |
| Typischer Fall | ≈ N | ≈ N / M |
| Schlimmster Fall | 2N (garantiert) | N · M (nur Heuristik) |
| Zurücksetzen im Text | nie | ja |
| Stärke | Datenströme, Garantie | Praxis, lange Muster |

Boyer-Moore (bzw. Varianten davon) steckt in vielen Editoren und in Tools wie grep. Als Nächstes kommt Rabin-Karp (Algorithmus 5.8), der ganz anders vorgeht: mit Hashing.

**Kapitel 5 bisher:**

- Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
- Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
- Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
- Algorithmus 5.4: Trie-Symboltabelle [\[46\]]({{< relref "trie" >}})
- Algorithmus 5.5: TST-Symboltabelle [\[47\]]({{< relref "tst" >}})
- Algorithmus 5.6: Knuth-Morris-Pratt [\[48\]]({{< relref "kmp" >}})
- Algorithmus 5.7: Boyer-Moore [49]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die Visualisierung rechnet das Beispiel des Erklärtexts genauso: i = 0, 5, 11, 15, die Sprünge 5, 6 und 4, gefunden bei 15, 10 Zeichenvergleiche. Die Instanz nennt es „eigene Rechnung“, im Buch steht dasselbe Beispiel als Abbildung 5.42. Die ist auf Svens Foto zu KMP am Rand angeschnitten zu sehen, mit „i j: 0 5, 5 5, 11 4, 15 0, liefert i = 15“. Für den schlimmsten Fall zählt die Visualisierung bei BAAAAA in 20 A genau 90 Vergleiche: 15 Lagen zu je 6 Zeichen, in der Größenordnung N · M. Der Java-Code ist der aus Listing 5.20, `main()` ist der Testclient aus Listing 5.19 (der KMP-Testclient, auf den das Listing verweist), mit `System.out` und Vorgabewerten. Geprüft habe ich mit Java 21 und 500 zufälligen Mustern und Texten, das Muster wurde 237-mal gefunden. `right[]` stimmt für alle 256 Zeichen mit `lastIndexOf` überein, jede Suche liefert dasselbe wie `indexOf`, und Java und Visualisierung liefern dasselbe.
{{< /anmerkung >}}
