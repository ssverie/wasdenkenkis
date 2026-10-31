+++
title = "Facilitating Software Architecture – Zusammenfassung und Einordnung"
description = "Andrew Harmel-Law, Facilitating Software Architecture: Empowering Teams to Make Architectural Decisions (2024)"
date = 2026-10-31T11:37:39+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern, Reihe der acht Soft-Skill-Bücher, Teil 3 von 8"
buecher = ["facilitating-software-architecture-2024"]
+++

## Einleitung

Hohpe beschreibt den Architekten als Übersetzer zwischen den Etagen, Reilly die technische Führung ohne Personalverantwortung. Harmel-Law geht einen Schritt weiter und stellt eine Frage, die in den anderen Architekturbüchern der Reihe kaum gestellt wird: **Wer trifft eigentlich die Architekturentscheidungen?** Die Antwort des Buchs: im Prinzip **jeder**, der von einer Entscheidung betroffen ist und sie umsetzen muss, solange er vorher Rat einholt.

### Autor und Kontext

Andrew Harmel-Law ist Principal bei ThoughtWorks, mit Schwerpunkten in agiler Lieferung, Domain-Driven Design und Automatisierung. Die Grundidee wurde 2021 in einem Artikel auf Martin Fowlers Website bekannt, *Scaling the Practice of Architecture, Conversationally*. Das Buch erschien Ende 2024 bei O'Reilly und umfasst rund 500 Seiten.

### Die Kernthese

Klassische Architekturpraxis setzt auf wenige Architekten, die entscheiden, und Gremien, die freigeben. Das funktionierte, solange Systeme langsam wuchsen und Teams auf Vorgaben warteten. Heute, mit vielen autonomen Teams und häufigen Auslieferungen, werden zentrale Architekten zum **Engpass**: Entweder warten Teams auf Entscheidungen, oder sie entscheiden ohne Architektur.

Harmel-Laws Lösung ist nicht **weniger** Architektur, sondern **mehr**, verteilt auf mehr Köpfe. Das zentrale Werkzeug ist der **Architecture Advice Process**: Jeder darf eine Architekturentscheidung treffen, wenn er vorher Rat einholt. Architekten werden von Entscheidern zu **Moderatoren**, die gute Entscheidungen ermöglichen.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Grundprinzipien | warum klassische Architekturpraxis schwierig geworden ist; was eine Architekturentscheidung ist; Entscheidungsverfahren im Vergleich; der Advice Process; Einführung; ADRs |
| II. Eine Kultur verteilten Vertrauens pflegen | wie sich Macht und Steuerung verschieben; das Advice Forum; weitere unterstützende Elemente |
| III. Praktiken | weitere Werkzeuge, die Entscheidungen verbessern, bis hin zu technischen Spikes |
| IV. Das Soziale | Übergang von Macht und Verantwortung, psychologische Sicherheit, Führung |

Das Buch ist ausführlich und verbindet konkrete Praktiken mit Überlegungen zu Kultur, Vertrauen und Macht.

## Warum klassische Architekturpraxis nicht mehr passt

### Eine stille Revolution

Harmel-Law beschreibt im ersten Kapitel eine Veränderung, die viele erleben, ohne sie zu benennen: Mit agilen Methoden, Continuous Delivery, Cloud und autonomen Teams hat sich verschoben, **wo** Entscheidungen fallen. Teams entscheiden täglich über Dinge, die Architektur sind: Datenhaltung, Schnittstellen, Abhängigkeiten, Werkzeuge. Die formale Architekturpraxis mit Gremien und Freigaben hat sich aber nicht angepasst. Das Ergebnis: Architekten fühlen sich übergangen, Teams fühlen sich ausgebremst, und viele wichtige Entscheidungen werden gar nicht als solche erkannt.

### Was eine Architekturentscheidung ist

Nicht jede Entscheidung ist eine Architekturentscheidung. Harmel-Law greift die verbreitete Sicht auf, dass Architektur die **bedeutsamen** Entwurfsentscheidungen umfasst, also solche, deren spätere Änderung teuer wäre. Bedeutsam wird eine Entscheidung etwa, wenn sie:

- die Struktur oder wichtige Eigenschaften eines Systems prägt,
- mehrere Teams oder Systeme betrifft,
- schwer rückgängig zu machen ist,
- viel Geld oder Zeit bindet.

Das deckt sich mit der Definition von Richards und Ford: Struktur, Merkmale, Abhängigkeiten, Schnittstellen, Bautechniken.

### Entscheidungsverfahren im Vergleich

Bevor er seine Lösung vorstellt, vergleicht Harmel-Law gängige Arten, in Gruppen zu entscheiden. Vereinfacht nach zwei Kriterien, die heute zählen: Wird **dezentral** entschieden, und kommt die Rückmeldung **schnell**?

| Verfahren | Wie entschieden wird | Dezentral | Schnell |
|---|---|---|---|
| **Allein von oben** | ein Architekt oder Gremium entscheidet | nein | ja, bis der Engpass entsteht |
| **Delegation** | eine Person oder Gruppe erhält die Befugnis | teilweise | ja |
| **Beratend** | der Entscheider fragt viele, entscheidet dann selbst | nein | mittel |
| **Zustimmung** | entschieden ist, wenn niemand einen schwerwiegenden Einwand hat | ja | mittel |
| **Konsens** | alle müssen einverstanden sein | ja | nein |
| **Abstimmung** | die Mehrheit entscheidet | ja | mittel; Minderheiten verlieren |

Keines der klassischen Verfahren erfüllt beide Anforderungen gleichzeitig. Daraus leitet er ab, was ein modernes Verfahren leisten muss: die **richtigen Menschen** beteiligen, jedem das **Recht** geben, eine Entscheidung anzustoßen, auf **Vertrauen** statt Kontrolle setzen und den Aufwand der **Mitteilung** gering halten.

### Einordnung

Das ist Team Topologies' Forderung nach Teamautonomie und Accelerates Befund, dass Teams, die ohne externe Freigabe entscheiden und ausliefern können, besser abschneiden, angewandt auf Architekturentscheidungen.

## Der Architecture Advice Process

### Die Regel

Der Kern des Buchs passt, wie Harmel-Law selbst sagt, auf eine Folie: **Jeder darf jede Architekturentscheidung treffen, wenn er vorher Rat einholt**, und zwar bei zwei Gruppen:

1. bei allen, die von der Entscheidung **maßgeblich betroffen** sind,
2. bei Menschen mit **Fachwissen** auf dem betreffenden Gebiet.

{{< bild src="bild-1.png" alt="der Architecture Advice Process, vereinfacht dargestellt" >}}

der Architecture Advice Process, vereinfacht dargestellt

### Herkunft

Der Advice Process stammt nicht aus der Softwareentwicklung. Dennis Bakke führte ihn im Energiekonzern AES ein und beschrieb ihn in *Joy at Work*; bekannt wurde er durch Frederic Laloux' *Reinventing Organizations*, das Organisationen mit verteilter Verantwortung untersucht. Harmel-Law überträgt ihn auf Architekturentscheidungen.

### Der soziale Vertrag

Die Regel funktioniert nur mit einem klaren Verständnis der Rollen:

| Rolle | Pflichten |
|---|---|
| **Entscheider** | Rat ernsthaft einholen und erwägen; die Entscheidung treffen und dafür verantwortlich sein; die Entscheidung und den Rat dokumentieren |
| **Ratgebende** | ehrlich und rechtzeitig raten, auch wenn der Rat unbequem ist; akzeptieren, dass der Rat nicht befolgt werden muss |
| **Architekten** | Rat geben, Entscheider unterstützen, Zusammenhänge sichtbar machen, das Verfahren pflegen |

Der wichtigste Punkt: **Rat ist kein Veto.** Der Entscheider muss den Rat einholen und ernst nehmen, aber nicht befolgen. Dafür trägt er die Verantwortung. Das unterscheidet den Advice Process von Konsens und Freigabe.

### Was er leistet

| Anforderung | Wie der Advice Process sie erfüllt |
|---|---|
| Die richtigen Menschen beteiligen | Betroffene und Fachleute, nicht alle und nicht nur Architekten |
| Recht, Entscheidungen anzustoßen | jeder, der die Notwendigkeit sieht |
| Vertrauen | Entscheider und Ratgebende vertrauen einander, statt sich zu kontrollieren |
| Geringer Mitteilungsaufwand | wer betroffen ist, wurde ohnehin gefragt |

### Was sich für Architekten ändert

Architekten verlieren nicht an Bedeutung, aber ihre Rolle wandelt sich: vom Entscheider zum **Ratgeber und Moderator**. Sie bringen Erfahrung ein, weisen auf Folgen hin, die das Team übersieht, und sorgen dafür, dass Entscheidungen zusammenpassen. Das ist Hohpes Gärtner und Reillys Staff Engineer, der andere stärkt, als festgelegtes Verfahren.

## Einführung und ADRs

### Den Advice Process einführen

Harmel-Law beschreibt die Einführung als Veränderung, die Mut auf mehreren Seiten verlangt. Sinngemäß:

| Was es braucht | Warum |
|---|---|
| **Jemanden, der Kontrolle abgibt** | Meist ein leitender Architekt oder CTO, der ausdrücklich erklärt, dass Teams nun entscheiden dürfen |
| **Ein Mindestmaß an Vertrauen** | Ohne Vertrauen werden Entscheidungen weiter nach oben getragen |
| **Einen Ort für Entscheidungen** | Meist ADRs in einem gemeinsamen Repository oder Wiki |
| **Einen Anfang** | Ein Team, ein Bereich oder eine Art von Entscheidung als Pilot |

### Typische Bedenken

| Bedenken | Harmel-Laws Antwort, sinngemäß |
|---|---|
| „Dann macht jeder, was er will.“ | Nein: Jeder muss Rat einholen und seine Entscheidung offenlegen. Das ist transparenter als viele klassische Prozesse. |
| „Teams treffen schlechte Entscheidungen.“ | Teams treffen ohnehin Entscheidungen; der Advice Process sorgt dafür, dass sie dabei Rat bekommen. |
| „Architekten werden überflüssig.“ | Ihre Rolle ändert sich zum Ratgeber, Lehrer und Moderator; ihr Einfluss wächst eher, weil mehr Entscheidungen bei ihnen vorbeikommen. |
| „Woher weiß ich, wer betroffen ist?“ | Im Zweifel lieber mehr fragen; mit der Zeit entwickelt sich ein Gespür. Das Advice Forum hilft. |
| „Das dauert zu lange.“ | Rat einholen geht oft schneller als auf eine Freigabe zu warten. |

### ADRs als Träger des Verfahrens

ADRs, wie Nygard sie vorgeschlagen hat, sind für Harmel-Law nicht nur Dokumentation nach der Entscheidung, sondern das **Werkzeug des Verfahrens selbst**: Der Entscheider schreibt früh einen Entwurf, teilt ihn mit Betroffenen und Fachleuten, sammelt deren Rat im Dokument und entscheidet dann. So entsteht die Begründung beim Entscheiden, nicht nachträglich.

Eine typische Struktur, angelehnt an das Buch:

| Abschnitt | Inhalt |
|---|---|
| **Titel und Status** | Entwurf, in Beratung, angenommen, ersetzt |
| **Kontext** | Warum ist eine Entscheidung nötig? |
| **Optionen** | Welche Möglichkeiten gibt es, mit Vor- und Nachteilen? |
| **Entscheidung** | Was wurde entschieden, von wem? |
| **Folgen** | Was wird leichter, was schwerer? |
| **Eingeholter Rat** | Wen hat man gefragt, was haben sie geraten, wie wurde der Rat berücksichtigt? |

Der Abschnitt **Eingeholter Rat** ist die Besonderheit: Er macht nachvollziehbar, dass das Verfahren eingehalten wurde, und zeigt, welche Bedenken bekannt waren. Wer später fragt, warum eine Entscheidung so fiel, findet dort nicht nur die Begründung, sondern auch die Gegenstimmen.

## Vertrauen statt Hierarchie

### Verantwortung wandert

Mit dem Advice Process verschiebt sich, wer verantwortlich ist: nicht mehr das Gremium, das freigegeben hat, sondern **wer entschieden hat**. Das ist eine bewusste Verschiebung. Harmel-Law betont, dass der Advice Process mit übergeordneten Rahmenwerken für Unternehmensarchitektur vereinbar ist: Unternehmensweite Vorgaben bleiben bestehen, aber innerhalb ihrer Grenzen entscheiden Teams.

### Zwischen Leichtsinn und Zurückhaltung

Ohne klaren Rahmen gibt es zwei Gefahren: **Leichtsinn**, wenn Teams ohne Rücksicht auf andere entscheiden, und **Zurückhaltung**, wenn sich niemand traut zu entscheiden. Der soziale Vertrag des Advice Process und die Offenheit der ADRs schaffen einen Raum dazwischen, in dem Entscheidungen mutig, aber nicht rücksichtslos fallen. Das entspricht der **generativen Kultur** nach Westrum aus Accelerate: Informationen fließen, Verantwortung wird geteilt, Fehler führen zu Lernen.

## Das Advice Forum

Das erste und wichtigste unterstützende Element ist das **Architecture Advice Forum**. Es ersetzt das klassische Architekturgremium, das Entwürfe prüft und freigibt, durch eine regelmäßige, offene Runde, in der Entscheidungen besprochen, aber **nicht getroffen** werden.

| Klassisches Architekturgremium | Advice Forum |
|---|---|
| prüft und gibt frei | berät, entscheidet nicht |
| wenige ausgewählte Mitglieder | offen für alle |
| Teams präsentieren, um Zustimmung zu bekommen | Teams teilen, um Rat und Rückmeldung zu bekommen |
| Ergebnis: ja oder nein | Ergebnis: Rat, Hinweise, Querverbindungen |
| oft gefürchtet | im besten Fall ein Ort des Lernens |

### Eine typische Tagesordnung

1. **Neue Entscheidungen in Beratung:** Teams stellen ADR-Entwürfe vor und bitten um Rat.
2. **Getroffene Entscheidungen:** kurze Information über ADRs, die seit dem letzten Treffen angenommen wurden.
3. **Erkenntnisse aus Experimenten:** Ergebnisse von Spikes oder Prototypen.
4. **Querschnittsthemen:** Beobachtungen, die mehrere Teams betreffen.

### Was das Forum leistet

- **Transparenz:** Alle sehen, was entschieden wird, ohne jede ADR lesen zu müssen.
- **Lernen:** Weniger erfahrene Entwickler hören, wie Erfahrene über Abwägungen nachdenken.
- **Vertrauen:** Wer regelmäßig sieht, dass Teams sorgfältig entscheiden, vertraut ihnen eher.
- **Querverbindungen:** Teams erfahren, dass andere ähnliche Probleme haben.

### Einordnung

Das Advice Forum ist die organisatorische Form dessen, was Hohpe mit Steuerung durch Einpflanzen und Reilly mit Leitplanken statt Ratschlägen meinen. Und es ist eine Antwort auf Accelerates Befund, dass Freigabegremien die Stabilität nicht verbessern: Man behält den Austausch, verzichtet aber auf die Freigabe.

## Unterstützende Elemente

Neben ADRs und dem Advice Forum beschreibt Harmel-Law weitere Elemente, die gute Entscheidungen erleichtern. Er betont, dass sie **optional** sind: Jedes antwortet auf ein bestimmtes Bedürfnis und kann wieder wegfallen, wenn es nicht mehr gebraucht wird. Nach den verfügbaren Inhaltsangaben und dem frei veröffentlichten Kapitel gehören dazu unter anderem diese:

### Gemeinsam erarbeitete Architekturprinzipien

Prinzipien geben Orientierung, ohne jede Entscheidung vorzuschreiben, etwa „Wir bevorzugen asynchrone Kommunikation zwischen Bereichen“ oder „Daten gehören genau einem Dienst“. Der Unterschied zu klassischen Prinzipien: Sie werden **mit den Teams gemeinsam** erarbeitet, nicht von oben verordnet. So verstehen alle, warum es sie gibt, und können beurteilen, wann eine Ausnahme sinnvoll ist. Das entspricht den Designprinzipien in *Fundamentals*, die Richards und Ford von verbindlichen Architekturentscheidungen unterscheiden.

### Ein eigener Technologieradar

Nach dem Vorbild des ThoughtWorks Technology Radar erstellt eine Organisation ihren **eigenen Radar**: Technologien, Werkzeuge, Techniken und Plattformen werden in Ringe eingeordnet, etwa „einsetzen“, „ausprobieren“, „prüfen“, „zurückhalten“. Der Radar ist keine Vorschrift, sondern ein Zeichen, was sich bewährt hat, und damit **gesammelter Rat**. Wer etwas aus „zurückhalten“ einsetzen will, darf das, sollte aber begründen, warum. Der Radar entsteht gemeinsam und wird regelmäßig aktualisiert.

### Querschnittsanforderungen

Anforderungen wie Sicherheit, Verfügbarkeit oder Leistung, die Richards und Ford Architekturmerkmale nennen, werden sichtbar gemacht, damit Entscheider sie nicht übersehen. Das kann eine gemeinsame Liste sein oder, wie in *Building Evolutionary Architectures*, automatische Prüfungen.

### Spikes

Teil III endet mit **Spikes**: kurzen, zeitlich begrenzten technischen Experimenten, die eine Unsicherheit klären, bevor man entscheidet. Ein Spike beantwortet eine Frage wie „Hält die Datenbank diese Last aus?“ oder „Lässt sich die Bibliothek in unsere Pipeline einbinden?“. Harmel-Law betont, dass Spikes auch eine **soziale** Wirkung haben: Wer Ergebnisse im Advice Forum vorstellt, lässt andere am Lernen teilhaben. Das ist Thomas' und Hunts Prototyp und Tracer Bullet.

### Allgemeines Muster

Alle Elemente haben dieselbe Funktion: Sie verbreiten **Kontext und Erfahrung**, damit Entscheider in den Teams nicht bei null anfangen. Das ist das, was früher der zentrale Architekt im Kopf hatte, jetzt sichtbar und für alle zugänglich.

## Das Soziale

Der vierte Teil ist der ungewöhnlichste für ein Architekturbuch. Harmel-Law argumentiert, dass ein **soziotechnisches** System leicht **unsozial** werden kann: Wenn jeder entscheiden darf, aber nur wenige sich trauen, ist nichts gewonnen. Ziel ist nicht nur, dass jeder entscheiden **darf**, sondern dass jeder entscheiden **kann**.

### Übergang von Macht und Verantwortung

Der Advice Process verschiebt Macht, und das betrifft beide Seiten:

| Wer gewinnt | Wer abgibt |
|---|---|
| **Entwickler und Teams** erhalten Entscheidungsrecht und Verantwortung. Viele sind unsicher, ob sie das dürfen und können, fürchten Fehler oder halten sich für nicht kompetent genug. | **Architekten** verlieren formale Entscheidungsmacht. Für manche ist das ein Verlust an Status und Identität, und sie halten informell an Kontrolle fest. |
| Sie brauchen **psychologische Sicherheit**: das Vertrauen, dass Fragen, Zweifel und Fehler nicht bestraft werden. | Sie brauchen eine **neue, wertgeschätzte Rolle**: als Ratgeber, Lehrer, Moderator. |

Psychologische Sicherheit ist der Begriff der Organisationsforscherin Amy Edmondson, auf den auch Googles bekannte Untersuchung zu erfolgreichen Teams verwies. Ohne sie bleibt der Advice Process ein Formular, das niemand ausfüllt.

### Gerechte Kommunikation

Harmel-Law beschreibt, wie in Diskussionen oft dieselben Stimmen dominieren: die lautesten, die erfahrensten, die mit dem höchsten Titel. Wer verteilt entscheiden will, muss **auch die leiseren Stimmen** hören. Praktische Mittel dafür:

- Rat schriftlich einholen, nicht nur im Gespräch, damit auch weniger Redegewandte beitragen.
- Im Advice Forum zuerst die Jüngeren sprechen lassen, dann die Erfahrenen.
- Ausdrücklich nach Bedenken fragen, statt Schweigen als Zustimmung zu deuten.
- Rat würdigen, auch wenn er nicht befolgt wird.

### Führung

Das Kapitel über Führung räumt mit Mythen auf: Führung ist nicht an eine Position gebunden und nicht dasselbe wie Entscheiden. In einer verteilten Architekturpraxis bedeutet Führung vor allem, **Raum zu schaffen und zu schützen**: das Verfahren vorzuleben, selbst Rat einzuholen, Fehler offen zu besprechen und einzugreifen, wenn Vertrauen verletzt wird. Hierarchische Führung ist nicht wertlos, aber sie sollte das neue Verfahren stützen, nicht unterlaufen.

### Einordnung

Das ist Accelerates transformationale Führung und Westrum-Kultur, DeMarcos und Listers „ohne Sicherheit keine Veränderung“ und das Satir-Modell aus *Peopleware*: Die Einführung des Advice Process durchläuft eine Chaosphase, in der Unsicherheit steigt. Wer dann zum alten Muster zurückkehrt, verliert das Vertrauen, das er aufbauen wollte.

## Vorlagen, Formulierungen, Übungen

Die folgenden Beispiele sind nicht aus dem Buch übernommen, sondern setzen den Advice Process in konkrete Texte um.

### Eine Bitte um Rat

```text
Betreff: Bitte um Rat: Modulgrenzen im Bestellsystem (ADR 027, Entwurf)

Hallo zusammen,

ich möchte entscheiden, ob wir das Bestellsystem mit Spring Modulith in fachliche
Module aufteilen, bevor wir einzelne Teile als eigene Dienste herauslösen.

Ihr seid gefragt, weil
- Team Versand und Team Zahlung direkt betroffen wären (neue Schnittstellen),
- Maria und Jonas Erfahrung mit Spring Modulith bzw. der Datenbankaufteilung haben.

Der Entwurf mit Optionen und meiner vorläufigen Empfehlung liegt hier: <Link>
Besonders interessiert mich: Was übersehe ich? Wo würdet ihr anders entscheiden?

Ich würde gern bis Donnerstag entscheiden und die Entscheidung am Freitag im
Advice Forum vorstellen.

Danke, Sven
```

### Ein ADR mit eingeholtem Rat

```markdown
# ADR 027: Fachliche Module im Bestellsystem mit Spring Modulith

Status: angenommen
Entschieden von: Sven, Team Bestellung

## Kontext
Änderungen an Zahlung und Versand erfordern regelmäßig Änderungen im ganzen
Bestellsystem. Eine Aufteilung in Dienste ist geplant, die Grenzen sind unklar.

## Optionen
1. Sofort in drei Dienste aufteilen
2. Erst fachliche Module im Monolithen, später herauslösen   ← gewählt
3. Nichts ändern

## Folgen
+ Grenzen werden im Code sichtbar und per Test geprüft
+ spätere Herauslösung mit geringerem Risiko
- zusätzliche Arbeit ohne sofortigen Nutzen für Nutzer

## Eingeholter Rat
- Team Versand: einverstanden; bittet um asynchrone Ereignisse statt direkter Aufrufe → übernommen
- Team Zahlung: bevorzugt sofortige Aufteilung (Option 1) wegen eigener Release-Zyklen → nicht übernommen;
  Begründung: Grenzen noch nicht stabil genug. Erneute Prüfung in drei Monaten vereinbart.
- Maria: Hinweis auf zyklische Abhängigkeiten zwischen Bestellung und Rechnung → zuerst auflösen
- Jonas: Datenbank vorerst gemeinsam lassen, Schemas trennen → übernommen
```

### Formulierungen

| Situation | Formulierung |
|---|---|
| **Als Architekt Rat geben, ohne zu entscheiden** | „Ich würde es anders machen, und zwar aus diesen Gründen. Die Entscheidung liegt bei euch; wenn ihr bei eurer Lösung bleibt, achtet bitte auf X.“ |
| **Rat nicht befolgen, ohne zu kränken** | „Danke für den Hinweis, er hat mich zum Nachdenken gebracht. Ich bleibe bei Option B, weil … Ich habe deinen Einwand im ADR festgehalten.“ |
| **Jemanden ermutigen zu entscheiden** | „Du kennst das Problem am besten. Hol dir Rat von Team A und von Lisa, und dann entscheide du.“ |
| **Eine zu frühe Eskalation abfangen** | „Bevor wir das nach oben geben: Hast du schon die Betroffenen gefragt? Was haben sie gesagt?“ |

### Übungen

**1. Entscheidungen der letzten drei Monate.** Liste die wichtigsten technischen Entscheidungen auf. Wer hat sie getroffen? Wer wurde gefragt? Wo sind sie dokumentiert? Gibt es Entscheidungen, von denen Betroffene erst hinterher erfuhren?

**2. Ein Pilot.** Wähle eine anstehende Entscheidung und führe sie nach dem Advice Process durch, mit ADR und Abschnitt „Eingeholter Rat“. Wie lange hat es gedauert, verglichen mit dem üblichen Weg?

**3. Ein Advice Forum ausprobieren.** Lade für vier Wochen einmal pro Woche zu einer halben Stunde ein, offen für alle, mit der Regel: hier wird beraten, nicht entschieden. Beobachte, wer kommt und wer spricht.

**4. Leise Stimmen.** Achte in der nächsten Architekturdiskussion darauf, wer spricht und wer nicht. Frage danach gezielt die Stillen nach ihrer Einschätzung.

## Kritik und Einordnung

### Stärken

- **Eine einfache, starke Idee:** Der Advice Process passt auf eine Folie und lässt sich am nächsten Tag ausprobieren.
- **Löst ein echtes Problem:** den Widerspruch zwischen autonomen Teams und zentraler Architektur, den viele Organisationen erleben.
- **ADRs neu gedacht:** als Werkzeug beim Entscheiden, nicht als nachträgliche Dokumentation, mit dem Abschnitt zum eingeholten Rat als nützlicher Ergänzung.
- **Soziale Seite ernst genommen:** Macht, psychologische Sicherheit und Inklusion bekommen ein eigenes Gewicht.
- **Optionale Elemente:** Keine Methode im Paket, sondern Bausteine, die man nach Bedarf einsetzt und wieder entfernt.

### Kritikpunkte

**1. Lang für eine einfache Idee.** Mit rund 500 Seiten ist das Buch sehr ausführlich. Der Kern ließe sich deutlich kürzer darstellen; manche Leser werden den ursprünglichen Artikel auf Martin Fowlers Website als ausreichend empfinden.

**2. Voraussetzungen werden unterschätzt.** Der Advice Process setzt Teams voraus, die fachlich in der Lage sind, Architekturentscheidungen zu treffen, und eine Führung, die Kontrolle wirklich abgibt. Wo beides fehlt, wird das Verfahren entweder ignoriert oder führt zu schlechten Entscheidungen.

**3. Regulierte Umgebungen.** In Banken, Versicherungen oder Behörden gibt es oft Vorgaben, die bestimmte Freigaben verlangen. Harmel-Law erklärt, dass der Advice Process mit übergeordneten Rahmenwerken vereinbar ist, aber die praktische Verbindung mit Aufsichtsanforderungen bleibt eine Herausforderung.

**4. Wer ist betroffen?** Die Frage, wen man fragen muss, ist in großen Organisationen nicht trivial. Das Buch gibt Hinweise, aber in der Praxis bleibt hier Unsicherheit, die Zeit kostet oder zu Lücken führt.

**5. Wenig Belege.** Wie die anderen Bücher dieser Gruppe beruht es auf Erfahrung aus Beratungsprojekten, nicht auf systematischer Forschung.

### Gesamturteil

Das Buch beantwortet eine Frage, die in den technischen Architekturbüchern der Reihe offenbleibt: Wie trifft eine Organisation mit vielen Teams gute Architekturentscheidungen, ohne zentrale Engpässe? Für erfahrene Architekten und Staff Engineers, die ihre Rolle vom Entscheider zum Ermöglicher wandeln wollen, ist es ein praktischer Leitfaden. Wer wenig Zeit hat, liest Teil I und das Kapitel über das Advice Forum.

## Bezüge zur Reihe

### Drei Bilder der Architektenrolle

| Buch | Bild | Schwerpunkt |
|---|---|---|
| Hohpe, *The Software Architect Elevator* | Übersetzer im Aufzug | zwischen Geschäftsführung und Technik vermitteln |
| Reilly, *The Staff Engineer's Path* | technische Führung ohne Personalverantwortung | Überblick, Umsetzung, andere stärken |
| Harmel-Law, *Facilitating Software Architecture* | Moderator verteilter Entscheidungen | Teams entscheiden lassen, Rat und Kontext bereitstellen |

Gemeinsam ist allen dreien: Der Architekt der Zukunft entscheidet weniger selbst und sorgt mehr dafür, dass andere gut entscheiden.

### Weitere Bezüge

| Thema bei Harmel-Law | Bezug in der Reihe |
|---|---|
| Zentrale Architekten als Engpass | Accelerate: Freigabegremien; Team Topologies: Teamautonomie |
| Bedeutsame Entscheidungen | Richards und Ford: architektonisch bedeutsame Entscheidungen |
| ADRs | Nygard; Richards und Ford: Antipatterns Murmeltier und E-Mail-Architektur |
| Advice Forum statt Freigabegremium | Hohpe: Steuerung durch Einpflanzen; Ford u.a.: automatisierte Governance |
| Gemeinsame Prinzipien | Richards und Ford: Designprinzipien |
| Eigener Technologieradar | ThoughtWorks Radar; Ford u.a. |
| Spikes | Thomas und Hunt: Prototypen, Tracer Bullets |
| Psychologische Sicherheit | Accelerate: Westrum-Kultur; SRE: schuldfreie Postmortems; DeMarco und Lister |
| Verantwortung bei dem, der entscheidet | Reilly: Rolle annehmen; Brooks: konzeptionelle Integrität als Gegenposition |
| Architekt als Moderator | Hohpe: Gärtner; Reilly: Leitplanken; Newman: Stadtplaner |

Brooks ist hier ein interessanter Gegenpol: Er forderte, dass wenige Köpfe die Architektur bestimmen, um **konzeptionelle Integrität** zu sichern. Harmel-Law verteilt die Entscheidungen, setzt aber auf Prinzipien, Radar und das Advice Forum, damit die Gesamtrichtung trotzdem zusammenpasst.

## Diskussionsfragen

1. **Wer entscheidet bei euch?** Wie werden Architekturentscheidungen heute getroffen, und wie lange dauert es von der Frage bis zur Entscheidung?
2. **Engpass:** Gibt es bei euch Architekten oder Gremien, auf die Teams warten?
3. **Rat statt Freigabe:** Was würde sich ändern, wenn ab morgen jedes Team selbst entscheiden dürfte, sofern es Rat einholt?
4. **ADRs:** Werden eure ADRs beim Entscheiden geschrieben oder hinterher? Steht drin, wer gefragt wurde und was er gesagt hat?
5. **Konzeptionelle Integrität:** Wie verhindert man, dass verteilte Entscheidungen zu einem Flickenteppich werden? Reichen Prinzipien und Radar?
6. **Psychologische Sicherheit:** Trauen sich bei euch auch jüngere Entwickler, Architekturentscheidungen zu treffen?
7. **Deine Rolle:** Als erfahrener Entwickler oder Architekt: Wie würde sich deine Rolle ändern, und wie würdest du das finden?
8. **Weiter:** Als Nächstes *Crucial Conversations*, über Gespräche, in denen viel auf dem Spiel steht.
