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
- Originale nie verändern oder löschen; ins Repo kommen nur aufbereitete Kopien (Bilder verkleinert, EXIF entfernt).
- `input\` und `input-arc\` sind nicht im Git (Repo ist öffentlich).
- Fehlen Angaben (Prompt, genaue Modellversion), nichts erfinden: weglassen und Sven bei der Abnahme fragen.

## Rubriken (Entwurf, wird iterativ geschärft)
- **Modelle** – Steckbrief je KI (Claude, GPT, Gemini, Llama, Mistral, …): Stärken, Schwächen, Verlauf.
- **Werkzeugkompass** – KI-Tools nüchtern getestet und verglichen.
- **Verständlich erklärt** – Glossar und Grundlagen, Begriff für Begriff.
- **Was denken KIs über …?** – Kernformat: dieselbe Frage an mehrere Modelle, Antworten nebeneinander.
- **Chats** – lohnende Gesprächsprotokolle.
- **Geschichten** – von KIs geschrieben.
- **Filmkritiken** – von KIs geschrieben.
- **Galerie** – Bilder/Grafiken (Claude: SVG; Fotoartiges bringt Sven aus anderen Generatoren mit).
- **Chronik** – was sich in der KI-Welt getan hat (Recherche per Websuche, Quellen angeben).
- **Links** – Paper, Plattformen, Quellen; Daten in `data/links.toml`, Kurzbeschreibung = Claude-Kommentar.
- **Tagebuch** – Claudes Werkstatt-Tagebuch: Erfahrungen beim Bau der Seite, Entscheidungen, Fehler, Gelerntes. Die Seite beschreibt sich selbst (Meta-Ebene).

## Fassungen: der beste Beitrag steht vorne
- Zu einem Thema kann es viele Fassungen/Versuche geben (verschiedene Modelle, mehrere Anläufe).
- Die beste Fassung (Svens Urteil) ist der Hauptbeitrag; alle anderen wandern ins **Archiv der Fassungen** auf der Seite und bleiben dort sichtbar.
- Claudes eigene Beiträge („Was ist ein Sprachmodell?“, Steckbrief Claude) werden durch Fassungen anderer Modelle ersetzt und dann ins Archiv verschoben.
- Technik dafür wird gebaut, sobald die erste Ersatz-Fassung eintrifft.

## Tagebuch – Regeln
- Claude schreibt nach jedem Arbeitstag oder Meilenstein einen Eintrag (`content/tagebuch/<JJJJ-MM-TT>-<thema>.md`), ehrlich, auch über eigene Fehler.
- Auf der Seite höchstens der Vorname **„Sven“** – nie Nachname, E-Mail, Alter, Wohnort oder andere persönliche Daten.
- Das Tagebuch ist gleichzeitig Claudes Langzeitgedächtnis für das Projekt (neben dieser Datei): vor neuer Arbeit die letzten Einträge lesen.

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
- Prompts aus Screenshots: Wortlaut übernehmen, nur offensichtlich abgeschnittene Zeilenenden ergänzen.
- Bilder: Beitrag als Page-Bundle (`content/<rubrik>/<name>/index.md` + Bilddateien), eingebunden per Shortcode `{{</* bild src="…" modell="…" titel="…" alt="…" */>}}`. Bilddateien vorher auf max. 1600 px Breite als JPEG verkleinern; Hugo erzeugt daraus WebP fürs Web.
- Steckbriefe liegen als `content/modelle/<familie>/_index.md` (Taxonomie-Seite mit Inhalt); Fakten mit Websuche prüfen, Quellen und Abrufdatum angeben.
- Eigenes, schlankes Layout; kein Fremd-Theme. Hell/dunkel, mobiltauglich.
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
- 2026-10-21: Claude darf kommentieren, aber keine Beiträge mehr liefern – sonst Interessenkonflikt. Beiträge machen andere Modelle.
- 2026-10-21: Neue Rubrik „Links“ (Paper, Plattformen, Quellen); erster Eintrag Hugging Face.
- 2026-10-21: Claudes Beiträge werden ersetzt; mehrere Fassungen je Thema möglich, beste vorne, Rest im Archiv der Fassungen.
- 2026-10-21: Werkstatt-Tagebuch von Claude als Rubrik auf der Seite – die Seite wird gleichzeitig meta.
- 2026-10-21: So anonym wie möglich: nur Vorname „Sven“. Repo bei GitHub neu angelegt, alte Git-Historie gelöscht (nur lokal gesichert in `input-arc\2026-10-21\`).
