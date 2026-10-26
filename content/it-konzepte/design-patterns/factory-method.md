+++
title = "Factory Method"
description = "Unterklassen entscheiden, welche Klasse instanziiert wird"
date = 2026-10-26T14:14:00+01:00
nummer = 3
gruppe = "erzeugung"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 3 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/factory-method.html" titel="Factory Method – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Achte auf den Aufrufstapel: planeLieferung() läuft in der Oberklasse Logistik, ruft aber erzeugeTransport() auf, und diese Methode kommt aus der Unterklasse. Im Klassendiagramm leuchten dabei beide Klassen auf. Das Produkt entsteht nur in der Unterklasse, die Oberklasse sieht es bloß als Transport.

*GoF-Erzeugungsmuster · Java 21*

## Zweck

Die Factory Method definiert eine Schnittstelle zum Erzeugen eines Objekts, überlässt aber den **Unterklassen** die Entscheidung, welche Klasse instanziiert wird. Die Oberklasse enthält die Logik, die Unterklasse liefert nur das passende Objekt.

## Das Problem

Eine Logistik-Software plant Lieferungen. Anfangs fährt alles per Lkw, also steht im Planungscode `new Lkw(...)`. Kommt Seefracht hinzu, müsste man in diese Logik eingreifen und Fallunterscheidungen einbauen. Mit jeder weiteren Transportart wächst das `if`-Geflecht, und die eigentlich stabile Planungslogik muss jedes Mal angefasst werden.

## Die Lösung

Der Aufruf von `new` wird in eine eigene, überschreibbare Methode ausgelagert: die Fabrikmethode `erzeugeTransport()`. Die Planungslogik in der Oberklasse ruft nur diese Methode auf und arbeitet ausschließlich mit dem Interface `Transport`. Jede Unterklasse überschreibt die Fabrikmethode und liefert ihr eigenes Produkt. Eine neue Transportart bedeutet: eine neue Unterklasse, keine Änderung am bestehenden Code.

## Die Beteiligten

- **Product**: `Transport` ist die Schnittstelle aller erzeugten Objekte.
- **ConcreteProduct**: `Lkw` und `Schiff` implementieren sie.
- **Creator**: `Logistik` deklariert die abstrakte Fabrikmethode und enthält die Geschäftslogik `planeLieferung()`.
- **ConcreteCreator**: `StrassenLogistik` und `SeeLogistik` überschreiben die Fabrikmethode.

Factory Method ist eines der wenigen *klassenbasierten* GoF-Muster: Die Variation entsteht durch Vererbung, nicht durch Komposition.

## Java-21-Details

Die Produkte sind `record`s. `planeLieferung()` ist `final`, damit Unterklassen nur die Fabrikmethode austauschen, nicht den Ablauf. Die Fabrikmethode ist `protected`, weil sie ein Erweiterungspunkt für Unterklassen ist und kein Teil der öffentlichen API.

## Quellcode

Die Datei `FactoryMethod.java` ist ohne Build-Tool direkt ausführbar: `java FactoryMethod.java`

```
// Factory Method (GoF, Erzeugungsmuster)
// Eine Oberklasse definiert den Ablauf, Unterklassen entscheiden, welches Objekt erzeugt wird.
// Start: java FactoryMethod.java

public class FactoryMethod {

    // --- Produkt ---
    interface Transport {
        String liefere(String ware);
    }

    // --- Konkrete Produkte ---
    record Lkw(String kennzeichen) implements Transport {
        public String liefere(String ware) {
            return ware + " per Lkw " + kennzeichen + " über die Straße";
        }
    }

    record Schiff(String name) implements Transport {
        public String liefere(String ware) {
            return ware + " per Schiff \"" + name + "\" über das Meer";
        }
    }

    // --- Creator: enthält die Geschäftslogik und die abstrakte Fabrikmethode ---
    static abstract class Logistik {

        // Die Factory Method: Unterklassen legen das konkrete Produkt fest
        protected abstract Transport erzeugeTransport();

        // Geschäftslogik, die nur mit dem Produkt-Interface arbeitet
        public final void planeLieferung(String ware) {
            Transport t = erzeugeTransport();
            System.out.println(getClass().getSimpleName() + ": " + t.liefere(ware));
        }
    }

    // --- Konkrete Creator ---
    static final class StrassenLogistik extends Logistik {
        @Override
        protected Transport erzeugeTransport() {
            return new Lkw("HH-AB 123");
        }
    }

    static final class SeeLogistik extends Logistik {
        @Override
        protected Transport erzeugeTransport() {
            return new Schiff("Hanseatic");
        }
    }

    public static void main(String[] args) {
        Logistik[] logistiker = { new StrassenLogistik(), new SeeLogistik() };

        for (Logistik l : logistiker) {
            l.planeLieferung("20 Paletten Kaffee");
        }
    }
}
```

## Ausgabe

```
StrassenLogistik: 20 Paletten Kaffee per Lkw HH-AB 123 über die Straße
SeeLogistik: 20 Paletten Kaffee per Schiff "Hanseatic" über das Meer
```

## Wann einsetzen?

- Eine Klasse kann nicht vorhersehen, welche Objekte sie erzeugen muss.
- Unterklassen sollen festlegen, welche Objekte entstehen, während der Ablauf gleich bleibt.
- Ein Framework oder eine Bibliothek soll Nutzern erlauben, eigene Komponenten unterzuschieben.

## Nachteile

Für jede Produktvariante braucht es eine eigene Creator-Unterklasse, die Klassenhierarchie wächst also parallel. In modernem Java lässt sich das oft schlanker lösen, indem man dem Creator einen `Supplier<Transport>` übergibt, statt ihn abzuleiten. Das ist dann allerdings Komposition und streng genommen eher Strategy.

## Abgrenzung: statische Fabrikmethoden

Methoden wie `List.of()`, `Optional.of()` oder `LocalDate.now()` heißen ebenfalls „Fabrikmethoden“, sind aber *nicht* das GoF-Muster. Sie sind statisch und können nicht überschrieben werden. Ihr Zweck ist ein besser benannter Ersatz für Konstruktoren.

## Verwandte Muster

**Abstract Factory** wird häufig mit mehreren Factory Methods umgesetzt. Factory Methods werden typischerweise innerhalb einer **Template Method** aufgerufen, wie hier `erzeugeTransport()` innerhalb von `planeLieferung()`. **Prototype** kommt ohne Creator-Unterklassen aus, braucht dafür aber eine Initialisierung des zu klonenden Objekts.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java FactoryMethod.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
