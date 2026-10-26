+++
title = "Strategy"
description = "Austauschbare Algorithmen hinter gemeinsamer Schnittstelle"
date = 2026-10-26T20:56:00+01:00
nummer = 21
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 21 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/strategy.html" titel="Strategy – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Derselbe Warenkorb bekommt nacheinander fünf Versandarten: eine Klasse, zwei Lambdas und zwei records mit Parametern. Im Speicher sieht man, wie das Feld versand jedes Mal auf ein anderes Objekt zeigt. Im Aufrufstapel sieht man, dass der Warenkorb nur kostenCent() fragt. „Gratis ab 100 €“ reicht die Frage an Express weiter. Zum Schluss sortiert sorted() dieselbe Liste mit drei Comparator-Strategien.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Das Strategy-Muster definiert eine **Familie von Algorithmen**, kapselt jeden einzeln und macht sie **austauschbar**. Der Algorithmus kann sich damit unabhängig vom Code ändern, der ihn verwendet, und zur Laufzeit gewechselt werden.

## Das Problem

Ein Online-Shop berechnet Versandkosten. Es gibt Standardversand nach Gewicht, Express mit Aufpreis pro Artikel, kostenlose Abholung und Aktionen wie „versandkostenfrei ab 50 €“. Steht die ganze Berechnung im Warenkorb als großer `switch` über die Versandart, muss der Warenkorb bei jeder neuen Aktion geändert werden. Er wächst mit Logik, die mit seiner eigentlichen Aufgabe, Artikel zu verwalten und zu summieren, nichts zu tun hat. Die einzelnen Berechnungen lassen sich so auch kaum getrennt testen.

## Die Lösung

Jede Berechnungsart wird eine eigene Strategie hinter der gemeinsamen Schnittstelle `Versandart`. Der Warenkorb hält eine Referenz auf die gerade gewählte Strategie und ruft sie auf, wenn er die Versandkosten braucht. Welche Strategie das ist, weiß er nicht. Eine neue Aktion ist eine neue Strategie, und der Warenkorb bleibt unverändert. Die Ausgabe zeigt, wie derselbe Warenkorb mit fünf verschiedenen Versandarten fünf Ergebnisse liefert.

## Die Beteiligten

- **Strategy**: `Versandart` deklariert die gemeinsame Schnittstelle aller Algorithmen.
- **ConcreteStrategy**: `Standardversand`, `GratisAb`, `EXPRESS` und `ABHOLUNG` implementieren jeweils einen Algorithmus.
- **Context**: `Warenkorb` wird mit einer Strategie konfiguriert und verwendet sie über die Schnittstelle.

## Java-21-Details

Strategy ist das Muster, das sich durch Lambdas am stärksten verändert hat. Weil `Versandart` ein **funktionales Interface** ist, kann eine Strategie auf drei Arten entstehen, die alle im Beispiel vorkommen:

- als **Klasse**, wenn die Logik umfangreicher ist: `Standardversand`,
- als **Record mit Parametern**, wenn die Strategie konfigurierbar sein soll: `GratisAb` mit Schwelle und Ersatzstrategie,
- als **Lambda**, wenn sie in eine Zeile passt: `EXPRESS` und `ABHOLUNG`.

`GratisAb` zeigt außerdem, dass Strategien sich kombinieren lassen: Sie entscheidet nur über die Schwelle und gibt unterhalb an eine andere Strategie weiter. „Gratis ab 100 €“ fällt deshalb für diesen Warenkorb auf Express zurück.

## Quellcode

Die Datei `Strategy.java` ist ohne Build-Tool direkt ausführbar: `java Strategy.java`

```
// Strategy (GoF, Verhaltensmuster)
// Definiert eine Familie austauschbarer Algorithmen hinter einer gemeinsamen Schnittstelle.
// Start: java Strategy.java

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public class Strategy {

    record Artikel(String name, int preisCent, int gewichtGramm) {}

    // --- Strategy: funktionales Interface ---
    @FunctionalInterface
    interface Versandart {
        int kostenCent(List<Artikel> artikel);
    }

    // --- Konkrete Strategien: als Klasse, als Record mit Parametern, als Lambda ---
    static final class Standardversand implements Versandart {
        public int kostenCent(List<Artikel> artikel) {
            int gewicht = artikel.stream().mapToInt(Artikel::gewichtGramm).sum();
            return gewicht <= 2_000 ? 490 : 690;
        }
    }

    record GratisAb(int schwelleCent, Versandart sonst) implements Versandart {
        public int kostenCent(List<Artikel> artikel) {
            int summe = artikel.stream().mapToInt(Artikel::preisCent).sum();
            return summe >= schwelleCent ? 0 : sonst.kostenCent(artikel);
        }
    }

    static final Versandart EXPRESS = artikel -> 990 + 150 * artikel.size();
    static final Versandart ABHOLUNG = artikel -> 0;

    // --- Context: arbeitet nur mit der Schnittstelle ---
    static final class Warenkorb {
        private final List<Artikel> artikel = new ArrayList<>();
        private Versandart versand = new Standardversand();

        void legeHinein(Artikel a)       { artikel.add(a); }
        void setVersand(Versandart v)    { versand = v; }

        int summeCent() {
            return artikel.stream().mapToInt(Artikel::preisCent).sum() + versand.kostenCent(artikel);
        }
        int versandCent() { return versand.kostenCent(artikel); }
    }

    static String euro(int cent) { return String.format(Locale.GERMANY, "%6.2f €", cent / 100.0); }

    public static void main(String[] args) {
        Warenkorb korb = new Warenkorb();
        korb.legeHinein(new Artikel("Buch", 2_490, 600));
        korb.legeHinein(new Artikel("Lampe", 3_990, 1_800));

        // Strategie zur Laufzeit wechseln, der Warenkorb bleibt unverändert
        Map<String, Versandart> optionen = new LinkedHashMap<>();
        optionen.put("Standard", new Standardversand());
        optionen.put("Express", EXPRESS);
        optionen.put("Abholung", ABHOLUNG);
        optionen.put("Gratis ab 50 €", new GratisAb(5_000, new Standardversand()));
        optionen.put("Gratis ab 100 €", new GratisAb(10_000, EXPRESS));

        System.out.println("Warenkorb: Buch, Lampe");
        optionen.forEach((name, art) -> {
            korb.setVersand(art);
            System.out.printf("  %-16s Versand %s   Gesamt %s%n", name, euro(korb.versandCent()), euro(korb.summeCent()));
        });

        // Strategy im JDK: Comparator bestimmt die Sortierreihenfolge
        List<Artikel> liste = new ArrayList<>(List.of(
                new Artikel("Lampe", 3_990, 1_800),
                new Artikel("Buch", 2_490, 600),
                new Artikel("Tasse", 890, 350)));

        System.out.println("\nSortiert nach Name:    " + namen(liste, Comparator.comparing(Artikel::name)));
        System.out.println("Sortiert nach Preis:   " + namen(liste, Comparator.comparingInt(Artikel::preisCent)));
        System.out.println("Schwerste zuerst:      " + namen(liste,
                Comparator.comparingInt(Artikel::gewichtGramm).reversed()));
    }

    static List<String> namen(List<Artikel> liste, Comparator<Artikel> strategie) {
        return liste.stream().sorted(strategie).map(Artikel::name).toList();
    }
}
```

## Ausgabe

```
Warenkorb: Buch, Lampe
  Standard         Versand   6,90 €   Gesamt  71,70 €
  Express          Versand  12,90 €   Gesamt  77,70 €
  Abholung         Versand   0,00 €   Gesamt  64,80 €
  Gratis ab 50 €   Versand   0,00 €   Gesamt  64,80 €
  Gratis ab 100 €  Versand  12,90 €   Gesamt  77,70 €

Sortiert nach Name:    [Buch, Lampe, Tasse]
Sortiert nach Preis:   [Tasse, Buch, Lampe]
Schwerste zuerst:      [Lampe, Buch, Tasse]
```

## Strategy im JDK: Comparator

Das bekannteste Beispiel steckt in jedem Java-Programm: `Comparator` ist eine Strategie für das Vergleichen. `sort()` und `sorted()` wissen nur, wie man sortiert, nicht wonach. Das legt der übergebene Comparator fest. Der zweite Teil des Beispiels sortiert dieselbe Liste mit drei Strategien: nach Name, nach Preis und absteigend nach Gewicht. Methoden wie `Comparator.comparing()` und `reversed()` sind kleine Fabriken, die neue Strategien aus vorhandenen bauen.

## Wann einsetzen?

- Es gibt mehrere Varianten eines Algorithmus, und welche verwendet wird, soll konfigurierbar oder zur Laufzeit wählbar sein.
- Eine Klasse enthält große Verzweigungen, die zwischen verschiedenen Verhaltensweisen umschalten.
- Algorithmen sollen getrennt entwickelt, getestet und wiederverwendet werden.
- Implementierungsdetails eines Algorithmus, etwa eigene Datenstrukturen, sollen vor dem Aufrufer verborgen bleiben.

Typische Beispiele sind Preis- und Rabattberechnungen, Sortier- und Vergleichsregeln, Komprimierungs- oder Verschlüsselungsverfahren, Validierungsregeln, Routenplanung (schnellste, kürzeste, ohne Maut) und Exportformate.

## Nachteile

Der Client muss die Strategien kennen, um die passende auszuwählen. Die Auswahl verschwindet also nicht, sie wandert nur an eine andere Stelle, oft in eine Konfiguration oder Fabrik. Alle Strategien teilen dieselbe Schnittstelle, auch wenn manche nicht alle übergebenen Daten brauchen: `ABHOLUNG` ignoriert die Artikelliste vollständig. Bei nur zwei festen Varianten, die sich nie ändern, ist ein einfaches `if` ehrlicher als ein Muster.

## Verwandte Muster

**State** hat dieselbe Struktur, aber Zustände wechseln sich gegenseitig ab, während eine Strategie in der Regel von außen gewählt wird und die Strategien einander nicht kennen. **Template Method** löst ein ähnliches Problem mit Vererbung: Die Oberklasse gibt den Ablauf vor, Unterklassen füllen einzelne Schritte aus. Strategy nutzt Komposition und tauscht den ganzen Algorithmus aus. **Bridge** sieht ebenfalls ähnlich aus, trennt aber zwei ganze Hierarchien. **Decorator** ändert die Hülle eines Objekts, Strategy sein Inneres. Zustandslose Strategien wie `EXPRESS` lassen sich als **Flyweight** teilen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Strategy.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
