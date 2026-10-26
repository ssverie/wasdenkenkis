+++
title = "Builder"
description = "Komplexe Objekte schrittweise aufbauen, Konstruktion von Repräsentation getrennt"
date = 2026-10-26T13:44:00+01:00
nummer = 2
gruppe = "erzeugung"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 2 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/builder.html" titel="Builder – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Man sieht, wie der Builder seine Felder sammelt, wie jede Methode this zurückgibt und wie erst build() die unveränderliche Pizza erzeugt. Dazu kommen die beiden Rezepte des Directors und der Fehlerfall ohne Belag. „Bis Ausgabe“ springt von einer Konsolenzeile zur nächsten.

*GoF-Erzeugungsmuster · Java 21*

## Zweck

Der Builder trennt die **Konstruktion eines komplexen Objekts** von seiner Repräsentation. Das Objekt wird Schritt für Schritt zusammengesetzt und erst am Ende mit `build()` fertiggestellt.

## Das Problem

Eine Pizza hat Größe, Teig, beliebig viele Beläge und optional Extra-Käse. Ein Konstruktor mit allen Parametern wird schnell unlesbar: Was bedeutet `new Pizza("gross", "klassisch", liste, true)`? Mehrere überladene Konstruktoren für jede Kombination (das sogenannte *Telescoping-Constructor*-Problem) skalieren nicht. Setter wiederum machen das Objekt veränderlich und erlauben halbfertige Zustände.

## Die Lösung

Ein separates Builder-Objekt sammelt die Angaben über sprechende Methoden. Jede Methode gibt den Builder selbst zurück, wodurch sich die Aufrufe verketten lassen (*Fluent Interface*). Erst `build()` prüft die Angaben und erzeugt das fertige, unveränderliche Produkt. Ein optionaler **Director** kapselt wiederkehrende Bauanleitungen.

## Die Beteiligten

- **Builder**: `PizzaBuilder` stellt die einzelnen Bauschritte bereit und liefert am Ende das Produkt.
- **Director**: `Speisekarte` kennt feste Rezepte und ruft die Bauschritte in der richtigen Reihenfolge auf.
- **Product**: `Pizza` ist das fertige Objekt.

Im GoF-Buch ist der Builder ein Interface mit mehreren konkreten Buildern, die aus denselben Bauschritten unterschiedliche Produkte erzeugen (etwa ein Dokument als HTML oder als PDF). In heutigem Java ist die hier gezeigte Variante mit einem einzigen Builder für ein unveränderliches Objekt die mit Abstand häufigste, bekannt geworden durch Joshua Blochs *Effective Java*.

## Java-21-Details

Das Produkt ist ein `record` und damit unveränderlich. Der kompakte Konstruktor macht mit `List.copyOf()` eine defensive Kopie, damit die Belag-Liste nachträglich nicht verändert werden kann. Sinnvolle Standardwerte (Größe „mittel“, Teig „klassisch“) stehen im Builder, Pflichtangaben prüft `build()`.

## Quellcode

Die Datei `Builder.java` ist ohne Build-Tool direkt ausführbar: `java Builder.java`

```
// Builder (GoF, Erzeugungsmuster)
// Baut ein komplexes Objekt schrittweise auf und trennt die Konstruktion von der Repräsentation.
// Start: java Builder.java

import java.util.ArrayList;
import java.util.List;

public class Builder {

    // --- Produkt: unveränderlich ---
    record Pizza(String groesse, String teig, List<String> belag, boolean extraKaese) {
        Pizza {
            belag = List.copyOf(belag);   // defensive Kopie, Liste bleibt unveränderlich
        }
    }

    // --- Builder: sammelt die Teile, erzeugt am Ende das Produkt ---
    static final class PizzaBuilder {
        private String groesse = "mittel";
        private String teig = "klassisch";
        private final List<String> belag = new ArrayList<>();
        private boolean extraKaese = false;

        PizzaBuilder groesse(String groesse) { this.groesse = groesse; return this; }
        PizzaBuilder teig(String teig)       { this.teig = teig;       return this; }
        PizzaBuilder belag(String zutat)     { belag.add(zutat);       return this; }
        PizzaBuilder extraKaese()            { extraKaese = true;      return this; }

        Pizza build() {
            if (belag.isEmpty()) {
                throw new IllegalStateException("Eine Pizza braucht mindestens einen Belag");
            }
            return new Pizza(groesse, teig, belag, extraKaese);
        }
    }

    // --- Director: kennt feste Bauanleitungen ---
    static final class Speisekarte {
        static Pizza margherita(PizzaBuilder b) {
            return b.belag("Tomate").belag("Mozzarella").belag("Basilikum").build();
        }
        static Pizza diavolo(PizzaBuilder b) {
            return b.groesse("gross").belag("Tomate").belag("Salami").belag("Peperoni")
                    .extraKaese().build();
        }
    }

    public static void main(String[] args) {
        // Direkt mit dem Builder
        Pizza eigene = new PizzaBuilder()
                .groesse("klein")
                .teig("Vollkorn")
                .belag("Spinat")
                .belag("Feta")
                .build();
        System.out.println("Eigene:     " + eigene);

        // Über den Director
        System.out.println("Margherita: " + Speisekarte.margherita(new PizzaBuilder()));
        System.out.println("Diavolo:    " + Speisekarte.diavolo(new PizzaBuilder()));

        // Validierung in build()
        try {
            new PizzaBuilder().build();
        } catch (IllegalStateException e) {
            System.out.println("Fehler:     " + e.getMessage());
        }
    }
}
```

## Ausgabe

```
Eigene:     Pizza[groesse=klein, teig=Vollkorn, belag=[Spinat, Feta], extraKaese=false]
Margherita: Pizza[groesse=mittel, teig=klassisch, belag=[Tomate, Mozzarella, Basilikum], extraKaese=false]
Diavolo:    Pizza[groesse=gross, teig=klassisch, belag=[Tomate, Salami, Peperoni], extraKaese=true]
Fehler:     Eine Pizza braucht mindestens einen Belag
```

## Wann einsetzen?

- Ein Objekt hat viele, insbesondere optionale Parameter.
- Das fertige Objekt soll unveränderlich sein und nie in einem halbfertigen Zustand existieren.
- Der Aufbau folgt festen Abläufen, die sich als Director-Rezepte wiederverwenden lassen.
- Aus denselben Bauschritten sollen unterschiedliche Repräsentationen entstehen.

## Nachteile

Mehr Code: Jedes Feld taucht im Produkt und im Builder auf. Bei Objekten mit zwei, drei Pflichtfeldern ist ein schlichter Konstruktor oder ein Record allein meist die bessere Wahl.

## Verwandte Muster

**Abstract Factory** erzeugt Familien von Objekten in einem Schritt, Builder baut ein einzelnes komplexes Objekt schrittweise auf. Builder werden oft eingesetzt, um **Composite**-Strukturen zusammenzusetzen. Bekannte Beispiele aus dem JDK sind `StringBuilder`, `HttpRequest.newBuilder()` und `Stream.builder()`.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Builder.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
