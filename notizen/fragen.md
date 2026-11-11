# Fragen – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11. Die vollständige Geschichte steht wortgleich in `notizen/chronik/fragen.md` (jede Lieferung, jede Kopfform, jede Versalien-Tabelle, Seitennamen). Neue Lieferungen dort unten anhängen.

## Regeln (Svens Entscheidungen)

- Wortlaut von Svens Fragen unverändert (Listennummern weg; Svens eigene Tippfehler korrigieren). Antworten der Instanzen wortgleich, **Tippfehler der Instanzen bleiben** und werden nur gemeldet.
- **Doppelte Fragen verbietet die Dubletten-Prüfung beim Bauen.** Wiederholt eine Instanz eine frühere Frage, wird die Antwort **Zweitantwort** unter der alten Frage (Sven: „Zweitantwort“), kein neuer Listeneintrag (z. B. `endlichkeit-kunst-gpt-6`, `…-2-gpt-6`).
- Seitennamen nicht doppelt vergeben (z. B. `gehorsam-gpt-6` ist KI-Frage → Menschheit-Seite `autoritaet-gpt-6`).
- Persönliches: Svens Berufsumfeld (Java-Backend, Banken), Alter, Enkel dürfen in Instanz-Texten stehen. **Svens Meinungen zu politischen oder umstrittenen Themen nicht ohne Rückfrage veröffentlichen** (Fables erste Antwort auf KI-Frage 2 blieb offline – Sven: „Nein, nicht online“; Einzelheiten absichtlich nirgends in den öffentlichen Notizen). Grenzfälle vorher melden.
- **CC-Fragen** (Gruppe `cc`) sind Vorschläge von mir, nur nach Svens Freigabe, Plakette „Vorschlag von CC“. Ich beantworte keine Fragen selbst. Sven (2026-10-27): Die Antworten auf die CC-Fragen waren schwach – „das müssen wir nochmal machen (später)“, wie ist offen.
- Bei jedem Auftrag, der Fragen anlegt, zuerst `input\` ansehen (2026-10-31: „wo ist gpt?“).

## Technik

- `data/fragen.toml`: `[[frage]]` mit `gruppe` (`ki` | `welt` | `menschheit` | `sven` | `cc`), `text`, optional `stichwort`, `auch`; je Antwort `[[frage.antwort]] pfad = "/fragen/<datei>"`, optional `name` als Linktext (z. B. „Claude Fable 5.1 (1)“/„(2)“). Reihenfolge in der Datei = Nummer auf der Seite; Antworten je Frage in der Modellreihenfolge Claude, GPT, Gemini, Grok.
- Antwortseite `content/fragen/<kurz>-<modell>.md` mit `frage = "…"` (Kasten „Die Frage“), Titel/Untertitel aus dem Kopf wortgleich. Unterseiten `content/fragen/{ki,welt,menschheit,sven,cc}/_index.md` mit `layout = "fragen"` und `nur_gruppe`, Filter `fragen-filter.html`, Vorlage `layouts/fragen.html`.
- **Menschheit (GPT-6):** `perl skripte/menschheit-einlesen.pl <tabelle.txt> <datei> <seitenname> […]` – Tabelle „VERSALIEN<TAB>Normal“ für Überschriften und Fragen, Wortvergleich ohne Groß-/Kleinschreibung mit ß = ss, gibt die `text`-Zeile für `data/fragen.toml` aus. Seit 2026-10-31: Titel = Essaytitel der Instanz, `description` = ihre Frage samt Folgefrage, `frage` = Svens Wortlaut. Autorzeile „Ein Essay aus der Perspektive von GPT-6 · …“ kommt nicht auf die Seite. Versal-Sätze mitten im Text bleiben (nur Fragen und nummerierte Überschriften werden umgestellt).
- Klartext-Lieferungen aus dem Chatfenster: Kopier-Reste (Quellen-Schaltflächen „PubMed“, „+1“, „[n]“) entfernen, allein stehende Zeilen „N. …“ → `##`, immer Wortvergleich. Quellen-DOIs über `https://doi.org/api/handles/<doi>` prüfen.
- Word-Dateien (Claude Docs, Fable 2) per `docx2md.pl`, Kopfzeile „Nov 5, 2026 · @Sven“ weg.

## Stand (2026-11-11)

- KI 35, Welt 20, Menschheit 50, Sven 3, CC 5 Fragen. GPT-6 hat alle KI-, Welt- und Menschheit-Fragen beantwortet (Instanzen „22.10.2026 - 20:43 - Fragen“ und „25.10.2026 - 11:07 - Fragen2“). Claude-Antworten von „25.10.2026 - 19:30 - Fragen“, der Film-Instanz und Fable 5.1 (1) und (2) (KI-Fragen 1–4 bzw. 1–3 und „Die Möglichkeit der Nähe“).
- Offen: CC-Fragen neu angehen; Blindtest Blade Runner (`skripte/blindtest-erzeugen.pl`, Datei `input-arc/2026-10-27/_blindtest/`) liegt geparkt; Svens Fragen 63–68, 72 aus seiner Liste geprüft, aber noch nicht eingebaut.
