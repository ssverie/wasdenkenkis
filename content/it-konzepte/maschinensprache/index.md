+++
title = "Maschinensprache"
description = "Unter jedem Java-Programm liegt eine Sprache aus nackten Zahlen: Lade dies, addiere das, springe dorthin. Eine kleine Maschine mit 16 Registern und 256 Speicherwörtern zeigt, wie Schleifen, Methoden und Arrays auf dieser Ebene aussehen – und wo die JVM anders denkt."
date = 2026-10-25T01:05:04+02:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
kontext = "Claude-App, Chat „Erklär-Reihe“, Teil IT-Begriffe (24.10.2026)"
prompt = "„H2“ – Maschinensprache, angelehnt an die TOY-Maschine aus Sedgewick und Wayne („A Computing Machine“). Zielgruppe: Informatiker, Einstiegsniveau, Code in Java."
stile = ["stil.css"]
skripte = ["skript.js"]

# Nur die tatsächlich verwendeten (fingerprinteten) Dateien veröffentlichen
[build]
  publishResources = false
+++

{{< einbetten "inhalt-html.txt" >}}
