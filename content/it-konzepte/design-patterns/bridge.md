+++
title = "Bridge"
description = "Abstraktion und Implementierung entkoppeln, beide unabhängig variierbar"
date = 2026-10-26T15:25:00+01:00
nummer = 7
gruppe = "struktur"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 7 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/bridge.html" titel="Bridge – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Im Klassendiagramm liegt die Brücke waagerecht: links das „Was“ (Info, Alarm), rechts das „Wie“ (E-Mail, SMS), dazwischen das Feld kanal. Im Aufrufstapel sieht man bei jeder Meldung beide Seiten übereinander: oben läuft der Kanal, darunter die Benachrichtigung, die ihn benutzt. Alarm wiederholt die Meldung, die SMS kürzt sie, und jede Seite weiß nur von ihrem eigenen Teil.

*GoF-Strukturmuster · Java 21*

## Zweck

Die Bridge trennt eine **Abstraktion** von ihrer **Implementierung**, sodass sich beide unabhängig voneinander weiterentwickeln lassen. Statt einer einzigen Vererbungshierarchie entstehen zwei getrennte, die über eine Referenz, die „Brücke“, verbunden sind.

## Das Problem

Ein Überwachungssystem verschickt Benachrichtigungen. Es gibt zwei Arten (normale Info, dringender Alarm) und zwei Kanäle (E-Mail, SMS). Löst man das allein über Vererbung, entstehen Klassen wie `InfoPerEmail`, `InfoPerSms`, `AlarmPerEmail` und `AlarmPerSms`. Jede neue Art oder jeder neue Kanal vervielfacht die Klassenzahl: Mit drei Arten und vier Kanälen wären es schon zwölf. Außerdem steckt der Code für den Versand dann mehrfach in verschiedenen Klassen.

## Die Lösung

Die beiden Dimensionen werden getrennt. Die Abstraktion `Benachrichtigung` beschreibt, *was* gemeldet wird und wie die Nachricht aufgebaut ist. Das Interface `Kanal` beschreibt, *wie* sie verschickt wird. Jede Benachrichtigung hält eine Referenz auf einen Kanal und delegiert den Versand an ihn. Jetzt braucht man nur noch so viele Klassen, wie es Arten *plus* Kanäle gibt, nicht Arten *mal* Kanäle. Welche Kombination verwendet wird, entscheidet sich beim Erzeugen, und zur Laufzeit lässt sie sich sogar wechseln.

## Die Beteiligten

- **Abstraction**: `Benachrichtigung` definiert die Schnittstelle für den Client und hält die Referenz auf den Implementor.
- **RefinedAbstraction**: `Info` und `Alarm` erweitern die Abstraktion mit eigener Logik, etwa der Wiederholung beim Alarm.
- **Implementor**: `Kanal` definiert die Schnittstelle für die Implementierungen, meist auf niedrigerer Ebene als die Abstraktion.
- **ConcreteImplementor**: `EmailKanal` und `SmsKanal` setzen den Versand konkret um.

## Java-21-Details

Die Kanäle sind `record`s, weil sie nur Konfiguration tragen. Bewusst *nicht* verwendet wird ein `sealed` Interface für `Kanal`: Der ganze Sinn der Bridge ist, dass neue Implementierungen hinzukommen können, ohne bestehenden Code anzufassen. Eine versiegelte Hierarchie würde genau das verhindern.

## Quellcode

Die Datei `Bridge.java` ist ohne Build-Tool direkt ausführbar: `java Bridge.java`

```
// Bridge (GoF, Strukturmuster)
// Trennt eine Abstraktion von ihrer Implementierung, damit beide unabhängig variieren können.
// Start: java Bridge.java

import java.util.List;

public class Bridge {

    // --- Implementor: WIE wird eine Nachricht verschickt? ---
    interface Kanal {
        void sende(String empfaenger, String text);
    }

    // --- Konkrete Implementoren ---
    record EmailKanal(String absender) implements Kanal {
        public void sende(String empfaenger, String text) {
            System.out.println("  E-Mail von " + absender + " an " + empfaenger + ": " + text);
        }
    }

    record SmsKanal() implements Kanal {
        public void sende(String empfaenger, String text) {
            String kurz = text.length() > 40 ? text.substring(0, 37) + "..." : text;
            System.out.println("  SMS an " + empfaenger + ": " + kurz);
        }
    }

    // --- Abstraktion: WAS für eine Nachricht? Hält die Brücke zum Kanal ---
    static abstract class Benachrichtigung {
        protected final Kanal kanal;          // die "Brücke"

        protected Benachrichtigung(Kanal kanal) { this.kanal = kanal; }

        abstract void melde(String empfaenger, String ereignis);
    }

    // --- Verfeinerte Abstraktionen ---
    static final class Info extends Benachrichtigung {
        Info(Kanal kanal) { super(kanal); }

        void melde(String empfaenger, String ereignis) {
            kanal.sende(empfaenger, "Info: " + ereignis);
        }
    }

    static final class Alarm extends Benachrichtigung {
        private final int wiederholungen;

        Alarm(Kanal kanal, int wiederholungen) {
            super(kanal);
            this.wiederholungen = wiederholungen;
        }

        void melde(String empfaenger, String ereignis) {
            for (int i = 1; i <= wiederholungen; i++) {
                kanal.sende(empfaenger, "ALARM (" + i + "/" + wiederholungen + "): "
                        + ereignis.toUpperCase());
            }
        }
    }

    public static void main(String[] args) {
        Kanal email = new EmailKanal("server@firma.de");
        Kanal sms = new SmsKanal();

        // 2 Abstraktionen x 2 Implementierungen = 4 Kombinationen, aber nur 4 Klassen
        List<Benachrichtigung> alle = List.of(
                new Info(email),
                new Info(sms),
                new Alarm(email, 1),
                new Alarm(sms, 2));

        for (Benachrichtigung b : alle) {
            System.out.println(b.getClass().getSimpleName() + " über "
                    + b.kanal.getClass().getSimpleName() + ":");
            b.melde("Sven", "Festplatte zu 95 Prozent belegt auf Server web-01");
        }
    }
}
```

## Ausgabe

```
Info über EmailKanal:
  E-Mail von server@firma.de an Sven: Info: Festplatte zu 95 Prozent belegt auf Server web-01
Info über SmsKanal:
  SMS an Sven: Info: Festplatte zu 95 Prozent belegt...
Alarm über EmailKanal:
  E-Mail von server@firma.de an Sven: ALARM (1/1): FESTPLATTE ZU 95 PROZENT BELEGT AUF SERVER WEB-01
Alarm über SmsKanal:
  SMS an Sven: ALARM (1/2): FESTPLATTE ZU 95 PROZENT...
  SMS an Sven: ALARM (2/2): FESTPLATTE ZU 95 PROZENT...
```

## Wann einsetzen?

- Eine Klasse variiert in zwei (oder mehr) unabhängigen Dimensionen, und die Kombinationen würden die Vererbungshierarchie explodieren lassen.
- Die Implementierung soll zur Laufzeit austauschbar sein.
- Plattformabhängiger Code soll von plattformunabhängiger Logik getrennt werden, etwa bei Grafik-, Datenbank- oder Betriebssystem-Schnittstellen.
- Änderungen an der Implementierung sollen sich nicht auf Clients der Abstraktion auswirken.

## Nachteile

Die Bridge erhöht die Komplexität, weil zwei Hierarchien statt einer entstehen. Lohnenswert ist sie erst, wenn wirklich beide Dimensionen variieren. Gibt es nur eine einzige Implementierung, ist die zusätzliche Abstraktionsschicht reiner Ballast. Außerdem muss man die Trennlinie richtig ziehen: Die Implementor-Schnittstelle muss allgemein genug sein, um alle Abstraktionen zu bedienen.

## Beispiele aus der Praxis

JDBC ist eine Bridge im Großen: Die Anwendung arbeitet mit `Connection`, `Statement` und `ResultSet`, der konkrete Treiber für PostgreSQL, Oracle oder MySQL ist austauschbar. Ähnlich trennt SLF4J die Logging-API von Implementierungen wie Logback oder Log4j.

## Verwandte Muster

Der **Adapter** sieht ähnlich aus, wird aber nachträglich eingesetzt, um unpassende Teile zu verbinden. Die Bridge wird von Anfang an geplant. **Abstract Factory** kann die passende Implementierung für eine Bridge erzeugen und konfigurieren. **Strategy** hat eine fast identische Struktur, das Ziel ist aber ein anderes: Strategy tauscht einen Algorithmus aus, Bridge trennt zwei ganze Hierarchien voneinander.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Bridge.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
