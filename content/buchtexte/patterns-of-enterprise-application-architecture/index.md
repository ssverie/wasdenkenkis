+++
title = "Patterns of Enterprise Application Architecture – Zusammenfassung und Einordnung"
description = "Martin Fowler, mit David Rice, Matthew Foemmel, Edward Hieatt, Robert Mee und Randy Stafford, Patterns of Enterprise Application Architecture (2002)"
date = 2026-10-30T19:12:26+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["patterns-of-enterprise-application-architecture-2002"]
+++

## Einleitung

Nach Refactoring ist dies Fowlers zweites großes Buch in dieser Reihe, und es spielt eine ganz andere Rolle: Es ist ein **Musterkatalog für Geschäftsanwendungen**, also für Systeme mit vielen Daten, vielen Nutzern, komplizierten Geschäftsregeln und Anbindung an andere Systeme. Wo die Gang of Four allgemeine Entwurfsmuster für Objekte beschreibt, beschreibt Fowler die Muster, die in Bestellsystemen, Versicherungen, Banken und Behörden immer wieder auftauchen.

### Kontext

Das Buch erschien 2002, mitten in der Zeit von J2EE und .NET 1.0. Enterprise JavaBeans galten als Standard für Geschäftslogik, waren aber schwerfällig, und viele Teams suchten nach einfacheren Wegen. Fowler hielt fest, was in der Praxis funktionierte, und gab den Mustern Namen, die bis heute in Gebrauch sind: **Active Record**, **Data Mapper**, **Unit of Work**, **Identity Map**, **Lazy Load**, **Service Layer**, **Repository**, **Data Transfer Object**.

Das Buch hat die Werkzeuge der folgenden Jahre stark geprägt. Ruby on Rails nannte seine Persistenzschicht nach Fowlers Muster Active Record. Hibernate und später JPA implementieren Data Mapper, Unit of Work, Identity Map und Lazy Load. Spring MVC ist ein Front Controller. Evans übernahm im selben Jahr das Repository in sein DDD-Buch.

Die Beispiele sind in Java und C#. Mehrere Muster stammen von Mitautoren, etwa Service Layer von Randy Stafford.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Die Erzählungen | acht Kapitel, die die Muster in Zusammenhang stellen: Schichten, Domänenlogik, Abbildung auf relationale Datenbanken, Web-Präsentation, Nebenläufigkeit, Sitzungszustand, Verteilung, Gesamtbild |
| II. Die Muster | rund 50 Muster in zehn Gruppen, jeweils mit Funktionsweise, Einsatzbereich und Beispielcode |

Fowler empfiehlt, den ersten Teil ganz zu lesen und den zweiten als Nachschlagewerk zu nutzen.

### Die Grundhaltung

Wie später Richards und Ford betont Fowler, dass es keine allgemein richtige Lösung gibt. Jedes Muster hat Einsatzbereiche und Grenzen, und der wertvollste Teil jeder Musterbeschreibung ist der Abschnitt **Wann man es einsetzt**.

## Schichten

Fowler beginnt mit der Grundstruktur fast jeder Geschäftsanwendung: **drei Hauptschichten**.

| Schicht | Aufgabe |
|---|---|
| **Präsentation** | Anzeige von Informationen und Verarbeitung von Eingaben, für Menschen oder andere Programme |
| **Domäne** | die eigentliche Logik: Berechnungen, Prüfungen, Abläufe |
| **Datenquelle** | Kommunikation mit Datenbanken, Messaging-Systemen, anderen Anwendungen |

Die wichtigste Regel: Die **Domäne darf nicht von der Präsentation abhängen**. Ob die Domäne von der Datenquelle abhängen darf, lässt Fowler offen; je komplexer die Domänenlogik, desto eher lohnt es sich, sie auch davon zu trennen. Das ist der Keim dessen, was Evans im selben Jahr als Isolierung der Domäne und Martin später als Dependency Rule fasst.

Fowler unterscheidet außerdem **Schichten** als logische Trennung von **Ebenen** als physischer Verteilung auf verschiedene Rechner. Eine Anwendung kann drei Schichten haben und trotzdem in einem einzigen Prozess laufen.

## Verteilung

Das Kapitel über Verteilung enthält einen der bekanntesten Sätze des Buchs, Fowlers **erstes Gesetz des verteilten Objektentwurfs: Verteilen Sie Ihre Objekte nicht.**

Der Hintergrund: Um 2000 war es Mode, Objekte transparent über das Netz zu verteilen, mit CORBA, RMI oder EJB-Remote-Interfaces. Fowler zeigt, warum das scheitert:

- **Lokale Aufrufe** sind schnell, deshalb sind feingranulare Schnittstellen mit vielen kleinen Methoden gut: `getName()`, `getAddress()`, `getCity()`.
- **Entfernte Aufrufe** sind um Größenordnungen langsamer. Feingranulare Schnittstellen führen zu Hunderten Netzwerkaufrufen pro Vorgang.
- Ein Objekt kann nicht gleichzeitig eine gute lokale und eine gute entfernte Schnittstelle haben.

Verteilung ist manchmal unvermeidlich, etwa zwischen Client und Server, zwischen Anwendung und Datenbank oder zu Fremdsystemen. Dort setzt man zwei Muster ein:

- **Remote Facade:** eine grobe Schnittstelle vor feingranularen Objekten, die viele Daten in einem Aufruf liefert.
- **Data Transfer Object:** ein reines Datenobjekt, das Daten über die Grenze trägt.

```java
// Remote Facade: ein Aufruf statt vieler
@RestController
class CustomerFacade {
    private final CustomerRepository customers;

    @GetMapping("/customers/{id}")
    CustomerDto get(@PathVariable long id) {
        Customer c = customers.findById(id).orElseThrow();
        return new CustomerDto(c.name(), c.address().street(), c.address().city(), c.openOrderCount());
    }
}

// Data Transfer Object, heute als Record
record CustomerDto(String name, String street, String city, int openOrders) {}
```

### Einordnung

Das erste Gesetz ist eine frühe Fassung der Trugschlüsse verteilter Systeme, die Richards und Ford behandeln, und von Nygards Integrationspunkten. Fowler selbst hat es später auf Microservices bezogen: Microservices verstoßen nicht dagegen, weil sie keine **Objekte** verteilen, sondern grobe Dienste mit eigenen Daten. Wer aber Microservices mit feingranularen, gesprächigen Schnittstellen baut, macht denselben Fehler wie die Teams um 2000.

## Domänenlogik organisieren

Das zentrale Kapitel des Buchs stellt drei Arten vor, Geschäftslogik zu strukturieren, und eine vierte, die darüberliegt.

### Transaction Script

Jeder Vorgang ist **eine Prozedur**, die alles erledigt: Daten lesen, rechnen, prüfen, schreiben. Einfach, gut verständlich, passt zu Transaktionen. Mit wachsender Logik entsteht aber doppelter Code, weil verschiedene Skripte ähnliche Schritte brauchen.

```java
// Transaction Script: Umsätze für einen Vertrag erfassen
class RevenueRecognitionService {
    void recognize(long contractId) {
        var row = db.queryForMap("select * from contracts c join products p on … where c.id = ?", contractId);
        BigDecimal total = (BigDecimal) row.get("revenue");
        LocalDate signed = ((Date) row.get("date_signed")).toLocalDate();
        switch ((String) row.get("type")) {
            case "W" -> insert(contractId, total, signed);                       // Textverarbeitung: sofort
            case "S" -> { var thirds = split3(total);                              // Tabellenkalkulation: in Dritteln
                          insert(contractId, thirds[0], signed);
                          insert(contractId, thirds[1], signed.plusDays(60));
                          insert(contractId, thirds[2], signed.plusDays(90)); }
            case "D" -> { … }                                                       // Datenbank: andere Fristen
        }
    }
}
```

### Domain Model

Ein **Objektmodell der Fachlichkeit**, in dem Daten und Verhalten zusammen liegen. Komplexe Regeln lassen sich mit Vererbung, Strategien und anderen Mustern ausdrücken. Der Einstieg ist teurer, und die Abbildung auf die Datenbank wird schwieriger.

```java
// Domain Model: dasselbe Beispiel, Verhalten liegt bei den Objekten
class Contract {
    private final Product product;
    private final Money revenue;
    private final LocalDate signed;
    private final List<RevenueRecognition> recognitions = new ArrayList<>();

    void calculateRecognitions() { product.recognitionStrategy().apply(this); }
    void addRecognition(Money amount, LocalDate date) { recognitions.add(new RevenueRecognition(amount, date)); }
    Money recognizedBy(LocalDate date) { … }
}

sealed interface RecognitionStrategy permits Immediate, ThreeWay {
    void apply(Contract c);
}
record ThreeWay(int firstOffset, int secondOffset) implements RecognitionStrategy { … }
```

### Table Module

Ein Mittelweg: **eine Klasse pro Tabelle**, die mit einem Datensatz-Container wie einem `ResultSet` oder .NET-`DataSet` arbeitet. Das passte gut zu den Werkzeugen von .NET um 2002; in Java ist es heute selten.

### Die Entscheidung

{{< bild src="bild-1.png" alt="Aufwand gegen Komplexität der Domänenlogik · Fowlers qualitative Einschätzung, nachgezeichnet" >}}

Aufwand gegen Komplexität der Domänenlogik · Fowlers qualitative Einschätzung, nachgezeichnet

Fowlers Skizze ist ausdrücklich qualitativ: Transaction Script ist bei einfacher Logik am billigsten, wird aber mit wachsender Komplexität schnell teuer. Domain Model hat höhere Anfangskosten, wächst aber flacher. Wo der Schnittpunkt liegt, hängt stark vom Team ab: Ein Team, das mit Objektmodellen vertraut ist, erreicht ihn früher.

### Service Layer

Die vierte Organisationsform liegt über den anderen: Ein **Service Layer** definiert die Grenze der Anwendung mit einer Menge verfügbarer Operationen, koordiniert Transaktionen und Sicherheit und delegiert an das Domain Model. Fowler unterscheidet eine dünne Fassade, die nur delegiert, von einem Operation Script, das selbst Logik enthält, und empfiehlt, so wenig Logik wie möglich hineinzulegen.

```java
@Service
class RecognitionService {
    @Transactional
    public void recognize(ContractId id) {
        Contract c = contracts.findById(id).orElseThrow();
        c.calculateRecognitions();             // Logik liegt im Modell
        events.publish(new RevenueRecognized(id));
    }
}
```

### Einordnung

Das ist der Ursprung von Evans' Application Layer und Martins Use Cases. Fowler prägte außerdem 2003 den Begriff **Anemic Domain Model** für den häufigen Fall, dass ein Team Entities ohne Verhalten baut und alle Logik in Services legt: im Grunde ein Transaction Script, das so tut, als wäre es ein Domain Model.

## Datenquellen-Architektur

Wie spricht die Domäne mit der Datenbank? Fowler beschreibt vier Muster, die eng an die Wahl der Domänenlogik gekoppelt sind.

| Muster | Funktionsweise | Passt zu |
|---|---|---|
| **Table Data Gateway** | ein Objekt pro Tabelle, das alle SQL-Zugriffe kapselt und Datensätze zurückgibt | Transaction Script, Table Module |
| **Row Data Gateway** | ein Objekt pro Zeile, mit Feldern und `insert`/`update`, aber ohne Fachlogik | Transaction Script |
| **Active Record** | ein Objekt pro Zeile, mit Feldern, Datenbankzugriff **und** Fachlogik | einfaches Domain Model, das der Tabellenstruktur entspricht |
| **Data Mapper** | eine eigene Schicht, die Objekte und Tabellen ineinander übersetzt; die Objekte wissen nichts von der Datenbank | reiches Domain Model |

### Active Record

```java
// Active Record: Objekt kennt seine Tabelle
class Person {
    Long id; String lastName; String firstName; int dependents;

    static Person find(long id) { /* SELECT … */ }
    void insert()  { /* INSERT … */ }
    void update()  { /* UPDATE … */ }

    Money exemption() {                                    // Fachlogik im selben Objekt
        return Money.euro(1500).add(Money.euro(500).multiply(dependents));
    }
}
```

Active Record ist einfach und schnell geschrieben. Es setzt voraus, dass Objekte und Tabellen weitgehend übereinstimmen, und koppelt die Fachlogik an die Datenbank. Rails hat das Muster populär gemacht; in Java findet man es etwa in Frameworks wie ActiveJDBC oder in Panache von Quarkus.

### Data Mapper

```java
// Data Mapper: Domänenobjekt ohne Datenbankwissen
final class Person {
    private final PersonId id;
    private final Name name;
    private int dependents;
    Money exemption() { … }
}

class PersonMapper {
    Person find(PersonId id) {
        return jdbc.queryForObject("select * from people where id = ?",
            (rs, n) -> new Person(new PersonId(rs.getLong("id")),
                                  new Name(rs.getString("first_name"), rs.getString("last_name")),
                                  rs.getInt("dependents")), id.value());
    }
    void update(Person p) { … }
}
```

Data Mapper erlaubt, dass Objektmodell und Datenbankschema sich unabhängig entwickeln. Der Preis ist eine zusätzliche Schicht, die man schreiben oder, wie meistens, einem Werkzeug überlassen muss. **Hibernate und JPA sind Data Mapper**: Annotationen oder XML beschreiben die Abbildung, und der `EntityManager` übersetzt.

### Einordnung

Die Unterscheidung zwischen Active Record und Data Mapper ist bis heute eine der nützlichsten Begriffspaare für Persistenz. Sie erklärt, warum Martin JPA-Annotationen in der Domäne für einen Kompromiss hält: Mit Annotationen in den Domänenklassen rückt ein Data Mapper in Richtung Active Record, weil die Objekte wieder etwas über ihre Tabellen wissen.

## Objektrelationale Abbildung

Der umfangreichste Teil des Katalogs behandelt die Kluft zwischen Objekten und Tabellen, die Fowler wie viele andere den **objektrelationalen Impedanzunterschied** nennt: Objekte haben Identität, Vererbung, Referenzen und Collections; Tabellen haben Schlüssel, Fremdschlüssel und flache Zeilen.

### Verhaltensmuster

| Muster | Problem | Lösung | In JPA |
|---|---|---|---|
| **Unit of Work** | Welche Objekte wurden geändert und müssen gespeichert werden, in welcher Reihenfolge? | ein Objekt merkt sich alle neuen, geänderten und gelöschten Objekte einer Transaktion und schreibt sie gemeinsam | Persistenzkontext, `flush()` beim Commit |
| **Identity Map** | Dieselbe Zeile wird zweimal geladen und es entstehen zwei Objekte, die sich widersprechen. | eine Map von Schlüssel auf Objekt; jedes Objekt wird pro Transaktion nur einmal geladen | Persistenzkontext als First-Level-Cache |
| **Lazy Load** | Ein Objekt hängt an einem großen Objektgraphen; alles sofort zu laden ist zu teuer. | Daten erst laden, wenn sie gebraucht werden | `FetchType.LAZY`, Hibernate-Proxys |

Fowler beschreibt vier Varianten von Lazy Load: verzögerte Initialisierung, virtueller Proxy, Value Holder und Ghost, ein Objekt, das nur mit seiner ID existiert und sich bei Zugriff füllt. Er warnt bereits vor **Ripple Loading**: Wer eine Liste von Objekten lädt und dann bei jedem auf eine verzögerte Beziehung zugreift, erzeugt eine Abfrage pro Objekt. Das ist das berüchtigte **N+1-Problem** von JPA.

### Strukturmuster

| Muster | Inhalt | In JPA |
|---|---|---|
| **Identity Field** | Datenbankschlüssel als Feld im Objekt | `@Id` |
| **Foreign Key Mapping** | Referenz zwischen Objekten als Fremdschlüssel | `@ManyToOne`, `@OneToMany` |
| **Association Table Mapping** | Viele-zu-viele über eine Verbindungstabelle | `@ManyToMany`, `@JoinTable` |
| **Dependent Mapping** | abhängige Objekte werden vom Eigentümer mit gespeichert | Kaskadierung, `orphanRemoval` |
| **Embedded Value** | kleines Wertobjekt in Spalten der Eigentümertabelle | `@Embeddable` |
| **Serialized LOB** | Objektgraph als ein großes Feld | heute meist JSON-Spalte |
| **Single Table Inheritance** | ganze Hierarchie in einer Tabelle mit Typspalte | `InheritanceType.SINGLE_TABLE` |
| **Class Table Inheritance** | eine Tabelle pro Klasse, per Join verbunden | `InheritanceType.JOINED` |
| **Concrete Table Inheritance** | eine Tabelle pro konkreter Klasse | `InheritanceType.TABLE_PER_CLASS` |

```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)          // Single Table Inheritance
@DiscriminatorColumn(name = "type")
abstract class Product {
    @Id @GeneratedValue Long id;                               // Identity Field
    @Embedded Money price;                                     // Embedded Value
    @ManyToOne(fetch = FetchType.LAZY) Supplier supplier;      // Foreign Key Mapping, Lazy Load
}

@Embeddable
record Money(BigDecimal amount, String currency) {}           // Records als Embeddables seit Hibernate 6
```

### Metadaten-Muster

- **Metadata Mapping:** Die Abbildung wird in Metadaten beschrieben statt in Code. Annotationen sind genau das.
- **Query Object:** Abfragen als Objekte statt als SQL-Strings. In JPA die Criteria API, in Java auch jOOQ oder Querydsl.
- **Repository:** eine Collection-artige Schnittstelle zur Domäne, hinter der die Abfragelogik verschwindet. Fowler übernahm das Muster von Edward Hieatt und Rob Mee, Evans machte es mit DDD bekannt, Spring Data machte es allgegenwärtig.

### Einordnung

Wer JPA versteht, versteht dieses Kapitel, und umgekehrt: Viele Überraschungen mit JPA, etwa unerwartete Updates beim Commit, verschwundene Änderungen nach `clear()` oder das N+1-Problem, erklären sich aus den Mustern Unit of Work, Identity Map und Lazy Load.

## Web-Präsentation

2002 wurden Webseiten fast ausschließlich auf dem Server erzeugt. Fowlers Muster für diese Schicht sind trotzdem bis heute verbreitet, nur an anderer Stelle.

### Model View Controller

Fowler betont, dass an MVC vor allem **eine** Trennung wichtig ist: die zwischen **Präsentation und Modell**. Die Trennung zwischen View und Controller sei zweitrangig und in vielen Oberflächen gar nicht sauber möglich. Das ist eine wichtige Klarstellung, weil MVC oft als feste Dreiteilung gelehrt wird.

### Controller-Muster

| Muster | Funktionsweise | Heute |
|---|---|---|
| **Page Controller** | ein Controller pro Seite oder Aktion | einzelne JSPs oder Servlets; heute selten |
| **Front Controller** | ein zentraler Einstiegspunkt, der Anfragen annimmt, gemeinsame Aufgaben erledigt und an Handler weiterleitet | Springs `DispatcherServlet`, Jakarta REST |
| **Application Controller** | steuert Abläufe über mehrere Seiten, etwa Assistenten | Spring Web Flow; heute eher im Frontend |

### View-Muster

| Muster | Funktionsweise | Heute |
|---|---|---|
| **Template View** | HTML mit Platzhaltern, die mit Daten gefüllt werden | Thymeleaf, JTE, früher JSP |
| **Transform View** | Daten werden Element für Element in HTML umgewandelt | früher XSLT; heute eher JSON-Serialisierung |
| **Two Step View** | erst eine logische Seitenstruktur erzeugen, dann in HTML umwandeln | Layout-Systeme, Komponentenbibliotheken |

```java
// Front Controller: Spring nimmt jede Anfrage zentral an und leitet weiter
@Controller
class OrderPageController {
    @GetMapping("/orders/{id}")
    String show(@PathVariable long id, Model model) {
        model.addAttribute("order", orderQuery.find(id));   // Präsentation fragt Modell
        return "orders/show";                                   // Template View: Thymeleaf
    }
}
```

### Einordnung

Mit Single-Page-Anwendungen sind viele dieser Muster ins Frontend gewandert: React-Komponenten sind Template Views, Router sind Front Controller, und Zustandsbibliotheken übernehmen die Rolle von Application Controllern. Auf dem Java-Server bleiben vor allem Front Controller und Remote Facade, also REST-Endpunkte, die DTOs liefern. Fowlers Hauptpunkt hat sich gehalten: Die Trennung von Präsentation und Modell ist das, worauf es ankommt.

## Nebenläufigkeit

Fowler unterscheidet **Systemtransaktionen**, also Datenbanktransaktionen, die kurz sein sollen, von **Geschäftstransaktionen**, die sich über mehrere Anfragen und manchmal Minuten erstrecken: Ein Sachbearbeiter öffnet einen Vertrag, telefoniert, ändert ihn und speichert. Eine Datenbanktransaktion über diese ganze Zeit offen zu halten, ist keine Option. Fowler nennt das Problem **Offline-Nebenläufigkeit** und beschreibt vier Muster.

| Muster | Funktionsweise | Abwägung |
|---|---|---|
| **Optimistic Offline Lock** | jede Zeile hat eine Versionsnummer; beim Speichern wird geprüft, ob sie sich geändert hat | einfach, skaliert gut; Konflikte werden erst am Ende bemerkt, Arbeit kann verloren gehen |
| **Pessimistic Offline Lock** | vor dem Bearbeiten wird ein Datensatz für andere gesperrt | keine verlorene Arbeit; Sperren müssen verwaltet und aufgeräumt werden, schlechtere Nebenläufigkeit |
| **Coarse-Grained Lock** | eine Sperre oder Version für eine ganze Gruppe zusammengehöriger Objekte | passt genau zu Evans' Aggregaten |
| **Implicit Lock** | das Framework setzt Sperren automatisch, damit niemand sie vergisst | Entwickler müssen nicht an jede Stelle denken |

```java
// Optimistic Offline Lock mit JPA
@Entity
class Contract {
    @Id Long id;
    @Version long version;              // JPA prüft beim Update: WHERE id = ? AND version = ?
    Money amount;
}

// Konflikt wird als Ausnahme gemeldet
try {
    contractService.update(dto);         // dto enthält die beim Laden gesehene Version
} catch (OptimisticLockException e) {
    // Nutzer informieren: "Der Vertrag wurde inzwischen von jemand anderem geändert."
}
```

Die Probleme, die diese Muster lösen, sind dieselben, die Kleppmann als **verlorene Updates** und inkonsistente Lesevorgänge beschreibt, nur über die Grenze einer Datenbanktransaktion hinaus. In REST-APIs taucht Optimistic Offline Lock heute als `ETag` und `If-Match`-Header auf.

## Sitzungszustand

Wo liegt der Zustand einer Sitzung, etwa ein Warenkorb oder ein halb ausgefülltes Formular?

| Muster | Ort | Heute |
|---|---|---|
| **Client Session State** | beim Client: Cookies, versteckte Felder, URL | signierte Tokens wie JWT, Browser-Speicher in Single-Page-Anwendungen |
| **Server Session State** | im Speicher des Servers | `HttpSession`; erschwert horizontale Skalierung, deshalb oft in Redis ausgelagert |
| **Database Session State** | in der Datenbank | Entwürfe als eigene Datensätze, etwa ein Warenkorb mit Status |

Fowler bevorzugt bereits 2002 **zustandslose Server**, wo möglich, weil sie sich leichter skalieren und ausfallsicher betreiben lassen. Das ist heute Standard in Cloud-Architekturen und eine der Voraussetzungen, die Richards und Ford für Elastizität nennen.

## Basismuster

Das letzte Kapitel des Katalogs sammelt kleinere Muster, die überall gebraucht werden. Einige davon sind heute so selbstverständlich, dass man vergisst, dass sie Namen haben.

| Muster | Inhalt | Bezug |
|---|---|---|
| **Gateway** | ein Objekt, das den Zugriff auf ein externes System kapselt | Martins Gateways, Evans' Anticorruption Layer |
| **Mapper** | ein Objekt, das zwei unabhängige Teilsysteme verbindet, ohne dass sie einander kennen | MapStruct, eigene Mapper |
| **Layer Supertype** | gemeinsame Oberklasse für alle Objekte einer Schicht | `AbstractEntity` mit ID und Version |
| **Separated Interface** | Interface in einem Paket, Implementierung in einem anderen | Dependency Inversion, Martins Ports |
| **Registry** | ein bekanntes Objekt, über das andere Objekte gefunden werden | heute durch Dependency Injection ersetzt |
| **Value Object** | kleines Objekt, dessen Gleichheit über Werte statt Identität definiert ist | Records, Evans' Value Objects |
| **Money** | Betrag und Währung als Wertobjekt mit korrekter Rundung und Aufteilung | JSR 354, Moneta |
| **Special Case** | eine Unterklasse für Sonderfälle wie „unbekannter Kunde“, statt überall `null` zu prüfen | Null Object, Fowlers Introduce Special Case aus Refactoring |
| **Plugin** | Implementierung wird zur Konfigurationszeit gewählt, nicht im Code | Spring-Profile, `ServiceLoader` |
| **Service Stub** | einfacher Ersatz für einen externen Dienst während der Entwicklung und in Tests | Fakes in GOOS und Feathers, WireMock |
| **Record Set** | Darstellung tabellarischer Daten im Speicher | `ResultSet`, .NET `DataSet` |

### Money

Fowlers Money-Muster verdient eine eigene Erwähnung, weil der Fehler, den es verhindert, bis heute verbreitet ist: Geldbeträge als `double`. Money kombiniert Betrag und Währung, verhindert Addition verschiedener Währungen und löst das Problem, einen Betrag ohne Rundungsverlust aufzuteilen.

```java
record Money(BigDecimal amount, Currency currency) {
    Money { amount = amount.setScale(currency.getDefaultFractionDigits(), RoundingMode.HALF_EVEN); }

    Money add(Money other) {
        if (!currency.equals(other.currency)) throw new IllegalArgumentException("Währungen verschieden");
        return new Money(amount.add(other.amount), currency);
    }

    // Fowlers allocate: 0,05 € auf 30 % / 70 % ergibt 0,02 € und 0,03 €, nichts geht verloren
    List<Money> allocate(int... ratios) { … }
}
```

Das ist Blochs Item 60, „Kein float oder double für exakte Ergebnisse“, als vollständiges Muster.

### Special Case

```java
sealed interface Customer permits KnownCustomer, UnknownCustomer {}
record KnownCustomer(CustomerId id, String name, BillingPlan plan) implements Customer {}
record UnknownCustomer() implements Customer {
    String name() { return "Unbekannter Kunde"; }
    BillingPlan plan() { return BillingPlan.basic(); }
}
```

Mit sealed Interfaces und Pattern Matching lässt sich Special Case heute typsicher ausdrücken, ohne dass Aufrufer `null` prüfen müssen.

## Was aus den Mustern wurde

Wie bei der Gang of Four lohnt sich ein Abgleich: Was ist aus Fowlers Mustern im Java-Alltag von 2026 geworden?

| Status | Muster | Wie heute |
|---|---|---|
| **In Frameworks aufgegangen** | Data Mapper, Unit of Work, Identity Map, Lazy Load, Metadata Mapping, Identity Field, Foreign Key Mapping, Embedded Value, Vererbungsmuster | JPA und Hibernate; man nutzt sie, ohne sie zu bauen |
|  | Front Controller, Template View | Spring MVC, Thymeleaf |
|  | Repository, Query Object | Spring Data, Criteria API, jOOQ |
|  | Optimistic Offline Lock, Implicit Lock | `@Version`, ETags |
|  | Plugin, Registry | Dependency Injection, Spring-Profile, `ServiceLoader` |
| **In die Sprache gewandert** | Value Object, Money, Data Transfer Object | Records |
|  | Special Case | sealed Interfaces, `Optional` |
| **Weiterhin aktiv zu entscheiden** | Transaction Script, Domain Model, Service Layer | die Grundfrage jeder Anwendung, oft unbewusst beantwortet |
|  | Active Record gegen Data Mapper | Annotationen in der Domäne oder Trennung |
|  | Remote Facade, DTO | REST- und gRPC-Schnittstellen |
|  | Coarse-Grained Lock | Version am Aggregat-Root |
|  | Gateway, Separated Interface, Service Stub | Ports, Adapter, Fakes in Tests |
| **Weitgehend verschwunden** | Table Module, Record Set | in Java kaum noch; Teil der .NET-Welt von 2002 |
|  | Transform View, Two Step View | Frontend-Frameworks |
|  | Server Session State | zustandslose Dienste, Tokens |
|  | Pessimistic Offline Lock | selten; eher Statusfelder wie „in Bearbeitung“ |

### Neue Kontexte

Einige Probleme, die Fowler beschreibt, tauchen in neuen Formen auf:

- **Verteilung:** Das erste Gesetz gilt für Microservices. Gesprächige Schnittstellen zwischen Diensten sind das Remote-Objekt-Problem von 2002.
- **Unit of Work über Dienste hinweg:** Ohne gemeinsame Datenbank gibt es keine gemeinsame Transaktion. An ihre Stelle treten Sagas und das Outbox-Muster, wie Richards und Ford und Kleppmann beschreiben.
- **Abbildung:** Statt Objekte auf Tabellen bildet man heute oft Objekte auf JSON-Dokumente, Ereignisse oder Schemas in Nachrichtensystemen ab. Die Abwägung zwischen Active Record und Data Mapper stellt sich dort genauso.
- **Reactive und Virtual Threads:** Lazy Load und Unit of Work setzen voraus, dass eine Sitzung an einen Thread gebunden ist. Reaktive Programmierung hat das erschwert; Virtual Threads seit Java 21 machen das klassische Modell wieder attraktiver.

## Kritik und Einordnung

### Stärken

- **Gemeinsames Vokabular:** Active Record, Data Mapper, Unit of Work, Service Layer und Repository sind Begriffe, die Teams und Frameworks bis heute verwenden.
- **Abwägungen statt Rezepte:** Jedes Muster hat einen Abschnitt, wann es passt und wann nicht. Die Skizze zu Transaction Script und Domain Model ist eine der klarsten Entscheidungshilfen der Reihe.
- **Verstehen statt nutzen:** Wer mit JPA arbeitet, versteht nach diesem Buch, was im Persistenzkontext passiert und warum.
- **Erzählteil:** Die acht einleitenden Kapitel sind auch für sich allein eine gute Einführung in Geschäftsanwendungen.
- **Erstaunlich haltbar:** Das erste Gesetz der Verteilung und die Bevorzugung zustandsloser Server haben sich bestätigt.

### Kritikpunkte

**1. Zeitgebunden.** Viele Beispiele und einige Muster beziehen sich auf J2EE, .NET 1.0, XSLT und serverseitig erzeugte Webseiten. Wer das Buch heute liest, muss übersetzen.

**2. Viel davon steckt in Frameworks.** Kaum jemand implementiert heute Unit of Work oder Identity Map selbst. Der Wert liegt im Verstehen, nicht im Nachbauen.

**3. Relationale Datenbank als Annahme.** Das Buch setzt durchweg eine relationale Datenbank voraus. Dokumentdatenbanken, Event Sourcing, Streams und verteilte Daten, wie Kleppmann sie beschreibt, kommen nicht vor.

**4. Eine einzige Anwendung.** Fowler denkt in einer Anwendung mit einer Datenbank. Wie mehrere Anwendungen fachlich geschnitten und integriert werden, behandeln erst Evans' Bounded Contexts und später *Enterprise Integration Patterns* von Hohpe und Woolf, das Fowler in seiner Reihe herausgab.

**5. Nachschlagewerk mit Längen.** Der Musterteil ist nicht zum Durchlesen gedacht, und einige Musterbeschreibungen wiederholen den Erzählteil.

### Was Fowler selbst ergänzt hat

Fowler hat einige Themen später auf seiner Website weitergeführt, etwa den Begriff **Anemic Domain Model** (2003), **CQRS** (2011), **Event Sourcing** und Texte zu Microservices. Eine zweite Auflage des Buchs gibt es nicht; nach meinem Kenntnisstand ist auch keine angekündigt.

### Gesamturteil

PoEAA ist für Persistenz und Geschäftslogik, was die Gang of Four für Objektentwurf ist: ein Vokabular, das man kennen sollte, auch wenn man die meisten Muster nicht mehr selbst baut. Für Java-Entwickler ist es vor allem das Buch, das erklärt, **was JPA eigentlich tut** und welche Entscheidungen man trotz Framework noch selbst treffen muss.

## Bezüge zur Reihe

| Thema bei Fowler | Bezug in der Reihe |
|---|---|
| Musterkatalog mit Abwägungen | Gang of Four: dasselbe Format, eine Ebene tiefer; Richards und Ford: erstes Gesetz |
| Domäne unabhängig von Präsentation | Evans: Isolierung der Domäne; Martin: Dependency Rule |
| Transaction Script gegen Domain Model | Evans: reiches Modell nur in der Core Domain; Ousterhout: tiefe Module |
| Anemic Domain Model | Evans; Richards und Ford: Entity-Falle |
| Service Layer | Evans: Application Layer; Martin: Use Cases |
| Repository | Evans: DDD-Baustein; Spring Data |
| Data Mapper und Annotationen in der Domäne | Martin: Frameworks auf Abstand; Simon Brown |
| Unit of Work, Optimistic Offline Lock | Kleppmann: Transaktionen, verlorene Updates; Evans: Aggregate als Konsistenzgrenze |
| Erstes Gesetz der Verteilung | Richards und Ford: Trugschlüsse; Nygard: Integrationspunkte; Martin: Services sind keine Architektur |
| Gateway, Separated Interface, Service Stub | Feathers: Seams; GOOS: eigene Typen mocken; Martin: Ports |
| Value Object, Money | Bloch: kein double für Geld; Evans: Value Objects; Records |
| Special Case | Fowler, Refactoring: Introduce Special Case; sealed Types |
| Zustandslose Server | Richards und Ford: Elastizität; Team Topologies: Plattform |

## Diskussionsfragen

1. **Transaction Script oder Domain Model:** Welche Form hat die Geschäftslogik in deinem aktuellen Projekt tatsächlich, unabhängig davon, wie sie genannt wird?
2. **Anämisch:** Sind eure JPA-Entities eher Datenbehälter mit Gettern und Settern, oder steckt Verhalten darin? Wo liegt die Logik?
3. **Active Record oder Data Mapper:** Trennt ihr Domänenobjekte und Persistenzobjekte? Würdest du nach diesem Buch anders entscheiden?
4. **JPA-Überraschungen:** Welche Fehler oder Leistungsprobleme mit JPA habt ihr erlebt, und welches Muster steckte dahinter?
5. **Offline-Sperren:** Wie geht ihr mit gleichzeitiger Bearbeitung durch mehrere Nutzer um? `@Version`, Statusfelder, oder gar nicht?
6. **Erstes Gesetz:** Gibt es bei euch Dienste mit gesprächigen Schnittstellen, die eigentlich lokale Aufrufe sein sollten?
7. **Money:** Wie werden Geldbeträge in euren Systemen dargestellt?
8. **Weiter:** Aus dem Architekturblock ist jetzt alles besprochen. Offen sind *Java Concurrency in Practice* und die zehn KI-Bücher, beginnend mit Chip Huyens *AI Engineering*. Womit weiter?

{{< anmerkung >}}
Zweimal steht hier, Evans habe „im selben Jahr“ das Repository übernommen und die Domäne isoliert. Fowlers Buch erschien im November 2002, Evans' *Domain-Driven Design* erst 2003, also ein Jahr später – so führt es auch die IT-Buch-Liste.
{{< /anmerkung >}}
