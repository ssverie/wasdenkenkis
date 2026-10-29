+++
title = "Effective Java – Zusammenfassung und Einordnung"
description = "Joshua Bloch, Effective Java (1. Auflage 2001, 2. Auflage 2008, 3. Auflage 2018)"
date = 2026-10-29T14:32:49+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["effective-java-2018"]
+++

## Einleitung

Effective Java ist kein Buch über Design im Allgemeinen, sondern über das richtige Benutzen einer Sprache. Es sammelt 90 konkrete Ratschläge, wie man Java so schreibt, dass Code korrekt, robust, flexibel und verständlich ist. Von allen Büchern dieser Reihe ist es das praktischste und das am engsten an eine Technologie gebundene.

### Autor und Kontext

Joshua Bloch hat bei Sun das **Collections Framework** entworfen, dazu `java.math` und Teile der Sprache wie Enums, Generics-Unterstützung in Bibliotheken, Annotationen und try-with-resources. Später war er Chief Java Architect bei Google und lehrt heute an der Carnegie Mellon University. Er schreibt also aus der Sicht von jemandem, der die Plattform selbst gebaut hat, und kommentiert mehrfach Fehler im JDK, an denen er beteiligt war.

| Auflage | Jahr | Items | Java-Stand |
|---|---|---|---|
| 1. | 2001 | 57 | Java 1.4 |
| 2. | 2008 | 78 | Java 6, mit Generics, Enums, Annotationen |
| 3. | 2018 | 90 | Java 9, mit Lambdas, Streams, Optional, Modulen |

Diese Zusammenfassung bezieht sich auf die dritte Auflage.

### Aufbau

Die 90 Items sind auf elf Kapitel verteilt: Objekte erzeugen und zerstören, Methoden aller Objekte, Klassen und Schnittstellen, Generics, Enums und Annotationen, Lambdas und Streams, Methoden, allgemeine Programmierung, Exceptions, Nebenläufigkeit und Serialisierung. Jedes Item ist ein eigenständiger kurzer Essay mit Begründung und Beispielen. Man kann das Buch von vorne lesen oder gezielt nachschlagen.

### Grundhaltung

Drei Gedanken ziehen sich durch das ganze Buch:

- **API-Denken:** Bloch schreibt aus der Perspektive eines Bibliotheksautors. Jede öffentliche Klasse ist eine API, die andere benutzen und auf die man sich festlegt. Was einmal öffentlich ist, lässt sich kaum zurücknehmen.
- **Korrektheit vor Performance:** Erst richtig, dann klar, dann schnell. Optimierung nur nach Messung.
- **Fehler früh finden:** Am besten zur Kompilierzeit, sonst so früh wie möglich zur Laufzeit. Daraus folgen Typsicherheit, Unveränderlichkeit, Prüfung von Parametern.

Bloch formuliert fast nie absolute Regeln. Viele Items enden mit Abwägungen und Ausnahmen, und der Titel vieler Items enthält Wörter wie „bevorzuge“, „erwäge“ oder „mit Bedacht“. Der Ton ist damit näher an Fowler und Ousterhout als an Martin.

## Objekte erzeugen und zerstören (Items 1–9)

Wie Objekte entstehen, entscheidet über Lesbarkeit, Flexibilität und Speicherverhalten. Das bekannteste Kapitel des Buchs.

| Item | Ratschlag |
|---|---|
| 1 | Statische Fabrikmethoden statt Konstruktoren erwägen |
| 2 | Builder bei vielen Konstruktorparametern |
| 3 | Singleton mit privatem Konstruktor oder als Enum |
| 4 | Nicht instanziierbare Klassen mit privatem Konstruktor |
| 5 | Dependency Injection statt fest verdrahteter Ressourcen |
| 6 | Unnötige Objekte vermeiden |
| 7 | Veraltete Objektreferenzen entfernen |
| 8 | Finalizer und Cleaner vermeiden |
| 9 | try-with-resources statt try-finally |

### Item 1: Statische Fabrikmethoden

Vorteile gegenüber Konstruktoren: Sie haben Namen, müssen nicht jedes Mal ein neues Objekt erzeugen, können einen Untertyp liefern und die konkrete Klasse je nach Eingabe wählen.

```java
Optional<String> empty = Optional.empty();       // sprechender Name
List<String> list = List.of("a", "b");           // liefert unveränderliche, interne Implementierung
Boolean t = Boolean.valueOf(true);               // kein neues Objekt
EnumSet<Day> weekend = EnumSet.of(SAT, SUN);    // wählt je nach Größe eine von zwei Implementierungen
```

Bloch nennt auch übliche Namenskonventionen: `of`, `from`, `valueOf`, `getInstance`, `newInstance`, `getType`, `newType`. Der Nachteil: Statische Fabriken sind in der Javadoc schwerer zu finden als Konstruktoren.

### Item 2: Builder

Bei vielen, teils optionalen Parametern sind Konstruktorketten unlesbar und JavaBeans mit Settern nicht unveränderlich. Der Builder kombiniert beides:

```java
var pizza = new Pizza.Builder(Size.LARGE)
    .addTopping(Topping.HAM)
    .addTopping(Topping.MUSHROOM)
    .extraCheese()
    .build();          // Validierung hier, Objekt danach unveränderlich
```

Das ist die Variante des Builders, die heute in Java vorherrscht, und nicht die GoF-Form mit Director.

### Item 3: Singleton als Enum

Blochs Empfehlung: ein Enum mit einem einzigen Element. Es ist automatisch threadsicher, serialisierungsfest und gegen Reflection-Angriffe geschützt. Er sagt aber auch, dass Singletons das Testen erschweren, und Item 5 empfiehlt ohnehin Dependency Injection.

### Item 5: Dependency Injection

```java
// schlecht: fest verdrahtet, untestbar
public class SpellChecker {
    private static final Lexicon dictionary = new GermanLexicon();
}

// besser: injiziert
public class SpellChecker {
    private final Lexicon dictionary;
    public SpellChecker(Lexicon dictionary) { this.dictionary = Objects.requireNonNull(dictionary); }
}
```

Genau Feathers' Parameterize Constructor, nur aus Design- statt aus Testsicht.

### Items 6 und 7: Speicher

Item 6 warnt vor versehentlicher Objekterzeugung, etwa durch Autoboxing in Schleifen (`Long sum` statt `long sum`) oder wiederholtes Kompilieren regulärer Ausdrücke. Item 7 zeigt, dass Java trotz Garbage Collector Speicherlecks hat: Ein selbstgebauter Stack, der beim `pop` die Referenz nicht auf `null` setzt, hält Objekte am Leben. Typische Quellen sind eigene Collections, Caches und Listener, die nie abgemeldet werden.

### Items 8 und 9: Ressourcen

Finalizer sind unzuverlässig, langsam und gefährlich, Cleaner kaum besser. Ressourcen schließt man mit **try-with-resources**, das Bloch selbst in die Sprache gebracht hat:

```java
try (var in = Files.newBufferedReader(path);
     var out = Files.newBufferedWriter(target)) {
    in.transferTo(out);
}
```

### Einordnung

Items 1, 2, 5 und 9 sind heute Standardwissen und in modernen Bibliotheken überall zu sehen. Item 3 ist durch DI-Container weitgehend überholt, Bloch deutet das selbst an. Item 8 ist inzwischen offizielle Plattformpolitik: Finalization ist seit Java 18 zur Entfernung vorgesehen.

## Methoden aller Objekte (Items 10–14)

Die Methoden von `Object` haben Verträge, auf die sich das ganze JDK verlässt, vor allem die Collections. Wer sie falsch implementiert, bekommt subtile Fehler, die weit entfernt auftreten.

| Item | Ratschlag |
|---|---|
| 10 | Beim Überschreiben von `equals` den allgemeinen Vertrag einhalten |
| 11 | Mit `equals` immer auch `hashCode` überschreiben |
| 12 | `toString` immer überschreiben |
| 13 | `clone` mit Bedacht überschreiben |
| 14 | `Comparable` implementieren, wenn es eine natürliche Ordnung gibt |

### Items 10 und 11: equals und hashCode

Der `equals`-Vertrag verlangt Reflexivität, Symmetrie, Transitivität, Konsistenz und dass nichts gleich `null` ist. Bloch zeigt, wie leicht man ihn bricht, etwa mit einer Unterklasse, die ein Feld hinzufügt und in `equals` berücksichtigt. Seine bekannte Folgerung: Es gibt keine Möglichkeit, eine instanziierbare Klasse zu erweitern, ein Wertfeld hinzuzufügen und den Vertrag zu erhalten. Der Ausweg ist Komposition statt Vererbung.

Vergisst man `hashCode`, funktionieren `HashMap` und `HashSet` nicht mehr: Zwei gleiche Objekte landen in verschiedenen Buckets.

```java
// vor Java 16: Handarbeit nach Blochs Rezept
@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof PhoneNumber pn)) return false;
    return area == pn.area && prefix == pn.prefix && line == pn.line;
}
@Override public int hashCode() { return Objects.hash(area, prefix, line); }

// ab Java 16: alles automatisch, korrekt, unveränderlich
public record PhoneNumber(short area, short prefix, short line) {}
```

### Item 12: toString

Eine gute `toString`-Ausgabe erleichtert Debugging und Logging enorm. Bloch empfiehlt, alle interessanten Informationen auszugeben und zu dokumentieren, ob das Format verbindlich ist. Records erledigen auch das automatisch.

### Item 13: clone

Blochs schärfste Kritik am JDK: `Cloneable` ist ein misslungenes Interface. Es enthält keine Methode, verändert aber das Verhalten einer geschützten Methode in `Object`, umgeht Konstruktoren und kollidiert mit finalen Feldern. Seine Empfehlung: Kopierkonstruktor oder Kopierfabrik.

```java
public Invoice(Invoice original) { … }                     // Kopierkonstruktor
public static Invoice copyOf(Invoice original) { … }       // Kopierfabrik
```

Nur Arrays seien eine Ausnahme, bei denen `clone` sinnvoll funktioniert.

### Item 14: Comparable

Wer eine natürliche Ordnung hat, sollte `Comparable` implementieren, damit sortierte Collections und `Arrays.sort` funktionieren. Bloch empfiehlt die `Comparator`-Konstruktionsmethoden aus Java 8 statt Subtraktion, die bei Überläufen falsche Ergebnisse liefert:

```java
private static final Comparator<PhoneNumber> COMPARATOR =
    Comparator.comparingInt(PhoneNumber::area)
              .thenComparingInt(PhoneNumber::prefix)
              .thenComparingInt(PhoneNumber::line);

public int compareTo(PhoneNumber pn) { return COMPARATOR.compare(this, pn); }
```

### Einordnung

Dieses Kapitel ist durch **Records** am stärksten gealtert, im guten Sinn: Für reine Datenträger sind Items 10 bis 12 automatisch erfüllt. Die Prinzipien bleiben aber relevant für Entities, die Gleichheit über Identität definieren, und für Klassen, die keine Records sein können. Die Kritik an `clone` hat sich vollständig durchgesetzt.

## Klassen und Schnittstellen (Items 15–25)

Das Kapitel mit den meisten Design-Prinzipien. Hier deckt sich Bloch am stärksten mit GoF, Ousterhout und Fowler.

| Item | Ratschlag |
|---|---|
| 15 | Zugriff auf Klassen und Member minimieren |
| 16 | In öffentlichen Klassen Zugriffsmethoden statt öffentlicher Felder |
| 17 | Veränderlichkeit minimieren |
| 18 | Komposition statt Vererbung |
| 19 | Für Vererbung entwerfen und dokumentieren, oder sie verbieten |
| 20 | Interfaces statt abstrakter Klassen |
| 21 | Interfaces für die Nachwelt entwerfen |
| 22 | Interfaces nur zur Definition von Typen |
| 23 | Klassenhierarchien statt Klassen mit Typkennung |
| 24 | Statische Member-Klassen statt nicht-statischer |
| 25 | Nur eine Top-Level-Klasse pro Quelldatei |

### Item 15: Zugriff minimieren

Information Hiding im Sinne von Parnas und Ousterhout: Jede Klasse und jedes Member so unzugänglich wie möglich. Öffentliche Klassen sollten fast nie öffentliche Felder haben, außer Konstanten. Seit Java 9 kommen Module als zusätzliche Ebene dazu: Pakete sind nur sichtbar, wenn ein Modul sie exportiert.

### Item 17: Unveränderlichkeit

Blochs fünf Regeln für unveränderliche Klassen: keine Mutatoren, Klasse nicht erweiterbar, alle Felder `final`, alle Felder `private`, exklusiver Zugriff auf veränderliche Komponenten. Unveränderliche Objekte sind einfach, threadsicher und frei teilbar. Sein Leitsatz: Klassen sollten unveränderlich sein, solange es keinen sehr guten Grund für das Gegenteil gibt.

```java
public record Complex(double re, double im) {
    public Complex plus(Complex c)  { return new Complex(re + c.re, im + c.im); }
    public Complex times(Complex c) {
        return new Complex(re * c.re - im * c.im, re * c.im + im * c.re);
    }
}
```

Records setzen vier der fünf Regeln automatisch um. Die fünfte, keine veränderlichen Komponenten herauszugeben, bleibt Handarbeit, etwa mit `List.copyOf` im kompakten Konstruktor.

### Items 18 und 19: Komposition und Vererbung

Blochs Beispiel ist ein `InstrumentedHashSet`, das zählen soll, wie viele Elemente hinzugefügt wurden. Es erbt von `HashSet` und überschreibt `add` und `addAll`. Weil `HashSet.addAll` intern `add` aufruft, wird doppelt gezählt. Die Unterklasse hängt von einem Implementierungsdetail der Oberklasse ab. Die Lösung ist eine Wrapper-Klasse, die das Set enthält statt davon zu erben, also ein Decorator.

Item 19 zieht die Konsequenz: Eine Klasse, die für Vererbung gedacht ist, muss dokumentieren, welche überschreibbaren Methoden sie selbst aufruft. Alle anderen Klassen sollte man `final` machen.

### Items 20 und 21: Interfaces

Interfaces sind flexibler als abstrakte Klassen: Eine Klasse kann viele implementieren, und sie lassen sich nachträglich an bestehende Klassen anfügen. Für gemeinsame Implementierung kombiniert man ein Interface mit einer **Skeletal Implementation** wie `AbstractList`. Seit Java 8 helfen Default-Methoden.

Item 21 warnt aber: Default-Methoden können bestehende Implementierungen brechen. Bloch zeigt das an `Collection.removeIf`, das in synchronisierten Wrappern ohne Sperre läuft.

### Item 23: Hierarchien statt Typkennung

```java
// schlecht: "tagged class"
class Figure {
    enum Shape { RECTANGLE, CIRCLE }
    final Shape shape;
    double length, width;   // nur für RECTANGLE
    double radius;          // nur für CIRCLE
    double area() { return switch (shape) { case RECTANGLE -> length * width; case CIRCLE -> Math.PI * radius * radius; }; }
}

// Java 17+: sealed Hierarchie mit Records
sealed interface Figure permits Rectangle, Circle { double area(); }
record Rectangle(double length, double width) implements Figure { public double area() { return length * width; } }
record Circle(double radius) implements Figure { public double area() { return Math.PI * radius * radius; } }
```

Das ist Fowlers Replace Type Code with Subclasses, und mit sealed Types auch für den prozeduralen Stil mit `switch` sicher.

### Einordnung

Items 15, 17, 18 und 23 gehören zum Wertvollsten im Buch und sind durch Records und sealed Types einfacher umzusetzen als je zuvor. Item 19 hat Kotlin direkt übernommen: Dort sind Klassen standardmäßig `final`.

## Generics (Items 26–33)

Generics verschieben Typfehler von der Laufzeit zur Kompilierzeit. Weil Java sie per **Type Erasure** umsetzt, gibt es aber viele Fallstricke, und dieses Kapitel ist für viele Entwickler das schwierigste.

| Item | Ratschlag |
|---|---|
| 26 | Keine Raw Types verwenden |
| 27 | Unchecked-Warnungen beseitigen |
| 28 | Listen statt Arrays |
| 29 | Generische Typen bevorzugen |
| 30 | Generische Methoden bevorzugen |
| 31 | Bounded Wildcards für flexiblere APIs |
| 32 | Generics und Varargs mit Bedacht kombinieren |
| 33 | Typsichere heterogene Container erwägen |

### Items 26 und 27: Raw Types und Warnungen

`List` ohne Typparameter ist ein Überbleibsel aus der Zeit vor Java 5. Damit verliert man jede Typsicherheit. Unchecked-Warnungen soll man nicht ignorieren, sondern beseitigen. Wo das nicht geht und man sicher ist, dass der Code typsicher ist, unterdrückt man die Warnung mit `@SuppressWarnings("unchecked")` im kleinstmöglichen Gültigkeitsbereich und kommentiert, warum.

### Item 28: Listen statt Arrays

Arrays sind **kovariant** und zur Laufzeit typisiert, Generics **invariant** und nur zur Kompilierzeit. Das passt schlecht zusammen:

```java
Object[] arr = new Long[1];
arr[0] = "Text";            // kompiliert, wirft ArrayStoreException zur Laufzeit

List<Object> list = new ArrayList<Long>();   // kompiliert nicht, Fehler sofort
```

### Item 31: PECS

Die wohl bekannteste Merkregel des Buchs: **Producer Extends, Consumer Super.** Liefert ein Parameter Werte, nimmt man `? extends T`. Nimmt er Werte auf, `? super T`.

```java
// Quelle produziert T, Ziel konsumiert T
public static <T> void copy(Collection<? super T> target, Collection<? extends T> source) {
    for (T t : source) target.add(t);
}

// funktioniert mit List<Number> als Ziel und List<Integer> als Quelle
copy(numbers, integers);

// klassisches Beispiel aus dem JDK
public static <T extends Comparable<? super T>> T max(Collection<? extends T> coll)
```

Bloch betont: Wenn Nutzer einer API über Wildcards nachdenken müssen, ist die API wahrscheinlich falsch. Richtig eingesetzte Wildcards sind für Nutzer unsichtbar, sie funktionieren einfach.

### Item 32: Generics und Varargs

Varargs erzeugen intern ein Array, was mit generischen Typen kollidiert und zu **Heap Pollution** führen kann. Für Methoden, die das sicher handhaben, gibt es `@SafeVarargs`. `List.of(E... elements)` ist so annotiert.

### Item 33: Typsichere heterogene Container

Eine elegante Technik: Man verwendet das `Class`-Objekt als Schlüssel, um verschiedene Typen typsicher in einem Container zu speichern.

```java
public class Favorites {
    private final Map<Class<?>, Object> favorites = new HashMap<>();
    public <T> void put(Class<T> type, T instance) { favorites.put(Objects.requireNonNull(type), type.cast(instance)); }
    public <T> T get(Class<T> type) { return type.cast(favorites.get(type)); }
}

favorites.put(String.class, "Java");
String s = favorites.get(String.class);   // kein Cast nötig
```

### Einordnung

Das Kapitel ist zeitlos, weil sich die Generics in Java seit 2004 kaum geändert haben. Project Valhalla, das Generics über primitive Typen ermöglichen soll, ist noch in Arbeit. PECS ist bis heute die beste Kurzformel für Wildcards. Die Komplexität des Kapitels ist zugleich eine indirekte Kritik an Javas Generics-Design: Kotlin mit Deklarationsvarianz über `in` und `out` oder C# mit Reified Generics lösen dieselben Probleme einfacher.

## Enums und Annotationen (Items 34–41)

Java-Enums sind viel mächtiger als in den meisten Sprachen: vollwertige Klassen mit Feldern, Methoden und eigenem Verhalten pro Konstante. Bloch hat sie mit entworfen und zeigt hier, was sie können.

| Item | Ratschlag |
|---|---|
| 34 | Enums statt int-Konstanten |
| 35 | Instanzfelder statt `ordinal()` |
| 36 | `EnumSet` statt Bitfelder |
| 37 | `EnumMap` statt Indexierung über `ordinal()` |
| 38 | Erweiterbare Enums über Interfaces nachbilden |
| 39 | Annotationen statt Namenskonventionen |
| 40 | `@Override` konsequent verwenden |
| 41 | Marker-Interfaces für Typen verwenden |

### Item 34: Enums mit Verhalten

```java
public enum Operation {
    PLUS("+")   { public double apply(double x, double y) { return x + y; } },
    MINUS("-")  { public double apply(double x, double y) { return x - y; } },
    TIMES("*")  { public double apply(double x, double y) { return x * y; } };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
    public abstract double apply(double x, double y);
    @Override public String toString() { return symbol; }
}
```

Das ist im Kleinen GoFs Strategy oder State: Jede Konstante hat ihr eigenes Verhalten, und der Compiler erzwingt, dass jede `apply` implementiert. Alternativ geht es kompakter mit einem Lambda im Konstruktor: `PLUS("+", (x, y) -> x + y)`.

### Items 35 bis 37: Weg von ordinal()

`ordinal()` gibt die Position einer Konstante zurück. Bloch rät dringend davon ab, darauf Logik aufzubauen, weil sich die Reihenfolge ändern kann. Stattdessen:

```java
// Item 36: EnumSet statt Bitfeld
EnumSet<Style> styles = EnumSet.of(Style.BOLD, Style.ITALIC);

// Item 37: EnumMap statt Array mit ordinal()-Index
Map<Lifecycle, Set<Plant>> byLifecycle = new EnumMap<>(Lifecycle.class);

// mit Streams
Map<Lifecycle, Set<Plant>> grouped = garden.stream()
    .collect(groupingBy(Plant::lifecycle, () -> new EnumMap<>(Lifecycle.class), toSet()));
```

`EnumSet` und `EnumMap` sind intern Bitvektoren bzw. Arrays, also genauso schnell wie die Handarbeit, aber typsicher.

### Item 38: Erweiterbare Enums

Enums lassen sich nicht vererben. Wo Erweiterbarkeit nötig ist, etwa bei Operationen, die Nutzer ergänzen sollen, definiert man ein Interface, das das Enum implementiert. Andere Enums können es ebenfalls implementieren.

### Items 39 bis 41: Annotationen

Item 39 begründet, warum JUnit 4 mit `@Test` besser war als JUnit 3, das Testmethoden am Namenspräfix `test` erkannte: Tippfehler fallen sofort auf, und Annotationen können Parameter tragen. Item 40 ist kurz und eindeutig: `@Override` an jede überschreibende Methode, damit der Compiler Fehler wie eine falsche Signatur meldet. Item 41 grenzt Marker-Interfaces wie `Serializable` von Marker-Annotationen ab: Interfaces definieren einen Typ, den der Compiler prüfen kann, Annotationen nicht.

### Einordnung

Das Kapitel ist sehr gut gealtert. Enums mit Verhalten sind eine der stärksten Eigenschaften von Java. Mit sealed Interfaces gibt es seit Java 17 eine Ergänzung: Enums für eine feste Menge gleichartiger Konstanten, sealed Types für eine feste Menge verschiedenartiger Fälle mit unterschiedlichen Daten. Beide funktionieren mit erschöpfendem `switch`.

## Lambdas und Streams (Items 42–48)

Das Kapitel ist neu in der dritten Auflage. Bloch ist dabei auffällig vorsichtig: Er begrüßt Lambdas und Streams, warnt aber ausdrücklich vor Übertreibung.

| Item | Ratschlag |
|---|---|
| 42 | Lambdas statt anonymer Klassen |
| 43 | Methodenreferenzen statt Lambdas, wo sie klarer sind |
| 44 | Standard-Funktionsinterfaces bevorzugen |
| 45 | Streams mit Bedacht einsetzen |
| 46 | In Streams Funktionen ohne Seiteneffekte bevorzugen |
| 47 | `Collection` statt `Stream` als Rückgabetyp |
| 48 | Parallele Streams mit Vorsicht |

### Items 42 bis 44

Lambdas sind kürzer und klarer als anonyme Klassen, sollen aber kurz bleiben: Bloch nennt eine bis höchstens drei Zeilen. Ein Lambda hat keinen Namen und keine Dokumentation. Wird es länger, gehört es in eine benannte Methode, auf die man per Methodenreferenz verweist.

Item 44 empfiehlt, die 43 Interfaces aus `java.util.function` zu nutzen, statt eigene zu definieren. Ein eigenes Funktionsinterface lohnt sich nur, wenn es einen klaren Namen, einen eigenen Vertrag oder nützliche Default-Methoden hat, wie `Comparator`. Eigene Funktionsinterfaces sollen `@FunctionalInterface` tragen.

### Item 45: Streams mit Bedacht

Das wichtigste Item des Kapitels. Bloch zeigt drei Versionen eines Anagramm-Programms: iterativ, als langer Stream und als Mischung. Die Mischung ist am lesbarsten.

```java
// zu viel Stream
words.collect(groupingBy(w -> w.chars().sorted()
        .collect(StringBuilder::new, (sb, c) -> sb.append((char) c), StringBuilder::append).toString()))
    .values().stream().filter(g -> g.size() >= minSize)
    .map(g -> g.size() + ": " + g).forEach(System.out::println);

// besser: Hilfsmethode mit Namen, Stream nur für den Fluss
words.collect(groupingBy(Anagrams::alphabetize))
    .values().stream()
    .filter(group -> group.size() >= minSize)
    .forEach(group -> System.out.println(group.size() + ": " + group));
```

Seine Faustregeln: Streams eignen sich gut für Transformieren, Filtern, Zusammenfassen und Gruppieren. Schleifen sind besser, wenn man lokale Variablen ändern, vorzeitig mit `return` aussteigen, geprüfte Exceptions werfen oder auf mehrere Zwischenwerte gleichzeitig zugreifen muss. Und: `char`**-Werte nicht mit Streams verarbeiten**, weil `chars()` einen `IntStream` liefert.

### Item 46: Keine Seiteneffekte

```java
// falsch: forEach als Schleife mit Seiteneffekt
Map<String, Long> freq = new HashMap<>();
words.forEach(w -> freq.merge(w.toLowerCase(), 1L, Long::sum));

// richtig: Collector
Map<String, Long> freq = words.collect(groupingBy(String::toLowerCase, counting()));
```

`forEach` soll nur das Ergebnis ausgeben, nicht die Berechnung durchführen.

### Item 47: Collection statt Stream zurückgeben

Ein `Stream` lässt sich nur einmal durchlaufen und nicht mit for-each verwenden. Wer eine API schreibt, sollte deshalb meist eine `Collection` oder `List` zurückgeben, aus der Aufrufer bei Bedarf selbst einen Stream machen.

### Item 48: Parallele Streams

`.parallel()` ist kein Turbo. Bloch zeigt ein Beispiel, bei dem ein paralleler Stream das Programm nie beenden lässt. Parallelisierung lohnt nur bei großen Datenmengen, gut teilbaren Quellen wie `ArrayList` oder Arrays, unabhängigen Operationen und messbarem Gewinn.

### Einordnung

Dieses Kapitel ist eine nötige Bremse gegen den Stream-Enthusiasmus nach Java 8 und deckt sich mit der Gegenstimme zu Fowlers Replace Loop with Pipeline. Seit 2018 kamen nützliche Ergänzungen hinzu, etwa `Stream.toList()` in Java 16, `mapMulti` und Stream Gatherers für eigene Zwischenoperationen, final seit Java 24.

## Methoden (Items 49–56)

Dieses Kapitel behandelt Methoden als kleinste Einheit einer API: Parameter, Signaturen, Rückgabewerte, Dokumentation.

| Item | Ratschlag |
|---|---|
| 49 | Parameter auf Gültigkeit prüfen |
| 50 | Defensive Kopien, wo nötig |
| 51 | Methodensignaturen sorgfältig entwerfen |
| 52 | Überladen mit Bedacht |
| 53 | Varargs mit Bedacht |
| 54 | Leere Collections oder Arrays statt `null` zurückgeben |
| 55 | `Optional` mit Bedacht zurückgeben |
| 56 | Dokumentationskommentare für alle öffentlichen API-Elemente |

### Items 49 und 50: Prüfen und Kopieren

```java
public final class Period {
    private final Instant start, end;

    public Period(Instant start, Instant end) {
        this.start = Objects.requireNonNull(start);   // Item 49
        this.end = Objects.requireNonNull(end);
        if (start.isAfter(end)) throw new IllegalArgumentException(start + " nach " + end);
    }
}
```

Blochs ursprüngliches Beispiel nutzt das veränderliche `java.util.Date`. Weil Aufrufer das Datum nach der Übergabe ändern konnten, brauchte es defensive Kopien in Konstruktor und Gettern. Mit `java.time` ist das Problem verschwunden, weil die Typen unveränderlich sind. Für Listen gilt es weiter: `List.copyOf(input)`.

### Item 51: Signaturen

Methodennamen nach Konventionen wählen, nicht zu viele Komfortmethoden anbieten, höchstens vier Parameter, Parameter mit gleichem Typ vermeiden, Interfaces statt Klassen als Parametertypen, Enums mit zwei Werten statt `boolean`. Der letzte Punkt entspricht Martins und Fowlers Kritik an Flag-Argumenten.

### Items 54 und 55: Kein null, Optional mit Maß

Leere Collections statt `null` zurückzugeben ist unumstritten: `List.of()` kostet nichts. Bei `Optional` ist Bloch vorsichtig: gut als Rückgabewert, wenn ein Ergebnis fehlen kann und der Aufrufer das behandeln muss. Aber **nicht** als Feld, nicht als Parameter, nicht in Collections und nicht für Collections, die stattdessen leer sein können.

### Item 56: Dokumentation

Jede öffentliche Klasse, Schnittstelle, Methode und jedes Feld bekommt Javadoc. Der Kommentar beschreibt den **Vertrag** zwischen Methode und Aufrufer: was sie tut, nicht wie. Dazu Vorbedingungen, Nachbedingungen, Seiteneffekte und Threadsicherheit. Das ist fast wörtlich Ousterhouts Schnittstellenkommentar und ein deutlicher Kontrast zu Martins Kommentarskepsis.

## Allgemeine Programmierung (Items 57–68)

Ein Sammelkapitel mit vielen kleinen, aber nützlichen Regeln.

| Item | Ratschlag | Kern |
|---|---|---|
| 57 | Gültigkeitsbereich lokaler Variablen minimieren | an der Stelle der ersten Verwendung deklarieren |
| 58 | for-each statt klassischer for-Schleife | weniger Fehler, klarer |
| 59 | Bibliotheken kennen und nutzen | etwa `ThreadLocalRandom`, `String.repeat`, `Files` |
| 60 | `float` und `double` meiden, wenn exakte Werte nötig sind | für Geld `BigDecimal`, `int` oder `long` in Cent |
| 61 | Primitive statt Wrapper-Typen | `==` auf `Integer` vergleicht Referenzen |
| 62 | Strings meiden, wo andere Typen passen | kein String als Schlüssel für zusammengesetzte Werte |
| 63 | String-Verkettung in Schleifen vermeiden | `StringBuilder` |
| 64 | Auf Objekte über ihre Interfaces verweisen | `List<X> x = new ArrayList<>()` |
| 65 | Interfaces statt Reflection | Reflection nur zum Erzeugen, dann über Interface nutzen |
| 66 | Native Methoden mit Bedacht | heute eher Foreign Function API |
| 67 | Mit Bedacht optimieren | gute Programme statt schneller Programme schreiben, dann messen |
| 68 | Allgemeine Namenskonventionen einhalten | Java-Standardkonventionen |

### Items 60 und 61 in Code

```java
System.out.println(1.03 - 0.42);                    // 0.6100000000000001
System.out.println(new BigDecimal("1.03").subtract(new BigDecimal("0.42")));   // 0.61

Integer a = 1000, b = 1000;
System.out.println(a == b);          // false: Referenzvergleich außerhalb des Caches
System.out.println(a.equals(b));     // true
```

### Item 64 gegen Ousterhout

Item 64 ist genau der Punkt, den Ousterhout kritisiert: `List<X> x = new ArrayList<>()` verberge die tatsächliche Klasse. Bloch argumentiert umgekehrt: Wer über das Interface verweist, kann die Implementierung später austauschen. Mit `var` für lokale Variablen hat sich der Streit im Alltag teilweise erledigt, bei Feldern, Parametern und Rückgabetypen gilt weiter Blochs Regel.

### Item 67: Optimierung

Bloch zitiert hier mehrere Klassiker zur verfrühten Optimierung, etwa Knuth, und fasst zusammen: Gute Architektur und gute APIs sind wichtiger als Mikrooptimierung, weil sich schlechte Designentscheidungen später kaum korrigieren lassen. Ein öffentlicher veränderlicher Typ, der defensive Kopien erzwingt, kostet für immer Leistung. Gemessen wird mit einem Profiler oder JMH, nicht nach Gefühl.

## Exceptions (Items 69–77)

Exceptions sind für Ausnahmefälle, nicht für normalen Kontrollfluss. Innerhalb dieser Regel unterscheidet Bloch sorgfältig, welche Art von Exception wofür passt.

| Item | Ratschlag |
|---|---|
| 69 | Exceptions nur für Ausnahmesituationen |
| 70 | Checked Exceptions für behebbare Situationen, Runtime Exceptions für Programmierfehler |
| 71 | Unnötige Checked Exceptions vermeiden |
| 72 | Standard-Exceptions bevorzugen |
| 73 | Exceptions passend zur Abstraktion werfen |
| 74 | Alle geworfenen Exceptions dokumentieren |
| 75 | Fehlerinformationen in die Meldung aufnehmen |
| 76 | Fehleratomarität anstreben |
| 77 | Exceptions nicht ignorieren |

### Item 69: Nicht für Kontrollfluss

```java
// missbraucht: Ende des Arrays über Exception erkennen
try {
    int i = 0;
    while (true) range[i++].climb();
} catch (ArrayIndexOutOfBoundsException e) { }

// richtig
for (Mountain m : range) m.climb();
```

Die erste Variante ist langsamer, schwerer zu lesen und verschluckt echte Fehler, die zufällig dieselbe Exception werfen.

### Items 70 und 71: Checked oder unchecked

Blochs Unterscheidung:

| Art | Wann | Beispiel |
|---|---|---|
| Checked Exception | Der Aufrufer kann sinnvoll reagieren, und die Situation ist nicht durch Prüfung vermeidbar. | `IOException` beim Lesen einer Datei |
| Runtime Exception | Programmierfehler, Vertragsverletzung | `IllegalArgumentException`, `NullPointerException` |
| Error | Reserviert für die JVM | `OutOfMemoryError` |

Item 71 schränkt das ein: Checked Exceptions belasten jeden Aufrufer. Lohnt sich die Behandlung nicht, oder kann der Aufrufer nichts anderes tun als abbrechen, dann ist eine Runtime Exception oder ein `Optional` besser.

**Kontrast zu Clean Code:** Feathers lehnt Checked Exceptions in Clean Code fast grundsätzlich ab, weil sie das Open-Closed-Prinzip verletzen. Bloch verteidigt sie für echte, behebbare Fehler, warnt aber vor Übermaß. In der Praxis hat sich eher Feathers' Sicht durchgesetzt: Frameworks wie Spring wickeln Checked Exceptions fast überall in Runtime Exceptions ein, und keine neuere JVM-Sprache hat sie übernommen. Lambdas und Streams haben das Problem verschärft, weil Funktionsinterfaces keine Checked Exceptions erlauben.

### Item 72: Standard-Exceptions

Eigene Exception-Klassen nur, wenn die Standards nicht passen. Die wichtigsten:

| Exception | Anlass |
|---|---|
| `IllegalArgumentException` | ungültiger Parameterwert |
| `IllegalStateException` | Objektzustand erlaubt den Aufruf nicht |
| `NullPointerException` | `null`, wo es verboten ist |
| `IndexOutOfBoundsException` | Index außerhalb des Bereichs |
| `ConcurrentModificationException` | gleichzeitige Änderung erkannt |
| `UnsupportedOperationException` | Operation nicht unterstützt |

### Item 73: Exception Translation

Höhere Schichten fangen Exceptions niedriger Schichten und werfen eigene, die zur eigenen Abstraktion passen, mit der Ursache als `cause`.

```java
try {
    return repository.load(id);
} catch (SQLException e) {
    throw new OrderNotFoundException(id, e);   // Abstraktion des Aufrufers, Ursache erhalten
}
```

Das ist im Kleinen Evans' Anticorruption Layer und Feathers' Rat aus Clean Code, Exceptions nach den Bedürfnissen des Aufrufers zu definieren.

### Items 75 bis 77

- **Meldungen mit Kontext:** alle Parameter und Felder, die zum Fehler beigetragen haben, aber keine Passwörter oder Schlüssel.
- **Fehleratomarität:** Nach einer Exception soll ein Objekt im Zustand vor dem Aufruf sein. Am einfachsten mit unveränderlichen Objekten, sonst durch Prüfen vor dem Ändern.
- **Nicht ignorieren:** Ein leerer `catch`-Block ist fast immer ein Fehler. Wenn Ignorieren richtig ist, heißt die Variable `ignored` und ein Kommentar erklärt, warum.

## Nebenläufigkeit (Items 78–84)

Blochs Kapitel ist knapp, aber präziser als das entsprechende Kapitel in Clean Code. Es setzt auf `java.util.concurrent` statt auf eigene Synchronisation.

| Item | Ratschlag |
|---|---|
| 78 | Zugriff auf gemeinsam genutzte veränderliche Daten synchronisieren |
| 79 | Übermäßige Synchronisation vermeiden |
| 80 | Executors, Tasks und Streams statt eigener Threads |
| 81 | Concurrency-Utilities statt `wait` und `notify` |
| 82 | Threadsicherheit dokumentieren |
| 83 | Lazy Initialization mit Bedacht |
| 84 | Nicht vom Thread-Scheduler abhängig sein |

### Item 78: Sichtbarkeit

Synchronisation sorgt nicht nur für gegenseitigen Ausschluss, sondern auch dafür, dass Änderungen eines Threads für andere **sichtbar** werden. Blochs Beispiel: Ein Thread soll stoppen, wenn ein `boolean`-Feld gesetzt wird. Ohne `volatile` oder Synchronisation kann die JVM die Prüfung aus der Schleife herausoptimieren, und der Thread läuft ewig.

```java
private static volatile boolean stopRequested;   // ohne volatile: möglicherweise Endlosschleife

var worker = new Thread(() -> { while (!stopRequested) work(); });
worker.start();
TimeUnit.SECONDS.sleep(1);
stopRequested = true;
```

Sein Rat zuerst: Veränderliche Daten gar nicht teilen. Unveränderliche Daten teilen oder veränderliche auf einen Thread beschränken.

### Item 79: Fremde Methoden nicht in synchronisierten Blöcken

Wer in einem `synchronized`-Block einen Callback oder eine überschreibbare Methode aufruft, riskiert Deadlocks und Exceptions, weil er nicht weiß, was dieser Code tut. Bloch zeigt das an einem beobachtbaren Set, also einem Observer, dessen Listener sich selbst abmelden. Die Lösung: Liste kopieren oder `CopyOnWriteArrayList` verwenden und die Callbacks außerhalb des Locks aufrufen.

### Items 80 und 81: Höhere Abstraktionen

```java
try (ExecutorService exec = Executors.newVirtualThreadPerTaskExecutor()) {   // Java 21
    List<Future<Price>> prices = suppliers.stream()
        .map(s -> exec.submit(() -> s.quote(product)))
        .toList();
    …
}
```

Statt `wait` und `notify` nutzt man `ConcurrentHashMap`, `BlockingQueue`, `CountDownLatch` oder `CompletableFuture`. Bloch empfiehlt `ConcurrentHashMap` auch ausdrücklich statt `Collections.synchronizedMap`.

### Item 82: Threadsicherheit dokumentieren

Bloch schlägt Stufen vor, die jede Klasse angeben sollte: unveränderlich, bedingungslos threadsicher, bedingt threadsicher, nicht threadsicher und threadfeindlich. Das Schlüsselwort `synchronized` in einer Signatur ist **keine** Dokumentation, weil es ein Implementierungsdetail ist.

### Item 83: Lazy Initialization

Meist ist normale Initialisierung besser. Wenn Lazy Initialization nötig ist: für statische Felder das **Holder-Class-Idiom**, für Instanzfelder Double-Checked Locking mit `volatile`.

```java
private static class FieldHolder { static final Config config = loadConfig(); }
static Config config() { return FieldHolder.config; }   // threadsicher, ohne Synchronisation
```

## Serialisierung (Items 85–90)

Das letzte Kapitel ist im Kern eine Warnung. Java-Serialisierung ist eine der größten Sicherheitslücken der Plattform: Beim Deserialisieren werden Objekte ohne Konstruktor erzeugt, und manipulierte Byteströme können beliebigen Code ausführen.

Blochs Rat in Item 85 ist ungewöhnlich deutlich: Der beste Weg, Serialisierungsangriffe zu vermeiden, ist, niemals etwas zu deserialisieren. Stattdessen plattformübergreifende Formate wie JSON oder Protocol Buffers.

Die Items 86 bis 90 beschreiben, wie man Serialisierung absichert, wenn man sie doch braucht: eigene serialisierte Form, defensives `readObject`, Enums für Instanzkontrolle und vor allem das **Serialization-Proxy-Pattern**, bei dem eine private statische Klasse die logische Form des Objekts serialisiert und beim Lesen über den normalen Konstruktor wieder aufbaut.

### Einordnung

Das Nebenläufigkeitskapitel ist weitgehend gültig, wird aber durch **Virtual Threads** (Java 21) und **Structured Concurrency** (in Arbeit) ergänzt. Bei Virtual Threads gilt teils anderes: Thread-Pools sind dafür nicht nötig, und `synchronized` konnte bis Java 24 Virtual Threads an ihren Trägerthread binden. Das Serialisierungskapitel hat sich vollständig bestätigt. Records werden ohnehin sicherer serialisiert, weil sie beim Deserialisieren den kanonischen Konstruktor aufrufen, was im Kern Blochs Proxy-Idee ist.

## Was Java seit 2018 verändert hat

Die dritte Auflage beschreibt Java 9. Seither hat Java mehr neue Sprachmittel bekommen als in den 15 Jahren davor. Fast alle bestätigen Blochs Ratschläge, indem sie sie in die Sprache einbauen.

| Neuerung | Java | Betroffene Items | Wirkung |
|---|---|---|---|
| `var` | 10 | 57, 64 | Lokale Variablen kürzer, Interface-Typ für lokale Variablen seltener nötig |
| Switch Expressions | 14 | 34, 23 | Erschöpfende `switch`-Ausdrücke statt Anweisungen |
| Text Blocks | 15 | 62, 63 | Mehrzeilige Strings ohne Verkettung |
| Records | 16 | 10, 11, 12, 17, 50 | `equals`, `hashCode`, `toString` und Unveränderlichkeit automatisch |
| Pattern Matching für `instanceof` | 16 | 10 | kürzere `equals`-Implementierungen |
| `Stream.toList()` | 16 | 45–47 | unveränderliche Liste direkt aus Stream |
| Sealed Classes | 17 | 19, 23, 38 | kontrollierte Hierarchien, Alternative zu Tagged Classes und Visitor |
| Finalization veraltet | 18 | 8 | Blochs Warnung wird offizielle Politik |
| Virtual Threads | 21 | 80, 81, 83 | Millionen leichtgewichtiger Threads, Pools seltener nötig |
| Record Patterns, Pattern Matching für `switch` | 21 | 23, 34 | Datenstrukturen direkt zerlegen und unterscheiden |
| Sequenced Collections | 21 | 58, 59 | `getFirst()`, `getLast()`, `reversed()` einheitlich |
| Foreign Function & Memory API | 22 | 66 | Ersatz für JNI und native Methoden |
| Stream Gatherers | 24 | 45 | eigene Zwischenoperationen für Streams |
| Kein Pinning von Virtual Threads bei `synchronized` | 24 | 78–81 | `synchronized` wieder unproblematisch mit Virtual Threads |

### Was gleich geblieben ist

Einige Kapitel sind praktisch unverändert gültig, weil sie Konzepte statt Sprachmittel betreffen: Generics (26–33), die meisten Exception-Items (69–77), Minimierung von Zugriff (15), Komposition statt Vererbung (18), Dokumentation (56) und Optimierung (67).

### Was überholt ist

| Item | Warum |
|---|---|
| 3 (Singleton) | DI-Container übernehmen die Rolle, Bloch deutet das selbst an |
| 10–12 (equals, hashCode, toString) | für Datenträger durch Records erledigt |
| 13 (clone) | Kritik hat sich durchgesetzt, kaum noch relevant |
| 50 (defensive Kopien) | für Datum und Zeit durch `java.time` erledigt, für Collections weiter nötig |
| 86–90 (Serialisierung) | die meisten Projekte serialisieren ohnehin JSON oder Protobuf |

Eine vierte Auflage von Effective Java ist nach meinem Kenntnisstand nicht erschienen. Die Lücke füllen teils neuere Bücher wie *Modern Java in Action* und die JEP-Dokumente selbst, die oft auf Bloch Bezug nehmen.

## Kritik und Einordnung

Effective Java gilt seit 25 Jahren als das wichtigste Java-Buch überhaupt. Kritik richtet sich weniger gegen die Inhalte als gegen den Zuschnitt.

### Stärken

- **Autorität:** Bloch hat große Teile der Plattform selbst gebaut und benennt offen Fehler im JDK, auch eigene.
- **Konkret und begründet:** Jedes Item erklärt, warum, mit Beispiel und Gegenbeispiel.
- **Abwägend:** Viele Items enden mit Ausnahmen. Der Ton ist sachlich, nicht moralisch.
- **API-Perspektive:** Das Buch denkt konsequent aus Sicht der Nutzer einer Klasse. Das macht es auch für Anwendungsentwickler wertvoll.
- **Hohe Trefferquote:** Fast alle Ratschläge haben sich bestätigt, viele sind später in die Sprache eingegangen.

### Kritikpunkte

**1. Bibliotheksperspektive.** Bloch schreibt für Autoren öffentlicher APIs. In Anwendungscode, den nur das eigene Team nutzt, sind manche Ratschläge übertrieben, etwa ausführliche Dokumentation jeder öffentlichen Methode oder der Aufwand für Erweiterbarkeit.

**2. Kein Designbuch.** Effective Java sagt, wie man einzelne Klassen richtig baut, aber kaum, welche Klassen man braucht oder wie man ein System schneidet. Dafür braucht es Ousterhout oder Evans.

**3. Veraltung.** Die dritte Auflage kennt weder Records noch sealed Types noch Virtual Threads. Etwa ein Fünftel der Items ist heute durch Sprachmittel vereinfacht oder überholt.

**4. Checked Exceptions.** Blochs Verteidigung behebbarer Checked Exceptions hat sich in der Praxis nicht durchgesetzt, besonders seit Lambdas.

**5. Wenig Tests.** Testbarkeit ist kaum Thema, obwohl viele Ratschläge, etwa Dependency Injection oder Unveränderlichkeit, sie stark fördern.

## Verhältnis zu den anderen Büchern

Bloch steht in vielen Punkten zwischen den anderen Autoren und liefert für Java die konkrete Umsetzung ihrer Prinzipien.

| Thema | Bloch | Andere |
|---|---|---|
| Komposition statt Vererbung | Item 18, mit `InstrumentedHashSet` als Beweis | GoF-Grundprinzip, Fowlers Replace Superclass with Delegate, Ousterhout |
| Kommentare | ausführliche Javadoc als Vertrag | nah bei Ousterhout, deutlich gegen Martin |
| Checked Exceptions | für behebbare Fehler | Feathers in Clean Code dagegen |
| Unveränderlichkeit | Item 17, Klassen grundsätzlich unveränderlich | Evans' Value Objects, Fowlers Mutable Data als Smell |
| Singleton | als Enum, aber DI bevorzugt | GoF, Gamma würde es streichen |
| Builder | vereinfachte Form, heute Standard | GoF-Builder mit Director |
| Interface-Typen für Variablen | Item 64, dafür | Ousterhout dagegen |
| Streams | mit Bedacht, Mischung aus Schleifen und Streams | Fowler deutlich enthusiastischer |
| Optimierung | erst richtig, dann messen | Fowler und Ousterhout ähnlich |

## Diskussionsfragen

1. **Records:** Nutzt du Records schon konsequent für Datenträger? Wo sind sie dir zu starr, etwa bei JPA-Entities?
2. **Checked Exceptions:** Wer hat recht, Bloch oder Feathers? Wie geht ihr mit Checked Exceptions in Lambdas um?
3. **Optional:** Hältst du dich an Blochs Grenzen, also nur als Rückgabewert? Oder nutzt ihr es auch als Parameter oder Feld?
4. **Streams:** Wo ziehst du die Grenze zwischen Stream und Schleife? Hast du zu lange Streams in Codereviews erlebt?
5. **Bibliothek oder Anwendung:** Welche Items gelten für dich auch in internem Anwendungscode, welche nur für öffentliche APIs?
6. **Item 64 gegen Ousterhout:** `List<X> x = new ArrayList<>()` oder `ArrayList<X> x = …` oder einfach `var`?
7. **Virtual Threads:** Hat Java 21 in euren Projekten schon etwas an der Nebenläufigkeit geändert?
8. **Vierte Auflage:** Welche neuen Items würdest du für eine Neuauflage vorschlagen, etwa zu Records, sealed Types, Pattern Matching oder Virtual Threads?
