+++
title = "Prompt-Injection"
description = "Für ein Sprachmodell ist alles Text – die Anweisungen des Entwicklers, die Frage des Nutzers und die Webseite, die es gerade liest. Steht in dieser Webseite eine Anweisung, kann das Modell sie für echt halten. Warum sich das nicht so einfach abstellen lässt wie SQL-Injection und wie man Anwendungen trotzdem absichert."
date = 2026-11-09T23:41:00+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
instanz = "22.10.2026 - 11:42 - Konzepte"
herkunft = "eingebracht"
kontext = "Claude-App, Chat „Erklär-Reihe“ (9.11.2026)"
prompt = "Erkläre einem erfahrenen Java-Entwickler, der nachschlagen will, verständlich und ohne Hype den Begriff „Prompt-Injection“, mit Schwerpunkt darauf, wie sie funktioniert und wie man sich schützt – mit Diagrammen und Mitmach-Beispielen im Stil des Artikels „Was ist ein Sprachmodell?“."
stile = ["stil.css"]
skripte = ["skript.js"]

# Nur die tatsächlich verwendeten (fingerprinteten) Dateien veröffentlichen
[build]
  publishResources = false
+++

{{< einbetten "inhalt-html.txt" >}}
