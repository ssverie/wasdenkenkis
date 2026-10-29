+++
title = "Design Patterns – Zusammenfassung und Einordnung"
description = "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software (1994)"
date = 2026-10-29T14:41:57+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["design-patterns-1994"]
+++

## Einleitung

Das Buch hat 23 wiederkehrende Lösungen für objektorientierte Designprobleme benannt und beschrieben. Sein größter Beitrag ist nicht eine einzelne Lösung, sondern ein gemeinsames Vokabular: Wer „Observer“ oder „Adapter“ sagt, wird seit 30 Jahren verstanden.

### Die Autoren und ihr Kontext

Die vier Autoren, bekannt als **Gang of Four (GoF)**, kamen aus Forschung und Industrie. Erich Gamma schrieb seine Dissertation über Patterns und entwickelte später mit Kent Beck JUnit und bei IBM große Teile von Eclipse. Ralph Johnson war Professor an der University of Illinois und Smalltalk-Experte. Richard Helm und John Vlissides arbeiteten bei IBM. Vlissides starb 2005.

1994 war C++ die dominierende OO-Sprache, Java erschien erst ein Jahr später. Die Beispiele sind in C++ und Smalltalk. Viele Patterns lösen Probleme, die in diesen Sprachen besonders spürbar waren: keine Funktionen als Werte in C++, keine automatische Speicherverwaltung, schwerfällige Typsysteme.

### Der Pattern-Begriff

Die Idee stammt vom Architekten **Christopher Alexander**, der in *A Pattern Language* (1977) wiederkehrende Lösungen für Städte und Gebäude beschrieb. Ein Pattern beschreibt nach Alexander ein Problem, das immer wieder auftritt, und den Kern einer Lösung, die man unzählige Male anwenden kann, ohne sie je zweimal gleich umzusetzen. Kent Beck und Ward Cunningham brachten die Idee Ende der 1980er in die Softwareentwicklung.

Die GoF nennt vier wesentliche Elemente eines Patterns:

1. **Name:** ein bis zwei Wörter, die Teil des Vokabulars werden
2. **Problem:** wann man das Pattern anwendet
3. **Lösung:** die beteiligten Elemente, ihre Beziehungen und Verantwortlichkeiten, als abstrakte Vorlage, nicht als fertiger Code
4. **Konsequenzen:** Vor- und Nachteile, Kosten, Auswirkungen auf Flexibilität und Erweiterbarkeit

Der vierte Punkt wird beim Lesen oft überblättert, ist aber der wichtigste: Jedes Pattern hat einen Preis.

### Aufbau des Buchs

- **Kapitel 1:** Einführung in Patterns und objektorientierte Designprinzipien
- **Kapitel 2:** Fallstudie, der Entwurf eines Dokumenteditors namens Lexi, bei dem acht Patterns zusammenspielen
- **Kapitel 3–5:** der Katalog mit 23 Patterns in drei Gruppen
- **Kapitel 6:** Schlussfolgerungen

Jedes Pattern im Katalog folgt derselben Gliederung: Absicht, Alias, Motivation, Anwendbarkeit, Struktur als Klassendiagramm in OMT, einem Vorläufer von UML, Teilnehmer, Zusammenarbeit, Konsequenzen, Implementierung, Beispielcode, bekannte Verwendungen und verwandte Patterns.

## Grundprinzipien

Das erste Kapitel enthält zwei Sätze, die einflussreicher geworden sind als jedes einzelne Pattern. Sinngemäß:

1. **Programmiere gegen eine Schnittstelle, nicht gegen eine Implementierung.** Variablen und Parameter sollen den abstrakten Typ verwenden. Wer eine konkrete Klasse kennt, ist an sie gebunden.
2. **Ziehe Objektkomposition der Klassenvererbung vor.** Vererbung ist „White-Box“-Wiederverwendung: Die Unterklasse sieht und hängt von Interna der Oberklasse ab, und die Beziehung ist zur Kompilierzeit festgelegt. Komposition ist „Black-Box“: Objekte kennen sich nur über Schnittstellen und lassen sich zur Laufzeit austauschen.

Dazu kommt **Delegation** als Mechanismus, um mit Komposition so viel zu erreichen wie mit Vererbung: Ein Objekt reicht Anfragen an ein anderes weiter, das die Arbeit erledigt.

### Entwerfen für Veränderung

Die GoF listet typische Ursachen, die einen Neuentwurf erzwingen, und welche Patterns dagegen helfen. Einige Beispiele:

| Ursache für Neuentwurf | Hilfreiche Patterns |
|---|---|
| Objekte werden mit expliziter Klasse erzeugt | Abstract Factory, Factory Method, Prototype |
| Abhängigkeit von bestimmten Operationen | Chain of Responsibility, Command |
| Abhängigkeit von Hardware oder Plattform | Abstract Factory, Bridge |
| Abhängigkeit von Objektdarstellung oder Implementierung | Abstract Factory, Bridge, Memento, Proxy |
| Abhängigkeit von Algorithmen | Builder, Iterator, Strategy, Template Method, Visitor |
| Enge Kopplung | Abstract Factory, Bridge, Chain of Responsibility, Command, Facade, Mediator, Observer |
| Erweiterung durch Vererbung | Bridge, Chain of Responsibility, Composite, Decorator, Observer, Strategy |
| Klassen lassen sich nicht ändern | Adapter, Decorator, Visitor |

Der gemeinsame Gedanke: **Finde heraus, was sich ändert, und kapsle es.** Fast jedes Pattern isoliert eine bestimmte Art von Veränderung hinter einer Schnittstelle.

### Klassifikation

Die 23 Patterns sind nach zwei Achsen geordnet: nach **Zweck** (Erzeugung, Struktur, Verhalten) und nach **Bereich**, also ob die Beziehung über Klassen und Vererbung zur Kompilierzeit oder über Objekte zur Laufzeit entsteht.

| Bereich | Erzeugungsmuster | Strukturmuster | Verhaltensmuster |
|---|---|---|---|
| Klasse | Factory Method | Adapter (Klassenvariante) | Interpreter, Template Method |
| Objekt | Abstract Factory, Builder, Prototype, Singleton | Adapter (Objektvariante), Bridge, Composite, Decorator, Facade, Flyweight, Proxy | Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Visitor |

Zahlenmäßig: 5 Erzeugungs-, 7 Struktur- und 11 Verhaltensmuster. Nur vier beruhen auf Vererbung, alle anderen auf Komposition. Das ist das zweite Prinzip in Zahlen.

### Einordnung

Die beiden Prinzipien sind heute Allgemeingut. „Komposition vor Vererbung“ taucht bei Fowler als Replace Subclass with Delegate auf, bei Ousterhout als Warnung vor Implementierungsvererbung, bei Martin im Dependency-Inversion-Prinzip. Kotlin macht Klassen standardmäßig `final`, Go und Rust verzichten ganz auf Klassenvererbung. In diesem Punkt hat die GoF die Entwicklung der Sprachen selbst beeinflusst.

## Fallstudie: der Editor Lexi

Das zweite Kapitel zeigt, dass Patterns nicht einzeln, sondern im Zusammenspiel auftreten. Am Entwurf eines grafischen Dokumenteditors lösen acht Patterns sieben Designprobleme.

| Designproblem | Pattern | Idee |
|---|---|---|
| Dokumentstruktur: Zeichen, Bilder, Zeilen, Spalten, Seiten | Composite | Einzelelemente und Gruppen haben dieselbe Schnittstelle „Glyph“ und lassen sich verschachteln. |
| Formatierung: Zeilenumbruch nach verschiedenen Algorithmen | Strategy | Der Umbruchalgorithmus ist ein austauschbares Objekt. |
| Verzierung der Oberfläche: Rahmen, Scrollbalken | Decorator | Eine Hülle mit derselben Schnittstelle fügt Verhalten hinzu. |
| Mehrere Look-and-Feel-Standards | Abstract Factory | Eine Fabrik erzeugt passende Bedienelemente einer Familie. |
| Mehrere Fenstersysteme | Bridge | Die Fensterabstraktion ist von der plattformspezifischen Implementierung getrennt. |
| Benutzeraktionen mit Rückgängig | Command | Jede Aktion ist ein Objekt mit Ausführen und Rückgängig. |
| Rechtschreibprüfung und Silbentrennung | Iterator, Visitor | Iterator durchläuft die Struktur, Visitor fügt neue Analysen hinzu, ohne die Glyph-Klassen zu ändern. |

### Was die Fallstudie zeigt

- Jedes Pattern wird **aus einem konkreten Problem heraus** eingeführt, mit verworfenen Alternativen. Etwa die Idee, für jede Kombination aus Rahmen und Scrollbalken eine eigene Unterklasse zu bilden, bevor Decorator als Lösung kommt.
- Die Patterns **greifen ineinander**: Der Visitor wandert über die Composite-Struktur, die Commands ändern sie, der Decorator verpackt sie.
- Die Struktur ist **auf Veränderung ausgelegt**: neuer Umbruchalgorithmus, neues Fenstersystem, neue Analyse, jeweils ohne bestehenden Code umzubauen.

### Einordnung

Viele Leser halten das Kapitel für den wertvollsten Teil des Buchs, weil es zeigt, *wie* man auf ein Pattern kommt, statt nur das Ergebnis zu präsentieren. Lexi war von realen Systemen der Autoren inspiriert, etwa von Vlissides' Arbeit an InterViews und dem Editor Doc.

Aus Ousterhouts Blick fällt auf: Das Design ist hochflexibel, aber auch hochabstrakt. Glyph hat viele Methoden, die für die meisten Unterklassen keinen Sinn ergeben, und die Gesamtzahl an Klassen und Schnittstellen ist groß. Für einen Editor, der wirklich viele Plattformen und Formate bedienen muss, ist das gerechtfertigt. Als Vorlage für eine gewöhnliche Geschäftsanwendung wäre es Überdesign.

## Erzeugungsmuster

Erzeugungsmuster entkoppeln ein System davon, wie seine Objekte erzeugt und zusammengesetzt werden. Der Code soll mit abstrakten Typen arbeiten, ohne `new KonkreteKlasse()` zu kennen.

### Factory Method

**Absicht:** Eine Oberklasse definiert eine Methode zum Erzeugen von Objekten, Unterklassen entscheiden, welche Klasse erzeugt wird.

```java
abstract class ReportExporter {
    public void export(Report r) {
        Writer w = createWriter();      // Factory Method
        w.write(r);
    }
    protected abstract Writer createWriter();
}

class PdfExporter extends ReportExporter {
    protected Writer createWriter() { return new PdfWriter(); }
}
```

**Heute:** Die klassische Variante mit Vererbung ist selten geworden. Häufiger ist eine statische Fabrikmethode wie `List.of(...)` oder `Optional.empty()`, die Fowler als Replace Constructor with Factory Function führt, oder die Übergabe eines `Supplier<Writer>`.

### Abstract Factory

**Absicht:** Eine Schnittstelle, um Familien zusammengehöriger Objekte zu erzeugen, ohne ihre konkreten Klassen zu nennen.

```java
interface UiFactory {
    Button button(String label);
    TextField textField();
}
class DarkThemeFactory implements UiFactory { … }
class LightThemeFactory implements UiFactory { … }
```

**Heute:** Konzeptionell lebendig, etwa bei Datenbanktreibern oder Cloud-Anbietern. In der Praxis übernimmt oft ein Dependency-Injection-Container wie Spring die Rolle der Fabrik.

### Builder

**Absicht:** Den Aufbau eines komplexen Objekts von seiner Darstellung trennen, sodass derselbe Ablauf verschiedene Ergebnisse erzeugen kann.

Im GoF-Original steuert ein „Director“ einen austauschbaren Builder, etwa einen Konverter, der dasselbe Dokument in RTF, TeX oder Text übersetzt. In Java ist heute fast nur die vereinfachte Variante von Joshua Bloch aus *Effective Java* verbreitet, die lange Konstruktoren lesbar macht:

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/orders"))
    .timeout(Duration.ofSeconds(10))
    .header("Accept", "application/json")
    .GET()
    .build();
```

**Heute:** Sehr verbreitet, aber meist nicht in GoF-Form. Records mit wenigen Feldern brauchen oft keinen Builder, Lombok erzeugt ihn per Annotation.

### Prototype

**Absicht:** Neue Objekte durch Kopieren eines Prototyps erzeugen.

**Heute:** In Java selten. `Cloneable` und `clone()` gelten seit *Effective Java* als misslungen. Stattdessen nutzt man Kopierkonstruktoren oder bei Records `with`-artige Methoden, die eine veränderte Kopie liefern. In JavaScript dagegen ist Prototype das Grundmodell der Sprache.

### Singleton

**Absicht:** Eine Klasse hat genau eine Instanz mit globalem Zugriffspunkt.

```java
// moderne, threadsichere Variante nach Bloch
public enum Configuration {
    INSTANCE;
    private final Properties props = load();
    public String get(String key) { return props.getProperty(key); }
}
```

**Heute:** Das umstrittenste Pattern des Buchs. Ein Singleton ist globaler Zustand mit freundlichem Namen: schwer zu testen, versteckte Abhängigkeiten, Probleme mit Nebenläufigkeit. Fowler führt globale Daten als eigenen Smell. Die übliche Lösung: Ein DI-Container erzeugt genau eine Instanz und injiziert sie. Die Klasse selbst weiß nichts davon. Gamma hat in Interviews eingeräumt, dass er Singleton bei einer Neuauflage streichen würde.

## Strukturmuster

Strukturmuster beschreiben, wie Klassen und Objekte zu größeren Strukturen zusammengesetzt werden. Viele sehen sich im Klassendiagramm ähnlich, eine Hülle um ein anderes Objekt, unterscheiden sich aber in der **Absicht**.

| Pattern | Absicht in einem Satz | Hülle ändert … |
|---|---|---|
| Adapter | Eine vorhandene Schnittstelle an eine erwartete anpassen | die Schnittstelle |
| Decorator | Einem Objekt dynamisch Verhalten hinzufügen | das Verhalten, Schnittstelle bleibt |
| Proxy | Den Zugriff auf ein Objekt kontrollieren | den Zugriff, Schnittstelle bleibt |
| Facade | Eine einfache Schnittstelle zu einem Subsystem anbieten | die Komplexität dahinter |
| Bridge | Abstraktion und Implementierung unabhängig variierbar machen | nichts, trennt zwei Hierarchien |
| Composite | Teile und Ganzes einheitlich behandeln | nichts, bildet Baumstrukturen |
| Flyweight | Viele feingranulare Objekte effizient teilen | nichts, teilt gemeinsamen Zustand |

### Adapter

```java
// Fremde Bibliothek
class LegacyTemperatureSensor { double readFahrenheit() { … } }

// Erwartete Schnittstelle
interface TemperatureSource { double celsius(); }

class SensorAdapter implements TemperatureSource {
    private final LegacyTemperatureSensor sensor;
    SensorAdapter(LegacyTemperatureSensor s) { this.sensor = s; }
    public double celsius() { return (sensor.readFahrenheit() - 32) * 5 / 9; }
}
```

**Heute:** Allgegenwärtig, etwa bei Ports and Adapters. Bei Interfaces mit einer Methode oft nur noch ein Lambda: `TemperatureSource src = () -> (legacy.readFahrenheit() - 32) * 5 / 9;`

### Decorator

**Heute:** Bekanntestes Beispiel sind die Java-I/O-Streams, die Ousterhout als flach kritisiert. In funktionalem Stil wird ein Decorator oft zur Funktionskomposition:

```java
Function<Request, Response> handler = this::handle;
Function<Request, Response> withLogging = req -> {
    log.info("→ {}", req);
    return handler.apply(req);
};
```

Frameworks setzen Decorators auch über Annotationen und AOP um, etwa `@Transactional` oder `@Cacheable` in Spring, die zur Laufzeit Proxies erzeugen.

### Proxy

**Heute:** Meist von Frameworks erzeugt und für den Entwickler unsichtbar: Lazy Loading in Hibernate, Remote-Stubs, Spring-AOP. `java.lang.reflect.Proxy` erzeugt dynamische Proxies für Interfaces. Proxy ist damit eines der verbreitetsten Patterns, das kaum jemand selbst schreibt.

### Facade

**Heute:** Unumstritten und sehr verbreitet. Facade ist im Kern Ousterhouts tiefes Modul: einfache Schnittstelle, viel verborgene Funktionalität. Viele Service-Klassen in Geschäftsanwendungen sind Fassaden über mehrere Repositories und externe Dienste.

### Composite

```java
sealed interface FileNode permits FileLeaf, Directory {
    long size();
}
record FileLeaf(String name, long size) implements FileNode {}
record Directory(String name, List<FileNode> children) implements FileNode {
    public long size() { return children.stream().mapToLong(FileNode::size).sum(); }
}
```

**Heute:** Zeitlos, überall wo Bäume vorkommen: Dateisysteme, UI-Komponenten, Syntaxbäume, Organisationsstrukturen. Mit sealed Interfaces und Records wird es kompakt und typsicher.

### Bridge

**Heute:** Schwer zu verstehen und selten bewusst eingesetzt. Das Konzept, zwei Variationsachsen über Komposition zu trennen statt eine Klassenexplosion durch Vererbung zu erzeugen, steckt aber in vielen Designs, etwa JDBC: `Connection` als Abstraktion, Treiber als Implementierung.

### Flyweight

**Heute:** Eine Speicheroptimierung, die in Java bei `Integer.valueOf` für kleine Zahlen oder beim String-Pool versteckt ist. In Anwendungscode selten nötig, in Spielen und Editoren mit Millionen kleiner Objekte aber weiterhin relevant.

## Verhaltensmuster I

Verhaltensmuster verteilen Verantwortung und Algorithmen zwischen Objekten. Die sechs hier sind die im Alltag häufigsten, und an ihnen sieht man am deutlichsten, was Lambdas verändert haben.

### Strategy

**Absicht:** Eine Familie von Algorithmen kapseln und austauschbar machen.

```java
// GoF-Stil, Java 1.4
interface PricingStrategy { BigDecimal price(Order o); }
class RegularPricing implements PricingStrategy { … }
class BlackFridayPricing implements PricingStrategy { … }

// Java 8+: Die Strategie ist eine Funktion.
Function<Order, BigDecimal> pricing = o -> o.net().multiply(new BigDecimal("0.8"));
orders.sort(Comparator.comparing(Order::date).reversed());
```

**Heute:** Das Pattern lebt, aber meist ohne eigene Klassen. `Comparator` ist die bekannteste Strategie im JDK. Eigene Klassen lohnen sich, wenn eine Strategie Zustand oder mehrere Methoden hat.

### Command

**Absicht:** Eine Anfrage als Objekt kapseln, um sie zu parametrisieren, in eine Warteschlange zu stellen, zu protokollieren oder rückgängig zu machen.

```java
interface EditCommand {
    void execute(Document d);
    void undo(Document d);
}

record InsertText(int pos, String text) implements EditCommand {
    public void execute(Document d) { d.insert(pos, text); }
    public void undo(Document d)    { d.delete(pos, pos + text.length()); }
}
```

**Heute:** Ohne Undo ist ein Command oft nur ein `Runnable` oder `Callable`. Mit Undo, Historie oder Serialisierung bleibt es ein eigenständiges Pattern, etwa bei Event Sourcing, CQRS oder Job-Queues.

### Observer

**Absicht:** Eine Eins-zu-viele-Abhängigkeit, bei der alle abhängigen Objekte benachrichtigt werden, wenn sich ein Objekt ändert.

```java
class StockTicker {
    private final List<Consumer<Price>> listeners = new CopyOnWriteArrayList<>();
    public void subscribe(Consumer<Price> l) { listeners.add(l); }
    void publish(Price p) { listeners.forEach(l -> l.accept(p)); }
}
```

**Heute:** Überall, in Formen, die die GoF noch nicht kannte: GUI-Listener, Event-Busse, Reactive Streams (`java.util.concurrent.Flow`, Project Reactor, RxJava), Message Broker wie Kafka. `java.util.Observable` ist seit Java 9 als veraltet markiert. Die Schwächen sind dieselben wie 1994: schwer nachvollziehbarer Kontrollfluss, Speicherlecks durch vergessene Abmeldungen und Reihenfolgeprobleme. Ousterhout nennt ereignisgesteuerten Code ausdrücklich als Quelle für nicht offensichtlichen Code.

### Template Method

**Absicht:** Das Gerüst eines Algorithmus in einer Oberklasse festlegen, einzelne Schritte überlassen Unterklassen.

**Heute:** Eines der vier vererbungsbasierten Patterns und deshalb auf dem Rückzug. Häufig ersetzt man die überschreibbaren Schritte durch übergebene Funktionen, also durch Strategy. In Frameworks lebt es weiter, etwa als `JdbcTemplate` in Spring, das trotz des Namens eher mit Callbacks als mit Vererbung arbeitet.

### Iterator

**Absicht:** Elemente einer Sammlung nacheinander durchlaufen, ohne ihre innere Darstellung offenzulegen.

**Heute:** Vollständig in die Sprache eingegangen: `Iterable`, die erweiterte for-Schleife und Streams. Kaum jemand schreibt noch selbst einen Iterator. Das ist der klarste Fall eines Patterns, das „unsichtbar“ geworden ist.

### State

**Absicht:** Ein Objekt ändert sein Verhalten, wenn sich sein innerer Zustand ändert, als hätte es seine Klasse gewechselt.

```java
sealed interface OrderState permits Draft, Submitted, Shipped {}
record Draft() implements OrderState {}
record Submitted(Instant at) implements OrderState {}
record Shipped(String trackingId) implements OrderState {}

OrderState next(OrderState s, Event e) {
    return switch (s) {
        case Draft d when e instanceof Submit -> new Submitted(Instant.now());
        case Submitted sub when e instanceof Ship sh -> new Shipped(sh.trackingId());
        default -> throw new IllegalStateException(s + " erlaubt " + e + " nicht");
    };
}
```

**Heute:** Die GoF-Lösung mit einer Klasse pro Zustand, die das Verhalten enthält, ist weiterhin sinnvoll, wenn jeder Zustand viel eigenes Verhalten hat. Bei einfachen Zustandsautomaten ist die Variante mit sealed Types und einem zentralen `switch` oft übersichtlicher, weil alle Übergänge an einer Stelle stehen.

## Verhaltensmuster II

Diese fünf sind seltener oder spezieller, zeigen aber einige der interessantesten Verschiebungen seit 1994.

### Visitor

**Absicht:** Neue Operationen auf einer Objektstruktur definieren, ohne die Klassen der Elemente zu ändern.

Visitor ist das Pattern, das am deutlichsten eine Sprachlücke füllt: Java hatte lange nur Single Dispatch, die aufgerufene Methode hing nur vom Empfänger ab. Visitor simuliert **Double Dispatch** über das bekannte Hin und Her von `accept` und `visit`.

```java
// GoF-Stil
interface Expr { <R> R accept(ExprVisitor<R> v); }
interface ExprVisitor<R> { R visitNum(Num n); R visitAdd(Add a); }
record Num(int value) implements Expr {
    public <R> R accept(ExprVisitor<R> v) { return v.visitNum(this); }
}
record Add(Expr left, Expr right) implements Expr {
    public <R> R accept(ExprVisitor<R> v) { return v.visitAdd(this); }
}

// Java 21: sealed Types + Pattern Matching, kein accept/visit mehr
sealed interface Expr2 permits Num2, Add2 {}
record Num2(int value) implements Expr2 {}
record Add2(Expr2 left, Expr2 right) implements Expr2 {}

int eval(Expr2 e) {
    return switch (e) {
        case Num2 n -> n.value();
        case Add2(Expr2 l, Expr2 r) -> eval(l) + eval(r);
    };
}
```

**Heute:** Mit Record Patterns und erschöpfendem `switch` ist der klassische Visitor in Java weitgehend überflüssig. Der Compiler meldet sogar, wenn ein neuer Fall nicht behandelt wird, was der Visitor über das Interface ebenfalls leistete, nur mit viel mehr Zeremonie. Genau das ist der prozedurale Pol der Daten-Objekt-Antisymmetrie aus Clean Code. In Compilern und Werkzeugen, die auf älteren Java-Versionen laufen, etwa javac selbst oder ANTLR, bleibt Visitor verbreitet.

### Chain of Responsibility

**Absicht:** Eine Anfrage durch eine Kette von Empfängern reichen, bis einer sie bearbeitet.

**Heute:** Sehr lebendig, aber meist als Middleware-Kette, in der jedes Glied die Anfrage bearbeitet und weiterreicht: Servlet-Filter, Spring-Security-Filterketten, HTTP-Interceptors. Streng genommen ist das eine Variante, bei der nicht einer, sondern alle Glieder handeln.

```java
interface Filter { Response handle(Request r, Function<Request, Response> next); }
```

### Mediator

**Absicht:** Ein Objekt kapselt, wie eine Menge von Objekten zusammenarbeitet, damit sie sich nicht direkt kennen müssen.

**Heute:** Typisch in GUI-Dialogen, in denen Felder voneinander abhängen. In verteilten Systemen übernimmt ein Message Broker oder ein Orchestrator eine ähnliche Rolle. Die Gefahr ist dieselbe wie 1994: Der Mediator wird zum Gottobjekt, das alles weiß.

### Memento

**Absicht:** Den inneren Zustand eines Objekts erfassen und auslagern, ohne die Kapselung zu verletzen, um ihn später wiederherzustellen.

**Heute:** Mit unveränderlichen Objekten wird Memento fast trivial: Der alte Zustand ist einfach das alte Objekt. Records und persistente Datenstrukturen machen Undo, Snapshots und Zeitreisen-Debugging deutlich einfacher als 1994.

### Interpreter

**Absicht:** Für eine einfache Sprache eine Grammatik als Klassenhierarchie darstellen und Sätze durch Auswerten des Syntaxbaums interpretieren.

**Heute:** Für echte Sprachen nutzt man Parser-Generatoren wie ANTLR. Für kleine domänenspezifische Ausdrücke, etwa Regeln, Filter oder Formeln, ist die Idee weiterhin brauchbar und mit sealed Types und Pattern Matching sehr kompakt, wie das `eval`-Beispiel oben zeigt. Interpreter und Composite sind dabei fast dasselbe Pattern mit anderer Absicht.

## Was moderne Sprachen übernommen haben

Viele Patterns sind keine zeitlosen Designwahrheiten, sondern Umgehungen von Sprachgrenzen. Sobald die Sprache das Konzept direkt unterstützt, schrumpft das Pattern auf eine Zeile oder verschwindet ganz.

Peter Norvig hat das schon 1996 in einem Vortrag gezeigt: In dynamischen Sprachen wie Lisp oder Dylan seien 16 der 23 Patterns entweder unsichtbar oder deutlich einfacher. Java hat seitdem viele dieser Mittel nachgeholt: Lambdas (Java 8), `var` (10), Records (16), sealed Types (17) und Pattern Matching im `switch` (21).

| Pattern | Status in Java 21 | Typische heutige Form |
|---|---|---|
| Iterator | in der Sprache aufgegangen | `Iterable`, for-each, Streams |
| Strategy | stark vereinfacht | Lambda, `Function`, `Comparator` |
| Command | vereinfacht, ohne Undo | `Runnable`, `Callable`, Lambda; mit Undo weiter als Klasse |
| Template Method | auf dem Rückzug | übergebene Funktionen statt Unterklassen |
| Observer | gewandelt | Listener-Lambdas, Reactive Streams, Event-Busse |
| Visitor | weitgehend ersetzt | sealed Types + Pattern Matching |
| Interpreter | vereinfacht | sealed Types + rekursiver `switch` |
| State | Alternative vorhanden | sealed Types + zentraler `switch`, oder klassisch |
| Memento | vereinfacht | unveränderliche Records als Schnappschüsse |
| Factory Method | gewandelt | statische Fabrikmethoden, `Supplier` |
| Abstract Factory | oft übernommen | DI-Container |
| Singleton | gilt als Anti-Pattern | Scope im DI-Container, notfalls `enum` |
| Builder | gewandelt | Bloch-Builder, Lombok; bei Records oft unnötig |
| Prototype | selten | Kopierkonstruktoren, Records |
| Proxy | meist generiert | Frameworks, `java.lang.reflect.Proxy` |
| Decorator | lebendig, teils funktional | Wrapper-Klassen, Funktionskomposition, Annotationen |
| Chain of Responsibility | lebendig, gewandelt | Filter- und Middleware-Ketten |
| Adapter | lebendig | Wrapper-Klasse oder Lambda |
| Facade | lebendig | Service-Klassen, Modul-APIs |
| Composite | lebendig | sealed Types + Records für Bäume |
| Bridge | selten bewusst | Treiber-Architekturen wie JDBC |
| Mediator | lebendig, spezieller | GUI-Controller, Orchestratoren |
| Flyweight | im JDK versteckt | `Integer.valueOf`, String-Pool |

### Was davon bleibt

Zählt man grob, sind etwa zehn Patterns in modernem Java deutlich einfacher oder durch Sprachmittel ersetzt, etwa acht leben unverändert oder in gewandelter Form weiter, Singleton ist zum Gegenbeispiel geworden, und der Rest wie Bridge oder Flyweight ist selten und speziell.

Die wichtige Einsicht: Verschwunden ist meist die **Implementierung**, nicht das **Konzept**. Eine Lambda als Comparator ist immer noch eine Strategy. Ein `switch` über sealed Types ist immer noch das, was Visitor lösen wollte. Das Vokabular bleibt nützlich, um über Code zu reden, auch wenn niemand mehr die Klassendiagramme aus dem Buch abtippt.

## Kritik und Einordnung

Das Buch ist einer der einflussreichsten Texte der Softwaregeschichte und zugleich einer der am meisten missverstandenen. Die Kritik richtet sich weniger gegen das Buch selbst als gegen den Umgang damit.

### Stärken

- **Vokabular:** Der wichtigste Beitrag. Patterns machen Design besprechbar.
- **Die zwei Prinzipien:** Schnittstellen statt Implementierungen, Komposition statt Vererbung. Beide haben Sprachen und Frameworks geprägt.
- **Ehrliche Konsequenzen:** Jedes Pattern nennt seine Kosten. Wer das Buch genau liest, findet kaum Dogmatismus.
- **Fallstudie:** Zeigt, wie Patterns aus Problemen entstehen und zusammenspielen.
- **Einfluss auf Frameworks:** Swing, JUnit, Eclipse und Spring sind voll von GoF-Patterns, teils von den Autoren selbst gebaut.

### Kritikpunkte

**1. Sprachkrücken.** Viele Patterns kompensieren fehlende Sprachmittel von C++ und Java der 90er, vor allem fehlende Funktionen als Werte und fehlendes Pattern Matching. Norvigs Argument von 1996 hat sich mit jeder Java-Version weiter bestätigt.

**2. Patternitis.** In den 2000ern wurden Patterns zum Selbstzweck. Typische Symptome waren Factories für Klassen, die nur eine Implementierung haben, Interfaces für alles, Klassen mit Namen wie `AbstractSingletonProxyFactoryBean`, die tatsächlich in Spring existiert. Der Fehler: Man fängt mit dem Pattern an statt mit dem Problem. Joshua Kerievsky reagierte darauf 2004 mit *Refactoring to Patterns*: Patterns soll man herbeirefaktorieren, wenn der Code sie verlangt, nicht vorab einbauen.

**3. Singleton.** Hat mehr Schaden angerichtet als jedes andere Pattern, weil es globalen Zustand legitimiert hat.

**4. Viele Klassen, viel Indirektion.** Aus Ousterhouts Sicht erzeugen manche Patterns flache Schichten: Decorator, Proxy und Adapter fügen oft eine Schnittstelle hinzu, ohne viel Funktionalität zu verbergen. Ousterhout warnt ausdrücklich, Patterns dort einzusetzen, wo sie nicht genau passen.

**5. Schwer lesbar.** Das Buch ist dicht, akademisch formuliert und in alter Notation. Viele Entwickler kennen die Patterns aus Sekundärliteratur wie *Head First Design Patterns* statt aus dem Original.

**6. Nur OO, nur Mikroebene.** Patterns für Architektur, Integration, Nebenläufigkeit oder verteilte Systeme fehlen. Dafür entstanden eigene Kataloge, etwa Fowlers *Patterns of Enterprise Application Architecture*, Hohpe und Woolfs *Enterprise Integration Patterns* und die POSA-Reihe.

### Gesamturteil

Das Buch ist heute weniger Anleitung als Referenz und historisches Dokument. Wer es liest, sollte für jedes Pattern fragen: Welches Problem löst es, gibt es dieses Problem in meiner Sprache noch, und lohnen sich die Kosten? Die Konzepte bleiben wertvoll, die Klassendiagramme sind in vielen Fällen Geschichte.

## Verhältnis zu Martin, Fowler und Ousterhout

Die GoF ist das älteste der vier Bücher und liefert vieles, worauf die anderen aufbauen. Jeder der drei späteren Autoren übernimmt einen anderen Teil davon.

| Aspekt | GoF (1994) | Martin | Fowler | Ousterhout |
|---|---|---|---|---|
| Haltung zu Patterns | Katalog bewährter Lösungen | Pattern-Namen als Vokabular für Absicht | Patterns als Ziel von Refactorings | nützlich, wo sie genau passen, sonst schädlich |
| Komposition vor Vererbung | Grundprinzip | über SOLID, vor allem DIP | Replace Subclass/Superclass with Delegate | Warnung vor Implementierungsvererbung |
| Polymorphie statt Bedingung | State, Strategy, Visitor | switch in Factory vergraben | Replace Conditional with Polymorphism, aber nur bei Wiederholung | kein eigenes Thema, eher pragmatisch |
| Decorator, Proxy, Adapter | zentrale Strukturmuster | positiv | Hide Delegate, aber auch Remove Middle Man | oft flach, Pass-Through-Gefahr |
| Facade | Strukturmuster | – | – | Inbegriff eines tiefen Moduls |
| Wann einsetzen | wenn das Problem passt | früh, als Designstruktur | wenn der Code es verlangt | wenn es die Gesamtkomplexität senkt |

Der interessanteste Gegensatz liegt beim **Zeitpunkt**. Die GoF denkt Patterns eher als Entwurfsentscheidung vorab, wie in der Lexi-Fallstudie. Fowler und Kerievsky drehen das um: Patterns entstehen durch Refactoring, wenn der Code danach verlangt. Ousterhout liegt dazwischen: vorab nachdenken mit „Design it twice“, aber Patterns nur, wenn sie das System wirklich einfacher machen.

## Diskussionsfragen

1. **Welche Patterns benutzt du wirklich?** Wenn du ehrlich zählst, welche fünf Patterns kommen in deinem Code bewusst vor, und welche schreibst du nie?
2. **Patternitis:** Hast du Projekte erlebt, in denen Patterns zum Selbstzweck wurden? Woran hat man es erkannt?
3. **Singleton:** Gibt es für dich noch einen legitimen Einsatz außerhalb eines DI-Containers?
4. **Visitor gegen Pattern Matching:** Würdest du in Java 21 noch einen klassischen Visitor schreiben? Wann?
5. **Lambda als Strategy:** Wo ist eine benannte Strategy-Klasse trotzdem besser als eine Lambda, etwa für Lesbarkeit, Tests oder Konfiguration?
6. **Decorator und Ousterhout:** Ist ein Decorator ein flaches Modul, oder ist die Flexibilität den Preis wert? Wie ist es bei Spring-Annotationen, die unsichtbare Proxies erzeugen?
7. **Vokabular oder Bauplan:** Ist das Buch heute vor allem ein Wörterbuch, oder noch ein Bauplan?
8. **Was fehlt im Katalog?** Welche Patterns aus deiner Praxis sind seit 1994 dazugekommen und würden in eine Neuauflage gehören, etwa Dependency Injection, Repository, Circuit Breaker oder Event Sourcing?
