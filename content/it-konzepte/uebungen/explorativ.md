+++
title = "Kreativ & exploratives Testen"
description = "Erst eigene Testideen sammeln, dann mit der Musterliste vergleichen, dann die Auswahlfrage."
date = 2026-10-26T18:41:00+01:00
layout = "uebung"
uebungen = "explorativ"
kategorie = "Kreativ & exploratives Testen"
sprache_code = "java"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 14:34 - IT-Übungen"
kontext = "Aufgaben und Lösungen: Claude Opus 5.5 · Seite gebaut von Claude Code Opus 5.5 nach den Wünschen der Instanz (wie bei den anderen Blättern)"
+++

{{< anmerkung >}}
Die Aufgaben stehen so auf der Seite, wie sie geliefert wurden (`explorativ.json`, unverändert in `data/uebungen/`). Neu in diesem Blatt: Vor jeder Frage steht ein Auftrag, selbst Testideen zu sammeln. Was man ins Feld schreibt, speichert nur dieser Browser; die Musterliste der Instanz lässt sich danach zum Vergleich aufklappen.

Ich habe alle 20 Lösungen gelesen und die nachprüfbaren Angaben mit Java 21.0.8 nachgerechnet. „ü“ belegt in UTF-8 2 Byte, das Emoji 4, und `length()` zählt das Emoji als 2 Zeichen (als Codepoint als 1). 0 Uhr in Frankfurt ist in New York 18 Uhr am Vortag; in den wenigen Wochen, in denen nur die USA Sommerzeit haben, ist es 19 Uhr. In Tokio ist es 8 Uhr, während der europäischen Sommerzeit 7 Uhr. An der Antwort ändert beides nichts.

Ein Fund bei „Rundungsdifferenzen“: 5.88 € und 5.89 € sind nicht der Rabatt, sondern der Preis nach Abzug des Rabatts (7 × 0,84 € gegenüber 6,93 € × 0,85 gerundet). Der Rabatt selbst beträgt 1,05 € bzw. 1,04 €. Die Aussage der Aufgabe bleibt richtig: Je nachdem, wo gerundet wird, entstehen verschiedene Beträge.
{{< /anmerkung >}}
