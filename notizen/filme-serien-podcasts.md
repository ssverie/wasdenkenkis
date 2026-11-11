# Filme, Serien, Podcasts – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11 (Sven: „musst du es mal wieder refaktorieren?“ – „Alle drei“). Die vollständige Geschichte mit jeder Lieferung, allen Prüfungen und Zitaten steht wortgleich in `notizen/chronik/filme-serien-podcasts.md`. **Neue Lieferungen dort unten als eigener kurzer Absatz anhängen** (Datum, Svens Satz, was kam, was auffiel); hier nur nachführen, was dauerhaft gilt oder den Stand ändert.

## Regeln (Svens Entscheidungen)

- **Instanzen nie fremde Besprechungen als Muster geben**, nur eine Formatbeschreibung (2026-11-08, Grok-Fall) – sonst ist der Vergleich wertlos. Prüfung mit 3-Gramm-Vergleich gegen die vorhandenen Stimmen (2–3 % normal, Grok v1 lag bei 10 %).
- Aufträge an Instanzen zum Korrigieren: „nur diese Punkte korrigieren, sonst nichts kürzen oder umschreiben“ ausdrücklich sagen (Lehre aus Gemini 3).
- **Versalien nur bei Mad Men normal schreiben** (Sven, 2026-11-08), per Skript gesichert: Großschreibung der neuen Zeile = alte Zeile (ß = SS). Beim Einbau melden, wie viele Zeilen.
- Kopier-Reste entfernen und melden: Nachrichtennummern „[n] GPT-6“, „---“ vor der Byline, „Als Nächstes: …“, „Ende der Serie“. Byline „Modell · Datum“ bleibt, fehlt sie, kein Datum erfinden.
- Schriftbild der Instanzen nicht glätten (GPT-Einzelsatz-Absätze in Staffel 2: Sven „lass es, es scheint eine Degenerierung zu sein“).
- **IMDb-Wertungen immer mit Punkt** (`printf "%.1f"`), schlicht „Wertung: 8.1 auf IMDb“ – kein Fettdruck, keine Stimmenzahl, kein Stand-Datum (Sven, 2026-10-24). Wertungen der Instanzen im Front-Matter ebenfalls mit Punkt, im Fließtext wie geliefert.
- `description` von Film-, Serien- und Podcastseiten = eigener Inhaltssatz von Claude, nie IMDb- oder Beschreibungstext kopieren; nicht angesehene Videos ausdrücklich so formulieren („Laut Kapitelübersicht …“).
- YouTube nur verlinken, nie einbetten. **Transkripte nie veröffentlichen** – speichern ja (Privatkopie § 53 UrhG), veröffentlichen nein (§ 19a); kurze Zitate mit Quelle gehen.
- **Bei jedem Podcast- oder Film-Link zuerst `input\` prüfen** (2026-10-31 bei Hinton übersehen).
- Kanäle: nur anlegen, wenn Sven es sagt. Gibt es den Kanal einer neuen Folge schon unter Kanäle, bekommt er einen Unterlink „Folge mit … auf dieser Seite“; Gäste mit eigenem Kanal nur nach Rückfrage.
- IMDb verbietet automatisches Auslesen: Werte nur einzeln auf Svens Ansage im Browserfenster lesen, kein Sammellauf (Sven: „das ist ok, wir machen ja nur ein paar“). Cookie-Banner ablehnen.
- Mad Men: Mein Vergleich Claude/GPT bleibt vorerst offline (Sven, 2026-11-08: „lass es erstmal“). Gemini ist zurückgestellt; weiter mit GPT und Grok.
- Keine offiziellen Plakate, keine geschützten Figuren als Bild (Kermit-Fall, CLAUDE.md).

## Filme

- Taxonomie `filme`. Seite `content/filme/<titel-jahr>/_index.md` mit `title = "Titel (Jahr)"`, `originaltitel`, `deutscher_titel`, `jahr`, `regie`, `laenge`, `darsteller` (die ersten drei wie IMDb), `genre`, `imdb`, `imdb_wertung`, `abgerufen`, `description`. `imdb_stimmen` darf drinstehen, wird nicht angezeigt. Daten aus dem JSON-LD der IMDb-Seite im Browserfenster.
- Essays in `content/filmkritiken/` mit `filme = ["<ordnername>"]` – immer der **Schlüssel**, nie der Anzeigetitel (Klammern im Titel lassen Hugo zwei Seiten bauen).
- Ist der Seitentitel deutsch (`linkTitle` ≠ `originaltitel`), zeigen Liste und Filmseite den Originaltitel statt „dt. …“.
- **Jahrzehnt-Kacheln** (Sven: „80er = 1981-1990“): `/filme/` (`layouts/filme/taxonomy.html`) je Jahrzehnt eine Kachel; Seiten `content/filmjahrzehnte/<name>.md` mit `url = "/filme/<name>/"`, `von`, `bis`, `layout = "filmjahrzehnt"`. Vorhanden: 40er, 50er, 60er, 70er, 80er, 90er, 2000er, 2010er, 2020er. Fehlt ein Jahrzehnt, bricht der Bau ab („Film … liegt in keinem Jahrzehnt“) – dann Seite anlegen. Keinen Film-Schlüssel wie `80er` vergeben.
- Neue Filmseite: Vorschau neu starten, sonst „Page Not Found“.
- Sven legt IMDb-Links in `input\_filme\` oder nennt Filme im Chat; Filmseiten ohne Text sind erlaubt („noch kein Text“).

## Serien

- Taxonomie `serien`. Serie `content/serien/<titel-jahr>/_index.md` (Eckdaten wie Film, dazu `laufzeit`, `idee`, `sender`, `umfang`, `daten = "<datei>"`).
- **Folgen-Raster** (`layouts/_partials/folgen-raster.html`) aus `data/serien/<datei>.toml`: `[[staffel]]` mit `nummer`, `folgen`, `schnitt`, `imdb = [..]`, `titel = [..]` (en-Wikipedia), optional `umbruch = N` (Staffel in zwei Anzeigezeilen, z. B. Sopranos 6, Breaking Bad 5). Laufende Nummer und Folgentitel in jeder Zelle (vorläufig, Sven: „evtl. löschen wir es wieder“ – zum Entfernen Titel-Ausgabe und `.folgenkopf` zurückbauen). Farbstufen `w5` (unter 6, rötlich), `w6` (6,0–6,9, sandfarben), `w7` (ohne Farbe) und darüber.
- **Staffel-Durchschnitt:** IMDb-Wert aus dem Abschnitt „Episoden“ der Titelseite („S1 Folgen · 8.3 Durchschnitt“, lädt erst nach dem Scrollen), nicht rechnen; nur wo er nicht sichtbar ist, einfaches Mittel der Folgenwerte (Sven bei Mr Inbetween) und im Kommentar der Datendatei vermerken. Folgenwerte per JavaScript aus `/title/<id>/episodes/?season=N` (`.ipc-rating-star--rating` je `article`).
- **Folgenbesprechungen** in `content/serienkritiken/<serie>/s<SS>e<FF>-<modell>.md` – **seit 2026-11-11 immer mit Modell-Endung, auch Claude** (`-claude`, `-gpt`, `-grok`, `-gemini`). Front-Matter: `serien = ["<schluessel>"]`, `staffel`, `folge`, `nummer` (= Staffel×100+Folge), `folgentitel`; Hauptbesprechung (Claude) mit `claude_wertung`, alle anderen mit `zweitstimme = true` und `wertung`. Claudes 92 Mad-Men-Folgen hießen bis 2026-11-11 `sSSeFF.md`; sie haben `aliases` auf die alte Adresse, und `assets/js/gelesen.js` zieht alte „gelesen“-Haken einmalig um.
- **Navigation** (`layouts/page.html`): „Weitere Texte zu dieser Folge“ listet die anderen Modelle derselben Folge. Die Pfeile ← → bleiben beim Modell der Seite (`modelle[0]`): vorige/nächste Folge über alle Modelle bestimmt, verlinkt nur, wenn dasselbe Modell sie hat – sonst kein Pfeil, kein Sprung über Lücken (Sven, 2026-11-11: „wenn das modell nichts hat, hört es auf“).
- Herkunfts-Kasten zeigt „Serie: Mad Men, Staffel 1, Folge 1, 1/92“ (`herkunft.html` zählt aus den Seriendaten) und die Wertungen „x/10 von <Modell> · y auf IMDb“.
- `gesamt = true` für Texte über eine ganze Serie (ohne `staffel`/`folge`): erscheinen als „Gesamteinschätzung“ über dem Raster (`layouts/serien/term.html`).
- **Einbau von Zweitstimmen: `perl skripte/serie-einlesen.pl`** (seit 2026-11-11, ersetzt die Wegwerf-Skripte je Staffel): `--ordner mad-men --serie mad-men-2007 --modell GPT --version GPT-6 --instanz "…" [--versalien tabelle.txt] [--schreiben] <dateien>`. Erkennt beide GPT-Formate (Markdown mit `###` und Svens Klartext-Kopie mit „N. …“-Überschriften), Folge aus dem Dateinamen (7x08, 7,8, 5-01, s07e08), Wortvergleich, Versalien nur mit Tabelle („ALT => Neu“, geprüft), meldet Entferntes und Nähte. Ohne `--schreiben` nur Bericht. Regressionstest am 2026-11-11: Staffel 5–7 byte-gleich zu den eingebauten Seiten (einzige gewollte Abweichung: 6.12 bekäme den Untertitel wortgleich als `description`). Grok liefert in Claudes Format (Titel „Mad Men 1.x: „…““, „— Grok 4.5“ mit Leerzeile davor) – dafür hat das Skript noch keinen Zweig.

## Podcasts

- Taxonomie `podcasts`. Folge `content/podcasts/<schluessel>/_index.md` mit `title` (deutsch, neutral), `originaltitel`, `sendung`, `sendung_youtube`, `moderation`, `gast` (Forscherseiten finden ihre Folgen darüber), `erschienen`, `laenge`, `sprache`, `youtube`, `titel_youtube`, `anhoeren`, `abgerufen`, optional `[[hintergrund]]`, `description`. Datum und Länge per `ytInitialPlayerResponse` (`publishDate`, `lengthSeconds`); Kanal/Titel per oEmbed prüfen. Texte in `content/podcast-texte/` mit `podcasts = ["<schluessel>"]`.
- Podcast-Seite mit zwei Kacheln (`layouts/podcasts/taxonomy.html`): **Kanäle** (`/podcasts/kanaele/`) links, **Folgen** (`/podcasts/folgen/`, `content/podcast-folgen/_index.md`, `layouts/podcast-folgen/section.html`) rechts. Keinen Folgen-Schlüssel `folgen` oder `kanaele` vergeben.
- Haken „gesehen“ auf Folgenkarten und -seiten: localStorage `wdk-gesehen`, `assets/js/gesehen.js` allgemein (`data-gesehen="<bereich>:<schluessel>"`).
- Zeitmarken wie `&t=1283s` aus Links entfernen. Datumszeilen wie „31. Oktober 2026“ am Zeilenanfang als `31\.` setzen (sonst nummerierte Liste).

## Transkripte

- Ablage `transkripte\TT.MM.JJJJ__<Kanal>__<Titel>.txt` (nicht im Git; Doppelpunkt → „ - “), Kopf: Video, Kanal, Gast, Titel, Erschienen, Länge, Sprache, Quelle. Rohkopie nach `input-arc\<Datum>\_transkripte\`.
- Svens Kopie aus „Transkript anzeigen“ bereinigen: `perl skripte/transkript-bereinigen.pl <kopie> <ziel> <kopfdatei>` (beide Kopierformate, Kapitel als eigene Zeilen, `[Zeit] Text`).
- **Schickt Sven nur die Adresse:** Video im Browserfenster stumm laden (`movie_player.mute()`), Untertitel einschalten (`setOption('captions','track',{languageCode:'en'})`), die vom Player abgerufene `timedtext`-Adresse (mit Token) mit `fmt=json3` im Seitenkontext holen, in Teilen unter 18.000 Zeichen übertragen und **jeden Teil per SHA-256 gegen den Browser prüfen**. Danach Tab wegnavigieren (Ton). **Nie** die Token-Adresse außerhalb des Browsers abrufen (Auto-Modus: „Bot Check Circumvention“), kein yt-dlp. Untertitel liefern keine Kapitel.

## Stand (2026-11-11)

- **Mad Men:** Claude alle 92 Folgen + Gesamteinschätzung (Instanz „21.10.2026 - 22:08 - Mad Men episode summaries“, Schnitt 8,62, dreimal 10). **GPT-6 alle 92** (Instanz „22.10.2026 - 21:05 - Filmserien“, Wertungen steigen von 8,8 auf bis zu 10). **Grok 4.5** 1.1–1.7 (ohne Instanz). Gemini zurückgestellt.
- **Serien mit Raster:** Mad Men, The Sopranos, Black Mirror (34 mit Bandersnatch als 4.7), Breaking Bad, Better Call Saul, Game of Thrones (73, ein Special fehlt), The Wire, Gomorra, Chernobyl, The Last Dance, Mr Inbetween. Ohne Raster: Band of Brothers, Sherlock, Dekalog, Narcos, Narcos: Mexico, Six Feet Under, Rectify. Serienliste 18.
- Filme und Podcast-Folgen: siehe Seite und Chronik.
