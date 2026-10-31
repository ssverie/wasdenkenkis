+++
title = "The Clean Coder – Zusammenfassung und Einordnung"
description = "Robert C. Martin, The Clean Coder: A Code of Conduct for Professional Programmers (2011)"
date = 2026-10-31T11:39:45+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern, Reihe der acht Soft-Skill-Bücher, Teil 8 von 8"
buecher = ["the-clean-coder-2011"]
+++

## Einleitung

Die Reihe begann mit *Clean Code*, Martins Buch über guten Code. *The Clean Coder*, drei Jahre später erschienen, handelt von etwas anderem: vom **Verhalten** eines professionellen Programmierers. Wie man Nein sagt, wie man Zusagen macht und hält, wie man unter Druck arbeitet, schätzt, mit der eigenen Zeit umgeht und lernt.

### Kontext

Robert C. Martin, der Autor von *Clean Code* und *Clean Architecture*, schreibt hier aus der Rückschau auf eine damals schon rund vierzigjährige Laufbahn. Das Buch ist persönlicher als seine technischen Bücher: Viele Kapitel beginnen mit Geschichten eigener Fehler, etwa Termine, die er zugesagt und nicht gehalten hat, oder Fehler, die durch Überheblichkeit entstanden.

### Die Kernthese

Programmierer sollen sich als **Professionelle** verstehen, vergleichbar mit Ärzten, Anwälten oder Ingenieuren. Das bedeutet vor allem: **Verantwortung übernehmen**. Für die Qualität des eigenen Codes, für Zusagen, für die eigene Weiterbildung. Ein Professioneller lässt sich nicht von Druck zu schlechter Arbeit drängen, sagt klar, was geht und was nicht, und steht für das ein, was er abliefert.

### Aufbau

| Kapitel | Thema |
|---|---|
| 1 | Professionalität |
| 2–3 | Nein sagen, Ja sagen |
| 4 | Programmieren |
| 5–8 | Test-Driven Development, Üben, Akzeptanztests, Teststrategien |
| 9 | Zeitmanagement |
| 10 | Schätzen |
| 11 | Druck |
| 12–13 | Zusammenarbeit, Teams und Projekte |
| 14 | Mentoring, Lehre, Handwerk |

Mit rund 200 Seiten ist das Buch kurz und schnell gelesen.

## Professionalität

### Verantwortung übernehmen

Martin beginnt mit einer Geschichte: Er lieferte als junger Entwickler unter Termindruck Code aus, den er nicht ausreichend getestet hatte, und verursachte damit einen Schaden beim Kunden. Seine Lehre: **Ein Professioneller übernimmt Verantwortung für die Folgen seiner Arbeit**, und zwar bevor etwas passiert, nicht erst danach.

### Zuerst keinen Schaden anrichten

In Anlehnung an den ärztlichen Grundsatz formuliert Martin zwei Pflichten:

| Pflicht | Bedeutung |
|---|---|
| **Keinen Schaden an der Funktion** | Code soll funktionieren. Martin fordert, dass die Qualitätssicherung **nichts finden** soll; jeder Fehler, den Testende finden, ist ein Versagen des Entwicklers. Der Weg dorthin: Code, den man ausliefert, selbst gründlich testen, idealerweise automatisiert. |
| **Keinen Schaden an der Struktur** | Code soll änderbar bleiben. Wer unter Druck die Struktur verschlechtert, schadet allen künftigen Änderungen. Die Pfadfinderregel aus *Clean Code* gilt: den Code etwas sauberer hinterlassen, als man ihn vorgefunden hat. |

### Arbeitsethik

Ein vielzitierter und umstrittener Abschnitt: Martin schreibt, die eigene **Karriere sei die eigene Verantwortung**, nicht die des Arbeitgebers. Er schlägt vor, neben den vereinbarten Arbeitsstunden zusätzlich Zeit in die eigene Weiterbildung zu investieren, und nennt dafür eine Größenordnung von rund zwanzig Stunden pro Woche: Lesen, Üben, Lernen neuer Sprachen. Diese Zahl ist vielfach kritisiert worden; darauf geht der Kritikabschnitt ein.

### Was ein Professioneller wissen sollte

Martin nennt Grundlagen, die jeder kennen sollte: Entwurfsmuster, Entwurfsprinzipien wie SOLID, Methoden wie Scrum und XP, Disziplinen wie TDD, Refactoring und Continuous Integration, Artefakte wie UML-Diagramme und Zustandsautomaten. Dazu:

- **Kontinuierlich lernen.**
- **Üben,** wie Musiker üben, nicht nur arbeiten.
- **Zusammenarbeiten** und **Mentoring** geben.
- **Die Fachdomäne kennen,** für die man Software schreibt.
- **Sich mit dem Arbeitgeber und Kunden identifizieren,** also deren Ziele verstehen.
- **Demut:** Auch Profis machen Fehler; man sollte über sich selbst lachen können.

### Einordnung

Die Forderung, dass die Qualitätssicherung nichts finden soll, ist eine Zuspitzung dessen, was Humble und Farley mit „Qualität einbauen“ und Accelerate mit Tests in der Verantwortung der Entwickler beschreiben. Die Verantwortung für die eigene Laufbahn findet sich bei Thomas und Hunt als Wissensportfolio wieder, mit deutlich moderateren Zeitvorstellungen.

## Nein sagen

### Gegensätzliche Rollen

Martin beschreibt Gespräche zwischen Entwicklern und Managern als Verhandlungen zwischen **gegensätzlichen Rollen**: Der Manager will einen Termin, der Entwickler weiß, was realistisch ist. Beide haben legitime Interessen. Das beste Ergebnis entsteht, wenn beide ihre Position klar vertreten und dann gemeinsam eine Lösung suchen. Wer aus Harmoniebedürfnis Ja sagt, obwohl er weiß, dass es nicht geht, verhindert das.

### „Ich versuche es“

Ein besonders bekannter Gedanke: **„Ich versuche es“ ist eine versteckte Zusage.** Wer sagt, er versuche es, lässt den anderen glauben, es sei machbar. Aber was heißt versuchen? Hat man bisher nicht alles gegeben? Gibt es einen neuen Plan? Wenn nicht, ist „ich versuche es“ nur ein höfliches Ja zu etwas Unmöglichem. Martin rät, stattdessen klar zu sagen, was geht und was nicht.

### Der Preis des Ja

Martin erzählt die Geschichte eines Projekts, in dem das Team allen Forderungen zustimmte, Überstunden machte, Qualität opferte und am Ende ein schlechtes Produkt verspätet lieferte. Sein Fazit: Ein Nein zur richtigen Zeit hätte allen mehr geholfen als viele Ja-Worte.

## Ja sagen

Wenn man zusagt, dann richtig. Martin beschreibt die **Sprache der Verpflichtung** in drei Teilen:

1. **Sagen,** dass man es tun wird.
2. **Meinen,** also wirklich vorhaben.
3. **Tun.**

### Erkennen, wann keine Verpflichtung vorliegt

| Formulierung | Bedeutung |
|---|---|
| „Wir **müssten** mal …“, „Man **sollte** …“ | Wunsch ohne Verantwortliche |
| „Ich **hoffe**, dass …“, „Es wäre schön, wenn …“ | keine Zusage |
| „**Lass uns** …“ | niemand ist verantwortlich |

Eine echte Zusage klingt so: **„Ich werde X bis Y erledigen.“** Mit Person, Handlung und Zeitpunkt.

### Zusagen, die von anderen abhängen

Wenn das Ergebnis von anderen abhängt, kann man es nicht zusagen. Man kann aber zusagen, was man selbst tun wird: „Ich kann nicht zusagen, dass der Fehler bis Freitag behoben ist, weil ich auf das Datenbankteam angewiesen bin. Ich sage zu, dass ich bis heute Abend die Ursache eingrenze und das Datenbankteam bis morgen früh informiere.“

### Wenn eine Zusage nicht zu halten ist

Dann muss man es **sofort** sagen, nicht am Fälligkeitstag. Ein früher Hinweis lässt den anderen umplanen; ein später ist ein Bruch des Vertrauens.

### Einordnung

Das ist das „Wer macht was bis wann“ aus *Crucial Conversations* aus Sicht dessen, der zusagt. Die Warnung vor „ich versuche es“ passt zu Scotts ruinöser Empathie: Man will den anderen nicht enttäuschen und enttäuscht ihn dadurch später umso mehr.

## Programmieren

### Vorbereitet sein

Programmieren verlangt volle Aufmerksamkeit. Martin rät, **nicht zu programmieren, wenn man müde oder abgelenkt ist**. Er erzählt von Code, den er nachts um drei geschrieben hat und den er danach wochenlang reparieren musste, und von Code, den er schrieb, während ihn private Sorgen beschäftigten. Sein Rat: Erst die Sorgen klären oder zumindest eine Stunde lang ordnen, dann programmieren.

### Die Zone meiden

Hier widerspricht Martin bewusst einer verbreiteten Vorstellung, und auch DeMarco, Lister und Newport: Er rät, die **Zone**, also den Zustand höchster Konzentration, in dem man alles um sich vergisst, **zu meiden**. Seine Begründung: In der Zone fühlt man sich produktiv, verliert aber den Überblick. Man schreibt schnell viel Code, ohne auf Struktur, Tests oder das größere Bild zu achten, und produziert so Code, den man später überarbeiten muss.

Stattdessen empfiehlt er **Pair Programming** und **TDD**: Beides hält einen in einem konzentrierten, aber nicht weltvergessenen Zustand. Eine Ausnahme macht er für das Üben, etwa Katas, bei denen die Zone gerade erwünscht ist.

Dieser Widerspruch ist interessant, weil er zeigt, dass Konzentration und Zone nicht dasselbe sind: Newport fordert ungestörte, tiefe Arbeit; Martin warnt vor einer bestimmten Art von Selbstvergessenheit darin. Beide wollen dasselbe Ergebnis: durchdachten Code statt schneller Masse.

### Unterbrechungen und Blockaden

- **Unterbrechungen** gehören zur Teamarbeit. Martin rät, freundlich zu reagieren; mit Pairing und TDD findet man nach der Unterbrechung schneller zurück, weil der Partner oder der nächste Test den Faden hält.
- Bei einer **Schreibblockade** hilft fast immer, mit jemandem zusammen zu programmieren.
- **Kreative Anregung** von außen, Lesen, Vorträge, andere Gebiete, verhindert, dass man einrostet.

### Zu spät sein

Martin beschreibt, wie Projekte in Verzug geraten und was man dagegen tut:

| Falle | Rat |
|---|---|
| **Hoffnung** | Hoffnung ist der Projektkiller. Schätzungen regelmäßig ehrlich prüfen und Verzug sofort melden. |
| **Hetzen** | Unter Druck schneller tippen hilft nicht; man macht mehr Fehler. Disziplinen beibehalten. |
| **Überstunden** | nur kurz, mit klarem Ende und einem Plan B, falls sie nicht reichen |
| **Falsche Fertigmeldung** | nie „fertig“ melden, wenn es nicht fertig ist |
| **Unklares „fertig“** | vorab eine klare Definition vereinbaren, idealerweise als automatisierte Akzeptanztests |

### Hilfe geben und annehmen

Ein Professioneller hilft anderen, wenn sie feststecken, und nimmt selbst Hilfe an. Wer sich weigert, um Hilfe zu bitten, verschwendet Zeit, aus Stolz. Das ist der Genie-Mythos aus *Debugging Teams*.

## TDD, Üben und Tests

Die Kapitel 5 bis 8 behandeln Disziplinen, die Martin für Professionalität unverzichtbar hält. Sie überschneiden sich stark mit den technischen Büchern der Reihe und werden hier nur knapp zusammengefasst.

### Test-Driven Development

Martin wiederholt seine **drei Gesetze** von TDD: keinen Produktionscode ohne fehlschlagenden Test; nicht mehr Test, als zum Fehlschlagen nötig; nicht mehr Code, als zum Bestehen nötig. Er bezeichnet TDD als eine **Disziplin**, die ein Professioneller beherrschen sollte, und vergleicht sie mit der doppelten Buchführung bei Buchhaltern. Wie in der Zusammenfassung zu Becks *TDD by Example* besprochen, ist das eine strengere Fassung, als Beck selbst sie vertritt.

### Üben

Martin überträgt den Gedanken des **Übens** aus Musik und Kampfsport auf das Programmieren:

| Form | Inhalt |
|---|---|
| **Kata** | eine kleine Programmieraufgabe immer wieder lösen, bis die Bewegungen sitzen; etwa das Bowling-Spiel oder Primfaktoren |
| **Wasa** | eine Kata zu zweit, bei der einer Tests schreibt und der andere implementiert |
| **Randori** | eine Gruppe übt gemeinsam, abwechselnd an einer Tastatur |

Dazu: an Open-Source-Projekten mitarbeiten, um andere Stile und Werkzeuge kennenzulernen.

### Akzeptanztests

Viele Konflikte entstehen, weil Anforderungen unklar sind. Martin beschreibt typische Probleme: **verfrühte Genauigkeit**, also Details festlegen, bevor man genug weiß; **Schätzangst**; und **späte Mehrdeutigkeit**, wenn erst kurz vor der Auslieferung klar wird, dass beide Seiten etwas anderes gemeint haben. Seine Lösung: **automatisierte Akzeptanztests**, gemeinsam mit den Fachleuten geschrieben, als Definition von „fertig“. Das ist die äußere Schleife aus GOOS und die Akzeptanztest-Stufe aus Continuous Delivery.

### Teststrategie

Martin fordert, dass die Qualitätssicherung **nichts finden** soll, und beschreibt eine Testpyramide: viele Unit-Tests, weniger Komponenten- und Integrationstests, wenige Systemtests und noch weniger manuelle explorative Tests. Die Qualitätssicherung soll nicht Fehler finden, sondern spezifizieren, was getestet wird, und erkunden, was niemand vorhergesehen hat, wie die Testquadranten aus Continuous Delivery beschreiben.

## Zeitmanagement

### Besprechungen

Martin ist streng mit Besprechungen, die er als größte Zeitfresser sieht:

- **Absagen erlaubt:** Man muss nicht zu jeder Besprechung gehen, zu der man eingeladen wird. Ein Professioneller prüft, ob seine Anwesenheit nötig ist, und sagt sonst höflich ab.
- **Gehen erlaubt:** Wenn eine Besprechung abschweift und man nichts mehr beitragen kann, darf man sie verlassen, mit kurzer Erklärung.
- **Tagesordnung und Ziel:** Jede Besprechung braucht beides; ohne sie sollte man nicht teilnehmen.
- **Stand-ups kurz:** drei Fragen, wenige Minuten.
- **Planungsbesprechungen fokussiert:** gut vorbereitet, mit klaren Ergebnissen.

### Meinungsverschiedenheiten

Martin zitiert Kent Beck, sinngemäß: **Eine Meinungsverschiedenheit, die sich in wenigen Minuten nicht durch Argumente lösen lässt, wird sich auch nicht durch weitere Argumente lösen lassen.** Dann braucht es Daten: ein Experiment, einen Prototyp, eine Messung. Wer stundenlang diskutiert, verschwendet Zeit; wer Daten sammelt, entscheidet besser. Das passt zu Harmel-Laws Spikes und zu Richards' und Fords Rat, Vorführung schlage Diskussion.

### Konzentration als knappe Ressource

Martin nennt Konzentration **Fokus-Manna**: eine begrenzte Menge, die sich verbraucht und wieder auffüllt. Sie wird durch Schlaf, Bewegung und Pausen erneuert und durch Besprechungen, Sorgen und Ablenkung verbraucht. Koffein hilft kurzfristig, aber nur begrenzt. Das ist Newports Gedanke, ohne Newports Begriff.

### Zeitboxen

Martin empfiehlt die **Pomodoro-Technik**: in Blöcken von fünfundzwanzig Minuten arbeiten, in denen man Unterbrechungen nicht annimmt, sondern notiert und später bearbeitet. Danach eine kurze Pause. Die Anzahl der Blöcke pro Tag wird zum Maß für konzentrierte Zeit.

### Vermeidung, Sackgassen und Sümpfe

- **Vermeidung:** Man schiebt eine unangenehme Aufgabe vor sich her und erledigt stattdessen Angenehmes. Martin rät, das zu erkennen und die unangenehme Aufgabe zuerst zu tun.
- **Sackgassen:** Ein gewählter Weg führt nicht weiter. Ein Professioneller erkennt das früh und kehrt um, statt sich festzubeißen.
- **Sümpfe:** Unordentlicher Code bremst jede weitere Arbeit, wie ein Sumpf, in dem man immer tiefer einsinkt. Der Ausweg ist nicht, schneller zu laufen, sondern aufzuräumen. Das ist Becks *Tidy First?* und Fowlers *Refactoring* in einem Bild.

## Schätzen

### Zusage und Schätzung

Martins wichtigste Unterscheidung: Eine **Zusage** ist ein Versprechen, das man hält. Eine **Schätzung** ist eine Vermutung über eine Wahrscheinlichkeitsverteilung. Geschäftsleute hören Schätzungen oft als Zusagen, und Entwickler lassen das zu. Ein Professioneller macht den Unterschied klar: „Meine Schätzung ist fünf Tage, mit einer Spanne von drei bis acht. Zusagen kann ich fünf Tage nicht.“

### Dreipunktschätzung

Statt einer Zahl empfiehlt Martin die **Dreipunktschätzung** aus der Projektplanungsmethode PERT:

| Wert | Bedeutung |
|---|---|
| **O**, optimistisch | wenn alles glatt läuft; seltener als einmal in zehn Fällen |
| **N**, normal | die wahrscheinlichste Dauer |
| **P**, pessimistisch | wenn vieles schiefgeht, aber ohne Katastrophen |

Daraus ergeben sich ein Erwartungswert und eine Streuung:

**μ = (O + 4N + P) / 6** · **σ = (P − O) / 6**

{{< bild src="bild-1.png" alt="Dreipunktschätzung nach PERT für ein Beispiel mit 2, 4 und 12 Tagen" >}}

Dreipunktschätzung nach PERT für ein Beispiel mit 2, 4 und 12 Tagen

Im Beispiel liegt der Erwartungswert mit fünf Tagen deutlich über der normalen Schätzung von vier, weil der pessimistische Fall weit entfernt ist. Wer nur „vier Tage“ sagt, gibt eine Zahl, die eher zu knapp ist. Für mehrere Aufgaben addiert man die Erwartungswerte; die Streuungen addiert man als Quadrate und zieht dann die Wurzel.

### Gemeinsam schätzen

Martin beschreibt Verfahren, mit denen Teams gemeinsam schätzen:

| Verfahren | Vorgehen |
|---|---|
| **Wideband Delphi** | mehrere Schätzer schätzen unabhängig, besprechen die Abweichungen und schätzen erneut, bis sich die Werte annähern |
| **Fliegende Finger** | alle zeigen gleichzeitig mit den Fingern eine Zahl, damit niemand beeinflusst wird |
| **Planning Poker** | dasselbe mit Karten |
| **Affinitätsschätzung** | Aufgaben werden schweigend nach relativer Größe an einer Wand sortiert |

### Das Gesetz der großen Zahlen

Große Aufgaben lassen sich schlechter schätzen als kleine. Martin rät, große Aufgaben in **viele kleine** zu zerlegen und diese einzeln zu schätzen: Die Fehler gleichen sich teilweise aus. Er warnt aber, dass man beim Zerlegen leicht Integrationsarbeit vergisst, und dass Schätzungen eher zu optimistisch als zu pessimistisch sind.

### Einordnung

Die Unterscheidung von Zusage und Schätzung ist Brooks' Warnung vor „bei Zeitplänen ist Optimismus die Regel“ in praktischer Form. Die Dreipunktschätzung findet sich auch bei McConnell, der Schätzung ein eigenes Buch gewidmet hat, *Software Estimation*.

## Druck

### Druck vermeiden

Der beste Umgang mit Druck ist, ihn gar nicht erst entstehen zu lassen:

- **Keine Zusagen machen, die man nicht halten kann.** Viel Druck entsteht aus Versprechen, die andere gemacht haben, oder die man selbst leichtfertig gemacht hat.
- **Sauber bleiben.** Unordentlicher Code erzeugt Druck, weil jede Änderung länger dauert und mehr Fehler bringt.
- **Disziplinen in der Krise beibehalten.** Martins Prüfstein: Woran man in der Krise festhält, daran glaubt man wirklich. Wer TDD unter Druck aufgibt, glaubt nicht wirklich an TDD.

### Mit Druck umgehen

- **Nicht in Panik geraten.** Panik führt zu hastigen Entscheidungen.
- **Kommunizieren.** Vorgesetzte und Team früh informieren, was los ist.
- **Sich auf die Disziplinen verlassen.** Gerade unter Druck sind Tests, kleine Schritte und Pairing am wertvollsten.
- **Hilfe holen.** Mit jemandem zusammen arbeiten; ein zweiter Kopf beruhigt und findet Fehler.

## Zusammenarbeit

Viele Programmierer arbeiten lieber mit Maschinen als mit Menschen. Martin hält das für einen Fehler: **Softwareentwicklung ist Zusammenarbeit**, mit Kollegen, Vorgesetzten und Kunden. Er warnt besonders vor **Code-Besitz**: Wer Teile des Codes für sich beansprucht und andere nicht heranlässt, schafft Wissensinseln. Gemeinsamer Besitz und Pairing sind besser.

## Teams und Projekte

Martin übernimmt den Begriff des **eingeschworenen Teams** von DeMarco und Lister. Ein solches Team braucht Zeit zum Zusammenwachsen, etwa sechs Monate bis ein Jahr. Daraus folgt sein Rat: **Teams nicht nach Projektende auflösen**, sondern Projekte an bestehende Teams geben. Ein Team kann mehrere Projekte gleichzeitig bearbeiten; ein Projekt sollte nicht aus Menschen bestehen, die für wenige Wochen zusammengewürfelt werden. Das ist genau Team Topologies' Grundsatz langlebiger Teams.

## Lehre und Handwerk

Das letzte Kapitel beschreibt, wie Programmierer ausgebildet werden sollten. Martin kritisiert, dass Hochschulabsolventen ohne praktische Anleitung in Projekte geworfen werden. Er schlägt ein Modell nach dem Vorbild der Handwerkslehre vor:

| Stufe | Rolle |
|---|---|
| **Meister** | erfahrene Programmierer, die Projekte führen und andere ausbilden |
| **Geselle** | erfahrene Programmierer, die selbstständig arbeiten und Lehrlinge anleiten |
| **Lehrling** | Neueinsteiger, die unter Anleitung lernen, mit wachsender Verantwortung |

Die Idee des **Software Craftsmanship** als Haltung, nicht als Zertifikat, schließt das Buch ab: Handwerkliches Können wird von Mensch zu Mensch weitergegeben, durch Vorbild, Anleitung und gemeinsame Arbeit.

## Formulierungen und Übungen

Die folgenden Beispiele stammen nicht aus dem Buch, sondern setzen Martins Grundsätze in konkrete Sätze um.

### Formulierungen

| Situation | Statt | Besser |
|---|---|---|
| **Unrealistischer Termin** | „Ich versuche es.“ | „Das schaffen wir bis Freitag nicht. Bis Freitag schaffen wir A und B; C braucht eine weitere Woche. Was ist dir am wichtigsten?“ |
| **Zusage** | „Sollte bis Mittwoch gehen.“ | „Ich liefere die Schnittstelle bis Mittwoch, 12 Uhr.“ |
| **Abhängige Zusage** | „Hängt vom Datenbankteam ab.“ | „Ich sage zu, dass ich heute die Ursache eingrenze und das Datenbankteam bis morgen früh informiere. Die Behebung hängt von ihnen ab.“ |
| **Verzug melden** | am Fälligkeitstag: „Wird nichts.“ | drei Tage vorher: „Ich sehe, dass ich Mittwoch nicht halte. Neue Schätzung: Freitag. Alternativ liefere ich Mittwoch ohne die Exportfunktion.“ |
| **Schätzung statt Zusage** | „Fünf Tage.“ | „Ich schätze fünf Tage, mit einer Spanne von drei bis acht. Für eine Zusage brauche ich zwei Tage Analyse.“ |
| **Besprechung absagen** | stillschweigend nicht kommen | „Ich sehe nicht, was ich beitragen kann. Wenn eine Frage zur Persistenz aufkommt, schreibt mir gern, ich antworte noch heute.“ |
| **Streit beenden** | weiter argumentieren | „Wir drehen uns seit zwanzig Minuten. Lass uns beide Varianten an einem kleinen Beispiel ausprobieren und morgen entscheiden.“ |

### Übungen

**1. Versteckte Zusagen.** Achte eine Woche lang darauf, wie oft du oder andere „ich versuche es“, „sollte gehen“ oder „lass uns“ sagen. Was wäre die klare Fassung?

**2. Dreipunktschätzung.** Schätze die nächsten drei Aufgaben mit optimistischem, normalem und pessimistischem Wert. Vergleiche hinterher mit der tatsächlichen Dauer.

**3. Eine Kata.** Wähle eine kleine Aufgabe, etwa die Primfaktorzerlegung, und löse sie fünfmal an verschiedenen Tagen mit TDD. Was ändert sich?

**4. Besprechungsinventur.** Gehe deinen Kalender der nächsten Woche durch. Welche Termine haben keine Tagesordnung? Zu welchen würdest du nach Martins Maßstab absagen?

**5. Disziplin unter Druck.** Welche Praxis gibst du als Erstes auf, wenn es eng wird: Tests, Reviews, Refactoring? Was sagt das darüber, woran du wirklich glaubst?

## Kritik und Einordnung

### Stärken

- **Klare Sprache über Zusagen:** Die Unterscheidung von Zusage und Schätzung und die Warnung vor „ich versuche es“ gehören zu den nützlichsten Ratschlägen der ganzen Soft-Skill-Reihe.
- **Ehrliche Geschichten:** Martin erzählt von eigenen Fehlern; das macht die Ratschläge glaubwürdig.
- **Professionalität als Haltung:** Verantwortung für Qualität und Folgen, nicht nur für die Erledigung von Aufgaben.
- **Praktische Werkzeuge:** Dreipunktschätzung, Pomodoro, Katas, Umgang mit Besprechungen.
- **Der Zusammenhang von Technik und Verhalten:** TDD und saubere Struktur werden als Teil professionellen Verhaltens begründet, nicht nur als Technik.

### Kritikpunkte

**1. Die zwanzig Stunden.** Die Forderung, neben der Arbeitszeit noch rund zwanzig Stunden pro Woche in die eigene Weiterbildung zu investieren, ist vielfach kritisiert worden. Sie übersieht Familie, Gesundheit und Erholung und widerspricht DeMarcos und Listers Warnung vor Überstunden sowie Newports Rat zum Feierabend. Der Kern, dass man für die eigene Entwicklung verantwortlich ist, bleibt richtig; das Maß ist für die meisten Menschen unrealistisch und auch nicht nötig.

**2. Die Zone.** Martins Rat, die Zone zu meiden, steht im Widerspruch zu DeMarco, Lister, Newport und der Flow-Forschung. Er beschreibt eine reale Gefahr, Überblick zu verlieren, macht daraus aber eine sehr allgemeine Regel.

**3. Absolute Regeln.** Wie in *Clean Code*: Viele Aussagen sind als unumstößlich formuliert, etwa dass die Qualitätssicherung nichts finden soll oder dass TDD für jeden Professionellen Pflicht sei. Andere Bücher der Reihe, etwa Beck selbst oder Khorikov, sind hier abgewogener.

**4. Individualistische Sicht.** Professionalität wird vor allem als Leistung des Einzelnen beschrieben. Dass viele Probleme strukturell sind, Termine von oben gesetzt, Teams falsch geschnitten, Anreize falsch gesetzt, kommt weniger vor als bei Hohpe, Harmel-Law oder Accelerate.

**5. Autor.** Martins öffentliche Äußerungen zu Themen außerhalb der Softwareentwicklung haben in den letzten Jahren zu Kontroversen geführt. Das betrifft nicht den Inhalt des Buchs, beeinflusst aber, wie es in manchen Teams aufgenommen wird.

### Gesamturteil

Trotz der Übertreibungen enthält das Buch einige der praktischsten Ratschläge zu professionellem Verhalten, besonders zu Zusagen, Schätzungen und dem Umgang mit Druck. Man liest es am besten mit den anderen Soft-Skill-Büchern im Rücken: Sie korrigieren seine Einseitigkeiten und machen deutlich, wo Martins Strenge hilft und wo sie überzieht.

## Bezüge zur Reihe

### Martin zweimal

|  | *Clean Code* (2008) | *The Clean Coder* (2011) |
|---|---|---|
| Gegenstand | der Code | der Mensch, der ihn schreibt |
| Kernidee | lesbare, kleine, saubere Einheiten | Verantwortung, klare Zusagen, Disziplin |
| Stärke | Bewusstsein für Codequalität | Bewusstsein für professionelles Verhalten |
| Schwäche | absolute Regeln, umstrittene Beispiele | absolute Regeln, überzogene Erwartungen |

### Weitere Bezüge

| Thema bei Martin | Bezug in der Reihe |
|---|---|
| Nein sagen, „ich versuche es“ | Scott: ruinöse Empathie; Patterson u.a.: falsche Wahl |
| Sprache der Verpflichtung | Patterson u.a.: wer macht was bis wann; Reilly: Rollen klären |
| Zusage und Schätzung | Brooks: Optimismus bei Zeitplänen; McConnell |
| Die Zone meiden | Gegenposition zu DeMarco und Lister sowie Newport |
| Pomodoro, Fokus-Manna | Newport: Zeitblöcke, Aufmerksamkeitsrückstand |
| Meinungsverschiedenheit durch Daten lösen | Harmel-Law: Spikes; Richards und Ford: Vorführung statt Diskussion |
| Sümpfe, Code sauber halten | Beck: *Tidy First?*; Fowler: *Refactoring* |
| Teams nicht auflösen | DeMarco und Lister: eingeschworene Teams; Team Topologies |
| Code-Besitz vermeiden | Fitzpatrick und Collins-Sussman: Busfaktor, Revierdenken |
| Akzeptanztests als Definition von fertig | Freeman und Pryce: äußere Schleife; Humble und Farley |
| Lehre und Handwerk | Reilly: Andere stärken; Scott: Rockstars als Lehrer |

## Rückblick auf die acht Soft-Skill-Bücher

| # | Buch | Kernfrage | Wichtigstes Werkzeug |
|---|---|---|---|
| 1 | Hohpe, *The Software Architect Elevator* | Wie verbindet ein Architekt Geschäftsleitung und Technik? | der Aufzug; Technik als Optionen erklären |
| 2 | Reilly, *The Staff Engineer's Path* | Wie führt man technisch ohne Personalverantwortung? | drei Säulen, drei Karten |
| 3 | Harmel-Law, *Facilitating Software Architecture* | Wer trifft Architekturentscheidungen? | Advice Process, ADRs mit eingeholtem Rat |
| 4 | Patterson u.a., *Crucial Conversations* | Wie führt man Gespräche, in denen viel auf dem Spiel steht? | Sicherheit, Weg zum Handeln, STATE |
| 5 | Scott, *Radical Candor* | Wie gibt man ehrlich und menschlich Feedback? | vier Quadranten |
| 6 | Fitzpatrick und Collins-Sussman, *Debugging Teams* | Wie arbeitet man gut im Team? | Demut, Respekt, Vertrauen |
| 7 | Newport, *Deep Work* | Wie schützt man seine Konzentration? | Rituale, Zeitblöcke, Budget für seichte Arbeit |
| 8 | Martin, *The Clean Coder* | Was heißt professionelles Verhalten? | klare Zusagen, Dreipunktschätzung |

Der gemeinsame Nenner: Wirkung entsteht durch **klare, ehrliche und respektvolle Kommunikation**, durch **geschützte Zeit für das Wesentliche** und durch **Verantwortung**, die man übernimmt, statt sie anderen zuzuschieben.

## Diskussionsfragen

1. **Nein sagen:** Wann hast du zuletzt „ich versuche es“ gesagt, obwohl du wusstest, dass es nicht geht?
2. **Zusagen:** Unterscheidest du in Gesprächen mit Vorgesetzten zwischen Schätzung und Zusage?
3. **Die Zone:** Hat Martin recht, dass die Zone gefährlich ist, oder Newport, dass tiefe Konzentration das Wertvollste ist?
4. **Disziplin unter Druck:** Was gibt dein Team auf, wenn es eng wird?
5. **Zwanzig Stunden:** Wie viel Zeit investierst du außerhalb der Arbeit in deine Entwicklung? Wie viel hältst du für angemessen?
6. **Lehre:** Gibt es bei euch ein Modell, in dem Erfahrene Neueinsteiger systematisch anleiten?
7. **Rückblick:** Welches der acht Soft-Skill-Bücher hat dir am meisten gegeben? Welches würdest du weiterempfehlen?
8. **Weiter:** Damit sind 39 Bücher besprochen. Als Nächstes die KI-Reihe mit Chip Huyens *AI Engineering*?
