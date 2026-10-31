+++
title = "The Software Architect Elevator – Zusammenfassung und Einordnung"
description = "Gregor Hohpe, The Software Architect Elevator: Redefining the Architect's Role in the Digital Enterprise (2020)"
date = 2026-10-31T11:37:11+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern, Reihe der acht Soft-Skill-Bücher, Teil 1 von 8"
buecher = ["the-software-architect-elevator-2020"]
+++

## Einleitung

Gregor Hohpe kennen wir aus *Enterprise Integration Patterns*. Siebzehn Jahre später schreibt er kein Musterbuch mehr, sondern ein Buch über die **Rolle des Architekten** in großen Organisationen, die sich digital erneuern wollen. Es ist das erste der acht Soft-Skill-Bücher und bildet die Brücke: ein Architekt, der technisch tief verwurzelt ist und gleichzeitig mit Vorständen spricht.

### Kontext

Zwischen EIP und diesem Buch arbeitete Hohpe bei Google und dann mehrere Jahre als **Chefarchitekt bei der Allianz**, wo er die IT-Modernisierung eines großen Versicherungskonzerns begleitete. Später war er bei AWS. Das Buch sammelt und ordnet Texte aus seinem Blog und seinen Vorträgen aus dieser Zeit. Es erschien 2020 bei O'Reilly.

### Die Kernthese

In traditionellen Unternehmen sitzt die Geschäftsleitung im obersten Stock, die Technik im Maschinenraum, und dazwischen liegen viele Etagen voller Manager, Berichte und Gremien. Informationen gehen auf dem Weg nach oben und unten verloren oder werden verzerrt. **Der Architekt fährt mit dem Aufzug** zwischen diesen Etagen hin und her: Er versteht die Technik im Maschinenraum und kann sie der Geschäftsleitung so erklären, dass sie gute Entscheidungen treffen kann, und umgekehrt die Strategie in technische Konsequenzen übersetzen.

Daraus folgt: Die wichtigsten Fähigkeiten eines Architekten sind nicht nur technisch, sondern **Kommunikation, Verständnis von Organisationen und Führung von Veränderung**.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Architekten | Was Architekten tun, welche Rollen sie spielen, wie sie entscheiden |
| II. Architektur | Was Architektur ist, warum Systeme verfallen, Automatisierung, Standards |
| III. Kommunikation | Erklären, Schreiben, Zeichnen, Präsentieren |
| IV. Organisationen | Wie Organisationen funktionieren und warum Kontrolle eine Illusion ist |
| V. Transformation | Wie Veränderung gelingt und was sie kostet |

Die 37 Kapitel sind kurz, oft nur wenige Seiten, mit pointierten Titeln, Anekdoten und Merksätzen. Man kann sie einzeln lesen.

## Der Aufzug

{{< bild src="bild-1.png" alt="Hohpes Bild vom Architekten im Aufzug, nachgezeichnet" >}}

Hohpes Bild vom Architekten im Aufzug, nachgezeichnet

### Das Problem der Zwischenetagen

In großen Organisationen ist die Entfernung zwischen den Etagen enorm. Wer im Vorstand über „Cloud“ oder „KI“ entscheidet, weiß oft nicht, was das im Maschinenraum bedeutet. Wer im Maschinenraum arbeitet, versteht oft nicht, warum oben Entscheidungen fallen, die unten unsinnig wirken. Jede Etage dazwischen filtert, vereinfacht und verzerrt. Hohpe vergleicht es mit dem Kinderspiel Stille Post.

### Was der Architekt tut

- **Nach oben:** Technische Zusammenhänge so erklären, dass Entscheider sie verstehen, nicht als Fachbegriffe, sondern als **Optionen, Kosten, Risiken und Geschwindigkeit**.
- **Nach unten:** Strategische Ziele so übersetzen, dass Teams verstehen, was sie für ihre Arbeit bedeuten.
- **Auf jeder Etage:** die passende Sprache sprechen und das passende Detailniveau wählen.

### Warum es den Aufzug braucht

Hohpe betont, dass beide Enden wichtig sind:

- Ein Architekt, der nur noch im Penthouse sitzt, verliert den Kontakt zur Technik und wird zum „PowerPoint-Architekten“, dessen Folien nicht mehr der Wirklichkeit entsprechen.
- Ein Architekt, der nur im Maschinenraum bleibt, löst technische Probleme, ohne Einfluss auf die Entscheidungen zu haben, die diese Probleme verursachen.

Der Wert entsteht durch die **Fahrt selbst**: durch die Verbindung von Wissen, das sonst getrennt bliebe.

### Einordnung

Das Bild deckt sich mit dem, was Richards und Ford in *Fundamentals* als technische Breite und Verhandlungsfähigkeit beschreiben, und mit Newmans Architekt als Stadtplaner. Hohpe gibt dem Ganzen ein einprägsames Bild und betont stärker als die anderen den Weg **nach oben**, in die Geschäftsleitung.

## Rolle und Haltung von Architekten

### Architektenbilder

Hohpe beschreibt verschiedene Vorstellungen davon, was ein Architekt ist, teils mit Figuren aus Filmen. Sinngemäß zusammengefasst:

| Bild | Rolle | Hohpes Bewertung |
|---|---|---|
| **Der Allwissende** | entwirft alles und gibt vor, wie es zu bauen ist | passt nicht mehr zu komplexen, schnellen Umgebungen |
| **Der Fremdenführer** | kennt das System und erklärt es anderen | nützlich, aber passiv |
| **Der Gärtner** | schafft Bedingungen, unter denen ein System gut wächst, und schneidet zurück, wo nötig | näher am Ideal |
| **Der Superheld** | rettet Projekte in letzter Minute | schafft Abhängigkeit statt Fähigkeit |

Sein Ideal ist ein Architekt, der **andere klüger macht**, statt selbst alle Entscheidungen zu treffen. Das deckt sich mit Richards' und Fords wirksamem Architekten und Newmans Stadtplaner.

### Drei Standbeine

Hohpe nennt drei Dinge, die ein Architekt braucht:

| Standbein | Bedeutung |
|---|---|
| **Können** | technische Tiefe und Breite; die Fähigkeit, Systeme wirklich zu verstehen |
| **Wirkung** | nachweisbarer Einfluss auf Ergebnisse, nicht nur Dokumente |
| **Führung** | andere mitnehmen, überzeugen, befähigen |

Fehlt eines davon, kippt die Rolle: Können ohne Wirkung ist Hobby; Wirkung ohne Können ist Glück; beides ohne Führung skaliert nicht.

### Die erste Ableitung

Eines der bekanntesten Kapitel: **Architekten leben in der ersten Ableitung.** Gemeint ist die Ableitung nach der Zeit, also die Änderungsrate. In einer Welt, die sich langsam ändert, ist die beste Architektur die effizienteste. In einer Welt, die sich schnell ändert, ist die beste Architektur die, die **Änderungen billig macht**. Architekten sollen also nicht fragen, wie gut ein System heute ist, sondern wie schnell es sich anpassen kann.

### Architektur verkauft Optionen

Hohpe vergleicht Architekturentscheidungen mit **Finanzoptionen**: Eine Abstraktionsschicht, ein Vertrag, eine austauschbare Komponente kosten heute etwas und kaufen das Recht, später billig zu ändern. Wie bei Finanzoptionen steigt ihr Wert mit der **Unsicherheit**. In stabilen Umgebungen lohnen sich wenige Optionen, in unsicheren viele. Das ist Becks Optionswert aus *Tidy First?* und Martins „Optionen offenhalten“, mit einem klareren ökonomischen Argument, das man im Penthouse verwenden kann.

### Entscheidungen

Architekten treffen nicht unbedingt mehr Entscheidungen als andere, aber sie sollen **bessere Entscheidungen ermöglichen**: indem sie Annahmen sichtbar machen, Abwägungen benennen und verhindern, dass Entscheidungen zufällig oder aus Gewohnheit fallen. Hohpe warnt dabei vor typischen Denkfehlern, etwa der Neigung, Bekanntes zu überschätzen und Unsicherheiten zu ignorieren.

## Architektur

### Was ist Architektur?

Hohpe vermeidet eine abstrakte Definition und schlägt eine praktische Prüfung vor: Eine Architektur ist dann eine, wenn sie **bewusste Entscheidungen mit begründeten Abwägungen** enthält. Ein Diagramm mit Kästchen, das nur zeigt, was es gibt, ist noch keine Architektur. Erst wenn man sagen kann, warum es so ist und was man dafür aufgegeben hat, wird es eine. Das ist das zweite Gesetz von Richards und Ford: das Warum ist wichtiger als das Wie.

### Jedes System ist perfekt

Ein Satz, den Hohpe von anderen übernimmt, sinngemäß: **Jedes System ist perfekt darauf ausgelegt, genau die Ergebnisse zu erzeugen, die es erzeugt.** Wenn eine Organisation langsam ausliefert, ist das kein Zufall, sondern Folge ihrer Struktur, Anreize und Prozesse. Wer andere Ergebnisse will, muss das System ändern, nicht die Menschen ermahnen. Das ist DeMarcos und Listers soziologischer Blick in Systemsprache.

### Zombies

Unter einem Kapitel mit sinngemäß dem Titel „Wer nie etwas abschaltet, lebt unter Zombies“ beschreibt Hohpe ein typisches Problem großer IT-Landschaften: Systeme werden eingeführt, aber nie abgeschaltet. Jedes alte System kostet Wartung, Lizenzen, Sicherheitsupdates und Aufmerksamkeit. Die Landschaft wird immer komplexer, und die Organisation verliert Geschwindigkeit. Sein Rat: **Abschalten als eigene, geplante Tätigkeit** behandeln und belohnen. Das passt zu den Antipatterns Vendor King und Opferarchitektur aus *Building Evolutionary Architectures*.

### Automatisierung und Versionskontrolle

- **Keine Menschen für Maschinenarbeit:** Was wiederholbar ist, soll automatisiert werden; das ist Toil aus dem SRE-Buch.
- **Alles in die Versionskontrolle:** Infrastruktur, Konfiguration, Richtlinien. Was nicht versioniert ist, lässt sich nicht nachvollziehen; das ist Continuous Delivery in einem Satz.

### Standards

In einem Kapitel über **A4-Papier** argumentiert Hohpe, dass gute Standards Kreativität nicht behindern, sondern ermöglichen: Weil sich alle auf ein Papierformat geeinigt haben, kann man sich auf den Inhalt konzentrieren. Gute Standards gelten für Schnittstellen zwischen Teilen, nicht für das Innere. Das ist Newmans Rat, zwischen Diensten zu steuern und innerhalb der Dienste die Teams entscheiden zu lassen.

### Angst vor Code

Hohpe beobachtet in großen Unternehmen eine merkwürdige **Angst vor Code**: Man kauft lieber Produkte, die man konfiguriert, als selbst zu programmieren, weil Code als riskant gilt. Das Ergebnis sind oft Konfigurationen, die so komplex sind wie Code, aber ohne Tests, Versionskontrolle und Werkzeuge. Das ist die Falle der letzten zehn Prozent aus *Building Evolutionary Architectures*.

## Kommunikation

Der dritte Teil ist der praktischste des Buchs und für viele Leser der wertvollste. Seine Botschaft: **Ein Architekt, der nicht verstanden wird, hat keine Wirkung**, egal wie gut seine Ideen sind.

### Grundsätze

| Grundsatz | Bedeutung |
|---|---|
| **Eine Rampe bauen** | Beim Erklären dort anfangen, wo das Publikum steht, und Schritt für Schritt aufsteigen, statt mit dem eigenen Wissen einzusteigen. |
| **Das Echte zeigen** | Eine kurze Vorführung eines laufenden Systems überzeugt mehr als zwanzig Folien. |
| **Für Beschäftigte schreiben** | Die Schlussfolgerung zuerst; Überschriften, die die Aussage tragen; kurze Absätze. Viele lesen nur den ersten Absatz. |
| **Betonung statt Vollständigkeit** | Was man weglässt, hebt hervor, was bleibt. Ein vollständiges Bild ist oft ein unverständliches. |
| **Diagrammgetriebener Entwurf** | Wenn sich ein System schwer zeichnen lässt, ist oft der Entwurf das Problem, nicht das Diagramm. |
| **Die Linien zählen** | In Architekturdiagrammen sind die Verbindungen wichtiger als die Kästchen: Was fließt wohin, synchron oder asynchron, wer hängt von wem ab? |
| **Bankräuber skizzieren** | Ein System so beschreiben wie ein Zeuge einen Bankräuber: mit den wenigen auffälligen Merkmalen, die es von anderen unterscheiden, nicht mit allem, was es mit anderen gemeinsam hat. |

### Formulierungsbeispiele: Technik für das Penthouse

Die folgende Tabelle überträgt Hohpes Ansatz auf typische Situationen. Sie ist nicht aus dem Buch übernommen, sondern zeigt, wie man seine Grundsätze anwendet.

| Statt | Besser |
|---|---|
| „Wir haben hohe technische Schulden im Bestellsystem.“ | „Eine neue Zahlungsart einzubauen dauert heute acht Wochen. Mit drei Monaten Aufräumarbeit wären es zwei. Das lohnt sich ab der zweiten Zahlungsart.“ |
| „Wir müssen auf Microservices umstellen.“ | „Das Vertriebsteam wartet bei jedem Release auf das Lagerteam. Wenn wir die beiden Bereiche trennen, kann der Vertrieb wöchentlich ausliefern statt quartalsweise.“ |
| „Das Framework ist veraltet.“ | „Für unsere Version gibt es ab nächstem Jahr keine Sicherheitsupdates. Ein Angriff wie bei Equifax wäre dann möglich. Das Update kostet zwei Teammonate.“ |
| „Wir brauchen Kubernetes.“ | „Heute dauert es zwei Wochen, eine neue Umgebung bereitzustellen. Mit einer Container-Plattform wären es Minuten. Das beschleunigt jedes Projekt, das eine Testumgebung braucht.“ |
| „Die Architektur erlaubt das nicht.“ | „Das geht, kostet aber X. Die Alternative Y kostet weniger, hat aber Nachteil Z. Welche Option passt besser zu Ihrem Ziel?“ |

Das Muster: **Ergebnis statt Technik, Zahlen statt Adjektive, Optionen statt Verbote.**

### Ein Dokument für Beschäftigte

Hohpes Rat zum Schreiben lässt sich als Vorlage nutzen:

1. **Erster Satz:** die Empfehlung oder Schlussfolgerung.
2. **Zweiter Absatz:** warum, in zwei bis drei Sätzen.
3. **Überschriften als Aussagen:** „Die Migration spart 40 Prozent Betriebskosten“ statt „Kosten“.
4. **Details am Ende** oder im Anhang, für die, die sie brauchen.

Das ist genau das, was Richards und Ford in *The Hard Parts* raten: das Ergebnis vor die Belege stellen.

## Organisationen verstehen

Der vierte Teil wendet Architekturdenken auf Organisationen an. Hohpes Grundgedanke: **Organisationen sind Systeme**, und viele Begriffe aus der Systemarchitektur passen erstaunlich gut.

### Organisationen wie Systeme lesen

| Systembegriff | In der Organisation |
|---|---|
| **Synchrone Aufrufe** | Besprechungen, Freigaben, Warten auf Antworten; skaliert schlecht |
| **Asynchrone Nachrichten** | Dokumente, Tickets, Chat; skaliert besser, braucht aber gute Beschreibungen |
| **Warteschlangen** | Freigabeprozesse, Ticketsysteme; lange Schlangen bedeuten lange Durchlaufzeiten |
| **Rückkopplung** | Kennzahlen, Retrospektiven, Kundendaten; kurze Schleifen ermöglichen schnelles Lernen |
| **Kopplung** | Abhängigkeiten zwischen Abteilungen; jede bedeutet Abstimmung |

Wer EIP und Kleppmann kennt, hat damit ein Werkzeug, Organisationsprobleme zu benennen. Das ist Conways Gesetz in umgekehrter Richtung: Man versteht die Organisation, indem man sie wie eine Architektur liest.

### Organisationen rückwärts verstehen

Nicht das Organigramm zeigt, wie eine Organisation funktioniert, sondern ihr **Verhalten**: Wer wird wann gefragt? Wo warten Dinge? Was wird belohnt? Hohpe rät, Organisationen zu beobachten wie ein Reverse Engineer ein unbekanntes System.

### Kontrolle ist eine Illusion

Manager glauben oft, sie hätten Kontrolle, weil sie Berichte erhalten und Pläne genehmigen. Tatsächlich zeigen Berichte die Vergangenheit, oft gefiltert, und Pläne beschreiben eine Zukunft, die selten eintritt. Echte Steuerung entsteht durch **kurze Rückkopplungsschleifen**: schnell ausliefern, messen, anpassen. Das ist das Argument von Accelerate und Continuous Delivery, aus Managementsicht.

### Schwarzmärkte

Wenn offizielle Prozesse zu langsam sind, entstehen **Schwarzmärkte**: informelle Wege, auf denen Dinge doch erledigt werden, etwa über persönliche Kontakte, Ausnahmen oder Schatten-IT. Sie wirken effizient, sind es aber nicht: Sie sind intransparent, hängen an Einzelpersonen und funktionieren nur für die, die die richtigen Leute kennen. Die Lösung ist nicht, Schwarzmärkte zu verbieten, sondern den **offiziellen Weg schneller zu machen**.

### Langsames Chaos ist keine Ordnung

Schwerfällige Prozesse mit vielen Freigaben erzeugen den Eindruck von Ordnung. Darunter herrscht oft Chaos: Projekte, die niemand wirklich steuert, Entscheidungen, die zu spät fallen, und Systeme, die auseinanderdriften. Hohpe nennt das **langsames Chaos**. Wirkliche Ordnung entsteht durch schnelle, automatisierte Prozesse mit klaren Regeln.

### Steuerung durch Einpflanzen

In Anspielung auf den Film *Inception* beschreibt Hohpe **Steuerung durch Einpflanzen**: Statt Regeln vorzuschreiben und zu kontrollieren, macht man den richtigen Weg zum einfachsten. Eine Plattform mit sicheren Voreinstellungen, Vorlagen und Werkzeugen sorgt dafür, dass Teams von sich aus das Richtige tun. Das ist der gepflasterte Weg aus *Building Microservices*, Team Topologies' Plattform und die Governance durch Fitness Functions aus *Building Evolutionary Architectures*.

## Transformation

Der fünfte Teil handelt davon, wie große Organisationen sich verändern, und warum es so oft misslingt.

### Skaleneffekte gegen Geschwindigkeitseffekte

Eine der zentralen Ideen des Buchs: Traditionelle IT ist auf **Skaleneffekte** ausgelegt. Große Einkäufe, standardisierte Prozesse, zentrale Rechenzentren, lange Projekte: Alles soll durch Größe billiger werden. Digitale Unternehmen leben von **Geschwindigkeitseffekten**: Wer schneller lernt und ausliefert, gewinnt, auch wenn jede einzelne Einheit teurer ist.

| Ausgerichtet auf Skaleneffekte | Ausgerichtet auf Geschwindigkeit |
|---|---|
| große Releases, wenige Termine | kleine, häufige Auslieferungen |
| zentrale Standardisierung | Plattformen mit Freiraum für Teams |
| Kosten pro Einheit minimieren | Durchlaufzeit minimieren |
| Auslastung maximieren | Wartezeiten minimieren |
| Planung im Voraus | Lernen durch Ausprobieren |

Das ist die ökonomische Begründung für Accelerate, Continuous Delivery und Team Topologies in einer Form, die man im Vorstand vortragen kann.

### Wer steht gern Schlange?

Hohpe erklärt mit Warteschlangentheorie, warum **hohe Auslastung lange Wartezeiten** erzeugt: Wenn ein Freigabegremium, ein Betriebsteam oder ein Architekt zu neunzig Prozent ausgelastet ist, warten Anfragen sehr viel länger als bei siebzig Prozent. Organisationen, die auf volle Auslastung optimieren, werden langsam. Das ist DeMarcos *Slack*, Nygards Sättigung und das Argument der SRE-Kapitel über Überlast, auf Menschen angewandt.

### Ohne Schmerz keine Veränderung

Organisationen ändern sich nur, wenn der Leidensdruck groß genug ist. Ist er zu klein, fehlt der Anlass; ist er zu groß, reagieren Menschen mit Abwehr. Der Architekt kann helfen, den Schmerz **sichtbar** zu machen, etwa mit Zahlen zu Durchlaufzeiten oder Ausfällen, und gleichzeitig einen glaubwürdigen Weg heraus zu zeigen.

### Veränderung führen

- **Klein anfangen** und Ergebnisse zeigen, statt große Transformationsprogramme anzukündigen.
- **Verbündete suchen** auf allen Etagen.
- **Eigene Fähigkeiten aufbauen:** Unter Titeln wie sinngemäß „Man kann IT nicht vortäuschen“ und „Mit Geld kann man keine Liebe kaufen“ warnt Hohpe davor, digitale Transformation bei Beratern oder Herstellern einzukaufen. Kultur, Können und Geschwindigkeit muss eine Organisation selbst entwickeln.
- **Die endlose Schleife:** bauen, messen, lernen, und das immer wieder. Transformation ist kein Projekt mit Enddatum.

### Vier Dimensionen

Das letzte Kapitel des Teils erinnert daran, dass Architektur nicht nur drei räumliche Dimensionen hat, sondern auch **Zeit**: Systeme, Teams und Organisationen verändern sich, und eine gute Architektur beschreibt nicht nur einen Zustand, sondern den Weg dorthin und die Fähigkeit, ihn weiterzugehen. Das schließt den Kreis zur ersten Ableitung und zu *Building Evolutionary Architectures*.

## Übungen für die Praxis

Die folgenden Übungen setzen Hohpes Ideen in konkrete Schritte um. Sie stammen nicht aus dem Buch, sondern sind für diese Zusammenfassung entworfen.

### 1. Die Aufzugsfahrt

Nimm eine aktuelle technische Entscheidung, etwa ein Framework-Update oder eine Datenbankmigration, und erkläre sie in drei Fassungen:

| Etage | Länge | Inhalt |
|---|---|---|
| Vorstand | drei Sätze | Was gewinnen oder riskieren wir, in Geld, Zeit oder Kundennutzen? |
| Management | eine Seite | Optionen, Kosten, Zeitplan, Abhängigkeiten |
| Team | ein technisches Gespräch | Wie genau, mit welchen Werkzeugen und Schritten |

Wenn die Vorstandsfassung ohne Fachbegriffe nicht gelingt, ist die Entscheidung vermutlich noch nicht klar genug begründet.

### 2. Der Bankräuber

Beschreibe dein wichtigstes System in **fünf Sätzen**, die es von allen anderen Systemen unterscheiden. Nicht „es hat eine Datenbank und eine REST-API“, sondern das, was nur dieses System hat: besondere Lastspitzen, ungewöhnliche Konsistenzanforderungen, eine historische Eigenheit.

### 3. Zombie-Inventur

Liste die Systeme oder Komponenten in deinem Verantwortungsbereich auf, die niemand mehr aktiv weiterentwickelt, die aber noch laufen. Schätze für jedes: Was kostet es im Jahr? Wer würde merken, wenn es fehlt? Was wäre nötig, um es abzuschalten?

### 4. Schwarzmarkt-Suche

Frage dich und dein Team: Welche Dinge erledigt ihr am offiziellen Prozess vorbei, weil der offizielle Weg zu langsam ist? Jeder gefundene Schwarzmarkt zeigt einen Prozess, der verbessert werden sollte.

### 5. Warteschlangen sichtbar machen

Verfolge eine Änderung vom Wunsch bis zur Auslieferung und notiere, wie viel Zeit sie mit **Arbeiten** und wie viel mit **Warten** verbracht hat: auf Freigaben, Umgebungen, Antworten, Besprechungen. In vielen Organisationen ist das Verhältnis erschreckend. Das ist eine einfache Form der Wertstromanalyse und liefert die Zahlen für die Vorstandsfassung aus Übung 1.

### 6. Ein Diagramm mit Bedeutung

Nimm ein bestehendes Architekturdiagramm und beschrifte **jede Linie**: Was fließt dort, synchron oder asynchron, in welche Richtung, mit welchem Vertrag? Wenn sich eine Linie nicht beschriften lässt, wisst ihr vermutlich nicht genau, was sie bedeutet.

## Kritik und Einordnung

### Stärken

- **Ein starkes Bild:** Der Aufzug ist sofort verständlich und lässt sich in jedem Gespräch über die Architektenrolle verwenden.
- **Aus der Praxis eines Großkonzerns:** Hohpe schreibt aus eigener Erfahrung in einer traditionellen Organisation, nicht aus der Sicht eines Startups oder Beraters.
- **Systemdenken für Organisationen:** Die Übertragung von Warteschlangen, Kopplung und Rückkopplung auf Organisationen ist für technisch denkende Leser besonders zugänglich.
- **Praktische Kommunikationsratschläge:** Die Kapitel über Schreiben und Zeichnen sind sofort anwendbar.
- **Ökonomische Argumente:** Optionen und Geschwindigkeitseffekte liefern Sprache für Gespräche mit der Geschäftsführung.

### Kritikpunkte

**1. Lose Sammlung.** Das Buch ist aus Blogartikeln entstanden. Manche Kapitel überschneiden sich, und ein durchgehender Argumentationsbogen fehlt teilweise.

**2. Großunternehmen als Maßstab.** Viele Probleme, etwa viele Zwischenetagen, Schwarzmärkte und Zombie-Systeme, gibt es in kleineren Organisationen kaum. Für ein mittelständisches Unternehmen ist nicht alles übertragbar.

**3. Wenig Methodik.** Das Buch liefert Haltungen und Bilder, aber wenig konkrete Werkzeuge. Wer wissen will, wie man Architekturentscheidungen mit Teams gemeinsam trifft, findet bei Harmel-Law mehr.

**4. Pointen statt Belege.** Viele Aussagen beruhen auf Erfahrung und eingängigen Vergleichen. Sie sind überzeugend, aber selten mit Daten unterlegt. Accelerate liefert dazu die empirische Ergänzung.

**5. Die Rolle des Architekten wird groß gezeichnet.** In Organisationen mit selbstständigen Teams und Staff Engineers ist der Aufzug oft auf mehrere Personen verteilt. Reilly beschreibt diese Variante.

### Gesamturteil

Ein unterhaltsames, kluges Buch für erfahrene Entwickler und Architekten, die in großen Organisationen Wirkung entfalten wollen. Am meisten bringt es Lesern, die die technischen Bücher der Reihe kennen und nun lernen wollen, deren Inhalte in die Sprache von Entscheidern zu übersetzen.

## Bezüge zur Reihe

| Thema bei Hohpe | Bezug in der Reihe |
|---|---|
| Architekt verbindet Etagen | Richards und Ford: Breite, Verhandlung; Newman: Stadtplaner |
| Andere klüger machen | Richards und Ford: wirksamer Architekt; Team Topologies: Enabling Teams |
| Erste Ableitung, Änderbarkeit | Thomas und Hunt: ETC; Ford u.a.: evolutionäre Architektur |
| Architektur verkauft Optionen | Beck: Optionswert; Martin: Optionen offenhalten |
| Architektur heißt begründete Entscheidungen | Richards und Ford: Warum vor Wie; Nygard: ADRs |
| Jedes System ist perfekt für seine Ergebnisse | DeMarco und Lister: soziologische Probleme; Conway |
| Zombies abschalten | Ford u.a.: Vendor King; Brooks: Zweitsystemeffekt |
| Keine Menschen für Maschinenarbeit | SRE: Toil |
| Standards für Schnittstellen | Newman: zwischen Diensten steuern; Hohpe und Woolf: Formate |
| Angst vor Code, Konfiguration statt Programmierung | Ford u.a.: Falle der letzten zehn Prozent |
| Linien wichtiger als Kästchen | Richards und Ford: Diagramme; Simon Brown: C4 |
| Organisationen als Systeme | Conway; Team Topologies; Hohpe und Woolf: synchron gegen asynchron |
| Kontrolle ist eine Illusion, kurze Rückkopplung | Accelerate; Continuous Delivery |
| Steuerung durch Einpflanzen | Team Topologies: Plattform; Newman: Paved Road; Ford u.a.: Fitness Functions |
| Geschwindigkeit statt Skala | Accelerate; Continuous Delivery |
| Auslastung erzeugt Warteschlangen | DeMarco: *Slack*; SRE: Überlast; Nygard: Sättigung |

## Diskussionsfragen

1. **Aufzug:** Auf welchen Etagen bewegst du dich heute? Welche erreichst du selten, und was entgeht dir dadurch?
2. **Übersetzung:** Wann hast du zuletzt eine technische Entscheidung so erklärt, dass jemand ohne IT-Hintergrund sie verstanden und mitentschieden hat?
3. **Optionen:** Welche Optionen in eurer Architektur waren den Preis wert, und welche haben nur Komplexität erzeugt?
4. **Zombies:** Welches System würdest du abschalten, wenn du allein entscheiden könntest? Was hindert euch?
5. **Schwarzmärkte:** Welche informellen Wege nutzt ihr, um offizielle Prozesse zu umgehen?
6. **Auslastung:** Gibt es bei euch Personen oder Gremien, die ständig ausgelastet sind und auf die alle warten?
7. **Rolle:** Hohpes Architekt ist ein Übersetzer und Gärtner, kein Entwerfer. Entspricht das deiner Erfahrung?
8. **Weiter:** Als Nächstes Tanya Reillys *The Staff Engineer's Path*, das die technische Führungsrolle ohne Personalverantwortung beschreibt.

{{< anmerkung >}}
Das Buch hat nicht 37, sondern 41 Kapitel: 40 in den fünf Teilen und eines im Epilog (Inhaltsverzeichnis bei Schweitzer Fachinformationen). Die 37 stammt vermutlich aus dem Titel von Hohpes früherem Buch *37 Things One Architect Knows About IT Transformation*.
{{< /anmerkung >}}
