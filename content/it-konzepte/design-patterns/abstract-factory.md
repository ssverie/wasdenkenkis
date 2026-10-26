+++
title = "Abstract Factory"
description = "Familien verwandter Objekte erzeugen, ohne konkrete Klassen zu nennen"
date = 2026-10-26T13:44:00+01:00
nummer = 1
gruppe = "erzeugung"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 1 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/abstract-factory.html" titel="Abstract Factory – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Das Klassendiagramm zeigt die GoF-Rollen, aktive Klassen sind hervorgehoben. Darunter laufen der Aufrufstapel, die entstehenden Objekte und die Konsole mit, im Code ist die gerade laufende Zeile markiert. Mit „java AbstractFactory.java mac“ startet dasselbe Programm mit der Mac-Familie. Achte darauf, dass in einem Lauf nie Teile beider Familien entstehen.

*GoF-Erzeugungsmuster · Java 21*

## Zweck

Eine Abstract Factory liefert eine Schnittstelle, um **Familien zusammengehöriger Objekte** zu erzeugen, ohne deren konkrete Klassen zu nennen. Der Client weiß nur, *was* er braucht (einen Button, eine Checkbox), aber nicht, *welche* Implementierung er bekommt.

## Das Problem

Eine Oberfläche soll unter Windows und macOS jeweils im passenden Look erscheinen. Würde der Code überall `new WinButton()` oder `new MacCheckbox()` schreiben, stünden die konkreten Klassen über die ganze Anwendung verstreut. Schlimmer noch: Nichts verhindert, dass versehentlich ein Windows-Button neben einer Mac-Checkbox landet.

## Die Lösung

Die Erzeugung wandert in eine eigene Fabrik. Pro Produktfamilie gibt es eine konkrete Fabrik, die ausschließlich passende Teile herstellt. Der Client erhält einmal eine Fabrik und erzeugt alles über sie. Damit ist die Konsistenz der Familie garantiert, und der Austausch der kompletten Familie ist eine einzige Codezeile.

## Die Beteiligten

- **AbstractFactory**: `GuiFactory` deklariert je eine Erzeugungsmethode pro Produkt.
- **ConcreteFactory**: `WinFactory` und `MacFactory` erzeugen die Produkte ihrer Familie.
- **AbstractProduct**: `Button` und `Checkbox` definieren die Schnittstellen der Produkte.
- **ConcreteProduct**: `WinButton`, `MacCheckbox` usw. sind die eigentlichen Implementierungen.
- **Client**: `buildUi()` arbeitet nur mit den Interfaces.

## Java-21-Details

Die Produkte sind als `record` umgesetzt, weil sie keinen veränderlichen Zustand haben. Die Wahl der Fabrik erfolgt über eine `switch`-Expression, die direkt einen Wert liefert.

## Quellcode

Die Datei `AbstractFactory.java` ist ohne Build-Tool direkt ausführbar: `java AbstractFactory.java`

```
// Abstract Factory (GoF, Erzeugungsmuster)
// Erzeugt Familien zusammengehöriger Objekte, ohne konkrete Klassen zu nennen.
// Start: java AbstractFactory.java

public class AbstractFactory {

    // --- Abstrakte Produkte ---
    interface Button   { void render(); }
    interface Checkbox { void render(); }

    // --- Abstrakte Fabrik ---
    interface GuiFactory {
        Button createButton();
        Checkbox createCheckbox();
    }

    // --- Produktfamilie "Windows" ---
    record WinButton() implements Button {
        public void render() { System.out.println("[ Windows-Button ]"); }
    }
    record WinCheckbox() implements Checkbox {
        public void render() { System.out.println("[x] Windows-Checkbox"); }
    }
    static final class WinFactory implements GuiFactory {
        public Button createButton()     { return new WinButton(); }
        public Checkbox createCheckbox() { return new WinCheckbox(); }
    }

    // --- Produktfamilie "Mac" ---
    record MacButton() implements Button {
        public void render() { System.out.println("( Mac-Button )"); }
    }
    record MacCheckbox() implements Checkbox {
        public void render() { System.out.println("(v) Mac-Checkbox"); }
    }
    static final class MacFactory implements GuiFactory {
        public Button createButton()     { return new MacButton(); }
        public Checkbox createCheckbox() { return new MacCheckbox(); }
    }

    // --- Client: kennt nur die Interfaces ---
    static void buildUi(GuiFactory factory) {
        factory.createButton().render();
        factory.createCheckbox().render();
    }

    public static void main(String[] args) {
        String os = args.length > 0 ? args[0] : "win";

        GuiFactory factory = switch (os) {
            case "mac" -> new MacFactory();
            default    -> new WinFactory();
        };

        System.out.println("Fabrik: " + factory.getClass().getSimpleName());
        buildUi(factory);

        System.out.println("\nWechsel der ganzen Familie mit einer Zeile:");
        buildUi(new MacFactory());
    }
}
```

## Ausgabe

```
Fabrik: WinFactory
[ Windows-Button ]
[x] Windows-Checkbox

Wechsel der ganzen Familie mit einer Zeile:
( Mac-Button )
(v) Mac-Checkbox
```

## Wann einsetzen?

- Ein System soll unabhängig davon sein, wie seine Objekte erzeugt werden.
- Es gibt mehrere Produktfamilien, und Produkte verschiedener Familien dürfen nicht gemischt werden.
- Die Familie soll zur Laufzeit oder per Konfiguration austauschbar sein (Look & Feel, Datenbank-Treiber, Test- gegen Produktivumgebung).

## Nachteile

Ein **neues Produkt** (etwa ein `Slider`) ist teuer: Das Fabrik-Interface und *jede* konkrete Fabrik müssen erweitert werden. Neue **Familien** hinzuzufügen ist dagegen einfach.

## Verwandte Muster

Konkrete Fabriken werden oft mit **Factory Method** implementiert und häufig als **Singleton** gehalten. **Builder** konzentriert sich auf den schrittweisen Aufbau *eines* komplexen Objekts, Abstract Factory auf das Erzeugen *mehrerer* zusammengehöriger Objekte.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java AbstractFactory.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
