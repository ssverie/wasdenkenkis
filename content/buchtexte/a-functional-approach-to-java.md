+++
title = "A Functional Approach to Java – Zusammenfassung und Einordnung"
description = "Ben Weidig, A Functional Approach to Java: Augmenting Object-Oriented Java Code with Functional Principles (2023)"
date = 2026-10-29T15:26:58+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["a-functional-approach-to-java-2023"]
+++

## Einleitung

Die Kernthese steckt im Untertitel: Funktionale Prinzipien sollen objektorientierten Java-Code **ergänzen**, nicht ersetzen. Weidig will keinen „rein funktionalen“ Stil, sondern zeigt, wo und warum Unveränderlichkeit, reine Funktionen, Streams, Optionals und Lazy Evaluation den Alltag einfacher machen.

### Autor und Kontext

Ben Weidig ist Autodidakt mit fast zwei Jahrzehnten Berufserfahrung in Web-, Mobil- und Systemprogrammierung. Nach Jahren in einer Organisation für klinische Studien wurde er selbstständig und leitet heute mit anderen eine Java-basierte SaaS-Firma. Er schreibt also nicht als Forscher oder Sprachdesigner wie Bloch, sondern als Praktiker aus der Anwendungsentwicklung.

Das Buch erschien im Mai 2023 bei O'Reilly, also nach Java 17 und mit Blick auf die damals kommenden Versionen. Es berücksichtigt Records und Record Patterns und gehört damit zu den wenigen FP-Büchern für Java, die nach diesen Neuerungen geschrieben wurden. Die Online-Ausgabe wird teils aktualisiert, etwa um einen Abschnitt zu Stream Gatherers.

### Aufbau

| Teil | Kapitel | Inhalt |
|---|---|---|
| I. Funktionale Grundlagen | 1–3 | FP-Begriffe, Lambdas, funktionale Interfaces des JDK |
| II. Ein funktionaler Ansatz | 4–15 | Unveränderlichkeit, Records, Streams, Parallelität, Optionals, Fehlerbehandlung, Lazy Evaluation, Rekursion, asynchrone Aufgaben, funktionale Entwurfsmuster, Fazit |

Jedes Kapitel endet mit **Takeaways**, kurzen Merksätzen. Die Kapitel des zweiten Teils lassen sich weitgehend unabhängig lesen.

### Grundhaltung

Weidig begründet funktionales Denken mit veränderter Hardware: Mehrkernprozessoren und verteilte Systeme machen geteilten veränderlichen Zustand teuer und gefährlich. Java sei keine funktionale Sprache, könne aber funktional **genutzt** werden, und das nicht als Entweder-oder, sondern als Kombination.

Der Ton ist ruhig und pragmatisch. Fast jedes Kapitel enthält einen Abschnitt zu Grenzen und Fallstricken. Im Vergleich zu theoretischeren Büchern wie Saumonts *Functional Programming in Java* verzichtet Weidig weitgehend auf eigene funktionale Datenstrukturen und Bibliotheken und arbeitet mit dem, was das JDK bietet.

## Funktionale Grundbegriffe (Kapitel 1)

Das erste Kapitel erklärt, was funktionale Programmierung ausmacht, ohne Java-Bezug. Der Kern: Programme werden aus **Ausdrücken** und **Funktionen** zusammengesetzt, nicht aus Anweisungen, die Zustand verändern.

### Die zentralen Konzepte

| Konzept | Bedeutung |
|---|---|
| Reine Funktionen | Gleiche Eingabe liefert immer gleiche Ausgabe, und es gibt keine Seiteneffekte. |
| Referenzielle Transparenz | Ein Ausdruck lässt sich durch sein Ergebnis ersetzen, ohne dass sich das Programm ändert. |
| Unveränderlichkeit | Daten werden nicht verändert, sondern neue Werte erzeugt. |
| Rekursion | Wiederholung durch Selbstaufruf statt Schleifen mit veränderlichem Zähler |
| Funktionen erster Klasse | Funktionen sind Werte, die man speichern, übergeben und zurückgeben kann. |
| Funktionen höherer Ordnung | Funktionen, die Funktionen annehmen oder liefern, etwa `map` oder `filter` |
| Komposition | Kleine Funktionen zu größeren verketten |
| Currying | Eine Funktion mit mehreren Argumenten in eine Folge von Funktionen mit je einem Argument umwandeln |
| Partielle Anwendung | Eine neue Funktion erzeugen, indem man nur einen Teil der Argumente festlegt |
| Lazy Evaluation | Ausdrücke erst auswerten, wenn ihr Ergebnis tatsächlich gebraucht wird |

```java
// unrein: hängt von Zustand außerhalb ab und verändert ihn
private int counter = 0;
int nextId() { return ++counter; }

// rein: gleiche Eingabe, gleiches Ergebnis, keine Seiteneffekte
static Money withTax(Money net, TaxRate rate) { return net.times(rate.factor()); }
```

### Vorteile

Weidig nennt Einfachheit, Konsistenz, mathematische Korrektheit, sicherere Nebenläufigkeit, Modularität und Testbarkeit. Reine Funktionen lassen sich ohne Aufbau von Zustand oder Mocks testen: Man ruft sie auf und prüft das Ergebnis.

### Nachteile

Ehrlich benennt er auch die Kosten:

- **Lernkurve:** Für OO-geprägte Entwickler ungewohnt.
- **Höhere Abstraktion:** Funktionale Ketten können schwer zu lesen und zu debuggen sein.
- **Umgang mit Zustand:** Echte Programme brauchen Zustand und Seiteneffekte, etwa Datenbanken oder Benutzereingaben. Die müssen irgendwo leben.
- **Performance:** Unveränderliche Daten bedeuten mehr Objekte und mehr Kopien.
- **Rekursion:** In Java ohne Tail-Call-Optimierung begrenzt.

Die zentrale Strategie, die sich durch das Buch zieht: einen möglichst großen **reinen Kern** und eine dünne Schale für Seiteneffekte. Dieses Muster ist auch unter dem Namen „Functional Core, Imperative Shell“ bekannt und passt zu McConnells Barrikaden und zu Hexagonal Architecture.

## Funktionales Java (Kapitel 2)

Java hat keine Funktionstypen. Lambdas sind syntaktischer Zucker für die Implementierung eines **funktionalen Interfaces**, also eines Interfaces mit genau einer abstrakten Methode.

### Was Weidig an Lambdas betont

- **Effektiv final:** Lambdas dürfen lokale Variablen nur lesen, wenn diese nach der Zuweisung nicht mehr geändert werden. Das ist eine eingebaute Bremse gegen versteckte Seiteneffekte.
- `this`** in Lambdas** bezieht sich auf die umgebende Klasse, nicht auf das Lambda selbst, anders als bei anonymen Klassen.
- **Lambdas sind keine Objekte im üblichen Sinn:** Die JVM erzeugt sie per `invokedynamic`, und ihre Identität ist nicht garantiert.

### Methodenreferenzen

| Art | Beispiel | entspricht |
|---|---|---|
| Statische Methode | `Integer::parseInt` | `s -> Integer.parseInt(s)` |
| Gebundene Instanzmethode | `log::info` | `msg -> log.info(msg)` |
| Ungebundene Instanzmethode | `String::toUpperCase` | `s -> s.toUpperCase()` |
| Konstruktor | `ArrayList::new` | `() -> new ArrayList<>()` |

### Funktionale Konzepte in Java

Weidig geht die Begriffe aus Kapitel 1 durch und zeigt, wie weit Java sie unterstützt. Reine Funktionen und Unveränderlichkeit sind möglich, aber nicht erzwungen. Funktionen sind über Interfaces „erster Klasse“. Komposition gibt es über Default-Methoden. Currying ist umständlich, weil Java keine automatische partielle Anwendung kennt.

```java
// Currying in Java: möglich, aber geschwätzig
Function<Integer, Function<Integer, Integer>> add = a -> b -> a + b;
Function<Integer, Integer> addTen = add.apply(10);   // partielle Anwendung
addTen.apply(5);                                      // 15
```

## Die funktionalen Interfaces des JDK (Kapitel 3)

`java.util.function` enthält über 40 Interfaces. Weidig ordnet sie in **vier Grundkategorien**:

| Kategorie | Signatur | Zweck |
|---|---|---|
| `Function<T, R>` | `T → R` | umwandeln |
| `Consumer<T>` | `T → void` | verbrauchen, Seiteneffekt |
| `Supplier<T>` | `() → T` | liefern, oft verzögert |
| `Predicate<T>` | `T → boolean` | prüfen |

Alle anderen sind Varianten davon: mit zwei Argumenten (`BiFunction`, `BiConsumer`), mit gleichem Ein- und Ausgabetyp (`UnaryOperator`, `BinaryOperator`) oder für primitive Typen (`IntFunction`, `ToLongFunction`, `IntPredicate`), um Autoboxing zu vermeiden.

### Komposition

```java
Function<String, String> trim = String::strip;
Function<String, String> upper = String::toUpperCase;
Function<String, String> normalize = trim.andThen(upper);   // erst trim, dann upper

Predicate<Order> isLarge   = o -> o.total().isGreaterThan(Money.of(1000));
Predicate<Order> isPremium = o -> o.customer().isPremium();
Predicate<Order> needsReview = isLarge.and(isPremium.negate());
```

### Eigene Erweiterungen

Wo das JDK nicht reicht, empfiehlt Weidig drei Wege: eigene funktionale Interfaces mit `@FunctionalInterface`, zusätzliche Default-Methoden für Komposition und statische Hilfsmethoden, etwa für Interfaces mit drei Argumenten, die das JDK nicht hat. Das ist dieselbe Abwägung wie in Blochs Item 44: Standardinterfaces zuerst, eigene nur bei klarem Zusatznutzen.

## Unveränderlichkeit (Kapitel 4)

Unveränderliche Daten sind das Fundament funktionalen Denkens. Weidig zeigt, wie viel davon Java schon mitbringt und wo die Fallen liegen.

### Warum Veränderlichkeit Probleme macht

In OO-Code ist veränderlicher Zustand der Normalfall: Getter und Setter, Collections, die man herausgibt und die andere ändern können. Das Problem ist nicht die Änderung selbst, sondern dass man nie sicher weiß, **wer** ein Objekt **wann** ändert. Das macht Code schwer nachvollziehbar und Nebenläufigkeit gefährlich.

### Was Java bereits unveränderlich macht

| Typ | Hinweis |
|---|---|
| `String` | unveränderlich seit Java 1.0 |
| Wrapper wie `Integer`, `Long` | unveränderlich |
| `BigInteger`, `BigDecimal` | „unveränderliche Mathematik“: jede Operation liefert ein neues Objekt |
| `java.time` | `LocalDate`, `Instant` usw. sind unveränderlich, anders als das alte `Date` |
| Enums | Konstanten sind unveränderlich, ihre Felder sollten es auch sein |
| Records | flach unveränderlich |
| `List.of`, `Map.of`, `List.copyOf` | unveränderliche Collections |

### Die Fallen

`final`** ist nicht unveränderlich.** `final` verhindert nur, dass die Referenz neu zugewiesen wird. Das Objekt dahinter bleibt veränderlich.

```java
final List<String> names = new ArrayList<>();
names.add("Sven");          // erlaubt: final schützt nur die Referenz
```

**Unmodifiable ist nicht immutable.** `Collections.unmodifiableList` liefert nur eine Sicht, die Schreibzugriffe verbietet. Ändert jemand die zugrunde liegende Liste, sieht man die Änderung.

```java
var source = new ArrayList<>(List.of("a", "b"));
var view   = Collections.unmodifiableList(source);
var copy   = List.copyOf(source);

source.add("c");
view.size();   // 3: die Sicht zeigt die Änderung
copy.size();   // 2: die Kopie ist unabhängig
```

**Unveränderlich ist meist flach.** Eine unveränderliche Liste aus veränderlichen Objekten schützt die Objekte nicht. Echte Unveränderlichkeit braucht unveränderliche Elemente.

### Wie man Unveränderlichkeit erreicht

- Felder `private final`, keine Setter
- Veränderliche Eingaben im Konstruktor kopieren, veränderliche Ausgaben als Kopie oder Sicht herausgeben
- Klasse `final` oder Konstruktor privat mit Fabrikmethode
- Für Änderungen neue Objekte liefern, sogenannte **Wither**-Methoden wie `withPrice(…)`
- Wo möglich Records verwenden

### Einordnung

Das Kapitel ist im Kern Blochs Item 17 aus funktionaler Perspektive, ergänzt um die Fallen bei Collections, die viele Entwickler unterschätzen. Neu gegenüber Bloch ist die klare Unterscheidung zwischen unmodifiable und immutable und der Fokus auf flache gegenüber tiefer Unveränderlichkeit.

## Records (Kapitel 5)

Records sind für Weidig das wichtigste funktionale Sprachmittel seit Lambdas: unveränderliche, transparente Datenträger mit wenig Code.

### Tupel gegen nominale Typen

Funktionale Sprachen nutzen oft **Tupel**, also namenlose Gruppen von Werten wie `(String, Integer)`. Java hat keine Tupel, und Weidig sieht das als Vorteil: Records sind **nominale Tupel**, sie haben einen Typnamen und benannte Komponenten. `record Point(int x, int y)` ist lesbarer als ein `Pair<Integer, Integer>`, ganz im Sinne von Ousterhouts Kritik an generischen Containern.

### Vom POJO zum Record

Weidig zeigt den Weg Schritt für Schritt: ein klassisches veränderliches POJO, dann ein unveränderliches mit `final`-Feldern, `equals`, `hashCode` und `toString`, und schließlich der Record, der all das in einer Zeile ausdrückt.

### Was ein Record ist

- eine `final`-Klasse, die von `java.lang.Record` erbt
- private finale Felder für jede Komponente
- Zugriffsmethoden mit dem Namen der Komponente, ohne `get`-Präfix
- kanonischer Konstruktor, `equals`, `hashCode`, `toString` automatisch
- erlaubt: Generics, Annotationen, Interfaces, statische Felder und Methoden, eigene Methoden, lokale Records innerhalb einer Methode

### Was Records fehlt

- **Keine Vererbung** von anderen Klassen, keine Unterklassen
- **Keine Standardwerte** und keine benannten Argumente
- **Keine eingebauten Wither** für veränderte Kopien. Eine Sprachunterstützung dafür ist als Vorschlag in Arbeit, bis dahin schreibt man sie selbst.

### Praxismuster

**Validierung und Bereinigung im kompakten Konstruktor:**

```java
public record Email(String value) {
    public Email {
        Objects.requireNonNull(value, "value");
        value = value.strip().toLowerCase(Locale.ROOT);   // Bereinigung
        if (!value.contains("@")) throw new IllegalArgumentException("Keine E-Mail: " + value);
    }
}
```

**Unveränderlichkeit verstärken:** Records sind nur flach unveränderlich. Collections im kompakten Konstruktor kopieren:

```java
public record Order(OrderId id, List<OrderLine> lines) {
    public Order { lines = List.copyOf(lines); }
}
```

**Veränderte Kopien** mit Withern oder einem kleinen Builder:

```java
public record Product(String sku, String name, Money price) {
    public Product withPrice(Money newPrice) { return new Product(sku, name, newPrice); }
}
```

**Lokale Records als benannte Zwischenergebnisse in Streams:**

```java
record Revenue(String region, BigDecimal total) {}

var top = orders.stream()
    .collect(groupingBy(Order::region, reducing(BigDecimal.ZERO, Order::total, BigDecimal::add)))
    .entrySet().stream()
    .map(e -> new Revenue(e.getKey(), e.getValue()))
    .max(Comparator.comparing(Revenue::total));
```

**Optionale Werte:** Weidig zeigt zwei Muster: im kompakten Konstruktor sicherstellen, dass ein optionaler Container selbst nie `null` ist, und Komfortkonstruktoren für häufige Fälle anbieten, damit Aufrufer nicht ständig `Optional.empty()` übergeben müssen.

**Record Patterns** (Java 21): Records lassen sich direkt zerlegen.

```java
if (shape instanceof Rectangle(var w, var h)) { area = w * h; }
```

### Einordnung

Das Kapitel ist eine sehr gute praktische Ergänzung zu Blochs Items 10 bis 17 und zu Evans' Value Objects. Records sind die Stelle, an der sich funktionales Denken, DDD und Effective Java in einem einzigen Sprachmittel treffen.

## Streams (Kapitel 6–8)

Drei Kapitel, der größte Block des Buchs. Weidig behandelt Streams nicht nur als Syntax, sondern erklärt, wie sie intern funktionieren, was sie kosten und wann man sie lieber nicht nutzt.

### Externe gegen interne Iteration

Bei einer Schleife steuert der Aufrufer jeden Schritt, die **externe Iteration**. Bei einem Stream beschreibt man, *was* geschehen soll, und der Stream entscheidet, *wie*, die **interne Iteration**. Das ermöglicht Optimierungen wie Lazy Evaluation, Kurzschluss und Parallelisierung.

### Eigenschaften von Streams

| Eigenschaft | Bedeutung |
|---|---|
| Lazy | Zwischenoperationen laufen erst, wenn eine Terminaloperation sie anfordert. |
| Weitgehend zustandslos | Operationen sollen die Quelle nicht verändern. |
| Nicht wiederverwendbar | Ein Stream lässt sich nur einmal durchlaufen. |
| Primitive Varianten | `IntStream`, `LongStream`, `DoubleStream` vermeiden Autoboxing. |
| Einfach parallelisierbar | `.parallel()` genügt, ob es sich lohnt, ist eine andere Frage. |
| Schwache Fehlerbehandlung | Checked Exceptions passen nicht in die Standard-Funktionsinterfaces. |

Unter der Haube steht der **Spliterator**, der eine Quelle durchläuft und für Parallelisierung teilt.

### Die Kosten der Reihenfolge

```java
// teuer: erst alle umwandeln, dann sortieren, dann filtern
list.stream().map(this::enrich).sorted().filter(Item::isActive).toList();

// günstiger: früh filtern, teure Operationen auf wenige Elemente
list.stream().filter(Item::isActive).map(this::enrich).sorted().toList();
```

`sorted()` und `distinct()` sind **zustandsbehaftet** und müssen alle Elemente sehen, bevor sie weitergeben. Sie gehören möglichst spät in die Kette.

### Stream oder Schleife?

Weidigs Abwägung ähnelt Blochs Item 45: Streams für Transformation, Filterung und Aggregation von Sammlungen. Schleifen, wenn man vorzeitig abbrechen, mehrere Zustände pflegen oder Checked Exceptions werfen muss, oder wenn die Kette unlesbar würde. Er empfiehlt, Performance mit **JMH** zu messen, statt sie zu vermuten.

### Weitere Werkzeuge

- **Unendliche Streams** mit `Stream.iterate` und `Stream.generate`, begrenzt durch `limit` oder `takeWhile`
- **Streams aus Dateien** mit `Files.lines`, immer in try-with-resources
- **Collectors:** `groupingBy` mit nachgeschalteten Collectors, `partitioningBy`, `teeing` für zwei Ergebnisse in einem Durchlauf
- **Stream Gatherers** (final seit Java 24) für eigene Zwischenoperationen

```java
// teeing: Minimum und Maximum in einem Durchlauf
var range = prices.stream().collect(Collectors.teeing(
    Collectors.minBy(Comparator.naturalOrder()),
    Collectors.maxBy(Comparator.naturalOrder()),
    (min, max) -> new PriceRange(min.orElseThrow(), max.orElseThrow())));

// Gatherer: gleitendes Fenster über Messwerte
var averages = readings.stream()
    .gather(Gatherers.windowSliding(5))
    .map(w -> w.stream().mapToDouble(Reading::value).average().orElseThrow())
    .toList();
```

### Parallele Streams

Weidig unterscheidet Nebenläufigkeit und Parallelität und zeigt, dass `.parallel()` kein automatischer Gewinn ist. Parallele Streams nutzen den gemeinsamen ForkJoinPool. Sie lohnen sich, wenn:

- die Datenmenge groß ist oder die Arbeit pro Element teuer,
- die Quelle sich gut teilen lässt, etwa `ArrayList` oder Arrays, schlecht dagegen `LinkedList` oder `Stream.iterate`,
- die Operationen zustandslos und unabhängig sind,
- die Reihenfolge keine Rolle spielt oder billig zu erhalten ist,
- und eine Messung den Gewinn bestätigt.

Eine verbreitete Faustregel aus dem JDK-Umfeld: Die Anzahl der Elemente mal die Kosten pro Element sollte groß sein, sonst überwiegt der Verwaltungsaufwand.

## Optionals (Kapitel 9)

`Optional` ist Javas Antwort auf das Problem, dass jeder Referenztyp `null` sein kann. Weidig zeigt zuerst, wie man `null` ohne `Optional` beherrscht, und dann, wofür `Optional` gut ist und wofür nicht.

### null ohne Optional

- Variablen nicht mit `null` initialisieren, wenn es sich vermeiden lässt
- Keine `null` aus Methoden zurückgeben, vor allem nicht für Collections
- Parameter mit `Objects.requireNonNull` prüfen
- **Annotationen** wie `@Nullable` und `@NonNull` nutzen und von Werkzeugen prüfen lassen, etwa NullAway, dem Checker Framework oder der IDE. Neuere Bemühungen wie JSpecify vereinheitlichen diese Annotationen.

### Optional-Pipelines

Der eigentliche Wert von `Optional` liegt nicht in `isPresent()` und `get()`, sondern in **Pipelines**:

```java
// imperativ mit null-Prüfungen
String city = null;
Customer c = repo.find(id);
if (c != null && c.address() != null) city = c.address().city();
if (city == null) city = "unbekannt";

// Optional-Pipeline
String city = repo.findById(id)               // Optional<Customer>
    .map(Customer::address)                   // Optional<Address>
    .map(Address::city)
    .orElse("unbekannt");
```

| Methode | Zweck |
|---|---|
| `map`, `flatMap`, `filter` | umwandeln, verketten, einschränken |
| `or` | auf ein anderes `Optional` ausweichen |
| `orElse` | Standardwert, wird **immer** ausgewertet |
| `orElseGet` | Standardwert über `Supplier`, nur bei Bedarf ausgewertet |
| `orElseThrow` | Ausnahme, wenn leer |
| `ifPresentOrElse` | Seiteneffekt in beiden Fällen |
| `stream` | als Stream mit null oder einem Element |

Der Unterschied zwischen `orElse` und `orElseGet` ist eine klassische Falle: `orElse(loadDefault())` ruft `loadDefault()` auch dann auf, wenn ein Wert da ist.

### Optionals und Streams

```java
// nur vorhandene Werte weiterreichen
List<Address> addresses = customers.stream()
    .map(Customer::primaryAddress)   // Stream<Optional<Address>>
    .flatMap(Optional::stream)       // Stream<Address>
    .toList();
```

Viele Terminaloperationen wie `findFirst`, `max` oder `reduce` ohne Startwert liefern selbst ein `Optional`.

### Die Grenzen

Weidig deckt sich weitgehend mit Blochs Item 55:

- **Optionals sind gewöhnliche Objekte.** Eine Variable vom Typ `Optional` kann selbst `null` sein, das Typsystem schützt nicht davor.
- **Nicht als Feld, Parameter oder Collection-Element**, sondern als Rückgabewert, wenn ein Ergebnis fehlen kann.
- **Keine **`Optional<List<…>>`, sondern eine leere Liste.
- **Nicht identitätsbasiert vergleichen**, kein `==` und keine Synchronisation auf Optionals.
- **Primitive Varianten** wie `OptionalInt` haben weniger Methoden, etwa kein `map`.
- **Leistung:** Jedes `Optional` ist ein zusätzliches Objekt. In heißen Schleifen kann das zählen.

### Einordnung

Das Kapitel ist eine der besten Darstellungen des Themas. Es schließt an Clean Codes „kein null zurückgeben“ und Blochs Items 54 und 55 an und ergänzt die Werkzeugseite. Mit Projekten wie Valhalla, das Werttypen bringen soll, und einer möglichen Null-Markierung im Typsystem dürfte sich das Thema in künftigen Java-Versionen weiter verschieben.

## Funktionale Fehlerbehandlung (Kapitel 10)

Exceptions sind das Gegenteil eines funktionalen Konzepts: Sie unterbrechen den Kontrollfluss und sind Seiteneffekte. Dazu passen Checked Exceptions nicht in die Standard-Funktionsinterfaces. Weidig zeigt, wie man damit umgeht.

### Das Problem mit Lambdas

```java
// kompiliert nicht: Files.readString wirft IOException
paths.stream().map(Files::readString).toList();
```

### Drei pragmatische Auswege

| Ansatz | Idee | Preis |
|---|---|---|
| Sichere Methode extrahieren | Den riskanten Aufruf in eine eigene Methode mit `try/catch` packen | Der Fehler muss dort sinnvoll behandelt werden |
| Exception einwickeln | Checked Exception in `UncheckedIOException` oder eine eigene Runtime Exception packen | Fehlerart wird verschleiert |
| „Un-checking“ | Ein eigenes Funktionsinterface, das Exceptions erlaubt, plus Adapter | Mehr Infrastruktur, teils trickreich |

```java
@FunctionalInterface
interface ThrowingFunction<T, R> {
    R apply(T t) throws Exception;

    static <T, R> Function<T, R> unchecked(ThrowingFunction<T, R> f) {
        return t -> {
            try { return f.apply(t); }
            catch (RuntimeException e) { throw e; }
            catch (Exception e) { throw new RuntimeException(e); }
        };
    }
}

var contents = paths.stream().map(ThrowingFunction.unchecked(Files::readString)).toList();
```

### Ein funktionaler Ansatz

In funktionalen Sprachen werden Fehler oft nicht geworfen, sondern **als Werte** zurückgegeben. Weidig zeigt drei Stufen:

1. **Nicht werfen:** Ein `Optional` statt einer Exception, wenn der Grund des Fehlers unwichtig ist.
2. **Fehler als Werte:** Ein eigener Ergebnistyp, der entweder einen Wert oder einen Fehler enthält.
3. **Das Try/Success/Failure-Muster:** aus Scala bekannt, in Java selbst nachzubauen oder aus Bibliotheken wie Vavr zu übernehmen.

Mit sealed Types und Records lässt sich ein solcher Typ heute kompakt schreiben:

```java
sealed interface Result<T> permits Success, Failure {
    static <T> Result<T> of(Callable<T> action) {
        try { return new Success<>(action.call()); }
        catch (Exception e) { return new Failure<>(e); }
    }
    default <R> Result<R> map(Function<T, R> f) {
        return switch (this) {
            case Success<T> s -> Result.of(() -> f.apply(s.value()));
            case Failure<T> fail -> new Failure<>(fail.error());
        };
    }
}
record Success<T>(T value) implements Result<T> {}
record Failure<T>(Exception error) implements Result<T> {}

// Nutzung
var results = paths.stream()
    .map(p -> Result.of(() -> Files.readString(p)))
    .toList();
```

Der Vorteil: Fehler werden im Typ sichtbar, der Aufrufer muss sie behandeln, und eine Pipeline bricht nicht beim ersten Fehler ab.

### Weidigs Fazit

Er empfiehlt keinen radikalen Wechsel. Exceptions bleiben in Java der Standard, und Code, der dagegen arbeitet, ist für andere Java-Entwickler ungewohnt. Funktionale Fehlerwerte lohnen sich vor allem in Pipelines, bei Stapelverarbeitung, in der einzelne Fehler den Rest nicht stoppen sollen, und an Stellen, an denen Fehler erwartbar sind und gezielt behandelt werden müssen.

### Einordnung

Hier treffen drei Positionen aufeinander: Feathers in Clean Code gegen Checked Exceptions, Bloch für sie bei behebbaren Fehlern, und Weidig mit einer dritten Option, Fehler als Werte. Rust und Go haben genau diesen Weg als Standard gewählt, Java bisher nicht.

## Lazy Evaluation (Kapitel 11)

Lazy Evaluation trennt, **wie** ein Ausdruck erzeugt wird, von **wann** er ausgewertet wird. Java ist grundsätzlich **strikt**: Argumente werden ausgewertet, bevor eine Methode aufgerufen wird. Aber es gibt Ausnahmen, und Lambdas machen mehr davon möglich.

### Wo Java schon lazy ist

- **Kurzschlussoperatoren** `&&`, `||` und der ternäre Operator werten den zweiten Teil nur bei Bedarf aus.
- **Kontrollstrukturen** wie `if` und Schleifen führen nur den gewählten Zweig aus.
- **Lazy Typen im JDK:** Streams, `Optional.orElseGet`, `Map.computeIfAbsent`, `Supplier`, Logging-APIs, die eine `Supplier<String>`-Nachricht annehmen.

### Eifrig gegen faul

```java
// eifrig: buildDiagnostics() läuft immer, auch wenn DEBUG aus ist
log.debug(buildDiagnostics());

// faul: nur bei aktivem Level
log.debug(() -> buildDiagnostics());

// eifrig: der Standardwert wird immer berechnet
config.get(key).orElse(loadDefaultFromDisk());

// faul
config.get(key).orElseGet(this::loadDefaultFromDisk);
```

### Thunks und Memoisierung

Ein **Thunk** ist ein verzögerter Wert, der beim ersten Zugriff berechnet und dann zwischengespeichert wird. Java hat keinen eingebauten Typ dafür, er ist aber schnell gebaut:

```java
final class Lazy<T> implements Supplier<T> {
    private Supplier<T> source;
    private T value;
    private boolean done;

    Lazy(Supplier<T> source) { this.source = source; }

    public synchronized T get() {
        if (!done) { value = source.get(); done = true; source = null; }
        return value;
    }
}

var report = new Lazy<>(() -> expensiveReport());   // noch nichts berechnet
```

Für die Zukunft sind mit **Stable Values** bzw. Lazy Constants Sprachmittel für genau diesen Zweck in Arbeit.

## Rekursion (Kapitel 12)

Rekursion ist in funktionalen Sprachen die Standardform der Wiederholung. In Java ist sie möglich, hat aber eine harte Grenze.

### Kopf- und Endrekursion

- **Kopfrekursion:** Der rekursive Aufruf ist nicht die letzte Operation, das Ergebnis wird danach noch verarbeitet.
- **Endrekursion:** Der rekursive Aufruf ist die letzte Operation. Funktionale Sprachen optimieren das zu einer Schleife, sogenannte **Tail-Call-Optimierung**.

**Java hat keine Tail-Call-Optimierung.** Jeder rekursive Aufruf belegt einen Stack-Frame, und tiefe Rekursion endet mit `StackOverflowError`.

```java
// Endrekursion, aber in Java trotzdem stackbegrenzt
static long factorial(long n, long acc) {
    return n <= 1 ? acc : factorial(n - 1, n * acc);
}

// iterative Alternative ohne Stack-Risiko
static long factorial(long n) {
    return LongStream.rangeClosed(1, n).reduce(1, (a, b) -> a * b);
}
```

### Wann Rekursion sinnvoll ist

Weidig empfiehlt Rekursion dort, wo die Datenstruktur selbst rekursiv ist: Bäume, verschachtelte Strukturen, Teile-und-herrsche-Algorithmen. Für lineare Wiederholung sind Schleifen oder Streams in Java besser. Mit sealed Types, Records und Pattern Matching lassen sich rekursive Datenstrukturen heute sehr übersichtlich verarbeiten:

```java
sealed interface Node permits Leaf, Branch {}
record Leaf(int value) implements Node {}
record Branch(Node left, Node right) implements Node {}

static int sum(Node n) {
    return switch (n) {
        case Leaf(int v) -> v;
        case Branch(Node l, Node r) -> sum(l) + sum(r);
    };
}
```

**Memoisierung** hilft bei Rekursionen, die dieselben Teilprobleme mehrfach berechnen, etwa mit `Map.computeIfAbsent` als Cache. Bei rekursiven Aufrufen ist dabei Vorsicht geboten, weil `HashMap.computeIfAbsent` keine Änderung der Map während der Berechnung erlaubt.

## Asynchrone Aufgaben (Kapitel 13)

Asynchrone Programmierung passt gut zu funktionalem Denken: Man beschreibt eine **Pipeline von Schritten**, die erst ausgeführt werden, wenn ihre Eingaben bereitstehen. Weidigs Werkzeug dafür ist `CompletableFuture`.

### Von Future zu CompletableFuture

Das alte `Future` aus Java 5 kann man nur abfragen oder blockierend auf das Ergebnis warten. Es lässt sich nicht verketten, nicht kombinieren und nicht von außen vervollständigen. `CompletableFuture` aus Java 8 löst das und ist im Kern eine asynchrone Version der Optional- und Stream-Pipelines.

### Pipelines bauen

| Methode | Zweck | Gegenstück bei Streams oder Optional |
|---|---|---|
| `supplyAsync`, `runAsync` | Aufgabe starten | Quelle |
| `thenApply` | Ergebnis umwandeln | `map` |
| `thenCompose` | nächsten asynchronen Schritt anhängen | `flatMap` |
| `thenCombine` | zwei unabhängige Ergebnisse zusammenführen | `zip` in anderen Sprachen |
| `thenAccept`, `thenRun` | Seiteneffekt am Ende | `forEach` |
| `allOf`, `anyOf` | auf mehrere warten | – |

```java
CompletableFuture<Offer> offer = CompletableFuture
    .supplyAsync(() -> catalog.find(sku), io)                    // Produkt laden
    .thenCompose(p -> CompletableFuture.supplyAsync(() -> pricing.quote(p), io))
    .thenCombine(CompletableFuture.supplyAsync(() -> stock.check(sku), io), Offer::new)
    .orTimeout(2, TimeUnit.SECONDS);
```

### Fehlerbehandlung

- `exceptionally`: bei Fehler einen Ersatzwert liefern
- `handle`: Ergebnis oder Fehler in jedem Fall verarbeiten
- `whenComplete`: Seiteneffekt nach Abschluss, ohne das Ergebnis zu ändern

Ein Fehler in einem Schritt überspringt die folgenden Umwandlungen, bis ein Fehlerbehandler erreicht ist, ähnlich wie bei einem `Result`-Typ.

### Thread-Pools

Ohne eigenen Executor laufen Aufgaben im gemeinsamen ForkJoinPool, den auch parallele Streams nutzen. Für blockierende Ein- und Ausgabe empfiehlt Weidig einen eigenen Executor, damit rechenintensive Aufgaben nicht blockiert werden. Er warnt vor zu vielen verschachtelten asynchronen Aufrufen, die schwer zu lesen und zu debuggen sind.

### Einordnung aus heutiger Sicht

Seit dem Erscheinen des Buchs hat Java mit **Virtual Threads** (Java 21) einen anderen Weg eröffnet: Man schreibt wieder einfachen, blockierenden Code, und die JVM sorgt dafür, dass blockierte Threads billig sind. Für viele Anwendungsfälle, vor allem Ein- und Ausgabe, ist das lesbarer als lange `CompletableFuture`-Ketten. **Structured Concurrency**, noch in Vorschau, ergänzt das um klare Lebenszyklen für parallele Teilaufgaben.

```java
// mit Virtual Threads: sequenziell lesbar, trotzdem parallel
try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    var price = exec.submit(() -> pricing.quote(sku));
    var stockF = exec.submit(() -> stock.check(sku));
    return new Offer(price.get(), stockF.get());
}
```

`CompletableFuture` bleibt wichtig für reaktive und ereignisgesteuerte Systeme und dort, wo man echte Pipelines mit Transformationen beschreibt. Für einfaches „mehrere Dinge gleichzeitig holen“ sind Virtual Threads heute meist die einfachere Wahl.

## Funktionale Entwurfsmuster (Kapitel 14)

Weidig greift mehrere GoF-Patterns auf und zeigt, wie sie mit Lambdas und funktionalen Interfaces einfacher werden. Das ist praktisch die Java-Umsetzung von Norvigs These, dass viele Patterns Sprachkrücken sind.

### Factory

```java
// klassisch: switch in einer Factory-Methode
// funktional: Konstruktorreferenzen in einer Map
private static final Map<ShapeType, Function<Double, Shape>> FACTORIES = Map.of(
    ShapeType.CIRCLE, Circle::new,
    ShapeType.SQUARE, Square::new);

Shape create(ShapeType type, double size) {
    return FACTORIES.get(type).apply(size);
}
```

Mit einem Enum, das seine Fabrik als Feld trägt, wird daraus eine typsichere Variante ohne Map.

### Decorator

Statt einer Klassenhierarchie aus Hüllen wird das Verhalten als **Funktionskomposition** zusammengesetzt:

```java
Function<Request, Response> handler = this::handle;
Function<Request, Response> decorated = withLogging(withRetry(withAuth(handler)));

static Function<Request, Response> withLogging(Function<Request, Response> next) {
    return req -> { log.info("→ {}", req.path()); return next.apply(req); };
}
```

### Strategy

Die Strategie wird zur Lambda oder Methodenreferenz. Eigene Klassen braucht man nur noch, wenn eine Strategie Zustand, mehrere Methoden oder einen eigenen Namen in der Fachsprache verdient.

### Builder

Weidig zeigt eine funktionale Variante, bei der Konfiguration über `Consumer` angewendet wird:

```java
var request = HttpRequestSpec.create(spec -> {
    spec.method("POST");
    spec.uri("/orders");
    spec.header("Accept", "application/json");
});
```

Das ermöglicht wiederverwendbare Konfigurationsbausteine, die sich mit `andThen` kombinieren lassen.

### Einordnung

Das Kapitel ist die direkte Fortsetzung der Tabelle aus unserer Design-Patterns-Zusammenfassung, nur ausführlicher für einige Patterns. Es zeigt dieselbe Einsicht: Das Konzept bleibt, die Implementierung schrumpft.

## Ein funktionaler Ansatz für Java (Kapitel 15)

Das Schlusskapitel bündelt die Haltung des Buchs.

### OO und FP gemeinsam

Weidig sieht beide Paradigmen als Werkzeuge mit unterschiedlichen Stärken. OO ist gut darin, Zustand, Identität und Verhalten zu kapseln, FP darin, Datenflüsse zu beschreiben und Seiteneffekte zu begrenzen. Das Ziel ist nicht, Java in Haskell zu verwandeln, sondern das jeweils passende Werkzeug zu nutzen.

### Ein funktionales Denkmuster

- **Daten und Verhalten trennen, wo es hilft:** unveränderliche Datenträger plus reine Funktionen darauf
- **Seiteneffekte an den Rand schieben:** reiner Kern, dünne Schale für Ein- und Ausgabe, Datenbank, Netzwerk
- **Ausdrücke statt Anweisungen:** `switch`-Ausdrücke, Pipelines, `Optional`-Ketten
- **Kleine, komponierbare Bausteine**
- **Unveränderlich als Standard**, veränderlich als begründete Ausnahme

### Testbarkeit

Reine Funktionen sind trivial zu testen: Eingabe, Aufruf, Ergebnis prüfen. Kein Setup, keine Mocks. Je größer der reine Kern, desto weniger braucht man aufwändige Testinfrastruktur. Das ist eine direkte Antwort auf die Probleme, die Feathers in Legacy-Code beschreibt.

### Schritt für Schritt

Weidigs Rat für bestehende Codebasen: nicht alles umbauen, sondern bei neuen Klassen und bei Änderungen funktionale Prinzipien einführen, etwa zuerst Records für neue Datenträger, dann Streams und Optionals in neuem Code, dann reine Hilfsfunktionen für Logik. Das entspricht Fowlers und Feathers' Vorgehen in kleinen Schritten.

## Kritik und Einordnung

Das Buch ist kein Klassiker wie die anderen dieser Reihe, sondern ein modernes Praxisbuch. Es ist deshalb weniger an seiner Wirkung zu messen als an der Frage, ob es den heutigen Stand gut erklärt.

### Stärken

- **Pragmatisch:** keine Ideologie, kein „rein funktional“. Weidig nimmt Java so, wie es ist.
- **Aktuell:** Records und Record Patterns sind berücksichtigt, die Online-Ausgabe wird teils um neuere Features ergänzt.
- **Gründlich bei Streams und Optionals:** wie sie intern funktionieren, was sie kosten, wo sie scheitern.
- **Ehrlich über Grenzen:** Fast jedes Kapitel behandelt Nachteile und Fallstricke.
- **Nah am JDK:** keine eigene funktionale Bibliothek, sondern Standardmittel. Was man liest, kann man sofort einsetzen.

### Kritikpunkte

**1. Wenig Neues für erfahrene Java-Entwickler.** Wer Effective Java und *Modern Java in Action* kennt, findet viele Inhalte wieder. Die Stärke liegt eher im Zusammenhang als in neuen Einsichten.

**2. Grundlagenkapitel eher dünn.** Begriffe wie Currying, Funktoren oder Monaden werden angerissen, aber nicht vertieft. Wer funktionale Programmierung wirklich verstehen will, braucht zusätzlich ein Buch zu einer funktionalen Sprache.

**3. Kaum Domänenmodellierung.** Algebraische Datentypen mit sealed Types und Records sind in moderner FP das wichtigste Werkzeug zur Modellierung, kommen hier aber eher am Rand vor. Genau diese Lücke füllt Kiehls *Data-Oriented Programming in Java*.

**4. Asynchronität vor Virtual Threads.** Das Kapitel zu `CompletableFuture` ist gut, aber Virtual Threads haben die Abwägung für viele Fälle verschoben.

**5. Wenig Architektur.** Wie man funktionale Prinzipien in großen Systemen einsetzt, etwa in Schichten, Modulen oder mit Frameworks wie Spring, bleibt weitgehend offen.

### Gesamturteil

Ein sehr gutes Buch, um den funktionalen Werkzeugkasten von Java systematisch zu verstehen und sicher einzusetzen. Für die Reihe bildet es die Brücke zwischen den Klassikern, die Java noch ohne Lambdas und Records kannten, und dem heutigen Java. Zusammen mit Effective Java ergibt es ein ziemlich vollständiges Bild davon, wie man modernes Java schreibt.

Hinweis zur Zusammenfassung: Die Kapitelstruktur habe ich beim Verlag geprüft. Inhaltliche Details und die Java-Beispiele stammen aus meinem Wissen und sind eigene Beispiele, nicht aus dem Buch übernommen.

## Verhältnis zu den anderen Büchern

Weidig liefert die funktionale Lesart vieler Ideen, die in den Klassikern schon angelegt waren, oft ohne dass sie so genannt wurden.

| Idee bei Weidig | Vorläufer in der Reihe |
|---|---|
| Reine Funktionen, keine Seiteneffekte | Martin: keine versteckten Seiteneffekte; Evans: Side-Effect-Free Functions |
| Unveränderlichkeit als Standard | Bloch Item 17; Evans: Value Objects; Fowler: Mutable Data als Smell |
| Records als nominale Tupel | Ousterhout: Kritik an `Pair`; Bloch: Items 10–12 |
| Funktionaler Kern, imperative Schale | McConnell: Barrikaden; Thomas und Hunt: Transformationen |
| Streams statt Schleifen, mit Maß | Fowler: Replace Loop with Pipeline; Bloch Item 45 |
| Optional als Rückgabewert | Clean Code: kein null; Bloch Items 54–55 |
| Fehler als Werte | Ousterhout: Fehler wegdefinieren; Feathers und Bloch zu Checked Exceptions |
| Lazy Evaluation | Bloch Item 83; McConnell: Code-Tuning |
| Patterns als Funktionen | GoF; Norvig; unsere Tabelle zu Java 21 |
| Testbarkeit reiner Funktionen | Feathers: Seams; Thomas und Hunt: Testen ist Design |

### Was neu ist

- **Eine geschlossene Darstellung** des funktionalen Werkzeugkastens von Java, statt verstreuter Items und Kapitel
- **Fehler als Werte** als dritte Option neben Checked und Unchecked Exceptions
- **Interna** von Streams, Spliteratoren und Parallelität
- **Funktionale Fassung der GoF-Patterns** mit Code

## Diskussionsfragen

1. **Funktionaler Kern:** Wie groß ist der reine, seiteneffektfreie Anteil in euren Anwendungen ehrlich geschätzt? Wo könnte er wachsen?
2. **Records überall?** Nutzt ihr Records für alle Datenträger, oder gibt es Gründe, die dagegen sprechen, etwa JPA oder Frameworks?
3. **Result-Typ:** Würdest du in Java einen eigenen `Result`-Typ einführen oder bei Exceptions bleiben? Was würde dein Team dazu sagen?
4. **Streams und Lesbarkeit:** Ab welcher Länge wird eine Stream-Kette für dich schwerer lesbar als eine Schleife?
5. **CompletableFuture oder Virtual Threads:** Wo setzt ihr was ein, und hat Java 21 daran etwas geändert?
6. **Funktionale Patterns:** Welche GoF-Patterns in eurem Code würdest du durch Lambdas ersetzen, und wo würdest du bewusst bei Klassen bleiben?
7. **Java oder eine andere Sprache:** Lohnt sich funktionale Programmierung in Java, oder ist das Argument, für ernsthafte FP gleich Kotlin, Scala oder eine andere JVM-Sprache zu nehmen?
8. **Nächster Schritt:** Wäre Kiehls *Data-Oriented Programming in Java* die richtige Ergänzung, weil es genau die Domänenmodellierung mit sealed Types und Records vertieft?
