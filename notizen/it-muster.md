# Design Patterns, Integration Patterns, Weitere Muster – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11. Die vollständige Geschichte steht wortgleich in `notizen/chronik/it-muster.md` – dort **je GoF-Muster der Ablauf der Visualisierung** (Szenarien, Schrittzahl, Besonderheiten, gefundene Fehlerarten). Neue Lieferungen dort unten anhängen.

## Herkunft und Regeln

- Alle drei Reihen von der Claude-Opus-5.5-Instanz **„26.10.2026 - 13:39 - GoF-Designmuster in Java“**.
- Text und Code der Instanz unverändert; Funde (Praxis-Absätze, Java-Ausgaben) als Anmerkung. Beispieldaten „Sven“, „Sven Berg, Hafenstraße 7, Hamburg“, „sven@example.de“ sind laut Sven erfunden und bleiben.
- Java nur mit dem **vorhandenen JDK 21** ausführen (`java <Datei>.java`), nichts installieren, nichts am Rechner ändern (Sven).

## Design Patterns (`/it-konzepte/design-patterns/`) – 23 GoF-Muster, alle mit Ablauf

- **Einbau:** `perl skripte/pattern-einlesen.pl input/<Muster>.html test-dp` – HTML → `content/it-konzepte/design-patterns/<schluessel>.md`, Wortvergleich, führt den Java-Code aus und vergleicht mit „Ausgabe“ (bei Abweichung zweiter Lauf mit `-Duser.language=en -Duser.country=US`, Unterschied in der Anmerkung); schreibt nur, wenn alles stimmt; schreibt den Code auch als `static/apps/muster/<schluessel>-code.js`. **Überschreibt die Zielseite – Gegenproben nie unter echtem Musternamen.** Liefert die Instanz `<Muster>.java` mit, vorher mit dem Code der Seite vergleichen.
- Stammdaten (Nummer, Gruppe, Kurzbeschreibung, `sogehts`) in `data/designpatterns.toml`; Übersicht `layouts/design-patterns.html`, Einleitung der Instanz im `_index.md`.
- **Ablauf-Visualisierung:** Rahmen `static/apps/muster/rahmen.js` + `rahmen.css` (Einbindung `?v=4` – bei Änderung in **allen** Muster-Apps hochzählen), je Muster `static/apps/muster/<schluessel>.html` mit `MusterRahmen.starte({ rollen, diagramm, szenarien })`; Aufzeichner `s.ruf`, `s.raus` (Rückgabewert im Aufrufer mit `{ setze: [[var, wert]] }` – **nie `s.var` direkt vor `s.raus`**), `s.var`, `s.neu`, `s.feld`, `s.weg`, `s.aus`, `s.schritt`; mehrfach vorkommende Codezeilen über `Z(text, nr)`. Kanten `impl`/`nutzt`/`erzeugt`/`erbt`, Bögen `bogen`/`unten`.
- **Tests je Muster:** Code der App = Code der Seite; Konsole = „Ausgabe“ (zeilenweise `trimEnd()`); jede Zeile gefunden; Stapel am Ende leer; Variablen von main gehen nie verloren; nach jedem Rücksprung die erwarteten Variablen im Aufrufer; keine Beschriftung außerhalb der `viewBox`, über einem Kasten oder übereinander; kein Klassenname ragt über seinen Kasten; Knopf-Lage, Neu starten per echtem Klick (App direkt öffnen, Knopf per `ref`), Handy dunkel. Testzugang `window.__muster`.
- Vorschau liefert nach Änderungen manchmal kurz die alte Fassung – per `curl` prüfen.

## Integration Patterns (`/it-konzepte/integration-patterns/`) – 65 Muster in 8 Kapiteln

- **Einbau:** `perl skripte/reihe-einlesen.pl eip <ordner>` – je Kapitel Page-Bundle (`index.md` + `inhalt-html.txt`), Übersicht `layouts/reihe-uebersicht.html`; Stile auf `.eip` begrenzt in `assets/css/eip.css`, Angleichungen für beide Reihen in `assets/css/reihe-seite.css` (nur auf diesen Seiten geladen, Zuordnung in `baseof.html`). Anmerkungen bleiben beim erneuten Einlesen.

## Weitere Muster (`/it-konzepte/weitere-muster/`) – 53 Muster in 7 Kapiteln

- **Einbau:** `perl skripte/reihe-einlesen.pl muster <ordner>` (Stile `assets/css/muster.css`, Verweise `../eip/…` werden auf unsere Integration Patterns umgebogen). 48 Muster mit Java-Code, alle ausgeführt: 46 gleich, zwei hängen an gemessenen Zeiten (Object Pool, Thread Pool – in der Anmerkung).

## Offen

- Vorschlag: Farbhervorhebung des Codes. Möglich: Ablauf-Visualisierungen auch für die Weiteren Muster (nicht besprochen).
