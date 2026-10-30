+++
title = "Unit Testing – Zusammenfassung und Einordnung"
description = "Vladimir Khorikov, Unit Testing: Principles, Practices, and Patterns (2020)"
date = 2026-10-30T19:13:25+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["unit-testing-2020"]
+++

## Einleitung

Nach Beck, Freeman und Pryce, Feathers und Martin ist Khorikovs Buch das fünfte in dieser Reihe, das sich mit Tests beschäftigt, und das erste, das die Frage ins Zentrum stellt: **Was macht einen Test wertvoll?** Nicht wie man Tests schreibt, sondern welche Tests sich lohnen, welche schaden und warum.

### Autor und Kontext

Vladimir Khorikov ist ein Softwareentwickler mit Schwerpunkt .NET und Domain-Driven Design, bekannt durch seinen Blog *Enterprise Craftsmanship* und Kurse auf Pluralsight. Das Buch erschien 2020 bei Manning; die Beispiele sind in C#, die Ideen aber sprachunabhängig.

Es kam zu einer Zeit, in der viele Teams Tests hatten, aber unzufrieden damit waren: Suites, die bei jedem Refactoring brechen, Mocks, die mehr Code testen als die Anwendung, hohe Abdeckung ohne Vertrauen. Khorikov bietet einen Rahmen, um diese Probleme zu benennen und zu lösen.

### Die Kernthese

Das Ziel von Unit-Tests ist **nachhaltiges Wachstum** eines Softwareprojekts. Ohne Tests verlangsamt sich ein Projekt mit der Zeit, weil jede Änderung Angst vor Regressionen auslöst. Aber nicht jeder Test hilft: **Schlechte Tests sind schlimmer als keine**, weil sie Pflegeaufwand verursachen, ohne Vertrauen zu stiften. Der Wert eines Tests ergibt sich aus seinem Nutzen abzüglich seiner Kosten.

### Aufbau

| Teil | Kapitel | Inhalt |
|---|---|---|
| I. Das Gesamtbild | 1–3 | Ziel von Unit-Tests, Definition, Aufbau eines Tests |
| II. Tests nützlich machen | 4–7 | vier Säulen eines guten Tests, Mocks und Zerbrechlichkeit, Teststile, Refactoring zu wertvollen Tests |
| III. Integrationstests | 8–10 | Integrationstests, Mocks richtig einsetzen, Datenbanken testen |
| IV. Antipatterns | 11 | typische Fehler |

Mit rund 300 Seiten ist das Buch kompakter als die meisten der Reihe, aber dicht.

## Das Ziel von Unit-Tests

### Abdeckung ist kein Ziel

Khorikov behandelt Testabdeckung früh und klar: **Eine niedrige Abdeckung ist ein gutes Warnsignal, eine hohe Abdeckung sagt wenig.** Man kann hundert Prozent Zeilenabdeckung mit Tests erreichen, die nichts prüfen. Und sobald Abdeckung ein Ziel wird, schreiben Teams Tests, um die Zahl zu erreichen, nicht um Vertrauen zu gewinnen. Das ist Goodharts Gesetz, das auch in Accelerate auftaucht.

### Eine erfolgreiche Testsuite

- ist **in den Entwicklungsablauf integriert**, läuft also bei jeder Änderung;
- zielt auf **die wichtigsten Teile des Codes**, vor allem das Domänenmodell;
- bietet **maximalen Wert bei minimalen Pflegekosten**.

## Was ein Unit-Test ist

Khorikov definiert einen Unit-Test über drei Eigenschaften: Er prüft **ein kleines Stück Code**, er läuft **schnell**, und er läuft **isoliert**. Über die Bedeutung von „isoliert“ haben sich zwei Schulen gebildet.

|  | London-Schule | Klassische Schule |
|---|---|---|
| Isolation von | einer Klasse gegenüber ihren Kollaborateuren | Tests gegenüber anderen Tests |
| Eine Einheit ist | eine Klasse | eine Einheit von Verhalten, oft mehrere Klassen |
| Ersetzt wird | jede veränderliche Abhängigkeit | nur gemeinsame Abhängigkeiten, etwa Datenbank oder Dateisystem |
| Vertreter | Freeman und Pryce (GOOS) | Beck (TDD by Example), Fowler |

### Arten von Abhängigkeiten

| Art | Beispiel | Im Test |
|---|---|---|
| **Gemeinsame** | Datenbank, statischer Zustand, Dateisystem | ersetzen, weil Tests sich sonst gegenseitig beeinflussen |
| **Private** | ein Objekt, das nur der getestete Code nutzt | klassisch: echt verwenden; London: ersetzen |
| **Außerhalb des Prozesses** | Datenbank, Message Broker, fremde API | meist gemeinsam; Unterscheidung folgt in Teil III |
| **Werte** | unveränderliche Objekte wie `Money` | immer echt verwenden |

### Khorikovs Position

Khorikov bevorzugt **klar die klassische Schule**. Sein Hauptargument: London-Tests sind an die Implementierung gekoppelt. Wer jede Klasse einzeln mit gemockten Kollaborateuren testet, prüft, wie Klassen miteinander sprechen, nicht was das System tut. Jedes Refactoring, das die Zusammenarbeit ändert, bricht Tests, obwohl sich das Verhalten nicht geändert hat.

Er räumt ein, dass die London-Schule Vorteile hat, etwa präzisere Fehlermeldungen und einfacheres Testen großer Objektgraphen, hält sie aber für weniger wichtig als Widerstandsfähigkeit gegen Refactoring.

## Aufbau eines Tests

- **Arrange–Act–Assert**, mit genau einem Act-Abschnitt. Mehrere Act-Abschnitte deuten auf einen Integrationstest oder einen Test, der zu viel prüft.
- **Kein **`if`** im Test.** Verzweigungen bedeuten, dass der Test mehr als eine Sache prüft.
- **Namen beschreiben Verhalten in fachlicher Sprache**, nicht Methodennamen.

```java
// Name nach Methode: koppelt an Implementierung
@Test void isDeliveryValid_InvalidDate_ReturnsFalse() { … }

// Name nach Verhalten: liest sich wie eine Aussage
@Test void delivery_with_a_past_date_is_invalid() {
    var sut = new DeliveryService(fixedClock("2026-10-30"));      // Arrange
    var delivery = new Delivery(LocalDate.parse("2026-10-29"));

    boolean valid = sut.isDeliveryValid(delivery);                // Act

    assertThat(valid).isFalse();                                   // Assert
}
```

Das Beispiel zeigt nebenbei eine weitere Regel: Zeit wird als Abhängigkeit hineingereicht, nicht im Code abgefragt.

## Die vier Säulen eines guten Tests

Das vierte Kapitel ist das Herz des Buchs. Khorikov nennt vier Eigenschaften, an denen sich jeder Test messen lässt.

| Säule | Frage | Gefährdet durch |
|---|---|---|
| **Schutz vor Regressionen** | Findet der Test Fehler, wenn der Code kaputtgeht? | Tests, die wenig oder trivialen Code ausführen |
| **Widerstand gegen Refactoring** | Bleibt der Test grün, wenn sich der Code ändert, das Verhalten aber nicht? | Tests, die Implementierungsdetails prüfen |
| **Schnelle Rückmeldung** | Läuft der Test schnell? | Datenbank, Netzwerk, Oberfläche |
| **Wartbarkeit** | Ist der Test leicht zu verstehen und auszuführen? | große Arrange-Abschnitte, viele Abhängigkeiten |

Der Wert eines Tests ist für Khorikov das **Produkt** dieser vier Eigenschaften, nicht ihre Summe: Ist eine davon null, ist der Test wertlos.

### Falsch-positive und falsch-negative Ergebnisse

Die ersten beiden Säulen entsprechen zwei Arten von Fehlern:

|  | Code funktioniert | Code ist kaputt |
|---|---|---|
| **Test grün** | richtig | **falsch negativ**: Fehler übersehen |
| **Test rot** | **falsch positiv**: Fehlalarm | richtig |

Schutz vor Regressionen verhindert falsch-negative Ergebnisse, Widerstand gegen Refactoring falsch-positive. Am Anfang eines Projekts fallen falsch-negative stärker ins Gewicht. Mit der Zeit werden falsch-positive zum Hauptproblem: Teams gewöhnen sich an rote Tests, ignorieren sie oder hören auf zu refaktorieren, weil jede Änderung Tests bricht. Das ist der Zustand, den viele Teams kennen.

### Man kann nicht alles haben

Die ersten drei Säulen lassen sich nicht gleichzeitig maximieren:

| Testart | Regression | Refactoring | Schnell |
|---|---|---|---|
| End-to-End-Tests | hoch | hoch | niedrig |
| Triviale Tests, etwa für Getter | niedrig | hoch | hoch |
| Zerbrechliche Tests, die Implementierung prüfen | hoch | niedrig | hoch |

Khorikovs Schluss: **Widerstand gegen Refactoring ist nicht verhandelbar.** Ein Test besitzt diese Eigenschaft im Wesentlichen ganz oder gar nicht. Die eigentliche Abwägung liegt zwischen Schutz vor Regressionen und Geschwindigkeit, und daraus ergibt sich die **Testpyramide**: viele schnelle Unit-Tests, weniger Integrationstests, wenige End-to-End-Tests.

### Black Box und White Box

Tests sollen **als Black Box geschrieben** werden, also nur beobachtbares Verhalten prüfen. Für die **Analyse**, etwa welche Pfade noch fehlen, ist ein Blick in den Code dagegen sinnvoll.

### Einordnung

Die vier Säulen sind das, was in den anderen Testbüchern implizit blieb. Becks Test Desiderata von 2019 nennen ähnliche Eigenschaften, etwa strukturunabhängig, schnell und lesbar. Martins Satz aus Clean Architecture, Tests dürften nicht an die Struktur gekoppelt sein, ist Khorikovs zweite Säule.

## Mocks und zerbrechliche Tests

Das fünfte Kapitel beantwortet die Frage, die sich durch GOOS, TDD by Example und Feathers zog: **Wann soll man mocken?** Khorikovs Antwort ist präziser als alles, was die anderen Bücher bieten.

### Mocks und Stubs

Khorikov fasst die vielen Arten von Test-Doubles in zwei Gruppen:

|  | Mock | Stub |
|---|---|---|
| Bildet nach | **ausgehende** Interaktionen: Befehle, Seiteneffekte | **eingehende** Interaktionen: Abfragen, Daten |
| Beispiel | E-Mail wird versendet | Kunde wird aus der Datenbank geladen |
| Im Test prüfen? | ja, das ist das Ergebnis | **nein**, nur Mittel zum Zweck |

Das entspricht Meyers Trennung von Befehlen und Abfragen und GOOS' Regel „Abfragen erlauben, Befehle erwarten“. Khorikovs wichtigste Konsequenz: **Interaktionen mit Stubs niemals prüfen.** Ob eine Abfrage stattgefunden hat, ist ein Implementierungsdetail.

### Beobachtbares Verhalten und Implementierungsdetails

Code ist entweder **beobachtbares Verhalten**, also etwas, das einem Aufrufer hilft, sein Ziel zu erreichen, oder ein **Implementierungsdetail**. Bei gut entworfenen Schnittstellen fällt beobachtbares Verhalten mit der öffentlichen Schnittstelle zusammen. Wo das nicht so ist, **leckt** die Schnittstelle Implementierungsdetails, und Tests, die sie nutzen, werden zerbrechlich. Das ist Ousterhouts Information Hiding aus Sicht der Tests.

### Kommunikation innerhalb und zwischen Systemen

Die zentrale Unterscheidung des Buchs:

| Art | Beispiel | Status |
|---|---|---|
| **Innerhalb des Systems** | Klassen der eigenen Anwendung rufen sich auf | Implementierungsdetail |
| **Zwischen Systemen** | die Anwendung sendet E-Mails, veröffentlicht Nachrichten, ruft fremde APIs | beobachtbares Verhalten |

Daraus folgt Khorikovs Regel: **Mocks nur für Kommunikation zwischen Systemen**, und genauer nur für **nicht verwaltete** Abhängigkeiten außerhalb des Prozesses, also solche, die auch andere Systeme sehen. Die eigene Datenbank, auf die nur die eigene Anwendung zugreift, ist eine **verwaltete** Abhängigkeit und damit ein Implementierungsdetail. Sie wird in Integrationstests echt verwendet, nicht gemockt.

```java
// Zerbrechlich: prüft Kommunikation innerhalb des Systems
@Test void purchase_succeeds_when_enough_inventory() {
    var store = mock(Store.class);
    when(store.hasEnoughInventory(SHAMPOO, 5)).thenReturn(true);

    new Customer().purchase(store, SHAMPOO, 5);

    verify(store).removeInventory(SHAMPOO, 5);          // Implementierungsdetail
}

// Robust: Store ist echt, nur der Effekt nach außen wird gemockt
@Test void successful_purchase_sends_receipt() {
    var store = new Store();
    store.addInventory(SHAMPOO, 10);
    var email = mock(EmailGateway.class);                // nicht verwaltete Abhängigkeit
    var sut = new CustomerController(store, email);

    sut.purchase(CUSTOMER_ID, SHAMPOO, 5);

    assertThat(store.inventoryOf(SHAMPOO)).isEqualTo(5);  // Zustand prüfen
    verify(email).sendReceipt(CUSTOMER_ID, SHAMPOO, 5);   // Effekt zwischen Systemen
}
```

### Hexagonale Architektur

Khorikov verbindet diese Regeln mit der hexagonalen Architektur: Das Domänenmodell im Inneren kommuniziert nur innerhalb des Systems und wird ohne Mocks getestet. Die Anwendungsschicht koordiniert und spricht mit der Außenwelt; dort prüft man die Kommunikation zwischen Systemen. Das ist Martins Clean Architecture, angewandt auf die Frage, wo welche Tests hingehören.

### Einordnung

Damit schlichtet Khorikov den Streit zwischen den Schulen auf eine Weise, die beiden etwas gibt: Die London-Schule hat recht, dass man **Rollen und Interaktionen** prüfen soll, aber nur an der Grenze zu anderen Systemen. Die klassische Schule hat recht, dass Interaktionen **innerhalb** der Anwendung Implementierungsdetails sind.

## Drei Teststile

Khorikov unterscheidet drei Arten, das Ergebnis eines Tests zu prüfen:

| Stil | Prüft | Beispiel |
|---|---|---|
| **Ausgabebasiert** | den Rückgabewert einer Methode ohne Seiteneffekte | `assertThat(calculator.discount(order)).isEqualTo(…)` |
| **Zustandsbasiert** | den Zustand des Systems nach der Aktion | `assertThat(order.lines()).hasSize(2)` |
| **Kommunikationsbasiert** | Aufrufe an Mocks | `verify(email).send(…)` |

Im Vergleich nach den vier Säulen schneidet der **ausgabebasierte Stil am besten** ab: Er ist am wenigsten an Implementierungsdetails gekoppelt, am leichtesten zu pflegen und schnell. Zustandsbasierte Tests sind etwas anfälliger, weil sie mehr Oberfläche prüfen. Kommunikationsbasierte Tests sind am zerbrechlichsten und sollten der Kommunikation zwischen Systemen vorbehalten sein.

Ausgabebasierte Tests setzen aber **reine Funktionen** voraus. Daraus ergibt sich die Frage, wie man Code so strukturiert, dass möglichst viel davon rein ist.

## Funktionaler Kern, imperative Hülle

Khorikov greift das Muster von Gary Bernhardt auf: **Entscheidungen** werden in einem funktionalen Kern getroffen, der nur Daten entgegennimmt und Daten zurückgibt. **Seiteneffekte** werden in einer dünnen, imperativen Hülle ausgeführt, die Daten sammelt, den Kern aufruft und dessen Entscheidungen umsetzt.

Sein Beispiel ist ein Besucherprotokoll, das in Dateien schreibt und bei voller Datei eine neue anlegt:

```java
// Funktionaler Kern: keine Ein-/Ausgabe, nur Entscheidung
record FileContent(String name, List<String> lines) {}
record FileUpdate(String name, String newContent) {}

final class AuditManager {
    private final int maxEntriesPerFile;

    FileUpdate addRecord(List<FileContent> files, String visitor, LocalDateTime time) {
        String entry = visitor + ";" + time;
        if (files.isEmpty()) return new FileUpdate("audit_1.txt", entry);
        var current = files.getLast();
        if (current.lines().size() < maxEntriesPerFile)
            return new FileUpdate(current.name(), join(current.lines(), entry));
        return new FileUpdate("audit_" + (files.size() + 1) + ".txt", entry);
    }
}

// Imperative Hülle: liest, ruft Kern, schreibt
final class AuditPersister {
    void addRecord(String visitor, LocalDateTime time) {
        var files = readAllFiles(directory);
        var update = manager.addRecord(files, visitor, time);
        Files.writeString(directory.resolve(update.name()), update.newContent());
    }
}

// Test des Kerns: rein ausgabebasiert, ohne Dateisystem, ohne Mocks
@Test void new_file_is_created_when_current_file_overflows() {
    var sut = new AuditManager(3);
    var files = List.of(new FileContent("audit_1.txt", List.of("a", "b", "c")));

    var update = sut.addRecord(files, "Sven", T);

    assertThat(update).isEqualTo(new FileUpdate("audit_2.txt", "Sven;" + T));
}
```

Die Hülle wird nur noch mit wenigen Integrationstests geprüft.

### Grenzen

Khorikov ist ehrlich über die Kosten: Der funktionale Kern braucht alle Daten im Voraus, was Leistung kosten kann, wenn man sonst nur bei Bedarf lädt. Der Code wird außerdem umfangreicher. Nicht jedes System lohnt diese Strukturierung; sie lohnt sich dort, wo die Entscheidungslogik komplex ist.

### Einordnung

Das ist Weidigs funktionaler Ansatz aus *A Functional Approach to Java*, begründet aus Sicht der Testbarkeit. Records machen in Java die Ein- und Ausgaben des Kerns kurz und vergleichbar. Martins Humble Object aus Clean Architecture verfolgt dasselbe Ziel mit objektorientierten Mitteln.

## Refactoring zu wertvollen Tests

Das siebte Kapitel zeigt, wie man Code so umbaut, dass die richtigen Tests möglich werden. Ausgangspunkt ist eine Einteilung des Codes nach zwei Dimensionen: **Komplexität oder fachliche Bedeutung** und **Zahl der Kollaborateure**, also der Abhängigkeiten, die eine Klasse nutzt.

{{< bild src="bild-1.png" alt="Khorikovs vier Arten von Code · Komplexität gegen Zahl der Kollaborateure" >}}

Khorikovs vier Arten von Code · Komplexität gegen Zahl der Kollaborateure

| Art | Testen? |
|---|---|
| **Domänenmodell und Algorithmen** | ja, gründlich mit Unit-Tests; hier liegt der höchste Wert pro Test |
| **Trivialer Code**, etwa Getter oder einfache Konstruktoren | nein, kaum Schutz vor Regressionen |
| **Controller**, die koordinieren, aber wenig entscheiden | knapp, mit Integrationstests |
| **Überkomplizierter Code** mit viel Logik und vielen Abhängigkeiten | nicht testen, sondern **aufteilen** |

Das Ziel ist, den rechten oberen Quadranten zu leeren: Die Logik wandert ins Domänenmodell, die Koordination in einen Controller. Das ist Martins Humble Object, Weidigs funktionaler Kern und Feathers' Trennung von Logik und Abhängigkeiten in einem Bild.

### Bedingte Logik in Controllern

Schwierig wird es, wenn der Controller abhängig von einer Entscheidung eine Abhängigkeit aufrufen muss, etwa nur dann eine E-Mail senden, wenn sich die Adresse geändert hat. Khorikov zeigt zwei Muster:

**CanExecute/Execute:** Das Domänenobjekt bietet eine Prüfmethode an, und die eigentliche Methode setzt voraus, dass die Prüfung bestanden ist. So bleibt die Entscheidung im Modell.

**Domänenereignisse:** Das Domänenobjekt sammelt Ereignisse darüber, was passiert ist; der Controller liest sie und führt die nötigen Seiteneffekte aus.

```java
final class User {
    private String email;
    private final List<DomainEvent> events = new ArrayList<>();

    Optional<String> canChangeEmail() {
        return emailConfirmed ? Optional.of("E-Mail bereits bestätigt") : Optional.empty();
    }

    void changeEmail(String newEmail, Company company) {
        if (canChangeEmail().isPresent()) throw new IllegalStateException();
        if (newEmail.equals(email)) return;
        email = newEmail;
        events.add(new EmailChanged(id, newEmail));          // Entscheidung im Modell
    }
    List<DomainEvent> events() { return List.copyOf(events); }
}

// Test des Modells: ausgabe- und zustandsbasiert, ohne Mocks
@Test void changing_email_raises_event() {
    var user = new User(1, "a@firma.de", CUSTOMER);
    user.changeEmail("b@firma.de", company);
    assertThat(user.events()).containsExactly(new EmailChanged(1, "b@firma.de"));
}
```

Der Controller sendet dann für jedes `EmailChanged`-Ereignis eine Nachricht an den Message Bus. Ob die Nachricht gesendet wird, entscheidet das Modell; dass sie gesendet wird, prüft ein Integrationstest mit Mock.

### Einordnung

Das ist Evans' Domain Events, begründet aus Sicht der Testbarkeit. Khorikov zeigt damit, dass gutes Design und gute Tests dasselbe Ziel haben: Logik von Koordination zu trennen.

## Integrationstests

Unit-Tests prüfen das Domänenmodell. **Integrationstests** prüfen, ob die Anwendung mit ihren Abhängigkeiten außerhalb des Prozesses richtig zusammenarbeitet, also vor allem die Controller.

### Wie viele?

Khorikovs Faustregel: **Den längsten Erfolgspfad** prüfen, der möglichst viele Abhängigkeiten berührt, und dazu die **Randfälle, die Unit-Tests nicht abdecken können**. Fehlerfälle, die schon im Domänenmodell geprüft werden, braucht man nicht noch einmal als Integrationstest. Ausnahme: Wenn ein Fehler früh und laut auffällt, etwa durch eine Ausnahme direkt am Anfang, ist ein Integrationstest dafür oft überflüssig.

### Verwaltete und nicht verwaltete Abhängigkeiten

| Art | Beispiel | Im Integrationstest |
|---|---|---|
| **Verwaltet** | die eigene Datenbank, auf die nur die eigene Anwendung zugreift | **echt verwenden** |
| **Nicht verwaltet** | SMTP-Server, Message Bus, fremde APIs | **mocken** |

Die eigene Datenbank ist ein Implementierungsdetail: Ob die Anwendung zwei Tabellen oder eine verwendet, sieht niemand außerhalb. Eine Nachricht auf einem Bus sehen dagegen andere Systeme; das ist ein Vertrag.

### Interfaces sparsam

Khorikov wendet sich gegen die verbreitete Praxis, für jede Klasse ein Interface anzulegen. **Ein Interface mit einer einzigen Implementierung ist keine Abstraktion.** Interfaces für Abhängigkeiten sind nur dort nötig, wo man sie mocken will, also bei nicht verwalteten Abhängigkeiten. Das ist Ousterhouts Kritik an flachen Modulen und Thomas' und Hunts YAGNI.

### Protokollierung

Auch Logging kann beobachtbares Verhalten sein: **Support-Logs**, die der Betrieb oder Fachleute auswerten, sind ein Vertrag und werden getestet. **Diagnose-Logs** für Entwickler sind Implementierungsdetails.

## Mocks richtig einsetzen

- **An der Grenze mocken:** den letzten Typ, bevor eine Nachricht das System verlässt, etwa den Message-Bus-Client, nicht eine Wrapper-Klasse davor. So prüft der Test auch die Übersetzung in die Nachricht.
- **Spies statt Mocks** für Abhängigkeiten an der Grenze: handgeschriebene Test-Doubles, die Aufrufe aufzeichnen, sind oft lesbarer als Mock-Frameworks.
- **Anzahl der Aufrufe prüfen:** nicht nur, dass etwas gesendet wurde, sondern auch, dass nichts Unerwartetes gesendet wurde.
- **Nur eigene Typen mocken**, wie GOOS empfiehlt: fremde Bibliotheken hinter einem eigenen Adapter kapseln und diesen mocken.

## Datenbanken testen

- **Schema in der Versionskontrolle**, mit Migrationen, wie Continuous Delivery fordert.
- **Eigene Datenbankinstanz pro Entwickler**, keine geteilte Testdatenbank.
- **Arrange, Act und Assert in getrennten Transaktionen**, damit der Test prüft, was tatsächlich gespeichert wurde, und nicht den Cache der ersten Transaktion.
- **Daten am Anfang eines Tests aufräumen**, nicht am Ende. Bricht ein Test ab, bleibt die Datenbank sonst verschmutzt.
- **Keine In-Memory-Datenbanken** als Ersatz für die echte. H2 statt PostgreSQL bedeutet, dass man eine andere Datenbank testet.

```java
@SpringBootTest
@Testcontainers
class ChangeEmailIntegrationTest {
    @Container static PostgreSQLContainer<?> db = new PostgreSQLContainer<>("postgres:17");
    @MockitoBean MessageBus bus;                                   // nicht verwaltet: gemockt
    @Autowired UserController controller;
    @Autowired TestDatabase testDb;                                // verwaltet: echt

    @BeforeEach void clean() { testDb.truncateAll(); }             // vorher aufräumen

    @Test void changing_email_from_corporate_to_non_corporate() {
        var user = testDb.createUser("user@firma.de", EMPLOYEE);    // Arrange, eigene Transaktion
        testDb.createCompany("firma.de", 1);

        controller.changeEmail(user.id(), "new@gmail.com");        // Act

        var saved = testDb.loadUser(user.id());                     // Assert, frische Transaktion
        assertThat(saved.email()).isEqualTo("new@gmail.com");
        assertThat(saved.type()).isEqualTo(CUSTOMER);
        assertThat(testDb.loadCompany("firma.de").employees()).isZero();
        verify(bus).send(new EmailChangedMessage(user.id(), "new@gmail.com"));
        verifyNoMoreInteractions(bus);
    }
}
```

Testcontainers hat die Empfehlung, mit der echten Datenbank zu testen, seit 2020 deutlich einfacher gemacht.

## Antipatterns

Das letzte Kapitel sammelt verbreitete Fehler, die sich alle aus den vier Säulen ableiten lassen.

| Antipattern | Problem | Besser |
|---|---|---|
| **Private Methoden testen** | koppelt Tests an Implementierung | über die öffentliche Schnittstelle testen; ist die private Logik zu komplex dafür, fehlt eine Abstraktion, die eine eigene Klasse werden sollte |
| **Privaten Zustand offenlegen** | Felder werden nur für Tests sichtbar gemacht | Verhalten prüfen, nicht interne Felder |
| **Domänenwissen in Tests nachbauen** | der Test berechnet das erwartete Ergebnis mit demselben Algorithmus wie der Code | erwartete Werte fest hineinschreiben |
| **Code-Verschmutzung** | Produktionscode enthält Zweige nur für Tests, etwa `if (isTestEnvironment)` | Test-Doubles über Schnittstellen einschleusen |
| **Konkrete Klassen mocken** | teilweise gemockte Klassen, um einen Teil der Logik zu umgehen | die Klasse aufteilen, weil sie gegen SRP verstößt |
| **Zeit als Umgebungszustand** | Code ruft `LocalDateTime.now()` direkt auf | Zeit als Wert oder als `Clock` hineinreichen |

### Domänenwissen im Test

Dieser Fehler ist subtil und verbreitet:

```java
// Falsch: wiederholt den Algorithmus, findet nie einen Fehler darin
@ParameterizedTest @CsvSource({"1,3", "11,33", "100,500"})
void adding_two_numbers(int a, int b) {
    assertThat(Calculator.add(a, b)).isEqualTo(a + b);
}

// Richtig: erwartete Ergebnisse unabhängig festgelegt
@ParameterizedTest @CsvSource({"1,3,4", "11,33,44", "100,500,600"})
void adding_two_numbers(int a, int b, int expected) {
    assertThat(Calculator.add(a, b)).isEqualTo(expected);
}
```

Wer den erwarteten Wert mit demselben Verfahren berechnet wie der Code, prüft nur, ob der Code mit sich selbst übereinstimmt.

### Einordnung

Mehrere dieser Antipatterns tauchen auch in anderen Büchern der Reihe auf: Private Methoden testen kritisieren Beck und Martin; Code-Verschmutzung ist das Gegenteil von Feathers' Seams; Zeit als Abhängigkeit empfehlen Bloch, GOOS und Thomas und Hunt. Khorikov liefert für alle dieselbe Begründung: Sie verletzen den Widerstand gegen Refactoring oder den Schutz vor Regressionen.

## Kritik und Einordnung

### Stärken

- **Ein Bewertungsrahmen:** Die vier Säulen geben eine gemeinsame Sprache, um über den Wert von Tests zu sprechen, statt über Geschmack.
- **Eine klare Mock-Regel:** Nur nicht verwaltete Abhängigkeiten außerhalb des Prozesses werden gemockt. Diese Regel löst viele Diskussionen in Teams.
- **Test und Design zusammen:** Das Buch zeigt durchgehend, dass schwer testbarer Code ein Designproblem ist, und wie man es löst.
- **Integrationstests ernst genommen:** Viele Testbücher behandeln nur Unit-Tests. Khorikov gibt konkrete Regeln für Datenbanken, Transaktionen und Abhängigkeiten.
- **Kompakt und konsequent:** Alles wird aus wenigen Grundsätzen abgeleitet.

### Kritikpunkte

**1. Parteiisch gegen die London-Schule.** Khorikov stellt die London-Schule teilweise verkürzt dar. Freeman und Pryce nutzen Mocks ausdrücklich als **Entwurfswerkzeug**, um Rollen und Schnittstellen beim Schreiben zu entdecken, nicht nur zum Prüfen. Dieser Aspekt kommt bei Khorikov kaum vor.

**2. Wenig über TDD als Prozess.** Das Buch sagt viel darüber, welche Tests man haben sollte, aber wenig darüber, wie man sie in welcher Reihenfolge schreibt. Es ergänzt Beck, ersetzt ihn nicht.

**3. Geschäftsanwendungen als Maßstab.** Die Beispiele kommen aus typischen Geschäftsanwendungen mit Datenbank und Controllern. Für Bibliotheken, Algorithmen, nebenläufigen Code oder Benutzeroberflächen sind einige Regeln weniger direkt anwendbar.

**4. Die Quadranten vereinfachen.** In der Praxis lässt sich Code nicht immer sauber in Domäne und Controller aufteilen, etwa wenn Leistungsanforderungen erzwingen, Daten erst bei Bedarf zu laden. Khorikov erwähnt das, behandelt es aber knapp.

**5. C#-Beispiele.** Für Java-Entwickler ist die Übertragung leicht, aber einige Werkzeuge und Bibliotheken unterscheiden sich.

### Gesamturteil

Das beste Buch der Reihe über die Frage, **welche Tests sich lohnen**. Wer nur ein Testbuch lesen will, ist mit Khorikov gut bedient; wer verstehen will, wie Tests den Entwurf treiben, liest zusätzlich GOOS; wer den Rhythmus des Testens lernen will, Beck.

## Der Testfaden der Reihe

Khorikov ist das sechste Buch der Reihe, das sich wesentlich mit Tests befasst. Zusammen ergeben sie ein vollständiges Bild.

| Buch | Beitrag | Frage |
|---|---|---|
| Beck, *TDD by Example* | Rot–Grün–Refactor, kleine Schritte, Testliste | **Wie** schreibt man Tests im Rhythmus? |
| Freeman und Pryce, *GOOS* | doppelte Schleife, Mocks als Entwurfswerkzeug, Rollen | Wie **treiben** Tests den Entwurf? |
| Feathers, *Legacy Code* | Seams, Characterization Tests | Wie bekommt man **bestehenden** Code unter Test? |
| Martin, *Clean Code* und *Clean Architecture* | drei Gesetze, Testgrenze | Wie **streng** soll man sein? |
| Humble und Farley, *Continuous Delivery* | Testquadranten, Pipeline, Akzeptanztests | Wo **laufen** welche Tests? |
| Khorikov, *Unit Testing* | vier Säulen, Mock-Regel, Code-Quadranten | **Welche** Tests lohnen sich? |

### Wie Khorikov die Streitfragen auflöst

| Streitfrage | Positionen | Khorikovs Antwort |
|---|---|---|
| Was ist eine Einheit? | London: Klasse; klassisch: Verhalten | Verhalten |
| Wann mocken? | London: alle Kollaborateure; klassisch: gemeinsame Abhängigkeiten | nur nicht verwaltete Abhängigkeiten außerhalb des Prozesses |
| Interaktionen prüfen? | GOOS: Befehle ja, Abfragen nein | ja, aber nur zwischen Systemen |
| Datenbank im Test? | oft In-Memory oder gemockt | echte Datenbank in Integrationstests |
| Wie viele Tests? | Martin: Abdeckung aller Zeilen | dort, wo der Wert hoch ist; trivialen Code nicht testen |
| Interfaces für alles? | verbreitete Praxis | nur für gemockte Abhängigkeiten |

### Weitere Bezüge

| Thema bei Khorikov | Bezug in der Reihe |
|---|---|
| Beobachtbares Verhalten, Information Hiding | Ousterhout: tiefe Module, Information Leakage |
| Funktionaler Kern, imperative Hülle | Weidig; Martin: Humble Object |
| Domänenereignisse | Evans: Domain Events |
| Hexagonale Architektur | Martin: Clean Architecture; Cockburn |
| Abdeckung als Ziel | Accelerate: Goodharts Gesetz |
| Datenbank-Migrationen | Continuous Delivery; Fowler PoEAA |

## Diskussionsfragen

1. **Vier Säulen:** Welcher Test in eurer Suite verletzt am deutlichsten den Widerstand gegen Refactoring? Was müsste sich ändern?
2. **Mocks:** Mockt ihr die eigene Datenbank oder Repositories? Nach Khorikov wären das Implementierungsdetails. Was spricht bei euch dafür oder dagegen?
3. **Code-Quadranten:** Wo liegt euer kompliziertester Code: im Domänenmodell oder im rechten oberen Quadranten?
4. **Interfaces:** Wie viele Interfaces in eurem Projekt haben genau eine Implementierung?
5. **London oder klassisch:** Nach GOOS, Beck und jetzt Khorikov, wo stehst du?
6. **Integrationstests:** Testet ihr mit der echten Datenbank, etwa über Testcontainers, oder mit H2?
7. **Abdeckung:** Gibt es bei euch eine Mindestabdeckung? Hat sie die Qualität verbessert?
8. **Weiter:** Als Nächstes *Enterprise Integration Patterns* von Hohpe und Woolf.
