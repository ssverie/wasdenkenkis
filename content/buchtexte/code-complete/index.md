+++
title = "Code Complete – Zusammenfassung und Einordnung"
description = "Steve McConnell, Code Complete: A Practical Handbook of Software Construction (1993, 2. Auflage 2004)"
date = 2026-10-29T15:16:11+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["code-complete-2004"]
+++

## Einleitung

Code Complete ist ein Handbuch der **Softwarekonstruktion**: detailliertes Design, Programmieren, Debugging, Entwicklertests, Integration. Es will das, was erfahrene Entwickler an Wissen über diese Tätigkeit angesammelt haben, an einer Stelle bündeln und mit Forschungsergebnissen belegen.

### Autor und Kontext

Steve McConnell arbeitete als Entwickler und Projektleiter, unter anderem bei Microsoft, und gründete später die Beratungsfirma Construx. Er hat weitere einflussreiche Bücher geschrieben, etwa *Rapid Development* und *Software Estimation*.

|  | 1. Auflage (1993) | 2. Auflage (2004) |
|---|---|---|
| Sprachen der Beispiele | vor allem C, Pascal, Basic | C++, Java, Visual Basic |
| Schwerpunkt | strukturierte Programmierung | zusätzlich objektorientiertes Design, Klassen, Refactoring, agile Praktiken |
| Umfang | rund 850 Seiten | rund 900 Seiten, 35 Kapitel |

Die erste Auflage erschien vor Design Patterns, Refactoring und dem Agilen Manifest. Die zweite Auflage hat diese Entwicklungen eingearbeitet. Diese Zusammenfassung bezieht sich auf die zweite Auflage.

### Was das Buch besonders macht

- **Empirie:** McConnell stützt sich auf Hunderte Studien und Messungen aus Forschung und Industrie, etwa von Capers Jones, Barry Boehm, Victor Basili oder der NASA. Wo es Daten gibt, nennt er sie. Wo nicht, sagt er das.
- **Checklisten:** Fast jedes Kapitel endet mit einer Prüfliste, die man im Code-Review oder bei der eigenen Arbeit verwenden kann.
- **Sprachunabhängigkeit:** Die Prinzipien gelten für jede Sprache. Beispiele zeigen oft mehrere Sprachen nebeneinander.
- **Weiterführende Literatur:** Jedes Kapitel endet mit kommentierten Lesehinweisen.

### Warum Konstruktion?

McConnell argumentiert, Konstruktion sei der einzige Teil der Softwareentwicklung, der garantiert stattfindet. Anforderungen und Architektur werden manchmal übersprungen, aber Code wird immer geschrieben. Je nach Projektgröße macht Konstruktion einen großen Teil des Aufwands aus, bei kleinen Projekten den größten. Und die Qualität der Konstruktion bestimmt maßgeblich die Qualität der Software.

### Aufbau

| Teil | Kapitel | Inhalt |
|---|---|---|
| I. Grundlagen | 1–4 | Metaphern, Voraussetzungen, Schlüsselentscheidungen |
| II. Hochwertiger Code | 5–9 | Design, Klassen, Routinen, defensive Programmierung, Pseudocode |
| III. Variablen | 10–13 | Variablen, Namen, Datentypen |
| IV. Anweisungen | 14–19 | Ablauf, Bedingungen, Schleifen, tabellengesteuerte Methoden |
| V. Code-Verbesserungen | 20–26 | Qualität, Reviews, Tests, Debugging, Refactoring, Tuning |
| VI. Systemaspekte | 27–30 | Programmgröße, Management, Integration, Werkzeuge |
| VII. Software-Handwerk | 31–35 | Layout, selbstdokumentierender Code, Charakter, Leitthemen |

## Grundlagen (Teil I)

### Metaphern

McConnell beginnt mit der Frage, welches Bild man von Softwareentwicklung hat, weil Metaphern das Denken steuern. Er vergleicht mehrere:

| Metapher | Stärke | Schwäche |
|---|---|---|
| Schreiben eines Briefes | betont Individualität | ignoriert Planung, Teamarbeit und Überarbeitung |
| Landwirtschaft: säen und ernten | betont Wachstum | suggeriert, dass man keinen direkten Einfluss hat |
| Austernzucht: Schicht um Schicht | betont inkrementelles Wachstum | wenig über Struktur |
| Bauen eines Gebäudes | betont Planung, Struktur, Vorarbeiten und angemessene Sorgfalt je nach Größe | kann zu schwerfälliger Vorabplanung verleiten |

Er bevorzugt die **Bau-Metapher**, weil sie erklärt, warum ein Gartenhaus wenig Planung braucht, ein Hochhaus sehr viel, und warum Fehler im Fundament teurer sind als Fehler in der Tapete. Werkzeuge versteht er als **Werkzeugkasten**, aus dem man je nach Aufgabe wählt, nicht als einzige richtige Methode.

### Voraussetzungen: zweimal messen, einmal schneiden

Bevor die Konstruktion beginnt, müssen Anforderungen und Architektur ausreichend klar sein. McConnell stützt das mit einem der bekanntesten Befunde der Softwareforschung: **Je später ein Fehler gefunden wird, desto teurer ist er.** Ein Fehler in den Anforderungen, der erst nach der Auslieferung auffällt, kostet laut den zitierten Studien ein Vielfaches dessen, was er bei früher Entdeckung gekostet hätte, oft genannt werden Faktoren von zehn bis hundert.

Wichtig ist seine Differenzierung: Wie viel Vorarbeit nötig ist, hängt vom Projekt ab. Bei iterativen Projekten verteilt sich die Arbeit an Anforderungen und Architektur über viele Zyklen, bei sequenziellen geschieht sie vorab. Ein Web-Prototyp braucht weniger als die Steuerung eines Flugzeugs. McConnell gibt Checklisten, um zu prüfen, ob Anforderungen und Architektur gut genug sind, damit die Konstruktion beginnen kann.

### Schlüsselentscheidungen

Vor dem Programmieren stehen einige Entscheidungen:

- **Programmiersprache:** McConnell zitiert Studien, nach denen Entwickler in vertrauten Sprachen deutlich produktiver sind und höhere Sprachen weniger Zeilen für dieselbe Funktion brauchen.
- **Konventionen:** Namen, Formatierung, Fehlerbehandlung, Kommentare, vor dem Start festgelegt.
- **Position auf der Technologiewelle:** Wer früh mit einer jungen Technologie arbeitet, hat weniger Werkzeuge, Bibliotheken und Dokumentation und muss mehr selbst bauen. Wer spät kommt, hat ausgereifte Werkzeuge, aber weniger Innovationsvorteil.
- **Konstruktionspraktiken:** Welche Praktiken setzt das Team ein, etwa Paarprogrammierung, Reviews, Tests vor Code?

### In eine Sprache programmieren, nicht in ihr

Eine der bekanntesten Ideen des Buchs, auf Englisch *programming into a language*, nicht *in* it. Gute Entwickler denken zuerst darüber nach, was sie ausdrücken wollen, und setzen das dann mit den Mitteln der Sprache um, notfalls durch eigene Konventionen. Wer nur *in* einer Sprache denkt, beschränkt seine Gedanken auf das, was die Sprache direkt anbietet.

McConnells Beispiel: Wenn eine Sprache keine Assertions hat, schreibt man eine eigene `assert`-Routine. Wenn sie keine Enums hat, simuliert man sie mit Konstanten und Konventionen. Das Prinzip erklärt nebenbei, warum viele GoF-Patterns entstanden sind: als Konventionen, mit denen Entwickler fehlende Sprachmittel ersetzten.

## Design in der Konstruktion

Das fünfte Kapitel enthält die vielleicht wichtigste These des Buchs: **Das primäre technische Gebot der Softwareentwicklung ist, Komplexität zu beherrschen.** Diese Formulierung von 2004 ist der direkte Vorläufer von Ousterhouts Buch, das 14 Jahre später auf genau dieser Idee aufbaut.

### Warum Design schwierig ist

McConnell beschreibt Design als:

- ein **„wicked problem“**, das man erst vollständig versteht, wenn man es einmal gelöst hat
- einen **unordentlichen Prozess**, der ein ordentliches Ergebnis liefert
- eine Sache von **Abwägungen und Einschränkungen**
- **nicht deterministisch:** Zwei gute Entwickler kommen zu verschiedenen, gleich guten Entwürfen
- **heuristisch:** Es gibt Faustregeln, keine Algorithmen
- **emergent:** Design entwickelt sich durch Reviews, Diskussion und Code

### Wesentliche und zufällige Komplexität

McConnell greift auf Fred Brooks' Unterscheidung aus *No Silver Bullet* (1986) zurück:

- **Wesentliche Komplexität** gehört zum Problem selbst und lässt sich nicht beseitigen, etwa komplizierte Steuerregeln.
- **Zufällige Komplexität** entsteht durch Werkzeuge, Sprachen und schlechtes Design und lässt sich verringern.

Die Aufgabe des Designs: die wesentliche Komplexität so zerlegen, dass man zu jedem Zeitpunkt nur einen kleinen Teil davon im Kopf haben muss, und die zufällige Komplexität minimieren. McConnell zitiert Dijkstra: Kein Gehirn ist groß genug, um ein ganzes modernes Programm zu fassen.

### Wünschenswerte Eigenschaften eines Designs

| Eigenschaft | Bedeutung |
|---|---|
| Minimale Komplexität | einfach und leicht verständlich, nicht clever |
| Wartbarkeit | für den Wartungsprogrammierer entworfen |
| Lose Kopplung | wenige, einfache Verbindungen zwischen Teilen |
| Erweiterbarkeit | Änderungen ohne Umbau der Struktur |
| Wiederverwendbarkeit | Teile auch anderswo nutzbar |
| Hoher Fan-in | viele Klassen nutzen eine bestimmte Klasse |
| Niedriger bis mittlerer Fan-out | eine Klasse nutzt wenige andere, etwa höchstens sieben |
| Schlankheit | nichts Überflüssiges |
| Schichtung | man kann eine Ebene verstehen, ohne die anderen zu kennen |
| Standardtechniken | bekannte Lösungen statt exotischer |

### Heuristiken

McConnell gibt eine Liste von Designheuristiken, die man fast als Zusammenfassung der anderen Bücher dieser Reihe lesen kann:

- Objekte der realen Welt finden
- Konsistente Abstraktionen bilden
- Implementierungsdetails kapseln
- Vererben, wenn es das Design vereinfacht
- **Geheimnisse verbergen**, im Sinne von Parnas' Information Hiding. McConnell hält dies für eine der wirksamsten Heuristiken überhaupt.
- **Bereiche finden, die sich wahrscheinlich ändern**, und sie isolieren
- Kopplung lose halten
- Nach bekannten Entwurfsmustern suchen

### Designpraktiken

Iterieren, teilen und herrschen, Top-down und Bottom-up kombinieren, Prototypen bauen, gemeinsam entwerfen. Und die Frage, wie viel Design genug ist: so viel, bis die verbleibenden Entscheidungen offensichtlich sind. Für erfahrene Teams bei vertrauten Problemen weniger, für neue Teams oder neue Probleme mehr.

### Einordnung

Dieses Kapitel ist eine kompakte Synthese dessen, was Ousterhout, Evans und die GoF ausführlicher behandeln. Bemerkenswert ist die Vorsicht: McConnell stellt keine eigene Designphilosophie auf, sondern bündelt bewährte Heuristiken und sagt offen, dass Design nicht deterministisch ist.

## Klassen

McConnell beginnt bei **abstrakten Datentypen**: Eine Klasse ist im Kern ein Datentyp plus die Operationen darauf. Die wichtigsten Ratschläge:

- **Konsistente Abstraktion:** Alle öffentlichen Methoden einer Klasse gehören zur selben Abstraktion. Eine Klasse `EmployeeCensus` mit Methoden für Mitarbeiter und gleichzeitig für Listen-Iteration mischt zwei Ebenen.
- **Kapselung ernst nehmen:** Keine Annahmen über die Nutzung der Klasse machen, keine Implementierungsdetails in der Schnittstelle zeigen, nicht nur `private` setzen, sondern auch semantisch kapseln.
- **Enthalten statt erben:** „Hat-ein“ ist der Standard, „Ist-ein“ nur bei echtem Liskov-Verhältnis. Tiefe Vererbungshierarchien erhöhen nachweislich die Fehlerrate.
- **Anzahl der Datenfelder:** McConnell verweist auf die Grenze des Kurzzeitgedächtnisses von etwa sieben plus minus zwei Elementen. Deutlich mehr Felder sind ein Hinweis, dass die Klasse zu groß ist.

## Hochwertige Routinen

„Routine“ ist McConnells sprachneutraler Begriff für Methode, Funktion oder Prozedur.

### Gute Gründe für eine Routine

Komplexität verringern, eine verständliche Zwischenabstraktion einführen, Duplikation vermeiden, Reihenfolgen oder Zeigeroperationen verbergen, Portabilität verbessern, komplizierte Bedingungen vereinfachen, Performance an einer Stelle optimierbar machen. Auch sehr kurze Routinen können sinnvoll sein, wenn sie eine Abstraktion benennen.

### Kohäsion

McConnell übernimmt die klassische Skala aus der strukturierten Programmierung:

| Kohäsion | Bedeutung | Bewertung |
|---|---|---|
| Funktional | Die Routine tut genau eine Sache. | ideal |
| Sequenziell | Schritte in fester Reihenfolge, Ergebnis des einen ist Eingabe des nächsten | akzeptabel |
| Kommunikativ | Operationen auf denselben Daten, sonst unverbunden | akzeptabel |
| Zeitlich | Dinge, die zur selben Zeit geschehen, etwa `startup()` | akzeptabel, wenn sie nur andere Routinen aufruft |
| Prozedural | Schritte nach vorgegebener Reihenfolge, etwa einer Bildschirmmaske | schlecht |
| Logisch | Ein Flag wählt, welche von mehreren Operationen ausgeführt wird | schlecht |
| Zufällig | keine erkennbare Beziehung | schlecht |

Die logische Kohäsion ist genau das Flag-Argument, das Martin und Fowler bekämpfen.

### Wie lang darf eine Routine sein?

Hier liefert McConnell, was in Clean Code und bei Ousterhout fehlt: **Daten.** Er fasst mehrere Studien aus den 1980er und frühen 1990er Jahren zusammen. Grob lauten die Ergebnisse:

- In einer Studie nahm die Fehlerdichte pro Zeile mit wachsender Routinengröße bis etwa 200 Zeilen **ab**.
- Andere Studien fanden keinen Zusammenhang zwischen kleinen Routinen und weniger Fehlern oder geringeren Kosten. Strukturelle Komplexität und die Menge der Daten waren aussagekräftiger als die Länge.
- In einer weiteren Studie hatten kleine Routinen mehr Fehler pro Zeile als größere, waren aber billiger zu beheben.
- Routinen mit durchschnittlich 100 bis 150 Zeilen mussten in einer Untersuchung am seltensten geändert werden.
- Bei IBM waren Routinen über 500 Zeilen am fehleranfälligsten, und darüber stieg die Fehlerrate mit der Länge.

McConnells Schluss: Die Länge soll sich aus Funktion und Logik ergeben, nicht aus einer Zeilengrenze. Ab etwa 200 Zeilen soll man vorsichtig werden. Das widerspricht Martins zwei bis vier Zeilen deutlich und stützt eher Ousterhout.

### Namen und Parameter

- **Name einer Prozedur:** starkes Verb plus Objekt, etwa `printDocument()`. Bei Methoden reicht oft das Verb, weil das Objekt der Empfänger ist: `document.print()`.
- **Alles beschreiben, was die Routine tut.** Ein Name wie `computeReportTotalsAndOpenOutputFile()` ist ehrlich, zeigt aber, dass die Routine zwei Dinge tut.
- **Höchstens etwa sieben Parameter**, in konsistenter Reihenfolge: Eingabe, Änderung, Ausgabe.
- **Alle Parameter verwenden.** Ein ungenutzter Parameter ist ein Warnsignal.

```java
// logische Kohäsion: Flag wählt die Operation
void process(Order order, boolean archive) {
    if (archive) { … } else { … }
}

// funktionale Kohäsion
void archive(Order order) { … }
void fulfil(Order order)  { … }
```

## Defensive Programmierung

Der Vergleich stammt aus dem Straßenverkehr: Man fährt defensiv, weil man nie weiß, was andere tun. Im Code heißt das, sich gegen ungültige Daten, falsche Aufrufe und unmögliche Zustände zu schützen.

### Assertions und Fehlerbehandlung

McConnell unterscheidet sauber:

- **Assertions** für Bedingungen, die **nie** eintreten dürfen, also Programmierfehler. Sie sind Entwicklungshilfe und dokumentieren Annahmen.
- **Fehlerbehandlung** für Bedingungen, die eintreten **können**, etwa ungültige Eingaben oder fehlende Dateien.

### Robustheit oder Korrektheit

Eine wichtige Abwägung, die in den anderen Büchern kaum vorkommt. Bei einem Fehler kann man:

| Strategie | Beispiel |
|---|---|
| Neutralen Wert zurückgeben | leere Liste, 0 |
| Nächsten gültigen Datensatz nehmen | beim Lesen eines Sensorstroms |
| Letzten gültigen Wert wiederholen | Bildschirmanzeige |
| Nächstgelegenen gültigen Wert nehmen | Temperatur auf Messbereich begrenzen |
| Warnung protokollieren und weitermachen | Batch-Verarbeitung |
| Fehlercode oder Exception | Bibliotheksaufruf |
| Programm beenden | Steuerungssoftware im unsicheren Zustand |

Welche Strategie passt, hängt von der Domäne ab: Ein Videospiel soll lieber weiterlaufen, also **Robustheit**. Eine Strahlentherapie soll lieber abbrechen als eine falsche Dosis geben, also **Korrektheit**. Diese Unterscheidung ergänzt Thomas' und Hunts „Tote Programme lügen nicht“ und Ousterhouts „Fehler wegdefinieren“: Beide haben recht, aber in verschiedenen Domänen.

### Barrikaden

Eine der praktischsten Ideen des Buchs: Man definiert einen **Grenzbereich**, an dem alle externen Daten geprüft und bereinigt werden. Innerhalb der Barrikade darf der Code annehmen, dass die Daten sauber sind, und nutzt Assertions statt Fehlerbehandlung.

```java
// Barrikade: hier wird alles geprüft
@PostMapping("/transfers")
ResponseEntity<?> transfer(@RequestBody TransferRequest raw) {
    var cmd = TransferCommand.validated(raw);   // wirft bei ungültigen Daten 400
    service.execute(cmd);
    return ResponseEntity.accepted().build();
}

// hinter der Barrikade: nur noch Annahmen
class TransferService {
    void execute(TransferCommand cmd) {
        assert cmd.amount().isPositive();       // Programmierfehler, falls verletzt
        …
    }
}
```

Das ist im Kleinen, was Hexagonal Architecture und Evans' Anticorruption Layer im Großen tun.

### Offensives Programmieren

Während der Entwicklung sollen Fehler **möglichst laut** auffallen: Assertions abbrechen lassen, Speicher mit auffälligen Werten füllen, jeden unerwarteten `default`-Fall melden. In der Produktion entscheidet man bewusst, welche Prüfungen bleiben: wichtige Fehler behalten, triviale entfernen, Absturzinformationen protokollieren, Fehlermeldungen freundlich formulieren.

## Der Pseudocode-Prozess

McConnells eigene Methode, Routinen zu schreiben, das **Pseudocode Programming Process**:

1. Die Routine zuerst in natürlicher Sprache beschreiben, auf der Ebene der **Absicht**, nicht der Implementierung.
2. Den Pseudocode schrittweise verfeinern, bis es leicht ist, Code darunter zu schreiben.
3. Den Code unter jede Pseudocode-Zeile schreiben.
4. Die Pseudocode-Zeilen bleiben als Kommentare stehen.
5. Prüfen, testen, aufräumen.

```java
// Prüfe, ob der Kunde ein aktives Konto hat
if (!customer.hasActiveAccount()) throw new InactiveAccountException(customer.id());

// Berechne den Rabatt nach Treuestufe, höchstens 20 Prozent
var rate = Math.min(loyaltyPolicy.rateFor(customer.tier()), 0.20);

// Wende den Rabatt auf alle nicht reduzierten Positionen an
order.lines().stream().filter(l -> !l.isDiscounted()).forEach(l -> l.applyDiscount(rate));
```

McConnell betont, dass Pseudocode **keine** Syntax der Zielsprache enthalten soll. Er soll so formuliert sein, dass er auch als Kommentar taugt.

### Einordnung

Der Pseudocode-Prozess ist fast identisch mit Ousterhouts „Kommentare zuerst schreiben“, nur auf Implementierungsebene. Er steht in direktem Widerspruch zu Martin, der solche Kommentare durch Extraktion in benannte Methoden ersetzen würde. McConnell beschreibt TDD als Alternative und hält beide für vereinbar.

## Variablen (Teil III)

Vier Kapitel über ein scheinbar banales Thema. McConnell zeigt, dass viele Fehler an Variablen hängen: falsche Initialisierung, zu großer Gültigkeitsbereich, doppelte Bedeutung.

### Gültigkeitsbereich minimieren

McConnell führt zwei messbare Begriffe ein:

- **Span:** die Anzahl der Zeilen zwischen zwei Verwendungen einer Variablen
- **Live Time:** die Anzahl der Zeilen zwischen erster und letzter Verwendung

Beides soll klein sein. Variablen werden nah an ihrer ersten Verwendung deklariert und initialisiert, zusammengehörige Anweisungen werden gruppiert. Das ist im Kern Blochs Item 57 und Fowlers Slide Statements, mit einer Messgröße dahinter.

### Eine Variable, eine Bedeutung

- **Keine Wiederverwendung** einer Variablen für einen anderen Zweck, etwa `temp` erst für den Umfang, dann für die Fläche. Fowlers Split Variable.
- **Keine versteckten Bedeutungen:** Ein `int pageCount`, der bei `-1` „Fehler“ bedeutet, mischt zwei Konzepte. McConnell nennt das hybride Kopplung.
- **Alle deklarierten Variablen verwenden.**

## Die Macht der Namen

### Problemorientiert benennen

Ein Name soll das **Was** beschreiben, nicht das **Wie**: `employeeData` statt `inputRec`, `printerReady` statt `bitFlag`. Das entspricht der Fachsprache bei Evans und Martins Namen aus der Problemdomäne.

### Optimale Namenslänge

Wieder liefert McConnell Daten: Eine von ihm zitierte Studie fand, dass der Aufwand für das Debuggen am geringsten war, wenn Namen durchschnittlich **10 bis 16 Zeichen** lang waren. Namen mit 8 bis 20 Zeichen waren fast ebenso gut. Sehr kurze und sehr lange Namen schnitten schlechter ab.

| Zu kurz | Angemessen | Zu lang |
|---|---|---|
| `c`, `cnt` | `openTicketCount` | `numberOfAllTicketsThatAreStillOpenToday` |
| `d`, `dt` | `invoiceDueDate` | `theDateOnWhichTheInvoiceMustBePaid` |

Kurze Namen sind in Ordnung, wenn der Gültigkeitsbereich klein ist, etwa ein Schleifenindex `i` in einer kurzen Schleife.

### Konventionen für bestimmte Arten von Variablen

- **Qualifizierer ans Ende:** `revenueTotal`, `revenueAverage`, `revenueMax`. Der wichtige Teil steht vorne, und zusammengehörige Variablen stehen alphabetisch nebeneinander.
- **Gegensatzpaare konsistent:** `begin`/`end`, `first`/`last`, `min`/`max`, `source`/`target`.
- **Statusvariablen:** nie `flag` im Namen, sondern was sie bedeutet: `dataReady` statt `statusFlag`.
- **Boolesche Variablen:** typische Namen wie `done`, `error`, `found`, `success`. Positiv formulieren: `found` statt `notFound`, um doppelte Verneinungen zu vermeiden.
- **Temporäre Variablen** wie `temp` oder `x` fast immer durch sprechende Namen ersetzen.

### Namen, die man vermeiden sollte

Irreführende Abkürzungen, Namen mit ähnlicher Bedeutung im selben Gültigkeitsbereich, Namen, die sich nur durch ein Zeichen unterscheiden, Zahlen im Namen wie `file1`, `file2`, falsch geschriebene Wörter, Namen, die sich mit Bibliotheksnamen überschneiden, und schwer lesbare Zeichen wie `l` und `1`.

## Datentypen

Die Kapitel 12 und 13 behandeln Zahlen, Zeichenketten, Booleans, Enums, Konstanten, Arrays, Strukturen, Zeiger und globale Daten. Die wichtigsten Ratschläge:

- **Magische Zahlen vermeiden**, außer 0 und 1.
- **Ganzzahlüberlauf und Division im Blick behalten.**
- **Gleitkommazahlen nicht auf Gleichheit prüfen.** Für Geld Ganzzahlen in Cent oder Dezimaltypen.
- **Boolesche Variablen zur Dokumentation nutzen:** Eine komplizierte Bedingung in eine benannte Variable auslagern, etwa `boolean finished = …; boolean repeatedEntry = …;`.
- **Enums für Lesbarkeit und Typsicherheit.**
- **Globale Daten vermeiden**, und wenn nötig, über Zugriffsroutinen kapseln.

### Einordnung

Dieser Teil ist das Fundament, auf dem Martins Kapitel über Namen aufbaut, nur gründlicher und mit Messungen. Gerade die Namenskonventionen für Qualifizierer, Gegensatzpaare und Booleans sind im Alltag sehr nützlich und werden in den anderen Büchern kaum so konkret behandelt.

## Anweisungen und Kontrollfluss (Teil IV)

### Geradliniger Code

Wenn Anweisungen in einer bestimmten Reihenfolge stehen müssen, soll das **sichtbar** sein: durch Namen, Parameter oder Kommentare. Versteckte Reihenfolgeabhängigkeiten sind eine häufige Fehlerquelle. Wo die Reihenfolge egal ist, gruppiert man zusammengehörige Anweisungen.

```java
// versteckte Abhängigkeit: computeTotals braucht vorher geladene Daten
loadData();
computeTotals();

// sichtbar über Parameter und Rückgabewerte
var data = loadData();
var totals = computeTotals(data);
```

### Bedingungen

- **Den Normalfall zuerst** nach dem `if`, Sonderfälle im `else` oder als Guard Clause.
- Bei `switch` die Fälle nach Häufigkeit, Alphabet oder logischer Ordnung sortieren.
- Den `default`-Fall für echte Standardfälle nutzen oder Fehler melden, nicht für den letzten regulären Fall.

### Schleifen

- **Eine Aufgabe pro Schleife**, wie Fowlers Split Loop.
- Schleifen von oben betreten, Abbruch an einer klar erkennbaren Stelle.
- Den Schleifenkörper kurz halten, möglichst nicht länger als eine Bildschirmseite.
- **Verschachtelung auf drei Ebenen begrenzen.**
- Sprechende Schleifenvariablen, wenn die Schleife länger ist oder verschachtelt: `row`, `col` statt `i`, `j`.

### Ungewöhnliche Kontrollstrukturen

Mehrere `return`-Anweisungen sind in Ordnung, wenn sie die Lesbarkeit verbessern, etwa als Guard Clauses. Rekursion soll man auf Fälle beschränken, in denen sie wirklich einfacher ist, mit klarer Abbruchbedingung und Schutz gegen zu tiefe Rekursion. McConnell diskutiert auch `goto`, überwiegend ablehnend, aber mit seltenen Ausnahmen in Sprachen ohne strukturierte Fehlerbehandlung.

### Tabellengesteuerte Methoden

Eines der praktischsten Kapitel. Statt komplizierter Logik mit vielen `if`-Abfragen schlägt man das Ergebnis in einer Tabelle nach. McConnell nennt drei Arten: direkter Zugriff, indizierter Zugriff und stufenweiser Zugriff für Wertebereiche.

```java
// vorher: Bedingungskette
double rate(int age) {
    if (age < 18) return 0.05;
    else if (age < 30) return 0.07;
    else if (age < 50) return 0.10;
    else if (age < 65) return 0.15;
    else return 0.20;
}

// nachher: stufenweiser Zugriff über eine Tabelle
private static final NavigableMap<Integer, Double> RATES = new TreeMap<>(Map.of(
    0, 0.05, 18, 0.07, 30, 0.10, 50, 0.15, 65, 0.20));

double rate(int age) { return RATES.floorEntry(age).getValue(); }
```

Vorteile: Die Regeln stehen als Daten an einer Stelle, lassen sich leicht ändern oder aus einer Konfiguration laden, und der Code bleibt kurz. In Java helfen dafür `Map`, `EnumMap` und `NavigableMap`.

### Allgemeine Fragen zum Kontrollfluss

- **Boolesche Ausdrücke vereinfachen:** in benannte Variablen oder Methoden auslagern, De Morgans Regeln nutzen, positiv formulieren.
- **Tiefe Verschachtelung vermeiden:** Guard Clauses, Auslagern in Routinen, `switch` oder Tabellen.
- **Strukturierte Programmierung:** Sequenz, Auswahl und Wiederholung reichen für jede Logik.

### Komplexität messen

McConnell gibt eine einfache Variante von McCabes zyklomatischer Komplexität: Man beginnt mit 1 für den geraden Pfad und zählt jedes `if`, `while`, `for`, `&&`, `||` und jeden `case` hinzu.

| Wert | Empfehlung |
|---|---|
| 0–5 | in Ordnung |
| 6–10 | über Vereinfachung nachdenken |
| über 10 | einen Teil in eine eigene Routine auslagern |

Das ist eine der wenigen Stellen in dieser Buchreihe, an denen eine konkrete Zahl zur Zerlegung von Routinen genannt wird, und sie misst nicht Zeilen, sondern Entscheidungen. Werkzeuge wie SonarQube und Checkstyle prüfen diese Grenze heute automatisch.

## Qualität (Teil V)

### Die Qualitätslandschaft

McConnell unterscheidet **externe** Qualitätsmerkmale, die Nutzer bemerken, etwa Korrektheit, Zuverlässigkeit, Benutzbarkeit und Effizienz, und **interne**, die Entwickler betreffen, etwa Wartbarkeit, Lesbarkeit, Testbarkeit und Portabilität. Zwischen ihnen gibt es Zielkonflikte: Effizienz kann Lesbarkeit kosten, Robustheit kann Korrektheit kosten.

Der wichtigste Befund dieses Kapitels: **Keine einzelne Technik findet die meisten Fehler.** McConnell zitiert Daten von Capers Jones zur typischen Fehlerfindungsrate verschiedener Techniken.

{{< bild src="bild-1.png" alt="Ungefähre typische Werte nach Capers Jones, zitiert in McConnell, Kapitel 20 · aus dem Gedächtnis wiedergegeben, im Original prüfen" >}}

Ungefähre typische Werte nach Capers Jones, zitiert in McConnell, Kapitel 20 · aus dem Gedächtnis wiedergegeben, im Original prüfen

Drei Schlüsse zieht McConnell daraus:

- **Tests allein reichen nicht.** Die einzelnen Teststufen finden jeweils nur einen kleineren Teil der Fehler.
- **Reviews und Inspektionen gehören dazu.** Sie sind oft wirksamer als Tests und finden andere Arten von Fehlern.
- **Kombination ist entscheidend.** Erst mehrere Techniken zusammen erreichen hohe Fehlerfindungsraten, McConnell nennt für gut kombinierte Verfahren Werte deutlich über 90 Prozent.

Dazu kommt sein **Grundsatz der Softwarequalität:** Höhere Qualität senkt die Entwicklungskosten, weil Fehlerbehebung und Nacharbeit den größten Teil der Zeit verschlingen. Qualität ist also kein Luxus, sondern spart Zeit.

### Gemeinsame Konstruktion

McConnell vergleicht verschiedene Formen, wie Entwickler gemeinsam Fehler finden:

| Form | Merkmale |
|---|---|
| Pair Programming | ständiges Review in Echtzeit, Wissensaustausch |
| Formale Inspektion nach Fagan | feste Rollen wie Moderator, Autor und Leser, Checklisten, Vorbereitung, Protokoll |
| Walkthrough | Autor führt durch den Code, weniger formal |
| Code-Reading | Reviewer lesen unabhängig, dann kurzes Treffen |
| Dog-and-Pony-Show | Präsentation für Management, findet kaum Fehler |

Formale Inspektionen schneiden in den Daten besonders gut ab. Moderne Pull-Request-Reviews liegen zwischen Code-Reading und Walkthrough.

### Entwicklertests

- Tests **vor oder parallel** zum Code schreiben, McConnell sieht Test-first als sinnvoll.
- **Strukturierte Basistests:** mindestens einen Test pro Pfad durch die Routine, also so viele wie die zyklomatische Komplexität.
- **Grenzwertanalyse** und Äquivalenzklassen.
- **Datenflusstests:** prüfen, ob Variablen korrekt definiert und verwendet werden.
- **Fehlerraten nach Ort:** Fehler häufen sich in wenigen Routinen. Wer diese findet und neu schreibt, gewinnt viel.
- **Saubere Testdaten schlägt viele Testdaten.**

### Debugging

McConnell beschreibt Debugging als wissenschaftliche Methode: Daten sammeln, Hypothese bilden, Experiment entwerfen, Hypothese prüfen, wiederholen. Dazu Techniken wie das Eingrenzen des verdächtigen Codes, das Erklären gegenüber anderen und Pausen, wenn man feststeckt. Fehler zu beheben heißt, die **Ursache** zu verstehen, nicht das Symptom wegzudrücken. Und jeder behobene Fehler bekommt einen Test.

## Refactoring

McConnell übernimmt in der zweiten Auflage Fowlers Begriff und Katalog weitgehend, ergänzt aber zwei eigene Akzente.

### Software-Evolution

Der Grundsatz: **Jede Änderung soll den Code verbessern.** Software entwickelt sich ohnehin weiter; die Frage ist nur, ob sie dabei besser oder schlechter wird. Das ist Thomas' und Hunts zerbrochene Fenster und Martins Pfadfinderregel.

### Sicher refaktorieren

McConnells Regeln entsprechen weitgehend Fowler: Ausgangscode sichern, kleine Schritte, einen Schritt nach dem anderen, Liste der Schritte führen, Tests nach jedem Schritt, Refactoring und Funktionsänderung trennen. Er fügt hinzu:

- **Refactorings unterschiedlich riskant behandeln.** Ein Umbenennen ist harmlos, eine Änderung der Klassenstruktur nicht. Bei riskanten Schritten Code-Reviews einplanen.
- **Keine großen Umbauten als Refactoring tarnen.** Wenn ein „Refactoring“ Tage dauert, ist es ein Umbau und braucht Planung.

### Strategien: wo anfangen?

Ein Beitrag, der bei Fowler fehlt: Wo lohnt sich Refactoring am meisten?

- Wenn man eine Routine hinzufügt, die Umgebung verbessern.
- Wenn man einen Fehler behebt, das Verständnis nutzen, um den Code zu verbessern.
- **Fehleranfällige Module** gezielt angehen. Weil sich Fehler in wenigen Modulen häufen, bringt dort jeder Umbau am meisten.
- **Module mit hoher Komplexität** angehen.
- In Wartungsprojekten die Teile verbessern, die man ohnehin anfasst.
- **Eine Grenze zwischen sauberem und unsauberem Code ziehen.** Code, der die Grenze überquert, wird dabei aufgeräumt. So wächst die saubere Zone schrittweise. Das ist Feathers' Strategie, Inseln getesteten Codes zu schaffen.

## Code-Tuning

McConnell widmet der Performance zwei Kapitel und ist dabei vorsichtiger und datenreicher als alle anderen Autoren dieser Reihe.

### Strategie zuerst

Code-Tuning ist nur ein Weg zu besserer Performance, und meist nicht der beste. Vorher kommen Anforderungen, Design, Klassen- und Routinendesign, Interaktion mit dem Betriebssystem, Compiler und Hardware. Oft ist eine bessere Architektur oder ein besserer Algorithmus wirksamer als jede Mikrooptimierung.

### Das Pareto-Prinzip

Ein kleiner Teil des Codes verbraucht den Großteil der Laufzeit. McConnell zitiert Knuths Befund, dass in untersuchten Programmen ein Bruchteil des Codes für mehr als die Hälfte der Laufzeit verantwortlich war. Also: **messen, um die heißen Stellen zu finden.**

### Mythen

McConnell widerlegt verbreitete Annahmen:

- **Weniger Zeilen sind schneller.** Oft falsch: Eine ausgerollte Schleife hat mehr Zeilen, kann aber schneller sein.
- **Bestimmte Operationen sind immer schneller als andere.** Falsch: Das hängt von Sprache, Compiler und Hardware ab und ändert sich mit jeder Version.
- **Man sollte unterwegs optimieren.** Falsch: Vor dem Messen weiß man nicht, wo es sich lohnt.
- **Ein schnelles Programm ist genauso wichtig wie ein korrektes.** Falsch: Ein falsches Programm ist auch schnell nutzlos.

### Techniken

| Bereich | Beispiele |
|---|---|
| Logik | aufhören zu prüfen, wenn das Ergebnis feststeht; häufigste Fälle zuerst prüfen; Tabellen statt Bedingungen; Lazy Evaluation |
| Schleifen | Bedingungen aus der Schleife ziehen; Schleifen zusammenlegen; Arbeit innerhalb minimieren; Sentinel-Werte; die aktivste Schleife nach innen |
| Daten | Ganzzahlen statt Gleitkomma; weniger Array-Dimensionen; Ergebnisse zwischenspeichern; Indizes ergänzen |
| Ausdrücke | algebraische Vereinfachung; teure durch billige Operationen ersetzen; Konstanten vorberechnen |
| Routinen | Inlining |
| Notfalls | in einer maschinennäheren Sprache neu schreiben |

Der wichtigste Satz: Jede Technik wurde in McConnells Messungen in **einigen** Sprachen und Compilern schneller, in anderen langsamer oder gar nicht. Deshalb gilt für jede Optimierung: vorher messen, nachher messen, Ergebnis nicht verallgemeinern.

### Einordnung

Für Java ist das besonders aktuell: Der JIT-Compiler nimmt viele dieser Optimierungen selbst vor, etwa Inlining oder das Herausziehen von Schleifeninvarianten. Manuelles Tuning kann ihm sogar im Weg stehen. Werkzeuge wie JMH für Microbenchmarks und Profiler wie async-profiler oder JFR sind der moderne Weg, McConnells Rat umzusetzen.

## Systemaspekte (Teil VI)

### Wie Programmgröße die Konstruktion beeinflusst

Ein Kapitel, das in den anderen Büchern dieser Reihe fehlt: Was sich ändert, wenn Projekte wachsen.

- **Kommunikation:** Bei n Personen gibt es n × (n − 1) / 2 mögliche Kommunikationswege. Bei zwei Personen ist es einer, bei zehn schon 45, bei fünfzig über 1200. Das ist die Mathematik hinter Brooks' Gesetz.
- **Fehler:** Die Fehlerdichte steigt mit der Projektgröße, weil mehr Schnittstellen, mehr Kommunikation und mehr Annahmen zusammenkommen.
- **Produktivität:** Die Produktivität pro Person sinkt mit wachsender Projektgröße.
- **Tätigkeitsmix:** Bei kleinen Projekten dominiert die Konstruktion. Bei großen wächst der Anteil von Architektur, Integration, Systemtest und Koordination stark.

Daraus folgt: **Methoden müssen mit der Größe skalieren.** Was für ein Team von drei Personen funktioniert, reicht für fünfzig nicht, und umgekehrt ist der Formalismus eines Großprojekts für ein kleines Team Verschwendung. Das ergänzt Evans' Bounded Contexts und *Team Topologies*: Große Systeme in kleine, unabhängige Einheiten zu zerlegen ist auch ein Mittel gegen die Kosten der Größe.

### Konstruktion managen

McConnell schreibt hier für Teamleiter:

- **Gute Praktiken fördern, nicht erzwingen:** Standards gemeinsam festlegen, Reviews, Mentoring, gute Beispiele sichtbar machen.
- **Konfigurationsmanagement:** Versionskontrolle, Build-Verwaltung, kontrollierte Änderungen an Anforderungen und Design.
- **Schätzen und Messen:** Schätzungen auf Daten stützen, Fortschritt messen, aber Messungen nicht als Waffe einsetzen.
- **Programmierer als Menschen behandeln:** McConnell zitiert Studien, nach denen Entwickler einen großen Teil ihrer Zeit mit anderem als Programmieren verbringen, und nach denen die Unterschiede zwischen Entwicklern bei Produktivität und Qualität sehr groß sind, oft ein Faktor von zehn.
- **„Religiöse“ Fragen nicht per Dekret entscheiden:** Einrückung, Klammerstil, Editor. Lieber Richtlinien und Werkzeuge, die den Stil automatisch angleichen.
- **Arbeitsumgebung:** ruhige Arbeitsplätze und wenig Unterbrechungen erhöhen nachweislich die Produktivität.

### Integration

Wie man Teile zusammenfügt, beeinflusst Qualität und Planbarkeit. McConnell unterscheidet:

- **Phasenweise Integration**, auch „Big Bang“: alles am Ende zusammenstecken. Fehler lassen sich dann kaum lokalisieren.
- **Inkrementelle Integration:** Stück für Stück. Varianten sind Top-down, Bottom-up, Sandwich, risikoorientiert, featureorientiert und T-förmig, bei der zuerst ein schmaler, vollständiger Durchstich entsteht.

Die T-förmige Integration ist im Kern Thomas' und Hunts Tracer Bullet.

Dazu empfiehlt McConnell den **täglichen Build mit Smoke Test**: Jeden Tag wird das ganze System gebaut und ein grundlegender Test läuft durch. Wer den Build bricht, behebt ihn sofort. Das ist der direkte Vorläufer der Continuous Integration, die heute bei jedem Commit statt einmal täglich läuft.

### Werkzeuge

Ein Überblick über Entwurfswerkzeuge, Editoren und IDEs, Analysewerkzeuge, Refactoring-Werkzeuge, Versionskontrolle, Build-Systeme, Testwerkzeuge und Debugger. Die konkreten Werkzeuge von 2004 sind weitgehend veraltet, die Botschaft nicht: Gute Werkzeuge erhöhen die Produktivität deutlich, und Teams sollen gezielt in sie investieren, bis hin zu eigenen Werkzeugen für wiederkehrende Aufgaben.

## Software-Handwerk (Teil VII)

### Layout und Stil

McConnells **Grundsatz der Formatierung:** Gutes visuelles Layout zeigt die logische Struktur des Programms. Schönheit ist zweitrangig; entscheidend ist, dass Einrückung, Leerzeilen und Gruppierung zeigen, was zusammengehört. Er zitiert Studien, nach denen eine Einrückung von zwei bis vier Leerzeichen das Verständnis am besten unterstützte, tiefere Einrückung dagegen schlechter abschnitt.

Die vielen Detailregeln zu Klammerstil, Zeilenumbruch und Ausrichtung sind heute durch automatische Formatierer weitgehend erledigt. Bleibend ist die Idee, dass Layout Logik sichtbar macht und nicht verschleiern darf.

### Selbstdokumentierender Code

Die wichtigste Dokumentation ist der Code selbst: gute Struktur, gute Namen, klare Abläufe. Kommentare kommen ergänzend dazu. McConnell unterscheidet sechs Arten von Kommentaren:

| Art | Bewertung |
|---|---|
| Wiederholung des Codes | wertlos |
| Erklärung schwierigen Codes | Hinweis, dass der Code verbessert werden sollte |
| Markierung, etwa TODO | vorübergehend nützlich, nicht im fertigen Code |
| Zusammenfassung eines Abschnitts | nützlich |
| Beschreibung der Absicht | sehr nützlich |
| Information, die der Code nicht ausdrücken kann | sehr nützlich, etwa Urheberrecht, Begründungen, Verweise |

Damit steht McConnell genau zwischen Martin und Ousterhout: Kommentare, die Code wiederholen oder erklären, sind ein Zeichen schlechten Codes, Kommentare zu Absicht und Zusammenhang sind wertvoll. Er zitiert eine IBM-Untersuchung, nach der die Verständlichkeit bei etwa einem Kommentar pro zehn Anweisungen am höchsten war, weist aber darauf hin, dass die Dichte weniger wichtig ist als die Art der Kommentare.

### Persönlicher Charakter

Ein ungewöhnliches Kapitel: Welche Eigenschaften machen gute Entwickler aus? McConnells Antwort ist überraschend wenig technisch.

- **Intelligenz ist weniger wichtig als gedacht.** McConnell zitiert Dijkstras Essay über den „bescheidenen Programmierer“: Wer die Grenzen des eigenen Kopfes kennt, schreibt einfacheren Code.
- **Neugier:** auf Technik, auf die Domäne, auf Methoden. Bücher lesen, Konferenzen, Experimente.
- **Intellektuelle Ehrlichkeit:** Zugeben, wenn man etwas nicht weiß, Fehler eingestehen, realistische Schätzungen geben, auch wenn sie unbequem sind.
- **Kommunikation und Zusammenarbeit.**
- **Kreativität und Disziplin** im Gleichgewicht.
- **Die richtige Faulheit:** lästige Aufgaben automatisieren, statt sie zu wiederholen.
- **Gewohnheiten:** Gute Gewohnheiten früh entwickeln, weil sie schwer zu ändern sind.

Weniger wichtig als oft angenommen sind laut McConnell bloße Ausdauer, reine Erfahrung ohne Lernen und „Gurutum“.

### Leitthemen des Handwerks

Das vorletzte Kapitel fasst das Buch in einigen Grundsätzen zusammen:

1. **Komplexität beherrschen**, das primäre Gebot.
2. **Den Prozess bewusst wählen** und an das Projekt anpassen.
3. **Für Menschen schreiben, erst dann für Computer.**
4. **In eine Sprache programmieren**, nicht in ihr.
5. **Konventionen nutzen**, um geistige Kapazität für Wichtiges frei zu halten.
6. **In Begriffen der Problemdomäne programmieren.**
7. **Auf fallende Steine achten:** Warnsignale wie viele Fehler in einer Klasse, unerklärliche Kompilierwarnungen oder Unbehagen bei bestimmten Codeteilen ernst nehmen.
8. **Iterieren**, in Anforderungen, Design, Code und Tests.
9. **Software und Religion trennen:** keine Methode als Dogma, sondern eklektisch und experimentell vorgehen.

Der letzte Punkt ist McConnells eigentliche Botschaft und eine stille Kritik an jedem Buch, das eine einzige richtige Art zu programmieren verkündet.

## Kritik und Einordnung

Code Complete ist das umfassendste Buch dieser Reihe und das einzige, das konsequent nach Belegen fragt. Es ist zugleich das am wenigsten aufregende: Es verkündet keine neue Idee, sondern sammelt, ordnet und prüft.

### Stärken

- **Empirie:** McConnell belegt, wo es geht, und sagt, wo es nicht geht. In einer Branche voller Meinungen ist das selten.
- **Ausgewogenheit:** Fast überall stellt er Abwägungen dar statt Regeln: Robustheit gegen Korrektheit, Länge gegen Komplexität, Vorabdesign gegen Iteration.
- **Vollständigkeit:** Von Variablennamen bis Integration, von Schleifen bis Teamorganisation.
- **Checklisten:** sofort im Alltag und in Reviews verwendbar.
- **Sprachneutral:** Prinzipien statt Syntax, deshalb weniger gealtert als ein Sprachbuch.

### Kritikpunkte

**1. Umfang.** Rund 900 Seiten. Viele Leser lesen es nie ganz, sondern nutzen es als Nachschlagewerk.

**2. Alter der Studien.** Die meisten zitierten Untersuchungen stammen aus den 1970er bis frühen 1990er Jahren, mit Sprachen wie Fortran, Cobol, C und Pascal, oft mit kleinen Stichproben und in Organisationen wie IBM oder der NASA. Ob die Befunde zu Routinenlänge, Namenslänge oder Kommentardichte auf heutiges Java mit IDEs, Typsystemen und automatisierten Tests übertragbar sind, ist offen. Einige oft zitierte Zahlen, etwa zur Kostensteigerung von Fehlern über die Phasen, gelten heute als methodisch umstritten. Laurent Bossavit hat in *The Leprechauns of Software Engineering* gezeigt, wie dünn die Datenbasis mancher dieser Branchenweisheiten ist.

**3. Wasserfall-Prägung.** Trotz Überarbeitung spürt man die Herkunft aus einer Zeit sequenzieller Prozesse, etwa in der starken Betonung von Voraussetzungen vor der Konstruktion. McConnell differenziert zwar zwischen iterativen und sequenziellen Projekten, aber agile Leser finden manches schwerfällig.

**4. Veraltete Details.** Die Kapitel zu Layout, Werkzeugen und Code-Tuning sind am stärksten gealtert. Formatierer, moderne IDEs und JIT-Compiler haben viele Ratschläge überflüssig gemacht.

**5. Keine Neuauflage seit 2004.** Funktionale Programmierung, Cloud, verteilte Systeme, Microservices, DevOps und moderne Testpraktiken fehlen weitgehend.

**6. Wenig Haltung, wenig These.** Wer eine klare Designphilosophie sucht, findet sie eher bei Ousterhout oder Evans. Code Complete ist ein Kompendium, keine Streitschrift.

### Gesamturteil

Code Complete ist das Buch, das man als Gegengewicht zu allen anderen dieser Reihe lesen sollte. Wo Martin, Ousterhout oder Fowler aus Erfahrung argumentieren, fragt McConnell nach Belegen, und oft zeigen die Daten ein differenzierteres Bild als die Regeln. Dass auch diese Daten alt und teils dünn sind, ist kein Argument gegen das Buch, sondern eines für mehr Forschung, wie sie etwa *Accelerate* später für Lieferpraktiken geliefert hat.

## Verhältnis zu den anderen Büchern

Code Complete ist der Prüfstein der Reihe. An vielen Streitfragen zwischen den anderen Autoren bringt McConnell Daten ins Spiel, und meist liegen diese zwischen den Extrempositionen.

| Streitfrage | Positionen der anderen | McConnell |
|---|---|---|
| Routinenlänge | Martin: 2–4 Zeilen; Ousterhout: Länge egal, Tiefe zählt; Fowler: Abstand Absicht–Implementierung | Studien zeigen keinen Vorteil sehr kurzer Routinen; Vorsicht ab etwa 200 Zeilen; Komplexität wichtiger als Länge |
| Kommentare | Martin: meist Versagen; Ousterhout und Bloch: unverzichtbar | Wiederholende und erklärende Kommentare sind schlecht, Absicht und Zusammenhang wertvoll |
| Kommentar zuerst | Ousterhout: Schnittstellenkommentar zuerst | Pseudocode-Prozess: Absicht als Pseudocode zuerst |
| Fehlerbehandlung | Thomas und Hunt: früh abstürzen; Ousterhout: Fehler wegdefinieren | Robustheit oder Korrektheit je nach Domäne |
| Tests | Martin: TDD Pflicht; Ousterhout skeptisch; Thomas und Hunt differenziert | Tests allein finden zu wenig, Reviews und Inspektionen gehören dazu |
| Vorabdesign | Fowler: evolutionär; Evans: im Dialog; Ousterhout: Design it twice | so viel, bis die restlichen Entscheidungen offensichtlich sind, abhängig von Projektgröße und Risiko |
| Komplexität | Ousterhout: Kernproblem; Thomas und Hunt: ETC | „Primäres technisches Gebot“, schon 2004 |
| Namen | Martin: aussagekräftig; Ousterhout: präzise | messbar optimale Länge, konkrete Konventionen |
| Performance | Fowler und Bloch: erst richtig, dann messen | ausführlich begründet, mit eigenen Messungen |

### Was nur dieses Buch hat

- **Empirische Belege** zu fast jedem Thema
- **Checklisten** für den Alltag
- **Projektgröße** als Einflussfaktor auf Methoden
- **Reviews und Inspektionen** als gleichrangig mit Tests
- **Persönlicher Charakter** als Teil des Handwerks

## Diskussionsfragen

1. **Routinenlänge:** Ändern McConnells Daten etwas an deiner Haltung zu Martin gegen Ousterhout? Oder sind Studien aus den 80ern auf heutiges Java nicht übertragbar?
2. **Reviews:** Formale Inspektionen schneiden in den Daten sehr gut ab. Haben Pull-Request-Reviews, wie sie heute üblich sind, denselben Effekt oder eher den von informellen Reviews?
3. **Robustheit oder Korrektheit:** Welche Strategie verfolgt ihr in euren Anwendungen, und ist das eine bewusste Entscheidung?
4. **Pseudocode-Prozess:** Hast du je so gearbeitet? Ist es mit TDD vereinbar oder ein Gegenmodell?
5. **Zyklomatische Komplexität:** Nutzt ihr Grenzwerte in statischer Analyse? Hilft das oder erzeugt es nur Umgehungen?
6. **Tabellengesteuerte Methoden:** Wo würde das in deinem Code Bedingungsketten ersetzen?
7. **Belege:** Wie viel Gewicht gibst du Studien gegenüber eigener Erfahrung, wenn sie sich widersprechen?
8. **Neuauflage:** Was müsste eine dritte Auflage enthalten, und was könnte gestrichen werden?

{{< anmerkung >}}
Zum Schaubild („aus dem Gedächtnis wiedergegeben, im Original prüfen“): Alle 13 Werte stimmen mit den typischen Werten (*modal rates*) der Tabelle 20-2 „Defect-Detection Rates“ der 2. Auflage überein – geprüft an einer Abschrift der Tabelle, das Buch selbst lag mir nicht vor. Dort stehen zu jeder Technik auch die Spannen, etwa Unit-Test 15 bis 50 %, formale Code-Inspektion 45 bis 70 %.
{{< /anmerkung >}}
