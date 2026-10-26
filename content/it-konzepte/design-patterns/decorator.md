+++
title = "Decorator"
description = "Verhalten dynamisch hinzufügen durch Umhüllen"
date = 2026-10-26T19:09:00+01:00
nummer = 9
gruppe = "struktur"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 9 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/decorator.html" titel="Decorator – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Jede Bestellung baut ihr Getränk von innen nach außen. Danach sieht man im Aufrufstapel, wie eine Frage durch die Hüllen nach innen wandert: Jeder Decorator fragt erst sein Feld innen und ergänzt dann seinen Teil auf dem Rückweg. Bei den Bestellungen 4 und 5 ist der Preis Schritt für Schritt zu sehen, dort zählt die Reihenfolge. Am Ende legt andThen() dieselben Hüllen um Funktionen.

*GoF-Strukturmuster · Java 21*

## Zweck

Der Decorator fügt einem Objekt **zur Laufzeit zusätzliches Verhalten** hinzu, ohne dessen Klasse zu ändern. Dazu wird das Objekt von einem anderen Objekt mit derselben Schnittstelle umhüllt. Mehrere Decorators lassen sich wie Zwiebelschalen übereinanderlegen.

## Das Problem

Ein Café verkauft Espresso und Filterkaffee, dazu Extras wie Milch, Sirup oder die doppelte Menge. Bildet man jede Kombination als Unterklasse ab, entstehen Klassen wie `EspressoMitMilch`, `EspressoMitMilchUndSirup`, `DoppelterFilterkaffeeMitMilch` und so weiter. Ihre Zahl wächst exponentiell mit jedem neuen Extra. Außerdem steht bei Vererbung zur Compilezeit fest, was ein Objekt kann. Ein Kunde, der sich erst an der Kasse für Milch entscheidet, lässt sich so nicht abbilden.

## Die Lösung

Jedes Extra wird eine eigene kleine Klasse, die dasselbe Interface `Getraenk` implementiert wie die Grundgetränke und ein anderes `Getraenk` in sich trägt. Fragt man einen Decorator nach Preis oder Beschreibung, reicht er die Frage nach innen weiter und ergänzt seinen eigenen Anteil. Weil Decorator und dekoriertes Objekt dieselbe Schnittstelle haben, kann ein Decorator wiederum dekoriert werden. Für den Client sieht ein Espresso mit Milch und Sirup aus wie jedes andere Getränk.

## Die Beteiligten

- **Component**: `Getraenk` ist die gemeinsame Schnittstelle.
- **ConcreteComponent**: `Espresso` und `Filterkaffee` sind die Grundobjekte, die dekoriert werden.
- **Decorator**: hält eine Referenz auf ein Component und implementiert dessen Schnittstelle. Im GoF-Buch ist das eine abstrakte Oberklasse. Hier übernimmt jeder Record das Feld `innen` selbst, weil Records nicht erben können.
- **ConcreteDecorator**: `MitMilch`, `MitSirup` und `DoppelteMenge` ergänzen jeweils ihr eigenes Verhalten.

## Die Reihenfolge zählt

Decorators werden von innen nach außen ausgewertet, und ihre Reihenfolge kann das Ergebnis verändern. Die Ausgabe zeigt es: „Milch auf einen doppelten Espresso“ kostet 4,80 €, „einen Espresso mit Milch verdoppeln“ dagegen 5,20 €, weil im zweiten Fall auch die Milch doppelt berechnet wird. Das ist kein Fehler, sondern genau die Flexibilität des Musters. Man muss sie aber im Blick behalten.

## Java-21-Details

Grundobjekte und Decorators sind `record`s. Der Decorator braucht ja nur das umhüllte Objekt und gegebenenfalls einen Parameter, etwa die Sirupsorte. Am Ende zeigt das Beispiel die **funktionale Variante**: Ist die Schnittstelle eine Funktion, etwa `UnaryOperator<String>`, dann ist jedes Lambda ein Decorator, und `andThen()` legt sie übereinander. So entstehen Verarbeitungsketten ganz ohne eigene Klassen.

## Quellcode

Die Datei `Decorator.java` ist ohne Build-Tool direkt ausführbar: `java Decorator.java`

```
// Decorator (GoF, Strukturmuster)
// Fügt einem Objekt dynamisch zusätzliches Verhalten hinzu, indem es von einem Objekt
// mit derselben Schnittstelle umhüllt wird.
// Start: java Decorator.java

import java.util.Locale;
import java.util.function.UnaryOperator;

public class Decorator {

    // --- Component: gemeinsame Schnittstelle ---
    interface Getraenk {
        String beschreibung();
        int preisCent();
    }

    // --- ConcreteComponent: das Grundobjekt ---
    record Espresso() implements Getraenk {
        public String beschreibung() { return "Espresso"; }
        public int preisCent()       { return 220; }
    }

    record Filterkaffee() implements Getraenk {
        public String beschreibung() { return "Filterkaffee"; }
        public int preisCent()       { return 180; }
    }

    // --- Decorators: haben dieselbe Schnittstelle und umhüllen ein Getraenk ---
    record MitMilch(Getraenk innen) implements Getraenk {
        public String beschreibung() { return innen.beschreibung() + " + Milch"; }
        public int preisCent()       { return innen.preisCent() + 40; }
    }

    record MitSirup(Getraenk innen, String sorte) implements Getraenk {
        public String beschreibung() { return innen.beschreibung() + " + " + sorte + "-Sirup"; }
        public int preisCent()       { return innen.preisCent() + 60; }
    }

    record DoppelteMenge(Getraenk innen) implements Getraenk {
        public String beschreibung() { return "2x (" + innen.beschreibung() + ")"; }
        public int preisCent()       { return innen.preisCent() * 2; }
    }

    // --- Client: kennt nur Getraenk ---
    static void bestelle(Getraenk g) {
        System.out.printf(Locale.GERMANY, "%-42s %5.2f €%n", g.beschreibung(), g.preisCent() / 100.0);
    }

    public static void main(String[] args) {
        bestelle(new Espresso());
        bestelle(new MitMilch(new Espresso()));
        bestelle(new MitSirup(new MitMilch(new Filterkaffee()), "Karamell"));

        // Reihenfolge zählt: erst verdoppeln, dann Milch, oder umgekehrt
        bestelle(new MitMilch(new DoppelteMenge(new Espresso())));
        bestelle(new DoppelteMenge(new MitMilch(new Espresso())));

        // Mehrfach derselbe Decorator
        bestelle(new MitMilch(new MitMilch(new Espresso())));

        // Funktionale Variante: Decorators als UnaryOperator, verkettet mit andThen
        UnaryOperator<String> trimmen   = String::strip;
        UnaryOperator<String> gross     = String::toUpperCase;
        UnaryOperator<String> rahmen    = s -> "[ " + s + " ]";

        var pipeline = trimmen.andThen(gross).andThen(rahmen);
        System.out.println();
        System.out.println(pipeline.apply("   cappuccino to go   "));
    }
}
```

## Ausgabe

```
Espresso                                    2,20 €
Espresso + Milch                            2,60 €
Filterkaffee + Milch + Karamell-Sirup       2,80 €
2x (Espresso) + Milch                       4,80 €
2x (Espresso + Milch)                       5,20 €
Espresso + Milch + Milch                    3,00 €

[ CAPPUCCINO TO GO ]
```

## Wann einsetzen?

- Objekten soll einzeln und zur Laufzeit Verhalten hinzugefügt werden, ohne andere Objekte derselben Klasse zu beeinflussen.
- Erweiterungen sollen frei kombinierbar sein und Vererbung würde zu einer Klassenexplosion führen.
- Die zu erweiternde Klasse ist `final` oder stammt aus einer Bibliothek und lässt sich nicht ableiten.
- Querschnittsaufgaben wie Logging, Caching, Pufferung, Verschlüsselung oder Kompression sollen um ein bestehendes Objekt gelegt werden.

## Nachteile

Es entstehen viele kleine, ähnliche Objekte, und ein stark dekoriertes Objekt ist schwer zu debuggen, weil man sich durch mehrere Schichten hangeln muss. Ein Decorator ist zudem nicht identisch mit dem Objekt, das er umhüllt: Wer mit `==` oder `instanceof` auf den konkreten Typ prüft, findet nur die äußerste Schicht. Einen bestimmten Decorator mitten aus dem Stapel wieder zu entfernen, ist nicht vorgesehen.

## Beispiele aus dem JDK

Das bekannteste Beispiel ist `java.io`: In `new BufferedReader(new InputStreamReader(new FileInputStream("datei.txt")))` legt jede Schicht eine Fähigkeit um die vorige, etwa Pufferung um das Lesen. Ebenso funktionieren `GZIPInputStream` und `DataInputStream`. `Collections.unmodifiableList()` und `Collections.synchronizedList()` dekorieren eine vorhandene Liste mit Schreibschutz bzw. Synchronisation.

## Verwandte Muster

Der **Adapter** ändert die Schnittstelle eines Objekts, der Decorator behält sie bei und erweitert das Verhalten. Der **Proxy** hat dieselbe Struktur, kontrolliert aber den Zugriff, statt Funktionalität hinzuzufügen, und erzeugt sein Objekt oft selbst. Ein Decorator ist wie ein **Composite** mit genau einem Kind. **Strategy** verändert das Innere eines Objekts, der Decorator seine Hülle. **Chain of Responsibility** ist ähnlich aufgebaut, dort kann aber jedes Glied die Verarbeitung abbrechen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Decorator.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
