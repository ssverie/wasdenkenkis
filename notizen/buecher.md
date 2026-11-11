# Bücher – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11. Die vollständige Geschichte (jede Lieferung, alle Faktenprüfungen und Anmerkungen, Gallagher- und Masetti-Arbeitsprotokolle) steht wortgleich in `notizen/chronik/buecher.md`. **Neue Lieferungen dort unten als eigener kurzer Absatz anhängen**; hier nur nachführen, was dauerhaft gilt oder den Stand ändert. Schach-Technik (Diagramme, Nachspielen, Prüfskripte): `notizen/spiele-schach-tools.md`.

## Regeln (Svens Entscheidungen)

- **Sachbuch-Lieferungen darf ich selbständig live nehmen** (2026-10-27). IT-Buch und alles andere nicht – dort gilt die Sammelliste.
- Texte unverändert übernehmen, Wortvergleich Word ↔ Markdown; Titel und Untertitel aus dem Kopf **wortgleich** (Untertitel → `description`).
- Fakten prüfen; Funde als `{{</* anmerkung */>}}` unter dem Text, Kleinigkeiten (Zählfehler der Instanz o. ä.) nur Sven melden.
- **Unvollständige Lieferungen zurückhalten** und Sven fragen (Word-Datei endet z. B. vor „Meine Sicht“/Urteil/Fazit – kam dreimal vor).
- Persönliches in den Texten: Alter, daraus abgeleitetes Geburtsjahrzehnt und Enkel sind erlaubt (Sven: „Enkel ist ok“); anderes vorher fragen.
- **Jahr in Liste und Schlüssel = Jahr der besprochenen Auflage** (Refactoring 2018, DDIA 2026 – Sven bestätigt).
- Links der Instanz auf eigene Claude-Artifacts (`claude.ai/artifact/…`) auf unsere Seiten `/buchtexte/<name>/` umbiegen, Wortlaut unverändert.
- Bot-Prüfungen (DNB, PubMed, MPDL) nicht umgehen; dann andere Quelle.
- Schachbücher (Masetti): **nicht in die Lösungen schauen**, solange Sven es nicht sagt; Bildunterschriften (halbe Hinweise) nicht übernehmen.

## Technik

- Menü: Bücher ist erster Punkt unter Media (`parent = "media"`, `weight = 1`); Listen dritte Ebene; Schach-Buch steht im Menü seit 2026-11-04 unter Spiele › Schach.
- **Listen** (chronologisch, neuestes oben, Vorlage `layouts/buchliste.html`): Belletristik `data/belletristik.toml` (Epochen über `[[epochen]]` im Front-Matter), Sachbuch `data/sachbuch.toml` (mit `gebiet`), IT-Buch als Gruppenseite `/it-buch/` mit **IT-Klassik** (`/it-buch/klassik/`, `data/itbuch.toml`) und **IT-KI** (`/it-buch/ki/`, `data/itbuchki.toml`), Schach-Buch `data/schachbuch.toml`. Einträge `[[buch]]` mit `titel`, `autor`, `jahr`, `sortjahr`, `schluessel`. Ein Titel wird automatisch Link, sobald `/buecher/<schluessel>/` existiert.
- **Buchseite** (Taxonomie `buecher`): `content/buecher/<schluessel>/_index.md` mit `title = "Titel (Jahr)"`, `linkTitle`, `description` (eigene Inhaltsangabe), `autor`, `jahr`, `erschienen`, `gattung`, `liste` (`belletristik` | `sachbuch` | `it-buch/klassik` | `it-buch/ki` | Schach), `wikipedia`, optional `wikipedia_text` („Zum Autor/Begriff auf Wikipedia“, wenn kein Buchartikel), ohne Wikipedia `quelle` + `quelle_url`, optional `webseite`, `abgerufen`. Vorlagen `layouts/buecher/term.html`, `taxonomy.html`. Neue Buchseite: Vorschau neu starten.
- **Essays** in `content/buchtexte/` mit `buecher = ["<schluessel>"]`. Einbau: Buchseite anlegen, dann
  `perl skripte/buchtext-einlesen.pl "<Dateianfang>" <buchschluessel> <seitenname> "<instanz>" "<kontext>"` – wandelt die .docx um (`docx2md.pl`), Wortvergleich (Abbruch bei Abweichung, Links herausgerechnet), Bilder als Page-Bundle `bild-N.png` an ihrer Stelle, Untertitelzeile → `description`, Codeblöcke (Vorlage „Code“) → ```` ```java ````, behält Anmerkungen beim erneuten Einlesen. Mehrere Dateien: Wegwerf-Skript, das es mehrfach aufruft. Dateinamen mit Leerzeichen über Perl-Glob, nicht `cp … \ `.
- Ein Essay kann an einer Buchseite einer anderen Liste hängen (Deep Work: Sachbuch-Seite, Eintrag auch in IT-Klassik mit gleichem Schlüssel).
- `perl skripte/live-pruefen.pl https://…` prüft fremde Quellen-Links ohne Warten.

## Instanzen

- Sachbuch-Reihe: Claude-Instanz „Sachbuch“ (Dateien ohne Namen, Reihe im `kontext`: Taleb → Kahneman → … → Haffner). IT-Buch: „29.10.2026 - 10:50 - IT-Books“ (bei Dateien ohne Namen erschlossen). Einzelheiten `notizen/instanzen.md`.

## Stand (2026-11-11)

- Belletristik 77, Sachbuch 48, IT-Klassik 42, IT-KI 12, Schach-Buch 5 Einträge; 108 Dateien in `content/buchtexte/`.
- Schach-Buch: Rizzitano „1001 Deadly Chess Puzzles“ (mit meinem Selbsttest), Ivanchuk „100 Selected Games“ (Kap. 2–5), Gallagher „365 Ways to Checkmate“ (alle 365, Lösungen geprüft), Masetti/Messa „1001 Chess Exercises for Beginners“ (Kap. 1–2 mit Lösungsliste „Wer löst was?“: ich, Opus-Agent, Sonnet-Agent), Sosonko (Platzhalter).
- **Masetti-Werkzeug** (pdf.js-Ansicht mit Mini-Webserver `server.pl`/`ansicht.html`, Auswerte-Skripte, Antworten der Agenten, das Buch-PDF `buch.pdf`) liegt seit 2026-11-11 in `input-arc\2026-11-11\_testreste\test-masetti\` – zum Weitermachen in einen neuen `test-masetti\` kopieren. Ablesen gleich je Brett in Maßstab 5 (Lehre aus Kapitel 2). Bei vielen Aufgaben Agenten in Teilen beauftragen (Längengrenze 128.000 Ausgabe-Tokens).
- Offen: Masetti ab Kapitel 3; Schach-Buch-Subagent 1–113 (Sammelliste).
