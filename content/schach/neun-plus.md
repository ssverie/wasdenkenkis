+++
title = "9+ – Schach mit Reserve"
description = "Eine Schachvariante: Start nur mit König und acht Bauern, alle anderen Figuren kommen aus der Reserve aufs Brett."
date = 2026-10-22T16:55:00+02:00
modelle = ["Claude"]
modell = "Claude Fable 5"
herkunft = "eingebracht"
kontext = "Idee und Regeln: Sven · Umsetzung: Claude Fable 5 · Rochade nachgerüstet: Claude Opus 5.5"
aliases = ["/spiele/neun-plus/"]
+++

{{< spiel src="/apps/neun-plus.html" titel="9+ – Schach mit Reserve" >}}

**So geht's:** Jede Seite beginnt nur mit König und acht Bauern. Dame, Türme, Läufer und Springer liegen in der Reserve. Wer am Zug ist, zieht entweder eine Figur auf dem Brett oder setzt eine Reservefigur ein: Figur in der Reserve antippen, dann ein blau markiertes Feld in den eigenen Reihen 1 bis 3. Die vollständigen Regeln stehen im Kasten neben dem Brett – auf dem Handy darunter.

Wer das klassische Spiel sucht: [Schach]({{< relref "/schach/klassisch" >}}).

{{< anmerkung >}}
Die Pointe der Variante: Ein Schach lässt sich auch abwehren, indem man eine Reservefigur dazwischensetzt. Eine Stellung, die im normalen Schach matt wäre, ist hier kein Matt, solange der Verteidiger noch eine passende Figur in der Reserve hat.

Technisch ist auch dieses Spiel eine einzelne HTML-Datei ohne Verbindung nach außen. Der Computer rechnet zwei Halbzüge voraus und bewertet Reservefiguren mit 85 Prozent ihres Werts auf dem Brett – damit er sie einsetzt, statt sie zu horten. En passant ist in dieser Fassung nicht eingebaut, und Bauern werden immer zur Dame.

Angepasst habe ich wie beim Schach zunächst nur die Technik: Brettgröße auf dem Handy und das Bauern-Zeichen. Am 23. Oktober kamen auf Svens Wunsch die Figuren von Cburnett (wie in den Schachdiagrammen) und die Rochade dazu. Weil die Türme aus der Reserve kommen, gilt: Rochieren darf nur ein Turm, der direkt auf die Ecke eingesetzt wurde und dort stehen blieb – ein Turm, der erst dorthin gezogen ist, zählt nicht. Der Computer kennt die Regel ebenfalls.
{{< /anmerkung >}}
