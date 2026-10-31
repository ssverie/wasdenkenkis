+++
title = "Debugging Teams – Zusammenfassung und Einordnung"
description = "Brian W. Fitzpatrick, Ben Collins-Sussman, Debugging Teams: Better Productivity through Collaboration (2015)"
date = 2026-10-31T11:38:49+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern, Reihe der acht Soft-Skill-Bücher, Teil 6 von 8"
buecher = ["debugging-teams-2015"]
+++

## Einleitung

Nach Gesprächstechniken und Feedback-Modellen ein Buch, das direkt aus dem Entwickleralltag kommt: *Debugging Teams* ist kurz, humorvoll und richtet sich an Programmierer, die merken, dass ihre größten Probleme nicht im Code liegen, sondern in der Zusammenarbeit.

### Autoren und Kontext

Brian Fitzpatrick und Ben Collins-Sussman arbeiteten jahrelang zusammen: zuerst als Kernentwickler des Versionskontrollsystems **Subversion**, dann bei **Google**, wo sie das Entwicklungsbüro in Chicago aufbauten und leiteten. Bekannt wurden sie durch gemeinsame Vorträge auf Google I/O und anderen Konferenzen, etwa über den Umgang mit schwierigen Menschen in Open-Source-Projekten. 2012 erschien ihr Buch *Team Geek*, 2015 die überarbeitete Fassung unter dem Titel *Debugging Teams*. Fitzpatrick schrieb später das Kapitel über Teamarbeit in *Software Engineering at Google* mit.

### Die Kernthese

Softwareentwicklung ist ein **Teamsport**. Wer glaubt, dass gute Software vor allem von genialen Einzelnen kommt, irrt, und wer sich selbst so sieht, schadet seinem Team und sich. Erfolgreiche Teams beruhen auf drei Grundhaltungen, die die Autoren mit dem Kürzel **HRT** zusammenfassen: **Humility, Respect, Trust**, also Demut, Respekt und Vertrauen. Fast jeder Konflikt in einem Team lässt sich auf das Fehlen einer dieser drei zurückführen.

### Aufbau

Das Buch hat sechs kurze Kapitel, die sich vom Einzelnen nach außen bewegen:

| Kapitel | Thema |
|---|---|
| 1 | **Du:** der Mythos vom genialen Programmierer |
| 2 | **Dein Team:** eine gute Teamkultur aufbauen |
| 3 | **Deine Führung:** jedes Boot braucht einen Kapitän |
| 4 | **Schwierige Menschen:** Umgang mit schädlichem Verhalten |
| 5 | **Deine Organisation:** Organisationen navigieren |
| 6 | **Deine Nutzer:** Nutzer sind auch Menschen |

Mit unter 200 Seiten ist es das kürzeste Buch der Reihe.

## Der Mythos vom genialen Programmierer

### Genies arbeiten nicht allein

Die Autoren beginnen mit einem verbreiteten Bild: dem genialen Programmierer, der sich zurückzieht und ein Meisterwerk erschafft. Sie nennen Beispiele wie Linus Torvalds oder Guido van Rossum und zeigen, dass deren eigentliche Leistung darin lag, ein **Projekt und eine Gemeinschaft** aufzubauen, nicht darin, allein zu programmieren. Linux wurde nicht von einem Menschen geschrieben, sondern von Tausenden.

### Verstecken schadet

Der Mythos hat eine schädliche Folge: Viele Entwickler **verstecken ihre Arbeit**, bis sie perfekt ist. Aus Unsicherheit, aus Angst, dass andere Fehler sehen oder ihre Idee stehlen. Die Autoren halten dagegen:

- **Fehler werden spät entdeckt.** Ein grundsätzlich falscher Ansatz fällt erst auf, wenn viel Arbeit investiert ist.
- **Man erfindet das Rad neu.** Ohne Austausch weiß man nicht, dass ein Kollege dasselbe Problem schon gelöst hat.
- **Der Busfaktor sinkt.** Wenn nur einer den Code kennt, ist das Projekt gefährdet, sobald er krank wird, kündigt oder, wie der Begriff drastisch sagt, von einem Bus überfahren wird.
- **Man lernt langsamer.** Wer sich keine Rückmeldung holt, wiederholt seine Fehler.

### Früh scheitern, schnell lernen

Die Alternative: Arbeit **früh zeigen**, kleine Schritte, häufige Rückmeldung. Ein Entwurf, den man nach zwei Tagen teilt, kann noch korrigiert werden; einer, den man nach drei Monaten präsentiert, wird verteidigt. Die Autoren vergleichen das mit kurzen Feedbackschleifen in der Entwicklung selbst: Compiler, Tests, Continuous Integration.

### Das eigene Ego

Das Kapitel endet mit einer unbequemen Einsicht: Der Wunsch, als Genie zu gelten, kommt meist aus **Unsicherheit**. Wer seinen Selbstwert an die eigene Brillanz knüpft, erlebt jede Kritik als Angriff. Wer seinen Code als etwas sieht, das man gemeinsam verbessert, kann Kritik annehmen. Ein Satz, der in der Entwicklergemeinschaft oft zitiert wird, sinngemäß: **Du bist nicht dein Code.**

### Einordnung

Das ist der Gedanke des **egolosen Programmierens** aus Gerald Weinbergs *The Psychology of Computer Programming* von 1971, Becks Pair Programming und Hohpes Rat, das Echte früh zu zeigen. Der Busfaktor ist dieselbe Sorge, die Brooks und Team Topologies über Wissensinseln äußern.

## Demut, Respekt, Vertrauen

Das zweite zentrale Konzept des Buchs sind die drei Grundhaltungen, auf die sich die Autoren immer wieder beziehen.

{{< bild src="bild-1.png" alt="die drei Säulen HRT nach Fitzpatrick und Collins-Sussman" >}}

die drei Säulen HRT nach Fitzpatrick und Collins-Sussman

| Haltung | Bedeutung | Im Alltag |
|---|---|---|
| **Demut** | Du bist nicht der Mittelpunkt des Universums. Du bist weder allwissend noch unfehlbar. | offen für Verbesserungen sein; zugeben, wenn man etwas nicht weiß |
| **Respekt** | Du schätzt die Menschen, mit denen du arbeitest, und ihre Fähigkeiten. | freundlich und rücksichtsvoll sein, auch bei Meinungsverschiedenheiten |
| **Vertrauen** | Du glaubst, dass andere kompetent sind und das Richtige tun. | Aufgaben abgeben; nicht alles selbst kontrollieren wollen |

Die Autoren behaupten, dass sich **fast jeder soziale Konflikt** auf das Fehlen einer dieser Haltungen zurückführen lässt. Wer im Konflikt steckt, kann sich fragen: Fehlt mir gerade Demut, Respekt oder Vertrauen, oder fehlt es dem anderen?

### Praktische Folgen

Aus HRT leiten die Autoren konkrete Verhaltensweisen ab:

- **Das Ego ablegen:** Nicht die eigene Idee verteidigen, sondern die beste Idee suchen. Ein gutes Team hat ein kollektives Ego, das stolz auf gemeinsame Ergebnisse ist.
- **Kritik geben und annehmen lernen:** Kritik am Code ist keine Kritik an der Person. Wer kritisiert, tut es so, dass der andere sie annehmen kann: „Ich finde die Logik hier schwer nachzuvollziehen“ statt „Das ist falsch“.
- **Schnell scheitern und lernen:** Fehler offen zugeben und auswerten. Die Autoren beschreiben Googles Kultur schuldfreier Postmortems.
- **Zeit zum Lernen lassen:** sich selbst und anderen.
- **Geduld üben,** besonders mit Menschen, die anders denken oder arbeiten.
- **Offen für Einfluss sein:** Ein bemerkenswerter Gedanke: **Je mehr man bereit ist, sich beeinflussen zu lassen, desto mehr Einfluss hat man.** Wer zeigt, dass er zuhört und seine Meinung ändern kann, wird ernster genommen, wenn er bei etwas bleibt.

### Einordnung

HRT ist eine knappe Fassung dessen, was *Crucial Conversations* als Sicherheit durch gemeinsames Ziel und gegenseitigen Respekt beschreibt und *Radical Candor* als persönliches Kümmern. Der Gedanke, dass Einfluss aus Offenheit entsteht, passt zu Harmel-Laws Advice Process, in dem Architekten durch Rat statt durch Macht wirken.

## Eine gute Teamkultur aufbauen

Die Autoren beschreiben **Kultur** als die gemeinsamen Erfahrungen, Werte und Ziele eines Teams, die bestimmen, wie es sich verhält. Kultur entsteht nicht durch Plakate, sondern durch das, was ein Team tatsächlich tut und duldet.

### Warum Kultur zählt

- Eine starke Kultur **zieht passende Menschen an** und schreckt unpassende ab.
- Sie **erhält sich selbst**: Neue Mitglieder übernehmen, was sie vorleben sehen.
- Sie wird aber auch **leicht beschädigt**: Ein einziger Mensch, der respektlos ist und damit durchkommt, verändert, was als normal gilt.

Die Autoren betonen, dass ein Team **gut einstellen** muss, und zwar nicht nur nach technischen Fähigkeiten, sondern auch danach, ob jemand die Kultur stärkt. Ihr Rat: Lieber eine Stelle länger unbesetzt lassen als jemanden einstellen, der die Kultur schädigt.

### Kommunikation als Kulturträger

Ein großer Teil des Kapitels behandelt, **wie** ein Team kommuniziert, weil sich Kultur darin am deutlichsten zeigt:

| Kanal | Rat der Autoren, sinngemäß |
|---|---|
| **Leitbild** | kurz schreiben, was das Team erreichen will und was nicht; hilft bei Entscheidungen, was man ablehnt |
| **Besprechungen** | nur einladen, wer wirklich gebraucht wird; feste Tagesordnung; pünktlich enden; regelmäßige Besprechungen kurz halten |
| **Entwurfsdokumente** | vor dem Programmieren schreiben und teilen, damit früh Kritik möglich ist |
| **Code-Reviews** | für alle Änderungen; Ton sachlich und freundlich; Reviews als Lerngelegenheit |
| **Asynchrone Kanäle** | Mailinglisten, Chats, Tickets so nutzen, dass Diskussionen nachlesbar und auffindbar bleiben |
| **Dokumentation** | Entscheidungen festhalten, damit neue Mitglieder sie verstehen |

### Öffentlich arbeiten

Aus ihrer Open-Source-Erfahrung übernehmen die Autoren den Grundsatz, möglichst viel **offen und nachvollziehbar** zu machen: Diskussionen in Kanälen statt in privaten Nachrichten, Entscheidungen schriftlich, Code für alle sichtbar. Das erleichtert neuen Mitgliedern den Einstieg und verhindert, dass Wissen in Köpfen oder privaten Chats verschwindet.

### Einordnung

Das deckt sich mit DeMarcos und Listers eingeschworenen Teams und mit Westrums generativer Kultur aus Accelerate. Der Rat, Entwurfsdokumente früh zu teilen, ist Reillys RFC-Kapitel und Harmel-Laws ADR als Werkzeug des Entscheidens.

## Jedes Boot braucht einen Kapitän

Viele Entwickler wollen nicht führen. Die Autoren verstehen das, halten aber fest: **Jedes Team braucht jemanden, der Richtung gibt**, ob als Manager, als Tech Lead oder als beides zugleich. Wenn niemand die Rolle übernimmt, übernimmt sie irgendwann der Lauteste, oder das Team treibt.

### Dienende Führung

Die Autoren verstehen Führung als **Dienst am Team**: Der Kapitän sorgt dafür, dass das Boot vorankommt, aber er rudert nicht für alle und befiehlt nicht jeden Ruderschlag. Sie beziehen sich auf Daniel Pinks *Drive*: Wissensarbeiter werden vor allem durch **Autonomie, Können und Sinn** angetrieben, nicht durch Kontrolle und Belohnung.

### Antipatterns

| Antipattern | Problem |
|---|---|
| **Nachgiebige Leute einstellen** | um sich nicht bedroht zu fühlen; das Team wird nie besser als der Chef |
| **Schwache Leistung ignorieren** | hoffen, dass es sich von selbst löst; das Team leidet und verliert Respekt |
| **Menschliche Probleme ignorieren** | nur auf technische Fragen achten; Konflikte und persönliche Krisen eskalieren |
| **Jedermanns Freund sein** | Freundschaft und Führung verwechseln; schwierige Entscheidungen werden unmöglich |
| **Bei der Einstellung Kompromisse machen** | aus Zeitdruck die Messlatte senken; die Folgen dauern Jahre |
| **Das Team wie Kinder behandeln** | kontrollieren, misstrauen, Mikromanagement; das Team verhält sich entsprechend |

### Muster

| Muster | Inhalt |
|---|---|
| **Das Ego ablegen** | dem Team vertrauen; Fehler zugeben; das Team glänzen lassen |
| **Ein Zen-Meister sein** | ruhig bleiben; die eigene Nervosität überträgt sich auf das Team |
| **Ein Katalysator sein** | Einigung herbeiführen, Menschen zusammenbringen, statt selbst zu entscheiden |
| **Hindernisse beseitigen** | herausfinden, was das Team aufhält, und es aus dem Weg räumen |
| **Lehrer und Mentor sein** | Menschen wachsen lassen, auch wenn es kurzfristig langsamer ist |
| **Klare Ziele setzen** | jeder weiß, wohin das Team will |
| **Ehrlich sein** | Kritik offen ansprechen, ohne zu verletzen |
| **Zufriedenheit verfolgen** | regelmäßig fragen, wie es Menschen geht und was sie brauchen |

### Fehler sind erlaubt

Die Autoren betonen, dass ein guter Kapitän **Fehler zulässt**: Wer nie scheitert, wagt nichts. Wichtig ist, dass Fehler früh erkannt und offen ausgewertet werden. Das ist die Haltung schuldfreier Postmortems aus dem SRE-Buch.

### Einordnung

Die Muster decken sich weitgehend mit dem wirksamen Architekten aus *Fundamentals*, Reillys Vorbild und Hohpes Gärtner. Das Antipattern, schwache Leistung zu ignorieren, ist Scotts ruinöse Empathie aus Führungssicht.

## Umgang mit schädlichem Verhalten

Das Kapitel geht auf einen bekannten Vortrag der Autoren über Open-Source-Projekte zurück, die durch einzelne schwierige Mitglieder fast zerstört wurden. Ihr Ausgangspunkt: Die wertvollste Ressource eines Teams ist seine **Aufmerksamkeit und Konzentration**. Schädliches Verhalten ist deshalb schädlich, weil es diese Ressource verbraucht.

### Verhalten, nicht Menschen

Die Autoren sprechen bewusst von **schädlichem Verhalten**, nicht von schädlichen Menschen. Fast jeder verhält sich gelegentlich schwierig, und viele, die sich schwierig verhalten, sind talentiert und meinen es gut. Es geht darum, das Verhalten zu erkennen und zu begrenzen, nicht darum, Menschen abzustempeln.

### Typische Muster

| Muster | Beschreibung |
|---|---|
| **Kein Respekt für die Zeit anderer** | ständige Fragen, die man selbst beantworten könnte; lange Nachrichten ohne Kern |
| **Ego und Rechthaberei** | kann nicht nachgeben; jede Diskussion wird zum Wettkampf |
| **Entschiedenes wieder aufrollen** | Themen, die längst entschieden sind, immer wieder neu diskutieren |
| **Anspruchsdenken** | erwartet, dass andere seine Wünsche erfüllen, ohne beizutragen |
| **Lähmender Perfektionismus** | blockiert Entscheidungen, weil keine Lösung gut genug ist |
| **Feindseligkeit** | persönliche Angriffe, Sarkasmus, Herabsetzung |
| **Revierdenken** | „mein Code, mein Modul“; lässt niemanden heran |

### Strategien

- **Ruhe bewahren:** Nicht auf Provokation reagieren; feindselige Nachrichten nicht im selben Ton beantworten.
- **Nicht füttern:** Manche Menschen suchen Aufmerksamkeit durch Streit. Die beste Antwort ist oft eine kurze, sachliche oder gar keine.
- **Entscheidungen festhalten:** Wer Entschiedenes wieder aufrollt, bekommt einen Verweis auf die Dokumentation. Das ist ein starkes Argument für ADRs, die die Antipatterns „Täglich grüßt das Murmeltier“ und „E-Mail-getriebene Architektur“ aus *Fundamentals* verhindern.
- **Energie umlenken:** Ein Perfektionist kann ein hervorragender Reviewer sein; ein Rechthaber kann eine schwierige Untersuchung übernehmen.
- **Grenzen setzen:** Klar sagen, welches Verhalten nicht akzeptiert wird, und dabei bleiben.
- **Langfristig denken:** Ein talentierter Mensch, der das Team vergiftet, kostet mehr, als er bringt. Manchmal ist eine Trennung die richtige Entscheidung.

### Einordnung

Das ist DeMarcos und Listers Teamizid aus Sicht des Einzelnen, und die Frage nach dem vernünftigen Menschen aus *Crucial Conversations* hilft, Verhalten zu verstehen, bevor man es verurteilt. Das Festhalten von Entscheidungen verbindet das Kapitel mit Harmel-Law und Nygard.

## Organisationen navigieren

Das fünfte Kapitel trägt den augenzwinkernden Titel *The Art of Organizational Manipulation*. Gemeint ist keine Manipulation im schlechten Sinn, sondern die Fähigkeit, in einer Organisation etwas zu erreichen, auch wenn man nicht das Sagen hat.

### Taktiken

| Taktik | Inhalt |
|---|---|
| **Um Verzeihung statt um Erlaubnis bitten** | in kleinem, vertretbarem Rahmen einfach handeln, statt auf Freigaben zu warten; mit Augenmaß |
| **Offensive und defensive Arbeit ausbalancieren** | offensive Arbeit sind neue Funktionen, die Nutzer sehen; defensive Arbeit ist Aufräumen, Stabilität, Schulden abbauen. Beides ist nötig; defensive Arbeit muss man begründen und sichtbar machen |
| **Nach oben steuern** | die Ziele des eigenen Vorgesetzten verstehen, ihn informiert halten, Überraschungen vermeiden |
| **Knapp schreiben** | Nachrichten an Entscheider in wenigen Punkten mit einer klaren Bitte formulieren |
| **Verbündete suchen** | Menschen finden, die dasselbe wollen, und gemeinsam auftreten |
| **Zur richtigen Zeit am richtigen Ort sein** | Gelegenheiten erkennen, wenn Prioritäten sich verschieben |

### Drei Punkte und eine Bitte

Ein praktischer Rat, den die Autoren beschreiben: Nachrichten an viel beschäftigte Entscheider sollen aus **drei kurzen Punkten und einer klaren Handlungsaufforderung** bestehen. Mehr wird nicht gelesen. Das ist Hohpes Schreiben für Beschäftigte in knappster Form.

### Der Ausweg

Die Autoren sind ehrlich: Manche Organisationen sind so beschaffen, dass man darin nicht gut arbeiten kann, egal wie geschickt man ist. Dann ist **Gehen** eine legitime Entscheidung. Wer in einer giftigen Umgebung bleibt, verliert Kraft, Gesundheit und Lust an der Arbeit.

## Nutzer sind auch Menschen

Das letzte Kapitel überträgt Demut, Respekt und Vertrauen auf die Menschen, die die Software benutzen.

- **Wahrnehmung zählt:** Wie Nutzer ein Produkt erleben, hängt nicht nur von Funktionen ab, sondern von Geschwindigkeit, Verständlichkeit und dem Gefühl, ernst genommen zu werden.
- **Weniger versprechen, mehr halten:** Vertrauen entsteht, wenn Erwartungen übertroffen werden, nicht wenn sie geweckt und enttäuscht werden.
- **Nutzer respektieren:** Auch bei unverständlichen Fehlerberichten oder verärgerten Nachrichten steht ein Mensch mit einem echten Problem dahinter.
- **Zuhören:** Unterstützung für Nutzer ist eine Quelle wertvoller Rückmeldung, nicht nur eine Last.

### Einordnung

Offensive und defensive Arbeit ist Becks Unterscheidung von Verhalten und Struktur, auf Organisationsebene. Der Rat, nach oben zu steuern, entspricht Hohpes Aufzug und Reillys Geländekarte. Das Kapitel über Nutzer greift auf, was SRE mit nutzerorientierten SLOs misst.

## Formulierungen und Übungen

Die folgenden Beispiele sind nicht aus dem Buch übernommen, sondern übertragen seine Ratschläge in konkrete Sätze.

### Formulierungen

| Situation | Formulierung |
|---|---|
| **Arbeit früh zeigen** | „Das ist erst ein halber Tag Arbeit, aber ich wollte, dass ihr den Ansatz seht, bevor ich weitermache. Was haltet ihr davon?“ |
| **Kritik am Code, nicht an der Person** | „Ich finde den Ablauf hier schwer nachzuvollziehen. Könnten wir die drei Fälle in getrennte Methoden aufteilen?“ |
| **Kritik annehmen** | „Guter Punkt, daran hatte ich nicht gedacht. Ich ändere es.“ Oder, wenn man anderer Meinung ist: „Ich sehe es anders, weil … Wollen wir kurz darüber sprechen?“ |
| **Entschiedenes nicht wieder aufrollen** | „Das haben wir im März besprochen; die Begründung steht in ADR 014. Gibt es neue Erkenntnisse, die eine neue Diskussion rechtfertigen?“ |
| **Auf Feindseligkeit ruhig reagieren** | „Ich verstehe, dass dich das ärgert. Lass uns über das konkrete Problem sprechen: was genau funktioniert nicht?“ |
| **Defensive Arbeit begründen** | „Wir wollen zwei Wochen in Aufräumarbeit stecken. Danach dauern Änderungen am Bestellsystem halb so lange; ab der nächsten Funktion holen wir die Zeit wieder herein.“ |
| **Drei Punkte und eine Bitte** | „Kurz zum Release: 1. Zwei kritische Fehler offen. 2. Behebung bis Donnerstag möglich. 3. Ohne Behebung Ausfallrisiko im Checkout. Bitte: Release auf Freitag verschieben. Einverstanden?“ |

### Übungen

**1. Der Busfaktor.** Welche Teile eures Systems kennt nur eine Person? Was wäre ein erster Schritt, das Wissen zu verteilen?

**2. Früh zeigen.** Teile deine nächste Arbeit nach höchstens einem Tag, auch wenn sie unfertig ist. Was ändert sich an der Rückmeldung?

**3. HRT-Prüfung.** Denk an deinen letzten Konflikt im Team. Fehlte Demut, Respekt oder Vertrauen, bei dir oder beim anderen?

**4. Offensive und defensive Arbeit.** Wie ist das Verhältnis in deinem Team in den letzten drei Monaten? Ist die defensive Arbeit sichtbar und begründet?

**5. Entscheidungen sichtbar machen.** Welche Diskussionen werden bei euch immer wieder geführt? Würde ein ADR helfen, sie zu beenden?

## Kritik und Einordnung

### Stärken

- **Von Entwicklern für Entwickler:** Die Autoren kennen den Alltag, die Sprache und die typischen Konflikte. Das Buch wirkt nie wie ein Managementratgeber.
- **Kurz und unterhaltsam:** In zwei Abenden gelesen, mit vielen Anekdoten aus Subversion und Google.
- **HRT als Prüfwerkzeug:** Drei Begriffe, die man sich merken und in jedem Konflikt anwenden kann.
- **Der Mythos vom Genie:** Eine wichtige Botschaft gerade für talentierte Entwickler, die sich schwer damit tun, ihre Arbeit früh zu zeigen.
- **Ehrlich über Organisationen:** Einschließlich der Erlaubnis, eine schlechte Umgebung zu verlassen.

### Kritikpunkte

**1. Oberflächlich in Teilen.** Viele Themen werden nur angerissen. Wer tiefer in Gesprächsführung, Feedback oder Führung einsteigen will, braucht *Crucial Conversations*, *Radical Candor* oder Fourniers *The Manager's Path*.

**2. Google-Perspektive.** Viele Beispiele stammen aus einem Umfeld mit hohen Gehältern, starker Engineering-Kultur und viel Freiraum. Nicht alles lässt sich auf Organisationen mit weniger Spielraum übertragen.

**3. Manipulation als Begriff.** Das Kapitel über Organisationen ist klug, aber der augenzwinkernde Ton kann missverstanden werden; manche Ratschläge, etwa um Verzeihung statt um Erlaubnis zu bitten, sind in regulierten Umgebungen heikel.

**4. Wenig über Verschiedenheit.** Das Buch erschien, bevor Themen wie Inklusion und unterschiedliche Erfahrungen verschiedener Gruppen in Teams breit diskutiert wurden. Harmel-Law und Scotts spätere Bücher gehen hier weiter.

**5. Älter, als es wirkt.** Es beruht auf *Team Geek* von 2012; verteilte Teams, Homeoffice und Chat-Kultur kommen nur am Rand vor.

### Gesamturteil

Das zugänglichste Buch der Soft-Skill-Reihe und ein guter Einstieg für Entwickler, die sich bisher wenig mit der menschlichen Seite beschäftigt haben. Für erfahrene Entwickler ist es eine schnelle Erinnerung an das Wesentliche: Demut, Respekt, Vertrauen, und dass man nicht sein Code ist.

## Bezüge zur Reihe

| Thema in *Debugging Teams* | Bezug in der Reihe |
|---|---|
| Mythos vom Genie, Busfaktor | Brooks: Chirurgenteam und seine Risiken; Team Topologies: Wissensinseln |
| Arbeit früh zeigen | Hohpe: das Echte zeigen; Reilly: Entwürfe zur Kritik öffnen; Beck: kleine Schritte |
| Du bist nicht dein Code | Weinberg: egoloses Programmieren; Scott: Verhalten, nicht Persönlichkeit |
| Demut, Respekt, Vertrauen | Patterson u.a.: Sicherheit durch Respekt und gemeinsames Ziel; Scott: persönlich kümmern |
| Offen für Einfluss sein | Harmel-Law: Architekten wirken durch Rat |
| Teamkultur, gut einstellen | DeMarco und Lister: eingeschworene Teams, Arbeitsproben |
| Kapitän, dienende Führung | Richards und Ford: wirksamer Architekt; Accelerate: transformationale Führung |
| Schwache Leistung ignorieren | Scott: ruinöse Empathie |
| Schädliches Verhalten | DeMarco und Lister: Teamizid |
| Entscheidungen festhalten | Nygard und Harmel-Law: ADRs; Richards und Ford: Murmeltier-Antipattern |
| Offensive und defensive Arbeit | Beck: Verhalten und Struktur; Martin: Eisenhower-Matrix |
| Nach oben steuern, knapp schreiben | Hohpe: Aufzug, Schreiben für Beschäftigte; Reilly: Eskalation |
| Schuldfreie Auswertung | SRE: Postmortems |

## Diskussionsfragen

1. **Genie-Mythos:** Gibt es in deinem Umfeld jemanden, der als unersetzlich gilt? Ist das ein Vorteil oder ein Risiko?
2. **Früh zeigen:** Wie lange arbeitest du typischerweise an etwas, bevor andere es sehen?
3. **HRT:** Welche der drei Haltungen fällt dir am schwersten, und in welchen Situationen?
4. **Kultur:** Was duldet euer Team, das es nicht dulden sollte?
5. **Schädliches Verhalten:** Welche Muster aus der Tabelle kennst du, von anderen oder von dir selbst?
6. **Defensive Arbeit:** Wie macht ihr Aufräumarbeit gegenüber dem Management sichtbar?
7. **Gehen:** Hast du schon einmal eine Organisation verlassen, weil man darin nicht gut arbeiten konnte? Woran hast du es erkannt?
8. **Weiter:** Als Nächstes Cal Newports *Deep Work*, über konzentriertes Arbeiten in einer Welt voller Unterbrechungen.
