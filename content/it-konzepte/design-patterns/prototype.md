+++
title = "Prototype"
description = "Neue Objekte durch Klonen eines Prototyps"
date = 2026-10-26T14:14:00+01:00
nummer = 4
gruppe = "erzeugung"
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Die 23 GoF Design Patterns“ in Java 21, Muster 4 von 23 · Kurzbeschreibung aus der Liste der Instanz · Ablauf-Visualisierung: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite)"
+++

{{< spiel src="/apps/muster/prototype.html" titel="Prototype – Ablauf" link="Im Vollbild öffnen" >}}

**So geht's:** Der Ablauf oben spielt main() aus dem Quellcode Schritt für Schritt nach. Unter „Objekte im Speicher“ sieht man jede Kopie als eigenes Objekt mit eigener Nummer. Bei der Gruppe „Schild“ entstehen auch neue Teile, das ist die tiefe Kopie. Beim Verschieben ändern sich deshalb nur die Werte der Kopie, die Teile der Vorlage bleiben, wie sie sind. Die letzte Zeile hat eine Überraschung: Gedruckt wird dort nicht die Vorlage selbst, sondern eine frische Kopie von ihr.

*GoF-Erzeugungsmuster · Java 21*

## Zweck

Beim Prototype entstehen neue Objekte, indem ein **vorhandenes Objekt kopiert** wird. Statt eine Klasse mit `new` zu instanziieren und mühsam zu konfigurieren, nimmt man eine fertig eingestellte Vorlage und lässt sie sich selbst klonen.

## Das Problem

In einem Zeichenprogramm sollen Formen per Vorlage eingefügt werden: ein roter Kreis mit bestimmtem Radius, ein Schild aus Rechteck und Kreis. Würde man jedes Mal mit `new` und allen Parametern neu bauen, müsste der aufrufende Code die konkreten Klassen und ihre gesamte Konfiguration kennen. Bei zusammengesetzten Objekten kommt hinzu, dass deren innere Struktur von außen oft gar nicht sichtbar ist.

## Die Lösung

Jedes Objekt bekommt eine Methode `kopie()`, die ein gleichwertiges, aber unabhängiges Exemplar liefert. Nur das Objekt selbst weiß, wie es korrekt kopiert wird, auch was private Felder und Unterobjekte angeht. Häufig kommt eine **Prototyp-Registry** dazu: Vorkonfigurierte Vorlagen werden unter einem Namen abgelegt und bei Bedarf geklont.

## Die Beteiligten

- **Prototype**: `Form` deklariert die Kopiermethode.
- **ConcretePrototype**: `Kreis`, `Rechteck` und `Gruppe` implementieren das Kopieren.
- **Client**: erzeugt neue Objekte, indem er eine Vorlage bittet, sich zu kopieren.
- **Prototype Registry** (optional): `Vorlagen` verwaltet benannte Prototypen.

## Flache und tiefe Kopie

Der entscheidende Punkt bei diesem Muster. Eine *flache* Kopie übernimmt bei Referenzfeldern nur die Referenz, Original und Kopie teilen sich dann dieselben Unterobjekte. Bei der `Gruppe` würde das Verschieben der Kopie auch die Vorlage verschieben. Deshalb kopiert `Gruppe.kopie()` jedes Teil einzeln (*tiefe* Kopie). Die Ausgabe zeigt es: Die Kopie des Schilds wurde verschoben, die Vorlage steht unverändert bei 0,0.

## Java-21-Details: kein `clone()`

Java hat mit `Cloneable` und `Object.clone()` eine eingebaute Unterstützung, die allerdings als missglückt gilt: `Cloneable` deklariert selbst keine Methode, `clone()` ist `protected`, wirft eine Checked Exception und kopiert immer nur flach. Joshua Bloch rät in *Effective Java* davon ab. Das Beispiel verwendet stattdessen ein eigenes Interface mit **Kopierkonstruktoren**. Kovariante Rückgabetypen erlauben dabei, dass `Kreis.kopie()` direkt einen `Kreis` liefert statt nur eine `Form`.

## Quellcode

Die Datei `Prototype.java` ist ohne Build-Tool direkt ausführbar: `java Prototype.java`

```
// Prototype (GoF, Erzeugungsmuster)
// Neue Objekte entstehen durch Kopieren eines vorhandenen Prototyps statt durch "new".
// Start: java Prototype.java

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Prototype {

    // --- Prototype: jedes Objekt kann sich selbst kopieren ---
    interface Form {
        Form kopie();
        void verschiebe(int dx, int dy);
    }

    // --- Konkrete Prototypen (veränderlich, deshalb lohnt sich das Kopieren) ---
    static final class Kreis implements Form {
        int x, y, radius;
        String farbe;

        Kreis(int x, int y, int radius, String farbe) {
            this.x = x; this.y = y; this.radius = radius; this.farbe = farbe;
        }

        // Kopierkonstruktor statt clone()
        private Kreis(Kreis vorlage) {
            this(vorlage.x, vorlage.y, vorlage.radius, vorlage.farbe);
        }

        public Kreis kopie() { return new Kreis(this); }
        public void verschiebe(int dx, int dy) { x += dx; y += dy; }
        public String toString() {
            return "Kreis(" + x + "," + y + " r=" + radius + " " + farbe + ")";
        }
    }

    static final class Rechteck implements Form {
        int x, y, breite, hoehe;

        Rechteck(int x, int y, int breite, int hoehe) {
            this.x = x; this.y = y; this.breite = breite; this.hoehe = hoehe;
        }

        private Rechteck(Rechteck vorlage) {
            this(vorlage.x, vorlage.y, vorlage.breite, vorlage.hoehe);
        }

        public Rechteck kopie() { return new Rechteck(this); }
        public void verschiebe(int dx, int dy) { x += dx; y += dy; }
        public String toString() {
            return "Rechteck(" + x + "," + y + " " + breite + "x" + hoehe + ")";
        }
    }

    // --- Zusammengesetzter Prototyp: braucht eine TIEFE Kopie ---
    static final class Gruppe implements Form {
        final String name;
        final List<Form> teile = new ArrayList<>();

        Gruppe(String name, Form... teile) {
            this.name = name;
            this.teile.addAll(List.of(teile));
        }

        public Gruppe kopie() {
            Gruppe g = new Gruppe(name);
            for (Form f : teile) {
                g.teile.add(f.kopie());   // jedes Teil einzeln kopieren
            }
            return g;
        }

        public void verschiebe(int dx, int dy) {
            teile.forEach(f -> f.verschiebe(dx, dy));
        }

        public String toString() { return name + teile; }
    }

    // --- Prototyp-Registry: vorkonfigurierte Vorlagen unter einem Namen ---
    static final class Vorlagen {
        private final Map<String, Form> vorlagen = new HashMap<>();

        void registriere(String name, Form vorlage) { vorlagen.put(name, vorlage); }

        Form erzeuge(String name) {
            Form vorlage = vorlagen.get(name);
            if (vorlage == null) {
                throw new IllegalArgumentException("Unbekannte Vorlage: " + name);
            }
            return vorlage.kopie();
        }
    }

    public static void main(String[] args) {
        Vorlagen vorlagen = new Vorlagen();
        vorlagen.registriere("ampel-rot", new Kreis(0, 0, 10, "rot"));
        vorlagen.registriere("schild", new Gruppe("Schild",
                new Rechteck(0, 0, 40, 20), new Kreis(20, 10, 5, "weiß")));

        // Neue Objekte aus Vorlagen
        Form a = vorlagen.erzeuge("ampel-rot");
        Form b = vorlagen.erzeuge("ampel-rot");
        b.verschiebe(50, 0);
        System.out.println("a = " + a);
        System.out.println("b = " + b);

        // Tiefe Kopie: Verschieben der Kopie lässt die Vorlage unberührt
        Form schild = vorlagen.erzeuge("schild");
        schild.verschiebe(100, 100);
        System.out.println("Kopie:   " + schild);
        System.out.println("Vorlage: " + vorlagen.erzeuge("schild"));
    }
}
```

## Ausgabe

```
a = Kreis(0,0 r=10 rot)
b = Kreis(50,0 r=10 rot)
Kopie:   Schild[Rechteck(100,100 40x20), Kreis(120,110 r=5 weiß)]
Vorlage: Schild[Rechteck(0,0 40x20), Kreis(20,10 r=5 weiß)]
```

## Wann einsetzen?

- Objekte sind aufwendig zu konfigurieren, und es gibt wenige typische Varianten, die immer wieder gebraucht werden.
- Die zu erzeugende Klasse steht erst zur Laufzeit fest, etwa aus einer Konfiguration oder einer Benutzerauswahl.
- Man möchte keine parallele Hierarchie von Fabrikklassen aufbauen.
- Die Erzeugung ist teuer (Datenbankzugriff, Berechnung), das Kopieren dagegen billig.

## Nachteile

Jede Klasse muss das Kopieren korrekt implementieren, und das ist bei Objektgraphen mit Zyklen oder geteilten Referenzen schwierig. Was tief und was flach kopiert wird, muss bewusst entschieden werden. Bei **unveränderlichen** Objekten wie Records entfällt das Muster dagegen fast ganz: Dort kann man das Original einfach weiterreichen, und für Varianten genügt ein neues Exemplar mit geänderten Werten.

## Verwandte Muster

**Abstract Factory** kann ihre Produkte aus Prototypen klonen, statt Unterklassen zu bilden. **Composite** und **Decorator** profitieren oft vom Prototype, weil sich damit ganze Strukturen kopieren lassen, wie hier die `Gruppe`. Im Unterschied zur **Factory Method** braucht Prototype keine Unterklassen des Erzeugers.

{{< anmerkung >}}
Den Quellcode habe ich unverändert mit Java 21.0.8 ausgeführt (`java Prototype.java`, ohne Build-Tool). Die Ausgabe stimmt Zeichen für Zeichen mit dem Abschnitt „Ausgabe“ überein.
{{< /anmerkung >}}
