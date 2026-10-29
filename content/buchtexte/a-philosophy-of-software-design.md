+++
title = "A Philosophy of Software Design – Zusammenfassung und Einordnung"
description = "John Ousterhout, A Philosophy of Software Design (2018, 2. Auflage 2021)"
date = 2026-10-29T14:43:02+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["a-philosophy-of-software-design-2021"]
+++

## Einleitung: Komplexität als Kernproblem

Die Kernthese: Die wichtigste Aufgabe beim Softwaredesign ist, Komplexität zu beherrschen, also Systeme so zu zerlegen, dass man an einem Teil arbeiten kann, ohne das Ganze verstehen zu müssen.

John Ousterhout ist Informatikprofessor in Stanford. Bekannt ist er als Erfinder der Skriptsprache Tcl und des GUI-Toolkits Tk, durch das Log-Structured File System und als Mitautor des Konsensalgorithmus Raft. Das Buch entstand aus seinem Kurs CS 190, in dem Studierende über ein Quartal ein mittelgroßes System bauen, Code-Reviews bekommen und es dann überarbeiten. Die Beispiele stammen deshalb oft aus studentischen Projekten, etwa einem Texteditor oder einem HTTP-Server, und sind meist in Java oder C++.

Das Buch ist mit rund 190 Seiten deutlich kürzer als Clean Code. Die zweite Auflage von 2021 ergänzt unter anderem eine explizite Auseinandersetzung mit Clean Code und ein Kapitel darüber, was beim Design wirklich zählt.

### Was ist Komplexität?

Ousterhout definiert Komplexität praktisch: alles an der Struktur eines Systems, was es schwer verständlich und schwer änderbar macht. Ein großes System kann einfach sein, ein kleines komplex. Entscheidend ist, wie oft man sich mit einem Teil beschäftigen muss: Komplexität in Code, den nie jemand anfasst, zählt kaum.

### Drei Symptome

| Symptom | Bedeutung | Beispiel |
|---|---|---|
| Change Amplification | Eine einfache Änderung erfordert Eingriffe an vielen Stellen. | Eine Hintergrundfarbe ist auf 50 Webseiten einzeln gesetzt. |
| Cognitive Load | Man muss viel wissen, um eine Aufgabe zu erledigen. | Eine API, bei der der Aufrufer selbst Speicher freigeben muss. |
| Unknown Unknowns | Unklar ist schon, *welcher* Code angepasst werden muss. | Eine Änderung bricht eine Stelle, von deren Abhängigkeit niemand wusste. |

Das dritte Symptom hält Ousterhout für das schlimmste. Weniger Code ist übrigens nicht automatisch einfacher: Eine längere Lösung kann weniger kognitive Last erzeugen.

### Zwei Ursachen

- **Abhängigkeiten:** Code lässt sich nicht isoliert verstehen oder ändern. Abhängigkeiten sind unvermeidlich, aber man kann ihre Zahl verringern und sie offensichtlich machen.
- **Unklarheit (Obscurity):** Wichtige Informationen sind nicht offensichtlich, etwa ein zu allgemeiner Variablenname oder eine undokumentierte Annahme.

### Komplexität wächst schleichend

Keine einzelne Abhängigkeit macht ein System komplex. Komplexität entsteht aus Hunderten kleiner Entscheidungen, von denen jede für sich vertretbar wirkte. Deshalb braucht es nach Ousterhout eine Haltung, die jede einzelne Entscheidung ernst nimmt. Das führt direkt zum nächsten Kapitel.

## Strategisches statt taktisches Programmieren

Funktionierender Code reicht nicht. Das eigentliche Ziel ist ein gutes Design, und funktionierender Code ist ein Nebenprodukt davon.

**Taktisch** programmiert, wer jede Aufgabe so schnell wie möglich erledigen will: ein Feature, ein Bugfix, fertig. Jede Abkürzung fügt ein wenig Komplexität hinzu. Weil der Effekt einzeln klein ist, fällt er nicht auf, bis das System schwer zu ändern ist.

Ousterhout beschreibt den **taktischen Tornado**: einen Entwickler, der Features schneller liefert als alle anderen und vom Management dafür gelobt wird, aber eine Spur von Chaos hinterlässt, die andere später aufräumen müssen.

**Strategisch** programmiert, wer jede Änderung auch als Gelegenheit sieht, das Design zu verbessern. Konkret:

- etwas Zeit investieren, um für jede neue Klasse ein sauberes Design zu finden
- kleine Designprobleme sofort beheben, statt sie liegen zu lassen
- Dokumentation schreiben, solange man den Kontext noch im Kopf hat

Ousterhouts Faustregel: etwa **10 bis 20 Prozent** der Entwicklungszeit in Design investieren. Anfangs bremst das ein wenig, nach einigen Monaten zahlt es sich aus, weil die Entwicklung schneller wird statt langsamer.

### Startups und Technical Debt

Ousterhout greift den Einwand auf, Startups müssten schnell sein und könnten später aufräumen. Seine Antwort: Später kommt selten, und ein schlecht strukturierter Code vertreibt gute Entwickler. Er stellt Facebooks frühes Motto „Move fast and break things“ gegen Google und VMware, die bewusst auf Codequalität setzten. Facebook selbst habe das Motto später entschärft.

### Einordnung

Die Unterscheidung ist eine der einflussreichsten Ideen des Buchs und deckt sich mit dem, was Martin mit der Pfadfinderregel meint. Der Unterschied liegt im Ton: Martin argumentiert mit Professionalität und Disziplin, Ousterhout mit Ökonomie. Die 10–20-Prozent-Regel ist eine Erfahrungszahl, keine gemessene Größe. Kritiker weisen darauf hin, dass in frühen Produktphasen die Unsicherheit über Anforderungen so groß ist, dass Investitionen in Design auch verschwendet sein können.

## Tiefe Module

Die besten Module bieten eine einfache Schnittstelle und verbergen dahinter viel Funktionalität. Das ist das zentrale Konzept des Buchs und der direkte Gegenentwurf zu Martins „klein, und dann noch kleiner“.

### Schnittstelle als Kosten, Funktionalität als Nutzen

Ein Modul ist für Ousterhout alles mit Schnittstelle und Implementierung: eine Klasse, ein Paket, ein Dienst, auch eine einzelne Methode. Die Schnittstelle ist das, was ein Nutzer wissen muss, einschließlich informeller Dinge wie Nebenwirkungen und Aufrufreihenfolge. Sie ist der **Preis** des Moduls. Die Funktionalität ist der **Nutzen**.

Ousterhout stellt Module als Rechteck dar: Die obere Kante ist die Schnittstelle, die Höhe die Funktionalität. Ein tiefes Modul ist schmal und hoch, ein flaches breit und niedrig.

### Paradebeispiel: Unix-Datei-I/O

Unix bietet im Kern fünf Systemaufrufe für Dateien: öffnen, lesen, schreiben, positionieren, schließen. Dahinter verbergen sich Verzeichnisstrukturen, Rechte, Caching, Plattenverwaltung, Gerätetreiber und Nebenläufigkeit. Die Implementierung hat sich über Jahrzehnte grundlegend verändert, die Schnittstelle kaum.

### Gegenbeispiel: Java-I/O

Um in Java effizient Objekte aus einer Datei zu lesen, muss man drei Klassen ineinanderstecken. Vergisst man die Pufferung, funktioniert alles, nur sehr langsam. Ousterhouts Kritik: Pufferung wünscht sich fast jeder, also sollte sie der Standard sein. Wer sie nicht will, kann sie abschalten. Ein eigenes Beispiel im Stil seiner Kritik:

```java
// Flach: Der Aufrufer muss wissen, welche Schichten in welcher Reihenfolge nötig sind.
try (var in = new ObjectInputStream(
        new BufferedInputStream(
            new FileInputStream(path)))) {
    Config config = (Config) in.readObject();
}

// Tief: Eine Methode, sinnvolle Standards eingebaut.
Config config = ConfigStore.load(path);
```

Die zweite Variante verbirgt Pufferung, Formatwahl und Fehlerbehandlung. Ändert sich das Format von Java-Serialisierung zu JSON, bleibt der Aufrufer unverändert.

### Ein flaches Modul

```java
// Die Schnittstelle ist genauso komplex wie die Implementierung.
private void addNullValueForAttribute(String attribute) {
    data.put(attribute, null);
}
```

Der Aufrufer spart nichts: Er muss die Methode kennen, und dafür hätte er die eine Zeile auch direkt schreiben können. Solche Methoden fügen eine Schnittstelle hinzu, ohne Komplexität zu verbergen.

### Classitis

Ousterhout nennt die Überzeugung, Klassen sollten möglichst klein sein, **Classitis**. Jede Klasse für sich mag einfach sein, aber das System wird durch die Vielzahl der Schnittstellen komplexer. Die Zahl der Bausteine, die man kennen muss, steigt, und der Code wird geschwätzig.

### Einordnung

Das Konzept hat stark gewirkt, weil es eine Frage beantwortet, die Clean Code offenlässt: Wann ist Zerlegen sinnvoll? Antwort: wenn dabei Tiefe entsteht. Kritiker sagen, „tief“ sei genauso schwer zu messen wie Martins „eine Verantwortung“. Außerdem kann ein tiefes Modul mit eingebauten Standards zu viel entscheiden und dann schwer anpassbar sein. Die Java-I/O-Komposition ist bewusst flexibel, und manche halten das für die bessere Wahl bei einer Standardbibliothek.

## Information Hiding und Information Leakage

Der wichtigste Weg zu tiefen Modulen ist Information Hiding: Jedes Modul kapselt Wissen über Designentscheidungen, das in der Schnittstelle nicht auftaucht. Das Konzept geht auf David Parnas (1972) zurück.

Verborgen werden können Datenstrukturen, Algorithmen, Dateiformate, Protokolldetails oder Annahmen über die Umgebung. Wichtig: `private` allein ist kein Information Hiding. Ein privates Feld mit öffentlichem Getter und Setter legt die Entscheidung genauso offen wie ein öffentliches Feld.

### Leakage

Das Gegenteil ist **Information Leakage**: Dieselbe Designentscheidung steckt in mehreren Modulen. Ändert sie sich, müssen alle angepasst werden. Das typische Beispiel: Zwei Klassen kennen beide das Format einer Datei, eine liest, eine schreibt. Lösung: beide zusammenlegen oder das Formatwissen in eine eigene Klasse verschieben.

Leakage kann auch versteckt sein: zwei Klassen, die keine gemeinsame Schnittstelle haben, aber stillschweigend dieselbe Annahme treffen.

### Zeitliche Zerlegung

Eine häufige Ursache für Leakage ist **Temporal Decomposition**: Man strukturiert Code nach der Reihenfolge, in der Dinge passieren. Etwa eine Klasse fürs Einlesen, eine fürs Ändern, eine fürs Zurückschreiben. Das Wissen über das Dateiformat landet dann in mehreren davon. Besser strukturiert man nach Wissen, das zusammengehört, nicht nach Ablauf.

### Beispiel aus dem Kurs: HTTP-Server

Studierende bauten Klassen, die eine HTTP-Anfrage in zwei Schritten verarbeiteten: Eine las die Anfrage vom Socket in einen String, eine zweite parste ihn. Beide mussten das HTTP-Format kennen, etwa um das Ende der Anfrage zu erkennen. Besser ist eine Klasse, die beides erledigt.

Ein zweites Beispiel: Viele Gruppen gaben die Parameter der Anfrage als Map nach außen. Ousterhout zieht eine Methode wie `getParameter("name")` vor, die das Format verbirgt und auch gleich gängige Fälle wie Umwandlung in Zahlen anbietet.

## Allgemein verwendbare Module sind tiefer

Module, die etwas allgemeiner gehalten sind als der aktuelle Bedarf, haben meist einfachere und tiefere Schnittstellen. Ousterhouts Formel lautet: **somewhat general-purpose**, also ein wenig allgemein.

Die Funktionalität richtet sich nach dem heutigen Bedarf, die Schnittstelle aber nicht. Sein Beispiel ist ein Texteditor, den Studierende bauten. Die Textklasse bekam Methoden wie `backspace()` und `delete()`, also Begriffe der Benutzeroberfläche. Allgemeiner und einfacher wäre:

```java
// Spezialisiert: UI-Wissen leckt in die Textklasse.
void backspace(Cursor cursor);
void deleteSelection(Selection selection);

// Allgemein: Die Textklasse kennt nur Positionen.
void insert(Position position, String text);
void delete(Position start, Position end);
```

Die UI-Klasse setzt dann Backspace als `delete` einer Position zurück bis zur aktuellen um. Die Textklasse wird kleiner, wiederverwendbar und unabhängig von der Oberfläche.

Ousterhouts Prüffragen: Was ist die einfachste Schnittstelle, die alle aktuellen Anforderungen abdeckt? In wie vielen Situationen wird die Methode verwendet? Ist die API für den heutigen Bedarf leicht zu benutzen?

### Einordnung

Hier liegt eine Spannung zu YAGNI aus dem Extreme Programming. Ousterhout plädiert nicht für spekulative Features, sondern für Schnittstellen, die nicht an den ersten Anwendungsfall geschweißt sind. Die Grenze zwischen „ein wenig allgemein“ und „Überabstraktion“ bleibt aber Ermessenssache.

## Andere Schicht, andere Abstraktion

In einem gut geschichteten System bietet jede Schicht eine andere Abstraktion als die darüber und darunter. Wenn zwei benachbarte Schichten ähnliche Abstraktionen haben, stimmt die Zerlegung vermutlich nicht.

### Durchreichmethoden

Das deutlichste Warnsignal ist eine **Pass-Through-Methode**, die fast nur einen Aufruf mit derselben Signatur weitergibt:

```java
public class DocumentService {
    private final DocumentRepository repository;

    // Fügt eine Schnittstelle hinzu, aber keine Funktionalität.
    public Document findById(long id) {
        return repository.findById(id);
    }
}
```

Solche Methoden machen Klassen flacher. Abhilfe: Aufrufer direkt mit der unteren Klasse sprechen lassen, die Verantwortung anders verteilen oder die Klassen zusammenlegen. Wichtig: Gleiche Signaturen sind nicht immer falsch. Ein Dispatcher, der anhand der Argumente eine von mehreren Implementierungen auswählt, leistet echte Arbeit. Auch mehrere Implementierungen desselben Interfaces sind in Ordnung.

### Decorators

Das Decorator-Pattern sieht Ousterhout kritisch. Viele Decorators sind flach: Sie erweitern eine Klasse um wenig Funktionalität und reichen sonst alles durch. Alternativen sind, die Funktion direkt in die Basisklasse zu integrieren oder mit einem bestehenden Decorator zu vereinen.

### Durchreichvariablen

Eine Variable, die durch viele Methoden durchgereicht wird, nur weil eine Methode ganz unten sie braucht, ist eine Form desselben Problems. Typisch sind Konfigurationsdaten. Ousterhouts bevorzugte Lösung ist ein **Kontextobjekt**, das solche systemweiten Daten bündelt und an zentraler Stelle erzeugt wird. Er räumt ein, dass das nicht ideal ist, hält es aber für die beste verfügbare Lösung, sofern das Objekt möglichst unveränderlich bleibt.

## Komplexität nach unten ziehen

Es ist wichtiger, dass ein Modul eine einfache Schnittstelle hat, als dass es eine einfache Implementierung hat. Wenn sich Komplexität nicht vermeiden lässt, soll sie der Autor des Moduls tragen, nicht jeder Nutzer.

Der Grund ist zahlenmäßig: Ein Modul hat einen Autor, aber viele Nutzer. Was der Autor einmal löst, sparen alle anderen.

### Konfigurationsparameter

Ein typischer Ausweg vor schwierigen Entscheidungen ist ein Konfigurationsparameter: Soll der Nutzer selbst entscheiden, wie oft wiederholt wird oder wie groß der Puffer ist. Ousterhout hält das oft für einen Fehler. Der Nutzer weiß meistens weniger über die richtige Einstellung als der Autor. Besser ist es, sinnvolle Standards zu wählen oder den Wert dynamisch zu ermitteln, etwa ein Timeout aus gemessenen Antwortzeiten.

```java
// Komplexität beim Aufrufer
client.send(request, /* retries */ 3, /* backoffMs */ 200, /* timeoutMs */ 5000);

// Komplexität im Modul, Ausnahmen bleiben möglich
client.send(request);
```

Die Grenze: Nach unten ziehen lohnt nur, wenn die Komplexität eng mit der Funktion des Moduls verbunden ist und die Schnittstelle dadurch wirklich einfacher wird. Wer alles in ein Modul zieht, erzeugt einen Klotz, der zu viel weiß.

### Einordnung

Dieses Kapitel ist im Alltag sehr nützlich. Die Kritik an Pass-Through-Methoden trifft typische Schichtenarchitekturen mit Controller, Service und Repository, in denen die Service-Schicht oft nur weiterleitet. Gleichzeitig verteidigen viele Architekten genau diese Schichten, weil sie später Logik aufnehmen sollen oder klare Abhängigkeitsregeln durchsetzen. Hier steht Ousterhouts Fokus auf die Komplexität heute gegen Clean-Architecture-Denken, das auf künftige Änderbarkeit setzt.

## Zusammen oder getrennt?

Zwei Codestücke gehören zusammen, wenn sie eng miteinander verbunden sind. Getrennt werden sie nur, wenn die Trennung die Gesamtkomplexität senkt, nicht nur die Größe der einzelnen Teile.

Jede Aufteilung hat Kosten: mehr Schnittstellen, mehr Code für die Verbindung, verstreute Logik und möglicherweise Duplikation. Kleine Teile sind deshalb kein Wert an sich.

### Zeichen, dass Code zusammengehört

- Beide Teile **teilen Information**, etwa das Wissen über ein Format.
- Sie werden **immer gemeinsam benutzt**, und die Nutzung ist in beide Richtungen nötig.
- Sie **überlappen konzeptionell**, gehören also zur selben übergeordneten Kategorie.
- Man kann den einen **nicht verstehen, ohne den anderen zu lesen**.

Zusammenlegen kann zudem die Schnittstelle vereinfachen und Duplikation entfernen.

### Zeichen, dass Code getrennt gehört

- **Allgemeiner und spezieller Code** sollen getrennt sein. Die allgemeine Funktion kommt in ein Modul, der Spezialfall in die Schicht darüber.
- Code, der **wiederholt** an mehreren Stellen auftaucht, gehört in eine eigene Methode.

### Methoden aufteilen

Hier stellt sich Ousterhout direkt gegen Clean Code. Lange Methoden sind für ihn kein Problem, solange sie eine klare, einfache Abstraktion haben und gut strukturiert sind, etwa in kommentierte Blöcke. Eine Methode mit Hunderten Zeilen kann in Ordnung sein, wenn sie eine einfache Signatur hat und sich gut lesen lässt.

Aufteilen lohnt sich in zwei Fällen:

1. **Teilaufgabe herausziehen:** Ein Stück der Methode lässt sich als eigenständige, allgemein verständliche Aufgabe beschreiben. Wer die neue Methode liest, muss die alte nicht kennen, und umgekehrt.
2. **Zwei Methoden aus einer:** Eine Methode mit komplizierter Schnittstelle, die zwei Dinge tut, wird in zwei Methoden mit jeweils einfacherer Schnittstelle zerlegt.

Das Warnsignal heißt **Conjoined Methods**: Zwei Methoden, die man nur verstehen kann, wenn man beide gleichzeitig liest. Dann war die Trennung falsch.

```java
// Getrennt, aber nur gemeinsam verständlich: in welcher Reihenfolge, mit welchem Zustand?
private void prepareHeader() { header = buildHeader(order); }
private void appendHeader()  { buffer.append(header); }

// Zusammen, weil eine Aufgabe
private void writeHeader(StringBuilder buffer, Order order) {
    buffer.append("Bestellung ").append(order.id())
          .append(" vom ").append(order.date())
          .append(System.lineSeparator());
}
```

### Einordnung

In der zweiten Auflage formuliert Ousterhout seine Kritik an Clean Code ausdrücklich: Martins Regel, Funktionen so klein wie möglich zu machen, erzeuge viele flache und verbundene Methoden. Er gesteht zu, dass sehr lange Methoden meist ein Problem sind, sieht aber in der Länge nur ein Symptom, nicht die Ursache. Das Kriterium ist bei ihm die Tiefe, bei Martin die Zahl der Aufgaben. Viele Praktiker finden die Wahrheit irgendwo dazwischen und ziehen Teilaufgaben heraus, wenn sie einen guten Namen finden, nicht nach Zeilenzahl.

## Fehler wegdefinieren

Ausnahmen gehören zu den größten Komplexitätsquellen, weil jede einzelne Behandlungscode an vielen Stellen verlangt. Der beste Weg ist, so wenige Stellen wie möglich zu haben, an denen Ausnahmen behandelt werden müssen.

Ousterhout warnt ausdrücklich vor dem Reflex, möglichst viele Fehler zu werfen, um „defensiv“ zu programmieren. Jede geworfene Exception wird Teil der Schnittstelle und verlagert Arbeit auf den Aufrufer.

### Vier Techniken

| Technik | Idee | Beispiel bei Ousterhout |
|---|---|---|
| Fehler wegdefinieren | Die Semantik so wählen, dass der Fall kein Fehler mehr ist. | Ein Befehl zum Löschen einer Variablen soll nur garantieren, dass sie danach nicht existiert, statt bei fehlender Variable einen Fehler zu werfen. |
| Maskieren | Die Ausnahme auf niedriger Ebene erkennen und behandeln, sodass höhere Ebenen nichts merken. | TCP wiederholt verlorene Pakete selbst. |
| Aggregieren | Viele Ausnahmen mit einem einzigen Handler an einer Stelle abfangen. | Ein Webserver fängt alle Fehler fehlender Parameter zentral ab, statt in jeder Methode. |
| Einfach abstürzen | Bei seltenen Fehlern, die man kaum sinnvoll behandeln kann, das Programm beenden. | Kein Speicher mehr, inkonsistente interne Datenstrukturen |

### Dateien löschen: Windows gegen Unix

Unter Windows schlägt das Löschen einer geöffneten Datei fehl. Unter Unix wird der Verzeichniseintrag sofort entfernt, die Datei selbst existiert weiter, bis der letzte Prozess sie schließt. Für Unix gibt es damit keinen Fehlerfall, für Windows schon.

### Java-Beispiel: substring

Ousterhout kritisiert, dass `String.substring` eine Exception wirft, wenn die Indizes außerhalb des Strings liegen. Eine Variante, die den Bereich einfach auf den gültigen Teil begrenzt, braucht keinen Fehlercode beim Aufrufer:

```java
// Standard: Der Aufrufer muss Grenzen prüfen oder die Exception behandeln.
String preview = text.length() > 80 ? text.substring(0, 80) : text;

// Fehler wegdefiniert: liefert die Überschneidung des gewünschten Bereichs mit dem String.
public static String safeSubstring(String s, int begin, int end) {
    int b = Math.max(0, Math.min(begin, s.length()));
    int e = Math.max(b, Math.min(end, s.length()));
    return s.substring(b, e);
}

String preview = safeSubstring(text, 0, 80);
```

Viele Sprachen machen das bereits so, Python etwa beim Slicing.

### Sonderfälle wegdefinieren

Dieselbe Idee gilt für Sonderfälle allgemein. Im Texteditor seiner Studierenden musste jede Operation prüfen, ob gerade eine Auswahl existiert. Einfacher wird es, wenn es immer eine Auswahl gibt, die im Normalfall leer ist. Der Code für den Fall „keine Auswahl“ verschwindet.

### Einordnung

Das Kapitel gilt als eines der originellsten des Buchs. Es ergänzt Clean Code gut: Martin und Feathers sagen, wie man Fehler sauber behandelt, Ousterhout fragt, ob es den Fehler überhaupt geben muss. Das Special-Case-Pattern aus Clean Code ist ein Spezialfall davon.

Die Gegenposition: Fehler wegzudefinieren kann echte Probleme verschleiern. Ein `safeSubstring`, das stillschweigend kürzt, verdeckt womöglich einen Programmierfehler, bei dem die Indizes falsch berechnet wurden. Ousterhout räumt ein, dass das nicht immer passt. Wo der Aufrufer den Fehler wirklich wissen muss, soll man ihn auch zeigen.

## Design it twice

Der erste Entwurf ist selten der beste. Für jede wichtige Designentscheidung soll man mindestens zwei grundsätzlich verschiedene Ansätze skizzieren und vergleichen.

Die Alternativen sollen sich deutlich unterscheiden, nicht nur in Details. Für die Textklasse des Editors nennt Ousterhout etwa drei Varianten: eine zeilenorientierte Schnittstelle, eine zeichenorientierte und eine, die mit Bereichen arbeitet. Erst im Vergleich wird sichtbar, welche den Aufrufern die meiste Arbeit abnimmt.

### Vergleichskriterien

- Welche Schnittstelle ist für die Aufrufer am einfachsten?
- Welche ist am allgemeinsten verwendbar?
- Welche ermöglicht die effizienteste Implementierung?

Oft ist am Ende keine der Varianten die beste, sondern eine Kombination, die Stärken mehrerer Entwürfe vereint.

### Warum Kluge das oft nicht tun

Ousterhout beobachtet, dass gerade sehr begabte Entwickler den ersten Einfall übernehmen. Sie haben gelernt, dass ihr erster Gedanke meistens gut genug ist, und das bestätigt sich in Schule und Studium immer wieder. Bei größeren Systemen gilt das aber nicht mehr. Wer nur einen Entwurf kennt, kann ihn nicht beurteilen.

Der Aufwand ist gering: Für eine Klasse genügen meist eine oder zwei Stunden. Im Verhältnis zur Implementierungszeit, die Tage oder Wochen dauert, ist das wenig.

### Einordnung

Eine einfache und kaum umstrittene Idee. Sie passt gut zu Architecture Decision Records und zu der Praxis, in Designdokumenten Alternativen aufzuführen. Clean Code hat dazu kein Gegenstück: Dort entsteht Design durch schrittweises Refaktorieren, also aus einem einzigen ersten Entwurf heraus. Das ist ein grundlegender Unterschied im Vorgehen. Ousterhout denkt vorher nach, Martin verbessert hinterher.

## Kommentare als Designwerkzeug

Kommentare halten fest, was im Kopf des Designers war und sich im Code nicht ausdrücken lässt. Ohne sie bleibt ein Teil des Designs unsichtbar, und Abstraktion ist ohne Beschreibung der Schnittstelle kaum möglich.

### Vier Ausreden und Ousterhouts Antworten

| Ausrede | Antwort |
|---|---|
| Guter Code dokumentiert sich selbst. | Code zeigt das Wie, aber selten das Warum, die Annahmen oder die Bedeutung von Werten. Und ohne Schnittstellenkommentar muss jeder Nutzer die Implementierung lesen. |
| Ich habe keine Zeit. | Gute Kommentare kosten wenige Prozent der Entwicklungszeit und zahlen sich bei jedem Lesen aus. |
| Kommentare veralten. | Das passiert, ist aber beherrschbar, wenn Kommentare nahe am Code stehen und in Reviews geprüft werden. |
| Alle Kommentare, die ich je gesehen habe, sind nutzlos. | Dann waren es schlechte Kommentare. Das spricht für bessere, nicht für keine. |

Die erste Ausrede zielt erkennbar auf Clean Code.

### Was ein guter Kommentar beschreibt

Die Grundregel: Kommentare beschreiben, was aus dem Code **nicht offensichtlich** ist. Einen Kommentar, der nur den Code in Worten wiederholt, lehnt Ousterhout genauso ab wie Martin.

Zwei Richtungen sind nützlich:

- **Präziser als der Code** (niedrigere Ebene): Einheiten, Grenzen inklusive oder exklusive, ob `null` erlaubt ist, wer eine Ressource freigibt, welche Invarianten gelten.
- **Abstrakter als der Code** (höhere Ebene): Was eine Codepassage insgesamt erreichen soll und warum, also Intuition statt Einzelschritte.

### Schnittstellen- gegen Implementierungskommentare

**Schnittstellenkommentare** sind die wichtigsten. Sie beschreiben das Verhalten aus Sicht des Aufrufers, ohne Implementierungsdetails:

```java
/**
 * Reserviert einen Sitzplatz für die angegebene Vorstellung.
 *
 * Ist der gewünschte Platz bereits vergeben, wird der nächste freie Platz
 * in derselben Reihe gewählt; gibt es keinen, wird empty() zurückgegeben.
 * Die Reservierung verfällt nach 15 Minuten, wenn sie nicht bestätigt wird.
 *
 * @param showId  ID der Vorstellung; muss existieren
 * @param seat    gewünschter Platz, z. B. "F12"
 * @return die Reservierung, oder empty(), wenn die Reihe ausgebucht ist
 */
Optional<Reservation> reserve(long showId, String seat);
```

Der Methodenname allein kann weder das Ausweichen auf den Nachbarplatz noch die Verfallszeit vermitteln.

**Implementierungskommentare** innerhalb einer Methode erklären vor allem, *was* ein Block tut und *warum*, nicht wie. Bei langen Methoden markieren sie die Abschnitte.

**Modulübergreifende Entscheidungen**, die sich keiner Stelle zuordnen lassen, gehören in eine zentrale Datei mit Designnotizen, auf die der Code verweist.

### Kommentare zuerst schreiben

Ousterhout schreibt den Schnittstellenkommentar einer Klasse oder Methode, **bevor** er den Code schreibt. Das hat drei Effekte: Die Kommentare werden besser, weil man den Gedanken noch frisch hat. Das Schreiben wird angenehmer, weil es Teil des Designs ist statt lästige Nacharbeit. Und es ist ein Frühwarnsystem: Lässt sich eine Methode nicht kurz und einfach beschreiben, ist das Design vermutlich nicht gut.

### Einordnung

In diesem Punkt hat sich die Fachöffentlichkeit eher auf Ousterhouts Seite gestellt. Die Idee, dass ein langer, schwer zu formulierender Kommentar ein Designproblem anzeigt, ist im Grunde eine Variante von Martins Gedanken, dass ein Kommentar Versagen anzeigt, nur mit umgekehrter Konsequenz: Martin streicht den Kommentar und ändert den Code, Ousterhout schreibt ihn und ändert dann den Code. Kritiker merken an, dass Ousterhouts Kommentarumfang in agilen Teams mit häufigen Änderungen schwerer zu pflegen ist.

## Namen

Ein guter Name erzeugt beim Leser ein klares, zutreffendes Bild. Ousterhout betont vor allem **Präzision** und **Konsistenz**.

- **Zu allgemein ist genauso schlecht wie kryptisch.** Namen wie `count`, `result`, `data`, `status` oder `x` sagen nicht, was gezählt oder gemeint ist. Er erzählt von einem Fehler, der Monate kostete, weil eine Variable `block` mal einen physischen, mal einen logischen Plattenblock bezeichnete.
- **Schwer zu benennen heißt schwer zu verstehen.** Findet man keinen präzisen Namen, ist das oft ein Hinweis, dass die Variable oder Methode keine klare Aufgabe hat.
- **Konsistent benennen:** derselbe Name immer für dasselbe Konzept, nie für etwas anderes, und für verwandte Dinge erkennbar verwandte Namen.
- **Kurze Namen à la Go:** Ousterhout widerspricht der Go-Kultur, die sehr kurze Namen wie `ch` oder `i` bevorzugt. Kurz geht nur, wenn der Gültigkeitsbereich sehr klein ist.

## Konsistenz

Konsistenz senkt die kognitive Last: Wer ein Muster einmal verstanden hat, erkennt es überall wieder. Das gilt für Namen, Code-Stil, Schnittstellen mit mehreren Implementierungen, Entwurfsmuster und Invarianten.

Durchsetzen lässt sie sich durch dokumentierte Konventionen, automatische Prüfungen und Code-Reviews. Die wichtigste Regel heißt bei ihm sinngemäß **„When in Rome …“**: Wer in bestehendem Code arbeitet, hält sich an die vorhandenen Konventionen. Eine bessere Idee rechtfertigt nur dann einen Bruch, wenn sie so viel besser ist, dass man den alten Stil überall ersetzt.

## Code soll offensichtlich sein

Code ist offensichtlich, wenn ein Leser ihn schnell liest und die erste Vermutung über sein Verhalten stimmt. Ob das gelungen ist, entscheidet der Leser, nicht der Autor. Deshalb sind Code-Reviews das beste Mittel dafür.

Was Code weniger offensichtlich macht:

- **Ereignisgesteuerte Programmierung:** Der Kontrollfluss ist im Code nicht zu sehen. Gegenmittel: dokumentieren, wann ein Handler aufgerufen wird.
- **Generische Container:** Ein `Pair<Integer, Boolean>` als Rückgabewert verschleiert, was die Werte bedeuten. Eine eigene kleine Klasse oder in modernem Java ein `record` ist klarer.
- **Abweichende Typen bei Deklaration und Zuweisung:** Etwa `List<Message> messages = new ArrayList<>()`. Ousterhout findet, dass das die tatsächliche Klasse verbirgt, die für Performance oder Verhalten relevant sein kann.
- **Code, der Erwartungen verletzt:** etwa ein `main`, das scheinbar endet, während Hintergrund-Threads weiterlaufen.

```java
// Unklar: Was bedeuten Integer und Boolean?
Pair<Integer, Boolean> result = validate(input);

// Offensichtlich
record ValidationResult(int errorCount, boolean isRecoverable) {}
ValidationResult result = validate(input);
```

## Bestehenden Code ändern

Auch bei kleinen Änderungen strategisch bleiben: Nach einer Änderung soll das System so aussehen, als wäre es von Anfang an mit diesem Feature entworfen worden. Weitere Regeln: Kommentare nahe am betroffenen Code halten, damit sie mitgepflegt werden. Wichtige Erklärungen gehören in den Code, nicht nur in die Commit-Nachricht, weil sie dort niemand findet. Dokumentation nicht duplizieren, sondern an einer Stelle halten und verweisen. Und vor jedem Commit den Diff durchsehen, ob Kommentare noch stimmen.

### Einordnung

Bei Namen liegen Martin und Ousterhout fast gleich. Die Bemerkung zur Typdeklaration widerspricht verbreiteter Java-Praxis und wird oft kritisiert: Gegen das Interface zu programmieren gilt gerade als gute Kapselung. Mit `var` seit Java 10 hat sich die Frage im lokalen Code teilweise erledigt.

## Softwaretrends im Licht der Komplexität

Ousterhout prüft verbreitete Praktiken mit einer einzigen Frage: Senken sie Komplexität oder nicht?

| Trend | Urteil | Begründung |
|---|---|---|
| Vererbung von Schnittstellen | positiv | Ein Interface für viele Implementierungen ist ein Hebel gegen Komplexität. |
| Vererbung von Implementierungen | vorsichtig | Basis- und Unterklassen werden abhängig voneinander, Information leckt durch die Hierarchie. Komposition ist oft besser. |
| Agile Entwicklung | gemischt | Inkrementelles Vorgehen ist richtig, aber die Inkremente sollen **Abstraktionen** sein, nicht nur Features. Sonst wird Agile zum taktischen Programmieren. |
| Unit-Tests | positiv | Tests machen Refactoring erst möglich und sind eine Voraussetzung für gutes Design. |
| Test-Driven Development | kritisch | TDD lenkt den Blick auf das nächste kleine Feature statt auf das beste Design. Es ist für ihn eine Form taktischen Programmierens. Ausnahme: beim Bugfix erst den Test schreiben, der den Fehler zeigt. |
| Entwurfsmuster | gemischt | Gut, wo ein Muster genau passt. Schlecht, wenn man ein Problem in ein Muster presst, das nicht passt. |
| Getter und Setter | kritisch | Sie legen Implementierungsdetails offen und machen Klassen flach. |

Das TDD-Urteil ist der schärfste Bruch mit Martin, der TDD fast als Berufspflicht sieht.

## Performance

Wer einfach entwirft, bekommt meist auch schnellen Code. Wo Performance wichtig ist, soll man sie gezielt angehen, nicht überall.

- **Gespür für teure Operationen entwickeln:** Netzwerkaufrufe, Plattenzugriffe, Speicherallokation, Cache-Misses. Ousterhout nennt grobe Größenordnungen, etwa dass ein Netzwerk-Roundtrip im Rechenzentrum einige hundert Mal länger dauert als ein Speicherzugriff.
- **Messen vor dem Optimieren:** Intuition über Engpässe ist oft falsch.
- **Um den kritischen Pfad herum entwerfen:** Den Codepfad für den häufigsten Fall finden, überlegen, wie er im Idealfall aussähe, mit so wenig Sonderfällen wie möglich, und dann den Rest so umbauen, dass dieser Pfad schnell bleibt. Sein Beispiel ist ein Puffer in RAMCloud, bei dem die Sonderfälle aus dem Hauptpfad herausgenommen wurden.

Einfachheit und Performance stehen also seltener im Widerspruch, als man denkt. Das ist eine deutlich andere Haltung als bei Martin, der Performance kaum behandelt.

## Was wirklich zählt

Die zweite Auflage ergänzt ein Kapitel darüber, Wichtiges von Unwichtigem zu unterscheiden. Gutes Design heißt, herauszufinden, was am meisten zählt, und darum herum zu strukturieren: Wichtiges soll sichtbar sein, Unwichtiges verborgen. Wer alles für wichtig hält, macht nichts wirklich gut. Das gilt für Schnittstellen, für Kommentare und auch für Prioritäten im Projekt.

### Einordnung

Die Bewertungen sind knapp und teils pauschal, gerade die TDD-Kritik. Befürworter halten dagegen, dass TDD mit einem bewussten Refactoring-Schritt durchaus Raum für Design lässt, und Kent Beck selbst sieht TDD nicht als Ersatz für Nachdenken über Design. Die Haltung zu Vererbung und Komposition ist heute weitgehend Konsens.

## Red Flags

Ousterhout fasst seine Warnsignale am Ende in einer Liste von 14 Punkten zusammen. Sie ist deutlich kürzer als Martins Katalog mit 66 Einträgen und konzentriert sich ganz auf Designprobleme statt auf Stil.

| Red Flag | Woran man es erkennt |
|---|---|
| Shallow Module | Die Schnittstelle ist nicht viel einfacher als die Implementierung. |
| Information Leakage | Eine Designentscheidung steckt in mehreren Modulen. |
| Temporal Decomposition | Die Struktur folgt der Ablaufreihenfolge statt dem Wissen, das zusammengehört. |
| Overexposure | Um ein häufig genutztes Feature zu verwenden, muss man selten genutzte kennen. |
| Pass-Through Method | Eine Methode reicht ihre Argumente fast nur an eine andere mit ähnlicher Signatur weiter. |
| Repetition | Ein nichttriviales Stück Code taucht mehrfach auf. |
| Special-General Mixture | Spezialcode ist nicht sauber vom allgemeinen Code getrennt. |
| Conjoined Methods | Zwei Methoden lassen sich nur gemeinsam verstehen. |
| Comment Repeats Code | Der Kommentar sagt nichts, was nicht offensichtlich im Code steht. |
| Implementation Documentation Contaminates Interface | Der Schnittstellenkommentar beschreibt Details, die Nutzer nicht brauchen. |
| Vague Name | Ein Name ist so ungenau, dass er wenig nützliche Information trägt. |
| Hard to Pick Name | Es ist schwer, einen präzisen, intuitiven Namen zu finden. |
| Hard to Describe | Eine vollständige Dokumentation muss lang sein. |
| Nonobvious Code | Verhalten oder Bedeutung erschließen sich beim Lesen nicht leicht. |

Auffällig: Drei der Red Flags handeln von Namen und Beschreibungen, also davon, wie leicht sich etwas in Worte fassen lässt. Für Ousterhout ist Sprache ein Messinstrument für Design. Was sich nicht einfach beschreiben lässt, ist vermutlich nicht einfach.

Im Vergleich zu Clean Code fehlen Formatierung, Funktionslänge und Argumentanzahl völlig. Umgekehrt hat Martin keinen Begriff für flache Module, Durchreichmethoden oder zeitliche Zerlegung.

## Kritik und Einordnung

Das Buch gilt heute vielen als das bessere Einstiegsbuch zum Thema Design, weil es Begriffe liefert statt Regeln. Es hat aber eigene Schwächen.

### Stärken

- **Ein einheitlicher Maßstab:** Alles wird an Komplexität gemessen. Das macht die Argumente vergleichbar und erlaubt Abwägungen statt Dogmen.
- **Präzise Begriffe:** tiefe und flache Module, Information Leakage, Pass-Through, Conjoined Methods, taktischer Tornado. Damit lässt sich in Code-Reviews über Design reden, nicht nur über Stil.
- **Kurz und dicht.** Rund 190 Seiten, kaum Füllmaterial.
- **Lehrerprobt:** Die Beispiele kommen aus echten Fehlern von Studierenden, die Ousterhout über Jahre beobachtet hat.
- **Ausgewogener Ton:** Vieles wird als Abwägung formuliert, Ausnahmen werden benannt.

### Schwächen

**1. Akademische Herkunft.** Die Beispiele stammen aus Kursprojekten mit wenigen tausend Zeilen und aus Systemsoftware wie Dateisystemen und Speichersystemen. Große, langlebige Geschäftsanwendungen mit vielen Teams, wechselnden Anforderungen und fachlicher Komplexität kommen kaum vor. Fachliche Modellierung im Sinne von Domain-Driven Design fehlt fast völlig.

**2. Tests unterbelichtet.** Tests bekommen kaum Raum, und die Ablehnung von TDD ist knapp begründet. Wie tiefe Module mit großer Funktionalität gut testbar bleiben, wird nicht wirklich behandelt.

**3. Schwer messbar.** „Tief“ ist genauso Ermessenssache wie Martins „eine Verantwortung“. Wann eine Schnittstelle einfach genug ist, lässt sich nicht objektiv bestimmen.

**4. Risiko der Gottklasse.** Wer „tiefe Module“ und „Komplexität nach unten ziehen“ ohne Urteilsvermögen anwendet, landet bei großen Klassen, die zu viel wissen. Ousterhout benennt die Grenze, aber weniger ausführlich als die Gegenrichtung.

**5. Kommentarpflege.** Ausführliche Schnittstellenkommentare kosten Pflege. In Codebasen mit hoher Änderungsrate veralten sie trotz aller Vorsätze.

**6. Wenig zu Nebenläufigkeit, verteilten Systemen und Teams.** Ausgerechnet ein Autor mit Erfahrung bei Raft und verteilten Speichersystemen behandelt diese Themen kaum.

**7. Wenig Empirie.** Wie Clean Code beruht das Buch auf Erfahrung, nicht auf Studien. Ousterhout ist dabei aber vorsichtiger formuliert.

### Gesamturteil

Das Buch ist ein hervorragendes Werkzeug zum Denken über Design und eine nötige Korrektur zu den Extremen von Clean Code. Es ersetzt aber kein Buch über Tests, Refactoring oder fachliche Modellierung. Am stärksten ist es für Entwickler, die schon Erfahrung haben und nach Begriffen suchen, um ihr Gespür für gutes Design zu benennen.

## Gegenüberstellung mit Clean Code

Beide wollen Code, der leicht zu verstehen und zu ändern ist. Sie unterscheiden sich darin, wo sie die Komplexität am besten aufgehoben sehen und wie man zu gutem Design kommt.

| Thema | Martin (Clean Code) | Ousterhout (APOSD) |
|---|---|---|
| Leitbegriff | Sauberkeit, Handwerk | Komplexität |
| Funktionslänge | so kurz wie möglich, ideal 2–4 Zeilen | Länge egal, solange die Abstraktion einfach ist |
| Zerlegen, wenn … | die Funktion mehr als eine Sache tut | die Gesamtkomplexität sinkt |
| Klassen | klein, eine Verantwortung | tief, einfache Schnittstelle, Warnung vor Classitis |
| Kommentare | meist ein Versagen | unverzichtbar für Abstraktion, zuerst schreiben |
| TDD | quasi Pflicht | eher taktisch, außer bei Bugfixes |
| Fehler | Exceptions mit Kontext, Special Case | möglichst wegdefinieren, maskieren, aggregieren |
| Vorgehen | erst funktionierend, dann schrittweise refaktorieren | vorher zwei Entwürfe vergleichen |
| Performance | kaum Thema | kritischen Pfad gezielt gestalten |
| Ton | normativ, moralisch | abwägend, ökonomisch |
| Herkunft | Java-Enterprise, Beratung | Systemsoftware, Lehre in Stanford |

**Weitgehend einig** sind sie bei guten Namen, Konsistenz, Vermeidung von Duplikation, keine redundanten Kommentare, keine versteckten Seiteneffekte, Unit-Tests als Grundlage und Komposition statt Implementierungsvererbung.

In ihrer öffentlichen Diskussion zeigte sich, dass die Unterschiede in der Praxis kleiner sind, als die Bücher vermuten lassen. Der Kern bleibt aber: Martin optimiert für den Leser, der eine Methode nach der anderen durchgeht. Ousterhout optimiert für den Leser, der eine Schnittstelle verstehen will, ohne die Implementierung lesen zu müssen.

## Diskussionsfragen

1. **Tief oder klein:** Wie entscheidest du in deiner Praxis, ob eine Methode aufgeteilt wird? Eher nach Länge, nach Aufgaben oder nach Tiefe?
2. **Service-Schichten:** Sind dünne Service-Methoden, die nur ans Repository weiterleiten, ein Red Flag oder eine sinnvolle Vorbereitung auf künftige Logik?
3. **Kommentare zuerst:** Hast du das je probiert? Hilft es beim Design, oder ist es in agilen Teams mit häufigen Änderungen unrealistisch?
4. **Fehler wegdefinieren:** Wo verschleiert das echte Fehler? Ist ein stillschweigend kürzendes `substring` ein Fortschritt oder ein Risiko?
5. **TDD:** Wer hat recht? Gibt es Situationen, in denen beide recht haben?
6. **Konfigurationsparameter:** Gute Standards im Modul oder Flexibilität für den Aufrufer? Wie sieht das in euren Frameworks aus?
7. **Welches Buch für Einsteiger?** Wem würdest du heute welches in die Hand drücken, und in welcher Reihenfolge?
8. **Was fehlt beiden?** Fachliche Modellierung, Teams, verteilte Systeme? Wäre Domain-Driven Design ein sinnvoller dritter Kandidat für unsere Reihe?
