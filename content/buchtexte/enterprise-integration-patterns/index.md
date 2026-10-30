+++
title = "Enterprise Integration Patterns – Zusammenfassung und Einordnung"
description = "Gregor Hohpe, Bobby Woolf, Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions (2003)"
date = 2026-10-30T19:11:52+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["enterprise-integration-patterns-2003"]
+++

## Einleitung

PoEAA beschreibt, wie man **eine** Geschäftsanwendung baut. Enterprise Integration Patterns beschreibt, wie man **viele** Anwendungen miteinander verbindet. Das Buch erschien 2003 in Martin Fowlers Signature Series und ist bis heute das Standardvokabular für Messaging und Integration.

### Autoren und Kontext

**Gregor Hohpe** war damals Architekt bei ThoughtWorks, später bei Google, AWS und als Chefarchitekt bei Allianz; er schrieb außerdem *The Software Architect Elevator* und betreibt die Website enterpriseintegrationpatterns.com. **Bobby Woolf** war Berater bei IBM und arbeitete an Messaging-Produkten wie WebSphere MQ.

Um 2003 waren Unternehmen voller Anwendungen, die nicht miteinander sprachen: ein ERP-System, ein CRM-System, eine Lagerverwaltung, ein Webshop, oft von verschiedenen Herstellern und in verschiedenen Technologien. Produkte für **Enterprise Application Integration** wie TIBCO, webMethods und IBM MQ versprachen Abhilfe, hatten aber jeweils eigene Begriffe. Hohpe und Woolf gaben den gemeinsamen Konzepten Namen und Symbole.

### Die Kernthese

**Asynchrones Messaging** ist für die meisten Integrationsprobleme der beste Ansatz, weil es Systeme zeitlich und räumlich entkoppelt. Es ist aber auch schwieriger: Nachrichten können verloren gehen, doppelt ankommen, in falscher Reihenfolge eintreffen oder in unerwarteten Formaten. Die Muster des Buchs beschreiben, wie man damit umgeht.

### Aufbau

| Teil | Inhalt |
|---|---|
| Integrationsstile | vier grundlegende Arten, Anwendungen zu verbinden |
| Messaging-Systeme | die sechs Grundbausteine |
| Kanäle | Arten von Kanälen und ihre Eigenschaften |
| Nachrichten | wie man Nachrichten aufbaut |
| Routing | wie Nachrichten ihren Weg finden |
| Transformation | wie Nachrichten zwischen Formaten übersetzt werden |
| Endpunkte | wie Anwendungen Nachrichten senden und empfangen |
| Systemverwaltung | wie man ein Messaging-System überwacht und betreibt |

Insgesamt **65 Muster**, unterbrochen von drei ausführlichen Fallstudien mit Code für JMS, .NET und TIBCO. Jedes Muster hat ein eigenes **Symbol**; zusammen bilden sie eine visuelle Sprache, mit der man Integrationslösungen zeichnen kann. Diese Symbole werden bis heute in Werkzeugen und Dokumentationen verwendet.

Mit rund 700 Seiten ist das Buch umfangreich; wie PoEAA ist es als Nachschlagewerk gedacht.

## Vier Integrationsstile

Bevor es um Messaging geht, stellen die Autoren vier grundlegende Arten vor, Anwendungen zu verbinden. Sie bewerten jede danach, wie stark sie die Systeme koppelt, wie aktuell die Daten sind und wie viel Aufwand sie verursacht.

| Stil | Funktionsweise | Stärken | Schwächen |
|---|---|---|---|
| **Dateiübertragung** | eine Anwendung schreibt Dateien, eine andere liest sie, etwa nachts per Batch | einfach, entkoppelt, jedes System kann Dateien | Daten sind veraltet; Format, Namen und Zeitpunkte müssen abgestimmt werden |
| **Gemeinsame Datenbank** | alle Anwendungen lesen und schreiben in dieselbe Datenbank | Daten sofort konsistent, eine Quelle der Wahrheit | starke Kopplung über das Schema; Änderungen betreffen alle; Engpass |
| **Entfernter Prozeduraufruf** | eine Anwendung ruft Funktionen einer anderen direkt auf, etwa per RPC, CORBA, später REST | vertraut, Kapselung bleibt erhalten | zeitliche Kopplung: beide müssen gleichzeitig laufen; verteilte Aufrufe wirken lokal, sind es aber nicht |
| **Messaging** | Anwendungen senden sich asynchron Nachrichten über Kanäle | zeitlich entkoppelt, zuverlässig, flexibel erweiterbar | komplexer zu entwerfen, zu testen und zu debuggen; Asynchronität verlangt Umdenken |

### Die Abwägung

Die Stile bilden eine Folge: Dateiübertragung ist am lockersten gekoppelt, aber am langsamsten. Die gemeinsame Datenbank ist am aktuellsten, aber am stärksten gekoppelt. Der Prozeduraufruf kapselt besser, koppelt aber zeitlich. **Messaging** verbindet die Vorteile: so locker gekoppelt wie Dateien, so aktuell wie Aufrufe.

Die Autoren betonen, dass alle vier Stile ihren Platz haben und in vielen Unternehmen nebeneinander existieren. Messaging ist der Schwerpunkt des Buchs, nicht die einzige Antwort.

### Einordnung

Die Kritik an der **gemeinsamen Datenbank** ist dieselbe, die später Evans mit Bounded Contexts, Newman mit Datenbank pro Dienst und Richards und Ford mit der Datentopologie formulieren: Ein gemeinsames Schema ist die stärkste Kopplung, die es gibt. Und die Warnung vor **entfernten Aufrufen**, die wie lokale aussehen, ist Fowlers erstes Gesetz der Verteilung aus PoEAA, das im selben Jahr erschien.

## Die sechs Grundbausteine

Jedes Messaging-System besteht aus sechs Grundmustern, aus denen alle anderen abgeleitet werden.

| Muster | Rolle |
|---|---|
| **Message Channel** | die Verbindung, über die Nachrichten fließen, etwa eine Warteschlange oder ein Topic |
| **Message** | ein Datenpaket aus Kopf (Metadaten) und Rumpf (Inhalt) |
| **Pipes and Filters** | eine Verarbeitung wird in unabhängige Schritte zerlegt, die über Kanäle verbunden sind |
| **Message Router** | entscheidet, an welchen Kanal eine Nachricht weitergeht |
| **Message Translator** | übersetzt eine Nachricht von einem Format in ein anderes |
| **Message Endpoint** | der Anschluss einer Anwendung an das Messaging-System |

**Pipes and Filters** ist das architektonische Prinzip dahinter: Jeder Filter tut eine Sache, kennt nur seinen Eingangs- und Ausgangskanal und weiß nichts von den anderen. Filter lassen sich neu anordnen, ersetzen und unabhängig skalieren. Richards und Ford beschreiben dasselbe Prinzip als Pipeline-Architekturstil.

## Kanäle

### Zwei grundlegende Arten

| Kanal | Verhalten | Typischer Einsatz |
|---|---|---|
| **Point-to-Point** | jede Nachricht wird von **genau einem** Empfänger verarbeitet | Aufgaben verteilen, Befehle |
| **Publish-Subscribe** | jede Nachricht geht an **alle** Abonnenten | Ereignisse, Benachrichtigungen |

Das ist die Unterscheidung, die Richards und Ford als Abwägung zwischen Warteschlange und Topic beschreiben.

### Weitere Kanalmuster

| Muster | Inhalt |
|---|---|
| **Datatype Channel** | ein Kanal pro Nachrichtentyp, damit Empfänger wissen, was sie erwarten |
| **Invalid Message Channel** | Nachrichten, die ein Empfänger nicht verarbeiten kann, werden dorthin verschoben statt verworfen |
| **Dead Letter Channel** | Nachrichten, die das System nicht zustellen kann, etwa nach zu vielen Versuchen |
| **Guaranteed Delivery** | Nachrichten werden dauerhaft gespeichert, bevor sie als gesendet gelten, und überleben Abstürze |
| **Channel Adapter** | verbindet eine Anwendung, die kein Messaging kennt, mit einem Kanal, etwa über ihre Datenbank oder Dateien |
| **Messaging Bridge** | verbindet zwei verschiedene Messaging-Systeme |
| **Message Bus** | eine gemeinsame Infrastruktur mit gemeinsamen Formaten, über die alle Anwendungen kommunizieren |

### Einordnung

In heutigen Systemen begegnen einem diese Muster ständig: RabbitMQ-Queues sind Point-to-Point-Kanäle, Kafka-Topics mit Consumer Groups verbinden beide Arten, weil innerhalb einer Gruppe jede Nachricht nur einmal verarbeitet wird, verschiedene Gruppen aber alle Nachrichten erhalten. **Dead Letter Queues** sind in jedem Broker und jedem Cloud-Dienst eingebaut. **Channel Adapter** heißen bei Kafka Connectors, und Change Data Capture mit Debezium ist ein Channel Adapter, der eine Datenbank anzapft.

## Nachrichten konstruieren

### Drei Absichten

Die Autoren unterscheiden Nachrichten nach ihrer **Absicht**. Die Unterscheidung ist eine der nützlichsten des Buchs, weil sie bestimmt, wer die Nachricht besitzt und wie sie sich entwickeln darf.

| Art | Absicht | Beispiel | Wer bestimmt das Format? |
|---|---|---|---|
| **Command Message** | der Empfänger soll etwas tun | „Reserviere Lagerbestand für Bestellung 4711“ | der Empfänger |
| **Document Message** | Daten übertragen, der Empfänger entscheidet selbst | ein vollständiger Kundendatensatz | Absprache |
| **Event Message** | mitteilen, dass etwas passiert ist | „Bestellung 4711 wurde aufgegeben“ | der Sender |

```java
// Befehl: Imperativ, ein Empfänger
record ReserveStock(String orderId, String sku, int quantity) {}

// Dokument: Daten, Empfänger entscheidet
record CustomerRecord(String id, String name, Address address, List<Contract> contracts) {}

// Ereignis: Vergangenheit, beliebig viele Empfänger
record OrderPlaced(String orderId, String customerId, Instant at, Money total) {}
```

Ereignisse werden im Perfekt oder Präteritum benannt, Befehle im Imperativ. Das klingt nach einer Stilfrage, verhindert aber ein häufiges Problem: Ereignisse, die verkappte Befehle sind, etwa `SendWelcomeEmail` statt `CustomerRegistered`, koppeln den Sender an das Wissen, was Empfänger tun sollen.

### Anfrage und Antwort über Messaging

Auch synchrone Muster lassen sich mit Messaging bauen, wenn man ein paar Zusatzmuster verwendet:

| Muster | Inhalt |
|---|---|
| **Request-Reply** | Anfrage und Antwort sind zwei getrennte Nachrichten auf zwei Kanälen |
| **Return Address** | die Anfrage enthält den Kanal, auf dem die Antwort erwartet wird |
| **Correlation Identifier** | die Antwort enthält die ID der Anfrage, damit der Sender sie zuordnen kann |

```java
// Anfrage mit Rückadresse und Korrelations-ID
var requestId = UUID.randomUUID().toString();
jms.send("credit.requests", new CreditCheckRequest(customerId, amount), msg -> {
    msg.setJMSReplyTo(replyQueue);              // Return Address
    msg.setJMSCorrelationID(requestId);         // Correlation Identifier
    return msg;
});
```

### Weitere Muster

- **Message Sequence:** Große Daten werden in mehrere Nachrichten aufgeteilt, mit Laufnummer und Gesamtzahl.
- **Message Expiration:** Nachrichten, deren Inhalt nach einer bestimmten Zeit wertlos ist, etwa ein Kurs, bekommen ein Verfallsdatum.
- **Format Indicator:** Die Nachricht trägt eine Versionsangabe ihres Formats, damit Empfänger alte und neue Formate unterscheiden können. Heute übernehmen Schema-Registries diese Aufgabe.

### Einordnung

Die Unterscheidung von Befehl, Dokument und Ereignis findet man bei Evans in Domain Events, bei Kleppmann in Event Sourcing und bei Richards und Ford in Orchestrierung gegen Choreografie wieder. Martin Fowler hat sie später in seinem Text *What do you mean by Event-Driven?* weiter aufgefächert, etwa in Benachrichtigung, Zustandsübertragung und Event Sourcing.

## Routing

Routing-Muster entscheiden, wohin eine Nachricht geht, ohne dass Sender oder Empfänger davon wissen. Das Buch nutzt als durchgehendes Beispiel einen Händler namens *Widgets & Gadgets 'R Us*, dessen Bestellungen auf verschiedene Lager verteilt werden.

{{< bild src="bild-1.png" alt="Splitter, Content-Based Router und Aggregator im Zusammenspiel, nach dem Widgets-und-Gadgets-Beispiel des Buchs" >}}

Splitter, Content-Based Router und Aggregator im Zusammenspiel, nach dem Widgets-und-Gadgets-Beispiel des Buchs

### Einfache Router

| Muster | Inhalt |
|---|---|
| **Content-Based Router** | leitet jede Nachricht anhand ihres Inhalts an einen von mehreren Kanälen weiter |
| **Message Filter** | lässt nur Nachrichten durch, die eine Bedingung erfüllen |
| **Dynamic Router** | Empfänger melden sich zur Laufzeit an und teilen mit, welche Nachrichten sie verarbeiten |
| **Recipient List** | sendet eine Nachricht an eine berechnete Liste von Empfängern |

### Zerlegen und Zusammenführen

| Muster | Inhalt |
|---|---|
| **Splitter** | zerlegt eine Nachricht in mehrere, etwa eine Bestellung in einzelne Positionen |
| **Aggregator** | sammelt zusammengehörige Nachrichten und führt sie zu einer zusammen; braucht eine Korrelation, eine Abschlussbedingung und eine Strategie für fehlende Teile |
| **Resequencer** | bringt Nachrichten wieder in die richtige Reihenfolge |
| **Composed Message Processor** | Splitter, Router und Aggregator als Einheit |
| **Scatter-Gather** | sendet eine Anfrage an mehrere Empfänger und führt die Antworten zusammen, etwa Angebote verschiedener Anbieter |

Der **Aggregator** ist das schwierigste dieser Muster: Wann ist eine Gruppe vollständig? Nach einer festen Anzahl, nach einer Zeitspanne, wenn das erste gute Ergebnis da ist? Was passiert mit spät eintreffenden Teilen? Diese Fragen tauchen heute in jeder Stream-Verarbeitung als Fenster und Wasserzeichen wieder auf, wie Kleppmann beschreibt.

### Abläufe steuern

| Muster | Inhalt |
|---|---|
| **Routing Slip** | die Nachricht trägt eine Liste der Schritte, die sie durchlaufen soll |
| **Process Manager** | eine zentrale Komponente steuert einen mehrstufigen Ablauf und hält dessen Zustand |
| **Message Broker** | eine zentrale Vermittlungsstelle, die Nachrichten zwischen vielen Anwendungen verteilt |

Routing Slip und Process Manager sind die Vorläufer dessen, was Richards und Ford als Choreografie und Orchestrierung beschreiben. Der Process Manager ist im Kern eine **orchestrierte Saga**.

### Mit Apache Camel

Apache Camel setzt die Muster als Java-DSL um. Der Ablauf aus der Skizze sieht so aus:

```java
class OrderRoutes extends RouteBuilder {
    @Override public void configure() {
        from("kafka:orders")
            .split(body().method("lines"))                                   // Splitter
                .choice()                                                     // Content-Based Router
                    .when(simple("${body.type} == 'WIDGET'")).to("jms:warehouse.a")
                    .when(simple("${body.type} == 'GADGET'")).to("jms:warehouse.b")
                    .otherwise().to("jms:invalid.lines")                      // Invalid Message Channel
                .end()
            .end();

        from("jms:warehouse.confirmations")
            .aggregate(header("orderId"), new ConfirmationAggregation())      // Aggregator
                .completionSize(header("lineCount"))
                .completionTimeout(30_000)
            .to("kafka:order.confirmed");
    }
}
```

Die Begriffe im Code sind die Namen aus dem Buch. Das ist der vielleicht deutlichste Beleg für die Wirkung eines Musterkatalogs: Er wurde zur Programmiersprache.

## Transformation

Verschiedene Anwendungen sprechen verschiedene Sprachen: andere Feldnamen, andere Strukturen, andere Formate. Transformationsmuster übersetzen zwischen ihnen.

| Muster | Inhalt | Beispiel |
|---|---|---|
| **Envelope Wrapper** | eine Nachricht wird für den Transport in eine Hülle gepackt und beim Empfänger wieder ausgepackt | Verschlüsselung, Protokoll-Header |
| **Content Enricher** | ergänzt fehlende Daten aus einer anderen Quelle | aus einer Kundennummer wird ein vollständiger Kunde |
| **Content Filter** | entfernt nicht benötigte Daten | nur relevante Felder an einen externen Partner |
| **Claim Check** | große Daten werden abgelegt, die Nachricht enthält nur einen Verweis | ein PDF liegt im Objektspeicher, die Nachricht trägt die URL |
| **Normalizer** | Nachrichten in verschiedenen Formaten werden in ein gemeinsames Format übersetzt | Bestellungen per EDI, XML und JSON |
| **Canonical Data Model** | ein anwendungsunabhängiges Datenmodell, in das alle Anwendungen übersetzen | ein unternehmensweites Kundenformat |

### Das kanonische Datenmodell

Das **Canonical Data Model** verdient eine eigene Betrachtung, weil es eines der umstrittensten Muster ist. Die Idee: Statt jede Anwendung mit jeder anderen zu übersetzen, was bei n Anwendungen bis zu n(n−1) Übersetzungen ergibt, übersetzt jede nur in ein gemeinsames Format. Das reduziert die Zahl auf 2n.

Die Autoren nennen bereits die Risiken: Ein gemeinsames Modell muss die Bedürfnisse aller Anwendungen abdecken, wird schnell groß und schwer zu ändern. In der Praxis sind viele Projekte mit unternehmensweiten Datenmodellen gescheitert.

Evans' **Bounded Contexts** sind die Gegenposition: Jeder Kontext hat sein eigenes Modell, und an den Grenzen wird übersetzt, etwa mit einer Anticorruption Layer. Ein „Kunde“ im Vertrieb ist etwas anderes als ein „Kunde“ in der Buchhaltung. Die heutige Praxis liegt meist dazwischen: gemeinsame Formate für **veröffentlichte Ereignisse** zwischen Kontexten, Evans' **Published Language**, aber keine unternehmensweiten Modelle für interne Daten.

### Der Claim Check

Der Claim Check ist bis heute ein Standardmuster, weil Broker für große Nachrichten schlecht geeignet sind. Kafka etwa ist standardmäßig auf Nachrichten von etwa einem Megabyte ausgelegt. Große Dokumente, Bilder oder Datensätze liegen deshalb in einem Objektspeicher, und die Nachricht trägt nur den Verweis.

### Einordnung

Transformation ist das, was Fowler in PoEAA **Mapper** und Evans **Anticorruption Layer** nennt, angewandt auf Nachrichten. Brooks' Formel n(n−1)/2 für Kommunikationswege taucht hier als Argument für das kanonische Modell wieder auf, mit derselben Lehre: Weniger Verbindungen bedeuten weniger Kopplung, aber eine zentrale Stelle wird zum Engpass.

## Endpunkte

Endpunkte verbinden die Anwendung mit dem Messaging-System. Hier entscheidet sich, ob Messaging-Code die Fachlogik durchzieht oder sauber gekapselt bleibt.

### Messaging kapseln

| Muster | Inhalt |
|---|---|
| **Messaging Gateway** | eine Klasse mit fachlichen Methoden, die das Messaging verbirgt; die Anwendung ruft `orderService.place(order)` auf, nicht `jms.send(…)` |
| **Messaging Mapper** | übersetzt Domänenobjekte in Nachrichten und zurück |
| **Service Activator** | verbindet einen eingehenden Kanal mit einem gewöhnlichen Dienst, der nichts von Messaging weiß |

Das ist Fowlers Gateway und Martins Dependency Rule: Die Domäne kennt keine Broker.

### Empfangen

| Muster | Inhalt |
|---|---|
| **Polling Consumer** | der Empfänger fragt aktiv nach neuen Nachrichten, wenn er Kapazität hat |
| **Event-Driven Consumer** | der Empfänger wird automatisch aufgerufen, sobald eine Nachricht da ist |
| **Competing Consumers** | mehrere Empfänger lesen vom selben Kanal, um Last zu verteilen |
| **Message Dispatcher** | ein Empfänger verteilt Nachrichten an mehrere interne Bearbeiter |
| **Selective Consumer** | ein Empfänger liest nur Nachrichten, die ein Kriterium erfüllen |
| **Durable Subscriber** | ein Abonnent erhält auch Nachrichten, die gesendet wurden, während er offline war |
| **Transactional Client** | Empfangen, Verarbeiten und Senden geschehen in einer Transaktion |

### Idempotent Receiver

Das wichtigste Endpunkt-Muster für die heutige Praxis: Weil Messaging-Systeme meist nur **mindestens einmalige** Zustellung garantieren, kann dieselbe Nachricht mehrfach ankommen, etwa nach einem Absturz zwischen Verarbeitung und Bestätigung. Ein **Idempotent Receiver** erkennt Duplikate und verarbeitet sie nur einmal.

```java
@Component
class PaymentListener {
    private final ProcessedMessages processed;      // Tabelle mit verarbeiteten Nachrichten-IDs
    private final PaymentService payments;

    @KafkaListener(topics = "orders.placed")
    @Transactional
    void on(OrderPlaced event, @Header("messageId") String messageId) {
        if (!processed.markIfNew(messageId)) return;     // Duplikat: ignorieren
        payments.charge(event.orderId(), event.total()); // in derselben Transaktion
    }
}
```

Alternativ macht man die Verarbeitung selbst idempotent, etwa durch ein `INSERT … ON CONFLICT DO NOTHING` mit fachlichem Schlüssel oder durch Zustandsübergänge, die bei Wiederholung nichts ändern.

### Einordnung

Kleppmann widmet der Frage „genau einmal“ einen großen Teil seines Stream-Kapitels: Genau einmalige Verarbeitung entsteht praktisch immer aus **mindestens einmaliger Zustellung plus Idempotenz**. Competing Consumers sind die Consumer Groups von Kafka, Durable Subscriber sind dauerhafte Abonnements. Nygards Rat, Integrationspunkte zu kapseln, ist das Messaging Gateway.

## Systemverwaltung

Asynchrone Systeme sind schwer zu beobachten: Eine Nachricht verschwindet in einem Kanal, und niemand weiß, wo sie gerade ist. Das Kapitel zur Systemverwaltung beschreibt Muster für Überwachung, Fehlersuche und Tests.

| Muster | Inhalt | Heute |
|---|---|---|
| **Control Bus** | ein eigener Kanal für Verwaltungsnachrichten: Konfiguration, Statusabfragen, Steuerbefehle | Nygards Control Plane, Admin-APIs |
| **Detour** | Nachrichten können zur Laufzeit über zusätzliche Schritte umgeleitet werden, etwa zur Validierung oder Fehlersuche | Feature Toggles im Routing |
| **Wire Tap** | kopiert jede Nachricht eines Kanals in einen zweiten Kanal, ohne den Fluss zu stören | Logging, Auditing, Kafka-Consumer zum Mitlesen |
| **Message History** | jede Nachricht trägt eine Liste der Stationen, die sie durchlaufen hat | verteiltes Tracing, OpenTelemetry |
| **Message Store** | Kopien aller Nachrichten werden zentral gespeichert, für Auswertung und Fehlersuche | Kafka mit langer Aufbewahrung, Event Store |
| **Smart Proxy** | ein Zwischenschritt, der Anfragen und Antworten über Return Address verfolgt | Service Mesh |
| **Test Message** | spezielle Testnachrichten fließen durch das Produktionssystem und prüfen, ob alles funktioniert | synthetisches Monitoring |
| **Channel Purger** | entfernt alte oder fehlerhafte Nachrichten aus einem Kanal | Dead Letter Queue leeren, Offsets zurücksetzen |

Die **Message History** ist der Vorläufer dessen, was heute als verteiltes Tracing selbstverständlich ist: Jede Anfrage trägt eine Trace-ID, und jeder Dienst fügt seinen Abschnitt hinzu.

## Die Fallstudien

Das Buch enthält drei längere Zwischenkapitel, die Muster zu vollständigen Lösungen kombinieren.

### Der Kreditvermittler

Die bekannteste Fallstudie: Ein Kreditvermittler nimmt Anfragen entgegen, holt die Bonität des Kunden ein, fragt mehrere Banken nach Angeboten und wählt das beste aus.

| Schritt | Muster |
|---|---|
| Bonität ergänzen | Content Enricher |
| passende Banken bestimmen | Recipient List |
| Banken anfragen und Antworten sammeln | Scatter-Gather mit Aggregator |
| Antworten verschiedener Banken angleichen | Normalizer |
| bestes Angebot auswählen | Aggregator mit Auswahlstrategie |
| Gesamtablauf | Process Manager |

Die Autoren implementieren dieselbe Lösung **dreimal**: synchron mit Web Services, asynchron mit MSMQ in C# und mit TIBCO. Der Vergleich zeigt, wie Muster technologieunabhängig bleiben, während sich die Umsetzung stark unterscheidet.

### Widgets und Gadgets

Die zweite Fallstudie verbindet die Bestellabwicklung eines Händlers mit verschiedenen Systemen für Lager, Rechnungen und Versand. Sie zeigt Muster für Neubestellungen, Adressänderungen und Statusabfragen und das Zusammenspiel von Routing und Transformation.

### Starbucks und das Zwei-Phasen-Commit

Kurz nach dem Buch veröffentlichte Hohpe einen bekannten Text mit dem Titel *Starbucks Does Not Use Two-Phase Commit*. Sein Argument: Eine Kaffeebar arbeitet asynchron und optimistisch, Bestellung, Zahlung und Zubereitung laufen parallel, und Fehler werden durch Ausgleich behoben statt durch eine globale Transaktion: Getränk wegwerfen, Geld zurückgeben, neu machen. Das ist die Grundidee der **Saga** und eines der eingängigsten Bilder für asynchrone Integration.

## Was aus den Mustern wurde

EIP ist eines der wenigen Bücher der Reihe, dessen Muster kaum gealtert sind. Die Technik darunter hat sich dagegen grundlegend geändert.

### Die Werkzeuge

| 2003 | 2026 |
|---|---|
| IBM MQ, TIBCO, MSMQ, JMS | Kafka, RabbitMQ, Pulsar, NATS; weiterhin IBM MQ in Banken |
| proprietäre EAI-Produkte | Apache Camel, Spring Integration, MuleSoft |
| eigene Server | Cloud-Dienste: SQS und SNS, EventBridge, Azure Service Bus, Google Pub/Sub |
| XML und XSLT | JSON, Avro, Protobuf mit Schema-Registry |
| Prozess-Engines in EAI-Produkten | Workflow-Engines wie Temporal oder Camunda als Process Manager |
| keine Standards für Beschreibung | AsyncAPI für Schnittstellen, CloudEvents für Ereignisformate |

### Kafka verändert einige Muster

Kafka ist kein klassischer Message Broker, sondern ein **verteiltes Log**, wie Kleppmann ausführlich beschreibt. Das verschiebt einige Muster:

- **Message Store** ist eingebaut: Nachrichten bleiben nach dem Lesen erhalten und lassen sich erneut abspielen.
- **Durable Subscriber** ist der Normalfall: Jede Consumer Group merkt sich ihre Position.
- **Resequencer** wird seltener nötig: Innerhalb einer Partition ist die Reihenfolge garantiert, und mit einem passenden Schlüssel landen zusammengehörige Nachrichten in derselben Partition.
- **Competing Consumers** sind durch Partitionen begrenzt: Mehr Verbraucher als Partitionen bringen nichts.

### Aufstieg und Fall des ESB

In den 2000ern wurde der **Enterprise Service Bus** populär: eine zentrale Infrastruktur, die Routing, Transformation und Orchestrierung für alle Anwendungen übernahm. Viele ESB-Projekte endeten in einer zentralen, schwer änderbaren Plattform, über die jede Änderung laufen musste, und in einem zentralen Integrationsteam als Engpass.

Die Gegenbewegung formulierten James Lewis und Martin Fowler 2014 in ihrem Microservices-Artikel als **Smart Endpoints and Dumb Pipes**: Die Logik gehört in die Dienste, die Kanäle transportieren nur. Routing und Transformation wandern damit aus einer zentralen Plattform in die Endpunkte. Die Muster bleiben dieselben, nur ihr Ort ändert sich. Das ist ein Thema, das Team Topologies aus Organisationssicht beschreibt: Ein zentrales Integrationsteam ist ein Engpass für alle Stream-aligned Teams.

### Neue Muster seit 2003

- **Transactional Outbox:** Eine Nachricht wird in derselben Datenbanktransaktion wie die Fachdaten in eine Outbox-Tabelle geschrieben und anschließend von einem Prozess veröffentlicht. So entsteht keine Lücke zwischen Speichern und Senden. Eine Weiterentwicklung des Transactional Client.
- **Change Data Capture:** Änderungen in der Datenbank werden aus dem Transaktionslog gelesen und als Ereignisse veröffentlicht, etwa mit Debezium. Ein Channel Adapter für Datenbanken.
- **Event Sourcing und CQRS**, wie Kleppmann und Richards und Ford beschreiben.
- **Saga** als Begriff für Process Manager mit Ausgleichsaktionen.

Hohpe hat auf seiner Website über die Jahre weitere Muster, etwa für Konversationen zwischen Systemen, und Aktualisierungen veröffentlicht; eine zweite Auflage des Buchs gibt es nach meinem Kenntnisstand nicht.

## Kritik und Einordnung

### Stärken

- **Zeitlos:** Die Muster beschreiben Probleme, die mit jeder Messaging-Technik auftreten. Sie gelten für IBM MQ von 2003 ebenso wie für Kafka von 2026.
- **Eine gemeinsame Sprache:** Begriffe wie Dead Letter Channel, Idempotent Receiver, Splitter oder Aggregator verwendet die ganze Branche. Camel und Spring Integration haben sie zu Programmierkonstrukten gemacht.
- **Eine visuelle Notation:** Die Symbole erlauben, Integrationslösungen schnell zu skizzieren.
- **Ehrlich über Schwierigkeiten:** Die Autoren verschweigen nicht, dass Messaging schwerer zu entwerfen, zu testen und zu betreiben ist als synchrone Aufrufe.
- **Fallstudien in mehreren Technologien:** Sie zeigen, dass die Muster nicht an ein Produkt gebunden sind.

### Kritikpunkte

**1. Umfang.** Rund 700 Seiten und 65 Muster sind viel. Manche Muster sind sehr speziell, etwa Channel Purger oder Smart Proxy, und kaum jemand braucht sie alle.

**2. Technikbeispiele veraltet.** Die Codebeispiele verwenden JMS, MSMQ, TIBCO und XML. Sie illustrieren die Muster, sind aber für heutige Leser historisch.

**3. Zentrale Integrationsplattformen.** Das Buch denkt oft an eine zentrale Integrationsschicht zwischen Anwendungen. Das hat, ungewollt, die ESB-Welle begünstigt, deren Probleme heute bekannt sind. Die Muster selbst sind davon unabhängig, die Beispiele nicht.

**4. Wenig über Datenkonsistenz.** Wie man Konsistenz über mehrere Systeme hinweg sicherstellt, behandelt das Buch über Process Manager und Transactional Client, aber knapper, als es heute nötig wäre. Kleppmann und *Software Architecture: The Hard Parts* gehen hier tiefer.

**5. Wenig über Schemas und Evolution.** Wie man Nachrichtenformate weiterentwickelt, ohne Empfänger zu brechen, kommt nur über Format Indicator vor. Heute ist das mit Schema-Registries, Kompatibilitätsregeln und Verträgen ein eigenes Thema.

### Gesamturteil

EIP ist für Integration, was die Gang of Four für Objektentwurf und PoEAA für Geschäftsanwendungen ist: ein Vokabular, das man kennen sollte, auch wenn man es selten von vorn bis hinten liest. Für Java-Entwickler lohnt es sich besonders, weil Camel und Spring Integration die Muster direkt als Code anbieten. Am meisten bringt es zusammen mit Kleppmann für die Theorie verteilter Daten und Newman für die Architektur von Diensten.

## Bezüge zur Reihe

| Thema bei Hohpe und Woolf | Bezug in der Reihe |
|---|---|
| Musterkatalog mit Symbolen | Gang of Four; Fowler PoEAA als Schwesterbuch derselben Reihe |
| Gemeinsame Datenbank als stärkste Kopplung | Evans: Bounded Contexts; Richards und Ford: Datentopologie |
| Entfernter Aufruf wirkt lokal | Fowler PoEAA: erstes Gesetz der Verteilung; Richards und Ford: Trugschlüsse |
| Pipes and Filters | Richards und Ford: Pipeline-Stil |
| Queue gegen Topic | Richards und Ford: Abwägung im Kapitel Architekturdenken |
| Befehl, Dokument, Ereignis | Evans: Domain Events; Kleppmann: Event Sourcing |
| Canonical Data Model | Evans: Published Language, Anticorruption Layer; Brooks: n(n−1)/2 |
| Messaging Gateway, Mapper | Fowler PoEAA: Gateway, Mapper; Martin: Dependency Rule |
| Idempotent Receiver | Kleppmann: genau einmal = mindestens einmal plus Idempotenz |
| Aggregator, Resequencer | Kleppmann: Fenster, Reihenfolge in Streams |
| Process Manager, Routing Slip | Richards und Ford: Orchestrierung und Choreografie, Saga |
| Dead Letter Channel | Nygard: Fehler isolieren |
| Control Bus, Wire Tap, Message History | Nygard: Control Plane, Transparenz; verteiltes Tracing |
| Guaranteed Delivery, Durable Subscriber | Kleppmann: dauerhafte Logs |
| Zentrale Integrationsplattform | Team Topologies: zentrales Team als Engpass |

## Diskussionsfragen

1. **Integrationsstile:** Welche der vier Stile findest du in deinem Umfeld? Gibt es noch gemeinsame Datenbanken zwischen Anwendungen?
2. **Befehle und Ereignisse:** Unterscheidet ihr klar zwischen beiden? Gibt es Ereignisse, die eigentlich Befehle sind?
3. **Idempotenz:** Sind eure Nachrichtenempfänger idempotent? Was passiert, wenn eine Nachricht zweimal ankommt?
4. **Dead Letters:** Was geschieht bei euch mit Nachrichten, die nicht verarbeitet werden können? Schaut jemand regelmäßig in die Dead Letter Queue?
5. **Kanonisches Modell:** Gibt oder gab es bei euch ein unternehmensweites Datenmodell? Wie hat es sich bewährt?
6. **ESB:** Hast du mit einem Enterprise Service Bus gearbeitet? Was davon würdest du heute anders machen?
7. **Camel und Spring Integration:** Nutzt ihr eines der Frameworks, oder schreibt ihr Routing und Transformation von Hand?
8. **Weiter:** Als Nächstes Sam Newmans *Building Microservices*.
