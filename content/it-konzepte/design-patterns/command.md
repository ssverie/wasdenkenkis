+++
title = "Command"
description = "Anfrage als Objekt kapseln (Undo, Queues, Logging)"
date = 2026-10-26T20:02:00+01:00
nummer = 14
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 14 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/command.html" titel="Command – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Jede Aktion ist ein eigenes Objekt im Speicher. Der Editor legt es nach dem Ausführen auf den Undo-Stapel, bei Undo wandert es auf den Redo-Stapel und zurück. Im Feld geloescht sieht man, was der Löschbefehl sich merkt, damit Undo funktioniert. Das Makro führt zwei Befehle aus und nimmt sie in umgekehrter Reihenfolge zurück. Am Ende stehen drei Lambdas in einer Warteschlange und laufen erst, wenn poll() sie holt.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Das Command-Muster kapselt eine **Anfrage als Objekt**. Aus „tu jetzt etwas“ wird ein Gegenstand, den man speichern, weitergeben, in eine Warteschlange stellen, protokollieren und vor allem **rückgängig machen** kann.

## Das Problem

Ein Texteditor soll Undo und Redo beherrschen. Ruft die Oberfläche direkt `dokument.einfuegen()` oder `dokument.loeschen()` auf, ist die Aktion danach vorbei und vergessen. Es gibt nichts, woran sich der Editor später erinnern könnte, um sie zurückzunehmen. Außerdem müsste jeder Button, jeder Menüeintrag und jedes Tastenkürzel selbst wissen, wie das Dokument intern funktioniert.

## Die Lösung

Jede Aktion wird ein eigenes Objekt mit den Methoden `ausfuehren()` und `rueckgaengig()`. Es merkt sich alles, was es für beides braucht: das Dokument, die Position, den Text, beim Löschen zusätzlich den gelöschten Inhalt. Der Editor führt Befehle aus und legt sie auf einen Undo-Stapel. Beim Rückgängigmachen nimmt er den obersten Befehl herunter, ruft `rueckgaengig()` auf und legt ihn auf den Redo-Stapel. Der Editor selbst muss dabei nicht wissen, was ein Befehl tut. Er kennt nur die gemeinsame Schnittstelle.

## Die Beteiligten

- **Command**: `Befehl` deklariert die Schnittstelle zum Ausführen (und hier zum Rückgängigmachen).
- **ConcreteCommand**: `Einfuegen` und `Loeschen` verbinden einen Receiver mit einer Aktion und speichern die nötigen Parameter.
- **Receiver**: `Dokument` weiß, wie die eigentliche Arbeit erledigt wird.
- **Invoker**: `Editor` löst die Befehle aus und verwaltet die Historie, ohne den Receiver zu kennen.
- **Client**: `main()` erzeugt die Befehle und übergibt sie dem Invoker.

## Makro-Befehle

Weil ein Befehl nur eine Schnittstelle erfüllen muss, kann ein Befehl auch aus mehreren anderen bestehen. Der `Makro` führt seine Teilbefehle der Reihe nach aus und nimmt sie in *umgekehrter* Reihenfolge zurück. Für den Editor ist er ein einziger Befehl: Ein Undo nimmt das ganze Makro zurück. Das ist eine Kombination mit dem **Composite**-Muster.

## Java-21-Details

Undo- und Redo-Stapel sind `ArrayDeque`s, die moderne Alternative zur veralteten Klasse `Stack`. Das Makro nutzt `List.reversed()`, neu in Java 21 durch die *Sequenced Collections*. Es liefert eine umgekehrte Sicht auf die Liste, ohne sie zu kopieren. Das Makro selbst ist ein `record`.

Ganz am Ende steht die einfachste Form des Musters: Ein Befehl ohne Undo ist in Java schlicht ein `Runnable`, und jedes Lambda ist ein solcher Befehl. Eine Warteschlange von Lambdas ist bereits eine vollwertige Command-Queue.

## Quellcode

Die Datei `Command.java` ist ohne Build-Tool direkt ausführbar: `java Command.java`

```
// Command (GoF, Verhaltensmuster)
// Kapselt eine Anfrage als Objekt. Dadurch lassen sich Anfragen speichern, rückgängig machen,
// in Warteschlangen stellen und protokollieren.
// Start: java Command.java

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

public class Command {

    // --- Receiver: das Objekt, das die eigentliche Arbeit macht ---
    static final class Dokument {
        private final StringBuilder text = new StringBuilder();

        void einfuegen(int pos, String s) { text.insert(pos, s); }
        String loeschen(int pos, int laenge) {
            String weg = text.substring(pos, pos + laenge);
            text.delete(pos, pos + laenge);
            return weg;
        }
        int laenge()            { return text.length(); }
        public String toString() { return "\"" + text + "\""; }
    }

    // --- Command: einheitliche Schnittstelle für alle Befehle ---
    interface Befehl {
        void ausfuehren();
        void rueckgaengig();
        String name();
    }

    // --- Konkrete Commands: speichern alles, was zum Ausführen UND Zurücknehmen nötig ist ---
    static final class Einfuegen implements Befehl {
        private final Dokument dok;
        private final int pos;
        private final String text;

        Einfuegen(Dokument dok, int pos, String text) { this.dok = dok; this.pos = pos; this.text = text; }

        public void ausfuehren()   { dok.einfuegen(pos, text); }
        public void rueckgaengig() { dok.loeschen(pos, text.length()); }
        public String name()       { return "Einfügen \"" + text + "\""; }
    }

    static final class Loeschen implements Befehl {
        private final Dokument dok;
        private final int pos, laenge;
        private String geloescht = "";               // wird beim Ausführen gemerkt

        Loeschen(Dokument dok, int pos, int laenge) { this.dok = dok; this.pos = pos; this.laenge = laenge; }

        public void ausfuehren()   { geloescht = dok.loeschen(pos, laenge); }
        public void rueckgaengig() { dok.einfuegen(pos, geloescht); }
        public String name()       { return "Löschen " + laenge + " Zeichen"; }
    }

    // --- Makro: mehrere Befehle als ein Befehl (Composite) ---
    record Makro(String name, List<Befehl> befehle) implements Befehl {
        public void ausfuehren() { befehle.forEach(Befehl::ausfuehren); }
        public void rueckgaengig() {
            for (Befehl b : befehle.reversed()) b.rueckgaengig();     // Java 21: reversed()
        }
    }

    // --- Invoker: führt Befehle aus und verwaltet Undo/Redo, kennt das Dokument nicht ---
    static final class Editor {
        private final Deque<Befehl> undo = new ArrayDeque<>();
        private final Deque<Befehl> redo = new ArrayDeque<>();
        private final List<String> protokoll = new ArrayList<>();

        void ausfuehren(Befehl b) {
            b.ausfuehren();
            undo.push(b);
            redo.clear();                            // neuer Befehl macht Redo ungültig
            protokoll.add(b.name());
        }
        void rueckgaengig() {
            if (undo.isEmpty()) return;
            Befehl b = undo.pop();
            b.rueckgaengig();
            redo.push(b);
            protokoll.add("Undo: " + b.name());
        }
        void wiederholen() {
            if (redo.isEmpty()) return;
            Befehl b = redo.pop();
            b.ausfuehren();
            undo.push(b);
            protokoll.add("Redo: " + b.name());
        }
        List<String> protokoll() { return protokoll; }
    }

    public static void main(String[] args) {
        Dokument dok = new Dokument();
        Editor editor = new Editor();

        editor.ausfuehren(new Einfuegen(dok, 0, "Hallo"));
        editor.ausfuehren(new Einfuegen(dok, 5, " Welt"));
        System.out.println("Nach zwei Einfügungen: " + dok);

        editor.ausfuehren(new Loeschen(dok, 0, 6));
        System.out.println("Nach Löschen:          " + dok);

        editor.rueckgaengig();
        System.out.println("Undo:                  " + dok);
        editor.rueckgaengig();
        System.out.println("Undo:                  " + dok);
        editor.wiederholen();
        System.out.println("Redo:                  " + dok);

        // Makro: mehrere Schritte, ein einziges Undo
        editor.ausfuehren(new Makro("Gruß ergänzen", List.of(
                new Einfuegen(dok, dok.laenge(), ","),
                new Einfuegen(dok, dok.laenge() + 1, " Sven!"))));
        System.out.println("Nach Makro:            " + dok);
        editor.rueckgaengig();
        System.out.println("Makro rückgängig:      " + dok);

        System.out.println("\nProtokoll:");
        editor.protokoll().forEach(eintrag -> System.out.println("  " + eintrag));

        // Einfachste Form: Befehle ohne Undo sind in Java einfach Lambdas (Runnable)
        System.out.println("\nWarteschlange mit Lambdas:");
        Deque<Runnable> warteschlange = new ArrayDeque<>();
        warteschlange.add(() -> System.out.println("  Speichern"));
        warteschlange.add(() -> System.out.println("  Drucken"));
        warteschlange.add(() -> System.out.println("  Per Mail senden"));
        while (!warteschlange.isEmpty()) warteschlange.poll().run();
    }
}
```

## Ausgabe

```
Nach zwei Einfügungen: "Hallo Welt"
Nach Löschen:          "Welt"
Undo:                  "Hallo Welt"
Undo:                  "Hallo"
Redo:                  "Hallo Welt"
Nach Makro:            "Hallo Welt, Sven!"
Makro rückgängig:      "Hallo Welt"

Protokoll:
  Einfügen "Hallo"
  Einfügen " Welt"
  Löschen 6 Zeichen
  Undo: Löschen 6 Zeichen
  Undo: Einfügen " Welt"
  Redo: Einfügen " Welt"
  Gruß ergänzen
  Undo: Gruß ergänzen

Warteschlange mit Lambdas:
  Speichern
  Drucken
  Per Mail senden
```

## Wann einsetzen?

- **Undo/Redo**: Aktionen sollen zurückgenommen und wiederholt werden können.
- **Warteschlangen und Zeitplanung**: Aktionen sollen später, zeitversetzt oder in einem anderen Thread ausgeführt werden.
- **Protokollierung**: Ausgeführte Aktionen sollen aufgezeichnet werden, etwa um nach einem Absturz den Zustand wiederherzustellen.
- **Entkopplung**: Auslöser wie Buttons, Menüs und Tastenkürzel sollen dieselbe Aktion verwenden, ohne den Empfänger zu kennen.
- **Transaktionen**: Eine Folge von Schritten soll bei einem Fehler komplett zurückgerollt werden.

## Nachteile

Für jede Aktion entsteht eine eigene Klasse, was bei vielen Aktionen umfangreich wird. Undo ist nicht immer einfach: Ein Befehl muss genug Zustand speichern, um seine Wirkung exakt umzukehren, und manche Aktionen wie das Versenden einer E-Mail lassen sich gar nicht zurücknehmen. Undo funktioniert außerdem nur zuverlässig, wenn *alle* Änderungen über Befehle laufen. Ändert jemand das Dokument direkt, passen die gespeicherten Positionen nicht mehr.

## Beispiele aus dem JDK

`Runnable` und `Callable` sind Command-Schnittstellen. Ein `ExecutorService` ist ein Invoker, der sie in Warteschlangen stellt und in Threads ausführt. In Swing kapselt `javax.swing.Action` einen Befehl, den Buttons und Menüeinträge gemeinsam nutzen. `javax.swing.undo.UndoManager` implementiert eine Undo-Historie nach genau diesem Muster.

## Verwandte Muster

**Memento** ist eine Alternative für Undo: Statt die Umkehrung jeder Aktion zu programmieren, speichert man den Zustand vor der Änderung. Beide lassen sich kombinieren, indem ein Befehl ein Memento für sein Undo verwendet. **Composite** ermöglicht Makro-Befehle. **Chain of Responsibility** kann Befehle durch eine Kette von Handlern schicken. **Strategy** hat eine ähnliche Struktur, beschreibt aber *wie* etwas getan wird, während Command beschreibt, *was* getan werden soll.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Command.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
