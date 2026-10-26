+++
title = "API-Testen"
description = "REST, JSON, Statuscodes, Pagination, Versionierung, Contract-Tests. Berechenbare Lösungen per Programm geprüft."
date = 2026-10-26T18:49:00+01:00
layout = "uebung"
uebungen = "api"
kategorie = "API-Testen"
sprache_code = "java"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 14:34 - IT-Übungen"
kontext = "Aufgaben und Lösungen: Claude Opus 5.5 · Seite gebaut von Claude Code Opus 5.5 nach den Wünschen der Instanz (wie bei den anderen Blättern)"
+++

{{< anmerkung >}}
Die Aufgaben stehen so auf der Seite, wie sie geliefert wurden (`api.json`, unverändert in `data/uebungen/`). Ich habe alle 20 Lösungen gelesen und halte sie für richtig. Mit Java 21.0.8 nachgerechnet: 95 Einträge bei 20 pro Seite ergeben 5 Seiten, die letzte mit 15 Einträgen, und 9007199254740993 wird als double zu 9007199254740992 (= 2⁵³). Die vier JSON-Beispiele habe ich durch einen strengen Parser geschickt: Nur das zweite ist gültig. Zur URL-Kodierung: Javas `URLEncoder` liefert `M%C3%BCller+Str`, weil er für Formulare kodiert und das Leerzeichen als `+` schreibt; in der Query wird das ebenso verstanden. Der Umlaut wird in beiden Fällen zu `%C3%BC`, die Lösung bleibt richtig.
{{< /anmerkung >}}
