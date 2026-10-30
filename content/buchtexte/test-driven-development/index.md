+++
title = "Test-Driven Development: By Example – Zusammenfassung und Einordnung"
description = "Kent Beck, Test-Driven Development: By Example (2002)"
date = 2026-10-30T13:00:08+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["test-driven-development-2002"]
+++

## Einleitung

Das Ziel von TDD fasst Beck mit einer Formulierung zusammen, die er Ron Jeffries zuschreibt: **sauberer Code, der funktioniert.** TDD ist der Weg dorthin, und zwar in einer bestimmten Reihenfolge: erst funktionierend, dann sauber.

### Autor und Kontext

Kent Beck ist einer der einflussreichsten Entwickler der letzten Jahrzehnte. Er hat Extreme Programming begründet, mit Erich Gamma JUnit geschrieben, die Idee der Patterns mit Ward Cunningham in die Software gebracht, den Begriff „Code Smell“ geprägt und das Agile Manifest mitunterzeichnet. Er taucht in fast jedem Buch dieser Reihe auf: bei Fowler als Mitautor, bei Martin mit den vier Regeln des einfachen Designs, bei der GoF als Pattern-Pionier.

TDD war nicht seine Erfindung im strengen Sinn. Er sagt selbst, er habe die Technik „wiederentdeckt“: In alten Programmierbüchern stand bereits der Rat, die erwartete Ausgabe zuerst festzulegen und dann das Programm zu schreiben, bis die Ausgabe passt. Neu war, daraus eine durchgehende, automatisierte Arbeitsweise zu machen.

### Die zwei Regeln

Becks gesamte Methode beruht auf zwei einfachen Regeln:

1. **Schreibe neuen Code nur, wenn ein automatisierter Test fehlschlägt.**
2. **Beseitige Duplikation.**

Aus diesen zwei Regeln folgt alles andere: dass Tests vor dem Code entstehen, dass man in kleinen Schritten arbeitet, dass Design durch Refactoring entsteht. Bemerkenswert ist, wie viel weniger Regeln das sind als Martins drei Gesetze von TDD, die sich auf Beck berufen.

### Aufbau

| Teil | Kapitel | Inhalt |
|---|---|---|
| I. Das Geld-Beispiel | 1–17 | Ein Mehrwährungs-Beispiel in Java, Schritt für Schritt testgetrieben entwickelt |
| II. Das xUnit-Beispiel | 18–24 | Ein Testframework in Python, das sich selbst testet |
| III. Muster für TDD | 25–32 | Ein Katalog von Mustern und ein Kapitel mit Fragen und Antworten |

Mit rund 220 Seiten ist es das kürzeste Buch dieser Reihe. Die beiden Beispielteile machen fast zwei Drittel aus: Beck will die Methode **zeigen**, nicht nur beschreiben, im selben Geist wie Fowlers erstes Kapitel in *Refactoring*.

### Der Ton

Beck schreibt persönlich, oft in der Ich-Form, und spricht offen über Gefühle wie Angst, Langeweile und Zuversicht. Er stellt TDD nicht als Pflicht dar, sondern als eine Technik, die ihm hilft. Diese Haltung unterscheidet sich deutlich von der Art, wie TDD später in der Debatte vertreten wurde.

## Der Rhythmus

TDD ist vor allem ein Rhythmus. Beck beschreibt ihn als Mantra: **Rot, Grün, Refactor.**

{{< bild src="bild-1.png" alt="Becks Zyklus · drei Schritte, die sich wiederholen" >}}

Becks Zyklus · drei Schritte, die sich wiederholen

1. **Rot:** Einen kleinen Test schreiben, der nicht funktioniert, anfangs vielleicht nicht einmal kompiliert.
2. **Grün:** Den Test so schnell wie möglich zum Laufen bringen. Dabei sind alle Sünden erlaubt, auch Kopieren und fest eingetragene Rückgabewerte.
3. **Refactor:** Alle Duplikation beseitigen, die beim Grün-Machen entstanden ist. Die Tests bleiben dabei grün.

Der entscheidende Punkt: **Funktionieren und sauber machen sind getrennte Schritte.** Beck löst das Problem „sauberer Code, der funktioniert“, indem er es teilt: erst den funktionierenden Teil, dann den sauberen. Das ist dieselbe Idee wie Becks „zwei Hüte“, die Fowler in *Refactoring* übernimmt.

### Die Testliste

Bevor Beck anfängt, schreibt er eine **Liste** aller Tests, die ihm einfallen, auf ein Blatt Papier. Während der Arbeit kommen neue Einträge hinzu, erledigte werden durchgestrichen. Die Liste hat zwei Aufgaben: Sie hält fest, was noch zu tun ist, und sie erlaubt, sich auf einen einzigen Test zu konzentrieren, ohne die anderen zu vergessen. Neue Ideen landen auf der Liste, statt den aktuellen Schritt zu unterbrechen.

### TDD und Angst

Eine ungewöhnliche These des Buchs: TDD ist ein Werkzeug, um mit **Angst** umzugehen. Angst macht Entwickler zögerlich, schweigsam und abgeneigt gegen Feedback. Tests verwandeln diffuse Angst in konkrete Sicherheit: Man weiß, was funktioniert. Beck vergleicht Tests mit dem Seil und den Haken beim Klettern: Man kann mutigere Schritte wagen, weil ein Sturz nicht tief geht.

### Schrittgröße

Die Schritte im Buch sind oft absurd klein, etwa ein Test, der nur eine Konstante prüft, und eine Implementierung, die diese Konstante zurückgibt. Beck betont aber: **Man muss nicht immer so klein arbeiten, man muss es nur können.** Wenn man sicher ist, macht man große Schritte. Wenn etwas schiefgeht oder man unsicher wird, schaltet man zurück auf kleine Schritte, wie in einem Getriebe. Diese Flexibilität geht in der späteren Debatte über TDD oft verloren.

## Teil I: Das Geld-Beispiel

Der erste Teil zeigt TDD über 17 kurze Kapitel an einem einzigen Problem: einem Bericht, der Beträge in **mehreren Währungen** zusammenrechnen soll. Die Anforderung lautet sinngemäß: Fünf Dollar plus zehn Franken ergeben zehn Dollar, wenn der Kurs zwei zu eins ist.

### Wie Beck vorgeht

Beck beginnt nicht mit der schwierigen Anforderung, sondern mit der einfachsten, die ihn voranbringt: Multiplikation eines Dollarbetrags. Von dort aus arbeitet er sich vor:

- Er macht `Dollar` zu einem **Wertobjekt** mit Gleichheit über den Wert, Becks frühes Beispiel für das, was Evans später Value Object nennt.
- Er führt `Franc` ein, zunächst durch **schamloses Kopieren** von `Dollar`. Das erzeugt Duplikation, die er in den folgenden Kapiteln Schritt für Schritt beseitigt, bis beide in einer gemeinsamen Klasse `Money` aufgehen.
- Für die Addition verschiedener Währungen entsteht die Idee eines **Ausdrucks**: `5 USD + 10 CHF` ist noch kein Betrag, sondern ein Ausdruck, der erst eine `Bank` mit Wechselkursen in eine Zielwährung umrechnet. Damit ist das Design im Kern das Composite- und Interpreter-Muster, aber es entsteht aus den Tests, nicht aus einem Plan.

Das Beispiel zeigt die These des Buchs: **Ein brauchbares Design kann aus Tests und konsequentem Beseitigen von Duplikation entstehen**, auch ohne großes Vorabdesign.

### Ein eigenes Beispiel in Java

Dasselbe Vorgehen an einem anderen Problem: Temperaturen in Celsius und Fahrenheit.

**Testliste zu Beginn:**

- 20 °C sind gleich 20 °C
- 0 °C in Fahrenheit sind 32 °F
- 100 °C in Fahrenheit sind 212 °F
- Temperaturen in verschiedenen Einheiten vergleichen

**Schritt 1, Rot:** Der erste Test kompiliert nicht einmal, weil es `Temperature` noch nicht gibt.

```java
@Test
void sameValueAndUnitAreEqual() {
    assertEquals(Temperature.celsius(20), Temperature.celsius(20));
}
```

**Schritt 1, Grün:** Ein Record genügt, die Gleichheit kommt kostenlos.

```java
record Temperature(double value, Unit unit) {
    enum Unit { CELSIUS, FAHRENHEIT }
    static Temperature celsius(double v) { return new Temperature(v, Unit.CELSIUS); }
}
```

**Schritt 2, Rot und Grün mit „Fake It“:**

```java
@Test
void freezingPointInFahrenheit() {
    assertEquals(32.0, Temperature.celsius(0).inFahrenheit(), 0.001);
}

// Grün durch eine Konstante, bewusst
double inFahrenheit() { return 32.0; }
```

**Schritt 3, Triangulieren:** Ein zweiter Fall erzwingt die echte Formel.

```java
@Test
void boilingPointInFahrenheit() {
    assertEquals(212.0, Temperature.celsius(100).inFahrenheit(), 0.001);
}

double inFahrenheit() { return value * 9 / 5 + 32; }
```

**Schritt 4, Refactor:** Die Konstante 32 und die Formel stehen jetzt an einer Stelle. Der nächste Eintrag der Testliste, der Vergleich über Einheiten hinweg, führt zu einer Methode `inCelsius()` und einer Gleichheit über den umgerechneten Wert, und dabei zu der Frage, ob Gleichheit über Einheiten hinweg überhaupt ein Record-`equals` sein sollte oder eine eigene Methode `isSameAs`. Solche Designfragen entstehen in TDD genau in dem Moment, in dem ein Test sie erzwingt.

### Was das Beispiel lehrt

- Man beginnt mit dem **einfachsten** Test, der einen Schritt weiterbringt, nicht mit dem wichtigsten.
- **Duplikation zwischen Test und Code** ist ebenfalls Duplikation: Die 32 im Test und die 32 im Code sind ein Hinweis, dass die Implementierung noch nicht allgemein ist.
- Das Design wächst mit jedem Test, und der Code ist zu jedem Zeitpunkt lauffähig.

## Drei Wege zu Grün

Der vielleicht nützlichste praktische Teil des Buchs: Beck benennt drei Strategien, um einen roten Test grün zu bekommen, und sagt, wann welche passt.

| Strategie | Vorgehen | Wann |
|---|---|---|
| **Fake It** | Eine Konstante zurückgeben, dann schrittweise durch Variablen und Logik ersetzen | wenn man unsicher ist oder schnell grün werden will |
| **Triangulate** | Erst mit einem zweiten, anderen Beispiel verallgemeinern | wenn man die richtige Abstraktion noch nicht sieht |
| **Obvious Implementation** | Gleich die richtige Lösung schreiben | wenn sie offensichtlich ist und man sicher ist |

### Fake It

Das wirkt auf viele zunächst albern: Warum eine Konstante zurückgeben, wenn man die Formel kennt? Becks Antwort hat zwei Teile. Erstens ist man sofort grün und kann dann in sicheren Schritten verallgemeinern. Zweitens ist die Duplikation zwischen Test und Code, etwa die 32 hier wie dort, selbst ein Hinweis darauf, was als Nächstes zu tun ist. Man ersetzt die Konstante Schritt für Schritt, bis sie aus Variablen berechnet wird.

```java
// Schritt a: Fake
int sum(List<Integer> xs) { return 6; }           // Test: sum(1,2,3) == 6

// Schritt b: Konstante aus den Daten herleiten
int sum(List<Integer> xs) { return 1 + 2 + 3; }

// Schritt c: verallgemeinern
int sum(List<Integer> xs) { return xs.stream().mapToInt(Integer::intValue).sum(); }
```

### Triangulate

Man verallgemeinert nur dann, wenn **zwei oder mehr** Beispiele es erzwingen. Mit nur einem Test könnte jede Konstante richtig sein. Ein zweiter, verschiedener Test zeigt, welche Teile variieren. Beck nutzt diese Technik nach eigener Aussage nur, wenn er wirklich unsicher ist, weil sie mehr Tests erzeugt, als man langfristig braucht.

### Obvious Implementation

Wenn die Lösung klar ist, schreibt man sie direkt hin. Beck macht das meistens so. Er schaltet aber zurück auf Fake It oder Triangulate, sobald ein „offensichtlicher“ Schritt unerwartet rot wird. Hier kommt das Getriebe-Bild zurück: hochschalten, solange es läuft, herunterschalten, wenn es holpert.

### One to Many

Eine verwandte Technik: Wenn eine Operation später mit einer Sammlung arbeiten soll, implementiert man sie zuerst für ein einzelnes Element und verallgemeinert dann. Das hält die Schritte klein und die Zwischenzustände lauffähig.

### Einordnung

Fake It und Triangulate gehören zu den am häufigsten missverstandenen Teilen von TDD. Kritiker sehen darin Zeitverschwendung. Becks eigentliche Botschaft ist aber nicht „mach immer Fake It“, sondern: **Es gibt einen Rückweg.** Wer mit Obvious Implementation scheitert, hat eine sichere Methode, um in kleineren Schritten weiterzukommen, statt im Debugger zu versinken.

## Teil II: Das xUnit-Beispiel

Im zweiten Teil baut Beck testgetrieben ein **Testframework**, und zwar in Python. Das ist ein bewusst schwieriges Beispiel: Ein Testframework muss sich mit sich selbst testen, ein Henne-Ei-Problem.

### Der historische Hintergrund

Beck hatte mit **SUnit** für Smalltalk das erste Framework dieser Art geschrieben. 1997 entstand daraus mit Erich Gamma auf einem Flug zu einer Konferenz **JUnit**, angeblich beim gemeinsamen Programmieren im Flugzeug. Danach folgte eine ganze Familie: NUnit, CppUnit von Feathers, PyUnit und viele mehr, zusammengefasst als **xUnit**.

### Wie das Framework entsteht

Beck beginnt mit dem kleinsten Kern: einer Klasse, die eine Testmethode aufrufen und festhalten kann, dass sie lief. Darauf baut er auf:

1. **Eine Testmethode ausführen** und prüfen, dass sie aufgerufen wurde.
2. `setUp`** vor jedem Test** aufrufen.
3. `tearDown`** nach jedem Test** aufrufen, auch wenn der Test fehlschlägt.
4. Die Reihenfolge der Aufrufe über einen **Log-String** prüfen: Jede Methode hängt ihren Namen an, und der Test vergleicht den String.
5. **Ergebnisse sammeln:** wie viele Tests liefen, wie viele scheiterten.
6. **Fehlgeschlagene Tests** melden, ohne dass das Framework abbricht.
7. **Suites:** mehrere Tests zusammen ausführen.

### Muster, die dabei entstehen

Das Framework enthält, ohne dass Beck sie vorab plant, mehrere bekannte Muster:

| Muster | Wo im Framework | Entspricht in JUnit 5 |
|---|---|---|
| Template Method | Ablauf: `setUp`, Test, `tearDown` | `@BeforeEach`, `@Test`, `@AfterEach` |
| Pluggable Selector | Testmethode wird über ihren Namen aufgerufen | Methoden mit `@Test` per Reflection gefunden |
| Collecting Parameter | Ein Ergebnisobjekt wird durch alle Tests gereicht | Test-Listener und Reports |
| Composite | Eine Suite verhält sich wie ein einzelner Test | verschachtelte Testklassen, `@Nested`, Suites |
| Log String | Reihenfolge von Aufrufen als String prüfen | in eigenen Tests nutzbar |

### Was der Teil zeigt

- TDD funktioniert auch bei **selbstbezüglichem** Code, wenn man mit sehr kleinen Schritten beginnt.
- TDD funktioniert in einer **dynamischen Sprache**, in der der Compiler weniger hilft. Die Tests übernehmen dort einen Teil der Prüfung, die in Java der Compiler leistet.
- Entwurfsmuster **entstehen** aus den Tests, wenn sie gebraucht werden, ganz im Sinne von Kerievskys späterem *Refactoring to Patterns*.

### Einordnung

Dieser Teil wird von vielen Lesern übersprungen, weil er technisch speziell wirkt. Er ist aber lehrreich, weil er zeigt, wie gut verstandene Frameworks aussehen: wenige Konzepte, die sich sauber kombinieren lassen. JUnit 5 hat sich zwar architektonisch weit entfernt, mit einer Plattform, Erweiterungsmodell und mehreren Engines, aber der Kern aus Testmethode, Setup, Teardown und Ergebnis ist bis heute derselbe.

## Teil III: Muster für TDD

Der dritte Teil ist ein Katalog kurzer Muster, im Stil eines Pattern-Buchs. Viele davon sind eher Arbeitsgewohnheiten als technische Muster.

### TDD-Muster

| Muster | Kern |
|---|---|
| Isolated Test | Tests beeinflussen sich nicht gegenseitig, jeder läuft allein und in jeder Reihenfolge. |
| Test List | Vor dem Start alle Tests auflisten, die einem einfallen. |
| Test First | Den Test schreiben, bevor der Code existiert. |
| Assert First | Beim Schreiben eines Tests mit der Assertion beginnen und rückwärts arbeiten. |
| Test Data | Daten verwenden, die den Test leicht lesbar machen, nicht realistische Daten um jeden Preis. |
| Evident Data | Den Zusammenhang zwischen Eingabe und Ergebnis im Test sichtbar machen. |

**Assert First** ist ein unterschätzter Trick: Man fragt zuerst, was am Ende wahr sein soll, und leitet daraus ab, was man dafür aufbauen muss.

```java
@Test
void reservationExpiresAfterFifteenMinutes() {
    // 1. zuerst geschrieben: was soll gelten?
    // assertTrue(reservation.isExpiredAt(start.plus(Duration.ofMinutes(15))));

    // 2. dann rückwärts: was braucht man dafür?
    var start = Instant.parse("2026-10-30T10:00:00Z");
    var reservation = Reservation.openedAt(start);
    assertTrue(reservation.isExpiredAt(start.plus(Duration.ofMinutes(15))));
}
```

**Evident Data** heißt etwa, `assertEquals(100 * 0.19, tax)` zu schreiben statt `assertEquals(19.0, tax)`, damit der Leser die Rechnung sieht.

### Red-Bar-Muster: welcher Test als nächstes?

| Muster | Kern |
|---|---|
| One Step Test | Den Test wählen, der einen lehrt und den man sicher umsetzen kann. |
| Starter Test | Mit einem Test beginnen, der fast nichts tut, etwa für eine leere Eingabe. |
| Explanation Test | Anderen eine Sache mit einem Test erklären. |
| Learning Test | Tests für fremde Bibliotheken schreiben, um sie zu verstehen. |
| Another Test | Ideen, die vom Thema abschweifen, als neuen Test auf die Liste setzen. |
| Regression Test | Bei einem Fehler zuerst den kleinsten Test schreiben, der ihn zeigt. |
| Break | Pause machen, wenn man müde ist oder feststeckt. |
| Do Over | Wenn man sich verrannt hat: alles wegwerfen und neu anfangen. |
| Cheap Desk, Nice Chair | An Möbeln sparen, nicht am Stuhl, auf dem man sitzt. |

Die letzten drei zeigen Becks Ton: TDD ist für ihn auch eine Frage von Ermüdung, Ergonomie und Selbstfürsorge. **Do Over** ist dabei radikal: Wer sich in einem Zustand verfangen hat, verliert mit Neuanfang meist weniger Zeit als mit Weiterkämpfen.

Der **Learning Test** taucht später bei Grenning in Clean Code wieder auf, für das Einkapseln fremder APIs.

### Testing-Muster

| Muster | Kern |
|---|---|
| Child Test | Ein Test ist zu groß? Einen kleineren schreiben, der einen Teil abdeckt, und dann zurückkehren. |
| Mock Object | Eine teure oder schwierige Abhängigkeit durch eine Attrappe mit festen Antworten ersetzen. |
| Self Shunt | Die Testklasse selbst als Attrappe benutzen, indem sie das benötigte Interface implementiert. |
| Log String | Aufrufreihenfolgen über einen String prüfen. |
| Crash Test Dummy | Fehlerfälle mit einem Objekt testen, das gezielt Ausnahmen wirft. |
| Broken Test | Allein arbeitend: den Tag mit einem fehlschlagenden Test beenden, um morgen sofort zu wissen, wo man war. |
| Clean Check-in | Im Team: nur einchecken, wenn alle Tests grün sind. |

```java
// Self Shunt: die Testklasse ist ihr eigener Listener
class DownloaderTest implements ProgressListener {
    private int lastPercent = -1;
    @Override public void progress(int percent) { lastPercent = percent; }

    @Test
    void reportsCompletion() {
        new Downloader(this).download(smallFile());
        assertEquals(100, lastPercent);
    }
}

// Crash Test Dummy: Fehlerfall gezielt auslösen
class FullDisk implements Storage {
    public void write(byte[] data) throws IOException { throw new IOException("Datenträger voll"); }
}
```

Bemerkenswert ist **Broken Test** gegen **Clean Check-in**: Allein darf man absichtlich rot aufhören, im Team nie.

### Green-Bar-Muster

Die Strategien, um einen roten Test grün zu machen, also Fake It, Triangulate, Obvious Implementation und One to Many, sind oben beschrieben. Sie bilden den Kern des praktischen Handwerks.

### xUnit-Muster

| Muster | Kern |
|---|---|
| Assertion | Ergebnisse automatisch mit booleschen Ausdrücken prüfen, nicht von Hand. Möglichst über die öffentliche Schnittstelle, nicht über Interna. |
| Fixture | Gemeinsames Setup mehrerer Tests auslagern, wenn die Tests dadurch lesbarer werden. |
| External Fixture | Externe Ressourcen nach dem Test aufräumen, auch bei Fehlschlag. |
| Test Method | Ein Test pro Methode, Name beschreibt den Fall. |
| Exception Test | Erwartete Ausnahmen prüfen. |
| All Tests | Eine Möglichkeit, alle Tests gemeinsam auszuführen. |

Beim Fixture ist Beck abwägend: Gemeinsames Setup spart Wiederholung, aber ein Test, dessen Ausgangslage man woanders suchen muss, ist schwerer zu verstehen. Duplikation in Tests ist für ihn kein absolutes Übel, wenn sie die Lesbarkeit verbessert. Martin übernimmt diese Haltung in Clean Code als „doppelten Standard“ für Tests.

```java
// Exception Test in JUnit 5
@Test
void rejectsNegativeAmount() {
    var account = new Account();
    assertThrows(IllegalArgumentException.class, () -> account.withdraw(Money.of(-5)));
}
```

### Design-Muster

Beck zeigt, welche Entwurfsmuster in TDD typischerweise entstehen. Bemerkenswert ist, dass sie nicht vorab gewählt, sondern beim Refaktorieren **gefunden** werden.

| Muster | Typischer Anlass in TDD |
|---|---|
| Command | Ein Aufruf soll später, wiederholt oder rückgängig ausgeführt werden. |
| Value Object | Ein Objekt soll geteilt werden, ohne dass jemand es ändert. |
| Null Object | Sonderfall „nichts“ ohne Prüfung auf null darstellen |
| Template Method | Ablauf festlegen, Varianten in Unterklassen |
| Pluggable Object | Variation über ein austauschbares Objekt statt über Bedingungen |
| Pluggable Selector | Methode über ihren Namen auswählen, sparsam einsetzen |
| Factory Method | Flexibilität beim Erzeugen, etwa für Tests |
| Imposter | Ein neues Objekt mit derselben Schnittstelle wie ein bestehendes einführen |
| Composite | Ein Objekt verhält sich wie eine Sammlung von Objekten derselben Art. |
| Collecting Parameter | Ein Objekt wird durch mehrere Methoden gereicht und sammelt Ergebnisse. |
| Singleton | Beck rät davon ab, globale Variablen über Singletons zu verstecken. |

Das **Imposter** ist ein typischer TDD-Gedanke: Ein neues Verhalten wird als Objekt eingeführt, das sich nach außen wie ein bekanntes verhält, so wie `Sum` im Geld-Beispiel sich wie ein `Money` verhält.

### Refactoring-Muster

Becks Refactorings überschneiden sich mit Fowler, haben aber zwei eigene Akzente:

- **Reconcile Differences:** Zwei ähnliche Codestücke schrittweise einander angleichen, bis sie identisch sind und eines entfernt werden kann. Das war der Weg von `Dollar` und `Franc` zu `Money`.
- **Isolate Change:** Den Teil, der sich ändern soll, zuerst in eine eigene Methode oder ein eigenes Objekt auslagern, dann nur dort ändern.
- **Migrate Data:** Eine Darstellung durch eine andere ersetzen, indem man zeitweise beide parallel pflegt.

Dazu kommen bekannte Refactorings wie Extract Method, Inline Method, Extract Interface, Move Method, Method Object und Add Parameter.

**Migrate Data** ist im Kleinen, was später als „Parallel Change“ oder „Expand and Contract“ für Datenbanken und APIs bekannt wurde: erst das Neue hinzufügen, dann umstellen, dann das Alte entfernen, ohne dass zwischendurch etwas kaputt ist.

## TDD meistern: Becks Fragen und Antworten

Das letzte Kapitel ist eine Sammlung von Fragen, die Beck immer wieder gestellt wurden. Es ist der Teil, der am deutlichsten zeigt, wie **undogmatisch** er TDD selbst sieht.

### Wie groß sollen die Schritte sein?

So groß wie möglich, so klein wie nötig. Wer TDD beherrscht, kann in winzigen Schritten arbeiten, muss es aber nicht. Die Schrittgröße hängt von Erfahrung, Sicherheit und Werkzeugen ab: Wenn automatische Refactorings in der IDE verlässlich sind, darf man größere Schritte wagen.

### Was muss man nicht testen?

Beck zitiert sinngemäß die Antwort eines Kollegen: **Schreibe Tests, bis aus Angst Langeweile wird.** Konkret testet er Bedingungen, Schleifen, Operationen und Polymorphie im eigenen Code. Code anderer testet er nur, wenn es einen Grund gibt, etwa bekannte Fehler in einer Bibliothek.

### Woran erkennt man schlechte Tests?

Beck nennt Warnsignale, die meist auf ein **Designproblem** im Produktionscode hinweisen:

- **Lange Setups:** Das Objekt hat zu viele Abhängigkeiten oder ist zu groß.
- **Duplizierte Setups:** Mehrere Objekte sind zu eng miteinander verflochten.
- **Langsame Tests:** Sie laufen zu selten und verlieren ihren Wert.
- **Zerbrechliche Tests:** Sie brechen bei unerwarteten Änderungen, ein Zeichen für zu enge Kopplung.

Das ist im Kern Feathers' Gedanke, dass Testbarkeit ein Designsignal ist.

### Wann löscht man Tests?

Wenn ein Test weder zusätzliches Vertrauen schafft noch etwas erklärt, kann er weg. Zwei sich überschneidende Tests behält man nur, wenn sie verschiedene Szenarien für den Leser verständlich machen.

### Führt TDD zu Frameworks?

Paradoxerweise ja: Weil man nicht für die Zukunft plant, sondern nur Duplikation beseitigt, entsteht Code, der sich gut an neue Anforderungen anpassen lässt. Allgemeinheit entsteht durch Refactoring, wenn der dritte Fall kommt, nicht durch Vorahnung.

### Kann man große Systeme testgetrieben bauen?

Beck bejaht das aus eigener Erfahrung mit großen Systemen. Die Zahl der Tests wächst, aber auch die Sicherheit, Änderungen vorzunehmen.

### Kann man mit Akzeptanztests treiben?

Anwendungsweite Tests, die Kunden mitschreiben, sieht Beck skeptisch als Treiber für den Mikrozyklus: Sie sind zu langsam und zu grob für den Rot-Grün-Rhythmus. Sie haben ihren Platz, aber auf einer anderen Ebene.

### Wie steigt man mitten im Projekt um?

Das ist das schwierigste Problem: Code, der ohne Tests entstanden ist, lässt sich schlecht testen. Beck rät, bei Änderungen anzufangen und den betroffenen Bereich schrittweise abzusichern, und verweist auf Refactoring mit großer Vorsicht. Das ist genau das Problem, für das Feathers zwei Jahre später sein ganzes Buch schreibt.

### Warum funktioniert TDD?

Becks Erklärung ist bescheiden: weniger Fehler, kürzere Rückkopplung, weniger Zeit im Debugger, und Entwickler, die mit mehr Zuversicht arbeiten. Er beansprucht keine wissenschaftlichen Beweise, sondern beschreibt Erfahrungen.

### TDD und Extreme Programming

TDD wirkt laut Beck am besten zusammen mit anderen XP-Praktiken: Paarprogrammierung, ausgeruhtes Arbeiten, Continuous Integration, einfaches Design und Refactoring. Allein funktioniert es auch, aber weniger stark.

## Nach dem Buch: Schulen, Debatten, Präzisierungen

TDD hat sich nach 2002 in eine Richtung entwickelt, die Beck nicht immer geteilt hat. Für unsere Reihe ist das wichtig, weil die anderen Autoren oft auf diese spätere Form reagieren, nicht auf das Buch.

### Zwei Schulen

|  | Chicago- oder Detroit-Schule (klassisch) | London-Schule (mockistisch) |
|---|---|---|
| Vertreter | Beck, das Geld-Beispiel | Freeman und Pryce, *Growing Object-Oriented Software, Guided by Tests* (2009) |
| Richtung | eher von innen nach außen | von außen nach innen, vom Akzeptanztest zur Einheit |
| Prüfen | Zustand und Ergebnisse | Interaktionen zwischen Objekten |
| Abhängigkeiten | echte Objekte, wo möglich | Mocks für Nachbarobjekte |
| Stärke | robuste Tests, Design entsteht beim Refactoring | Schnittstellen entstehen früh aus der Sicht des Aufrufers |
| Risiko | Design kann zu spät sichtbar werden | Tests hängen eng an der Implementierung |

Fowler hat den Unterschied 2007 in seinem Artikel *Mocks Aren't Stubs* beschrieben. Viele Konflikte in Teams über „richtiges“ TDD sind in Wahrheit Konflikte zwischen diesen Schulen.

### Strenger als Beck: Martins drei Gesetze

Robert C. Martin hat um 2005 „drei Gesetze von TDD“ formuliert, die er Beck zuschreibt, aber deutlich strenger fasst: kein Produktionscode ohne fehlschlagenden Test, nicht mehr Test als nötig, nicht mehr Code als nötig, in Zyklen von Sekunden. Diese Fassung hat das Bild von TDD als Dogma stark geprägt, und gegen sie richten sich Ousterhouts Kritik und viele andere Einwände.

### Becks eigene Relativierungen

- **2008:** In einer viel zitierten Antwort auf Stack Overflow schrieb Beck sinngemäß, er werde für Code bezahlt, der funktioniert, nicht für Tests. Er teste so wenig wie möglich, um ein bestimmtes Maß an Zuversicht zu erreichen.
- **2014:** David Heinemeier Hansson, Erfinder von Ruby on Rails, provozierte mit dem Blogbeitrag *TDD is dead. Long live testing.* Er kritisierte „testgetriebenen Designschaden“: Code, der für Testbarkeit mit Mocks und Indirektionen verbogen wird. Es folgte eine Reihe von Videogesprächen mit Beck und Fowler unter dem Titel *Is TDD Dead?*. Beck verteidigte TDD als persönliches Werkzeug, räumte aber ein, dass übermäßiges Mocking ein echtes Problem ist.
- **2019:** Mit den *Test Desiderata* beschrieb Beck wünschenswerte Eigenschaften von Tests, etwa isoliert, schnell, deterministisch, verhaltensbezogen statt strukturabhängig, lesbar. Er betont, dass diese Eigenschaften im Konflikt stehen und abgewogen werden müssen.
- **2023:** Im Artikel *Canon TDD* stellte Beck klar, was er unter TDD versteht, weil der Begriff verwässert sei: eine Liste von Testszenarien schreiben, genau eines davon in einen lauffähigen Test verwandeln, ihn bestehen lassen, gegebenenfalls refaktorieren, wiederholen. Er nennt typische Fehler, etwa Refactoring beim Grün-Machen zu mischen oder berechnete Werte aus dem Code in die erwarteten Werte zu kopieren.

### Was die Forschung sagt

Empirische Studien zu TDD sind gemischt. Eine bekannte Fallstudie bei Microsoft und IBM von 2008 fand deutlich weniger Fehler vor der Auslieferung bei spürbar längerer Entwicklungszeit. Andere Studien und Metaanalysen finden kleinere oder uneinheitliche Effekte, oft mit dem Einwand, dass schwer zu trennen ist, ob der Nutzen vom **Test-zuerst** kommt oder einfach von **vielen kleinen Schritten mit Tests**. Für McConnells Leser ist das keine Überraschung: Tests sind ein Werkzeug unter mehreren.

## Kritik und Einordnung

Das Buch ist kurz, persönlich und erstaunlich bescheiden. Die meisten Einwände gegen TDD treffen weniger das Buch als seine spätere Rezeption.

### Stärken

- **Zeigen statt behaupten:** Zwei Drittel des Buchs sind durchgearbeitete Beispiele. Man sieht jeden Schritt, auch die Umwege.
- **Wenige, klare Regeln:** zwei Regeln und ein Rhythmus. Alles andere ist Handwerk.
- **Flexibilität:** Schrittgröße, Strategien zu Grün, das Getriebe-Bild. TDD ist bei Beck kein starres Protokoll.
- **Menschliche Seite:** Angst, Müdigkeit, Pausen, Neuanfang. Kein anderes Buch der Reihe spricht so offen über die psychologische Seite des Programmierens.
- **Design aus Duplikation:** Die Idee, dass gutes Design entsteht, wenn man konsequent Duplikation beseitigt, ist der Kern von Becks vier Regeln des einfachen Designs.

### Kritikpunkte

**1. Spielzeugbeispiele.** Geld und ein Testframework sind überschaubare, gut definierte Probleme ohne Datenbank, Netzwerk, Oberfläche oder Fremdsysteme. Wie TDD mit diesen Abhängigkeiten aussieht, zeigt das Buch kaum. Dafür braucht man GOOS oder Feathers.

**2. Sehr kleine Schritte wirken künstlich.** Viele Leser empfinden Fake It und Triangulate im Buch als übertrieben. Beck betont zwar, dass man nicht immer so klein arbeiten muss, aber die Beispiele zeigen fast nur die kleinste Gangstufe.

**3. Design aus Tests allein?** Ousterhouts Einwand trifft einen echten Punkt: Wer nur den nächsten Test im Blick hat, kann lokal gute, aber global schwache Strukturen bauen. Becks Antwort, Refactoring und Duplikationsbeseitigung, funktioniert gut für Klassen, weniger für Systemgrenzen und Architektur.

**4. Wenig zu Testarten.** Integrationstests, Akzeptanztests, Property-Based Testing, Tests über Systemgrenzen und das Verhältnis zwischen ihnen kommen kaum vor.

**5. Wenig Empirie.** Wie fast alle Bücher der Reihe argumentiert es aus Erfahrung. Beck ist dabei aber vorsichtiger als viele, die ihn zitieren.

### Gesamturteil

Wer TDD nur aus der Debatte kennt, wird überrascht sein, wie wenig dogmatisch die Quelle ist. Das Buch beschreibt eine Technik, die einem einzelnen Entwickler Sicherheit und Rhythmus gibt, nicht eine Pflicht für ganze Organisationen. Als Lektüre lohnt es sich vor allem wegen des Rhythmus und der drei Wege zu Grün. Für den Alltag mit Datenbanken, Frameworks und Legacy-Code braucht man zusätzlich Feathers und GOOS.

## Der TDD-Streit der Reihe

TDD war der größte offene Streitpunkt dieser Buchreihe. Mit der Quelle in der Hand lässt sich jede Position besser einordnen.

| Autor | Position | Im Licht von Beck |
|---|---|---|
| Martin | drei Gesetze, TDD als Berufspflicht, Zyklen von Sekunden | deutlich strenger als Beck, der Schrittgröße und Strenge situativ wählt |
| Ousterhout | TDD ist taktisch, verhindert Design; nur bei Bugfixes Test zuerst | trifft Martins Fassung mehr als Becks; Becks Regression Test deckt sich mit Ousterhouts Ausnahme |
| Fowler | selbsttestender Code ist Voraussetzung, TDD bevorzugt | nah an Beck, mit dem er eng zusammenarbeitet |
| Feathers | Tests als Schraubstock, Characterization Tests | beantwortet Becks offene Frage, wie man mitten im Projekt umsteigt |
| Thomas und Hunt | Testen ist Design, aber Gesamtbild nicht verlieren | nah an Becks These, dass schlechte Tests auf Designprobleme hinweisen |
| McConnell | Tests finden allein zu wenig Fehler, Reviews gehören dazu | ergänzt Beck um eine Perspektive, die TDD nicht abdeckt |
| Bloch | Tests kaum Thema | – |
| Weidig | reine Funktionen sind trivial testbar | verkleinert den Teil, für den man aufwändige TDD-Technik braucht |

### Was bleibt

- Die **Mechanik** von TDD ist weniger umstritten als der **Status**: Kaum jemand bestreitet, dass kleine Schritte mit schneller Rückkopplung helfen. Gestritten wird, ob man es immer, zwingend und test-zuerst tun muss.
- **Beck selbst** steht näher bei den Kritikern, als die Debatte vermuten lässt: Er sieht TDD als eigenes Werkzeug, nicht als Pflicht, und Tests als Mittel zur Zuversicht, nicht als Selbstzweck.
- Die wichtigste Unterscheidung ist oft nicht TDD gegen Nicht-TDD, sondern **Chicago gegen London**, also zustandsbasierte gegen mockbasierte Tests. Viele Probleme, die TDD zugeschrieben werden, etwa zerbrechliche Tests und verbogenes Design, kommen aus übermäßigem Mocking.

## Diskussionsfragen

1. **Deine Praxis:** Schreibst du Tests vor, während oder nach dem Code? Hat sich das über die Jahre verändert?
2. **Martin gegen Beck:** War es für die Verbreitung von TDD eher gut oder eher schlecht, dass Martins strenge Fassung bekannter wurde als Becks?
3. **Fake It:** Nutzt du solche Zwischenschritte bewusst, oder springst du immer gleich zur offensichtlichen Lösung?
4. **Chicago oder London:** Welche Schule prägt eure Tests? Wie viele Mocks sind zu viele?
5. **Testliste:** Arbeitest du mit einer expliziten Liste offener Fälle, auf Papier, im Kopf oder im Code als ausstehende Tests?
6. **Design aus Tests:** Hast du erlebt, dass TDD zu gutem Design geführt hat? Und wo hat es zu lokal optimiertem, aber global schwachem Code geführt?
7. **Angst und Zuversicht:** Trifft Becks These, dass Tests vor allem Angst reduzieren, deine Erfahrung?
8. **Nächstes Buch:** Wäre GOOS als Gegenstück aus der London-Schule interessant, oder lieber weiter mit *Accelerate*?
