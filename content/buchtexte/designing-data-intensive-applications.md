+++
title = "Designing Data-Intensive Applications – Zusammenfassung und Einordnung"
description = "Martin Kleppmann, Designing Data-Intensive Applications (2017; 2. Auflage mit Chris Riccomini, 2026)"
date = 2026-10-30T13:57:51+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["designing-data-intensive-applications-2026"]
+++

## Einleitung

Es gibt Hunderte Datenbanken, Message Broker, Caches und Verarbeitungssysteme. Welche soll man nehmen? Kleppmanns Antwort: Das hängt von den Abwägungen ab, und um sie zu treffen, muss man die **Grundprinzipien** verstehen, nach denen all diese Systeme funktionieren. Das Buch erklärt nicht einzelne Produkte, sondern die Ideen dahinter.

### Autoren und Kontext

**Martin Kleppmann** arbeitete als Entwickler bei LinkedIn an der Datenverarbeitung mit Kafka und Samza und gründete vorher Startups. Heute forscht er an der Universität Cambridge zu verteilten Systemen, unter anderem zu CRDTs und „local-first“-Software. Die erste Auflage schrieb er allein, sie erschien 2017 und wurde zu einem der meistgelesenen technischen Bücher des Jahrzehnts.

**Chris Riccomini**, Mitautor der zweiten Auflage, ist ebenfalls ehemaliger LinkedIn-Ingenieur, Mitentwickler von Apache Samza und SlateDB und Mitautor von *The Missing README*.

### Zwei Auflagen

|  | 1. Auflage (2017) | 2. Auflage (2026) |
|---|---|---|
| Autoren | Kleppmann | Kleppmann, Riccomini |
| Umfang | rund 600 Seiten, 12 Kapitel | rund 650 Seiten, 14 Kapitel |
| Neu | – | Kapitel zu Architektur-Abwägungen, eigenes Kapitel zu Streaming als Denkweise, eigenes Ethikkapitel; stärker auf Cloud, Object Storage und Multi-Cloud ausgerichtet |
| Umbenannt | „Partitioning“ | „Sharding“ |

Die Grundlagen wurden nicht neu geschrieben, sondern in den Kontext cloudbasierter Systeme gestellt. Nach den Aussagen der Autoren hat sich vor allem verändert, dass Datenbanken früher als Prozesse auf einem Rechner mit lokaler Festplatte gedacht wurden, heute oft als Dienste auf Object Storage in der Cloud.

### Aufbau der zweiten Auflage

| Teil | Kapitel |
|---|---|
| Grundlagen | 1 Abwägungen in der Architektur · 2 Nichtfunktionale Anforderungen · 3 Datenmodelle und Abfragesprachen · 4 Speicherung und Abruf · 5 Kodierung und Evolution |
| Verteilte Daten | 6 Replikation · 7 Sharding · 8 Transaktionen · 9 Probleme verteilter Systeme · 10 Konsistenz und Konsens |
| Abgeleitete Daten | 11 Batch-Verarbeitung · 12 Stream-Verarbeitung · 13 Eine Philosophie des Streamings · 14 Das Richtige tun |

### Was das Buch besonders macht

- **Ideen statt Produkte:** Kleppmann erklärt LSM-Bäume, Replikationsprotokolle und Isolationsstufen so, dass man danach jedes konkrete System einordnen kann.
- **Abwägungen statt Empfehlungen:** Fast jedes Kapitel endet mit der Erkenntnis, dass es keine beste Lösung gibt, nur passende.
- **Ehrlichkeit über Fallstricke:** Besonders die Kapitel zu Transaktionen und verteilten Systemen zeigen, wie viele Annahmen in der Praxis nicht halten.
- **Quellen:** Jedes Kapitel hat umfangreiche Literaturverweise auf Forschungsarbeiten, die gepflegt und online aktualisiert werden.

Hinweis zu dieser Zusammenfassung: Die Struktur folgt der zweiten Auflage. Inhaltlich stütze ich mich vor allem auf die erste Auflage und die verfügbaren Informationen zur zweiten. Neue Inhalte der zweiten Auflage sind entsprechend gekennzeichnet.

## Abwägungen in der Architektur (Kapitel 1, neu)

Das erste Kapitel der zweiten Auflage ist neu. Es stellt drei grundlegende Abwägungen voran, bevor es in die Technik geht:

| Abwägung | Worum es geht |
|---|---|
| **Operativ gegen analytisch** | Systeme für das Tagesgeschäft (OLTP: viele kleine Lese- und Schreibzugriffe auf einzelne Datensätze) gegenüber Systemen für Auswertungen (OLAP: wenige große Abfragen über viele Datensätze). Dazu Data Warehouses, Data Lakes und die Frage, wie Daten von einer Welt in die andere kommen. |
| **Cloud gegen selbst betrieben** | Verwaltete Dienste sparen Betriebsaufwand, kosten aber Kontrolle, Flexibilität und manchmal Geld. Cloud-native Systeme trennen oft Speicherung und Berechnung, etwa mit Object Storage als Grundlage. |
| **Verteilt gegen ein Rechner** | Verteilung bringt Ausfallsicherheit und Skalierbarkeit, aber auch enorme Komplexität. Ein einzelner, gut ausgestatteter Rechner reicht oft weiter, als man denkt. |

Der dritte Punkt ist eine wichtige Mahnung: Viele Systeme werden ohne Not verteilt. Wer auf einem Rechner auskommt, spart sich die Probleme aus den Kapiteln 6 bis 10.

## Nichtfunktionale Anforderungen (Kapitel 2)

Die drei Leitbegriffe aus dem Untertitel des Buchs, **zuverlässig, skalierbar, wartbar**, werden hier präzisiert.

### Zuverlässigkeit

Kleppmann unterscheidet **Fehler** (ein Teil weicht von seiner Spezifikation ab) und **Ausfälle** (das System als Ganzes erbringt seinen Dienst nicht mehr). Ziel ist nicht, Fehler zu verhindern, sondern zu verhindern, dass Fehler zu Ausfällen werden. Fehlerquellen sind Hardware, Software, etwa ein Fehler, der auf allen Knoten gleichzeitig auftritt, und vor allem **Menschen**: Konfigurationsfehler sind eine der häufigsten Ursachen für Ausfälle.

### Skalierbarkeit

Skalierbarkeit ist keine Eigenschaft, die ein System hat oder nicht hat. Die richtige Frage lautet: **Wenn die Last auf eine bestimmte Weise wächst, wie gehen wir damit um?**

- **Last beschreiben:** mit Lastparametern wie Anfragen pro Sekunde, Verhältnis von Lese- zu Schreibzugriffen oder Anzahl gleichzeitiger Nutzer.
- **Leistung beschreiben:** nicht mit Durchschnitten, sondern mit **Perzentilen**. Der Median zeigt, wie es für die Hälfte der Nutzer aussieht, das 99. oder 99,9. Perzentil zeigt die langsamsten Anfragen, oft genau die der wichtigsten Kunden mit den meisten Daten.
- **Tail Latency:** Wenn eine Anfrage an viele Backend-Dienste geht, bestimmt der langsamste die Gesamtzeit. Seltene Ausreißer werden so zum Normalfall.

Kleppmanns bekanntes Beispiel ist die Zeitleiste eines sozialen Netzwerks: Soll man beim Lesen alle Beiträge der Gefolgten zusammensuchen, oder beim Schreiben jeden Beitrag sofort in die Zeitleisten aller Folgenden kopieren? Die zweite Variante macht Lesen schnell, aber Schreiben teuer, besonders für Konten mit Millionen Folgenden. Die Lösung ist eine Mischung, je nach Kontotyp.

### Wartbarkeit

Der größte Teil der Kosten entsteht nicht beim Bau, sondern im Betrieb und bei der Weiterentwicklung. Kleppmann nennt drei Ziele:

| Ziel | Bedeutung |
|---|---|
| **Betreibbarkeit** | Für das Betriebsteam leicht zu überwachen, zu warten und wiederherzustellen |
| **Einfachheit** | Zufällige Komplexität vermeiden, gute Abstraktionen nutzen |
| **Weiterentwickelbarkeit** | Änderungen sind leicht möglich |

Der zweite Punkt verweist ausdrücklich auf Brooks' Unterscheidung von wesentlicher und zufälliger Komplexität, die wir aus Code Complete kennen. Der dritte ist Thomas' und Hunts ETC auf Systemebene.

## Datenmodelle und Abfragesprachen (Kapitel 3)

Das Datenmodell ist vielleicht die folgenreichste Entscheidung in einem System, weil es bestimmt, wie man über das Problem überhaupt denkt. Kleppmann vergleicht drei große Familien.

### Relational, Dokument, Graph

| Modell | Stärke | Schwäche | Typisch für |
|---|---|---|---|
| **Relational** | Joins, viele-zu-eins- und viele-zu-viele-Beziehungen, starke Abfragesprache | Abbildung auf Objekte im Code mühsam | Geschäftsanwendungen, Buchhaltung, Bestellungen |
| **Dokument** | Lokalität: zusammengehörige Daten liegen beieinander; passt zu baumartigen Strukturen | Joins schwach oder umständlich; Duplikation bei vielen-zu-vielen | Profile, Kataloge, Inhalte |
| **Graph** | Beliebig verknüpfte Daten, Traversierung über viele Ebenen | Für einfache Strukturen überdimensioniert | soziale Netze, Wissensgraphen, Empfehlungen |

### Das Objekt-relationale Missverhältnis

Objektorientierter Code arbeitet mit verschachtelten Objekten, relationale Datenbanken mit flachen Tabellen. Die Übersetzung zwischen beiden, englisch **Impedance Mismatch**, ist der Grund für ORMs wie Hibernate. Kleppmann zeigt am Beispiel eines Lebenslaufs mit Stationen, Ausbildungen und Kontakten, dass ein Dokument diese Baumstruktur natürlicher abbildet als mehrere Tabellen mit Fremdschlüsseln.

```java
// natürlich als Dokument: ein Baum, der als Ganzes gelesen wird
record Profile(String name, List<Position> positions, List<Education> education, Contact contact) {}
```

Sobald aber Teile davon von vielen Stellen referenziert werden, etwa Firmen, Orte oder Schulen, die selbst Daten haben, braucht man Verweise, und damit Joins. Dann ist das relationale Modell im Vorteil.

### Schema beim Schreiben oder beim Lesen

Dokumentdatenbanken heißen oft „schemalos“. Kleppmann korrigiert das: Es gibt immer ein Schema, die Frage ist nur, wo es durchgesetzt wird.

- **Schema-on-write** (relational): Die Datenbank prüft beim Schreiben. Änderungen am Schema brauchen Migrationen.
- **Schema-on-read** (Dokument): Der Code interpretiert beim Lesen. Alte und neue Formate können nebeneinander existieren, der Code muss mit beiden umgehen.

Das ist die Unterscheidung von statischer und dynamischer Typprüfung, übertragen auf Daten.

### Die Modelle nähern sich an

Relationale Datenbanken wie PostgreSQL unterstützen JSON-Spalten mit Indizes, Dokumentdatenbanken wie MongoDB unterstützen inzwischen Joins und Transaktionen. Die Wahl ist weniger ein Entweder-oder als eine Frage des Schwerpunkts.

### Deklarative Abfragesprachen

SQL, Cypher oder SPARQL beschreiben, **was** man will, nicht **wie** es gefunden wird. Das erlaubt der Datenbank, die Ausführung zu optimieren, etwa Indizes zu wählen oder zu parallelisieren, ohne dass sich die Abfrage ändert. Kleppmann vergleicht das mit CSS gegenüber JavaScript-Code, der Elemente von Hand durchläuft. Für Java-Entwickler ist das dieselbe Idee wie bei Streams gegenüber Schleifen, nur dass die Datenbank deutlich mehr optimieren kann.

### Einordnung

Das Kapitel ist für DDD-Leser besonders interessant: Ein Aggregat im Sinne von Evans ist im Grunde ein Dokument, das als Ganzes gelesen und geschrieben wird, während Verweise zwischen Aggregaten über IDs laufen. Kleppmann liefert damit die technische Begründung für Vernons Regel, Aggregate klein zu halten und nur über ID zu verbinden.

## Speicherung und Abruf (Kapitel 4)

Dieses Kapitel öffnet die Datenbank und zeigt, wie Daten auf der Festplatte liegen. Man muss keine eigene Datenbank schreiben, aber wer weiß, wie Speicher-Engines arbeiten, kann die richtige auswählen und versteht ihr Verhalten unter Last.

### Die einfachste Datenbank der Welt

Kleppmann beginnt mit zwei Shell-Funktionen: Schreiben hängt eine Zeile an eine Datei an, Lesen sucht den letzten Eintrag zu einem Schlüssel. Schreiben ist extrem schnell, weil nur angehängt wird. Lesen ist langsam, weil die ganze Datei durchsucht wird. Ein **Index** macht Lesen schnell, verlangsamt aber jedes Schreiben. Diese Abwägung zieht sich durch das ganze Kapitel.

### Zwei große Familien

|  | LSM-Bäume | B-Bäume |
|---|---|---|
| Grundidee | Schreibzugriffe sammeln, sortiert als unveränderliche Dateien ablegen, im Hintergrund zusammenführen | Daten in Seiten fester Größe, die an Ort und Stelle aktualisiert werden |
| Schreiben | sehr schnell, sequenziell | langsamer, oft zufällige Zugriffe |
| Lesen | muss eventuell mehrere Dateien prüfen; Bloom-Filter helfen | vorhersehbar, ein Pfad durch den Baum |
| Platzbedarf | gute Kompression | Fragmentierung |
| Risiko | Hintergrund-Kompaktierung kann Latenzspitzen verursachen | Schreibverstärkung durch Seitenaktualisierung |
| Beispiele | RocksDB, LevelDB, Cassandra, ScyllaDB | fast alle relationalen Datenbanken, etwa PostgreSQL, MySQL/InnoDB, Oracle |

Beide nutzen ein **Write-Ahead-Log**, um nach einem Absturz keine Daten zu verlieren.

### Weitere Indexarten

- **Sekundärindizes** auf Nicht-Schlüssel-Spalten
- **Clustered Index:** die Daten selbst liegen im Index
- **Covering Index:** enthält alle Spalten, die eine Abfrage braucht
- **Mehrspaltige Indizes**, etwa für Geodaten
- **Volltextindizes** für unscharfe Suche
- **In-Memory-Datenbanken**, die nicht schneller sind, weil sie nicht von der Festplatte lesen, sondern weil sie Daten nicht für die Festplatte kodieren müssen

Nach Berichten zur zweiten Auflage kommen dort Themen wie Vektorindizes für Embeddings hinzu, wie sie für KI-Anwendungen gebraucht werden.

### Transaktion oder Analyse

Für analytische Abfragen, die wenige Spalten über Millionen Zeilen lesen, sind zeilenorientierte Speicher ungeeignet. **Spaltenorientierte Speicherung** legt jede Spalte getrennt ab. Das hat drei Vorteile: Man liest nur die benötigten Spalten, gleichartige Werte lassen sich sehr gut komprimieren, und moderne Prozessoren können sie effizient verarbeiten. Beispiele sind Parquet, ClickHouse, Snowflake oder BigQuery.

Dazu kommen **materialisierte Sichten** und **Datenwürfel**, die häufig gebrauchte Aggregate vorab berechnen.

### Einordnung

Für Java-Entwickler ist das Kapitel vor allem eine Erklärung dafür, warum dieselbe JPA-Abfrage auf verschiedenen Datenbanken sehr unterschiedlich schnell sein kann, warum Indizes Schreibzugriffe verlangsamen und warum eine Auswertung auf der Produktionsdatenbank das Tagesgeschäft lahmlegen kann. Es ist McConnells Rat „erst verstehen, dann messen, dann optimieren“ auf Datenbankebene.

## Kodierung und Evolution (Kapitel 5)

Software ändert sich ständig, und mit ihr die Daten. In einem laufenden System existieren alte und neue Versionen des Codes und der Daten gleichzeitig, etwa während eines schrittweisen Deployments oder weil Daten in der Datenbank älter sind als der Code, der sie liest. Die Frage ist, wie man damit umgeht, ohne dass etwas bricht.

### Zwei Richtungen der Kompatibilität

| Art | Bedeutung | Beispiel |
|---|---|---|
| **Rückwärtskompatibel** | Neuer Code kann Daten lesen, die alter Code geschrieben hat. | Eine neue Version liest Datensätze aus dem letzten Jahr. |
| **Vorwärtskompatibel** | Alter Code kann Daten lesen, die neuer Code geschrieben hat. | Während eines Rollouts liest ein noch nicht aktualisierter Knoten eine Nachricht im neuen Format. |

Vorwärtskompatibilität ist die schwierigere, weil alter Code neue Felder ignorieren muss, ohne sie zu verlieren.

### Kodierungsformate

| Format | Einschätzung |
|---|---|
| **Sprachspezifisch** (Java Serialization, Pickle) | an eine Sprache gebunden, Sicherheitsrisiken, schlechte Versionierung. Kleppmann rät davon ab, genau wie Bloch in Item 85. |
| **JSON, XML, CSV** | lesbar und verbreitet, aber unscharf: Zahlen ohne Präzisionsangabe, keine Binärdaten, Schemas optional |
| **Thrift, Protocol Buffers** | binär, kompakt, mit Schema. Felder haben **Nummern**, über die sich Felder hinzufügen oder entfernen lassen, ohne alte Daten unlesbar zu machen. |
| **Avro** | binär, Schema des Schreibers und des Lesers werden abgeglichen; gut für dynamisch erzeugte Schemas, etwa aus Datenbanktabellen |

```java
// Vorwärtskompatibilität mit JSON in Java: unbekannte Felder ignorieren
@JsonIgnoreProperties(ignoreUnknown = true)
record OrderEvent(String orderId, BigDecimal total) {}

// Rückwärtskompatibilität: neues Feld darf in alten Daten fehlen
record OrderEventV2(String orderId, BigDecimal total, String currency) {
    OrderEventV2 { if (currency == null) currency = "EUR"; }
}
```

Bei Protocol Buffers gilt die einfache Regel: **Feldnummern nie wiederverwenden**, neue Felder optional machen, entfernte Nummern reservieren.

### Wege, auf denen Daten fließen

Kleppmann unterscheidet drei Arten, wie kodierte Daten zwischen Prozessen wandern:

- **Über Datenbanken:** Der Schreibende sendet gewissermaßen eine Nachricht an sein zukünftiges Selbst. Daten leben oft viel länger als Code; der Leitsatz lautet, dass Daten den Code überdauern.
- **Über Dienste:** REST und RPC. Kleppmann warnt davor, entfernte Aufrufe wie lokale zu behandeln: Sie können fehlschlagen, langsam sein, doppelt ankommen oder in unklarem Zustand enden. Eine lokale Methode tut das nicht.
- **Über asynchrone Nachrichten:** Message Broker wie Kafka oder RabbitMQ entkoppeln Sender und Empfänger, puffern bei Ausfällen und erlauben mehrere Empfänger.

### Einordnung

Das Kapitel ist im Kern Becks „Migrate Data“ und „New Interface, Old Implementation“ auf Systemebene: Änderungen so gestalten, dass alte und neue Versionen eine Zeitlang nebeneinander funktionieren. Es ist auch die technische Voraussetzung für das, was Accelerate fordert: unabhängige Deployments sind nur möglich, wenn sich Formate kompatibel weiterentwickeln.

## Replikation (Kapitel 6)

Replikation heißt, dieselben Daten auf mehreren Rechnern zu halten: für Ausfallsicherheit, für geringere Latenz nahe am Nutzer und um Lesezugriffe zu verteilen. Schwierig wird es, weil sich die Daten ändern.

### Drei Grundmodelle

| Modell | Funktionsweise | Stärke | Schwäche | Beispiele |
|---|---|---|---|---|
| **Ein Leader** | Alle Schreibzugriffe gehen an einen Knoten, der sie an Follower weitergibt. | einfach, keine Schreibkonflikte | Leader ist Engpass und Ausfallpunkt | PostgreSQL, MySQL, MongoDB, Kafka |
| **Mehrere Leader** | Mehrere Knoten nehmen Schreibzugriffe an, etwa einer pro Rechenzentrum. | schreiben in jeder Region möglich, offlinefähig | Schreibkonflikte müssen aufgelöst werden | verteilte Datenbanken über Regionen, Offline-Apps, kollaborative Editoren |
| **Ohne Leader** | Clients schreiben an mehrere Knoten, lesen von mehreren und nutzen Quoren. | hohe Verfügbarkeit, keine Umschaltung nötig | schwächere Konsistenz, Konfliktauflösung | Cassandra, ScyllaDB, ursprünglich Dynamo |

### Synchron oder asynchron

Bei **synchroner** Replikation bestätigt der Leader einen Schreibzugriff erst, wenn ein Follower ihn hat. Das ist sicher, aber ein langsamer Follower blockiert alles. Bei **asynchroner** Replikation bestätigt er sofort, und Daten können bei einem Ausfall verloren gehen. In der Praxis ist oft ein Follower synchron, der Rest asynchron.

### Probleme durch Replikationsverzögerung

Wenn Follower hinterherhinken, sehen Nutzer seltsame Dinge. Kleppmann beschreibt drei Garantien, die man dagegen braucht:

| Problem | Garantie | Beispiel |
|---|---|---|
| Ein Nutzer sieht seine eigene Änderung nicht | **Read-your-writes** | Profil gespeichert, nach dem Neuladen aber alter Stand |
| Daten springen zurück in der Zeit | **Monotone Lesezugriffe** | Kommentar erscheint, verschwindet beim nächsten Aufruf wieder |
| Ursache und Wirkung in falscher Reihenfolge | **Konsistentes Präfix** | Antwort erscheint vor der Frage |

Viele Anwendungen ignorieren diese Probleme, bis sie unter Last auftreten.

### Konflikte

Bei mehreren Leadern oder ohne Leader können zwei Knoten denselben Datensatz gleichzeitig ändern. Lösungen:

- **Last Write Wins:** Der Schreibzugriff mit dem späteren Zeitstempel gewinnt. Einfach, aber Daten gehen still verloren, und Zeitstempel sind unzuverlässig.
- **Zusammenführen** durch Anwendungslogik.
- **CRDTs** (Conflict-free Replicated Data Types): Datenstrukturen, die sich mathematisch garantiert konfliktfrei zusammenführen lassen, etwa Zähler, Mengen oder Texte. Das ist Kleppmanns eigenes Forschungsgebiet, und die zweite Auflage behandelt nach Berichten auch local-first-Software, die darauf aufbaut.

### Quoren

Ohne Leader schreibt man an w Knoten und liest von r Knoten. Wenn w plus r größer ist als die Gesamtzahl n, überlappen sich Lese- und Schreibmengen, und man liest mindestens einen aktuellen Wert. Kleppmann zeigt aber, dass das in Randfällen trotzdem keine starke Konsistenz garantiert, etwa bei gleichzeitigen Schreibzugriffen oder ausgefallenen Knoten.

### Einordnung

Für Anwendungsentwickler ist die wichtigste Lehre: Eine replizierte Datenbank verhält sich nicht wie eine einzelne. Wer von einem Follower liest, muss mit veralteten Daten rechnen. Viele Fehler in Anwendungen mit Lese-Replikaten oder Caches lassen sich mit den drei Garantien oben erklären.

## Sharding (Kapitel 7)

Replikation verteilt **Kopien** derselben Daten. Sharding verteilt **verschiedene** Daten auf verschiedene Knoten, damit Datenmenge und Last wachsen können, ohne dass ein einzelner Rechner zum Engpass wird. In der ersten Auflage hieß das Kapitel „Partitioning“; die zweite verwendet den in der Praxis üblicheren Begriff Sharding. In echten Systemen werden beide kombiniert: Jeder Shard wird zusätzlich repliziert.

### Wie verteilt man?

| Verfahren | Funktionsweise | Stärke | Schwäche |
|---|---|---|---|
| **Nach Schlüsselbereich** | Jeder Shard bekommt einen zusammenhängenden Bereich, etwa A–F, G–M | Bereichsabfragen sind effizient | **Hotspots**, wenn viele Zugriffe in einen Bereich fallen, etwa bei Zeitstempeln als Schlüssel |
| **Nach Hash des Schlüssels** | Ein Hash bestimmt den Shard | gleichmäßige Verteilung | Bereichsabfragen müssen alle Shards befragen |

Selbst gute Hashverteilung hilft nicht gegen einzelne extrem gefragte Schlüssel, etwa das Konto eines Prominenten. Dafür braucht es Anwendungslogik, etwa einen Schlüssel künstlich auf mehrere aufzuteilen.

### Sekundärindizes

Ein Index auf ein Nicht-Schlüssel-Feld, etwa „alle roten Autos“, passt schlecht zum Sharding:

- **Lokaler Index:** Jeder Shard indiziert nur seine eigenen Daten. Schreiben ist einfach, aber eine Suche muss alle Shards fragen.
- **Globaler Index:** Der Index selbst wird nach dem indizierten Wert verteilt. Lesen ist effizient, aber jeder Schreibzugriff kann mehrere Shards betreffen.

### Umverteilen

Wenn Knoten hinzukommen oder ausfallen, müssen Daten wandern. Kleppmann warnt vor dem naheliegenden Ansatz, den Shard als Hash modulo Knotenzahl zu berechnen: Bei jeder Änderung der Knotenzahl müssten fast alle Daten umziehen. Besser ist eine feste, große Zahl von Shards, die als Ganzes zwischen Knoten verschoben werden, oder dynamisches Aufteilen und Zusammenlegen.

Umverteilung kann automatisch oder manuell geschehen. Kleppmann empfiehlt, einen Menschen zu beteiligen: Automatische Umverteilung kann sich mit automatischer Fehlererkennung zu Kaskaden aufschaukeln, wenn ein überlasteter Knoten fälschlich als ausgefallen gilt.

### Anfragen weiterleiten

Wer weiß, welcher Knoten welchen Shard hat? Möglich sind: jeder Knoten leitet weiter, eine eigene Routing-Schicht, oder der Client kennt die Zuordnung. Viele Systeme nutzen dafür einen Koordinationsdienst wie ZooKeeper oder etcd, der wiederum auf Konsens beruht, siehe Kapitel 10.

### Einordnung

Sharding ist das technische Gegenstück zu Evans' Bounded Contexts und Becks Kohäsion: Was zusammen gelesen und geschrieben wird, sollte zusammen liegen. Ein schlecht gewählter Shard-Schlüssel erzeugt dieselben Probleme wie eine schlecht gewählte Aggregatgrenze, nur auf Infrastrukturebene: Abfragen über viele Shards, verteilte Transaktionen und Hotspots.

## Transaktionen (Kapitel 8)

Für Anwendungsentwickler vielleicht das wichtigste Kapitel. Es zeigt, dass „wir nutzen Transaktionen“ weit weniger Schutz bedeutet, als die meisten annehmen.

### Was ACID wirklich heißt

| Buchstabe | Bedeutung laut Kleppmann |
|---|---|
| **A**tomarität | Alles oder nichts: Bei einem Fehler wird die Transaktion vollständig zurückgenommen. Besser wäre der Name „Abbrechbarkeit“. |
| **C**onsistency | Eigentlich eine Eigenschaft der **Anwendung**, nicht der Datenbank: Invarianten müssen vom Code gewahrt werden. |
| **I**solation | Gleichzeitige Transaktionen beeinflussen sich nicht, und zwar **so stark, wie die gewählte Isolationsstufe es garantiert**. |
| **D**auerhaftigkeit | Bestätigte Daten gehen nicht verloren, im Rahmen dessen, was Hardware und Replikation leisten. |

Der kritische Punkt ist Isolation: Die meisten Datenbanken laufen standardmäßig **nicht** mit voller Serialisierbarkeit.

### Isolationsstufen und ihre Lücken

| Stufe | Verhindert | Verhindert nicht |
|---|---|---|
| Read Committed (Standard etwa in PostgreSQL und Oracle) | Lesen nicht bestätigter Daten, Überschreiben nicht bestätigter Daten | Lesen inkonsistenter Zwischenstände, verlorene Updates, Write Skew |
| Snapshot Isolation (oft „Repeatable Read“ genannt) | inkonsistentes Lesen, weil jede Transaktion einen festen Schnappschuss sieht | verlorene Updates (je nach Datenbank), Write Skew, Phantome |
| Serialisierbar | alles: Ergebnis wie bei Ausführung nacheinander | – |

Kleppmann warnt, dass die Namen nicht einheitlich sind: Was eine Datenbank „Serializable“ nennt, ist bei manchen Herstellern nur Snapshot Isolation.

### Verlorene Updates

Das häufigste Problem in Java-Anwendungen: Zwei Anfragen lesen denselben Wert, ändern ihn und schreiben ihn zurück. Eine Änderung geht verloren.

```java
// anfällig: lesen, ändern, schreiben
@Transactional
void addToCart(long cartId, Item item) {
    Cart cart = repository.findById(cartId).orElseThrow();
    cart.add(item);                 // zwei parallele Aufrufe: einer überschreibt den anderen
}

// Lösung 1: optimistische Sperre mit Versionsfeld
@Entity class Cart { @Version long version; … }   // Konflikt wirft OptimisticLockException

// Lösung 2: pessimistische Sperre, entspricht SELECT ... FOR UPDATE
@Lock(LockModeType.PESSIMISTIC_WRITE)
Optional<Cart> findWithLockById(long id);

// Lösung 3: atomare Operation in der Datenbank
@Modifying @Query("update Account a set a.balance = a.balance - :amt where a.id = :id")
int debit(long id, BigDecimal amt);
```

### Write Skew: der unterschätzte Fehler

Zwei Transaktionen lesen dieselben Daten, prüfen eine Bedingung und ändern dann **verschiedene** Datensätze. Einzeln ist jede korrekt, zusammen verletzen sie eine Invariante. Snapshot Isolation verhindert das nicht.

```java
// Invariante: Es muss immer mindestens ein Admin bleiben.
@Transactional
void removeAdminRole(long userId) {
    long admins = userRepository.countByRole(ADMIN);
    if (admins > 1) {                                 // beide Transaktionen sehen 2 Admins
        userRepository.findById(userId).orElseThrow().removeRole(ADMIN);
    }
}
// Zwei Admins entfernen sich gleichzeitig selbst: Danach gibt es keinen mehr.
```

Lösungen sind Serialisierbarkeit, eine explizite Sperre auf alle beteiligten Zeilen oder ein künstlicher Datensatz, auf den beide Transaktionen schreiben müssen und der so den Konflikt sichtbar macht. Kleppmanns eigenes Beispiel sind Ärzte im Bereitschaftsdienst, die sich gleichzeitig abmelden.

### Wege zur Serialisierbarkeit

| Verfahren | Idee | Abwägung |
|---|---|---|
| Tatsächlich nacheinander | ein einzelner Thread führt alle Transaktionen aus | nur mit kurzen Transaktionen und Daten im Speicher praktikabel |
| Zwei-Phasen-Sperren (2PL) | Leser blockieren Schreiber und umgekehrt | korrekt, aber langsam und anfällig für Deadlocks |
| Serializable Snapshot Isolation (SSI) | optimistisch ausführen, Konflikte beim Bestätigen erkennen und abbrechen | gute Leistung bei wenig Konflikten; etwa in PostgreSQL |

### Einordnung

Dieses Kapitel gehört zu den praktisch wertvollsten der ganzen Reihe. Viele Fehler, die in Tests nie auftreten und in Produktion unter Last sporadisch erscheinen, sind verlorene Updates oder Write Skew. Für Java-Entwickler mit JPA und Spring lohnt es sich, die Standard-Isolationsstufe der eigenen Datenbank zu kennen und kritische Invarianten bewusst abzusichern, statt sich auf `@Transactional` zu verlassen.

## Probleme verteilter Systeme (Kapitel 9)

Ein bewusst pessimistisches Kapitel. Kleppmann zählt alles auf, was in verteilten Systemen schiefgehen kann, damit man aufhört, es zu ignorieren. Die zentrale Erkenntnis: In einem verteilten System kann **ein Teil ausfallen, während der Rest weiterläuft**, und oft weiß niemand genau, was passiert ist.

### Unzuverlässige Netzwerke

Wenn eine Anfrage keine Antwort bekommt, weiß man nicht, ob sie nie angekommen ist, ob der Empfänger abgestürzt ist, ob er sie verarbeitet hat und nur die Antwort verloren ging, oder ob alles nur langsam ist. Der einzige Ausweg sind **Timeouts**, und deren Länge ist immer ein Kompromiss zwischen zu frühem und zu spätem Erkennen.

### Unzuverlässige Uhren

- **Uhrzeit** (`System.currentTimeMillis()`) kann springen, etwa bei NTP-Korrekturen, und auf verschiedenen Rechnern voneinander abweichen.
- **Monotone Uhren** (`System.nanoTime()`) eignen sich für Dauern auf einem Rechner, nicht für Vergleiche zwischen Rechnern.

Wer Ereignisse über Zeitstempel verschiedener Rechner ordnet, etwa für „Last Write Wins“, kann still Daten verlieren. Googles Spanner löst das mit GPS- und Atomuhren und Zeit-**Intervallen** statt Zeitpunkten.

### Prozesspausen: ein Java-Thema

Ein Prozess kann jederzeit für unbestimmte Zeit stehen bleiben: durch eine **Garbage-Collection-Pause**, eine angehaltene virtuelle Maschine, Paging oder einen überlasteten Rechner. Nach der Pause macht er weiter, als wäre nichts gewesen.

```java
// gefährlich: Lease geprüft, dann lange GC-Pause, dann geschrieben
if (lease.isValid()) {           // gültig um 10:00:00
    // ... 15 Sekunden GC-Pause ...
    storage.write(data);         // Lease ist längst abgelaufen, ein anderer Knoten hält sie
}

// Lösung: Fencing Token, eine mit jeder Lease steigende Nummer
storage.write(data, lease.token());   // Speicher lehnt Schreibzugriffe mit veraltetem Token ab
```

Die Lektion: Ein Knoten darf seiner eigenen Einschätzung nicht trauen. **Die Wahrheit bestimmt die Mehrheit**, nicht der einzelne Knoten.

## Konsistenz und Konsens (Kapitel 10)

### Linearisierbarkeit

Die stärkste übliche Garantie: Das System verhält sich so, als gäbe es nur **eine einzige Kopie** der Daten, und jede Operation wirkt zu einem bestimmten Zeitpunkt. Sobald ein Schreibzugriff bestätigt ist, sehen alle Leser den neuen Wert. Man braucht das etwa für Leader-Wahl, eindeutige Benutzernamen oder Sperren. Es kostet aber Latenz und Verfügbarkeit.

### Kritik am CAP-Theorem

Das CAP-Theorem besagt verkürzt, dass man bei einer Netzwerkpartition zwischen Konsistenz und Verfügbarkeit wählen muss. Kleppmann hält es für wenig hilfreich: Es betrachtet nur eine Art von Fehler, definiert Konsistenz sehr eng als Linearisierbarkeit und sagt nichts über Latenz. Er empfiehlt, statt in CAP-Kategorien über konkrete Garantien und ihre Kosten zu sprechen.

### Ordnung und Kausalität

Viele Probleme lassen sich mit einer schwächeren Garantie lösen: **Kausalität**. Wenn A B verursacht hat, müssen alle A vor B sehen. Was unabhängig ist, darf in beliebiger Reihenfolge erscheinen. **Lamport-Zeitstempel** liefern eine solche Ordnung ohne synchronisierte Uhren.

### Verteilte Transaktionen und Konsens

- **Two-Phase Commit (2PC):** Ein Koordinator fragt alle Beteiligten, ob sie bereit sind, und entscheidet dann. Fällt der Koordinator zur falschen Zeit aus, bleiben alle blockiert. XA-Transaktionen in Java EE beruhen darauf und sind entsprechend gefürchtet.
- **Konsens:** Mehrere Knoten einigen sich auf einen Wert, auch wenn einige ausfallen, solange eine Mehrheit erreichbar ist. Bekannte Algorithmen sind Paxos, Zab und **Raft**, den John Ousterhout mitentwickelt hat.
- **Koordinationsdienste** wie ZooKeeper oder etcd stellen Konsens als Dienst bereit, für Leader-Wahl, Konfiguration und Sperren. Die meisten Anwendungen sollten Konsens nicht selbst implementieren, sondern einen solchen Dienst nutzen.

### Einordnung

Diese beiden Kapitel erklären, warum McConnells Satz „Programme werden mit wachsender Größe fehleranfälliger“ für verteilte Systeme besonders gilt, und warum das neue erste Kapitel der zweiten Auflage dazu rät, Verteilung nur einzusetzen, wenn sie wirklich nötig ist.

## Abgeleitete Daten

Der dritte Teil unterscheidet zwei Arten von Daten: **Systems of Record**, die maßgebliche Quelle, und **abgeleitete Daten**, die daraus berechnet werden, etwa Caches, Suchindizes, Auswertungen oder Empfehlungen. Abgeleitete Daten lassen sich jederzeit neu erzeugen, wenn man die Quelle hat. Diese Unterscheidung ist der Schlüssel zum ganzen Teil.

## Batch-Verarbeitung (Kapitel 11)

Kleppmann beginnt bei der **Unix-Philosophie**: kleine Werkzeuge, die eine Sache gut machen und über eine einheitliche Schnittstelle, Textströme, kombiniert werden. Eine Pipeline aus `cat`, `sort`, `uniq` und `head` kann erstaunlich viel leisten.

Von dort führt er über **MapReduce**, das dieselbe Idee auf Tausende Rechner übertrug, zu modernen **Dataflow-Engines** wie Spark und Flink, die Zwischenergebnisse im Speicher halten und ganze Ablaufgraphen optimieren. Die zentralen Eigenschaften:

- **Eingaben bleiben unverändert**, Ausgaben sind neue Daten.
- **Fehler sind harmlos:** Man startet den Job einfach neu.
- **Joins im Großen:** Sort-Merge-Joins, Broadcast-Joins für kleine Tabellen, partitionierte Joins.

Nach Berichten zur zweiten Auflage verlagert sich der Schwerpunkt hier von Hadoop hin zu Cloud-Data-Warehouses, Object Storage und DataFrame-orientierten Werkzeugen.

## Stream-Verarbeitung (Kapitel 12)

Ein Stream ist ein Batch, der nie endet. Kleppmann behandelt:

### Nachrichtensysteme

| Art | Verhalten | Beispiel |
|---|---|---|
| Klassischer Broker | Nachricht wird nach Bestätigung gelöscht; Verbraucher teilen sich die Arbeit | RabbitMQ, JMS-Broker |
| Log-basierter Broker | Nachrichten bleiben in einem Log erhalten; jeder Verbraucher merkt sich seine Position | Kafka, Pulsar |

Log-basierte Broker erlauben, Ereignisse erneut abzuspielen, etwa um einen neuen Dienst mit historischen Daten zu befüllen.

### Datenbanken als Streams

- **Change Data Capture:** Änderungen einer Datenbank werden als Strom von Ereignissen ausgelesen, etwa mit Debezium, und halten Suchindizes oder Caches aktuell.
- **Event Sourcing:** Die Anwendung speichert nicht den aktuellen Zustand, sondern alle Ereignisse, die zu ihm geführt haben. Der Zustand ist abgeleitet.
- **Unveränderlichkeit:** Ereignisse werden nie geändert, nur ergänzt. Das macht Fehlersuche, Prüfung und Neuberechnung einfacher.

### Zeit in Streams

Der Unterschied zwischen **Ereigniszeit**, wann etwas passiert ist, und **Verarbeitungszeit**, wann es verarbeitet wird, ist zentral. Verspätete Ereignisse, Zeitfenster und Joins zwischen Strömen sind schwieriger, als sie aussehen.

### Genau einmal

Echte „Exactly-once“-Verarbeitung gibt es nicht; was es gibt, ist **effektiv einmal**, durch Checkpoints und vor allem durch **Idempotenz**:

```java
// idempotenter Verbraucher: doppelte Zustellung ist harmlos
@Transactional
void onPaymentReceived(PaymentEvent e) {
    if (processedEvents.existsById(e.eventId())) return;   // schon verarbeitet
    accounts.credit(e.accountId(), e.amount());
    processedEvents.save(new ProcessedEvent(e.eventId()));  // in derselben Transaktion
}
```

## Eine Philosophie des Streamings (Kapitel 13, neu als eigenes Kapitel)

In der ersten Auflage standen diese Gedanken im Abschlusskapitel „The Future of Data Systems“. Nach den verfügbaren Informationen bekommen sie in der zweiten Auflage ein eigenes Kapitel. Die Kernideen:

- **Die Datenbank entbündeln:** Statt einer Datenbank, die alles kann, verbindet man spezialisierte Systeme, Speicher, Index, Cache, Suche, über einen gemeinsamen Ereignisstrom. Jedes ist abgeleitete Sicht auf dasselbe Log.
- **Anwendungen um Datenflüsse bauen:** Zustand ist das Ergebnis einer Funktion über die Ereignisse, ähnlich wie bei einer Tabellenkalkulation, die sich bei Änderungen selbst neu berechnet.
- **Das End-to-End-Argument:** Korrektheit muss am Ende der Kette sichergestellt werden, etwa durch eindeutige Anfrage-IDs, nicht nur durch einzelne Komponenten.
- **Aktualität gegen Integrität:** Daten dürfen kurz veraltet sein, aber nie falsch. Integrität ist wichtiger als Aktualität.
- **Vertrauen, aber prüfen:** Systeme sollten ihre eigene Korrektheit regelmäßig überprüfen.

### Einordnung

Hier treffen sich viele Fäden der Reihe: Weidigs Unveränderlichkeit und Transformationen, Thomas' und Hunts „Programme sind Transformationen“, Evans' Domain Events und Event Sourcing, und Becks Unterscheidung zwischen umkehrbaren und unumkehrbaren Änderungen, denn abgeleitete Daten lassen sich immer neu berechnen.

## Das Richtige tun (Kapitel 14, neu als eigenes Kapitel)

Schon die erste Auflage endete mit einem Abschnitt über Ethik. Die zweite Auflage macht daraus ein eigenes Kapitel und behandelt nach Berichten auch rechtliche Fragen wie Datenschutz und Regulierung ausführlicher. Für ein technisches Buch dieser Art ist das ungewöhnlich, und Kleppmann begründet es: Wer Datensysteme baut, trifft Entscheidungen mit Folgen für Menschen, und kann die Verantwortung dafür nicht an das Management oder die Rechtsabteilung abgeben.

### Vorhersagende Systeme

Algorithmen entscheiden zunehmend über Kredite, Versicherungen, Bewerbungen oder Polizeieinsätze. Kleppmann nennt drei Gefahren:

- **Verzerrung und Diskriminierung:** Systeme, die aus historischen Daten lernen, übernehmen deren Vorurteile, oft unsichtbar.
- **Fehlende Verantwortlichkeit:** Wenn ein Algorithmus entscheidet, ist unklar, wer für Fehler einsteht und wie Betroffene widersprechen können.
- **Rückkopplungsschleifen:** Wer einmal als Risiko eingestuft wird, hat schlechtere Chancen und wird dadurch erst recht zum Risiko.

### Daten und Überwachung

Kleppmann schlägt ein Gedankenexperiment vor: Man ersetze in Sätzen über datengetriebene Geschäftsmodelle das Wort „Daten“ durch „Überwachung“. Aus „Wir sammeln Nutzungsdaten, um das Produkt zu verbessern“ wird ein Satz, der deutlich weniger harmlos klingt. Die Übung zeigt, wie sehr technische Sprache die Wirkung von Datensammlung verschleiert.

### Einwilligung und Wahlfreiheit

Nutzer stimmen Datennutzung oft formal zu, ohne zu verstehen, was geschieht, und ohne echte Alternative, wenn ein Dienst gesellschaftlich unverzichtbar ist. Kleppmann hält deshalb Einwilligung allein für keine ausreichende Rechtfertigung.

### Daten als Gefahrgut

Ein eindrückliches Bild: Gespeicherte persönliche Daten sind wie **Giftmüll**. Sie können durchsickern, gestohlen werden oder bei einem Wechsel des Eigentümers, der Regierung oder des Geschäftsmodells für andere Zwecke missbraucht werden. Daraus folgt der Grundsatz der **Datensparsamkeit**: nur sammeln, was man braucht, nur so lange aufbewahren, wie nötig, und Löschung von Anfang an mitdenken.

### Einordnung

In einem Umfeld mit DSGVO und, im Finanzbereich, dem europäischen DORA-Regelwerk sind diese Fragen keine reine Ethik mehr, sondern auch Recht. Das Kapitel verbindet sich mit Becks Unterscheidung von umkehrbaren und unumkehrbaren Änderungen: Ein Datenleck ist das Unumkehrbarste, was einem System passieren kann. Und es knüpft an Thomas' und Hunts letzten Gedanken an, die eigene Arbeit zu signieren: Wer Systeme baut, steht für ihre Wirkung ein.

## Kritik und Einordnung

DDIA gilt vielen als das wichtigste technische Buch der letzten zehn Jahre. Kritik gibt es wenig, und sie betrifft eher Zuschnitt und Umfang als Inhalt.

### Stärken

- **Prinzipien statt Produkte:** Wer das Buch gelesen hat, kann jede neue Datenbank anhand weniger Fragen einordnen: Welches Datenmodell, welche Speicher-Engine, welche Replikation, welche Isolationsstufe?
- **Klarheit:** Schwierige Themen wie Isolationsstufen, Konsens oder Linearisierbarkeit werden mit Beispielen und Diagrammen verständlich, ohne an Genauigkeit zu verlieren.
- **Ehrlichkeit über Grenzen:** Kleppmann zeigt immer wieder, wo die Versprechen von Herstellern und Lehrbüchern in der Praxis nicht halten.
- **Forschungsnähe:** Hunderte Literaturverweise, die gepflegt und online aktualisiert werden.
- **Abwägungen statt Rezepte:** ganz im Geist von McConnell und Ousterhout.
- **Ethik ernst genommen**, und in der zweiten Auflage noch stärker.

### Kritikpunkte

**1. Umfang und Tiefe.** Rund 600 bis 650 Seiten dichter Stoff. Viele Leser lesen es nicht ganz, sondern kapitelweise nach Bedarf.

**2. Wenig Anleitung.** Das Buch erklärt, wie Systeme funktionieren und welche Abwägungen es gibt, aber selten, was man in einer konkreten Situation tun soll. Wer ein Rezept sucht, etwa „welche Datenbank für mein Projekt“, wird enttäuscht.

**3. Die erste Auflage alterte an den Rändern.** Hadoop, MapReduce und einige der genannten Systeme haben an Bedeutung verloren, Cloud, Object Storage, Serverless und Vektordatenbanken fehlten. Genau das soll die zweite Auflage beheben.

**4. Mehr Infrastruktur als Anwendung.** Wie man eine Anwendung auf diesen Systemen strukturiert, etwa mit Aggregaten, Repositories oder Service-Grenzen, bleibt weitgehend anderen Büchern überlassen.

**5. Betrieb kaum behandelt.** Monitoring, Kapazitätsplanung, Incident-Management und Kosten kommen nur am Rand vor. Dafür sind Bücher wie *Site Reliability Engineering* oder *Release It!* zuständig.

### Gesamturteil

DDIA ist das Fundament unter vielen anderen Büchern der Reihe: Was Evans als Aggregat modelliert, Accelerate als lose Kopplung misst und Beck als Kopplung ökonomisch begründet, findet hier seine technische Grundlage in Replikation, Sharding, Transaktionen und Datenflüssen. Für Java-Entwickler, die mit JPA, Kafka, Caches oder Cloud-Datenbanken arbeiten, ist besonders das Transaktionskapitel ein Gewinn, das viele schwer zu findende Fehler erklärt.

## Bezüge zur Reihe

DDIA liegt eine Ebene unter den meisten anderen Büchern: Sie fragen, wie Code und Teams strukturiert sein sollten, Kleppmann fragt, was die Systeme darunter garantieren und was nicht.

| Thema bei Kleppmann | Bezug in der Reihe |
|---|---|
| Zufällige gegen wesentliche Komplexität | McConnell mit Brooks; Ousterhout |
| Dokumentmodell und Lokalität | Evans: Aggregate als Einheit von Lesen und Schreiben; Vernon: Verweise über ID |
| Schema-Evolution, Rückwärts- und Vorwärtskompatibilität | Beck: Migrate Data, New Interface Old Implementation; Accelerate: unabhängige Deployments |
| Java-Serialisierung vermeiden | Bloch, Item 85 |
| Verlorene Updates, Write Skew | Evans: Invarianten im Aggregat; McConnell: Korrektheit vor Robustheit |
| Entfernte Aufrufe sind keine lokalen | Feathers und Ousterhout: Schnittstellen bewusst gestalten |
| Sharding und Kohäsion | Beck: Kopplung relativ zur Änderung; Evans: Bounded Contexts |
| Unveränderliche Ereignisse, abgeleitete Daten | Weidig: Unveränderlichkeit; Thomas und Hunt: Programme als Transformationen; Evans: Domain Events |
| Idempotenz und End-to-End-Argument | Thomas und Hunt: Design by Contract; Beck: Clean Check-in |
| Raft und Konsens | Ousterhout als Mitautor von Raft |
| Verteilung nur bei Bedarf | McConnell: Größe kostet; Accelerate: lose Kopplung statt Microservices um jeden Preis |
| Ethik und Datensparsamkeit | Thomas und Hunt: eigene Arbeit signieren |

## Diskussionsfragen

1. **Isolationsstufen:** Weißt du, mit welcher Isolationsstufe eure wichtigsten Datenbanken laufen? Habt ihr kritische Invarianten bewusst gegen verlorene Updates und Write Skew abgesichert?
2. **@Transactional:** Wie oft wird in euren Projekten `@Transactional` als Allheilmittel betrachtet, ohne über Nebenläufigkeit nachzudenken?
3. **Lese-Replikate und Caches:** Habt ihr Fehler erlebt, die sich mit Replikationsverzögerung erklären lassen, etwa „Änderung gespeichert, aber nicht sichtbar“?
4. **Verteilt oder nicht:** Welche eurer Systeme sind verteilt, obwohl ein einzelner, gut ausgestatteter Rechner gereicht hätte?
5. **Schema-Evolution:** Wie geht ihr mit Formatänderungen bei Ereignissen oder APIs um? Gibt es Regeln für Rückwärts- und Vorwärtskompatibilität?
6. **Event Sourcing:** Hältst du es für einen guten Standard oder für ein Spezialwerkzeug für bestimmte Domänen?
7. **GC-Pausen und Leases:** Spielen solche Effekte in euren Java-Systemen eine Rolle, etwa bei verteilten Sperren?
8. **Datensparsamkeit:** Welche Daten speichert ihr, ohne sie wirklich zu brauchen, und wer entscheidet darüber?
