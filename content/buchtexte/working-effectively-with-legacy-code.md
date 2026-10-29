+++
title = "Working Effectively with Legacy Code – Zusammenfassung und Einordnung"
description = "Michael C. Feathers, Working Effectively with Legacy Code (2004)"
date = 2026-10-29T14:41:28+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["working-effectively-with-legacy-code-2004"]
+++

## Einleitung

Legacy Code ist für Feathers schlicht **Code ohne Tests**. Nicht das Alter, nicht die Sprache und nicht die Hässlichkeit machen ihn zum Problem, sondern dass man ihn nicht ändern kann, ohne zu wissen, ob man etwas kaputt macht.

Diese Definition ist provokant: Code, den jemand heute Vormittag geschrieben hat, ist nach ihr bereits Legacy, wenn er keine Tests hat. Umgekehrt ist alter Code mit guten Tests kein Legacy Code.

### Autor und Kontext

Michael Feathers war Berater bei Object Mentor, der Firma von Robert C. Martin, und hat dort viele Teams bei der Arbeit mit großen, ungetesteten Codebasen begleitet. Er schrieb auch das Kapitel zur Fehlerbehandlung in Clean Code und entwickelte CppUnit, die C++-Portierung von JUnit.

Das Buch erschien 2004, als Extreme Programming und TDD sich verbreiteten. Die Frage war: Was machen Teams, die TDD einführen wollen, aber auf Millionen Zeilen sitzen, für die es keinen einzigen Test gibt? Fowlers Refactoring setzt Tests voraus. Feathers zeigt, wie man dorthin kommt.

Die Beispiele sind in Java, C++, C# und C. Das macht das Buch breiter als die anderen dieser Reihe, weil viele Techniken für Sprachen ohne Reflection oder Mocking-Frameworks gedacht sind.

### Das Dilemma

Das Kernproblem nennt Feathers **das Legacy-Code-Dilemma**: Um Code sicher zu ändern, braucht man Tests. Um Tests zu schreiben, muss man den Code oft ändern, etwa um Abhängigkeiten aufzubrechen. Das Buch handelt im Kern davon, wie man diese ersten Änderungen so vorsichtig macht, dass sie ohne Tests sicher genug sind.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Die Mechanik der Änderung (Kap. 1–5) | Warum Code geändert wird, Feedback, Unit-Tests, das Seam-Modell, Werkzeuge |
| II. Software ändern (Kap. 6–24) | Kapitel als Fragen aus der Praxis, etwa „Ich habe nicht viel Zeit und muss das ändern“ oder „Ich bekomme diese Klasse nicht in einen Testrahmen“ |
| III. Techniken zum Aufbrechen von Abhängigkeiten (Kap. 25) | Katalog von 24 Techniken mit Schrittfolge |

Der zweite Teil ist wie ein FAQ aufgebaut: Man schlägt das Kapitel zu seinem aktuellen Problem auf. Das macht das Buch ungewöhnlich gut als Nachschlagewerk im Alltag, auch wenn es sich am Stück weniger flüssig liest.

### Vier Gründe für Änderungen

Feathers unterscheidet:

1. **Feature hinzufügen**
2. **Fehler beheben**
3. **Design verbessern**, also Refactoring
4. **Ressourcennutzung optimieren**, also Performance

In allen vier Fällen ändert sich etwas, aber ein großer Teil des Verhaltens soll unverändert bleiben. Das eigentliche Risiko liegt fast immer in diesem bestehenden Verhalten, das man versehentlich mitändert.

## Die Mechanik der Änderung

Es gibt zwei Arten, Code zu ändern: **Edit and Pray** und **Cover and Modify**. Feathers' ganzes Buch ist ein Plädoyer für die zweite.

- **Edit and Pray:** Man liest den Code, plant die Änderung sorgfältig, ändert, testet manuell und hofft. Sorgfalt ist hier das einzige Sicherheitsnetz.
- **Cover and Modify:** Man legt zuerst eine Decke aus Tests über den Code, der sich ändern soll, und ändert erst dann. Tests werden zum Schraubstock, der das Verhalten festhält, während man daran arbeitet.

### Was ein Unit-Test ist

Feathers gibt eine scharfe Definition, die bis heute oft zitiert wird. Ein Test ist **kein** Unit-Test, wenn er:

- mit einer Datenbank spricht
- über das Netzwerk kommuniziert
- das Dateisystem berührt
- nicht parallel zu anderen Tests laufen kann
- besondere Konfiguration der Umgebung braucht, etwa Konfigurationsdateien anpassen

Außerdem: Ein Unit-Test, der eine Zehntelsekunde braucht, ist zu langsam. Solche Tests sind nicht schlecht, aber sie gehören in eine andere Kategorie. Unit-Tests müssen so schnell sein, dass man Tausende nach jeder kleinen Änderung laufen lassen kann.

### Der Algorithmus für Änderungen an Legacy Code

Feathers' Kernrezept, das sich durch das ganze Buch zieht:

1. **Änderungsstellen identifizieren:** Wo muss etwas geändert werden?
2. **Teststellen finden:** Wo kann man Tests ansetzen, um die Änderung zu prüfen? Das ist oft nicht dieselbe Stelle.
3. **Abhängigkeiten aufbrechen:** Den Code so umbauen, dass er sich überhaupt testen lässt. Das ist meist der schwierigste Schritt.
4. **Tests schreiben:** Das aktuelle Verhalten festhalten.
5. **Ändern und refaktorieren:** Jetzt unter Testschutz.

Der dritte Schritt geschieht ohne Tests und muss deshalb extrem vorsichtig sein: kleine, mechanische Umbauten, idealerweise mit IDE-Unterstützung, mit erhaltenen Signaturen und mit dem Compiler als Prüfinstanz.

### Sensing und Separation

Abhängigkeiten bricht man aus zwei Gründen auf:

| Grund | Problem | Beispiel |
|---|---|---|
| **Sensing** | Man kann nicht sehen, was der Code tut, weil Werte nur an eine Abhängigkeit übergeben werden. | Eine Methode schreibt nur in eine Datenbank, gibt aber nichts zurück. |
| **Separation** | Man kann den Code nicht isoliert laufen lassen. | Eine Klasse öffnet im Konstruktor eine Netzwerkverbindung. |

Die wichtigsten Werkzeuge dafür sind **Fake Objects**, die eine Abhängigkeit ersetzen und mitschreiben, was passiert, und **Mock Objects**, die zusätzlich prüfen, ob erwartete Aufrufe stattgefunden haben.

```java
// Fake: zeichnet auf, was die Kasse anzeigen würde
class FakeDisplay implements Display {
    private String lastLine;
    public void showLine(String line) { lastLine = line; }
    String lastLine() { return lastLine; }
}

@Test
void showsItemPrice() {
    var display = new FakeDisplay();
    var sale = new Sale(display);
    sale.scan("4006381333931");
    assertEquals("Bleistift 1,20 EUR", display.lastLine());
}
```

Feathers' Beispiel im Buch ist ganz ähnlich eine Kassensoftware, die Preise auf einem Display anzeigt. Der Fake macht das unsichtbare Ergebnis sichtbar.

## Das Seam-Modell

Eine **Seam** (Naht) ist eine Stelle, an der man das Verhalten eines Programms ändern kann, **ohne an dieser Stelle den Code zu ändern**. Das ist der zentrale Begriff des Buchs.

Zu jeder Seam gehört ein **Enabling Point**: die Stelle, an der man entscheidet, welches Verhalten gilt. Im Test wählt man dort die Testvariante, in Produktion die echte.

### Drei Arten von Seams

| Art | Mechanismus | Enabling Point | Typische Sprachen |
|---|---|---|---|
| Preprocessing Seam | Makros, bedingte Kompilierung | Präprozessor-Definition | C, C++ |
| Link Seam | Andere Bibliothek oder andere Klassen beim Linken oder im Classpath | Build-Skript, Classpath | C, C++, auch Java |
| Object Seam | Polymorphie: Aufruf auf einem Objekt, dessen Klasse austauschbar ist | Stelle, an der das Objekt erzeugt oder übergeben wird | Java, C#, alle OO-Sprachen |

In Java sind **Object Seams** fast immer die richtige Wahl. Link Seams sind möglich, etwa eine Testversion einer Klasse mit gleichem Namen auf dem Test-Classpath, gelten aber als undurchsichtig.

### Keine Seam

```java
public class InvoiceService {
    public void send(Invoice inv) {
        String pdf = PdfRenderer.render(inv);          // statisch, keine Seam
        SmtpClient client = new SmtpClient("mail.firma.de");  // new im Code, keine Seam
        client.send(inv.customerEmail(), pdf);
    }
}
```

Im Test würde echte Post verschickt. Weder der statische Aufruf noch das `new` lassen sich von außen ersetzen.

### Seam einziehen

```java
public class InvoiceService {
    private final Renderer renderer;
    private final MailSender mail;

    public InvoiceService(Renderer renderer, MailSender mail) {   // Enabling Point
        this.renderer = renderer;
        this.mail = mail;
    }

    public void send(Invoice inv) {
        mail.send(inv.customerEmail(), renderer.render(inv));     // Object Seams
    }
}
```

Der Konstruktor ist jetzt der Enabling Point. Im Test übergibt man Fakes, in Produktion die echten Implementierungen. Das ist im Kern Dependency Injection, nur aus der Perspektive der Testbarkeit erklärt.

### Seams mit minimalem Umbau

Oft darf oder kann man nicht gleich alle Aufrufer ändern. Dann hilft eine Seam, die bestehende Aufrufer nicht stört:

```java
public class InvoiceService {
    public void send(Invoice inv) {
        mailSender().send(inv.customerEmail(), PdfRenderer.render(inv));
    }

    protected MailSender mailSender() {            // Seam per Überschreiben
        return new SmtpClient("mail.firma.de");
    }
}

// im Test
class TestableInvoiceService extends InvoiceService {
    final FakeMailSender fake = new FakeMailSender();
    @Override protected MailSender mailSender() { return fake; }
}
```

Das ist **Extract and Override Factory Method**, eine der Techniken aus dem Katalog. Der Produktionscode bleibt für alle Aufrufer gleich, und der Test bekommt seine Naht.

### Einordnung

Das Seam-Modell ist die originellste Idee des Buchs. Es löst den Blick von „Wie mocke ich das?“ und lenkt ihn auf „Wo kann das Verhalten ersetzt werden?“. Damit lässt sich systematisch über Testbarkeit reden, auch in Sprachen ohne Mocking-Frameworks.

## „Ich habe nicht viel Zeit und muss das ändern“

Wenn keine Zeit ist, den bestehenden Code unter Test zu bringen, schreibt man den **neuen** Code so, dass er getestet ist, und berührt den alten so wenig wie möglich. Feathers nennt vier Techniken.

### Sprout Method

Der neue Code entsteht als eigene Methode, die man testgetrieben entwickelt. Im alten Code kommt nur ein Aufruf dazu.

```java
// Anforderung: Duplikate sollen nicht erneut gebucht werden.
public void postEntries(List<Entry> entries) {
    List<Entry> toPost = uniqueEntries(entries);   // nur diese Zeile ist neu
    for (Entry e : toPost) {
        e.postDate();
        transactionBundle.add(e);
    }
    transactionBundle.commit();
}

// neu und vollständig getestet
List<Entry> uniqueEntries(List<Entry> entries) {
    return entries.stream()
        .filter(e -> !transactionBundle.hasEntry(e))
        .distinct()
        .toList();
}
```

`postEntries` bleibt ungetestet, aber das neue Verhalten ist abgesichert.

### Sprout Class

Wenn sich nicht einmal die Klasse in einen Testrahmen bringen lässt, etwa weil der Konstruktor eine Datenbank öffnet, entsteht der neue Code in einer **eigenen Klasse**. Die alte Klasse erzeugt sie und ruft sie auf.

```java
// Die alte Klasse bleibt untestbar, aber die neue Logik nicht.
class QuarterlyReportGenerator {      // Konstruktor verbindet sich mit DB
    String generate() {
        …
        String header = new QuarterlyReportHeader(quarter, region).render();
        …
    }
}

class QuarterlyReportHeader {         // neu, frei von Abhängigkeiten, getestet
    QuarterlyReportHeader(Quarter q, Region r) { … }
    String render() { … }
}
```

Feathers gibt zu, dass das zunächst nach schlechtem Design aussieht: eine Klasse, die vielleicht gar keine eigenständige Verantwortung hat. Oft entpuppt sie sich aber später als genau die Abstraktion, die gefehlt hat.

### Wrap Method

Die bestehende Methode wird umbenannt, eine neue Methode mit dem alten Namen ruft die alte und das neue Verhalten auf. Für Aufrufer ändert sich nichts.

```java
// vorher: pay() berechnet und zahlt aus
public void pay() {
    dispatchPayment();     // umbenannter Originalcode
    logPayment();          // neu, getestet
}

private void dispatchPayment() {
    // unveränderter Originalcode von pay()
}
```

Das eignet sich, wenn das neue Verhalten **vor oder nach** dem alten laufen soll und unabhängig von ihm ist, etwa Logging, Auditing oder Benachrichtigungen.

### Wrap Class

Die Klassenvariante von Wrap Method ist ein Decorator: Eine neue Klasse mit derselben Schnittstelle umhüllt die alte und fügt Verhalten hinzu.

```java
class LoggingEmployee implements Payable {
    private final Payable inner;
    LoggingEmployee(Payable inner) { this.inner = inner; }
    public void pay() {
        inner.pay();
        auditLog.record("pay", inner);
    }
}
```

### Was man wann wählt

| Technik | Wann |
|---|---|
| Sprout Method | Neue Logik ist ein abgrenzbarer Schritt, die Klasse ist testbar. |
| Sprout Class | Neue Logik ist abgrenzbar, die Klasse ist nicht testbar. |
| Wrap Method | Neues Verhalten läuft vor oder nach dem alten, Aufrufer sollen nichts merken. |
| Wrap Class | Wie Wrap Method, aber die Klasse ist zu verworren oder das Verhalten soll optional sein. |

### Einordnung

Diese vier sind die vermutlich am häufigsten angewendeten Techniken des Buchs, weil sie unter echtem Zeitdruck funktionieren. Feathers ist ehrlich über ihren Preis: Der alte Code bleibt ungetestet und oft hässlich, und man verschiebt das Problem. Aber jede Änderung mit Sprout oder Wrap vergrößert den getesteten Anteil, statt ihn gleich zu lassen.

## „Ich bekomme diese Klasse nicht in einen Testrahmen“

Das längste Kapitel des Buchs. Feathers' Rat: Einfach versuchen, eine Instanz im Test zu erzeugen, und sehen, was passiert. Der Compiler und die Fehlermeldungen zeigen, welche Abhängigkeiten im Weg sind.

### Typische Hindernisse

| Hindernis | Problem | Typische Lösung |
|---|---|---|
| Irritating Parameter | Der Konstruktor verlangt ein Objekt, das sich schwer erzeugen lässt, etwa eine Datenbankverbindung. | Extract Interface, Fake übergeben; notfalls `null` übergeben, wenn der Test den Parameter nicht braucht |
| Hidden Dependency | Der Konstruktor erzeugt intern selbst eine schwere Ressource. | Parameterize Constructor |
| Construction Blob | Der Konstruktor baut ein ganzes Netz von Objekten auf. | Supersede Instance Variable, Extract and Override Factory Method |
| Irritating Global Dependency | Die Klasse greift auf ein Singleton oder eine globale Variable zu. | Introduce Static Setter, Parameterize Constructor |
| Horrible Include Dependencies | In C++ zieht eine Header-Datei Hunderte weitere nach sich. | Definition Completion, Link Seams |
| Onion Parameter | Ein Parameter braucht einen Parameter, der einen Parameter braucht … | Extract Interface am äußersten Punkt |
| Aliased Parameter | Der Parameter ist von einer konkreten Klasse, die selbst Teil einer Hierarchie ist. | Subclass and Override, Extract Interface |

### Parameterize Constructor

Die wohl häufigste Technik. Die versteckte Abhängigkeit wird zum Parameter, ein zusätzlicher Konstruktor erhält das alte Verhalten für bestehende Aufrufer.

```java
public class MailingListDispatcher {
    private final MailService service;

    public MailingListDispatcher() {                     // alter Konstruktor bleibt
        this(new SmtpMailService(Config.smtpHost()));
    }

    MailingListDispatcher(MailService service) {         // neu, für Tests
        this.service = service;
    }
}
```

Puristen stört, dass der alte Konstruktor weiter die konkrete Klasse kennt. Feathers akzeptiert das als Zwischenschritt: Erst testbar machen, später aufräumen.

### Extract Interface

Aus einer konkreten Klasse wird ein Interface extrahiert, gegen das der zu testende Code programmiert. In modernen IDEs ist das eine automatische Aktion. Sinnvoll ist, das Interface nach der Rolle zu benennen, nicht nach der Klasse, also `PaymentGateway` statt `IStripeClient`.

### Subclass and Override Method

Im Test erbt man von der zu testenden Klasse und überschreibt die Methoden, die stören. Dafür macht man sie notfalls von `private` zu `protected`.

```java
class TestableOrderProcessor extends OrderProcessor {
    boolean notified;
    @Override protected void notifyWarehouse(Order o) { notified = true; }
}

@Test
void largeOrdersNotifyWarehouse() {
    var p = new TestableOrderProcessor();
    p.process(new Order(1000));
    assertTrue(p.notified);
}
```

Feathers nennt dies eine der mächtigsten Techniken überhaupt, weil sie fast immer funktioniert, sofern die Methoden nicht `final` oder `static` sind.

### Introduce Static Setter

Für Singletons, die man nicht sofort loswerden kann:

```java
public class PermitRepository {
    private static PermitRepository instance;

    public static PermitRepository getInstance() {
        if (instance == null) instance = new PermitRepository();
        return instance;
    }

    static void setTestingInstance(PermitRepository r) { instance = r; }   // neu
}
```

Das ist unschön und verletzt die Idee des Singletons. Feathers sagt offen, dass Singletons in Testsituationen vor allem eines sind: globale Variablen. Der Setter ist ein Zwischenschritt, bis man die Abhängigkeit über den Konstruktor übergibt.

### Methoden in den Testrahmen

Das Folgekapitel behandelt Methoden, die sich nicht testen lassen: private Methoden, Methoden mit verborgenen Seiteneffekten, Methoden, die Parameter brauchen, die man nicht erzeugen kann. Feathers' Rat zu privaten Methoden: Wenn man das Bedürfnis hat, eine private Methode direkt zu testen, gehört sie vermutlich in eine eigene Klasse. Bis dahin ist es legitim, sie paketsichtbar zu machen.

## Welche Tests schreiben?

In Legacy Code will man nicht prüfen, ob der Code *richtig* ist, sondern festhalten, was er *tatsächlich tut*. Jede Abweichung nach einer Änderung ist ein Signal, egal ob das alte Verhalten fachlich korrekt war.

### Characterization Tests

Der Begriff stammt von Feathers. Ein Characterization Test beschreibt das aktuelle Verhalten eines Codes, nicht das gewünschte. Das Vorgehen:

1. Den Code in einen Testrahmen bringen.
2. Eine Assertion schreiben, von der man **weiß**, dass sie fehlschlägt.
3. Die Fehlermeldung verrät das tatsächliche Verhalten.
4. Den Test so ändern, dass er dieses Verhalten erwartet.
5. Wiederholen, bis man genug Verhalten abgedeckt hat.

```java
@Test
void characterizeShippingForHeavyParcel() {
    var calc = new ShippingCalculator();
    // Schritt 2: absichtlich falscher Wert
    // assertEquals(0.0, calc.cost("DE", 31.5));
    // Fehlermeldung: expected 0.0 but was 47.85

    // Schritt 4: tatsächliches Verhalten festhalten
    assertEquals(47.85, calc.cost("DE", 31.5), 0.001);
}
```

Findet man dabei Verhalten, das offensichtlich ein Fehler ist, ändert man es **nicht** sofort. Man markiert den Test, klärt die Frage fachlich und behebt den Fehler dann als eigene, bewusste Änderung. Andere Teile des Systems könnten sich auf das falsche Verhalten verlassen.

Für komplexe Ausgaben wie Berichte oder generiertes XML hat sich seither die Variante der **Approval-** oder **Golden-Master-Tests** durchgesetzt: Man speichert die ganze Ausgabe und vergleicht künftig dagegen.

### Effect Sketches

Bevor man Tests schreibt, muss man wissen, *wo* eine Änderung Wirkung zeigt. Feathers zeichnet dazu **Effektskizzen**: Kreise für Variablen und Methoden, Pfeile für „beeinflusst“. Man beginnt bei der Stelle, die man ändert, und folgt den Pfeilen nach außen.

Dabei achtet man auf versteckte Wege: Rückgabewerte, geänderte Parameterobjekte, statische und globale Daten, Felder, die andere Methoden später lesen. Die Methoden am Ende der Pfeile sind die Kandidaten für Tests.

### Interception Points und Pinch Points

- Ein **Interception Point** ist eine Stelle, an der ein Test die Auswirkung einer Änderung erkennen kann. Möglichst nah an der Änderung, damit der Test einfach bleibt.
- Ein **Pinch Point** ist ein Engpass in der Effektskizze, durch den die Auswirkungen vieler Änderungen gleichzeitig laufen. Ein Test dort deckt viel ab, mit wenig Aufwand.

Pinch Points sind ideal, wenn man viele Änderungen in einem Bereich plant. Feathers warnt aber: Tests an Pinch Points sind eher Integrationstests. Sie sind gut als Schutz während einer Umbauphase, sollen aber nicht dauerhaft die einzigen Tests bleiben.

### Programming by Difference

Für neue Features in Legacy Code beschreibt Feathers eine Technik, die zunächst gegen alle Regeln verstößt: Man erbt von einer bestehenden Klasse und überschreibt nur das Verhalten, das abweichen soll. So bekommt man das Feature schnell und testgetrieben. Danach refaktoriert man die Vererbung weg, etwa per Extract Superclass oder Delegation, weil sie auf Dauer zur Falle wird. Vererbung dient hier als Gerüst, nicht als Endzustand.

## Code verstehen

Vor jeder Änderung muss man genug verstehen, um sie sicher zu machen. Feathers gibt dafür bewusst einfache, handwerkliche Techniken.

- **Notizen und Skizzen:** Beim Lesen Kästchen und Pfeile auf Papier zeichnen. Keine formale Notation, nur Gedächtnisstütze.
- **Listing Markup:** Code ausdrucken und mit Stiften markieren: Verantwortlichkeiten einfärben, Blöcke einklammern, Auswirkungen von Änderungen mit Pfeilen nachverfolgen.
- **Scratch Refactoring:** Den Code auschecken und hemmungslos refaktorieren, ohne Tests, nur um ihn zu verstehen. Danach **alles verwerfen**. Was bleibt, ist das Verständnis.
- **Ungenutzten Code löschen:** Was nicht gebraucht wird, verwirrt nur. Die Versionskontrolle bewahrt ihn auf.

## „Meine Anwendung hat keine Struktur“

In großen, gewachsenen Systemen kennt oft niemand mehr das Gesamtbild. Feathers schlägt Techniken vor, die Architektur wieder ins Gespräch zu bringen:

- **Die Geschichte des Systems erzählen:** Einer erklärt das System in wenigen Sätzen, ein anderer fragt nach. Was sich nicht einfach erzählen lässt, ist oft der Ort, an dem die Architektur verfallen ist.
- **Naked CRC:** Karteikarten für Klassen oder Komponenten auf dem Tisch verschieben, um Zusammenarbeit zu erklären.
- **Conversation Scrutiny:** Darauf achten, welche Begriffe im Team über das System verwendet werden. Fehlen sie im Code, fehlt dort vermutlich eine Abstraktion.

## „Diese Klasse ist zu groß“

Große Klassen verschleiern Verantwortlichkeiten. Feathers gibt Heuristiken, um verborgene Klassen zu finden:

- **Methoden gruppieren:** Ähnliche Namen deuten auf zusammengehörige Verantwortung.
- **Versteckte Methoden ansehen:** Viele private Methoden sind oft ein Zeichen für eine eigene Klasse.
- **Änderungsgründe suchen:** Welche Entscheidungen könnten sich unabhängig voneinander ändern?
- **Beziehungen zwischen Feldern und Methoden skizzieren:** Eine **Feature Sketch** zeigt, welche Methode welche Felder nutzt. Cluster darin sind Kandidaten für eigene Klassen.
- **Die Hauptverantwortung in einem Satz beschreiben.**

Wichtig: Feathers zerlegt große Klassen nicht auf einmal, sondern schrittweise mit Extract Class, jeweils wenn eine Änderung ohnehin ansteht. Ein großer Umbau ohne Tests wäre genau das Edit and Pray, das er vermeiden will.

## Monster-Methoden

Feathers unterscheidet zwei Arten:

- **Bulleted Methods:** lang, aber flach, eine Folge von Abschnitten. Relativ leicht zu zerlegen.
- **Snarled Methods:** tief verschachtelt, wenige große Blöcke, Variablen über weite Strecken genutzt. Deutlich schwieriger.

### Strategien

- **Sensing Variables:** Temporär ein Feld einführen, das an bestimmter Stelle einen Wert festhält, damit ein Test prüfen kann, ob ein Abschnitt durchlaufen wurde. Nach dem Refactoring wird es wieder entfernt.
- **Extract What You Know:** Mit kleinen Extraktionen beginnen, deren Verhalten man sicher versteht, idealerweise mit wenigen Parametern und ohne Rückgabe von Zustand.
- **Gleaning Dependencies:** Teile, die man testen kann, herauslösen und gezielt absichern, auch wenn die Methode als Ganzes ungetestet bleibt.
- **Break Out Method Object:** Die ganze Methode in eine eigene Klasse verschieben, lokale Variablen werden Felder. Danach lässt sie sich frei zerlegen. Das entspricht Fowlers Replace Function with Command.
- **Skeletonize vs. Find Sequences:** Entweder Bedingungen und Schleifen als Gerüst stehen lassen und den Inhalt extrahieren, oder zusammenhängende Abfolgen über Bedingungen hinweg herauslösen.

## „Wie weiß ich, dass ich nichts kaputt mache?“

Für die riskanten Schritte ohne Tests gibt Feathers Disziplinregeln:

- **Hyperaware Editing:** Bei jeder Tastatureingabe wissen, ob sie Verhalten ändert oder nicht.
- **Single-Goal Editing:** Immer nur eine Sache auf einmal ändern.
- **Preserve Signatures:** Beim Extrahieren Signaturen exakt kopieren, keine Parameter umbenennen oder zusammenfassen. Das reduziert Tippfehler.
- **Lean on the Compiler:** Absichtlich Code brechen, etwa eine Deklaration ändern, und sich vom Compiler alle betroffenen Stellen zeigen lassen.
- **Pair Programming:** Ein zweites Paar Augen bei den kritischen Schritten.

## „Wir sind überwältigt“

Das letzte Kapitel des zweiten Teils ist kurz und fast persönlich. Feathers' Botschaft: Legacy-Arbeit kann frustrierend sein, aber jede Insel aus getestetem Code macht die nächste Änderung leichter. Und es ist befriedigend zu sehen, wie ein verwahrlostes System über Monate besser wird.

## Katalog: Abhängigkeiten aufbrechen

Der dritte Teil enthält 24 Techniken, jeweils mit Schrittfolge, die man **ohne Tests** sicher ausführen kann. Sie sind bewusst klein und mechanisch, damit möglichst wenig schiefgehen kann. Viele sind Spezialfälle von Fowler-Refactorings, optimiert für den ungeschützten ersten Schritt.

| Technik | Kurzbeschreibung | Für Java relevant |
|---|---|---|
| Adapt Parameter | Schwer erzeugbaren Parametertyp durch eigenes, schmales Interface mit Adapter ersetzen | ja |
| Break Out Method Object | Lange Methode in eigene Klasse verschieben, lokale Variablen werden Felder | ja |
| Definition Completion | In C++ eigene Testdefinitionen für deklarierte Methoden bereitstellen | nein |
| Encapsulate Global References | Globale Variablen in eine Klasse packen, die man ersetzen kann | ja |
| Expose Static Method | Methode, die keinen Instanzzustand braucht, statisch machen, um sie ohne Objekt zu testen | ja |
| Extract and Override Call | Störenden Aufruf in eigene Methode auslagern und im Test überschreiben | ja |
| Extract and Override Factory Method | Objekterzeugung im Konstruktor in überschreibbare Methode auslagern | ja |
| Extract and Override Getter | Zugriff auf Feld über überschreibbaren Getter leiten, oft mit Lazy-Initialisierung | ja |
| Extract Implementer | Klasse zum Interface machen, Implementierung in neue Klasse verschieben | ja |
| Extract Interface | Interface aus Klasse extrahieren, Code darauf umstellen | ja |
| Introduce Instance Delegator | Statische Methode zusätzlich als Instanzmethode anbieten, die delegiert | ja |
| Introduce Static Setter | Singleton-Instanz im Test ersetzbar machen | ja |
| Link Substitution | Beim Linken eine Testversion einer Funktion verwenden | selten |
| Parameterize Constructor | Im Konstruktor erzeugte Abhängigkeit als Parameter übergeben | ja |
| Parameterize Method | In einer Methode erzeugte Abhängigkeit als Parameter übergeben | ja |
| Primitivize Parameter | Logik in eine Funktion mit primitiven Parametern auslagern, wenn der Parametertyp untestbar ist | selten |
| Pull Up Feature | Zu testende Methoden in eine abstrakte Oberklasse ohne Abhängigkeiten ziehen | ja |
| Push Down Dependency | Problematische Abhängigkeit in eine Unterklasse schieben, Oberklasse wird testbar | ja |
| Replace Function with Function Pointer | In C Funktionsaufrufe über Zeiger ersetzbar machen | nein |
| Replace Global Reference with Getter | Globale Referenz über überschreibbaren Getter leiten | ja |
| Subclass and Override Method | Im Test erben und störende Methoden überschreiben | ja, sehr häufig |
| Supersede Instance Variable | Nach der Konstruktion eine Instanzvariable per Setter ersetzen | ja |
| Template Redefinition | In C++ Abhängigkeit über Template-Parameter austauschbar machen | nein |
| Text Redefinition | In interpretierten Sprachen Methoden zur Laufzeit neu definieren | nein |

### Ein Muster hinter den Techniken

Fast alle Java-relevanten Techniken folgen einem von zwei Grundmustern:

1. **Von außen hereinreichen:** Parameterize Constructor, Parameterize Method, Supersede Instance Variable, Introduce Static Setter. Die Abhängigkeit wird übergeben statt intern erzeugt.
2. **Überschreibbar machen:** Subclass and Override Method, Extract and Override Call, Factory Method, Getter. Die Abhängigkeit bleibt im Code, aber hinter einer Methode, die der Test ersetzen kann.

Das erste Muster führt langfristig zu Dependency Injection. Das zweite ist schneller und weniger invasiv, hinterlässt aber Vererbungsbeziehungen im Test und `protected`-Methoden im Produktionscode. Feathers bevorzugt meist das erste, nutzt das zweite aber, wenn es schnell gehen muss.

### Expose Static Method

Eine bemerkenswerte Technik, weil sie scheinbar gegen OO-Prinzipien verstößt:

```java
class ShipmentWorkflow {
    // Vorher Instanzmethode in einer Klasse, deren Konstruktor eine DB öffnet.
    // Sie nutzt aber keinen Instanzzustand.
    static void validate(Packet p) {
        if (p.originator() == null) throw new ValidationException("Absender fehlt");
        …
    }
}
```

Jetzt lässt sich `validate` testen, ohne eine Instanz zu erzeugen. Feathers räumt ein, dass das unschön ist, sieht darin aber oft einen Hinweis, dass die Methode in eine andere Klasse gehört.

## Kritik und Einordnung

Von den fünf Büchern dieser Reihe ist dieses vermutlich das praktisch nützlichste, weil fast jeder Entwickler die meiste Zeit mit bestehendem Code arbeitet. Gleichzeitig ist es das Buch, bei dem die Werkzeuge sich seit 2004 am stärksten verändert haben.

### Stärken

- **Realistisch:** Feathers geht von schlechten Bedingungen aus, Zeitdruck, keine Tests, schlechter Code, statt von einem Idealzustand.
- **Ehrlich über Kompromisse:** Er empfiehlt Techniken, die er selbst unschön findet, etwa statische Setter oder `protected`-Methoden nur für Tests, und erklärt, warum sie als Zwischenschritt trotzdem richtig sind.
- **Begriffe:** Seam, Enabling Point, Characterization Test, Sprout, Wrap, Pinch Point sind feste Begriffe geworden.
- **Nachschlagbar:** Die Kapitel als Fragen aus der Praxis machen es zum Werkzeugkasten für konkrete Situationen.
- **Sprachübergreifend:** C, C++, Java, C# und andere werden ernst genommen.

### Was sich seit 2004 verändert hat

| Bereich | 2004 | Heute in Java |
|---|---|---|
| Mocking | handgeschriebene Fakes, erste Mock-Bibliotheken | Mockito, auch für finale Klassen und statische Methoden, MockK in Kotlin |
| Dependency Injection | selten, meist von Hand | Standard über Spring, Jakarta CDI, Guice |
| Refactoring-Werkzeuge | erste automatische Refactorings | IntelliJ IDEA mit sehr breiter, verlässlicher Automatik |
| Integrationstests | teuer, langsam | Testcontainers, eingebettete Datenbanken, schnelle Container |
| Golden-Master-Tests | kaum bekannt | ApprovalTests, Snapshot-Tests |
| Statische Analyse | einfach | SonarQube, Abhängigkeitsanalyse, Architekturtests mit ArchUnit |

Viele der Techniken, die Feathers mühsam von Hand beschreibt, erledigt heute ein Werkzeug. Mockito kann etwa statische Methoden und Konstruktoraufrufe abfangen, was manche Dependency-Breaking-Technik scheinbar überflüssig macht.

Das ist allerdings ein zweischneidiges Schwert: Wer jede Abhängigkeit per Mocking-Magie wegmockt, statt Seams einzuziehen, bekommt zwar Tests, aber kein besseres Design. Die Tests hängen dann stark an der Implementierung und brechen bei jedem Refactoring.

### Kritikpunkte

**1. Unit-Test-Fokus.** Feathers' strenge Unit-Test-Definition war 2004 sinnvoll, weil Integrationstests teuer waren. Heute argumentieren viele, dass schnelle Integrationstests mit echten Datenbanken in Containern bei Legacy-Code oft mehr Sicherheit bringen als viele kleine Unit-Tests mit Mocks.

**2. Klassenebene.** Das Buch arbeitet fast nur auf Ebene von Klassen und Methoden. Für das Zerlegen großer Systeme, etwa eines Monolithen, fehlen Strategien wie Strangler Fig, Branch by Abstraction oder Modularisierung entlang fachlicher Grenzen.

**3. Vererbungsbasierte Techniken.** Subclass and Override und verwandte Techniken hinterlassen Spuren im Produktionscode und funktionieren nicht bei finalen Klassen, die in Kotlin oder modernem Java-Stil häufiger sind.

**4. Wenig zu Daten.** Legacy-Systeme hängen oft stärker an Datenbankschemata, Stored Procedures und Batch-Jobs als an Klassenstrukturen. Das kommt im Buch kaum vor.

**5. Sprache und Beispiele.** Die Codebeispiele wirken alt, vor allem C++ mit Header-Problemen und frühes Java.

### Gesamturteil

Die Werkzeuge haben sich geändert, die Denkweise nicht. Seams, Characterization Tests, Sprout und Wrap und der Algorithmus für Änderungen sind heute genauso gültig wie 2004. Gerade in Zeiten, in denen KI-Werkzeuge in Sekunden große Umbauten vorschlagen, ist Feathers' Disziplin aktueller denn je: erst das Verhalten festhalten, dann ändern.

## Verhältnis zu den anderen Büchern

Feathers schließt die Lücke, die die anderen offenlassen: Er beschreibt den Weg von Code ohne Tests zu Code, auf den man Fowlers Refactorings und Martins Regeln überhaupt erst anwenden kann.

| Aspekt | Martin | Fowler | Ousterhout | GoF | Feathers |
|---|---|---|---|---|---|
| Ausgangslage | eigener, neuer Code | Code mit Tests | Entwurf neuer Systeme | Entwurf neuer Systeme | fremder Code ohne Tests |
| Leitfrage | Ist es sauber? | Wie baue ich sicher um? | Ist es einfacher? | Welche bewährte Lösung passt? | Wie ändere ich, ohne etwas kaputt zu machen? |
| Tests | TDD als Pflicht | Voraussetzung | wichtig, TDD skeptisch | kaum Thema | das eigentliche Ziel des ersten Schritts |
| Kompromisse | ungern | als Abwägung | als Abwägung | als Konsequenzen | ausdrücklich als Zwischenschritt |
| Vererbung | vorsichtig | zunehmend skeptisch | skeptisch | Komposition bevorzugt | pragmatisch als Testwerkzeug |

### Spannende Querbezüge

- **Sprout Class gegen Ousterhout:** Eine Sprout Class kann ein flaches, künstliches Modul sein. Feathers argumentiert, dass sie oft zur fehlenden Abstraktion heranwächst. Ousterhout würde fragen, ob sie die Gesamtkomplexität senkt.
- **Wrap Class und Decorator:** Wrap Class ist Decorator aus der GoF, eingesetzt nicht als Entwurf, sondern als Notbehelf.
- **Subclass and Override gegen Komposition:** Feathers nutzt bewusst Vererbung, obwohl GoF, Fowler und Ousterhout zur Komposition raten. Der Unterschied liegt im Zweck: Die Vererbung dient dem Test, nicht dem Design.
- **Seams und Dependency Injection:** Martins Dependency-Inversion-Prinzip und Feathers' Object Seams beschreiben dieselbe Struktur aus unterschiedlicher Motivation, einmal Design, einmal Testbarkeit.
- **Characterization Tests und Fowler:** Fowlers Refactoring beginnt dort, wo Feathers' Characterization Tests fertig sind.

## Diskussionsfragen

1. **Definition:** Ist „Legacy Code ist Code ohne Tests“ für dich eine brauchbare Definition, oder fehlt etwas, etwa fehlendes Wissen im Team oder veraltete Technologie?
2. **Edit and Pray:** Wie oft arbeitest du ehrlich gesagt noch so? In welchen Situationen ist es vertretbar?
3. **Sprout und Wrap:** Hast du diese Techniken bewusst oder unbewusst genutzt? Hat sich daraus später besseres Design ergeben, oder blieb es Flickwerk?
4. **Mockito-Magie:** Statische Methoden und Konstruktoren lassen sich heute mocken. Ist das ein Fortschritt, oder verhindert es, dass man echte Seams einzieht?
5. **Unit oder Integration:** Bringen bei Legacy-Code mehr kleine Unit-Tests oder wenige breite Tests mit Testcontainers mehr Sicherheit?
6. **Characterization Tests:** Was tust du, wenn ein Test offensichtlich falsches Verhalten festhält, auf das sich vielleicht jemand verlässt?
7. **Größere Maßstäbe:** Wie würdest du Feathers' Ideen auf die Zerlegung eines Monolithen übertragen?
8. **KI-Werkzeuge:** Wenn ein Werkzeug in Sekunden Tests und Umbauten vorschlägt, ersetzt das Feathers' Disziplin oder macht es sie wichtiger?
