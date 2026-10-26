+++
title = "Adapter"
description = "Inkompatible Schnittstelle an erwartete anpassen"
date = 2026-10-26T15:12:00+01:00
nummer = 6
gruppe = "struktur"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 6 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/adapter.html" titel="Adapter – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Der Client anzeigen() ruft immer nur celsius() auf. Was dahinter passiert, zeigt der Aufrufstapel: Beim Objekt-Adapter geht der Aufruf an ein zweites Objekt weiter, beim Klassen-Adapter läuft die geerbte Methode auf demselben Objekt, beim Lambda reicht ein einziger Ausdruck. Die Zahlen stehen wie auf der Seite mit Punkt, auf einem deutsch eingestellten Rechner schreibt printf ein Komma.

*GoF-Strukturmuster · Java 21*

## Zweck

Ein Adapter passt die Schnittstelle einer vorhandenen Klasse an die Schnittstelle an, die ein Client erwartet. Er lässt Klassen zusammenarbeiten, die wegen **inkompatibler Schnittstellen** sonst nicht zusammenpassen würden, wie ein Reisestecker zwischen deutschem Gerät und amerikanischer Steckdose.

## Das Problem

Eine Wetteranwendung arbeitet durchgängig mit dem Interface `Temperatursensor` und erwartet Werte in Grad Celsius. Nun soll ein Sensor aus einer amerikanischen Bibliothek eingebunden werden. Dessen Klasse `UsWeatherSensor` heißt anders, hat eine andere Methode (`readFahrenheit()`) und liefert Fahrenheit. Ändern kann man sie nicht, weil sie aus einer fremden Bibliothek stammt. Die eigene Anwendung umzubauen wäre ebenso falsch, denn sie funktioniert ja.

## Die Lösung

Eine kleine Zwischenklasse, der Adapter, implementiert die erwartete Schnittstelle `Temperatursensor`. Intern ruft sie die fremde Methode auf und rechnet das Ergebnis um. Für die Anwendung sieht der fremde Sensor danach aus wie jeder andere. Weder die Anwendung noch die Bibliothek müssen geändert werden.

## Die Beteiligten

- **Target**: `Temperatursensor` ist die Schnittstelle, die der Client erwartet.
- **Adaptee**: `UsWeatherSensor` ist die vorhandene Klasse mit der unpassenden Schnittstelle.
- **Adapter**: `UsSensorAdapter` übersetzt zwischen beiden.
- **Client**: `anzeigen()` arbeitet nur mit dem Target.

## Objekt-Adapter und Klassen-Adapter

Das GoF-Buch beschreibt zwei Varianten, beide sind im Beispiel umgesetzt:

- Der **Objekt-Adapter** (`UsSensorAdapter`) hält den Adaptee als Feld und delegiert an ihn. Er funktioniert mit jedem bereits existierenden Objekt und auch mit Unterklassen des Adaptees. Das ist die übliche Wahl.
- Der **Klassen-Adapter** (`UsSensorKlassenAdapter`) erbt vom Adaptee und implementiert zusätzlich das Target. Er kommt ohne zweites Objekt aus und kann geerbtes Verhalten überschreiben. Dafür ist er fest an genau diese Klasse gebunden, und der Adaptee darf nicht `final` sein. Da Java keine Mehrfachvererbung von Klassen kennt, muss das Target hier ein Interface sein.

## Java-21-Details

Der Objekt-Adapter ist ein `record`, weil er nur eine Referenz auf den Adaptee hält. Besonders kompakt wird es, wenn das Target ein **funktionales Interface** ist, also genau eine abstrakte Methode hat: Dann lässt sich der Adapter als Lambda schreiben, ohne eigene Klasse. Das lohnt sich für kleine, einmalige Anpassungen. Für wiederverwendbare Adapter ist eine benannte Klasse lesbarer.

## Quellcode

Die Datei `Adapter.java` ist ohne Build-Tool direkt ausführbar: `java Adapter.java`

```
// Adapter (GoF, Strukturmuster)
// Passt die Schnittstelle einer vorhandenen Klasse an die Schnittstelle an, die ein Client erwartet.
// Start: java Adapter.java

import java.util.List;

public class Adapter {

    // --- Target: die Schnittstelle, die unsere Anwendung erwartet ---
    interface Temperatursensor {
        double celsius();
    }

    // Eigener Sensor, passt bereits
    record InnenSensor(double wert) implements Temperatursensor {
        public double celsius() { return wert; }
    }

    // --- Adaptee: fremde Klasse (z. B. aus einer US-Bibliothek), nicht änderbar ---
    static class UsWeatherSensor {
        private final float fahrenheit;
        UsWeatherSensor(float fahrenheit) { this.fahrenheit = fahrenheit; }
        public float readFahrenheit() { return fahrenheit; }
    }

    static double fahrenheitZuCelsius(double f) { return (f - 32) * 5 / 9; }

    // --- Objekt-Adapter: hält den Adaptee per Komposition ---
    record UsSensorAdapter(UsWeatherSensor sensor) implements Temperatursensor {
        public double celsius() {
            return fahrenheitZuCelsius(sensor.readFahrenheit());
        }
    }

    // --- Klassen-Adapter: erbt vom Adaptee und implementiert das Target ---
    static final class UsSensorKlassenAdapter extends UsWeatherSensor implements Temperatursensor {
        UsSensorKlassenAdapter(float fahrenheit) { super(fahrenheit); }
        public double celsius() {
            return fahrenheitZuCelsius(readFahrenheit());
        }
    }

    // --- Client: kennt nur Temperatursensor ---
    static void anzeigen(String name, Temperatursensor s) {
        System.out.printf("%-16s %5.1f °C%n", name, s.celsius());
    }

    public static void main(String[] args) {
        UsWeatherSensor usSensor = new UsWeatherSensor(77f);

        anzeigen("Innen:", new InnenSensor(21.5));
        anzeigen("Objekt-Adapter:", new UsSensorAdapter(usSensor));
        anzeigen("Klassen-Adapter:", new UsSensorKlassenAdapter(98.6f));

        // Java-Variante: Target ist ein funktionales Interface -> Adapter als Lambda
        Temperatursensor lambdaAdapter = () -> fahrenheitZuCelsius(usSensor.readFahrenheit());
        anzeigen("Lambda-Adapter:", lambdaAdapter);

        // Alle Sensoren einheitlich verarbeiten
        List<Temperatursensor> alle = List.of(
                new InnenSensor(19.0),
                new UsSensorAdapter(new UsWeatherSensor(50f)),
                lambdaAdapter);
        double mittel = alle.stream().mapToDouble(Temperatursensor::celsius).average().orElse(0);
        System.out.printf("Mittelwert:      %5.1f °C%n", mittel);
    }
}
```

## Ausgabe

```
Innen:            21.5 °C
Objekt-Adapter:   25.0 °C
Klassen-Adapter:  37.0 °C
Lambda-Adapter:   25.0 °C
Mittelwert:       18.0 °C
```

## Wann einsetzen?

- Eine vorhandene Klasse soll verwendet werden, ihre Schnittstelle passt aber nicht.
- Fremd- oder Altcode (Bibliotheken, Legacy-Systeme, externe APIs) soll eingebunden werden, ohne ihn zu ändern.
- Mehrere Klassen mit unterschiedlichen Schnittstellen sollen einheitlich behandelt werden, wie hier alle Sensoren bei der Mittelwertberechnung.

## Nachteile

Jeder Adapter ist eine zusätzliche Klasse und eine zusätzliche Indirektion. Passen die Schnittstellen nicht nur in der Form, sondern auch inhaltlich schlecht zusammen, wird der Adapter schnell komplex und versteckt Logik, die eigentlich woanders hingehört. Fehlt dem Adaptee eine Fähigkeit ganz, kann auch der beste Adapter sie nicht herbeizaubern.

## Beispiele aus dem JDK

`InputStreamReader` adaptiert einen Byte-Strom (`InputStream`) an die Zeichen-Schnittstelle `Reader`. `Arrays.asList()` lässt ein Array wie eine `List` aussehen.

## Verwandte Muster

**Bridge** hat eine ähnliche Struktur, wird aber von vornherein geplant, um Abstraktion und Implementierung zu trennen. Ein Adapter dagegen wird nachträglich eingesetzt, wenn Teile nicht zusammenpassen. Der **Decorator** erweitert ein Objekt, ohne seine Schnittstelle zu ändern, der Adapter ändert die Schnittstelle. Der **Proxy** behält die gleiche Schnittstelle bei und kontrolliert den Zugriff. Die **Facade** definiert eine neue, vereinfachte Schnittstelle für ein ganzes Subsystem, statt eine einzelne Klasse anzupassen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Adapter.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein – allerdings erst mit englischer Spracheinstellung (`-Duser.language=en`). Auf einem deutsch eingestellten Rechner schreibt das Programm „Innen: 21,5 °C“ statt „Innen: 21.5 °C“, weil `printf` das Zahlenformat der Systemsprache nimmt.
{{< /anmerkung >}}
