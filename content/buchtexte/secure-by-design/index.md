+++
title = "Secure by Design – Zusammenfassung und Einordnung"
description = "Dan Bergh Johnsson, Daniel Deogun, Daniel Sawano, Secure by Design (2019)"
date = 2026-10-31T19:23:31+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["secure-by-design-2019"]
+++

## Einleitung

Sicherheit fehlt in der Reihe bisher fast völlig. *Secure by Design* füllt diese Lücke auf eine Weise, die zu den übrigen Büchern passt: Es behandelt Sicherheit nicht als Spezialgebiet mit eigenen Werkzeugen, sondern als **Folge guten Designs**. Wer Domänenkonzepte genau modelliert, Zustände unveränderlich hält und Fehler sauber behandelt, verhindert viele Sicherheitslücken, ohne an Sicherheit zu denken.

### Autoren und Kontext

Dan Bergh Johnsson, Daniel Deogun und Daniel Sawano arbeiten als Berater beim schwedischen Unternehmen Omegapoint an der Schnittstelle von Softwareentwicklung und Sicherheit. Bergh Johnsson gehört zu denen, die schon früh vorschlugen, Sicherheit mit Domain-Driven Design zu verbinden; daraus entstand die Idee des **Domänenprimitivs**, eines Wertobjekts, das nur gültige Werte annehmen kann. Das Vorwort schrieb Daniel Terhorst-North. Das Buch erschien 2019 bei Manning und ist weiterhin in der ersten Auflage aktuell.

### Die Kernthese

Entwickler können nicht ständig an Sicherheit denken; sie denken an Funktionen. Sicherheitsregeln, die man sich merken muss, werden vergessen. **Gute Design-Gewohnheiten** dagegen wendet man ohnehin an, und wenn sie richtig gewählt sind, entsteht Sicherheit nebenbei. Statt „denk an Eingabevalidierung“ heißt es dann: „Modelliere eine Kontonummer als eigenen Typ, der nur gültige Kontonummern zulässt.“

### Aufbau

| Teil | Kapitel | Inhalt |
|---|---|---|
| **I. Einführung** | 1–3 | warum Design für Sicherheit wichtig ist; eine Geschichte über negative Bestellmengen; Grundbegriffe aus DDD |
| **II. Grundlagen** | 4–10 | sichere Code-Konstrukte, Domänenprimitive, Integrität und Komplexität von Zustand, Sicherheit in der Auslieferungspipeline, sichere Fehlerbehandlung, Vorteile der Cloud-Denkweise |
| **III. Anwendung** | 11–14 | eine Geschichte über inkonsistente Modelle; Hinweise für Legacy-Code und Microservices; Grenzen des Ansatzes |

Rund 400 Seiten, durchgehend mit Java-Beispielen.

## Warum Design Sicherheit schafft

### Sicherheit als Eigenschaft, nicht als Funktion

Viele Teams behandeln Sicherheit als eine Reihe von **Funktionen**: Anmeldung, Verschlüsselung, Rollen. Die Autoren betonen, dass Sicherheit eher eine **Eigenschaft** des ganzen Systems ist, ähnlich wie Leistung oder Wartbarkeit. Die klassischen Schutzziele sind:

| Schutzziel | Frage |
|---|---|
| **Vertraulichkeit** | Sehen nur Berechtigte die Daten? |
| **Integrität** | Sind die Daten korrekt und unverfälscht? |
| **Verfügbarkeit** | Ist das System erreichbar, wenn es gebraucht wird? |

Viele Angriffe nutzen keine Lücken in Sicherheitsfunktionen, sondern **Schwächen im gewöhnlichen Code**: ungeprüfte Eingaben, unklare Zustände, Fehlermeldungen, die zu viel verraten.

### Ein Beispiel aus dem ersten Kapitel

Die Autoren zeigen einen bekannten Angriff auf XML-Parser, bei dem ein winziges Dokument durch verschachtelte Entitäten beim Einlesen auf Gigabytes anwächst und den Server lahmlegt. Die übliche Antwort wäre eine Sicherheitsregel: „Konfiguriere deinen Parser sicher.“ Die Antwort aus Design-Sicht ist grundsätzlicher: Wer genau weiß, was ein gültiges Dokument in seiner Domäne ist, prüft Größe und Struktur, **bevor** der eigentliche Parser arbeitet, und schließt damit eine ganze Klasse von Angriffen aus.

### Die Geschichte mit der negativen Menge

Ein Zwischenkapitel erzählt von einem Onlinebuchhändler. Die Bestellmenge war im Code eine gewöhnliche Ganzzahl. Ein Kunde bestellte eine negative Anzahl von Büchern, das System rechnete brav einen negativen Preis aus und schrieb den Betrag gut. Niemand hatte die Prüfung „Menge muss positiv sein“ vergessen, weil niemand je darüber nachgedacht hatte; „Menge“ war kein eigenes Konzept, nur eine Zahl.

Die Lehre: Hätte das System eine **Menge** als eigenen Typ mit klaren Regeln modelliert, wäre die negative Bestellung gar nicht darstellbar gewesen. Sicherheit entsteht hier nicht durch zusätzliche Prüfungen, sondern durch ein **tieferes Modell**.

### Einordnung

Das ist Evans' Gedanke der tiefen Modellierung aus Sicherheitssicht. Bloch fordert in *Effective Java* dasselbe auf Code-Ebene: Klassen sollen nur gültige Zustände zulassen. Neu ist die Konsequenz: Ein gutes Domänenmodell ist nicht nur verständlicher, sondern auch **schwerer anzugreifen**.

## Grundbegriffe aus DDD

Das dritte Kapitel führt in die Teile von Domain-Driven Design ein, die das Buch braucht. Wer Evans kennt, findet nichts Neues, wohl aber den **Sicherheitsblick** auf jeden Begriff:

| Begriff | Bedeutung | Bezug zur Sicherheit |
|---|---|---|
| **Domänenmodell** | ein bewusst vereinfachtes, präzises Abbild der Fachlichkeit | Je genauer das Modell, desto weniger ungültige Zustände sind darstellbar. |
| **Wertobjekt** | definiert durch seine Werte, unveränderlich | Unveränderliche Werte können nach der Prüfung nicht mehr verfälscht werden. |
| **Entität** | hat eine Identität und einen veränderlichen Zustand | Zustandsänderungen müssen kontrolliert und regelgerecht ablaufen. |
| **Aggregat** | eine Gruppe von Objekten mit gemeinsamen Regeln und einem Einstiegspunkt | Regeln, die mehrere Objekte betreffen, werden an einer Stelle durchgesetzt. |
| **Bounded Context** | ein Bereich, in dem ein Begriff eine eindeutige Bedeutung hat | An Grenzen zwischen Kontexten muss übersetzt und geprüft werden; dort entstehen viele Lücken. |

### Kontextgrenzen als Sicherheitsgrenzen

Die Autoren betonen besonders die **Grenzen zwischen Bounded Contexts**. Dasselbe Wort kann auf beiden Seiten etwas anderes bedeuten, etwa „Kunde“ im Vertrieb und in der Buchhaltung. Wo Daten eine Grenze überqueren, ohne übersetzt und geprüft zu werden, entstehen Missverständnisse, und Missverständnisse sind Einfallstore. Das spätere Zwischenkapitel über eine Versicherung, die versehentlich Policen ohne Zahlung ausstellte, weil zwei Systeme „bezahlt“ unterschiedlich verstanden, illustriert das.

### Einordnung

Der Abschnitt ist eine kompakte Wiederholung von Evans und eine Überleitung zu Vernon, der dieselben Begriffe in der Umsetzung vertieft. Die Antikorruptionsschicht aus Evans' strategischem Design bekommt hier eine zusätzliche Rolle: Sie übersetzt nicht nur Modelle, sie ist auch eine **Prüfstelle**.

## Sichere Code-Konstrukte

Das vierte Kapitel beschreibt drei Gewohnheiten, die auf Code-Ebene Sicherheit fördern.

### Unveränderlichkeit

Unveränderliche Objekte können nach ihrer Erzeugung nicht mehr in einen ungültigen oder manipulierten Zustand geraten. Sie sind außerdem ohne Synchronisation zwischen Threads teilbar, was eine ganze Klasse von Fehlern bei Nebenläufigkeit verhindert, wie Goetz u.a. beschreiben. Das schützt **Integrität** und, weil weniger Sperren nötig sind, auch **Verfügbarkeit**.

### Früh scheitern mit Verträgen

Jede Methode und jeder Konstruktor prüft seine **Vorbedingungen** sofort und bricht bei Verletzung ab. Ein Objekt, das mit ungültigen Daten nicht erzeugt werden kann, kann später keinen Schaden anrichten. Die Autoren empfehlen, Verträge **explizit** im Code zu formulieren, etwa mit `Objects.requireNonNull` und eigenen Prüfmethoden, statt sich auf Kommentare oder Annahmen zu verlassen.

### Prüfen in der richtigen Reihenfolge

Besonders nützlich ist die empfohlene Reihenfolge für die Prüfung von Eingaben. Sie beginnt mit billigen Prüfungen, die keine Analyse brauchen, und endet mit teuren, die Fachwissen und oft Datenbankzugriffe erfordern.

{{< bild src="bild-1.png" alt="die empfohlene Reihenfolge für die Prüfung von Eingaben" >}}

die empfohlene Reihenfolge für die Prüfung von Eingaben

| Schritt | Beispiel | Warum an dieser Stelle |
|---|---|---|
| **Herkunft** | Stammt die Anfrage von einem bekannten System? | schützt vor Angriffen, bevor überhaupt Daten gelesen werden |
| **Größe** | Ist die Eingabe höchstens 10 KB lang? | verhindert, dass riesige Eingaben Speicher und Rechenzeit verbrauchen |
| **Zeichen** | Enthält sie nur erlaubte Zeichen? | schließt Steuerzeichen und viele Einschleusungen aus |
| **Syntax** | Hat sie das richtige Format, etwa eine IBAN? | erst jetzt lohnt sich das Parsen |
| **Semantik** | Existiert das Konto, und darf dieser Kunde darauf zugreifen? | braucht Fachregeln und Daten, deshalb zuletzt |

Die Reihenfolge schützt die **teuren** Prüfungen: Ein Angreifer kann das System nicht überlasten, indem er riesige oder sinnlose Eingaben schickt, die erst nach aufwendiger Verarbeitung abgelehnt würden.

### Einordnung

Unveränderlichkeit und frühes Scheitern empfiehlt Bloch in *Effective Java* aus Gründen der Korrektheit; hier zeigt sich, dass sie auch Sicherheitsmechanismen sind. Die Prüfreihenfolge passt zu Nygards Stabilitätsmustern: Wer billig vorprüft, schützt das System vor Last, die es nie hätte annehmen sollen. In Java-Records lässt sich das kompakt umsetzen, wie das nächste Kapitel zeigt.

## Domänenprimitive

Das fünfte Kapitel ist das Herz des Buchs.

### Was ein Domänenprimitiv ist

Ein **Domänenprimitiv** ist ein Wertobjekt mit zwei Eigenschaften: Es ist **unveränderlich**, und es kann **nur gültige Werte** annehmen; die Prüfung geschieht bei der Erzeugung. Es ersetzt die primitiven Typen der Sprache, also `int`, `String` oder `BigDecimal`, überall dort, wo ein Wert eine fachliche Bedeutung hat: Menge, Kontonummer, Postleitzahl, Versicherungsnummer.

```java
// Domänenprimitiv: eine Bestellmenge, die nur gültige Werte kennt
public record Quantity(int value) {
    private static final int MAX = 500;

    public Quantity {
        if (value < 1 || value > MAX)
            throw new IllegalArgumentException("Menge muss zwischen 1 und " + MAX + " liegen");
    }

    public Quantity add(Quantity other) { return new Quantity(value + other.value); }   // bleibt gültig oder scheitert
}

// Prüfung in der empfohlenen Reihenfolge: Größe, Zeichen, Syntax
public record PolicyNumber(String value) {
    private static final Pattern FORMAT = Pattern.compile("[A-Z]{2}-\\d{8}");

    public PolicyNumber {
        Objects.requireNonNull(value);
        if (value.length() != 11)                       throw new IllegalArgumentException("Länge");
        if (!value.chars().allMatch(c -> c < 128))      throw new IllegalArgumentException("Zeichen");
        if (!FORMAT.matcher(value).matches())           throw new IllegalArgumentException("Format");
    }
}
// Die Semantik, etwa „existiert diese Police und darf der Nutzer sie sehen?“,
// gehört in den Anwendungsdienst, nicht in den Wert.
```

### Auf Primitiven stehen

Die Autoren empfehlen, Domänenprimitive **überall** zu verwenden, besonders in Methodensignaturen. Eine Methode `transfer(Iban from, Iban to, Amount amount)` kann nicht mit vertauschten oder ungültigen Werten aufgerufen werden; `transfer(String, String, BigDecimal)` schon. Die Prüfung findet einmal an der Grenze statt, danach kann der Rest des Codes den Werten vertrauen.

### Werte, die man nur einmal lesen darf

Für sensible Daten wie Passwörter oder Kartennummern schlagen die Autoren **Einmal-Lese-Objekte** vor:

```java
// Ein Geheimnis, das man genau einmal lesen kann und das nicht versehentlich ausgegeben wird
public final class Password {
    private char[] value;
    private final AtomicBoolean consumed = new AtomicBoolean(false);

    public Password(char[] value) { this.value = value.clone(); }

    public char[] value() {
        if (consumed.getAndSet(true)) throw new IllegalStateException("Bereits gelesen");
        char[] copy = value.clone();
        Arrays.fill(value, '0');                                   // Original überschreiben
        return copy;
    }

    @Override public String toString() { return "Password[***]"; }  // nie im Log
}
```

So landet ein Passwort nicht versehentlich im Log, in einer Fehlermeldung oder in einem zweiten Codepfad, der es nicht sehen sollte.

### Einordnung

Domänenprimitive sind Evans' Wertobjekte mit einer zusätzlichen, strengen Regel. In Fowlers *Refactoring* heißt das Gegenteil „Primitive Obsession“ und gilt als Code-Smell, samt Refactorings, um es zu beheben. Mit Java-Records sind Domänenprimitive heute so knapp zu schreiben, dass kaum ein Grund bleibt, darauf zu verzichten; Weidig zeigt in *A Functional Approach to Java* denselben Stil.

## Zustand: Integrität und Komplexität

Werte lassen sich unveränderlich machen, Entitäten nicht: Eine Versicherungspolice wird beantragt, angenommen, geändert, gekündigt. Zwei Kapitel behandeln, wie man veränderlichen Zustand sicher hält.

### Integrität sichern

| Regel | Begründung |
|---|---|
| **Vollständige Konstruktoren** | Ein Objekt entsteht mit allen Pflichtangaben in gültigem Zustand. Leere Konstruktoren mit nachträglichen Settern, wie bei JavaBeans üblich, erlauben halbfertige Objekte. |
| **Erbauer mit Prüfung** | Für Objekte mit vielen Angaben sammelt ein Builder die Werte und prüft alles beim Erzeugen. |
| **Keine nackten Setter** | Zustandsänderungen geschehen über fachliche Methoden wie `cancel()`, die Regeln durchsetzen, nicht über `setStatus()`. |
| **Innereien nicht herausgeben** | Interne Listen werden nur als unveränderliche Kopie oder Sicht nach außen gegeben, sonst kann jeder sie ändern. |

### Komplexität verringern

Je mehr Zustände ein Objekt haben kann, desto mehr Kombinationen müssen korrekt behandelt werden, und desto mehr Lücken gibt es. Die Autoren beschreiben vier Muster, um das zu begrenzen:

| Muster | Idee |
|---|---|
| **Teilweise unveränderliche Entitäten** | Was sich nie ändert, etwa die Kennung, ist unveränderlich. |
| **Zustandsobjekt** | Die erlaubten Zustände und Übergänge werden in ein eigenes Objekt ausgelagert und dort geprüft. |
| **Schnappschuss** | Lesende Teile des Systems bekommen eine unveränderliche Momentaufnahme statt der Entität selbst. |
| **Staffelübergabe** | Der Lebenszyklus wird in Phasen zerlegt, jede mit eigenem Typ; ein Antrag wird zur Police, eine Police zur gekündigten Police. |

Die Staffelübergabe lässt sich in modernem Java besonders elegant ausdrücken:

```java
// Jede Phase ist ein eigener Typ; ungültige Übergänge kompilieren nicht
public sealed interface PolicyLifecycle permits Application, ActivePolicy, CancelledPolicy {}

public record Application(ApplicationId id, Customer customer, Coverage coverage) implements PolicyLifecycle {
    public ActivePolicy accept(PolicyNumber number, LocalDate start) {
        return new ActivePolicy(number, customer, coverage, start);
    }
}

public record ActivePolicy(PolicyNumber number, Customer customer, Coverage coverage, LocalDate start)
        implements PolicyLifecycle {
    public CancelledPolicy cancel(LocalDate effective, CancellationReason reason) {
        if (effective.isBefore(start)) throw new IllegalArgumentException("Kündigung vor Beginn");
        return new CancelledPolicy(number, effective, reason);
    }
}

public record CancelledPolicy(PolicyNumber number, LocalDate effective, CancellationReason reason)
        implements PolicyLifecycle {}
// Eine gekündigte Police hat keine Methode cancel(); ein Antrag keine Methode cancel().
```

### Einordnung

Die Staffelübergabe ist Weidigs funktionaler Stil mit Records und versiegelten Typen und erinnert an das Zustandsmuster der Gang of Four, nur dass die Zustände unveränderlich sind und der Compiler Übergänge prüft. Die Regel gegen nackte Setter ist Evans' Forderung nach einer ausdrucksstarken, fachlichen Schnittstelle der Entitäten; Vernon vertieft sie bei den Aggregaten.

## Sicherheit in der Pipeline

Das achte Kapitel zeigt, wie man die Auslieferungspipeline für Sicherheit nutzt, ohne eigene Sicherheitswerkzeuge in den Vordergrund zu stellen.

### Vier Arten von Testfällen

Für jedes Domänenprimitiv und jede Prüfung empfehlen die Autoren vier Kategorien:

| Kategorie | Beispiel für `Quantity` |
|---|---|
| **Normale Eingaben** | 1, 5, 42 |
| **Grenzwerte** | 0, 1, 500, 501 |
| **Ungültige Eingaben** | negative Zahlen, `null` |
| **Extreme Eingaben** | `Integer.MAX_VALUE`, sehr lange Zeichenketten, ungewöhnliche Zeichen |

Die meisten Teams testen nur die erste Kategorie, Angreifer nutzen die letzten drei.

### Weitere Prüfungen in der Pipeline

- **Feature-Schalter testen:** Schalter sind Konfiguration mit Wirkung auf Verhalten; falsch gesetzte oder wiederverwendete Schalter haben schon zu schweren Vorfällen geführt. Jede relevante Kombination muss getestet sein.
- **Konfiguration prüfen:** Sicherheitsrelevante Einstellungen wie TLS-Versionen, Header oder Standardpasswörter werden automatisch geprüft.
- **Verfügbarkeit testen:** Lasttests und Tests für Überlastsituationen gehören zur Sicherheit, weil Verfügbarkeit ein Schutzziel ist.
- **Automatische Sicherheitsscans:** Abhängigkeiten auf bekannte Schwachstellen prüfen, ergänzend zu den Design-Maßnahmen.

## Fehler sicher behandeln

Das neunte Kapitel behandelt, wie Fehler Sicherheitslücken öffnen.

| Problem | Empfehlung |
|---|---|
| **Ausnahmen verraten zu viel** | Fehlermeldungen und Logs enthalten keine sensiblen Daten wie Kontonummern, Abfragen oder Stacktraces nach außen |
| **Fachliche und technische Fehler vermischt** | fachliche Fehler, etwa „Konto gesperrt“, getrennt von technischen, etwa „Datenbank nicht erreichbar“, behandeln |
| **Fehler als Ausnahme statt als Ergebnis** | erwartbare fachliche Fehler als Rückgabewert modellieren, etwa mit einem Ergebnis-Typ, statt sie durch Ausnahmen zu signalisieren |
| **Kaputte Daten reparieren** | ungültige Daten ablehnen statt stillschweigend korrigieren; eine „Reparatur“ kann Angriffe verschleiern |
| **Kaskadierende Ausfälle** | Circuit Breaker, Bulkheads und Timeouts, wie bei Nygard |

### Einordnung

Die vier Testkategorien ähneln Huyens Störungs- und Invarianztests für ML-Modelle, auf klassischen Code übertragen, und Khorikovs Forderung, Verhalten statt Implementierung zu testen. Die Fehlerbehandlung verbindet Nygards *Release It!* mit Sicherheit: Ein System, das unter Last zusammenbricht, ist nicht nur instabil, sondern auch angreifbar. Fehler als Ergebnis zu modellieren, passt zu Weidigs Kapitel über funktionale Fehlerbehandlung.

## Cloud-Denkweise

Das zehnte Kapitel zeigt, dass Prinzipien für Cloud-Anwendungen, etwa die bekannten „Twelve-Factor“-Regeln, auch der Sicherheit dienen:

| Prinzip | Sicherheitsnutzen |
|---|---|
| **Konfiguration aus der Umgebung** | Geheimnisse stehen nicht im Code oder im Repository |
| **Logs als Datenstrom an einen zentralen Dienst** | keine Logdateien mit sensiblen Daten auf einzelnen Servern; zentrale Kontrolle über Zugriff und Aufbewahrung |
| **Zustandslose Prozesse** | Server lassen sich jederzeit austauschen |

Daraus leiten die Autoren drei Gewohnheiten ab: Zugangsdaten **regelmäßig erneuern**, Server **regelmäßig aus einem bekannten, sauberen Stand neu aufsetzen** und Schwachstellen **sofort beheben**. Ein Angreifer, der sich eingenistet hat, verliert so seinen Halt, und gestohlene Zugangsdaten verfallen schnell.

## Legacy-Code

Das zwölfte Kapitel ist besonders praxisnah. Es beschreibt Warnzeichen in bestehendem Code und wie man sie schrittweise beseitigt:

| Warnzeichen | Vorgehen |
|---|---|
| **Mehrdeutige Parameterlisten**, etwa mehrere `String`-Parameter hintereinander | schrittweise durch Domänenprimitive ersetzen, von außen nach innen |
| **Ungeprüfte Zeichenketten im Log** | nur geprüfte Werte loggen; sonst drohen Einschleusung in Logs und Datenlecks |
| **Defensive Prüfungen überall**, etwa `null`-Abfragen in jeder Methode | Zeichen fehlender Domänenprimitive; die Prüfung gehört an die Grenze |
| **Falsch verstandenes DRY** | Gleicher Text ist nicht gleiches Konzept; zusammengelegter Code für verschiedene Konzepte koppelt, was getrennt sein sollte |
| **Halbe Domänenprimitive**, etwa ein Betrag ohne Währung | vervollständigen, damit der Typ das ganze Konzept trägt |
| **Tests nur für den Normalfall** | die vier Testkategorien ergänzen |

## Microservices

Das dreizehnte Kapitel überträgt die Ideen auf verteilte Systeme. Jeder Dienst sollte einem **Bounded Context** entsprechen, seine Schnittstelle ist eine öffentliche Grenze und muss Eingaben vollständig prüfen, auch wenn sie von einem „vertrauten“ internen Dienst kommen. Sensible Daten werden klassifiziert und nur dorthin geschickt, wo sie gebraucht werden. Beim Logging über viele Dienste hinweg braucht man Nachverfolgbarkeit, ohne sensible Daten zu verbreiten.

## Grenzen des Ansatzes

Das letzte Kapitel betont, dass Design nicht alles löst. Bedrohungsanalysen, Penetrationstests, Wissen über typische Angriffe, Notfallprozesse und Sicherheitsfachleute bleiben nötig. Design reduziert die Zahl der Lücken, die diese Maßnahmen finden müssen.

### Einordnung

Das Kapitel über Legacy-Code ist Feathers' Werkzeugkasten aus Sicherheitssicht; das Ersetzen mehrdeutiger Parameterlisten ist ein Refactoring im Sinne Fowlers. Die Warnung vor falsch verstandenem DRY deckt sich mit Hunt und Thomas, die DRY ausdrücklich auf Wissen beziehen, nicht auf Text. Das Microservice-Kapitel ergänzt Newman: Jede Dienstgrenze ist auch eine Vertrauensgrenze.

## Kritik und Einordnung

### Stärken

- **Der richtige Hebel:** Sicherheit als Ergebnis von Design-Gewohnheiten, die Entwickler ohnehin pflegen, statt als zusätzliche Last.
- **Domänenprimitive:** ein einfaches, sofort anwendbares Konzept mit großer Wirkung.
- **Java durchgehend:** Die Beispiele lassen sich direkt übernehmen und mit Records noch knapper schreiben.
- **Legacy-Kapitel:** konkrete Warnzeichen und schrittweise Verbesserungen statt Neubau.
- **Brücke zwischen Welten:** verbindet DDD, Clean Code, Continuous Delivery und Stabilitätsmuster mit Sicherheit.

### Kritikpunkte

**1. Kein umfassendes Sicherheitsbuch.** Authentifizierung, Autorisierung, Kryptografie, Bedrohungsmodellierung und typische Angriffe auf Webanwendungen werden kaum behandelt. Das sagen die Autoren selbst; Leser sollten es nicht als einziges Sicherheitsbuch verstehen.

**2. Wiederholungen.** Manche Ideen, etwa Unveränderlichkeit und Prüfung bei der Erzeugung, kehren in mehreren Kapiteln wieder.

**3. Stand von 2019.** Records, versiegelte Typen und moderne Cloud-Werkzeuge zur Geheimnisverwaltung kommen nicht vor; die Prinzipien gelten trotzdem, die Umsetzung ist heute einfacher.

**4. Aufwand in großen Codebasen.** Domänenprimitive konsequent einzuführen, erfordert viele kleine Typen und Umstellungen. Die Autoren zeigen den schrittweisen Weg, unterschätzen aber, wie viel Überzeugungsarbeit im Team nötig ist.

**5. Neue Angriffsflächen fehlen.** Anwendungen mit Sprachmodellen bringen Risiken wie Prompt-Injection, die sich nicht allein durch Domänenmodellierung abwehren lassen; dafür ist Huyen die Ergänzung.

### Gesamturteil

Das beste Buch, um Sicherheit in den Entwickleralltag zu bringen, ohne aus Entwicklern Sicherheitsfachleute machen zu müssen. Für Java-Teams, die DDD schon nutzen oder einführen wollen, ist es besonders wertvoll. Als Ergänzung empfiehlt sich ein klassisches Werk zu Webanwendungssicherheit und Bedrohungsmodellierung.

## Bezüge zur Reihe

| Thema in *Secure by Design* | Bezug in der Reihe |
|---|---|
| Tiefes Modell statt Zahl, negative Menge | Evans: tiefe Modellierung; Ousterhout: Sonderfälle wegdefinieren |
| Domänenprimitive | Evans: Wertobjekte; Fowler: Primitive Obsession; Bloch: unveränderliche Klassen |
| Records und versiegelte Typen | Weidig: funktionaler Stil in Java; Bloch: Records |
| Unveränderlichkeit | Goetz u.a.: sichere Nebenläufigkeit; Bloch: Unveränderlichkeit bevorzugen |
| Früh scheitern, Vorbedingungen | Hunt und Thomas: Design by Contract, früh abstürzen |
| Prüfreihenfolge, billig zuerst | Nygard: Last abweisen, bevor sie schadet |
| Vollständige Konstruktoren, keine Setter | Bloch: Builder; Martin: Kapselung |
| Staffelübergabe der Zustände | Gang of Four: Zustandsmuster; Vernon: Aggregate |
| Kontextgrenzen als Prüfstellen | Evans: Antikorruptionsschicht; Newman: Dienstgrenzen |
| Vier Kategorien von Testfällen | Khorikov: Verhalten testen; Huyen: Störungs- und Invarianztests |
| Feature-Schalter und Konfiguration testen | Humble und Farley: Konfiguration ist Code |
| Fehler sicher behandeln, Resilienz | Nygard: Stabilitätsmuster; Weidig: funktionale Fehlerbehandlung |
| Erneuern, neu aufsetzen, reparieren | SRE-Buch: Automatisierung; Humble und Farley: unveränderliche Infrastruktur |
| Warnzeichen in Legacy-Code | Feathers: Legacy-Code; Fowler: Refactoring |
| DRY bezieht sich auf Wissen | Hunt und Thomas: DRY |
| Grenzen des Ansatzes | Huyen: Prompt-Injection; Goodfellow u.a.: adversarielle Beispiele |

## Diskussionsfragen

1. **Negative Mengen:** Wo in euren Systemen könnte ein „Wert, der keine Zahl ist“ ungültige Zustände zulassen?
2. **Domänenprimitive:** Wie viele fachliche Werte werden bei euch als `String` oder `BigDecimal` durchgereicht? Wo würdet ihr anfangen?
3. **Prüfreihenfolge:** Prüfen eure Schnittstellen Größe und Zeichen, bevor sie parsen?
4. **Setter:** Wie viele eurer Entitäten haben öffentliche Setter? Was würde passieren, wenn ihr sie durch fachliche Methoden ersetzt?
5. **Fehlermeldungen:** Welche sensiblen Daten landen bei euch in Logs oder Fehlermeldungen?
6. **Tests:** Enthalten eure Tests Grenzwerte und extreme Eingaben, oder nur den Normalfall?
7. **Dienstgrenzen:** Vertrauen eure internen Dienste einander blind?
8. **Ergänzung:** Welche Sicherheitsthemen jenseits des Designs bräuchte euer Team am dringendsten?
