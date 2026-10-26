+++
title = "Mediator"
description = "Zentrales Objekt steuert die Kommunikation zwischen Kollegen"
date = 2026-10-26T20:27:00+01:00
nummer = 17
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 17 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/mediator.html" titel="Mediator – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Im Speicher sieht man die fünf Formular-Elemente: Jedes kennt nur den Mediator, keines ein anderes. Ändert sich ein Element, meldet es das dem Dialog, und aktualisiere() legt fest, welche Elemente gesperrt oder freigegeben sind. Die erste Änderung (E-Mail) zeigt alle Aufrufe einzeln, die übrigen in kürzerer Form. Erst nach der letzten Änderung wird Bestellen aktiv.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Ein Mediator (Vermittler) kapselt, wie eine Gruppe von Objekten **zusammenwirkt**. Statt direkt miteinander zu sprechen, melden sich die Objekte nur beim Mediator, und er entscheidet, was daraufhin passiert. Das Prinzip kennt man vom Tower am Flughafen: Die Piloten sprechen nicht untereinander ab, wer wann landet, sondern jeder spricht nur mit dem Tower.

## Das Problem

Ein Bestellformular hat mehrere Elemente, die voneinander abhängen. Ist „Wie Rechnungsadresse“ angehakt, wird das Feld für die Lieferadresse gesperrt. Der Button „Bestellen“ ist nur aktiv, wenn die E-Mail gültig ist, eine Lieferadresse feststeht und die AGB akzeptiert sind. Sprechen die Elemente direkt miteinander, muss die Checkbox das Adressfeld kennen, das Adressfeld den Button, die AGB-Checkbox ebenfalls den Button und so weiter. Es entsteht ein Netz von Abhängigkeiten, in dem jedes Element viele andere kennt. Kein Element ist allein wiederverwendbar, und die Regeln des Formulars sind über alle Klassen verstreut.

## Die Lösung

Die Elemente kennen nur noch den Mediator. Ändert sich etwas, etwa weil der Benutzer tippt oder klickt, meldet das Element lediglich: „Bei mir hat sich etwas geändert.“ Der Mediator `BestellDialog` kennt alle Elemente und enthält die gesamte Logik, wie sie voneinander abhängen. Aus einem Netz mit vielen Verbindungen wird ein Stern mit dem Mediator in der Mitte.

## Die Beteiligten

- **Mediator**: `DialogMediator` definiert die Schnittstelle, über die Kollegen Änderungen melden.
- **ConcreteMediator**: `BestellDialog` kennt alle Kollegen und koordiniert sie.
- **Colleague**: `Element` kennt nur seinen Mediator und meldet sich bei Änderungen.
- **ConcreteColleague**: `Textfeld`, `Checkbox` und `Button` sind die einzelnen Formular-Elemente.

Die Elemente sind dabei völlig allgemein. Eine `Checkbox` weiß nichts von Adressen oder AGB. Dieselbe Klasse ließe sich in jedem anderen Formular wiederverwenden. Die Regeln für genau dieses Formular stehen ausschließlich in der Methode `aktualisiere()` des Mediators.

## Java-21-Details

Die Ausgabe der Elemente nutzt `String.formatted()`, die Kurzform von `String.format()`. Bewusst verzichtet das Beispiel auf Records: Formular-Elemente haben veränderlichen Zustand, und gerade diese Änderungen sind der Anlass für die Kommunikation mit dem Mediator. Der Mediator unterscheidet die Quelle einer Meldung per Identitätsvergleich (`quelle == gleicheAdresse`), weil er seine Elemente selbst erzeugt hat und sie kennt.

## Quellcode

Die Datei `Mediator.java` ist ohne Build-Tool direkt ausführbar: `java Mediator.java`

```
// Mediator (GoF, Verhaltensmuster)
// Ein zentrales Objekt steuert das Zusammenspiel mehrerer Objekte,
// die sich dadurch nicht mehr gegenseitig kennen müssen.
// Start: java Mediator.java

public class Mediator {

    // --- Mediator: Schnittstelle, über die die Kollegen Änderungen melden ---
    interface DialogMediator {
        void geaendert(Element quelle);
    }

    // --- Colleague: kennt nur den Mediator, keine anderen Elemente ---
    static abstract class Element {
        protected final String name;
        protected DialogMediator mediator;
        private boolean aktiv = true;

        Element(String name) { this.name = name; }

        void setMediator(DialogMediator m) { this.mediator = m; }
        void setAktiv(boolean aktiv)       { this.aktiv = aktiv; }
        boolean aktiv()                    { return aktiv; }

        protected void melden() { if (mediator != null) mediator.geaendert(this); }
    }

    // --- Konkrete Colleagues: einfache Formular-Elemente ---
    static final class Textfeld extends Element {
        private String text = "";
        Textfeld(String name) { super(name); }

        void eingeben(String t) { text = t; melden(); }
        String text()           { return text; }
        public String toString() {
            return "%-18s [%s]%s".formatted(name, text, aktiv() ? "" : " (gesperrt)");
        }
    }

    static final class Checkbox extends Element {
        private boolean an;
        Checkbox(String name, boolean an) { super(name); this.an = an; }

        void klicken() { an = !an; melden(); }
        boolean an()   { return an; }
        public String toString() { return "%-18s [%s]".formatted(name, an ? "x" : " "); }
    }

    static final class Button extends Element {
        Button(String name) { super(name); }
        public String toString() { return "%-18s <%s>".formatted(name, aktiv() ? "aktiv" : "gesperrt"); }
    }

    // --- ConcreteMediator: die gesamte Abhängigkeitslogik an EINER Stelle ---
    static final class BestellDialog implements DialogMediator {
        final Textfeld email          = new Textfeld("E-Mail");
        final Checkbox gleicheAdresse = new Checkbox("Wie Rechnungsadr.", true);
        final Textfeld lieferadresse  = new Textfeld("Lieferadresse");
        final Checkbox agb            = new Checkbox("AGB akzeptiert", false);
        final Button bestellen        = new Button("Bestellen");

        BestellDialog() {
            for (Element e : new Element[] { email, gleicheAdresse, lieferadresse, agb, bestellen }) {
                e.setMediator(this);
            }
            aktualisiere();
        }

        @Override
        public void geaendert(Element quelle) {
            System.out.println("  Mediator: Änderung in \"" + quelle.name + "\"");
            if (quelle == gleicheAdresse && gleicheAdresse.an()) {
                lieferadresse.text = "";              // eigene Lieferadresse verwerfen
            }
            aktualisiere();
        }

        private void aktualisiere() {
            lieferadresse.setAktiv(!gleicheAdresse.an());

            boolean emailOk   = email.text().matches("[^@\\s]+@[^@\\s]+\\.[a-z]{2,}");
            boolean adresseOk = gleicheAdresse.an() || !lieferadresse.text().isBlank();
            bestellen.setAktiv(emailOk && adresseOk && agb.an());
        }

        void zeige() {
            for (Element e : new Element[] { email, gleicheAdresse, lieferadresse, agb, bestellen }) {
                System.out.println("    " + e);
            }
        }
    }

    public static void main(String[] args) {
        BestellDialog dialog = new BestellDialog();
        System.out.println("Start:");
        dialog.zeige();

        System.out.println("\nE-Mail eingeben:");
        dialog.email.eingeben("sven@example.de");
        dialog.zeige();

        System.out.println("\nAndere Lieferadresse:");
        dialog.gleicheAdresse.klicken();
        dialog.zeige();

        System.out.println("\nLieferadresse und AGB:");
        dialog.lieferadresse.eingeben("Hafenstraße 7, Hamburg");
        dialog.agb.klicken();
        dialog.zeige();
    }
}
```

## Ausgabe

```
Start:
    E-Mail             []
    Wie Rechnungsadr.  [x]
    Lieferadresse      [] (gesperrt)
    AGB akzeptiert     [ ]
    Bestellen          <gesperrt>

E-Mail eingeben:
  Mediator: Änderung in "E-Mail"
    E-Mail             [sven@example.de]
    Wie Rechnungsadr.  [x]
    Lieferadresse      [] (gesperrt)
    AGB akzeptiert     [ ]
    Bestellen          <gesperrt>

Andere Lieferadresse:
  Mediator: Änderung in "Wie Rechnungsadr."
    E-Mail             [sven@example.de]
    Wie Rechnungsadr.  [ ]
    Lieferadresse      []
    AGB akzeptiert     [ ]
    Bestellen          <gesperrt>

Lieferadresse und AGB:
  Mediator: Änderung in "Lieferadresse"
  Mediator: Änderung in "AGB akzeptiert"
    E-Mail             [sven@example.de]
    Wie Rechnungsadr.  [ ]
    Lieferadresse      [Hafenstraße 7, Hamburg]
    AGB akzeptiert     [x]
    Bestellen          <aktiv>
```

## Wann einsetzen?

- Eine Gruppe von Objekten kommuniziert auf gut definierte, aber komplexe Weise, und die Abhängigkeiten sind unübersichtlich.
- Objekte sollen wiederverwendbar bleiben, was schwierig ist, solange sie viele andere Objekte direkt kennen.
- Verhalten, das über mehrere Klassen verteilt ist, soll an einer Stelle anpassbar sein, ohne viele Unterklassen zu bilden.

Typische Beispiele sind Dialoge und Formulare mit voneinander abhängigen Feldern, Chaträume, in denen Teilnehmer Nachrichten über den Raum statt direkt verschicken, Flugsicherung und Steuerungen, die mehrere Geräte koordinieren.

## Nachteile

Die Komplexität verschwindet nicht, sie wandert in den Mediator. Bei vielen Elementen und Regeln wird er selbst groß und schwer zu überblicken, im schlimmsten Fall zum „Gott-Objekt“, das alles weiß und alles steuert. Außerdem sind Mediatoren meist auf genau eine Situation zugeschnitten, im Beispiel auf genau dieses Formular, und kaum wiederverwendbar. Das ist der Preis dafür, dass die Kollegen es werden.

## Beispiele aus der Praxis

Controller und ViewModels in GUI-Architekturen wie MVC und MVVM übernehmen oft die Rolle des Mediators zwischen den Bedienelementen. Message Broker wie Kafka oder RabbitMQ sind im Großen ähnlich aufgebaut: Dienste schicken Nachrichten an den Broker statt direkt aneinander.

## Verwandte Muster

Die **Facade** vereinfacht den Zugang zu einem Subsystem, dessen Klassen sie nicht kennen. Die Kommunikation läuft nur in eine Richtung. Beim Mediator kennen die Kollegen den Mediator, und die Kommunikation läuft in beide Richtungen. **Observer** wird oft verwendet, um die Kollegen mit dem Mediator zu verbinden: Der Mediator abonniert die Änderungen der Elemente. Der Unterschied: Observer verteilt Nachrichten an beliebig viele Interessenten, der Mediator steuert gezielt ein festes Zusammenspiel. **Chain of Responsibility** reicht eine Anfrage durch eine Kette, der Mediator verteilt sie sternförmig.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Mediator.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
