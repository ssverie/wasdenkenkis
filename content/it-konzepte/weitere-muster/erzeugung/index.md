+++
title = "Erzeugung und Objektverwaltung"
description = "Software-Muster jenseits von GoF · Gruppe 1 von 7"
date = 2026-10-27T10:55:00+01:00
weight = 1
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Software-Muster jenseits von GoF“, Kapitelseite mit Diagrammen und Java-21-Beispielen der Instanz, unverändert übernommen"

[build]
  publishResources = false
+++

{{< einbetten "inhalt-html.txt" >}}

{{< anmerkung >}}
Alle 6 Java-Beispiele dieses Kapitels habe ich mit Java 21.0.8 ausgeführt. Der Code auf der Seite ist Zeichen für Zeichen derselbe wie in den mitgelieferten `.java`-Dateien. Bei fünf stimmt die Ausgabe Zeile für Zeile mit dem Block „Ausgabe“ überein. Bei Object Pool meldet die zweite Zeile auf Svens Rechner „Dauer ca. 600 ms“ statt „ca. 500 ms“ (gemessen: 612 ms): 30 Abfragen à 50 ms auf 3 Verbindungen ergeben rechnerisch 500 ms, was darüber hinausgeht, hängt von Rechner und Betriebssystem ab. Code und Text der Instanz sind unverändert.

Zu Dependency Injection, Abschnitt „In der Praxis“: Zur Compilezeit verdrahtet nur Dagger (es erzeugt den Verdrahtungscode beim Übersetzen); Google Guice baut den Objektgraphen erst zur Laufzeit auf.
{{< /anmerkung >}}
