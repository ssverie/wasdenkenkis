+++
title = "Template Method"
description = "Algorithmusgerüst in der Oberklasse, Schritte in Unterklassen"
date = 2026-10-26T20:59:00+01:00
nummer = 22
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 22 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/template-method.html" titel="Template Method – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Beide Importe laufen durch dieselbe final-Methode importiere() der Oberklasse. Im Aufrufstapel sieht man, wie sie für zerlege() und wandle() die Unterklasse aufruft, für pruefe() aber ihren eigenen, für alle gleichen Schritt. Der Hook protokollieren() liefert bei CSV die Zusammenfassung, beim Schlüssel-Wert-Format ist er überschrieben. Kunden, die die Prüfung nicht bestehen, werden verworfen.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Die Template Method (Schablonenmethode) legt das **Gerüst eines Algorithmus** in einer Oberklasse fest und überlässt einzelne Schritte den Unterklassen. Die Unterklassen können diese Schritte anpassen, aber nicht die Reihenfolge oder den Ablauf insgesamt.

## Das Problem

Kundendaten sollen aus verschiedenen Formaten importiert werden, etwa aus CSV oder aus einem einfachen Schlüssel-Wert-Format. Der Ablauf ist immer derselbe: Rohdaten in Datensätze zerlegen, jeden Datensatz in ein Kundenobjekt umwandeln, prüfen, gültige übernehmen, ungültige melden. Nur das Zerlegen und Umwandeln hängt vom Format ab. Schreibt man für jedes Format einen eigenen Importer von Grund auf, wird der gemeinsame Teil kopiert. Ändert sich die Prüfregel, etwa ein neues Mindestalter, muss sie in jeder Kopie angepasst werden, und irgendwann weichen die Kopien voneinander ab.

## Die Lösung

Der gemeinsame Ablauf wandert in eine Methode der abstrakten Oberklasse, die Template Method `importiere()`. Sie ruft die einzelnen Schritte in fester Reihenfolge auf. Schritte, die vom Format abhängen, sind `abstract` und müssen von jeder Unterklasse implementiert werden. Schritte, die für alle gleich sind, wie die Prüfung, stehen direkt in der Oberklasse. Ein neues Format bedeutet nur noch: zwei Methoden schreiben. Der Ablauf und die Prüfung sind garantiert dieselben.

## Die Beteiligten

- **AbstractClass**: `KundenImport` definiert die Template Method und deklariert die primitiven Operationen.
- **ConcreteClass**: `CsvImport` und `KeyValueImport` implementieren die formatspezifischen Schritte.

## Drei Arten von Schritten

- **Abstrakte Operationen** (`zerlege()`, `wandle()`): Unterklassen *müssen* sie implementieren.
- **Konkrete Operationen** (`pruefe()`): in der Oberklasse fest implementiert. Weil sie `private` ist, kann keine Unterklasse sie verändern.
- **Hooks** (`protokollieren()`): haben ein sinnvolles Standardverhalten, das Unterklassen überschreiben *können*, aber nicht müssen. `KeyValueImport` schaltet damit die Zusammenfassung ab.

## Das Hollywood-Prinzip

Template Method ist ein Paradebeispiel für die *Umkehrung der Kontrolle*: „Don't call us, we'll call you.“ Nicht die Unterklasse ruft die Oberklasse auf, sondern die Oberklasse ruft zum passenden Zeitpunkt die Methoden der Unterklasse auf. Genau so funktionieren die meisten Frameworks: Man implementiert vorgegebene Methoden, und das Framework entscheidet, wann sie aufgerufen werden.

## Java-21-Details

Die Template Method ist `final`, damit keine Unterklasse den Ablauf aushebeln kann. Die Schritte sind `protected`, denn sie sind Erweiterungspunkte, aber kein Teil der öffentlichen Schnittstelle. Die Beispieldaten stehen in **Text Blocks** (`"""`), die Datensätze werden mit `String.lines()` zerlegt, und das Schlüssel-Wert-Format nutzt einen `switch` mit Pfeil-Syntax. Der Kunde ist ein `record`.

## Quellcode

Die Datei `TemplateMethod.java` ist ohne Build-Tool direkt ausführbar: `java TemplateMethod.java`

```
// Template Method (GoF, Verhaltensmuster)
// Die Oberklasse legt das Gerüst eines Algorithmus fest,
// Unterklassen füllen einzelne Schritte aus, ohne den Ablauf zu ändern.
// Start: java TemplateMethod.java

import java.util.ArrayList;
import java.util.List;

public class TemplateMethod {

    record Kunde(String name, String ort, int alter) {}

    // --- AbstractClass: enthält die Template Method und die Schritte ---
    static abstract class KundenImport {

        // Die Template Method: final, damit der Ablauf nicht verändert werden kann
        public final List<Kunde> importiere(String rohdaten) {
            System.out.println("== " + getClass().getSimpleName() + " ==");
            List<String> datensaetze = zerlege(rohdaten);                 // abstrakt
            List<Kunde> kunden = new ArrayList<>();
            for (String satz : datensaetze) {
                Kunde k = wandle(satz);                                   // abstrakt
                if (pruefe(k)) {                                          // konkret, gemeinsam
                    kunden.add(k);
                } else {
                    System.out.println("  verworfen: " + k);
                }
            }
            if (protokollieren()) {                                       // Hook
                System.out.println("  " + kunden.size() + " von " + datensaetze.size() + " importiert");
            }
            return kunden;
        }

        // Primitive Operationen: MÜSSEN von Unterklassen implementiert werden
        protected abstract List<String> zerlege(String rohdaten);
        protected abstract Kunde wandle(String satz);

        // Konkreter Schritt: für alle gleich
        private boolean pruefe(Kunde k) {
            return !k.name().isBlank() && k.alter() >= 18;
        }

        // Hook: Standardverhalten, das Unterklassen überschreiben KÖNNEN
        protected boolean protokollieren() { return true; }
    }

    // --- ConcreteClasses: nur die Schritte, die sich unterscheiden ---
    static final class CsvImport extends KundenImport {
        protected List<String> zerlege(String rohdaten) {
            return rohdaten.lines().skip(1).toList();                     // Kopfzeile überspringen
        }
        protected Kunde wandle(String satz) {
            String[] f = satz.split(";");
            return new Kunde(f[0].strip(), f[1].strip(), Integer.parseInt(f[2].strip()));
        }
    }

    static final class KeyValueImport extends KundenImport {
        protected List<String> zerlege(String rohdaten) {
            return List.of(rohdaten.split("\\R---\\R"));                  // Blöcke durch --- getrennt
        }
        protected Kunde wandle(String block) {
            String name = "", ort = "";
            int alter = 0;
            for (String zeile : block.lines().toList()) {
                String[] kv = zeile.split("=", 2);
                switch (kv[0].strip()) {
                    case "name"  -> name = kv[1].strip();
                    case "ort"   -> ort = kv[1].strip();
                    case "alter" -> alter = Integer.parseInt(kv[1].strip());
                    default      -> { }                                   // unbekannte Schlüssel ignorieren
                }
            }
            return new Kunde(name, ort, alter);
        }
        @Override
        protected boolean protokollieren() { return false; }               // Hook überschrieben
    }

    public static void main(String[] args) {
        String csv = """
                name;ort;alter
                Anna Berg;Hamburg;34
                Ben Krause;Köln;17
                Cem Yilmaz;Leipzig;52
                """;

        String keyValue = """
                name = Dora Lenz
                ort = München
                alter = 41
                ---
                name =
                ort = Bremen
                alter = 29
                ---
                name = Emil Roth
                alter = 65
                """;

        List<Kunde> ausCsv = new CsvImport().importiere(csv);
        ausCsv.forEach(k -> System.out.println("  " + k));

        List<Kunde> ausKv = new KeyValueImport().importiere(keyValue);
        ausKv.forEach(k -> System.out.println("  " + k));
    }
}
```

## Ausgabe

```
== CsvImport ==
  verworfen: Kunde[name=Ben Krause, ort=Köln, alter=17]
  2 von 3 importiert
  Kunde[name=Anna Berg, ort=Hamburg, alter=34]
  Kunde[name=Cem Yilmaz, ort=Leipzig, alter=52]
== KeyValueImport ==
  verworfen: Kunde[name=, ort=Bremen, alter=29]
  Kunde[name=Dora Lenz, ort=München, alter=41]
  Kunde[name=Emil Roth, ort=, alter=65]
```

## Wann einsetzen?

- Mehrere Klassen haben einen gemeinsamen Ablauf und unterscheiden sich nur in einzelnen Schritten.
- Doppelter Code soll in eine Oberklasse gezogen werden, ohne die Unterschiede zu verlieren.
- Eine Bibliothek oder ein Framework soll Erweiterungspunkte anbieten, an denen der Ablauf aber nicht verändert werden darf.

Typische Beispiele sind Datenimporte und -exporte, Berichtserstellung (Kopf, Inhalt, Fuß), Spielabläufe (initialisieren, Runden spielen, Gewinner ermitteln) und Testframeworks mit Vorbereitung, Test und Aufräumen.

## Nachteile

Das Muster beruht auf **Vererbung** und bringt deren Einschränkungen mit. In Java kann eine Klasse nur von einer Oberklasse erben. Ober- und Unterklassen sind eng gekoppelt, und Änderungen an der Oberklasse wirken sich auf alle Unterklassen aus. Mit vielen Schritten und Hooks wird außerdem unübersichtlich, welche Methode wann aufgerufen wird. Der Ablauf ist zudem zur Compilezeit festgelegt und lässt sich nicht zur Laufzeit tauschen.

Eine moderne Alternative ist, die variablen Schritte als **Funktionen** zu übergeben, etwa `Function<String, List<String>>` für das Zerlegen. Dann braucht man keine Unterklassen mehr. Das ist allerdings Komposition und damit strenggenommen schon **Strategy**.

## Beispiele aus dem JDK

`java.util.AbstractList` ist eine Template-Method-Klasse: Wer nur `get()` und `size()` implementiert, erhält `iterator()`, `indexOf()`, `contains()` und viele weitere Methoden geschenkt, die auf diesen beiden aufbauen. Ebenso funktionieren `AbstractMap` und `InputStream`: Dort genügt es, das einzelne `read()` zu implementieren, und das Lesen ganzer Blöcke baut darauf auf. In Servlets ruft `HttpServlet.service()` je nach Anfrage `doGet()` oder `doPost()` auf. JUnit ruft Methoden mit `@BeforeEach`, `@Test` und `@AfterEach` in festgelegter Reihenfolge auf.

## Verwandte Muster

**Strategy** löst das gleiche Problem mit Komposition: Template Method variiert *Teile* eines Algorithmus per Vererbung, Strategy tauscht den *ganzen* Algorithmus per Delegation aus. **Factory Method** ist oft ein Spezialfall der Template Method: ein Schritt, der ein Objekt erzeugt. Die **Chain of Responsibility** im entsprechenden Beispiel verwendet intern ebenfalls eine Template Method.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java TemplateMethod.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
