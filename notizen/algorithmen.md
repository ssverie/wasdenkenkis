# Algorithmen-Visualisierungen – Regeln, Technik, Stand

Kurzfassung seit 2026-11-11. Die vollständige Geschichte steht wortgleich in `notizen/chronik/algorithmen.md`: **je App ein Absatz** (Bedienung, Darstellung, eigener Code, jede Prüfung mit Zahlen, Funde im Erklärtext, Archivort von Foto und Erklärtext). Vor Arbeit an einer bestehenden App dort ihren Absatz lesen (Suche nach dem Dateinamen, z. B. `kosaraju.html`). **Neue Apps dort unten als eigenen Absatz anhängen.**

## Regeln (Svens Entscheidungen)

- Grundlage ist Svens Buch Sedgewick/Wayne *Algorithmen* (deutsche Ausgabe der 4. Auflage, Java). Sven liefert je Algorithmus das Listing (Foto) und einen Erklärtext einer anderen Claude-Instanz (Nummer „[n]“ aus dem Chat).
- **Eigener Java-Code im Stil des Listings, nie den Buchcode abschreiben.** Nicht mitgelieferte Hilfsmethoden/-klassen eigene Fassung (und sagen).
- **Fehlt etwas aus dem Buch, Sven um ein Foto bitten** (Sven: „ich habe ja das buch, wenn was fehlt, melden“) – nicht raten, nicht nur Website-Dateien nehmen, dem Buch keinen Fehler unterstellen, bevor die Seite vorliegt (Anlass: mein falsches „Druckfehler“ bei tinyDG).
- Erklärtext **wortgleich** (Nummer „[n]“ am Anfang weg, Klebestellen mechanisch trennen, Wortvergleich per Skript); Verweise „[n]“ auf frühere Texte zu unseren Seiten verlinken. Funde im Text als `{{</* anmerkung */>}}`, nie den Text ändern.
- **Seitentitel mit Algorithmus-Nummer des Buchs:** „Selectionsort (Algorithmus 2.1)“; in Beschreibung und Code-Titel „Algorithmus 2.1 (Listing 2.4)“.
- Liste je Kapitel **absteigend nach `reihenfolge`** (Algorithmus-Nummer × 100, z. B. 2.7 → 270; Sven: „vorerst algo nr desc“). Feld nie vergessen.
- Handyfotos aus dem Upload-Ordner gehören am Ende ins Archiv (`input-arc\<datum>\Claude\` mit Seite/Listing/Abbildung im Namen).

## Aufbau

- `/it-konzepte/algorithmen/` zeigt **sechs Kapitel-Kacheln** (`kacheln = true`): Grundlagen, Sortieren, Suchen, Graphen, Strings, Im Kontext. Seiten in `content/it-konzepte/algorithmen/<kapitel>/<name>.md` (`kapitel` = `grundlagen` | `sortieren` | `suchen` | `graphen` | `strings` | `kontext`), Kapitelseiten aus `skripte/algorithmen-kapitelseiten.pl`. Alte Adressen `/algorithmen/<name>/` und `/it-konzepte/algorithmen/<name>/` leiten per `aliases` weiter. Seitenende: „← <Kapitel>“ und „Alle Algorithmen“.
- Seite: Shortcode `{{</* spiel src="/apps/<name>.html" … */>}}` + Erklärtext + Anmerkung. App als **eine Datei** `static/apps/<name>.html`.
- **Sortier-Rahmen** `static/apps/sortieren/rahmen.js` + `rahmen.css` (Einbindung mit `?v=3`): `SortierRahmen.starte({ code, baue, balken, marken, zaehler, protokoll, kopf, spruenge, test, indexAb })`. Farben einheitlich: orange = Element, um das es geht; blau = Vergleichspartner; grün = Tausch; grau/blass = unbeteiligt; hell = sortiert.
- **Apps mit eigener Bedienung** (Stapel, Heap, Suchen, Graphen, Strings): Abspiel-Logik aus `rahmen.js` übernehmen (am Ende „Abspielen“ = von vorn), **`stabil()`** für alles, dessen Höhe wechselt (Knöpfe springen nie nach oben), „↺ Neu starten“ = Testclient des Buchs. Code-Kasten mit dem Java-Code, jeder Schritt markiert eine Zeile. Protokoll im Stil der Buchabbildung.

## Prüf-Standard je App (alle bisherigen erfüllen ihn)

- Buchbeispiel Zeile für Zeile wie die Abbildung; Zähler mit **genauen** Werten statt Näherungen, wo die Näherung für kleine n täuscht.
- Hunderte Zufallseingaben gegen eine Referenz (Ergebnis, Invarianten in jedem Schritt).
- **Java-Code der App mit `javac`/`java` (JDK 21) übersetzen und ausführen** (Code per Wegwerf-Skript aus der App ziehen, Stubs für Bag/Queue/In/StdOut), Ergebnisse per SHA-256 mit der App vergleichen; gegen `java.util`-Klassen (TreeMap, HashMap, Arrays.sort, indexOf) prüfen.
- Code-Kasten hat Zeilen und jeder Schritt markiert eine (Lehre aus dem leeren Kasten beim Bag); Schritt-Knopf springt nie; kein SVG-Element außerhalb; Neu starten per echtem Klick; **Handy 375 px dunkel ohne Überbreite – eingebettet ist die Testbreite 311 px**, direkt `/apps/…?neu=n` testen (Zwischenspeicher). Dunkelmodus: „erledigt“ zusätzlich mit `opacity`.
- Testzugang `window.__<kurz>` im Skript.
- `date` erst nach `date` setzen (Zukunftsdatum → „Page Not Found“).

## Stand (2026-11-11) – 45 Apps, Buch komplett bis Algorithmus 6.3

- **Grundlagen:** binäre Suche (100), Stapel Array (110), Stapel Liste (120), Warteschlange (130), Bag (140), Union-Find (150), gewichtetes Quick-Union (151).
- **Sortieren:** Selectionsort 210, Insertionsort 220, Shellsort 230, Mergesort 240, Quicksort 250, Heap 260, Heapsort 270.
- **Suchen:** sequenzielle Suche 310, binäre Suche im Array 320, BST 330, Rot-Schwarz 340, Hashing Verkettung 350, lineare Sondierung 360.
- **Graphen:** Tiefensuche 410, Breitensuche 420, Komponenten 430, Erreichbarkeit 440, topologisch 450, Kosaraju 460, Prim 470, Kruskal 480, Dijkstra 490, azyklisch 500, Bellman-Ford 510.
- **Strings:** LSD 510, MSD 520, 3-Wege-Quicksort 530, Trie 540, TST 550, KMP 560, Boyer-Moore 570, Rabin-Karp 580, NFA 590, Huffman 600, LZW 610.
- **Im Kontext:** B-Baum 610, Suffixarray 620, Ford-Fulkerson 630.
- Offen aus der Chronik: Foto Abbildung 4.61 (Prim) fürs Archiv; Idee Pfadkomprimierung bei Union-Find; Kleinigkeit „Übung 2.4.19“ im Heap-Text (nur Faktenfrage, ohne Svens Wort keine Änderung).
