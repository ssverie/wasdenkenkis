+++
title = "Clean Architecture – Zusammenfassung und Einordnung"
description = "Robert C. Martin, Clean Architecture: A Craftsman's Guide to Software Structure and Design (2017)"
date = 2026-10-30T19:11:19+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["clean-architecture-2017"]
+++

## Einleitung

Nach Clean Code für Funktionen und Klassen legt Martin mit Clean Architecture sein Buch für die Ebene darüber vor: Komponenten, Grenzen und die Struktur ganzer Systeme. Die Kernthese: **Das Ziel von Softwarearchitektur ist, den menschlichen Aufwand für Bau und Wartung eines Systems zu minimieren.** Gute Architektur erkennt man daran, dass Änderungen billig bleiben.

### Kontext

Das Buch erschien 2017, fünf Jahre nachdem Martin in einem Blogartikel das Diagramm der „Clean Architecture“ mit konzentrischen Kreisen veröffentlicht hatte. Es fasst Ideen zusammen, die er über Jahrzehnte entwickelt und in früheren Büchern und Artikeln vorgestellt hatte, vor allem die **SOLID-Prinzipien** und die **Komponentenprinzipien**. Dazu kommt eine Synthese verwandter Ansätze: Alistair Cockburns Hexagonal Architecture, Jeffrey Palermos Onion Architecture und Ivar Jacobsons Use-Case-getriebener Entwurf.

Der Ton ist derselbe wie in Clean Code: selbstbewusst, oft absolut, mit Anekdoten aus Martins langer Karriere. Ein Anhang erzählt diese Karriere ausführlich als „Architekturarchäologie“.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Einführung | Was Design und Architektur sind, zwei Werte von Software |
| II. Die Bausteine: Paradigmen | strukturierte, objektorientierte und funktionale Programmierung |
| III. Designprinzipien | SOLID |
| IV. Komponentenprinzipien | Kohäsion und Kopplung von Komponenten |
| V. Architektur | Grenzen, Regeln, die Clean Architecture, Services, Tests |
| VI. Details | Datenbank, Web und Frameworks als Details; Fallstudie; ein Gastkapitel von Simon Brown |

### Die Kernideen in fünf Sätzen

1. Software hat zwei Werte, Verhalten und Struktur, und die **Struktur ist wichtiger**, weil sie bestimmt, wie billig künftige Verhaltensänderungen sind.
2. Gute Architektur **hält Optionen offen**: Entscheidungen über Datenbank, Framework und Oberfläche sollen möglichst spät fallen und austauschbar bleiben.
3. **Geschäftsregeln stehen im Zentrum**, alles andere ist Detail.
4. **Abhängigkeiten zeigen nach innen**, von den Details zu den Geschäftsregeln, nie umgekehrt. Das ist die **Dependency Rule**.
5. Grenzen werden mit **Dependency Inversion** gezogen: Die inneren Schichten definieren Schnittstellen, die äußeren implementieren sie.

## Zwei Werte von Software (Teil I)

Martin unterscheidet, wie Beck in Tidy First?, zwei Werte:

- **Verhalten:** Die Software tut, was die Nutzer brauchen. Dafür werden Entwickler bezahlt.
- **Struktur, also Architektur:** Die Software lässt sich ändern. Das „Soft“ in Software heißt, dass sie weich und formbar sein soll.

Seine zugespitzte These: **Die Struktur ist wichtiger als das Verhalten.** Ein Programm, das perfekt funktioniert, sich aber nicht ändern lässt, wird wertlos, sobald sich die Anforderungen ändern. Ein Programm, das nicht funktioniert, sich aber leicht ändern lässt, kann man reparieren.

Dazu nutzt er die **Eisenhower-Matrix**: Verhalten ist dringend, aber oft nicht wichtig; Architektur ist wichtig, aber selten dringend. Weil Dringendes Wichtiges verdrängt, müssen Entwickler **für die Architektur kämpfen**, auch gegen Druck aus dem Management.

### Einordnung

Becks Tidy First? beschreibt dieselbe Spannung, kommt aber zu einem ausgewogeneren Schluss: Zeitwert und Optionswert ziehen in verschiedene Richtungen, und je nach Lage gewinnt der eine oder andere. Martin ist hier deutlich einseitiger.

## Die Paradigmen (Teil II)

Martin deutet die drei großen Programmierparadigmen nicht als etwas, das Möglichkeiten hinzufügt, sondern als **Disziplinen, die etwas wegnehmen**.

| Paradigma | Was es wegnimmt | Bedeutung für Architektur |
|---|---|---|
| **Strukturiert** (Dijkstra, 1968) | `goto`, also direkte Sprünge im Kontrollfluss | Programme lassen sich in beweisbare oder zumindest testbare Einheiten zerlegen |
| **Objektorientiert** | unkontrollierte Funktionszeiger | **Polymorphie** ermöglicht Dependency Inversion und damit Plug-in-Architekturen |
| **Funktional** | Zuweisung, also veränderlichen Zustand | Nebenläufigkeitsprobleme verschwinden, wo Zustand unveränderlich ist |

### Strukturierte Programmierung

Martin greift Dijkstras Gedanken auf, dass Tests die Anwesenheit von Fehlern zeigen können, aber nie ihre Abwesenheit. Software ist für ihn deshalb eher eine **empirische Wissenschaft**: Man kann Programme nicht beweisen, aber durch Tests widerlegen. Funktionale Zerlegung in kleine, testbare Einheiten ist die Konsequenz.

### Objektorientierung

Eine bemerkenswerte These: Kapselung und Vererbung sind **nicht** das Neue an OO, beides ging schon in C. Das eigentlich Neue ist **sichere Polymorphie**. Sie erlaubt, dass Code auf hoher Ebene von einer Schnittstelle abhängt, die auf niedriger Ebene implementiert wird, also umgekehrt zum Kontrollfluss. Damit kann man Datenbank, Oberfläche und Geräte als **Plug-ins** an die Geschäftslogik anschließen. Für Martin ist das die architektonische Bedeutung von OO.

### Funktionale Programmierung

Alle Probleme mit Nebenläufigkeit, Wettlaufsituationen, Deadlocks und gleichzeitigen Änderungen entstehen durch veränderliche Variablen. Martin empfiehlt, **veränderliche und unveränderliche Komponenten zu trennen** und so viel wie möglich unveränderlich zu halten. Als Extremform nennt er **Event Sourcing**: nur Ereignisse speichern, Zustand daraus berechnen.

### Einordnung

Die Deutung der Paradigmen als Wegnahme ist originell und gut lesbar. Sie deckt sich mit Weidig, der Unveränderlichkeit als Grundlage funktionalen Denkens sieht, und mit Kleppmanns Event Sourcing. Die These, OO sei im Kern Polymorphie zur Abhängigkeitsumkehr, ist eine Zuspitzung, die vieles erklärt, aber Alan Kays Sicht auf Objekte als Nachrichtenempfänger, auf die GOOS aufbaut, weitgehend ausblendet.

## SOLID (Teil III)

Martin stellt die fünf SOLID-Prinzipien vor, die er seit den späten 1990ern propagiert, jetzt mit Blick darauf, was sie auf **Architekturebene** bedeuten.

### S: Single Responsibility Principle

Die wichtigste Klarstellung des Buchs: SRP heißt **nicht**, dass eine Klasse nur eine Sache tun soll. Das gilt für Funktionen. Für Module lautet die Neufassung: **Ein Modul soll genau einem Akteur gegenüber verantwortlich sein**, also einer Gruppe von Menschen, die Änderungen verlangen.

```java
// verletzt SRP: drei Akteure in einer Klasse
class Invoice {
    Money tax()          { … }   // Buchhaltung bestimmt die Regeln
    byte[] renderPdf()   { … }   // Marketing bestimmt das Layout
    void save()          { … }   // IT bestimmt die Speicherung
}
```

Wenn die Buchhaltung eine Steuerregel ändert und dabei eine gemeinsame Hilfsmethode anpasst, die auch das Layout nutzt, bricht womöglich das PDF. Die Lösung: getrennte Klassen pro Akteur, etwa `TaxCalculator`, `InvoiceRenderer`, `InvoiceRepository`, mit einer Fassade, wo nötig.

Diese Fassung ist präziser als die aus Clean Code und deckt sich mit Becks Kopplung relativ zur Änderung: Was aus verschiedenen Gründen geändert wird, gehört getrennt.

### O: Open-Closed Principle

Module sollen offen für Erweiterung, aber geschlossen für Änderung sein. Auf Architekturebene heißt das: **Höherrangige Komponenten werden vor Änderungen in niederrangigen geschützt.** Wenn sich die Darstellung eines Berichts ändert, darf das die Geschäftsregeln nicht berühren. Erreicht wird das, indem Abhängigkeiten von den Details zu den Regeln zeigen.

### L: Liskov Substitution Principle

Untertypen müssen sich wie ihre Obertypen verhalten, damit Aufrufer sie austauschen können. Martin überträgt das auf Architektur: Auch REST-Schnittstellen verschiedener Anbieter, die angeblich dasselbe tun, müssen sich gleich verhalten, sonst sammeln sich Sonderfälle im Aufrufer, etwa `if (provider == X)`.

### I: Interface Segregation Principle

Niemand soll von Dingen abhängen, die er nicht nutzt. Auf Architekturebene: Wer ein Framework einbindet, das eine Datenbank einbindet, hängt von dieser Datenbank ab, auch wenn er sie nie benutzt. Jede Abhängigkeit bringt ihren Ballast mit.

### D: Dependency Inversion Principle

Das wichtigste Prinzip für Martins Architektur: **Quellcode-Abhängigkeiten sollen auf Abstraktionen zeigen, nicht auf konkrete Klassen.** Insbesondere sollen Geschäftsregeln nicht von veränderlichen Details abhängen.

```java
// Geschäftsregel definiert, was sie braucht
public interface OrderGateway {
    Optional<Order> findById(OrderId id);
    void save(Order order);
}

// Detail implementiert es, in einem äußeren Modul
class JpaOrderGateway implements OrderGateway { … }
```

Die Abhängigkeit im Quellcode zeigt vom Detail zur Regel, obwohl der Aufruf zur Laufzeit von der Regel zum Detail geht. Das ist die **Umkehrung**, die dem Prinzip den Namen gibt.

### Einordnung

Die Fassungen in diesem Buch sind präziser als in Martins früheren Texten. Besonders die SRP-Neufassung über Akteure beseitigt das häufige Missverständnis „eine Klasse, eine Methode“. Dependency Inversion ist der Kern dessen, was Feathers Seams, GOOS Rollen-Interfaces und Evans Repository-Interfaces in der Domäne nennen.

## Komponentenprinzipien (Teil IV)

Komponenten sind bei Martin die Einheiten der Auslieferung: in Java etwa JAR-Dateien, Maven- oder Gradle-Module oder Module des Java-Modulsystems. Er stellt sechs Prinzipien auf, drei für den Zusammenhalt innerhalb einer Komponente und drei für die Kopplung zwischen Komponenten.

### Kohäsion: was in eine Komponente gehört

| Prinzip | Aussage | Entspricht |
|---|---|---|
| **REP** Reuse/Release Equivalence | Was gemeinsam wiederverwendet wird, wird gemeinsam versioniert und ausgeliefert. | – |
| **CCP** Common Closure | Klassen, die sich aus demselben Grund gleichzeitig ändern, gehören in dieselbe Komponente. | SRP auf Komponentenebene |
| **CRP** Common Reuse | Wer eine Klasse einer Komponente nutzt, soll nicht von Klassen abhängen, die er nicht braucht. | ISP auf Komponentenebene |

Die drei ziehen gegeneinander: REP und CCP machen Komponenten größer, CRP macht sie kleiner. Martin rät, in jungen Projekten CCP zu betonen, also Änderbarkeit, und erst später auf Wiederverwendung zu achten.

### Kopplung: wie Komponenten voneinander abhängen

**ADP Acyclic Dependencies Principle:** Der Abhängigkeitsgraph zwischen Komponenten darf **keine Zyklen** enthalten. Zyklen bedeuten, dass man Komponenten nicht unabhängig bauen, testen und ausliefern kann. Man bricht sie mit Dependency Inversion oder einer neuen Komponente, die beide gemeinsam nutzen. In Java lassen sich Zyklen mit Werkzeugen wie ArchUnit oder dem Modulsystem verhindern.

**SDP Stable Dependencies Principle:** Abhängigkeiten sollen in Richtung **Stabilität** zeigen. Stabil heißt hier: Viele andere hängen davon ab, deshalb ist eine Änderung teuer. Martin misst das mit der **Instabilität** I = ausgehende Abhängigkeiten / (eingehende + ausgehende). Eine Komponente sollte nur von Komponenten abhängen, die stabiler sind als sie selbst.

**SAP Stable Abstractions Principle:** Stabile Komponenten sollen **abstrakt** sein, damit sie sich erweitern lassen, ohne geändert zu werden. Abstraktheit A ist der Anteil abstrakter Klassen und Interfaces.

{{< bild src="bild-1.png" alt="Abstraktheit gegen Instabilität · Martins Hauptreihe und die beiden Problemzonen" >}}

Abstraktheit gegen Instabilität · Martins Hauptreihe und die beiden Problemzonen

Die Komponenten sollen nahe der **Hauptreihe** liegen, der Diagonale zwischen „stabil und abstrakt“ und „instabil und konkret“. Zwei Bereiche sind problematisch:

- **Zone des Schmerzes:** stabil und konkret. Viele hängen davon ab, aber man kann es nicht erweitern, ohne es zu ändern. Typisch: ein zentrales Datenbankschema, das alle Dienste nutzen.
- **Zone der Nutzlosigkeit:** abstrakt, aber niemand hängt davon ab. Typisch: Interfaces und abstrakte Klassen, die nie implementiert oder genutzt werden.

### Einordnung

Die Kennzahlen sind einfach zu berechnen und werden von Werkzeugen wie JDepend oder Sonar unterstützt. In der Praxis werden sie selten konsequent verfolgt. Die Ideen dahinter sind aber zeitlos: Zyklen vermeiden, Abhängigkeiten auf stabile Teile richten und Stabiles abstrakt halten. Accelerates „unabhängig auslieferbar“ setzt azyklische Abhängigkeiten auf Teamebene voraus.

## Was Architektur ist (Teil V)

Architektur ist für Martin die **Form**, die ein System hat, um Entwicklung, Auslieferung, Betrieb und Wartung zu erleichtern. Sie soll nicht in erster Linie das Verhalten ermöglichen, das kann fast jede Architektur, sondern die Änderbarkeit.

### Optionen offenhalten

Der Kern: Jedes System besteht aus **Richtlinien**, also Geschäftsregeln und Abläufen, und **Details**, also Datenbank, Webserver, Frameworks, Kommunikationsprotokolle. Gute Architektur trennt beides und erlaubt, **Entscheidungen über Details so spät wie möglich** zu treffen. Ein guter Architekt maximiert die Zahl der Entscheidungen, die noch nicht getroffen sind.

Martins Lieblingsbeispiel ist sein eigenes Projekt FitNesse: Das Team schob die Entscheidung für eine Datenbank auf und arbeitete mit einer einfachen Dateispeicherung hinter einer Schnittstelle. Am Ende stellte sich heraus, dass gar keine Datenbank nötig war.

### Unabhängigkeit

Eine gute Architektur unterstützt:

- **Use Cases:** Die Struktur zeigt, was das System tut.
- **Betrieb:** Sie erlaubt verschiedene Betriebsformen, vom Monolithen bis zu verteilten Diensten, ohne grundlegenden Umbau.
- **Entwicklung:** Teams können unabhängig arbeiten, im Sinne von Conways Gesetz.
- **Auslieferung:** Teile lassen sich unabhängig ausliefern.

Dafür trennt man das System auf zwei Achsen: **horizontal nach Schichten**, etwa Oberfläche, anwendungsspezifische Regeln, allgemeine Geschäftsregeln, Datenbank, und **vertikal nach Use Cases**, sodass jeder Anwendungsfall sein eigenes Stück jeder Schicht hat.

### Echte und zufällige Duplikation

Ein wichtiger und oft übersehener Gedanke: Zwei Codestücke, die gleich aussehen, aber aus verschiedenen Gründen existieren, sind **zufällige Duplikation**. Man soll sie nicht zusammenlegen, weil sie sich bald unterschiedlich entwickeln werden. Das deckt sich mit Thomas' und Hunts Klarstellung, dass DRY Wissen meint, nicht Code, und mit Sandi Metz' Warnung vor der falschen Abstraktion.

### Grenzen ziehen

Grenzen trennen Dinge, die wichtig sind, von Dingen, die es nicht sind. Die Geschäftsregeln sind wichtig; Oberfläche und Datenbank sind es aus Sicht der Regeln nicht. Die Grenze wird mit Dependency Inversion gezogen: Die Regeln definieren Schnittstellen, die Details sind **Plug-ins**.

### Richtlinie und Ebene

Martin definiert die **Ebene** einer Richtlinie als ihre Entfernung von Ein- und Ausgaben. Je weiter eine Regel von Bildschirm, Datenbank und Netzwerk entfernt ist, desto höher ihre Ebene. Abhängigkeiten sollen von niedrigen zu hohen Ebenen zeigen.

### Geschäftsregeln

- **Kritische Geschäftsregeln** würden auch ohne Software gelten, etwa Zinsberechnung bei einem Kredit. Zusammen mit ihren Daten bilden sie **Entities**.
- **Use Cases** sind anwendungsspezifische Regeln: wie die Anwendung die Entities nutzt, um einem Nutzer etwas zu ermöglichen.
- **Request- und Response-Modelle** sind einfache Datenstrukturen an der Grenze des Use Case. Sie sollen keine Entities enthalten oder weiterreichen.

### Schreiende Architektur

Wenn man auf die Ordnerstruktur eines Systems schaut, soll sie **schreien, was das System tut**: Krankenhausverwaltung, Buchhaltung, Online-Shop. Nicht: Spring, Rails, MVC. Frameworks sind Werkzeuge, keine Architektur.

```
// schreit "Spring"                 // schreit "Bibliothek"
controller/                         lending/
service/                            catalog/
repository/                         membership/
entity/                             fines/
```

Das ist Evans' Forderung nach Modulen entlang der Fachlichkeit, und die Grundlage dessen, was Spring Modulith heute unterstützt.

## Die Clean Architecture

Das namensgebende Kapitel fasst die Ideen in einem Bild zusammen. Martin beschreibt es als Synthese aus Hexagonal Architecture, Onion Architecture und verwandten Ansätzen, die alle dasselbe Ziel haben: Geschäftsregeln unabhängig von Frameworks, Oberfläche, Datenbank und externen Diensten zu halten.

{{< bild src="bild-2.png" alt="die vier Ringe der Clean Architecture · Abhängigkeiten nur nach innen" >}}

die vier Ringe der Clean Architecture · Abhängigkeiten nur nach innen

### Die Dependency Rule

Die einzige Regel, die das Bild zusammenhält: **Quellcode-Abhängigkeiten zeigen nur nach innen.** Nichts in einem inneren Ring weiß etwas über einen äußeren Ring, keine Klassen, keine Funktionen, keine Datenformate.

### Die vier Ringe

| Ring | Inhalt | Ändert sich, wenn … |
|---|---|---|
| **Entities** | Geschäftsobjekte mit kritischen Regeln, unabhängig von jeder Anwendung | sich die Geschäftsregeln selbst ändern |
| **Use Cases** | Abläufe einer bestimmten Anwendung, die Entities orchestrieren | sich die Anwendung ändert |
| **Interface Adapters** | Übersetzung zwischen Use Cases und der Außenwelt: Controller, Presenter, Gateways, Mapper | sich Schnittstellen nach außen ändern |
| **Frameworks und Treiber** | Spring, Datenbank, Web-Server, Message Broker | Technologie ausgetauscht wird |

Martin betont, dass die Zahl vier keine Regel ist. Es können mehr oder weniger Ringe sein, solange die Dependency Rule gilt.

### Grenzen überqueren

Wenn ein Use Case Daten speichern oder ausgeben muss, ruft er etwas in einem äußeren Ring auf, darf es aber nicht kennen. Lösung: Der Use Case definiert ein Interface, ein **Output Port**, und der äußere Ring implementiert es.

```java
// innerer Ring: Use Case mit seinen Ports
public final class PlaceOrder {
    public interface Input  { void place(PlaceOrderRequest request); }
    public interface Output { void orderPlaced(PlaceOrderResponse response); void rejected(String reason); }

    private final OrderGateway orders;    // ebenfalls ein Interface im inneren Ring
    private final Output presenter;
    …
}

public record PlaceOrderRequest(String customerId, List<String> skus) {}
public record PlaceOrderResponse(String orderId, BigDecimal total) {}

// äußerer Ring: Spring-Controller ruft den Input Port
@RestController
class OrderController {
    private final PlaceOrder.Input placeOrder;
    @PostMapping("/orders") void place(@RequestBody PlaceOrderRequest r) { placeOrder.place(r); }
}
```

**Daten über Grenzen** sind einfache Datenstrukturen, die zum inneren Ring gehören. Man reicht keine JPA-Entities oder HTTP-Objekte nach innen durch, sonst entsteht eine Abhängigkeit in die falsche Richtung.

### Einordnung

Die Clean Architecture ist im Kern Cockburns Hexagonal Architecture mit mehr Schichten und einer prägnanten Regel. Sie entspricht Evans' Forderung, die Domänenschicht frei von Technik zu halten, und McConnells Barrikaden. In Java-Projekten wird sie oft in einer der Varianten Hexagonal, Onion oder Ports and Adapters umgesetzt.

## Humble Objects

An jeder Grenze gibt es Code, der schwer zu testen ist, etwa die Darstellung auf dem Bildschirm oder der Zugriff auf die Datenbank. Das **Humble-Object-Muster** teilt solchen Code in zwei Teile: einen **demütigen** Teil, der so einfach ist, dass er kaum Tests braucht, und einen testbaren Teil mit der eigentlichen Logik.

- **Presenter und View:** Der Presenter formatiert alle Daten, etwa Datumsangaben, Währungen, Farben für negative Zahlen, in ein einfaches View-Modell. Die View zeigt es nur noch an.
- **Datenbank-Gateways:** Die Implementierung des Gateways ist demütig; die Logik liegt im Use Case.
- **ORMs** gehören nach Martin in die Datenbankschicht. Sie bilden keine Objekte im Sinne der Domäne, sondern Datenstrukturen.

## Partielle Grenzen

Vollständige Grenzen mit eigenen Komponenten, Interfaces und Datenstrukturen sind teuer. Martin beschreibt günstigere Varianten:

- **Den letzten Schritt auslassen:** Interfaces und Datenstrukturen anlegen, aber alles in einer Komponente lassen.
- **Eindimensionale Grenze:** nur ein Strategy-Interface, ohne Gegenrichtung.
- **Fassade:** eine einfache Klasse, die Aufrufe weiterleitet, ohne Abhängigkeitsumkehr.

Die Frage, wann man eine volle Grenze baut, beantwortet er pragmatisch: beobachten, wo Reibung entsteht, und Grenzen einziehen, wenn die Kosten des Fehlens die Kosten des Baus übersteigen. Das ist Becks Abwägung aus Tidy First?, und eine deutliche Abschwächung gegenüber dem strengen Bild der vier Ringe.

## Die Main-Komponente

`main` ist die **schmutzigste** Komponente des Systems: Sie kennt alle konkreten Klassen, erzeugt sie, verdrahtet sie und übergibt dann die Kontrolle an die abstrakten Teile. Sie ist selbst ein Plug-in. In Java übernehmen Spring oder ein anderer DI-Container diese Rolle weitgehend; die Konfigurationsklassen sind die Main-Komponente.

## Services, große und kleine

Ein bemerkenswertes Kapitel, weil Martin dem Microservices-Hype widerspricht:

- **Services sind keine Architektur.** Sie sind ein Mittel der Auslieferung. Ein System aus Services kann genauso schlecht strukturiert sein wie ein Monolith.
- **Der Trugschluss der Entkopplung:** Services, die gemeinsame Datenstrukturen austauschen, sind gekoppelt, auch wenn sie in getrennten Prozessen laufen.
- **Der Trugschluss der unabhängigen Entwicklung:** Wenn eine fachliche Änderung alle Services berührt, sind die Teams nicht unabhängig.

Sein Beispiel ist das **Katzenproblem**: Ein Taxidienst wird um die Funktion erweitert, Katzen zu transportieren, und plötzlich müssen alle Services geändert werden, weil sie entlang technischer Aufgaben statt fachlicher Achsen geschnitten waren. Die Lösung: Services intern ebenfalls mit Komponenten und Dependency Inversion aufbauen, damit neue Funktionen als Erweiterung hinzukommen.

Das deckt sich mit den Warnungen aus DDD, Accelerate und Team Topologies: Grenzen entlang der Fachlichkeit, nicht entlang der Technik.

## Die Testgrenze

Tests sind für Martin der **äußerste Ring**: Sie hängen von allem ab, aber nichts hängt von ihnen ab.

- **Das Problem zerbrechlicher Tests:** Tests, die eng an die Struktur des Produktionscodes gekoppelt sind, brechen bei jeder Änderung. Eine Klasse pro Testklasse, ein Test pro Methode erzeugt genau diese Kopplung.
- **Testbarkeit als Designziel:** Systeme sollen eine **Test-API** haben, die Tests erlaubt, Geschäftsregeln ohne Oberfläche, Datenbank oder Netzwerk zu prüfen.
- **Tests von der Struktur entkoppeln:** Tests prüfen Verhalten über stabile Schnittstellen, nicht über interne Klassen.

Diese Position ist überraschend nah an GOOS' „Abfragen erlauben, Befehle erwarten“ und an Becks Test Desiderata, und sie steht in gewisser Spannung zu den drei TDD-Gesetzen aus Martins eigenen früheren Texten.

## Details (Teil VI)

Der letzte Teil enthält drei provokante Kapitel mit ähnlichem Titel.

### Die Datenbank ist ein Detail

Martin unterscheidet das **Datenmodell**, das architektonisch wichtig ist, von der **Datenbanktechnologie**, die es nicht ist. Ob die Daten in PostgreSQL, MongoDB oder Dateien liegen, sollen die Geschäftsregeln nicht wissen. Er begründet das historisch: Relationale Datenbanken wurden wichtig, weil Festplatten langsam waren und Daten effizient organisiert werden mussten. Diese Gründe würden mit schnellem Speicher an Bedeutung verlieren.

### Das Web ist ein Detail

Die Branche pendelt seit Jahrzehnten zwischen Rechenleistung beim Server und beim Client hin und her. Wer seine Geschäftsregeln an die aktuelle Form des Webs koppelt, muss sie bei jeder Pendelbewegung umbauen.

### Frameworks sind Details

Das Verhältnis zu einem Framework ist eine **asymmetrische Ehe**: Man verpflichtet sich ganz, das Framework verpflichtet sich zu nichts. Martins Rat: das Framework **auf Abstand halten**, es in den äußeren Ring verbannen und die Geschäftsregeln frei davon halten.

```java
// eng an Spring und JPA gebunden
@Entity @Table(name = "orders")
public class Order {
    @Id @GeneratedValue Long id;
    @Autowired transient PricingService pricing;   // Framework in der Domäne
}

// Domäne frei von Framework; Abbildung im äußeren Ring
public final class Order { … }                      // reines Java
@Entity @Table(name = "orders") class OrderJpaEntity { … }
class OrderMapper { Order toDomain(OrderJpaEntity e) { … } }
```

## Fallstudie

Ein kurzes Kapitel zeigt, wie Martin für eine Plattform zum Verkauf von Videos vorgehen würde: Akteure bestimmen, Use Cases pro Akteur ableiten, die Use Cases nach dem Akteur in Komponenten gruppieren, dann die Abhängigkeiten nach der Dependency Rule ausrichten. Das Kapitel ist knapp und eher Skizze als Durchführung.

## Das fehlende Kapitel (Simon Brown)

Das letzte Kapitel stammt von Simon Brown, dem Erfinder des C4-Modells für Architekturdiagramme. Es ist für Java-Entwickler vielleicht das praktisch wertvollste des Buchs. Browns These: **Der Teufel steckt in den Implementierungsdetails.** Eine schöne Architektur auf dem Whiteboard nützt nichts, wenn der Code sie nicht durchsetzt.

Er vergleicht vier Arten, Java-Code zu organisieren:

| Ansatz | Struktur | Problem |
|---|---|---|
| Nach Schichten | `web`, `service`, `data` | schreit Technik statt Fachlichkeit; Abkürzungen über Schichten sind leicht möglich |
| Nach Features | ein Paket pro Feature mit allen Klassen | besser lesbar, aber Schichten verwischen |
| Ports and Adapters | `domain`, `infrastructure`, `api` | sauber, aber in Java oft nur Konvention |
| **Nach Komponenten** | ein Paket pro Komponente mit öffentlicher Schnittstelle und paketprivaten Interna | Browns Empfehlung |

Sein zentraler Punkt: Wenn in Java **alle Klassen **`public` sind, ist jede Architektur nur eine Absprache, die beim nächsten Termindruck gebrochen wird. Er empfiehlt, die **Zugriffsmodifikatoren** zu nutzen:

```java
package shop.orders;

public interface OrdersComponent {             // einzige öffentliche Schnittstelle
    OrderId place(PlaceOrderCommand command);
}

class OrdersComponentImpl implements OrdersComponent { … }   // paketprivat
class OrderRepository { … }                                    // paketprivat, von außen unsichtbar
```

So kann ein Controller in einem anderen Paket die Datenbankzugriffe nicht direkt aufrufen, der Compiler verhindert es. Ergänzend helfen das Java-Modulsystem, mehrere Maven- oder Gradle-Module, ArchUnit-Tests oder Spring Modulith.

### Einordnung

Browns Kapitel relativiert Martins Bild auf eine wohltuende Weise: Nicht die Zahl der Ringe ist entscheidend, sondern ob der Code die Grenzen tatsächlich durchsetzt. Das ist Blochs Item 15, „Zugriff minimieren“, auf Architekturebene.

## Kritik und Einordnung

Clean Architecture ist eines der meistverkauften Architekturbücher und hat das Bild von Schichtenarchitektur in vielen Java-Teams geprägt. Es polarisiert ähnlich wie Clean Code, wenn auch etwas weniger.

### Stärken

- **Eine klare Regel:** Die Dependency Rule ist einfach zu verstehen, zu prüfen und zu lehren.
- **Präzisere SOLID-Fassungen:** vor allem SRP als Verantwortung gegenüber einem Akteur.
- **Geschäftsregeln im Zentrum:** Das schützt die wertvollsten Teile eines Systems vor Technikwechseln.
- **Gegen Framework-Hörigkeit:** Die Warnung vor der asymmetrischen Ehe ist berechtigt und für Spring-lastige Java-Projekte besonders relevant.
- **Services sind keine Architektur:** eine nüchterne Stimme im Microservices-Hype.
- **Simon Browns Kapitel:** Es macht aus Prinzipien durchsetzbare Strukturen.

### Kritikpunkte

**1. Viele Schichten, viel Abbildung.** Konsequent umgesetzt führt die Clean Architecture zu vielen Klassen pro Anwendungsfall: Request-Modell, Response-Modell, Input Port, Output Port, Interactor, Presenter, Controller, Gateway, Entity, JPA-Entity und Mapper. Aus Ousterhouts Sicht entstehen so viele flache Module und Durchreichschichten, deren Schnittstellen kaum weniger komplex sind als ihr Inhalt.

**2. Für die meisten Anwendungen zu viel.** Für eine überschaubare CRUD-Anwendung ist der Aufwand schwer zu rechtfertigen. Martin räumt mit den partiellen Grenzen ein, dass man nicht immer alles braucht, aber das Bild der vier Ringe wird oft als Pflicht verstanden. Evans unterscheidet hier klarer: Reiche Modelle in der Core Domain, einfache Lösungen in Generic Subdomains.

**3. Datenbank als Detail ist zu einfach.** Kleppmann zeigt, wie tief Konsistenzgarantien, Isolationsstufen und Transaktionen die Logik einer Anwendung prägen. Ob ein Use Case in einer Transaktion läuft oder nicht, ist keine Nebensache. Die Hoffnung, dass schneller Speicher Datenbanken unwichtig macht, hat sich nicht erfüllt.

**4. Wenig Fachlichkeit.** Wie man Entities und Use Cases fachlich schneidet, bleibt dünn. Aggregate, Bounded Contexts und Ubiquitous Language fehlen fast völlig. Dafür braucht man DDD.

**5. Wenig Neues.** Die Kernidee stammt aus Hexagonal Architecture und Onion Architecture. Viele Kapitel über Paradigmen und Martins Karriere füllen Seiten, ohne zur Architektur viel beizutragen.

**6. Ton.** Wie in Clean Code: Regeln werden als absolut formuliert, Gegenpositionen kaum diskutiert, und vieles stützt sich auf Martins persönliche Erfahrung.

### Gesamturteil

Die zentrale Idee, Geschäftsregeln von Technik zu trennen und Abhängigkeiten nach innen zu richten, ist richtig und wichtig. Die konkrete Umsetzung mit vielen Ringen und Abbildungsschichten ist dagegen ein Werkzeug für bestimmte Situationen, nicht der Standard. Am meisten bringt das Buch zusammen mit DDD für die Fachlichkeit, Ousterhout als Gegengewicht gegen flache Schichten und Simon Browns Kapitel für die praktische Durchsetzung in Java.

## Martin im Licht der Reihe

Clean Code war das erste Buch dieser Reihe. Nach vierzehn weiteren Büchern lässt sich Martins Architekturbuch mit deutlich mehr Abstand lesen.

| Martins These | Wer zustimmt | Wer widerspricht oder relativiert |
|---|---|---|
| Struktur ist wichtiger als Verhalten | Fowler (Design Stamina), Thomas und Hunt (ETC) | Beck in Tidy First?: Zeitwert gegen Optionswert, je nach Lage |
| SRP als Verantwortung gegenüber einem Akteur | Beck (Kopplung relativ zur Änderung), Team Topologies (ein Team pro System) | – |
| Dependency Inversion an Grenzen | Feathers (Seams), GOOS (Rollen), Evans (Repository-Interfaces), Cockburn (Hexagonal) | – |
| Viele Ringe und Abbildungsschichten | – | Ousterhout (flache Module, Pass-Through), McConnell (Komplexität minimieren) |
| Datenbank ist ein Detail | Evans (Domäne frei von Technik) | Kleppmann (Transaktionen und Konsistenz prägen die Logik) |
| Frameworks auf Abstand halten | Nygard (Betreibbarkeit), Bloch (eigene Schnittstellen) | Pragmatiker, die Frameworks bewusst eng nutzen, um Code zu sparen |
| Schreiende Architektur, fachliche Pakete | Evans, Team Topologies, Spring Modulith | – |
| Services sind keine Architektur | Accelerate, Team Topologies, DDD | – |
| Zufällige Duplikation nicht zusammenlegen | Thomas und Hunt (DRY ist Wissen), Metz | Martins eigene Clean-Code-Regel „Duplikation ist die Wurzel allen Übels“ |
| Tests nicht an Struktur koppeln | GOOS, Beck (Test Desiderata) | Martins eigene drei TDD-Gesetze in strenger Lesart |

Auffällig ist, dass Martin in Clean Architecture **an mehreren Stellen pragmatischer** ist als in Clean Code: zufällige Duplikation, partielle Grenzen, Tests gegen stabile Schnittstellen. Der Ton bleibt absolut, der Inhalt ist abgewogener.

## Diskussionsfragen

1. **Clean Architecture in der Praxis:** Hast du ein Projekt mit vollständiger Clean Architecture erlebt? War der Aufwand an Abbildungsklassen gerechtfertigt?
2. **JPA-Annotationen in der Domäne:** Trennst du Domänenobjekte und JPA-Entities, oder nutzt du dieselben Klassen? Was waren die Folgen?
3. **Datenbank als Detail:** Wie oft wurde in deinen Projekten tatsächlich die Datenbank gewechselt? Und hat die Architektur dabei geholfen?
4. **Schreiende Architektur:** Wie sind eure Pakete organisiert, nach Technik oder nach Fachlichkeit?
5. **Zugriffsmodifikatoren:** Nutzt ihr paketprivate Klassen, das Java-Modulsystem oder ArchUnit, um Grenzen durchzusetzen, oder ist eure Architektur Konvention?
6. **Hexagonal, Onion, Clean:** Machst du einen Unterschied zwischen diesen Ansätzen, oder sind es für dich Varianten derselben Idee?
7. **Martin und Ousterhout:** Nach beiden Architekturbetrachtungen, wo stehst du jetzt beim Streit um viele kleine gegen wenige tiefe Einheiten?
8. **Weiter:** Offen sind noch *Patterns of Enterprise Application Architecture*, *Fundamentals of Software Architecture* und *Java Concurrency in Practice*, danach die KI-Bücher. Welches zuerst?
