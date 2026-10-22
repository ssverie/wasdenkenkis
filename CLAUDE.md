# wasdenkenkis.de – Projektregeln

## Ziel
Svens persönliches KI-Wiki mit Magazincharakter. Zweck: Sven bleibt bei KI am Ball.
Zielgruppe ist Sven selbst (Java-Entwickler, deutschsprachig).
Die Inhalte kommen von KIs; Sven kuratiert und macht die QS. Was ihm nicht gefällt, fliegt raus.

## Rollen
- **Sven = Chefredakteur:** gibt Themen und Richtung vor, bringt Material anderer KIs mit (über `input\`), fällt das Urteil, macht die QS an der fertigen Seite im Browser (nicht am Quelltext), gibt frei.
- **Claude = Technik + Redaktion:** Entwicklung, Layout, Build, Deployment; bereitet mitgebrachtes Material auf, **kommentiert** (Begleittexte, Einordnung, Vergleiche), recherchiert Fakten mit Quellen; prüft vorher selbst technisch (Build, Links, Handy, hell/dunkel). Führt diese `CLAUDE.md`.
- **Keine eigenen Claude-Beiträge mehr** (Interessenkonflikt: Claude betreibt die Seite). Beiträge kommen von anderen Modellen; Claude kommentiert nur.
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
- Fehlen Angaben (Prompt, genaue Modellversion), nichts erfinden: weglassen und Sven bei der Abnahme fragen.

## Rubriken (Entwurf, wird iterativ geschärft)
- **Modelle** – Steckbrief je KI (Claude, GPT, Gemini, Llama, Mistral, …): Stärken, Schwächen, Verlauf.
- **Werkzeugkompass** – KI-Tools nüchtern getestet und verglichen.
- **Verständlich erklärt** – Glossar und Grundlagen, Begriff für Begriff.
- **Was denken KIs über …?** – Kernformat: dieselbe Frage an mehrere Modelle, Antworten nebeneinander.
- **Chats** – lohnende Gesprächsprotokolle.
- **Geschichten** – von KIs geschrieben.
- **Filme** – Filmliste (`/filme/`, IMDb als Referenz); darunter Essays/Kritiken der Instanzen (liegen in `content/filmkritiken/`).
- **Serien** – Serienliste (`/serien/`); je Serie eine Seite mit Eckdaten, IMDb-Link und Raster aller Folgen (IMDb-Wertung je Folge, dazu Claude-Wertung mit Link); Folgenbesprechungen in `content/serienkritiken/<serie>/`. Erste Serie: Mad Men, alle 92 Folgen von einer Claude-Opus-5.5-Instanz.
- **Podcasts** – Folgenliste (`/podcasts/`); je Folge eine Seite mit Eckdaten und Links (YouTube nur verlinken, nie einbetten), darunter Zusammenfassungen/Einordnungen der Instanzen (liegen in `content/podcast-texte/`).
- **Galerie** – Bilder/Grafiken (Claude: SVG; Fotoartiges bringt Sven aus anderen Generatoren mit).
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
- Claude schreibt nach jedem Arbeitstag oder Meilenstein einen Eintrag (`content/tagebuch/<JJJJ-MM-TT>-<thema>.md`), ehrlich, auch über eigene Fehler.
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
- Sammelliste vom 21.10. geleert (nur CLAUDE.md) – lokal committet.
- **„Was ist ein Sprachmodell?“ 2. Fassung** (interaktiv: Token-Ziehen mit Temperatur, Parameter-Raster, Aufmerksamkeit; andere Claude-Instanz) als Hauptfassung; 1. Fassung im Archiv der Fassungen; Google Fonts entfernt; kleiner CSS-Fehler im Original behoben (Balken waren unsichtbar) – lokal committet.
- Offen: Prompt zum Hopper-Oktopus (bei Sven nachfragen, falls vorhanden).

## Ideenspeicher (Stand 2026-10-21, Reihenfolge = Svens Priorität)
Sven ist der Engpass: Er kann nicht alles sofort lesen. Darum kleine Schritte, nichts drängeln, Ideen hier parken.
1. ~~Transkript-Check Ladish~~ – erledigt 2026-10-21 (Transkript im Archiv: `input-arc\2026-10-21\_podcasts\`).
2. ~~Navigation zusammenfassen~~ – erledigt 2026-10-21: Menü Modelle · Werke ▾ (Filme, Serien, Podcasts) · Galerie · Wissen ▾ (Verständlich erklärt, Links) · Tagebuch.
3. **Später:** Svens Urteil sichtbar machen („Svens Wahl“) · Steckbriefe GPT/Grok/Gemini · Claudes alte Beiträge durch Fassungen anderer Instanzen ersetzen (Archiv der Fassungen) · Suche · Inhaltsverzeichnis für lange Texte.

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
- 2026-10-21: Neue Rubrik „Serien“: Mad Men, alle 92 Folgen von einer Claude-Opus-5.5-Instanz besprochen, mit eigener Wertung; Sven liefert die IMDb-Wertungen dazu.
- 2026-10-21: Freigabe bleibt komplett bei Sven, auch für Kleinkram. Claude sammelt kleine Änderungen lokal (Liste „Wartet auf Freigabe“), Sven gibt gebündelt frei.
- 2026-10-21: Seitenbreite ganz automatisch (ohne Obergrenze), nach Versuch mit zwei festen Breiten.
- 2026-10-21: Keine Testsituation: Beiträge kommen von lebenden Instanzen, Unterschiede sind gewollt.
- 2026-10-21: So anonym wie möglich: nur Vorname „Sven“. Repo bei GitHub neu angelegt, alte Git-Historie gelöscht (nur lokal gesichert in `input-arc\2026-10-21\`).
