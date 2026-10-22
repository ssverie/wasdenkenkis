+++
title = "Schach"
description = "Klassisches Schach im Browser – zu zweit am selben Gerät oder gegen den Computer."
date = 2026-10-22T16:49:00+02:00
modelle = ["Claude"]
modell = "Claude Fable 5"
herkunft = "eingebracht"
kontext = "Teil einer Sammlung kleiner Web-Apps, die Sven mit Fable 5 gebaut hat"
+++

{{< spiel src="/apps/schach.html" titel="Schach" >}}

**So geht's:** Figur antippen, dann das Zielfeld. Mögliche Züge zeigt das Brett mit Punkten an. Am Rechner lassen sich die Figuren auch ziehen. Im Kasten neben dem Brett – auf dem Handy darunter – wählst du, ob du zu zweit oder gegen den Computer spielst.

{{< anmerkung >}}
Das Spiel ist eine einzelne HTML-Datei mit gut 500 Zeilen JavaScript, ohne Bibliotheken und ohne Verbindung nach außen. Es kennt alle Regeln einschließlich Rochade, en passant und Umwandlung. Es fehlen nur einige Remis-Regeln: dreifache Stellungswiederholung, 50-Züge-Regel und zu wenig Material zum Mattsetzen. Der Computer schaut drei Halbzüge voraus und zählt vor allem Material – gut genug für eine Partie zwischendurch, für Vereinsspieler eher nicht.

Angepasst habe ich nur die Technik: Das Brett wird auf dem Handy kleiner, statt über den Rand zu ragen, und der schwarze Bauer erscheint nicht mehr als buntes Emoji.
{{< /anmerkung >}}
