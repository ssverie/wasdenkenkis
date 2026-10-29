+++
title = "Domain-Driven Design – Zusammenfassung und Einordnung"
description = "Eric Evans, Domain-Driven Design: Tackling Complexity in the Heart of Software (2003)"
date = 2026-10-29T14:40:45+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["domain-driven-design-2003"]
+++

## Einleitung

Die Kernthese: Die eigentliche Komplexität der meisten Software liegt nicht in der Technik, sondern in der **Fachdomäne**. Deshalb soll ein Modell der Domäne im Mittelpunkt des Designs stehen, gemeinsam von Entwicklern und Fachexperten erarbeitet und direkt im Code abgebildet.

### Autor und Kontext

Eric Evans war Berater und arbeitete jahrelang an großen Geschäftsanwendungen, etwa in Logistik, Finanzwesen und Elektronikentwurf. Das Buch erschien 2003, wegen seines Umschlags oft „Blue Book“ genannt. Es war die Zeit von J2EE, EJB und schwerfälligen Enterprise-Frameworks, in denen Fachlogik oft zwischen Datenbankzugriff, Transaktionscode und Oberfläche verschwand. Fowler hatte im selben Umfeld gerade *Patterns of Enterprise Application Architecture* (2002) veröffentlicht, mit dem Domain Model als einem von mehreren Mustern.

Evans' Anspruch ging weiter: Er wollte nicht nur ein Architekturmuster beschreiben, sondern eine **Denkweise**, wie man komplexe Fachlichkeit in Software überführt.

### Drei Grundsätze

1. **Fokus auf die Kerndomäne:** Nicht alles verdient gleich viel Designaufwand. Das, was das Unternehmen wirklich auszeichnet, bekommt die besten Leute und das sorgfältigste Modell.
2. **Modell im Dialog entwickeln:** Entwickler und Fachexperten erarbeiten das Modell gemeinsam, in einer gemeinsamen Sprache.
3. **Modell und Code sind eins:** Das Modell ist kein Diagramm, das neben dem Code existiert. Der Code *ist* das Modell. Ändert sich das eine, ändert sich das andere.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Das Domänenmodell zum Arbeiten bringen | Wissen erarbeiten, gemeinsame Sprache, Modell und Implementierung verbinden |
| II. Bausteine | Schichtenarchitektur, Entities, Value Objects, Services, Modules, Aggregates, Factories, Repositories |
| III. Refactoring zu tieferer Einsicht | Durchbrüche, implizite Konzepte explizit machen, Supple Design, Analysemuster |
| IV. Strategisches Design | Bounded Contexts, Context Maps, Destillation, große Strukturen |

Die Beispiele kommen vor allem aus einer Frachtschiffs-Anwendung, dazu ein Leiterplattenentwurf und ein Konsortialkredit-System.

### Taktisch und strategisch

In der späteren Diskussion hat sich eine Unterscheidung eingebürgert, die Evans so noch nicht benannte:

- **Taktisches DDD:** Teil II, also die Bausteine im Code wie Entities, Value Objects und Aggregates.
- **Strategisches DDD:** Teil IV, also das Schneiden und Verbinden großer Modelle über Bounded Contexts.

Evans selbst hat später gesagt, er würde das Buch heute anders anordnen: Die strategischen Teile stehen zu weit hinten. Viele Leser kamen nie dorthin und hielten DDD für eine Sammlung von Klassenmustern. Das ist einer der Gründe, warum das Buch erst Jahre später seine volle Wirkung entfaltete.

## Warum DDD wieder relevant ist

DDD war nach 2003 einige Jahre ein Nischenthema für Enterprise-Architekten. Ab etwa 2014 wurde es plötzlich zentral, weil die Branche mit Microservices ein Problem bekam, für das Evans' strategischer Teil die passende Antwort hatte: **Wo schneidet man ein System?**

### Die Entwicklung

| Jahr | Ereignis | Bedeutung für DDD |
|---|---|---|
| 2022–2023 | Spring Modulith | Bounded Contexts als Module innerhalb eines Monolithen, mit geprüften Grenzen |
| 2021 | Vlad Khononov, *Learning Domain-Driven Design* | moderner, zugänglicher Einstieg mit Fokus auf strategischem Design |
| 2019 | Skelton und Pais, *Team Topologies* | Teamgrenzen entlang fachlicher Grenzen, Conways Gesetz als Designwerkzeug |
| 2019 | Zhamak Dehghani, Data Mesh | Datenverantwortung nach Domänen statt zentralem Data Warehouse |
| 2015 | Sam Newman, *Building Microservices* | Bounded Context als Ausgangspunkt für Servicegrenzen |
| 2014 | James Lewis und Martin Fowler, Artikel „Microservices“ | Microservices werden Mainstream, mit ausdrücklichem Verweis auf DDD |
| 2013 | Alberto Brandolini, Event Storming | leichtgewichtige Workshop-Methode, um Domänen gemeinsam zu erkunden |
| 2013 | Vaughn Vernon, *Implementing Domain-Driven Design* | das „Red Book“, praktische Umsetzung mit Java |
| um 2010 | Greg Young, CQRS und Event Sourcing | Domain Events werden zum zentralen Baustein |
| 2005 | Alistair Cockburn, Hexagonal Architecture | Fachkern unabhängig von Technik, passt zu Evans' Schichtenidee |
| 2003 | Evans, *Domain-Driven Design* | das „Blue Book“ |

### Vier Treiber des Comebacks

**1. Microservices brauchen Grenzen.** Die größte Gefahr bei Microservices ist ein „verteilter Monolith“: Services, die so eng gekoppelt sind, dass jede Änderung mehrere Deployments erfordert. Der häufigste Grund sind falsch geschnittene Grenzen, etwa nach technischen Schichten oder nach Datenbanktabellen. Ein **Bounded Context** liefert eine fachliche Grenze, innerhalb derer ein Modell konsistent ist und außerhalb derer es nicht gelten muss. Das ist fast genau die Eigenschaft, die ein Service braucht.

**2. Teams und Architektur.** Conways Gesetz sagt, dass Systeme die Kommunikationsstruktur ihrer Organisation abbilden. *Team Topologies* dreht das um: Man schneidet Teams bewusst nach fachlichen Grenzen, damit die Architektur folgt. Evans' Context-Map-Muster wie Customer/Supplier, Conformist oder Anticorruption Layer beschreiben im Kern **Beziehungen zwischen Teams**, nicht nur zwischen Code.

**3. Ereignisse als Integrationsmittel.** Mit Event-getriebenen Architekturen, Kafka und Event Sourcing wurden **Domain Events** wichtig, also fachlich benannte Ereignisse wie „Bestellung aufgegeben“. Im Original-Buch fehlen sie noch weitgehend, Evans hat sie später in seiner *DDD Reference* ausdrücklich ergänzt. Event Storming setzt genau dort an: Man sammelt mit Fachexperten auf Klebezetteln alle Ereignisse und findet daraus die Kontexte.

**4. Die Ernüchterung nach Microservices.** Viele Teams haben gemerkt, dass sie zu früh zu viele Services gebaut haben. Der **modulare Monolith** ist die Gegenbewegung: ein Deployment, aber klar getrennte fachliche Module. Auch hier sind Bounded Contexts der Maßstab für den Schnitt, nur ohne Netzwerkgrenze. Werkzeuge wie Spring Modulith oder ArchUnit prüfen diese Grenzen automatisch.

### Was sich dabei verschoben hat

Die Neuentdeckung hat den Schwerpunkt verlagert: Heute gilt **strategisches DDD** als der wertvollere Teil, die taktischen Bausteine als nützlich, aber optional. Viele Teams wenden Bounded Contexts und Ubiquitous Language an, ohne je ein Aggregate im Sinne von Evans zu schreiben. Das entspricht Evans' eigener späterer Einschätzung.

## Das Modell zum Arbeiten bringen

Ein Domänenmodell ist eine bewusst vereinfachte, ausgewählte Sicht auf die Fachlichkeit, die genau das enthält, was für die Software nötig ist. Es ist kein Abbild der Wirklichkeit, sondern ein Werkzeug.

### Knowledge Crunching

Evans beschreibt Modellierung als **Wissensverdichtung**: Entwickler und Fachexperten arbeiten eng zusammen, skizzieren, verwerfen, probieren am Code aus. Das Modell entsteht nicht in einer Analysephase, sondern iterativ, und es wird über die Zeit tiefer.

Sein Beispiel ist eine Leiterplatten-Software. Die Entwickler verstehen anfangs die Fachbegriffe der Ingenieure nicht. Erst durch viele Gespräche, Skizzen und Prototypen entsteht ein Modell, das beide Seiten teilen. Wichtig ist dabei: Die Fachexperten lernen ebenfalls, ihr eigenes Wissen präziser zu fassen.

### Ubiquitous Language

Der vielleicht wichtigste Begriff des Buchs. Team und Fachexperten nutzen **eine** gemeinsame Sprache, die auf dem Modell beruht, in Gesprächen, Dokumenten, Diagrammen und im Code.

- Wenn Fachexperten „Ladung umbuchen“ sagen, heißt die Methode `rebook()`, nicht `updateCargoRouting()`.
- Wenn ein Begriff im Gespräch holpert oder mehrdeutig ist, ist das ein Signal, dass das Modell nicht stimmt.
- Änderungen der Sprache sind Änderungen des Modells und damit des Codes.

Evans' Gegenbild: ein Projekt, in dem Fachexperten ihre Sprache sprechen, Analysten eine zweite, Entwickler eine dritte im Code, und überall Übersetzung stattfindet, bei der Bedeutung verloren geht.

```java
// Technische Sprache, Fachexperten verstehen es nicht
cargo.setRouteSpecId(newSpec.getId());
routeDao.updateLegs(cargo.getId(), legs);

// Ubiquitous Language
cargo.specifyNewRoute(routeSpecification);
cargo.assignToRoute(itinerary);
```

### Model-Driven Design

Evans kritisiert die Trennung in Analysemodell und Designmodell. Wenn Analysten ein Modell zeichnen und Entwickler dann etwas anderes bauen, driften beide auseinander, und das Analysemodell wird bedeutungslos. Stattdessen soll **ein** Modell sowohl die Fachlichkeit ausdrücken als auch direkt implementierbar sein. Muss man das Modell für die Implementierung verbiegen, ändert man das Modell, nicht nur den Code.

Daraus folgt eine Forderung an die Organisation: **Hands-on Modelers.** Wer am Modell mitarbeitet, soll auch Code schreiben, und wer Code schreibt, soll am Modell mitarbeiten. Reine Architekten, die nur Diagramme liefern, lehnt Evans ab.

### Einordnung

Ubiquitous Language ist das am breitesten übernommene Konzept des Buchs, auch in Teams, die sonst nichts von DDD nutzen. Es deckt sich mit Martins Forderung nach Namen aus der Problemdomäne und Ousterhouts Forderung nach präzisen, konsistenten Namen, geht aber weiter: Die Sprache wird mit Fachexperten **verhandelt**, nicht nur von Entwicklern gewählt.

Die Schwierigkeit in der Praxis: Fachexperten haben oft wenig Zeit, und viele Organisationen trennen Fachabteilung und Entwicklung streng. In Deutschland kommt eine eigene Frage dazu: Code auf Englisch, Fachsprache auf Deutsch. Viele Teams entscheiden sich bewusst, Fachbegriffe deutsch im Code zu lassen, etwa `Rechnungsposition` statt einer ungenauen Übersetzung, um die Ubiquitous Language nicht zu brechen.

## Bausteine I

Die Bausteine sind Muster, mit denen sich ein Domänenmodell sauber in objektorientiertem Code ausdrücken lässt. Sie sind das, was die meisten Entwickler zuerst mit DDD verbinden.

### Layered Architecture

Evans teilt ein System in vier Schichten: **Benutzeroberfläche**, **Anwendung**, **Domäne** und **Infrastruktur**. Entscheidend ist, dass die Domänenschicht frei von technischen Belangen bleibt: keine SQL-Abfragen, keine HTTP-Details, keine Framework-Abhängigkeiten. Die Anwendungsschicht koordiniert Abläufe, enthält aber selbst keine Fachregeln.

Das Gegenmuster nennt Evans **Smart UI**: Fachlogik direkt in der Oberfläche. Er räumt ein, dass das für einfache Anwendungen legitim sein kann, aber DDD ausschließt.

Spätere Architekturen wie Hexagonal, Onion oder Clean Architecture haben die Schichten umgedreht: Die Domäne steht in der Mitte, und Infrastruktur hängt von ihr ab statt umgekehrt.

### Entities

Eine **Entity** ist ein Objekt mit eigener **Identität**, die über die Zeit und über Zustandsänderungen hinweg gleich bleibt. Ein Kunde bleibt derselbe Kunde, auch wenn er umzieht und den Namen ändert.

```java
public class Customer {
    private final CustomerId id;      // Identität
    private Name name;
    private Address address;

    public void relocateTo(Address newAddress) { this.address = newAddress; }

    @Override public boolean equals(Object o) {
        return o instanceof Customer c && id.equals(c.id);   // Gleichheit über Identität
    }
    @Override public int hashCode() { return id.hashCode(); }
}
```

Das Wichtigste an einer Entity ist ihre Identität und ihr Lebenszyklus, nicht ihre Attribute.

### Value Objects

Ein **Value Object** hat keine Identität. Es wird nur durch seine Werte beschrieben, ist unveränderlich und wird ersetzt statt geändert. Geld, Adresse, Zeitraum, Farbe.

```java
public record Money(BigDecimal amount, Currency currency) {
    public Money {
        if (amount.scale() > currency.getDefaultFractionDigits())
            throw new IllegalArgumentException("Zu viele Nachkommastellen");
    }
    public Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("Währungen verschieden");
        return new Money(amount.add(other.amount), currency);
    }
}
```

Evans betont: Value Objects sollen die **Regel** sein, Entities die Ausnahme. Viele Modelle haben zu viele Entities und zu wenige Werte. In modernem Java sind Records fast genau dafür gemacht. Das deckt sich mit Fowlers Replace Primitive with Object und Change Reference to Value.

### Domain Services

Manche Fachoperationen gehören zu keinem einzelnen Objekt, etwa eine Überweisung zwischen zwei Konten. Dafür gibt es **Domain Services**: zustandslose Operationen, benannt in der Ubiquitous Language.

```java
public class FundsTransferService {
    public void transfer(Account from, Account to, Money amount) {
        from.withdraw(amount);
        to.deposit(amount);
    }
}
```

Evans warnt vor dem Missbrauch: Wer alles in Services packt, bekommt ein **anämisches Domänenmodell**, mit Entities als reinen Datenbehältern und der Logik in Services. Fowler hat diesen Begriff in einem bekannten Artikel populär gemacht. Services sind die Ausnahme für das, was wirklich keinen natürlichen Platz in einem Objekt hat.

### Modules

Module, in Java also Pakete, sollen nach **fachlichen Konzepten** geschnitten sein, nicht nach technischen Kategorien. Also `shipping.cargo`, `shipping.routing` statt `entities`, `services`, `repositories`. Ein Modul erzählt einen Teil der Geschichte der Domäne.

Gerade dieser Punkt wird in vielen Java-Projekten bis heute ignoriert, in denen Pakete wie `controller`, `service` und `repository` dominieren. Spring Modulith setzt genau hier an und macht fachliche Pakete zu geprüften Modulen.

## Bausteine II: Lebenszyklus von Objekten

Die drei Muster dieses Kapitels regeln, wie Objekte zusammengehalten, erzeugt und gespeichert werden. **Aggregates** sind dabei das wichtigste und schwierigste Konzept des taktischen DDD.

### Aggregates

Ein **Aggregate** ist eine Gruppe zusammengehöriger Objekte, die als Einheit behandelt wird, um **Invarianten** zu schützen, also Regeln, die immer gelten müssen. Jedes Aggregate hat genau eine **Aggregate Root**, eine Entity, über die alle Zugriffe von außen laufen.

Die Regeln:

- Von außen darf man nur die Root referenzieren, nicht die inneren Objekte.
- Nur die Root wird direkt aus der Datenbank geladen, innere Objekte nur über sie.
- Die Root prüft alle Invarianten des Aggregats bei jeder Änderung.
- Beim Löschen wird das ganze Aggregat entfernt.

```java
public class PurchaseOrder {                          // Aggregate Root
    private final OrderId id;
    private final Money approvedLimit;
    private final List<OrderLine> lines = new ArrayList<>();

    public void addLine(ProductId product, int quantity, Money unitPrice) {
        var line = new OrderLine(product, quantity, unitPrice);
        if (total().plus(line.subtotal()).isGreaterThan(approvedLimit))
            throw new LimitExceededException(id, approvedLimit);   // Invariante
        lines.add(line);
    }

    public Money total() {
        return lines.stream().map(OrderLine::subtotal).reduce(Money.zero(EUR), Money::plus);
    }

    public List<OrderLine> lines() { return List.copyOf(lines); }   // keine Änderung von außen
}
```

Evans' Beispiel ist ähnlich eine Bestellung mit Positionen und Genehmigungslimit. Würde jemand eine `OrderLine` direkt ändern, könnte das Limit unbemerkt überschritten werden.

### Regeln, die später dazukamen

Vaughn Vernon hat in einer viel zitierten Artikelserie und im Red Book Faustregeln ergänzt, die heute oft als Teil von DDD gelten:

1. **Kleine Aggregates:** Möglichst nur die Root und wenige Value Objects. Große Aggregates führen zu Sperrkonflikten und Performanceproblemen.
2. **Andere Aggregates nur über ID referenzieren**, nicht über Objektreferenz. Also `CustomerId customerId` statt `Customer customer`.
3. **Ein Aggregate pro Transaktion ändern.** Konsistenz zwischen Aggregates wird über Domain Events und eventual consistency hergestellt.
4. **Echte Invarianten modellieren**, nicht alles, was zusammen auf einem Bildschirm erscheint.

Diese Regeln machen Aggregates zu natürlichen Kandidaten für Transaktions- und später auch Servicegrenzen.

### Factories

Wenn die Erzeugung eines Aggregats komplex ist, etwa weil Invarianten schon beim Anlegen gelten müssen, übernimmt eine **Factory** das. Sie liefert immer ein gültiges, vollständiges Objekt. Das kann eine statische Methode auf der Root sein, eine eigene Factory-Klasse oder eine Methode auf einem anderen Aggregat.

```java
public static PurchaseOrder open(OrderId id, CustomerId customer, Money limit) {
    if (limit.isNegative()) throw new IllegalArgumentException("Limit negativ");
    return new PurchaseOrder(id, customer, limit);
}
```

Das ist GoFs Factory Method bzw. Fowlers Replace Constructor with Factory Function, mit fachlicher Motivation.

### Repositories

Ein **Repository** gibt die Illusion einer Sammlung aller Aggregates eines Typs im Speicher. Die Domäne kennt nur das Interface, die Implementierung liegt in der Infrastruktur.

```java
// in der Domänenschicht
public interface PurchaseOrderRepository {
    Optional<PurchaseOrder> findById(OrderId id);
    List<PurchaseOrder> findOpenOrdersFor(CustomerId customer);
    void save(PurchaseOrder order);
}

// in der Infrastruktur
class JpaPurchaseOrderRepository implements PurchaseOrderRepository { … }
```

Wichtig: Repositories gibt es **pro Aggregate Root**, nicht pro Tabelle. Ein `OrderLineRepository` wäre ein Zeichen, dass die Aggregatgrenze verletzt wird.

### Einordnung

Aggregates sind der Teil des taktischen DDD mit dem größten Nutzen und dem größten Missbrauchspotenzial. Richtig geschnitten machen sie Invarianten und Transaktionen klar. Falsch geschnitten, meist zu groß, führen sie zu langsamen Ladezeiten und Sperrkonflikten. In der Java-Praxis kollidieren sie zudem mit JPA, das bidirektionale Objektgraphen begünstigt. Spring Data hat das Repository-Konzept populär gemacht, aber oft verwässert: Viele Projekte haben ein Repository pro Tabelle, was Evans' Idee umkehrt.

## Refactoring zu tieferer Einsicht

Fowlers Refactorings verbessern Code. Evans geht eine Ebene höher: Er will das **Modell** refaktorieren, wenn das Team die Domäne besser versteht. Diese Umbauten sind seltener, aber wertvoller.

### Durchbrüche

Evans erzählt von einem Projekt für Konsortialkredite, bei denen mehrere Banken gemeinsam einen großen Kredit vergeben. Das ursprüngliche Modell verteilte Zahlungen über komplizierte Sonderfälle. Monate später erkannte das Team, dass „Anteile“ ein eigenes Konzept sind, das sich wie ein Wert addieren und aufteilen lässt. Das neue Modell war einfacher, und plötzlich ließen sich Anforderungen umsetzen, die vorher kaum machbar schienen.

Solche **Durchbrüche** kann man nicht planen, aber man kann sie vorbereiten: durch ständiges Refaktorieren, offene Gespräche mit Fachexperten und den Mut, ein funktionierendes Modell umzubauen.

### Implizite Konzepte explizit machen

Wichtige Fachkonzepte verstecken sich oft im Code. Hinweise darauf:

- **Begriffe der Fachexperten**, die im Code nicht vorkommen
- **Umständlicher Code**, besonders verschachtelte Bedingungen an einer Stelle
- **Widersprüche** zwischen Aussagen verschiedener Fachexperten
- **Fachliteratur**, die bewährte Konzepte für die Domäne kennt

Drei Arten von Konzepten werden laut Evans besonders oft übersehen: **Constraints** (Regeln), **Prozesse** und **Spezifikationen**.

### Specification

Eine **Specification** ist ein Prädikat als eigenes Objekt: Erfüllt ein Objekt ein Kriterium? Evans nennt drei Einsatzzwecke: Validieren, Auswählen aus einer Menge und Erzeugen nach Vorgabe.

```java
@FunctionalInterface
public interface Specification<T> {
    boolean isSatisfiedBy(T candidate);

    default Specification<T> and(Specification<T> other) {
        return c -> isSatisfiedBy(c) && other.isSatisfiedBy(c);
    }
    default Specification<T> not() { return c -> !isSatisfiedBy(c); }
}

class OverdueInvoice implements Specification<Invoice> {
    private final LocalDate today;
    OverdueInvoice(LocalDate today) { this.today = today; }
    public boolean isSatisfiedBy(Invoice i) {
        return !i.isPaid() && i.dueDate().plusDays(30).isBefore(today);
    }
}

var reminderCandidates = invoices.stream()
    .filter(new OverdueInvoice(today).and(Invoice::isPrivateCustomer)::isSatisfiedBy)
    .toList();
```

Die Regel „30 Tage nach Fälligkeit“ hat jetzt einen Namen aus der Fachsprache und lässt sich testen, kombinieren und wiederverwenden. Spring Data JPA bietet mit `Specification` übrigens ein Interface gleichen Namens, das dieselbe Idee für Datenbankabfragen umsetzt.

## Supple Design

Ein **geschmeidiges Design** macht Änderungen leicht und Code einladend. Evans beschreibt dafür sieben Muster:

| Muster | Idee |
|---|---|
| Intention-Revealing Interfaces | Namen und Signaturen beschreiben Wirkung und Zweck, nicht Mechanik. |
| Side-Effect-Free Functions | Möglichst viel Logik in Funktionen ohne Seiteneffekte, idealerweise auf Value Objects. |
| Assertions | Nach- und Vorbedingungen sowie Invarianten ausdrücklich machen, in Tests oder Code. |
| Conceptual Contours | Objekte entlang stabiler fachlicher Konturen schneiden, nicht zu fein und nicht zu grob. |
| Standalone Classes | Klassen mit möglichst wenig Abhängigkeiten, die man isoliert verstehen kann. |
| Closure of Operations | Operationen, deren Ergebnis denselben Typ hat wie ihre Argumente, etwa `Money.plus(Money)`. |
| Declarative Design | Regeln deklarativ ausdrücken, etwa als kombinierbare Specifications. |

**Conceptual Contours** ist dabei bemerkenswert nah an Ousterhout: Evans warnt sowohl vor zu großen Klassen als auch davor, alles in kleinste Teile zu zerlegen. Die richtige Größe ergibt sich aus den Konturen der Fachlichkeit. **Side-Effect-Free Functions** und **Closure of Operations** wiederum sind funktionale Ideen, die 2003 im Java-Umfeld ungewöhnlich waren.

### Analysemuster und Entwurfsmuster

Evans empfiehlt, auf **Analysemuster** zurückzugreifen, etwa aus Fowlers *Analysis Patterns* (1996), die bewährte Modelle für Bereiche wie Buchhaltung oder Messwerte beschreiben. Und er zeigt, dass GoF-Patterns auch Fachkonzepte sein können: Eine **Strategy** heißt in der Domäne oft **Policy**, etwa eine Überbuchungsregel. Ein **Composite** beschreibt etwa eine Route, die aus Teilrouten besteht. Entscheidend ist, dass das Pattern ein Fachkonzept ausdrückt und nicht nur ein technisches Problem löst.

## Strategisches Design: Bounded Context

In einem großen System gibt es nicht **ein** Modell, sondern mehrere. Der Versuch, ein einziges, unternehmensweites Modell zu bauen, scheitert fast immer. Deshalb braucht jedes Modell eine ausdrückliche Grenze, innerhalb derer es gilt: den **Bounded Context**.

### Das Problem vereinheitlichter Modelle

In einem Onlinehandel bedeutet „Produkt“ im Katalog etwas anderes als im Lager oder in der Buchhaltung. Im Katalog zählen Beschreibung, Bilder, Kategorien. Im Lager Gewicht, Lagerplatz, Bestand. In der Buchhaltung Steuersatz, Erlöskonto. Ein gemeinsames `Product` mit allen Attributen wird zur unwartbaren Riesenklasse, die jedes Team bei jeder Änderung behindert.

```java
// Kontext Katalog
package shop.catalog;
public record Product(ProductId id, String title, String description, List<ImageUrl> images) {}

// Kontext Lager
package shop.warehouse;
public class StockItem {
    private final ProductId productId;
    private final Weight weight;
    private int quantityOnHand;
    public void reserve(int qty) { … }
}

// Kontext Abrechnung
package shop.billing;
public record BillableItem(ProductId productId, TaxRate taxRate, RevenueAccount account) {}
```

Die gemeinsame `ProductId` ist das Einzige, was die Kontexte teilen. Jeder hat sein eigenes Modell in seiner eigenen Sprache. Dass dasselbe Wort in verschiedenen Kontexten Verschiedenes bedeutet, ist kein Fehler, sondern die Normalität, die DDD ausdrücklich macht.

### Innerhalb eines Kontexts

Innerhalb eines Bounded Context soll das Modell **einheitlich** bleiben. Evans nennt dafür **Continuous Integration** im weiteren Sinn: Das Team integriert Code und Begriffe ständig, damit das Modell nicht in Teilmodelle zerfällt. Ein Bounded Context gehört idealerweise einem Team.

### Context Map

Eine **Context Map** beschreibt die Kontexte eines Systems und die Beziehungen zwischen ihnen. Die Beziehungen sind vor allem **organisatorisch**: Wer hängt von wem ab, wer hat Einfluss, wer muss sich anpassen?

| Muster | Beziehung | Wann sinnvoll |
|---|---|---|
| Shared Kernel | Zwei Teams teilen einen kleinen, gemeinsam gepflegten Teil des Modells. | enge Zusammenarbeit, hohes Vertrauen |
| Customer/Supplier | Das nachgelagerte Team ist Kunde, das vorgelagerte berücksichtigt dessen Bedürfnisse. | Teams mit gemeinsamer Leitung |
| Conformist | Das nachgelagerte Team übernimmt das Modell des vorgelagerten unverändert. | kein Einfluss auf den Lieferanten, Modell ist brauchbar |
| Anticorruption Layer | Eine Übersetzungsschicht schützt das eigene Modell vor einem fremden. | Altsystem oder fremdes Modell, das man nicht übernehmen will |
| Open Host Service | Ein Kontext bietet ein klar definiertes Protokoll für viele Nutzer an. | ein Dienst mit vielen Konsumenten |
| Published Language | Ein dokumentiertes Austauschformat, etwa ein Branchenstandard. | Integration über Organisationsgrenzen |
| Separate Ways | Keine Integration, jeder Kontext löst sein Problem selbst. | Integration kostet mehr, als sie bringt |

In der späteren *DDD Reference* ergänzte Evans **Partnership** für Teams, die gemeinsam Erfolg haben oder scheitern, und **Big Ball of Mud** für Bereiche ohne klares Modell, die man abgrenzt, statt sie zu reparieren.

### Anticorruption Layer

Das für Legacy-Arbeit wichtigste Muster:

```java
// Fremdes Modell des alten ERP
class ErpArtikelDto { String artNr; String bez; double vkPreisBrutto; int mwstKz; }

// Anticorruption Layer: übersetzt ins eigene Modell
class ErpProductTranslator {
    BillableItem toBillableItem(ErpArtikelDto dto) {
        return new BillableItem(
            new ProductId(dto.artNr),
            TaxRate.fromErpCode(dto.mwstKz),
            RevenueAccount.DEFAULT);
    }
}
```

Das eigene Modell bleibt sauber, und Änderungen im ERP treffen nur den Übersetzer. Das ist auf Systemebene, was Grenning in Clean Code für Fremd-APIs beschreibt und was Feathers' Seams auf Klassenebene leisten.

### Einordnung

Bounded Context ist das einflussreichste Konzept des Buchs. Es verbindet Modell, Code und Teamstruktur. Die Context-Map-Muster sind dabei mehr Organisationstheorie als Softwaredesign, und genau deshalb passen sie so gut zu Conways Gesetz und *Team Topologies*. Die häufigste Schwierigkeit in der Praxis ist, die Grenzen richtig zu finden. Hier helfen Event Storming und die Frage, wo sich die Bedeutung zentraler Begriffe ändert.

## Destillation

Nicht jeder Teil eines Systems ist gleich wichtig. Destillation heißt, den **Core Domain** zu erkennen, also das, was das Unternehmen wirklich auszeichnet, und dort den meisten Aufwand zu investieren. Alles andere wird bewusst einfacher gehalten oder zugekauft.

### Drei Arten von Teildomänen

Die heute übliche Einteilung geht auf Evans zurück, wurde aber später geschärft:

| Art | Beschreibung | Umgang | Beispiel Logistikfirma |
|---|---|---|---|
| Core Domain | Wettbewerbsvorteil, komplex, ändert sich oft | beste Entwickler, sorgfältiges Modell, selbst bauen | Routenplanung, Kapazitätsoptimierung |
| Supporting Subdomain | nötig, aber nicht differenzierend, fachspezifisch | einfacher bauen, ggf. auslagern | Schadensmeldungen, Fahrerverwaltung |
| Generic Subdomain | gelöstes Problem, überall gleich | kaufen oder Open Source nutzen | Buchhaltung, Authentifizierung, E-Mail-Versand |

Evans beschreibt eine typische Fehlentwicklung: Die erfahrensten Entwickler bauen gern Infrastruktur und generische Frameworks, weil das technisch reizvoll ist. Die eigentliche Fachlogik bleibt den Neulingen überlassen. Er fordert das Gegenteil.

### Werkzeuge der Destillation

- **Domain Vision Statement:** eine Seite, die beschreibt, was die Core Domain ausmacht und welchen Wert sie bringt.
- **Highlighted Core:** Die Kernelemente des Modells werden markiert, etwa in einem kurzen Dokument oder durch Kennzeichnung im Code.
- **Cohesive Mechanisms:** Komplexe, aber fachlich neutrale Algorithmen, etwa ein Graphenalgorithmus für Routen, werden in ein eigenes Framework ausgelagert. Der Kern beschreibt dann nur noch *was*, der Mechanismus *wie*.
- **Segregated Core:** Der Kern wird in ein eigenes Modul verschoben, getrennt von unterstützenden Teilen.
- **Abstract Core:** Die wichtigsten Abstraktionen des Kerns werden in ein eigenes Modul aus Interfaces und abstrakten Klassen gezogen.

### Einordnung

Die Unterscheidung in Core, Supporting und Generic ist eines der praktisch nützlichsten Werkzeuge des Buchs, weil sie Investitionsentscheidungen begründet: Wo bauen wir selbst, wo kaufen wir, wo reicht „gut genug“? Khononov hat sie in *Learning DDD* zum zentralen Ausgangspunkt gemacht. Sie erklärt auch, warum taktisches DDD nicht überall nötig ist: In Generic und Supporting Subdomains reichen oft einfache CRUD-Lösungen.

## Große Strukturen

Bei sehr großen Systemen braucht man eine Struktur, die das Ganze verständlich macht, über einzelne Kontexte hinweg. Evans stellt dafür einige Muster vor:

| Muster | Idee |
|---|---|
| Evolving Order | Die Struktur entwickelt sich mit dem System, statt vorab festgelegt zu werden. |
| System Metaphor | Eine gemeinsame Metapher, übernommen aus Extreme Programming, prägt das Verständnis. |
| Responsibility Layers | Das Modell wird nach Verantwortungsschichten geordnet, etwa Potenzial, Betrieb, Entscheidungsunterstützung, Richtlinien. |
| Knowledge Level | Eine Metaebene von Objekten beschreibt, wie sich andere Objekte verhalten dürfen, ähnlich einer Konfiguration. |
| Pluggable Component Framework | Ein abstrakter Kern, an den Komponenten angeschlossen werden. |

Dieser Teil gilt als der am wenigsten genutzte des Buchs. Responsibility Layers und Knowledge Level sind anspruchsvoll und in der Praxis selten. Evans warnt selbst davor, zu früh eine große Struktur zu erzwingen: Lieber gar keine als eine, die die Entwicklung behindert. Die Idee der **Evolving Order** passt dagegen gut zu evolutionärer Architektur im Sinne von Fowler.

## Kritik und Einordnung

DDD ist das ambitionierteste Buch dieser Reihe und das einzige, das Software, Fachlichkeit und Organisation zusammendenkt. Es ist aber auch das am schwersten zugängliche und das mit dem größten Risiko, falsch angewendet zu werden.

### Stärken

- **Fachlichkeit im Zentrum:** Als einziges Buch der Reihe sagt es klar, dass die meiste Komplexität nicht technisch ist.
- **Ubiquitous Language:** ein universell nützliches Konzept, auch ohne den Rest von DDD.
- **Bounded Context:** die beste verfügbare Antwort auf die Frage, wo man ein großes System schneidet.
- **Organisation als Designfaktor:** Die Context-Map-Muster machen Teambeziehungen zum Teil der Architektur, Jahre vor *Team Topologies*.
- **Destillation:** begründet, wo sich Aufwand lohnt und wo nicht.
- **Zeitlosigkeit:** Fast nichts im Buch hängt an Technik. Das erklärt das späte Comeback.

### Kritikpunkte

**1. Schwer lesbar.** Über 500 Seiten, dicht, mit vielen langen Fallbeispielen. Viele Leser brechen ab, bevor sie zum strategischen Teil kommen. Das hat zu „DDD Distilled“-Büchern und zahlreichen Einführungen geführt.

**2. Falsche Reihenfolge.** Die taktischen Muster kommen vor den strategischen. So entstand der weitverbreitete Eindruck, DDD bestehe aus Entities, Repositories und Aggregates. Evans hat das selbst bedauert.

**3. Overengineering.** Viele Teams wenden die taktischen Muster auf einfache CRUD-Anwendungen an, mit Aggregates, Factories und Domain Services für Formulare, die nur Daten speichern. Das Ergebnis ist mehr Komplexität ohne Nutzen. Evans selbst sagt, DDD lohne sich nur bei komplexer Fachlichkeit.

**4. Zugang zu Fachexperten.** DDD setzt voraus, dass Fachexperten verfügbar und interessiert sind. In vielen Organisationen sitzen sie weit weg, haben keine Zeit oder kommunizieren über Anforderungsdokumente. Ohne sie bleibt DDD Fassade.

**5. Vage Begriffe.** Bounded Context, Aggregate und Subdomain sind leicht zu definieren und schwer anzuwenden. Zwei erfahrene DDD-Berater kommen für dasselbe System oft zu unterschiedlichen Schnitten.

**6. Lücken aus heutiger Sicht.** Domain Events fehlen im Original weitgehend, ebenso Event Sourcing, CQRS und verteilte Konsistenz. Die Beispiele sind auf das objektorientierte Java der frühen 2000er bezogen. Das Zusammenspiel mit Frameworks wie JPA wird kaum behandelt.

**7. Hype und Beratungsindustrie.** Mit dem Microservices-Boom wurde DDD zum Schlagwort, das in Projekten oft mehr behauptet als umgesetzt wurde.

### Gesamturteil

Das Buch ist eher eine Philosophie als ein Rezeptbuch. Der strategische Teil ist heute wichtiger als 2003, der taktische Teil nützlich, aber nur dort, wo die Fachlichkeit es rechtfertigt. Wer es heute liest, sollte mit Teil IV beginnen oder einen modernen Einstieg wie Khononov oder Vernons *DDD Distilled* vorschalten.

## Verhältnis zu den anderen Büchern

DDD hebt die Diskussion eine Ebene höher. Die bisherigen Bücher fragen, wie gute Klassen und Methoden aussehen. Evans fragt, welche Klassen es überhaupt geben soll und wo die Grenzen zwischen ganzen Modellen verlaufen.

| Aspekt | Martin | Ousterhout | Fowler | GoF | Feathers | Evans |
|---|---|---|---|---|---|---|
| Ebene | Methode, Klasse | Modul | Methode, Klasse | Objektbeziehungen | Klasse, Methode | Modell, Kontext, Team |
| Quelle der Komplexität | unsauberer Code | Abhängigkeiten, Unklarheit | verfallenes Design | starre Kopplung | fehlende Tests | Fachlichkeit |
| Namen | aus Problem- oder Lösungsdomäne | präzise, konsistent | Mysterious Name als Smell | Pattern-Namen | – | Ubiquitous Language, mit Fachexperten verhandelt |
| Grenzen | SRP, Klassen | tiefe Module, Information Hiding | Extract/Inline Class | Patterns als Struktur | Seams | Aggregates, Bounded Contexts |
| Value Objects | kaum Thema | – | Replace Primitive with Object | – | – | zentral, Regelfall |
| Fremde Modelle | Boundaries einkapseln | Information Hiding | Hide Delegate | Adapter, Facade | Seams, Adapt Parameter | Anticorruption Layer |

### Querbezüge

- **Anticorruption Layer** ist Adapter und Facade aus der GoF, angewandt auf ganze Modelle.
- **Aggregates** setzen Ousterhouts Information Hiding um: Die Root verbirgt die innere Struktur und schützt die Invarianten.
- **Value Objects** und **Side-Effect-Free Functions** sind funktionale Ideen, die Fowlers zweite Auflage und modernes Java mit Records aufgegriffen haben.
- **Conceptual Contours** beantwortet die Frage, die Martin und Ousterhout so verschieden beantworten: Die richtige Größe ergibt sich aus der Fachlichkeit, nicht aus Zeilenzahl oder Schnittstellentiefe.
- **Refactoring zu tieferer Einsicht** braucht Fowlers Werkzeuge und Feathers' Tests, sonst ist der Umbau eines Modells nicht sicher.

## Diskussionsfragen

1. **Fachexperten:** Hattest du in deinen Projekten echten Zugang zu Fachexperten? Wie hat das die Qualität des Modells beeinflusst?
2. **Deutsch im Code:** Fachbegriffe auf Deutsch im englischen Code, etwa `Rechnungsposition`, oder konsequent übersetzen? Was hat sich bewährt?
3. **Taktisch oder strategisch:** Welche Teile von DDD hast du tatsächlich genutzt? Eher Bausteine oder eher Bounded Contexts?
4. **CRUD oder Domänenmodell:** Woran erkennst du, ob ein Bereich ein reiches Domänenmodell rechtfertigt oder ob einfache CRUD-Lösungen reichen?
5. **Aggregates und JPA:** Wie geht ihr mit dem Spannungsfeld zwischen kleinen, über ID verbundenen Aggregates und JPA-Objektgraphen um?
6. **Microservices oder modularer Monolith:** Sind Bounded Contexts für dich eher Service- oder eher Modulgrenzen?
7. **Anämisches Modell:** Ist ein Modell aus Datenklassen und Services wirklich ein Anti-Pattern, oder in manchen Kontexten die ehrlichere Lösung?
8. **Reihenfolge:** Würdest du das Buch heute noch im Original empfehlen, oder lieber mit einer modernen Einführung beginnen?
