+++
title = "Observer"
description = "Abhängige werden bei Zustandsänderung automatisch benachrichtigt"
date = 2026-10-26T20:43:00+01:00
nummer = 19
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 19 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/observer.html" titel="Observer – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Drei Beobachter melden sich bei der Aktie an: ein Lambda, eine Klasse und ein record. Bei jeder Kursänderung entsteht ein Ereignis-Objekt, und die Aktie ruft der Reihe nach jeden Beobachter auf, ohne zu wissen, was er damit tut. Der doppelte Kurs 106,20 löst keine Meldung aus. Nach dem Abmelden der Anzeige bekommen nur noch Statistik und Alarm die Meldungen.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Der Observer (Beobachter) definiert eine **1-zu-n-Abhängigkeit** zwischen Objekten: Ändert sich der Zustand eines Objekts, werden alle davon abhängigen Objekte automatisch benachrichtigt. Das beobachtete Objekt muss dabei nicht wissen, wer es beobachtet und was die Beobachter mit der Nachricht tun. Bekannt ist das Muster auch als *Publish-Subscribe* oder *Listener*.

## Das Problem

Ein Aktienkurs ändert sich laufend. Eine Anzeige soll den neuen Kurs darstellen, eine Statistik Minimum und Maximum mitschreiben, ein Alarm bei starken Ausschlägen warnen. Würde die Klasse `Aktie` alle diese Empfänger direkt aufrufen, müsste sie jeden einzelnen kennen. Jeder neue Empfänger, etwa ein Export in eine Datei, würde eine Änderung an der Aktie erfordern. Die Alternative, dass alle Interessenten ständig nachfragen, ob sich etwas geändert hat (*Polling*), verschwendet Rechenzeit und reagiert verzögert.

## Die Lösung

Die Aktie führt eine Liste von Beobachtern, die alle dieselbe kleine Schnittstelle `KursBeobachter` erfüllen. Wer informiert werden möchte, meldet sich an. Ändert sich der Kurs, geht die Aktie die Liste durch und ruft bei jedem Beobachter `kursGeaendert()` auf. Was der Beobachter daraus macht, ist allein seine Sache. Neue Beobachter lassen sich jederzeit hinzufügen und wieder entfernen, auch zur Laufzeit, ohne die Aktie zu ändern.

## Die Beteiligten

- **Subject**: `Aktie` kennt ihre Beobachter, aber nur über deren Schnittstelle, und bietet An- und Abmeldung an.
- **Observer**: `KursBeobachter` definiert die Methode, über die Beobachter benachrichtigt werden.
- **ConcreteObserver**: das Anzeige-Lambda, `Statistik` und `Alarm` reagieren jeweils auf ihre Weise.

## Push- oder Pull-Modell?

Das GoF-Buch beschreibt zwei Varianten. Beim **Push-Modell** schickt das Subject alle relevanten Daten gleich mit. Hier ist das ein `KursAenderung`-Record mit altem und neuem Kurs. Beim **Pull-Modell** meldet das Subject nur „Es hat sich etwas geändert“, und jeder Beobachter fragt sich die Daten, die er braucht, selbst ab. Push ist bequemer für die Beobachter, Pull flexibler, wenn verschiedene Beobachter verschiedene Daten brauchen. Das Beispiel verwendet Push, weil der Record genau die Information enthält, die alle brauchen.

## Java-21-Details

`KursBeobachter` ist ein **funktionales Interface**. Einfache Beobachter wie die Anzeige können deshalb als Lambda angemeldet werden, aufwendigere wie die Statistik als eigene Klasse. Der Alarm ist ein `record`, weil er nur seine Schwelle speichert. Die Anmeldung gibt ein `Runnable` zurück, das die Abmeldung erledigt. Das ist praktisch, weil man sich bei Lambdas sonst die Referenz merken müsste, um sie später wieder zu entfernen.

Die Beobachterliste ist eine `CopyOnWriteArrayList`. Sie erlaubt, dass sich ein Beobachter während einer Benachrichtigung selbst abmeldet, ohne dass eine `ConcurrentModificationException` fliegt, und ist threadsicher. Da Anmeldungen selten und Benachrichtigungen häufig sind, passt ihr Kostenmodell gut: Schreiben ist teuer, Lesen billig.

Die Ausgabe zeigt noch ein Detail: Der Kurs 106,20 wird zweimal gesetzt, aber nur einmal gemeldet, weil das Subject bei unverändertem Wert niemanden benachrichtigt. Nach dem Abmelden der Anzeige melden sich nur noch Alarm und Statistik.

## Quellcode

Die Datei `Observer.java` ist ohne Build-Tool direkt ausführbar: `java Observer.java`

```
// Observer (GoF, Verhaltensmuster)
// Definiert eine 1-zu-n-Abhängigkeit: Ändert sich der Zustand eines Objekts,
// werden alle abhängigen Objekte automatisch benachrichtigt.
// Start: java Observer.java

import java.util.List;
import java.util.Locale;
import java.util.concurrent.CopyOnWriteArrayList;

public class Observer {

    // --- Ereignis: was sich geändert hat (Push-Modell) ---
    record KursAenderung(String symbol, double alt, double neu) {
        double prozent() { return (neu - alt) / alt * 100; }
    }

    // --- Observer: funktionales Interface, daher auch als Lambda nutzbar ---
    @FunctionalInterface
    interface KursBeobachter {
        void kursGeaendert(KursAenderung e);
    }

    // --- Subject: verwaltet Beobachter und benachrichtigt sie ---
    static final class Aktie {
        private final String symbol;
        private double kurs;
        private final List<KursBeobachter> beobachter = new CopyOnWriteArrayList<>();

        Aktie(String symbol, double kurs) { this.symbol = symbol; this.kurs = kurs; }

        // Anmelden liefert gleich die Möglichkeit zum Abmelden zurück
        Runnable anmelden(KursBeobachter b) {
            beobachter.add(b);
            return () -> beobachter.remove(b);
        }

        void setKurs(double neu) {
            if (neu == kurs) return;                     // keine Änderung, keine Meldung
            var ereignis = new KursAenderung(symbol, kurs, neu);
            kurs = neu;
            beobachter.forEach(b -> b.kursGeaendert(ereignis));
        }
    }

    // --- Konkrete Observer ---
    static final class Statistik implements KursBeobachter {
        private double min = Double.POSITIVE_INFINITY, max = Double.NEGATIVE_INFINITY;
        private int meldungen;

        public void kursGeaendert(KursAenderung e) {
            min = Math.min(min, e.neu());
            max = Math.max(max, e.neu());
            meldungen++;
        }
        public String toString() {
            return String.format(Locale.GERMANY, "%d Meldungen, Min %.2f, Max %.2f", meldungen, min, max);
        }
    }

    record Alarm(double schwelleProzent) implements KursBeobachter {
        public void kursGeaendert(KursAenderung e) {
            if (Math.abs(e.prozent()) >= schwelleProzent) {
                System.out.printf(Locale.GERMANY, "    ALARM: %s bewegt sich um %+.1f %%%n", e.symbol(), e.prozent());
            }
        }
    }

    public static void main(String[] args) {
        Aktie aktie = new Aktie("ACME", 100.00);

        // Observer als Lambda
        Runnable anzeigeAbmelden = aktie.anmelden(e -> System.out.printf(Locale.GERMANY,
                "  Anzeige: %s %.2f -> %.2f%n", e.symbol(), e.alt(), e.neu()));

        // Observer als Klasse bzw. Record
        Statistik statistik = new Statistik();
        aktie.anmelden(statistik);
        aktie.anmelden(new Alarm(5.0));

        for (double kurs : new double[] { 101.50, 99.80, 106.20, 106.20, 98.40 }) {
            aktie.setKurs(kurs);
        }

        System.out.println("\nAnzeige wird abgemeldet.");
        anzeigeAbmelden.run();
        aktie.setKurs(97.00);
        aktie.setKurs(91.00);

        System.out.println("\nStatistik: " + statistik);
    }
}
```

## Ausgabe

```
  Anzeige: ACME 100,00 -> 101,50
  Anzeige: ACME 101,50 -> 99,80
  Anzeige: ACME 99,80 -> 106,20
    ALARM: ACME bewegt sich um +6,4 %
  Anzeige: ACME 106,20 -> 98,40
    ALARM: ACME bewegt sich um -7,3 %

Anzeige wird abgemeldet.
    ALARM: ACME bewegt sich um -6,2 %

Statistik: 6 Meldungen, Min 91,00, Max 106,20
```

## Wann einsetzen?

- Die Änderung eines Objekts erfordert Reaktionen in anderen Objekten, und man weiß nicht im Voraus, wie viele und welche es sind.
- Ein Objekt soll andere benachrichtigen, ohne sie zu kennen und ohne eng an sie gekoppelt zu sein.
- Interessenten sollen sich zur Laufzeit an- und abmelden können.

Typische Beispiele sind Ereignisse in Benutzeroberflächen (Klicks, Eingaben), die Aktualisierung von Ansichten bei Datenänderungen im MVC-Muster, Benachrichtigungssysteme sowie Event-Systeme in Frameworks.

## Nachteile

- **Unerwartete Kaskaden**: Ein Beobachter kann bei einer Benachrichtigung selbst etwas ändern, das weitere Benachrichtigungen auslöst. Im schlimmsten Fall entstehen Endlosschleifen.
- **Reihenfolge**: Die Reihenfolge der Benachrichtigungen ist meist nicht festgelegt. Beobachter sollten sich nicht darauf verlassen.
- **Speicherlecks**: Das Subject hält Referenzen auf alle Beobachter. Wer vergisst, sich abzumelden, wird nie vom Garbage Collector entfernt. Das ist als *Lapsed Listener Problem* bekannt.
- **Fehlerbehandlung**: Wirft ein Beobachter eine Ausnahme, bricht im einfachen Fall die Benachrichtigung aller übrigen ab.
- **Schwer nachvollziehbar**: Wer auf eine Änderung reagiert, ist im Code des Subjects nicht sichtbar.

## Beispiele aus dem JDK

Die Listener in Swing und AWT (`ActionListener`, `PropertyChangeListener`) sind Observer. `java.beans.PropertyChangeSupport` nimmt einem die Verwaltung der Listener ab. Die alten Klassen `java.util.Observer` und `Observable` sind seit Java 9 als veraltet markiert, weil ihr Ereignismodell zu schwach und nicht threadsicher war. Moderner Nachfolger für asynchrone Datenströme ist die `java.util.concurrent.Flow`-API mit `Publisher` und `Subscriber`, die Grundlage reaktiver Bibliotheken wie Reactor und RxJava.

## Verwandte Muster

Der **Mediator** kann Observer verwenden, um die Kollegen mit sich zu verbinden. Er steuert aber ein festes Zusammenspiel, während Observer Nachrichten an beliebig viele, unbekannte Empfänger verteilt. **Singleton** wird oft für zentrale Ereignisverteiler eingesetzt, etwa einen Event-Bus. Die Benachrichtigungen selbst lassen sich als **Command**-Objekte darstellen, um sie zu speichern oder zeitversetzt zuzustellen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Observer.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
