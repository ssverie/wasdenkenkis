+++
title = "Topologisches Sortieren (Algorithmus 4.5)"
description = "Das topologische Sortieren aus Sedgewick/Wayne, Algorithmus 4.5 (Listing 4.16) – erst die Zyklussuche mit onStack[], dann die umgekehrte Postorder einer Tiefensuche, an den Vorrangbedingungen der Studienfächer aus jobs.txt."
date = 2026-10-28T11:33:00+01:00
reihenfolge = 450
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "24.10.2026 - 17:21 - Algo"
buecher = ["algorithmen-2011"]
kontext = "Erklärtext: andere Claude-Opus-5.5-Instanz · Visualisierung und Java-Code: Claude Code Opus 5.5 (Redaktions-Instanz dieser Seite) · Buch: Sedgewick/Wayne, Algorithmen, Algorithmus 4.5 (Listing 4.16)"
+++

{{< spiel src="/apps/topologisch.html" titel="Topologisches Sortieren – Visualisierung" >}}

**So geht's:** Beim Öffnen läuft der Testclient mit den Fächern aus jobs.txt. Zuerst baut `SymbolDigraph` aus den Namen den Digraphen, die Tabelle rechts zeigt die Nummer jedes Fachs. Dann kommt **Phase 1, die Zyklussuche**: Orange ist der laufende `dfs`-Aufruf, orange gestrichelt sind die Knoten auf dem Rekursionspfad (`onStack`), blau ist die Kante, die gerade geprüft wird. Danach folgt **Phase 2, die Tiefensuche für die Ordnung**: Jeder Knoten, der fertig wird, wandert oben auf den Stapel `reversePost`. Am Ende liest man ihn von oben ab, das ist die topologische Ordnung. Am Graphen steht dann der Platz jedes Fachs, und die Probe zeigt, dass alle Kanten nach vorn zeigen. „mit Zyklus“ hängt die Zeile `Theoretical CS/Introduction to CS` an. Damit entsteht ein Kreis, die Zyklussuche findet ihn und färbt ihn rot, und es gibt keine Ordnung. „Zufalls-DAG“ und „Zufallsgraph“ erzeugen neue Beispiele, „↺ Neu starten“ springt zurück zu jobs.txt.

## Erklärung

Topologisches Sortieren (Algorithmus 4.5), Klasse `Topological`.

Das Problem: Ablaufplanung mit Vorrangbedingungen. Aufgaben mit Abhängigkeiten, z. B. Studienfächer: Analysis vor Linearer Algebra, Einführung Informatik vor Algorithmen, Algorithmen vor Theoretischer Informatik. Gesucht ist eine Reihenfolge, in der jede Aufgabe erst nach allen ihren Voraussetzungen kommt. Als Digraph: Kante v→w heißt „v vor w“. Topologische Ordnung = alle Kanten zeigen nach vorn.

Voraussetzung: kein Zyklus. Wenn A vor B, B vor C und C vor A verlangt ist, gibt es keine Lösung. Der Graph muss ein DAG sein (directed acyclic graph, gerichtet azyklisch).

Der Code ist kurz, weil er sich auf zwei Hilfsklassen stützt:

* `DirectedCycle`: prüft per Tiefensuche, ob ein Zyklus existiert. Trick: Zusätzlich zu `marked[]` ein Array `onStack[]` für die Knoten, die gerade im aktuellen Rekursionspfad liegen. Trifft die Suche auf einen Knoten, der noch auf dem Pfad ist, ist ein Zyklus gefunden.
* `DepthFirstOrder`: normale Tiefensuche, merkt sich aber, in welcher Reihenfolge Knoten fertig werden (Postorder). Diese Reihenfolge wird auf einen Stapel [\[15\]]({{< relref "stapel-liste" >}}) gelegt, beim Auslesen kommt sie umgekehrt heraus: `reversePost()`.
* `Topological`: Zyklus vorhanden → `order` bleibt `null`, kein DAG. Sonst `order = reversePost()`.
* `isDAG()`: `order != null`.

Satz F: Die umgekehrte Postorder-Reihenfolge eines DAG ist eine topologische Sortierung.

Beweis (für jede Kante v→w): Wenn `dfs(v)` die Kante prüft, gibt es drei Fälle:

* `dfs(w)` war schon aufgerufen und ist fertig → w ist vor v fertig.
* `dfs(w)` wurde noch nicht aufgerufen → wird jetzt aufgerufen und endet, bevor v endet.
* `dfs(w)` wurde aufgerufen, ist aber noch nicht fertig → dann gäbe es einen Pfad w→…→v, zusammen mit v→w ein Zyklus. Im DAG unmöglich.
* In allen möglichen Fällen wird w vor v fertig. Umgedreht steht also v vor w, genau wie verlangt.

Testclient: `SymbolDigraph` übersetzt Namen (Fächer aus jobs.txt) in Knotennummern und zurück, damit Klartext statt Zahlen ausgegeben wird. Trennzeichen wird mitgegeben, weil Fachnamen Leerzeichen enthalten.

Kosten: Zyklusprüfung plus eine Tiefensuche, insgesamt proportional zu V + E.

Typische Anwendungen: Kursplanung, Build-Systeme (welche Datei zuerst kompilieren), Paketmanager (Abhängigkeiten installieren), Tabellenkalkulation (Zellen in Abhängigkeitsreihenfolge berechnen).

Stand Kapitel 4:

* Algorithmus 4.1: Tiefensuche für Pfade [\[30\]]({{< relref "tiefensuche" >}})
* Algorithmus 4.2: Breitensuche für kürzeste Pfade [\[31\]]({{< relref "breitensuche" >}})
* Algorithmus 4.3: Zusammenhangskomponenten [\[32\]]({{< relref "komponenten" >}})
* Algorithmus 4.4: Erreichbarkeit in Digraphen [\[33\]]({{< relref "erreichbarkeit" >}})
* Algorithmus 4.5: Topologisches Sortieren [34]

{{< anmerkung >}}
**Mit Java nachgeprüft:** Der Java-Code der Visualisierung gibt für jobs.txt die 13 Fächer in derselben Reihenfolge aus wie das Beispiel auf der Website zum Buch (Calculus, Linear Algebra, Introduction to CS … Computational Biology). Außerdem habe ich 400 Zufallsgraphen geprüft, darunter 183 mit Zyklus: Ordnung bzw. gefundener Zyklus sind in Java und Visualisierung gleich. Jede Ordnung lässt alle Kanten nach vorn zeigen, jeder gemeldete Zyklus besteht aus echten Kanten, und eine unabhängige Prüfung (Kahn-Verfahren: immer einen Knoten ohne offene Voraussetzung wegnehmen) kommt jedes Mal zum selben Urteil „DAG oder nicht“. In Phase 2 hatte in keinem Schritt ein fertiger Knoten einen noch nicht fertigen Nachfolger – der dritte Fall im Beweis kommt also wirklich nie vor. Das Listing zeigt nur `Topological`. `DirectedCycle`, `DepthFirstOrder` und `SymbolDigraph` habe ich darum in eigenen Fassungen geschrieben (`ZyklusSuche`, `TiefensucheOrdnung`, `SymbolDigraph`). Die Namen aus dem Erklärtext (`onStack`, `reversePost`, `order`, `isDAG`) sind geblieben. `main()` nimmt die Zeilen von jobs.txt direkt im Code statt aus der Datei, weitere Zeilen kommen von der Befehlszeile. Bei einem Zyklus meldet `main()` „Kein DAG“, statt wie das Listing mit `order() == null` in eine NullPointerException zu laufen.
{{< /anmerkung >}}
