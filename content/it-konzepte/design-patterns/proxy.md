+++
title = "Proxy"
description = "Stellvertreter, der den Zugriff auf ein Objekt kontrolliert"
date = 2026-10-26T19:36:00+01:00
nummer = 12
gruppe = "struktur"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 12 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/proxy.html" titel="Proxy – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Beim virtuellen Proxy sieht man im Speicher, dass das echte Archiv erst beim ersten lese() entsteht, beim zweiten nicht noch einmal. Beim Schutz-Proxy wird der Aufrufstapel drei Ebenen tief: Schutz-Proxy, virtueller Proxy, echtes Archiv. Beim Gast endet loesche() mit einer Exception, bevor das Archiv gefragt wird. Zum Schluss erzeugt das JDK eine Proxy-Klasse zur Laufzeit, die jeden Aufruf an den Handler weiterreicht.

*GoF-Strukturmuster · Java 21*

## Zweck

Ein Proxy ist ein **Stellvertreter** für ein anderes Objekt. Er hat dieselbe Schnittstelle wie das Original, sodass der Client keinen Unterschied bemerkt, und **kontrolliert den Zugriff** darauf. Er kann Aufrufe verzögern, prüfen, protokollieren oder über ein Netzwerk weiterleiten, bevor er sie an das echte Objekt durchreicht.

## Das Problem

Ein Dokumentenarchiv ist teuer in der Erzeugung: Beim Öffnen werden eine Verbindung aufgebaut und ein Index geladen. Viele Programmteile halten eine Referenz auf das Archiv, benutzen es aber nie. Trotzdem würde es beim Programmstart sofort geöffnet. Zugleich dürfen nicht alle Benutzer alles: Lesen ist erlaubt, Löschen nur für Administratoren. Diese Prüfung in das Archiv selbst einzubauen, würde zwei verschiedene Aufgaben in einer Klasse vermischen, und die Archivklasse stammt womöglich aus einer Bibliothek.

## Die Lösung

Zwischen Client und Archiv tritt ein Objekt mit derselben Schnittstelle `Archiv`. Der Client hält nur noch eine Referenz auf diesen Stellvertreter und ruft ihn auf wie das Original. Der Proxy entscheidet, was vor und nach der Weiterleitung passiert. Weil beide dieselbe Schnittstelle haben, lassen sich Proxies auch verketten: Im Beispiel sitzt der Schutz-Proxy vor dem virtuellen Proxy, der wiederum vor dem echten Archiv sitzt.

## Die Beteiligten

- **Subject**: `Archiv` ist die gemeinsame Schnittstelle, damit der Proxy überall statt des echten Objekts verwendet werden kann.
- **RealSubject**: `DokumentenArchiv` ist das echte Objekt, das die Arbeit erledigt.
- **Proxy**: `LazyArchiv` und `GeschuetztesArchiv` halten eine Referenz auf das echte Objekt und kontrollieren den Zugriff darauf.

## Arten von Proxies

Das GoF-Buch unterscheidet mehrere Einsatzzwecke. Die Struktur ist immer gleich, nur die Aufgabe unterscheidet sich:

- **Virtueller Proxy**: erzeugt ein teures Objekt erst, wenn es wirklich gebraucht wird (*Lazy Loading*). Im Beispiel `LazyArchiv`: Das Archiv wird beim ersten Lesen geöffnet, beim zweiten nicht erneut.
- **Schutz-Proxy**: prüft Zugriffsrechte, bevor er weiterleitet. Im Beispiel `GeschuetztesArchiv`.
- **Remote-Proxy**: vertritt ein Objekt in einem anderen Prozess oder auf einem anderen Rechner und übernimmt die Netzwerkkommunikation.
- **Smart Reference**: erledigt zusätzliche Aufgaben bei jedem Zugriff, etwa Logging, Zählen von Referenzen, Sperren oder Caching.

## Java-21-Details

Der Schutz-Proxy ist ein `record`, weil er nur das echte Objekt und den Benutzer hält. Der virtuelle Proxy dagegen ist eine normale Klasse, denn er muss sein Feld nachträglich setzen. Achtung: Die gezeigte Lazy-Initialisierung ist nicht threadsicher. Bei parallelem Zugriff gelten dieselben Überlegungen wie beim Singleton.

Als dritte Variante zeigt das Beispiel den **dynamischen Proxy** des JDK. `java.lang.reflect.Proxy.newProxyInstance()` erzeugt zur Laufzeit eine Klasse, die ein beliebiges Interface implementiert und jeden Aufruf an einen `InvocationHandler` leitet. Der Handler ist hier ein Lambda, das vor und nach jedem Aufruf protokolliert. So lässt sich ein Logging-Proxy für jedes beliebige Interface bauen, ohne für jede Methode Code zu schreiben. Da `loesche()` den Rückgabetyp `void` hat, meldet der Handler dort `null` als Ergebnis.

## Quellcode

Die Datei `Proxy.java` ist ohne Build-Tool direkt ausführbar: `java Proxy.java`

```
// Proxy (GoF, Strukturmuster)
// Ein Stellvertreter mit derselben Schnittstelle kontrolliert den Zugriff auf ein anderes Objekt.
// Start: java Proxy.java

import java.lang.reflect.InvocationHandler;
import java.util.Set;

public class Proxy {

    // --- Subject: gemeinsame Schnittstelle von echtem Objekt und Proxy ---
    interface Archiv {
        String lese(String dokument);
        void loesche(String dokument);
    }

    // --- RealSubject: teuer in der Erzeugung ---
    static final class DokumentenArchiv implements Archiv {
        DokumentenArchiv() {
            System.out.println("  [Archiv wird geöffnet: Verbindung, Index laden ...]");
        }
        public String lese(String dokument)  { return "Inhalt von " + dokument; }
        public void loesche(String dokument) { System.out.println("  " + dokument + " gelöscht"); }
    }

    // --- Virtueller Proxy: erzeugt das echte Objekt erst beim ersten Bedarf ---
    static final class LazyArchiv implements Archiv {
        private Archiv echt;                      // noch null

        private Archiv echt() {
            if (echt == null) echt = new DokumentenArchiv();
            return echt;
        }
        public String lese(String dokument)  { return echt().lese(dokument); }
        public void loesche(String dokument) { echt().loesche(dokument); }
    }

    // --- Schutz-Proxy: prüft Berechtigungen, bevor er weiterleitet ---
    record Benutzer(String name, Set<String> rollen) {}

    record GeschuetztesArchiv(Archiv echt, Benutzer benutzer) implements Archiv {
        public String lese(String dokument) {
            return echt.lese(dokument);           // Lesen darf jeder
        }
        public void loesche(String dokument) {
            if (!benutzer.rollen().contains("admin")) {
                throw new SecurityException(benutzer.name() + " darf nicht löschen");
            }
            echt.loesche(dokument);
        }
    }

    public static void main(String[] args) {
        // 1. Virtueller Proxy
        System.out.println("Virtueller Proxy:");
        Archiv lazy = new LazyArchiv();
        System.out.println("  Proxy erzeugt, Archiv noch nicht geöffnet");
        System.out.println("  " + lazy.lese("Vertrag.pdf"));
        System.out.println("  " + lazy.lese("Rechnung.pdf"));    // kein zweites Öffnen

        // 2. Schutz-Proxy
        System.out.println("\nSchutz-Proxy:");
        Archiv fuerGast  = new GeschuetztesArchiv(lazy, new Benutzer("Gast", Set.of("leser")));
        Archiv fuerAdmin = new GeschuetztesArchiv(lazy, new Benutzer("Sven", Set.of("leser", "admin")));

        System.out.println("  " + fuerGast.lese("Vertrag.pdf"));
        try {
            fuerGast.loesche("Vertrag.pdf");
        } catch (SecurityException e) {
            System.out.println("  Verweigert: " + e.getMessage());
        }
        fuerAdmin.loesche("Vertrag.pdf");

        // 3. Dynamischer Proxy aus dem JDK: Logging für JEDES Interface, ohne eigene Klasse
        System.out.println("\nDynamischer Proxy:");
        Archiv echt = new DokumentenArchiv();
        InvocationHandler logger = (proxy, methode, argumente) -> {
            System.out.println("  LOG vorher:  " + methode.getName() + "(" + argumente[0] + ")");
            Object ergebnis = methode.invoke(echt, argumente);
            System.out.println("  LOG nachher: " + methode.getName() + " -> " + ergebnis);
            return ergebnis;
        };
        Archiv mitLogging = (Archiv) java.lang.reflect.Proxy.newProxyInstance(
                Archiv.class.getClassLoader(), new Class<?>[] { Archiv.class }, logger);

        mitLogging.lese("Angebot.pdf");
        mitLogging.loesche("Angebot.pdf");
    }
}
```

## Ausgabe

```
Virtueller Proxy:
  Proxy erzeugt, Archiv noch nicht geöffnet
  [Archiv wird geöffnet: Verbindung, Index laden ...]
  Inhalt von Vertrag.pdf
  Inhalt von Rechnung.pdf

Schutz-Proxy:
  Inhalt von Vertrag.pdf
  Verweigert: Gast darf nicht löschen
  Vertrag.pdf gelöscht

Dynamischer Proxy:
  [Archiv wird geöffnet: Verbindung, Index laden ...]
  LOG vorher:  lese(Angebot.pdf)
  LOG nachher: lese -> Inhalt von Angebot.pdf
  LOG vorher:  loesche(Angebot.pdf)
  Angebot.pdf gelöscht
  LOG nachher: loesche -> null
```

## Wann einsetzen?

- Ein Objekt ist teuer und soll erst bei Bedarf erzeugt werden.
- Der Zugriff auf ein Objekt soll abhängig von Rechten eingeschränkt werden.
- Ein entferntes Objekt soll sich so anfühlen, als wäre es lokal.
- Querschnittsaufgaben wie Logging, Caching, Transaktionen oder Zeitmessung sollen um Aufrufe gelegt werden, ohne die eigentliche Klasse zu ändern.

## Nachteile

Jeder Proxy ist eine weitere Indirektion, die die Antwortzeit verlängern und die Fehlersuche erschweren kann. Gefährlich wird es, wenn der Client den Proxy für das Original hält, obwohl er sich anders verhält, etwa wenn ein Remote-Proxy plötzlich Netzwerkfehler wirft oder ein Lazy-Proxy beim ersten Aufruf spürbar hängt. Dynamische Proxies funktionieren nur für Interfaces, nicht für Klassen, und Fehler zeigen sich erst zur Laufzeit.

## Beispiele aus der Praxis

Spring baut auf Proxies auf: Methoden mit `@Transactional`, `@Cacheable` oder `@Async` werden nicht direkt aufgerufen, sondern über einen erzeugten Proxy, der die Transaktion öffnet oder den Cache prüft. Hibernate liefert für Lazy-Loading-Beziehungen Proxy-Objekte, die erst beim Zugriff die Datenbank abfragen. Java RMI verwendet Remote-Proxies, sogenannte Stubs.

## Verwandte Muster

Der **Decorator** hat dieselbe Struktur, aber ein anderes Ziel: Er fügt Funktionalität hinzu, die der Client bewusst zusammensetzt. Ein Proxy kontrolliert den Zugriff, verwaltet den Lebenszyklus seines Objekts oft selbst, und der Client weiß in der Regel nichts von ihm. Der **Adapter** bietet eine *andere* Schnittstelle, der Proxy *dieselbe*. Die **Facade** vereinfacht ein ganzes Subsystem, der Proxy steht für genau ein Objekt.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Proxy.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
