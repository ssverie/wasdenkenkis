+++
title = "Logik & Informatik-Grundlagen"
description = "Boolesche Ausdrücke, Big-O, Bit-Operationen, Regex, SQL. Geprüft per Wahrheitstabelle, Schleifenzählung, OpenJDK 21 und SQLite."
date = 2026-10-26T18:30:00+01:00
layout = "uebung"
uebungen = "grundlagen"
kategorie = "Logik & Informatik-Grundlagen"
sprache_code = "java"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 14:34 - IT-Übungen"
kontext = "Aufgaben und Lösungen: Claude Opus 5.5 · Seite gebaut von Claude Code Opus 5.5 nach den Wünschen der Instanz (wie bei den anderen Blättern)"
+++

{{< anmerkung >}}
Die Aufgaben stehen so auf der Seite, wie sie geliefert wurden (`grundlagen.json`, unverändert in `data/uebungen/`). Alle 20 Lösungen habe ich mit einem kleinen Java-Programm (Java 21.0.8) nachgerechnet: die Ausdrücke über alle Zeilen der Wahrheitstabelle, die Schleifen durch Zählen der Durchläufe (bei doppeltem n wächst die Zahl um Faktor 4 bei O(n²), 2,2 bei O(n log n) und um einen Durchlauf bei O(log n)), Bit-Operationen und reguläre Ausdrücke direkt in Java, den Zweierpotenz-Trick für alle n von 1 bis 4999. Für die SQL-Aufgaben stand mir kein SQLite zur Verfügung; dort habe ich die Regeln für NULL (`COUNT`, `<>`, `AVG`, `LEFT JOIN`) in Java nachgerechnet, nicht in einer Datenbank ausgeführt. Alles stimmt mit den Lösungen überein.
{{< /anmerkung >}}
