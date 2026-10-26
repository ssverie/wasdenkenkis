+++
title = "Visitor"
description = "Neue Operationen auf einer Objektstruktur definieren, ohne deren Klassen zu ändern"
date = 2026-10-26T21:05:00+01:00
nummer = 23
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 23 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/visitor.html" titel="Visitor – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Beim Buch und bei den Kopfhörern sieht man den Double Dispatch im Aufrufstapel: Zuerst wählt Java annehmen() nach dem echten Typ des Postens, darin wählt v.besuche(this) die passende Überladung des Besuchers. Die übrigen Posten laufen in je einem Schritt. Die Kategorie kommt ohne Besucher aus: Sie entsteht per Pattern Matching im switch, teils mit Bedingungen (when).

*GoF-Verhaltensmuster · Java 21*

## Zweck

Der Visitor (Besucher) ermöglicht es, **neue Operationen** auf den Elementen einer Objektstruktur zu definieren, **ohne die Klassen dieser Elemente zu ändern**. Die Operation wird in ein eigenes Besucher-Objekt ausgelagert, das an jedem Element „vorbeikommt“ und je nach Elementtyp das Passende tut.

## Das Problem

Ein Warenkorb enthält verschiedene Arten von Posten: Bücher, Lebensmittel und Elektronik. Auf diesen Posten sollen immer neue Auswertungen laufen: die enthaltene Mehrwertsteuer (7 % für Bücher und Lebensmittel, 19 % für Elektronik), Versandhinweise, später vielleicht ein Export oder eine Zollerklärung. Schreibt man jede Auswertung als Methode in die Postenklassen, wachsen diese mit jeder neuen Anforderung. Sie vermischen Daten mit Steuerrecht, Logistik und Dateiformaten. Die Alternative, überall mit `instanceof`-Kaskaden zu prüfen, welcher Posten gerade vorliegt, ist fehleranfällig: Kommt eine neue Postenart hinzu, findet niemand alle Stellen, die angepasst werden müssen.

## Die Lösung

Jede Auswertung wird ein eigener Visitor mit einer `besuche()`-Methode pro Elementtyp. Die Elemente bekommen nur eine einzige, allgemeine Methode `annehmen(visitor)`, die den Visitor zurückruft: `v.besuche(this)`. Weil `this` in `Buch` den Typ `Buch` hat, wählt der Compiler automatisch die richtige Überladung. Eine neue Auswertung ist damit ein neuer Visitor, und die Postenklassen bleiben unverändert.

## Double Dispatch

Der Kniff hinter dem Muster heißt *Double Dispatch*. Java entscheidet bei einem Methodenaufruf zur Laufzeit nur anhand *eines* Objekts, auf dem die Methode aufgerufen wird, welche Implementierung läuft. Welche Überladung gewählt wird, legt dagegen der Compiler anhand der statischen Typen fest. Der Aufruf `visitor.besuche(posten)` mit einer Variable vom Typ `Posten` würde deshalb nicht kompilieren, denn es gibt kein `besuche(Posten)`. Der Umweg über `annehmen()` löst das in zwei Schritten: Erst wählt die JVM anhand des Postens das richtige `annehmen()`, und darin ist der Typ von `this` bekannt, sodass der Compiler das richtige `besuche()` auswählt.

## Die Beteiligten

- **Visitor**: `PostenVisitor<R>` deklariert eine `besuche()`-Methode für jeden Elementtyp.
- **ConcreteVisitor**: `Mehrwertsteuer` und `Versandhinweis` implementieren je eine Operation für alle Elementtypen.
- **Element**: `Posten` deklariert `annehmen()`.
- **ConcreteElement**: `Buch`, `Lebensmittel` und `Elektronik` implementieren `annehmen()` durch den Rückruf an den Visitor.
- **ObjectStructure**: die Liste `warenkorb`, deren Elemente besucht werden.

## Java-21-Details

Der Visitor ist **generisch**: `PostenVisitor<R>` legt den Ergebnistyp fest. Die Steuer liefert `Integer`, der Versandhinweis `String`. Das GoF-Original arbeitet mit `void`-Methoden und sammelt Ergebnisse in Feldern des Visitors, was umständlicher ist.

Vor allem aber zeigt das Beispiel, dass Java 21 das Muster in vielen Fällen überflüssig macht. Ist die Elementhierarchie `sealed`, kann man eine neue Operation einfach als Funktion mit **Pattern Matching im `switch`** schreiben, wie `kategorie()`, `name()` und `preis()`. Der Compiler prüft, dass alle Typen behandelt werden, genau wie beim Visitor-Interface. Dazu kommen Möglichkeiten, die der klassische Visitor nicht hat:

- **Guards** mit `when` unterscheiden innerhalb eines Typs: gekühlte gegen ungekühlte Lebensmittel.
- **Record Patterns** zerlegen das Element direkt: `case Elektronik(var n, var preis, var g) when preis > 50_000`.
- Kein `annehmen()` in den Elementen nötig, keine eigene Klasse pro Operation.

## Quellcode

Die Datei `Visitor.java` ist ohne Build-Tool direkt ausführbar: `java Visitor.java`

```
// Visitor (GoF, Verhaltensmuster)
// Definiert neue Operationen auf den Elementen einer Objektstruktur,
// ohne die Klassen dieser Elemente zu ändern.
// Start: java Visitor.java

import java.util.List;
import java.util.Locale;

public class Visitor {

    // --- Element: nimmt Besucher an ---
    sealed interface Posten permits Buch, Lebensmittel, Elektronik {
        <R> R annehmen(PostenVisitor<R> v);
    }

    // --- ConcreteElements: reine Daten + annehmen() (Double Dispatch) ---
    record Buch(String titel, int preisCent) implements Posten {
        public <R> R annehmen(PostenVisitor<R> v) { return v.besuche(this); }
    }
    record Lebensmittel(String name, int preisCent, boolean gekuehlt) implements Posten {
        public <R> R annehmen(PostenVisitor<R> v) { return v.besuche(this); }
    }
    record Elektronik(String name, int preisCent, int garantieMonate) implements Posten {
        public <R> R annehmen(PostenVisitor<R> v) { return v.besuche(this); }
    }

    // --- Visitor: eine besuche()-Methode pro Elementtyp, generischer Rückgabetyp ---
    interface PostenVisitor<R> {
        R besuche(Buch b);
        R besuche(Lebensmittel l);
        R besuche(Elektronik e);
    }

    // --- ConcreteVisitor 1: Mehrwertsteuer (ermäßigt für Bücher und Lebensmittel) ---
    static final class Mehrwertsteuer implements PostenVisitor<Integer> {
        private static int anteil(int brutto, int satz) { return Math.round(brutto * satz / (100f + satz)); }
        public Integer besuche(Buch b)         { return anteil(b.preisCent(), 7); }
        public Integer besuche(Lebensmittel l) { return anteil(l.preisCent(), 7); }
        public Integer besuche(Elektronik e)   { return anteil(e.preisCent(), 19); }
    }

    // --- ConcreteVisitor 2: Versandhinweise ---
    static final class Versandhinweis implements PostenVisitor<String> {
        public String besuche(Buch b)         { return "Büchersendung"; }
        public String besuche(Lebensmittel l) { return l.gekuehlt() ? "Kühlbox erforderlich" : "Standardpaket"; }
        public String besuche(Elektronik e)   { return "Versichert, " + e.garantieMonate() + " Monate Garantie beilegen"; }
    }

    // --- Moderne Alternative in Java 21: Pattern Matching statt Visitor-Klasse ---
    static String kategorie(Posten p) {
        return switch (p) {
            case Buch b                                  -> "Medien";
            case Lebensmittel l when l.gekuehlt()        -> "Frische";
            case Lebensmittel l                          -> "Vorrat";
            case Elektronik(var n, var preis, var g) when preis > 50_000 -> "Technik (hochwertig)";
            case Elektronik e                            -> "Technik";
        };
    }

    static String euro(int cent) { return String.format(Locale.GERMANY, "%7.2f €", cent / 100.0); }

    static String name(Posten p) {
        return switch (p) {
            case Buch b         -> b.titel();
            case Lebensmittel l -> l.name();
            case Elektronik e   -> e.name();
        };
    }

    public static void main(String[] args) {
        List<Posten> warenkorb = List.of(
                new Buch("Entwurfsmuster", 4_999),
                new Lebensmittel("Kaffeebohnen", 1_290, false),
                new Lebensmittel("Käse", 690, true),
                new Elektronik("Kopfhörer", 12_900, 24),
                new Elektronik("Laptop", 89_900, 36));

        var steuer = new Mehrwertsteuer();
        var versand = new Versandhinweis();

        System.out.printf("%-15s %9s %9s   %-21s %s%n", "Posten", "Preis", "MwSt", "Kategorie", "Versand");
        int summeSteuer = 0;
        for (Posten p : warenkorb) {
            int mwst = p.annehmen(steuer);                // klassischer Visitor
            summeSteuer += mwst;
            System.out.printf("%-15s %s %s   %-21s %s%n",
                    name(p), euro(preis(p)), euro(mwst), kategorie(p), p.annehmen(versand));
        }
        System.out.println("Enthaltene MwSt gesamt: " + euro(summeSteuer).strip());
    }

    static int preis(Posten p) {
        return switch (p) {
            case Buch(var t, var preis)              -> preis;
            case Lebensmittel(var n, var preis, var k) -> preis;
            case Elektronik(var n, var preis, var g)   -> preis;
        };
    }
}
```

## Ausgabe

```
Posten              Preis      MwSt   Kategorie             Versand
Entwurfsmuster    49,99 €    3,27 €   Medien                Büchersendung
Kaffeebohnen      12,90 €    0,84 €   Vorrat                Standardpaket
Käse               6,90 €    0,45 €   Frische               Kühlbox erforderlich
Kopfhörer        129,00 €   20,60 €   Technik               Versichert, 24 Monate Garantie beilegen
Laptop           899,00 €  143,54 €   Technik (hochwertig)  Versichert, 36 Monate Garantie beilegen
Enthaltene MwSt gesamt: 168,70 €
```

## Wann einsetzen?

- Auf einer Objektstruktur sollen viele verschiedene, voneinander unabhängige Operationen ausgeführt werden, und die Elementklassen sollen nicht damit überfrachtet werden.
- Die Elementtypen ändern sich selten, die Operationen kommen dagegen häufig hinzu.
- Zusammengehörige Logik soll gebündelt werden: Alles zur Steuer steht in einem Visitor, statt über alle Elementklassen verteilt zu sein.

Typische Beispiele sind Compiler und Werkzeuge, die auf Syntaxbäumen arbeiten (Typprüfung, Optimierung, Codeerzeugung, Formatierung), Exporte in verschiedene Formate, Berechnungen auf Stücklisten oder Dokumentstrukturen sowie statische Codeanalyse.

## Nachteile

Das Muster dreht ein Problem nur um. Neue **Operationen** sind leicht, neue **Elementtypen** dagegen teuer: Kommt eine Postenart wie `Gutschein` hinzu, muss das Visitor-Interface und damit *jeder* Visitor erweitert werden. Dieses Spannungsfeld ist als *Expression Problem* bekannt. Außerdem müssen die Elemente oft mehr von ihrem Inneren preisgeben, als sonst nötig wäre, damit Visitors darauf zugreifen können. Und der Double Dispatch ist für Einsteiger schwer nachzuvollziehen.

In modernem Java lohnt sich der klassische Visitor vor allem noch, wenn die Hierarchie nicht `sealed` sein kann, etwa weil sie aus einer Bibliothek stammt und von Nutzern erweitert wird, oder wenn ein Visitor eigenen Zustand über viele Besuche hinweg sammelt.

## Beispiele aus dem JDK

`java.nio.file.FileVisitor` mit `Files.walkFileTree()` besucht Verzeichnisse und Dateien und ruft je nach Situation `preVisitDirectory()`, `visitFile()` oder `postVisitDirectory()` auf. Die Annotation-Processing-API enthält mit `javax.lang.model.element.ElementVisitor` einen generischen Visitor über Programmelemente. Werkzeuge wie ASM zur Bytecode-Bearbeitung bauen vollständig auf Visitors auf.

## Verwandte Muster

Visitor wird meist auf **Composite**-Strukturen angewendet, etwa auf die Syntaxbäume des **Interpreter**-Musters. Dort zeigt das Beispiel auch schon die Pattern-Matching-Alternative. Ein **Iterator** kann die Struktur durchlaufen, während der Visitor die Operation an jedem Element ausführt. Im Vergleich zum **Strategy**-Muster, das einen Algorithmus für eine Art von Objekt austauscht, liefert ein Visitor einen Algorithmus für eine ganze Familie von Typen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Visitor.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
