+++
title = "Composite"
description = "Teil-Ganzes-Hierarchien als Baum, Einzel- und Gruppenobjekte gleich behandeln"
date = 2026-10-26T19:01:00+01:00
nummer = 8
gruppe = "struktur"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 8 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/composite.html" titel="Composite – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Zuerst entsteht der Baum, und zwar von innen nach außen, weil Java die Argumente vor dem Konstruktor auswertet. Bei der ersten Zeile von zeige() ist die Rekursion vollständig zu sehen: Im Aufrufstapel fragt projekt den Ordner bilder, bilder fragt fotos, fotos fragt die Dateien. Danach laufen dieselben Rekursionen in einem Schritt, sonst würde der Ablauf sehr lang. Zum Schluss zählt zaehleDateien() mit Pattern Matching im switch. Die Zahlen stehen wie auf der Seite mit Punkt, auf einem deutsch eingestellten Rechner schreibt das Programm ein Komma.

*GoF-Strukturmuster · Java 21*

## Zweck

Das Composite setzt Objekte zu **Baumstrukturen** zusammen, um Teil-Ganzes-Hierarchien darzustellen. Der Clou: Einzelne Objekte und zusammengesetzte Gruppen werden **einheitlich behandelt**. Der Client muss nicht wissen, ob er ein Blatt oder einen ganzen Teilbaum vor sich hat.

## Das Problem

Ein Dateisystem besteht aus Dateien und Ordnern, Ordner enthalten wiederum Dateien und weitere Ordner, beliebig tief verschachtelt. Will man die Gesamtgröße berechnen oder den Baum anzeigen, müsste der Client ohne gemeinsame Schnittstelle bei jedem Element prüfen, was es ist, und Ordner selbst rekursiv durchlaufen. Diese Fallunterscheidung wäre über den ganzen Code verstreut und müsste bei jeder neuen Operation wiederholt werden.

## Die Lösung

Datei und Ordner implementieren dieselbe Schnittstelle `Eintrag`. Eine Datei beantwortet `groesse()` direkt. Ein Ordner fragt seine Kinder und summiert deren Antworten, egal ob das Dateien oder weitere Ordner sind. Die Rekursion steckt damit in der Struktur selbst, nicht im Client. Für den Aufrufer ist `projekt.groesse()` genauso einfach wie `notiz.groesse()`.

## Die Beteiligten

- **Component**: `Eintrag` ist die gemeinsame Schnittstelle für alle Elemente im Baum.
- **Leaf**: `Datei` ist ein Blatt ohne Kinder und erledigt die eigentliche Arbeit.
- **Composite**: `Ordner` verwaltet Kinder und leitet Aufrufe an sie weiter.
- **Client**: `main()` und `zaehleDateien()` arbeiten nur mit `Eintrag`.

## Transparenz oder Sicherheit?

Eine klassische Designfrage bei diesem Muster: Wo werden Methoden wie `hinzufuegen()` deklariert? Steht sie im Component-Interface, ist die Behandlung maximal einheitlich (*Transparenz*), aber eine Datei müsste dann eine Methode anbieten, die für sie keinen Sinn ergibt, und zur Laufzeit einen Fehler werfen. Steht sie nur im Composite, kann der Compiler falsche Aufrufe verhindern (*Sicherheit*), dafür muss der Client manchmal wissen, mit welchem Typ er arbeitet. Das GoF-Buch tendiert zur Transparenz. Das Beispiel hier wählt die Sicherheit, was in typisiertem Java heute meist bevorzugt wird.

## Java-21-Details

Die Schnittstelle `Eintrag` ist `sealed` und lässt nur `Datei` und `Ordner` zu. Das passt gut, denn in einer Baumstruktur sind die Knotenarten meist fest. Dadurch kann `zaehleDateien()` mit **Pattern Matching im `switch`** arbeiten: Der Compiler weiß, dass es nur diese beiden Fälle gibt, und verlangt keinen `default`-Zweig. Kommt später eine dritte Art hinzu, etwa ein symbolischer Link, meldet der Compiler jede Stelle, die angepasst werden muss. Die Datei ist ein `record`, der Ordner eine normale Klasse, weil er eine veränderliche Kinderliste verwaltet.

## Quellcode

Die Datei `Composite.java` ist ohne Build-Tool direkt ausführbar: `java Composite.java`

```
// Composite (GoF, Strukturmuster)
// Setzt Objekte zu Baumstrukturen zusammen und behandelt Einzelobjekte und Gruppen einheitlich.
// Start: java Composite.java

import java.util.ArrayList;
import java.util.List;

public class Composite {

    // --- Component: gemeinsame Schnittstelle für Blätter und Container ---
    sealed interface Eintrag permits Datei, Ordner {
        String name();
        long groesse();                              // in Bytes
        void zeige(String einrueckung);
    }

    // --- Leaf: Blatt ohne Kinder ---
    record Datei(String name, long groesse) implements Eintrag {
        public void zeige(String einrueckung) {
            System.out.printf("%s%s (%s)%n", einrueckung, name, format(groesse));
        }
    }

    // --- Composite: enthält beliebige Einträge, auch weitere Ordner ---
    static final class Ordner implements Eintrag {
        private final String name;
        private final List<Eintrag> kinder = new ArrayList<>();

        Ordner(String name, Eintrag... kinder) {
            this.name = name;
            this.kinder.addAll(List.of(kinder));
        }

        Ordner hinzufuegen(Eintrag e) { kinder.add(e); return this; }

        public String name() { return name; }

        // Rekursion: die Größe eines Ordners ist die Summe seiner Kinder
        public long groesse() {
            return kinder.stream().mapToLong(Eintrag::groesse).sum();
        }

        public void zeige(String einrueckung) {
            System.out.printf("%s%s/ (%s)%n", einrueckung, name, format(groesse()));
            kinder.forEach(k -> k.zeige(einrueckung + "    "));
        }
    }

    static String format(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return "%.1f KB".formatted(bytes / 1024.0);
        return "%.1f MB".formatted(bytes / (1024.0 * 1024));
    }

    // --- Client: arbeitet mit Eintrag, egal ob Datei oder Ordner ---
    static long zaehleDateien(Eintrag e) {
        return switch (e) {
            case Datei d  -> 1;
            case Ordner o -> o.kinder.stream().mapToLong(Composite::zaehleDateien).sum();
        };
    }

    public static void main(String[] args) {
        Ordner projekt = new Ordner("projekt",
                new Datei("README.md", 2_048),
                new Ordner("src",
                        new Datei("Main.java", 4_200),
                        new Datei("Util.java", 1_800)),
                new Ordner("bilder",
                        new Datei("logo.png", 250_000),
                        new Ordner("fotos",
                                new Datei("team.jpg", 3_400_000),
                                new Datei("buero.jpg", 2_900_000))));

        projekt.zeige("");

        // Einheitliche Behandlung: dieselben Aufrufe für Blatt und Baum
        Eintrag einzeln = new Datei("notiz.txt", 300);
        System.out.println();
        System.out.println("Größe notiz.txt: " + format(einzeln.groesse()));
        System.out.println("Größe projekt:   " + format(projekt.groesse()));
        System.out.println("Dateien gesamt:  " + zaehleDateien(projekt));

        // Struktur zur Laufzeit erweitern
        projekt.hinzufuegen(new Datei("LICENSE", 1_100));
        System.out.println("Nach Hinzufügen: " + zaehleDateien(projekt) + " Dateien");
    }
}
```

## Ausgabe

```
projekt/ (6.3 MB)
    README.md (2.0 KB)
    src/ (5.9 KB)
        Main.java (4.1 KB)
        Util.java (1.8 KB)
    bilder/ (6.2 MB)
        logo.png (244.1 KB)
        fotos/ (6.0 MB)
            team.jpg (3.2 MB)
            buero.jpg (2.8 MB)

Größe notiz.txt: 300 B
Größe projekt:   6.3 MB
Dateien gesamt:  6
Nach Hinzufügen: 7 Dateien
```

## Wann einsetzen?

- Die Daten haben eine Baumstruktur, also Teil-Ganzes-Hierarchien beliebiger Tiefe.
- Clients sollen den Unterschied zwischen Einzelobjekt und Gruppe ignorieren können.
- Operationen sollen rekursiv über die ganze Struktur laufen, etwa Summen bilden, zeichnen, durchsuchen.

Typische Beispiele sind Dateisysteme, GUI-Komponenten (ein Fenster enthält Panels, die Buttons enthalten), Stücklisten, Organigramme, Menüs mit Untermenüs sowie Syntaxbäume in Compilern.

## Nachteile

Die einheitliche Schnittstelle macht es schwer, Einschränkungen auszudrücken. Soll etwa ein Ordner nur Bilder enthalten dürfen, lässt sich das nicht über Typen erzwingen, sondern nur zur Laufzeit prüfen. Außerdem kann das Design zu allgemein werden: Muss die Component-Schnittstelle alle Fähigkeiten von Blättern und Containern abdecken, wird sie leicht aufgebläht.

## Beispiele aus dem JDK

In Swing und AWT ist `java.awt.Container` selbst eine `Component` und kann weitere Components enthalten. Auch das DOM in `org.w3c.dom` ist ein Composite: Ein `Element` ist ein `Node` und enthält weitere Nodes.

## Verwandte Muster

**Iterator** durchläuft Composite-Strukturen, **Visitor** fügt ihnen neue Operationen hinzu, ohne die Klassen zu ändern. **Decorator** hat eine ähnliche rekursive Struktur, hat aber genau ein Kind und fügt Verhalten hinzu, statt Kinder zusammenzufassen. **Builder** eignet sich, um komplexe Composite-Bäume aufzubauen, **Prototype**, um sie zu kopieren. Mit **Flyweight** lassen sich gemeinsam genutzte Blätter einsparen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Composite.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein – allerdings erst mit englischer Spracheinstellung (`-Duser.language=en`). Auf einem deutsch eingestellten Rechner schreibt das Programm „projekt/ (6,3 MB)“ statt „projekt/ (6.3 MB)“, weil `printf` das Zahlenformat der Systemsprache nimmt.
{{< /anmerkung >}}
