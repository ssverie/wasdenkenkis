+++
title = "Reguläre Ausdrücke mit NEA (Algorithmus 5.9)"
description = "Die musterbasierte Suche mit regulären Ausdrücken aus Sedgewick/Wayne, Algorithmus 5.9 (Listing 5.24 und 5.25) – den nichtdeterministischen Automaten mit einem Stapel aufbauen und dann alle möglichen Zustände gleichzeitig durch den Text schicken, am Beispiel ((A*B|AC)D) wie in Abbildung 5.51."
date = 2026-10-28T20:44:00+01:00
reihenfolge = 590
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 5.9 (Listing 5.24 bis 5.26)"
+++

{{< spiel src="/apps/nfa.html" titel="Reguläre Ausdrücke mit NEA – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft das Beispiel aus Abbildung 5.51: Ausdruck ((A\*B|AC)D), Eingabe AABD. **Teil 1, der Konstruktor:** Jedes Zeichen des Ausdrucks ist ein Zustand. Zeichen für Zeichen kommen die ε-Übergänge dazu, die gerade gesetzte Kante ist orange. Rechts steht der Stapel mit den Positionen von „(“ und „|“. Schwarze Pfeile sind die Übereinstimmungsübergänge, die nur in `re[]` stehen. **Teil 2, die Simulation:** Rot umrandet ist die Menge `pc` aller Zustände, in denen der Automat gerade sein könnte. Für jedes Textzeichen gehen die passenden Zustände einen Schritt weiter (orange, `match`). Danach kommen über die ε-Übergänge alle erreichbaren dazu, das ist die neue `pc`. Wird am Ende der Endzustand erreicht, wird er grün, der Text ist erkannt. „nicht erkannt“ zeigt AACD, da wird `pc` leer. „wie GREP“ zeigt das Beispiel aus dem Buch unter Listing 5.26: (A\*B|AC)D, verpackt wie im GREP-Client als (.\*(A\*B|AC)D.\*), auf die Zeile ABCCBD aus tinyL.txt, die GREP dort ausgibt. Eigene Ausdrücke müssen ganz in Klammern stehen und dürfen je Klammergruppe nur ein „|“ haben.

## Erklärung

Mustersuche mit regulären Ausdrücken (Algorithmus 5.9), Klasse `NFA`. Abschnitt 5.4. Statt eines festen Musters wird jetzt nach einem Muster mit Regeln gesucht, wie bei grep.

Reguläre Ausdrücke im Buch kennen vier Bausteine:

* Verkettung: AB heißt A, dann B.
* Oder: A|B heißt A oder B.
* Hülle: A\* heißt null oder beliebig viele A.
* Klammern zum Gruppieren. Der ganze Ausdruck muss in Klammern stehen, z. B. ((A\*B|AC)D).

Warum NEA und nicht DEA? Bei KMP [\[48\]]({{< relref "kmp" >}}) reichte ein deterministischer Automat. Für reguläre Ausdrücke kann der DEA aber exponentiell viele Zustände brauchen. Ein nichtdeterministischer endlicher Automat (NEA) hat nur so viele Zustände wie der Ausdruck Zeichen, darf dafür aber an manchen Stellen „mehrere Wege gleichzeitig“ gehen.

Aufbau des NEA:

* Jedes Zeichen des Ausdrucks ist ein Zustand 0 bis M−1, dazu ein Endzustand M (akzeptieren).
* Übereinstimmungsübergänge: Steht in Zustand i ein Buchstabe, geht es bei genau diesem Textzeichen nach i + 1. Das ergibt sich direkt aus `re[]`, braucht keine eigene Struktur.
* ε-Übergänge (Epsilon): Sprünge ohne ein Zeichen zu lesen. Die werden als Digraph `G` gespeichert. Alles Knifflige steckt darin.

Die Konstruktion, mit einem Stapel [\[15\]]({{< relref "stapel-liste" >}}) für Klammern und Oder-Zeichen:

* `(` und `|`: Position auf den Stapel legen.
* `)`: Oberstes Element holen. War es ein `|`, darunter die passende `(` holen und zwei ε-Kanten setzen: von `(` zum Zeichen hinter `|` (der zweite Zweig) und von `|` zur `)` (der erste Zweig springt ans Ende). War es eine `(`, merken für eine mögliche Hülle.
* Vorausschau auf `*`: Folgt ein Stern, ε-Kanten in beide Richtungen zwischen dem Anfang des Elements (einzelnes Zeichen oder öffnende Klammer) und dem Stern. Damit kann man das Element überspringen oder wiederholen.
* `(`, `*`, `)` bekommen zusätzlich eine ε-Kante zum nächsten Zustand.

Beispiel (eigene Ableitung aus dem Code), Ausdruck ((A\*B|AC)D):

* Positionen: 0 `(`, 1 `(`, 2 A, 3 `*`, 4 B, 5 `|`, 6 A, 7 C, 8 `)`, 9 D, 10 `)`, Endzustand 11.
* ε-Kanten: 0→1, 1→2, 2→3, 3→2, 3→4, 1→6, 5→8, 8→9, 10→11.
* Lesart: Von 1 aus geht es entweder in den Zweig A\*B (über 2) oder AC (über 6). 2↔3 erlaubt beliebig viele A. Nach B (Zustand 5, das `|`) springt man direkt hinter die Klammer.

`recognizes(txt)` (Listing 5.24, hier nicht abgedruckt): Simulation des NEA.

* Startmenge: alle Zustände, die von 0 aus über ε-Kanten erreichbar sind. Dafür die Mehrfachstart-Erreichbarkeit aus Algorithmus 4.4 [\[33\]]({{< relref "erreichbarkeit" >}}).
* Für jedes Textzeichen: alle Zustände in der Menge, deren Zeichen passt, gehen einen Schritt weiter. Von diesen Zuständen aus wieder alle ε-erreichbaren dazunehmen.
* Am Ende: Ist der Endzustand M dabei, wird der Text akzeptiert.
* Für Suche im Text wie bei grep wird der Ausdruck einfach als (.\*Ausdruck.\*) verpackt.

Kosten:

* Aufbau: Zeit und Speicher proportional zu M.
* Erkennen: im schlimmsten Fall proportional zu M · N. Pro Textzeichen höchstens alle M Zustände und ihre ε-Kanten.

Einordnung: Hier laufen Fäden aus dem ganzen Buch zusammen: Stapel (Kapitel 1.3) für das Parsen, Digraph und Erreichbarkeit (Kapitel 4) für die Simulation, Automaten (KMP) als Modell. Der Aufbau stammt von Ken Thompson, der damit grep implementiert hat. Diese Implementierung erlaubt pro Klammergruppe nur ein `|`, mehrfaches Oder ist eine Übung.

Kapitel 5 bisher:

* Algorithmus 5.1: LSD-Sortierverfahren [\[43\]]({{< relref "lsd" >}})
* Algorithmus 5.2: MSD-Sortierverfahren [\[44\]]({{< relref "msd" >}})
* Algorithmus 5.3: 3-Wege-Quicksort für Strings [\[45\]]({{< relref "quick3string" >}})
* Algorithmus 5.4: Trie-Symboltabelle [\[46\]]({{< relref "trie" >}})
* Algorithmus 5.5: TST-Symboltabelle [\[47\]]({{< relref "tst" >}})
* Algorithmus 5.6: Knuth-Morris-Pratt [\[48\]]({{< relref "kmp" >}})
* Algorithmus 5.7: Boyer-Moore [\[49\]]({{< relref "boyer-moore" >}})
* Algorithmus 5.8: Rabin-Karp [\[50\]]({{< relref "rabin-karp" >}})
* Algorithmus 5.9: Reguläre Ausdrücke mit NEA [51]

{{< anmerkung >}}
**Mit dem Buch und Java abgeglichen:** Die Simulation von ((A\*B|AC)D) mit AABD kommt genau wie in Abbildung 5.51 heraus:

- Start: 0 1 2 3 4 6
- nach A: 3 7, mit ε-Übergängen 2 3 4 7
- nach A: 3, dann 2 3 4
- nach B: 5, dann 5 8 9
- nach D: 10, dann 10 11, akzeptiert

Die neun ε-Kanten, die die Instanz aus dem Code abgeleitet hat, sind auch die, die der Konstruktor setzt. Der Aufbau läuft wie in Abbildung 5.54: Der Stapel ist der Reihe nach 0, dann 1 0, bei „|“ 5 1 0, nach der ersten „)“ wieder 0 und am Ende leer. Jede ε-Kante kommt an derselben Stelle dazu, wie es die Abbildung rot zeigt.

**Kopier-Rest:** Im kopierten Erklärtext stand „als (.Ausdruck.) verpackt“. Die beiden Sterne hat das Chatfenster als Auszeichnung für Kursivschrift gelesen. Im Chat der Instanz steht „Ausdruck“ dort tatsächlich kursiv, das hat Sven nachgesehen. Beim Kopieren sind die Sterne deshalb verschwunden, einzelne Sterne wie in A\* blieben erhalten. Im Buch steht es so im GREP-Client, Listing 5.26: `"(.*" + args[0] + ".*)"`. Ich habe die Sterne wieder eingesetzt, sonst ist der Text unverändert.

**Code:** Der Java-Code ist der aus Listing 5.25 und 5.24. `DirectedDFS` ist dieselbe Klasse wie `Erreichbarkeit` bei Algorithmus 4.4, hier unter dem Namen aus dem Buch, und `main()` ist von mir. Die Eingabezeile nimmt nur Ausdrücke an, die der Konstruktor verarbeiten kann: ganz geklammert, Klammern ausgeglichen, ein Stern nur hinter einem Zeichen oder einer „)“, je Gruppe höchstens ein „|“. Bei anderen Ausdrücken bricht der Java-Code mit einer Ausnahme ab oder baut einen falschen Automaten.

**Tests:** Geprüft habe ich mit Java 21 und 600 zufälligen Ausdrücken mit Verkettung, Oder, Stern, Punkt und verschachtelten Klammern, jeweils auf einen zufälligen Text aus A, B und C. 201 davon werden erkannt. Das Ergebnis stimmt jedes Mal mit `java.util.regex` überein, und Java und Visualisierung liefern dasselbe, auch bei den ε-Kanten.
{{< /anmerkung >}}
