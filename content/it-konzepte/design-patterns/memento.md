+++
title = "Memento"
description = "Zustand externalisieren und wiederherstellen, ohne Kapselung zu brechen"
date = 2026-10-26T20:36:00+01:00
nummer = 18
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 18 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/memento.html" titel="Memento – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Im Speicher sieht man die Spielfigur und jeden Spielstand als eigenes Objekt. Ein Stand behält seine Kopie des Inventars, auch wenn die Figur später Neues findet. Die Speicherverwaltung legt die Stände nur ab und gibt sie zurück, hineinschauen kann sie nicht. Beim Laden zerlegt erst die Spielfigur den Stand mit einem Record Pattern und übernimmt die Werte.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Ein Memento hält den **inneren Zustand eines Objekts** fest, damit das Objekt später in genau diesen Zustand zurückversetzt werden kann. Das Besondere: Die **Kapselung bleibt erhalten**. Wer das Memento aufbewahrt, kann nicht hineinschauen und es nicht verändern.

## Das Problem

Ein Spiel soll Speicherstände und Checkpoints anbieten. Die Spielfigur hat dafür Leben, Level, Aufenthaltsort und ein Inventar, alles private Felder. Eine Speicherverwaltung von außen müsste diese Felder lesen und später wieder setzen können. Dazu müsste die Spielfigur Getter und Setter für ihren gesamten inneren Zustand anbieten. Dann könnte aber jeder beliebige Programmteil das Leben auf 9999 setzen, und die Spielfigur hätte keine Kontrolle mehr über ihre eigenen Daten. Ändert sich der Aufbau der Figur, muss außerdem die Speicherverwaltung mitgeändert werden.

## Die Lösung

Die Spielfigur erzeugt ihren Schnappschuss selbst. Sie packt ihren Zustand in ein Memento-Objekt und gibt es heraus, aber nur als undurchsichtigen Typ `Spielstand` ohne Methoden. Die Speicherverwaltung kann es aufbewahren und später zurückgeben, mehr nicht. Nur die Spielfigur selbst weiß, was im Memento steckt, und kann es beim Laden wieder auspacken. Wer etwas speichert, und wer weiß, *was* gespeichert wird, sind damit sauber getrennt.

## Die Beteiligten

- **Originator**: `Spielfigur` erzeugt ein Memento mit ihrem aktuellen Zustand und kann sich aus einem Memento wiederherstellen.
- **Memento**: `Stand` speichert den Zustand. Nach außen ist er nur als `Spielstand` sichtbar.
- **Caretaker**: `Speicherverwaltung` verwahrt die Mementos in Slots und auf einem Checkpoint-Stapel, ohne ihren Inhalt zu kennen.

## Java-21-Details

Das GoF-Buch spricht von einer „breiten“ Schnittstelle für den Originator und einer „schmalen“ für alle anderen. In Java lässt sich das so umsetzen: Das öffentliche Interface `Spielstand` ist leer und damit die schmale Schnittstelle. Das eigentliche Memento ist ein `private record` innerhalb der Spielfigur, also die breite Schnittstelle, die nur sie selbst sieht. Records sind ideal für Mementos, weil sie unveränderlich sind. Der kompakte Konstruktor kopiert das Inventar mit `List.copyOf()`. Ohne diese Kopie würden Memento und Spielfigur dieselbe Liste teilen, und ein später gefundener Gegenstand tauchte plötzlich auch im alten Spielstand auf.

Beim Laden prüft und zerlegt die Spielfigur das Memento in einem Schritt mit einem **Record Pattern** in `instanceof`: `s instanceof Stand(int l, int lv, String o, List<String> inv)`. Gibt jemand ein fremdes Objekt hinein, schlägt die Prüfung fehl.

Ein ehrlicher Hinweis: Weil alles in einer Datei steht, könnte `main()` technisch doch auf den privaten Record zugreifen, denn Java erlaubt den Zugriff auf private Mitglieder innerhalb derselben äußeren Klasse. In einem echten Projekt wäre `Spielfigur` eine eigene Klasse, und dann ist `Stand` von außen wirklich unerreichbar.

## Quellcode

Die Datei `Memento.java` ist ohne Build-Tool direkt ausführbar: `java Memento.java`

```
// Memento (GoF, Verhaltensmuster)
// Hält den inneren Zustand eines Objekts fest, damit er später wiederhergestellt werden kann,
// ohne die Kapselung zu verletzen.
// Start: java Memento.java

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Memento {

    // --- Originator: besitzt den Zustand und erzeugt bzw. liest Mementos ---
    static final class Spielfigur {

        // Nach außen nur ein undurchsichtiger Typ: der Caretaker sieht keine Inhalte
        interface Spielstand {}

        // Das eigentliche Memento: privat, unveränderlich, nur die Spielfigur kennt es
        private record Stand(int leben, int level, String ort, List<String> inventar)
                implements Spielstand {
            Stand {
                inventar = List.copyOf(inventar);     // Kopie, damit spätere Änderungen nicht durchschlagen
            }
        }

        private int leben = 100;
        private int level = 1;
        private String ort = "Dorf";
        private final List<String> inventar = new ArrayList<>(List.of("Holzschwert"));

        // Aktionen, die den Zustand verändern
        void kaempfe(int schaden)   { leben -= schaden; }
        void reise(String ziel)     { ort = ziel; }
        void finde(String gegenst)  { inventar.add(gegenst); }
        void steigeAuf()            { level++; leben = 100; }

        Spielstand speichern() {
            return new Stand(leben, level, ort, inventar);
        }

        void laden(Spielstand s) {
            if (!(s instanceof Stand(int l, int lv, String o, List<String> inv))) {
                throw new IllegalArgumentException("Fremder Spielstand");
            }
            leben = l;
            level = lv;
            ort = o;
            inventar.clear();
            inventar.addAll(inv);
        }

        public String toString() {
            return "Level %d, %3d Leben, %-13s %s".formatted(level, leben, ort, inventar);
        }
    }

    // --- Caretaker: verwahrt Mementos, ohne hineinzuschauen ---
    static final class Speicherverwaltung {
        private final Map<String, Spielfigur.Spielstand> slots = new HashMap<>();
        private final Deque<Spielfigur.Spielstand> checkpoints = new ArrayDeque<>();

        void sichere(String slot, Spielfigur.Spielstand s) { slots.put(slot, s); }
        Spielfigur.Spielstand hole(String slot)            { return slots.get(slot); }

        void checkpoint(Spielfigur.Spielstand s) { checkpoints.push(s); }
        Spielfigur.Spielstand letzterCheckpoint() { return checkpoints.pop(); }
    }

    public static void main(String[] args) {
        Spielfigur held = new Spielfigur();
        Speicherverwaltung speicher = new Speicherverwaltung();

        System.out.println("Start:            " + held);
        speicher.sichere("Slot 1", held.speichern());

        held.reise("Wald");
        held.finde("Heiltrank");
        held.steigeAuf();
        speicher.checkpoint(held.speichern());
        System.out.println("Checkpoint Wald:  " + held);

        held.reise("Drachenhöhle");
        held.finde("Goldschlüssel");
        held.kaempfe(85);
        System.out.println("Nach dem Kampf:   " + held);

        // Zurück zum letzten Checkpoint
        held.laden(speicher.letzterCheckpoint());
        System.out.println("Checkpoint laden: " + held);

        // Ganz von vorn
        held.laden(speicher.hole("Slot 1"));
        System.out.println("Slot 1 laden:     " + held);

        // Der Caretaker kann nichts mit dem Inhalt anfangen:
        Spielfigur.Spielstand s = speicher.hole("Slot 1");
        System.out.println("\nCaretaker sieht nur: " + s.getClass().getSimpleName()
                + " (Felder von außerhalb nicht zugreifbar)");
    }
}
```

## Ausgabe

```
Start:            Level 1, 100 Leben, Dorf          [Holzschwert]
Checkpoint Wald:  Level 2, 100 Leben, Wald          [Holzschwert, Heiltrank]
Nach dem Kampf:   Level 2,  15 Leben, Drachenhöhle  [Holzschwert, Heiltrank, Goldschlüssel]
Checkpoint laden: Level 2, 100 Leben, Wald          [Holzschwert, Heiltrank]
Slot 1 laden:     Level 1, 100 Leben, Dorf          [Holzschwert]

Caretaker sieht nur: Stand (Felder von außerhalb nicht zugreifbar)
```

## Wann einsetzen?

- Ein Objekt soll in einen früheren Zustand zurückversetzt werden können: Undo, Speicherstände, Checkpoints.
- Bei Transaktionen soll im Fehlerfall der Ausgangszustand wiederhergestellt werden.
- Der Zustand soll gesichert werden, ohne die Interna des Objekts nach außen offenzulegen.

## Nachteile

Mementos können viel **Speicher** kosten, wenn der Zustand groß ist oder sehr oft gespeichert wird. Ein Editor, der bei jedem Tastendruck das ganze Dokument kopiert, stößt schnell an Grenzen. Dann speichert man besser nur die Änderungen oder kombiniert das Muster mit Command. Der Caretaker weiß außerdem nicht, wie groß ein Memento ist, und kann deshalb schlecht entscheiden, wann er alte Stände verwirft. Und eine flache Kopie reicht oft nicht aus: Enthält der Zustand veränderliche Objekte, müssen sie mitkopiert werden, wie hier das Inventar.

## Memento oder Command für Undo?

Beide Muster eignen sich für Undo, gehen aber unterschiedlich vor. **Command** merkt sich, *was getan* wurde, und kennt die Umkehroperation. Das spart Speicher, aber nicht jede Aktion lässt sich sauber umkehren. **Memento** merkt sich, *wie es vorher war*, und stellt diesen Zustand einfach wieder her. Das ist robust und einfach, kostet aber mehr Speicher. In der Praxis werden beide oft kombiniert: Ein Command legt vor dem Ausführen ein Memento an und lädt es beim Rückgängigmachen.

## Beispiele aus der Praxis

Die Serialisierung in Java (`Serializable`) ist im Grunde eine Memento-Technik: Ein Objekt schreibt seinen Zustand in einen Bytestrom und lässt sich daraus wiederherstellen. Datenbanktransaktionen mit Savepoints arbeiten nach demselben Prinzip. In der Spieleentwicklung sind Speicherstände das klassische Beispiel.

## Verwandte Muster

**Command** kann Mementos verwenden, um Undo umzusetzen. **Iterator** kann über ein Memento seinen Fortschritt speichern. **Prototype** ist eine Alternative, wenn der gesamte Zustand ohnehin öffentlich ist: Dann kopiert man einfach das ganze Objekt. **State** verwaltet ebenfalls Zustand, aber um das Verhalten zu ändern, nicht um es später zurückzusetzen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Memento.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
