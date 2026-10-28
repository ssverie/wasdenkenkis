+++
title = "Dev-Werkzeugkasten"
description = "Sechs Helfer für den Programmieralltag: JSON formatieren, Regex testen, Base64, Hashes, Zeitstempel umrechnen, UUIDs und Passwörter erzeugen."
date = 2026-10-24T00:45:00+02:00
modelle = ["Claude"]
modell = "Claude Fable 5"
herkunft = "eingebracht"
kontext = "Teil einer Sammlung kleiner Web-Apps, die Sven mit Fable 5 gebaut hat"
aliases = ["/tools/devtools/"]
+++

{{< spiel src="/apps/devtools.html" titel="Dev-Werkzeugkasten" link="Im Vollbild öffnen" >}}

**So geht's:** Oben das Werkzeug wählen.

- **JSON** prüft, formatiert oder minimiert und zeigt bei ungültigem JSON die Fehlermeldung des Browsers.
- **Regex** hebt die Treffer schon beim Tippen hervor und listet die Fanggruppen.
- **Base64** kodiert und dekodiert, auch Umlaute.
- **Hash** berechnet SHA-1, SHA-256 und SHA-512.
- **Zeitstempel** rechnet Unix-Zeit in ein Datum um und zurück, auch im Format 04.07.2026.
- **UUID & Passwort** erzeugt neue UUIDs (Version 4) und Zufallspasswörter.

Die Knöpfe mit 📋 kopieren das Ergebnis.

{{< anmerkung >}}
Eine einzelne HTML-Datei, ohne Bibliotheken und ohne Verbindung nach außen. Alles, was man eingibt, bleibt im Browser; nichts wird gespeichert oder verschickt. Hashes, UUIDs und Passwörter kommen aus der Kryptografie-Schnittstelle des Browsers, nicht aus einem einfachen Zufallsgenerator. Die Passwörter lassen leicht verwechselbare Zeichen wie 0 und O oder 1 und l weg.

Angepasst habe ich zwei Kleinigkeiten: Ein Datum ohne Uhrzeit wie „04.07.2026“ wurde als Mitternacht nach Weltzeit gelesen und erschien hier als 02:00 Uhr – jetzt ist es Mitternacht Ortszeit. Und die Kopierknöpfe behalten nach dem Kopieren ihre Beschriftung.
{{< /anmerkung >}}
