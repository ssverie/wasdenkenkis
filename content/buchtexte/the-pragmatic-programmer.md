+++
title = "The Pragmatic Programmer – Zusammenfassung und Einordnung"
description = "David Thomas, Andrew Hunt, The Pragmatic Programmer: Your Journey to Mastery (1999, 2. Auflage 2019)"
date = 2026-10-29T14:51:21+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["the-pragmatic-programmer-2019"]
+++

## Einleitung

The Pragmatic Programmer ist kein Buch über eine Technik, eine Sprache oder ein Designprinzip, sondern über eine **Haltung**: Verantwortung übernehmen, ständig lernen, kritisch denken, Werkzeuge beherrschen und Entscheidungen so treffen, dass man sie später ändern kann.

### Autoren und Kontext

Dave Thomas und Andy Hunt waren Berater, gehören wie Martin und Fowler zu den Unterzeichnern des Agilen Manifests und gründeten später den Verlag Pragmatic Bookshelf. Gemeinsam schrieben sie außerdem das „Pickaxe“-Buch, mit dem Ruby außerhalb Japans bekannt wurde.

|  | 1. Auflage (1999) | 2. Auflage (2019) |
|---|---|---|
| Untertitel | From Journeyman to Master | Your Journey to Mastery |
| Umfang | 46 Abschnitte, 70 Tipps | 53 Abschnitte, 100 Tipps |
| Neu | – | ETC als Leitprinzip, Nebenläufigkeit, Transformationen, Property-Based Testing, Sicherheit, Agilität |
| Gestrichen bzw. umgebaut | Teile zu Code-Generatoren, CORBA, älteren Werkzeugen | modernisierte Beispiele |

Die Autoren sagen selbst, dass etwa ein Drittel der zweiten Auflage neu ist und der Rest fast vollständig überarbeitet. Diese Zusammenfassung bezieht sich auf die zweite Auflage.

### Aufbau

Neun Kapitel mit 53 kurzen, eigenständigen Abschnitten. Über das Buch verteilt sind **100 nummerierte Tipps**, kurze Merksätze, die auch als Karte am Buchende gesammelt sind. Dazu Übungen und Aufgaben zum Nachdenken.

| Kapitel | Thema |
|---|---|
| 1 | Eine pragmatische Philosophie |
| 2 | Ein pragmatischer Ansatz: ETC, DRY, Orthogonalität, Tracer Bullets |
| 3 | Die Grundwerkzeuge |
| 4 | Pragmatische Paranoia |
| 5 | Biegen oder brechen: Entkopplung |
| 6 | Nebenläufigkeit |
| 7 | Während man programmiert |
| 8 | Vor dem Projekt |
| 9 | Pragmatische Projekte |

### Grundhaltung

Das Wort „pragmatisch“ ist wörtlich gemeint: keine Dogmen, keine einzig richtige Methode, sondern die Fähigkeit, für jede Situation das passende Werkzeug zu wählen. Thomas und Hunt setzen dabei viel voraus, was die anderen Bücher dieser Reihe ausführlich behandeln, und streifen es nur. Stattdessen geht es um die Frage, was einen guten Entwickler über einzelne Techniken hinaus ausmacht.

Der Ton ist leicht, mit vielen Anekdoten und Metaphern. Das macht das Buch zum zugänglichsten dieser Reihe und erklärt, warum es oft als erstes Buch nach dem Studium empfohlen wird.

## Eine pragmatische Philosophie

Das erste Kapitel beschreibt, wie pragmatische Entwickler denken. Es enthält kaum Technik, aber einige der bekanntesten Bilder der Softwarebranche.

### Es ist dein Leben

Der erste Tipp der zweiten Auflage: Man hat Handlungsspielraum. Wer mit seiner Arbeit, seinem Team oder seinen Werkzeugen unzufrieden ist, kann etwas ändern, notfalls den Arbeitgeber. Die Autoren nennen die Branche eine der wenigen, in denen man sich die Bedingungen weitgehend selbst aussuchen kann.

### Verantwortung: Die Katze hat meinen Code gefressen

Pragmatische Entwickler übernehmen Verantwortung für ihre Arbeit, auch für Fehler. Statt Ausreden liefert man **Optionen**: Was kann man tun, um das Problem zu lösen oder den Schaden zu begrenzen? Wer sich auf eine Aufgabe einlässt, deren Risiken außerhalb seiner Kontrolle liegen, sagt das vorher.

### Software-Entropie und zerbrochene Fenster

Das berühmteste Bild des Buchs, abgeleitet aus der „Broken Windows“-Theorie der Kriminologie: Ein Gebäude mit einem zerbrochenen Fenster, das niemand repariert, verfällt schnell, weil das Fenster signalisiert, dass sich niemand kümmert. Für Code heißt das: **Keine zerbrochenen Fenster dulden.** Schlechtes Design, falsche Entscheidungen und schlampigen Code sofort beheben, oder zumindest sichtbar markieren und eindämmen.

Das ist der Vorläufer von Martins Pfadfinderregel und Fowlers Aufräumen nebenbei. Die Autoren ergänzen eine psychologische Beobachtung: In makellosem Code traut sich niemand, als Erster etwas zu verschlechtern. In verwahrlostem Code fällt eine weitere Abkürzung nicht mehr auf.

### Steinsuppe und gekochte Frösche

Zwei Gegenbilder zur Veränderung:

- **Steinsuppe:** Ein Märchen, in dem Reisende mit nur einem Stein im Topf ein Dorf dazu bringen, Zutaten beizusteuern. Übertragen: Wer eine Veränderung will, baut zuerst etwas Kleines, das funktioniert, und lässt andere daran teilhaben. Menschen schließen sich lieber einem laufenden Erfolg an als einem Plan.
- **Gekochter Frosch:** Ein Frosch, der langsam erhitzt wird, bemerkt die Gefahr nicht. Übertragen: Projekte verschlechtern sich schleichend. Man muss das große Bild im Blick behalten, nicht nur die eigene Aufgabe.

### Gut genug

Software muss nicht perfekt sein, sondern **gut genug** für ihren Zweck. Was gut genug ist, entscheiden die Nutzer, nicht die Entwickler. Wer Nutzer früh einbezieht, liefert schneller Nützliches. Wer endlos poliert, macht Software nicht besser, sondern verspätet. Das heißt nicht, schlampig zu arbeiten, sondern Qualitätsanforderungen bewusst festzulegen.

### Das Wissensportfolio

Wissen ist ein Vermögen, das an Wert verliert. Die Autoren übertragen Regeln der Geldanlage auf das Lernen:

| Anlageregel | Übertragung |
|---|---|
| Regelmäßig investieren | jedes Jahr mindestens eine neue Sprache lernen, jedes Quartal ein Fachbuch lesen |
| Diversifizieren | nicht nur eine Technologie beherrschen |
| Risiko steuern | neben sicheren auch riskante, neue Technologien ausprobieren |
| Günstig kaufen, teuer verkaufen | aufkommende Technologien früh lernen |
| Überprüfen und umschichten | Wissen regelmäßig hinterfragen |

Dazu kommt **kritisches Denken**: Bei jeder Information fragen, wer davon profitiert, in welchem Kontext sie gilt und warum sie ein Problem sein soll.

### Kommunizieren

Eine gute Idee ist wertlos, wenn man sie nicht vermitteln kann. Die Autoren geben Ratschläge, die eher aus einem Kommunikationsbuch stammen: das Publikum kennen, wissen, was man sagen will, den richtigen Zeitpunkt wählen, zuhören, auf Nachrichten antworten. Dokumentation gehört dazu und soll nah am Code entstehen, nicht als nachträgliche Pflicht.

## ETC: Das Wesen guten Designs

Die wichtigste Neuerung der zweiten Auflage: Alle Designprinzipien lassen sich auf eine Frage zurückführen. **Ist es leichter zu ändern?** Englisch **ETC**, „Easier to Change“.

Die Autoren argumentieren, dass Entkopplung, Single Responsibility, gute Namen und Tests nur deshalb gut sind, weil sie Code leichter änderbar machen. ETC ist damit kein weiteres Prinzip, sondern ein Wert, an dem man alle anderen misst. Wenn man unsicher ist, wählt man die Variante, die später am leichtesten zu ändern wäre, und notiert die Entscheidung im Arbeitsjournal.

Das ist fast deckungsgleich mit Ousterhouts Komplexitätsbegriff, der Komplexität als das definiert, was Software schwer verständlich und schwer änderbar macht, und mit Fowlers ökonomischer Begründung von Refactoring.

## DRY: Don't Repeat Yourself

DRY ist das bekannteste Prinzip des Buchs und das am häufigsten missverstandene. Die Definition: **Jedes Stück Wissen muss eine einzige, eindeutige, maßgebliche Darstellung im System haben.**

Entscheidend ist das Wort **Wissen**, nicht Code. Die Autoren betonen in der zweiten Auflage ausdrücklich, dass sie mit DRY nie „kopiere keinen Code“ gemeint haben.

```java
// Gleicher Code, aber verschiedenes Wissen: KEIN DRY-Verstoß
boolean isValidAge(int age)        { return age >= 0 && age <= 150; }
boolean isValidQuantity(int qty)   { return qty >= 0 && qty <= 150; }
// Zufällig gleich. Ändert sich die Altersgrenze, soll sich die Mengengrenze nicht mitändern.

// Verschiedener Code, aber gleiches Wissen: DRY-Verstoß
class Invoice  { BigDecimal tax() { return net.multiply(new BigDecimal("0.19")); } }
class Receipt  { double vat()     { return amount * 0.19; } }
// Der Steuersatz steht zweimal. Ändert er sich, muss man beide Stellen finden.
```

### Arten von Duplikation

| Art | Beispiel |
|---|---|
| In Code | dieselbe Fachregel an mehreren Stellen |
| In Dokumentation | Kommentar, der den Code nacherzählt und veraltet |
| In Daten | gespeicherter Wert, der sich aus anderen berechnen lässt |
| Zwischen Repräsentationen | Datenbankschema, Klasse und API-Schema beschreiben dasselbe |
| Zwischen Entwicklern | zwei Teams lösen dasselbe Problem unabhängig |

Gegen die Duplikation zwischen Repräsentationen helfen Generatoren, etwa Code aus einer OpenAPI-Spezifikation oder Schemas aus Klassen. Gegen Duplikation zwischen Entwicklern hilft nur Kommunikation.

### DRY und die Gegenstimme

Die Fehlinterpretation von DRY als „keine zwei ähnlichen Zeilen“ hat zu vorschnellen Abstraktionen geführt, die später schwer zu lösen waren. Sandi Metz hat dagegen den viel zitierten Satz geprägt, Duplikation sei weit billiger als die falsche Abstraktion. Bei richtiger Lesart widerspricht das DRY nicht: Zufällig gleicher Code ist keine Wissensduplikation.

## Orthogonalität

Zwei Komponenten sind **orthogonal**, wenn Änderungen an der einen die andere nicht beeinflussen. Der Begriff stammt aus der Geometrie, wo orthogonale Achsen unabhängig voneinander sind.

Das Gegenbeispiel der Autoren ist ein Hubschrauber, bei dem jedes Steuerelement alle anderen beeinflusst: Wer die Höhe ändert, muss gleichzeitig Drehmoment und Richtung ausgleichen.

### Vorteile

- **Produktivität:** Änderungen bleiben lokal, Komponenten lassen sich wiederverwenden und kombinieren.
- **Geringeres Risiko:** Ein Fehler betrifft nur eine Komponente, Tests werden einfacher.

### Wie man Orthogonalität erreicht

- **Code entkoppeln:** Keine Interna anderer Module offenlegen, nicht auf Implementierungen anderer Module verlassen.
- **Globale Daten vermeiden**, auch in Form von Singletons.
- **Ähnliche Funktionen vermeiden**, die man in eine gemeinsame Hilfsfunktion zusammenführen kann.
- **Fremdbibliotheken prüfen:** Zwingt eine Bibliothek dazu, eigenen Code auf eine bestimmte Weise zu strukturieren?
- **Teams orthogonal organisieren:** Wenn eine Änderung mehrere Teams betrifft, ist die Aufteilung nicht orthogonal.

Ein einfacher Test: Wenn sich eine Anforderung ändert, wie viele Module sind betroffen? Bei einem orthogonalen System eines.

### Einordnung

Orthogonalität ist Ousterhouts Information Hiding, Martins SRP und Evans' Bounded Context auf allgemeinster Ebene. Der letzte Punkt zu Teams nimmt *Team Topologies* um zwanzig Jahre vorweg.

## Reversibilität

Es gibt keine endgültigen Entscheidungen. Datenbank, Framework, Cloud-Anbieter oder Architekturstil können sich ändern, und oft ändern sie sich, weil Anforderungen, Preise oder Technik sich ändern.

Die Autoren schildern, wie Moden kommen und gehen: von Mainframes über Client-Server zu Web, Cloud und Serverless. Wer eine Entscheidung so tief einbaut, dass sie nicht mehr zu ändern ist, wird beim nächsten Wechsel teuer bezahlen. Der Rat lautet nicht, alles abstrakt zu machen, sondern Entscheidungen hinter Schnittstellen zu verbergen, wo sie sich voraussichtlich ändern werden.

In der zweiten Auflage sind die Autoren vorsichtiger als 1999: Sie warnen auch davor, für jede denkbare Änderung vorzusorgen. Das Ziel ist Flexibilität dort, wo Änderungen wahrscheinlich sind, ganz im Sinne von Ousterhouts „ein wenig allgemein“ und gegen Fowlers Speculative Generality.

## Tracer Bullets

Leuchtspurmunition zeigt dem Schützen sofort, wo seine Schüsse landen, statt dass er alles vorab berechnet. Übertragen: Man baut früh eine dünne, aber **vollständige** Verbindung durch alle Schichten des Systems, von der Oberfläche über die Logik bis zur Datenbank. Sie ist kein Wegwerfcode, sondern das Skelett, an dem das System wächst.

```java
// Tracer Bullet für "Bestellung aufgeben": dünn, aber echt durchgängig
@PostMapping("/orders")
ResponseEntity<OrderId> place(@RequestBody PlaceOrder cmd) {
    OrderId id = orderService.place(cmd);    // vorerst nur eine Regel
    return ResponseEntity.ok(id);
}

class OrderService {
    OrderId place(PlaceOrder cmd) {
        var order = Order.open(cmd.customerId(), cmd.items());
        repository.save(order);               // echte Datenbank, echtes Schema
        return order.id();
    }
}
```

Vorteile: Nutzer sehen früh etwas Lauffähiges, Entwickler haben eine Struktur, an der sie arbeiten können, Integrationsprobleme fallen früh auf, und der Fortschritt ist messbar.

## Prototypen und Post-its

Ein **Prototyp** dagegen ist Wegwerfcode. Er beantwortet eine bestimmte Frage, etwa nach Machbarkeit, Performance oder Benutzerführung, und wird danach verworfen. Man lässt dabei bewusst Korrektheit, Vollständigkeit, Robustheit und Stil weg.

|  | Tracer Bullet | Prototyp |
|---|---|---|
| Zweck | Struktur aufbauen, Ende-zu-Ende-Fluss zeigen | eine Frage klären |
| Code | Produktionscode, wenn auch dünn | Wegwerfcode |
| Danach | wird ausgebaut | wird verworfen |

Die größte Gefahr ist, dass Manager einen gelungenen Prototyp mit einem fast fertigen Produkt verwechseln. Die Autoren raten, das vorab klar zu kommunizieren oder Prototypen bewusst in einer anderen Sprache oder auf Papier zu bauen, etwa mit Post-its für Abläufe und Oberflächen.

## Domänensprachen

Pragmatische Entwickler programmieren nah an der Sprache der Domäne. Die Autoren unterscheiden **interne** domänenspezifische Sprachen, die in einer Wirtssprache eingebettet sind, und **externe**, die eigene Syntax haben und geparst werden. In Java sind interne DSLs etwa Fluent-APIs wie bei Testframeworks, externe etwa YAML-Konfigurationen oder Regelsprachen.

```java
// interne DSL in Java (AssertJ)
assertThat(order.items())
    .hasSize(2)
    .extracting(Item::sku)
    .containsExactly("A-100", "B-200");
```

Die Warnung der zweiten Auflage: Nicht zu viel in eigene Sprachen investieren. Oft reichen vorhandene Formate oder eine gute API.

## Schätzen

Schätzen lernt man durch Üben. Die Ratschläge:

- **Die Einheit verrät die Genauigkeit:** „130 Arbeitstage“ klingt präziser als „etwa sechs Monate“, auch wenn beides gleich unsicher ist. Die Einheit soll zur tatsächlichen Genauigkeit passen.
- **Ein Modell bauen:** Den Ablauf grob zerlegen, Parameter benennen, Werte schätzen, rechnen.
- **Erfahrung festhalten:** Schätzungen notieren und mit dem Ergebnis vergleichen.
- **Iterativ verfeinern:** Statt eine Zahl für das ganze Projekt zu nennen, nach jeder Iteration neu schätzen.
- **Auf Nachfrage:** Die richtige Antwort ist oft „Ich melde mich dazu“. Wer spontan schätzt, schätzt meist schlecht.

Die Autoren betonen: Eine Schätzung ist keine Zusage. Wer sie als Deadline behandelt, bekommt künftig nur noch aufgeblähte Schätzungen.

## Die Grundwerkzeuge

Ein Handwerker beginnt mit einem Satz guter Grundwerkzeuge und lernt sie so gut, dass sie zur Verlängerung seiner Hände werden. Für Entwickler gilt dasselbe.

| Werkzeug | Kernaussage |
|---|---|
| Klartext | Wissen in einfachem Text speichern, nicht in proprietären Binärformaten |
| Shell | Die Kommandozeile beherrschen, nicht nur grafische Oberflächen |
| Editor | Einen Editor so gut beherrschen, dass man nicht über ihn nachdenkt |
| Versionskontrolle | Alles versionieren, nicht nur Code |
| Debugging | Das Problem lösen, nicht die Schuld verteilen |
| Textverarbeitung | Eine Skriptsprache für Textbearbeitung lernen |
| Arbeitsjournal | Ein Notizbuch für Gedanken, Entscheidungen und Experimente führen |

### Klartext

Klartext ist menschenlesbar, überlebt die Programme, die ihn erzeugt haben, und lässt sich mit jedem Werkzeug verarbeiten. Konfiguration, Testdaten, Dokumentation und Datenaustausch gehören deshalb in Textformate wie JSON, YAML, CSV oder Markdown. Der kleine Effizienzverlust gegenüber Binärformaten lohnt sich fast immer.

### Shell und Editor

Die Autoren nennen grafische Oberflächen „was du siehst, ist alles, was du bekommst“. Mit der Shell lassen sich Werkzeuge kombinieren und Abläufe automatisieren. Für den Editor empfehlen sie, ihn **flüssig** zu beherrschen: Navigation, Auswahl, Mehrfachbearbeitung, Makros, ohne zur Maus zu greifen. Die zweite Auflage verzichtet bewusst darauf, einen bestimmten Editor zu empfehlen.

### Versionskontrolle

Nicht nur Code, sondern alles, was man braucht, um das System zu bauen: Konfiguration, Build-Skripte, Dokumentation, Infrastruktur. Die zweite Auflage ergänzt: Versionskontrolle ist auch ein Werkzeug für Zusammenarbeit, Experimente in Branches und automatisierte Pipelines, die bei jedem Commit bauen und testen.

### Debugging

Die Ratschläge gehören zu den praktischsten des Buchs:

- **Keine Panik.** Erst denken, dann ändern.
- **Fehler reproduzierbar machen**, am besten mit einem fehlschlagenden Test.
- **Die Fehlermeldung lesen**, vollständig.
- **Binär suchen:** Die Eingabe oder den Zeitraum halbieren, bis man den Auslöser findet. `git bisect` macht das für Commits.
- **Rubber Ducking:** Das Problem einem Gegenüber erklären, notfalls einer Gummiente. Oft findet man den Fehler beim Erklären selbst.
- **„select ist nicht kaputt“:** Der Fehler liegt fast nie im Betriebssystem, Compiler oder in einer verbreiteten Bibliothek, sondern im eigenen Code.
- **Nicht annehmen, beweisen.** Was man für unmöglich hält, prüft man trotzdem.

Der Begriff **Rubber Duck Debugging** stammt aus diesem Buch und ist heute Allgemeingut.

### Textverarbeitung und Arbeitsjournal

Eine Skriptsprache wie Python oder Ruby für schnelle Textmanipulation spart viel Zeit: Logdateien auswerten, Daten umformen, Code generieren. Das **Engineering Daybook** ist neu in der zweiten Auflage: ein Notizbuch, in dem man festhält, woran man arbeitet, was man ausprobiert hat, welche Entscheidungen man warum getroffen hat. Es hilft beim Nachdenken und als Gedächtnis.

### Einordnung

Dieses Kapitel ist am stärksten an eine Arbeitsweise gebunden, die vor allem bei Unix-affinen Entwicklern verbreitet ist. Moderne IDEs wie IntelliJ IDEA übernehmen vieles, was die Autoren der Shell und dem Editor zuschreiben, etwa Refactoring, Navigation und Suche. Die Grundidee bleibt richtig: Werkzeuge wirklich beherrschen, statt sie nur zu benutzen.

## Pragmatische Paranoia

Niemand schreibt perfekten Code, auch man selbst nicht. Pragmatische Entwickler verteidigen sich deshalb gegen die eigenen Fehler, nicht nur gegen die anderer.

### Design by Contract

Das Konzept stammt von Bertrand Meyer und der Sprache Eiffel. Jede Methode hat einen Vertrag:

- **Vorbedingungen:** was gelten muss, bevor sie aufgerufen wird
- **Nachbedingungen:** was sie garantiert, wenn sie fertig ist
- **Invarianten:** was für ein Objekt immer gilt, vor und nach jedem Aufruf

Der Merksatz der Autoren lautet sinngemäß: **Sei streng bei dem, was du annimmst, und verspreche so wenig wie möglich.**

Java hat keine eingebauten Verträge, aber man kann sie ausdrücken:

```java
public Money withdraw(Money amount) {
    // Vorbedingungen
    Objects.requireNonNull(amount, "amount");
    if (!amount.isPositive()) throw new IllegalArgumentException("Betrag muss positiv sein: " + amount);
    if (amount.isGreaterThan(balance)) throw new InsufficientFundsException(id, amount, balance);

    Money before = balance;
    balance = balance.minus(amount);

    // Nachbedingung und Invariante, im Test oder mit -ea aktiv
    assert balance.equals(before.minus(amount));
    assert !balance.isNegative() : "Invariante verletzt: Kontostand negativ";
    return balance;
}
```

Die Autoren stellen DbC und TDD nebeneinander: Tests prüfen konkrete Fälle, Verträge gelten für alle Aufrufe. Beides ergänzt sich.

### Tote Programme lügen nicht

Wenn etwas Unmögliches passiert, soll das Programm **sofort abbrechen**, statt weiterzumachen und kaputte Daten zu erzeugen. Ein abgestürztes Programm richtet meist weniger Schaden an als eines, das falsch weiterläuft.

```java
// schlecht: Fehler verschluckt, Programm läuft mit falschem Zustand weiter
try {
    config = loadConfig();
} catch (IOException e) {
    config = new Config();   // "wird schon passen"
}

// besser: früh und laut scheitern
config = loadConfig();       // IOException wird weitergereicht oder beendet den Start
```

Die Autoren verweisen auf Erlang, dessen Philosophie „let it crash“ genau dies umsetzt: Prozesse dürfen abstürzen, ein Supervisor startet sie neu.

### Assertive Programmierung

Wenn man denkt „das kann nicht passieren“, soll man es prüfen. Assertions dokumentieren Annahmen und schlagen an, wenn sie falsch sind. Zwei Warnungen: Assertions dürfen keine Seiteneffekte haben, und sie sind kein Ersatz für echte Fehlerbehandlung, etwa bei Benutzereingaben.

Die Autoren widersprechen der verbreiteten Praxis, Assertions in Produktion abzuschalten. Ihr Argument: Gerade in Produktion treten die unerwarteten Fälle auf. In Java sind `assert`-Anweisungen standardmäßig deaktiviert, deshalb nutzt man für wichtige Prüfungen meist explizite Exceptions.

### Ressourcen ausbalancieren

Der Merksatz: **Bringe zu Ende, was du begonnen hast.** Wer eine Ressource öffnet, schließt sie auch, im selben Gültigkeitsbereich. Ressourcen in umgekehrter Reihenfolge freigeben, in der man sie belegt hat, und immer in derselben Reihenfolge belegen, um Deadlocks zu vermeiden. In Java ist das try-with-resources.

### Nicht schneller fahren, als die Scheinwerfer reichen

Neu in der zweiten Auflage: Kleine Schritte machen, nach jedem Schritt Feedback holen, und nie weiter in die Zukunft planen, als man sehen kann. Wer große, ungetestete Sprünge macht, merkt Fehler erst spät. Das ist im Kern Fowlers Refactoring-Rhythmus und Feathers' Disziplin, auf allgemeine Entwicklungsarbeit übertragen.

## Biegen statt brechen

Das Leben ändert sich, und Software muss mithalten. Dieses Kapitel ist in der zweiten Auflage am stärksten neu geschrieben und dreht sich um Entkopplung.

### Entkopplung

Kopplung ist der Feind der Änderung. Die Autoren nennen typische Symptome: Änderungen an einem Modul erzwingen Änderungen an vielen anderen, Entwickler scheuen sich vor Änderungen, weil sie nicht wissen, was passiert, und Meetings, in denen alle anwesend sein müssen, weil jede Änderung alle betrifft.

**Zugunglücke vermeiden:** Statt durch Objektketten zu greifen und Entscheidungen beim Aufrufer zu treffen, sagt man dem Objekt, was es tun soll.

```java
// Zugunglück: Aufrufer kennt die Struktur von Kunde, Bestellung und Summe
public void applyDiscount(Customer customer, OrderId orderId, BigDecimal discount) {
    var totals = customer.orders().find(orderId).getTotals();
    totals.setGrandTotal(totals.getGrandTotal().subtract(discount));
    totals.setDiscount(discount);
}

// Tell, Don't Ask
public void applyDiscount(Customer customer, OrderId orderId, BigDecimal discount) {
    customer.findOrder(orderId).applyDiscount(discount);
}
```

Die Autoren sind dabei pragmatisch: Ketten über Dinge, die sich voraussichtlich nicht ändern, etwa Sprachbibliotheken oder Streams, sind in Ordnung. Problematisch sind Ketten durch eigenen Anwendungscode.

**Globale Daten vermeiden**, auch Singletons und externe Ressourcen wie eine global zugreifbare Datenbank. Wenn etwas global sein muss, dann hinter einer API.

### Mit der Welt jonglieren: Ereignisse

Anwendungen reagieren auf Ereignisse: Benutzereingaben, Nachrichten, Zeit. Die Autoren stellen vier Strategien vor:

| Strategie | Idee |
|---|---|
| Endliche Automaten | Zustände und Übergänge explizit modellieren |
| Observer | Quelle benachrichtigt registrierte Beobachter |
| Publish/Subscribe | Entkopplung über Kanäle, Sender kennt Empfänger nicht |
| Reaktive Streams | Ereignisse als Datenströme, mit Operatoren kombinierbar |

### Transformationen

Eine zentrale neue Idee der zweiten Auflage: **Programme sind Datentransformationen.** Statt in Objekten und Zuständen zu denken, beschreibt man den Weg von Eingabe zu Ausgabe als Folge von Schritten. Die Autoren kommen von Elixir und dessen Pipe-Operator `|>`. In Java entspricht das Stream-Pipelines oder verketteten Funktionen:

```java
List<String> report = Files.lines(logFile)
    .filter(line -> line.contains("ERROR"))
    .map(LogEntry::parse)
    .collect(groupingBy(LogEntry::component, counting()))
    .entrySet().stream()
    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
    .map(e -> e.getKey() + ": " + e.getValue())
    .toList();
```

Der Rat: Daten nicht in Objekten horten, sondern weiterreichen. Jede Transformation ist eine kleine, testbare Funktion. Das passt zu Evans' Side-Effect-Free Functions und Fowlers Split Phase.

### Die Vererbungssteuer

Die Autoren sind deutlicher als alle anderen Bücher dieser Reihe: Vererbung zur Wiederverwendung von Code ist fast immer ein Fehler, weil sie Kopplung erzeugt. Sie nennen drei Alternativen:

1. **Interfaces bzw. Protokolle für Polymorphie:** Klassen implementieren Verhalten, statt es zu erben.
2. **Delegation:** Hat-ein statt Ist-ein. Eine Klasse nutzt einen Dienst, statt davon zu erben.
3. **Mixins und Traits:** Gemeinsame Funktionalität einmischen, in Java über Default-Methoden in Interfaces.

### Konfiguration

Werte, die sich nach der Auslieferung ändern können, gehören in externe Konfiguration: Zugangsdaten, Logging-Stufen, Ports, Grenzwerte, Feature-Schalter. Die Autoren empfehlen, Konfiguration hinter einer schlanken API zu verbergen statt sie überall direkt zu lesen. Die zweite Auflage ergänzt **Konfiguration als Dienst**, also zentral verwaltete Konfiguration, die zur Laufzeit geändert werden kann. Gleichzeitig warnen sie: Wer alles konfigurierbar macht, verschiebt Entscheidungen nur, statt sie zu treffen. Das ist Ousterhouts Einwand gegen Konfigurationsparameter.

## Nebenläufigkeit

Ein eigenes Kapitel, neu in der zweiten Auflage. Die Autoren unterscheiden **Nebenläufigkeit**, also die Fähigkeit, dass Code so wirkt, als liefe er gleichzeitig, und **Parallelität**, also echte gleichzeitige Ausführung auf mehreren Kernen.

### Zeitliche Kopplung aufbrechen

Viel Code ist unnötig sequenziell: Schritt B wartet auf A, obwohl er nicht davon abhängt. Die Autoren empfehlen **Aktivitätsdiagramme**, um zu sehen, was wirklich voneinander abhängt. Ihr Beispiel ist das Mixen einer Piña Colada: Manche Schritte müssen nacheinander passieren, viele können gleichzeitig laufen.

```java
// sequenziell, obwohl unabhängig
var price    = pricing.quote(product);
var stock    = inventory.check(product);
var shipping = logistics.estimate(product, address);

// parallel, mit klarer Zusammenführung
var priceF    = CompletableFuture.supplyAsync(() -> pricing.quote(product));
var stockF    = CompletableFuture.supplyAsync(() -> inventory.check(product));
var shippingF = CompletableFuture.supplyAsync(() -> logistics.estimate(product, address));
var offer = priceF.thenCombine(stockF, Offer::new).thenCombine(shippingF, Offer::withShipping).join();
```

### Geteilter Zustand ist falscher Zustand

Der zentrale Merksatz des Kapitels. Das Beispiel: zwei Kellner in einem Diner, die beide im selben Moment das letzte Stück Kuchen an einen Gast verkaufen, weil beide nachsehen, dass noch eines da ist. Das ist ein klassisches Check-then-act-Problem.

Die Lösungen in aufsteigender Güte:

1. **Semaphoren und Locks:** funktionieren, sind aber fehleranfällig, weil jeder Zugriff daran denken muss.
2. **Ressourcen transaktional machen:** Die Ressource selbst kapselt die Sperre, etwa eine Methode `takeLastPieceIfAvailable()`, die atomar prüft und entnimmt.
3. **Zustand gar nicht teilen:** die beste Lösung, wo immer sie möglich ist.

```java
// Check-then-act, fehlerhaft unter Nebenläufigkeit
if (display.hasPie()) { display.takePie(); serve(); }

// atomar in der Ressource
if (display.tryTakePie()) serve();

// in Java etwa mit atomaren Operationen
boolean taken = pieCount.getAndUpdate(n -> n > 0 ? n - 1 : 0) > 0;
```

### Aktoren und Prozesse

Die Autoren bevorzugen das **Aktorenmodell**: unabhängige Einheiten mit eigenem, privatem Zustand, die nur über Nachrichten kommunizieren. Es gibt keinen geteilten Zustand und damit keine Sperren. Ihre Beispiele stammen aus Erlang und Elixir. In der JVM-Welt gibt es Akka bzw. dessen Fork Apache Pekko.

### Blackboards

Ein **Blackboard** ist ein gemeinsamer Ort, an dem unabhängige Teilnehmer Informationen ablegen und darauf reagieren, ohne einander zu kennen. Das Bild sind Detektive, die an einer Pinnwand Hinweise sammeln. In heutigen Systemen entspricht das Message Brokern wie Kafka oder Event-Stores, auf die viele Dienste lesen und schreiben.

### Einordnung

Das Kapitel ist kurz und eher konzeptionell als technisch. Für Java-Entwickler bietet Bloch oder Goetz' *Java Concurrency in Practice* deutlich mehr Tiefe. Die Grundbotschaft, Zustand nicht zu teilen, deckt sich aber mit allen anderen Büchern und mit der Richtung, die Java mit unveränderlichen Records und Virtual Threads genommen hat.

## Beim Programmieren

Programmieren ist kein mechanisches Umsetzen eines Entwurfs, sondern fortlaufendes Nachdenken. Dieses Kapitel sammelt Gewohnheiten für die tägliche Arbeit am Code.

### Auf das Bauchgefühl hören

Neu in der zweiten Auflage: Wenn sich eine Aufgabe zäh anfühlt oder man ein ungutes Gefühl hat, ist das oft ein Signal des Unterbewusstseins, dass etwas nicht stimmt. Die Autoren raten, kurz innezuhalten und dem Gefühl nachzugehen: Ist das Design falsch? Fehlt Wissen? Ein Mittel dagegen ist, bewusst einen Prototyp zu beginnen, um herauszufinden, was einen stört.

### Programmieren durch Zufall

Wer nicht versteht, warum Code funktioniert, programmiert durch Zufall. Typische Formen: Implementierungszufälle, bei denen man sich auf undokumentiertes Verhalten verlässt, Phantommuster, bei denen man Zusammenhänge sieht, die es nicht gibt, und Kontextzufälle, etwa die Annahme, dass immer eine bestimmte Zeitzone oder Sprache eingestellt ist.

Gegenmittel: bewusst programmieren, Annahmen dokumentieren und testen, sich nur auf zuverlässige Dinge verlassen und die eigene Erfahrung nicht mit Wissen verwechseln.

### Algorithmengeschwindigkeit

Pragmatische Entwickler kennen die O-Notation und schätzen die Kosten ihres Codes grob ab: konstant, logarithmisch, linear, n log n, quadratisch, exponentiell. Der Rat ist zweiteilig: Schätzen, aber dann **messen**. Und der beste Algorithmus ist nicht immer der schnellste, wenn die Datenmengen klein sind.

### Refactoring

Code ist eher ein Garten als ein Gebäude: Er wächst und muss gepflegt werden. Anlässe für Refactoring sind Duplikation, nicht-orthogonales Design, veraltetes Wissen, veränderte Nutzung und Performance. Die Ratschläge entsprechen Fowler: Refactoring und Funktionserweiterung trennen, vorher Tests haben, kleine Schritte machen.

### Testen für den Code

Eine bemerkenswerte These: **Beim Testen geht es nicht darum, Fehler zu finden.** Der größte Nutzen von Tests entsteht, wenn man über sie nachdenkt, also beim Entwerfen. Wer überlegt, wie er etwas testen will, entdeckt Kopplung und unklare Schnittstellen.

Zu TDD sind die Autoren differenziert: Sie mögen es, warnen aber vor zwei Fallen. Man kann sich in endlosen kleinen Tests verlieren, ohne das Gesamtbild zu sehen. Und man kann Code von unten nach oben wachsen lassen, der nie zusammenpasst. Ihr Rat: Tests früh schreiben, aber das Ziel im Auge behalten. Als Warnbeispiel verweisen sie auf einen bekannten Versuch von Ron Jeffries, einen Sudoku-Löser rein testgetrieben zu entwickeln, der sich in Details verzettelte.

### Property-Based Testing

Statt einzelner Beispiele beschreibt man **Eigenschaften**, die für alle Eingaben gelten müssen, und ein Werkzeug erzeugt zufällige Eingaben, um sie zu widerlegen. In Java gibt es dafür etwa jqwik.

```java
@Property
void sortingKeepsAllElements(@ForAll List<Integer> input) {
    var sorted = input.stream().sorted().toList();
    assertThat(sorted).containsExactlyInAnyOrderElementsOf(input);
}

@Property
void sortedListIsOrdered(@ForAll List<Integer> input) {
    var sorted = input.stream().sorted().toList();
    for (int i = 1; i < sorted.size(); i++)
        assertThat(sorted.get(i - 1)).isLessThanOrEqualTo(sorted.get(i));
}
```

Findet das Werkzeug ein Gegenbeispiel, verkleinert es die Eingabe automatisch auf den einfachsten Fall, der den Fehler zeigt.

### Sicherheit

Neu in der zweiten Auflage, mit Grundprinzipien statt Details:

- **Angriffsfläche minimieren:** weniger Code, weniger Eingaben, weniger offene Dienste
- **Minimale Rechte:** jede Komponente nur mit den Rechten, die sie braucht
- **Sichere Voreinstellungen:** Das Standardverhalten soll sicher sein, nicht das konfigurierte
- **Sensible Daten verschlüsseln** und nicht in Logs oder Versionskontrolle ablegen
- **Sicherheitsupdates einspielen**, die häufigste Quelle realer Einbrüche
- **Keine eigene Kryptografie**

### Namen

Gute Namen beschreiben Absicht und Rolle, nicht Typ oder Implementierung. Der wichtigste Rat ist der zweite Teil des Tipps: **Gut benennen, und bei Bedarf umbenennen.** Wenn sich das Verständnis ändert, muss sich der Name ändern. Wer das scheut, weil zu viel Code betroffen wäre, hat ein Orthogonalitätsproblem.

## Vor dem Projekt

### Die Anforderungsgrube

Die Grundthese: **Niemand weiß genau, was er will.** Anforderungen liegen nicht herum und warten darauf, eingesammelt zu werden. Sie entstehen in einer Rückkopplungsschleife, in der Entwickler und Nutzer gemeinsam herausfinden, was gebraucht wird.

Daraus folgen mehrere Ratschläge:

- **Nutzer verstehen, nicht nur befragen:** Die Autoren empfehlen, eine Weile wie ein Nutzer zu arbeiten, etwa einen Tag am Schreibtisch der Sachbearbeitung.
- **Richtlinien sind Metadaten:** „Nur Vorgesetzte dürfen Personalakten sehen“ ist eine Richtlinie, die sich ändern wird. Man implementiert den allgemeinen Fall, also Zugriffsrechte, und konfiguriert die konkrete Richtlinie.
- **Anforderungen sind keine Architektur und kein Design.** Sie beschreiben ein Bedürfnis, nicht die Lösung.
- **Ein Glossar führen:** gemeinsame Begriffe für Nutzer und Entwickler, im Kern Evans' Ubiquitous Language.
- **Feature Creep beobachten:** Jede kleine Ergänzung kostet, und viele kleine kosten viel.

### Unlösbare Rätsel lösen

Wenn ein Problem unlösbar erscheint, liegt das oft an vermeintlichen Einschränkungen. Der Rat: alle Einschränkungen auflisten und für jede prüfen, ob sie wirklich gilt. Nicht „außerhalb der Box denken“, sondern **die Box finden**, also die echten Grenzen erkennen.

### Zusammenarbeiten

Neu in der zweiten Auflage sind **Pair Programming** und **Mob Programming**, bei dem das ganze Team an einem Rechner arbeitet. Die Autoren sehen darin nicht nur Qualitätssicherung, sondern Wissensaustausch und gemeinsame Verantwortung.

### Das Wesen der Agilität

Die Autoren, beide Mitunterzeichner des Manifests, wehren sich gegen „Agile“ als Methode, Zertifikat oder Prozess. Agilität sei ein Adjektiv, kein Substantiv: Man ist agil oder nicht. Ihr Rezept ist eine einfache Schleife:

1. Herausfinden, wo man steht.
2. Den kleinsten sinnvollen Schritt in Richtung Ziel machen.
3. Auswerten, wo man jetzt steht, und reparieren, was man kaputt gemacht hat.

Alles andere, Sprints, Standups, Boards, sind Werkzeuge, die diese Schleife unterstützen können oder auch nicht.

## Pragmatische Projekte

### Pragmatische Teams

Die Ratschläge des Buchs gelten auch für Teams: keine zerbrochenen Fenster dulden, gekochte Frösche bemerken, ein gemeinsames Wissensportfolio pflegen, nach außen mit einer Stimme kommunizieren, DRY im Team umsetzen. Teams sollen klein und stabil sein, rund um Funktionalität organisiert statt um Rollen wie Analyse, Datenbank oder Test. Das entspricht Evans' Bounded Contexts und den Stream-aligned Teams aus *Team Topologies*.

### Kokosnüsse reichen nicht

Der Titel spielt auf **Cargo-Kulte** an: Inselbewohner, die nach dem Zweiten Weltkrieg Landebahnen und Funkgeräte aus Kokosnüssen und Bambus nachbauten, in der Hoffnung, dass wieder Flugzeuge mit Gütern landen. Übertragen: Teams kopieren Praktiken erfolgreicher Firmen, etwa das „Spotify-Modell“, ohne den Kontext zu verstehen, in dem sie funktioniert haben. Der Rat: das tun, was im eigenen Kontext wirklich funktioniert, und laufend prüfen.

### Das pragmatische Starter-Kit

Drei Dinge, die jedes Projekt braucht:

1. **Versionskontrolle** für alles, mit automatischen Builds bei jedem Commit
2. **Regressionstests**, die automatisch laufen. Testen nach Zustandsabdeckung, nicht nur nach Codeabdeckung. Jeder gefundene Fehler wird einmal gefunden und bekommt einen Test, damit er nie wiederkommt.
3. **Vollständige Automatisierung**: Build, Test, Deployment ohne manuelle Schritte

### Nutzer begeistern und eigene Arbeit signieren

Das Buch endet mit zwei Gedanken. Erstens: Das Ziel ist nicht, Software zu liefern, sondern **Nutzer zu begeistern**, also ihre eigentlichen Erwartungen zu verstehen und zu übertreffen. Zweitens: Pragmatische Entwickler **signieren ihre Arbeit**, wie Handwerker ihr Werk. Man steht mit seinem Namen dafür ein. Das ist kein Besitzdenken, sondern Stolz und Verantwortung, und es schließt den Bogen zum ersten Kapitel.

## Kritik und Einordnung

The Pragmatic Programmer ist das am breitesten empfohlene Buch dieser Reihe und das am wenigsten umstrittene. Kritik richtet sich vor allem gegen seine Breite, nicht gegen seine Inhalte.

### Stärken

- **Zugänglich:** kurze Abschnitte, klare Merksätze, eingängige Bilder. Broken Windows, Rubber Duck, DRY, Tracer Bullets und Stone Soup sind fester Teil der Branchensprache.
- **Zeitlos:** Weil es um Haltung statt Technik geht, ist es kaum gealtert. Die zweite Auflage hat das Wenige, was veraltet war, ersetzt.
- **ETC als Leitwert:** Die zweite Auflage bündelt alle Designprinzipien unter einer einzigen Frage. Das ist vermutlich die eleganteste Formel in allen Büchern dieser Reihe.
- **Ganzheitlich:** Es verbindet Code, Werkzeuge, Kommunikation, Karriere und Teamarbeit.
- **Undogmatisch:** Die Autoren meiden Absolutes und sagen oft ausdrücklich, wann ein Rat nicht gilt.

### Kritikpunkte

**1. Breite statt Tiefe.** Jedes Thema wird auf wenigen Seiten angerissen. Wer tiefer will, braucht die anderen Bücher: Fowler für Refactoring, Ousterhout für Design, Goetz für Nebenläufigkeit, Evans für Anforderungen.

**2. Allgemeinplätze.** Manches klingt selbstverständlich, etwa Verantwortung übernehmen oder klar kommunizieren. Kritiker halten Teile des Buchs für eher motivierend als lehrreich.

**3. Werkzeugkapitel.** Die Betonung von Shell, Editor und Textverarbeitung spiegelt eine Unix-geprägte Kultur. Für Entwickler, die in IntelliJ oder Visual Studio arbeiten, wirkt das teils fremd. Gleichzeitig ist die Grundidee, Werkzeuge wirklich zu beherrschen, weiter richtig.

**4. Elixir-Prägung der zweiten Auflage.** Viele neue Beispiele, besonders zu Transformationen und Aktoren, stammen aus Elixir und Erlang. Für Java-Entwickler ist der Transfer machbar, aber nicht immer naheliegend.

**5. DRY wird weiter missverstanden.** Obwohl die Autoren klarstellen, dass DRY Wissen meint, nicht Code, hat das Prinzip in der Praxis zu vielen vorschnellen Abstraktionen beigetragen.

**6. Wenig Empirie.** Wie alle Bücher dieser Reihe beruht es auf Erfahrung. Die Autoren sind sich dessen bewusst und formulieren vorsichtig.

### Gesamturteil

Das Buch ist weniger eine Anleitung als ein Kompass. Es eignet sich hervorragend als erstes Buch nach der Ausbildung und als Buch, das man alle paar Jahre wieder liest, weil man jedes Mal andere Abschnitte für sich entdeckt. Als Abschluss dieser Reihe passt es besonders gut, weil es die Haltung beschreibt, die alle anderen Bücher voraussetzen.

## Verhältnis zu den anderen Büchern

The Pragmatic Programmer ist das Dach über der ganzen Reihe. Fast jedes Prinzip der anderen Bücher taucht hier in Kurzform auf, oft früher und meist allgemeiner formuliert.

| Idee bei Thomas und Hunt | Entspricht bei |
|---|---|
| ETC: Ist es leichter zu ändern? | Ousterhout: Komplexität als Änderungsaufwand; Fowler: Design Stamina |
| Keine zerbrochenen Fenster | Martin: Pfadfinderregel; Fowler: Aufräumen nebenbei |
| DRY als Wissen, nicht Code | Fowler: Duplicated Code; Bloch: eine Stelle pro Konstante; Metz: falsche Abstraktion |
| Orthogonalität | Ousterhout: Information Hiding; Martin: SRP; Evans: Bounded Context |
| Reversibilität | Evans: Anticorruption Layer; Feathers: Seams |
| Tracer Bullets | Feathers: Sprout Class als dünner, getesteter Pfad; agile Inkremente |
| Tell, Don't Ask | Martin: Law of Demeter; Fowler: Hide Delegate |
| Vererbungssteuer | GoF: Komposition vor Vererbung; Bloch: Item 18; Fowler: Replace Subclass with Delegate |
| Design by Contract | Bloch: Items 49 und 56; Evans: Assertions im Supple Design |
| Tote Programme lügen nicht | Bloch: Fehler früh finden; Feathers in Clean Code: Exceptions mit Kontext |
| Testen ist Design | Feathers: Testbarkeit als Designsignal; Ousterhout skeptischer zu TDD |
| Glossar, Anforderungsschleife | Evans: Ubiquitous Language, Knowledge Crunching |
| Klein, nicht schneller als die Scheinwerfer | Fowler: kleine Schritte; Feathers: Single-Goal Editing |
| Konfiguration mit Maß | Ousterhout: Komplexität nach unten ziehen statt Parameter |

### Was nur dieses Buch hat

- **Karriere und Lernen:** Das Wissensportfolio und „Es ist dein Leben“ haben in keinem anderen Buch dieser Reihe ein Gegenstück.
- **Kommunikation und Verantwortung** als Teil des Handwerks.
- **Werkzeuge** wie Shell, Editor, Debugging und Arbeitsjournal.
- **Ein einziger Leitwert** (ETC), auf den alle anderen Prinzipien zurückgeführt werden.

## Diskussionsfragen

1. **ETC:** Lässt sich wirklich jedes Designprinzip auf „leichter zu ändern“ zurückführen? Gibt es Gegenbeispiele, etwa Performance oder Sicherheit?
2. **DRY:** Hast du Projekte erlebt, in denen DRY als „keine doppelten Zeilen“ verstanden wurde? Was waren die Folgen?
3. **Zerbrochene Fenster:** Wie geht man mit einer Codebasis um, in der schon alle Fenster zerbrochen sind?
4. **Wissensportfolio:** Jedes Jahr eine neue Sprache – realistisch? Was ist dein eigenes Lernritual?
5. **Tracer Bullets oder Prototyp:** Wo ist die Grenze in der Praxis, und wie verhinderst du, dass ein Prototyp in Produktion landet?
6. **Agilität als Adjektiv:** Wie viel von „Agile“ in euren Projekten ist Schleife, wie viel Ritual?
7. **Cargo-Kulte:** Welche übernommenen Praktiken hast du erlebt, die im eigenen Kontext nicht funktioniert haben?
8. **Die Reihe als Ganzes:** Wenn du nur drei dieser acht Bücher empfehlen dürftest, welche wären es, und für wen?
