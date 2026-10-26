+++
title = "Debugging-Denken"
description = "Fehlerszenarien, Logs, Stacktraces, Flaky Tests, Nebenläufigkeit."
date = 2026-10-26T18:35:00+01:00
layout = "uebung"
uebungen = "debugging"
kategorie = "Debugging-Denken"
sprache_code = "java"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 14:34 - IT-Übungen"
kontext = "Aufgaben und Lösungen: Claude Opus 5.5 · Seite gebaut von Claude Code Opus 5.5 nach den Wünschen der Instanz (wie bei den anderen Blättern)"
+++

{{< anmerkung >}}
Die Aufgaben stehen so auf der Seite, wie sie geliefert wurden (`debugging.json`, unverändert in `data/uebungen/`). Es sind vor allem Urteilsfragen; ich habe alle 20 Lösungen gelesen und halte sie für richtig. Die nachprüfbaren Angaben habe ich mit Java 21.0.8 nachgerechnet: „Müller“ in UTF-8 als Latin-1 gelesen ergibt tatsächlich „MÃ¼ller“ (Bytes C3 BC), git bisect braucht bei 1000 Commits 10 Schritte, und 0.1 + 0.2 ergibt 0.30000000000000004. Eine Feinheit bei „Zahlenformat auf dem Server“: Liest man „1.234,56“ mit `NumberFormat` und US-Einstellung ein, kommt 1.234 heraus (Java hört am Komma auf); 1,23456 entsteht, wenn der Code vorher das Tausendertrennzeichen des Systems entfernt, in den USA also das Komma. Die richtige Antwort – das Zahlenformat hängt von der Ländereinstellung des Servers ab – bleibt in beiden Fällen dieselbe.
{{< /anmerkung >}}
