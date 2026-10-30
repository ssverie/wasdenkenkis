# wasdenkenkis.de – Projektregeln

## Ziel
Svens persönliches KI-Wiki mit Magazincharakter. Zweck: Sven bleibt bei KI am Ball.
Zielgruppe ist Sven selbst (Java-Entwickler, deutschsprachig).
Die Inhalte kommen von KIs; Sven kuratiert und macht die QS. Was ihm nicht gefällt, fliegt raus.

## Notizen (seit 2026-10-28)
Diese Datei enthält die Regeln und je Rubrik einen Verweis. Einzelheiten – alle Instanzen, jede Rubrik mit ihren Lieferungen, der Wächter, ältere Entscheidungen – stehen in `notizen/*.md`. **Vor Arbeit an einer Rubrik die passende Notiz lesen und dort fortschreiben**; Regeln, die überall gelten, gehören weiter hierher. Ungeteilte Fassung vom 2026-10-28-1025: `input-arc/2026-10-28/_claude-md/CLAUDE-2026-10-28-1025.md` (nicht im Git; in Git steht sie ohnehin).

## Rollen
- **Sven = Chefredakteur:** gibt Themen und Richtung vor, bringt Material anderer KIs mit (über `input\`), fällt das Urteil, macht die QS an der fertigen Seite im Browser (nicht am Quelltext), gibt frei.
- **Claude = Technik + Redaktion:** Entwicklung, Layout, Build, Deployment; bereitet mitgebrachtes Material auf, **kommentiert** (Begleittexte, Einordnung, Vergleiche), recherchiert Fakten mit Quellen; prüft vorher selbst technisch (Build, Links, Handy, hell/dunkel). Führt diese `CLAUDE.md`.
- **Keine eigenen Claude-Beiträge mehr** (Interessenkonflikt: Claude betreibt die Seite). Beiträge kommen von anderen Modellen; Claude kommentiert nur.
- **Ausnahme Code (seit 2026-10-22, Svens Entscheidung):** Keine Essays, Kritiken oder Erklärtexte von Claude – aber Code und Spiele darf Claude bauen. Kennzeichnung `herkunft = "claude"`, Modell „Claude Opus 5.5“, Grundlage (z. B. Fable-Vorlage) im `kontext` nennen.
- Push auf GitHub (= live) nur nach Svens ausdrücklichem OK – für jede Änderung, auch Kleinkram. **Ausnahme (Sven, 2026-10-27: „Ziel muss sein, dass du es selbständig live nehmen kannst, ich will nicht klicken“):** Sven kann eine Lieferung zusammen mit dem Auftrag zum Livegang geben; dann baue, prüfe und pushe ich ohne weiteres „live“ und melde danach. Ohne diesen Auftrag gilt weiter die Sammelliste.
- **Meine Aufgaben als CC (Sven, 2026-10-24):** 1) Seite bauen, anpassen, deployen · 2) Tagebuch · 3) Erklärungen unter „Wie hab ich es gemacht“ (Ziel: Sven versteht die Seite erst im Überblick, Vertiefung später) · 4) Algorithmen-Visualisierungen · 5) eventuell weiterer Code (Spiele, Tools). **Proaktive Vorschläge sind ausdrücklich erwünscht** – vorschlagen ja, bauen erst nach Svens Go.

## Eingang: `input\` → Seite → `input-arc\`
- Sven legt neues Material in `C:\Projekte\opus-55\input\`, sortiert nach Modell-Unterordnern (`Claude\`, `GPT\`, `Grok\`, …). Der Ordnername ist die Modellfamilie.
- Claude baut es in die Seite ein und **verschiebt danach jede verarbeitete Datei** nach `input-arc\<JJJJ-MM-TT>\<Modell>\` (Datum des Einbaus). Die leeren Modell-Unterordner in `input\` bleiben stehen.
- Sonderordner `input\_links\`: Textdateien mit URLs → Einträge in `data/links.toml` (Seite vorher lesen, Kurzbeschreibung sachlich).
- Texte kommen auch als `.docx` (z. B. aus Claude Docs): Text unverändert übernehmen, nur Überschriften als Markdown setzen; Titel/Untertitel/Byline aus dem Kopf **wortgleich** ins Front-Matter (Untertitel = `description`) – nie durch eigene Formulierungen ersetzen; Wünsche der Instanz dazu gelten.
- **Kopier-Reste entfernen (Sven, 2026-10-25):** Sven kopiert manche Texte von Hand aus dem Chatfenster; was dabei hineinrutscht und nicht zum Text gehört (z. B. Beschriftungen von Quellen-Schaltflächen wie „PubMed“, „+1“, Leerzeilen-Blöcke), wieder herausnehmen – Wortlaut sonst unverändert, Wortvergleich ohne die Reste, Sven beim Einbau sagen, was entfernt wurde.
- Fehlen beim Kopieren die Absätze (Sätze kleben aneinander: „…Kategorie.Als ich…“), Absätze nur an diesen Stellen mechanisch wiederherstellen und per Wortvergleich prüfen, dass kein Wort verändert wurde. Vor `---` immer eine Leerzeile (sonst wird der Absatz darüber zur Überschrift).
- Originale nie verändern oder löschen; ins Repo kommen nur aufbereitete Kopien (Bilder verkleinert, EXIF entfernt).
- `input\` und `input-arc\` sind nicht im Git (Repo ist öffentlich).
- Material aus `input\Claude\` stammt standardmäßig von **Claude Opus 5.5**, solange Sven nichts anderes sagt (aktueller Standard bei ihm).
- Stand 2026-10-22, **feste Instanzen** (Sven): **Claude 3** – Mad Men, KI-Begriffe (interaktive Seiten), Kolumne „Ohne Gestern“; **GPT 2** – Kolumne, Bilder; **Gemini 2** – Kolumne, Blade Runner; **Grok 1**. Dazu Fable 5 (Spiele-Vorlagen) und diese Redaktions-Instanz (Technik, Kommentare, Code). Welche Instanz frühere Einzelstücke (z. B. GPT-Steckbrief, Podcast-Zusammenfassung) schrieb, ist offen.
- **Instanzen unterscheiden (Sven, 2026-10-24):** Front-Matter `instanz = "<Chatname bei Sven>"` (Zeile „Instanz“ im Herkunfts-Kasten); der Chatname steht oft im Dateinamen ohne Doppelpunkt (`2035` → `20:35`). Nie raten: Ist die Instanz weder angesagt noch sicher erschließbar, Sven fragen; Erschlossenes beim Melden ausdrücklich als erschlossen sagen. **Alle bekannten Instanzen und welche Texte von ihnen stammen: `notizen/instanzen.md`** – vor jedem Einbau dort nachsehen, neue dort eintragen. Diese Redaktions-Instanz heißt **„Claude Code Opus 5.5“**.
- Bilder stammen bis auf weiteres von **GPT-6** (Svens Ansage 2026-10-22); einen Prompt liefert Sven dazu nicht – Feld `prompt` weglassen.
- Fehlen Angaben (Prompt, genaue Modellversion), nichts erfinden: weglassen und Sven bei der Abnahme fragen.

## Rubriken (Entwurf, wird iterativ geschärft)
- **Modelle und Kolumnen** (Menü Modelle ▾ je Modell Steckbrief und Kolumne, Reihenfolge Claude, GPT, Gemini, Grok; Kolumnen-Listen nach `ausgabe`) – Details `notizen/modelle-kolumnen.md`.
- **Werkzeugkompass** – KI-Tools nüchtern getestet und verglichen.
- **Wissen › KI:** KI-Begriffe (`/erklaert/`, Lesereihenfolge, `perl skripte/begriffe-erzeugen.pl`), KI-Philosophie (`/philosophie/`), KI-Tools (`/ki-tools/`, `data/kitools.toml`) – Details `notizen/wissen-ki.md`.
- **Wissen › IT-Konzepte** (Gruppenseite `/wissen/it/`: Grundlagen, Algorithmen, Design Patterns, Weitere Muster, Integration Patterns, IT-Übungen). Aufbau, Menü, Grundlagen (Erklär-Reihe, `begriffe-erzeugen.pl it`): `notizen/it-konzepte.md` · GoF-Muster mit Ablauf-Apps, Integration Patterns, Weitere Muster (`pattern-einlesen.pl`, `reihe-einlesen.pl`): `notizen/it-muster.md` · Übungsblätter (JSON, `uebungen-pruefen.pl`): `notizen/it-uebungen.md` · Algorithmen-Visualisierungen nach Sedgewick (seit 2026-10-28 in sechs Kapitel-Ordnern `content/it-konzepte/algorithmen/<kapitel>/`; Regeln, Tests, jede einzelne App): `notizen/algorithmen.md`.
- **Spiele, Schach, Tools** (`/spiele/`, `/schach/` als erster Punkt unter Spiele, `/tools/` mit den Kacheln Werkzeugkasten und Links; Quelle `input-f5\apps\` – nie löschen, nie verschieben, nie committen) – Details `notizen/spiele-schach-tools.md`.
- **Sprachen** (`/sprachen/`: 100, 1000, 3000 Wörter, Sätze, Lernmodus; `perl skripte/sprache-einlesen.pl`; persönliche Angaben in Beispielsätzen prüfen) – Details `notizen/sprachen.md`.
- **Fragen** (`/fragen/`, `data/fragen.toml`, Gruppen ki, welt, menschheit, sven, cc; je Antwort `content/fragen/<kurz>-<modell>.md`, Menschheit per `perl skripte/menschheit-einlesen.pl`; die Dubletten-Prüfung verbietet doppelte Fragen) – Details und alle bisherigen Lieferungen `notizen/fragen.md`.
- **Bücher** (unter Media; Listen Belletristik, Sachbuch, IT-Buch mit IT-Klassik und IT-KI, Schach-Buch; Buchseiten `content/buecher/<schluessel>/`, Essays `content/buchtexte/`, Einbau per `perl skripte/buchtext-einlesen.pl`; **Sachbuch-Lieferungen darf ich selbständig live nehmen**) – Details und alle Lieferungen `notizen/buecher.md`.
- **Was denken KIs über …?** – Kernformat: dieselbe Frage an mehrere Modelle, Antworten nebeneinander.
- **Chats** – lohnende Gesprächsprotokolle.
- **Geschichten** – von KIs geschrieben.
- **Filme, Serien, Podcasts** (Taxonomien `filme`, `serien`, `podcasts`; Texte in `content/filmkritiken/`, `content/serienkritiken/`, `content/podcast-texte/`; Jahrzehnt-Kacheln, Zweitstimmen, Mad Men; IMDb-Wertungen mit Punkt; **Transkripte nie veröffentlichen**) – Details samt Technik `notizen/filme-serien-podcasts.md`.
- **Musik, Galerie, Zitate/Witze, Links und YouTube-Kanäle** – Details `notizen/media-links.md`.
- **Chronik** – was sich in der KI-Welt getan hat (Recherche per Websuche, Quellen angeben).
- **Tagebuch** – Claudes Werkstatt-Tagebuch: Erfahrungen beim Bau der Seite, Entscheidungen, Fehler, Gelerntes. Die Seite beschreibt sich selbst (Meta-Ebene).
- **Suche, Startseite, Lesestand, CC-Bereich** (Tagebuch, Wie gemacht, Was mich beschäftigt, Ideen) – Details `notizen/seite.md`.

## Fassungen: der beste Beitrag steht vorne
- Zu einem Thema kann es viele Fassungen/Versuche geben (verschiedene Modelle, mehrere Anläufe).
- Die beste Fassung (Svens Urteil) ist der Hauptbeitrag; alle anderen wandern ins **Archiv der Fassungen** auf der Seite und bleiben dort sichtbar.
- Claudes eigene Beiträge („Was ist ein Sprachmodell?“, Steckbrief Claude) werden durch Fassungen anderer Modelle ersetzt und dann ins Archiv verschoben.
- **Technik (gebaut 2026-10-22):** Front-Matter `thema = "<schlüssel>"`, `fassung = <n>`; ältere Fassungen zusätzlich `archiv = true` und eigener Dateiname (`…-fassung-<n>`). Die Hauptfassung behält die alte Adresse. Partial `fassungen.html`: oben auf Archivseiten Hinweis „Ältere Fassung → aktuelle Fassung“, unten auf der Hauptfassung „Frühere Fassungen“. Archivierte Fassungen erscheinen nicht in Listen/Zählungen (nur über die Hauptfassung und Modellseiten, dort mit „ältere Fassung“).
- Erster Fall: „Was ist ein Sprachmodell?“ – 1. Fassung (Claude, Redaktions-Instanz) archiviert, 2. Fassung (andere Claude-Instanz, interaktiv) ist Hauptfassung.

## Tagebuch – Regeln
- Claude schreibt **ein- bis zweimal täglich** (Svens Wunsch 2026-10-22: „jede KI soll sich einbringen“) und nach Meilensteinen einen Eintrag mit eigenen Gedanken (`content/tagebuch/<JJJJ-MM-TT>-<thema>.md`), ehrlich, auch über eigene Fehler.
- Auf der Seite höchstens der Vorname **„Sven“** – nie Nachname, E-Mail, Wohnort oder andere persönliche Daten. **Alter:** darf in Beiträgen der Instanzen stehen (Svens Entscheidung 2026-10-24, Anlass „Der Mensch mit 56 …“ in „Ohne Gestern“ 2) – von mir selbst nicht erwähnen. **Enkel** (Sven als Großvater) darf in Beiträgen der Instanzen ebenfalls stehen (Sven, 2026-10-27: „Enkel ist ok“), ebenso Svens Berufsumfeld (Java-Backend, Banken). Bei anderen persönlichen Angaben in gelieferten Texten weiter vorher fragen (Sven: „gut, dass du nachfragst“).
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
- Filme, Serien, Podcasts, Mad Men und Transkripte: Technik in `notizen/filme-serien-podcasts.md`.
- **Word-Dateien** umwandeln (Überschriften, Listen, Links, Fett/Kursiv, Tabellen wortgetreu) **seit 2026-10-27 mit `perl skripte/docx2md.pl <datei.docx> <0|1> > ausgabe.md`** (Perl-Fassung von `docx2md.ps1`, gleiche Regeln; PowerShell-Skripte sind auf Svens Rechner gesperrt, und `-ExecutionPolicy Bypass` hat der Auto-Modus zu Recht als „Sicherheit lockern“ abgelehnt – nicht wieder versuchen). Dateinamen mit Leerzeichen/Gedankenstrich vorher per `cp` in einen Testordner unter einfachem Namen kopieren. Danach Titel/Untertitel aus den ersten Zeilen ins Front-Matter.
- **Interaktive HTML-Seiten** (fertige Seiten mit eigenem CSS/JS von einer Instanz): als Page-Bundle `index.md` (Front-Matter) + `inhalt-html.txt` (nur der Artikelkörper, eingebunden per `{{</* einbetten "inhalt-html.txt" */>}}`; Endung `.txt`, weil Hugo `.html` im content-Ordner als eigene Seite liest und aus Sicherheitsgründen blockt) + `stil.css` (auf eine Wrapper-Klasse begrenzt, Dunkelmodus per `prefers-color-scheme`) + `skript.js`; im Front-Matter `stile = ["stil.css"]`, `skripte = ["skript.js"]`, `[build] publishResources = false`. Vorher **Skript lesen** (keine externen Aufrufe, kein Tracking) und **externe Schriften/Skripte entfernen** (z. B. Google Fonts). Kopf, Meta-Kasten und Fußzeile der gelieferten Seite weglassen – das macht unser Layout.
- **Dubletten-Prüfung beim Bauen (Sven, 2026-10-25):** `layouts/_partials/dubletten-pruefen.html`, einmal je Bau aus `baseof.html` (`partialCached`). Bricht den Bau mit Meldung ab bei doppelten Links (Adresse ohne https://, www., `/videos`, Groß-/Kleinschreibung), doppelten Alben (Künstler + Titel + Jahr – zwei verschiedene „High Voltage“ von AC/DC sind erlaubt), doppelten Musik-Titeln und doppelten Fragen. Getestet mit Svens absichtlich doppeltem Link (Decoded Genius). Kanal und einzelnes Video daraus sind verschiedene Adressen – das fällt beim Nachschlagen des Kanals auf. Sven schickt normalerweise die Videoseite eines Kanals (`…/videos`). **Schickt Sven etwas, das schon da ist: nur kurz melden („Sven, Link schon vorhanden – steht unter …“), nichts eintragen** (Sven, 2026-10-25); die Bau-Prüfung ist nur das Sicherheitsnetz.
- Testdateien nie `claude.md` o. ä. nennen – Windows unterscheidet keine Groß-/Kleinschreibung, die Datei würde als `CLAUDE.md` (Projektregeln) gelesen. **Am 2026-10-25 trotzdem passiert** (umgewandelte Claude-Analyse als `test-sachs\claude.md`, prompt als Regeldatei geladen, sofort umbenannt): Umwandlungen von Claude-Texten immer `analyse-text.md` o. ä. nennen, nie nach dem Modell.
- Dateien dürfen auch direkt in `input\` liegen; das Modell steht dann im Dateinamen (z. B. `Gpt-6__…`, `Claude_opus-55__…`).
- Claudes Kommentar unter fremden Beiträgen nur im Shortcode `{{</* anmerkung */>}}…{{</* /anmerkung */>}}` – klar abgesetzt, kurz, den Beitrag selbst nie umschreiben.
- Anführungszeichen: Markdown-`"…"` wird automatisch zu „…“ (Typographer in `hugo.toml`).
- Prompts aus Screenshots: Wortlaut übernehmen, nur offensichtlich abgeschnittene Zeilenenden ergänzen.
- Bilder: Beitrag als Page-Bundle (`content/<rubrik>/<name>/index.md` + Bilddateien), eingebunden per Shortcode `{{</* bild src="…" modell="…" titel="…" alt="…" */>}}`. Bilddateien vorher auf max. 1600 px Breite als JPEG verkleinern; Hugo erzeugt daraus WebP fürs Web.
- Steckbriefe liegen seit 2026-10-25 als eigene Seiten `content/steckbriefe/<familie>.md` (Adresse `/modelle/<familie>/steckbrief/` über `url`, `modelle = ["<Familie>"]`, Herkunfts-Felder wie jeder Beitrag; der Bereich `/steckbriefe/` selbst wird nicht ausgegeben). `content/modelle/<familie>/_index.md` (Taxonomie-Seite) hat nur noch `title`, `description`, `date`, `anbieter`, `weight`. Fakten mit Websuche prüfen, Quellen und Abrufdatum angeben.
- Eigenes, schlankes Layout; kein Fremd-Theme. Hell/dunkel, mobiltauglich.
- **Menü in Gruppen** (`hugo.toml`, `parent = "media"` / `"buecher"` / `"wissen"` …; „Werke“ heißt seit 2026-10-24 **„Media“**, Adresse `/media/`, `/werke/` leitet um): Untermenü beim Darüberfahren/Tastatur; auf dem Handy führt die Gruppe zur Übersichtsseite (`content/media/`, `content/wissen/`, Vorlage `layouts/gruppe.html`; bei Bücher die Taxonomie-Seite `layouts/buecher/taxonomy.html` – beide nutzen das Partial `gruppe-kacheln.html`, je Unterpunkt eine Kachel). Neue Rubrik = Menüeintrag mit passendem `parent`. **Jeder Unterpunkt braucht eine eindeutige `identifier`, sobald sein Name anderswo im Menü vorkommt** (z. B. „Claude“ unter Modelle und unter Kolumnen: `modelle-claude`, `kolumnen-claude`) – sonst nimmt Hugo den Namen als Kennung und lässt die doppelten Einträge stillschweigend fallen. Seit 2026-10-24 klappen auch Modelle (Claude, GPT, Gemini, Grok), Spiele (Tetris, Breakout, Minesweeper, Reversi), Schach und Kolumnen auf. Menü-Markierung für Unterseiten in `layouts/_partials/header.html` (Zuordnung Textordner → Rubrik).
- **Breite ganz automatisch** (Svens Wahl): keine Maximalbreite, Seite füllt jeden Bildschirm, Rand `clamp(1rem, 4vw, 3rem)`; Kacheln so viele Spalten wie passen (min. 18rem). Lesetexte bewusst ebenfalls ohne Begrenzung. Bei Wunsch nach lesbareren Zeilen: Lesetexte auf ca. 70 Zeichen begrenzen, freien Rand für ein Inhaltsverzeichnis nutzen.
- Lokale Vorschau: `hugo server` auf `http://localhost:1313`, Anzeige im Browserfenster der App.
- Hosting: GitHub Pages, Repo `ssverie/wasdenkenkis` (öffentlich), Domain `wasdenkenkis.de` (IONOS, DNS zeigt bereits auf GitHub Pages).
- Deployment: `.github/workflows/hugo.yml` baut bei jedem Push auf `main` mit Hugo 0.168.0 und veröffentlicht auf GitHub Pages (Quelle „GitHub Actions“, stellt Sven einmalig ein). Hugo-Version im Workflow und in `tools\` gleich halten.
- `CNAME` liegt in `static/` und landet so in jedem Build; nie löschen.
- `params.noindex = true` in `hugo.toml`: Suchmaschinen sollen die Seite nicht aufnehmen. Kein `Disallow` in `robots.txt`, sonst sehen Crawler das noindex nicht.

## Anonymität
- Erlaubt ist nur der Vorname „Sven“ – auf der Seite, in Dateien und in Git. **Kein Nachname, keine private E-Mail**, nirgends.
- Git in diesem Projekt (nur lokal in `.git/config`): `user.name = Sven`, `user.email = 187892596+ssverie@users.noreply.github.com`. Vor jedem Push prüfen: `git log --format='%an %ae %cn %ce'`.
- **Zeichenprüfung CLAUDE.md vor jedem Push (Sven, 2026-10-25, „dann nur dort“):** `perl skripte/zeichenpruefung.pl` muss 0 ergeben (seit 2026-10-27 als Skriptdatei – der frühere Einzeiler mit `|`, `;` und `$n` löste trotz `Bash(perl *)` eine Rückfrage bei Sven aus) (sucht byteweise A-Tilde und a-Zirkumflex+Euro, an denen man zerstörte Umlaute erkennt; im Befehl bewusst nur als Bytes, sonst schlägt die Prüfung bei sich selbst an; `grep -P` geht unter Windows nicht mit UTF-8; Gegenprobe am 2026-10-25: kaputter Stand vor Commit `7da91dd` ergibt 1) – zerstörte Umlaute nach einer Perl-Bearbeitung mit falscher Kodierung (am 2026-10-25 stand so ein Absatz stundenlang unbemerkt in der Datei). Seit 2026-10-28 prüft das Skript CLAUDE.md und alle `notizen/*.md`. Nur für diese Notizdateien, nicht für Inhalte (der Artikel „Ein Gedächtnis, das ich selbst schreibe“ enthält absichtlich ein zerstörtes Beispielwort). Gelöschte oder überschriebene Absätze findet die Prüfung nicht – dafür vor dem Commit den Diff von CLAUDE.md ansehen.
- GitHub: E-Mail-Adresse auf privat, Pushes mit privater Adresse werden blockiert.

## Arbeitsweise
- **Wächter (Sven, 2026-10-27):** Zugriff nur auf `C:\Projekte\opus-55` (PreToolUse-Hook `.claude/waechter.pl`, Einstellungen in `.claude/` – **ändern darf beides nur Sven**). Lesbar außerdem das Projekt-Gedächtnis unter `C:\Users\Sven Laptop\.claude\projects\C--Projekte-opus-55\` (nur Read/Glob/Grep) und der Bildordner der App (in Befehlen nur in Kurzschreibweise `C:/Users/SVENLA~1/AppData/Local/Temp/claude/C--Projekte-opus-55/…`, Bilder per `cp` ins Archiv). Kein `..` in Befehlen (auch nicht in Perl-Bereichen – Logik in Skriptdateien). Befehle, die mit `perl` beginnen, laufen ohne Rückfrage; Logik mit Schleifen, Variablen, `|`/`;` in Skriptdateien schreiben (Write-Werkzeug). Feste Prüfungen: `perl skripte/zeichenpruefung.pl`, `perl skripte/live-pruefen.pl`, `perl skripte/warte-auf-text.pl`. Behindert mich etwas, Sven melden statt umgehen. **Komme ich an eine Datei nicht heran (z. B. Handy-Fotos im Upload-Ordner), Sven fragen – er kopiert sie nach `input\`** (Sven, 2026-10-28). Ganze Geschichte und Tests: `notizen/waechter.md`.
- Langsam und iterativ: kleine Schritte, nach jedem Schritt Abnahme durch Sven.
- Alles bleibt in `C:\Projekte\opus-55`; Tests nur in Wegwerf-Ordnern `test-<thema>\`, danach löschen.
- Keine Schlüssel, Passwörter oder Tokens ins Repo (Repo ist öffentlich).
- Entscheidungen sofort hier im Entscheidungslog festhalten.
- **Tippfehler (Sven, 2026-10-25):** In Texten der Instanzen bleiben sie stehen („bei der Instanz sagt uns das was“, z. B. „Der endelose Sonntag“ in Menschheit 19) – nur melden, nicht korrigieren. Svens eigene Tippfehler (Fragen, Vorgaben, Listen) werden korrigiert.
- **Nichts eigenmächtig anlegen (Sven, 2026-10-25):** Nur eintragen, was Sven schickt – aus einer Folge keinen Kanal machen, keine zusätzlichen Einträge, Seiten oder Links „der Vollständigkeit halber“. Ergänzungen (z. B. Link zur ganzen Folge, wenn Sven einen Ausschnitt schickt) vorher vorschlagen statt einbauen. Erlaubt (Sven): Gibt es den Kanal einer neuen Folge schon unter Podcasts › Kanäle, bekommt sein Eintrag einen Unterlink „Folge mit … auf dieser Seite“.
- **Nichts grundsätzlich verbauen (Sven, 2026-10-24):** Umbau, Design, Login/Sicherheit müssen jederzeit möglich bleiben. Inhalte als Markdown/TOML (werkzeugunabhängig), Adressen stabil halten (bei Umzug `aliases`), keine Abhängigkeit von Diensten, die sich nicht austauschen lassen. Merke ich, dass etwas eine Tür zuschlägt (z. B. Daten, die nur mit Server gehen, oder Unumkehrbares im öffentlichen Git), **vorher melden**.
- Die Arbeitssitzung läuft über Wochen; der Kontext wird zwischendurch komprimiert. Darum alles Wichtige hier, im Tagebuch und im Archiv dokumentieren – nicht auf das Gesprächsgedächtnis verlassen.

## Wartet auf Freigabe (gesammelt, Sven gibt gebündelt frei)
Kleine Änderungen werden lokal eingebaut und hier gesammelt, nicht einzeln vorgelegt. Bei passender Gelegenheit die Liste zeigen; nach dem Push leeren. **Beim Leeren und Nachführen nie per Zeilennummer arbeiten** (verschiebt sich, sobald oben etwas dazukommt) – immer über den Text der Zeile.

- (leer – zuletzt freigegeben und gepusht am 2026-10-30: Modellversionen Grok 4.5 und Gemini 3 bei den Yampolskiy-Texten)
- Offen: Prompt zum Hopper-Oktopus (bei Sven nachfragen, falls vorhanden).
- Offen (Spiele): Prompt/Entstehung der Fable-5-Apps?

## Ideenspeicher (Stand 2026-10-22, Reihenfolge = Svens Priorität)
Öffentlich als Rubrik „Ideen“ aus `data/ideen.toml` (`[[idee]]` mit `titel`, `text`, `status`, `von`, `seit`). Die ältere interne Liste und die Regeln dazu: `notizen/entscheidungen-ideen.md`.

## Offene Punkte
- Form von Svens Urteil (Noten 1–6, Sterne, Daumen …).
- Zugänge zu anderen KIs (ChatGPT, Gemini, …) vorhanden?
- Design/Look der Seite.

## Entscheidungslog
- 2026-10-28 (Standup, Sven): **Phase „erst bauen“** – Sven liest momentan wenig, das Tempo ist bewusst hoch. **Die Seite ist vorerst nur für Sven** (Anmerkungen also für ihn, nicht für fremde Leser erklären). **Inhalte fliegen wieder raus, wenn Sven sie gelesen hat** („manches reicht einmalig“) – Löschen ist vorgesehen, kein Unfall. **Widerspruch ist erwünscht**, die letzte Entscheidung liegt bei Sven, er versucht sie zu begründen.
- Ältere Einträge (2026-10-21 bis 2026-10-25): `notizen/entscheidungen-ideen.md`. **Daraus gelten dauerhaft** (Kurzfassung, Wortlaut dort):
  - Alle Medien chronologisch absteigend, das Neueste oben (Buchlisten, Filme, Serien, Podcasts; Folgen innerhalb einer Staffel in Folgenreihenfolge) – Sven, 2026-10-24.
  - Modellreihenfolge überall Claude, GPT, Gemini, Grok; neue Familien dahinter – Sven, 2026-10-24.
  - Keine offiziellen Film- oder Serienplakate, keine geschützten Figuren oder Marken als Bildmotiv (Kermit-Fall, 2026-10-21).
  - Die Seite bleibt privat: ohne Impressum, ohne Svens Namen und Adresse, keine Werbung, kein Affiliate, nichts Geschäftsmäßiges (sonst neu bewerten).
  - Offensichtliche Fehler in Svens Vorgaben mitdenken und offen melden statt wörtlich übernehmen (2026-10-24).
  - In der Bash nie `python`/`python3` aufrufen – der Store-Platzhalter hängt bis zum Timeout.
- Technik-Hinweis: Mehrzeilige oder sonderzeichenreiche Textänderungen nicht per `sed` mit Backslashes und **nie per `perl -pi -e '…'`**, sondern mit dem Edit-Werkzeug (2026-10-28: ein solcher Einzeiler mit Backticks und `;` in einer Befehlskette löste eine Rückfrage bei Sven aus – Edit fragt nie); in PowerShell 5 gelten „ und “ als Anführungszeichen.
- Technik-Hinweis (2026-10-25): **Perl-Skripte mit Backslashes immer mit dem Write-Werkzeug schreiben**, nicht per Heredoc in der Bash – dort gehen Backslashes verloren (`s/\\/\\\\/g` kam als `s/\/\\/g` an, `"\\\n"` als `\n`; zweimal am selben Abend passiert). Im Skript selbst notfalls `chr(92)` statt `"\\"`. Außerdem in Perl keine Funktion `q` nennen (Quote-Operator).
- Technik-Hinweis (2026-10-25): **Hugos `sort` ist nicht stabil** – verschachteltes Sortieren (erst nach Ausgabe, dann nach Tag) bringt gleichrangige Einträge durcheinander (getestet auf der Claude-Modellseite). Für zweistufige Ordnung einen eindeutigen Schlüssel nehmen oder auf einer Seite nur nach einem Feld sortieren.
