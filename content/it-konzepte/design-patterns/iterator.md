+++
title = "Iterator"
description = "Sequenzieller Zugriff auf Elemente ohne Offenlegung der Struktur"
date = 2026-10-26T20:14:00+01:00
nummer = 16
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 16 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/iterator.html" titel="Iterator – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Im Speicher sieht man das Array der Playlist wachsen (von 2 auf 4 Plätze). Jede Schleife holt sich einen eigenen Iterator mit eigenem index: vorwärts, rückwärts und gefiltert, der Nicht-Favoriten überspringt. Zwei Iteratoren können gleichzeitig an verschiedenen Stellen stehen. Der Countdown hat gar keine Sammlung, seine Zahlen entstehen erst, wenn next() sie liefert.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Ein Iterator ermöglicht den **sequenziellen Zugriff** auf die Elemente einer Sammlung, ohne deren innere Struktur offenzulegen. Ob die Daten in einem Array, einer verketteten Liste, einem Baum oder gar nicht gespeichert sind, spielt für den Benutzer keine Rolle. Er fragt nur: „Gibt es ein nächstes Element?“ und „Gib es mir.“

## Das Problem

Eine Playlist speichert ihre Songs intern in einem Array, das bei Bedarf wächst. Will man die Songs durchlaufen, müsste man ohne Iterator das Array und den Zähler nach außen geben. Dann hängt jeder Aufrufer von dieser internen Darstellung ab, und ein Wechsel zu einer anderen Datenstruktur bricht den gesamten Code. Außerdem soll man die Playlist auf verschiedene Arten durchlaufen können: vorwärts, rückwärts, nur Favoriten. Jede dieser Varianten als Methode in die Playlist zu schreiben, die direkt die Elemente verarbeitet, vermischt das Speichern mit dem Durchlaufen.

## Die Lösung

Das Durchlaufen wird in ein eigenes Objekt ausgelagert, den Iterator. Er kennt die interne Struktur und merkt sich, wo er gerade steht. Nach außen bietet er nur `hasNext()` und `next()`. Die Sammlung erzeugt auf Anfrage einen neuen Iterator. Weil jeder Iterator seinen eigenen Zustand hat, können mehrere gleichzeitig dieselbe Sammlung durchlaufen, ohne sich gegenseitig zu stören. Die Ausgabe zeigt es: Iterator `a` steht beim dritten Song, `b` noch beim ersten.

## Die Beteiligten

- **Iterator**: `java.util.Iterator` definiert die Schnittstelle zum Durchlaufen.
- **ConcreteIterator**: die anonymen Klassen in `iterator()`, `rueckwaerts()` und `gefiltert()`. Sie merken sich die aktuelle Position.
- **Aggregate**: `java.lang.Iterable` definiert die Methode, die einen Iterator liefert.
- **ConcreteAggregate**: `Playlist` erzeugt passende Iteratoren für ihre interne Struktur.

## Java-21-Details

Das Muster ist fest in die Sprache eingebaut. Wer `Iterable` implementiert, kann seine Klasse in einer **for-each-Schleife** verwenden. Der Compiler übersetzt `for (Song s : liste)` in Aufrufe von `iterator()`, `hasNext()` und `next()`. Da `Iterable` nur eine abstrakte Methode hat, ist es ein funktionales Interface. Deshalb liefern `rueckwaerts()` und `gefiltert()` ein Lambda zurück, das bei jedem Aufruf einen frischen Iterator erzeugt. Über `spliterator()`, das `Iterable` bereits mitbringt, lässt sich die Playlist sogar in einen `Stream` verwandeln.

Der `Countdown` zeigt, dass ein Iterator keine gespeicherte Sammlung braucht. Er berechnet jeden Wert erst beim Abruf. So lassen sich auch sehr große oder unendliche Folgen durchlaufen, ohne sie im Speicher zu halten.

Ein Detail am Rande: Weil die Beispielklasse selbst `Iterator` heißt, muss das JDK-Interface im Code voll qualifiziert als `java.util.Iterator` geschrieben werden.

## Quellcode

Die Datei `Iterator.java` ist ohne Build-Tool direkt ausführbar: `java Iterator.java`

```
// Iterator (GoF, Verhaltensmuster)
// Ermöglicht den sequenziellen Zugriff auf die Elemente einer Sammlung,
// ohne deren innere Struktur offenzulegen.
// Start: java Iterator.java

import java.util.Arrays;
import java.util.NoSuchElementException;
import java.util.function.Predicate;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class Iterator {

    record Song(String titel, int sekunden, boolean favorit) {}

    // --- Aggregate: eigene Sammlung mit verborgener interner Struktur (Array) ---
    static final class Playlist implements Iterable<Song> {
        private Song[] songs = new Song[2];
        private int anzahl = 0;

        void hinzufuegen(Song s) {
            if (anzahl == songs.length) songs = Arrays.copyOf(songs, anzahl * 2);
            songs[anzahl++] = s;
        }

        // --- Standard-Iterator: macht die Playlist for-each-fähig ---
        @Override
        public java.util.Iterator<Song> iterator() {
            return new java.util.Iterator<>() {
                private int index = 0;                       // eigener Zustand pro Iterator

                public boolean hasNext() { return index < anzahl; }
                public Song next() {
                    if (!hasNext()) throw new NoSuchElementException();
                    return songs[index++];
                }
            };
        }

        // --- Weitere Iteratoren: andere Reihenfolge, gefiltert ---
        Iterable<Song> rueckwaerts() {
            return () -> new java.util.Iterator<>() {
                private int index = anzahl - 1;
                public boolean hasNext() { return index >= 0; }
                public Song next() {
                    if (!hasNext()) throw new NoSuchElementException();
                    return songs[index--];
                }
            };
        }

        Iterable<Song> gefiltert(Predicate<Song> bedingung) {
            return () -> new java.util.Iterator<>() {
                private int index = sucheAb(0);

                private int sucheAb(int i) {
                    while (i < anzahl && !bedingung.test(songs[i])) i++;
                    return i;
                }
                public boolean hasNext() { return index < anzahl; }
                public Song next() {
                    if (!hasNext()) throw new NoSuchElementException();
                    Song s = songs[index];
                    index = sucheAb(index + 1);
                    return s;
                }
            };
        }

        Stream<Song> stream() {
            return StreamSupport.stream(spliterator(), false);
        }
    }

    // --- Iterator ohne Sammlung: Werte werden erst beim Abruf berechnet ---
    record Countdown(int start) implements Iterable<Integer> {
        public java.util.Iterator<Integer> iterator() {
            return new java.util.Iterator<>() {
                private int aktuell = start;
                public boolean hasNext() { return aktuell >= 0; }
                public Integer next() {
                    if (!hasNext()) throw new NoSuchElementException();
                    return aktuell--;
                }
            };
        }
    }

    static String dauer(int sek) { return "%d:%02d".formatted(sek / 60, sek % 60); }

    public static void main(String[] args) {
        Playlist liste = new Playlist();
        liste.hinzufuegen(new Song("Morgenrot", 214, true));
        liste.hinzufuegen(new Song("Stadtlichter", 187, false));
        liste.hinzufuegen(new Song("Nordwind", 251, true));
        liste.hinzufuegen(new Song("Kaffeepause", 163, false));

        System.out.println("Vorwärts (for-each):");
        for (Song s : liste) System.out.println("  " + s.titel() + " " + dauer(s.sekunden()));

        System.out.println("Rückwärts:");
        for (Song s : liste.rueckwaerts()) System.out.println("  " + s.titel());

        System.out.println("Nur Favoriten:");
        for (Song s : liste.gefiltert(Song::favorit)) System.out.println("  " + s.titel());

        // Zwei Iteratoren gleichzeitig, unabhängig voneinander
        System.out.println("Zwei Iteratoren parallel:");
        var a = liste.iterator();
        var b = liste.iterator();
        a.next(); a.next();
        System.out.println("  a steht bei: " + a.next().titel() + ", b steht bei: " + b.next().titel());

        // Interne Iteration: die Sammlung steuert die Schleife
        int gesamt = liste.stream().mapToInt(Song::sekunden).sum();
        System.out.println("Gesamtdauer per Stream: " + dauer(gesamt));

        System.out.print("Countdown: ");
        for (int i : new Countdown(5)) System.out.print(i + " ");
        System.out.println();
    }
}
```

## Ausgabe

```
Vorwärts (for-each):
  Morgenrot 3:34
  Stadtlichter 3:07
  Nordwind 4:11
  Kaffeepause 2:43
Rückwärts:
  Kaffeepause
  Nordwind
  Stadtlichter
  Morgenrot
Nur Favoriten:
  Morgenrot
  Nordwind
Zwei Iteratoren parallel:
  a steht bei: Nordwind, b steht bei: Morgenrot
Gesamtdauer per Stream: 13:35
Countdown: 5 4 3 2 1 0
```

## Externe und interne Iteration

Das GoF-Buch unterscheidet zwei Formen. Bei der **externen Iteration** steuert der Client die Schleife selbst und holt sich jedes Element mit `next()`. So arbeitet die for-each-Schleife. Bei der **internen Iteration** übergibt der Client nur, *was* mit jedem Element geschehen soll, und die Sammlung erledigt das Durchlaufen selbst. Das sind `forEach()` und Streams, im Beispiel die Berechnung der Gesamtdauer. Interne Iteration ist kürzer und lässt sich parallelisieren. Externe Iteration erlaubt mehr Kontrolle, etwa vorzeitigen Abbruch oder das Durchlaufen zweier Sammlungen im Gleichschritt.

## Wann einsetzen?

- Die Elemente einer Sammlung sollen zugänglich sein, ohne ihre interne Darstellung preiszugeben.
- Eine Sammlung soll auf mehrere Arten durchlaufen werden können.
- Unterschiedliche Datenstrukturen sollen einheitlich durchlaufen werden.
- Werte sollen erst bei Bedarf erzeugt werden, etwa Zeilen aus einer großen Datei, Ergebnisse einer Datenbankabfrage oder berechnete Folgen.

## Nachteile

Für einfache Sammlungen ist ein eigener Iterator Mehraufwand. Wird die Sammlung verändert, während ein Iterator sie durchläuft, ist das Ergebnis unklar. Die Collections des JDK sind deshalb *fail-fast* und werfen eine `ConcurrentModificationException`. Der eigene Iterator im Beispiel prüft das nicht. Ein Iterator kann außerdem nur vorwärts gehen und lässt sich nicht zurücksetzen. Wer erneut durchlaufen will, braucht einen neuen.

## Beispiele aus dem JDK

Alle Collections implementieren `Iterable`. `ListIterator` erweitert das Muster um Rückwärtslaufen und Einfügen. `Scanner` ist ein Iterator über Eingabe-Tokens, `BufferedReader.lines()` liefert einen verzögerten Stream über die Zeilen einer Datei, und `DirectoryStream` durchläuft Verzeichniseinträge.

## Verwandte Muster

Iteratoren werden oft auf **Composite**-Strukturen angewendet, um Bäume zu durchlaufen. Die Sammlung erzeugt ihren Iterator über eine **Factory Method**, nämlich `iterator()`: Jede Sammlung liefert den Iterator, der zu ihrer Struktur passt. Ein **Memento** kann den Zustand eines Iterators festhalten, um später an derselben Stelle weiterzumachen. **Visitor** wird häufig zusammen mit einem Iterator verwendet: Der Iterator liefert die Elemente, der Visitor führt die Operation darauf aus.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Iterator.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
