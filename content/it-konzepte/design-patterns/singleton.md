+++
title = "Singleton"
description = "Genau eine Instanz mit globalem Zugriffspunkt"
date = 2026-10-26T14:19:00+01:00
nummer = 5
gruppe = "erzeugung"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 5 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/singleton.html" titel="Singleton – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Beim ersten getInstance() lädt die JVM erst die Klasse Holder, und nur dabei läuft der private Konstruktor. Beim zweiten Aufruf passiert nichts mehr davon. Von den 10.000 virtuellen Threads sind drei einzeln zu sehen: Jeder bekommt dieselbe Konfiguration und eine eigene ID. Der Rest folgt in einem Schritt.

*GoF-Erzeugungsmuster · Java 21*

## Zweck

Ein Singleton stellt sicher, dass eine Klasse **genau eine Instanz** hat, und bietet einen globalen Zugriffspunkt darauf.

## Das Problem

Manche Dinge gibt es in einer Anwendung nur einmal: die geladene Konfiguration, einen fortlaufenden ID-Zähler, einen Verbindungspool. Würde jeder Programmteil sein eigenes Exemplar mit `new` anlegen, würde die Konfiguration mehrfach geladen und der Zähler vergäbe doppelte IDs.

## Die Lösung

Die Klasse übernimmt selbst die Kontrolle über ihre Instanziierung. Der Konstruktor wird `private`, damit niemand von außen `new` aufrufen kann. Die einzige Instanz liegt in einem statischen Feld und wird über eine statische Methode herausgegeben. Schwierig wird es erst durch drei Anforderungen: Die Instanz soll eventuell erst bei Bedarf entstehen (*lazy*), der Zugriff muss *threadsicher* sein, und Serialisierung oder Reflection dürfen keine zweite Instanz erzeugen.

## Die Beteiligten

- **Singleton**: `IdGenerator` bzw. `Konfiguration` verwaltet die eigene, einzige Instanz und gibt sie über einen festen Zugriffspunkt heraus.
- **Client**: greift ausschließlich über diesen Zugriffspunkt zu.

## Variante 1: Enum-Singleton

Ein `enum` mit genau einem Wert ist die einfachste und robusteste Umsetzung. Die JVM garantiert, dass jede Enum-Konstante genau einmal existiert. Selbst Serialisierung und Reflection können keine zweite Instanz erzeugen. Joshua Bloch nennt sie in *Effective Java* die beste Art, ein Singleton zu implementieren. Einschränkung: Ein Enum kann nicht von einer anderen Klasse erben.

## Variante 2: Holder-Idiom

Wenn die Instanz teuer ist und erst beim ersten Bedarf entstehen soll, eignet sich das *Initialization-on-demand-Holder-Idiom*. Die statische innere Klasse `Holder` wird von der JVM erst geladen, wenn `getInstance()` zum ersten Mal aufgerufen wird. Da das Laden einer Klasse von der JVM threadsicher erledigt wird, braucht es weder `synchronized` noch `volatile`. Die Ausgabe zeigt, dass „Konfiguration wird geladen“ tatsächlich erst nach „Vor dem ersten Zugriff“ erscheint.

## Java-21-Details

Die Threadsicherheit wird mit 10.000 **virtuellen Threads** geprüft, einem Feature, das mit Java 21 final wurde. `Executors.newVirtualThreadPerTaskExecutor()` startet für jede Aufgabe einen eigenen leichtgewichtigen Thread. Durch try-with-resources wartet `close()` automatisch, bis alle fertig sind. Das Ergebnis: eine einzige Instanz und 10.000 eindeutige IDs.

## Quellcode

Die Datei `Singleton.java` ist ohne Build-Tool direkt ausführbar: `java Singleton.java`

```
// Singleton (GoF, Erzeugungsmuster)
// Eine Klasse hat genau eine Instanz und bietet einen globalen Zugriffspunkt darauf.
// Start: java Singleton.java

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicLong;

public class Singleton {

    // --- Variante 1: Enum-Singleton (von Joshua Bloch empfohlen) ---
    // Die JVM garantiert genau eine Instanz, auch bei Serialisierung und Reflection.
    enum IdGenerator {
        INSTANCE;

        private final AtomicLong zaehler = new AtomicLong();

        long naechsteId() { return zaehler.incrementAndGet(); }
    }

    // --- Variante 2: Holder-Idiom (lazy und threadsicher ohne synchronized) ---
    static final class Konfiguration {
        private final String umgebung;

        private Konfiguration() {                // privat: kein "new" von außen
            System.out.println("  (Konfiguration wird geladen ...)");
            this.umgebung = System.getProperty("umgebung", "produktion");
        }

        // Die innere Klasse wird erst beim ersten Zugriff auf getInstance() geladen.
        private static final class Holder {
            static final Konfiguration INSTANCE = new Konfiguration();
        }

        static Konfiguration getInstance() { return Holder.INSTANCE; }

        String umgebung() { return umgebung; }
    }

    public static void main(String[] args) throws Exception {
        // Lazy: die Konfiguration entsteht erst beim ersten Aufruf
        System.out.println("Vor dem ersten Zugriff");
        Konfiguration k1 = Konfiguration.getInstance();
        Konfiguration k2 = Konfiguration.getInstance();
        System.out.println("Umgebung: " + k1.umgebung());
        System.out.println("k1 == k2: " + (k1 == k2));

        // Threadsicherheit: 10.000 virtuelle Threads holen sich die Instanz und je eine ID
        Set<Konfiguration> instanzen = ConcurrentHashMap.newKeySet();
        Set<Long> ids = ConcurrentHashMap.newKeySet();

        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10_000; i++) {
                executor.submit(() -> {
                    instanzen.add(Konfiguration.getInstance());
                    ids.add(IdGenerator.INSTANCE.naechsteId());
                });
            }
        }   // close() wartet, bis alle Threads fertig sind

        System.out.println("Verschiedene Instanzen: " + instanzen.size());
        System.out.println("Eindeutige IDs:         " + ids.size());
    }
}
```

## Ausgabe

```
Vor dem ersten Zugriff
  (Konfiguration wird geladen ...)
Umgebung: produktion
k1 == k2: true
Verschiedene Instanzen: 1
Eindeutige IDs:         10000
```

## Was man nicht tun sollte

Die naive Lazy-Variante `if (instance == null) instance = new X();` ist **nicht threadsicher**: Zwei Threads können gleichzeitig `null` sehen und zwei Instanzen erzeugen. Die verbreitete Reparatur per *Double-Checked Locking* funktioniert in Java nur, wenn das Feld `volatile` ist, und ist fehleranfällig. Enum oder Holder-Idiom lösen das Problem einfacher.

## Wann einsetzen?

- Es muss technisch zwingend genau ein Exemplar geben, etwa bei einem Zähler, der eindeutige Werte vergibt.
- Die Instanz ist teuer und soll nur einmal aufgebaut werden.
- Es gibt keinen sinnvollen Ort, an dem man die Instanz erzeugen und weiterreichen könnte.

## Nachteile

Das Singleton ist das umstrittenste der GoF-Muster. Es ist im Kern ein **globaler Zustand**: Abhängigkeiten sind im Code nicht sichtbar, weil eine Klasse sich die Instanz einfach selbst holt. Das erschwert **Tests**, denn das Singleton lässt sich schlecht durch eine Attrappe ersetzen, und sein Zustand überlebt von einem Test zum nächsten. Heute erzeugt man solche Objekte meist einmal zentral und reicht sie per **Dependency Injection** weiter. Frameworks wie Spring verwalten Beans standardmäßig ohnehin als Singletons, ohne dass die Klasse selbst dafür sorgen muss.

## Verwandte Muster

**Abstract Factory**, **Builder** und **Prototype** können als Singleton umgesetzt werden, wenn es nur eine Fabrik geben soll. **Facade**-Objekte sind oft Singletons, weil eine Fassade pro Subsystem genügt. **Flyweight** ähnelt dem Singleton, verwaltet aber viele geteilte Instanzen statt einer einzigen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Singleton.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
