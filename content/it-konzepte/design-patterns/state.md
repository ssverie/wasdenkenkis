+++
title = "State"
description = "Verhalten ändert sich mit dem internen Zustand (Zustand als Objekt)"
date = 2026-10-26T20:46:00+01:00
nummer = 20
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 20 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/state.html" titel="State – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Unten im Diagramm stehen die erlaubten Übergänge als Pfeile zwischen den Zuständen. Die Bestellung gibt jede Aktion an ihr aktuelles Zustandsobjekt weiter. Ist die Aktion erlaubt, liefert der Zustand den nächsten zurück, und das alte Objekt wird nicht mehr gebraucht. Ist sie nicht erlaubt, greift die default-Methode im Interface und der Zustand bleibt. Bestellung 2 nimmt einen anderen Weg durch dieselben Zustände.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Das State-Muster (Zustand) erlaubt es einem Objekt, sein **Verhalten zu ändern, wenn sich sein innerer Zustand ändert**. Von außen sieht es so aus, als hätte das Objekt seine Klasse gewechselt. Jeder Zustand wird dazu eine eigene Klasse, die genau weiß, was in diesem Zustand erlaubt ist und in welchen Zustand es danach weitergeht.

## Das Problem

Eine Bestellung durchläuft mehrere Stationen: neu, bezahlt, versendet, zugestellt, oder sie wird storniert. Was mit ihr möglich ist, hängt vom Status ab. Versenden geht erst nach der Zahlung, Stornieren nur, solange das Paket noch nicht unterwegs ist, und beim Stornieren nach der Zahlung muss Geld erstattet werden. Die naheliegende Umsetzung ist ein Statusfeld und in jeder Methode ein großes `if` oder `switch` darüber. Mit jedem neuen Status und jeder neuen Aktion wachsen diese Verzweigungen. Die Regeln für einen einzigen Status sind über alle Methoden verstreut, und vergessene Fälle fallen erst zur Laufzeit auf.

## Die Lösung

Jeder Status wird eine eigene Klasse, die dieselbe Schnittstelle `Status` implementiert. Die Bestellung hält eine Referenz auf ihren aktuellen Status und gibt jede Aktion einfach an ihn weiter. Der Status entscheidet, was passiert, und liefert den Folgestatus zurück. `Neu.bezahlen()` verbucht die Zahlung und liefert `Bezahlt`. `Versendet.stornieren()` ist nicht überschrieben, also greift die Standardimplementierung: „nicht möglich“, der Status bleibt. Alles, was einen bestimmten Status betrifft, steht damit an einer Stelle.

## Die Beteiligten

- **Context**: `Bestellung` hält den aktuellen Zustand und delegiert alle zustandsabhängigen Aufrufe an ihn.
- **State**: `Status` definiert die Schnittstelle für alle Aktionen.
- **ConcreteState**: `Neu`, `Bezahlt`, `Versendet`, `Zugestellt` und `Storniert` setzen das Verhalten für ihren Zustand um.

## Wer bestimmt den Übergang?

Das GoF-Buch lässt offen, ob der Context oder die Zustände über den Wechsel entscheiden. Im Beispiel machen es die Zustände: Jede Methode gibt den Folgezustand zurück, die Bestellung übernimmt ihn nur. So kennt jeder Zustand seine Nachfolger, und neue Übergänge lassen sich hinzufügen, ohne die Bestellung zu ändern. Der Nachteil: Die Zustände sind voneinander abhängig. Bei sehr einfachen, festen Abläufen kann es übersichtlicher sein, eine Übergangstabelle im Context zu führen.

## Java-21-Details

Die Zustände sind `record`s. Die meisten haben keine Felder und sind damit unveränderlich und beliebig teilbar. `Versendet` trägt die Sendungsnummer als Zustandsdaten mit, denn sie gehört genau zu diesem Zustand. Das Interface `Status` nutzt **Default-Methoden**: Standardmäßig ist jede Aktion verboten. Jeder Zustand überschreibt nur die Übergänge, die er erlaubt. Eine `private` Interface-Methode fasst die Fehlermeldung zusammen.

Weil `Status` `sealed` ist, kann `fuerKunden()` mit einem vollständigen `switch` über alle Zustände arbeiten. Mit dem **Record Pattern** `case Versendet(String nr)` wird die Sendungsnummer gleich mit ausgepackt. Kommt ein neuer Zustand hinzu, etwa `Retoure`, meldet der Compiler diese Stelle, bis sie angepasst ist. Das Beispiel kombiniert damit beide Wege: Übergänge als Methoden in den Zuständen, reine Auswertungen per Pattern Matching.

## Quellcode

Die Datei `State.java` ist ohne Build-Tool direkt ausführbar: `java State.java`

```
// State (GoF, Verhaltensmuster)
// Ein Objekt ändert sein Verhalten, wenn sich sein innerer Zustand ändert.
// Jeder Zustand wird eine eigene Klasse.
// Start: java State.java

public class State {

    // --- State: Schnittstelle aller Zustände; Standard = "in diesem Zustand nicht möglich" ---
    sealed interface Status permits Neu, Bezahlt, Versendet, Zugestellt, Storniert {

        default Status bezahlen(Bestellung b)   { return verboten("bezahlen"); }
        default Status versenden(Bestellung b)  { return verboten("versenden"); }
        default Status zustellen(Bestellung b)  { return verboten("zustellen"); }
        default Status stornieren(Bestellung b) { return verboten("stornieren"); }

        private Status verboten(String aktion) {
            System.out.println("    nicht möglich: " + aktion + " im Status " + getClass().getSimpleName());
            return this;                          // Zustand bleibt unverändert
        }
    }

    // --- ConcreteStates: jeder kennt nur seine erlaubten Übergänge ---
    record Neu() implements Status {
        public Status bezahlen(Bestellung b) {
            System.out.println("    Zahlung über " + b.betrag + " € verbucht");
            return new Bezahlt();
        }
        public Status stornieren(Bestellung b) {
            System.out.println("    Bestellung storniert, keine Erstattung nötig");
            return new Storniert();
        }
    }

    record Bezahlt() implements Status {
        public Status versenden(Bestellung b) {
            String nr = "PK-" + (4711 + b.nummer);
            System.out.println("    Paket übergeben, Sendung " + nr);
            return new Versendet(nr);
        }
        public Status stornieren(Bestellung b) {
            System.out.println("    Bestellung storniert, " + b.betrag + " € werden erstattet");
            return new Storniert();
        }
    }

    record Versendet(String sendungsnummer) implements Status {
        public Status zustellen(Bestellung b) {
            System.out.println("    Sendung " + sendungsnummer + " zugestellt");
            return new Zugestellt();
        }
    }

    record Zugestellt() implements Status {}
    record Storniert()  implements Status {}

    // --- Context: delegiert alle Aktionen an den aktuellen Zustand ---
    static final class Bestellung {
        final int nummer;
        final int betrag;
        private Status status = new Neu();

        Bestellung(int nummer, int betrag) { this.nummer = nummer; this.betrag = betrag; }

        void bezahlen()   { status = status.bezahlen(this);   zeige(); }
        void versenden()  { status = status.versenden(this);  zeige(); }
        void zustellen()  { status = status.zustellen(this);  zeige(); }
        void stornieren() { status = status.stornieren(this); zeige(); }

        // Zustandsabhängige Auswertung per Pattern Matching: der Compiler prüft Vollständigkeit
        String fuerKunden() {
            return switch (status) {
                case Neu n                   -> "Wartet auf Zahlung";
                case Bezahlt b               -> "Wird verpackt";
                case Versendet(String nr)    -> "Unterwegs, Sendung " + nr;
                case Zugestellt z            -> "Zugestellt";
                case Storniert s             -> "Storniert";
            };
        }

        private void zeige() {
            System.out.println("  -> " + status.getClass().getSimpleName() + ": " + fuerKunden());
        }
    }

    public static void main(String[] args) {
        System.out.println("Bestellung 1: normaler Ablauf");
        Bestellung b1 = new Bestellung(1, 59);
        b1.versenden();          // noch nicht bezahlt
        b1.bezahlen();
        b1.versenden();
        b1.stornieren();         // schon unterwegs
        b1.zustellen();

        System.out.println("\nBestellung 2: Storno nach Zahlung");
        Bestellung b2 = new Bestellung(2, 120);
        b2.bezahlen();
        b2.stornieren();
        b2.versenden();          // storniert, geht nicht mehr
    }
}
```

## Ausgabe

```
Bestellung 1: normaler Ablauf
    nicht möglich: versenden im Status Neu
  -> Neu: Wartet auf Zahlung
    Zahlung über 59 € verbucht
  -> Bezahlt: Wird verpackt
    Paket übergeben, Sendung PK-4712
  -> Versendet: Unterwegs, Sendung PK-4712
    nicht möglich: stornieren im Status Versendet
  -> Versendet: Unterwegs, Sendung PK-4712
    Sendung PK-4712 zugestellt
  -> Zugestellt: Zugestellt

Bestellung 2: Storno nach Zahlung
    Zahlung über 120 € verbucht
  -> Bezahlt: Wird verpackt
    Bestellung storniert, 120 € werden erstattet
  -> Storniert: Storniert
    nicht möglich: versenden im Status Storniert
  -> Storniert: Storniert
```

## Wann einsetzen?

- Das Verhalten eines Objekts hängt von seinem Zustand ab und muss sich zur Laufzeit ändern.
- Methoden enthalten große, gleichartige Verzweigungen über ein Statusfeld.
- Es gibt klar definierte Zustände und Übergänge, also einen Zustandsautomaten.

Typische Beispiele sind Bestell- und Genehmigungsabläufe, Netzwerkverbindungen (verbunden, wartend, getrennt), Automaten wie Ampel, Getränke- oder Fahrkartenautomat, Spielfiguren (stehend, laufend, springend) und Parser, deren Verhalten vom gerade gelesenen Kontext abhängt.

## Nachteile

Für jeden Zustand entsteht eine eigene Klasse. Bei zwei, drei Zuständen mit wenig Verhalten ist ein einfaches `enum` mit einem `switch` oft lesbarer. Außerdem verteilt sich die Gesamtlogik des Ablaufs auf viele Klassen: Um alle möglichen Übergänge zu sehen, muss man sämtliche Zustandsklassen lesen. Ein Zustandsdiagramm in der Dokumentation hilft hier sehr.

## Beispiele aus der Praxis

Im JDK lässt sich der Lebenszyklus von `Thread` mit dem Enum `Thread.State` abfragen, ebenso der einer `Future`-Aufgabe mit `Future.State`, neu seit Java 19. Hier sind die Zustände allerdings nur Werte, kein State-Muster im engeren Sinn. Workflow-Engines und Bibliotheken wie Spring Statemachine bauen ganze Zustandsautomaten nach diesem Prinzip.

## Verwandte Muster

**Strategy** hat fast dieselbe Struktur, aber ein anderes Ziel: Eine Strategie wird meist von außen gewählt und bleibt, und die Strategien kennen einander nicht. Zustände dagegen wechseln sich gegenseitig ab und kennen ihre Nachfolger. Zustandslose Zustandsobjekte lassen sich als **Flyweight** oder **Singleton** teilen, da hier jeder Zustand ohne Felder ein unveränderlicher Record ist. **Memento** sichert Zustand, um ihn wiederherzustellen, State nutzt Zustand, um Verhalten zu steuern.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java State.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
