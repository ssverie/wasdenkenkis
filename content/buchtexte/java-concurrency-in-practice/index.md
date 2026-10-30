+++
title = "Java Concurrency in Practice – Zusammenfassung und Einordnung"
description = "Brian Goetz, Tim Peierls, Joshua Bloch, Joseph Bowbeer, David Holmes, Doug Lea, Java Concurrency in Practice (2006)"
date = 2026-10-30T19:17:25+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["java-concurrency-in-practice-2006"]
+++

## Einleitung

Java Concurrency in Practice ist das Standardwerk zur nebenläufigen Programmierung in Java. Es ist kein Buch über Threads als Sprachfeature, sondern über **korrekte nebenläufige Programme**: wie man gemeinsam genutzten, veränderlichen Zustand so organisiert, dass Programme auch dann richtig funktionieren, wenn mehrere Threads gleichzeitig darauf zugreifen.

### Die Autoren

Die Autorenliste ist außergewöhnlich: **Brian Goetz** ist heute Javas Sprach-Architekt bei Oracle und verantwortet Records, sealed Types, Pattern Matching und Project Valhalla. **Doug Lea** hat das Paket `java.util.concurrent` entworfen. **Joshua Bloch** ist der Autor von Effective Java. **David Holmes** und **Joseph Bowbeer** waren wie Lea Mitglieder der Expertengruppe für JSR 166, die die Nebenläufigkeitsbibliothek in Java 5 brachte. **Tim Peierls** ebenfalls. Das Buch ist also von den Menschen geschrieben, die die Werkzeuge gebaut haben, die es beschreibt.

### Kontext

Das Buch erschien 2006, kurz nach Java 5, das zwei Dinge gebracht hatte: das überarbeitete **Java Memory Model** (JSR 133), das endlich klar definierte, was Threads voneinander sehen, und die Bibliothek `java.util.concurrent` mit Executors, nebenläufigen Collections, Locks, atomaren Variablen und Synchronisierern. Gleichzeitig wurden Mehrkernprozessoren zum Normalfall auf Desktops und Servern. Nebenläufigkeit war nicht mehr ein Spezialthema, sondern Alltag.

### Die Kernthese

Das Buch vertritt eine Grundhaltung, die sich durch alle Kapitel zieht: **Die Schwierigkeit liegt im gemeinsam genutzten, veränderlichen Zustand.** Es gibt drei Wege, ihn sicher zu machen:

1. **Nicht teilen:** Zustand auf einen Thread beschränken.
2. **Unveränderlich machen:** Was sich nicht ändert, kann gefahrlos geteilt werden.
3. **Synchronisieren:** Jeden Zugriff auf gemeinsamen, veränderlichen Zustand absichern.

Die ersten beiden Wege sind fast immer besser als der dritte.

### Aufbau

| Teil | Kapitel | Inhalt |
|---|---|---|
| I. Grundlagen | 1–5 | Thread-Sicherheit, Objekte teilen, Objekte zusammensetzen, Bausteine |
| II. Nebenläufige Anwendungen strukturieren | 6–9 | Aufgaben ausführen, Abbruch und Herunterfahren, Thread-Pools, GUI-Anwendungen |
| III. Lebendigkeit, Leistung, Testen | 10–12 | Deadlocks, Skalierbarkeit, Testen nebenläufiger Programme |
| IV. Fortgeschrittenes | 13–16 | explizite Locks, eigene Synchronisierer, atomare Variablen, das Java Memory Model |

Im Anhang beschreiben die Autoren Annotationen zur Dokumentation, die heute in Bibliotheken wie Error Prone verbreitet sind: `@ThreadSafe`, `@NotThreadSafe`, `@Immutable` und `@GuardedBy("lock")`.

## Thread-Sicherheit

Eine Klasse ist **thread-sicher**, wenn sie sich korrekt verhält, egal wie die Laufzeitumgebung die Threads verschränkt, und ohne dass Aufrufer zusätzlich synchronisieren müssen. Die wichtigste Feststellung des Kapitels: **Zustandslose Objekte sind immer thread-sicher.** Probleme entstehen erst mit Zustand.

### Wettlaufsituationen

Eine Wettlaufsituation, englisch Race Condition, liegt vor, wenn die Korrektheit vom zeitlichen Ablauf abhängt. Die Autoren nennen zwei typische Formen:

- **Lesen, ändern, schreiben:** `count++` sieht aus wie eine Operation, sind aber drei: Wert lesen, eins addieren, zurückschreiben. Zwei Threads können denselben alten Wert lesen, und ein Inkrement geht verloren.
- **Prüfen, dann handeln:** Erst prüfen, ob etwas existiert, dann es anlegen. Zwischen Prüfung und Aktion kann ein anderer Thread dasselbe tun.

```java
// Nicht thread-sicher: Lesen-ändern-schreiben
@NotThreadSafe
class HitCounter {
    private long count;
    void hit() { count++; }                  // verlorene Updates möglich
}

// Nicht thread-sicher: Prüfen-dann-handeln
@NotThreadSafe
class LazyInit {
    private ExpensiveObject instance;
    ExpensiveObject get() {
        if (instance == null) instance = new ExpensiveObject();   // zwei Instanzen möglich
        return instance;
    }
}

// Thread-sicher durch atomare Variable
@ThreadSafe
class SafeHitCounter {
    private final AtomicLong count = new AtomicLong();
    void hit() { count.incrementAndGet(); }
}
```

### Sperren

Wenn mehrere Variablen zusammen eine Invariante bilden, reicht es nicht, jede einzeln atomar zu machen. Die Autoren zeigen einen Cache aus zwei `AtomicReference`s, letzte Eingabe und letztes Ergebnis, der trotzdem falsch ist: Ein Thread kann die neue Eingabe mit dem alten Ergebnis sehen. **Zusammengehöriger Zustand muss unter derselben Sperre aktualisiert werden.**

```java
@ThreadSafe
class CachedFactorizer {
    @GuardedBy("this") private BigInteger lastNumber;
    @GuardedBy("this") private BigInteger[] lastFactors;

    BigInteger[] factor(BigInteger n) {
        synchronized (this) {
            if (n.equals(lastNumber)) return lastFactors.clone();
        }
        BigInteger[] factors = slowFactor(n);      // lange Berechnung außerhalb der Sperre
        synchronized (this) {
            lastNumber = n;
            lastFactors = factors.clone();
        }
        return factors;
    }
}
```

Das Beispiel zeigt auch eine Leistungsregel: **Sperren so kurz wie möglich halten**, lange Berechnungen und vor allem Ein- und Ausgabe außerhalb.

### Die Grundregeln

- Jede veränderliche Variable, auf die mehrere Threads zugreifen, muss bei **jedem Zugriff**, lesend wie schreibend, unter **derselben Sperre** stehen.
- Für jede Invariante mit mehreren Variablen müssen alle beteiligten Variablen unter derselben Sperre stehen.
- Javas eingebaute Sperren sind **reentrant**: Ein Thread kann eine Sperre, die er schon hält, erneut erwerben. Sonst würde etwa eine synchronisierte Methode, die eine synchronisierte Methode der Oberklasse aufruft, sich selbst blockieren.
- Die **Synchronisationsstrategie** einer Klasse soll dokumentiert werden, etwa mit `@GuardedBy`.

## Objekte teilen

Synchronisation dient nicht nur der Atomarität, sondern auch der **Sichtbarkeit**. Das ist für viele Entwickler die überraschendste Lektion des Buchs.

### Sichtbarkeit

Ohne Synchronisation gibt es **keine Garantie**, dass ein Thread jemals sieht, was ein anderer geschrieben hat. Compiler, Prozessor und Caches dürfen Operationen umordnen und Werte in Registern halten.

```java
// Kann ewig laufen oder 0 ausgeben
public class NoVisibility {
    private static boolean ready;
    private static int number;

    public static void main(String[] args) {
        new Thread(() -> {
            while (!ready) Thread.onSpinWait();
            System.out.println(number);           // kann 0 sein: Umordnung
        }).start();
        number = 42;
        ready = true;                              // muss nie sichtbar werden
    }
}
```

Die Autoren nennen veraltete Werte **stale data**. Bei `long` und `double` ohne `volatile` kann ein Thread sogar eine Mischung aus zwei Schreibvorgängen sehen, weil 64-Bit-Zugriffe nicht atomar sein müssen.

### volatile

`volatile` garantiert Sichtbarkeit, aber **keine Atomarität**: `count++` auf einer `volatile`-Variablen bleibt unsicher. Die Autoren geben klare Regeln, wann `volatile` reicht: Wenn Schreibzugriffe nicht vom aktuellen Wert abhängen, die Variable an keiner Invariante mit anderen beteiligt ist und beim Zugriff sonst keine Sperre nötig ist. Typischer Fall: ein Abbruch-Flag.

### Veröffentlichung und Entkommen

Ein Objekt wird **veröffentlicht**, wenn es außerhalb seines Gültigkeitsbereichs sichtbar wird. Es **entkommt**, wenn das zu früh oder unbeabsichtigt geschieht. Klassischer Fehler: `this` entkommt im Konstruktor, etwa durch Registrieren eines Listeners oder Starten eines Threads, und ein anderer Thread sieht das Objekt halb konstruiert.

### Thread-Beschränkung

Was nur ein Thread sieht, braucht keine Synchronisation. Formen:

- **Stack-Beschränkung:** lokale Variablen.
- `ThreadLocal`**:** eine Kopie pro Thread, etwa für nicht thread-sichere Formatierer.
- **Ad-hoc:** nur durch Disziplin, etwa der Swing-Event-Thread. Zerbrechlich.

### Unveränderlichkeit

**Unveränderliche Objekte sind immer thread-sicher.** Ein Objekt ist unveränderlich, wenn sein Zustand nach der Konstruktion nicht geändert werden kann, alle Felder `final` sind und `this` im Konstruktor nicht entkommt. Die `final`-Felder bekommen dabei eine besondere Garantie des Memory Models: Sie sind nach der Konstruktion für alle Threads sichtbar, auch ohne Synchronisation.

Die Autoren zeigen ein schönes Muster: ein **unveränderliches Halterobjekt**, das in einer `volatile`-Referenz ausgetauscht wird. Damit lassen sich zusammengehörige Werte ohne Sperre atomar ersetzen.

```java
record CacheEntry(BigInteger number, BigInteger[] factors) {}   // unveränderlicher Halter

@ThreadSafe
class VolatileCachedFactorizer {
    private volatile CacheEntry cache = new CacheEntry(null, null);

    BigInteger[] factor(BigInteger n) {
        CacheEntry c = cache;                                     // einmal lesen
        if (n.equals(c.number())) return c.factors().clone();
        BigInteger[] f = slowFactor(n);
        cache = new CacheEntry(n, f.clone());                     // atomar austauschen
        return f;
    }
}
```

### Sichere Veröffentlichung

Ein veränderliches Objekt wird sicher veröffentlicht, wenn Referenz und Zustand gleichzeitig sichtbar werden. Die Wege dazu:

- Initialisierung in einem statischen Initialisierer.
- Speichern in einem `volatile`-Feld oder einer `AtomicReference`.
- Speichern in einem `final`-Feld eines korrekt konstruierten Objekts.
- Speichern in einem Feld, das durch eine Sperre geschützt ist, etwa in einer thread-sicheren Collection.

### Einordnung

Weidigs Plädoyer für Unveränderlichkeit, Blochs Item 17 „Veränderlichkeit minimieren“ und Martins Satz, alle Nebenläufigkeitsprobleme entstünden durch veränderliche Variablen, finden hier ihre technische Begründung. Records machen das Halter-Muster heute trivial.

## Objekte zusammensetzen

Wie baut man aus thread-sicheren und nicht thread-sicheren Teilen größere thread-sichere Klassen?

- **Instanzbeschränkung:** Ein nicht thread-sicheres Objekt, etwa eine `HashMap`, wird in einem thread-sicheren Objekt gekapselt, und jeder Zugriff läuft über dessen Sperre. Das ist das **Java-Monitor-Muster**: Alle veränderlichen Felder privat, alle Zugriffe synchronisiert.
- **Delegation:** Eine Klasse überlässt die Thread-Sicherheit ihren Feldern, etwa einer `ConcurrentHashMap`. Das funktioniert nur, wenn die Felder **unabhängig** sind. Zwei `AtomicInteger` für untere und obere Grenze eines Bereichs mit der Invariante `lower <= upper` sind es nicht.
- **Funktionalität ergänzen:** Wer zu einer thread-sicheren Collection eine zusammengesetzte Operation hinzufügen will, etwa „einfügen, falls nicht vorhanden“, muss **dieselbe Sperre** verwenden wie die Collection. Die Autoren zeigen einen subtilen Fehler: Eine eigene `synchronized`-Methode, die auf `this` sperrt statt auf die Liste, ist nicht atomar.

```java
// Falsch: sperrt auf den Helfer, nicht auf die Liste
class ListHelper<E> {
    final List<E> list = Collections.synchronizedList(new ArrayList<>());
    synchronized boolean putIfAbsent(E x) {                // falsche Sperre!
        boolean absent = !list.contains(x);
        if (absent) list.add(x);
        return absent;
    }
}

// Richtig: Client-seitiges Sperren mit der Sperre der Liste
boolean putIfAbsent(E x) {
    synchronized (list) { … }
}
```

Am saubersten ist **Komposition**: eine eigene Klasse, die die Liste kapselt und eine eigene Sperre für alle Operationen nutzt.

## Bausteine

Das fünfte Kapitel stellt die Werkzeuge aus `java.util.concurrent` vor.

### Collections

| Art | Beispiel | Eigenschaft |
|---|---|---|
| Synchronisiert | `Collections.synchronizedMap`, `Vector` | jede Methode gesperrt; zusammengesetzte Aktionen und Iteration müssen zusätzlich gesperrt werden; sonst `ConcurrentModificationException` |
| Nebenläufig | `ConcurrentHashMap` | fein abgestufte Sperren, Iteratoren ohne Ausnahme, atomare Zusatzoperationen |
| Kopieren beim Schreiben | `CopyOnWriteArrayList` | ideal für viele Leser, seltene Schreiber, etwa Listener-Listen |
| Blockierende Warteschlangen | `ArrayBlockingQueue`, `LinkedBlockingQueue` | Grundlage des **Erzeuger-Verbraucher-Musters**; beschränkte Warteschlangen erzeugen Gegendruck |

### Unterbrechung

Viele blockierende Methoden werfen `InterruptedException`. Die Autoren betonen: Diese Ausnahme **nicht verschlucken**. Entweder weiterwerfen oder den Unterbrechungsstatus wiederherstellen.

```java
try {
    queue.put(item);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();     // Status wiederherstellen
    return;
}
```

### Synchronisierer

| Klasse | Zweck |
|---|---|
| `CountDownLatch` | wartet, bis eine Anzahl von Ereignissen eingetreten ist, etwa bis alle Dienste gestartet sind |
| `FutureTask` / `Future` | Ergebnis einer Berechnung, die später fertig wird |
| `Semaphore` | begrenzt die Zahl gleichzeitiger Zugriffe, etwa auf einen Ressourcenpool |
| `CyclicBarrier` | mehrere Threads warten aufeinander, bevor alle weitermachen |

### Das Memoizer-Beispiel

Das Kapitel endet mit einem Cache für teure Berechnungen, der in mehreren Schritten verbessert wird. Die Endfassung speichert **Futures statt Ergebnisse** in einer `ConcurrentHashMap`, damit zwei Threads, die gleichzeitig denselben Wert anfragen, nicht beide rechnen, sondern der zweite auf das Ergebnis des ersten wartet.

```java
class Memoizer<A, V> {
    private final ConcurrentMap<A, Future<V>> cache = new ConcurrentHashMap<>();
    private final Function<A, V> compute;

    V get(A arg) throws InterruptedException, ExecutionException {
        Future<V> f = cache.get(arg);
        if (f == null) {
            var ft = new FutureTask<>(() -> compute.apply(arg));
            f = cache.putIfAbsent(arg, ft);
            if (f == null) { f = ft; ft.run(); }         // nur der erste rechnet
        }
        try { return f.get(); }
        catch (CancellationException e) { cache.remove(arg, f); throw e; }
    }
}
```

Das Beispiel zeigt im Kleinen die Arbeitsweise des ganzen Buchs: naive Version, Problem benennen, verbessern, nächstes Problem.

## Aufgaben ausführen

Der zweite Teil wechselt von einzelnen Klassen zur Struktur ganzer Anwendungen. Der erste Schritt: Arbeit in **unabhängige Aufgaben** zerlegen, etwa eine Aufgabe pro eingehender Anfrage.

### Warum nicht einfach ein Thread pro Aufgabe?

Die Autoren zeigen drei Varianten eines Webservers: sequenziell, ein neuer Thread pro Anfrage, ein Thread-Pool. Ein Thread pro Anfrage war 2006 problematisch, weil Plattform-Threads teuer sind: Erzeugung kostet Zeit, jeder Thread belegt Speicher für seinen Stack, und zu viele Threads führen zu Speichermangel und Kontextwechseln. **Unbegrenzte Thread-Erzeugung** ist ein Stabilitätsrisiko, genau wie Nygards unbegrenzte Ergebnismengen.

### Das Executor-Framework

`Executor` trennt das **Einreichen** einer Aufgabe von ihrer **Ausführung**. Wie viele Threads, in welcher Reihenfolge, mit welcher Priorität, was bei Überlast passiert: All das ist eine Ausführungsrichtlinie, die man an einer Stelle ändern kann.

```java
ExecutorService pool = Executors.newFixedThreadPool(16);

Future<Report> f = pool.submit(() -> buildReport(customer));   // Callable mit Ergebnis
Report r = f.get(5, TimeUnit.SECONDS);                          // mit Zeitlimit warten

pool.shutdown();
pool.awaitTermination(30, TimeUnit.SECONDS);
```

Dazu kommen `CompletionService`, um Ergebnisse in der Reihenfolge ihrer Fertigstellung abzuholen, und `invokeAll` mit Zeitlimit für Gruppen von Aufgaben.

## Abbruch und Herunterfahren

Java hat keinen sicheren Weg, einen Thread zu stoppen. Abbruch ist **kooperativ**: Man bittet einen Thread, aufzuhören, und der Code des Threads muss darauf reagieren.

- **Unterbrechung** ist der Standardmechanismus. Jeder Thread hat eine **Unterbrechungsrichtlinie**: Wie reagiert er auf eine Unterbrechung? Nur der Besitzer eines Threads darf diese Richtlinie bestimmen; Code, der in fremden Threads läuft, etwa eine Aufgabe in einem Pool, soll die Unterbrechung weitergeben statt sie zu schlucken.
- **Nicht unterbrechbares Blockieren**, etwa bei klassischer Socket-Ein-/Ausgabe, muss anders abgebrochen werden, zum Beispiel durch Schließen des Sockets.
- **Giftpillen:** Ein spezielles Element in einer Warteschlange signalisiert dem Verbraucher, dass er aufhören soll.
- **Herunterfahren:** `shutdown()` nimmt keine neuen Aufgaben an und lässt laufende fertig werden; `shutdownNow()` unterbricht laufende Aufgaben und gibt die nicht gestarteten zurück.
- **Unbehandelte Ausnahmen** beenden einen Thread still. Ein `UncaughtExceptionHandler` sollte sie protokollieren.

## Thread-Pools anwenden

### Größe bestimmen

Die Autoren geben eine Faustformel für die Größe eines Pools:

**Threads = Kerne × Ziel-CPU-Auslastung × (1 + Wartezeit / Rechenzeit)**

Für reine Rechenaufgaben reichen etwa so viele Threads wie Kerne, für Aufgaben, die überwiegend auf Datenbank oder Netzwerk warten, deutlich mehr. Andere Ressourcen begrenzen ebenfalls: Ein Pool mit 100 Threads, die alle eine Datenbankverbindung brauchen, nützt bei 20 Verbindungen wenig.

### ThreadPoolExecutor konfigurieren

```java
var pool = new ThreadPoolExecutor(
    8, 32,                                          // Kern- und Maximalgröße
    60, TimeUnit.SECONDS,                           // Leerlaufzeit
    new ArrayBlockingQueue<>(500),                  // beschränkte Warteschlange
    Thread.ofPlatform().name("orders-", 0).factory(),
    new ThreadPoolExecutor.CallerRunsPolicy());     // Sättigung: Aufrufer arbeitet selbst
```

Bei voller Warteschlange greift eine **Sättigungsrichtlinie**: Ausnahme werfen, verwerfen, älteste verwerfen oder **Caller Runs**, bei der der einreichende Thread die Aufgabe selbst ausführt. Caller Runs bremst den Erzeuger und erzeugt so natürlichen Gegendruck.

### Thread-Hunger-Deadlock

Wenn Aufgaben in einem beschränkten Pool auf andere Aufgaben im **selben Pool** warten, können alle Threads blockiert sein, während die Aufgaben, auf die sie warten, in der Warteschlange stehen. Das System steht still, ohne dass eine Sperre beteiligt ist.

### Einordnung

Getrennte Pools pro Aufgabenart sind Nygards **Bulkheads**, beschränkte Warteschlangen mit Caller Runs sind **Back Pressure**. Release It! beschreibt dieselben Mechanismen aus Betriebssicht, Goetz und Kollegen liefern die Java-Werkzeuge dafür.

## Lebendigkeit

Neben Korrektheit, also „nichts Schlechtes passiert“, gibt es **Lebendigkeit**: „irgendwann passiert etwas Gutes“. Das wichtigste Risiko ist der Deadlock.

### Deadlocks durch Sperrreihenfolge

Zwei Threads erwerben zwei Sperren in unterschiedlicher Reihenfolge, und jeder wartet auf die Sperre des anderen. Der klassische Fall ist eine Überweisung zwischen zwei Konten, bei der beide Konten gesperrt werden: Überweist ein Thread von A nach B und ein anderer gleichzeitig von B nach A, blockieren beide.

```java
// Deadlock-Gefahr: Reihenfolge hängt von den Argumenten ab
void transfer(Account from, Account to, Money amount) {
    synchronized (from) { synchronized (to) { … } }
}

// Lösung: immer in einer festen Reihenfolge sperren
void transfer(Account from, Account to, Money amount) {
    Account first  = from.id() < to.id() ? from : to;
    Account second = first == from ? to : from;
    synchronized (first) { synchronized (second) { … } }
}
```

Weitere Regeln:

- **Offene Aufrufe:** Keine fremden Methoden aufrufen, während man eine Sperre hält. Fremde Methoden können selbst Sperren erwerben, und so entstehen Deadlocks zwischen Objekten, die nichts voneinander wissen.
- **Zeitlimits:** Mit `tryLock` und Timeout statt unbegrenztem Warten lässt sich ein Deadlock erkennen und auflösen.
- **Thread-Dumps** zeigen, welcher Thread welche Sperre hält und auf welche er wartet; die JVM erkennt einfache Deadlocks selbst.

Weitere Lebendigkeitsprobleme sind **Verhungern**, wenn ein Thread nie an die Reihe kommt, und **Livelock**, wenn Threads aktiv sind, aber nicht vorankommen, etwa weil sie sich gegenseitig immer wieder ausweichen.

## Leistung und Skalierbarkeit

Die Autoren unterscheiden **Leistung**, wie schnell eine Aufgabe erledigt wird, von **Skalierbarkeit**, wie gut der Durchsatz mit mehr Ressourcen wächst. Für Server ist Skalierbarkeit meist wichtiger.

### Amdahls Gesetz

Der serielle Anteil eines Programms, also der Teil, der nicht parallel laufen kann, begrenzt die mögliche Beschleunigung. Bei einem seriellen Anteil F und N Kernen ist die Beschleunigung höchstens 1 / (F + (1 − F) / N), und selbst mit unendlich vielen Kernen nie mehr als 1 / F.

{{< bild src="bild-1.png" alt="Amdahls Gesetz · Beschleunigung = 1 / (F + (1 − F) / N), berechnet für N = 1 bis 64" >}}

Amdahls Gesetz · Beschleunigung = 1 / (F + (1 − F) / N), berechnet für N = 1 bis 64

Schon fünf Prozent serieller Anteil begrenzen die Beschleunigung bei 64 Kernen auf etwa das Fünfzehnfache, zehn Prozent auf unter das Neunfache. Jede gemeinsam genutzte Sperre trägt zum seriellen Anteil bei.

### Sperrkonkurrenz verringern

- **Sperren kürzer halten:** nur den wirklich kritischen Teil synchronisieren.
- **Sperren aufteilen:** unabhängige Zustände mit getrennten Sperren schützen.
- **Lock Striping:** eine Datenstruktur in Abschnitte mit eigenen Sperren aufteilen. Die `ConcurrentHashMap` von 2006 arbeitete mit 16 Segmenten.
- **Exklusive Sperren vermeiden:** Lese-Schreib-Sperren, unveränderliche Daten, atomare Variablen.
- **Hot Fields vermeiden:** ein gemeinsamer Zähler, den jede Operation aktualisiert, serialisiert alles.

Die Autoren warnen ausdrücklich vor **vorzeitiger Optimierung**: erst korrekt, dann messen, dann gezielt verbessern. Das ist McConnells und Fowlers Rat, auf Nebenläufigkeit übertragen.

## Nebenläufige Programme testen

Nebenläufigkeitsfehler sind selten, schwer zu reproduzieren und hängen vom Zeitverhalten ab. Die Autoren behandeln das Testen deshalb ausführlich, am Beispiel eines beschränkten Puffers.

- **Blockierverhalten prüfen:** Ein Test startet einen Thread, der aus einem leeren Puffer lesen will, wartet kurz, unterbricht ihn und prüft, ob er tatsächlich blockiert war und auf die Unterbrechung reagiert.
- **Sicherheit prüfen:** Viele Erzeuger und Verbraucher arbeiten gleichzeitig; jeder bildet eine Prüfsumme über das, was er geschrieben oder gelesen hat. Am Ende müssen beide Summen gleich sein. Das prüft, dass nichts verloren geht oder doppelt ankommt, ohne selbst eine Sperre einzuführen, die das Verhalten verfälscht.
- **Mehr Verschränkungen erzeugen:** mehr Threads als Kerne, Zufallsdaten, gelegentliches `Thread.yield()`.
- **Ressourcen prüfen:** Werden Objekte freigegeben, laufen Threads nach dem Ende weiter?

Für Leistungstests warnen die Autoren vor typischen Messfehlern: Garbage Collection, JIT-Kompilierung, die Code während der Messung optimiert, und Eliminierung von Code, dessen Ergebnis nicht verwendet wird. Heute löst **JMH** diese Probleme weitgehend.

Ergänzend empfehlen sie **statische Analyse**, damals FindBugs, heute SpotBugs oder Error Prone mit `@GuardedBy`-Prüfung, sowie Code-Reviews durch Kollegen mit Nebenläufigkeitserfahrung. Das ist McConnells Befund aus Code Complete: Reviews finden Fehler, die Tests übersehen, und bei Nebenläufigkeit gilt das besonders.

## Explizite Locks

`ReentrantLock` bietet, was `synchronized` nicht kann:

| Fähigkeit | Nutzen |
|---|---|
| `tryLock()` mit oder ohne Zeitlimit | Deadlocks vermeiden, aufgeben statt ewig warten |
| `lockInterruptibly()` | Warten auf eine Sperre abbrechen |
| Fairness | Sperre in der Reihenfolge der Anfragen vergeben, auf Kosten des Durchsatzes |
| Mehrere `Condition`s | getrennte Wartebedingungen, etwa „nicht voll“ und „nicht leer“ |

Der Preis: Man muss die Sperre in einem `finally`-Block selbst freigeben. Die Autoren empfehlen deshalb, `synchronized`** als Standard** zu nutzen und `ReentrantLock` nur, wenn man eine der zusätzlichen Fähigkeiten braucht. `ReadWriteLock` erlaubt viele gleichzeitige Leser oder einen Schreiber und lohnt sich bei stark leselastigen Datenstrukturen.

## Eigene Synchronisierer

Das vierzehnte Kapitel erklärt **Bedingungswarteschlangen**: Threads warten, bis eine Bedingung über den Zustand wahr wird. Die Regeln für `wait` und `notify` sind streng:

- `wait()` immer **in einer Schleife** aufrufen, die die Bedingung erneut prüft, weil ein Thread auch ohne Benachrichtigung aufwachen kann.
- Im Zweifel `notifyAll()` statt `notify()` verwenden, damit kein Thread übergangen wird.
- Die Sperre halten, während man die Bedingung prüft und `wait` aufruft.

Die meisten Synchronisierer von `java.util.concurrent` basieren auf dem **AbstractQueuedSynchronizer** von Doug Lea. Das Kapitel zeigt, wie man damit eigene baut. In der Praxis braucht man das selten; die mitgelieferten reichen fast immer.

## Atomare Variablen und nichtblockierende Algorithmen

Moderne Prozessoren bieten **Compare-and-Swap**: atomar prüfen, ob eine Speicherstelle einen erwarteten Wert hat, und nur dann einen neuen schreiben. Darauf bauen `AtomicInteger`, `AtomicReference` und nichtblockierende Datenstrukturen auf.

```java
// Nichtblockierender Stack nach Treiber
class ConcurrentStack<E> {
    private final AtomicReference<Node<E>> top = new AtomicReference<>();
    private record Node<E>(E item, Node<E> next) {}

    void push(E item) {
        Node<E> oldTop, newTop;
        do {
            oldTop = top.get();
            newTop = new Node<>(item, oldTop);
        } while (!top.compareAndSet(oldTop, newTop));   // erneut versuchen bei Konflikt
    }
}
```

Nichtblockierende Algorithmen sind unter mäßiger Konkurrenz schneller als Sperren und können keine Deadlocks verursachen. Sie sind aber schwer korrekt zu schreiben. Ein bekanntes Problem ist das **ABA-Problem**: Ein Wert wechselt von A zu B und zurück zu A, und ein CAS bemerkt die Änderung nicht. `AtomicStampedReference` löst es mit einer Versionsnummer, demselben Prinzip wie Fowlers Optimistic Offline Lock.

## Das Java Memory Model

Das letzte Kapitel erklärt, was den Regeln der vorigen Kapitel zugrunde liegt. Die Autoren betonen, dass man das Memory Model für den Alltag nicht im Detail kennen muss, wenn man sich an die Regeln hält. Es erklärt aber, **warum** sie gelten.

### Warum es ein Memory Model braucht

Compiler dürfen Anweisungen umordnen, Prozessoren dürfen Befehle außer der Reihe ausführen, und jeder Kern hat eigene Caches. Ohne Regeln wäre nicht festgelegt, was ein Thread vom Schreiben eines anderen sieht. Das Memory Model ist der Vertrag zwischen Programmierern und JVM: Es sagt, welche Umordnungen erlaubt sind und welche Sichtbarkeit garantiert ist.

### Happens-before

Das zentrale Konzept ist die **Happens-before-Beziehung**. Wenn Aktion A happens-before Aktion B, dann sieht B alle Effekte von A. Ohne diese Beziehung gibt es keine Garantie. Die wichtigsten Regeln:

| Regel | Bedeutung |
|---|---|
| Programmreihenfolge | innerhalb eines Threads gilt die Reihenfolge des Codes |
| Monitor | das Freigeben einer Sperre happens-before jedem späteren Erwerb derselben Sperre |
| volatile | das Schreiben eines `volatile`-Felds happens-before jedem späteren Lesen desselben Felds |
| Thread-Start | `Thread.start()` happens-before jeder Aktion im gestarteten Thread |
| Thread-Ende | jede Aktion eines Threads happens-before dem erfolgreichen Rückkehr von `join()` |
| Unterbrechung | `interrupt()` happens-before der Erkennung der Unterbrechung |
| Transitivität | aus A vor B und B vor C folgt A vor C |

Ein **Data Race** liegt vor, wenn zwei Threads auf dieselbe Variable zugreifen, mindestens einer schreibt und keine Happens-before-Beziehung zwischen den Zugriffen besteht. Programme ohne Data Races verhalten sich so, als würden alle Aktionen in einer einzigen Reihenfolge ausgeführt.

### Huckepack

Klassen aus `java.util.concurrent` garantieren Happens-before-Beziehungen: Ein Element in eine `BlockingQueue` legen happens-before dem Herausnehmen; das Ergebnis eines `Future` zu setzen happens-before `get()`. Man kann sich also **huckepack** auf deren Synchronisation verlassen, ohne selbst zu sperren.

### Double-checked Locking

Das berühmteste Beispiel für die Tücken: verzögerte Initialisierung mit doppelter Prüfung, um die Sperre im Normalfall zu sparen.

```java
// Kaputt ohne volatile: anderer Thread kann halb konstruiertes Objekt sehen
class Broken {
    private static Resource resource;
    static Resource get() {
        if (resource == null) {
            synchronized (Broken.class) {
                if (resource == null) resource = new Resource();
            }
        }
        return resource;
    }
}

// Besser: Lazy Initialization Holder Class
class ResourceFactory {
    private static class Holder { static final Resource INSTANCE = new Resource(); }
    static Resource get() { return Holder.INSTANCE; }      // JVM garantiert sichere, verzögerte Initialisierung
}
```

Seit dem neuen Memory Model funktioniert Double-checked Locking mit `volatile`, aber die Autoren halten es für eine Optimierung ohne Nutzen: Die Holder-Klasse ist einfacher, ebenso schnell und auf natürliche Weise korrekt. Für Singletons empfiehlt Bloch ohnehin ein Enum.

### final-Felder

Für `final`-Felder gibt das Memory Model eine Sondergarantie: Wenn ein Objekt korrekt konstruiert wurde, also `this` im Konstruktor nicht entkommt, sehen alle Threads die im Konstruktor gesetzten Werte der `final`-Felder, auch ohne Synchronisation. Das macht unveränderliche Objekte so wertvoll, und es gilt für Records automatisch.

## Was sich seit 2006 geändert hat

Das Buch beschreibt Java 5 und 6. Seitdem ist viel hinzugekommen, und eine Neuauflage gibt es nicht. Die gute Nachricht: Die **Grundlagen** aus Teil I und das Memory Model gelten unverändert. Was sich geändert hat, sind vor allem die Werkzeuge in Teil II.

### Die wichtigsten Neuerungen

| Java | Neuerung | Bedeutung |
|---|---|---|
| 7 | Fork/Join-Framework | rekursive Zerlegung mit Work Stealing |
| 8 | `CompletableFuture` | Verkettung asynchroner Schritte ohne Blockieren |
| 8 | parallele Streams | Datenparallelität mit einer Methode, auf dem gemeinsamen Fork/Join-Pool |
| 8 | `ConcurrentHashMap` neu, `LongAdder`, `StampedLock` | keine Segmente mehr, `computeIfAbsent`, Zähler mit wenig Konkurrenz, optimistisches Lesen |
| 9 | `VarHandle`, Flow API | feinere Speicherzugriffe; Reactive Streams als Standard |
| 21 | **Virtual Threads** | Threads, die die JVM statt des Betriebssystems verwaltet; Millionen gleichzeitig möglich |
| 24 | `synchronized` ohne Pinning | Virtual Threads blockieren in `synchronized` nicht mehr ihren Träger-Thread |
| 25 | **Scoped Values** final | unveränderlicher, vererbbarer Kontext statt `ThreadLocal` |
| 28 (März 2027) | **Structured Concurrency** final | Gruppen zusammengehöriger Aufgaben als eine Einheit; in JDK 27 noch Preview |

### Virtual Threads verändern Teil II

Die Begründung für Thread-Pools in Kapitel 6 war, dass Threads teuer sind. Virtual Threads sind billig. Damit kehrt das Modell **ein Thread pro Aufgabe** zurück, das die Autoren 2006 als riskant beschrieben, und blockierender Code ist wieder in Ordnung.

| Ratschlag 2006 | Mit Virtual Threads |
|---|---|
| Thread-Pools statt Thread pro Aufgabe | Virtual Threads **nicht poolen**, sondern pro Aufgabe neu erzeugen |
| Pool-Größe nach Formel begrenzen | Begrenzung über die eigentliche Ressource, etwa mit einer `Semaphore` für Datenbankverbindungen |
| Asynchrone Verkettung, um Threads nicht zu blockieren | schlichter, blockierender Code; `CompletableFuture` und reaktive Frameworks werden seltener nötig |
| `ThreadLocal` für Kontext | sparsam einsetzen, bei Millionen Threads teuer; besser Scoped Values |
| Abbruch über `Future.cancel` und Unterbrechung | Structured Concurrency bricht Geschwister automatisch ab |

```java
// Thread pro Aufgabe mit Virtual Threads und Structured Concurrency (JDK 28-API)
OrderView load(OrderId id) throws InterruptedException, ExecutionException {
    try (var scope = StructuredTaskScope.open()) {                 // alle müssen gelingen
        var order    = scope.fork(() -> orders.find(id));          // jeder fork: eigener Virtual Thread
        var customer = scope.fork(() -> customers.findFor(id));
        var shipment = scope.fork(() -> shipping.statusOf(id));
        scope.join();                                              // scheitert einer, werden die anderen abgebrochen
        return new OrderView(order.get(), customer.get(), shipment.get());
    }
}
```

Das löst gleich mehrere Probleme aus Kapitel 7: Kein Thread überlebt den Block, Abbruch geschieht automatisch, und Thread-Dumps zeigen die Hierarchie der Aufgaben. Nach den Berichten zu JEP 533 werfen die Standard-Joiner ab JDK 27 `ExecutionException` wie `Future.get()`, nicht mehr die frühere `FailedException`.

### Was gleich bleibt

- **Gemeinsamer, veränderlicher Zustand** ist bei Virtual Threads genauso gefährlich. Mehr Threads bedeuten eher mehr Wettlaufsituationen.
- **Sichtbarkeit, Happens-before, sichere Veröffentlichung** und Unveränderlichkeit gelten unverändert.
- **Deadlocks** und Sperrreihenfolgen bleiben dieselben.
- **Ressourcengrenzen** verschwinden nicht: Eine Datenbank verträgt nicht eine Million gleichzeitige Verbindungen, nur weil die JVM eine Million Threads verwalten kann. Nygards Bulkheads und Back Pressure werden eher wichtiger.
- **Rechenintensive Arbeit** profitiert nicht von Virtual Threads; dafür bleiben Plattform-Threads, Fork/Join und parallele Streams.

Brian Goetz hat in Vorträgen die Grundlagen des Buchs mehrfach als weiterhin gültig bezeichnet. Teil I und das Memory Model sind zeitlos, Teil II liest man heute mit Virtual Threads im Kopf.

## Kritik und Einordnung

Java Concurrency in Practice gilt seit zwanzig Jahren als unverzichtbar für Java-Entwickler, die mit Nebenläufigkeit arbeiten. Kritik richtet sich weniger gegen den Inhalt als gegen sein Alter.

### Stärken

- **Von den Erbauern geschrieben:** Die Autoren haben die Bibliothek und das Memory Model selbst entworfen. Die Erklärungen sind entsprechend präzise.
- **Prinzipien statt Rezepte:** Das Buch lehrt, über Zustand, Sichtbarkeit und Invarianten nachzudenken, nicht nur Klassen zu verwenden.
- **Schrittweise Beispiele:** Jedes Kapitel zeigt naive Lösungen, ihre Fehler und Verbesserungen. Man lernt die Fehler zu erkennen, die man selbst machen würde.
- **Dokumentation als Teil der Lösung:** Die Annotationen `@ThreadSafe` und `@GuardedBy` sind eine praktische Idee, die bis heute nachwirkt.
- **Zeitlose Grundlagen:** Teil I und das Memory Model gelten unverändert.

### Kritikpunkte

**1. Veraltete Werkzeuge.** Es fehlen Fork/Join, `CompletableFuture`, parallele Streams, Virtual Threads, Structured Concurrency und Scoped Values. Kapitel 9 über GUI-Anwendungen behandelt Swing.

**2. Dicht und anspruchsvoll.** Das Buch setzt sorgfältiges Lesen voraus. Teil IV und das Memory-Model-Kapitel sind für viele Entwickler zu tief für den Alltag.

**3. Sperren als Hauptwerkzeug.** Das Buch erwähnt Unveränderlichkeit und Thread-Beschränkung als bessere Alternativen, widmet aber den größten Teil dem korrekten Sperren. Aus heutiger Sicht, nach Weidig und der funktionalen Wende in Java, würde man stärker mit unveränderlichen Daten, Nachrichten und strukturierten Abläufen beginnen.

**4. Verteilte Nebenläufigkeit fehlt.** Das Buch behandelt Nebenläufigkeit in einer JVM. Viele heutige Probleme, etwa verlorene Updates zwischen Diensten oder doppelt verarbeitete Nachrichten, sind verteilte Probleme. Dafür braucht man Kleppmann.

**5. Wenig über reaktive Ansätze.** Aktoren, Reactive Streams und Event Loops kommen kaum vor. Mit Virtual Threads hat sich das allerdings teilweise erledigt, weil blockierender Code wieder akzeptabel ist.

### Gesamturteil

Teil I und das Memory Model sollte jeder Java-Entwickler einmal gründlich gelesen haben; sie erklären Fehler, die man sonst für unerklärlich hält. Teil II liest man mit Virtual Threads und Structured Concurrency im Kopf, Teil IV nach Bedarf. Kein anderes Buch ersetzt es, und eine Neuauflage wäre einer der größten Wünsche der Java-Gemeinschaft.

## Bezüge zur Reihe

| Thema bei Goetz u.a. | Bezug in der Reihe |
|---|---|
| Unveränderlichkeit als sicherster Weg | Bloch: Veränderlichkeit minimieren; Weidig: Unveränderlichkeit, Records; Martin: FP entfernt Zuweisung |
| Synchronisationsstrategie dokumentieren | Ousterhout: Schnittstellenkommentare; Bloch: Thread-Sicherheit dokumentieren |
| Lesen-ändern-schreiben, verlorene Updates | Kleppmann: Lost Updates, Write Skew; Fowler PoEAA: Optimistic Offline Lock |
| Compare-and-Swap, ABA | Kleppmann: Compare-and-Set in Datenbanken; Fowler: Versionsnummern |
| Beschränkte Warteschlangen, Caller Runs | Nygard: Back Pressure, Shed Load |
| Getrennte Pools pro Aufgabenart | Nygard: Bulkheads |
| Unbegrenzte Thread-Erzeugung | Nygard: unbegrenzte Ergebnismengen; Richards und Ford: Elastizität |
| Amdahls Gesetz | Brooks: Kommunikationsaufwand in Teams als serieller Anteil |
| Thread-Hunger-Deadlock | Nygard: Kaskadenausfälle über erschöpfte Pools |
| Nebenläufigkeit testen, Reviews | McConnell: Reviews finden andere Fehler; GOOS: flackernde Tests, Awaitility |
| Holder-Idiom statt Double-checked Locking | Bloch: Enum-Singleton, Lazy Initialization mit Bedacht |
| Structured Concurrency | Richards und Ford: Orchestrierung; Thomas und Hunt: Ressourcen abschließen, was man beginnt |

## Diskussionsfragen

1. **Nebenläufigkeitsfehler:** Welcher war der hartnäckigste, den du erlebt hast? Welche Kategorie aus dem Buch steckte dahinter: Atomarität, Sichtbarkeit, Veröffentlichung, Deadlock?
2. **Unveränderlichkeit:** Wie viel eures gemeinsam genutzten Zustands könnte unveränderlich sein? Was hindert euch?
3. **Virtual Threads:** Nutzt ihr sie schon? Habt ihr Thread-Pools, reaktiven Code oder `CompletableFuture`-Ketten dadurch ersetzt?
4. **Ressourcen begrenzen:** Wenn Threads nichts mehr kosten, wo begrenzt ihr gleichzeitige Zugriffe auf Datenbank und Fremddienste?
5. **ThreadLocal:** Wo verwendet ihr `ThreadLocal`, etwa für Sicherheitskontext oder Transaktionen, und wäre das ein Fall für Scoped Values?
6. **Structured Concurrency:** Würdest du nach JDK 28 parallele Abfragen damit umbauen, oder reicht euch der heutige Stand?
7. **Testen:** Wie testet ihr nebenläufigen Code? Gibt es Tests, die gelegentlich fehlschlagen und deshalb ignoriert werden?
8. **Weiter:** Damit sind alle klassischen IT-Bücher besprochen. Als Nächstes die KI-Reihe mit Chip Huyens *AI Engineering*?
