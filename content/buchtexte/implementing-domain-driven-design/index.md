+++
title = "Implementing Domain-Driven Design – Zusammenfassung und Einordnung"
description = "Vaughn Vernon, Implementing Domain-Driven Design (2013)"
date = 2026-10-31T19:23:46+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["implementing-domain-driven-design-2013"]
+++

## Einleitung

Evans' *Domain-Driven Design* von 2003 lieferte die Begriffe und die Philosophie. Viele Leser blieben danach mit der Frage zurück: **Wie setzt man das konkret um?** Vaughn Vernons *Implementing Domain-Driven Design* beantwortet diese Frage, zehn Jahre später, mit Erfahrungen aus vielen Projekten und mit Architekturstilen, die es 2003 noch nicht gab.

### Autor und Kontext

Vaughn Vernon ist Berater und Entwickler mit jahrzehntelanger Erfahrung, unter anderem mit Smalltalk und Java, und einer der bekanntesten Lehrer für DDD. Das Buch erschien 2013 bei Addison-Wesley mit einem Vorwort von Eric Evans und ist weiterhin in der ersten Auflage aktuell. Wegen seines roten Umschlags heißt es in der Community „das rote Buch“, Evans' Werk „das blaue Buch“. 2016 folgte mit *Domain-Driven Design Distilled* eine kompakte Einführung auf rund 150 Seiten.

### Die Kernthese

DDD gelingt, wenn man mit dem **strategischen Design** beginnt, also mit Bounded Contexts, Subdomänen und Kontextlandkarten, und erst danach die **taktischen Bausteine** anwendet. Viele Teams machen es umgekehrt: Sie nutzen Entitäten, Repositories und Wertobjekte, ohne je über Kontexte nachzudenken, und nennen das DDD. Vernon spricht von „DDD light“ und warnt davor.

### Das Fallbeispiel

Das ganze Buch begleitet ein fiktives Unternehmen namens **SaaSOvation**, das drei Produkte baut:

| Kontext | Inhalt |
|---|---|
| **Identität und Zugriff** | Benutzer, Mandanten, Rollen, Berechtigungen |
| **Zusammenarbeit** | Foren, Diskussionen, Kalender |
| **Agiles Projektmanagement** | Produkte, Backlog-Einträge, Sprints, Releases; die Kerndomäne |

Am Beispiel des Teams zeigt Vernon auch Fehler, etwa zu große Aggregate oder fehlende Kontextgrenzen, und wie sie korrigiert werden.

### Aufbau

| Kapitel | Inhalt |
|---|---|
| 1–3 | Einstieg, Domänen und Bounded Contexts, Kontextlandkarten |
| 4 | Architektur |
| 5–12 | Entitäten, Wertobjekte, Dienste, Domain Events, Module, Aggregate, Fabriken, Repositories |
| 13–14 | Integration von Bounded Contexts, Anwendungsschicht |
| Anhang | Aggregate mit Event Sourcing |

Rund 650 Seiten, mit Java-Beispielen.

## Domänen, Subdomänen, Bounded Contexts

### Problemraum und Lösungsraum

Vernon trennt sauber zwischen zwei Sichten, die Evans noch weniger deutlich unterscheidet:

| Sicht | Begriff | Frage |
|---|---|---|
| **Problemraum** | Domäne und Subdomänen | Welche fachlichen Bereiche hat das Unternehmen? |
| **Lösungsraum** | Bounded Contexts | Wie schneiden wir die Software, die diese Bereiche unterstützt? |

Im Idealfall entspricht jeder Bounded Context genau einer Subdomäne. In gewachsenen Systemen ist das oft nicht so, und genau dort entstehen die Probleme.

### Drei Arten von Subdomänen

| Art | Bedeutung | Vorgehen |
|---|---|---|
| **Kerndomäne** | was das Unternehmen besonders macht; der Wettbewerbsvorteil | die besten Leute, tiefes Modell, volle DDD-Sorgfalt |
| **Unterstützende Subdomäne** | spezifisch für das Unternehmen, aber kein Wettbewerbsvorteil | selbst bauen, aber mit weniger Aufwand |
| **Generische Subdomäne** | bei allen Unternehmen ähnlich, etwa Benutzerverwaltung oder Buchhaltung | kaufen oder Standardlösung nutzen |

Diese Einteilung hilft bei einer der wichtigsten Architekturentscheidungen: **Wo investieren wir?**

### Bounded Context

Ein Bounded Context ist eine **sprachliche Grenze**: Innerhalb gilt eine eindeutige, gemeinsame Sprache, die Ubiquitous Language. Außerhalb können dieselben Wörter etwas anderes bedeuten. Ein Kontext sollte so groß sein, wie nötig ist, um die vollständige Sprache seines Bereichs auszudrücken, und nicht größer. Er ist **nicht** dasselbe wie ein Modul, eine Bibliothek oder ein Microservice, auch wenn er oft so umgesetzt wird.

### Ein Fehler im Fallbeispiel

Das SaaSOvation-Team baute zunächst Benutzer, Rollen und Berechtigungen direkt in das Modell für Zusammenarbeit ein. Bald vermischten sich Fragen wie „Darf dieser Benutzer posten?“ mit fachlichen Begriffen wie „Moderator“ oder „Autor“. Die Lösung war, **Identität und Zugriff** als eigenen, generischen Kontext abzutrennen. Im Kontext der Zusammenarbeit gibt es seitdem keine „Benutzer“ mehr, sondern **Teilnehmer**, **Autoren** und **Moderatoren**, die aus Benutzern abgeleitet werden.

### Einordnung

Die drei Subdomänen-Arten sind eine Entscheidungshilfe, die sich mit Wardley-Karten und Hohpes Architektenrolle im Aufzug verbinden lässt: Investiere dort, wo du dich unterscheidest. Die Trennung von Benutzern und fachlichen Rollen ist ein Beispiel für Ousterhouts Rat, Informationen zu verbergen, und für das, was *Secure by Design* über Kontextgrenzen als Prüfstellen sagt.

## Kontextlandkarten

Eine **Kontextlandkarte** zeigt die Bounded Contexts eines Systems und wie sie zueinander stehen. Vernon betont, dass sie den **Ist-Zustand** abbilden soll, nicht den Wunsch, und dass sie auch die organisatorischen Beziehungen zwischen Teams zeigt.

{{< bild src="bild-1.png" alt="die Kontextlandkarte des Fallbeispiels SaaSOvation, vereinfacht" >}}

die Kontextlandkarte des Fallbeispiels SaaSOvation, vereinfacht

### Die Beziehungsmuster

| Muster | Bedeutung |
|---|---|
| **Partnerschaft** | zwei Teams stimmen sich eng ab und scheitern oder gelingen gemeinsam |
| **Gemeinsamer Kern** | ein kleiner Teil des Modells wird gemeinsam gepflegt; erfordert viel Abstimmung |
| **Kunde und Lieferant** | der liefernde Kontext berücksichtigt die Wünsche des nutzenden |
| **Konformist** | der nutzende Kontext übernimmt das Modell des liefernden unverändert, weil er keinen Einfluss hat |
| **Antikorruptionsschicht** | der nutzende Kontext übersetzt das fremde Modell in sein eigenes und schützt sich so |
| **Offene Schnittstelle** | der liefernde Kontext bietet eine stabile, dokumentierte Schnittstelle für viele Nutzer |
| **Veröffentlichte Sprache** | ein gemeinsames, dokumentiertes Austauschformat |
| **Getrennte Wege** | keine Integration; jeder löst sein Problem selbst |
| **Großer Schlammball** | ein Bereich ohne klare Grenzen, den man eingrenzen statt reparieren sollte |

Im Fallbeispiel bietet **Identität und Zugriff** eine offene Schnittstelle an. Die beiden anderen Kontexte nutzen sie über eine **Antikorruptionsschicht**, die Benutzer und Rollen in eigene Begriffe wie Moderator oder Teammitglied übersetzt. Das Projektmanagement nutzt die Zusammenarbeit auf dieselbe Weise, etwa für Diskussionen zu Backlog-Einträgen.

### Einordnung

Kontextlandkarten sind das DDD-Werkzeug, das am direktesten mit **Conways Gesetz** und *Team Topologies* zusammenhängt: Jede Beziehung zwischen Kontexten ist auch eine Beziehung zwischen Teams. Skelton und Pais' Interaktionsformen, Zusammenarbeit, Bereitstellung als Dienst und Unterstützung, entsprechen grob Partnerschaft, offener Schnittstelle und Kunde-Lieferant. Die Antikorruptionsschicht ist das Muster, das Feathers' Nahtstellen und Newmans Strangler auf Kontext-Ebene hebt.

## Architektur

Das vierte Kapitel zeigt, dass DDD nicht an eine bestimmte Architektur gebunden ist, und stellt die Stile vor, die gut dazu passen:

| Stil | Idee | Verhältnis zu DDD |
|---|---|---|
| **Schichten** | Benutzeroberfläche, Anwendung, Domäne, Infrastruktur | Vernon empfiehlt, die Abhängigkeit umzukehren, sodass die Infrastruktur von der Domäne abhängt, nicht umgekehrt |
| **Hexagonal, Ports und Adapter** | die Domäne in der Mitte, alles Äußere über Adapter angebunden | Vernons bevorzugter Stil; die Domäne bleibt frei von Technik |
| **Serviceorientiert, REST** | Fähigkeiten als Dienste oder Ressourcen anbieten | Ressourcen sollten nicht einfach Aggregate spiegeln, sondern Anwendungsfälle |
| **CQRS** | Schreiben und Lesen trennen, mit eigenen Modellen | das Domänenmodell dient dem Schreiben, optimierte Lesemodelle dem Abfragen |
| **Ereignisgesteuert** | Systeme reagieren auf Ereignisse statt auf direkte Aufrufe | passt zu Domain Events; ermöglicht lose Kopplung zwischen Kontexten |
| **Event Sourcing** | Zustand als Folge von Ereignissen speichern statt als aktuellen Stand | vollständige Historie; ausführlich im Anhang |

### Hexagonal als Grundlage

In Vernons Beispielen bildet die **hexagonale Architektur** den Rahmen: Die Domäne kennt nur Schnittstellen, sogenannte Ports, etwa ein Repository-Interface. Die Infrastruktur liefert Adapter, etwa eine JPA-Implementierung. Anwendungsdienste koordinieren Anwendungsfälle und rufen die Domäne auf.

### CQRS mit Augenmaß

Vernon zeigt CQRS als Antwort auf ein typisches Problem: Ein Domänenmodell, das für Geschäftsregeln entworfen ist, eignet sich schlecht für komplexe Abfragen und Berichte. Statt das Modell für beides zu verbiegen, trennt man es. Er betont aber, dass CQRS zusätzliche Komplexität bringt und nur dort eingesetzt werden sollte, wo der Nutzen klar ist.

### Einordnung

Die hexagonale Architektur ist Martins *Clean Architecture* in einer pragmatischeren Form: dieselbe Abhängigkeitsregel, weniger Ringe. CQRS und Event Sourcing behandelt Kleppmann aus Datensicht als abgeleitete Daten und unveränderliche Ereignisprotokolle; Vernon zeigt sie aus Modellsicht. Richards und Ford würden ergänzen: Jeder dieser Stile ist eine Abwägung, keine Empfehlung an sich.

## Entitäten, Wertobjekte, Domänendienste

### Entitäten

Eine Entität hat eine **Identität**, die über ihre Lebensdauer gleich bleibt, auch wenn sich ihre Eigenschaften ändern. Vernon behandelt ausführlich, woher diese Identität kommt:

| Herkunft | Beispiel | Abwägung |
|---|---|---|
| **vom Nutzer eingegeben** | Projektkürzel | verständlich, aber Fehler und Änderungen sind schwer zu beheben |
| **von der Anwendung erzeugt** | UUID beim Anlegen | sofort verfügbar, unabhängig von der Datenbank; Vernons bevorzugte Variante |
| **von der Datenbank erzeugt** | Sequenz | einfach, aber erst nach dem Speichern bekannt; erschwert Domain Events |
| **aus einem anderen Kontext** | Kundennummer aus dem CRM | erfordert Abstimmung bei Änderungen |

Für die Identität empfiehlt Vernon einen **eigenen Typ**, etwa `ProductId`, statt einer nackten UUID oder Zahl.

### Wertobjekte bevorzugen

Vernons wichtigster Rat zu den taktischen Bausteinen: **Modelliere so viel wie möglich als Wertobjekte.** Ein Wertobjekt

- **misst, beschreibt oder bemisst** etwas, statt eine eigene Identität zu haben,
- ist **unveränderlich**,
- bildet ein **begriffliches Ganzes**, etwa Betrag und Währung zusammen,
- wird **ersetzt** statt geändert,
- ist über seine **Werte** gleich, nicht über eine Identität,
- hat **Methoden ohne Nebenwirkungen**.

Wertobjekte sind leichter zu verstehen, zu testen und zu teilen als Entitäten. Viele Entwickler modellieren zu viel als Entität, weil die Datenbank eine Tabelle mit Primärschlüssel nahelegt; Vernon zeigt, wie man Wertobjekte trotzdem speichert, etwa eingebettet.

### Domänendienste

Manche fachlichen Operationen gehören weder zu einer Entität noch zu einem Wertobjekt, etwa eine Berechnung über mehrere Aggregate oder eine Prüfung gegen ein externes System. Dafür gibt es **Domänendienste**: zustandslose Operationen, deren Namen aus der Fachsprache stammen. Vernon warnt davor, sie zu oft einzusetzen; sonst entsteht ein **anämisches Domänenmodell**, in dem die Objekte nur Daten tragen und die Logik in Diensten liegt.

### Einordnung

Der Rat, Wertobjekte zu bevorzugen, ist dieselbe Botschaft wie in *Secure by Design* mit den Domänenprimitiven und bei Bloch mit unveränderlichen Klassen; mit Java-Records ist er heute fast kostenlos umzusetzen. Das anämische Domänenmodell ist ein Begriff von Fowler, der vor genau dieser Fehlentwicklung warnt. Der eigene Identitätstyp ist ein Domänenprimitiv.

## Domain Events

Domain Events kommen in Evans' Buch von 2003 noch nicht als eigener Baustein vor; die DDD-Gemeinschaft hat sie danach entwickelt. Vernon gibt ihnen ein ganzes Kapitel, und sie gehören zu den wichtigsten Beiträgen des Buchs.

### Was ein Domain Event ist

Ein Domain Event beschreibt **etwas, das in der Fachlichkeit passiert ist** und für jemanden von Bedeutung ist. Man erkennt Kandidaten an Formulierungen von Fachexperten wie „Wenn ein Backlog-Eintrag einem Sprint zugeordnet wird, dann …“.

| Regel | Beispiel |
|---|---|
| **Name in der Vergangenheitsform** | `BacklogItemCommitted`, `PolicyCancelled` |
| **Unveränderlich** | ein Ereignis ist geschehen und lässt sich nicht ändern |
| **Enthält, was Empfänger brauchen** | Identitäten der beteiligten Aggregate, relevante Werte, Zeitpunkt |
| **Teil der Ubiquitous Language** | Fachexperten verstehen die Namen |

### Veröffentlichen und weiterleiten

Innerhalb eines Kontexts veröffentlicht das Aggregat seine Ereignisse über einen leichtgewichtigen Mechanismus; Empfänger im selben Prozess reagieren darauf, etwa um ein anderes Aggregat anzupassen. Für Empfänger in **anderen Kontexten** speichert Vernon die Ereignisse in derselben Transaktion wie die Änderung des Aggregats in einem **Ereignisspeicher** und leitet sie danach über Messaging weiter. So geht kein Ereignis verloren, auch wenn das Messaging-System gerade nicht erreichbar ist; ein Muster, das heute meist **Transactional Outbox** heißt.

Empfänger müssen damit rechnen, dass Ereignisse **mehrfach** oder **in anderer Reihenfolge** ankommen; sie sollten deshalb idempotent arbeiten.

### Einordnung

Domain Events verbinden DDD mit der Welt von Hohpe und Woolf: Ein Ereignis ist eine Nachricht, und die Weiterleitung nutzt deren Muster. Die Transactional Outbox löst das Problem, das Kleppmann als „Dual Writes“ beschreibt: Datenbank und Nachrichtensystem nicht atomar gemeinsam aktualisieren zu können. In der Java-Welt unterstützt Spring Modulith genau dieses Muster, indem es Ereignisse beim Veröffentlichen speichert und erst nach erfolgreicher Verarbeitung als erledigt markiert.

## Aggregate

Das zehnte Kapitel ist das bekannteste des Buchs. Es beruht auf einer dreiteiligen Aufsatzreihe, die Vernon vorher veröffentlicht hatte, und hat das Verständnis von Aggregaten in der DDD-Gemeinschaft geprägt.

### Ein Fehler im Fallbeispiel

Das SaaSOvation-Team modellierte zunächst ein großes Aggregat **Produkt**, das alle Backlog-Einträge, Releases und Sprints enthielt. Das schien fachlich naheliegend, führte aber zu Problemen: Wenn zwei Teammitglieder gleichzeitig verschiedene Backlog-Einträge desselben Produkts bearbeiteten, kollidierten ihre Änderungen, weil das ganze Produkt eine Einheit war. Außerdem wurde das Laden immer langsamer. Die Lösung: Produkt, Backlog-Eintrag, Release und Sprint wurden **eigene Aggregate**, die einander über ihre Kennungen referenzieren.

### Die vier Regeln

| Regel | Bedeutung |
|---|---|
| **1. Echte Invarianten in Konsistenzgrenzen modellieren** | Ein Aggregat umfasst genau die Objekte, deren Regeln sofort und gemeinsam gelten müssen; nicht mehr. |
| **2. Kleine Aggregate entwerfen** | Am besten nur eine Wurzel-Entität mit Wertobjekten; große Aggregate verursachen Konflikte und schlechte Leistung. |
| **3. Andere Aggregate nur über die Identität referenzieren** | Statt eines Objektverweises auf einen Sprint hält ein Backlog-Eintrag nur eine `SprintId`. |
| **4. Außerhalb der Grenze schließliche Konsistenz nutzen** | Regeln über mehrere Aggregate werden nicht in einer Transaktion durchgesetzt, sondern über Domain Events nachgezogen. |

Vernon nennt auch Gründe, die Regeln zu brechen, etwa wenn eine Oberfläche tatsächlich mehrere Aggregate gemeinsam ändern muss oder schließliche Konsistenz fachlich nicht akzeptabel ist; die Ausnahme muss begründet sein.

### In Java umgesetzt

```java
// Kleines Aggregat, referenziert andere nur über Kennungen, meldet Ereignisse
@Entity
public class BacklogItem extends AbstractAggregateRoot<BacklogItem> {   // Spring Data
    @EmbeddedId private BacklogItemId id;
    @Embedded   private ProductId productId;          // Regel 3: nur die Kennung
    @Embedded   private SprintId sprintId;            // null, solange nicht zugeordnet
    private BacklogItemStatus status;

    public void commitTo(Sprint sprint) {
        if (!sprint.productId().equals(productId))
            throw new IllegalArgumentException("Sprint gehört zu einem anderen Produkt");
        if (status == BacklogItemStatus.DONE)
            throw new IllegalStateException("Erledigte Einträge können nicht zugeordnet werden");
        this.sprintId = sprint.id();
        this.status = BacklogItemStatus.COMMITTED;
        registerEvent(new BacklogItemCommitted(id, sprint.id(), Instant.now()));   // Regel 4
    }
}

public record BacklogItemCommitted(BacklogItemId item, SprintId sprint, Instant occurredOn) {}

// Ein anderes Aggregat zieht in einer eigenen Transaktion nach
@Component
class SprintScheduler {
    private final SprintRepository sprints;
    SprintScheduler(SprintRepository sprints) { this.sprints = sprints; }

    @ApplicationModuleListener   // Spring Modulith: nach dem Commit, asynchron, mit gespeicherter Veröffentlichung
    void on(BacklogItemCommitted event) {
        sprints.findById(event.sprint()).ifPresent(s -> {
            s.schedule(event.item());
            sprints.save(s);
        });
    }
}
```

### Einordnung

Die vier Regeln sind vielleicht der praktischste Beitrag des Buchs. Sie verbinden Evans' Begriff mit Fragen, die Goetz u.a. bei Nebenläufigkeit und Kleppmann bei Transaktionen stellen: Wie groß darf eine Konsistenzgrenze sein, ohne dass Konflikte und Sperren überhandnehmen? Für Microservices sind sie der wichtigste Hinweis auf die richtige Schnittgröße: Ein Dienst kann mehrere Aggregate enthalten, aber kein Aggregat sollte über mehrere Dienste verteilt sein, wie Newman und Ford u.a. in *The Hard Parts* ausführen.

## Weitere Bausteine

### Fabriken

Vernon bevorzugt **Fabrikmethoden auf Aggregaten**, die die Fachsprache ausdrücken: Ein Produkt plant einen neuen Backlog-Eintrag, statt dass irgendwo ein Konstruktor aufgerufen wird. So wird die Erzeugung zu einer fachlichen Handlung, und die Regeln dafür liegen beim Aggregat. Für Objekte, die aus Daten eines anderen Kontexts entstehen, eignen sich Fabriken in Diensten, die die Übersetzung übernehmen.

### Repositories

| Art | Verhalten | Beispiel |
|---|---|---|
| **Sammlungsorientiert** | verhält sich wie eine Menge: hinzufügen, entfernen, finden; Änderungen werden automatisch verfolgt | mit JPA und einer Persistenzeinheit |
| **Persistenzorientiert** | Änderungen müssen ausdrücklich gespeichert werden | bei Schlüssel-Wert-Speichern oder Dokumentdatenbanken |

Die Regel ist einfach: **ein Repository pro Aggregat**, und nur für Aggregatwurzeln. Transaktionen steuert die Anwendungsschicht, nicht das Repository.

### Module

Module, in Java Pakete, sollten nach der **Fachsprache** benannt und geschnitten sein, nicht nach technischen Schichten. Ein Paket `backlogitem` mit allem, was dazugehört, ist besser als getrennte Pakete `entities`, `services` und `repositories`.

### Anwendungsschicht

Anwendungsdienste sind **dünn**: Sie nehmen eine Anfrage entgegen, laden Aggregate, rufen deren Methoden auf, speichern und steuern Transaktion und Sicherheit. Fachlogik gehört nicht hierher. Für die Rückgabe an die Oberfläche beschreibt Vernon mehrere Wege, etwa eigene Datenobjekte oder Umwandler, die das Domänenmodell nicht nach außen sichtbar machen.

### Integration von Bounded Contexts

Kontexte werden über **REST-Ressourcen** mit einer veröffentlichten Sprache oder über **Messaging** mit Domain Events verbunden. Auf der empfangenden Seite übersetzt eine Antikorruptionsschicht mit Adaptern und Übersetzern das fremde Modell. Für Abläufe über mehrere Kontexte, etwa „Produkt anlegen und dazu eine Diskussion eröffnen“, beschreibt Vernon **lang laufende Prozesse**, die den Fortschritt verfolgen, mit Verzögerungen und Duplikaten umgehen und bei Zeitüberschreitung reagieren.

### Event Sourcing im Anhang

Der Anhang zeigt, wie Aggregate ihren Zustand aus einer Folge von Ereignissen aufbauen, wie Befehle verarbeitet werden, wie man mit gleichzeitigen Änderungen umgeht und wann Schnappschüsse nötig sind.

### Einordnung

Nach Fachsprache geschnittene Module sind das, was Spring Modulith heute für Java-Anwendungen prüfbar macht, und was Richards und Ford in *Fundamentals of Software Architecture* als fachliche Partitionierung beschreiben. Die lang laufenden Prozesse sind Sagas, die Ford u.a. in *The Hard Parts* ausführlich mit ihren Abwägungen behandeln, und Process Manager im Sinne von Hohpe und Woolf.

## Kritik und Einordnung

### Stärken

- **Von der Philosophie zur Umsetzung:** Das Buch schließt die Lücke zwischen Evans' Begriffen und lauffähigem Code.
- **Strategie zuerst:** Die Betonung von Bounded Contexts und Kontextlandkarten korrigiert eine verbreitete Fehlnutzung von DDD.
- **Die Aggregatregeln:** klar, begründet und bis heute der Maßstab.
- **Domain Events:** ausführlich und praxisnah, einschließlich der Weiterleitung zwischen Kontexten.
- **Fallbeispiel mit Fehlern:** Das SaaSOvation-Team macht Fehler und korrigiert sie; das ist lehrreicher als perfekte Beispiele.

### Kritikpunkte

**1. Umfang und Länge.** Rund 650 Seiten, mit vielen Wiederholungen. Vernon selbst hat mit *Domain-Driven Design Distilled* eine kompakte Fassung nachgeliefert.

**2. Technologiestand von 2013.** Viele Beispiele nutzen Bibliotheken und Persistenzansätze, die heute veraltet sind. Records, versiegelte Typen, Spring Modulith oder moderne Messaging-Plattformen fehlen naturgemäß; die Ideen lassen sich aber direkt übertragen.

**3. Viel Code, wenig Auswahl.** Manche Kapitel zeigen sehr viel Code für einfache Ideen; die wichtigen Einsichten gehen leicht unter.

**4. Wenig zur Entdeckung.** Wie man Bounded Contexts und Aggregate gemeinsam mit Fachexperten findet, behandelt das Buch knapp. Methoden wie Event Storming, die heute dafür üblich sind, kamen erst danach auf; dafür sind neuere Bücher wie Khononovs *Learning Domain-Driven Design* die Ergänzung.

**5. Komplexe Werkzeuge als Standard.** CQRS und Event Sourcing werden so ausführlich behandelt, dass Leser sie für notwendig halten könnten. Vernon warnt zwar selbst, aber die Gewichtung im Buch ist anders.

### Gesamturteil

Das Standardwerk für die **Umsetzung** von DDD und die natürliche Fortsetzung von Evans. Für Java-Architekten lohnen sich besonders die Kapitel 2, 3, 8 und 10: Bounded Contexts, Kontextlandkarten, Domain Events und Aggregate. Wer weniger Zeit hat, liest *Distilled* und schlägt im roten Buch nach, wenn er Details braucht.

## Bezüge zur Reihe

| Thema bei Vernon | Bezug in der Reihe |
|---|---|
| Strategie vor Taktik | Evans: strategisches Design; Hohpe: Architekt im Aufzug |
| Kern-, unterstützende, generische Subdomänen | Hohpe: investieren, wo man sich unterscheidet; Ford u.a.: Architekturentscheidungen |
| Bounded Contexts als Sprachgrenzen | Evans: Ubiquitous Language; Newman: Dienstgrenzen |
| Kontextlandkarten und Teambeziehungen | Brooks, Conway: Organisation und Struktur; Skelton und Pais: Interaktionsformen |
| Antikorruptionsschicht | Feathers: Nahtstellen; Newman: Strangler; *Secure by Design*: Prüfstelle |
| Hexagonale Architektur | Martin: *Clean Architecture*; Ousterhout: tiefe Module |
| CQRS und Event Sourcing | Kleppmann: abgeleitete Daten, Ereignisprotokolle; Fowler: *PoEAA* |
| Wertobjekte bevorzugen | *Secure by Design*: Domänenprimitive; Bloch: unveränderliche Klassen; Weidig: Records |
| Anämisches Domänenmodell | Fowler: Warnung vor reinen Datenobjekten |
| Domain Events, Transactional Outbox | Hohpe und Woolf: Nachrichtenmuster; Kleppmann: Dual Writes |
| Kleine Aggregate, Referenz über Identität | Goetz u.a.: Konsistenz und Sperren; Ford u.a., *The Hard Parts*: Datenbesitz |
| Schließliche Konsistenz | Kleppmann: Konsistenzmodelle; Nygard: Entkopplung |
| Lang laufende Prozesse, Sagas | Ford u.a., *The Hard Parts*: Sagas; Hohpe und Woolf: Process Manager |
| Fachlich geschnittene Module | Richards und Ford: fachliche Partitionierung; Winters u.a.: Code-Organisation |
| Fallbeispiel mit Fehlern | Feathers, Fowler: schrittweise Verbesserung statt Neubau |

## Diskussionsfragen

1. **Subdomänen:** Welche Bereiche eurer Fachlichkeit sind Kern, welche unterstützend, welche generisch? Investiert ihr entsprechend?
2. **Kontextlandkarte:** Könntet ihr eine Kontextlandkarte eurer Systeme zeichnen? Wo seid ihr Konformist, wo hättet ihr gern eine Antikorruptionsschicht?
3. **DDD light:** Nutzt ihr Entitäten und Repositories, ohne je über Bounded Contexts gesprochen zu haben?
4. **Aggregatgröße:** Habt ihr Aggregate, die zu groß sind und Konflikte bei gleichzeitigen Änderungen verursachen?
5. **Referenzen:** Wie oft referenzieren eure Entitäten andere Aggregate über Objektverweise statt über Kennungen?
6. **Domain Events:** Nutzt ihr Domain Events? Wie stellt ihr sicher, dass sie nicht verloren gehen?
7. **Module:** Sind eure Pakete nach Fachlichkeit oder nach technischen Schichten geschnitten?
8. **Rotes oder blaues Buch:** Würdest du einem neuen Teammitglied zuerst Evans, Vernon oder *Distilled* empfehlen?
