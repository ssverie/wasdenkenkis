+++
title = "Was ist ein Sprachmodell?"
description = "Eine sehr große Funktion, die immer nur eines tut: das nächste Wortstück vorhersagen. Warum daraus trotzdem Gespräche, Code und Geschichten werden."
date = 2026-10-21
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "claude"
prompt = "Erkläre einem erfahrenen Java-Entwickler verständlich und ohne Hype, was ein Sprachmodell ist, wie es entsteht und wo seine Grenzen liegen."
+++

## Kurz gesagt

Ein Sprachmodell ist ein Programm, das zu einem Text vorhersagt, wie er wahrscheinlich weitergeht. Mehr nicht. Es bekommt einen Text und liefert für jedes mögliche nächste Wortstück eine Wahrscheinlichkeit. Eines davon wird ausgewählt, angehängt, und das Ganze beginnt von vorn – so lange, bis die Antwort fertig ist.

Dass dabei Erklärungen, Programmcode oder Gedichte herauskommen, liegt nicht an einem eingebauten Verständnis von Gedichten. Es liegt daran, dass man sehr gut vorhersagen können muss, um gute Texte fortzusetzen – und dass dafür offenbar eine Menge Wissen über die Welt nötig ist.

## Wortstücke statt Wörter: Tokens

Das Modell arbeitet nicht mit Buchstaben und nicht ganz mit Wörtern, sondern mit **Tokens**: häufigen Wortstücken. „Sprachmodell“ wird je nach Modell zum Beispiel in „Sprach“ und „modell“ zerlegt, ein seltenes Wort in mehr Teile, ein häufiges wie „der“ bleibt ein Stück. Ein deutsches Wort entspricht im Schnitt grob ein bis zwei Tokens.

Für dich als Entwickler: Tokens sind die Einheit, in der abgerechnet wird und in der die Grenzen eines Modells gemessen werden.

## Wie es entsteht: Training

**1. Vortraining.** Das Modell liest riesige Mengen Text – Bücher, Webseiten, Programmcode – und übt immer dieselbe Aufgabe: Das nächste Token raten, mit der richtigen Lösung vergleichen, die eigenen Zahlen ein winziges Stück in die richtige Richtung verschieben. Milliardenfach. Danach kann es Texte fortsetzen, ist aber noch kein Gesprächspartner: Auf eine Frage antwortet es womöglich mit drei weiteren Fragen, weil Fragen in Foren oft so aufeinander folgen.

**2. Feinabstimmung.** Danach wird es mit Beispielen guter Antworten und mit Bewertungen durch Menschen nachtrainiert. Hier lernt es, hilfreich zu antworten, Anweisungen zu folgen und bestimmte Dinge abzulehnen. Was du im Chat erlebst, ist vor allem das Ergebnis dieses Schritts.

## Was im Modell steckt: Parameter

Das fertige Modell besteht aus **Parametern**, auch Gewichte genannt: Milliarden Zahlen, bei großen Modellen Hunderte Milliarden, die beim Training eingestellt wurden. Es gibt darin keine Datenbank mit Fakten und keinen Quelltext, in dem steht, wie man einen Brief schreibt. Alles Gelernte ist über diese Zahlen verteilt.

Ein passender Vergleich aus der Java-Welt: Das Modell ist wie eine Klassendatei ohne Quellcode, die nie jemand geschrieben hat. Sie wurde aus Beispielen „herausgerechnet“. Man kann sie ausführen und beobachten, was sie tut, aber nicht einfach nachlesen, warum.

## Das Arbeitsgedächtnis: Kontextfenster

Alles, was das Modell während eines Gesprächs „weiß“, muss in seinem **Kontextfenster** stehen: deine Fragen, seine bisherigen Antworten, angehängte Dateien. Das Fenster ist groß, heute oft Hunderttausende Tokens, aber endlich. Was nicht drinsteht, existiert für das Modell nicht. Deshalb erinnert es sich ohne Zusatzfunktionen auch nicht an das Gespräch von gestern.

## Für Entwickler übersetzt

| Begriff | Entspricht ungefähr |
|---|---|
| Modell | eine reine Funktion: `Verteilung naechstesToken(List<Token> kontext)` |
| Antwort erzeugen | eine Schleife, die diese Funktion immer wieder aufruft und das Ergebnis anhängt |
| Temperatur | wie mutig aus der Verteilung gezogen wird: niedrig = vorhersehbar, hoch = abwechslungsreich |
| Kontextfenster | die maximale Länge der Liste `kontext` |
| Parameter | die festen Konstanten in der Funktion, beim Training berechnet, danach unveränderlich |

Die Funktion selbst hat keinen Zustand. Das „Gedächtnis“ im Chat entsteht nur dadurch, dass bei jedem Schritt der gesamte bisherige Verlauf erneut übergeben wird.

## Warum es sich irrt

Ein Sprachmodell erzeugt das **Plausible**, nicht zwingend das **Wahre**. Meistens fällt beides zusammen, denn wahre Aussagen sind in den Trainingstexten häufiger als falsche. Fehlt aber Wissen – ein seltener Fakt, eine exakte Zahl, ein Ereignis nach dem Trainingsende –, dann liefert das Modell trotzdem etwas, das plausibel klingt. Das nennt man **Halluzination**. Es ist kein Lügen und kein Defekt im üblichen Sinn, sondern die direkte Folge des Prinzips.

Daraus folgen drei praktische Regeln:

- Bei Fakten, Zahlen und Quellen: nachprüfen oder das Modell mit Websuche arbeiten lassen.
- Je genauer die Frage und je mehr Material im Kontext steht, desto besser die Antwort.
- Selbstsicherer Ton sagt nichts über Richtigkeit.

## Was ein Sprachmodell nicht ist

- **Keine Suchmaschine.** Es schlägt nichts nach, es sei denn, man gibt ihm ein Suchwerkzeug.
- **Keine Datenbank.** Es kann Fakten wiedergeben, aber nicht garantiert und nicht mit Quellenangabe.
- **Kein Programm, das jemand Zeile für Zeile geschrieben hat.** Sein Verhalten wurde trainiert, nicht programmiert – deshalb ist es manchmal überraschend gut und manchmal überraschend daneben.

## Begriffe aus diesem Beitrag

**Token** · **Parameter** · **Kontextfenster** · **Temperatur** · **Halluzination** – jeder davon bekommt später einen eigenen Eintrag in dieser Rubrik.
