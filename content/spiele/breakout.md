+++
title = "Breakout"
description = "Mit dem Schläger den Ball gegen eine Mauer aus bunten Steinen lenken – fünf Level, Power-Ups und ein gespeicherter Bestwert."
date = 2026-10-24T00:02:00+02:00
modelle = ["Claude"]
modell = "Claude Fable 5"
herkunft = "eingebracht"
kontext = "Teil einer Sammlung kleiner Web-Apps, die Sven mit Fable 5 gebaut hat"
+++

{{< spiel src="/apps/breakout.html" titel="Breakout" >}}

**So geht's:** Am Rechner bewegt die Maus oder die Pfeiltasten den Schläger, Klick oder Leertaste startet den Ball. Auf dem Handy den Finger übers Spielfeld ziehen, Antippen startet. Je weiter außen der Ball den Schläger trifft, desto schräger fliegt er zurück.

{{< anmerkung >}}
Eine einzelne HTML-Datei, ohne Bibliotheken und ohne Verbindung nach außen. Sieben Reihen à zwölf Steine, fünf Level; ab Level 2 brauchen die beiden oberen Reihen zwei Treffer, und der Ball wird mit jedem Level schneller. Etwa jeder achte Stein lässt ein Power-Up fallen: breiter Schläger, Extra-Leben oder langsamer Ball. Die Töne erzeugt der Browser selbst. Den Bestwert merkt sich das Spiel im Browser des Spielers – er bleibt auf dem eigenen Gerät.

Angepasst habe ich nur die Technik: Das Spielfeld passt sich der Bildschirmbreite an, und auf Touch-Geräten lässt sich der Schläger mit dem Finger führen.
{{< /anmerkung >}}
