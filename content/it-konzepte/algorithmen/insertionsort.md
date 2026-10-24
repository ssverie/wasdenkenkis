+++
title = "Insertionsort (Algorithmus 2.2)"
description = "Sortieren durch Einfügen aus Sedgewick/Wayne, Algorithmus 2.2 (Listing 2.5) – Schritt für Schritt, mit Java-Code, Ablaufprotokoll und Inversionen."
date = 2026-10-24T17:30:00+02:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 2.2 (Listing 2.5) und Abbildung 2.2"
+++

{{< spiel src="/apps/insertionsort.html" titel="Insertionsort – Visualisierung" >}}

**So geht's:** Mit „Schritt“ einzeln durchgehen, mit „Bis eingefügt“ springen, bis das aktuelle Element seinen Platz gefunden hat, oder alles abspielen lassen. Orange ist das Element, das gerade nach links wandert, blau sein linker Nachbar, mit dem es verglichen wird. Rechts wächst das Ablaufprotokoll wie in Abbildung 2.2 des Buchs. Unter „Anordnung“ lohnt der Vergleich: Ein schon sortiertes Array ist nach n−1 Vergleichen fertig, ein umgekehrtes braucht die volle Zahl. Der Zähler „Inversionen übrig“ sinkt mit jedem Tausch um genau eins.

## Erklärung

Insertionsort funktioniert wie Spielkarten auf die Hand sortieren: Du nimmst die nächste Karte und schiebst sie nach links, bis sie richtig sitzt.

Der Code:

* `i` läuft ab 1 nach rechts. Links von `i` ist immer schon alles sortiert.
* Die innere Schleife nimmt `a[i]` und tauscht es so lange mit dem linken Nachbarn, wie es kleiner ist (`less(a[j], a[j-1])`).
* Sobald der linke Nachbar nicht größer ist, bricht sie ab. Das ist der entscheidende Unterschied zu Selectionsort: Es wird nicht stur alles durchsucht.

Die Tabelle:

* `j` zeigt, wo das neue Element landet. Zeile i=4: Das E wandert ganz nach vorn auf Index 0, O R S T rutschen je eine Stelle nach rechts (schwarz).
* Zeile i=3: Das T ist schon größer als alles links davon, also j=3, nichts bewegt sich.
* Rot = eingefügtes Element, schwarz = verschoben, grau = unberührt.

Inversionen sind Paare in falscher Reihenfolge. Jeder Tausch beseitigt genau eine davon, also gilt: Anzahl Tauschoperationen = Anzahl Inversionen.

Kosten:

* Bestfall (schon sortiert): N−1 Vergleiche, 0 Tausche, also linear.
* Durchschnitt: etwa N²/4 Vergleiche und Tausche.
* Schlechtester Fall (umgekehrt sortiert): etwa N²/2.

Gegenüber Selectionsort: Insertionsort passt sich an die Eingabe an. Bei teilweise sortierten Arrays (wenige Inversionen) ist es fast linear und damit deutlich schneller. Selectionsort braucht dagegen immer N²/2 Vergleiche, gewinnt aber, wenn Tauschen teuer ist, weil es nur N Tausche macht.

{{< anmerkung >}}
Auch hier meinen „die Tabelle“ und die Farben Rot, Schwarz und Grau die Abbildung 2.2 im Buch, und `less` ist die Vergleichsmethode aus dem Buch. In der Visualisierung steht dafür direkt `a[j] < a[j - 1]`, das wandernde Element ist orange, und statt SORTEXAMPLE stehen Zahlen. Im Protokoll sind wie im Buch das eingefügte Element hervorgehoben, die verschobenen normal und die unberührten grau.
{{< /anmerkung >}}
