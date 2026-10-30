+++
title = "Tidy First? – Zusammenfassung und Einordnung"
description = "Kent Beck, Tidy First? A Personal Exercise in Empirical Software Design (2023)"
date = 2026-10-30T13:06:05+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["tidy-first-2023"]
+++

## Einleitung

Die Kernfrage steht im Titel, mit Fragezeichen: **Soll ich zuerst aufräumen?** Beck beantwortet sie nicht mit Ja oder Nein, sondern mit „kommt darauf an“, und das Buch erklärt, worauf.

### Kontext

Kent Beck veröffentlichte das Buch 2023, gut 20 Jahre nach *Test-Driven Development: By Example*. Es ist sein erstes Buch seit langer Zeit und als Auftakt einer geplanten Reihe über Softwaredesign gedacht: Dieser erste Band behandelt den einzelnen Entwickler und seinen Code, spätere sollen Teams und Organisationen behandeln.

Der Untertitel *A Personal Exercise in Empirical Software Design* ist ernst gemeint: Beck versteht Design nicht als Lehre, die man vorab festlegt, sondern als etwas, das man beobachtet, ausprobiert und an den Ergebnissen misst.

### Struktur und Verhalten

Die wichtigste Unterscheidung des Buchs:

- **Verhaltensänderungen** ändern, was das System tut. Dafür werden Entwickler bezahlt, und dafür bezahlen Nutzer.
- **Strukturänderungen** ändern, wie der Code aufgebaut ist, ohne das Verhalten zu ändern. Sie machen künftige Verhaltensänderungen leichter oder schwerer.

Das ist im Kern Becks altes Bild von den zwei Hüten aus TDD und Refactoring, aber hier wird daraus eine wirtschaftliche Frage: Wann lohnt sich eine Strukturänderung?

### Aufbau

| Teil | Inhalt | Umfang |
|---|---|---|
| I. Tidyings | 15 kleine Aufräumtechniken | sehr kurze Kapitel, je ein bis drei Seiten |
| II. Managing | Wie man Aufräumen in den Arbeitsfluss einbaut | sieben kurze Kapitel |
| III. Theorie | Warum Struktur sich lohnt: Ökonomie, Optionen, Kopplung, Kohäsion | elf kurze Kapitel |

Mit rund 100 Seiten ist es das kürzeste Buch dieser Reihe. Die Kapitel sind oft nur eine oder zwei Seiten lang.

### Was ein Tidying ist

Ein **Tidying** ist eine sehr kleine Strukturänderung, so klein, dass man kaum darüber nachdenken muss, ob sie sicher ist. Beck sieht Tidyings als eine Unterart von Refactoring: Jedes Tidying ist ein Refactoring, aber nicht jedes Refactoring ist ein Tidying. Ein Tidying dauert Minuten, nicht Stunden, und es verbessert vor allem die **Lesbarkeit** für die nächste Person, die den Code verstehen muss, oft für einen selbst bei der nächsten Änderung.

## Die Tidyings (Teil I)

Beck beschreibt 15 Tidyings, jedes in wenigen Absätzen. Viele davon kennt man aus Fowler oder McConnell. Neu ist der Blickwinkel: Sie sind so klein, dass man sie **vor** einer Änderung in wenigen Minuten erledigen kann, um diese Änderung zu erleichtern.

### 1. Guard Clauses

Verschachtelte Bedingungen durch frühe Rückkehr ersetzen. Beck warnt: nicht übertreiben, sieben Guard Clauses hintereinander sind auch schwer zu lesen.

```java
// vorher
void ship(Order o) {
    if (o.isPaid()) {
        if (!o.isCancelled()) { warehouse.dispatch(o); }
    }
}

// nachher
void ship(Order o) {
    if (!o.isPaid() || o.isCancelled()) return;
    warehouse.dispatch(o);
}
```

### 2. Dead Code

Code, der nie ausgeführt wird, löschen. Wenn man unsicher ist, ob er doch gebraucht wird, protokolliert man seine Nutzung eine Weile. Die Versionskontrolle bewahrt ihn ohnehin auf.

### 3. Normalize Symmetries

Dasselbe Problem wird im Code oft auf verschiedene Arten gelöst. Beck rät, eine Variante auszuwählen und alle anderen daran anzugleichen. Leser sollen nicht bei jeder Abweichung fragen müssen, ob sie etwas bedeutet.

```java
// drei Arten, dasselbe zu tun
if (cache.get(k) == null) cache.put(k, load(k));
cache.putIfAbsent(k, load(k));
cache.computeIfAbsent(k, this::load);

// eine Art, überall
cache.computeIfAbsent(k, this::load);
```

Vorsicht: Die drei Varianten sind nicht völlig gleich. Die zweite lädt den Wert immer, auch wenn er schon im Cache steht. Beim Angleichen muss man prüfen, dass sich das Verhalten nicht ändert, sonst ist es kein Tidying mehr.

### 4. New Interface, Old Implementation

Wenn die Schnittstelle, die man braucht, nicht existiert, schreibt man sie, und lässt sie zunächst einfach die alte aufrufen. Später kann man die Implementierung umziehen. Beck betont, dass es oft leichter ist, eine Änderung über eine neue, passende Schnittstelle zu machen, als sich durch eine unpassende zu quälen.

```java
// alte Schnittstelle: fünf Parameter, umständlich
Invoice createInvoice(long customerId, List<Line> lines, String currency, boolean draft, Locale locale) { … }

// neue Schnittstelle, delegiert zunächst nur
Invoice draftInvoiceFor(Customer c, List<Line> lines) {
    return createInvoice(c.id(), lines, c.currency(), true, c.locale());
}
```

### 5. Reading Order

Den Code in der Reihenfolge anordnen, in der ein Leser ihn verstehen will, etwa die wichtigste öffentliche Methode zuerst. Das entspricht Martins Zeitungsmetapher.

### 6. Cohesion Order

Dinge, die man gemeinsam ändern muss, nebeneinanderstellen: Methoden in einer Datei, Dateien in einem Verzeichnis. Beck nennt das einen ersten Schritt zur Entkopplung: Wenn man die Kopplung nicht beseitigen kann, macht man sie wenigstens sichtbar und lokal.

### 7. Move Declaration and Initialization Together

Variablen dort deklarieren und initialisieren, wo sie gebraucht werden, nicht am Anfang der Methode. Das ist McConnells „Span“ und Blochs Item 57.

### 8. Explaining Variables

Einen komplizierten Teilausdruck in eine Variable mit sprechendem Namen auslagern.

```java
// vorher
return order.total().compareTo(new BigDecimal("1000")) > 0 && order.customer().since().isBefore(LocalDate.now().minusYears(5));

// nachher
boolean isLargeOrder = order.total().compareTo(new BigDecimal("1000")) > 0;
boolean isLoyalCustomer = order.customer().since().isBefore(LocalDate.now().minusYears(5));
return isLargeOrder && isLoyalCustomer;
```

### 9. Explaining Constants

Magische Zahlen und Zeichenketten durch benannte Konstanten ersetzen. Beck warnt davor, Konstanten zusammenzulegen, nur weil sie zufällig denselben Wert haben: `MAX_RETRIES = 3` und `ITEMS_PER_ROW = 3` bedeuten Verschiedenes. Das ist DRY im Sinne von Thomas und Hunt: Wissen, nicht Werte.

### 10. Explicit Parameters

Werte, die eine Routine braucht, ausdrücklich übergeben, statt sie in einer Map, einem Kontextobjekt oder aus Umgebungsvariablen tief im Code zu lesen.

```java
// vorher: Wer weiß, welche Schlüssel nötig sind?
void sendReport(Map<String, Object> params) {
    var to = (String) params.get("recipient");
    var period = (YearMonth) params.get("period");
    …
}

// nachher
void sendReport(String recipient, YearMonth period) { … }
```

### 11. Chunk Statements

Zusammengehörige Anweisungen durch eine Leerzeile vom Rest trennen. Das kleinste aller Tidyings und oft der erste Schritt zu einem Extract Helper.

### 12. Extract Helper

Einen Block mit erkennbarem Zweck in eine Hilfsmethode auslagern, deren Name den Zweck sagt. Beck betont zwei Anlässe: wenn man einen Block ändern will und ihn dafür isolieren möchte, und wenn zwei Zeilen immer zusammen auftreten und eine zeitliche Kopplung haben, etwa „erst öffnen, dann konfigurieren“.

### 13. One Pile

Das überraschendste Tidying, und eine direkte Antwort auf die Debatte zwischen Martin und Ousterhout:

Wenn Code in so viele kleine Teile zerlegt ist, dass man ihn nicht mehr versteht, **holt man alles zurück auf einen Haufen**: Methoden inlinen, Klassen zusammenführen, bis die ganze Logik vor einem liegt. Dann versteht man sie, und dann zerlegt man neu, diesmal entlang der richtigen Grenzen.

Beck nennt typische Symptome für diesen Fall: lange, wiederholte Argumentlisten, wiederholter Code mit Bedingungen, schlechte Namen für Hilfsmethoden und gemeinsam genutzte, veränderliche Datenstrukturen. Das ist fast wörtlich Ousterhouts Beschreibung flacher und verbundener Methoden, nur mit einem praktischen Ausweg.

### 14. Explaining Comments

Wenn man beim Lesen etwas Nichtoffensichtliches verstanden hat, schreibt man es sofort als Kommentar auf, damit der nächste Leser es nicht wieder herausfinden muss. Beck nennt besonders Kopplungen, die man im Code nicht sieht, etwa „wenn hier etwas geändert wird, muss auch das Exportformat angepasst werden“.

### 15. Delete Redundant Comments

Kommentare löschen, die genau das sagen, was der Code sagt. Oft werden Kommentare erst durch andere Tidyings redundant, etwa nach einem Extract Helper mit gutem Namen.

### Die Haltung hinter den Tidyings

Becks Kommentarposition liegt zwischen Martin und Ousterhout: Kommentare, die den Code wiederholen, löschen; Kommentare, die Verständnis oder versteckte Kopplung festhalten, schreiben. Und mit One Pile neben Extract Helper behandelt er Zusammenlegen und Zerlegen als gleichrangige Werkzeuge, wie Fowler mit Inline Function neben Extract Function.

## Managing (Teil II)

Der zweite Teil beantwortet die Frage, wie man Aufräumen in den täglichen Arbeitsfluss einbaut, besonders im Team mit Pull Requests und Reviews.

### Getrennte Änderungen

Becks wichtigster praktischer Rat: **Struktur- und Verhaltensänderungen in getrennte Pull Requests.** Ein PR, der beides mischt, ist schwer zu prüfen: Der Reviewer muss bei jeder Zeile überlegen, ob sie das Verhalten ändert. Ein reiner Tidying-PR ist schnell geprüft, weil er nichts tun soll.

Beck geht noch weiter: In Teams mit hohem Vertrauen könnten Tidying-PRs so schnell geprüft werden, dass man sie fast ohne Wartezeit zusammenführt. Je billiger das Review, desto kleiner dürfen die Schritte werden.

### Verketten

Ein Tidying zieht oft weitere nach sich: Nach einer Guard Clause fällt eine erklärende Variable auf, danach ein Helper, danach eine Konstante. Beck beschreibt typische Ketten und warnt zugleich: **Man muss aufhören können.** Aufräumen ist kein Ziel an sich, sondern Vorbereitung für die Verhaltensänderung, um die es eigentlich geht.

### Batch-Größe

Wie viele Tidyings gehören in einen PR? Beck beschreibt die Abwägung:

| Größere Batches | Kleinere Batches |
|---|---|
| mehr Kollisionen mit der Arbeit anderer | weniger Konflikte |
| mehr Wechselwirkungen, schwerer zu prüfen | leichter zu verstehen und zurückzunehmen |
| mehr Spekulation, was künftig gebraucht wird | weniger Aufräumen auf Vorrat |
| fester Aufwand pro Review fällt seltener an | fester Aufwand pro Review fällt öfter an |

Der Schlüssel liegt in der letzten Zeile: Wenn Reviews teuer sind, wächst der Druck zu großen Batches, mit allen Nachteilen. Wer kleine Batches will, muss den **Aufwand pro Review senken**. Das ist dieselbe Logik, die *Accelerate* schon 2018 mit Daten zu Durchlaufzeit und Lieferfrequenz gestützt hat.

### Rhythmus

Tidying ist Minutenarbeit, höchstens eine Stunde am Stück vor einer Verhaltensänderung. Wer länger aufräumt, verliert wahrscheinlich das eigentliche Ziel aus dem Blick, das Feature, das ausgeliefert werden soll.

### Entwirren

Was tun, wenn man doch Aufräumen und Verhaltensänderung vermischt hat, was jedem passiert? Beck nennt drei Optionen:

1. **So ausliefern:** schnell, aber schwer zu prüfen und riskanter.
2. **Nachträglich trennen:** in mehrere PRs aufteilen, oft mühsam.
3. **Verwerfen und neu machen:** die Änderung wegwerfen und noch einmal machen, diesmal erst aufräumen, dann ändern.

Beck bevorzugt oft die dritte Option. Das klingt verschwenderisch, ist aber meist schneller als gedacht, weil man beim zweiten Mal weiß, was zu tun ist, und das Ergebnis ist sauberer. Das ist Becks „Do Over“ aus *Test-Driven Development*, übertragen auf Pull Requests.

## Erst, danach, später oder nie?

Die Titelfrage des Buchs bekommt ein eigenes Kapitel mit vier möglichen Antworten.

| Wann | Wann sinnvoll |
|---|---|
| **Nie** | Der Code wird nie wieder geändert, oder man lernt durch das Aufräumen nichts, was später hilft. |
| **Später** | Es gibt viel aufzuräumen, aber kein unmittelbarer Nutzen. Man sammelt die Ideen auf einer Liste und arbeitet sie ab, wenn Zeit ist, etwa als Abwechslung. |
| **Danach** | Die Verhaltensänderung ist dringend, aber man weiß, dass man bald wieder an dieser Stelle arbeitet. Oder man hat erst durch die Änderung verstanden, wie die Struktur sein sollte. |
| **Zuerst** | Das Aufräumen macht die anstehende Änderung sofort leichter, man weiß, was zu tun ist, und es kostet wenig. |

### Becks Faustregeln

- **Zuerst aufräumen**, wenn es die Verhaltensänderung leichter macht und sich in Minuten erledigen lässt. Der Nutzen ist sofort spürbar.
- **Danach aufräumen**, wenn man durch die Änderung gelernt hat, was die bessere Struktur wäre, und wenn die nächste Änderung absehbar ist. Wer jetzt nicht aufräumt, zahlt beim nächsten Mal doppelt.
- **Später aufräumen** nur mit echtem Plan, denn „später“ kommt oft nie. Eine Liste der Ideen hilft.
- **Nie aufräumen** ist legitim. Nicht jeder hässliche Code muss schön werden. Code, den niemand ändert, kostet nichts.

### Einordnung

Diese Unterscheidung fehlt bei allen anderen Autoren der Reihe. Martin sagt im Grunde „immer zuerst und immer danach“, Fowler sagt „vorbereitend und nebenbei“, Ousterhout „strategisch, 10 bis 20 Prozent“. Beck ist der Erste, der ausdrücklich sagt: **Manchmal ist nie die richtige Antwort.** Das deckt sich mit Fowlers Bemerkung, dass man Code, den man nicht ändern muss, nicht refaktorieren sollte, macht daraus aber eine bewusste, wiederkehrende Entscheidung.

## Theorie (Teil III)

Der dritte Teil ist der eigentliche Beitrag des Buchs. Beck versucht, mit wenigen Begriffen zu erklären, **warum** Softwaredesign wirtschaftlich sinnvoll ist, und damit, wann man Zeit dafür ausgeben sollte.

### Was Softwaredesign ist

Becks Definition ist bewusst schlicht: Design heißt, **Elemente nutzbringend zueinander in Beziehung zu setzen.**

- **Elemente** sind die Bausteine: Ausdrücke, Funktionen, Klassen, Module, Dienste. Elemente enthalten andere Elemente.
- **Beziehungen** sind etwa: ruft auf, veröffentlicht, hört zu, verweist auf, erbt von.
- **Nutzbringend** heißt: Die Anordnung macht etwas leichter, etwa Verstehen, Ändern oder Testen.

Design ist damit alles, was die Struktur verändert: Elemente anlegen, entfernen, zusammenführen, aufteilen und Beziehungen hinzufügen oder entfernen. Ein Tidying ist eine sehr kleine solche Änderung.

### Struktur und Verhalten

Verhalten lässt sich auf zwei Arten beschreiben: als Paare von Eingabe und Ausgabe, etwa „diese Bestellung ergibt diese Rechnung“, und als Invarianten, also Regeln, die immer gelten müssen. Struktur dagegen ist für Nutzer unsichtbar. Sie zahlt sich nur indirekt aus: indem sie künftige Verhaltensänderungen billiger macht.

Daraus folgt ein Dilemma, das jedes Team kennt: Verhalten ist das, wofür bezahlt wird, also drängt alles zu Verhaltensänderungen. Struktur ist das, was spätere Verhaltensänderungen schnell oder langsam macht. Wer nur Verhalten liefert, wird immer langsamer. Wer nur Struktur verbessert, liefert nichts.

### Reversible Strukturänderungen

Ein wichtiger und oft übersehener Gedanke: **Die meisten Strukturänderungen lassen sich leicht rückgängig machen.** Eine extrahierte Methode lässt sich wieder inlinen, eine umbenannte Variable zurückbenennen. Verhaltensänderungen dagegen sind oft schwer umkehrbar, etwa eine Datenmigration, eine veröffentlichte API oder eine verschickte E-Mail.

Daraus folgt: **Umkehrbare Entscheidungen verdienen weniger Sorgfalt als unumkehrbare.** Wer jedes Tidying so streng prüft wie eine Datenbankmigration, verschwendet Zeit und verhindert genau die kleinen Verbesserungen, die sich lohnen.

Beck nennt aber auch Ausnahmen: Manche Strukturänderungen sind schwer umkehrbar, etwa das Herauslösen eines eigenständigen Dienstes, eine Änderung an einer öffentlich genutzten Schnittstelle oder das Aufteilen einer Datenbank. Diese verdienen sorgfältige Planung.

### Einordnung

Die Unterscheidung nach Umkehrbarkeit ist dieselbe, die Ousterhout und Thomas und Hunt in anderem Gewand nutzen: Thomas und Hunt mit ihrer Reversibilität, Ousterhout mit „Design it twice“ für folgenreiche Entscheidungen. Jeff Bezos hat für Unternehmensentscheidungen ein bekanntes ähnliches Bild geprägt, Türen, durch die man zurückgehen kann, und solche, durch die man nicht zurückkommt. Beck überträgt das auf den Code.

## Ökonomie: Zeitwert und Optionen

Becks zentrales Argument stützt sich auf zwei Ideen aus der Finanzwelt, die in entgegengesetzte Richtungen ziehen.

### Ein Euro heute ist mehr wert als ein Euro morgen

Der **Zeitwert des Geldes**: Einnahmen, die früher kommen, sind mehr wert, weil man sie investieren kann und weil die Zukunft unsicher ist. Kosten, die später anfallen, sind weniger schlimm.

Für Software heißt das: **Verhalten zuerst.** Ein Feature, das früher ausgeliefert wird, bringt früher Geld. Aufräumen, das die Auslieferung verzögert, kostet. Diese Kraft treibt Teams zu „erst liefern, später aufräumen“, und oft ist das richtig.

### Optionen

Die Gegenkraft: Gute Struktur schafft **Optionen**, also die Möglichkeit, künftig mit geringem Aufwand neue Verhaltensänderungen vorzunehmen. In der Finanzwelt hat eine Option einen eigenen Wert, auch wenn man sie nie ausübt. Beck überträgt das: Ein System, das sich leicht in viele Richtungen ändern lässt, ist wertvoller als eines, das genau das kann, was es heute tut.

Nach der Optionstheorie, die Beck vereinfacht heranzieht, steigt der Wert einer Option, wenn:

- der mögliche Gewinn groß ist,
- die Zukunft **unsicher** ist, also viele verschiedene Änderungen denkbar sind,
- die Laufzeit lang ist, das System also lange weiterentwickelt wird,
- und die Kosten, die Option auszuüben, gering sind.

Für Software heißt das: **Struktur zuerst**, besonders dann, wenn die Zukunft offen ist. Das ist eine überraschende Umkehrung der üblichen Intuition: Unsicherheit spricht nicht gegen Design, sondern **für** Design, das Optionen offen hält.

### Die Spannung

| Kraft | Folgerung | Am stärksten, wenn … |
|---|---|---|
| Zeitwert des Geldes | Verhalten zuerst, Struktur später | Termindruck hoch, Nutzen sofort messbar, System kurzlebig |
| Optionswert | Struktur zuerst | Zukunft offen, System langlebig, viele denkbare Änderungen |

Design ist für Beck das tägliche Abwägen zwischen diesen beiden Kräften, nicht ein Prinzip, das eine Seite gewinnt.

### Die einfache Entscheidungsregel

Für den Einzelfall gibt Beck eine Faustregel: **Zuerst aufräumen, wenn die Kosten fürs Aufräumen plus die Kosten der Änderung danach geringer sind als die Kosten der Änderung ohne Aufräumen.** Ist das nicht der Fall, kann sich Aufräumen trotzdem lohnen, wegen des Optionswerts für künftige Änderungen. Aber dann ist es eine bewusste Investition, keine Selbstverständlichkeit.

### Einordnung

Diese ökonomische Herleitung ist der originellste Teil des Buchs. Sie gibt Entwicklern eine Sprache, mit der sie Design gegenüber Produktmanagement begründen können, ohne auf Begriffe wie „sauber“ oder „professionell“ zurückzugreifen. Ward Cunninghams Bild der **technischen Schulden** beschreibt die Kostenseite, Becks Optionen beschreiben die Nutzenseite.

## Kopplung, Constantines Äquivalenz und Kohäsion

Die letzten Kapitel führen die Theorie zu ihrem Kern zurück: zur Kopplung, einem Begriff, den Larry Constantine und Edward Yourdon schon 1975 in *Structured Design* geprägt haben.

### Kopplung ist relativ zur Änderung

Becks Definition: Zwei Elemente sind **in Bezug auf eine bestimmte Änderung** gekoppelt, wenn eine Änderung am einen eine Änderung am anderen erzwingt.

Das „in Bezug auf eine Änderung“ ist entscheidend. Zwei Klassen können für die eine Änderung gekoppelt sein, für eine andere nicht. Kopplung ist keine abstrakte Eigenschaft, sondern hängt davon ab, was sich ändern wird.

```java
// gekoppelt in Bezug auf "Datumsformat ändern", nicht in Bezug auf "neues Feld"
class InvoiceExporter { String date(LocalDate d) { return d.format(ofPattern("dd.MM.yyyy")); } }
class InvoiceImporter { LocalDate date(String s) { return LocalDate.parse(s, ofPattern("dd.MM.yyyy")); } }

// entkoppelt für diese Änderung: das Wissen steht an einer Stelle
final class InvoiceFormat { static final DateTimeFormatter DATE = ofPattern("dd.MM.yyyy"); }
```

Das ist genau Ousterhouts Information Leakage, nur über die Änderung definiert statt über das Wissen.

### Constantines Äquivalenz

Beck formuliert eine Kette, die er Constantine zuschreibt:

**Kosten der Software ≈ Kosten der Änderungen ≈ Kosten der großen Änderungen ≈ Kopplung**

Die Schritte im Einzelnen:

- Die Kosten einer Software liegen fast vollständig in ihrer Weiterentwicklung, nicht in der ersten Version.
- Die Kosten von Änderungen folgen einer **Potenzverteilung**: Die meisten Änderungen sind billig, wenige sind sehr teuer, und diese wenigen dominieren die Gesamtkosten.
- Große Änderungen sind teuer, weil sie sich **kaskadieren**: Eine Änderung erzwingt die nächste, die wieder die nächste erzwingt.
- Diese Kaskaden entstehen durch Kopplung.

Daraus folgt: Wer die Gesamtkosten von Software senken will, muss Kopplung senken, besonders jene, die teure Kaskaden auslöst.

### Kopplung gegen Entkopplung

Entkopplung ist nicht kostenlos. Jede Schnittstelle, jede Indirektion, jede Abstraktion kostet Zeit beim Bauen und Verstehen. Beck rät, nicht jede Kopplung zu beseitigen, sondern die, deren erwartete Änderungskosten höher sind als die Kosten der Entkopplung. Manche Kopplung ist billiger zu ertragen als zu beseitigen. Das ist exakt das Gegenmittel gegen das Überdesign, vor dem Fowler mit Speculative Generality und Ousterhout mit Classitis warnen.

### Kohäsion

Kohäsion ist bei Beck die Kehrseite: **Elemente, die miteinander gekoppelt sind, sollen im selben umfassenden Element liegen.** Wenn man Kopplung nicht beseitigen kann, soll man sie wenigstens räumlich bündeln, damit eine Änderung an einer Stelle bleibt. Das ist die Begründung für das Tidying „Cohesion Order“ und im Großen für Evans' Bounded Contexts.

### Einordnung

Mit Constantine schließt Beck den Kreis zu den Ursprüngen der Disziplin. Was Ousterhout „Komplexität“ nennt, Thomas und Hunt „ETC“, Martin „Saubersein“ und Evans „Bounded Context“, führt Beck auf eine messbare Ursache zurück: Kopplung in Bezug auf wahrscheinliche Änderungen.

## Kritik und Einordnung

Ein kleines Buch mit einer großen Idee. Die Reaktionen schwanken zwischen „das Wichtigste, was Beck seit Jahren geschrieben hat“ und „dünn für den Preis“.

### Stärken

- **Ökonomische Sprache für Design:** Zeitwert gegen Optionswert erklärt, warum sowohl „erst liefern“ als auch „erst aufräumen“ richtig sein können. Das hilft im Gespräch mit Produktmanagement mehr als jede Clean-Code-Regel.
- **„Nie“ ist erlaubt:** Als einziges Buch der Reihe macht es das Nicht-Aufräumen zu einer legitimen, bewussten Entscheidung.
- **Teamrealität:** getrennte PRs, Review-Kosten, Batch-Größen. Die Frage, wie Design im Alltag mit Pull Requests funktioniert, behandeln die Klassiker kaum.
- **One Pile:** eine elegante Antwort auf die Zerlegungsdebatte zwischen Martin und Ousterhout.
- **Kopplung relativ zur Änderung:** eine präzisere Definition als in den meisten anderen Büchern.
- **Kurz:** in zwei, drei Stunden gelesen.

### Kritikpunkte

**1. Sehr knapp.** Viele Kapitel sind eine Seite lang. Wer Fowler und McConnell kennt, findet die Tidyings selbst wenig neu.

**2. Die Theorie ist skizziert, nicht ausgearbeitet.** Optionen, Zeitwert und Constantines Äquivalenz werden eingeführt, aber nicht vertieft oder an Beispielen durchgerechnet. Wie man den Optionswert einer Struktur in der Praxis einschätzt, bleibt offen.

**3. Wenige Beispiele.** Die Codebeispiele sind kurz und abstrakt, teils in Pseudocode. Wie die Theorie in einem echten Projekt mit Fristen und Altlasten angewendet wird, zeigt das Buch kaum.

**4. Unvollständig als Reihe.** Beck kündigt Folgebände für Teams und Organisationen an. Ohne sie fehlt die Ebene, auf der die meisten teuren Kopplungen tatsächlich entstehen: zwischen Teams und Systemen. Ob und wann diese Bände erscheinen, ist mir nicht bekannt.

**5. Empirisch im Titel, kaum Empirie im Inhalt.** Der Untertitel verspricht ein empirisches Vorgehen; gemeint ist Beobachten und Ausprobieren, nicht Studien.

### Gesamturteil

Tidy First? ist weniger ein Handbuch als ein Denkanstoß. Sein Wert liegt nicht in den 15 Tidyings, sondern in der Frage, die es stellt, und in der Sprache, mit der es sie beantwortet: Struktur ist eine Investition in Optionen, und wie jede Investition kann sie sich lohnen oder nicht. Für jemanden, der die anderen Bücher der Reihe kennt, ist es die vielleicht beste Zusammenfassung dessen, worum es beim Design eigentlich geht.

## Verhältnis zu den anderen Büchern

Tidy First? ist eine Art Metabuch zur Reihe: Es fragt nicht, wie gutes Design aussieht, sondern wann es sich lohnt, dafür Zeit auszugeben.

| Frage | Andere Autoren | Beck in Tidy First? |
|---|---|---|
| Wann aufräumen? | Martin: immer, Pfadfinderregel; Fowler: vorbereitend und nebenbei; Ousterhout: 10–20 Prozent strategisch | erst, danach, später oder nie, je nach Kosten und Optionswert |
| Warum Design? | Martin: Professionalität; Ousterhout: Komplexität; Thomas und Hunt: ETC; Fowler: Design Stamina | Optionen für künftige Änderungen gegen Zeitwert früher Auslieferung |
| Zerlegen oder zusammenlegen? | Martin: zerlegen; Ousterhout: Tiefe; Fowler: beides | Extract Helper und One Pile gleichrangig |
| Was kostet? | McConnell: Fehler werden später teurer | Kopplung, die kaskadierende Änderungen erzeugt |
| Kommentare | Martin: meist Versagen; Ousterhout: unverzichtbar | redundante löschen, erklärende und Kopplungshinweise schreiben |
| Kleine Schritte | Fowler, Feathers, Beck in TDD | jetzt auch auf PR-Ebene: getrennte Struktur- und Verhaltens-PRs |
| Umkehrbarkeit | Thomas und Hunt: Reversibilität | umkehrbare Strukturänderungen brauchen weniger Sorgfalt |

### Becks zwei Bücher im Vergleich

|  | *Test-Driven Development* (2002) | *Tidy First?* (2023) |
|---|---|---|
| Gegenstand | wie man Verhalten sicher ändert | wann man Struktur ändert |
| Leitbild | Rhythmus: rot, grün, refactor | Ökonomie: Zeitwert gegen Optionen |
| Schrittgröße | Minuten | Minuten bis eine Stunde, getrennte PRs |
| Gefühl | Angst gegen Zuversicht | Druck gegen Neugier und Sorgfalt |

Zusammen gelesen ergeben beide Bücher Becks ganze Sicht: TDD macht Verhaltensänderungen sicher, Tidying macht sie billig.

## Diskussionsfragen

1. **Getrennte PRs:** Trennt ihr Struktur- und Verhaltensänderungen in Pull Requests? Was spricht in eurer Praxis dagegen?
2. **Review-Kosten:** Wie teuer ist bei euch ein Review? Würden schnellere Reviews kleinere Schritte möglich machen?
3. **Nie aufräumen:** Gibt es in euren Systemen Code, den man bewusst nie aufräumen sollte? Woran erkennt man ihn?
4. **Optionen und Unsicherheit:** Überzeugt dich das Argument, dass unsichere Zukunft für Design spricht, nicht dagegen?
5. **One Pile:** Hast du je Code erst zusammengeführt, um ihn dann besser zu zerlegen? Wie hat das funktioniert?
6. **Kopplung relativ zur Änderung:** Welche Änderungen sind in deinem aktuellen Projekt am wahrscheinlichsten, und welche Kopplungen würden sie teuer machen?
7. **Gegenüber Produktmanagement:** Würde die Sprache von Zeitwert und Optionen in euren Gesprächen über technische Schulden helfen?
8. **Nächstes Buch:** Nach so viel Ökonomie und Erfahrung wäre *Accelerate* mit echten Daten der logische Schritt. Einverstanden?
