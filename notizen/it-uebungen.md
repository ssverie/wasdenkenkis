# IT-Übungen – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11. Die vollständige Geschichte steht wortgleich in `notizen/chronik/it-uebungen.md` (jedes Blatt mit Prüfung und Funden). Neue Blätter dort unten anhängen.

## Regeln

- Herkunft: Claude Opus 5.5, Instanz **„26.10.2026 - 14:34 - IT-Übungen“** – die JSON-Datei nennt kein Modell, darum **bei jeder neuen Datei nachfragen**.
- Blätter unverändert übernehmen; Funde (Rechenfehler der Instanz) nur als Anmerkung. Jede Rechen- oder Codeaufgabe nachprüfen, mit dem vorhandenen JDK; Svens Oracle-Installation nicht anfassen, kein SQLite (SQL-Regeln in Java nachrechnen und das offen sagen).
- Kein fremdes Skript (Prism.js) – Hervorhebung beim Bauen durch Hugo. Sven: „vorerst nur jeweils 20“ Aufgaben je Blatt; geplante Mengen nicht anzeigen.

## Technik

- Blatt unverändert als `data/uebungen/<blatt>.json` (`tasks[]` mit `id`, `title`, `difficulty` 1–3, `topics`, `question`, `code`, `options[4]`, `correctIndex`, `answer`, `explanation`), Seite `content/it-konzepte/uebungen/<blatt>.md` mit `layout = "uebung"`, `uebungen = "<blatt>"`, `kategorie`. Kategorien als `kategorien` im `_index.md` (Vorlage `layouts/uebungen.html`, ohne Blatt „(folgt)“).
- **Vier Formate** (Erkennung in `layouts/uebung.html`): Code lesen (`code` + `answer`), Fehler finden (`spec`, `bugLines`, `fixedCode`, `demo`; Fehlerzeilen erst nach der Antwort rot), Textaufgabe (kein `code`, `scenario` als Kasten), Brainstorm (`brainstorm` mit `prompt`/`exampleIdeas`, Kasten `.testideen` – **nicht** `.ideen`, die gehört der Ideen-Seite). Technische Szenarien (Stacktraces, Logs, Tabellen mit „ | “) als `pre.szenario-tabelle`; reine Code-Szenarien (`$nurCode`) eingefärbt als `.szenario-code`.
- Syntax-Farben `assets/css/syntax.css` aus `perl skripte/syntax-css.pl` (github hell / github-dark), nur auf Übungsseiten; `code, pre` überall ohne Ligaturen.
- `assets/js/uebungen.js`: Antwort wählen, Weiter, Nochmal, Filter nach Stufe und Thema, „🎲 5 zufällige Aufgaben“, Fortschritt in `localStorage` `wdk-uebungen:<blatt>` (`geloest`, `antworten`, `ideen`). Testzugang `window.__uebungen`. Die Suche nimmt die Aufgaben mit.
- **Prüfung:** `perl skripte/uebungen-pruefen.pl input/<blatt>.json test-ueb` – führt Code-Aufgaben mit Java aus (`java Main.java`), Fehler-finden-Aufgaben mit fehlerhafter und korrigierter Methode, prüft `correctIndex`, `answer`, doppelte Antworten; bei Abweichung zweiter Lauf mit englischer Spracheinstellung.

## Stand (2026-11-11)

- 11 Blätter à 20 Aufgaben: Java Code lesen, Java Fehler finden, Testdesign, Anforderungen & Analyse, Logik & Informatik-Grundlagen, Debugging-Denken, Gedächtnis & Wissen, Kreativ & exploratives Testen, API-Testen, Performance & Last, Testmanagement & ISTQB-Begriffe.
