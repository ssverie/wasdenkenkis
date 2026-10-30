+++
title = "The Mythical Man-Month – Zusammenfassung und Einordnung"
description = "Frederick P. Brooks Jr., The Mythical Man-Month: Essays on Software Engineering (1975, Jubiläumsausgabe 1995)"
date = 2026-10-30T18:58:38+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["the-mythical-man-month-1995"]
+++

## Einleitung

Das älteste Buch der Reihe, und vermutlich das am häufigsten zitierte Buch über Softwareprojekte überhaupt. Seine bekannteste These kennt fast jeder Entwickler, auch ohne das Buch gelesen zu haben: **Wer einem verspäteten Softwareprojekt mehr Leute gibt, verspätet es noch mehr.**

### Autor und Kontext

Frederick P. Brooks Jr. leitete bei IBM in den 1960er Jahren die Entwicklung der Rechnerfamilie **System/360** und anschließend des Betriebssystems **OS/360**, eines der größten Softwareprojekte seiner Zeit, mit Tausenden Beteiligten. Das Projekt war technisch einflussreich, aber berüchtigt verspätet und teurer als geplant. Das Buch ist im Kern Brooks' Versuch zu verstehen, warum.

Danach gründete Brooks die Informatikfakultät der University of North Carolina in Chapel Hill. 1999 erhielt er den Turing Award. Er starb 2022.

### Zwei Ausgaben

|  | Ausgabe 1975 | Jubiläumsausgabe 1995 |
|---|---|---|
| Inhalt | 15 Essays | dieselben 15 Essays, unverändert |
| Neu | – | *No Silver Bullet* (1986), *„No Silver Bullet“ Refired*, eine Liste der Thesen des Buchs mit Bewertung, ein Kapitel „Nach 20 Jahren“ |

Brooks hat die Originalessays bewusst nicht überarbeitet, sondern in den neuen Kapiteln kommentiert, was er inzwischen anders sieht. Das macht die Jubiläumsausgabe besonders wertvoll: Man sieht einen Autor, der sich selbst korrigiert.

### Aufbau

| Kapitel | Thema |
|---|---|
| 1–2 | Die Teergrube, der Mythos vom Mann-Monat |
| 3–4 | Das Chirurgenteam, konzeptionelle Integrität |
| 5–7 | Zweitsystemeffekt, Kommunikation, Turmbau zu Babel |
| 8–10 | Schätzen, Speicherbudgets, wichtige Dokumente |
| 11–15 | Wegwerfen, Werkzeuge, Integration, Termine, Dokumentation |
| 16–17 | No Silver Bullet und die Antwort auf Kritik daran |
| 18–19 | Thesen des Buchs und Rückschau nach 20 Jahren |

### Der Kontext ist wichtig

Die Essays stammen aus einer Welt mit Großrechnern, Lochkarten, Assembler, knappem Speicher und Teams, die Tausende Personen umfassen konnten. Viele Details, etwa über Speicherbudgets oder Terminalzugang, wirken heute fremd. Erstaunlich ist, wie viel trotzdem gilt: Die Probleme liegen weniger in der Technik als bei Menschen, Kommunikation und Komplexität. Die Frage beim Lesen ist deshalb immer: Was war technikbedingt, und was ist zeitlos?

## Die Teergrube (Kapitel 1)

Brooks vergleicht große Softwareprojekte mit prähistorischen Teergruben, in denen selbst große, starke Tiere versanken: Jedes einzelne Problem scheint lösbar, aber zusammen ziehen sie das Projekt nach unten.

### Programm, Produkt, System

Eine seiner einflussreichsten Unterscheidungen:

|  | Für eine Person | Für andere nutzbar |
|---|---|---|
| **Einzeln** | **Programm:** läuft beim Autor | **Programmprodukt:** getestet, dokumentiert, wartbar, für andere nutzbar, etwa dreimal so teuer |
| **Im Verbund** | **Programmsystem:** mit anderen Komponenten integriert, über Schnittstellen, ebenfalls etwa dreimal so teuer | **Programmsystemprodukt:** beides, etwa **neunmal** so teuer wie das ursprüngliche Programm |

Das erklärt, warum zwei Entwickler in einer Garage scheinbar schneller sind als ein großes Team: Sie bauen ein Programm, das Team ein Programmsystemprodukt.

### Freuden und Leiden des Handwerks

Brooks beschreibt auch, warum Programmieren Freude macht: das Erschaffen, das Nützlichsein, das Puzzle, das ständige Lernen, das Arbeiten in einem Medium, das fast so flexibel ist wie Gedanken. Und die Leiden: Perfektion ist nötig, andere setzen die Ziele, man hängt von fremden Programmen ab, Fehlersuche ist mühsam, und oft ist das Produkt bei Fertigstellung schon veraltet.

## Der Mythos vom Mann-Monat (Kapitel 2)

Das Titelkapitel und das berühmteste des Buchs.

### Optimismus

Programmierer sind Optimisten. Weil das Medium so flexibel ist, nehmen sie an, dass alles gut gehen wird, und planen ohne Puffer für Fehler. In anderen Handwerken widersetzt sich das Material; in Software stammt der Widerstand aus den eigenen Ideen, und den unterschätzt man.

### Menschen und Monate sind nicht austauschbar

Der **Mann-Monat** als Einheit unterstellt, dass man Menschen gegen Zeit tauschen kann: Zehn Leute schaffen in einem Monat, was einer in zehn Monaten schafft. Das stimmt nur für Aufgaben, die sich **vollständig aufteilen lassen und keine Kommunikation brauchen**, etwa Baumwollpflücken. Für Software gilt das nicht:

- **Sequenzielle Abhängigkeiten:** Manche Aufgaben lassen sich nicht aufteilen. Brooks' bekanntes Bild: Eine Schwangerschaft dauert neun Monate, egal wie viele Frauen man zuweist.
- **Einarbeitung:** Neue Leute müssen eingearbeitet werden, und zwar von denen, die eigentlich arbeiten sollten.
- **Kommunikation:** Bei n Personen gibt es n × (n − 1) / 2 mögliche Kommunikationswege. Der Aufwand wächst quadratisch, nicht linear.

### Brooks' Gesetz

Daraus folgt der berühmte Satz: **Einem verspäteten Softwareprojekt mehr Personal hinzuzufügen, verspätet es weiter.** Die neuen Leute brauchen Einarbeitung, die Arbeit muss neu aufgeteilt werden, und der Kommunikationsaufwand steigt.

### Brooks' Zeitplanregel

Aus seiner Erfahrung leitet Brooks eine Faustregel ab:

| Anteil | Tätigkeit |
|---|---|
| 1/3 | Planung |
| 1/6 | Programmieren |
| 1/4 | Komponententests und frühe Systemtests |
| 1/4 | Systemtest mit allen Komponenten |

Das eigentliche Programmieren ist also der kleinste Teil. Projekte, die nur das Programmieren schätzen, liegen fast zwangsläufig daneben.

### Rückgratlose Schätzungen

Brooks kritisiert, dass Termine oft nicht aus Schätzungen entstehen, sondern aus Wünschen von Kunden oder Management, und dass Projektleiter ihre Schätzungen nicht verteidigen, weil sie keine harten Daten haben. Seine Forderung: Daten über Produktivität sammeln, damit Schätzungen begründbar werden. Das ist genau der Ansatz, den McConnell und später Accelerate verfolgen.

## Das Chirurgenteam (Kapitel 3)

Brooks beginnt mit einer damals neuen Beobachtung: Zwischen guten und schwachen Programmierern gibt es **Produktivitätsunterschiede von etwa zehn zu eins**, bei gleicher Erfahrung. Daraus folgt ein Dilemma:

- Ein **kleines, exzellentes Team** arbeitet am effizientesten, ist aber für sehr große Systeme zu langsam.
- Ein **großes Team** ist schnell genug, verliert aber durch Kommunikation und Mittelmaß einen großen Teil seiner Wirkung.

Brooks' Lösung, nach einem Vorschlag von Harlan Mills: das **Chirurgenteam**. Ein einziger Chefprogrammierer schreibt und entwirft den Kern, wie ein Chirurg im Operationssaal. Die anderen unterstützen ihn, statt eigene Teile zu bauen:

| Rolle | Aufgabe |
|---|---|
| Chirurg | entwirft, programmiert, testet, dokumentiert den Kern |
| Kopilot | Sparringspartner, kennt den gesamten Code, übernimmt bei Bedarf |
| Verwalter | Budget, Personal, Räume |
| Redakteur | überarbeitet die Dokumentation |
| Werkzeugmacher | baut Werkzeuge für den Chirurgen |
| Tester | entwirft Testfälle und Testdaten |
| Sprachexperte | kennt die Feinheiten der Programmiersprache |
| Programmverwalter | verwaltet Code und Ergebnisse |

So bleibt der Entwurf in einem Kopf, während das Team als Ganzes groß genug ist.

### Einordnung

Das Chirurgenteam hat sich so nie durchgesetzt. Viele Rollen sind durch Werkzeuge ersetzt: Versionskontrolle statt Programmverwalter, IDEs und Linter statt Sprachexperte, Build-Pipelines statt Werkzeugmacher. Die Grundidee lebt aber weiter: in kleinen, autonomen Teams, in Pair Programming mit Kopilot und in der Rolle des „Tech Lead“. Die These der zehnfachen Produktivitätsunterschiede ist bis heute umstritten. McConnell zitiert ähnliche Befunde, andere weisen auf Schwächen der alten Studien hin.

## Konzeptionelle Integrität (Kapitel 4)

Für Brooks ist dies das wichtigste Kapitel des Buchs. Seine These: **Konzeptionelle Integrität ist die wichtigste Eigenschaft eines Systementwurfs.** Ein System, das einer einheitlichen Idee folgt, ist besser als eines mit vielen guten, aber unabhängigen Ideen.

Sein Bild ist die Kathedrale von Reims, die über Generationen gebaut wurde und trotzdem wie aus einem Guss wirkt, weil die Baumeister den ursprünglichen Plan respektierten. Die meisten Softwaresysteme gleichen dagegen Kirchen, an die jede Generation einen eigenen Stil angebaut hat.

### Aristokratie statt Demokratie

Konzeptionelle Integrität entsteht nur, wenn **wenige Köpfe** den Entwurf verantworten. Brooks trennt deshalb:

- **Architektur:** die vollständige und detaillierte Beschreibung dessen, was das System für den Nutzer tut, also die Schnittstelle. Sie wird von einem Architekten oder einer kleinen Gruppe verantwortet.
- **Implementierung:** wie das System es tut. Hier haben die Entwickler viel Freiraum.

Er nennt das bewusst provokant „Aristokratie“ und verteidigt es gegen den Einwand, dass Implementierer dadurch zu bloßen Ausführenden würden: Kreativität in der Implementierung ist ebenso anspruchsvoll, nur auf einer anderen Ebene.

### Einordnung

Der Gedanke der konzeptionellen Integrität hat enorme Wirkung gehabt. Evans' **Ubiquitous Language** und das einheitliche Modell innerhalb eines Bounded Context sind eine Form davon, ebenso Ousterhouts Forderung nach **Konsistenz**. Die strenge Trennung von Architekt und Implementierern widerspricht dagegen agilen Teams, in denen Entwurf und Umsetzung in denselben Händen liegen, und Evans' „Hands-on Modelers“. Wie man konzeptionelle Integrität ohne einen einzigen Architekten erreicht, ist eine der großen Fragen, die das Buch hinterlässt.

## Der Zweitsystemeffekt (Kapitel 5)

Eine der zeitlosesten Beobachtungen des Buchs: **Das gefährlichste System, das ein Architekt je baut, ist sein zweites.**

Beim ersten System ist man vorsichtig, weil man nicht weiß, was man tut. Viele Ideen werden aufgeschoben. Beim zweiten System fühlt man sich sicher und baut all die aufgeschobenen Ideen ein, dazu Verallgemeinerungen für Fälle, die nie eintreten werden. Das Ergebnis ist überladen, langsam und spät.

Brooks nennt Beispiele aus seiner Zeit bei IBM, bei denen Nachfolgesysteme mit Funktionen überfrachtet wurden, die kaum jemand brauchte, oder bei denen Techniken verfeinert wurden, die durch neue Entwicklungen bereits überholt waren.

Sein Gegenmittel: Disziplin. Jeder Funktion einen Preis zuordnen, etwa in Speicher oder Zeit, und bewusst Nein sagen. Projektleiter sollen darauf achten, dass ein Architekt mit genau einem vorherigen System nicht unbeaufsichtigt den Entwurf verantwortet.

### Einordnung

Der Zweitsystemeffekt taucht in der Reihe immer wieder auf: als Fowlers **Speculative Generality**, als Thomas' und Hunts Warnung vor zu viel Konfigurierbarkeit, als YAGNI, und als die Patternitis der 2000er, die in der Design-Patterns-Zusammenfassung beschrieben ist. Auch der „große Neuschreib“ eines Altsystems ist oft ein Zweitsystem.

## Die Botschaft weitergeben (Kapitel 6)

Wie sorgt man dafür, dass Hunderte Implementierer dieselbe Architektur umsetzen? Brooks beschreibt Mittel aus dem OS/360-Projekt:

- **Ein schriftliches Handbuch** als verbindliche Spezifikation, von wenigen Autoren geschrieben, damit es einheitlich bleibt.
- **Formale Definitionen** ergänzen die Prosa, ersetzen sie aber nicht. Wenn beide existieren, muss klar sein, welche maßgeblich ist.
- **Regelmäßige Besprechungen** zwischen Architekten und Implementierern, und seltene große Runden, um offene Fragen endgültig zu entscheiden.
- **Ein Logbuch der Fragen und Antworten:** Wenn ein Implementierer den Architekten anruft, wird die Antwort aufgeschrieben und an alle verteilt.
- **Unabhängige Produkttests**, die das System gegen die Spezifikation prüfen.

## Warum der Turmbau zu Babel scheiterte (Kapitel 7)

Brooks deutet die biblische Geschichte als Projektbericht: Die Bauleute hatten ein klares Ziel, genug Arbeitskräfte, Material und Zeit, aber sie konnten nicht mehr **miteinander reden**. Daran scheiterte das Projekt.

Für Softwareprojekte empfiehlt er:

- **Informelle Kommunikation** fördern, also Telefon, Gespräche auf dem Gang.
- **Regelmäßige Besprechungen** mit klarer Struktur.
- **Ein Projekthandbuch**, in dem alle Dokumente an einer Stelle liegen und aktuell gehalten werden. Für OS/360 wuchs es so stark, dass es auf Mikrofilm umgestellt werden musste.
- **Organisation** als Baum für Verantwortung, ergänzt durch Kommunikation quer zum Baum.

Er unterscheidet zwei Rollen an der Spitze: den **Produzenten**, der Ressourcen, Termine und Menschen verantwortet, und den **technischen Direktor**, der das Konzept verantwortet. Beide können dieselbe Person sein, müssen es aber nicht.

### Einordnung

Die Mittel sind gealtert, die Probleme nicht. Aus dem Projekthandbuch wurden Wikis und Repositories, aus dem Fragenlogbuch Architecture Decision Records und interne Foren. Conways Gesetz, das ein paar Jahre vor dem Buch formuliert wurde, und *Team Topologies* setzen genau hier an: Kommunikationsstrukturen bestimmen die Systemstruktur.

## Schätzen (Kapitel 8)

Brooks sammelt die wenigen Daten, die es damals gab, und zieht daraus einige Schlüsse:

- **Aufwand wächst überproportional mit der Größe.** Nach den von ihm zitierten Daten steigt der Aufwand etwa mit der Größe hoch 1,5. Ein doppelt so großes System kostet also fast dreimal so viel.
- **Die Art des Systems zählt.** Betriebssysteme waren in seinen Daten deutlich aufwendiger pro Codezeile als Compiler, und diese aufwendiger als Anwendungsprogramme. Je mehr Wechselwirkungen, desto teurer.
- **Höhere Programmiersprachen** steigern die Produktivität stark, weil Entwickler pro Tag etwa gleich viele Anweisungen schreiben, egal in welcher Sprache, eine Anweisung in einer höheren Sprache aber viel mehr bewirkt.
- **Nur ein Teil der Zeit ist Programmieren.** Besprechungen, Wartezeiten, Krankheit, Verwaltung und Unterbrechungen fressen einen großen Teil.

Dieses Kapitel ist der Vorläufer von McConnells Daten zur Projektgröße und seinem späteren Buch über Schätzung.

## Zehn Pfund in einem Fünf-Pfund-Sack (Kapitel 9)

Der Titel bezieht sich auf knappen Speicher, eine der größten Sorgen der 1960er. Brooks beschreibt, wie man Größe kontrolliert: Budgets für Speicher und Laufzeit je Komponente festlegen, die Einhaltung messen und Architekten für das Ganze verantwortlich machen, damit Teams nicht lokal sparen und global verschwenden.

Der zeitlose Teil steckt in einem berühmten Gedanken: **Die Darstellung der Daten ist das Wesen des Programmierens.** Brooks formuliert sinngemäß: Wer nur den Ablauf eines Programms zeigt, aber seine Datenstrukturen verbirgt, lässt den Leser im Dunkeln. Wer die Datenstrukturen zeigt, macht den Ablauf meist überflüssig, weil er sich von selbst ergibt.

Dieser Gedanke zieht sich durch die ganze Reihe: Kleppmanns Datenmodelle, Evans' Value Objects und Aggregate, Weidigs Records und Kiehls datenorientierte Programmierung beruhen alle auf der Einsicht, dass das richtige Datenmodell die Logik vereinfacht.

## Die Dokumenten-Hypothese (Kapitel 10)

Inmitten der Flut von Papier gibt es eine **kleine Zahl kritischer Dokumente**, um die sich die Projektführung dreht. Für Softwareprojekte nennt Brooks:

| Dokument | Frage |
|---|---|
| Ziele | Was soll erreicht werden, welche Einschränkungen gelten? |
| Spezifikation | Was tut das System genau? |
| Zeitplan | Wann ist was fertig? |
| Budget | Was darf es kosten? |
| Organigramm | Wer ist wofür verantwortlich? |
| Raumplanung | Wer arbeitet wo? |

Der eigentliche Wert dieser Dokumente liegt nicht im Ergebnis, sondern im **Schreiben**: Wer etwas aufschreiben muss, muss Entscheidungen treffen und Lücken erkennen, die im Gespräch verborgen bleiben. Das ist Ousterhouts „Kommentare zuerst schreiben“ und McConnells Pseudocode-Prozess auf Projektebene.

## Plane, eines wegzuwerfen (Kapitel 11)

In der Chemie baut man vor einer großen Anlage eine **Pilotanlage**, um zu lernen. Brooks überträgt das: Das erste System, das man baut, ist fast immer unbrauchbar, zu langsam, zu groß, zu umständlich. Man wird es ohnehin wegwerfen, **also sollte man es von vornherein einplanen**, statt es den Kunden zu liefern.

Dazu kommen zwei weitere Gedanken:

- **Für Veränderung planen:** Das System so bauen, dass es sich ändern lässt, mit Modularität, Unterprogrammen, klaren Schnittstellen und Dokumentation. Und die Organisation so aufstellen, dass Menschen ihre Rollen wechseln können.
- **Wartung ist Entropie:** Fehlerbehebungen führen mit beträchtlicher Wahrscheinlichkeit neue Fehler ein, Brooks nennt Werte zwischen 20 und 50 Prozent. Mit der Zeit wird ein System immer unordentlicher, bis eine Überarbeitung nötig ist. Er stützt sich dabei auf Untersuchungen von Belady und Lehman an OS/360.

In der Jubiläumsausgabe nimmt Brooks den Rat zum Wegwerfen ausdrücklich zurück, siehe unten.

## Scharfe Werkzeuge (Kapitel 12)

Teams brauchen gute Werkzeuge, und Brooks plädiert für **gemeinsame, zentral gepflegte Werkzeuge** statt individueller Lösungen. Er beschreibt Simulatoren für noch nicht vorhandene Hardware, Bibliotheken, Programmverwaltung und, damals neu, interaktives Programmieren über Terminals statt Lochkarten, das die Produktivität deutlich steigere. Der Werkzeugmacher im Chirurgenteam stammt aus diesem Gedanken.

## Das Ganze und die Teile (Kapitel 13)

Wie baut man ein System, das funktioniert?

- **Fehler vermeiden, statt sie zu finden:** die Spezifikation vor der Implementierung von unabhängiger Seite prüfen lassen.
- **Top-down-Entwurf** durch schrittweise Verfeinerung nach Niklaus Wirth, und strukturierte Programmierung nach Dijkstra.
- **Komponenten einzeln testen**, bevor sie integriert werden.
- **Systemtest mit Gerüsten:** Attrappen für fehlende Teile, Testdaten, Hilfsprogramme. Brooks nennt das „Scaffolding“, heute würde man von Stubs und Testumgebungen sprechen.
- **Eine Komponente nach der anderen** hinzufügen, damit Fehler eindeutig zuzuordnen sind, und **Änderungen bündeln** statt ständig neue Versionen ins System zu schieben.

Das ist im Kern McConnells inkrementelle Integration und GOOS' Walking Skeleton, aus einer Zeit vor automatisierten Tests.

## Wie eine Katastrophe ausgebrütet wird (Kapitel 14)

Ein Satz aus diesem Kapitel gehört zu den bekanntesten des Buchs, sinngemäß: Wie wird ein Projekt ein Jahr zu spät? **Einen Tag nach dem anderen.**

Katastrophen entstehen selten durch einen großen Schlag, sondern durch viele kleine Verzögerungen, die jeweils harmlos wirken: ein Krankheitstag, ein defekter Rechner, eine Besprechung. Brooks' Gegenmittel:

- **Scharfe Meilensteine:** konkrete, überprüfbare Ereignisse statt unscharfer Zustände. „Programmieren zu 90 Prozent fertig“ ist kein Meilenstein, denn die letzten zehn Prozent dauern erfahrungsgemäß so lange wie die ersten neunzig.
- **Kritischer Pfad:** wissen, welche Verzögerungen das Gesamtprojekt verzögern und welche nicht, etwa mit einem PERT-Diagramm.
- **Ehrliche Statusberichte:** Damit Teamleiter Probleme offen melden, darf das Management nicht bei jeder schlechten Nachricht eingreifen. Brooks unterscheidet deshalb Statusbesprechungen, in denen nur informiert wird, von Besprechungen, in denen gehandelt wird.

Der letzte Punkt ist eine frühe Beschreibung dessen, was Westrum in Accelerate als **generative Kultur** misst: Wer schlechte Nachrichten überbringt, darf nicht bestraft werden.

## Die andere Seite (Kapitel 15)

Ein Programm hat zwei Gesichter: eines für die Maschine und eines für Menschen. Brooks beschreibt, welche Dokumentation Nutzer und Wartende brauchen: Zweck, Umgebung, Eingaben und Ausgaben, Optionen, Laufzeit, Genauigkeit, Testfälle. Er kritisiert die damals vorgeschriebenen Flussdiagramme als meist wertlos und plädiert für **selbstdokumentierende Programme**, bei denen die Dokumentation im Quelltext steht, damit sie mit ihm gepflegt wird. Die Spannung zwischen Martin und Ousterhout über Kommentare ist hier schon angelegt.

## No Silver Bullet (Kapitel 16)

Der Essay von 1986 ist vielleicht noch einflussreicher als das ursprüngliche Buch. Der Titel spielt auf Werwölfe an, die man nur mit einer Silberkugel töten kann: Softwareprojekte verwandeln sich oft vom harmlosen Vorhaben in ein Monster aus verpassten Terminen und überzogenen Budgets, und man wünscht sich eine Silberkugel dagegen.

Brooks' These: **Es gibt keine einzelne Entwicklung, weder in Technik noch in Management, die innerhalb eines Jahrzehnts eine Verbesserung um eine Größenordnung bei Produktivität, Zuverlässigkeit oder Einfachheit verspricht.**

### Wesentliche und zufällige Schwierigkeiten

In Anlehnung an Aristoteles unterscheidet Brooks:

- **Zufällige Schwierigkeiten** entstehen durch die Werkzeuge und Umstände, mit denen wir Software bauen, etwa Maschinensprache, lange Wartezeiten auf Rechenläufe, umständliche Umgebungen.
- **Wesentliche Schwierigkeiten** liegen in der Natur von Software selbst.

Die großen Fortschritte der Vergangenheit, höhere Programmiersprachen, Time-Sharing und integrierte Entwicklungsumgebungen, haben vor allem **zufällige** Schwierigkeiten beseitigt. Wenn der wesentliche Teil der Arbeit nicht mindestens neun Zehntel ausmacht, kann selbst das vollständige Beseitigen der zufälligen Schwierigkeiten keine Verbesserung um eine Größenordnung bringen.

### Die vier wesentlichen Schwierigkeiten

| Eigenschaft | Bedeutung |
|---|---|
| **Komplexität** | Software hat mehr unterschiedliche Zustände und Teile als fast jedes andere menschliche Konstrukt. Keine zwei Teile sind gleich, sonst würde man sie zusammenfassen. |
| **Konformität** | Software muss sich an willkürliche Gegebenheiten anpassen: Gesetze, Organisationen, andere Systeme, menschliche Gewohnheiten. Diese folgen keiner einheitlichen Logik. |
| **Veränderlichkeit** | Software wird ständig geändert, weil sie leicht änderbar erscheint und weil sich ihre Umgebung ändert. |
| **Unsichtbarkeit** | Software hat keine natürliche räumliche Darstellung. Jedes Diagramm zeigt nur einen Ausschnitt. |

### Hoffnungen, die nicht tragen

Brooks prüft die damals diskutierten Kandidaten: neue Programmiersprachen, objektorientierte Programmierung, künstliche Intelligenz und Expertensysteme, automatische Programmierung, grafische Programmierung, Programmverifikation, bessere Werkzeuge und Arbeitsplatzrechner. Jeder bringe Verbesserungen, aber keiner eine Größenordnung, weil keiner die wesentlichen Schwierigkeiten beseitige.

### Was wirklich hilft

Statt einer Silberkugel nennt er vier Ansätze, die das Wesentliche angreifen:

1. **Kaufen statt bauen:** Standardsoftware nutzen, wo immer es geht. Das wirksamste Mittel überhaupt.
2. **Anforderungen verfeinern und Prototypen bauen:** Das Schwierigste ist zu entscheiden, was gebaut werden soll. Kunden wissen es meist erst, wenn sie etwas sehen.
3. **Software wachsen lassen statt bauen:** inkrementell entwickeln, ein lauffähiges System schrittweise erweitern.
4. **Große Designer fördern:** Die besten Designer sind um ein Vielfaches besser als durchschnittliche; Organisationen sollen sie erkennen und entwickeln.

## No Silver Bullet, erneut abgefeuert (Kapitel 17)

In der Jubiläumsausgabe antwortet Brooks auf neun Jahre Kritik. Er hält an der These fest und stellt fest, dass sich keine Silberkugel gezeigt hat. Objektorientierung bezeichnet er als „Messingkugel“: hilfreich, aber langsamer wirksam als erhofft, weil ihr Nutzen vor allem in Wiederverwendung liegt, die schwer zu erreichen ist.

### Einordnung heute

Die Unterscheidung von wesentlicher und zufälliger Komplexität ist eine der langlebigsten Ideen der Softwaretechnik. McConnell baut sein Designkapitel darauf auf, Ousterhout sein ganzes Buch, Kleppmann seinen Wartbarkeitsbegriff.

Mit KI-gestützter Programmierung stellt sich Brooks' Frage neu: Ist sie die Silberkugel? Aus Brooks' Sicht wäre die Frage, ob sie wesentliche oder vor allem zufällige Schwierigkeiten adressiert. Code schneller zu schreiben greift die zufälligen an. Ob sie auch helfen, zu entscheiden, **was** gebaut werden soll, und Komplexität, Konformität und Veränderlichkeit zu beherrschen, ist offen. Der DORA-Befund, dass KI vor allem bestehende Stärken und Schwächen verstärkt, passt bemerkenswert gut zu Brooks' Argumentation.

## Brooks' Rückschau nach 20 Jahren (Kapitel 18–19)

Die beiden letzten Kapitel der Jubiläumsausgabe sind selten in der Fachliteratur: Ein Autor prüft sein eigenes, berühmtes Buch und sagt offen, wo er sich geirrt hat.

### Kapitel 18: die Thesen im Überblick

Brooks fasst das Buch in einer Liste kurzer Thesen zusammen, Kapitel für Kapitel, und kommentiert viele davon. Die Liste eignet sich als Kurzfassung des ganzen Buchs und als Checkliste für eigene Projekte.

### Kapitel 19: was bleibt, was nicht

**Was er bekräftigt:**

- **Konzeptionelle Integrität** bleibt für ihn das Zentrum guten Designs. Als Beleg nennt er die grafische Oberfläche mit Fenstern, Symbolen, Menüs und Zeiger, deren Erfolg er ihrer einheitlichen Metapher zuschreibt.
- **Der Architekt** als verantwortliche Person für die Gesamtidee bleibt nötig, gerade in großen Teams.
- **Der Zweitsystemeffekt** gilt weiter, und er sieht ihn in vielen Produkten der 1990er.
- **Brooks' Gesetz** hält er im Kern für richtig, räumt aber ein, dass es eine Vereinfachung ist: Wer früh genug Leute hinzufügt und sie gut einarbeitet, kann ein Projekt durchaus beschleunigen. Gefährlich ist es vor allem spät im Projekt.

**Was er zurücknimmt:**

- **„Plane, eines wegzuwerfen“ war falsch**, oder zumindest zu einfach. Der Rat beruhte auf dem Wasserfallmodell, in dem man ein System komplett baut und dann von vorn beginnt. Besser sei **inkrementelle Entwicklung**: ein lauffähiges System, das schrittweise wächst. Das ist genau das, was er in *No Silver Bullet* als „wachsen lassen“ empfohlen hatte.
- **Parnas hatte recht, und ich nicht.** Im OS/360-Projekt sollte jeder Programmierer Zugriff auf die Dokumentation und Schnittstellen aller anderen haben. David Parnas plädierte für **Information Hiding**: Module sollen ihre Interna verbergen, und andere sollen sie nicht kennen müssen. Brooks schreibt, dass er davon inzwischen überzeugt sei. Das ist die Idee, auf der Ousterhouts ganzes Buch aufbaut.
- **Das Wasserfallmodell selbst** hält er für falsch: Man kann eine Spezifikation nicht vollständig im Voraus festlegen.

**Was sich verändert hat:**

- **Menschen sind alles:** Er verweist auf *Peopleware* von DeMarco und Lister und betont, dass die Qualität der Menschen und ihrer Arbeitsumgebung wichtiger ist als Methoden und Werkzeuge.
- **Die Kraft, Macht abzugeben:** Dezentralisierung, also Teams Verantwortung und Entscheidungsfreiheit zu übertragen, setzt Kreativität frei.
- **Der Massenmarkt für Software** hat die Lage grundlegend verändert: Viele Organisationen kaufen Standardsoftware, statt alles selbst zu bauen, was er in *No Silver Bullet* empfohlen hatte.

### Einordnung

Diese Rückschau ist ein Vorbild an intellektueller Ehrlichkeit, wie sie McConnell als Eigenschaft guter Entwickler beschreibt. Und sie zeigt, dass die Entwicklung, die die übrigen Bücher der Reihe beschreiben, inkrementelle Entwicklung, Information Hiding, autonome Teams, schon 1995 von einem der erfahrensten Projektleiter seiner Zeit als richtig erkannt wurde.

## Was nach 50 Jahren noch gilt

Das Buch erschien 1975. Eine Bilanz der wichtigsten Thesen aus heutiger Sicht:

| These | Heute | Begründung |
|---|---|---|
| Programmsystemprodukt kostet ein Vielfaches eines Programms | **gilt** | Tests, Dokumentation, Integration, Betrieb kosten weiterhin mehr als das erste Programm, siehe Release It! und Accelerate |
| Menschen und Monate sind nicht austauschbar | **gilt** | Kommunikationsaufwand und Einarbeitung sind unverändert; McConnell und Team Topologies bauen darauf auf |
| Brooks' Gesetz | **gilt mit Einschränkung** | spät im Projekt meist richtig; frühe, gut eingearbeitete Verstärkung kann helfen, wie Brooks selbst einräumt |
| Zeitplanregel: wenig Programmieren, viel Planen und Testen | **verändert** | mit inkrementeller Entwicklung und Automatisierung verschwimmen die Phasen; der Gedanke, dass Programmieren nur ein Teil ist, bleibt |
| Chirurgenteam | **überholt** | Rollen durch Werkzeuge ersetzt; die Idee kleiner Teams mit klarer Verantwortung lebt weiter |
| Konzeptionelle Integrität | **gilt** | Ubiquitous Language, Konsistenz, Plattformdesign |
| Architekt getrennt von Implementierern | **umstritten** | agile Teams verbinden Entwurf und Umsetzung; große Organisationen haben weiter Architekturrollen |
| Zweitsystemeffekt | **gilt** | Neuschreibprojekte, Überdesign, Speculative Generality |
| Kommunikation als Kern der Organisation | **gilt** | Conways Gesetz, Team Topologies, Accelerate |
| Datenstrukturen sind das Wesen des Programmierens | **gilt** | datenorientierte Programmierung, Records, Kleppmann |
| Plane, eines wegzuwerfen | **von Brooks selbst zurückgenommen** | inkrementelle Entwicklung statt Wegwerfprototyp |
| Fehlerbehebungen erzeugen neue Fehler | **gilt, aber gemildert** | automatisierte Regressionstests verringern das Risiko deutlich |
| Ein Jahr Verspätung entsteht Tag für Tag | **gilt** | scharfe Meilensteine sind heute kurze Iterationen mit lauffähigen Ergebnissen |
| No Silver Bullet | **gilt bisher** | keine Technik hat eine Verbesserung um eine Größenordnung gebracht; ob KI-gestützte Entwicklung das ändert, ist offen |
| Kaufen statt bauen | **gilt stärker denn je** | Open Source, Cloud-Dienste, SaaS |
| Software wachsen lassen | **gilt** | agile Entwicklung, Continuous Delivery, Walking Skeleton |

### Das Muster

Was sich als falsch oder überholt erwiesen hat, betrifft fast immer **Technik und Methoden der damaligen Zeit**: Lochkarten, Wasserfall, Chirurgenteam, Speicherbudgets. Was gilt, betrifft **Menschen, Kommunikation und Komplexität**. Das ist vielleicht die wichtigste Lehre des Buchs, und sie bestätigt Brooks' eigene Unterscheidung von zufälligen und wesentlichen Schwierigkeiten: Die zufälligen haben sich in 50 Jahren stark verändert, die wesentlichen kaum.

## Kritik und Einordnung

Das Buch wird oft zitiert und selten gelesen. Wer es liest, findet einen erstaunlich gut geschriebenen, nachdenklichen und selbstkritischen Text, aber auch viel Zeitkolorit.

### Stärken

- **Zeitlose Kernaussagen:** Brooks' Gesetz, konzeptionelle Integrität, Zweitsystemeffekt, wesentliche und zufällige Komplexität sind seit Jahrzehnten Grundbegriffe.
- **Aus Erfahrung, nicht aus Theorie:** Brooks schreibt über ein Projekt, das er selbst geleitet hat, mit seinen eigenen Fehlern.
- **Stil:** kurze Essays, anschauliche Bilder aus Geschichte, Bibel, Biologie und Architektur, angenehm zu lesen.
- **Ehrlichkeit:** Die Rückschau von 1995 korrigiert offen eigene Irrtümer, ein Vorbild, das in dieser Gattung selten ist.
- **Menschen im Mittelpunkt:** Lange vor der agilen Bewegung beschreibt Brooks Kommunikation, Organisation und Schätzung als die eigentlichen Probleme.

### Kritikpunkte

**1. Zeitkolorit.** Lochkarten, Speicherbudgets, Mikrofilm, Sekretärinnen im Chirurgenteam. Viele Passagen wirken heute historisch und müssen übertragen werden.

**2. Großprojekt-Perspektive.** Die Erfahrungen stammen aus einem Projekt mit Tausenden Beteiligten bei einem Großkonzern. Für kleine Teams, Startups oder Open-Source-Projekte gelten manche Ratschläge nur eingeschränkt.

**3. Wasserfall-Annahmen.** Viele Essays setzen eine Abfolge von Spezifikation, Implementierung und Test voraus. Brooks selbst hat das 1995 korrigiert, aber die Originalkapitel sind unverändert.

**4. Hierarchisches Organisationsbild.** Aristokratie im Design, Chirurg mit Gefolge: Das passt schlecht zu selbstorganisierten Teams. Brooks' späte Bemerkung über die Kraft, Macht abzugeben, deutet die Gegenbewegung an.

**5. Dünne Datenbasis.** Viele Zahlen, etwa zur Zeitplanregel oder zu Produktivitätsunterschieden, beruhen auf wenigen Projekten und Studien der 1960er. Bossavits Kritik an Branchenmythen trifft auch hier einige oft zitierte Zahlen.

**6. Geschlechterbild.** Die Sprache des Originals ist durchgehend männlich, was heute auffällt. Der Titel selbst, „Mann-Monat“, ist daraus entstanden; heute spricht man von Personenmonaten.

### Gesamturteil

The Mythical Man-Month ist weniger ein Handbuch als ein Grundlagentext. Man liest es nicht, um konkrete Techniken zu lernen, sondern um zu verstehen, warum die Probleme der Softwareentwicklung so hartnäckig sind. Gerade weil so viel Technik veraltet ist, wird sichtbar, was nicht veraltet: Komplexität, Kommunikation und die menschliche Neigung zum Optimismus.

## Bezüge zur Reihe

Brooks ist der Urahn fast aller Bücher dieser Reihe. Viele ihrer Kernideen stehen bei ihm schon, oft in einer Form, die die späteren Autoren ausdrücklich aufgreifen.

| Idee bei Brooks | Aufgegriffen von |
|---|---|
| Wesentliche gegen zufällige Komplexität | McConnell (Designkapitel), Ousterhout (ganzes Buch), Kleppmann (Einfachheit) |
| Konzeptionelle Integrität | Evans: Ubiquitous Language, einheitliches Modell im Bounded Context; Ousterhout: Konsistenz |
| Information Hiding (von Parnas, 1995 anerkannt) | Ousterhout, Bloch Item 15, GoF |
| Kommunikation als Engpass, n(n−1)/2 | McConnell: Projektgröße; Accelerate: lose Kopplung; Team Topologies |
| Zweitsystemeffekt | Fowler: Speculative Generality; Thomas und Hunt; Patternitis |
| Datenstrukturen als Wesen des Programmierens | Kleppmann, Evans, Weidig, datenorientierte Programmierung |
| Software wachsen lassen | Beck, GOOS (Walking Skeleton), Accelerate (Continuous Delivery) |
| Scharfe Meilensteine, Verspätung Tag für Tag | agile Iterationen; Thomas und Hunt: nicht schneller als die Scheinwerfer |
| Ehrliche Statusberichte | Accelerate: Westrum-Kultur |
| Kaufen statt bauen | Evans: Generic Subdomains |
| Große Designer | McConnell: Charakter; Thomas und Hunt: Wissensportfolio |
| No Silver Bullet | DORA 2025: KI als Verstärker, nicht als Lösung |

## Diskussionsfragen

1. **Brooks' Gesetz:** Hast du erlebt, dass zusätzliche Leute ein verspätetes Projekt noch weiter verzögert haben? Oder das Gegenteil?
2. **Konzeptionelle Integrität:** Wer sorgt in euren Systemen für ein einheitliches Konzept, wenn es keinen Chefarchitekten gibt?
3. **Zweitsystemeffekt:** Kennst du Neuschreibprojekte, die an überzogenen Ambitionen gescheitert sind?
4. **90 Prozent fertig:** Wie macht ihr Fortschritt messbar, sodass „fast fertig“ nicht monatelang dauert?
5. **Datenstrukturen zuerst:** Teilst du Brooks' Ansicht, dass man ein Programm über seine Datenstrukturen versteht?
6. **No Silver Bullet und KI:** Ist KI-gestützte Programmierung die Silberkugel, oder greift sie, wie Brooks sagen würde, vor allem zufällige Schwierigkeiten an?
7. **Selbstkorrektur:** Welche deiner eigenen Überzeugungen aus früheren Jahren würdest du heute so offen zurücknehmen wie Brooks den Wegwerfprototyp?
8. **Nächstes Buch:** *Team Topologies* würde Brooks' Kommunikationsfrage mit modernen Mitteln beantworten. Passt das als Nächstes?
