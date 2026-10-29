+++
title = "Clean Code – Zusammenfassung und Einordnung"
description = "Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship (2008)"
date = 2026-10-29T14:44:21+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["clean-code-2008"]
+++

## Einleitung: Worum es geht

Die Kernthese des Buchs: Code wird viel öfter gelesen als geschrieben, deshalb ist Lesbarkeit kein Luxus, sondern der wichtigste Hebel für Produktivität. Unsauberer Code verlangsamt Teams schleichend, bis jede Änderung teuer und riskant wird.

Robert C. Martin, genannt „Uncle Bob“, war 2008 bereits bekannt als Mitautor des Agilen Manifests und als Erfinder der SOLID-Akronymik. Das Buch erschien in der Hochphase von Java, Extreme Programming und TDD. Diese Herkunft prägt es stark: Fast alle Beispiele sind Java, fast alle Annahmen stammen aus objektorientierten Enterprise-Projekten.

### Aufbau

Das Buch hat drei Teile:

1. **Prinzipien** (Kapitel 1–13): Namen, Funktionen, Kommentare, Formatierung, Objekte, Fehlerbehandlung, Grenzen, Tests, Klassen, Systeme, emergentes Design, Nebenläufigkeit. Einige Kapitel stammen von Koautoren wie James Grenning, Jeff Langr, Kevin Dean Wampler und Brett Schuchert.
2. **Fallstudien** (Kapitel 14–16): Martin refaktoriert Schritt für Schritt realen Code, darunter einen Kommandozeilen-Parser, einen Teil von JUnit und eine Datumsklasse aus einer Open-Source-Bibliothek.
3. **Katalog** (Kapitel 17): eine Liste von Code Smells und Heuristiken, die aus den Fallstudien abgeleitet ist.

Martin betont selbst, dass Teil 2 der eigentliche Kern ist. Wer nur die Regeln aus Teil 1 liest, bekommt eine Checkliste, aber nicht das Denken dahinter.

### Das Leitbild: Software Craftsmanship

Im ersten Kapitel lässt Martin bekannte Entwickler wie Bjarne Stroustrup, Grady Booch, Ward Cunningham und Michael Feathers beschreiben, was sauberen Code ausmacht. Die gemeinsame Linie: Sauberer Code ist fokussiert, tut das Erwartete ohne Überraschungen, ist leicht änderbar und zeigt, dass sich jemand Mühe gegeben hat.

Dazu kommt die **Pfadfinderregel**: Hinterlasse den Code immer etwas sauberer, als du ihn vorgefunden hast. Kleine, ständige Verbesserungen sollen verhindern, dass Code verrottet. Martins Bild für das Gegenteil ist das Team, das immer langsamer wird, bis jemand den großen Neuschreib fordert, der dann wieder im selben Chaos endet.

Der Ton ist moralisch: Unsauberer Code gilt als unprofessionell, und Termindruck ist für Martin keine Entschuldigung. Diese Haltung ist bis heute einer der Hauptgründe, warum das Buch so polarisiert.

## Aussagekräftige Namen

Ein Name soll beantworten, warum etwas existiert, was es tut und wie es benutzt wird. Braucht ein Name einen Kommentar, ist er schlecht gewählt.

### Die wichtigsten Regeln

- **Absicht offenlegen.** `int d` sagt nichts, `int elapsedTimeInDays` alles. Martins Beispiel ist eine kryptische Funktion über eine Liste von Arrays, die erst verständlich wird, als klar ist, dass es um Zellen eines Minesweeper-Felds geht und „4“ der Status „markiert“ bedeutet.
- **Keine Desinformation.** `accountList` nur dann, wenn es wirklich eine List ist. Namen, die sich nur minimal unterscheiden, führen in die Irre.
- **Sinnvolle Unterscheidungen.** `a1, a2` oder `ProductInfo` neben `ProductData` sind Rauschen. Wörter wie `Info`, `Data`, `Manager` tragen meist keine Bedeutung.
- **Aussprechbar und suchbar.** Man soll im Team über den Code reden können. Einbuchstabige Namen und Magic Numbers lassen sich nicht sinnvoll suchen. Die Länge eines Namens soll zur Größe seines Gültigkeitsbereichs passen: `i` in einer dreizeiligen Schleife ist in Ordnung.
- **Keine Kodierungen.** Ungarische Notation, `m_`-Präfixe für Member und `I` vor Interfaces lehnt Martin ab. Moderne IDEs und Typsysteme machen das überflüssig.
- **Keine mentalen Übersetzungen.** Der Leser soll nicht im Kopf `r` in „URL ohne Host“ umrechnen müssen.

### Klassen, Methoden, Vokabular

- Klassen und Objekte bekommen Substantive (`Customer`, `AddressParser`), Methoden Verben (`postPayment`, `deletePage`).
- **Ein Wort pro Konzept:** nicht `fetch`, `retrieve` und `get` für dasselbe. Umgekehrt kein Wortspiel, also nicht dasselbe Wort für unterschiedliche Konzepte.
- **Lösungs- und Problemdomäne:** Fachbegriffe der Informatik (`JobQueue`, `Visitor`) sind erlaubt, weil Entwickler sie verstehen. Wo es keinen gibt, nimmt man Begriffe aus der Fachdomäne.
- **Kontext herstellen:** `state` allein ist mehrdeutig, in einer Klasse `Address` ist es klar. Umgekehrt soll man nicht jedem Bezeichner ein überflüssiges Projektpräfix verpassen.

### Einordnung

Dieses Kapitel ist das am wenigsten umstrittene des ganzen Buchs. Gute Namen gelten praktisch überall als die billigste und wirksamste Maßnahme für lesbaren Code. Auch Ousterhout widmet dem Thema ein eigenes Kapitel und kommt zu ähnlichen Ergebnissen, betont aber stärker Präzision: Ein Name, der zu allgemein ist, sei genauso schädlich wie einer, der zu kryptisch ist.

Zwei Punkte sind gealtert. Die Ablehnung des `I`-Präfixes ist in C# bis heute Konvention und dort harmlos. Und die Regel zu langen Namen wird in Sprachen wie Go bewusst anders gelebt, wo kurze lokale Namen als idiomatisch gelten.

## Funktionen

Funktionen sollen klein sein, genau eine Sache tun und auf einer einzigen Abstraktionsebene arbeiten. Dieses Kapitel ist das einflussreichste und zugleich das umstrittenste des Buchs.

### Klein, und dann noch kleiner

Martin fordert Funktionen von selten mehr als 20 Zeilen, besser nur zwei bis vier. Blöcke in `if`, `else` oder `while` sollen idealerweise eine Zeile lang sein, nämlich ein Funktionsaufruf mit sprechendem Namen. Die Einrücktiefe soll eine oder zwei Ebenen nicht überschreiten.

### Eine Sache tun

Der Test dafür: Lässt sich aus der Funktion eine weitere Funktion mit einem sinnvollen Namen herausziehen, der nicht bloß den Inhalt nacherzählt, dann tut sie mehr als eine Sache. Teilt sich eine Funktion erkennbar in Abschnitte wie „Deklarationen, Initialisierung, Verarbeitung“, ist das ein Warnsignal.

### Eine Abstraktionsebene, Stepdown-Regel

In einer Funktion sollen nicht hochabstrakte Aufrufe wie `renderPage()` neben String-Verkettung auf Zeichenebene stehen. Der Code soll sich von oben nach unten lesen wie eine Folge von Absätzen: Jede Funktion wird von den Funktionen der nächsttieferen Ebene gefolgt. Martin nennt das die **Stepdown-Regel**.

### Switch-Anweisungen

Ein `switch` über einen Typ tut fast zwangsläufig mehrere Dinge und wiederholt sich an mehreren Stellen. Martin will ihn tief in einer Factory vergraben, die polymorphe Objekte erzeugt. Der Rest des Systems arbeitet dann nur noch mit Polymorphie.

### Argumente

| Anzahl | Bewertung bei Martin |
|---|---|
| 0 (niladisch) | ideal |
| 1 (monadisch) | gut |
| 2 (dyadisch) | akzeptabel, wenn natürlich geordnet wie `Point(x, y)` |
| 3 (triadisch) | möglichst vermeiden |
| mehr | nur mit sehr guter Begründung, besser ein Argument-Objekt |

Dazu kommen drei Verbote:

- **Flag-Argumente** wie `render(true)` verraten, dass die Funktion zwei Dinge tut. Besser zwei Funktionen.
- **Output-Argumente**, in die eine Funktion hineinschreibt, sind verwirrend. Der Zustand soll im Objekt selbst geändert werden.
- **Versteckte Seiteneffekte:** Eine Funktion `checkPassword`, die nebenbei eine Session initialisiert, lügt über das, was sie tut.

### Command-Query-Separation und Fehler

Eine Funktion soll entweder etwas tun oder etwas beantworten, nicht beides. `if (set("user", "bob"))` ist unklar: Wird geprüft oder gesetzt? Fehler signalisiert man mit Exceptions statt mit Rückgabecodes, und der `try`-Block soll in eine eigene Funktion, weil Fehlerbehandlung selbst „eine Sache“ ist.

### DRY und strukturierte Programmierung

Duplikation nennt Martin die Wurzel vieler Übel. Dijkstras Regel „ein Eingang, ein Ausgang“ hält er bei sehr kleinen Funktionen für unnötig, mehrere `return`-Anweisungen sind dort in Ordnung.

### Wie man dahin kommt

Wichtig und oft überlesen: Martin schreibt Funktionen nicht gleich so. Er schreibt sie zuerst lang und hässlich, deckt sie mit Tests ab und refaktoriert sie dann schrittweise. Die Regeln beschreiben das Ziel, nicht den ersten Entwurf.

### Einordnung

Die Grundideen haben gehalten: eine Abstraktionsebene, keine Flag-Argumente, keine versteckten Seiteneffekte, Command-Query-Separation. Die extreme Kleinheit wird dagegen breit kritisiert. Der Hauptvorwurf: Wer alles in Zwei-Zeiler zerlegt, verteilt die Logik auf Dutzende Methoden, und der Leser springt ständig hin und her. Martins eigene Beispiele verstoßen zudem gegen seine Regeln: Um Argumente zu sparen, legt er Zwischenwerte in Instanzfeldern ab, was genau die versteckten Seiteneffekte erzeugt, vor denen er warnt. Hier setzt Ousterhout mit seiner Kritik an „flachen“ Funktionen direkt an.

## Kommentare

Für Martin ist ein Kommentar meist ein Eingeständnis: Man hat es nicht geschafft, sich im Code verständlich auszudrücken. Kommentare veralten, weil niemand sie mitpflegt, und lügen dann.

Statt eines Kommentars über einer undurchsichtigen Bedingung soll man die Bedingung in eine Funktion mit sprechendem Namen auslagern. Aus `// prüft, ob Mitarbeiter Anspruch auf alle Leistungen hat` über einer verschachtelten Bedingung wird `if (employee.isEligibleForFullBenefits())`.

### Gute Kommentare

Martin lässt eine begrenzte Liste zu:

- rechtliche Hinweise wie Copyright und Lizenz
- informative Kommentare, etwa zum Format eines regulären Ausdrucks
- Erklärung der **Absicht** hinter einer Entscheidung
- Klarstellung, wenn man undurchsichtigen Fremdcode nicht ändern kann
- Warnungen vor Konsequenzen, etwa „dauert sehr lange“ oder „nicht threadsicher“
- TODO-Kommentare, sofern sie regelmäßig abgearbeitet werden
- Verstärkung, die etwas scheinbar Unwichtiges als wichtig markiert
- Javadoc für öffentliche APIs

### Schlechte Kommentare

Die Liste der Negativbeispiele ist deutlich länger: Gemurmel, das nur der Autor versteht; redundante Kommentare, die den Code nacherzählen; vorgeschriebene Javadoc für jede Getter-Methode; Änderungsjournale am Dateianfang, die in die Versionskontrolle gehören; Rauschen wie „Standardkonstruktor“; Positionsmarker und Banner; Kommentare hinter schließenden Klammern; Autorenvermerke; HTML in Kommentaren; Kommentare, die Informationen über weit entfernten Code enthalten.

Besonders scharf wird Martin bei **auskommentiertem Code**: Niemand traut sich, ihn zu löschen, und so bleibt er jahrelang liegen. Die Versionskontrolle erinnert sich ohnehin.

### Einordnung

Die Kritik an redundanten Kommentaren, Journalen und auskommentiertem Code ist heute Allgemeingut. Die Grundhaltung „Kommentare sind ein Versagen“ gilt dagegen als überzogen. Ousterhout widerspricht direkt: Gute Kommentare beschreiben genau das, was der Code nicht ausdrücken kann, also Absicht, Abstraktion, Annahmen, Begründungen und die Schnittstelle aus Sicht des Aufrufers. Wer gar nicht kommentiert, zwingt jeden Leser, die Implementierung zu lesen, um die Schnittstelle zu verstehen. Ein Methodenname kann zudem nur begrenzt viel transportieren.

## Formatierung

Formatierung ist Kommunikation, und ein Team sollte sich auf einen einheitlichen Stil einigen. Welcher es ist, hält Martin für zweitrangig.

### Vertikal

- **Zeitungsmetapher:** Oben steht die Schlagzeile, also der Klassenname und die abstraktesten Funktionen. Je weiter man nach unten liest, desto mehr Details.
- **Vertikale Offenheit:** Leerzeilen trennen Gedanken voneinander.
- **Vertikale Dichte:** Was eng zusammengehört, steht eng beieinander.
- **Vertikaler Abstand:** Variablen werden nahe ihrer Verwendung deklariert. Aufrufende Funktionen stehen über den aufgerufenen, damit man natürlich nach unten liest.
- **Dateigröße:** Martin zeigt Statistiken aus Projekten wie FitNesse, in denen die meisten Dateien unter 200 Zeilen liegen und kaum eine über 500. Er folgert, dass große Systeme aus kleinen Dateien bestehen können.

### Horizontal

Zeilen sollen kurz bleiben, Martin nennt etwa 120 Zeichen als Obergrenze. Leerzeichen um Operatoren zeigen Zusammenhänge, Einrückung zeigt Hierarchie. Auch kurze `if`-Blöcke sollen eingerückt werden, statt sie auf eine Zeile zu quetschen.

### Einordnung

Das Kapitel ist weitgehend erledigt, und zwar im positiven Sinn: Formatter wie Prettier, gofmt, Black oder rustfmt nehmen die Entscheidung heute komplett ab. Bestehen bleibt die Idee der Zeitungsmetapher und der Nähe zusammengehöriger Dinge. Die Dateigrößen-Statistik ist eine anekdotische Beobachtung, keine belastbare Regel.

## Objekte und Datenstrukturen

Objekte verbergen ihre Daten und bieten Verhalten an. Datenstrukturen legen ihre Daten offen und haben kein nennenswertes Verhalten. Beides hat seinen Platz, aber man soll es nicht vermischen.

### Abstraktion statt Getter und Setter

Ein Punkt mit öffentlichen `getX()` und `setX()` ist kaum mehr als eine Struktur mit privaten Feldern. Echte Abstraktion zeigt nicht, wie Daten gespeichert sind. Statt „gib mir Tankkapazität und Füllstand in Litern“ fragt man „wie voll ist der Tank in Prozent“.

### Die Daten-Objekt-Antisymmetrie

Der vielleicht klügste Gedanke des Kapitels:

|  | Prozeduraler Stil (Datenstrukturen + Funktionen) | Objektorientierter Stil (Objekte + Polymorphie) |
|---|---|---|
| Neue Funktion hinzufügen | leicht: eine neue Funktion, Strukturen bleiben unverändert | schwer: alle Klassen müssen angefasst werden |
| Neuen Typ hinzufügen | schwer: alle Funktionen müssen angefasst werden | leicht: eine neue Klasse |

Martins Beispiel sind geometrische Formen mit einer Flächenberechnung. Daraus folgt: Objektorientierung ist kein Allheilmittel. Wo eher neue Operationen dazukommen als neue Typen, ist prozeduraler Code die bessere Wahl. Das ist im Kern das „Expression Problem“, das in der Programmiersprachentheorie seit Langem diskutiert wird.

### Law of Demeter

Eine Methode soll nur mit ihren direkten Bekannten sprechen: dem eigenen Objekt, ihren Parametern, selbst erzeugten Objekten und den eigenen Feldern. Nicht mit den Objekten, die diese zurückgeben.

Ketten wie `ctxt.getOptions().getScratchDir().getAbsolutePath()` nennt Martin **Zugunglück**. Der Aufrufer weiß zu viel über die innere Struktur. Bei reinen Datenstrukturen ist das allerdings unproblematisch, denn die sollen ihre Struktur ja offenlegen. Das eigentliche Problem sind **Hybride**, halb Objekt, halb Datenstruktur, die die Nachteile beider Welten vereinen.

Martins Lösung im Beispiel: Man fragt, wozu der Aufrufer das Verzeichnis überhaupt braucht. Stellt sich heraus, dass er eine temporäre Datei anlegen will, dann bekommt das Kontextobjekt eine Methode genau dafür. Das Prinzip dahinter heißt oft „Tell, don't ask“.

### DTOs und Active Record

Data Transfer Objects sind reine Datenstrukturen und völlig legitim, etwa an der Grenze zur Datenbank oder zum Netzwerk. Active-Record-Objekte, die Datenbankzeilen abbilden, soll man ebenfalls als Datenstrukturen behandeln und keine Geschäftslogik hineinpacken. Die gehört in eigene Objekte.

### Einordnung

Das Kapitel ist kurz, aber erstaunlich gut gealtert. Die Antisymmetrie erklärt nebenbei, warum funktionale Sprachen mit algebraischen Datentypen und Pattern Matching so beliebt geworden sind: Sie machen den prozeduralen Pol sauber und typsicher. Records in Java, Data Classes in Kotlin und Python oder Structs in Rust sind genau die ehrlichen Datenstrukturen, die Martin von Objekten trennen will. Das Law of Demeter gilt weiter als nützliche Faustregel, wird aber bei Fluent-APIs und Builder-Ketten bewusst ignoriert, weil dort jede Methode dasselbe Objekt zurückgibt.

## Fehlerbehandlung

Fehlerbehandlung ist wichtig, darf aber die eigentliche Logik nicht verdecken. Das Kapitel stammt von Michael Feathers.

### Exceptions statt Rückgabecodes

Wer nach jedem Aufruf einen Fehlercode prüfen muss, verschachtelt den Code tief und vergisst die Prüfung leicht. Mit Exceptions steht der normale Ablauf zusammenhängend im `try`-Block, die Fehlerbehandlung getrennt davon.

### Try-Catch-Finally zuerst

Bei Code, der Exceptions werfen kann, soll man mit dem `try-catch-finally` beginnen. Der `try`-Block definiert eine Art Transaktion: Was immer darin passiert, das Programm muss danach in einem konsistenten Zustand sein. Tests, die gezielt die Exception erzwingen, helfen, diese Struktur zuerst festzulegen.

### Unchecked Exceptions

Feathers plädiert gegen Javas Checked Exceptions. Sein Argument: Wirft eine Methode tief unten eine neue Checked Exception, müssen alle Signaturen bis zur Stelle der Behandlung geändert werden. Das verletzt das Open-Closed-Prinzip und koppelt Schichten aneinander. Für kritische Bibliotheken können sie sinnvoll sein, in normaler Anwendungsentwicklung überwiegen die Kosten.

### Kontext und eigene Exception-Klassen

- Jede Exception soll genug Kontext mitbringen: welche Operation schiefging und warum.
- Exception-Klassen definiert man nach den **Bedürfnissen des Aufrufers**, nicht nach der Fehlerquelle. Wirft eine Drittanbieter-API fünf verschiedene Exceptions, die der Aufrufer alle gleich behandelt, wickelt man die API ein und übersetzt in eine einzige eigene Exception.

### Special Case statt Sonderbehandlung

Manchmal ist eine Exception der falsche Weg für einen erwarteten Sonderfall. Feathers zeigt ein Spesenbeispiel: Gibt es keine Spesen, wirft die API eine Exception, und der Aufrufer rechnet im `catch` mit einem Tagessatz weiter. Besser liefert die API ein Objekt für diesen Sonderfall, das den Tagessatz zurückgibt. Das ist Fowlers **Special-Case-Pattern**, verwandt mit dem Null-Object-Pattern.

### Kein null zurückgeben, kein null übergeben

`null` als Rückgabewert verlagert die Prüfung auf jeden Aufrufer, und eine vergessene Prüfung führt zur NullPointerException. Stattdessen soll man eine Exception werfen oder ein Special-Case-Objekt liefern, etwa eine leere Liste. Noch strenger: `null` als Argument soll man grundsätzlich nicht übergeben, weil es keine gute Art gibt, damit umzugehen.

### Einordnung

Das Kapitel ist gut gealtert, teils sogar besser als gedacht. Die Ablehnung von Checked Exceptions hat sich durchgesetzt: Kotlin, C# und Scala haben sie nicht, und auch in Java gelten sie heute als Fehlentscheidung. Die Null-Kritik haben Sprachen direkt umgesetzt: `Optional` in Java, nullable Typen in Kotlin, Swift und TypeScript, `Option` in Rust.

Widersprochen wird heute vor allem bei der Grundannahme „Exceptions immer besser als Rückgabewerte“. Go, Rust und funktionale Sprachen setzen bewusst auf explizite Fehlerwerte wie `Result`, die das Typsystem erzwingt. Das vermeidet Martins ursprüngliches Problem, das Vergessen der Prüfung, ohne versteckten Kontrollfluss. Ousterhout ergänzt einen eigenen Ansatz: Viele Fehler soll man durch geschicktes Design ganz „wegdefinieren“, statt sie zu behandeln.

## Grenzen zu fremdem Code

Fremde APIs sind für viele Anwendungsfälle gebaut, man selbst braucht meist nur einen kleinen Ausschnitt. Deshalb soll man sie hinter eigenen Schnittstellen einkapseln. Das Kapitel stammt von James Grenning.

- **Einwickeln statt durchreichen.** Grennings Beispiel ist eine `Map`, die quer durchs System weitergegeben wird. Jeder Empfänger kann sie leeren oder beliebig befüllen. Besser ist eine eigene Klasse `Sensors`, die die Map intern nutzt und nur die benötigten Operationen anbietet. Ändert sich die Bibliothek, ändert man eine Stelle.
- **Learning Tests.** Statt eine neue Bibliothek im Produktionscode auszuprobieren, schreibt man Tests, die das eigene Verständnis der API festhalten. Grenning zeigt das am Logging-Framework log4j. Solche Tests kosten fast nichts und melden später sofort, wenn ein Update das Verhalten ändert.
- **Code, den es noch nicht gibt.** Hängt man von einem Teilsystem ab, dessen API ein anderes Team noch entwirft, definiert man die Schnittstelle, die man sich wünscht, und baut später einen Adapter zur echten API.

**Einordnung:** Gut gealtert und heute in Architekturansätzen wie Hexagonal Architecture oder „Ports and Adapters“ verankert. Die Gegenstimme warnt vor Überabstraktion: Nicht jede gut gestaltete Standardbibliothek braucht einen eigenen Wrapper.

## Unit-Tests

Testcode ist genauso wichtig wie Produktionscode. Schmutzige Tests sind schlimmer als keine, weil sie bei jeder Änderung mitgezogen werden müssen und das Team sie irgendwann aufgibt.

### Die drei Gesetze von TDD

1. Kein Produktionscode, bevor es einen fehlschlagenden Unit-Test gibt.
2. Nicht mehr Test schreiben, als zum Fehlschlagen nötig ist, und nicht kompilieren gilt als Fehlschlagen.
3. Nicht mehr Produktionscode schreiben, als nötig ist, um den aktuell fehlschlagenden Test zu bestehen.

Der Zyklus dauert laut Martin etwa 30 Sekunden.

### Saubere Tests

- **Lesbarkeit zählt am meisten.** Tests folgen dem Muster „Build, Operate, Check“, später bekannt als Arrange-Act-Assert oder Given-When-Then.
- **Domänenspezifische Testsprache.** Hilfsfunktionen, die die Testlogik in fachlichen Begriffen ausdrücken, machen Tests zur Spezifikation.
- **Doppelter Standard.** Tests müssen sauber sein, aber nicht effizient. Was im Produktionscode verboten wäre, etwa String-Verkettung in einer Schleife, darf im Test stehen, wenn es lesbarer ist.
- **Ein Assert pro Test**, abgeschwächt zu: **ein Konzept pro Test**.

### F.I.R.S.T.

| Buchstabe | Bedeutung |
|---|---|
| F – Fast | Tests laufen schnell, sonst laufen sie nicht oft genug. |
| I – Independent | Kein Test hängt von einem anderen ab. |
| R – Repeatable | Gleiches Ergebnis in jeder Umgebung, auch ohne Netzwerk. |
| S – Self-Validating | Ergebnis ist bestanden oder nicht, ohne Logdateien zu lesen. |
| T – Timely | Tests entstehen kurz vor dem Produktionscode. |

### Einordnung

Die Grundbotschaft, dass Tests Code erster Klasse sind, ist heute Konsens. F.I.R.S.T. ist eine brauchbare Kurzformel. Die drei Gesetze in ihrer strengen Form sind dagegen umstritten. Studien zu TDD zeigen gemischte Ergebnisse, und viele erfahrene Entwickler schreiben Tests direkt danach oder wählen je nach Situation. Kent Beck selbst sieht TDD pragmatischer als Martin. Die Regel „ein Assert pro Test“ gilt als zu dogmatisch, „ein Konzept pro Test“ als vernünftig.

## Klassen

Klassen sollen klein sein, gemessen nicht in Zeilen, sondern in Verantwortlichkeiten. Eine Klasse soll genau einen Grund haben, sich zu ändern. Das Kapitel entstand zusammen mit Jeff Langr.

### Aufbau einer Klasse

Nach Java-Konvention kommen zuerst öffentliche Konstanten, dann private statische Variablen, dann private Instanzvariablen, dann öffentliche Methoden. Private Hilfsmethoden stehen direkt hinter der öffentlichen Methode, die sie nutzt, gemäß Stepdown-Regel. Kapselung ist wichtig, darf aber für Tests gelockert werden, etwa auf Paketsichtbarkeit.

### Single Responsibility Principle

Martins Test: Lässt sich die Klasse in etwa 25 Wörtern beschreiben, ohne „und“, „oder“, „wenn“ oder „aber“? Ein Klassenname mit `Processor`, `Manager` oder `Super` ist ein Warnsignal.

Sein Gegenbeispiel ist eine Klasse `SuperDashboard` mit rund 70 öffentlichen Methoden. Selbst auf fünf Methoden reduziert hätte sie noch zwei Verantwortlichkeiten: Versionsinformationen verwalten und GUI-Komponenten verwalten. Also gehört die Versionslogik in eine eigene Klasse.

Der Einwand, viele kleine Klassen erschwerten den Überblick, lässt Martin nicht gelten. Sein Bild: Lieber ein Werkzeugkasten mit vielen beschrifteten Schubladen als einige große, in die man alles hineinwirft.

### Kohäsion

Eine Klasse ist maximal kohäsiv, wenn jede Methode jede Instanzvariable nutzt. Wenn das Herauslösen von Funktionen viele neue Instanzvariablen erzeugt, die nur von wenigen Methoden genutzt werden, ist das ein Zeichen, dass darin eine eigene Klasse steckt. Kleine Funktionen führen so fast automatisch zu kleinen Klassen.

Martin demonstriert das an einem Primzahlprogramm von Donald Knuth, das er in drei Klassen zerlegt. Das Ergebnis ist deutlich länger als das Original, was er ausdrücklich in Kauf nimmt.

### Organisieren für Veränderung

Hier kommen zwei weitere SOLID-Prinzipien dazu:

- **Open-Closed-Prinzip:** Eine Klasse `Sql`, die für jeden neuen Anweisungstyp geändert werden muss, wird aufgeteilt in eine abstrakte Basisklasse und je eine Unterklasse pro Anweisung wie `SelectSql` oder `InsertSql`. Neue Typen kommen dazu, ohne bestehenden Code anzufassen.
- **Dependency-Inversion-Prinzip:** Klassen hängen von Abstraktionen ab, nicht von konkreten Details. Sein Beispiel ist ein Portfolio, das nicht direkt eine Börsen-API aufruft, sondern ein Interface `StockExchange`. Das macht es testbar und austauschbar.

### Einordnung

SRP ist weit verbreitet, aber notorisch unscharf: Was „eine Verantwortung“ ist, hängt von der Sichtweise ab. Martin hat es später selbst umformuliert, in Richtung „eine Klasse soll nur einer Gruppe von Akteuren dienen“.

Die stärkste Gegenposition ist Ousterhouts Begriff der **Classitis**: Viele kleine Klassen mit dünnen Schnittstellen erhöhen die Gesamtkomplexität, weil jede Schnittstelle selbst gelernt und verstanden werden muss. Besser seien wenige Klassen mit einfacher Schnittstelle und viel Funktionalität dahinter. Das Primzahlbeispiel ist genau der Punkt, an dem Ousterhout und Martin in ihrer späteren öffentlichen Diskussion am deutlichsten auseinanderliegen.

## Systeme

Auf Systemebene gilt dasselbe wie im Kleinen: Belange trennen. Vor allem soll der Aufbau eines Systems vom Betrieb getrennt sein. Das Kapitel stammt von Kevin Dean Wampler.

- **Konstruktion von Nutzung trennen.** Lazy Initialization wie „wenn noch nicht vorhanden, erzeuge den Service“ mitten im Geschäftscode koppelt diesen an konkrete Klassen. Stattdessen baut `main` oder ein Container alle Objekte auf und übergibt sie. Hilfsmittel sind Factories und vor allem **Dependency Injection**.
- **Wachsen statt im Voraus planen.** Software kann, anders als Gebäude, inkrementell wachsen, sofern die Belange sauber getrennt sind. Eine vollständige Architektur am Anfang („Big Design Up Front“) lehnt Wampler ab.
- **Querschnittsbelange** wie Persistenz, Transaktionen und Sicherheit sollen nicht über alle Klassen verstreut sein. Das Kapitel zeigt, wie EJB2 Geschäftslogik mit Container-Code verklebte, und stellt Alternativen vor: Java-Proxies, aspektorientierte Programmierung, Spring und EJB3 mit einfachen Java-Objekten plus Annotationen.
- **Standards mit Bedacht** einsetzen und, wo es passt, **domänenspezifische Sprachen** nutzen.

**Einordnung:** Das Kapitel ist stark an seine Zeit gebunden. EJB2 ist Geschichte, AOP hat sich außerhalb von Frameworks kaum durchgesetzt. Die Kernidee aber, Konstruktion von Nutzung zu trennen und Abhängigkeiten von außen zu injizieren, ist heute Standard in praktisch jedem Framework.

## Emergentes Design

Gutes Design entsteht, wenn man vier einfache Regeln konsequent befolgt. Martin und Langr übernehmen sie von Kent Beck, in absteigender Wichtigkeit:

1. **Alle Tests laufen.** Ein System, das sich nicht prüfen lässt, ist nicht verifizierbar. Testbarkeit erzwingt nebenbei kleine, entkoppelte Klassen.
2. **Keine Duplikation.** Auch subtile Duplikation in der Struktur zählt, etwa zwei Methoden, die fast dasselbe tun. Das Template-Method-Pattern ist ein Werkzeug dagegen.
3. **Die Absicht des Programmierers ausdrücken.** Gute Namen, kleine Funktionen, Standardbegriffe wie Pattern-Namen, gut lesbare Tests.
4. **Anzahl der Klassen und Methoden minimieren.**

Die vierte Regel ist bemerkenswert: Sie bremst ausdrücklich die Übertreibung der anderen Kapitel. Wer für jede Kleinigkeit eine Klasse und ein Interface anlegt, verstößt dagegen. Martin räumt ihr aber die niedrigste Priorität ein.

**Einordnung:** Becks vier Regeln gehören zu den langlebigsten Ideen des ganzen Felds. Interessant ist, dass Regel 4 genau den Einwand vorwegnimmt, den Kritiker später gegen Clean Code erheben. Im Buch selbst bekommt sie aber kaum Gewicht.

## Nebenläufigkeit

Nebenläufigkeit entkoppelt, was getan wird, von wann es getan wird. Sie ist schwer, und die meisten Annahmen darüber sind falsch. Das Kapitel stammt von Brett Schuchert, ein Anhang vertieft es.

**Mythen, die Schuchert widerlegt:** Nebenläufigkeit verbessert nicht immer die Performance. Das Design ändert sich durch sie grundlegend. Und ein Container wie ein Web- oder EJB-Container nimmt einem das Verständnis nicht ab.

**Abwehrprinzipien:**

- SRP auch hier: Nebenläufigkeitscode getrennt vom übrigen Code halten.
- Gemeinsame Daten minimieren und kapseln, wo möglich mit Kopien arbeiten.
- Threads so unabhängig wie möglich machen.
- Die Bibliothek kennen, in Java also `java.util.concurrent`.
- Die klassischen Modelle kennen: Producer-Consumer, Readers-Writers, die speisenden Philosophen.
- Synchronisierte Abschnitte klein halten, Abhängigkeiten zwischen synchronisierten Methoden vermeiden.
- Herunterfahren früh mitdenken, es ist schwerer als gedacht.

**Testen:** Sporadische Fehler nie als „kosmischen Zufall“ abtun. Zuerst den nicht nebenläufigen Code zum Laufen bringen, dann Thread-Anzahl und Plattformen variieren und gezielt Verzögerungen einstreuen, um seltene Abläufe zu provozieren.

**Einordnung:** Die Grundsätze stimmen bis heute, das Kapitel ist aber dünn und Java-zentriert. Modelle wie async/await, Aktoren, Channels in Go oder Rusts Ownership-System, das Datenrennen schon beim Kompilieren verhindert, haben das Feld seither stark verändert.

## Die Fallstudien

In drei langen Kapiteln zeigt Martin, dass sauberer Code nicht entworfen, sondern durch viele kleine, testgesicherte Schritte erarbeitet wird.

| Kapitel | Gegenstand | Kernlektion |
|---|---|---|
| 14: Schrittweise Verfeinerung | `Args`, ein Parser für Kommandozeilenargumente | Eine gut begonnene Lösung verrottet, sobald neue Typen dazukommen. Martin hält an, sichert alles mit Tests und refaktoriert in winzigen Schritten zu einem erweiterbaren Design mit einer Klasse pro Argumenttyp. |
| 15: JUnit-Interna | `ComparisonCompactor` aus JUnit | Auch guter Code von erfahrenen Autoren lässt sich noch verbessern. Martin geht ihn Schritt für Schritt durch, benennt um, extrahiert und entfernt Duplikation. |
| 16: Refactoring von SerialDate | Datumsklasse aus der Open-Source-Bibliothek JCommon | Zuerst die Testabdeckung erhöhen, dabei echte Fehler finden, dann aufräumen. Martin betont, dass es keine Kritik am ursprünglichen Autor ist, sondern professionelle Code-Review. |

Das Muster ist in allen drei gleich: Erst funktioniert der Code, dann wird er mit Tests abgesichert, dann wird er in Schritten verbessert, die das Verhalten nie brechen. Das ist im Grunde Fowlers *Refactoring* in der Praxis vorgeführt.

Die Fallstudien sind mühsam zu lesen, weil sie lange Codestrecken über viele Seiten verfolgen. Sie sind aber der ehrlichste Teil des Buchs. Hier sieht man nicht nur die Regeln, sondern auch, wie oft Martin abwägen und Kompromisse eingehen muss.

## Smells und Heuristiken

Das letzte Kapitel ist ein Nachschlagekatalog von rund 66 kurz kommentierten Warnsignalen, nummeriert nach Kategorien. Martin hat ihn aus den Fallstudien gewonnen und teils aus Fowlers Katalog übernommen.

| Kürzel | Kategorie | Beispiele |
|---|---|---|
| C1–C5 | Kommentare | unpassende Informationen, veraltete oder redundante Kommentare, auskommentierter Code |
| E1–E2 | Umgebung | Build braucht mehr als einen Schritt, Tests brauchen mehr als einen Schritt |
| F1–F4 | Funktionen | zu viele Argumente, Output-Argumente, Flag-Argumente, toter Code |
| G1–G36 | Allgemein | Duplikation, falsche Abstraktionsebene, Feature Envy, Magic Numbers, Bedingungen nicht gekapselt, verborgene zeitliche Kopplung, Polymorphie statt `if/else` |
| J1–J3 | Java | lange Importlisten, Konstanten vererben, Konstanten statt Enums |
| N1–N7 | Namen | beschreibende Namen, Namen auf passender Abstraktionsebene, keine Kodierungen, Namen sollen Seiteneffekte beschreiben |
| T1–T9 | Tests | unzureichende Tests, Grenzfälle nicht getestet, Tests sollen schnell sein, ein Coverage-Tool verwenden |

Der Katalog ist der praktischste Teil für den Alltag, etwa als gemeinsames Vokabular im Code-Review. Der allgemeine Block G ist der längste und mischt Wichtiges wie Duplikation mit Stilfragen wie vertikaler Trennung. Viele der Punkte werden heute von Lintern und statischer Analyse automatisch geprüft, etwa von SonarQube, das stark von diesem Denken beeinflusst ist.

## Kritik und Einordnung aus heutiger Sicht

Clean Code hat die Branche geprägt wie kaum ein anderes Buch, steht aber seit etwa 2020 deutlich stärker in der Kritik. Die Werte sind weitgehend unbestritten, die konkreten Regeln und vor allem die Beispiele nicht.

### Was gut gealtert ist

- Lesbarkeit als oberstes Ziel und Code als Kommunikation zwischen Menschen
- aussagekräftige Namen
- Tests als Code erster Klasse, F.I.R.S.T.
- die Pfadfinderregel
- keine versteckten Seiteneffekte, Command-Query-Separation, keine Flag-Argumente
- kein `null`, Exceptions mit Kontext, Fremdcode einkapseln
- die Daten-Objekt-Antisymmetrie
- Becks vier Regeln des einfachen Designs

### Die wichtigsten Kritikpunkte

**1. Zu kleine Funktionen, zu viele Klassen.** Der zentrale Einwand. Wer konsequent auf Zwei- bis Vierzeiler zerlegt, erzeugt viele flache Methoden, deren Schnittstellen kaum weniger komplex sind als ihr Inhalt. Die Gesamtkomplexität sinkt nicht, sie wird nur verteilt. Ousterhout nennt das „flache Module“ und setzt „tiefe Module“ dagegen: einfache Schnittstelle, viel Funktionalität dahinter.

**2. Die Beispiele widersprechen den Regeln.** Ein vielzitierter Blogbeitrag des Autors qntm von 2020 argumentiert, man solle das Buch nicht mehr empfehlen. Er zeigt, dass Martins eigene Beispiele Zwischenzustand über Instanzfelder schmuggeln, um Argumente zu sparen. Damit erzeugen sie genau die versteckten Seiteneffekte und die zeitliche Kopplung, vor denen das Buch warnt. Einige Methoden sind nur in einer bestimmten Reihenfolge aufrufbar, ohne dass man es ihnen ansieht.

**3. Kommentarfeindlichkeit.** Die Haltung, Kommentare seien fast immer ein Versagen, wird heute als schädlich angesehen. Namen können Absicht, Annahmen und Begründungen nur begrenzt transportieren.

**4. Zeitgebundenheit.** Java um 2008, Enterprise-Kontext, OO als Standardparadigma. Vieles passt schlecht auf funktionale Sprachen, Go, Rust, Datenverarbeitung oder systemnahe Programmierung.

**5. Performance.** Casey Muratori zeigte 2023 in einem viel diskutierten Video, dass Polymorphie statt `switch` und viele kleine Indirektionen in einem einfachen Benchmark ein Vielfaches an Laufzeit kosten können. Das ist für typischen Geschäftscode meist irrelevant, für Spiele, Grafik oder Hochleistungscode aber nicht.

**6. Dogmatismus und Ton.** Die Regeln werden als Gesetze formuliert, Abweichung gilt als unprofessionell. Viele Teams haben sie mechanisch angewendet, etwa als Review-Regel „keine Funktion über fünf Zeilen“. Martin selbst betont zwar, dass Urteilsvermögen nötig ist, das Buch transportiert das aber schwächer als die Regeln.

**7. Wenig Empirie.** Fast alle Aussagen beruhen auf Erfahrung und Überzeugung, nicht auf Studien. Das gilt allerdings für fast alle Bücher dieses Genres, Ousterhout eingeschlossen.

### Der Dialog Martin–Ousterhout

Die beiden haben ihre Positionen später in einer schriftlichen, öffentlich auf GitHub veröffentlichten Diskussion direkt gegeneinandergestellt. Die Streitpunkte waren Methodenlänge, Kommentare und TDD, durchgespielt an konkretem Code, unter anderem dem Primzahlbeispiel. Dabei zeigte sich, dass beide in den Zielen nah beieinander liegen. Uneinig sind sie in der Frage, wo die Komplexität am besten aufgehoben ist: in vielen kleinen Einheiten oder in wenigen tiefen. Das ist eine gute Brücke zum nächsten Buch.

### Gesamturteil

Als Einstieg für Entwickler, die noch kein Gespür für Lesbarkeit haben, ist das Buch nach wie vor wertvoll, vor allem die Kapitel zu Namen, Fehlerbehandlung, Tests und die Fallstudien. Als Regelwerk ist es gefährlich, wenn man es wörtlich nimmt. Am meisten bringt es, wenn man es zusammen mit einem Gegenentwurf wie Ousterhout liest und die Spannung zwischen beiden bewusst aushält.

## Diskussionsfragen

Diese Fragen eignen sich als Einstieg für unser Gespräch und als Vorbereitung auf Ousterhout.

1. **Funktionsgröße:** Wo liegt für dich die sinnvolle Grenze? Ab wann wird das Zerlegen zum Hin- und Herspringen?
2. **Kommentare:** Hast du in der Praxis eher unter veralteten Kommentaren gelitten oder unter fehlenden?
3. **SRP:** Woran erkennt man eine einzelne Verantwortung, wenn man ehrlich ist? Ist das Prinzip präzise genug, um im Review zu entscheiden?
4. **TDD:** Die drei Gesetze in strenger Form, Tests direkt danach oder situativ? Was hat bei dir funktioniert?
5. **Lesbarkeit für wen?** Martin optimiert für einen Leser, der sich Methode für Methode durcharbeitet. Ousterhout optimiert für einen Leser, der eine Schnittstelle verstehen will, ohne die Implementierung zu lesen. Welcher Leser ist in deinen Projekten der typische?
6. **Regeln oder Werte?** Hat das Buch der Branche mehr genützt, weil es Lesbarkeit überhaupt zum Thema gemacht hat, oder mehr geschadet, weil seine Regeln mechanisch angewendet wurden?
7. **Paradigmen:** Wie viel von Clean Code überträgt sich auf funktionale Sprachen, Go oder Rust, und wie viel ist OO-spezifisch?

## Brücke zu Ousterhout

*A Philosophy of Software Design* (2018, 2. Auflage 2021) definiert Komplexität als das, was Software schwer verständlich und schwer änderbar macht. Die zentralen Gegenbegriffe zu Clean Code sind **tiefe Module**, **Information Hiding**, **Kommentare als Designwerkzeug** und **strategisches statt taktisches Programmieren**. Beim Lesen lohnt es sich, bei jedem Kapitel zu fragen: Widerspricht Ousterhout Martin hier wirklich, oder setzt er nur andere Schwerpunkte?

{{< anmerkung >}}
Zu „Erfinder der SOLID-Akronymik“: Die fünf Prinzipien hat Martin um 2000 zusammengestellt, das Kürzel SOLID selbst stammt laut Wikipedia von Michael Feathers (um 2004) – demselben Feathers, dessen *Working Effectively with Legacy Code* auch in dieser Reihe steht.
{{< /anmerkung >}}
