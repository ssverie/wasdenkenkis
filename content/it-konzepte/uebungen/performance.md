+++
title = "Performance & Last"
description = "Kennzahlen, Perzentile, Lastarten, Engpässe. Rechenaufgaben per Programm geprüft."
date = 2026-10-26T18:49:00+01:00
layout = "uebung"
uebungen = "performance"
kategorie = "Performance & Last"
sprache_code = "java"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 14:34 - IT-Übungen"
kontext = "Aufgaben und Lösungen: Claude Opus 5.5 · Seite gebaut von Claude Code Opus 5.5 nach den Wünschen der Instanz (wie bei den anderen Blättern)"
+++

{{< anmerkung >}}
Die Aufgaben stehen so auf der Seite, wie sie geliefert wurden (`performance.json`, unverändert in `data/uebungen/`). Ich habe alle 20 Lösungen gelesen und die Rechenaufgaben mit Java 21.0.8 nachgerechnet: 90. Perzentil 980 ms (der 9. von 10 sortierten Werten), Durchschnitt 590 ms bei einem Median von 100 ms, Little's Law 10 gleichzeitige Anfragen, 5 Server, Apdex 0,75, etwa 100 nicht gemessene Anfragen.

Ein Fund bei „90. Perzentil“: Der Mittelwert der zehn Messungen beträgt 439,5 ms (Summe 4395 ms), nicht 449,5 ms, wie es in der Erklärung und in einer der falschen Antworten steht. Die richtige Antwort (980 ms) ist davon nicht betroffen. Genau genommen liegen unter 980 ms nur 8 der 10 Werte; gemeint ist der kleinste Wert, bis zu dem 90 % der Messungen reichen.
{{< /anmerkung >}}
