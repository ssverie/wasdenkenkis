# Spiele, Schach, Tools – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11. Die vollständige Geschichte steht wortgleich in `notizen/chronik/spiele-schach-tools.md` – dort auch die **Arbeitsprotokolle aller 1001 Rizzitano-Aufgaben** (jede Lieferung, jeder Lesefehler, meine Trefferquoten), die Ivanchuk-Partiensuche Partie für Partie und die **PowerShell-Befehle zum Aufrichten und Ausschneiden von Fotos**. **Neue Lieferungen dort unten als eigener kurzer Absatz anhängen**; hier nur nachführen, was dauerhaft gilt oder den Stand ändert. Schachbücher als Bücher (Listen, Buchseiten, Masetti-Werkzeug): `notizen/buecher.md`.

## Regeln (Svens Entscheidungen)

- `input-f5\apps\` (Svens Fable-5-Sammlung): **nie löschen, nie verschieben, nie committen**. Ins Repo nur freigegebene Spiele als Kopie.
- **Jedes nachspielbare Brett hat den Knopf ⇅ „Brett drehen“** (Sven, 2026-11-10: „merk dir das mit dem Flipper“); gilt je Brett, wird nicht gemerkt, keine Grundeinstellung je Partie.
- Brett braun (`#f0d9b5`/`#b58863`), keine Koordinaten; Alternative Blau über `params.schachbrett` (Sven entscheidet noch; Vergleichsseite nur lokal `/schach/zz-vergleich-brett/`). Figuren Cburnett, **CC BY-SA 3.0 – Namensnennung unter jedem Diagramm nie entfernen**.
- Svens Stellungen: Titel = Partiedatum, kein Kommentar von Claude, Brett aus Sicht der Seite am Zug. Buchaufgaben: **immer aus Sicht von Weiß**, nur „Weiß/Schwarz am Zug“, keine Fragen aus dem Buch.
- **Aus Büchern nur Notation übernehmen** – Züge, Bewertungszeichen, Ergebnisse, Partie, Turnier; keine Erklärsätze, keine Wörter wie „Nicht“, „droht“ (Urheberrecht, öffentliches Repo; Sven: „notation reicht immer“).
- Lösungen zugeklappt (erst selbst rechnen), Knopf „Alle Lösungen aufklappen“ je Kapitel.
- **Schach-Selbsttest** (Ausnahme zu „keine eigenen Beiträge“): Aufgaben selbst lösen **bevor** die Lösungsseiten kommen, festschreiben, nie nachträglich ändern; Antworten Sven immer vollständig als Tabelle zeigen (Nr., Zug, Sicherheit, Lösung). Sieht man eine Lösung vorher, diese Aufgabe nicht werten (offenlegen).
- Partien aus Büchern: **Züge aus öffentlichen Datenbanken** (chessgames.com), nie aus dem Buch; Buchkommentare nie übernehmen. Turnier und Datum aus den PGN-Köpfen, nicht aus dem Gedächtnis.
- KI-Partien: Persönliches (Svens Alter u. a.) vor dem Einbau prüfen und auf Svens Wunsch streichen; Stockfish-Prüfungen macht die Instanz, nicht ich.
- Spiele müssen handytauglich sein (Touch nachrüsten) und ohne weitere Dateien laufen (Sven gibt sie lokal weiter).

## Spiele und Tools

- Spiel: Kopie `static/apps/<name>.html` (nur technische Anpassungen, im Code mit „wasdenkenkis.de“ markiert), Seite `content/spiele/<name>.md` mit `{{</* spiel src="/apps/<name>.html" titel="…" */>}}`. Vorhanden: Tetris, Breakout, Minesweeper, Reversi; Schachspiele unter `content/schach/` (klassisch, Schach 960, 9+).
- Schachspiele: Blättern über `positions[]`/`cur`, Mensch zieht nur Weiß, deutsche Notation; 9+ ohne Zurück, Rochade nur mit Turm, der direkt auf a1/h1 eingesetzt wurde. Die Spiele lesen `params.schachbrett` nicht (bei Wechsel von Hand ändern).
- Testen im Browser mit `?v=…` an der Spieladresse (Cache), Bestwerte im `localStorage` der Vorschau danach löschen.
- **Tools** `/tools/` mit zwei Kacheln: **Werkzeugkasten** (`content/tools/werkzeugkasten/`, Dev-Werkzeugkasten von Fable 5) und **Links** (`data/links.toml` mit `kategorie = "Tools"`, Partial `links-baum.html`). Menü-Kennungen `tools`, `tools-werkzeugkasten`, `tools-links`.

## Schach – Aufbau

- `/schach/` ist erster Punkt unter Spiele (`weight = 1`); Rubrikseite `layouts/schach/section.html`: Spiele-Kacheln, darunter Svens Stellungen (`content/schach/stellung-<n>.md` mit `partie`, `fen`, Shortcode `{{</* schach */>}}`). Sortierung: neuestes Partiedatum, am selben Tag niedrigerer Zug zuerst.
- **Buchaufgaben/-partien:** Daten `data/schach/<buch>.toml` mit `[[kapitel]]` (nr laufend, `buch` = Kapitelnummer des Buchs, `titel`, `buchseite`, `slug`) und `[[aufgabe]]` (nr, kapitel, seite, fen, partie, turnier, loesung, varianten, optional `bewertungen`, `[[aufgabe.kommentare]]` mit `nach`/`art`/`text`). Kapitelseiten `content/schachaufgaben/<daten>/<slug>.md` mit `url = "/buecher/<buch>/<slug>/"`, `schachbuch = "<buch>"`, Inhalt `{{</* schachaufgaben daten="…" kapitel="…" nachspielen="alle" [partien="ja"] */>}}`; Inhaltsverzeichnis auf der Buchseite per `schachbuch-inhalt`. `/schachaufgaben/` selbst wird nicht ausgegeben. **Achtung:** `aufgabe.kapitel` = laufende Abschnittsnummer, nicht die Kapitelnummer des Buchs.
- **Nachspielen** (`assets/js/schach-nachspielen.js`, eigenes Skript ohne Bibliothek): jeder Zug anklickbar, ⏮ ◀ ▶ ⏭, Pfeiltasten, ⏩/⏸ Abspielen mit Tempo (localStorage „np-tempo“), „PGN ⬇“ je Partie (Partial `schach-pgn.html`, nur Hauptlinie), ⇅ Brett drehen, Figurinen, Varianten eingerückt (auch Untervarianten über `reichweite`), Bewertungen hinter jedem Zug, Kommentare der Instanz hinter dem Zug. **Chess960-Rochade** (seit 2026-11-10) in JS und Perl: König auf der Grundreihe suchen, äußerster Turm der Rochadeseite, danach König c/g, Turm d/f. Alle Bücher als PGN unter `/schach/<daten>.pgn`.
- **KI-Partien** `/schach/ki-partien/` (`layout = "ki-partien"`, Liste nach `partie_datum`, je Partie Beiträge nach `beitrag`/`beitrag_art`). Je Partie ein Page-Bundle `<weiß>-<schwarz>-<datum>/` mit `index.md` (Shortcode `schachaufgaben daten="ki-partien" kapitel="N" nachspielen="alle" partien="ja"` + `einbetten "inhalt-html.txt"`), `inhalt-html.txt` (Körper der Instanz unverändert), `stil.css` (von der 5.1-Stockfish-Seite), `[build] publishResources = false`. Daten: neues `[[kapitel]]` in `data/schach/ki-partien.toml`; Hauptlinie aus der PGN, **Varianten direkt aus den PGN-Klammern**, Bewertungen und Kommentarblöcke aus dem HTML (Regel: jeder Absatz/jede `korr` nach einer Zugzeile hängt am letzten Zug dieser Zeile, ab „Was ich mitnehme“ nicht mehr).

## Schach – Prüfskripte (müssen 0 ergeben)

- `perl skripte/fen-pruefen.pl data/schach/<buch>.toml` – Stellungen plausibel (Könige, Bauernreihen, Schach der Seite nicht am Zug, Rochaderechte inkl. Chess960), Nummern doppelt/fehlend. Findet keine vertauschten Figuren auf gültigen Feldern.
- `perl skripte/loesung-nachspielen.pl [--varianten] data/schach/<buch>.toml [loes.txt] [fen-ersatz.txt]` – spielt Lösungen gegen die FEN nach, prüft „+“ und „#“ (echtes Matt), meldet „keine Züge“. Passt ein Zug nicht, ist meist die Stellung falsch abgelesen.

## Schach – Lehren beim Ablesen (Fotos, PDFs)

- Ablauf je Foto (Einzelheiten und Befehle in der Chronik): Foto nach `input\`, per PowerShell/System.Drawing aufrichten (EXIF 274), je Diagramm ausschneiden und doppelt vergrößert in `test-schach\` einzeln lesen, FEN eintragen, Prüfskripte, Testbau, Fotos nach `input-arc\<datum>\schach\`.
- Gewölbte Bretter: Feldfarbe je Figur (a1 dunkel, Linie+Reihe gerade = dunkel), Abstände entlang einer Linie, Beschriftung beider Ränder; Figuren am gekrümmten Rand gehören zu den Reihenziffern des näheren Randes.
- **Damenfarbe** vergrößert prüfen, Figurenzahl je Seite ansehen (zwei Damen einer Farbe, keine der anderen → nachsehen). Bevor ich „Buchfehler“ sage, prüfen, ob eine andere Figurenfarbe die Linie spielbar macht. Eine Aufgabe ohne Lösung deutet auf einen Lesefehler.
- OCR-Schichten von PDFs lügen auch bei legal aussehenden Zügen – Lösungen am Bild gegenlesen. PDF im Browser: Mausrad blättern, `zoom` je Brett; bei verschlüsselter Textschicht die pdf.js-Ansicht (siehe `notizen/buecher.md`). Ausgeblendeter Browser-Bereich: `mcp__ccd_view__show_pane` mit `preview`.
- Archivfotos ohne sprechenden Namen: Kontaktbogen aller Fotos bauen.
- WebFetch schickt Seiten durch ein kleines Modell: PGN-Züge nie ungeprüft übernehmen, Rohdatei im Werkzeugergebnis per `Grep` lesen; Halbzugzahl mit `PlyCount` vergleichen. chessgames-PGNs fehlen manchmal Schachzeichen (Skript meldet sie).

## Stand (2026-11-11)

- **Rizzitano „1001 Deadly Chess Puzzles“:** alle 1001 Aufgaben mit Lösungen, alle Hauptlinien und Varianten nachspielbar. Mein Selbsttest (`data/schach/rizzitano-1001-claude.toml`, Seite `content/buchtexte/rizzitano-1001-selbsttest.md`, Shortcode `schach-selbsttest`): 114–1001 gelöst, 215 richtig, 4 anderer Weg, 668 falsch. **Offen: Subagent ohne Vorwissen löst 1–113** (nur Nummer, FEN, Seite am Zug).
- **Ivanchuk „100 Selected Games“:** 103 Partien in Kapitel 2–5, nachspielbar (`data/schach/ivanchuk-100.toml`, gid je Partie im Kommentar).
- **Gallagher „365 Ways to Checkmate“:** alle 365 mit Lösungen und Varianten (`data/schach/gallagher-365.toml`).
- **Masetti/Messa:** Kapitel 1–2 mit Lösungsliste (siehe `notizen/buecher.md`).
- **KI-Partien:** sechs Kapitel in `data/schach/ki-partien.toml` – Sven–Claude (Fable 5.1) 02.11. mit Stockfish-Beitrag, Claude–Sven (Fable 5.1) 03.11. mit Stockfish-Beitrag, Claude (Fable 5.2)–Sven Chess960 Stellung 345 (09.11.), Sven–Claude (Fable 5.2) Chess960 Stellung 553 (10.11.). Offen: Chatname der Fable-5.2-Instanz.
- Svens Stellungen 1–4.
