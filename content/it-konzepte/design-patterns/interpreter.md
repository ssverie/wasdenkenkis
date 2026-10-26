+++
title = "Interpreter"
description = "Grammatik einer Sprache als Klassenhierarchie abbilden und auswerten"
date = 2026-10-26T20:09:00+01:00
nummer = 15
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 15 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/interpreter.html" titel="Interpreter – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Zuerst entsteht der Baum für „preis * menge - rabatt“ als fünf Objekte im Speicher. alsText() und interpretiere() laufen danach rekursiv durch alle Knoten, im Aufrufstapel sieht man, wie tief es gerade geht. Bei der ersten Formel aus Text zeigt der Ablauf auch den Parser Schritt für Schritt: Dort entsteht Punkt vor Strich, weil das Produkt zum Teilbaum wird, bevor die Summe es bekommt. Die beiden anderen Formeln folgen in je zwei Schritten.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Das Interpreter-Muster bildet die **Grammatik einer einfachen Sprache** als Klassenhierarchie ab. Jede Regel der Grammatik wird eine Klasse. Ein Satz der Sprache wird als Baum aus diesen Objekten dargestellt, dem *abstrakten Syntaxbaum*, und der Baum kann sich selbst auswerten.

## Das Problem

Eine Anwendung soll Formeln berechnen, die Anwender selbst eingeben oder konfigurieren, etwa `preis * menge - rabatt`. Diese Formeln stehen zur Compilezeit nicht fest, man kann sie also nicht als Java-Code schreiben. Mit Zeichenkettenverarbeitung und `if`-Abfragen wird das schnell unübersichtlich, besonders bei verschachtelten Klammern und Punkt-vor-Strich-Rechnung.

## Die Lösung

Für jedes Element der Sprache gibt es eine Klasse: `Zahl`, `Variable`, `Plus`, `Minus`, `Mal`. Ein Ausdruck wie `preis * menge - rabatt` wird zum Baum: Ein `Minus`-Knoten hat links einen `Mal`-Knoten mit den Variablen `preis` und `menge` und rechts die Variable `rabatt`. Jede Klasse hat eine Methode `interpretiere()`. Blätter liefern ihren Wert direkt, innere Knoten werten zuerst ihre Kinder aus und verknüpfen die Ergebnisse. Ein Aufruf an der Wurzel wertet so rekursiv den ganzen Baum aus.

Die Variablenwerte kommen aus einem **Kontext**, hier einer `Map`. Derselbe Baum lässt sich daher mit verschiedenen Werten auswerten, ohne ihn neu aufzubauen.

## Die Beteiligten

- **AbstractExpression**: `Ausdruck` deklariert die Methode `interpretiere()`.
- **TerminalExpression**: `Zahl` und `Variable` sind Blätter des Baums, sie entsprechen den Grundsymbolen der Grammatik.
- **NonterminalExpression**: `Plus`, `Minus` und `Mal` sind zusammengesetzte Regeln mit Teilausdrücken.
- **Context**: die `Map` mit den Variablenbelegungen, also globale Informationen für die Auswertung.
- **Client**: baut den Syntaxbaum auf, von Hand oder über einen Parser, und stößt die Auswertung an.

## Und der Parser?

Wichtig: Das Interpreter-Muster beschreibt nur, wie ein *bereits vorhandener* Syntaxbaum dargestellt und ausgewertet wird. Wie aus Text ein Baum wird, gehört nicht zum Muster. Das Beispiel enthält trotzdem einen kleinen Parser nach dem Verfahren des *rekursiven Abstiegs*, damit man echte Formeln eingeben kann. Er bildet jede Grammatikregel auf eine Methode ab und sorgt dabei auch für Punkt vor Strich: Bei `2 + 3 * 4` entsteht der Baum `(2 + (3 * 4))`, das Ergebnis ist 14 und nicht 20.

## Java-21-Details

Hier zeigt Java 21 seine Stärken. Die Knoten sind `record`s, kompakt und unveränderlich, und ihr automatisches `toString()` zeigt die Baumstruktur direkt an. Das Interface `Ausdruck` ist `sealed`: Die Grammatik steht fest, und der Compiler kennt alle Knotenarten. Dadurch kann `alsText()` als zweite Operation mit **Record Patterns** im `switch` geschrieben werden, etwa `case Plus(Ausdruck l, Ausdruck r)`, das den Knoten prüft und gleich zerlegt. Kommt eine neue Knotenart hinzu, etwa `Geteilt`, meldet der Compiler jede Stelle, die angepasst werden muss.

Damit zeigt das Beispiel beide Wege, Operationen auf dem Baum unterzubringen: `interpretiere()` klassisch als Methode in jeder Klasse, `alsText()` modern als eine einzige Funktion mit Pattern Matching. Letzteres löst die gleiche Aufgabe wie das Visitor-Muster, nur mit weniger Code.

## Quellcode

Die Datei `Interpreter.java` ist ohne Build-Tool direkt ausführbar: `java Interpreter.java`

```
// Interpreter (GoF, Verhaltensmuster)
// Stellt die Grammatik einer einfachen Sprache als Klassenhierarchie dar
// und wertet Sätze dieser Sprache als Baum von Objekten aus.
// Start: java Interpreter.java

import java.util.Map;

public class Interpreter {

    // --- Grammatik ---
    //   Ausdruck := Zahl | Variable | Ausdruck ('+' | '-' | '*') Ausdruck | '(' Ausdruck ')'

    // --- AbstractExpression ---
    sealed interface Ausdruck permits Zahl, Variable, Plus, Minus, Mal {
        int interpretiere(Map<String, Integer> kontext);
    }

    // --- TerminalExpressions: Blätter des Syntaxbaums ---
    record Zahl(int wert) implements Ausdruck {
        public int interpretiere(Map<String, Integer> kontext) { return wert; }
    }

    record Variable(String name) implements Ausdruck {
        public int interpretiere(Map<String, Integer> kontext) {
            Integer wert = kontext.get(name);
            if (wert == null) throw new IllegalArgumentException("Variable nicht belegt: " + name);
            return wert;
        }
    }

    // --- NonterminalExpressions: innere Knoten, werten ihre Kinder rekursiv aus ---
    record Plus(Ausdruck links, Ausdruck rechts) implements Ausdruck {
        public int interpretiere(Map<String, Integer> k) { return links.interpretiere(k) + rechts.interpretiere(k); }
    }

    record Minus(Ausdruck links, Ausdruck rechts) implements Ausdruck {
        public int interpretiere(Map<String, Integer> k) { return links.interpretiere(k) - rechts.interpretiere(k); }
    }

    record Mal(Ausdruck links, Ausdruck rechts) implements Ausdruck {
        public int interpretiere(Map<String, Integer> k) { return links.interpretiere(k) * rechts.interpretiere(k); }
    }

    // --- Zweite Operation per Pattern Matching: den Baum vollständig geklammert ausgeben ---
    static String alsText(Ausdruck a) {
        return switch (a) {
            case Zahl(int w)                -> String.valueOf(w);
            case Variable(String n)         -> n;
            case Plus(Ausdruck l, Ausdruck r)  -> "(" + alsText(l) + " + " + alsText(r) + ")";
            case Minus(Ausdruck l, Ausdruck r) -> "(" + alsText(l) + " - " + alsText(r) + ")";
            case Mal(Ausdruck l, Ausdruck r)   -> "(" + alsText(l) + " * " + alsText(r) + ")";
        };
    }

    // --- Kleiner Parser (nicht Teil des Musters): baut aus Text den Syntaxbaum ---
    static final class Parser {
        private final String s;
        private int pos;

        Parser(String text) { this.s = text.replace(" ", ""); }

        Ausdruck parse() {
            Ausdruck a = summe();
            if (pos < s.length()) throw new IllegalArgumentException("Unerwartet: " + s.charAt(pos));
            return a;
        }

        // summe := produkt (('+' | '-') produkt)*
        private Ausdruck summe() {
            Ausdruck a = produkt();
            while (pos < s.length() && (s.charAt(pos) == '+' || s.charAt(pos) == '-')) {
                char op = s.charAt(pos++);
                a = op == '+' ? new Plus(a, produkt()) : new Minus(a, produkt());
            }
            return a;
        }

        // produkt := faktor ('*' faktor)*
        private Ausdruck produkt() {
            Ausdruck a = faktor();
            while (pos < s.length() && s.charAt(pos) == '*') {
                pos++;
                a = new Mal(a, faktor());
            }
            return a;
        }

        // faktor := Zahl | Variable | '(' summe ')'
        private Ausdruck faktor() {
            char c = s.charAt(pos);
            if (c == '(') {
                pos++;
                Ausdruck a = summe();
                pos++;                                   // ')'
                return a;
            }
            int start = pos;
            if (Character.isDigit(c)) {
                while (pos < s.length() && Character.isDigit(s.charAt(pos))) pos++;
                return new Zahl(Integer.parseInt(s.substring(start, pos)));
            }
            while (pos < s.length() && Character.isLetter(s.charAt(pos))) pos++;
            return new Variable(s.substring(start, pos));
        }
    }

    public static void main(String[] args) {
        // 1. Syntaxbaum von Hand bauen:  preis * menge - rabatt
        Ausdruck rechnung = new Minus(
                new Mal(new Variable("preis"), new Variable("menge")),
                new Variable("rabatt"));

        Map<String, Integer> kontext = Map.of("preis", 12, "menge", 5, "rabatt", 7);
        System.out.println("Baum:     " + rechnung);
        System.out.println("Als Text: " + alsText(rechnung));
        System.out.println("Ergebnis: " + rechnung.interpretiere(kontext));

        // 2. Derselbe Baum, anderer Kontext
        System.out.println("Mit menge=10: "
                + rechnung.interpretiere(Map.of("preis", 12, "menge", 10, "rabatt", 7)));

        // 3. Aus Text parsen und auswerten
        System.out.println();
        Map<String, Integer> werte = Map.of("x", 4, "y", 6);
        for (String formel : new String[] { "2 + 3 * 4", "(2 + 3) * 4", "x * (y - 1) + 10" }) {
            Ausdruck a = new Parser(formel).parse();
            System.out.printf("%-18s = %3d   Baum: %s%n", formel, a.interpretiere(werte), alsText(a));
        }
    }
}
```

## Ausgabe

```
Baum:     Minus[links=Mal[links=Variable[name=preis], rechts=Variable[name=menge]], rechts=Variable[name=rabatt]]
Als Text: ((preis * menge) - rabatt)
Ergebnis: 53
Mit menge=10: 113

2 + 3 * 4          =  14   Baum: (2 + (3 * 4))
(2 + 3) * 4        =  20   Baum: ((2 + 3) * 4)
x * (y - 1) + 10   =  30   Baum: ((x * (y - 1)) + 10)
```

## Wann einsetzen?

- Es gibt eine einfache Sprache, deren Sätze als Bäume dargestellt werden können.
- Die Grammatik ist klein und ändert sich selten.
- Effizienz ist nicht das wichtigste Kriterium.

Typische Beispiele sind Rechenformeln in Tabellenkalkulationen oder Konfigurationen, Regel- und Filtersprachen (`alter > 18 UND land = "DE"`), einfache Abfragesprachen, Berechtigungsregeln und Domänensprachen (DSLs) für Fachanwender.

## Nachteile

Für jede Grammatikregel entsteht mindestens eine Klasse. Bei umfangreichen Sprachen wird die Hierarchie groß und schwer zu warten. Dann sind Parser-Generatoren wie ANTLR die bessere Wahl. Die rekursive Auswertung über viele kleine Objekte ist zudem langsamer als kompilierter Code. Für zeitkritische Anwendungen übersetzt man den Baum daher besser in eine effizientere Form, statt ihn bei jedem Aufruf neu zu durchlaufen.

## Beispiele aus dem JDK

`java.util.regex.Pattern` übersetzt einen regulären Ausdruck intern in einen Baum aus Knotenobjekten, die sich gegen den Eingabetext auswerten. Die Expression Language in Jakarta EE (`#{bestellung.summe}`) und SpEL in Spring sind ebenfalls Interpreter nach diesem Muster.

## Verwandte Muster

Der Syntaxbaum ist ein **Composite**: Terminale sind Blätter, Nichtterminale sind Container. **Visitor** kann weitere Operationen auf dem Baum bündeln, wie Ausgeben, Optimieren oder Typprüfen, ohne die Knotenklassen zu ändern. In Java 21 übernimmt das oft Pattern Matching. **Flyweight** hilft, gleiche Terminalsymbole zu teilen, etwa dieselbe Zahl, die oft vorkommt. **Iterator** kann den Baum durchlaufen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Interpreter.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
