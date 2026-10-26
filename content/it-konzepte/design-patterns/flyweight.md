+++
title = "Flyweight"
description = "Viele feingranulare Objekte effizient teilen (intrinsischer vs. extrinsischer Zustand)"
date = 2026-10-26T19:27:00+01:00
nummer = 11
gruppe = "struktur"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 11 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/flyweight.html" titel="Flyweight – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Die ersten sieben Bäume entstehen einzeln, und zwar genau die, die Java mit new Random(42) pflanzt (der Zufallsgenerator ist nachgerechnet). Bei jeder neuen Art legt die Fabrik ein Baumart-Objekt mit Textur an, bei jeder bekannten liefert sie das vorhandene aus dem cache. Die übrigen 99.993 Bäume folgen in einem Schritt. Im Speicher bleibt es bei drei Baumarten, egal wie groß der Wald wird.

*GoF-Strukturmuster · Java 21*

## Zweck

Das Flyweight (Fliegengewicht) ermöglicht es, **sehr viele feingranulare Objekte** effizient zu verwalten, indem es ihren gemeinsamen Zustand teilt. Statt dieselben Daten tausendfach zu speichern, existieren sie nur einmal und werden von allen Objekten referenziert.

## Das Problem

Ein Spiel soll einen Wald mit 100.000 Bäumen darstellen. Jeder Baum hat eine Position, aber auch eine Art mit Namen, Farbe und einer Textur von etwa 50 KB. Speichert jeder Baum seine Textur selbst, belegen allein die Texturen fast 5 GB Arbeitsspeicher, obwohl es nur drei verschiedene Baumarten gibt. 99.997 der Texturen sind also überflüssige Kopien.

## Die Lösung

Der Zustand eines Baums wird in zwei Teile zerlegt:

- Der **intrinsische Zustand** ist für viele Objekte gleich und hängt nicht vom Kontext ab: Name, Farbe und Textur einer Baumart. Er wandert in ein unveränderliches Flyweight-Objekt, das geteilt wird.
- Der **extrinsische Zustand** ist für jedes Objekt individuell: die Position. Er bleibt beim einzelnen Baum oder wird beim Aufruf mitgegeben, wie bei `zeichne(x, y)`.

Eine Fabrik sorgt dafür, dass jede Baumart nur einmal erzeugt wird. Fragt man sie ein zweites Mal nach einer Eiche, liefert sie dasselbe Objekt zurück. Ergebnis: 100.000 kleine Baum-Objekte, aber nur drei Baumarten mit zusammen rund 150 KB Texturen.

## Die Beteiligten

- **Flyweight**: `Baumart` enthält den intrinsischen Zustand und erhält den extrinsischen als Parameter.
- **FlyweightFactory**: `Baumarten` verwaltet die Flyweights und gibt vorhandene zurück, statt neue anzulegen.
- **Client**: `Baum` speichert den extrinsischen Zustand und eine Referenz auf sein Flyweight.

## Java-21-Details

Flyweights müssen **unveränderlich** sein, denn eine Änderung würde alle Objekte betreffen, die sie teilen. Records passen dafür gut. Eine Einschränkung zeigt das Beispiel aber auch: Records schützen nur ihre Referenzen, nicht den Inhalt eines enthaltenen Arrays. Wer `textur()` aufruft, könnte die Bytes verändern. In Produktivcode würde man das Array deshalb verbergen oder nur Kopien herausgeben. Die Fabrik verwendet `ConcurrentHashMap.computeIfAbsent()`. Das erzeugt ein Flyweight nur, wenn es noch fehlt, und ist auch bei parallelem Zugriff sicher.

## Quellcode

Die Datei `Flyweight.java` ist ohne Build-Tool direkt ausführbar: `java Flyweight.java`

```
// Flyweight (GoF, Strukturmuster)
// Teilt gemeinsamen Zustand zwischen vielen feingranularen Objekten, um Speicher zu sparen.
// Start: java Flyweight.java

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

public class Flyweight {

    // --- Flyweight: intrinsischer Zustand, unveränderlich und teilbar ---
    record Baumart(String name, String farbe, byte[] textur) {
        void zeichne(int x, int y) {
            // In einer echten Anwendung: Textur an Position (x, y) rendern
        }
    }

    // --- FlyweightFactory: liefert vorhandene Flyweights statt neue zu erzeugen ---
    static final class Baumarten {
        private static final Map<String, Baumart> cache = new ConcurrentHashMap<>();

        static Baumart hole(String name, String farbe) {
            return cache.computeIfAbsent(name + "|" + farbe, key -> {
                System.out.println("  neue Baumart erzeugt: " + name + " (" + farbe + ")");
                return new Baumart(name, farbe, new byte[50_000]);   // ~50 KB Textur
            });
        }

        static int anzahl() { return cache.size(); }
    }

    // --- Client-Objekt: extrinsischer Zustand (Position) + Referenz auf das Flyweight ---
    record Baum(int x, int y, Baumart art) {
        void zeichne() { art.zeichne(x, y); }
    }

    public static void main(String[] args) {
        String[][] arten = { { "Eiche", "dunkelgrün" }, { "Birke", "hellgrün" }, { "Ahorn", "rot" } };
        Random zufall = new Random(42);
        List<Baum> wald = new ArrayList<>();

        System.out.println("Pflanze 100.000 Bäume ...");
        for (int i = 0; i < 100_000; i++) {
            String[] a = arten[zufall.nextInt(arten.length)];
            wald.add(new Baum(zufall.nextInt(10_000), zufall.nextInt(10_000),
                              Baumarten.hole(a[0], a[1])));
        }
        wald.forEach(Baum::zeichne);

        long mitFlyweight  = (long) Baumarten.anzahl() * 50_000;
        long ohneFlyweight = (long) wald.size() * 50_000;

        System.out.println();
        System.out.printf(Locale.GERMANY, "Bäume:                   %,d%n", wald.size());
        System.out.printf(Locale.GERMANY, "Baumart-Objekte:         %,d%n", Baumarten.anzahl());
        System.out.printf(Locale.GERMANY, "Texturen mit Flyweight:  %,.1f MB%n", mitFlyweight / 1048576.0);
        System.out.printf(Locale.GERMANY, "Texturen ohne Flyweight: %,.1f MB%n", ohneFlyweight / 1048576.0);

        // Identität: dieselbe Art ist wirklich dasselbe Objekt
        Baumart e1 = Baumarten.hole("Eiche", "dunkelgrün");
        Baumart e2 = Baumarten.hole("Eiche", "dunkelgrün");
        System.out.println("\nDieselbe Eiche-Instanz: " + (e1 == e2));

        // Flyweight im JDK: Integer.valueOf cached die Werte -128 bis 127
        System.out.println("Integer.valueOf(100) == Integer.valueOf(100): "
                + (Integer.valueOf(100) == Integer.valueOf(100)));
        System.out.println("Integer.valueOf(1000) == Integer.valueOf(1000): "
                + (Integer.valueOf(1000) == Integer.valueOf(1000)));
    }
}
```

## Ausgabe

```
Pflanze 100.000 Bäume ...
  neue Baumart erzeugt: Ahorn (rot)
  neue Baumart erzeugt: Eiche (dunkelgrün)
  neue Baumart erzeugt: Birke (hellgrün)

Bäume:                   100.000
Baumart-Objekte:         3
Texturen mit Flyweight:  0,1 MB
Texturen ohne Flyweight: 4.768,4 MB

Dieselbe Eiche-Instanz: true
Integer.valueOf(100) == Integer.valueOf(100): true
Integer.valueOf(1000) == Integer.valueOf(1000): false
```

## Wann einsetzen?

Das GoF-Buch nennt Bedingungen, die *alle* zutreffen sollten:

- Die Anwendung verwendet eine sehr große Zahl von Objekten.
- Der Speicherverbrauch ist dadurch tatsächlich ein Problem.
- Der größte Teil des Objektzustands lässt sich auslagern und teilen.
- Nach dem Auslagern lassen sich viele Objektgruppen durch wenige geteilte Objekte ersetzen.
- Die Anwendung ist nicht auf die Identität der einzelnen Objekte angewiesen.

Klassische Einsatzgebiete sind Zeichen in einem Texteditor (jeder Buchstabe teilt sich Schriftart und Glyphe), Partikel und Kacheln in Spielen sowie Symbole in Karten.

## Nachteile

Das Muster tauscht Speicher gegen Komplexität. Die Trennung von intrinsischem und extrinsischem Zustand macht den Code schwerer verständlich, und der extrinsische Zustand muss bei jedem Aufruf mitgereicht oder berechnet werden, was Rechenzeit kostet. Die Fabrik ist zudem ein Cache, der ohne weitere Maßnahmen nie schrumpft. Bei kleinen Objektzahlen lohnt sich das Muster nicht.

## Beispiele aus dem JDK

`Integer.valueOf()` gibt für Werte von -128 bis 127 immer dieselben, vorab erzeugten Objekte zurück. Die Ausgabe zeigt die Folge: Bei 100 liefert `==` `true`, bei 1000 `false`. Deshalb vergleicht man Wrapper-Objekte immer mit `equals()`. Ähnlich arbeiten `Boolean.valueOf()` und der String-Pool, in dem gleiche String-Literale nur einmal existieren.

## Verwandte Muster

Das **Singleton** verwaltet genau eine Instanz, die Flyweight-Fabrik viele geteilte Instanzen, eine pro Schlüssel. Flyweights werden oft mit **Composite** kombiniert, um gemeinsam genutzte Blätter in großen Baumstrukturen zu sparen. Auch **State**- und **Strategy**-Objekte sind häufig zustandslos und lassen sich als Flyweights teilen.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Flyweight.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
