+++
title = "Refactoring – Zusammenfassung und Einordnung"
description = "Martin Fowler, Refactoring: Improving the Design of Existing Code (1999, 2. Auflage 2018)"
date = 2026-10-29T14:42:23+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["refactoring-2018"]
+++

## Einleitung

Refactoring heißt, die innere Struktur von Code zu verbessern, ohne sein beobachtbares Verhalten zu ändern, und zwar in vielen kleinen, sicheren Schritten. Das Buch hat diesen Begriff in der Breite etabliert und einen Katalog benannter Umbauten geschaffen, der heute in jeder IDE steckt.

Martin Fowler ist Chief Scientist bei ThoughtWorks und einer der Mitautoren des Agilen Manifests. Er schreibt bewusst praxisnah und pflegt seit Jahrzehnten eine viel gelesene Website, auf der auch der Refactoring-Katalog online steht.

### Zwei Auflagen

|  | 1. Auflage (1999) | 2. Auflage (2018) |
|---|---|---|
| Sprache | Java | JavaScript |
| Mitwirkende | Kent Beck, John Brant, William Opdyke, Don Roberts | Kent Beck |
| Stil | stark klassenorientiert | Funktionen und Klassen gleichrangig, funktionale Elemente |
| Katalog | rund 70 Refactorings | rund 60, teils neu benannt, neu sortiert, einige neu |
| Beispiel im ersten Kapitel | Videoverleih | Abrechnung für eine Theatertruppe |

Fowler begründet den Sprachwechsel damit, dass JavaScript breiter lesbar sei und er zeigen wolle, dass Refactoring nicht an Klassen gebunden ist. Die Ideen lassen sich eins zu eins auf Java übertragen. Die Beispiele in diesem Dokument sind eigene Java-Beispiele.

### Die Definition, genau genommen

Fowler unterscheidet zwei Bedeutungen:

- **Substantiv:** eine Änderung an der inneren Struktur, die Code leichter verständlich und billiger änderbar macht, ohne sein Verhalten zu ändern. Beispiel: „Extract Function“.
- **Verb:** Software umstrukturieren, indem man eine Folge solcher Refactorings anwendet.

Entscheidend ist das Wort **klein**. Jeder Schritt hält den Code lauffähig. Wenn jemand sagt, der Code sei „beim Refactoring“ seit Tagen kaputt, dann ist das für Fowler kein Refactoring, sondern ein Umbau. Ebenso ist Performance-Optimierung kein Refactoring: Beide ändern die Struktur ohne Verhaltensänderung, aber das Ziel ist ein anderes.

### Die zwei Hüte

Kent Becks Bild: Ein Entwickler trägt immer genau einen von zwei Hüten. Mit dem einen fügt er Funktionalität hinzu und schreibt neue Tests. Mit dem anderen refaktoriert er und ändert dabei weder Funktionalität noch Tests, höchstens deren Struktur. Man wechselt oft, manchmal im Minutentakt, aber man soll immer wissen, welchen Hut man gerade trägt.

### Aufbau des Buchs

Die ersten fünf Kapitel sind Erzählung und Prinzipien: ein langes Beispiel, Grundsätze, Code Smells, Tests und eine Einführung in den Katalog. Der Rest, rund zwei Drittel des Buchs, ist der Katalog selbst. Jedes Refactoring hat einen Namen, eine kurze Skizze, eine Motivation, eine schrittweise Mechanik und Beispiele.

## Ein erstes Beispiel

Fowler beginnt mit einem langen Beispiel statt mit Theorie: ein kleines Programm, das eine Abrechnung als Text erzeugt und erweitert werden soll. Die Lektion: Wenn eine neue Anforderung schwer einzubauen ist, refaktoriert man zuerst so, dass sie leicht einzubauen ist, und baut sie dann ein.

Im Buch geht es um Theateraufführungen. Hier dasselbe Muster an einem eigenen Java-Beispiel: Versandkosten für Sendungen, plus Treuepunkte.

### Ausgangslage

```java
public String statement(Customer customer, List<Shipment> shipments) {
    double total = 0;
    int points = 0;
    StringBuilder result = new StringBuilder("Abrechnung für " + customer.name() + "\n");
    for (Shipment s : shipments) {
        double cost;
        switch (s.type()) {
            case STANDARD -> cost = 4.90 + Math.max(0, s.weightKg() - 5) * 0.50;
            case EXPRESS  -> cost = 12.00 + s.weightKg() * 1.20;
            default -> throw new IllegalArgumentException("Unbekannter Typ: " + s.type());
        }
        points += (int) s.weightKg();
        if (s.type() == ShipmentType.EXPRESS) points += 5;
        result.append(String.format("  %s: %.2f EUR%n", s.id(), cost));
        total += cost;
    }
    result.append(String.format("Summe: %.2f EUR%nTreuepunkte: %d%n", total, points));
    return result.toString();
}
```

Das funktioniert. Die neue Anforderung: dieselbe Abrechnung auch als HTML, und bald ein dritter Versandtyp. Mit diesem Code müsste man die ganze Methode kopieren.

### Schritt 0: Tests

Bevor irgendetwas geändert wird, schreibt Fowler Tests, die die aktuelle Ausgabe festhalten. Ohne sie ist jeder folgende Schritt ein Risiko.

### Schritt 1: Zerlegen

Mit **Extract Function** wandert die Kostenberechnung in eine eigene Methode. Mit **Replace Temp with Query** verschwindet die lokale Variable `cost`, sie wird bei Bedarf berechnet. Dasselbe für die Treuepunkte. Nach jedem Mini-Schritt: kompilieren, testen, committen.

```java
private double costFor(Shipment s) {
    return switch (s.type()) {
        case STANDARD -> 4.90 + Math.max(0, s.weightKg() - 5) * 0.50;
        case EXPRESS  -> 12.00 + s.weightKg() * 1.20;
    };
}

private int pointsFor(Shipment s) {
    int points = (int) s.weightKg();
    if (s.type() == ShipmentType.EXPRESS) points += 5;
    return points;
}
```

### Schritt 2: Schleife teilen

Mit **Split Loop** wird aus einer Schleife, die drei Dinge tut, je eine Schleife pro Aufgabe. Fowler weiß, dass das nach Performance-Verschwendung aussieht, und sagt: erst sauber, dann messen. Danach lassen sich Summen per **Replace Loop with Pipeline** als Stream ausdrücken:

```java
private double totalCost(List<Shipment> shipments) {
    return shipments.stream().mapToDouble(this::costFor).sum();
}
```

### Schritt 3: Phasen trennen

Der entscheidende Schritt ist **Split Phase**: Berechnung und Formatierung werden getrennt. Die erste Phase erzeugt eine reine Datenstruktur, die zweite rendert sie.

```java
record StatementLine(String shipmentId, double cost) {}
record StatementData(String customer, List<StatementLine> lines, double total, int points) {}

public String statement(Customer c, List<Shipment> shipments) {
    return renderPlainText(calculator.compute(c, shipments));
}

public String htmlStatement(Customer c, List<Shipment> shipments) {
    return renderHtml(calculator.compute(c, shipments));
}
```

Die HTML-Variante braucht nun nur noch einen zweiten Renderer.

### Schritt 4: Polymorphie statt switch

Für den neuen Versandtyp wendet Fowler **Replace Conditional with Polymorphism** an. Jeder Typ bekommt eine eigene Klasse mit eigener Kosten- und Punkteberechnung:

```java
sealed interface Tariff permits StandardTariff, ExpressTariff, FreightTariff {
    double cost(double weightKg);
    default int points(double weightKg) { return (int) weightKg; }
}

final class ExpressTariff implements Tariff {
    public double cost(double kg) { return 12.00 + kg * 1.20; }
    public int points(double kg)  { return (int) kg + 5; }
}
```

Ein neuer Typ ist jetzt eine neue Klasse, ohne bestehenden Code anzufassen.

### Die Lektion

Fowler zieht drei Schlüsse: Der Rhythmus ist immer gleich, kleine Änderung, testen, committen. Kein Schritt ist für sich spektakulär, aber zusammen verändern sie die Struktur grundlegend. Und das Ziel ist nicht „schöner Code“, sondern Code, in den sich die nächste Anforderung leicht einbauen lässt. Der Code ist am Ende länger, aber jede Änderung ist billiger.

## Prinzipien

Refactoring ist kein Selbstzweck und keine moralische Pflicht, sondern ein ökonomisches Werkzeug: Es macht künftige Änderungen schneller. Fowler argumentiert durchgehend mit Kosten und Nutzen.

### Warum refaktorieren?

- **Das Design verbessern:** Ohne Refactoring verfällt die Struktur, weil jede Änderung unter Zeitdruck ein wenig Ordnung kostet.
- **Code verständlicher machen:** Für den nächsten Leser, oft man selbst in einigen Monaten.
- **Fehler finden:** Wer Code umbaut, versteht ihn und sieht dabei Fehler.
- **Schneller programmieren:** Das zentrale Argument. Fowler beschreibt es als **Design Stamina Hypothesis**: Ohne gutes Design ist man anfangs schneller, aber bald langsamer. Mit gutem Design bleibt die Geschwindigkeit erhalten.

### Wann refaktorieren?

| Anlass | Beschreibung |
|---|---|
| Dreierregel | Beim ersten Mal einfach machen, beim zweiten Mal die Duplikation zähneknirschend hinnehmen, beim dritten Mal refaktorieren. |
| Vorbereitend | Bevor man ein Feature einbaut, den Code so umbauen, dass es leicht hineinpasst. Fowler nennt das den besten Zeitpunkt. |
| Zum Verstehen | Beim Lesen von Code Erkenntnisse direkt in den Code übertragen, etwa durch Umbenennen. |
| Aufräumen nebenbei | Kleine Unordnung beseitigen, wo man gerade vorbeikommt, ähnlich der Pfadfinderregel. |
| Geplant | Größere Umbauten als eigene Aufgaben. Fowler hält sie für ein Zeichen, dass zu wenig nebenbei refaktoriert wurde, schließt sie aber nicht aus. |
| Langfristig | Große Umbauten wie das Ersetzen einer Bibliothek über Wochen schrittweise, etwa mit **Branch by Abstraction**. |

Fowlers Leitgedanke: Refactoring ist kein eigener Arbeitsschritt, sondern Teil jeder Programmierarbeit. Wer dem Management sagt „wir brauchen zwei Wochen für Refactoring“, hat schon verloren. Er sagt: Man fragt auch nicht um Erlaubnis, Tests zu schreiben.

### Wann nicht?

Code, den man nicht ändern muss, lohnt kein Refactoring, auch wenn er hässlich ist. Und wenn Neuschreiben billiger ist als Umbauen, schreibt man neu. Das ist allerdings seltener, als man denkt.

### Probleme

- **Neue Features wirken langsamer.** Kurzfristig stimmt das. Fowler warnt aber davor, Refactoring als Saubermachen zu rechtfertigen. Das Argument ist immer wirtschaftlich.
- **Code Ownership:** Wenn man fremde Schnittstellen nicht ändern darf, muss man alte Signaturen als Weiterleitung behalten und als veraltet markieren.
- **Branches:** Lange Feature-Branches machen Refactoring teuer, weil Umbauten Merge-Konflikte erzeugen. Fowler plädiert für Continuous Integration bzw. Trunk-Based Development mit täglichem Integrieren.
- **Tests:** Ohne Tests ist Refactoring riskant. Für Legacy-Code verweist Fowler auf Michael Feathers.
- **Datenbanken:** Auch Schemaänderungen lassen sich schrittweise mit Migrationen durchführen.

### Refactoring, Architektur und YAGNI

Weil man jederzeit sicher umbauen kann, muss man nicht alle künftigen Anforderungen vorab einbauen. Fowler sieht Refactoring daher als das Werkzeug, das **YAGNI** („You Aren't Gonna Need It“) und evolutionäre Architektur erst möglich macht. Flexibilität wird dann eingebaut, wenn sie gebraucht wird.

### Refactoring und Performance

Refactoring macht Code manchmal etwas langsamer, etwa durch geteilte Schleifen oder zusätzliche Methodenaufrufe. Fowlers Haltung: Gut strukturierter Code lässt sich viel leichter optimieren. Programme verbringen den Großteil der Zeit in einem kleinen Teil des Codes. Also erst sauber strukturieren, dann mit einem Profiler messen und gezielt die heißen Stellen optimieren. Er erzählt von einem Projekt, das auf diese Weise schneller wurde als durch frühe, verstreute Optimierung.

## Code Smells

Ein Smell ist ein Hinweis, dass Refactoring sinnvoll sein könnte, kein Beweis. Das Kapitel schrieb Fowler zusammen mit Kent Beck, der den Begriff geprägt hat. Wann genau ein Smell stark genug ist, entscheidet Erfahrung, nicht eine Metrik.

Die zweite Auflage nennt 24 Smells, jeweils mit den Refactorings, die typischerweise helfen:

| Smell | Kurzbeschreibung | Typische Refactorings |
|---|---|---|
| Mysterious Name | Ein Name sagt nicht, was etwas tut. | Change Function Declaration, Rename Variable, Rename Field |
| Duplicated Code | Dieselbe Struktur an mehreren Stellen | Extract Function, Slide Statements, Pull Up Method |
| Long Function | Lange Funktionen sind schwer zu verstehen. | Extract Function, Replace Temp with Query, Decompose Conditional |
| Long Parameter List | Zu viele Parameter | Introduce Parameter Object, Preserve Whole Object, Remove Flag Argument |
| Global Data | Von überall änderbar | Encapsulate Variable |
| Mutable Data | Änderungen an einer Stelle brechen andere. | Encapsulate Variable, Split Variable, Separate Query from Modifier |
| Divergent Change | Ein Modul wird aus verschiedenen Gründen geändert. | Split Phase, Extract Class |
| Shotgun Surgery | Eine Änderung erfordert viele kleine Eingriffe überall. | Move Function, Move Field, Inline Class |
| Feature Envy | Eine Methode interessiert sich mehr für die Daten einer anderen Klasse. | Move Function, Extract Function |
| Data Clumps | Dieselben Datenelemente treten immer gemeinsam auf. | Extract Class, Introduce Parameter Object |
| Primitive Obsession | Primitive statt kleiner Fachtypen für Geld, Telefonnummer, Bereich | Replace Primitive with Object, Replace Type Code with Subclasses |
| Repeated Switches | Dasselbe switch an mehreren Stellen | Replace Conditional with Polymorphism |
| Loops | Schleifen, wo Pipelines klarer wären | Replace Loop with Pipeline |
| Lazy Element | Eine Klasse oder Funktion lohnt sich nicht. | Inline Function, Inline Class, Collapse Hierarchy |
| Speculative Generality | Haken und Abstraktionen für Fälle, die nie kommen | Collapse Hierarchy, Inline Function, Remove Dead Code |
| Temporary Field | Felder, die nur manchmal belegt sind | Extract Class, Introduce Special Case |
| Message Chains | Lange Aufrufketten | Hide Delegate, Extract Function, Move Function |
| Middle Man | Eine Klasse delegiert fast nur. | Remove Middle Man, Inline Function |
| Insider Trading | Module tauschen zu viel internes Wissen aus. | Move Function, Move Field, Hide Delegate |
| Large Class | Zu viele Felder, zu viel Code | Extract Class, Extract Superclass |
| Alternative Classes with Different Interfaces | Austauschbare Klassen mit unterschiedlicher Schnittstelle | Change Function Declaration, Move Function |
| Data Class | Nur Felder und Getter, Verhalten liegt anderswo | Encapsulate Record, Move Function |
| Refused Bequest | Unterklasse will Geerbtes nicht | Push Down Method, Replace Subclass with Delegate |
| Comments | Kommentare als Deodorant für schlechten Code | Extract Function, Rename, Introduce Assertion |

Drei Neuerungen gegenüber 1999 fallen auf: **Global Data** und **Mutable Data** sind eigene Smells geworden, Fowler hat also funktionale Ideen aufgenommen. Und **Loops** ist ein Smell, weil Pipelines wie Java-Streams Absicht oft klarer ausdrücken. Der alte Smell „Switch Statements“ wurde zu **Repeated Switches** abgeschwächt: Ein einzelnes switch ist in Ordnung.

### Querbezüge

- **Middle Man** ist fast deckungsgleich mit Ousterhouts Pass-Through-Methoden.
- **Speculative Generality** steht in Spannung zu Ousterhouts „ein wenig allgemein“: Fowler warnt vor Allgemeinheit auf Vorrat, Ousterhout empfiehlt allgemeinere Schnittstellen bei unveränderter Funktionalität. Beide meinen nicht ganz dasselbe.
- **Lazy Element** ist im Kern Ousterhouts flaches Modul.
- **Comments** ähnelt Martins Haltung, ist aber milder: Fowler kritisiert Kommentare, die schlechten Code übertünchen, nicht Kommentare an sich. Gute Kommentare erklären, warum etwas getan wird oder wo man unsicher ist.

## Selbsttestender Code

Ohne automatische Tests ist Refactoring nicht sicher. Fowler widmet Tests deshalb ein eigenes Kapitel, bevor der Katalog beginnt.

### Kernideen

- **Selbsttestend** heißt: Die Tests prüfen ihre Ergebnisse selbst und melden nur Erfolg oder Fehlschlag. Niemand muss Ausgaben vergleichen.
- **Oft ausführen:** Nach jedem kleinen Schritt, mindestens mehrmals pro Stunde. Ein Fehler, der wenige Minuten nach seiner Entstehung auffällt, ist schnell gefunden.
- **Einen Test zuerst fehlschlagen lassen:** Einmal bewusst sehen, dass der Test wirklich anschlägt, etwa indem man den Code kurz falsch macht.
- **Risiko statt Vollständigkeit:** Tests dort schreiben, wo am meisten schiefgehen kann. Getter einfacher Felder braucht man nicht zu testen. Unvollständige Tests, die laufen, sind besser als vollständige, die nie geschrieben werden.
- **Grenzfälle suchen:** leere Listen, null, negative Werte, sehr große Werte. Fowler nennt das, den Code als Feind zu betrachten.
- **Fixture frisch pro Test:** Jeder Test baut seine Testdaten neu auf. Gemeinsam genutzte, veränderliche Testdaten führen zu Tests, die sich gegenseitig beeinflussen.
- **Bei Fehlermeldung zuerst Test:** Kommt ein Bug-Report, schreibt man zuerst einen Test, der ihn zeigt.

### Beispiel mit JUnit 5

Für das Versandbeispiel könnte die Absicherung vor dem Refactoring so aussehen:

```java
class StatementTest {

    private Statement statement;
    private Customer customer;

    @BeforeEach
    void setUp() {
        statement = new Statement();
        customer = new Customer("Muster GmbH");
    }

    @Test
    void standardUnderFiveKgCostsBasePrice() {
        var result = statement.compute(customer, List.of(standard("S1", 3.0)));
        assertEquals(4.90, result.total(), 0.001);
    }

    @Test
    void expressEarnsBonusPoints() {
        var result = statement.compute(customer, List.of(express("E1", 2.0)));
        assertEquals(7, result.points());
    }

    @Test
    void emptyShipmentListGivesZeroTotal() {
        var result = statement.compute(customer, List.of());
        assertEquals(0.0, result.total());
        assertEquals(0, result.points());
    }
}
```

Für die Textausgabe selbst eignet sich zusätzlich ein Vergleich mit einer festgehaltenen erwarteten Ausgabe, oft **Approval-** oder **Golden-Master-Test** genannt. Damit lässt sich auch Code absichern, den man noch nicht verstanden hat.

### Einordnung

Fowlers Testkapitel ist deutlich pragmatischer als Martins drei TDD-Gesetze und kommt Ousterhout näher: Tests sind Voraussetzung für Refactoring, aber Fowler schreibt nicht vor, ob man sie vor oder nach dem Code schreibt. Er selbst bevorzugt TDD, macht es aber nicht zur Bedingung.

## Katalog I: Grundlegende Refactorings

Diese Gruppe nennt Fowler die Refactorings, die er am häufigsten verwendet. Viele kommen als Paar: eines und sein Gegenteil.

| Refactoring | Gegenstück | Wofür |
|---|---|---|
| Extract Function | Inline Function | Codeblock mit eigenem Namen herauslösen |
| Extract Variable | Inline Variable | Teilausdruck benennen |
| Change Function Declaration | – | Funktion oder Parameter umbenennen, Parameter ergänzen oder entfernen |
| Encapsulate Variable | – | Zugriff auf weit genutzte Daten über Funktionen leiten |
| Rename Variable | – | Variable umbenennen |
| Introduce Parameter Object | – | Datengruppe zu einem Objekt bündeln |
| Combine Functions into Class | – | Funktionen, die auf denselben Daten arbeiten, in eine Klasse |
| Combine Functions into Transform | – | Abgeleitete Werte an einer Stelle berechnen |
| Split Phase | – | Code in zwei aufeinanderfolgende Phasen trennen |

### Extract Function: Fowlers Kriterium

Fowler gibt eine Regel, die sich von Martin und Ousterhout unterscheidet: Entscheidend ist der Abstand zwischen **Absicht und Implementierung**. Wenn man einen Codeblock erst lesen muss, um zu verstehen, *was* er tut, gehört er in eine Funktion, deren Name das *Was* sagt. Länge spielt keine Rolle, auch eine einzelne Zeile kann es wert sein.

```java
// vorher
if (order.getDate().isBefore(LocalDate.of(2026, 1, 1)) && order.getCustomer().isPremium()) { … }

// nachher
if (qualifiesForLegacyDiscount(order)) { … }

private boolean qualifiesForLegacyDiscount(Order order) {
    return order.getDate().isBefore(LocalDate.of(2026, 1, 1))
        && order.getCustomer().isPremium();
}
```

**Inline Function** ist ebenso wichtig: Wenn der Funktionskörper so klar ist wie der Name, oder wenn man eine schlecht geschnittene Zerlegung neu ordnen will, holt man den Code zurück und zerlegt neu. Das ist die Antwort auf Ousterhouts Kritik an flachen Methoden.

### Introduce Parameter Object

```java
// vorher
List<Reading> readingsBetween(LocalDate from, LocalDate to) { … }
boolean isOutside(double value, double min, double max) { … }

// nachher
record DateRange(LocalDate from, LocalDate to) {
    boolean contains(LocalDate d) { return !d.isBefore(from) && !d.isAfter(to); }
}
List<Reading> readingsIn(DateRange range) { … }
```

Der eigentliche Gewinn kommt danach: Das neue Objekt zieht Verhalten an, hier `contains`. Fowler betont, dass ein Parameterobjekt oft der Anfang einer echten Fachklasse ist.

## Katalog II: Kapselung

Diese Refactorings sorgen dafür, dass Module ihre Daten und Entscheidungen verbergen, im Sinne von Information Hiding.

| Refactoring | Wofür |
|---|---|
| Encapsulate Record | Offene Datenstruktur durch Klasse mit Zugriffsmethoden ersetzen |
| Encapsulate Collection | Collection nicht direkt herausgeben, sondern über add/remove ändern |
| Replace Primitive with Object | Aus String oder double einen kleinen Fachtyp machen |
| Replace Temp with Query | Temporäre Variable durch Methode ersetzen |
| Extract Class / Inline Class | Klasse aufteilen oder zusammenführen |
| Hide Delegate / Remove Middle Man | Delegation verbergen oder überflüssige Weiterleitung entfernen |
| Substitute Algorithm | Algorithmus durch einen klareren ersetzen |

### Encapsulate Collection

```java
// vorher: Aufrufer kann die Liste beliebig verändern
public List<Course> getCourses() { return courses; }

// nachher
public List<Course> getCourses() { return List.copyOf(courses); }
public void addCourse(Course c)    { courses.add(c); }
public void removeCourse(Course c) {
    if (!courses.remove(c)) throw new IllegalArgumentException("Kurs nicht belegt: " + c);
}
```

### Replace Primitive with Object

```java
// vorher
String phone = "+49 30 1234567";

// nachher
record PhoneNumber(String countryCode, String number) {
    PhoneNumber {
        if (!countryCode.startsWith("+")) throw new IllegalArgumentException(countryCode);
    }
    String formatted() { return countryCode + " " + number; }
}
```

Was als einfacher String beginnt, sammelt bald Validierung und Formatierung. Gegen Primitive Obsession hilft das früh.

### Hide Delegate und Remove Middle Man

Diese beiden sind ein bewusstes Gegensatzpaar. **Hide Delegate** verbirgt eine Kette wie `person.getDepartment().getManager()` hinter `person.getManager()`, im Sinne des Law of Demeter. Wenn aber zu viele solche Weiterleitungen entstehen, wird die Klasse zum Middle Man, und **Remove Middle Man** macht es rückgängig. Fowler gibt hier ausdrücklich keine feste Regel, sondern sagt: Man pendelt zwischen beiden, je nach Lage. Das ist typisch für das ganze Buch.

## Katalog III: Funktionalität verschieben

Gutes Design hängt stark davon ab, wo Code steht. Diese Refactorings verschieben Code zwischen Klassen, Funktionen und Positionen.

| Refactoring | Wofür |
|---|---|
| Move Function | Funktion dorthin, wo ihre Daten und Aufrufer sind |
| Move Field | Feld in die Klasse, die es am meisten nutzt |
| Move Statements into Function / to Callers | Anweisungen in eine Funktion hinein oder aus ihr heraus verschieben |
| Replace Inline Code with Function Call | Selbstgeschriebenen Code durch vorhandene Funktion ersetzen |
| Slide Statements | Zusammengehörige Anweisungen nebeneinanderstellen |
| Split Loop | Schleife mit mehreren Aufgaben teilen |
| Replace Loop with Pipeline | Schleife durch Stream-Operationen ersetzen |
| Remove Dead Code | Ungenutzten Code löschen, die Versionskontrolle merkt ihn sich |

### Move Function gegen Feature Envy

```java
// vorher: Die Methode in Invoice interessiert sich nur für Customer.
class Invoice {
    double discountRate() {
        if (customer.getYearsActive() > 5 && customer.getRevenue() > 100_000) return 0.1;
        return 0.0;
    }
}

// nachher
class Customer {
    double discountRate() {
        return yearsActive > 5 && revenue > 100_000 ? 0.1 : 0.0;
    }
}
```

### Replace Loop with Pipeline

```java
// vorher
List<String> result = new ArrayList<>();
for (Office o : offices) {
    if (o.country().equals("DE")) {
        result.add(o.city() + ": " + o.phone());
    }
}

// nachher
List<String> result = offices.stream()
    .filter(o -> o.country().equals("DE"))
    .map(o -> o.city() + ": " + o.phone())
    .toList();
```

Fowler mag Pipelines, weil sie den Ablauf als Folge benannter Operationen zeigen. Die Gegenstimme: Bei komplexer Logik mit Seiteneffekten oder vorzeitigem Abbruch ist eine Schleife oft lesbarer, und Stream-Stacktraces sind schwerer zu debuggen.

### Slide Statements

Unscheinbar, aber oft der erste Schritt: Anweisungen, die zusammengehören, werden aneinandergeschoben, etwa eine Variablendeklaration direkt vor ihre erste Verwendung. Danach lässt sich der Block mit Extract Function herauslösen. Fowler zeigt, wie man prüft, ob das Verschieben sicher ist: keine Anweisung dazwischen darf die verschobenen Daten ändern oder lesen.

## Katalog IV: Daten organisieren

| Refactoring | Wofür |
|---|---|
| Split Variable | Eine Variable, die mehrere Bedeutungen hat, aufteilen |
| Rename Field | Feld umbenennen |
| Replace Derived Variable with Query | Gespeicherten abgeleiteten Wert durch Berechnung ersetzen |
| Change Reference to Value | Referenzobjekt zum unveränderlichen Wertobjekt machen |
| Change Value to Reference | Mehrfach kopierte Werte durch ein gemeinsames Objekt ersetzen |

### Split Variable

```java
// vorher: temp hat zwei Bedeutungen
double temp = 2 * (height + width);
System.out.println("Umfang: " + temp);
temp = height * width;
System.out.println("Fläche: " + temp);

// nachher
final double perimeter = 2 * (height + width);
System.out.println("Umfang: " + perimeter);
final double area = height * width;
System.out.println("Fläche: " + area);
```

In Java hilft `final`, um sicherzustellen, dass eine Variable nur eine Bedeutung hat.

### Replace Derived Variable with Query

Ein gespeicherter Wert, der sich aus anderen Daten berechnen lässt, kann veralten. Statt `this.total` bei jeder Änderung mitzuführen, berechnet man ihn mit `total()` bei Bedarf. Das ist ein Kernanliegen der zweiten Auflage: veränderliche Daten reduzieren, wo es geht.

### Wertobjekte

**Change Reference to Value** macht aus einem veränderlichen Objekt ein unveränderliches Wertobjekt mit `equals` und `hashCode` über den Inhalt. In modernem Java ist das oft einfach ein `record`. Wertobjekte lassen sich frei teilen und kopieren, ohne dass Änderungen irgendwo unerwartet durchschlagen.

## Katalog V: Bedingungen vereinfachen

Bedingte Logik ist eine der häufigsten Quellen von Komplexität. Fowler hat dafür sechs Refactorings.

| Refactoring | Wofür |
|---|---|
| Decompose Conditional | Bedingung und Zweige in benannte Methoden auslagern |
| Consolidate Conditional Expression | Mehrere Prüfungen mit gleichem Ergebnis zu einer zusammenfassen |
| Replace Nested Conditional with Guard Clauses | Sonderfälle früh mit return abhandeln |
| Replace Conditional with Polymorphism | Typabhängige Verzweigung in Unterklassen verlagern |
| Introduce Special Case | Wiederkehrende Sonderfallprüfung durch Sonderfallobjekt ersetzen |
| Introduce Assertion | Stillschweigende Annahme als Assertion sichtbar machen |

### Decompose Conditional

```java
// vorher
if (!date.isBefore(summerStart) && !date.isAfter(summerEnd)) {
    charge = quantity * summerRate;
} else {
    charge = quantity * regularRate + regularServiceCharge;
}

// nachher
charge = isSummer(date) ? summerCharge(quantity) : regularCharge(quantity);
```

### Guard Clauses

Fowler unterscheidet zwei Arten von Bedingungen: echte Alternativen, die gleich wichtig sind und in `if/else` gehören, und Sonderfälle, die man früh abhandelt und dann vergisst. Die Regel „ein Eingang, ein Ausgang“ hält er für überholt, Klarheit geht vor.

```java
// vorher
double payAmount(Employee e) {
    double result;
    if (e.isSeparated()) {
        result = 0;
    } else {
        if (e.isRetired()) {
            result = pensionAmount(e);
        } else {
            result = regularAmount(e);
        }
    }
    return result;
}

// nachher
double payAmount(Employee e) {
    if (e.isSeparated()) return 0;
    if (e.isRetired())   return pensionAmount(e);
    return regularAmount(e);
}
```

### Replace Conditional with Polymorphism

Fowler betont, dass nicht jede Bedingung polymorph werden soll. Lohnend ist es vor allem in zwei Fällen: wenn dasselbe switch über einen Typ an mehreren Stellen steht, und wenn es eine Grundlogik mit Varianten gibt. In modernem Java gibt es dazu eine echte Alternative: `sealed` Typen mit `switch`-Pattern-Matching, bei denen der Compiler prüft, ob alle Fälle abgedeckt sind.

```java
sealed interface Shape permits Circle, Rect {}
record Circle(double r) implements Shape {}
record Rect(double w, double h) implements Shape {}

// Variante A: Polymorphie, im Sinne von Fowler
// Variante B: erschöpfender switch, im Sinne der Daten-Objekt-Antisymmetrie
double area(Shape s) {
    return switch (s) {
        case Circle c -> Math.PI * c.r() * c.r();
        case Rect r   -> r.w() * r.h();
    };
}
```

Welche Variante passt, hängt davon ab, ob eher neue Typen oder neue Operationen hinzukommen. Das ist genau die Abwägung aus Martins Kapitel über Objekte und Datenstrukturen.

### Introduce Special Case

Wenn viele Aufrufer denselben Sonderfall prüfen, etwa „unbekannter Kunde“, bekommt dieser Fall ein eigenes Objekt:

```java
// vorher, an vielen Stellen
String name = (customer == null) ? "Gast" : customer.getName();

// nachher
class UnknownCustomer extends Customer {
    @Override public String getName() { return "Gast"; }
    @Override public boolean isUnknown() { return true; }
}
```

Das ist dasselbe Muster wie Special Case bei Martin und Feathers und eine Form von Ousterhouts „Fehler wegdefinieren“.

### Introduce Assertion

Eine Annahme wie „der Rabatt ist nie negativ“ wird als Assertion festgehalten. Sie dokumentiert die Annahme und schlägt beim Testen an. Fowler betont: Assertions prüfen Programmierfehler, keine Benutzereingaben. Das Programm muss sich ohne sie gleich verhalten. In Java bedeutet das: `assert` ist standardmäßig deaktiviert, für Prüfungen, die immer gelten sollen, nimmt man `Objects.requireNonNull` oder explizite Exceptions.

## Katalog VI: APIs umbauen

Schnittstellen sind die Verbindungsstellen eines Systems. Gute APIs trennen Lesen und Ändern, haben klare Parameter und zeigen, was sie tun.

| Refactoring | Wofür |
|---|---|
| Separate Query from Modifier | Methode, die etwas liefert und etwas ändert, in zwei teilen |
| Parameterize Function | Mehrere fast gleiche Funktionen zu einer mit Parameter vereinen |
| Remove Flag Argument | Boolean-Parameter durch eigene Methoden ersetzen |
| Preserve Whole Object | Ganzes Objekt übergeben statt einzelner Felder daraus |
| Replace Parameter with Query / Replace Query with Parameter | Parameter durch Berechnung im Aufgerufenen ersetzen, oder umgekehrt |
| Remove Setting Method | Setter entfernen, wenn ein Feld nach Konstruktion nicht mehr geändert werden soll |
| Replace Constructor with Factory Function | Konstruktor durch benannte Fabrikmethode ersetzen |
| Replace Function with Command / Replace Command with Function | Funktion zu Objekt machen, oder umgekehrt |

### Remove Flag Argument

```java
// vorher: Was bedeutet true?
bookConcert(customer, true);

// nachher
bookPremiumConcert(customer);
bookRegularConcert(customer);
```

Fowler unterscheidet hier genauer als Martin: Ein Flag ist schlecht, wenn der Aufrufer einen Literalwert übergibt, der das Verhalten umschaltet. Kommt der Wert aus Daten, die ohnehin durchgereicht werden, kann ein Parameter in Ordnung sein.

### Replace Query with Parameter und Gegenstück

Dieses Paar zeigt Fowlers Denkweise besonders gut. Ein Parameter, den der Aufgerufene selbst ermitteln könnte, belastet den Aufrufer. Umgekehrt macht eine Abfrage auf globalen Zustand eine Funktion abhängig und schwer testbar. Je nach Lage ersetzt man das eine durch das andere. Es gibt keine absolute Regel, nur Abwägung zwischen Abhängigkeit und Einfachheit für den Aufrufer, sehr ähnlich zu Ousterhouts „Komplexität nach unten ziehen“.

### Replace Function with Command

Eine komplexe Funktion wird zu einer Klasse mit einer `execute`-Methode. Das erlaubt, Zwischenergebnisse als Felder zu halten und die lange Methode in viele kleine zu zerlegen, ohne endlose Parameterlisten. Fowler warnt aber: Commands sind komplexer als Funktionen, man soll sie nur verwenden, wenn der Nutzen klar ist. Dieses Muster ist übrigens genau das, was Martin in seinen Beispielen oft macht und was die Kritik an versteckten Feldzuständen auslöst.

## Katalog VII: Vererbung

| Refactoring | Wofür |
|---|---|
| Pull Up Method / Field / Constructor Body | Gemeinsames aus Unterklassen in die Oberklasse holen |
| Push Down Method / Field | Nur von einer Unterklasse Genutztes nach unten schieben |
| Replace Type Code with Subclasses / Remove Subclass | Typkennung durch Unterklassen ersetzen, oder umgekehrt |
| Extract Superclass / Collapse Hierarchy | Gemeinsame Oberklasse bilden, oder überflüssige Ebene entfernen |
| Replace Subclass with Delegate | Vererbung durch Komposition ersetzen |
| Replace Superclass with Delegate | Unpassende Vererbung, etwa bei Collections, durch Delegation ersetzen |

### Vererbung durch Delegation ersetzen

Replace Subclass with Delegate ist in der zweiten Auflage neu, Replace Superclass with Delegate eine Umbenennung des alten „Replace Inheritance with Delegation“. Beide zeigen Fowlers gewachsene Skepsis gegenüber Vererbung. Das klassische Warnbeispiel ist Javas `Stack`, der von `Vector` erbt und dadurch Methoden anbietet, die für einen Stapel keinen Sinn ergeben. Dasselbe Muster in eigenem Code:

```java
// vorher: Jede List-Methode ist öffentlich, auch die unpassenden.
class Catalog extends ArrayList<Item> { … }

// nachher
class Catalog {
    private final List<Item> items = new ArrayList<>();
    public void add(Item i)            { items.add(i); }
    public Optional<Item> find(String id) {
        return items.stream().filter(i -> i.id().equals(id)).findFirst();
    }
}
```

Fowler sagt dabei bewusst nicht, Vererbung sei schlecht. Sie sei ein gutes Werkzeug für eine einzige Dimension der Variation. Sobald es zwei Dimensionen gibt, oder wenn die Unterklasse nicht alles Geerbte will, ist Delegation besser. Sein Vorgehen: zunächst Vererbung nutzen, und wenn sie zu stören beginnt, auf Delegation umbauen.

## Kritik und Einordnung

Refactoring ist von den hier besprochenen Büchern das am besten gealterte. Sein Kern, kleine verhaltenserhaltende Schritte mit Tests, ist so selbstverständlich geworden, dass man vergisst, dass es einmal neu war.

### Wirkung

- **Gemeinsames Vokabular:** „Extract Method“, „Inline Variable“, „Move Method“ sind Standardbegriffe. Wer im Review „Feature Envy“ sagt, wird verstanden.
- **Werkzeuge:** Die automatisierten Refactorings in IntelliJ IDEA, Eclipse und anderen IDEs folgen weitgehend Fowlers Katalog. Viele Schritte, die im Buch mehrere manuelle Teilschritte haben, sind heute ein Tastendruck.
- **Agile Praxis:** Refactoring ist fester Bestandteil von TDD (Red, Green, Refactor), Continuous Integration und evolutionärer Architektur.

### Stärken

- **Pragmatischer Ton:** Fowler formuliert fast alles als Abwägung. Viele Refactorings kommen als Paar mit Gegenteil, und er sagt ausdrücklich, dass man je nach Lage in beide Richtungen umbaut.
- **Mechanik:** Jedes Refactoring hat eine sichere Schrittfolge. Das macht das Buch zum Handwerkszeug, nicht nur zur Meinung.
- **Ökonomische Begründung:** Refactoring wird mit Geschwindigkeit begründet, nicht mit Ästhetik oder Moral.
- **Lernfähigkeit:** Die zweite Auflage zeigt, dass Fowler aus 20 Jahren gelernt hat, etwa bei veränderlichen Daten, Vererbung und Schleifen.

### Schwächen

**1. Wenig Großes.** Das Buch behandelt vor allem Refactorings im Kleinen, innerhalb einer Klasse oder zwischen wenigen Klassen. Große Umbauten, etwa das Zerlegen eines Monolithen oder das Ändern einer Kernabstraktion über Hunderte Klassen, werden nur gestreift. Dafür gibt es eigene Ansätze wie die Mikado-Methode, Branch by Abstraction oder das Strangler-Fig-Pattern, das Fowler auf seiner Website beschreibt.

**2. Setzt Tests voraus.** Wer Legacy-Code ohne Tests hat, findet hier wenig Hilfe, wie man überhaupt erst Tests einzieht. Dafür ist Feathers' *Working Effectively with Legacy Code* das passende Buch.

**3. Katalog statt Designtheorie.** Fowler sagt, *wie* man umbaut, aber weniger, *wohin*. Das Ziel bleibt oft implizit: verständlicher, leichter änderbar. Ousterhout liefert hier mit tiefen Modulen und Information Hiding mehr Orientierung.

**4. JavaScript in der zweiten Auflage.** Für Java-Entwickler fehlen Bezüge zu statischer Typisierung und IDE-Unterstützung, die viele Schritte sicherer machen. Einige Kommentatoren bevorzugen deshalb weiterhin die erste Auflage, obwohl sie inhaltlich älter ist.

**5. Die Tendenz zu kleinen Funktionen.** Fowler bevorzugt wie Martin eher kurze Funktionen, begründet das aber nicht mit Zeilenzahl, sondern mit dem Abstand zwischen Absicht und Implementierung. Dass er Inline Function gleichrangig behandelt, schützt ihn vor dem Vorwurf der Zerstückelung besser als Martin.

### Heute

Mit IDE-Automatik und KI-gestützten Werkzeugen wird die Mechanik des Buchs zunehmend automatisch erledigt. Gerade dadurch wird der eigentliche Wert sichtbarer: das Urteilsvermögen, wann welcher Umbau sinnvoll ist, und die Disziplin, in kleinen, abgesicherten Schritten zu arbeiten, auch wenn ein Werkzeug den Umbau in Sekunden erledigen könnte.

## Fowler zwischen Martin und Ousterhout

Fowler liefert das Werkzeug, mit dem man die Ideen beider Autoren umsetzt. Inhaltlich steht er näher bei Martin, im Ton und in der Abwägung näher bei Ousterhout.

| Thema | Martin | Fowler | Ousterhout |
|---|---|---|---|
| Kernfrage | Ist der Code sauber? | Wie baue ich sicher um? | Ist das System einfacher? |
| Funktionsgröße | so klein wie möglich | Abstand Absicht–Implementierung entscheidet | Tiefe entscheidet, Länge egal |
| Gegenrichtung | kaum behandelt | Inline Function gleichrangig mit Extract | Zusammenlegen ausdrücklich empfohlen |
| Weiterleitungen | Law of Demeter, Ketten verbergen | Hide Delegate und Remove Middle Man je nach Lage | Pass-Through-Methoden als Red Flag |
| Kommentare | meist Versagen | als Deodorant schlecht, für Warum und Unsicherheit gut | zentral für Abstraktion |
| Tests | TDD als Pflicht | selbsttestender Code als Voraussetzung, TDD bevorzugt | wichtig, TDD skeptisch |
| Design | entsteht durch Refaktorieren | entsteht durch Refaktorieren, YAGNI | vorher bewusst entwerfen, Design it twice |
| Performance | kaum Thema | erst sauber, dann messen und gezielt optimieren | kritischen Pfad gestalten |
| Ton | normativ | abwägend, ökonomisch | abwägend, ökonomisch |

### Wie sich die drei ergänzen

- **Ousterhout** sagt, wohin man will: tiefe Module, wenig Leakage, einfache Schnittstellen.
- **Fowler** sagt, wie man sicher dorthin kommt: in benannten, kleinen, getesteten Schritten.
- **Martin** liefert Regeln für die Oberfläche: Namen, Formatierung, Fehlerbehandlung, Testqualität.

Ein Beispiel: Ousterhout würde eine dünne Service-Schicht als Pass-Through kritisieren. Fowler würde sagen: Ist sie nur Weiterleitung, wende Remove Middle Man an. Kommt später Logik dazu, kann man mit Hide Delegate wieder eine Schicht einziehen. Martin würde vermutlich die Schicht behalten, weil sie im Sinne seiner Clean Architecture Abhängigkeitsregeln durchsetzt.

## Diskussionsfragen

1. **Kleine Schritte in der Praxis:** Refaktorierst du wirklich in Minutenschritten mit Commit, oder eher in größeren Blöcken? Was hat sich bewährt?
2. **Vorbereitendes Refactoring:** Erst umbauen, dann Feature einbauen. Lässt sich das im Team und gegenüber Projektleitung durchhalten, wenn Refactoring nicht eigens ausgewiesen wird?
3. **Branches:** Fowler hält lange Feature-Branches für refactoringfeindlich. Wie sieht das bei euch aus, Trunk-Based oder Git-Flow?
4. **Streams statt Schleifen:** Wirklich immer lesbarer? Wo kippt es in Java?
5. **Polymorphie oder sealed switch:** Mit Java 21 gibt es eine echte Alternative zu Replace Conditional with Polymorphism. Welche wählst du wann?
6. **IDE und KI:** Wenn Werkzeuge die Mechanik übernehmen, was bleibt vom Buch? Nur das Smell-Vokabular und das Urteilsvermögen, oder auch die Schrittdisziplin?
7. **Erste oder zweite Auflage:** Für Java-Entwickler lieber die alte Java-Ausgabe oder die neuere, ideologisch modernere?
8. **Nächster Kandidat:** Würde Feathers' *Working Effectively with Legacy Code* gut anschließen, weil es genau dort ansetzt, wo Fowler Tests voraussetzt?
