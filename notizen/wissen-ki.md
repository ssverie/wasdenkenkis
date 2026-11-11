# Wissen › KI – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11. Die vollständige Geschichte steht wortgleich in `notizen/chronik/wissen-ki.md` (jede Begriffs-Lieferung, jeder Forscher mit Eckdaten und Quellen). Neue Lieferungen dort unten anhängen.

## Aufbau

- Gruppe **Wissen › KI** (`content/wissen/ki/_index.md`, `layout = "gruppe"`, `menu_gruppe = "wissen-ki"`), Unterpunkte nach Gewicht: KI-Begriffe 1, KI-Philosophie 2, KI-Tools 3, KI-Forscher 4, KI-Konzepte 5, KI-Fehler 6. Eine Untergruppe mit `layout = "gruppe"` zeigt in `gruppe-kacheln.html` ihre Unterpunkte statt einer Zahl.
- `siehe_auch = ["/pfad/"]` im Front-Matter zeigt „Siehe auch“ unter dem Text (`layouts/page.html`; unbekannter Pfad bricht den Bau ab).

## KI-Begriffe (`/erklaert/`) und KI-Philosophie (`/philosophie/`)

- Instanz „22.10.2026 - 11:42 - Konzepte“ (Chat „Erklär-Reihe“), interaktive Seiten. `/erklaert/` ist die **Lesereihenfolge** (Etappen, Lesepfade, Häkchen in `localStorage` „wdk-gelesen“; Vorlage `layouts/begriffe-uebersicht.html`).
- **Einbau:** `perl skripte/begriffe-erzeugen.pl` (bzw. `… philosophie`) liest `input\erklaert\<begriff>\index.html` und schreibt die Bundles; übernimmt `instanz` und `siehe_auch` aus der vorhandenen `index.md`, Datum vorhandener Seiten bleibt. Danach `perl skripte/css-begrenzen.pl < stil-roh.css > stil.css` für neue Seiten.
- **Regel der Lieferung (LIESMICH, abgesprochen mit Sven):** Seiten, die nicht unter Neu/Aktualisiert stehen, nicht übernehmen – unsere Fassung ist maßgeblich. Konkret: **token** nach jedem Lauf per `git checkout` zurücksetzen (unsere Fassung hat `id="bpe"`), Diff prüfen, nur angekündigte Seiten dürfen sich ändern.
- **Neue Seite:** `date` von Hand auf die Dateizeit mit **+01:00** im Winter (der Generator rechnet fest mit +02:00), `instanz` von Hand.
- Gemeinsames Stylesheet `assets/css/erklaert.css` (Angleichungen an die Seite stehen dort, nicht in den Lieferungen); Seiten ohne eigene Regeln haben **keine** `stil.css` (leere Datei → SRI-Hash passt nicht). Google Fonts fallen beim Einbau weg. Skripte lesen (keine externen Aufrufe, kein `eval`, `innerHTML` nur mit festen Texten).
- Seiten „In eigener Sache“ mit `eigene_sache = true`.

## KI-Tools (`/ki-tools/`)

- `data/kitools.toml` (`[[kategorie]]`, `[[werkzeug]]` name/url/kategorie/rolle/preis/text, `[[quelle]]`), Vorlage `layouts/ki-tools/section.html`. Sven: „keine Meinung, geht nur um die Tool-Liste“. Nicht verwechseln mit **Tools** (von KIs programmierte Werkzeuge).

## KI-Forscher (`/wissen/ki/ki-forscher/`)

- Je Forscher `<name>.md` mit `layout = "forscher"`, `weight`, Eckdaten aus Wikipedia (`geboren`, `wirkt`, `bekannt`, `wikipedia`, `abgerufen`) und **`suchname`** (regulärer Ausdruck, z. B. `"Stuart Russell|Russell und Norvig"`, damit Bertrand Russell nicht greift). Beiträge sammelt `forscher-beitraege.html` automatisch (Podcastfolgen mit passendem `gast`, Texte dazu, Erwähnungen, eigener Kanal). Rücklink „· mehr zu <Name>“ auf Folgenseiten.
- Vorhanden: Yampolskiy, Hinton, Bostrom, Russell, Bengio.

## KI-Konzepte (`/wissen/ki/ki-konzepte/`)

- Interaktive Seiten wie die KI-Begriffe (Page-Bundle mit `inhalt-html.txt` im Wrapper `.erklaert`, `stil.css`, `skript.js`); gelieferte Seite per Perl zerlegen (`:root`/`body`/Kopf weg, Selektoren mit `.erklaert ` davor, Titel/Untertitel wortgleich ins Front-Matter). Nach Änderungen an `baseof.html` den Vorschau-Server neu starten.
- Erste Seite: „Backpropagation – wie ein Netz einen Vogel erkennen lernt“ (Instanz „Konzepte“, entlang des Hinton-Gesprächs).

## KI-Fehler (`/wissen/ki/ki-fehler/`)

- Fehlerberichte der Modelle. Erster: GPT-6 zum Mad-Men-Staffel-2-Archiv (gekürzte Folgen 2.4/2.8), mit Svens Nachfragen und meiner Anmerkung; `siehe_auch` ↔ Reward Hacking.

## Stand (2026-11-11)

- 31 KI-Begriffe in der Lesereihenfolge (zuletzt Reinforcement Learning, Gradientenabstieg, Reward Hacking, Skalierungsgesetze, Prompt-Injection), 10 Philosophie-Fragen, 5 Forscher, 1 Konzept, 1 Fehlerbericht.
- Offen: `dateizeit` im Generator rechnet fest mit +02:00.
