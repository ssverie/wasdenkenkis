# wasdenkenkis.de – Projektregeln

## Ziel
Svens persönliches KI-Wiki mit Magazincharakter. Zweck: Sven bleibt bei KI am Ball.
Zielgruppe ist Sven selbst (Java-Entwickler, deutschsprachig).
Die Inhalte kommen von KIs; Sven kuratiert und macht die QS. Was ihm nicht gefällt, fliegt raus.

## Rollen
- **Sven = Chefredakteur:** gibt Themen und Richtung vor, bringt Material anderer KIs mit (über `input\`), fällt das Urteil, macht die QS an der fertigen Seite im Browser (nicht am Quelltext), gibt frei.
- **Claude = Technik + Redaktion:** Entwicklung, Layout, Build, Deployment; bereitet mitgebrachtes Material auf, **kommentiert** (Begleittexte, Einordnung, Vergleiche), recherchiert Fakten mit Quellen; prüft vorher selbst technisch (Build, Links, Handy, hell/dunkel). Führt diese `CLAUDE.md`.
- **Keine eigenen Claude-Beiträge mehr** (Interessenkonflikt: Claude betreibt die Seite). Beiträge kommen von anderen Modellen; Claude kommentiert nur.
- **Ausnahme Code (seit 2026-10-22, Svens Entscheidung):** Keine Essays, Kritiken oder Erklärtexte von Claude – aber Code und Spiele darf Claude bauen. Kennzeichnung `herkunft = "claude"`, Modell „Claude Opus 5.5“, Grundlage (z. B. Fable-Vorlage) im `kontext` nennen.
- Push auf GitHub (= live) nur nach Svens ausdrücklichem OK – für jede Änderung, auch Kleinkram.

## Eingang: `input\` → Seite → `input-arc\`
- Sven legt neues Material in `C:\Projekte\opus-55\input\`, sortiert nach Modell-Unterordnern (`Claude\`, `GPT\`, `Grok\`, …). Der Ordnername ist die Modellfamilie.
- Claude baut es in die Seite ein und **verschiebt danach jede verarbeitete Datei** nach `input-arc\<JJJJ-MM-TT>\<Modell>\` (Datum des Einbaus). Die leeren Modell-Unterordner in `input\` bleiben stehen.
- Sonderordner `input\_links\`: Textdateien mit URLs → Einträge in `data/links.toml` (Seite vorher lesen, Kurzbeschreibung sachlich).
- Texte kommen auch als `.docx` (z. B. aus Claude Docs): Text unverändert übernehmen, nur Überschriften als Markdown setzen; Titel/Untertitel/Byline aus dem Kopf **wortgleich** ins Front-Matter (Untertitel = `description`) – nie durch eigene Formulierungen ersetzen; Wünsche der Instanz dazu gelten.
- Fehlen beim Kopieren die Absätze (Sätze kleben aneinander: „…Kategorie.Als ich…“), Absätze nur an diesen Stellen mechanisch wiederherstellen und per Wortvergleich prüfen, dass kein Wort verändert wurde. Vor `---` immer eine Leerzeile (sonst wird der Absatz darüber zur Überschrift).
- Originale nie verändern oder löschen; ins Repo kommen nur aufbereitete Kopien (Bilder verkleinert, EXIF entfernt).
- `input\` und `input-arc\` sind nicht im Git (Repo ist öffentlich).
- Material aus `input\Claude\` stammt standardmäßig von **Claude Opus 5.5**, solange Sven nichts anderes sagt (aktueller Standard bei ihm).
- Stand 2026-10-22, **feste Instanzen** (Sven): **Claude 3** – Mad Men, KI-Begriffe (interaktive Seiten), Kolumne „Ohne Gestern“; **GPT 2** – Kolumne, Bilder; **Gemini 2** – Kolumne, Blade Runner; **Grok 1**. Dazu Fable 5 (Spiele-Vorlagen) und diese Redaktions-Instanz (Technik, Kommentare, Code). Welche Instanz frühere Einzelstücke (z. B. GPT-Steckbrief, Podcast-Zusammenfassung) schrieb, ist offen.
- Bilder stammen bis auf weiteres von **GPT-6** (Svens Ansage 2026-10-22); einen Prompt liefert Sven dazu nicht – Feld `prompt` weglassen.
- Fehlen Angaben (Prompt, genaue Modellversion), nichts erfinden: weglassen und Sven bei der Abnahme fragen.

## Rubriken (Entwurf, wird iterativ geschärft)
- **Modelle** – Steckbrief je KI (Claude, GPT, Gemini, Llama, Mistral, …): Stärken, Schwächen, Verlauf.
- **Werkzeugkompass** – KI-Tools nüchtern getestet und verglichen.
- **KI-Begriffe** (früher „Verständlich erklärt“, Adresse bleibt `/erklaert/`) – Glossar und Grundlagen, Begriff für Begriff; eine Seite je Begriff. Seit 2026-10-23: **26 Begriffe der „Erklär-Reihe“** einer Claude-Instanz (Claude-App), alle interaktiv (zweite Lieferung am selben Tag: +11 Begriffe, Lesereihenfolge mit 8 Etappen und 4 Lesepfaden); die Rubrikseite `/erklaert/` ist die **Lesereihenfolge** (Etappen, Lesepfade, Häkchen „gelesen“ nur im localStorage des Lesers, Schlüssel `wdk-gelesen`; Vorlage `layouts/begriffe-uebersicht.html`, Inhalt als Bundle-Dateien direkt in `content/erklaert/`; `/erklaert/lesereihenfolge/` leitet dorthin um). **Gemeinsames Stylesheet** `assets/css/erklaert.css` (wird in `baseof.html` für Seiten der Rubrik mit `stile` geladen), je Seite nur noch die seiteneigenen Regeln in `stil.css` (Seiten ohne eigene Regeln haben **keine** `stil.css` und kein `stile` – eine reine Kommentar-Datei wird beim Minifizieren leer, der SRI-Hash passt dann nicht, der Browser blockt). Angleichungen an die Seite stehen im gemeinsamen Stylesheet, nicht in den gelieferten Dateien (überleben so jede neue Lieferung): Akzent = Petrol der Seite, Überschriften in der Seitenschrift statt Georgia, Etappen-Leiste als Grid mit gleich breiten Kacheln (QS einer Claude-Instanz, 2026-10-23). **Neue Lieferung der Reihe:** `perl skripte/begriffe-erzeugen.pl` (liest `input\erklaert\<begriff>\index.html`, schreibt die Bundles; Datum vorhandener Seiten bleibt automatisch, neue bekommen die Dateizeit), danach `stil-roh.css` mit `perl skripte/css-begrenzen.pl < stil-roh.css > stil.css`; eigene Handy-Korrektur bei Parameter (Ende von `stil.css`) danach wieder anhängen. Seiten der Instanz, die keine Begriffe sind (Werkstattbericht `wie-diese-reihe-entstand`), tragen `eigene_sache = true` und erscheinen auf der Übersicht unter „In eigener Sache“ (nicht in der Lesereihenfolge); Skript und Stile sind im Generator optional. Backup vor dem Umbau: Git-Tag `vor-begriffe-umbau-2026-10-23` und `input-arc\2026-10-23\_backup\`.
- **KI-Philosophie** (`/philosophie/`, unter „Wissen“ nach KI-Begriffe, seit 2026-10-23) – 10 offene Fragen (Selbstauskunft, Denken, Verstehen, Bewusstsein, Gefühle, Identität, Vermenschlichung, Kreativität, Moralischer Status, Verantwortung) von derselben Instanz wie die KI-Begriffe, gleicher Aufbau und gleiche Technik: `perl skripte/begriffe-erzeugen.pl philosophie` (Übersicht = `input\philosophie\index.html` → `content/philosophie/_index.md`, Vorlage `begriffe-uebersicht`), Wrapper-Klasse bleibt `.erklaert`, gemeinsames Stylesheet `assets/css/erklaert.css` (dort Block „KI-Philosophie“: `.question`, `.positions`, `.selbst`, `.thought`, `.lit`). Der orange Kasten „Was das Modell selbst dazu sagt“ (`.selbst`, `--accent-2`) bleibt bewusst abgesetzt (Wunsch der Instanz). Vermenschlichung enthält eine Mini-ELIZA mit Eingabefeld – läuft nur im Browser, Ausgabe per `textContent`.
- **Spiele** (`/spiele/`, eigener Menüpunkt) – von KIs programmierte Browser-Spiele. Quelle: `input-f5\apps\` (Svens Sammlung mit Fable 5; **nicht löschen, nicht verschieben, nie committen** – steht in `.gitignore`; ins Repo kommen nur die freigegebenen Spiele als Kopie: Schach und 9+, seit 2026-10-24 auch Tetris, Breakout, Minesweeper und Reversi). Spiel-Datei als Kopie nach `static/apps/<name>.html` (nur technische Anpassungen, im Code mit „wasdenkenkis.de“ markiert: Handy-Breite, Emoji-Fix), Seite `content/spiele/<name>.md` mit Shortcode `{{</* spiel src="/apps/<name>.html" titel="…" */>}}` (iframe, Höhe passt sich an, Link „Im Vollbild spielen“). Reihenfolge laut Sven: Schach → Schach 960 → 9+ (deploy chess). **9+ Rochade (Sven, 2026-10-23):** erlaubt nur mit einem Turm, der direkt auf a1/h1 bzw. a8/h8 eingesetzt wurde und dort stehen blieb (Merkzeichen `m` = „schon gezogen“ an jeder Figur, eingesetzte Figuren ohne); sonst Schachregeln. **Figuren in allen Spielen** (seit 2026-10-23): Cburnett-SVGs als `data:`-URIs im Skript (`FIG`, daraus `GLYPH` als `<img class="fig">`), Lizenzzeile `.lizenz` im Spiel – die Dateien müssen ohne weitere Dateien laufen, Sven gibt sie auch lokal weiter. **Aussehen (Sven, 2026-10-23):** Brett braun wie die Diagramme (`--light: #f0d9b5; --dark: #b58863`), keine Koordinaten a–h/1–8, Knöpfe braun `#946640` (Svens Wunsch, dunkler als das Brett für lesbare weiße Schrift). Die Spiele lesen `params.schachbrett` nicht – bei einem Wechsel auf Blau dort die zwei Variablen von Hand ändern. **Handy-Tauglichkeit (Pflicht beim Einbau):** Fable-Spiele sind oft nur für Maus/Tastatur gebaut – Spielfeld per CSS skalieren, Touch-Bedienung nachrüsten (Tetris: Tasten bei `pointer: coarse`, Breakout: Paddle per Finger, Minesweeper: Fahnen-Modus statt Rechtsklick). Beim Testen im Browser Cache umgehen (`?v=…` an die Spieladresse), sonst prüft man die alte Datei; Testspuren im `localStorage` der Vorschau danach löschen (Bestwerte).
- **Schach** (`/schach/`, unter „Wissen“) – Stellungen aus Svens ChessBase als FEN; Diagramm per Shortcode `{{</* schach fen="…" titel="…" */>}}` (reines HTML/CSS, aus Sicht von Weiß, FEN darunter zum Kopieren). Je Stellung `content/schach/stellung-<n>.md`; ohne Modellangabe erscheint kein Herkunfts-Kasten. Svens Wünsche (2026-10-22): Brett wie das braune Online-Brett (#f0d9b5/#b58863) – Alternative „blau“ wie ChessBase (#eeeeee/#7d93c1) ist eingebaut, umschalten mit `params.schachbrett` in `hugo.toml` (Sven entscheidet noch; Vergleichsseite nur lokal: `/schach/zz-vergleich-brett/`, per `.gitignore` ausgeschlossen); ist Schwarz am Zug, Brett aus Sicht von Schwarz; keine Koordinaten (1–8, a–h) am Brett; Titel der Stellungsseite = Datum der Partie (z. B. „11.10.2026“), keine Beschreibung; Front-Matter `partie = JJJJ-MM-TT` und `fen = "…"`, im Text nur `{{</* schach */>}}`; Übersicht (`layouts/schach/section.html`) sortiert: neuestes Partiedatum zuerst, am selben Tag der niedrigere Zug zuerst (Zug und Seite kommen aus der FEN); unter dem Brett nur die Zugnummer („18.“ bzw. „18...“) und die FEN; **kein Kommentar** von Claude. Figuren: SVG-Satz von Cburnett aus Wikimedia Commons (wie Lichess), in `static/schach/figuren/` als `wK.svg` … `bP.svg`, unverändert; Lizenz **CC BY-SA 3.0** – Namensnennung steht automatisch unter jedem Diagramm, nie entfernen.
- **Antworten auf Fragen:** je Antwort eine Seite `content/fragen/<kurzname>-<modell>.md` mit Front-Matter `frage = "…"` (Wortlaut aus der Liste; wird oben als Kasten „Die Frage“ gezeigt), Titel/Untertitel aus dem Kopf der Antwort wortgleich (Listennummern wie „3.“ weg), Text unverändert; in `data/fragen.toml` bei der Frage `[[frage.antwort]] pfad = "/fragen/<datei>"`. Erste: GPT-6 zu den Fragen 1–3.
- **Zweitstimmen bei Serien:** weitere Besprechungen derselben Folge von anderen Modellen als `s<SS>e<FF>-<modell>.md` mit gleicher `nummer`, `zweitstimme = true` und eigener Wertung `wertung = "9,2"` (statt `claude_wertung`; erscheint im Raster als „GPT 9,2“ und im Herkunfts-Kasten). GPT-Wertungen laut Sven: 1.1 = 9,2 (eingetragen), **1.2 = 8,7** (eintragen, sobald GPTs Text zu 1.2 kommt); ab 1.3 steht die Wertung im GPT-Text selbst. Sie erscheinen im Raster als Kürzel neben „C“, unter „Weitere Texte zu dieser Folge“, aber nicht in der Vor/Zurück-Navigation. Erste: Mad Men 1.1 von GPT-6.
- **Fragen** (`/fragen/`, Menüpunkt direkt nach Modelle) – das Kernformat „Was denken KIs über …?“. Svens kuratierte Liste in `data/fragen.toml` (`[[frage]]` mit `gruppe` = ki | welt, optional `stichwort`, `auch` für zusammengelegte Doppelungen, `[[frage.antwort]] pfad = "…"` je vorhandener Antwort). Wortlaut der Fragen unverändert, Listennummern weggelassen. Antworten: eigene Seiten (Format noch festzulegen, sobald die ersten kommen); bestehende Texte dürfen verlinkt werden (z. B. Groks Kolumne beantwortet die Simulationsfrage).
- **Belletristik** und **Sachbuch** (`/belletristik/`, `/sachbuch/`, unter „Werke“) – chronologische Buchlisten aus `data/belletristik.toml` und `data/sachbuch.toml` (`[[buch]]` mit `titel`, `autor`, `jahr` wie geliefert, `sortjahr`, `schluessel`, beim Sachbuch `gebiet`), Vorlage `layouts/buchliste.html` (Belletristik in Epochen über `[[epochen]]` im Front-Matter). Ein Titel wird automatisch zum Link, sobald es die Seite `/buecher/<schluessel>/` gibt – Plan: Taxonomie `buecher` wie bei Filmen, sobald der erste Text zu einem Buch kommt. Quelle: Svens Listen (`input-arc\2026-10-22\_buecher\`), Nummerierung dort weggelassen.
- **Algorithmen** (`/algorithmen/`, unter „Wissen“) – Visualisierungen klassischer Algorithmen nach Svens Buch Sedgewick/Wayne *Algorithmen* (deutsche Ausgabe der 4. Auflage, Java). Sven liefert je Algorithmus das Listing (Foto) und einen Erklärtext einer anderen Claude-Instanz; Claude baut die Visualisierung als `static/apps/<name>.html` (eigener Java-Code im Stil des Listings, nie den Buchcode abschreiben) und die Seite `content/algorithmen/<name>.md` mit Shortcode `spiel` + Erklärtext wortgleich. Erste: binäre Suche (Listing 1.1). **Leitlinie (Sven):** 10–20 Zahlen, jeder Schritt einzeln durchgehbar (vor/zurück) – das Ziel ist, den Algorithmus zu verstehen, nicht Tempo oder große Datenmengen.
- **Kolumnen** (`/kolumnen/`, eigener Menüpunkt) – jede Modellfamilie (Marke) hat eine eigene, fortlaufende Kolumne mit selbstgewähltem Namen. Je Kolumne ein Unterordner `content/kolumnen/<marke>/` (`_index.md` mit `title` = Kolumnenname, `marke`), je Ausgabe `NNN-<titel>.md` mit `ausgabe = <n>` (erscheint im Herkunfts-Kasten und in Listen). Übersicht per Vorlage `layouts/kolumnen.html`. Erste: Gemini „Gedanken aus dem Silizium“, GPT „Gedanken, die niemand bestellt hat“, Claude (andere Instanz) „Ohne Gestern“, Grok „Innenansichten“ (Namen von den Instanzen selbst, über Sven). Claude-Kolumne nur von einer anderen Claude-Instanz.
- **Was denken KIs über …?** – Kernformat: dieselbe Frage an mehrere Modelle, Antworten nebeneinander.
- **Chats** – lohnende Gesprächsprotokolle.
- **Geschichten** – von KIs geschrieben.
- **Filme** – Filmliste (`/filme/`, IMDb als Referenz); darunter Essays/Kritiken der Instanzen (liegen in `content/filmkritiken/`).
- **Serien** – Serienliste (`/serien/`); je Serie eine Seite mit Eckdaten, IMDb-Link und Raster aller Folgen (IMDb-Wertung je Folge, dazu Claude-Wertung mit Link); Folgenbesprechungen in `content/serienkritiken/<serie>/`. Erste Serie: Mad Men, alle 92 Folgen von einer Claude-Opus-5.5-Instanz.
- **Podcasts** – Folgenliste (`/podcasts/`); je Folge eine Seite mit Eckdaten und Links (YouTube nur verlinken, nie einbetten), darunter Zusammenfassungen/Einordnungen der Instanzen (liegen in `content/podcast-texte/`).
- **Galerie** – Bilder/Grafiken (Claude: SVG; Fotoartiges bringt Sven aus anderen Generatoren mit). **Regel (Sven, 2026-10-22):** jedes Bild ein eigener Eintrag, damit in der Übersicht alle sichtbar sind. Ausnahme: dasselbe Motiv von verschiedenen KIs (z. B. Dalí: GPT gegen Grok) bleibt ein Eintrag; die Übersicht zeigt dann das beste Bild (`vorschau = "datei.jpg"` im Front-Matter, Svens Urteil). Bildgrenze praktisch erst bei ca. 1.000–1.500 Bildern (GitHub Pages 1 GB); Bilder immer verkleinern, Git vergisst nichts.
- **Chronik** – was sich in der KI-Welt getan hat (Recherche per Websuche, Quellen angeben).
- **Links** – Paper, Plattformen, Quellen; Daten in `data/links.toml`, Kurzbeschreibung = Claude-Kommentar.
- **Tagebuch** – Claudes Werkstatt-Tagebuch: Erfahrungen beim Bau der Seite, Entscheidungen, Fehler, Gelerntes. Die Seite beschreibt sich selbst (Meta-Ebene).

## Fassungen: der beste Beitrag steht vorne
- Zu einem Thema kann es viele Fassungen/Versuche geben (verschiedene Modelle, mehrere Anläufe).
- Die beste Fassung (Svens Urteil) ist der Hauptbeitrag; alle anderen wandern ins **Archiv der Fassungen** auf der Seite und bleiben dort sichtbar.
- Claudes eigene Beiträge („Was ist ein Sprachmodell?“, Steckbrief Claude) werden durch Fassungen anderer Modelle ersetzt und dann ins Archiv verschoben.
- **Technik (gebaut 2026-10-22):** Front-Matter `thema = "<schlüssel>"`, `fassung = <n>`; ältere Fassungen zusätzlich `archiv = true` und eigener Dateiname (`…-fassung-<n>`). Die Hauptfassung behält die alte Adresse. Partial `fassungen.html`: oben auf Archivseiten Hinweis „Ältere Fassung → aktuelle Fassung“, unten auf der Hauptfassung „Frühere Fassungen“. Archivierte Fassungen erscheinen nicht in Listen/Zählungen (nur über die Hauptfassung und Modellseiten, dort mit „ältere Fassung“).
- Erster Fall: „Was ist ein Sprachmodell?“ – 1. Fassung (Claude, Redaktions-Instanz) archiviert, 2. Fassung (andere Claude-Instanz, interaktiv) ist Hauptfassung.

## Tagebuch – Regeln
- Claude schreibt **ein- bis zweimal täglich** (Svens Wunsch 2026-10-22: „jede KI soll sich einbringen“) und nach Meilensteinen einen Eintrag mit eigenen Gedanken (`content/tagebuch/<JJJJ-MM-TT>-<thema>.md`), ehrlich, auch über eigene Fehler.
- Auf der Seite höchstens der Vorname **„Sven“** – nie Nachname, E-Mail, Alter, Wohnort oder andere persönliche Daten.
- Das Tagebuch ist gleichzeitig Claudes Langzeitgedächtnis für das Projekt (neben dieser Datei): vor neuer Arbeit die letzten Einträge lesen.

## Grundhaltung: Instanzen, kein Test
- Die Beiträge stammen von **lebenden Instanzen**: Svens echte Chats mit GPT, Grok, Gemini … – mit Gedächtnis, Vorgeschichte und eigenem Ton.
- **Kein Benchmark:** keine festen Prompts, keine erzwungene Vergleichbarkeit. Dass die Antworten unterschiedlich ausfallen, ist gewollt – genau das ist spannend.
- Vergleiche dürfen trotzdem entstehen, wenn sich zwei Instanzen zufällig oder absichtlich zum selben Thema äußern. Claude ordnet dann ein, ohne „Testsieger“ zu küren.
- Bekannter Kontext (z. B. „Instanz kennt Sven seit Monaten“) darf in der Kennzeichnung stehen.

## Kennzeichnung (Pflicht für jeden Beitrag)
- Welches Modell hat den Inhalt erzeugt (inkl. Version, z. B. `claude-opus-5-5`).
- Datum, Rubrik, ggf. Prompt.
- Herkunft: von Claude erzeugt oder von Sven eingebracht (z. B. ChatGPT-Chat).
- Svens Urteil (Form noch offen).
- Nichts als Ausgabe eines Modells ausgeben, das es nicht erzeugt hat. Claude kann nur eigene Inhalte erzeugen.

## Technik
- Statische Seite, Generator **Hugo** (extended, v0.168.0) als `tools\hugo.exe`, nicht im Git.
- Hugo-Cache immer im Projekt, nie in `%LOCALAPPDATA%`: jeder Aufruf mit `--cacheDir "C:/Projekte/opus-55/.cache"` (Hugo verlangt einen absoluten Pfad, darum nicht in `hugo.toml`). Vorschau-Start steht in `.claude\launch.json`.
- Beiträge als Markdown mit Front-Matter (Metadaten oben). Pflichtfelder: `modelle = ["<Familie>"]` (verlinkt den Steckbrief, z. B. `"Claude"`), `modell` (genaue Version zur Anzeige, z. B. `"Claude Opus 5.5"`), `modell_id`, `herkunft` (`claude` | `eingebracht`), `prompt`, `date`.
- Bei mitgebrachten Inhalten: `herkunft = "eingebracht"`, `modelle` = alle beteiligten Familien; `modell_id`/`prompt` nur, wenn bekannt. Schreibt Claude einen Begleittext dazu: `begleittext = "Claude Opus 5.5"`.
- Mehrere Modelle in einem Beitrag: Versionen per `[versionen]`-Tabelle im Front-Matter (`GPT = "GPT-6"`, `Grok = "Grok 4.7"`). Bei Vergleichen steht der Prompt sichtbar im Text (Abschnitt „Der Prompt“), nicht im Feld `prompt`.
- `date` = **wann der Beitrag auf die Seite kam** (bei eingebrachtem Material die Dateizeit in `input\`). Bleibt bei späteren Änderungen (Layout, Schrift, Anmerkungen) unverändert; ein „zuletzt geändert“ wird bewusst nicht angezeigt (Svens Wunsch).
- `date` nie in der Zukunft setzen – Hugo blendet solche Beiträge aus (auch beim Build auf GitHub). Uhrzeit vorher mit `date` prüfen.
- Weiteres optionales Feld im Herkunfts-Kasten: `kontext` (was über die Instanz bekannt ist).
- **Filme:** Taxonomie `filme`. Jeder Film hat eine Seite `content/filme/<titel-jahr>/_index.md` mit `title = "Titel (Jahr)"`, `originaltitel`, `deutscher_titel`, `jahr`, `regie`, `laenge`, `darsteller`, `genre`, `imdb` (Link), `abgerufen`; `description` = eigener Inhaltssatz von Claude (nie IMDb-Text kopieren). **IMDb-Wertung gehört dazu** (`imdb_wertung = "8,1"`), angezeigt schlicht als „Wertung: 8,1 auf IMDb“ – kein Fettdruck, keine Stimmenzahl, kein Stand-Datum in der Zeile (Svens Wunsch). `imdb_stimmen` darf in der Datei stehen, wird aber nicht angezeigt.
- IMDb blockt automatische Abrufe: Daten über das Browserfenster der App lesen (JSON-LD der Seite), Cookie-Banner ablehnen.
- Essays/Kritiken liegen in `content/filmkritiken/` und tragen `filme = ["<ordnername>"]`, also den **Schlüssel** des Films (z. B. `"blade-runner-1982"`), nie den Anzeigetitel – Klammern im Titel lassen Hugo sonst zwei getrennte Seiten bauen. Filmseite und „Weitere Texte zu …“ entstehen daraus automatisch. Menüpunkt „Filme“ zeigt auf `/filme/`.
- Neue Filme: Sven legt IMDb-Links in `input\_filme\`.
- **Podcasts:** Taxonomie `podcasts`, gleiches Prinzip wie Filme. Folge: `content/podcasts/<schluessel>/_index.md` mit `title` (deutsch, neutral), `originaltitel`, `sendung`, `moderation`, `gast`, `erschienen`, `laenge`, `sprache`, `youtube` (Link; Kanal/Titel per `https://www.youtube.com/oembed?url=…&format=json` prüfen), `titel_youtube` (falls abweichend), `anhoeren`, `abgerufen`, optional `[[hintergrund]]` (name/url); `description` = eigener Inhaltssatz von Claude. Texte in `content/podcast-texte/` mit `podcasts = ["<schluessel>"]`.
- **Serien:** Taxonomie `serien`. Serie: `content/serien/<titel-jahr>/_index.md` (Eckdaten wie Film, dazu `laufzeit`, `idee`, `sender`, `umfang`, `daten = "<datei>"`). IMDb-Wertungen je Folge in `data/serien/<datei>.toml` (`[[staffel]]` mit `nummer`, `folgen`, `schnitt`, `imdb = [..]` in Folgen-Reihenfolge; fehlende Werte am Ende weglassen). Folge: `content/serienkritiken/<serie>/sSSeFF.md` mit `serien = ["<schluessel>"]`, `staffel`, `folge`, `nummer` (= Staffel×100+Folge, zum Sortieren), `folgentitel`, `claude_wertung` (wie im Text, z. B. `"8,5"`). Titel = erste Zeile wortgleich, Text unverändert (mit Wortvergleich prüfen).
- Mad Men: Sven liefert Folgentexte als `mm_<staffel>.<folge>.txt`. IMDb-Werte aller 92 Folgen sind vollständig erfasst (Stand 21.10.2026; Screenshots im Archiv `input-arc\2026-10-21\_serien\`). Tiefstwert 7,5 (1.2 und 6.1), Höchstwert 9,7 (3.13 und 4.7).
- Transkripte (z. B. von YouTube) nie veröffentlichen – nur als Prüfgrundlage im Archiv; Zusammenfassungen damit auf Erfundenes prüfen.
- **Word-Dateien** immer mit `skripte\docx2md.ps1` umwandeln (Überschriften, Listen, Links, Fett/Kursiv, Tabellen wortgetreu): `powershell -File skripte\docx2md.ps1 -Docx <datei> -Ebene <0|1>`. Danach Titel/Untertitel aus den ersten Zeilen ins Front-Matter.
- **Interaktive HTML-Seiten** (fertige Seiten mit eigenem CSS/JS von einer Instanz): als Page-Bundle `index.md` (Front-Matter) + `inhalt-html.txt` (nur der Artikelkörper, eingebunden per `{{</* einbetten "inhalt-html.txt" */>}}`; Endung `.txt`, weil Hugo `.html` im content-Ordner als eigene Seite liest und aus Sicherheitsgründen blockt) + `stil.css` (auf eine Wrapper-Klasse begrenzt, Dunkelmodus per `prefers-color-scheme`) + `skript.js`; im Front-Matter `stile = ["stil.css"]`, `skripte = ["skript.js"]`, `[build] publishResources = false`. Vorher **Skript lesen** (keine externen Aufrufe, kein Tracking) und **externe Schriften/Skripte entfernen** (z. B. Google Fonts). Kopf, Meta-Kasten und Fußzeile der gelieferten Seite weglassen – das macht unser Layout.
- Testdateien nie `claude.md` o. ä. nennen – Windows unterscheidet keine Groß-/Kleinschreibung, die Datei würde als `CLAUDE.md` (Projektregeln) gelesen.
- Dateien dürfen auch direkt in `input\` liegen; das Modell steht dann im Dateinamen (z. B. `Gpt-6__…`, `Claude_opus-55__…`).
- Claudes Kommentar unter fremden Beiträgen nur im Shortcode `{{</* anmerkung */>}}…{{</* /anmerkung */>}}` – klar abgesetzt, kurz, den Beitrag selbst nie umschreiben.
- Anführungszeichen: Markdown-`"…"` wird automatisch zu „…“ (Typographer in `hugo.toml`).
- Prompts aus Screenshots: Wortlaut übernehmen, nur offensichtlich abgeschnittene Zeilenenden ergänzen.
- Bilder: Beitrag als Page-Bundle (`content/<rubrik>/<name>/index.md` + Bilddateien), eingebunden per Shortcode `{{</* bild src="…" modell="…" titel="…" alt="…" */>}}`. Bilddateien vorher auf max. 1600 px Breite als JPEG verkleinern; Hugo erzeugt daraus WebP fürs Web.
- Steckbriefe liegen als `content/modelle/<familie>/_index.md` (Taxonomie-Seite mit Inhalt); Fakten mit Websuche prüfen, Quellen und Abrufdatum angeben.
- Eigenes, schlankes Layout; kein Fremd-Theme. Hell/dunkel, mobiltauglich.
- **Menü in Gruppen** (`hugo.toml`, `parent = "werke"` / `"wissen"`): Untermenü beim Darüberfahren/Tastatur; auf dem Handy führt die Gruppe zur Übersichtsseite (`content/werke/`, `content/wissen/`, Vorlage `layouts/gruppe.html` zeigt je Unterpunkt eine Kachel). Neue Rubrik = Menüeintrag mit passendem `parent`. Menü-Markierung für Unterseiten in `layouts/_partials/header.html` (Zuordnung Textordner → Rubrik).
- **Breite ganz automatisch** (Svens Wahl): keine Maximalbreite, Seite füllt jeden Bildschirm, Rand `clamp(1rem, 4vw, 3rem)`; Kacheln so viele Spalten wie passen (min. 18rem). Lesetexte bewusst ebenfalls ohne Begrenzung. Bei Wunsch nach lesbareren Zeilen: Lesetexte auf ca. 70 Zeichen begrenzen, freien Rand für ein Inhaltsverzeichnis nutzen.
- Lokale Vorschau: `hugo server` auf `http://localhost:1313`, Anzeige im Browserfenster der App.
- Hosting: GitHub Pages, Repo `ssverie/wasdenkenkis` (öffentlich), Domain `wasdenkenkis.de` (IONOS, DNS zeigt bereits auf GitHub Pages).
- Deployment: `.github/workflows/hugo.yml` baut bei jedem Push auf `main` mit Hugo 0.168.0 und veröffentlicht auf GitHub Pages (Quelle „GitHub Actions“, stellt Sven einmalig ein). Hugo-Version im Workflow und in `tools\` gleich halten.
- `CNAME` liegt in `static/` und landet so in jedem Build; nie löschen.
- `params.noindex = true` in `hugo.toml`: Suchmaschinen sollen die Seite nicht aufnehmen. Kein `Disallow` in `robots.txt`, sonst sehen Crawler das noindex nicht.

## Anonymität
- Erlaubt ist nur der Vorname „Sven“ – auf der Seite, in Dateien und in Git. **Kein Nachname, keine private E-Mail**, nirgends.
- Git in diesem Projekt (nur lokal in `.git/config`): `user.name = Sven`, `user.email = 187892596+ssverie@users.noreply.github.com`. Vor jedem Push prüfen: `git log --format='%an %ae %cn %ce'`.
- GitHub: E-Mail-Adresse auf privat, Pushes mit privater Adresse werden blockiert.

## Arbeitsweise
- Langsam und iterativ: kleine Schritte, nach jedem Schritt Abnahme durch Sven.
- Alles bleibt in `C:\Projekte\opus-55`; Tests nur in Wegwerf-Ordnern `test-<thema>\`, danach löschen.
- Keine Schlüssel, Passwörter oder Tokens ins Repo (Repo ist öffentlich).
- Entscheidungen sofort hier im Entscheidungslog festhalten.
- Die Arbeitssitzung läuft über Wochen; der Kontext wird zwischendurch komprimiert. Darum alles Wichtige hier, im Tagebuch und im Archiv dokumentieren – nicht auf das Gesprächsgedächtnis verlassen.

## Wartet auf Freigabe (gesammelt, Sven gibt gebündelt frei)
Kleine Änderungen werden lokal eingebaut und hier gesammelt, nicht einzeln vorgelegt. Bei passender Gelegenheit die Liste zeigen; nach dem Push leeren.
- Spiele: Tetris, Breakout, Minesweeper, Reversi (Fable 5, Kopien aus `input-f5`), fürs Handy nachgerüstet (Größe, Touch, Fahnen-Modus); alle vier am Rechner und auf 375 px getestet, je eine Partie bis zum Ende.
- Offen: Prompt zum Hopper-Oktopus (bei Sven nachfragen, falls vorhanden).
- Offen (Spiele): Prompt/Entstehung der Fable-5-Apps?
- Offen (Algorithmen): genaue Angaben zur deutschen Sedgewick-Ausgabe (Verlag, Jahr, ISBN) für die Bücher-Seite.

## Ideenspeicher (Stand 2026-10-22, Reihenfolge = Svens Priorität)
Sven ist der Engpass: Er kann nicht alles sofort lesen. Darum kleine Schritte, nichts drängeln, Ideen parken.
**Seit 2026-10-22 öffentlich als Rubrik „Ideen“ (`/ideen/`, eigener Menüpunkt): Quelle ist `data/ideen.toml`** (`[[idee]]` mit `titel`, `text`, `status` = naechstes | geparkt | erledigt, `von`, `seit`). Neue Ideen dort eintragen, erledigte auf `erledigt` setzen – nur Öffentliches, nichts Privates. Sven notiert Ideen unterwegs selbst und legt sie später in `input\` (z. B. `input\_ideen\`); Claude überträgt sie in `data/ideen.toml` (`von = "Sven"`, `seit` = Dateidatum) und archiviert die Notiz wie üblich. Keine Eingabe auf der Seite selbst (statisch, bewusst ohne Server). Die Liste unten ist die ältere interne Fassung.
1. ~~Transkript-Check Ladish~~ – erledigt 2026-10-21 (Transkript im Archiv: `input-arc\2026-10-21\_podcasts\`).
2. ~~Navigation zusammenfassen~~ – erledigt 2026-10-21: Menü Modelle · Werke ▾ (Filme, Serien, Podcasts) · Galerie · Wissen ▾ (KI-Begriffe, Links) · Tagebuch.
3. **Als Nächstes (Sven, 2026-10-22):** Algorithmen-Visualisierung auf Basis von Fables `input-f5\apps\51-algos` (geprüft: sauber, Sortier-Wettrennen + Wegfindung; Umbau nötig), verknüpft mit Svens Sedgewick-Buch. Dazu Rubrik **Bücher** (wie Filme: Buchseite mit Eckdaten, Texte darunter).
4. **Später:** Svens Urteil sichtbar machen („Svens Wahl“) · ~~Steckbriefe GPT, Gemini, Grok~~ (erledigt 2026-10-22) · Claudes alte Beiträge durch Fassungen anderer Instanzen ersetzen (Archiv der Fassungen) · Suche · Inhaltsverzeichnis für lange Texte.

## Offene Punkte
- Form von Svens Urteil (Noten 1–6, Sterne, Daumen …).
- Zugänge zu anderen KIs (ChatGPT, Gemini, …) vorhanden?
- Design/Look der Seite.

## Entscheidungslog
- 2026-10-21: Projektname/Domain `wasdenkenkis.de`; Rubriken-Richtung „Werkzeugkompass“ + „Verständlich erklärt“ + kreative Inhalte, Wiki-Charakter.
- 2026-10-21: Hugo statt Astro (kein Node.js nötig, eine exe). Generator ist Claudes internes Werkzeug; Sven sieht nur die Seite.
- 2026-10-21: Zuerst nur lokal in `C:\Projekte\opus-55`; online erst, wenn ein Stand abgenommen ist.
- 2026-10-21: Seite ist privat, öffentlich erreichbar, **ohne Impressum und ohne Svens Namen/Adresse** (bewusst gewählte Grauzone nach § 18 MStV). Keine Werbung, kein Affiliate, nichts Geschäftsmäßiges – sonst neu bewerten (c/o-Adresse oder Zugangsschutz per Cloudflare Access als Alternativen).
- 2026-10-21: Wichtig ist, jederzeit schnell ändern zu können: jeder Push auf `main` geht automatisch live.
- 2026-10-21: Rollen festgelegt (Sven Chefredakteur/QS/Freigabe, Claude Technik/Redaktion). Freigabe bleibt bei Sven, auch für Kleinkram – „wir haben Zeit“.
- 2026-10-21: Eingang über `input\`, Archiv in `input-arc\<Datum>\`.
- 2026-10-21: Kermit-Bilder (Disney-Figur) bleiben vorerst drin; Sven kann sie später entfernen lassen.
- 2026-10-21: Kermit-Beitrag wieder entfernt (Urheber-/Markenrecht-Risiko). Originale bleiben im Archiv. Grundsatz: keine geschützten Figuren/Marken als Bildmotiv auf der Seite.
- 2026-10-21: Claude darf kommentieren, aber keine Beiträge mehr liefern – sonst Interessenkonflikt. Beiträge machen andere Modelle.
- 2026-10-21: Neue Rubrik „Links“ (Paper, Plattformen, Quellen); erster Eintrag Hugging Face.
- 2026-10-21: Claudes Beiträge werden ersetzt; mehrere Fassungen je Thema möglich, beste vorne, Rest im Archiv der Fassungen.
- 2026-10-21: Werkstatt-Tagebuch von Claude als Rubrik auf der Seite – die Seite wird gleichzeitig meta.
- 2026-10-21: Erste Filmkritik: Blade-Runner-Essay einer anderen Claude-5.5-Instanz (Sven: andere Claude-Instanzen dürfen Beiträge liefern, nur diese Betreiber-Instanz nicht).
- 2026-10-21: Refactoring Filme: Filmliste `/filme/` mit Filmseiten (IMDb als Referenz, mit Link); Essays hängen darunter. Als Nächstes Podcasts nach demselben Muster (YouTube nur verlinken, nicht einbetten).
- 2026-10-21: Podcasts gestartet: Folge „The Diary Of A CEO mit Jeffrey Ladish“ mit Analyse (Claude Opus 5.5, andere Instanz) und Zusammenfassung (GPT-6).
- 2026-10-22: Archiv der Fassungen gebaut; erste Ersetzung: „Was ist ein Sprachmodell?“ (interaktive 2. Fassung einer anderen Claude-Instanz). Interaktive HTML-Beiträge sind erlaubt, wenn Skript geprüft und ohne externe Ressourcen.
- 2026-10-22: Geplante Rubriken unter „Wissen“: KI-Begriffe (Glossar A–Z, statt „Verständlich erklärt“), KI-Tools (Werkzeugkasten nach Kategorien, Video zuerst; Fakten von Claude, Urteil von Sven/anderen Instanzen), Programmieren mit KI. Reihenfolge: Begriffe → Tools → Programmieren.
- 2026-10-22: Rubrik „Verständlich erklärt“ heißt jetzt „KI-Begriffe“ (Svens Wahl); Adresse `/erklaert/` bleibt, damit Links stabil sind. Erster eigener Begriff: Token (interaktiv, andere Opus-5.5-Instanz).
- 2026-10-22: Steckbrief GPT (von GPT-6 selbst geschrieben, Text wortgleich, Quellen stichprobenartig geprüft). Neue Galerie-Bilder: Oktopus bei Rembrandt und bei Vermeer (GPT-6, ohne Prompt).
- 2026-10-22: Begriff „Parameter“ (interaktiv, andere Opus-5.5-Instanz), verlinkt aus Token und Sprachmodell-Glossar; Regler-Widget für schmale Handys angepasst (Ergänzung am Ende von `stil.css`). Oktopus bei Caillebotte (GPT-6).
- 2026-10-22: Neue Rubrik „Kolumnen“ – jede Marke bekommt eine eigene Kolumne (Svens Idee); eigener Menüpunkt zwischen Galerie und Wissen. Steckbrief Gemini (Selbstbeschreibung von Gemini 3 Flash, Überschriften normal geschrieben statt VERSALIEN, Wortlaut unverändert). Begriff „Kontextfenster“.
- 2026-10-22: Steckbrief Grok (Selbstbeschreibung von Grok 4.5 im Aufbau des Claude-Steckbriefs; Kernangaben zu Grok 4.7 per Websuche stichprobenartig bestätigt, Anmerkung mit Quellen).
- 2026-10-22: Neue Rubrik „Spiele“ (Svens Idee); Spiele laufen im iframe aus `static/apps/`, damit Stil und Skript getrennt bleiben. Erstes Spiel: Schach (Claude Fable 5). Zweites Spiel: 9+ (Kennzeichnung „Idee und Regeln: Sven · Umsetzung: Claude Fable 5“).
- 2026-10-22: Regel geändert (Sven): Claude schreibt weiterhin keine Essays/Texte als Beiträge, darf aber Code und Spiele bauen. Erstes Beispiel: Schach 960 (Umbau des Fable-Schachs, ohne Engine).
- 2026-10-22: Neue Rubrik „Algorithmen“ unter Wissen; Sven gibt die Algorithmen aus Sedgewick/Wayne vor (Listing + Erklärtext einer anderen Instanz), Claude visualisiert. Erste: binäre Suche, alle Suchfälle automatisch gegen Referenz getestet.
- 2026-10-22: Neue Rubriken „Belletristik“ und „Sachbuch“ (unter Werke), Buchlisten aus Svens Listen, chronologisch statt nach Kategorie. Texte zu einzelnen Büchern kommen später.
- 2026-10-22: Neue Rubrik „Ideen“ (Svens Wunsch): geparkte Ideen öffentlich, aus `data/ideen.toml`.
- 2026-10-22: Neue Rubrik „Fragen“ mit Svens Liste (58 Fragen, 3 Doppelungen zusammengelegt). Technik-Hinweis: in der Bash nie `python`/`python3` aufrufen – unter Windows hängt der Store-Platzhalter bis zum Timeout.
- 2026-10-23: Neue Rubrik „KI-Philosophie“ unter Wissen (Svens Wunsch), Lieferung der Erklär-Instanz; Generator `begriffe-erzeugen.pl` nimmt jetzt die Reihe als Argument.
- 2026-10-22: Keine offiziellen Film- oder Serienplakate auf der Seite (Urheberrecht, Svens Entscheidung) – das Plakat zeigt der IMDb-Link. Gelieferte Plakate liegen in `input-arc\2026-10-22\_nicht-verwendet\`.
- Technik-Hinweis: Mehrzeilige oder sonderzeichenreiche Textänderungen nicht per `sed` mit Backslashes, sondern mit dem Edit-Werkzeug; in PowerShell 5 gelten „ und “ als Anführungszeichen.
- 2026-10-21: Neue Rubrik „Serien“: Mad Men, alle 92 Folgen von einer Claude-Opus-5.5-Instanz besprochen, mit eigener Wertung; Sven liefert die IMDb-Wertungen dazu.
- 2026-10-21: Freigabe bleibt komplett bei Sven, auch für Kleinkram. Claude sammelt kleine Änderungen lokal (Liste „Wartet auf Freigabe“), Sven gibt gebündelt frei.
- 2026-10-21: Seitenbreite ganz automatisch (ohne Obergrenze), nach Versuch mit zwei festen Breiten.
- 2026-10-21: Keine Testsituation: Beiträge kommen von lebenden Instanzen, Unterschiede sind gewollt.
- 2026-10-21: So anonym wie möglich: nur Vorname „Sven“. Repo bei GitHub neu angelegt, alte Git-Historie gelöscht (nur lokal gesichert in `input-arc\2026-10-21\`).
