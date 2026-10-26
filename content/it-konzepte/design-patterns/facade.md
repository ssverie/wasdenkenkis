+++
title = "Facade"
description = "Vereinfachte Schnittstelle zu einem Subsystem"
date = 2026-10-26T19:15:00+01:00
nummer = 10
gruppe = "struktur"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 10 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/facade.html" titel="Facade – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. main ruft pro Bestellung genau eine Methode auf: shop.bestelle(). Was dahinter geschieht, zeigt der Aufrufstapel: Die Fassade fragt Lager, Preise, Zahlung, Versand und Mail in der richtigen Reihenfolge, im Diagramm leuchten dabei Shop und das gerade gefragte Subsystem. Beim Monitor bricht die Fassade nach der ersten Frage ab und schickt eine Absage. Zurück kommt jedes Mal nur ein Ergebnis, das main mit einem switch auswertet.

*GoF-Strukturmuster · Java 21*

## Zweck

Eine Facade (Fassade) bietet eine **einfache, einheitliche Schnittstelle** zu einem komplexen Subsystem. Sie verbirgt das Zusammenspiel vieler Klassen hinter wenigen, gut benannten Methoden, so wie die Fassade eines Hauses die Rohre und Leitungen dahinter verdeckt.

## Das Problem

Eine Bestellung in einem Online-Shop berührt viele Teilsysteme: Das Lager prüft den Bestand und reserviert die Ware, ein Preisdienst berechnet den Betrag, der Zahlungsdienst belastet den Kunden, der Versand erzeugt eine Sendung, und am Ende geht eine Bestätigungsmail raus. Müsste jeder Programmteil, der eine Bestellung auslöst (Webshop, App, Telefon-Hotline), diese fünf Klassen selbst kennen und in der richtigen Reihenfolge aufrufen, würde dieselbe Ablauflogik mehrfach kopiert. Jede Änderung am Subsystem zöge Änderungen an allen Aufrufern nach sich.

## Die Lösung

Die Klasse `Shop` bündelt den Ablauf in einer einzigen Methode `bestelle()`. Sie kennt die Subsysteme, ruft sie in der richtigen Reihenfolge auf und behandelt die Sonderfälle, etwa fehlenden Bestand. Der Client spricht nur noch mit der Fassade. Wichtig: Die Subsysteme bleiben erhalten und wissen nichts von der Fassade. Wer mehr Kontrolle braucht, kann sie weiterhin direkt verwenden. Die Fassade ist ein bequemer Standardweg, kein Gefängnis.

## Die Beteiligten

- **Facade**: `Shop` kennt die zuständigen Subsystem-Klassen und delegiert Anfragen an sie.
- **Subsystem-Klassen**: `Lager`, `Preise`, `Zahlung`, `Versand` und `Mail` erledigen die eigentliche Arbeit und kennen die Fassade nicht.
- **Client**: `main()` arbeitet ausschließlich mit der Fassade.

## Java-21-Details

Das Ergebnis einer Bestellung ist ein `sealed` Interface mit genau zwei Varianten, `Erfolg` und `Fehler`, beide als `record`. Der Client wertet es mit einem `switch` und **Record Patterns** aus: `case Erfolg(String sendung, int betrag)` prüft den Typ und zerlegt den Record in einem Schritt in seine Bestandteile. Da das Interface versiegelt ist, prüft der Compiler, dass beide Fälle behandelt werden. So liefert die Fassade ein klares Ergebnis statt Ausnahmen oder `null`, und der Aufrufer muss nichts über die inneren Abläufe wissen.

## Quellcode

Die Datei `Facade.java` ist ohne Build-Tool direkt ausführbar: `java Facade.java`

```
// Facade (GoF, Strukturmuster)
// Bietet eine einfache, einheitliche Schnittstelle zu einem komplexen Subsystem.
// Start: java Facade.java

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class Facade {

    // ============ Subsystem: mehrere Klassen mit eigenen, detaillierten APIs ============

    static final class Lager {
        private final Map<String, Integer> bestand = new HashMap<>(Map.of("Tastatur", 5, "Monitor", 0));

        boolean verfuegbar(String artikel, int menge) {
            return bestand.getOrDefault(artikel, 0) >= menge;
        }
        void reserviere(String artikel, int menge) {
            bestand.merge(artikel, -menge, Integer::sum);
            System.out.println("  Lager:    " + menge + "x " + artikel + " reserviert");
        }
    }

    static final class Preise {
        int stueckpreisCent(String artikel) {
            return switch (artikel) {
                case "Tastatur" -> 4_990;
                case "Monitor"  -> 19_900;
                default         -> throw new IllegalArgumentException("Unbekannt: " + artikel);
            };
        }
    }

    static final class Zahlung {
        boolean belaste(String kunde, int betragCent) {
            System.out.printf(Locale.GERMANY, "  Zahlung:  %s mit %.2f € belastet%n", kunde, betragCent / 100.0);
            return true;
        }
    }

    static final class Versand {
        private int naechsteNummer = 1001;

        String beauftrage(String kunde, String artikel, int menge) {
            String sendung = "SN-" + naechsteNummer++;
            System.out.println("  Versand:  Sendung " + sendung + " für " + kunde);
            return sendung;
        }
    }

    static final class Mail {
        void sende(String kunde, String text) {
            System.out.println("  Mail:     an " + kunde + ": " + text);
        }
    }

    // ============ Ergebnis der Fassade ============

    sealed interface Ergebnis permits Erfolg, Fehler {}
    record Erfolg(String sendungsnummer, int betragCent) implements Ergebnis {}
    record Fehler(String grund) implements Ergebnis {}

    // ============ Facade: eine Methode statt fünf Subsysteme ============

    static final class Shop {
        private final Lager lager = new Lager();
        private final Preise preise = new Preise();
        private final Zahlung zahlung = new Zahlung();
        private final Versand versand = new Versand();
        private final Mail mail = new Mail();

        Ergebnis bestelle(String kunde, String artikel, int menge) {
            if (!lager.verfuegbar(artikel, menge)) {
                mail.sende(kunde, artikel + " ist leider nicht vorrätig");
                return new Fehler(artikel + " nicht vorrätig");
            }
            int betrag = preise.stueckpreisCent(artikel) * menge;
            if (!zahlung.belaste(kunde, betrag)) {
                return new Fehler("Zahlung abgelehnt");
            }
            lager.reserviere(artikel, menge);
            String sendung = versand.beauftrage(kunde, artikel, menge);
            mail.sende(kunde, "Bestellung bestätigt, Sendung " + sendung);
            return new Erfolg(sendung, betrag);
        }
    }

    // ============ Client: kennt nur die Fassade ============

    public static void main(String[] args) {
        Shop shop = new Shop();

        for (String artikel : new String[] { "Tastatur", "Monitor" }) {
            System.out.println("Bestellung: 2x " + artikel);
            Ergebnis e = shop.bestelle("Sven", artikel, 2);

            String meldung = switch (e) {
                case Erfolg(String sendung, int betrag) ->
                        String.format(Locale.GERMANY, "OK, Sendung %s, %.2f €", sendung, betrag / 100.0);
                case Fehler(String grund) -> "Fehlgeschlagen: " + grund;
            };
            System.out.println("=> " + meldung + "\n");
        }
    }
}
```

## Ausgabe

```
Bestellung: 2x Tastatur
  Zahlung:  Sven mit 99,80 € belastet
  Lager:    2x Tastatur reserviert
  Versand:  Sendung SN-1001 für Sven
  Mail:     an Sven: Bestellung bestätigt, Sendung SN-1001
=> OK, Sendung SN-1001, 99,80 €

Bestellung: 2x Monitor
  Mail:     an Sven: Monitor ist leider nicht vorrätig
=> Fehlgeschlagen: Monitor nicht vorrätig
```

## Wann einsetzen?

- Ein komplexes Subsystem soll für die häufigsten Anwendungsfälle einfach nutzbar sein.
- Clients sollen von den Interna eines Subsystems entkoppelt werden, damit es sich unabhängig weiterentwickeln kann.
- Ein System soll in Schichten gegliedert werden. Jede Schicht bietet nach oben eine Fassade als Einstiegspunkt.
- Alt- oder Fremdsysteme mit unhandlicher API sollen hinter einer sauberen Schnittstelle verschwinden.

## Nachteile

Die größte Gefahr ist das **„Gott-Objekt“**: Wächst die Fassade mit jedem neuen Anwendungsfall, landet irgendwann die halbe Geschäftslogik in einer einzigen, riesigen Klasse. Dann hilft es, mehrere kleinere Fassaden für unterschiedliche Zwecke zu schaffen. Außerdem bietet eine Fassade immer nur einen Ausschnitt der Möglichkeiten des Subsystems. Wer Sonderfälle braucht, muss doch wieder direkt durchgreifen.

## Beispiele aus der Praxis

Service-Klassen in Schichtenarchitekturen, etwa ein `BestellService` in Spring, sind meist Fassaden über Repositories, externe Clients und Nachrichtendienste. Im JDK verbirgt `java.net.http.HttpClient` mit einem einzigen `send()`-Aufruf Verbindungsaufbau, TLS, HTTP/2 und Weiterleitungen. SLF4J ist dem Namen nach eine „Simple Logging Facade“.

## Verwandte Muster

Der **Adapter** passt eine *bestehende* Schnittstelle an, die Facade definiert eine *neue*, einfachere. Der Adapter umhüllt meist ein Objekt, die Facade ein ganzes Subsystem. Der **Mediator** organisiert ebenfalls das Zusammenspiel mehrerer Klassen, aber die Kollegen kennen ihn und kommunizieren über ihn, während die Subsysteme von der Fassade nichts wissen. Da meist eine Fassade pro Subsystem genügt, wird sie oft als **Singleton** umgesetzt. **Abstract Factory** kann zusammen mit einer Facade verwendet werden, um Subsystem-Objekte plattformunabhängig zu erzeugen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Facade.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
