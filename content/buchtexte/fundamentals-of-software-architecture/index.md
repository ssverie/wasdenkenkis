+++
title = "Fundamentals of Software Architecture – Zusammenfassung und Einordnung"
description = "Mark Richards, Neal Ford, Fundamentals of Software Architecture: A Modern Engineering Approach (2020, 2. Auflage 2025)"
date = 2026-10-30T19:10:43+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["fundamentals-of-software-architecture-2025"]
+++

## Einleitung

Nach Martins Clean Architecture, die im Kern eine einzige Architektur vorschlägt, ist dieses Buch das Gegenstück: ein **Überblick über viele Architekturstile und die Abwägungen zwischen ihnen**, dazu die Fähigkeiten, die ein Architekt neben der Technik braucht. Die Kernthese steckt im ersten Gesetz des Buchs: **Alles in der Softwarearchitektur ist eine Abwägung.**

### Autoren und Kontext

Mark Richards und Neal Ford sind erfahrene Architekten und Trainer. Ford war lange bei ThoughtWorks und ist Mitautor von *Building Evolutionary Architectures*, das den Begriff der **Fitness Functions** geprägt hat. Richards hat mehrere Bücher über Architekturmuster und Microservices geschrieben. Gemeinsam schrieben sie auch *Software Architecture: The Hard Parts* und *Head First Software Architecture*.

|  | 1. Auflage (2020) | 2. Auflage (2025) |
|---|---|---|
| Umfang | rund 420 Seiten | rund 550 Seiten |
| Neue Kapitel | – | modularer Monolith als eigener Stil; Architekturmuster wie CQRS und Orchestrierung gegen Choreografie; Überschneidungen der Architektur mit Daten, Teams, Infrastruktur und generativer KI; die Gesetze der Softwarearchitektur überarbeitet |
| Stilkapitel | Topologie, Merkmale, Bewertungen | zusätzlich Abschnitte zu Datentopologie, Cloud, Teamtopologien und Governance |

Diese Zusammenfassung bezieht sich auf die zweite Auflage.

### Was Architektur ist

Die Autoren beschreiben Architektur über **vier Dimensionen**:

| Dimension | Bedeutung |
|---|---|
| **Struktur** | der Architekturstil, etwa Schichten, Microservices, Ereignisse |
| **Architekturmerkmale** | die nichtfunktionalen Eigenschaften, die das System haben muss, etwa Skalierbarkeit, Verfügbarkeit, Sicherheit |
| **Architekturentscheidungen** | verbindliche Regeln, wie das System gebaut wird, etwa „nur die Service-Schicht greift auf die Datenbank zu“ |
| **Designprinzipien** | Richtlinien statt Regeln, etwa „asynchrone Kommunikation bevorzugen“ |

Nur alle vier zusammen beschreiben eine Architektur. Ein Diagramm mit Kästchen zeigt bestenfalls die erste.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Grundlagen | architektonisches Denken, Modularität, Architekturmerkmale, Messen und Steuern, Reichweite, Komponenten |
| II. Architekturstile | Schichten, modularer Monolith, Pipeline, Microkernel, Service-basiert, ereignisgesteuert, Space-based, orchestrierte SOA, Microservices; Wahl des Stils; Muster |
| III. Techniken und Soft Skills | Entscheidungen, Risiko, Diagramme, Teams, Verhandlung und Führung, Überschneidungen, die Gesetze neu betrachtet |

Der Ton ist sachlich und abwägend, mit vielen Beispielen aus der Beratungspraxis und Fragen zur Diskussion am Ende jedes Kapitels.

## Die Gesetze der Softwarearchitektur

Das Buch stellt seine Grundhaltung in Form von Gesetzen voran und greift sie im letzten Kapitel der zweiten Auflage noch einmal auf.

| Gesetz | Inhalt |
|---|---|
| **Erstes Gesetz** | Alles in der Softwarearchitektur ist eine Abwägung. |
| **Folgerung** | Wer glaubt, etwas gefunden zu haben, das keine Abwägung ist, hat die Abwägung vermutlich nur noch nicht entdeckt. |
| **Zweites Gesetz** | Das Warum ist wichtiger als das Wie. Wer eine Architektur verstehen will, muss wissen, warum Entscheidungen so getroffen wurden. |
| **Neu in der 2. Auflage** | Nach meiner Kenntnis betont das neue Gesetz, dass Architekturentscheidungen selten binär sind, sondern meist auf einem Spektrum zwischen Extremen liegen. Dazu kommt eine weitere Folgerung. Die genaue Formulierung sollte man im Original prüfen. |

Daraus folgt der vielleicht wichtigste praktische Rat des Buchs: Es gibt keine beste Architektur, sondern nur die **am wenigsten schlechte** für die Anforderungen einer bestimmten Situation.

## Architektonisches Denken

Was unterscheidet einen Architekten von einem Entwickler? Die Autoren nennen vier Aspekte.

### Architektur und Design

Statt einer strikten Trennung, in der Architekten entscheiden und Entwickler umsetzen, sehen die Autoren ein **Kontinuum**: Architektur und Design gehen ineinander über, und Architekten und Entwickler müssen ständig miteinander reden. Das widerspricht Brooks' Aristokratie und entspricht Evans' Hands-on Modelers.

### Technische Breite statt Tiefe

Wissen lässt sich als Pyramide denken: an der Spitze, was man kennt, darunter, wovon man weiß, dass man es nicht kennt, und an der Basis, wovon man nicht einmal weiß, dass man es nicht kennt. Entwickler bauen Tiefe auf, Architekten brauchen **Breite**: viele Lösungen kennen, um für ein Problem die passende auswählen zu können. Das deckt sich mit Thomas' und Hunts Wissensportfolio.

### Abwägungen analysieren

Architekten sollen bei jeder Lösung fragen: Was gewinne ich, was verliere ich? Beispiel aus dem Buch, sinngemäß: Eine Nachricht über eine **Warteschlange** an genau einen Empfänger zu senden ist sicher und kontrolliert, aber bei jedem neuen Empfänger muss der Sender geändert werden. Ein **Topic** mit vielen Empfängern ist erweiterbar, aber jeder kann mitlesen, und unterschiedliche Formate pro Empfänger sind schwieriger.

### Geschäftliche Treiber verstehen

Architektur dient geschäftlichen Zielen. Wer die Treiber nicht versteht, wählt die falschen Merkmale. Ein System, das an einem einzigen Tag im Jahr extremen Ansturm hat, braucht andere Eigenschaften als eines mit gleichmäßiger Last.

### Die Hand am Code

Architekten sollen weiter programmieren, aber nicht auf dem kritischen Pfad, weil sie sonst zum Engpass werden. Die Autoren schlagen Prototypen, Werkzeuge, technische Schulden und Code-Reviews als passende Aufgaben vor.

## Modularität

Modularität ist ein **Organisationsprinzip**, keine Eigenschaft, die ein System einfach hat. Die Autoren stellen drei Arten vor, sie zu messen: Kohäsion, Kopplung und Konnaszenz.

### Kohäsion und Kopplung

- **Kohäsion:** Wie eng gehören die Teile eines Moduls zusammen? Die Autoren nutzen dieselbe Skala von funktional bis zufällig, die McConnell beschreibt, und eine Kennzahl für fehlende Kohäsion, die zählt, wie viele Methoden keine gemeinsamen Felder nutzen.
- **Kopplung:** eingehende und ausgehende Abhängigkeiten, daraus abgeleitet Martins Abstraktheit, Instabilität und Abstand zur Hauptreihe, wie in der Clean-Architecture-Zusammenfassung beschrieben.

### Konnaszenz

Der interessantere Teil: **Konnaszenz** nach Meilir Page-Jones. Zwei Komponenten sind konnaszent, wenn eine Änderung an der einen eine Änderung an der anderen erfordert, damit das System korrekt bleibt. Das ist fast wörtlich Becks Definition von Kopplung relativ zur Änderung aus Tidy First?, aber feiner abgestuft.

**Statische Konnaszenz**, im Quellcode sichtbar, von schwach nach stark:

| Art | Beispiel |
|---|---|
| Name | Aufrufer und Methode müssen denselben Namen verwenden |
| Typ | beide müssen sich auf denselben Typ einigen |
| Bedeutung | beide müssen wissen, dass `1` „aktiv“ bedeutet |
| Position | beide müssen die Reihenfolge der Parameter kennen |
| Algorithmus | beide müssen denselben Algorithmus verwenden, etwa denselben Hash |

**Dynamische Konnaszenz**, erst zur Laufzeit sichtbar, ebenfalls aufsteigend:

| Art | Beispiel |
|---|---|
| Ausführungsreihenfolge | `open()` muss vor `send()` aufgerufen werden |
| Zeit | zwei Vorgänge müssen zeitlich zusammenpassen, etwa bei Wettlaufsituationen |
| Werte | mehrere Werte müssen sich gemeinsam ändern, etwa Kontostände bei einer Überweisung |
| Identität | mehrere Komponenten müssen auf dasselbe Objekt verweisen |

```java
// Konnaszenz der Bedeutung: beide Seiten müssen wissen, was 2 heißt
if (order.status() == 2) { … }

// abgeschwächt zu Konnaszenz des Namens
if (order.status() == OrderStatus.SHIPPED) { … }

// Konnaszenz der Position: Reihenfolge leicht zu verwechseln
new Transfer("DE01…", "DE02…", 100);

// abgeschwächt zu Konnaszenz des Typs
new Transfer(new SourceIban("DE01…"), new TargetIban("DE02…"), Money.euro(100));
```

### Eigenschaften und Regeln

Konnaszenz hat drei Eigenschaften: **Stärke** (wie schwer sie zu ändern ist), **Lokalität** (wie nah die betroffenen Teile beieinander liegen) und **Grad** (wie viele Teile betroffen sind). Daraus folgen Faustregeln:

- Starke Konnaszenz zu schwacher umbauen, etwa Bedeutung zu Name.
- Starke Konnaszenz nur **lokal** zulassen, innerhalb eines Moduls, nicht über Grenzen hinweg.
- Den Grad gering halten: Je mehr Teile betroffen sind, desto teurer jede Änderung.

### Einordnung

Konnaszenz ist das präziseste Werkzeug zur Beschreibung von Kopplung, das in dieser Reihe auftaucht. Es erklärt in einer Sprache, warum Fowlers Replace Primitive with Object, Blochs Enums statt int-Konstanten, McConnells „keine versteckten Bedeutungen“ und Becks Explaining Constants alle dasselbe tun: Sie schwächen Konnaszenz ab.

## Architekturmerkmale

Architekturmerkmale, im Alltag oft „nichtfunktionale Anforderungen“ oder „-ilities“ genannt, sind für die Autoren das eigentliche Material der Architektur. Ein Merkmal erfüllt drei Bedingungen: Es betrifft nicht die Fachlichkeit, es beeinflusst die Struktur des Systems, und es ist entscheidend für den Erfolg.

### Drei Gruppen

| Gruppe | Beispiele |
|---|---|
| **Betrieblich** | Verfügbarkeit, Kontinuität, Leistung, Wiederherstellbarkeit, Zuverlässigkeit, Robustheit, Skalierbarkeit, Elastizität |
| **Strukturell** | Konfigurierbarkeit, Erweiterbarkeit, Installierbarkeit, Wiederverwendbarkeit, Lokalisierbarkeit, Wartbarkeit, Portabilität, Aktualisierbarkeit |
| **Querschnittlich** | Barrierefreiheit, Archivierbarkeit, Authentifizierung, Autorisierung, rechtliche Anforderungen, Datenschutz, Sicherheit, Unterstützbarkeit, Benutzbarkeit |

### Merkmale finden

- **Aus fachlichen Anliegen übersetzen:** Fachleute sprechen nicht von Elastizität, sondern von „wir haben am Black Friday zehnmal so viele Kunden“. Architekten übersetzen das in Merkmale.
- **Aus Anforderungen ableiten:** etwa „Prüfungsergebnisse müssen bis 18 Uhr veröffentlicht sein“ führt zu Leistung und Elastizität.
- **Implizite Merkmale erkennen:** Sicherheit, Verfügbarkeit und Wartbarkeit werden selten ausdrücklich gefordert, sind aber fast immer nötig.

### Weniger ist mehr

Der vielleicht wichtigste Rat: **Nicht zu viele Merkmale unterstützen.** Jedes Merkmal erhöht die Komplexität und steht in Spannung zu anderen. Wer alles will, baut eine „generische Architektur“, die nichts gut kann. Die Autoren empfehlen, die drei wichtigsten Merkmale mit den Fachleuten auszuwählen, nicht nach Rangfolge aller, sondern als bewusste Auswahl.

## Messen und Steuern

Merkmale sind nur nützlich, wenn man sie messen kann.

| Art | Beispiel |
|---|---|
| Betrieblich | Antwortzeiten als Perzentile, Fehlerraten, Verfügbarkeit |
| Strukturell | zyklomatische Komplexität, Abhängigkeiten, Konnaszenz |
| Prozess | Testabdeckung, Deployment-Häufigkeit und -Erfolg, wie bei Accelerate |

### Fitness Functions

Der Begriff stammt aus *Building Evolutionary Architectures*: Eine **Fitness Function** ist jeder Mechanismus, der objektiv prüft, ob ein Architekturmerkmal noch erfüllt ist. Das können automatische Tests, Metriken im Monitoring, Lasttests oder sogar Chaos-Experimente sein. Sie laufen idealerweise in der Pipeline und verhindern, dass die Architektur unbemerkt verfällt.

```java
// Fitness Functions mit ArchUnit
@AnalyzeClasses(packages = "com.example.shop")
class ArchitectureFitnessTest {

    @ArchTest
    static final ArchRule noCycles = slices().matching("com.example.shop.(*)..")
        .should().beFreeOfCycles();

    @ArchTest
    static final ArchRule domainIsFrameworkFree = noClasses().that().resideInAPackage("..domain..")
        .should().dependOnClassesThat().resideInAnyPackage("org.springframework..", "jakarta.persistence..");

    @ArchTest
    static final ArchRule layers = layeredArchitecture().consideringAllDependencies()
        .layer("Web").definedBy("..web..")
        .layer("Application").definedBy("..application..")
        .layer("Domain").definedBy("..domain..")
        .whereLayer("Web").mayNotBeAccessedByAnyLayer()
        .whereLayer("Application").mayOnlyBeAccessedByLayers("Web");
}
```

### Einordnung

Fitness Functions sind das Bindeglied zwischen Architektur und Tests. Sie machen aus Martins Dependency Rule und Simon Browns Rat, Grenzen durchzusetzen, ausführbare Prüfungen, und sie übertragen Nygards Test Harness und Chaos Engineering auf die Architekturebene.

## Architekturquanten

Architekturmerkmale gelten nicht unbedingt für das ganze System. Die Autoren führen dafür den Begriff **Architekturquant** ein: ein **unabhängig auslieferbarer Teil** mit hoher fachlicher Kohäsion, der zur Laufzeit synchron zusammenarbeitet. Ein Quant ist die Einheit, für die man Merkmale festlegt.

Ihr Beispiel ist ein Online-Auktionssystem, hier sinngemäß:

| Teil | Wichtige Merkmale |
|---|---|
| Bieter-Oberfläche | Skalierbarkeit und Elastizität, weil Tausende gleichzeitig bieten |
| Auktionator-Oberfläche | Zuverlässigkeit und Verfügbarkeit, weil wenige, aber wichtige Nutzer |
| Zahlungsabwicklung | Sicherheit und Datenkonsistenz |

In einem Monolithen müssten alle Teile die höchsten Anforderungen erfüllen. Mit getrennten Quanten bekommt jeder Teil nur die Merkmale, die er braucht.

### Synchrone Kopplung verbindet Quanten

Ein wichtiger Gedanke: Wenn ein Dienst einen anderen **synchron** aufruft, teilen sie während des Aufrufs ihre betrieblichen Merkmale. Ein hochskalierbarer Dienst, der synchron einen schlecht skalierenden aufruft, ist im Ergebnis schlecht skalierbar. Asynchrone Kommunikation entkoppelt Quanten dagegen. Das ist Nygards Analyse von Integrationspunkten und Kaskadenausfällen, aus der Sicht der Architekturmerkmale.

## Komponentenbasiertes Denken

Komponenten sind die **logischen Bausteine** eines Systems, in Java meist Pakete oder Module. Wie man sie schneidet, ist eine der ersten Architekturentscheidungen.

### Technisch oder fachlich partitionieren

|  | Technische Partitionierung | Fachliche Partitionierung |
|---|---|---|
| Struktur | nach Schichten: Präsentation, Geschäftslogik, Persistenz | nach Fachbereichen: Bestellung, Katalog, Versand |
| Stärke | klare Trennung technischer Belange, vertraut | eine fachliche Änderung bleibt in einem Teil; passt zu DDD und Team Topologies |
| Schwäche | eine fachliche Änderung durchzieht alle Schichten | technischer Code kann dupliziert werden |

Das ist der Unterschied, den Martin mit der schreienden Architektur beschreibt, und der Grund, warum Conway und Team Topologies fachliche Teams empfehlen.

### Komponenten finden

Die Autoren beschreiben einen iterativen Ablauf: erste Komponenten festlegen, Anforderungen zuordnen, Rollen und Verantwortlichkeiten prüfen, Architekturmerkmale prüfen, umstrukturieren, wiederholen. Als Ausgangspunkt nennen sie unter anderem die Analyse von Akteuren und ihren Aktionen, Event Storming und die Analyse von Arbeitsabläufen.

### Die Entity-Falle

Ein häufiges Antipattern: Komponenten werden einfach nach Datenbanktabellen gebildet, etwa `CustomerManager`, `OrderManager`, `ProductManager`, die jeweils nur Daten lesen und schreiben. Die eigentliche Logik verteilt sich dann über alle diese Komponenten, und jede fachliche Änderung braucht mehrere. Das ist Evans' anämisches Domänenmodell auf Komponentenebene und Martins Katzenproblem.

### Einordnung

Das Architekturquant ist eine nützliche Präzisierung dessen, was Accelerate mit „unabhängig auslieferbar“ und Team Topologies mit „teamgroßer Architektur“ meinen. Es zeigt, dass die Frage nach Monolith oder Microservices eigentlich die Frage ist, **wie viele unterschiedliche Merkmalsprofile** ein System braucht.

## Die Architekturstile (Teil II)

Der zweite Teil ist das Herzstück: ein Katalog von Architekturstilen mit Topologie, Stärken, Schwächen und Bewertungen nach Architekturmerkmalen. In der zweiten Auflage hat jedes Stilkapitel zusätzlich Abschnitte zu Datentopologie, Cloud, Teamtopologien und Governance.

{{< bild src="bild-1.png" alt="die Architekturstile des Buchs · eingeordnet nach Partitionierung und Auslieferung; Microkernel lässt beides zu" >}}

die Architekturstile des Buchs · eingeordnet nach Partitionierung und Auslieferung; Microkernel lässt beides zu

### Monolithisch oder verteilt

Bevor es um einzelne Stile geht, behandeln die Autoren die **Trugschlüsse verteilter Systeme**, die ursprünglich bei Sun formuliert wurden: Das Netzwerk sei zuverlässig, die Latenz null, die Bandbreite unbegrenzt, das Netzwerk sicher, die Topologie unveränderlich, es gebe nur einen Administrator, Transport koste nichts, das Netzwerk sei homogen. Dazu ergänzen sie weitere, etwa die Schwierigkeit verteilter Protokollierung, verteilter Transaktionen und Vertragsversionierung. Das ist Kleppmanns Kapitel über die Probleme verteilter Systeme und Nygards Antipatterns in Kurzform.

### Die Stile im Überblick

| Stil | Kern | Stärken | Schwächen |
|---|---|---|---|
| **Schichten** | Präsentation, Logik, Persistenz, Datenbank | einfach, verbreitet, günstig | fachliche Änderungen durchziehen alle Schichten; schlechte Skalierbarkeit; Gefahr von Durchreichschichten |
| **Modularer Monolith** (neu) | eine Auslieferung, intern fachlich getrennte Module | einfach zu betreiben, fachlich klar | Modulgrenzen müssen diszipliniert durchgesetzt werden |
| **Pipeline** | Filter, die Daten nacheinander verarbeiten | einfach, gut für Datenverarbeitung | begrenzte Skalierbarkeit als Monolith |
| **Microkernel** | stabiler Kern mit Plug-ins | erweiterbar, gut für Produkte wie IDEs | Kern wird leicht zum Engpass |
| **Service-basiert** | wenige grobe fachliche Dienste, oft mit gemeinsamer Datenbank | pragmatischer Mittelweg, gute Fehlertoleranz | gemeinsame Datenbank koppelt Dienste |
| **Ereignisgesteuert** | asynchrone Verarbeitung über Ereignisse, mit Broker oder Mediator | hohe Leistung und Skalierbarkeit, gute Entkopplung | schwer zu testen und nachzuvollziehen, Fehlerbehandlung komplex |
| **Space-based** | verarbeitende Einheiten mit replizierten Speichern statt zentraler Datenbank | extreme Elastizität bei Lastspitzen | sehr komplex, teuer, Konsistenz schwierig |
| **Orchestrierte SOA** | Unternehmensdienste mit zentralem Orchestrierungsbus | historisch wichtig, Wiederverwendung | heute meist als Antipattern gesehen: starke Kopplung, langsame Änderungen |
| **Microservices** | viele kleine, fachlich geschnittene Dienste, jeder mit eigenen Daten | unabhängige Auslieferung, Skalierbarkeit, Teamautonomie | hohe Komplexität, verteilte Daten und Transaktionen, Betriebsaufwand |

### Der modulare Monolith

Das neue Kapitel ist für Java-Entwickler besonders relevant: ein Monolith, der intern **fachlich** statt technisch geschnitten ist, mit klar getrennten Modulen, eigenen Datenbereichen und kontrollierten Schnittstellen. Er verbindet die Einfachheit eines Monolithen mit der fachlichen Klarheit von Microservices und lässt sich später leichter aufteilen. Spring Modulith und das Java-Modulsystem sind Werkzeuge dafür. Das ist die Gegenbewegung zum Microservices-Boom, die in der DDD-Zusammenfassung und bei Martin auftauchte.

### Service-basiert als unterschätzter Mittelweg

Die Autoren heben die **service-basierte Architektur** besonders hervor: vier bis zwölf grobe fachliche Dienste, oft mit gemeinsamer Datenbank. Sie bietet viele Vorteile verteilter Systeme, etwa unabhängige Auslieferung und Fehlertoleranz, ohne die volle Komplexität von Microservices. Für viele Geschäftsanwendungen sei sie eine bessere Wahl.

## Den passenden Stil wählen

Welcher Stil passt, hängt nicht von Moden ab, sondern von den Umständen. Die Autoren warnen ausdrücklich davor, Stile nach Popularität zu wählen, und nennen die Faktoren, die zählen:

- **Die Domäne:** Wie komplex ist die Fachlichkeit, wie stark ändert sie sich?
- **Die Architekturmerkmale:** Welche drei sind entscheidend, und welcher Stil unterstützt sie am besten?
- **Die Datenarchitektur:** Gemeinsame Datenbank oder Daten pro Dienst? Das schränkt die Wahl stark ein.
- **Organisatorische Faktoren:** Kosten, Teamgröße, Erfahrung, Betriebskompetenz, und ob die Organisation häufige Auslieferungen überhaupt unterstützt.
- **Prozesse und Teams:** Wie arbeiten Entwicklung und Betrieb zusammen? Ein Microservices-Stil ohne automatisierte Auslieferung und eigenverantwortliche Teams scheitert.
- **Übereinstimmung von Domäne und Architektur:** Manche Probleme haben eine natürliche Form, etwa Datenverarbeitung als Pipeline oder Produkte mit Erweiterungen als Microkernel.

Die erste Entscheidung ist meist: **monolithisch oder verteilt?** Wenn ein einziges Merkmalsprofil für das ganze System reicht, spricht vieles für einen Monolithen, idealerweise einen modularen. Wenn verschiedene Teile sehr unterschiedliche Merkmale brauchen, also mehrere Architekturquanten, spricht das für verteilte Stile.

## Architekturmuster (neu in der 2. Auflage)

Neben den großen Stilen beschreibt die zweite Auflage wiederkehrende **Muster**, die in mehreren Stilen vorkommen. Nach den verfügbaren Inhaltsangaben gehören dazu:

### Wiederverwendung

| Ansatz | Abwägung |
|---|---|
| Code duplizieren | maximale Unabhängigkeit, aber Fehler müssen mehrfach behoben werden |
| Gemeinsame Bibliothek | eine Stelle für Änderungen, aber Versionierung und Kopplung bei jeder Aktualisierung |
| Gemeinsamer Dienst | zur Laufzeit geteilt, aber neue Abhängigkeit, Latenz und Ausfallrisiko |
| Sidecar und Service Mesh | technische Querschnittsfunktionen wie Logging und Sicherheit außerhalb des Codes |

Die Autoren betonen: Wiederverwendung ist eine Form von Kopplung. Je mehr geteilt wird, desto weniger unabhängig sind die Teile. Das ist dieselbe Spannung, die Martin mit zufälliger Duplikation und Thomas und Hunt mit DRY als Wissen beschreiben.

### Orchestrierung gegen Choreografie

|  | Orchestrierung | Choreografie |
|---|---|---|
| Steuerung | ein zentraler Koordinator ruft Dienste nacheinander auf | Dienste reagieren auf Ereignisse anderer Dienste |
| Stärke | Ablauf ist an einer Stelle sichtbar, Fehlerbehandlung einfacher | geringe Kopplung, gute Skalierbarkeit |
| Schwäche | Koordinator ist Engpass und Kopplungspunkt | Ablauf schwer nachzuvollziehen, Fehlerbehandlung verteilt |

Für verteilte Transaktionen über mehrere Dienste sind das die beiden Varianten des **Saga**-Musters.

### CQRS

**Command Query Responsibility Segregation** trennt Schreib- und Lesemodell: Änderungen gehen an ein Modell, das auf Konsistenz und Geschäftsregeln ausgelegt ist, Abfragen an ein oder mehrere Lesemodelle, die für bestimmte Ansichten optimiert sind. Das passt zu Kleppmanns abgeleiteten Daten und Evans' Domain Events, bringt aber zeitlich verzögerte Konsistenz zwischen den Modellen mit sich.

### Einordnung

Dieses Kapitel ist im Kern ein kleiner Katalog von Abwägungen. Wer *Software Architecture: The Hard Parts* der gleichen Autoren kennt, findet hier eine verdichtete Fassung der dortigen Themen.

## Architekturentscheidungen (Teil III)

Architekten werden daran gemessen, wie gut sie Entscheidungen treffen, begründen und vermitteln.

### Drei Antipatterns

| Antipattern | Muster | Gegenmittel |
|---|---|---|
| **Sich absichern** | Man entscheidet nicht, aus Angst, falsch zu liegen. | bis zum letzten verantwortbaren Moment warten, dann entscheiden, und mit Entwicklern abstimmen |
| **Und täglich grüßt das Murmeltier** | Dieselbe Entscheidung wird immer wieder diskutiert, weil niemand weiß, warum sie so fiel. | Begründung festhalten, technisch und geschäftlich |
| **E-Mail-getriebene Architektur** | Entscheidungen gehen in E-Mails, Chats und Besprechungen verloren. | eine zentrale, verlinkbare Ablage für Entscheidungen |

### Was architektonisch bedeutsam ist

Eine Entscheidung ist architektonisch bedeutsam, wenn sie die **Struktur**, **Architekturmerkmale**, **Abhängigkeiten**, **Schnittstellen** oder **Bautechniken** betrifft, also Plattformen, Frameworks, Werkzeuge oder Prozesse.

### Architecture Decision Records

Die Autoren empfehlen **ADRs**, ein Format, das Michael Nygard, der Autor von Release It!, vorgeschlagen hat: kurze Dokumente, eines pro Entscheidung, versioniert neben dem Code.

```markdown
# ADR 012: Asynchrone Kommunikation zwischen Bestellung und Versand

Status: angenommen

## Kontext
Der Versanddienst ist zu Spitzenzeiten langsam. Synchrone Aufrufe aus der Bestellung
blockieren dort Threads und gefährden die Annahme neuer Bestellungen.

## Entscheidung
Die Bestellung veröffentlicht ein Ereignis "OrderPlaced" über Kafka. Der Versand
verarbeitet es asynchron.

## Konsequenzen
+ Bestellannahme unabhängig von der Verfügbarkeit des Versands
- Bestätigung des Versands erscheint verzögert, Kunden-UI muss das anzeigen
- Monitoring für verzögerte Ereignisse nötig

## Einhaltung
ArchUnit-Test: kein Bestellmodul-Code ruft den Versand-Client direkt auf.
```

Der Abschnitt **Einhaltung**, in der Praxis oft weggelassen, verbindet die Entscheidung mit einer Fitness Function. So bleibt die Entscheidung nicht nur Papier.

## Risiko analysieren

Die Autoren schlagen eine einfache **Risikomatrix** vor: Auswirkung und Wahrscheinlichkeit jeweils auf einer Skala von eins bis drei, multipliziert. Werte von eins bis zwei gelten als gering, drei bis vier als mittel, sechs und neun als hoch.

Mit **Risk Storming** bewerten mehrere Beteiligte zuerst einzeln die Risiken einer Architektur je Komponente und Merkmal, tragen sie dann auf einem gemeinsamen Diagramm zusammen und einigen sich auf Maßnahmen. Der Wert liegt in den unterschiedlichen Einschätzungen: Wo die Bewertungen auseinandergehen, fehlt Wissen.

## Architektur darstellen

- **Erst grob, dann fein:** Frühe Entwürfe auf Papier oder Whiteboard, weil man an aufwändig gezeichneten Diagrammen zu sehr hängt. Die Autoren nennen das irrationale Bindung an Artefakte.
- **Konsistente Darstellung:** Bevor man in Details geht, zeigt man, wo im Gesamtbild man sich befindet.
- **Standards nutzen, wo sinnvoll:** UML, das C4-Modell von Simon Brown, ArchiMate.
- **Diagrammregeln:** Titel, Legende, beschriftete Linien, Farben mit Bedeutung.
- **Präsentationen:** Folien nicht mit Stichpunkten überladen; das gesprochene Wort trägt die Erklärung.

## Teams wirksam machen

Architekten arbeiten durch Teams. Die Autoren beschreiben drei Typen, die sich darin unterscheiden, wie viel Rahmen sie vorgeben:

| Typ | Verhalten | Folge |
|---|---|---|
| **Kontrollfreak** | legt alles fest, bis hin zu Klassen und Bibliotheken | Entwickler werden zu Ausführenden, das Team verliert Eigenverantwortung |
| **Lehnstuhl-Architekt** | bleibt abstrakt, kennt die Umsetzung nicht | Entwürfe sind nicht umsetzbar, Teams füllen die Lücken selbst |
| **Wirksamer Architekt** | gibt passende Grenzen vor und unterstützt das Team darin | Entwickler haben Freiraum, das Gesamtbild bleibt stimmig |

Wie eng die Grenzen sein sollen, hängt ab von der Vertrautheit des Teams miteinander, seiner Größe, seiner Erfahrung, der Komplexität und der Dauer des Projekts. Die Autoren nennen das **elastische Führung**.

Sie beschreiben auch Warnzeichen für Teams, die zu groß werden: **Prozessverlust**, also mehr Köpfe ohne mehr Leistung, wie bei Brooks; **pluralistische Ignoranz**, wenn alle schweigen, weil sie glauben, die anderen sähen kein Problem; und **Verantwortungsdiffusion**, wenn sich niemand zuständig fühlt. Gegen Vergessenes empfehlen sie kurze **Checklisten**, etwa für die Fertigstellung von Code oder für Releases, aber nur für Dinge, die tatsächlich oft vergessen werden.

## Verhandlung und Führung

- **Mit Fachleuten:** in ihrer Sprache argumentieren, mit Kosten und Zeit statt mit Technik, und Übertreibungen in Anforderungen erkennen, etwa „wir brauchen hundert Prozent Verfügbarkeit“.
- **Mit anderen Architekten:** Vorführen schlägt Diskutieren. Ein kleiner Prototyp überzeugt mehr als ein langes Argument.
- **Mit Entwicklern:** Entscheidungen begründen, nicht anordnen, und Entwickler die Lösung möglichst selbst finden lassen.

Die Autoren betonen, dass Architekten **pragmatisch und visionär** zugleich sein müssen und durch Vorbild führen, nicht durch Titel. Das ist McConnells Charakterkapitel und Thomas' und Hunts Kommunikationskapitel, auf die Architektenrolle übertragen.

## Überschneidungen der Architektur (neu in der 2. Auflage)

Ein neues Kapitel behandelt, wie Architektur mit anderen Bereichen zusammenwirkt. Nach den Inhaltsangaben gehören dazu Umsetzung, Infrastruktur, Daten, Entwicklungspraktiken, **Team Topologies**, Systemintegration, das Unternehmen als Ganzes und **generative KI**.

- **Architektur und Daten:** Die Datentopologie, also eine gemeinsame Datenbank, Daten pro Dienst oder etwas dazwischen, schränkt die Wahl des Architekturstils stark ein. Das ist Kleppmanns Thema aus der Sicht des Architekten.
- **Architektur und Teams:** Die Autoren greifen die vier Teamtypen und drei Interaktionsmodi aus Team Topologies auf und ordnen jeden Architekturstil den passenden Teamstrukturen zu.
- **Architektur und generative KI:** Die Autoren betrachten, wie KI-Werkzeuge die Arbeit von Architekten und Entwicklern verändern und welche Architekturmerkmale KI-gestützte Systeme brauchen. Die konkreten Aussagen dieses Abschnitts kenne ich nicht im Detail; hier lohnt ein Blick ins Original.

Diese Erweiterung spiegelt eine Entwicklung, die sich durch die ganze Reihe zieht: Architektur wird nicht mehr als rein technische Disziplin verstanden, sondern als Schnittstelle zwischen Technik, Organisation und Geschäft.

## Kritik und Einordnung

Fundamentals of Software Architecture ist seit 2020 eines der am häufigsten empfohlenen Einstiegsbücher für angehende Architekten. Die zweite Auflage hat es deutlich erweitert und aktualisiert.

### Stärken

- **Abwägen statt predigen:** Das erste Gesetz zieht sich konsequent durch. Kein Stil wird als allgemein richtig dargestellt.
- **Breiter Überblick:** neun Stile mit vergleichbarer Struktur, ein guter Katalog zum Nachschlagen.
- **Präzise Begriffe:** Architekturquant, Konnaszenz, Architekturmerkmale, Fitness Functions.
- **Soft Skills ernst genommen:** Verhandlung, Führung, Teams und Präsentation bekommen einen ganzen Teil.
- **Praxisnahe Werkzeuge:** ADRs, Risk Storming, Fitness Functions.
- **Aktualisiert:** modularer Monolith, Cloud, Teamtopologien und KI in der zweiten Auflage.

### Kritikpunkte

**1. Breite statt Tiefe.** Jeder Stil bekommt ein Kapitel, aber wie man etwa ereignisgesteuerte Systeme im Detail baut oder verteilte Transaktionen löst, bleibt anderen Büchern überlassen, unter anderem *Software Architecture: The Hard Parts* und Kleppmann.

**2. Sternebewertungen.** Die Stilkapitel bewerten jeden Stil mit Sternen für Merkmale wie Skalierbarkeit oder Testbarkeit. Das ist anschaulich, aber vereinfachend: Die Bewertungen hängen stark von der Umsetzung ab und beruhen auf der Erfahrung der Autoren, nicht auf Daten.

**3. Wenig Fachlichkeit.** Fachliche Partitionierung wird empfohlen, aber wie man Domänen schneidet, bleibt knapp. Dafür braucht man DDD und Event Storming.

**4. Beratungsperspektive.** Viele Beispiele stammen aus Beratungsprojekten mit eher großen Unternehmen. Für kleine Teams oder Produktunternehmen wirkt die Rolle des Architekten teils überdimensioniert.

**5. Wenig Code.** Anders als die meisten Bücher dieser Reihe zeigt es kaum Code. Die Brücke von Stilen zu Paketen, Modulen und Klassen müssen Leser selbst schlagen, etwa mit Simon Browns Kapitel aus Clean Architecture.

### Gesamturteil

Das Buch ist das beste Überblickswerk der Reihe für die Architektenrolle: welche Stile es gibt, wie man zwischen ihnen abwägt, wie man Entscheidungen festhält und wie man mit Menschen arbeitet. Es ersetzt nicht die Tiefe von Kleppmann, Evans oder Nygard, aber es ordnet sie ein. Gegenüber Martins Clean Architecture ist es die weniger dogmatische und breitere Wahl.

## Bezüge zur Reihe

Richards und Ford ordnen viele Fäden der Reihe auf Architekturebene ein. Besonders nützlich ist der direkte Vergleich mit Martins Clean Architecture.

| Thema | Martin, *Clean Architecture* | Richards und Ford |
|---|---|---|
| Grundhaltung | eine richtige Architektur mit festen Regeln | alles ist eine Abwägung, die am wenigsten schlechte Architektur |
| Struktur | konzentrische Ringe, Dependency Rule | neun Stile, je nach Merkmalen gewählt |
| Nichtfunktionale Anforderungen | kaum Thema | Architekturmerkmale im Zentrum |
| Kopplung messen | Instabilität, Abstraktheit | dieselben Kennzahlen plus Konnaszenz |
| Durchsetzen | Simon Browns Kapitel, Zugriffsmodifikatoren | Fitness Functions |
| Rolle des Architekten | kaum Thema | ganzer Teil über Soft Skills |

| Thema bei Richards und Ford | Bezug in der Reihe |
|---|---|
| Erstes Gesetz: alles ist Abwägung | McConnell, Ousterhout, Beck in Tidy First?, Kleppmann |
| Zweites Gesetz: Warum vor Wie | Brooks: Dokumenten-Hypothese; Evans: Begründungen festhalten |
| Konnaszenz | Beck: Kopplung relativ zur Änderung; McConnell: versteckte Bedeutungen; Fowler: Replace Primitive with Object |
| Architekturquant | Accelerate: unabhängig auslieferbar; Team Topologies: teamgroße Architektur |
| Fachliche Partitionierung, Entity-Falle | Evans: Bounded Contexts, anämisches Modell; Martin: schreiende Architektur |
| Trugschlüsse verteilter Systeme | Kleppmann, Nygard |
| Fitness Functions | Martin: Dependency Rule; Brown: Zugriffsmodifikatoren; Nygard: Chaos Engineering |
| ADRs | Nygard als Erfinder; Brooks: Fragenlogbuch |
| Modularer Monolith | DDD-Comeback; Martin: Services sind keine Architektur |
| Teamtypen pro Stil | Team Topologies |
| Prozessverlust, große Teams | Brooks' Gesetz |
| Wirksamer Architekt statt Kontrollfreak | Brooks: Kraft, Macht abzugeben; Accelerate: transformationale Führung |

## Diskussionsfragen

1. **Erstes Gesetz:** Fällt dir eine Architekturentscheidung ein, die du für abwägungsfrei gehalten hast? Was war die verborgene Abwägung?
2. **Merkmale:** Welche drei Architekturmerkmale sind für dein aktuelles System wirklich entscheidend, und stimmen sie mit dem gewählten Stil überein?
3. **Quanten:** Wie viele Architekturquanten hat euer System tatsächlich, unabhängig davon, wie viele Dienste es gibt?
4. **Service-basiert:** Würde eine service-basierte Architektur mit wenigen groben Diensten für eure Anwendung besser passen als Microservices oder ein Monolith?
5. **Fitness Functions:** Welche Architekturentscheidung bei euch sollte als automatische Prüfung in der Pipeline stehen?
6. **ADRs:** Werden Architekturentscheidungen bei euch festgehalten? Wie oft wird dieselbe Entscheidung neu diskutiert?
7. **Konnaszenz:** Wo in eurem Code steckt Konnaszenz der Bedeutung oder Position über Modulgrenzen hinweg?
8. **Weiter:** Offen sind noch *Patterns of Enterprise Application Architecture* und *Java Concurrency in Practice*, danach die KI-Bücher. Welches zuerst?
