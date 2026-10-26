+++
title = "Chain of Responsibility"
description = "Anfrage entlang einer Kette von Handlern weiterreichen"
date = 2026-10-26T19:45:00+01:00
nummer = 13
gruppe = "verhalten"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 13 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/chain-of-responsibility.html" titel="Chain of Responsibility – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Die Kette entsteht von hinten nach vorn, main kennt danach nur ihren Anfang. Jeder Antrag wandert so weit, bis ein Glied zuständig ist: Im Aufrufstapel liegt pro Glied ein bearbeite(), beim Server sind es drei übereinander. Das Ergebnis läuft denselben Weg zurück. In der funktionalen Variante sieht man, dass der Stream nach dem ersten Treffer aufhört und die übrigen Lambdas gar nicht erst aufruft.

*GoF-Verhaltensmuster · Java 21*

## Zweck

Die Chain of Responsibility (Zuständigkeitskette) reicht eine Anfrage entlang einer **Kette von Handlern** weiter, bis einer von ihnen sie bearbeitet. Der Absender muss nicht wissen, wer am Ende zuständig ist. Er gibt die Anfrage nur an das erste Glied der Kette.

## Das Problem

In einer Firma müssen Ausgaben genehmigt werden. Bis 500 € entscheidet der Teamleiter, bis 5.000 € die Abteilungsleitung, bis 50.000 € die Geschäftsführung, alles darüber wird abgelehnt. Kennt jeder Programmteil, der einen Antrag stellt, diese Regeln selbst, entsteht überall dieselbe `if`-Kaskade. Ändert sich die Hierarchie, kommt etwa eine Bereichsleitung hinzu, muss jede dieser Stellen angepasst werden.

## Die Lösung

Jede Hierarchiestufe wird ein eigenes Handler-Objekt, das nur seine eigene Regel kennt und eine Referenz auf seinen Nachfolger hält. Ein Handler prüft, ob er zuständig ist. Wenn ja, bearbeitet er die Anfrage. Wenn nein, reicht er sie weiter. Der Client übergibt den Antrag nur dem ersten Glied. Wie lang die Kette ist und in welcher Reihenfolge die Glieder stehen, wird an einer einzigen Stelle festgelegt und lässt sich ändern, ohne einen Handler anzufassen.

## Die Beteiligten

- **Handler**: `Genehmiger` definiert die Schnittstelle zum Bearbeiten und hält die Referenz auf den Nachfolger.
- **ConcreteHandler**: `Teamleiter`, `Abteilungsleiter` und `Geschaeftsfuehrer` bearbeiten die Anfragen, für die sie zuständig sind.
- **Client**: `main()` baut die Kette auf und schickt die Anträge an ihren Anfang.

Die Logik „selbst bearbeiten oder weiterreichen“ steckt in der `final`-Methode `bearbeite()` der Oberklasse. Die Unterklassen müssen nur noch `zustaendig()` beantworten. Das ist eine Kombination mit dem Muster **Template Method**.

## Java-21-Details

Die Kette wird von hinten nach vorn über die Konstruktoren aufgebaut, die Nachfolger-Referenz ist `final`. Damit ist sie nach dem Aufbau unveränderlich, anders als bei der klassischen Variante mit einem Setter `setNext()`. Der Antrag ist ein `record`.

Am Ende zeigt das Beispiel eine **funktionale Variante**: Die Kette ist eine Liste von Funktionen, die jeweils ein `Optional` liefern, gefüllt bei Zuständigkeit, leer sonst. Ein Stream ruft sie der Reihe nach auf, und `findFirst()` nimmt das erste Ergebnis. Weil Streams verzögert ausgewertet werden, laufen die späteren Funktionen gar nicht erst, wenn schon eine frühere zuständig war.

## Quellcode

Die Datei `ChainOfResponsibility.java` ist ohne Build-Tool direkt ausführbar: `java ChainOfResponsibility.java`

```
// Chain of Responsibility (GoF, Verhaltensmuster)
// Eine Anfrage wird entlang einer Kette von Handlern weitergereicht, bis einer sie bearbeitet.
// Start: java ChainOfResponsibility.java

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.function.Function;

public class ChainOfResponsibility {

    // --- Anfrage ---
    record Antrag(String mitarbeiter, String zweck, int betragEuro) {}

    // --- Handler: kennt seinen Nachfolger ---
    static abstract class Genehmiger {
        private final Genehmiger nachfolger;      // null = Ende der Kette

        protected Genehmiger(Genehmiger nachfolger) { this.nachfolger = nachfolger; }

        // Template: selbst bearbeiten oder weiterreichen
        final String bearbeite(Antrag a) {
            if (zustaendig(a)) {
                return getClass().getSimpleName() + " genehmigt";
            }
            if (nachfolger == null) {
                return "abgelehnt, niemand zuständig";
            }
            System.out.println("    " + getClass().getSimpleName() + " gibt weiter ...");
            return nachfolger.bearbeite(a);
        }

        protected abstract boolean zustaendig(Antrag a);
    }

    // --- Konkrete Handler ---
    static final class Teamleiter extends Genehmiger {
        Teamleiter(Genehmiger n) { super(n); }
        protected boolean zustaendig(Antrag a) { return a.betragEuro() <= 500; }
    }

    static final class Abteilungsleiter extends Genehmiger {
        Abteilungsleiter(Genehmiger n) { super(n); }
        protected boolean zustaendig(Antrag a) { return a.betragEuro() <= 5_000; }
    }

    static final class Geschaeftsfuehrer extends Genehmiger {
        Geschaeftsfuehrer(Genehmiger n) { super(n); }
        protected boolean zustaendig(Antrag a) { return a.betragEuro() <= 50_000; }
    }

    public static void main(String[] args) {
        // Kette von hinten nach vorn aufbauen: Teamleiter -> Abteilungsleiter -> Geschäftsführer
        Genehmiger kette = new Teamleiter(new Abteilungsleiter(new Geschaeftsfuehrer(null)));

        List<Antrag> antraege = List.of(
                new Antrag("Anna", "Fachbuch", 60),
                new Antrag("Ben", "Schulung", 1_800),
                new Antrag("Cem", "Server", 22_000),
                new Antrag("Dora", "Firmenwagen", 80_000));

        for (Antrag a : antraege) {
            System.out.printf(Locale.GERMANY, "%s: %s, %,d €%n", a.mitarbeiter(), a.zweck(), a.betragEuro());
            System.out.println("    => " + kette.bearbeite(a));
        }

        // Funktionale Variante: Kette als Liste von Funktionen, der erste Treffer gewinnt
        System.out.println("\nFunktionale Kette:");
        List<Function<Antrag, Optional<String>>> handler = List.of(
                a -> a.betragEuro() <= 500    ? Optional.of("Teamleiter")        : Optional.empty(),
                a -> a.betragEuro() <= 5_000  ? Optional.of("Abteilungsleiter")  : Optional.empty(),
                a -> a.betragEuro() <= 50_000 ? Optional.of("Geschäftsführer")   : Optional.empty());

        for (Antrag a : antraege) {
            String ergebnis = handler.stream()
                    .map(h -> h.apply(a))
                    .flatMap(Optional::stream)
                    .findFirst()
                    .map(wer -> wer + " genehmigt")
                    .orElse("abgelehnt");
            System.out.printf("    %-12s %s%n", a.zweck() + ":", ergebnis);
        }
    }
}
```

## Ausgabe

```
Anna: Fachbuch, 60 €
    => Teamleiter genehmigt
Ben: Schulung, 1.800 €
    Teamleiter gibt weiter ...
    => Abteilungsleiter genehmigt
Cem: Server, 22.000 €
    Teamleiter gibt weiter ...
    Abteilungsleiter gibt weiter ...
    => Geschaeftsfuehrer genehmigt
Dora: Firmenwagen, 80.000 €
    Teamleiter gibt weiter ...
    Abteilungsleiter gibt weiter ...
    => abgelehnt, niemand zuständig

Funktionale Kette:
    Fachbuch:    Teamleiter genehmigt
    Schulung:    Abteilungsleiter genehmigt
    Server:      Geschäftsführer genehmigt
    Firmenwagen: abgelehnt
```

## Zwei Spielarten

Im GoF-Buch bearbeitet **genau ein** Handler die Anfrage, danach endet die Kette. Diese Variante zeigt das Beispiel. In der Praxis mindestens ebenso verbreitet ist die zweite Spielart, bei der **jeder** Handler die Anfrage verarbeitet und dann weitergibt, aber auch abbrechen kann. So funktionieren Servlet-Filter (`FilterChain.doFilter()`), die Filterkette von Spring Security und Middleware in Web-Frameworks: Jeder Filter prüft etwas, protokolliert, ergänzt Header oder weist die Anfrage zurück.

## Wann einsetzen?

- Mehrere Objekte kommen für eine Anfrage in Frage, und welches zuständig ist, entscheidet sich erst zur Laufzeit.
- Der Absender soll nicht wissen, wer die Anfrage am Ende bearbeitet.
- Die Menge der Handler oder ihre Reihenfolge soll sich flexibel ändern lassen.

Typische Beispiele sind Genehmigungsabläufe, Support-Eskalationen (First Level, Second Level, Entwicklung), Ereignisbehandlung in GUIs, bei der ein Klick vom Button an das Panel und weiter an das Fenster wandert, sowie die Suche nach einem passenden `catch`-Block entlang des Aufrufstapels.

## Nachteile

Es gibt keine Garantie, dass eine Anfrage überhaupt bearbeitet wird. Ist niemand zuständig, fällt sie am Ende der Kette heraus. Deshalb braucht es eine bewusste Behandlung dieses Falls, im Beispiel die Ablehnung. Lange Ketten erschweren zudem die Fehlersuche, weil nicht direkt sichtbar ist, welcher Handler eine Anfrage am Ende bearbeitet hat. Und eine falsch zusammengesetzte Kette, etwa mit dem Geschäftsführer vor dem Teamleiter, liefert falsche Ergebnisse, ohne dass ein Fehler auftritt.

## Verwandte Muster

Die Kette wird oft zusammen mit **Composite** verwendet: Ein Element reicht eine Anfrage an seinen Elternknoten weiter. Der **Decorator** hat eine ähnliche Struktur, dort führen aber alle Glieder ihre Ergänzung aus, und keines kann die Weitergabe abbrechen. **Command** eignet sich, um die Anfragen als Objekte durch die Kette zu schicken. Der **Mediator** verbindet Sender und Empfänger über eine zentrale Stelle, die Kette über eine Reihe gleichberechtigter Glieder.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java ChainOfResponsibility.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
