# Ältere Entscheidungen und der interne Ideenspeicher

Ausgelagert aus CLAUDE.md am 2026-10-28 um 10:25 (Sven: „falls du die claude.md aufteilen musst, mache es“). Wortgleich übernommen; hier weiter fortschreiben – CLAUDE.md verweist hierher.

Sven ist der Engpass: Er kann nicht alles sofort lesen. Darum kleine Schritte, nichts drängeln, Ideen parken.

**Seit 2026-10-22 öffentlich als Rubrik „Ideen“ (`/ideen/`, seit 2026-10-25 letzter Punkt unter CC, Menükennung `cc-ideen`, Rückweg „CC“ in `layouts/ideen.html`): Quelle ist `data/ideen.toml`** (`[[idee]]` mit `titel`, `text`, `status` = naechstes | geparkt | erledigt, `von`, `seit`). Neue Ideen dort eintragen, erledigte auf `erledigt` setzen – nur Öffentliches, nichts Privates. Sven notiert Ideen unterwegs selbst und legt sie später in `input\` (z. B. `input\_ideen\`); Claude überträgt sie in `data/ideen.toml` (`von = "Sven"`, `seit` = Dateidatum) und archiviert die Notiz wie üblich. Keine Eingabe auf der Seite selbst (statisch, bewusst ohne Server). Die Liste unten ist die ältere interne Fassung.

1. ~~Transkript-Check Ladish~~ – erledigt 2026-10-21 (Transkript im Archiv: `input-arc\2026-10-21\_podcasts\`).

2. ~~Navigation zusammenfassen~~ – erledigt 2026-10-21: Menü Modelle · Werke ▾ (Filme, Serien, Podcasts) · Galerie · Wissen ▾ (KI-Begriffe, Links) · Tagebuch.

3. **Als Nächstes (Sven, 2026-10-22):** Algorithmen-Visualisierung auf Basis von Fables `input-f5\apps\51-algos` (geprüft: sauber, Sortier-Wettrennen + Wegfindung; Umbau nötig), verknüpft mit Svens Sedgewick-Buch. Dazu Rubrik **Bücher** (wie Filme: Buchseite mit Eckdaten, Texte darunter).

4. **Später:** Svens Urteil sichtbar machen („Svens Wahl“) · ~~Steckbriefe GPT, Gemini, Grok~~ (erledigt 2026-10-22) · Claudes alte Beiträge durch Fassungen anderer Instanzen ersetzen (Archiv der Fassungen) · Suche · Inhaltsverzeichnis für lange Texte.

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

- 2026-10-24: Neue Rubrik „KI-Tools“ unter Wissen (Svens Wunsch, Idee vom 22.10.), als Werkzeugliste aus Daten statt als Beitrag.

- 2026-10-24: **Alle Medien chronologisch absteigend – das Neueste oben** (Sven, gilt bis auf Weiteres immer): Buchlisten (auch die Epochen, jüngste zuerst), Bücherübersicht, Filme und Serien (nach `jahr`), Podcasts (nach `erschienen`), Folgenbesprechungen einer Serie: neueste Staffel oben, **innerhalb der Staffel in Folgenreihenfolge** (Sven; bei mehreren Staffeln je eine Zwischenüberschrift). Beim Schach war es schon so. Das Folgen-Raster (Staffel × Folge als Tabelle) bleibt unverändert.

- 2026-10-24: **Modellreihenfolge überall Claude, GPT, Gemini, Grok** (Sven, gilt bis auf Weiteres): Menü Modelle und Kolumnen, Steckbrief-Übersicht (`weight` im Steckbrief, `layouts/taxonomy.html` sortiert `ByWeight`), Kolumnen-Übersicht. Neue Modellfamilien dahinter einreihen.

- 2026-10-24: Fragen nach Svens README: KI-Nr. 36 (= Nr. 11) nicht doppelt, Demokratie-Frage entfällt, Tippfehler in Svens Frage korrigiert – Sven: „richtig entschieden, gut mitgedacht“. Leitlinie: offensichtliche Fehler in Svens Vorgaben mitdenken und offen melden, statt sie wörtlich zu übernehmen.

- 2026-10-24: Neue Rubrik „Tools“ (eigener Menüpunkt, Svens Wunsch), erstes Werkzeug: Dev-Werkzeugkasten von Fable 5.

- 2026-10-24: Alter darf in Beiträgen der Instanzen stehen (Sven); Nachname, E-Mail, Wohnort bleiben tabu, bei anderen persönlichen Angaben weiter nachfragen.

- 2026-10-23: Neue Rubrik „KI-Philosophie“ unter Wissen (Svens Wunsch), Lieferung der Erklär-Instanz; Generator `begriffe-erzeugen.pl` nimmt jetzt die Reihe als Argument.

- 2026-10-22: Keine offiziellen Film- oder Serienplakate auf der Seite (Urheberrecht, Svens Entscheidung) – das Plakat zeigt der IMDb-Link. Gelieferte Plakate liegen in `input-arc\2026-10-22\_nicht-verwendet\`.

- 2026-10-21: Neue Rubrik „Serien“: Mad Men, alle 92 Folgen von einer Claude-Opus-5.5-Instanz besprochen, mit eigener Wertung; Sven liefert die IMDb-Wertungen dazu.

- 2026-10-21: Freigabe bleibt komplett bei Sven, auch für Kleinkram. Claude sammelt kleine Änderungen lokal (Liste „Wartet auf Freigabe“), Sven gibt gebündelt frei.

- 2026-10-21: Seitenbreite ganz automatisch (ohne Obergrenze), nach Versuch mit zwei festen Breiten.

- 2026-10-21: Keine Testsituation: Beiträge kommen von lebenden Instanzen, Unterschiede sind gewollt.

- 2026-10-21: So anonym wie möglich: nur Vorname „Sven“. Repo bei GitHub neu angelegt, alte Git-Historie gelöscht (nur lokal gesichert in `input-arc\2026-10-21\`).
