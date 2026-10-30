+++
title = "Building Evolutionary Architectures – Zusammenfassung und Einordnung"
description = "Neal Ford, Rebecca Parsons, Patrick Kua, Pramod Sadalage, Building Evolutionary Architectures: Automated Software Governance (2017, 2. Auflage 2022)"
date = 2026-10-30T19:07:46+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["building-evolutionary-architectures-2022"]
+++

## Einleitung

Die Begriffe **Fitness Function** und **evolutionäre Architektur** tauchten in dieser Reihe schon mehrfach auf: bei Richards und Ford, in *The Hard Parts*, in Continuous Delivery als Architekturregeln im Build. Dieses Buch ist ihr Ursprung. Seine Frage: **Wie hält man eine Architektur gesund, während sich alles um sie herum ständig ändert?**

### Autoren und Auflagen

Die erste Auflage von 2017 schrieben **Neal Ford**, **Rebecca Parsons**, damals CTO von ThoughtWorks, und **Patrick Kua**, ein erfahrener technischer Leiter. Für die zweite Auflage von 2022 kam **Pramod Sadalage** dazu, der Datenbankspezialist aus *The Hard Parts*. Der neue Untertitel *Automated Software Governance* zeigt die Verschiebung des Schwerpunkts: weg von der Frage, wie Architektur sich entwickeln kann, hin zur Frage, wie man ihre Eigenschaften **automatisch überwacht**.

### Die Kernthese

Klassische Architektur versucht, das System vorauszuplanen und dann zu bewahren. Das scheitert, weil sich Anforderungen, Technologien und Geschäftsmodelle ständig ändern. Die Autoren schlagen eine andere Haltung vor: Die Architektur darf sich **ständig ändern**, aber ihre wichtigen Eigenschaften werden durch **automatische Prüfungen** geschützt, ähnlich wie Unit-Tests das Verhalten von Code schützen.

Der Begriff stammt aus der Informatik der **evolutionären Algorithmen**: Dort bewertet eine Fitnessfunktion, wie nah eine Lösung am Ziel ist. In der Architektur bewertet eine Fitness Function, wie gut das System eine Architekturanforderung erfüllt.

### Aufbau der 2. Auflage

| Teil | Kapitel | Inhalt |
|---|---|---|
| I. Mechanik | 1–4 | evolutionäre Architektur, Fitness Functions, inkrementelle Änderung, automatisierte Governance |
| II. Struktur | 5–8 | Topologien, evolutionäre Daten, evolvierbare Architekturen bauen, Fallstricke und Antipatterns |
| III. Wirkung | 9 | evolutionäre Architektur in der Praxis |

Mit rund 260 Seiten ist das Buch deutlich kürzer als *Fundamentals* oder *The Hard Parts*.

## Was evolutionäre Architektur ist

### Das Problem

Software lebt in einem **dynamischen Gleichgewicht**: Sprachen, Frameworks, Cloud-Dienste, Sicherheitsanforderungen, Geschäftsmodelle und Teams verändern sich ständig. Wer eine Architektur für fünf Jahre im Voraus plant, plant für eine Welt, die es dann nicht mehr gibt. Die Autoren sprechen von **unbekannten Unbekannten**: Dinge, von denen man nicht einmal weiß, dass man sie nicht weiß, und die man deshalb nicht einplanen kann. Das ist die unterste Schicht der Wissenspyramide aus *Fundamentals*.

Gleichzeitig verfällt Architektur, wenn man sie nicht pflegt: Abkürzungen unter Termindruck, Abhängigkeiten, die niemand prüft, Regeln, die nur auf Wiki-Seiten stehen. Die Autoren nennen das **Bit Rot**.

### Die Definition

Eine evolutionäre Architektur unterstützt **gelenkte**, **inkrementelle** Änderung über **mehrere Dimensionen**.

| Bestandteil | Bedeutung |
|---|---|
| **Gelenkt** | Die Richtung der Änderung wird durch Fitness Functions bestimmt, die prüfen, ob wichtige Eigenschaften erhalten bleiben. |
| **Inkrementell** | Änderungen geschehen in kleinen Schritten, sowohl in der Entwicklung als auch in der Auslieferung. Voraussetzung ist Continuous Delivery. |
| **Mehrere Dimensionen** | Architektur betrifft nicht nur Code, sondern auch Daten, Sicherheit, Betrieb, Leistung und Organisation. Jede Dimension kann eigene Fitness Functions haben. |

### Eine andere Haltung zur Architektur

Eine verbreitete Definition sagt, Architektur sei das, was **schwer zu ändern** ist. Die Autoren drehen das um: Wenn man Architektur so baut, dass Änderungen **leichter** werden, verliert diese Definition ihren Schrecken. Das Ziel ist nicht, die richtigen Entscheidungen vorab zu treffen, sondern Entscheidungen so zu treffen, dass man sie später korrigieren kann.

Daraus folgt der Rat, Entscheidungen bis zum **letzten verantwortbaren Moment** aufzuschieben, also so lange, bis man genug weiß, aber nicht so lange, dass das Aufschieben selbst Schaden anrichtet.

### Einordnung

Das ist Thomas' und Hunts ETC-Prinzip, „leichter zu ändern“, als Architekturphilosophie, und Martins „Optionen offenhalten“ aus Clean Architecture. Becks Optionswert aus Tidy First? beschreibt dieselbe Idee ökonomisch. Der Unterschied: Ford und Kollegen liefern mit Fitness Functions ein konkretes Werkzeug, um die Optionen zu schützen.

## Fitness Functions

### Definition

Eine **Fitness Function** ist jeder Mechanismus, der eine **objektive Bewertung** der Integrität eines oder mehrerer Architekturmerkmale liefert. Das kann ein Test sein, eine Metrik, ein Monitoring-Alarm, eine statische Analyse oder ein Chaos-Experiment.

Wichtig ist die Abgrenzung: Nicht jeder Test ist eine Fitness Function. Ein Unit-Test, der prüft, ob eine Steuer richtig berechnet wird, prüft **Fachlichkeit**. Eine Fitness Function prüft eine **Architektureigenschaft**: Struktur, Leistung, Sicherheit, Skalierbarkeit, Kopplung.

### Kategorien

Die Autoren beschreiben Fitness Functions entlang mehrerer Dimensionen. Zwei davon sind besonders nützlich, um eine Sammlung zu ordnen:

{{< bild src="bild-1.png" alt="zwei Dimensionen von Fitness Functions mit typischen Beispielen" >}}

zwei Dimensionen von Fitness Functions mit typischen Beispielen

| Dimension | Ausprägungen |
|---|---|
| **Umfang** | **atomar**: prüft ein Merkmal in einem Kontext; **ganzheitlich**: prüft das Zusammenspiel mehrerer Merkmale, etwa Sicherheit und Leistung gemeinsam |
| **Zeitpunkt** | **ausgelöst**: bei einem Ereignis wie einem Commit; **kontinuierlich**: laufend im Betrieb; **zeitlich**: zu einem bestimmten Termin, etwa eine Erinnerung, eine Bibliothek zu aktualisieren |
| **Ergebnis** | **statisch**: fester Grenzwert, bestanden oder nicht; **dynamisch**: Grenzwert hängt vom Kontext ab, etwa Antwortzeit abhängig von der Last |
| **Ausführung** | **automatisiert** oder **manuell**, etwa eine rechtliche Prüfung |
| **Absicht** | **beabsichtigt**: von Anfang an geplant; **entstanden**: im Lauf des Projekts erkannt |
| **Bereich** | **fachspezifisch**, etwa regulatorische Anforderungen einer Branche |

### Wer schreibt sie?

Fitness Functions sind **gemeinsame Arbeit von Architekten und Entwicklern**. Architekten bestimmen, welche Merkmale geschützt werden müssen; Entwickler setzen die Prüfungen um und pflegen sie im selben Repository wie den Code. So wird Architektur zu etwas, das man ausführen kann, nicht nur zu einem Dokument.

### Einordnung

Fitness Functions verbinden Dinge, die in dieser Reihe getrennt auftauchten: Martins Komponentenkennzahlen, Simon Browns durchgesetzte Grenzen, Nygards Chaos Engineering, Humbles und Farleys Pipeline-Stufen, die SLOs aus dem SRE-Buch. Sie geben ihnen einen gemeinsamen Namen und eine gemeinsame Rolle.

## Inkrementelle Änderung

Fitness Functions brauchen einen Ort, an dem sie laufen. Für die ausgelösten ist das die **Deployment-Pipeline** aus Continuous Delivery. Die Autoren erweitern sie: Neben fachlichen Tests laufen in eigenen Stufen Architekturprüfungen, Sicherheitsscans, Leistungstests und Vertragsprüfungen. Die kontinuierlichen laufen im Monitoring der Produktion.

Ihre Voraussetzungen für inkrementelle Änderung:

- **Kleine, häufige Auslieferungen**, wie Humble, Farley und Accelerate beschreiben.
- **Automatisierung** aller Prüfungen, damit sie bei jeder Änderung laufen.
- **Lose Kopplung**, damit eine Änderung nicht das ganze System betrifft.
- **Experimentierfreude:** Neue Lösungen werden parallel zur alten ausprobiert, etwa mit Feature Toggles oder Parallel Runs.

## Governance automatisieren

In vielen Unternehmen heißt Architektur-Governance: Gremien, Freigaben, Checklisten, Prüfungen durch Architekten. Die Autoren schlagen vor, möglichst viel davon durch **ausführbare Prüfungen** zu ersetzen. Das ist schneller, gerechter und skaliert. Accelerate hat gezeigt, dass manuelle Freigabegremien die Stabilität nicht verbessern.

### Was sich automatisieren lässt

| Bereich | Beispiel | Werkzeuge in Java |
|---|---|---|
| **Struktur** | keine Zyklen, Schichtenregeln, Paketabhängigkeiten | ArchUnit, Java-Modulsystem, jQAssistant |
| **Codequalität** | zyklomatische Komplexität, Kopplungsmetriken | SonarQube, PMD |
| **Rechtliches** | nur erlaubte Open-Source-Lizenzen | Lizenzprüfung im Build |
| **Sicherheit** | keine Abhängigkeiten mit bekannten Schwachstellen | OWASP Dependency-Check, Snyk, Dependabot |
| **Leistung** | Antwortzeiten unter Last | JMH, Gatling, k6 |
| **Verträge** | Schnittstellen bleiben kompatibel | Pact, Schema-Registry |
| **Fachliche Grenzen** | Bounded Contexts greifen nicht auf fremde Interna zu | ArchUnit, Spring Modulith |

### Das Beispiel der Sicherheitslücke

Die Autoren erinnern an den Equifax-Datenverlust von 2017: Eine bekannte Schwachstelle in Apache Struts war seit Monaten behoben, aber das Update war nicht eingespielt. Ihr Argument: Hätte eine Fitness Function bei jedem Build nach bekannten Schwachstellen gesucht und den Build bei kritischen Funden gestoppt, wäre die Lücke früh aufgefallen. Governance, die automatisch läuft, schützt auch vor dem, was im Alltag untergeht.

```java
// Fitness Function: fachliche Module greifen nur über veröffentlichte APIs aufeinander zu
@Test
void modulesRespectBoundaries() {
    ApplicationModules.of(ShopApplication.class).verify();   // Spring Modulith
}

// Fitness Function: Leistungsbudget eines kritischen Pfads
@Test
void pricingStaysWithinBudget() {
    var cart = TestCarts.typicalCart();
    var started = System.nanoTime();
    for (int i = 0; i < 10_000; i++) pricing.price(cart);
    long avgMicros = (System.nanoTime() - started) / 10_000 / 1_000;
    assertThat(avgMicros).isLessThan(200);                    // grob; für genaue Messung JMH
}
```

### Von oben nach unten

Die Autoren beschreiben Fitness Functions auf mehreren Ebenen: im Code, in der Architektur eines Systems, zwischen Systemen und auf **Unternehmensebene**, etwa Regeln, die für alle Teams gelten. Unternehmensweite Fitness Functions sind ein Werkzeug für Enterprise-Architekten, die so Leitplanken setzen können, ohne jede Entscheidung selbst zu prüfen.

### Einordnung

Das ist Team Topologies' Plattformgedanke, angewandt auf Governance: Ein zentrales Team stellt Prüfungen bereit, die Teams selbst ausführen, statt Freigaben zu erteilen. Und es ist Newmans evolutionärer Architekt als Stadtplaner, mit automatisierten Bauvorschriften.

## Topologien

Der zweite Teil fragt, welche **Strukturen** Evolution erleichtern oder erschweren. Die Antwort läuft, wie fast überall in dieser Reihe, auf Kopplung hinaus.

### Konnaszenz

Die Autoren übernehmen Page-Jones' Konnaszenz, wie sie *Fundamentals* beschreibt: Zwei Teile sind konnaszent, wenn eine Änderung am einen eine Änderung am anderen erzwingt. Für Evolution sind zwei Regeln entscheidend:

- **Starke Konnaszenz nur lokal:** innerhalb eines Moduls oder Dienstes, nicht über Grenzen hinweg.
- **Über Grenzen nur schwache Konnaszenz:** etwa über Namen in einem Vertrag, nicht über gemeinsame Algorithmen oder Reihenfolgen.

### Architekturquanten und Granularität

Ein Architekturquant, wie in *The Hard Parts* präzisiert, ist die Einheit, die sich unabhängig entwickeln kann. Je kleiner und unabhängiger die Quanten, desto leichter die Evolution, aber desto höher die Komplexität des Gesamtsystems. Die Autoren betonen, dass **statische Kopplung**, etwa eine gemeinsame Datenbank oder Bibliothek, Quanten oft unbemerkt verschmilzt.

### Verträge

Verträge zwischen Quanten sind die Stellen, an denen Evolution am leichtesten bricht. Die Autoren empfehlen:

- **Lockere Verträge**, wo möglich: Name-Wert-Paare, Tolerant Reader, nur benötigte Felder.
- **Verbraucherorientierte Verträge** als Fitness Functions, damit ein Anbieter weiß, welche Änderungen er sich leisten kann.
- **Versionierung intern statt in der URL**, damit Aufrufer nicht bei jeder Änderung umstellen müssen.

### Wiederverwendung gegen Kopplung

Ein wiederkehrender Gedanke: **Wiederverwendung erzeugt Kopplung.** Was mehrere Teile gemeinsam nutzen, müssen sie gemeinsam weiterentwickeln. In Systemen, die evolvierbar sein sollen, ist **Duplikation oft besser als falsche Kopplung**. Das ist Sandi Metz' Warnung vor der falschen Abstraktion, Martins zufällige Duplikation und Newmans Rat zu gemeinsamen Bibliotheken.

### Evolvierbarkeit der Stile

Die Autoren bewerten Architekturstile danach, wie gut sie Evolution unterstützen, hier sinngemäß zusammengefasst:

| Stil | Evolvierbarkeit | Grund |
|---|---|---|
| Großer Matschklumpen | sehr gering | alles hängt mit allem zusammen |
| Schichten-Monolith | gering | fachliche Änderungen durchziehen alle Schichten |
| Modularer Monolith | mittel bis gut | fachliche Grenzen im Code, aber ein Quant |
| Microkernel | gut für Erweiterungen | Plug-ins entwickeln sich unabhängig, der Kern nicht |
| Ereignisgesteuert | gut | lose Kopplung über Ereignisse, aber schwer zu überblicken |
| Service-basiert | gut | wenige grobe Quanten, oft gemeinsame Datenbank |
| Microservices | sehr gut | viele unabhängige Quanten, aber hohe Komplexität |

Die Autoren betonen, dass hohe Evolvierbarkeit nur eines von mehreren Merkmalen ist und mit Komplexität und Kosten abgewogen werden muss.

## Evolutionäre Daten

Daten sind der Teil eines Systems, der sich am schwersten weiterentwickeln lässt: Sie überleben Anwendungen, oft um Jahrzehnte, und viele Systeme hängen von ihnen ab. Das Kapitel, maßgeblich von Sadalage, überträgt die Prinzipien der evolutionären Architektur auf Datenbanken.

### Evolutionäres Datenbankdesign

Die Grundlagen stammen aus *Refactoring Databases* von Scott Ambler und Pramod Sadalage von 2006:

- **Schemaänderungen als versionierte Migrationen**, im selben Repository wie der Code, automatisch in jeder Umgebung eingespielt, wie Continuous Delivery fordert.
- **Kleine Schritte:** Jede Migration ändert wenig und lässt sich einzeln prüfen.
- **Datenbanktests** in der Pipeline, mit echter Datenbank.

### Expand and Contract

Das zentrale Muster, auch **Parallel Change** genannt, taucht in dieser Reihe zum dritten Mal auf, nach Release It! und Continuous Delivery: Eine Änderung wird in drei Phasen zerlegt, damit alte und neue Version gleichzeitig funktionieren.

| Phase | Datenbank | Anwendung |
|---|---|---|
| **Erweitern** | neue Struktur hinzufügen, alte bleibt | schreibt in beide, liest aus der alten |
| **Übergang** | Daten migrieren, beide synchron halten | liest aus der neuen |
| **Zusammenziehen** | alte Struktur entfernen | nutzt nur noch die neue |

Jede Phase ist eine eigene Auslieferung und lässt sich zurücknehmen. Für Systeme mit mehreren Anwendungen auf derselben Datenbank kann die Übergangsphase Monate dauern.

### Integrationsdatenbanken

Die Autoren warnen vor **Integrationsdatenbanken**, also Datenbanken, über die mehrere Anwendungen Daten austauschen. Sie sind die stärkste Form statischer Kopplung: Jede Schemaänderung muss mit allen Anwendungen abgestimmt werden, und alle bilden ein Quant. Das ist der gemeinsame Datenbank-Integrationsstil aus EIP.

### Unangemessene Verflechtung

Ein weiteres Thema ist **unangemessene Datenverflechtung**: Fremdschlüssel, Trigger und gespeicherte Prozeduren, die fachliche Bereiche verbinden, die eigentlich getrennt sein sollten. Sie machen es schwer, Teile später aufzuteilen. Die Autoren empfehlen, solche Verbindungen bewusst zu entscheiden und Transaktionen über fachliche Grenzen hinweg zu vermeiden.

### Einordnung

Das Kapitel ist eine Kurzfassung dessen, was *The Hard Parts* ausführlich behandelt. Es ergänzt Kleppmanns Kapitel über Kodierung und Schemaevolution um die Perspektive des laufenden Betriebs.

## Evolvierbare Architekturen bauen

### Drei Schritte

1. **Betroffene Dimensionen bestimmen:** Welche Architekturmerkmale sind für dieses System entscheidend, und welche müssen sich weiterentwickeln können?
2. **Fitness Functions für jede Dimension festlegen:** Wie prüft man objektiv, ob das Merkmal erhalten bleibt?
3. **Sie in die Pipeline und den Betrieb bringen:** Ausgelöste Fitness Functions in Build und Auslieferung, kontinuierliche im Monitoring.

Für bestehende Systeme empfehlen die Autoren, mit den Fitness Functions zu beginnen, die den größten Schaden verhindern oder die am leichtesten umzusetzen sind, und die Sammlung schrittweise zu erweitern.

### Leitlinien

| Leitlinie | Inhalt |
|---|---|
| **Unnötige Vielfalt entfernen** | Unterschiedliche Server, Konfigurationen und Werkzeuge ohne Grund erschweren Änderungen. Unveränderliche Infrastruktur und einheitliche Plattformen helfen. |
| **Entscheidungen umkehrbar machen** | Blue-Green-Deployment, Feature Toggles, Versionierung; jede Entscheidung, die man zurücknehmen kann, ist weniger riskant. |
| **Evolvierbar statt vorhersagbar** | Statt zu versuchen, die Zukunft vorauszusagen, so bauen, dass Änderungen billig sind. |
| **Anticorruption Layers bauen** | Fremde Bibliotheken, Frameworks und Dienste hinter eigenen Schnittstellen kapseln, wie Evans beschreibt. |
| **Opferarchitekturen** | Manchmal bewusst etwas bauen, das man später wegwirft, etwa einen schnellen Prototyp, um den Markt zu testen. Brooks' „Plane, eines wegzuwerfen“, in der korrigierten Fassung. |
| **Externe Änderungen abfedern** | Abhängigkeiten nicht automatisch auf die neueste Version heben, sondern bewusst und mit Tests; Fitness Functions warnen, wenn eine Version zu alt wird. |
| **Bibliotheken anders behandeln als Frameworks** | Bibliotheken ruft man selbst auf und kann sie leicht tauschen; Frameworks rufen den eigenen Code auf und durchziehen ihn. Bei Frameworks lohnt sich Aktualisieren früh und regelmäßig. |
| **Dienste intern versionieren** | Eine Schnittstelle akzeptiert mehrere Versionen und unterscheidet sie intern, statt mehrere Endpunkte zu pflegen. |

### Bibliotheken und Frameworks

Die Unterscheidung zwischen Bibliotheken und Frameworks verdient einen Moment, weil sie für Java-Projekte mit Spring oder Jakarta EE besonders relevant ist. Ein Framework-Upgrade, das man jahrelang aufschiebt, wird irgendwann zu einem eigenen Projekt. Die Autoren raten, Framework-Versionen als **Fitness Function** zu überwachen, etwa mit einer Regel, die den Build warnen lässt, wenn die verwendete Version mehr als eine bestimmte Zahl von Releases hinter der aktuellen liegt. Das ist Martins asymmetrische Ehe mit dem Framework, ins Praktische gewendet.

### Einordnung

Viele dieser Leitlinien tauchen in der Reihe an anderen Stellen auf: umkehrbare Entscheidungen bei Thomas und Hunt, Anticorruption Layer bei Evans, unnötige Vielfalt bei Humble und Farley. Das Buch bündelt sie unter einem Ziel: die Kosten künftiger Änderungen niedrig halten.

## Fallstricke und Antipatterns

Das achte Kapitel sammelt, was Evolution verhindert. Die Autoren unterscheiden **Fallstricke**, die zunächst vernünftig aussehen und erst später schaden, von **Antipatterns**, die von Anfang an schädlich sind.

### Technische Architektur

| Name | Muster | Gegenmittel |
|---|---|---|
| **Die Falle der letzten zehn Prozent** | Low-Code-Werkzeuge und Standardsoftware lösen 80 bis 90 Prozent eines Problems schnell; die letzten Prozent sind kaum oder gar nicht umzusetzen | vorher prüfen, ob die schwierigen Anforderungen umsetzbar sind |
| **Vendor King** | ein großes Produkt, etwa ein ERP-System, steht im Zentrum, und alles richtet sich nach dessen Releases und Grenzen | das Produkt als Integrationspunkt behandeln, nicht als Architektur; eigene Logik außerhalb halten |
| **Undichte Abstraktionen** | Abstraktionen, die ihre Details durchscheinen lassen, etwa ORMs mit unerwarteten Abfragen | Fitness Functions für das, was durchscheint, etwa Leistungsprüfungen |
| **Lebenslaufgetriebene Entwicklung** | Technologien werden gewählt, weil sie im Lebenslauf gut aussehen, nicht weil sie passen | Entscheidungen mit ADRs begründen |
| **Missbrauch von Wiederverwendung** | gemeinsame Komponenten koppeln Teile, die sich unabhängig entwickeln sollten | Duplikation zulassen, wo Unabhängigkeit wichtiger ist |

### Inkrementelle Änderung

| Name | Muster |
|---|---|
| **Unpassende Governance** | dieselben Regeln für alle Teams und Systeme, unabhängig von deren Anforderungen; etwa ein vorgeschriebener Technologie-Stack für alle Dienste |
| **Zu langsame Auslieferung** | wenn Auslieferung Wochen dauert, sind kleine Schritte nicht möglich, und Evolution wird zu Revolution |

### Geschäftliche Anliegen

| Name | Muster |
|---|---|
| **Kundenspezifische Anpassungen** | jeder Großkunde bekommt eigene Varianten oder Zweige; jede Änderung muss in alle Varianten gebracht werden |
| **Berichte direkt auf dem operativen System** | Auswertungen greifen direkt auf die Datenbank der Anwendung zu und frieren deren Schema ein |
| **Zu lange Planungshorizonte** | lange Planung erzeugt Bindung an Pläne; je mehr in einen Plan investiert wurde, desto schwerer gibt man ihn auf |

### Einordnung

Die Berichte auf dem operativen System sind dasselbe Problem, das Dehghani in *The Hard Parts* mit Data Mesh löst. Zu lange Planungshorizonte sind Brooks' Zweitsystemeffekt in organisatorischer Form, und unpassende Governance ist das Gegenteil von Team Topologies' Plattform, die Angebote macht statt Vorschriften.

## In die Praxis bringen

Das letzte Kapitel behandelt die organisatorische Seite: Wie führt man evolutionäre Architektur in einem Unternehmen ein?

### Organisation und Teams

- **Conways Gesetz** gilt auch hier: Teams, die fachlich geschnitten sind, bauen Systeme, die sich fachlich weiterentwickeln lassen. Das umgekehrte Conway-Manöver aus Team Topologies ist ein Werkzeug evolutionärer Architektur.
- **Funktionsübergreifende Teams** mit Entwicklung, Test und Betrieb können Fitness Functions über alle Dimensionen schreiben.
- **Kopplung zwischen Teams** wird genauso betrachtet wie Kopplung zwischen Diensten. Je weniger Teams sich abstimmen müssen, desto schneller kann sich das System ändern.

### Wo anfangen?

Die Autoren schlagen mehrere Einstiege vor, je nach Lage:

| Einstieg | Wann |
|---|---|
| **Niedrig hängende Früchte** | wenn das Team Vertrauen in die Methode gewinnen muss: einfache Architekturregeln im Build |
| **Höchster Wert zuerst** | wenn ein Merkmal geschäftskritisch ist, etwa Verfügbarkeit oder Sicherheit |
| **Tests** | wenn die Testabdeckung gering ist; Fitness Functions setzen eine funktionierende Pipeline voraus |
| **Infrastruktur** | wenn Umgebungen uneinheitlich sind und Auslieferung langsam |

### Die Rolle von Enterprise-Architekten

Enterprise-Architekten werden von Gatekeepern zu **Gestaltern von Leitplanken**: Sie definieren unternehmensweite Fitness Functions, stellen sie als Bibliotheken oder Plattformdienste bereit und lassen die Teams sie selbst ausführen. Die Prüfung findet in der Pipeline statt, nicht in einer Sitzung.

### Fitness Functions als Experimentiermittel

Eine interessante Idee aus dem Kapitel: Fitness Functions eignen sich auch für **Hypothesen**. Wenn ein Team vermutet, dass eine Änderung die Antwortzeit verbessert, formuliert es eine Fitness Function dafür und misst. Architektur wird so zu einem empirischen Vorgehen, im Sinne von Farleys späterem *Modern Software Engineering*.

### Der Geschäftsnutzen

Die Autoren argumentieren gegenüber der Geschäftsseite mit drei Punkten: **Schnellere Reaktion** auf Marktveränderungen, **geringeres Risiko** durch kleine, geprüfte Änderungen und **bessere Entscheidungen** durch messbare Architektureigenschaften. Accelerate liefert dafür die Daten.

## Kritik und Einordnung

### Stärken

- **Ein klares Werkzeug:** Fitness Functions machen Architektur prüfbar. Der Begriff hat sich in der Branche durchgesetzt und taucht etwa im ThoughtWorks Technology Radar regelmäßig auf.
- **Governance ohne Gremien:** Das Buch zeigt einen glaubwürdigen Weg, Architekturregeln durchzusetzen, ohne Teams zu bremsen.
- **Kompakt:** Mit rund 260 Seiten ist es das kürzeste Architekturbuch der Reihe.
- **Daten ernst genommen:** Das Kapitel über evolutionäre Daten deckt eine Lücke, die viele Architekturbücher offenlassen.
- **Antipatterns aus der Praxis:** Vendor King, die Falle der letzten zehn Prozent und Berichte auf dem operativen System kennt fast jeder aus eigener Erfahrung.

### Kritikpunkte

**1. Überschneidungen.** Wer *Fundamentals* und *The Hard Parts* gelesen hat, findet hier viel Bekanntes: Konnaszenz, Quanten, Verträge, Datenaufteilung. Die drei Bücher teilen Autoren und Begriffe; als Trilogie gelesen wiederholt sich manches.

**2. Fitness Function als sehr weiter Begriff.** Wenn jede Prüfung, jede Metrik und jedes Monitoring eine Fitness Function sein kann, verliert der Begriff an Schärfe. Kritiker fragen, was er über „automatisierte Architekturtests und Monitoring“ hinaus bedeutet.

**3. Wenig Anleitung für Schwieriges.** Strukturelle Fitness Functions mit ArchUnit sind einfach. Für Merkmale wie Evolvierbarkeit selbst, Benutzbarkeit oder fachliche Angemessenheit bleibt das Buch vage.

**4. Evolution braucht Grenzen.** Das Buch betont Wandel stark. Manche Systeme, etwa sicherheitskritische oder regulierte, profitieren mehr von Stabilität und sorgfältiger Planung als von ständiger Evolution. Das kommt nur am Rand vor.

**5. Wenig Code.** Wie in den anderen Büchern der Autoren zeigen die Beispiele eher Konzepte als vollständige Umsetzungen.

### Gesamturteil

Das Buch hat einen Begriff geprägt, der die Reihe durchzieht, und es zeigt, wie Architektur vom Dokument zur ausführbaren Prüfung wird. Wer *Fundamentals* und *The Hard Parts* kennt, liest hier vor allem die Kapitel über Fitness Functions, Governance und Antipatterns. Für Java-Teams ist die praktische Konsequenz einfach: ArchUnit, Spring Modulith, Dependency-Check und Vertragstests in die Pipeline, und Architekturentscheidungen als ADRs mit einem Abschnitt „Einhaltung“.

## Bezüge zur Reihe

### Die Trilogie von Ford und Richards

| Buch | Schwerpunkt | Frage |
|---|---|---|
| *Building Evolutionary Architectures* (2017/2022) | Fitness Functions, Governance | Wie schützt man Architektur, während sie sich ändert? |
| *Fundamentals of Software Architecture* (2020/2025) | Stile, Merkmale, Rolle | Was ist Architektur, und welche Stile gibt es? |
| *Software Architecture: The Hard Parts* (2021) | Daten, Granularität, Sagas | Wie trifft man die schwierigen Entscheidungen in verteilten Systemen? |

### Weitere Bezüge

| Thema | Bezug in der Reihe |
|---|---|
| Leichter zu ändern als Ziel | Thomas und Hunt: ETC; Beck: Optionswert; Martin: Optionen offenhalten |
| Inkrementelle Änderung | Humble und Farley; Accelerate |
| Fitness Functions für Struktur | Martin: Komponentenprinzipien; Brown: durchgesetzte Grenzen |
| Fitness Functions im Betrieb | Nygard: Chaos Engineering; SRE: SLOs |
| Governance ohne Gremien | Accelerate: Freigabegremien ohne Nutzen; Team Topologies: Plattform |
| Konnaszenz und Quanten | Richards und Ford; *The Hard Parts* |
| Verbraucherorientierte Verträge | Newman: Pact; Khorikov |
| Expand and Contract | Nygard; Humble und Farley; Sadalage |
| Anticorruption Layer | Evans |
| Opferarchitektur | Brooks: Plane, eines wegzuwerfen, und seine Korrektur |
| Bibliotheken und Frameworks | Martin: asymmetrische Ehe mit dem Framework |
| Integrationsdatenbank | Hohpe und Woolf: gemeinsame Datenbank als Integrationsstil |
| Lebenslaufgetriebene Entwicklung | Brooks: Zweitsystemeffekt; Richards und Ford: Evangelisten meiden |

## Diskussionsfragen

1. **Architektur als Dokument:** Wo stehen eure Architekturregeln: im Wiki, in ADRs oder in ausführbaren Prüfungen?
2. **Erste Fitness Function:** Welche Architekturregel bei euch wird am häufigsten verletzt? Wie sähe eine automatische Prüfung dafür aus?
3. **Sicherheitsupdates:** Wie schnell erfahrt ihr von bekannten Schwachstellen in euren Abhängigkeiten, und wie schnell spielt ihr Updates ein?
4. **Framework-Versionen:** Wie weit hinter der aktuellen Version von Spring oder Java liegt euer ältestes System?
5. **Vendor King:** Gibt es bei euch ein großes Produkt, nach dem sich alles richtet?
6. **Berichte:** Laufen bei euch Auswertungen direkt auf operativen Datenbanken?
7. **Governance:** Gibt es bei euch Architekturgremien, die Freigaben erteilen? Was davon ließe sich automatisieren?
8. **Weiter:** Als Nächstes *Site Reliability Engineering*, das die Betriebsseite mit SLOs und Fehlerbudgets vertieft.
