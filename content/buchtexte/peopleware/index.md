+++
title = "Peopleware – Zusammenfassung und Einordnung"
description = "Tom DeMarco, Timothy Lister, Peopleware: Productive Projects and Teams (1987, 3. Auflage 2013)"
date = 2026-10-30T18:58:04+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["peopleware-2013"]
+++

## Einleitung

Die Reihe begann mit Code und endet mit Menschen. *Peopleware* ist neben Brooks' *Mythical Man-Month* das älteste Buch der Reihe und vielleicht das, dessen Kernsatz am häufigsten zitiert wird, hier sinngemäß: **Die großen Probleme unserer Arbeit sind weniger technischer als soziologischer Natur.**

### Autoren und Kontext

**Tom DeMarco** und **Timothy Lister** waren Berater bei der Atlantic Systems Guild und hatten in den 1980ern viele Softwareprojekte gesehen, die nicht an Technik scheiterten, sondern an Führung, Arbeitsbedingungen und Teamdynamik. DeMarco war zuvor durch Arbeiten zur strukturierten Analyse bekannt geworden; später schrieb er unter anderem *Slack* über den Wert ungenutzter Kapazität. Die beiden führten auch die **Coding War Games** durch, einen Programmierwettbewerb, dessen Daten eine wichtige Grundlage des Buchs sind.

| Auflage | Jahr | Änderungen |
|---|---|---|
| 1. | 1987 | die Originalausgabe |
| 2. | 1999 | neue Kapitel über Organisationsentwicklung, Wandel und Gemeinschaft |
| 3. | 2013 | Aktualisierungen, etwa zu Bürogestaltung und E-Mail, und weitere neue Kapitel |

### Die Kernthese

Manager behandeln Softwareentwicklung oft wie Produktion: Menschen sind austauschbare Ressourcen, Produktivität entsteht durch Druck, und die Kosten pro Quadratmeter Bürofläche sind ein sinnvolles Sparziel. DeMarco und Lister halten das für grundlegend falsch. Softwareentwicklung ist **Wissensarbeit**: Sie braucht Konzentration, Vertrauen, funktionierende Teams und eine Umgebung, in der Menschen denken können. Die Aufgabe des Managers ist nicht, Menschen anzutreiben, sondern **Hindernisse zu beseitigen**.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Menschen führen | Menschen sind keine Ressourcen; Qualität und Zeitdruck |
| II. Die Arbeitsumgebung | Büros, Lärm, Unterbrechungen, Konzentration |
| III. Die richtigen Leute | Einstellung, Führung, Fluktuation |
| IV. Produktive Teams | eingeschworene Teams und was sie zerstört |
| V. Fruchtbarer Boden | Risiko, Besprechungen, Wandel, lernende Organisationen |
| VI. Arbeit soll Spaß machen | Ordnung und Chaos, Freiräume |

Die Kapitel sind kurz, oft nur wenige Seiten, und meist mit einer Anekdote oder einem pointierten Argument. Das Buch liest sich schnell.

## Menschen führen

### Projekte scheitern an Menschen

Die Autoren berichten von Hunderten untersuchter Projekte: Nur ein kleiner Teil scheiterte an technischen Problemen. Die meisten scheiterten an Politik, Kommunikation, Personal, Motivation oder fehlender Klarheit über Ziele. Trotzdem konzentrieren sich Manager auf Technik, weil sie sich damit sicherer fühlen.

### Keine Burger-Produktion

Unter dem Titel *Make a Cheeseburger, Sell a Cheeseburger* beschreiben sie das Produktionsdenken, das in der Softwareentwicklung schadet:

| Produktionsdenken | Wissensarbeit |
|---|---|
| Fehler vermeiden, Abweichungen bestrafen | Fehler gehören zum Lernen und zur Innovation |
| Menschen sind austauschbar | jeder Mensch ist einzigartig; Austausch kostet Einarbeitung und Teamgefüge |
| Gleichmäßiger Arbeitsfluss | Denken lässt sich nicht im Takt erzwingen |
| Arbeit nach Plan, Prozess vor Mensch | Menschen gestalten den Prozess |

### Überstunden lohnen sich nicht

Das Kapitel *Vienna Waits for You*, benannt nach einem Lied von Billy Joel, wendet sich gegen Überstunden als Mittel der Produktivität. Wer dauerhaft länger arbeitet, gleicht es durch langsamere Arbeit, mehr Fehler und Ausgleichszeit wieder aus. Ein Projekt, das nur mit ständigen Überstunden zu schaffen ist, ist falsch geplant. Das ist Becks Prinzip des **nachhaltigen Tempos** aus Extreme Programming und ein Befund, den Accelerate über Burnout bestätigt.

### Qualität, wenn Zeit bleibt

Eine der überraschendsten Thesen: Menschen verbinden ihr Selbstwertgefühl mit der **Qualität** ihrer Arbeit. Wer gezwungen wird, schlechte Arbeit abzuliefern, verliert Motivation. Die Autoren argumentieren, dass Qualität, die über das hinausgeht, was der Kunde verlangt, die **Produktivität erhöht**, weil sie Fehlerkosten senkt und Menschen motiviert. Das ist McConnells Befund, dass Qualität Zeit spart, aus der menschlichen Perspektive.

### Parkinsons Gesetz gilt nicht

Parkinsons Gesetz besagt, dass Arbeit sich so ausdehnt, dass sie die verfügbare Zeit füllt. Manager setzen deshalb enge Fristen. DeMarco und Lister halten dagegen: Für Wissensarbeiter, die ihre Arbeit gern tun, gilt das nicht. Sie berichten von einer australischen Studie, in der Projekte **ohne** vorgegebene Schätzung die höchste Produktivität hatten, höher als Projekte mit Schätzungen durch Entwickler, Manager oder beide. Die Studie ist alt und klein, aber die Richtung ist bemerkenswert.

### Wundermittel

Unter dem Titel *Laetrile*, nach einem angeblichen Krebsheilmittel, warnen sie vor Methoden und Werkzeugen, die große Produktivitätssprünge versprechen. Das ist Brooks' *No Silver Bullet* in der Sprache des Managements.

## Die Arbeitsumgebung

Teil II ist der bekannteste und der am meisten zitierte. Seine These: **Die meisten Büros sind für Wissensarbeit ungeeignet**, und das kostet mehr, als die Einsparung an Fläche bringt.

### Die Coding War Games

Zwischen 1984 und 1986 ließen DeMarco und Lister mehrere Hundert Entwickler aus vielen Unternehmen dieselbe Programmieraufgabe in ihrer gewohnten Umgebung lösen. Die Ergebnisse, hier sinngemäß:

- Die Unterschiede zwischen den Besten und den Schwächsten waren groß, in der Größenordnung von etwa zehn zu eins.
- Programmiersprache, Berufserfahrung jenseits der ersten Monate und Gehalt erklärten wenig davon.
- Wer weniger Fehler machte, war **nicht** langsamer.
- Entwickler aus demselben Unternehmen schnitten ähnlich ab, auch wenn sie nicht zusammenarbeiteten. Das deutet auf die **Umgebung** als wichtigen Faktor.
- Die Besten hatten im Schnitt deutlich mehr Platz, mehr Ruhe, mehr Privatsphäre und konnten Telefon und Störungen abstellen.

Die Autoren räumen ein, dass Korrelation nicht Kausalität ist: Vielleicht ziehen gute Unternehmen gute Leute an und geben ihnen auch gute Büros. Aber die Richtung ist deutlich.

### Flow

Das Kernkonzept ist **Flow**, der Zustand tiefer Konzentration, den der Psychologe Mihály Csíkszentmihályi beschrieben hat. Die Autoren veranschlagen, dass es etwa eine **Viertelstunde** dauert, in diesen Zustand zu kommen, und dass jede Unterbrechung ihn beendet. Ein kurzer Anruf kostet also nicht fünf Minuten, sondern zwanzig.

{{< bild src="bild-1.png" alt="ein angenommener Vormittag, gerechnet mit der Viertelstunde Wiedereinstieg, die DeMarco und Lister veranschlagen" >}}

ein angenommener Vormittag, gerechnet mit der Viertelstunde Wiedereinstieg, die DeMarco und Lister veranschlagen

In diesem angenommenen Beispiel kosten drei Anrufe von zusammen fünfzehn Minuten eine volle Stunde Konzentration. Die Autoren schlagen vor, das als **Umgebungsfaktor** zu messen: ungestörte Stunden geteilt durch anwesende Stunden. Ein niedriger Wert zeigt, dass Menschen zwar da sind, aber nicht zum Denken kommen.

### Die Möbelpolizei und andere Feinde

- **Die Möbelpolizei:** Einrichtungen, die Büros nach Einheitlichkeit und Kosten gestalten, nicht nach den Bedürfnissen der Arbeit.
- **Telefon und Lautsprecherdurchsagen:** Unterbrechungen, die keiner verlangt hat.
- **Großraumbüros:** Lärm und Sichtstörungen machen Flow fast unmöglich.
- **Arbeit zwischen neun und fünf:** In vielen Büros kommen Entwickler erst zum Denken, wenn die anderen gegangen sind.

Ihre Empfehlungen: Ruhe, Rückzugsorte, Türen, die man schließen kann, Fenster, und die Möglichkeit, Störungen selbst zu steuern. Das Kapitel *Bring Back the Door* heißt genau so.

## Die richtigen Leute

### Einstellen

Die Autoren beginnen mit dem **Hornblower-Faktor**, benannt nach dem Romanhelden C. S. Foresters: der Annahme, dass Menschen für eine Rolle geboren sind und Manager vor allem die richtigen finden müssen. Sie halten sie für teilweise richtig: Die wichtigste Entscheidung eines Managers ist, wen er einstellt. Danach gilt: **die richtigen Leute holen und ihnen aus dem Weg gehen.**

Ihre Ratschläge für Einstellungen:

- **Arbeitsproben statt Lebensläufe:** Ein Jongleur wird eingestellt, nachdem man ihn jonglieren gesehen hat, nicht nach seinem Lebenslauf. Entwickler sollen Code zeigen oder eine Aufgabe lösen.
- **Vorstellung vor dem Team:** Kandidaten halten einen kurzen Vortrag vor dem künftigen Team. Das zeigt, wie sie kommunizieren, und gibt dem Team eine Stimme.
- **Vielfalt:** Teams brauchen unterschiedliche Persönlichkeiten und Fähigkeiten, nicht nur Klone der besten Einzelnen. Manche Menschen tragen vor allem dadurch bei, dass sie ein Team zusammenhalten, und tauchen in keiner Produktivitätsmessung auf.

### Führung

Führung ist für DeMarco und Lister **Dienst**, nicht Kontrolle. Gute Führung zeigt sich oft in kleinen Handlungen: jemand übernimmt eine unbeliebte Aufgabe, schützt das Team vor Störungen, fragt nach statt anzuweisen. Führung muss nicht beim formalen Vorgesetzten liegen; in guten Teams wechselt sie je nach Aufgabe.

### Fluktuation

Das Kapitel über Fluktuation gehört zu den wichtigsten des Buchs, weil es Kosten sichtbar macht, die in keiner Bilanz stehen:

- **Neue Mitarbeiter brauchen Monate**, bis sie voll produktiv sind; in dieser Zeit binden sie zusätzlich die Zeit erfahrener Kollegen.
- **Hohe Fluktuation erzeugt eine Kurzzeit-Haltung:** Wer nicht lange bleiben will, investiert nicht in langfristige Qualität, Lernen oder Teamaufbau.
- **Unternehmen, die Fluktuation nicht messen**, unterschätzen sie systematisch.

Was hält Menschen? Die Autoren nennen: das Gefühl, in einem guten Unternehmen zu arbeiten, das in seine Leute investiert; Weiterbildung und Entwicklungsmöglichkeiten; ein Umfeld, in dem man gute Arbeit leisten kann.

### Humankapital

In der dritten Auflage kam ein Kapitel über **Humankapital** hinzu: Wissen und Fähigkeiten der Mitarbeiter sind eine Investition, die in der Buchhaltung nicht erscheint. Wer Weiterbildung streicht, spart kurzfristig und verliert langfristig. Das ist das Argument, das Team Topologies mit der kognitiven Last und Accelerate mit der Lernkultur aufnehmen.

## Produktive Teams wachsen lassen

### Eingeschworene Teams

Das Herz des Buchs ist das Konzept des **eingeschworenen Teams**, englisch *jelled team*: eine Gruppe, die so gut zusammenarbeitet, dass das Ganze mehr ist als die Summe seiner Teile. Man erkennt es an:

- **geringer Fluktuation** während des Projekts
- **starker Identität**, oft mit eigenem Namen, eigenen Ritualen, eigenem Humor
- **Gefühl, etwas Besonderes zu sein**
- **gemeinsamer Verantwortung** für das Ergebnis
- **offensichtlicher Freude** an der Arbeit

Die Autoren erzählen als Beispiel die Geschichte des **Black Team**, einer Testgruppe bei IBM in den 1960ern, die sich als Feinde der Fehler verstand, schwarz kleidete und eine eigene Kultur entwickelte, die die Mitglieder überdauerte.

Eine wichtige Einsicht: **Teams lassen sich nicht bauen**, nur wachsen lassen. Manager können Bedingungen schaffen, unter denen Teams zusammenwachsen, und sie können Teams zerstören. Mehr nicht.

### Teamizid

Das bekannteste Kapitel dieses Teils beschreibt, wie man Teams zerstört, meist ohne es zu wollen:

| Technik | Wirkung |
|---|---|
| **Defensives Management** | der Manager sichert sich ab, kontrolliert alles und vertraut dem Team nicht |
| **Bürokratie** | Papierarbeit, die niemand für sinnvoll hält, signalisiert, dass das eigentliche Ziel unwichtig ist |
| **Räumliche Trennung** | Teammitglieder sitzen verstreut und begegnen sich nicht |
| **Zersplitterung der Zeit** | Menschen arbeiten in mehreren Projekten gleichzeitig und gehören zu keinem Team richtig |
| **Qualität senken** | das Team muss etwas abliefern, auf das es nicht stolz sein kann |
| **Scheinfristen** | Termine, von denen alle wissen, dass sie unrealistisch sind |
| **Cliquenkontrolle** | Manager zerschlagen informelle Gruppen, weil sie sie als Bedrohung sehen |

In späteren Auflagen kamen Motivationsplakate, Überstunden und interne Wettbewerbe hinzu: alles Dinge, die gut gemeint sind und Zusammenhalt untergraben.

### Bedingungen für gute Teams

Am Ende des Teils formulieren die Autoren, was Teams zusammenwachsen lässt:

- einen **Kult der Qualität** pflegen
- viele **befriedigende Abschlüsse** ermöglichen, also kleine, sichtbare Erfolge
- ein **Gefühl der Besonderheit** fördern
- **Vielfalt** zulassen und fördern
- **erfolgreiche Teams zusammenhalten**, statt sie nach Projektende aufzulösen
- **strategische, nicht taktische Führung** geben: Ziele setzen, nicht Wege vorschreiben

In einem kleinen Kapitel beschreiben sie einen Manager, der sein neues Team zuerst zu einem gemeinsamen Spaghetti-Essen einlädt, bei dem alle zusammen kochen. Das Team erlebt seinen ersten gemeinsamen Erfolg, bevor die eigentliche Arbeit beginnt.

### Einordnung

Das ist die menschliche Grundlage von Team Topologies: stabile, langlebige Teams statt Projekte, die Menschen ständig neu zusammenwürfeln. Zersplitterte Zeit ist das, was Team Topologies als zu hohe kognitive Last beschreibt. Und Brooks' Gesetz erklärt, warum man ein eingeschworenes Team nicht einfach vergrößern kann.

## Fruchtbarer Boden

Teil V, in der zweiten Auflage hinzugekommen, weitet den Blick von Teams auf ganze Organisationen.

### Methodik gegen Denken

Die Autoren unterscheiden **methodologies**, Erfahrung und Praktiken, die Menschen beim Denken helfen, von **Methodologies** mit großem M: umfassende, verbindliche Vorgehensmodelle, die das Denken ersetzen sollen. Letztere führen zu Papierflut, Dienst nach Vorschrift und dem Gefühl, nicht verantwortlich zu sein. Ihre Alternative: **Schulung, Werkzeuge und gegenseitige Prüfung** statt verordneter Prozesse.

### Mit Risiken tanzen

Projekte ohne Risiko sind meist nicht lohnend. DeMarco und Lister plädieren dafür, Risiken offen zu benennen und zu steuern, statt sie zu verschweigen. Daraus entstand später ihr eigenes Buch *Waltzing with Bears* über Risikomanagement.

### Besprechungen

Sie unterscheiden **Zeremonien**, bei denen der Chef informiert wird und die anderen zuhören, von **Arbeitsbesprechungen**, in denen gemeinsam ein Problem gelöst wird. Zeremonien sollen kurz und selten sein, Arbeitsbesprechungen klein und zielgerichtet. Eine Besprechung mit zwölf Teilnehmern, von denen jeder nur für fünf Minuten relevant ist, verschwendet fast die gesamte Zeit aller anderen.

### Die größte Sünde

Unter dem Titel *The Ultimate Management Sin Is …* nennen sie die schlimmste Verfehlung eines Managers: **die Zeit seiner Leute zu verschwenden**. Beispiele: Statusbesprechungen ohne Zweck, Teams zu früh mit zu vielen Leuten zu besetzen, bevor es genug zu tun gibt, und Zeit über zu viele Projekte zu zersplittern.

In der dritten Auflage kam ein Kapitel über **E-Mail** hinzu: Wer jede Nachricht an viele in Kopie schickt, verschiebt die Last der Relevanzprüfung auf alle Empfänger.

### Wandel möglich machen

Für Veränderungen in Organisationen nutzen die Autoren das Modell der Familientherapeutin Virginia Satir:

| Phase | Inhalt |
|---|---|
| **Alter Zustand** | vertraut, auch wenn er nicht gut ist |
| **Fremdes Element** | etwas Neues stört das Gewohnte |
| **Chaos** | Leistung sinkt, Unsicherheit steigt |
| **Verwandelnde Idee** | eine Einsicht macht das Neue verständlich |
| **Übung und Integration** | das Neue wird eingeübt |
| **Neuer Zustand** | besser als der alte |

Die wichtigste Lehre: **Ohne Sicherheit gibt es keinen Wandel.** Wer in der Chaosphase für Fehler bestraft wird, kehrt zum alten Zustand zurück.

### Lernende Organisationen

Organisationen lernen nur, wenn sie **Freiraum** dafür haben. Das mittlere Management ist der Ort, an dem Lernen in der Organisation stattfindet; wer es wegrationalisiert, verliert die Fähigkeit, sich zu verändern. DeMarco hat diesen Gedanken später in *Slack* ausgeführt: Organisationen, die zu hundert Prozent ausgelastet sind, können sich nicht mehr anpassen.

### Einordnung

Das Satir-Modell erklärt, warum die Einführung von TDD, Continuous Delivery oder DDD in einem Team zuerst die Produktivität senkt. Das Argument für Freiraum folgt auch aus der Warteschlangentheorie, nach der Wartezeiten bei hoher Auslastung stark ansteigen; es findet sich bei Team Topologies in der kognitiven Last und bei SRE in der 50-Prozent-Grenze wieder.

## Arbeit soll Spaß machen

Der kurze letzte Teil hat den programmatischen Titel *It's Supposed to Be Fun to Work Here*.

### Ordnung und Chaos

Organisationen neigen dazu, mit der Zeit immer mehr Ordnung herzustellen: Standards, Prozesse, Freigaben. Das macht sie berechenbar, aber auch starr und langweilig. Die Autoren empfehlen, **bewusst ein wenig konstruktives Chaos** zuzulassen:

- **Pilotprojekte**, in denen neue Methoden oder Werkzeuge ausprobiert werden
- **Wettbewerbe und Übungen**, etwa nach dem Vorbild der Coding War Games
- **Brainstorming** und offene Ideensammlungen
- **Gemeinsame Lern- und Erlebnisreisen**, die ein Team aus dem Alltag holen

### Freie Elektronen

Die besten Mitarbeiter einer Organisation werden oft zu **freien Elektronen**: Menschen, die sich ihre Rolle weitgehend selbst suchen, weil sie selbst am besten wissen, wo sie den größten Beitrag leisten. Die Autoren raten, solchen Menschen diesen Freiraum ausdrücklich zu geben, statt sie in feste Stellenbeschreibungen zu zwingen.

### Holger Danske

Das Schlusskapitel erzählt die dänische Legende von Holger Danske, einem Helden, der schlafend unter einer Burg sitzt und erwacht, wenn Dänemark ihn braucht. Die Botschaft: Veränderung muss nicht von oben kommen. Jeder in einer Organisation kann der sein, der aufsteht und etwas ändert, oft mit kleinen Schritten. Das Buch endet damit nicht mit einer Anweisung an Manager, sondern mit einer Ermutigung an alle.

### Einordnung

Pilotprojekte und konstruktives Chaos sind das organisatorische Gegenstück zu Fords Fitness Functions als Experimentiermittel und zu Becks Rat, kleine Schritte zu wagen. Die freien Elektronen entsprechen in gewisser Weise den Enabling Teams aus Team Topologies und den Staff Engineers heutiger Organisationen.

## Was heute gilt

Das Buch ist fast vierzig Jahre alt. Manche Kapitel wirken wie aus einer anderen Zeit, etwa die über Telefone und Lautsprecherdurchsagen. Die Kernaussagen haben sich aber auf überraschende Weise bestätigt, teils in neuer Form.

| Thema bei DeMarco und Lister | Lage 2026 |
|---|---|
| **Großraumbüros schaden der Konzentration** | Großraum und „Open Space“ wurden in den 2010ern trotzdem zum Standard. Seit der Pandemie arbeiten viele Entwickler zumindest teilweise zu Hause und haben dort oft mehr Ruhe, als ihnen ein Büro je bot. |
| **Unterbrechungen kosten Flow** | Das Telefon wurde durch Chat, Benachrichtigungen und Videokonferenzen ersetzt. Die Unterbrechungen sind häufiger und leiser geworden, aber nicht seltener. Das Kapitel über E-Mail lässt sich fast wörtlich auf Slack und Teams übertragen. |
| **Zeit nicht zersplittern** | Arbeit in mehreren Projekten gleichzeitig ist weiterhin verbreitet; Team Topologies und Accelerate liefern neue Argumente dagegen. |
| **Überstunden lohnen sich nicht** | DORA-Berichte verbinden Burnout mit schlechteren Ergebnissen; der Satz vom nachhaltigen Tempo ist allgemein anerkannt, wenn auch nicht überall gelebt. |
| **Stabile Teams** | Team Topologies macht langlebige Teams zum Grundprinzip. |
| **Schuldfreie Fehlerkultur** | SRE und Accelerate haben sie mit Postmortems und Westrum-Kultur institutionalisiert. |
| **Freiraum zum Lernen** | Googles bekannt gewordene 20-Prozent-Zeit, die 50-Prozent-Grenze im SRE-Buch und Becks Tidy First? folgen derselben Idee. |

### Homeoffice und verteilte Teams

Die Autoren konnten verteilte Teams nicht vorhersehen. Ihre Kriterien helfen aber, die Lage zu bewerten:

- **Für Flow** ist ein ruhiges Arbeitszimmer oft besser als jedes Büro.
- **Für Teamzusammenhalt** fehlt vieles, was im Buch eine Rolle spielt: zufällige Begegnungen, gemeinsames Essen, die Spaghetti-Party. Verteilte Teams müssen solche Gelegenheiten bewusst schaffen.
- **Räumliche Trennung** galt im Buch als Teamizid. Heute ist sie oft gewollt; umso wichtiger sind die anderen Bedingungen: Qualitätskult, Erfolge, Stabilität, Vertrauen.

### KI-Werkzeuge

Die Laetrile-Warnung vor Wundermitteln passt auf die Erwartungen an KI-gestützte Entwicklung. DORA 2025 zeigt einen Gewinn beim Durchsatz, aber keinen automatischen Gewinn bei Stabilität. Aus Sicht von *Peopleware* bleibt die Frage, wie KI-Werkzeuge Konzentration, Teamzusammenhalt und das Gefühl, stolz auf die eigene Arbeit zu sein, beeinflussen. Das Buch würde vermutlich antworten: Werkzeuge ändern wenig, wenn die soziologischen Probleme bleiben.

## Kritik und Einordnung

### Stärken

- **Die richtige Frage:** Das Buch lenkt den Blick von Technik und Prozessen auf das, was Projekte tatsächlich scheitern lässt.
- **Konkret und anschaulich:** kurze Kapitel, einprägsame Begriffe wie Flow, Teamizid, eingeschworene Teams, Möbelpolizei.
- **Mit Daten, wo möglich:** Die Coding War Games waren für ihre Zeit eine ungewöhnliche Datengrundlage.
- **Erstaunlich haltbar:** Fast alle zentralen Thesen wurden später von Accelerate, Team Topologies, SRE und der Forschung zu Wissensarbeit gestützt.
- **Ermutigend:** Es endet nicht mit Vorschriften, sondern mit der Einladung, selbst etwas zu ändern.

### Kritikpunkte

**1. Dünne Empirie.** Die Coding War Games und die zitierten Studien sind alt, klein und methodisch begrenzt. Wie bei McConnell sind manche Zahlen eher Anhaltspunkte als belastbare Ergebnisse.

**2. Anekdoten statt Systematik.** Viele Argumente stützen sich auf Geschichten und Erfahrung. Das macht das Buch lesbar, aber angreifbar.

**3. Veraltete Beispiele.** Telefone, Lautsprecher, Bürogrundrisse der 1980er: Wer das Buch heute liest, muss übertragen.

**4. Aus Sicht von Managern geschrieben.** Das Buch richtet sich an Führungskräfte. Für Entwickler ohne Einfluss auf Büro, Einstellung oder Teamzusammensetzung bleibt oft nur das Schlusskapitel.

**5. Einseitiges Bild von Wissensarbeit.** Die Betonung von Flow und Ruhe übersieht teilweise, dass auch Austausch, Pair Programming und gemeinsames Denken produktiv sein können. Extreme Programming und GOOS setzen stärker auf Zusammenarbeit als auf ungestörte Einzelarbeit.

### Gesamturteil

*Peopleware* ist das Buch der Reihe mit der geringsten Technik und der größten Wirkung auf die Frage, warum Projekte gelingen oder scheitern. Es lässt sich an zwei Abenden lesen und bleibt länger im Gedächtnis als viele dickere Werke. Neben Brooks bildet es das menschliche Fundament, auf dem die technischen Bücher stehen.

## Bezüge zur Reihe

| Thema bei DeMarco und Lister | Bezug in der Reihe |
|---|---|
| Probleme sind soziologisch | Brooks: konzeptionelle Integrität, Kommunikation; Conway |
| Menschen sind nicht austauschbar | Brooks' Gesetz; Team Topologies: stabile Teams |
| Keine Überstunden, nachhaltiges Tempo | Beck: Extreme Programming; Accelerate: Burnout |
| Qualität motiviert und spart Zeit | McConnell: Qualität ist billiger; Martin: Handwerk |
| Keine Wundermittel | Brooks: No Silver Bullet; DORA 2025 zu KI |
| Flow und Unterbrechungen | Team Topologies: kognitive Last; Goetz u.a.: Kontextwechsel kosten |
| Eingeschworene Teams | Team Topologies; Accelerate: Westrum-Kultur |
| Zersplitterte Zeit | Team Topologies: ein Team pro Strom |
| Methodik gegen Denken | Thomas und Hunt: keine Cargo-Kulte; Accelerate: Freigabegremien |
| Risiken offen benennen | Nygard; SRE: Fehlerbudgets |
| Ohne Sicherheit kein Wandel | SRE: schuldfreie Postmortems; Accelerate: generative Kultur |
| Freiraum zum Lernen | SRE: 50-Prozent-Grenze; Beck: Tidy First? |
| Arbeitsproben bei Einstellungen | Thomas und Hunt: Wissensportfolio |

## Rückblick auf die 30 Bücher

Mit *Peopleware* ist die Reihe abgeschlossen. Über alle 30 Bücher zieht sich ein roter Faden, der sich in einem Satz zusammenfassen lässt: **Gute Software entsteht dort, wo Änderungen billig bleiben**, im Code, in der Architektur, in den Daten, in der Auslieferung, im Betrieb und in den Teams.

| Ebene | Bücher | Gemeinsame Idee |
|---|---|---|
| **Code** | Martin, Ousterhout, Fowler, Beck, McConnell, Thomas und Hunt, Bloch, Weidig | Komplexität begrenzen, Kopplung lokal halten |
| **Tests** | Beck, Freeman und Pryce, Feathers, Khorikov | Verhalten absichern, damit Änderungen sicher sind |
| **Entwurf** | Gang of Four, Evans, Fowler PoEAA, Hohpe und Woolf | Begriffe und Muster für wiederkehrende Probleme |
| **Architektur** | Martin, Richards und Ford, Newman, *The Hard Parts*, Ford u.a. | Grenzen ziehen, Abwägungen bewusst treffen, Eigenschaften prüfen |
| **Daten und Nebenläufigkeit** | Kleppmann, Goetz u.a. | Zustand verstehen und beherrschen |
| **Auslieferung und Betrieb** | Humble und Farley, Nygard, SRE | kleine Schritte, Stabilität, Lernen aus Fehlern |
| **Menschen und Organisation** | Brooks, Skelton und Pais, Forsgren u.a., DeMarco und Lister | Kommunikation, stabile Teams, Vertrauen |

## Diskussionsfragen

1. **Soziologie:** An welchem Projekt deiner Laufbahn lag das eigentliche Problem nicht in der Technik? Was war es?
2. **Flow:** Wie viele ungestörte Stunden hast du an einem typischen Arbeitstag? Was unterbricht dich am häufigsten?
3. **Homeoffice:** Hat sich deine Konzentration seit der Arbeit von zu Hause verbessert oder verschlechtert? Und der Zusammenhalt im Team?
4. **Teamizid:** Welche der Techniken hast du erlebt, als Betroffener oder vielleicht auch als Verursacher?
5. **Eingeschworene Teams:** Warst du schon einmal Teil eines solchen Teams? Was hat es ausgemacht, und was hat es beendet?
6. **Fluktuation:** Wie hoch ist sie bei euch, und weiß jemand, was sie kostet?
7. **Rückblick:** Welche drei der 30 Bücher würdest du einem jungen Entwickler zuerst empfehlen, und welche einem Teamleiter?
8. **Weiter:** Damit sind alle 30 klassischen Bücher besprochen. Als Nächstes die KI-Reihe, beginnend mit Chip Huyens *AI Engineering*?
