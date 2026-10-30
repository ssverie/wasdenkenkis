+++
title = "Accelerate – Zusammenfassung und Einordnung"
description = "Nicole Forsgren, Jez Humble, Gene Kim, Accelerate: The Science of Lean Software and DevOps (2018)"
date = 2026-10-30T13:27:10+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["accelerate-2018"]
+++

## Einleitung

Alle bisherigen Bücher der Reihe argumentieren aus Erfahrung. Accelerate ist anders: Es prüft mit Umfragedaten aus vier Jahren und von über 23.000 Teilnehmenden, welche Praktiken tatsächlich mit besserer Softwarelieferung zusammenhängen, und ob bessere Softwarelieferung mit wirtschaftlichem Erfolg zusammenhängt.

### Autoren und Kontext

- **Nicole Forsgren** ist promovierte Forscherin für Informationssysteme und war die wissenschaftliche Leiterin des Projekts. Sie hat die Methodik verantwortet.
- **Jez Humble** ist Mitautor von *Continuous Delivery* (2010), dem Standardwerk zur automatisierten Auslieferung.
- **Gene Kim** ist Mitautor von *The Phoenix Project* und *The DevOps Handbook* und eine zentrale Figur der DevOps-Bewegung.

Die Daten stammen aus den jährlichen **State of DevOps Reports** von 2014 bis 2017, die das Team zuerst mit Puppet Labs durchführte und dann unter dem Namen **DORA** (DevOps Research and Assessment) als eigene Firma. Google übernahm DORA kurz nach Erscheinen des Buchs im Jahr 2018, und die Berichte erscheinen seitdem bei Google Cloud.

### Die Kernaussagen

1. **Softwarelieferung lässt sich messen**, mit vier einfachen Kennzahlen.
2. **Geschwindigkeit und Stabilität sind kein Gegensatz.** Die besten Teams liefern schneller **und** stabiler.
3. **Gute Lieferleistung hängt mit Unternehmenserfolg zusammen**, etwa Rentabilität, Marktanteil und Produktivität.
4. **Bestimmte Fähigkeiten sagen gute Lieferleistung voraus**, darunter technische Praktiken, Architektur, Management und Kultur. Das Buch nennt 24 solcher Fähigkeiten.
5. **Diese Fähigkeiten lassen sich gezielt verbessern.** Es geht nicht um Reifegrade, die man abarbeitet, sondern um Fähigkeiten, die man kontinuierlich ausbaut.

### Aufbau

| Teil | Kapitel | Inhalt |
|---|---|---|
| I. Was wir gefunden haben | 1–11 | Kennzahlen, Kultur, technische Praktiken, Architektur, Sicherheit, Management, Produktentwicklung, Burnout, Zufriedenheit, Führung |
| II. Die Forschung | 12–15 | Wissenschaftliche Methode, Psychometrie, warum Umfragen, die Daten |
| III. Transformation in der Praxis | 16 | Fallstudie zur Führung, beigesteuert von Steve und Karen Whitley Bell |

Der Hauptteil ist mit rund 130 Seiten kurz und gut lesbar. Ungewöhnlich ist, dass ein ganzer Teil der Methode gewidmet ist: Die Autoren wollen, dass man ihnen nicht glaubt, sondern nachvollzieht, warum ihre Ergebnisse belastbar sind.

### Fähigkeiten statt Reifegrade

Gleich im ersten Kapitel grenzen sich die Autoren von **Reifegradmodellen** wie CMMI ab. Reifegrade suggerieren, man könne eine Stufe erreichen und dann fertig sein. Accelerate setzt auf **Fähigkeiten**, die man nie vollständig beherrscht, deren Verbesserung aber messbar wirkt. Das passt zu Becks Idee aus Tidy First?, Design als fortlaufende Investition zu sehen.

## Lieferleistung messen

Bevor man fragen kann, was gute Teams anders machen, muss man festlegen, woran man „gut“ erkennt. Das zweite Kapitel ist dafür vielleicht das einflussreichste des Buchs.

### Was schlechte Kennzahlen gemeinsam haben

Die Autoren lehnen drei verbreitete Maße ab:

| Kennzahl | Problem |
|---|---|
| Codezeilen | belohnt aufgeblähten Code; weniger Code für dasselbe Ergebnis ist besser |
| Velocity in Story Points | relativ und teamabhängig, lässt sich leicht aufblähen, nicht zwischen Teams vergleichbar |
| Auslastung | Bei hoher Auslastung steigen Wartezeiten stark an; ein voll ausgelastetes Team kann auf nichts mehr reagieren |

Gute Kennzahlen müssen zwei Bedingungen erfüllen: Sie messen ein **globales Ergebnis**, nicht lokale Optimierung einzelner Abteilungen, und sie messen **Ergebnisse statt Ausstoß**, also Wirkung statt Menge.

### Die vier Kennzahlen

| Kennzahl | Was sie misst | Art |
|---|---|---|
| **Durchlaufzeit für Änderungen** | Zeit vom Commit bis zur Änderung in Produktion | Tempo |
| **Deployment-Häufigkeit** | Wie oft in Produktion ausgeliefert wird | Tempo |
| **Wiederherstellungszeit** | Wie lange es dauert, nach einem Ausfall oder Fehler den Dienst wiederherzustellen | Stabilität |
| **Änderungsfehlerrate** | Anteil der Änderungen, die zu Fehlern führen und nachgebessert oder zurückgerollt werden müssen | Stabilität |

Die Durchlaufzeit misst bewusst nur den Teil vom Commit bis zur Produktion, nicht von der Idee bis zur Auslieferung. Dieser Teil ist gut messbar und weitgehend von der Technik und den Abläufen des Teams bestimmt.

### Tempo und Stabilität gehören zusammen

Die wichtigste Erkenntnis des Kapitels: In den Daten gibt es **keinen Zielkonflikt** zwischen Tempo und Stabilität. Die Teams mit den kürzesten Durchlaufzeiten und den häufigsten Deployments haben auch die niedrigsten Fehlerraten und die schnellste Wiederherstellung. Schwache Teams sind in beiden Dimensionen schwach.

Das widerspricht einer verbreiteten Intuition, nach der Stabilität durch Vorsicht entsteht, also durch seltene, große, gründlich geprüfte Releases. Die Daten sprechen für das Gegenteil: Kleine, häufige Änderungen sind sicherer, weil jede einzelne kleiner, leichter zu verstehen und schneller zurückzunehmen ist.

### Die Leistungsgruppen

Durch Clusteranalyse teilen die Autoren die Teams in Gruppen mit hoher, mittlerer und niedriger Leistung. Laut dem Bericht von 2017, auf den sich das Buch stützt, lieferten die Leistungsstärksten im Vergleich zu den Schwächsten:

- um ein Vielfaches häufiger aus, die Rede ist von rund 46-mal,
- mit einer um Größenordnungen kürzeren Durchlaufzeit,
- mit deutlich schnellerer Wiederherstellung
- und einer etwa fünfmal niedrigeren Änderungsfehlerrate.

Die Leistungsstärksten deployten nach Bedarf, oft mehrmals täglich, mit Durchlaufzeiten unter einer Stunde. Die genauen Faktoren schwanken von Jahr zu Jahr. Wichtiger als die Zahlen ist die Größenordnung der Unterschiede.

### Einordnung

Diese vier Kennzahlen sind heute als **DORA-Metriken** Standard in vielen Unternehmen und werden von Werkzeugen wie GitLab, Azure DevOps oder eigenen Dashboards automatisch erfasst. Die Autoren warnen allerdings: Wer die Kennzahlen zum Ziel macht statt zum Messinstrument, verfälscht sie, nach dem bekannten Gesetz von Goodhart.

## Das Forschungsmodell

Das Buch verbindet seine Ergebnisse zu einem Modell: Bestimmte Fähigkeiten sagen eine bessere Lieferleistung voraus, und die Lieferleistung sagt wiederum Unternehmenserfolg und Wohlbefinden der Mitarbeitenden voraus.

{{< bild src="bild-1.png" alt="vereinfachtes Forschungsmodell · Fähigkeiten, Lieferleistung, Wirkung" >}}

vereinfachtes Forschungsmodell · Fähigkeiten, Lieferleistung, Wirkung

### Lieferleistung und Unternehmenserfolg

Der vielleicht wichtigste Befund für Gespräche mit dem Management: Organisationen mit hoher Lieferleistung hatten laut den Daten eine etwa doppelt so hohe Wahrscheinlichkeit, ihre Ziele bei **Rentabilität, Marktanteil und Produktivität** zu übertreffen. Ein ähnlicher Zusammenhang zeigte sich für nichtkommerzielle Ziele wie Kundenzufriedenheit, Qualität und das Erreichen der eigenen Mission.

Damit ist Softwarelieferung kein reines IT-Thema, sondern ein Faktor für den Geschäftserfolg. Das stützt nachträglich McConnells Grundsatz, dass Qualität Kosten senkt, und Becks ökonomische Argumentation in Tidy First?.

### Vorhersage, nicht Beweis

Die Autoren sind vorsichtig mit Kausalität. Ihre Methode, Umfragen mit statistischer Modellierung, erlaubt Aussagen über **Vorhersage**: Wer Fähigkeit X hat, hat mit hoher Wahrscheinlichkeit auch bessere Lieferleistung. Die Autoren argumentieren, dass ihre Modelle mit theoretischer Begründung über reine Korrelation hinausgehen, beanspruchen aber keinen experimentellen Beweis. Dazu mehr im Abschnitt zur Methode.

### Wechselwirkungen

Das Modell ist keine Einbahnstraße. Continuous Delivery verbessert nicht nur die Lieferleistung, sondern auch die **Kultur**, und eine bessere Kultur fördert wiederum die Einführung technischer Praktiken. Gute technische Praktiken verringern Burnout und den Schmerz von Deployments, was wiederum Zufriedenheit und Bindung stärkt. Die Autoren betonen deshalb, dass man an mehreren Stellen gleichzeitig ansetzen kann und dass technische Praktiken ein guter Hebel für kulturellen Wandel sind.

## Technische Praktiken: Continuous Delivery

Continuous Delivery ist die Fähigkeit, Änderungen jeder Art, also Features, Konfiguration, Fehlerbehebungen, Experimente, **sicher, schnell und nachhaltig** in Produktion zu bringen. Das Buch zerlegt sie in eine Reihe einzelner Praktiken.

### Die Praktiken

| Praktik | Was die Daten zeigen |
|---|---|
| **Versionskontrolle** | Wichtig ist, dass nicht nur Code, sondern auch Konfiguration, Skripte und Infrastruktur versioniert sind. Gerade die Versionierung von Systemkonfiguration hing stark mit Lieferleistung zusammen. |
| **Deployment-Automatisierung** | vollständig automatisiert, ohne manuelle Schritte |
| **Continuous Integration** | häufig in den Hauptzweig integrieren, jeder Commit baut und testet automatisch |
| **Trunk-Based Development** | wenige aktive Branches, Branches mit kurzer Lebensdauer von höchstens etwa einem Tag, keine Code-Freezes |
| **Testautomatisierung** | zuverlässige automatisierte Tests, die Entwickler selbst schreiben und pflegen |
| **Testdatenverwaltung** | ausreichende Testdaten auf Anfrage verfügbar |
| **Sicherheit früh einbinden** | Sicherheitsprüfungen in den Entwicklungsprozess integriert statt am Ende |
| **Auslieferung auf Abruf** | jederzeit in Produktion auslieferbar |

### Zwei bemerkenswerte Befunde

**Trunk-Based Development:** Teams mit langen Feature-Branches hatten in den Daten schlechtere Lieferleistung. Das stützt Fowlers Warnung aus *Refactoring*, dass lange Branches Refactoring teuer machen, und Becks Rat aus Tidy First?, kleine Änderungen schnell zusammenzuführen.

**Wer die Tests schreibt:** Testautomatisierung wirkte dann, wenn **Entwickler** die automatisierten Akzeptanztests selbst schreiben und pflegen. Tests, die hauptsächlich von separaten QA-Abteilungen oder externen Dienstleistern stammten, zeigten keinen solchen Zusammenhang. Das bedeutet nicht, dass Tester überflüssig sind, sondern dass Entwickler Verantwortung für die Testbarkeit ihres Codes tragen müssen.

Dazu kommt: **Zuverlässigkeit** der Tests ist entscheidend. Tests, die zufällig fehlschlagen, untergraben das Vertrauen und werden ignoriert.

### Was Continuous Delivery bewirkt

Nach den Daten sagt Continuous Delivery nicht nur bessere Lieferleistung voraus, sondern auch:

- **niedrigere Änderungsfehlerraten**
- eine **generativere Kultur**
- weniger **Deployment-Schmerz**, also die Angst und den Aufwand vor Auslieferungen
- weniger **Burnout**
- stärkere **Identifikation** mit der Organisation
- weniger **ungeplante Arbeit und Nacharbeit**. Leistungsstarke Teams verbrachten einen größeren Teil ihrer Zeit mit neuer Arbeit statt mit Fehlerbehebung.

### Einordnung

Hier treffen die Bücher der Reihe auf Daten. Beck, Fowler und Feathers forderten Tests und kleine Schritte aus Erfahrung, McConnell begründete Qualität mit älteren Studien. Accelerate zeigt, dass diese Praktiken in großem Maßstab tatsächlich mit Leistung zusammenhängen. Auffällig ist, dass **nicht TDD** als Praktik gemessen wurde, sondern Testautomatisierung allgemein. Für die Debatte aus der Beck-Zusammenfassung heißt das: Die Daten stützen automatisierte, von Entwicklern gepflegte Tests, sagen aber nichts darüber, ob sie vor oder nach dem Code entstehen müssen.

## Architektur

Welche Art von System ein Team betreut, ist laut den Daten **kaum entscheidend**. Ob neu entwickelte Systeme, Altsysteme, Mainframes, eingebettete Software oder Systeme von Drittanbietern: Leistungsstarke Teams gab es überall. Entscheidend waren bestimmte **Eigenschaften** der Architektur, nicht die Technologie.

### Was zählt: lose Kopplung

Die stärksten Prädiktoren für Lieferleistung waren, ob Teams:

- **ihre Systeme selbstständig testen** können, ohne eine aufwändige integrierte Testumgebung,
- **unabhängig ausliefern** können, ohne Koordination mit anderen Teams,
- **große Änderungen am Design** vornehmen können, ohne Erlaubnis von außerhalb des Teams,
- und ihre Arbeit erledigen können, **ohne ständig mit anderen Teams zu kommunizieren**.

Diese Eigenschaften nennen die Autoren **lose gekoppelte Architektur** und betonen, dass es dabei ebenso um Teams wie um Code geht. Das ist Conways Gesetz in Daten: Eine Architektur, die Teams voneinander unabhängig macht, ermöglicht unabhängige, schnelle Lieferung.

Die Autoren verweisen auf das **„umgekehrte Conway-Manöver“**: Teams und Organisation so zuschneiden, dass die gewünschte Architektur entsteht. Genau diese Idee hat *Team Topologies* ein Jahr später ausgearbeitet.

### Microservices sind kein Ziel

Die Autoren warnen ausdrücklich davor, aus dem Ergebnis „Microservices“ zu machen. Ein Monolith, dessen Module unabhängig getestet und ausgeliefert werden können, erfüllt die Kriterien; ein System aus Dutzenden Diensten, die nur gemeinsam funktionieren, erfüllt sie nicht. Es geht um **Testbarkeit und Auslieferbarkeit**, nicht um die Anzahl der Prozesse. Das entspricht der Ernüchterung nach dem Microservices-Boom, die in der DDD-Zusammenfassung beschrieben ist.

### Werkzeuge selbst wählen

Teams, die ihre Werkzeuge selbst auswählen durften, zeigten eine bessere Lieferleistung. Die Autoren schließen daraus nicht, dass jede Standardisierung schlecht ist, sondern dass Standards aus der Praxis der Teams entstehen und begründet sein sollten, statt von oben vorgegeben zu werden.

## Sicherheit

Sicherheit wird in vielen Organisationen am Ende geprüft, von einem separaten Team, oft kurz vor der Auslieferung. Accelerate fand, dass leistungsstarke Teams Sicherheit **in den Entwicklungsprozess integrieren**: Sicherheitsexperten wirken bei Design und Reviews mit, Sicherheitstests laufen automatisiert in der Pipeline, und Teams nutzen vorab geprüfte Bibliotheken und Werkzeuge.

Das Ergebnis: Diese Teams verbrachten in den Daten deutlich weniger Zeit damit, Sicherheitsprobleme nachträglich zu beheben, nach den Zahlen des Buchs etwa die Hälfte. Sicherheit wird damit vom Engpass zur eingebauten Eigenschaft, so wie Qualität durch Testautomatisierung.

### Einordnung

Der Architekturteil ist die vielleicht stärkste Verbindung zu den anderen Büchern: Ousterhouts tiefe Module, Evans' Bounded Contexts, Becks Kopplung relativ zur Änderung und Feathers' Seams beschreiben alle Wege, Systeme so zu schneiden, dass sich Teile unabhängig ändern, testen und ausliefern lassen. Accelerate liefert die Daten, dass genau das mit Leistung zusammenhängt.

## Lean Management

Die Autoren übertragen Ideen aus Lean Manufacturing und dem Toyota-Produktionssystem auf Softwareentwicklung und prüfen, welche davon mit Leistung zusammenhängen.

| Praktik | Befund |
|---|---|
| **WIP begrenzen** | Die Menge parallel laufender Arbeit begrenzen. Allein wirkte das in den Daten nicht stark, wohl aber in Kombination mit den folgenden Praktiken. |
| **Visuelles Management** | Arbeit, Qualität und Fortschritt für alle sichtbar machen, etwa auf Boards oder Dashboards |
| **Rückmeldung aus der Produktion** | Überwachungsdaten aus Anwendung und Infrastruktur für Entscheidungen nutzen |
| **Leichtgewichtige Änderungsgenehmigung** | Änderungen durch Kollegen prüfen lassen statt durch externe Gremien |

### Der Befund zu Change Advisory Boards

Eines der meistzitierten Ergebnisse: **Externe Genehmigungsgremien**, oft Change Advisory Board oder kurz CAB genannt, hingen in den Daten mit schlechterer Durchlaufzeit, seltenerer Auslieferung und langsamerer Wiederherstellung zusammen, und **nicht** mit einer niedrigeren Änderungsfehlerrate. Sie machten die Lieferung also langsamer, ohne sie sicherer zu machen. Die Autoren bewerten das so, dass ein solches Gremium schlechter abschnitt als gar kein formaler Genehmigungsprozess.

Besser wirkten **Peer Reviews** innerhalb des Teams, etwa per Paarprogrammierung oder Code-Review, kombiniert mit automatisierten Tests und Prüfungen in der Pipeline. Das ist dieselbe Logik wie bei Beck in Tidy First?: Wenn Reviews billig und nah am Team sind, werden kleine Änderungen möglich, und kleine Änderungen sind sicherer.

## Lean Produktentwicklung

Auch die Art, wie Produkte entwickelt werden, hängt mit Leistung zusammen, und zwar in beide Richtungen: Lean Produktentwicklung verbessert die Lieferleistung, und gute Lieferleistung macht Lean Produktentwicklung erst möglich.

| Praktik | Bedeutung |
|---|---|
| **Kleine Batches** | Arbeit in Stücke zerlegen, die in weniger als einer Woche fertig und auslieferbar sind |
| **Fluss sichtbar machen** | Den Weg einer Idee vom Geschäft bis zum Kunden für das Team sichtbar machen |
| **Kundenfeedback** | Rückmeldungen von Kunden aktiv einholen und in das Produkt einarbeiten |
| **Experimentieren im Team** | Teams dürfen Anforderungen während der Entwicklung ändern, ohne externe Genehmigung |

Der letzte Punkt ist bemerkenswert: Teams, die selbst neue Ideen ausprobieren und Spezifikationen anpassen durften, schnitten besser ab. Das ist ein Argument gegen Organisationen, in denen ein Produktbereich festlegt und die Entwicklung nur umsetzt.

### Einordnung

Das Kapitel verbindet die Reihe mit der Organisationsebene. Thomas und Hunt mit „Gut genug“ und Nutzerfeedback, McConnell mit Projektgröße und Becks kleine Batches finden hier ihre Bestätigung. Die CAB-Ergebnisse gehören zu den praktisch folgenreichsten des Buchs, weil sie in regulierten Branchen wie Banken und Versicherungen direkt gegen verbreitete Prozesse sprechen.

## Kultur

„Kultur“ ist schwer zu messen. Accelerate nutzt dafür ein Modell des Soziologen **Ron Westrum**, der Organisationskulturen ursprünglich im Gesundheitswesen und in der Luftfahrt untersucht hat. Westrum unterscheidet drei Typen danach, wie Informationen fließen.

| Merkmal | Pathologisch (machtorientiert) | Bürokratisch (regelorientiert) | Generativ (leistungsorientiert) |
|---|---|---|---|
| Zusammenarbeit | gering | mäßig | hoch |
| Überbringer schlechter Nachrichten | werden bestraft | werden vernachlässigt | werden geschult |
| Verantwortung | wird gemieden | wird eng abgegrenzt | wird geteilt |
| Brücken zwischen Bereichen | werden verhindert | werden geduldet | werden gefördert |
| Fehler | führen zur Suche nach Schuldigen | führen zu Strafen oder neuen Regeln | führen zu Untersuchung und Lernen |
| Neues | wird unterdrückt | führt zu Problemen | wird umgesetzt |

Die Daten zeigen: Eine **generative Kultur** sagt bessere Lieferleistung und besseren Unternehmenserfolg voraus. Und umgekehrt: Technische Praktiken wie Continuous Delivery und Lean Management fördern eine generative Kultur. Man muss Kultur also nicht direkt „ändern“, sondern kann über Praktiken an ihr arbeiten.

Das Kapitel verweist auch auf Googles Untersuchung zu erfolgreichen Teams, nach der **psychologische Sicherheit** der wichtigste Faktor war: Teammitglieder können Risiken eingehen und Fehler zugeben, ohne Nachteile befürchten zu müssen.

## Burnout und nachhaltige Arbeit

**Deployment-Schmerz**, also die Angst, der Aufwand und die Störungen bei Auslieferungen, hing in den Daten mit schlechterer Lieferleistung, schlechterer Kultur und mehr Burnout zusammen. Wo Deployments schmerzhaft sind, sind auch Lieferleistung und Kultur schlecht.

Burnout ließ sich durch dieselben Fähigkeiten verringern, die auch die Leistung verbessern: Continuous Delivery, Lean Management, eine gute Kultur und Führung, die Mitarbeitende unterstützt. Die Autoren betonen, dass Burnout ein Problem der **Organisation** ist, nicht der einzelnen Person, und dass Verbesserungen dort ansetzen müssen.

## Zufriedenheit und Identifikation

Mitarbeitende in leistungsstarken Organisationen empfahlen ihren Arbeitgeber deutlich häufiger weiter. Die Autoren messen das mit dem Employee Net Promoter Score. Zufriedenheit hing mit der Identifikation mit der Organisation zusammen, und beides mit den bekannten Fähigkeiten. Das Buch geht auch auf Vielfalt ein und stellt fest, dass Frauen in den Befragungen stark unterrepräsentiert waren, und verweist auf Forschung, nach der vielfältige Teams bessere Ergebnisse erzielen.

## Führung

Die Autoren messen **transformationale Führung** mit fünf Merkmalen:

1. **Vision:** eine klare Vorstellung, wohin die Organisation will
2. **Inspirierende Kommunikation:** motivieren und Zuversicht vermitteln
3. **Intellektuelle Anregung:** Mitarbeitende herausfordern, Probleme neu zu denken
4. **Unterstützende Führung:** Rücksicht auf Bedürfnisse und Gefühle
5. **Persönliche Anerkennung:** Leistungen wahrnehmen und würdigen

Teams mit Führungskräften, die bei diesen Merkmalen am schwächsten abschnitten, waren deutlich seltener leistungsstark. Gleichzeitig betonen die Autoren: Führung allein reicht nicht. Sie wirkt vor allem dadurch, dass sie die technischen und organisatorischen Fähigkeiten ermöglicht, also Zeit für Verbesserung schafft, Experimente erlaubt und Hindernisse beseitigt.

### Einordnung

Thomas und Hunt sprachen von Verantwortung und zerbrochenen Fenstern, Beck von Angst und Zuversicht, McConnell von Charakter und Arbeitsumgebung. Accelerate macht aus diesen Erfahrungen messbare Größen und zeigt, dass sie nicht weich, sondern leistungsrelevant sind.

## Die Forschungsmethode (Teil II)

Der zweite Teil ist ungewöhnlich für ein Praxisbuch: Er erklärt, wie die Ergebnisse zustande kamen und warum man ihnen trauen kann. Für Leser, die McConnells Empirie schätzen, ist das der vielleicht interessanteste Teil.

### Warum Umfragen?

Die naheliegende Frage: Warum nicht Systemdaten aus Versionskontrolle und Pipelines nutzen? Die Autoren nennen mehrere Gründe:

- **Vergleichbarkeit:** Systemdaten verschiedener Organisationen sind in unterschiedlichen Werkzeugen und Formaten gespeichert und kaum vergleichbar.
- **Vollständigkeit:** Viele relevante Dinge, etwa Kultur, Burnout oder Führung, lassen sich nur durch Befragung messen.
- **Systemgrenzen:** Systemdaten zeigen nur, was durch Werkzeuge läuft. Manuelle Schritte, Wartezeiten und Abstimmungen fehlen.
- **Ehrlichkeit:** Lügen ist in gut gestalteten Umfragen schwerer, als man denkt. Psychometrische Verfahren erkennen inkonsistente Antworten, und bei großen Stichproben gleichen sich Verzerrungen teilweise aus.

### Latente Konstrukte

Viele interessante Größen lassen sich nicht direkt messen, etwa Kultur oder Burnout. Die Autoren messen sie als **latente Konstrukte**: über mehrere Fragen, die jeweils einen Aspekt erfassen, meist auf einer Zustimmungsskala. Mit statistischen Verfahren prüfen sie dann:

| Eigenschaft | Frage |
|---|---|
| Validität | Messen die Fragen wirklich das, was sie messen sollen? |
| Konvergente Validität | Hängen Fragen zum selben Konstrukt eng zusammen? |
| Diskriminante Validität | Unterscheiden sich Konstrukte, die verschieden sein sollen, auch in den Daten? |
| Reliabilität | Liefern die Fragen konsistente Ergebnisse? |

Nur Konstrukte, die diese Prüfungen bestehen, gehen in die Analyse ein.

### Von Korrelation zu Vorhersage

Die Autoren nutzen **inferenzielle, vorhersagende Analyse**: Sie stellen Hypothesen auf Basis bestehender Theorien auf, etwa aus Lean Manufacturing oder Organisationsforschung, und prüfen sie mit statistischen Modellen wie Strukturgleichungsmodellen. Das ist mehr als bloße Korrelation, weil die Richtung der Zusammenhänge theoretisch begründet ist, aber weniger als ein kontrolliertes Experiment, das echte Kausalität zeigen könnte.

### Die Stichprobe

Die Teilnehmenden wurden über **Schneeballverfahren** gewonnen: Einladungen über Newsletter, soziale Medien, Konferenzen und Weiterleitungen. Die Autoren begründen das damit, dass es keine vollständige Liste aller Softwareteams gibt, aus der man zufällig ziehen könnte. Sie räumen ein, dass das zu Verzerrungen führen kann, etwa zu einer Überrepräsentation von Organisationen, die sich bereits mit DevOps beschäftigen.

### Einordnung

Die Methode ist sorgfältiger als fast alles, was die Softwarebranche sonst an Belegen hat. Sie hat aber Grenzen, die im Kritikteil wieder auftauchen: Selbstauskunft, nicht zufällige Stichprobe und fehlende Experimente. Im Vergleich zu McConnells meist kleinen Studien aus den 1980er Jahren ist es ein großer Fortschritt; im Vergleich zu medizinischer Forschung ist es ein Anfang.

## Die 24 Fähigkeiten

Im Anhang fassen die Autoren alle Fähigkeiten zusammen, die in ihren Daten eine bessere Lieferleistung vorhersagen. Sie sind in fünf Gruppen geordnet.

| Gruppe | Fähigkeiten |
|---|---|
| **Continuous Delivery** (8) | Versionskontrolle für alle Artefakte · Deployment-Automatisierung · Continuous Integration · Trunk-Based Development · Testautomatisierung · Testdatenverwaltung · Sicherheit früh einbinden · Continuous Delivery als Gesamtfähigkeit |
| **Architektur** (2) | Lose gekoppelte Architektur · Teams wählen ihre Werkzeuge selbst |
| **Produkt und Prozess** (4) | Kundenfeedback einholen · Wertstrom sichtbar machen · in kleinen Batches arbeiten · Experimentieren im Team |
| **Lean Management und Monitoring** (5) | Leichtgewichtige Änderungsgenehmigung · Monitoring · proaktive Benachrichtigung bei Problemen · WIP begrenzen · Arbeit sichtbar machen |
| **Kultur** (5) | Generative Kultur nach Westrum · Lernen fördern · Zusammenarbeit zwischen Teams · Arbeitszufriedenheit · transformationale Führung |

### Wie man die Liste nutzt

Die Autoren warnen davor, alle 24 gleichzeitig angehen zu wollen. Ihr Vorschlag:

1. Die aktuelle Lieferleistung mit den vier Kennzahlen messen.
2. Herausfinden, welche Fähigkeiten im eigenen Kontext am schwächsten sind und am meisten bremsen.
3. Gezielt an diesen wenigen arbeiten.
4. Erneut messen.

Das ist im Kern ein Verbesserungszyklus wie in Lean und Kanban, und es ist dieselbe Haltung wie Becks „erst, danach, später oder nie“: nicht alles verbessern, sondern das, was gerade am meisten bringt.

### Bezüge zur Reihe

Viele der Fähigkeiten haben in den bisherigen Büchern einen Vorläufer:

| Fähigkeit | Wo sie in der Reihe vorkommt |
|---|---|
| Testautomatisierung | Beck, Fowler, Feathers, Thomas und Hunt |
| Continuous Integration | McConnell mit dem täglichen Build, Thomas und Hunt mit dem Starter-Kit |
| Trunk-Based Development | Fowler: lange Branches behindern Refactoring |
| Lose gekoppelte Architektur | Ousterhout, Evans, Beck in Tidy First? |
| Kleine Batches | Beck: kleine PRs; Thomas und Hunt: nicht schneller als die Scheinwerfer |
| Kundenfeedback | Thomas und Hunt: Anforderungsschleife; Evans: Knowledge Crunching |
| Generative Kultur | Thomas und Hunt: Verantwortung statt Ausreden; Beck: Angst abbauen |

## Nach dem Buch: DORA bis heute

Das Buch ist eine Momentaufnahme der Daten bis 2017. Die Forschung lief weiter, seit 2018 unter dem Dach von Google Cloud, und hat einige Ergebnisse verfeinert, einige relativiert und mit KI ein ganz neues Feld aufgenommen.

| Jahr | Entwicklung |
|---|---|
| 2018 | Google Cloud übernimmt DORA. Die jährlichen Berichte erscheinen seitdem dort. |
| 2018–2023 | Die vier Kennzahlen werden zum Branchenstandard. Die Wiederherstellungszeit wird später in **„Failed Deployment Recovery Time“** umbenannt, weil der alte Begriff MTTR mehrdeutig war. |
| 2024 | Neue Kennzahl **Rework Rate**: Wie viele ungeplante Deployments sind nötig, um Fehler zu beheben, die Nutzer bemerkt haben? Zusammen mit der Änderungsfehlerrate bildet sie die Stabilität. Die Wiederherstellungszeit wird der Durchsatzseite zugeordnet. Der Bericht findet Gruppen, in denen Durchsatz und Stabilität nicht mehr gemeinsam steigen, und erste, überraschend negative Effekte von KI auf die Lieferleistung. |
| 2025 | Der Bericht heißt nun **State of AI-assisted Software Development**. Die bisherigen Leistungsstufen werden durch **sieben Team-Archetypen** ersetzt. KI gilt als **Verstärker** bestehender Stärken und Schwächen. |

### Die KI-Befunde

**2024:** Der Bericht schätzte, dass ein höherer Grad der KI-Nutzung mit leicht sinkendem Durchsatz und deutlich sinkender Stabilität einherging. Als mögliche Ursache wurde vermutet, dass KI zu größeren Änderungen führt, und große Batches sind genau das, was Accelerate als riskant beschreibt.

**2025:** Die Befragung von knapp 5.000 Fachleuten ergab, dass rund 90 Prozent KI bei der Arbeit nutzen. Neu war, dass KI-Nutzung nun mit **höherem Durchsatz** zusammenhing, eine Umkehr gegenüber dem Vorjahr. Die Stabilität blieb dagegen ein Problem: mehr Fehlschläge und Nacharbeit. Die zentrale Botschaft: KI beschleunigt die Entwicklung, macht aber Schwächen weiter hinten im Prozess sichtbar. Teams mit **lose gekoppelter Architektur und schnellen Rückkopplungsschleifen** profitierten, Teams mit eng gekoppelten Systemen und langsamen Prozessen kaum.

Dazu kam ein **AI Capabilities Model** mit sieben technischen und kulturellen Fähigkeiten, die den Nutzen von KI erhöhen sollen.

### Was das für das Buch heißt

Die Kernaussagen von Accelerate haben sich eher bestätigt als widerlegt: Lose Kopplung, schnelles Feedback, kleine Batches und gute Testautomatisierung erweisen sich auch im KI-Zeitalter als entscheidend, vielleicht sogar mehr als vorher. Die ursprüngliche These, dass Tempo und Stabilität immer gemeinsam steigen, gilt dagegen nicht mehr uneingeschränkt.

Ob bereits ein Bericht für 2026 erschienen ist, konnte ich nicht feststellen.

Quellen: [Google Cloud zum DORA-Bericht 2025](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) · [Google Blog zum DORA-Bericht 2025](https://blog.google/technology/developers/dora-report-2025/) · [DORA-Bericht 2024 (PDF)](https://services.google.com/fh/files/misc/2024_final_dora_report.pdf) · [RedMonk zum DORA-Bericht 2024](https://redmonk.com/rstephens/2024/11/26/dora2024/)

## Kritik und Einordnung

Accelerate ist eines der einflussreichsten Bücher über Softwareentwicklung der letzten zehn Jahre. Gerade weil es mit Daten argumentiert, verdient seine Methode einen kritischen Blick.

### Stärken

- **Daten statt Meinung:** Als einziges Buch der Reihe stützt es seine Thesen auf eine große, systematische Datenbasis.
- **Methodische Transparenz:** Ein ganzer Teil erklärt, wie die Ergebnisse zustande kamen und wo ihre Grenzen liegen.
- **Messbarkeit:** Die vier Kennzahlen sind einfach, gut erfassbar und haben sich als Standard durchgesetzt.
- **Tempo und Stabilität:** Die These, dass man nicht zwischen Geschwindigkeit und Sicherheit wählen muss, hat viele Organisationen verändert.
- **Brücke zum Management:** Der Zusammenhang mit Unternehmenserfolg macht technische Praktiken zu einem Geschäftsthema.
- **Kurz und konkret:** Der Hauptteil ist in wenigen Stunden gelesen, die 24 Fähigkeiten sind direkt verwendbar.

### Kritikpunkte

**1. Selbstauskunft.** Fast alle Daten beruhen auf Antworten der Befragten, auch die Lieferleistung und der Unternehmenserfolg. Wer bei seiner Organisation eine gute Kultur wahrnimmt, schätzt vielleicht auch ihren Erfolg positiver ein. Die psychometrischen Prüfungen mildern das, beseitigen es aber nicht.

**2. Keine Zufallsstichprobe.** Das Schneeballverfahren erreicht vor allem Menschen, die sich ohnehin mit DevOps beschäftigen. Organisationen, die davon nichts wissen oder wissen wollen, sind unterrepräsentiert. Das kann Zusammenhänge verstärken.

**3. Korrelation und Kausalität.** Die Autoren sprechen vorsichtig von Vorhersage, in der Rezeption wird daraus oft „Continuous Delivery verursacht Erfolg“. Es könnte ebenso sein, dass erfolgreiche Unternehmen mehr Geld und Freiraum für gute Praktiken haben.

**4. Nähe zur Beratungs- und Werkzeugindustrie.** Die State-of-DevOps-Berichte wurden von Anbietern wie Puppet und später Google Cloud finanziert, und die Autoren sind Teil der DevOps-Bewegung. Das macht die Ergebnisse nicht falsch, ist aber ein Grund für unabhängige Prüfung.

**5. Lieferung ist nicht Wert.** Die vier Kennzahlen messen, wie gut ein Team ausliefert, nicht ob es das Richtige ausliefert. Ein Team kann das falsche Produkt sehr effizient liefern. Spätere DORA-Berichte haben deshalb Nutzerorientierung und Produktleistung stärker einbezogen.

**6. Missbrauch der Kennzahlen.** In vielen Organisationen wurden die DORA-Metriken zu Zielvorgaben, Ranglisten zwischen Teams oder Bonuskriterien. Das verfälscht sie, wovor die Autoren selbst gewarnt haben.

**7. Die Zeit ist weitergegangen.** Die Befunde zu Tempo und Stabilität haben sich in späteren Jahren differenziert, und KI hat neue Fragen aufgeworfen, wie der vorige Abschnitt zeigt.

### Gesamturteil

Accelerate ist das Buch, das man einem Manager in die Hand drückt, der fragt, warum Investitionen in Automatisierung, Tests und Architektur sich lohnen. Es ist kein Beweis im strengen wissenschaftlichen Sinn, aber die beste verfügbare Evidenz in einem Feld, das sonst fast nur aus Erfahrungsberichten besteht. Für unsere Reihe ist es der Prüfstein, an dem sich zeigt, welche Ratschläge der anderen Bücher sich in großem Maßstab bewähren.

## Was die Daten über die Reihe sagen

Accelerate misst nicht Codequalität im Sinne von Martin oder Ousterhout, sondern Praktiken auf Team- und Organisationsebene. Trotzdem lässt sich für viele Ratschläge der Reihe sagen, ob die Daten sie stützen.

| Ratschlag | Herkunft in der Reihe | Was Accelerate sagt |
|---|---|---|
| Automatisierte Tests | Beck, Fowler, Feathers, Thomas und Hunt | **gestützt**, wenn Entwickler sie selbst pflegen und sie zuverlässig sind |
| Test zuerst | Beck, Martin | **nicht gemessen**; die Daten sagen nichts über die Reihenfolge |
| Kleine Schritte und Batches | Beck, Fowler, Thomas und Hunt | **gestützt** |
| Kurze Branches, häufig integrieren | Fowler, McConnell (täglicher Build) | **gestützt** durch Trunk-Based Development |
| Lose Kopplung | Ousterhout, Evans, Beck in Tidy First? | **stark gestützt**, auf Ebene von Teams und Auslieferbarkeit |
| Teams nach Fachlichkeit schneiden | Evans, Thomas und Hunt | **gestützt** über lose Kopplung und Teamautonomie |
| Reviews | McConnell: formale Inspektionen | **teilweise**: Peer Reviews ja, externe Genehmigungsgremien nein |
| Qualität spart Zeit | McConnell, Fowler (Design Stamina) | **gestützt**: Tempo und Stabilität steigen gemeinsam |
| Kultur, Verantwortung, Angst abbauen | Thomas und Hunt, Beck | **gestützt** über Westrum-Kultur und Burnout-Befunde |
| Konkrete Codestil-Regeln | Martin, Bloch, McConnell | **nicht gemessen** |

Das Muster ist auffällig: Die Ratschläge, die sich auf **Rückkopplung, Kopplung und Batch-Größe** beziehen, werden durch die Daten gestützt. Die Ratschläge, die sich auf **Stil auf Codeebene** beziehen, liegen außerhalb dessen, was Accelerate misst. Das heißt nicht, dass sie falsch sind, aber die Belege für sie bleiben Erfahrung.

## Diskussionsfragen

1. **Eure Kennzahlen:** Kennst du die vier Kennzahlen für dein aktuelles Projekt? Wo liegt ihr ungefähr?
2. **Tempo gegen Stabilität:** Erlebst du in deiner Organisation noch die Haltung, dass seltene, große Releases sicherer sind? Wie ließe sie sich widerlegen?
3. **Change Advisory Boards:** Gibt es bei euch externe Genehmigungsprozesse? Welche Funktion haben sie wirklich, etwa Regulierung, Absicherung, Kontrolle?
4. **Wer testet:** Wie viel der Testautomatisierung liegt bei euch bei Entwicklern, wie viel bei QA? Passt das zu den Befunden?
5. **Kultur nach Westrum:** Wo würdest du deine Organisation einordnen: pathologisch, bürokratisch oder generativ?
6. **Missbrauch der Kennzahlen:** Hast du erlebt, dass Kennzahlen wie Velocity oder DORA-Metriken zur Zielvorgabe wurden? Mit welchen Folgen?
7. **KI als Verstärker:** Passt die These aus dem DORA-Bericht 2025, dass KI Stärken und Schwächen verstärkt, zu deiner Erfahrung?
8. **Nächstes Buch:** Nach so viel Organisation wäre *Designing Data-Intensive Applications* ein großer Sprung zurück zur Technik, oder *Team Topologies* als direkte Fortsetzung. Was reizt dich mehr?
