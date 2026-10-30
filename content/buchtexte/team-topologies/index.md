+++
title = "Team Topologies – Zusammenfassung und Einordnung"
description = "Matthew Skelton, Manuel Pais, Team Topologies: Organizing Business and Technology Teams for Fast Flow (2019, 2. Auflage 2025)"
date = 2026-10-30T18:57:45+01:00
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "29.10.2026 - 10:50 - IT-Books"
kontext = "Claude Docs; Zusammenfassungen zu Svens IT-Büchern"
buecher = ["team-topologies-2025"]
+++

## Einleitung

Team Topologies beantwortet eine Frage, die in dieser Reihe immer wieder auftauchte, aber nie im Mittelpunkt stand: **Wie schneidet man Teams, damit Software schnell und nachhaltig fließen kann?** Brooks stellte fest, dass Kommunikation der Engpass ist, Evans verknüpfte Bounded Contexts mit Teams, Accelerate zeigte mit Daten, dass lose Kopplung zwischen Teams Leistung vorhersagt. Skelton und Pais machen daraus ein handhabbares Modell.

### Autoren und Kontext

Matthew Skelton und Manuel Pais sind Berater mit Hintergrund in Continuous Delivery und DevOps. Ihr Buch entstand aus dem Projekt **DevOps Topologies**, einer Sammlung von Mustern und Antimustern für die Zusammenarbeit von Entwicklung und Betrieb. Team Topologies verallgemeinert diese Ideen auf die ganze Organisation.

|  | 1. Auflage (2019) | 2. Auflage (2025) |
|---|---|---|
| Kerninhalt | vier Teamtypen, drei Interaktionsmodi, kognitive Last, Conways Gesetz | unverändert |
| Neu | – | Anhang mit rund zehn Fallstudien aus vielen Branchen, neues Vorwort und Nachwort, Gedanken zu KI-gestützten Organisationen |

### Die Kernideen

1. **Teams sind die Einheit der Lieferung**, nicht einzelne Personen.
2. **Conways Gesetz** gilt: Systemstrukturen folgen Kommunikationsstrukturen. Also gestaltet man Teams bewusst so, wie man die Architektur haben will.
3. **Kognitive Last begrenzen:** Ein Team kann nur so viel verantworten, wie es geistig bewältigen kann.
4. **Vier Teamtypen** reichen, um fast jede Organisation zu beschreiben.
5. **Drei Interaktionsmodi** beschreiben, wie Teams zusammenarbeiten.
6. **Teamstrukturen entwickeln sich** und sollen bewusst angepasst werden.

### Aufbau

| Teil | Inhalt |
|---|---|
| I. Teams als Mittel der Lieferung | Organigramme, Conways Gesetz, Team zuerst, kognitive Last |
| II. Teamtopologien für schnellen Fluss | statische Topologien, die vier Teamtypen, Teamgrenzen |
| III. Teaminteraktionen weiterentwickeln | Interaktionsmodi, Strukturen anpassen, organisatorisches Wahrnehmen |

Mit rund 250 Seiten in der ersten Auflage ist das Buch kompakt und mit vielen Abbildungen und Beispielen aus realen Organisationen versehen. Die visuelle Sprache mit farbigen Formen für die Teamtypen ist zu einem verbreiteten Standard für Organisationsdiagramme geworden.

## Das Problem mit Organigrammen

Organigramme zeigen, wer wem berichtet. Sie zeigen aber nicht, wie Arbeit tatsächlich fließt, wer mit wem reden muss, um etwas auszuliefern, und wo Wartezeiten entstehen. In der Praxis gibt es neben der formalen Struktur immer eine **informelle Struktur** von Beziehungen und eine **Wertschöpfungsstruktur**, entlang derer Arbeit wirklich geschieht.

Die Autoren fordern deshalb, Organisationen nicht nach Berichtslinien zu gestalten, sondern nach **Kommunikation und Fluss**: Welche Teams müssen eng zusammenarbeiten, welche sollten möglichst unabhängig sein?

## Conways Gesetz

Melvin Conway formulierte 1968 eine Beobachtung, die heute als Gesetz gilt, sinngemäß: **Organisationen, die Systeme entwerfen, bauen Systeme, deren Struktur ihre Kommunikationsstruktur abbildet.**

Wenn vier Teams an einem Compiler arbeiten, entsteht ein Compiler mit vier Phasen. Wenn Frontend, Backend und Datenbank in getrennten Abteilungen sitzen, entsteht eine Architektur mit drei Schichten, die nur über formale Übergaben kommunizieren, und jede Änderung, die alle drei berührt, braucht drei Teams.

### Das umgekehrte Conway-Manöver

Wenn die Organisation die Architektur bestimmt, kann man das nutzen: **Man gestaltet zuerst die Teams so, wie man die Architektur haben möchte**, und die Architektur folgt. Dieser Gedanke wurde schon in Accelerate erwähnt; Team Topologies macht ihn zur zentralen Methode.

Daraus folgen mehrere Konsequenzen:

- **Organisationsdesign braucht technisches Wissen.** Wer Teams schneidet, entscheidet über Architektur. Das darf nicht allein die Personalabteilung oder das Management tun.
- **Unnötige Kommunikation einschränken:** Nicht jedes Team muss mit jedem reden. Zu viel Kommunikation zwischen Teams ist ein Zeichen für falsche Grenzen, und Werkzeuge, die alle mit allen verbinden, können das Problem verschärfen.
- **Architektur für teambezogenen Fluss:** Die Software soll so geschnitten sein, dass ein Team seine Änderungen ohne Abstimmung mit anderen ausliefern kann.

### Einordnung

Brooks' Turmbau zu Babel, Evans' Context Maps und Accelerates lose gekoppelte Architektur beschreiben denselben Zusammenhang aus verschiedenen Richtungen. Team Topologies zieht daraus die praktische Konsequenz: Wer die Architektur ändern will, muss die Teams ändern, und umgekehrt.

## Team zuerst

Die Autoren setzen das **Team** als kleinste Einheit der Lieferung, nicht die einzelne Person. Ein Team ist mehr als eine Gruppe: Es hat gemeinsame Ziele, Vertrauen, eingespielte Abläufe und gemeinsame Verantwortung.

### Teamgröße

- **Fünf bis neun Personen**, entsprechend der Grenze, bis zu der Menschen einander gut genug kennen, um eng und vertrauensvoll zusammenzuarbeiten.
- Größere Gruppierungen orientieren sich an den **Dunbar-Zahlen**: etwa 15 Personen, die man gut kennt, 50, denen man vertraut, 150, die man noch einordnen kann. Abteilungen und Bereiche sollen sich an diesen Größen orientieren, damit Vertrauen über Teamgrenzen hinweg möglich bleibt.

### Stabile Teams

Teams brauchen Zeit, um gut zu werden. Wer Menschen ständig zwischen Projekten verschiebt, beginnt immer wieder von vorn. Die Autoren empfehlen **langlebige Teams**, zu denen Arbeit gebracht wird, statt Teams für jedes Projekt neu zu bilden. Wechsel sind möglich, aber selten und bewusst.

### Eigentum an Software

Jede Software, jeder Dienst und jede Komponente gehört **genau einem Team**. Gemeinsames Eigentum mehrerer Teams führt dazu, dass sich niemand verantwortlich fühlt. Andere Teams dürfen Änderungen vorschlagen oder beitragen, aber das besitzende Team entscheidet und pflegt.

## Kognitive Last

Das vielleicht wichtigste Konzept des Buchs. Die Autoren übernehmen es aus der Lernpsychologie nach John Sweller:

| Art | Bedeutung | Beispiel | Ziel |
|---|---|---|---|
| **Intrinsisch** | die Schwierigkeit der Aufgabe selbst | Fachlogik eines Zahlungsdienstes verstehen | durch Training und Erfahrung bewältigen |
| **Extrinsisch** | Aufwand durch die Umgebung | wie man ein Deployment anstößt, wie die Infrastruktur funktioniert | **minimieren** |
| **Lernbezogen** | Aufwand, der zu neuem Verständnis führt | die Domäne tiefer verstehen, bessere Lösungen finden | **maximieren** |

Die zentrale Aussage: **Ein Team kann nur so viel verantworten, wie seine kognitive Kapazität erlaubt.** Wird die Last zu groß, sinkt die Qualität, Fehler häufen sich, und das Team wird zum Engpass.

### Wie man kognitive Last begrenzt

- **Domänen zuteilen:** Ein Team sollte höchstens eine komplexe Domäne verantworten, oder zwei bis drei einfache. Komplexe und einfache Domänen nicht mischen, weil die einfachen sonst vernachlässigt werden.
- **Extrinsische Last auslagern:** Infrastruktur, Deployment, Monitoring über Plattformteams bereitstellen, damit sich das Team auf die Fachlichkeit konzentrieren kann.
- **Teams fragen:** Kognitive Last ist schwer zu messen, aber Teams können meist gut einschätzen, ob sie überfordert sind.

### Die Team-API

Jedes Team soll eine klare Schnittstelle nach außen haben, die **Team-API**: Welche Dienste bietet es an, wie sind sie dokumentiert und versioniert, wie erreicht man das Team, wie arbeitet es, woran arbeitet es gerade, was hat Priorität. Das ist Ousterhouts Schnittstellendenken, übertragen auf Teams: Andere sollen mit dem Team arbeiten können, ohne seine Interna zu kennen.

### Einordnung

Kognitive Last ist für Organisationen, was Ousterhouts Komplexität für Code ist. McConnell und Brooks zitierten Dijkstras Satz, dass kein Kopf groß genug für ein ganzes Programm sei; Team Topologies überträgt das auf Teams: Kein Team ist groß genug für ein ganzes System.

## Statische Topologien und Antipatterns

Bevor die Autoren ihr eigenes Modell vorstellen, beschreiben sie typische Fehler in der Teamorganisation.

### Zwei grundlegende Antipatterns

- **Teams nach Gefühl schneiden:** Teams entstehen zufällig, aus Personalgründen oder historisch, ohne Blick auf den Fluss der Arbeit. Typisch sind Teams pro Technologie, etwa ein Datenbankteam, ein Frontend-Team, ein Middleware-Team, die für jede fachliche Änderung zusammenarbeiten müssen.
- **Ständiges Umsetzen von Personen:** Menschen werden zwischen Projekten verschoben, wie es gerade passt. Teams kommen nie über die Anfangsphase hinaus.

### Für den Fluss der Änderungen entwerfen

Das Leitbild ist der **schnelle Fluss** von Änderungen zum Nutzer. Fragen, die man dafür stellt:

- Wie viele Teams müssen an einer typischen fachlichen Änderung beteiligt sein? Idealerweise eines.
- Wo warten Teams aufeinander?
- Welche Übergaben gibt es zwischen Teams, etwa von Entwicklung zu Test zu Betrieb?

### Was nicht ohne Weiteres funktioniert

Die Autoren warnen vor einigen verbreiteten Rezepten:

| Muster | Problem |
|---|---|
| **Feature-Teams ohne Unterstützung** | Teams, die quer durch alle Schichten arbeiten, sind gut, brauchen aber hohe technische Reife und eine Plattform, sonst ertrinken sie in kognitiver Last. |
| **DevOps-Team als eigenes Silo** | Ein Team, das „DevOps macht“, wird oft zu einer weiteren Abteilung zwischen Entwicklung und Betrieb, statt die Zusammenarbeit zu verbessern. |
| **Cloud-Team baut Anwendungsinfrastruktur** | Ein zentrales Team, das für jede Anwendung Infrastruktur von Hand aufsetzt, wird zum Engpass. Besser ist eine Plattform zur Selbstbedienung. |
| **SRE ohne Größe** | Site Reliability Engineering nach Googles Vorbild lohnt sich erst ab einer gewissen Systemgröße und Reife. |
| **Spotify-Modell kopieren** | Tribes, Squads, Chapters und Gilden funktionieren bei Spotify unter bestimmten Bedingungen; als Blaupause kopiert, oft nicht. Das ist Thomas' und Hunts Cargo-Kult. |

### Was die Wahl beeinflusst

Welche Struktur passt, hängt ab von technischer und kultureller Reife, Größe der Organisation, Größe und Komplexität der Software und Ingenieursdisziplin. Es gibt keine universell richtige Topologie, wohl aber wiederkehrende Grundbausteine. Das sind die vier Teamtypen des nächsten Abschnitts.

## Die vier Teamtypen

Das Herzstück des Buchs: Die Autoren argumentieren, dass vier Teamtypen ausreichen, um fast jede Softwareorganisation zu beschreiben. Jeder Typ hat einen klaren Zweck, und jeder Typ außer dem ersten existiert, um den ersten zu entlasten.

{{< bild src="bild-1.png" alt="die vier Teamtypen · Beispiel eines Onlinehandels" >}}

die vier Teamtypen · Beispiel eines Onlinehandels

### Stream-aligned Team

Der **wichtigste und häufigste** Teamtyp. Ein Stream-aligned Team ist auf einen kontinuierlichen Strom von Arbeit ausgerichtet, etwa ein Produkt, eine Nutzergruppe, eine Customer Journey oder einen fachlichen Bereich. Es liefert von der Idee bis zum Betrieb **ohne Übergaben** an andere Teams.

Eigenschaften: fachlich und technisch breit aufgestellt, nah am Nutzer, schnelles Feedback, eigenverantwortlich für Qualität und Betrieb. Die meisten Teams einer Organisation sollten von diesem Typ sein.

### Enabling Team

Spezialisten, die **andere Teams befähigen**, etwa in Testautomatisierung, Sicherheit, Datenwissenschaft oder neuen Technologien. Sie arbeiten nicht dauerhaft an Produkten mit, sondern für eine begrenzte Zeit mit einem Team, bis dieses die Fähigkeit selbst beherrscht. Danach ziehen sie weiter. Erfolg zeigt sich daran, dass sie **nicht mehr gebraucht** werden.

### Complicated-Subsystem Team

Für Teile des Systems, die **spezielles Fachwissen** erfordern, das die meisten Stream-aligned Teams nicht haben können, etwa ein Videocodec, ein mathematisches Modell, eine Bilderkennung oder eine Risikoberechnung. Dieses Team nimmt den anderen kognitive Last ab. Der Typ soll selten sein und nur dort eingesetzt werden, wo die Komplexität es wirklich verlangt.

### Plattformteam

Ein Plattformteam stellt **interne Dienste zur Selbstbedienung** bereit, etwa Infrastruktur, Deployment-Pipelines, Monitoring, Datenbanken oder Identitätsverwaltung. Stream-aligned Teams nutzen die Plattform wie ein externes Produkt, ohne mit dem Plattformteam verhandeln zu müssen.

Die Autoren prägen dazu den Begriff der **Thinnest Viable Platform**: Die Plattform soll so dünn wie möglich sein. Manchmal reicht eine Wiki-Seite mit Anleitungen zu Cloud-Diensten. Eine Plattform ist kein Selbstzweck, sondern ein **Produkt für interne Kunden**, mit Nutzerforschung, Roadmap und Qualitätsanspruch.

### Was vermieden werden soll

- **Teams pro technischer Schicht**, etwa Frontend, Backend, Datenbank, weil jede fachliche Änderung alle drei braucht.
- **Zu viele Teamtypen** und Sonderformen. Wer weitere Typen erfindet, verliert die Klarheit des Modells.
- **Plattformen, die zur Pflicht werden**, statt durch ihre Qualität zu überzeugen.

## Teamgrenzen: Bruchlinien

Wo zieht man die Grenzen zwischen Teams und den Systemen, die sie verantworten? Die Autoren übernehmen dafür den Begriff der **Bruchlinie** (Fracture Plane): eine natürliche Stelle, an der sich ein System teilen lässt, ähnlich wie ein Stein entlang bestimmter Linien bricht.

### Arten von Monolithen

Bevor man teilt, muss man wissen, welche Art von Monolith man hat. Die Autoren unterscheiden:

| Art | Merkmal |
|---|---|
| Anwendungsmonolith | eine einzige große Anwendung |
| Über die Datenbank verbunden | viele Anwendungen, die alle an einem gemeinsamen Schema hängen |
| Monolithischer Build | alles muss zusammen gebaut werden |
| Monolithisches Release | einzeln gebaute Teile, die nur gemeinsam ausgeliefert werden können |
| Monolithisches Modell | ein einziges Domänenmodell für alles |
| Monolithisches Denken | alle Teams sollen dieselben Werkzeuge und Methoden nutzen |
| Monolithischer Arbeitsplatz | ein einheitliches Bürokonzept für alle Teams |

Die Liste zeigt, dass Monolithen nicht nur technisch sind. Ein monolithisches Release ist für den Fluss genauso hinderlich wie ein Anwendungsmonolith, und Accelerate zeigt, dass unabhängige Auslieferbarkeit der entscheidende Faktor ist.

### Mögliche Bruchlinien

| Bruchlinie | Wann sinnvoll |
|---|---|
| **Fachliche Domäne / Bounded Context** | fast immer die erste Wahl; im Sinne von Evans |
| **Regulatorische Vorgaben** | Teile, die besonderen Auflagen unterliegen, etwa Zahlungsdaten nach PCI DSS, isolieren, damit nicht das ganze System zertifiziert werden muss |
| **Änderungsrhythmus** | Teile, die sich oft ändern, von solchen trennen, die sich selten ändern |
| **Standort** | Teams an verschiedenen Orten oder Zeitzonen brauchen Systemteile, die sie unabhängig voneinander ändern können |
| **Risiko** | Bereiche mit hohem Risiko, etwa Zahlung, von Bereichen trennen, in denen man schnell experimentieren will |
| **Leistungsisolation** | Teile mit besonderen Lastanforderungen getrennt skalieren |
| **Technologie** | nur mit Vorsicht, etwa bei sehr unterschiedlichen Plattformen; sonst entstehen Teams pro Schicht |
| **Nutzergruppen** | etwa Privatkunden und Geschäftskunden mit unterschiedlichen Bedürfnissen |

### Die Leitregel

**Teams und Architektur zusammen entwerfen:** Jede Bruchlinie soll gleichzeitig eine Systemgrenze und eine Teamgrenze sein. Ein Systemteil, das zu groß für ein Team ist, verletzt die Grenze der kognitiven Last; ein Team, das an vielen kleinen Teilen in verschiedenen Domänen arbeitet, ebenso. Die Autoren sprechen von **teamgroßer Architektur**.

### Einordnung

Dieses Kapitel ist die direkte organisatorische Fortsetzung von Evans' Bounded Contexts und Kleppmanns Sharding: Was zusammen geändert wird, gehört zusammen, und was unabhängig geändert werden soll, braucht eine klare Grenze. Becks Kopplung relativ zur Änderung liefert dafür die Begründung.

## Die drei Interaktionsmodi

Teams arbeiten nicht isoliert. Die Autoren beschreiben drei Arten, wie Teams zusammenarbeiten, und fordern, dass jede Beziehung zwischen zwei Teams **ausdrücklich** einem dieser Modi folgt.

| Modus | Wie es aussieht | Gut für | Kosten |
|---|---|---|---|
| **Collaboration** | zwei Teams arbeiten eng zusammen, teilen Verantwortung für ein Ziel | Neuland erkunden, schnelles Lernen, Innovation an der Grenze zweier Bereiche | hohe kognitive Last, verwischte Verantwortung, langsamer im Normalbetrieb |
| **X-as-a-Service** | ein Team bietet etwas an, das andere nutzt es mit minimaler Abstimmung | stabile, klar abgegrenzte Funktionen; schneller Fluss | das anbietende Team muss einen guten Dienst bauen; Innovation an der Grenze ist langsamer |
| **Facilitating** | ein Team hilft einem anderen, eine Fähigkeit aufzubauen | Wissen verbreiten, Hindernisse beseitigen | zeitlich begrenzt; braucht erfahrene, kommunikationsstarke Leute |

### Welche Typen welche Modi nutzen

| Teamtyp | Typische Modi |
|---|---|
| Stream-aligned | Collaboration mit anderen Stream-aligned Teams oder Spezialteams in der Erkundungsphase; konsumiert X-as-a-Service |
| Enabling | Facilitating, selten Collaboration |
| Complicated Subsystem | X-as-a-Service, Collaboration beim Aufbau neuer Funktionen |
| Plattform | X-as-a-Service als Normalfall, Collaboration beim Entdecken neuer Bedürfnisse |

### Die Modi als Sensor

Ein wichtiger Gedanke: Die Interaktionsmodi sind nicht nur Regeln, sondern auch **Messinstrument**. Wenn zwei Teams dauerhaft eng zusammenarbeiten müssen, obwohl ihre Beziehung als X-as-a-Service gedacht war, stimmt die Grenze nicht. Entweder ist der Dienst unzureichend, oder die Verantwortung ist falsch geschnitten.

Umgekehrt soll Collaboration **zeitlich begrenzt** sein: Sie dient dazu, eine neue Grenze zu finden. Danach geht die Beziehung typischerweise in X-as-a-Service über.

### Verhalten je Modus

- **Collaboration:** gemeinsame Ziele, gemeinsame Verantwortung, hohe Bereitschaft zu Abstimmung, Respekt für die Fähigkeiten des anderen Teams.
- **X-as-a-Service:** ein Dienst mit guter Benutzererfahrung, klarer Dokumentation und stabiler Schnittstelle; Verständnis dafür, dass der Nutzer nicht alles mitgestalten kann.
- **Facilitating:** Hilfe zur Selbsthilfe, Lernen fördern, nicht die Arbeit selbst erledigen.

### Einordnung

Die drei Modi sind eine vereinfachte Fassung von Evans' Context-Map-Mustern: **Collaboration** entspricht Partnership oder Shared Kernel, **X-as-a-Service** dem Open Host Service mit Customer-Supplier-Beziehung, und **Facilitating** hat bei Evans keine direkte Entsprechung. Die Vereinfachung ist bewusst: Drei Modi lassen sich im Alltag leichter benennen und überprüfen als sieben Beziehungsmuster.

## Teamstrukturen weiterentwickeln

Der letzte Teil betont, dass Teamtopologien **nicht statisch** sind. Eine Struktur, die heute passt, wird morgen nicht mehr passen, weil sich Produkte, Technik und Organisation ändern. Die Frage ist nicht, wie die richtige Struktur aussieht, sondern wie man erkennt, wann sie sich ändern sollte.

### Typische Entwicklungen

- **Von Collaboration zu X-as-a-Service:** Zwei Teams erkunden gemeinsam eine neue Technologie oder Domäne. Sobald die Grenze klar ist, übernimmt ein Team die Verantwortung und bietet das Ergebnis als Dienst an.
- **Vom Stream-aligned Team zum Plattformteam:** Ein Team baut etwas, das viele andere brauchen, etwa eine Bibliothek oder einen Dienst. Irgendwann lohnt es sich, daraus eine Plattform zu machen.
- **Aufteilen eines Teams:** Ein Team, dessen Verantwortung über die kognitive Last hinauswächst, wird entlang einer Bruchlinie geteilt.
- **Auflösen eines Enabling Teams:** Wenn die anderen Teams eine Fähigkeit beherrschen, wird das Enabling Team nicht mehr gebraucht oder wendet sich einem neuen Thema zu.

### Auslöser für Veränderung

Die Autoren nennen Signale, dass eine Struktur nicht mehr passt:

- **Die Software ist zu groß für ein Team.** Das Team kann nicht mehr überblicken, was es verantwortet.
- **Die Lieferung wird langsamer**, obwohl die Teams nicht kleiner geworden sind.
- **Viele Dienste hängen von einer großen Zahl darunterliegender Dienste ab**, und jede Änderung braucht mehrere Teams.
- **Teams kommunizieren ständig**, obwohl ihre Beziehung als X-as-a-Service gedacht war.

### Organisatorisches Wahrnehmen

Die Autoren übertragen die Idee der Rückkopplung auf die Organisation: Teams und ihre Interaktionen sollen wie **Sensoren** wirken, die frühzeitig zeigen, wo etwas nicht stimmt.

Besonders wichtig ist der **Betrieb** als Informationsquelle. Wenn Stream-aligned Teams ihre eigenen Dienste betreiben, erfahren sie aus erster Hand, was in Produktion passiert, und können schnell reagieren. Wenn der Betrieb in einer getrennten Abteilung liegt, gehen diese Signale verloren oder kommen verspätet an. Das ist die organisatorische Seite von Nygards Transparenz und von „You build it, you run it“.

### Einordnung

Dieser Teil verbindet Team Topologies mit der evolutionären Haltung der Reihe: Fowler lässt Code durch Refactoring wachsen, Evans lässt Modelle durch tiefere Einsicht reifen, Beck spricht von Design als laufender Investition, und Brooks empfiehlt, Software wachsen zu lassen. Skelton und Pais fordern dasselbe für Organisationen: **Teamstrukturen refaktorieren**, wenn sie dem Fluss im Weg stehen.

## Die zweite Auflage (2025)

Die zweite Auflage erschien im September 2025. Der Kerninhalt ist unverändert; neu sind drei Teile.

### Fallstudien

Der größte Zusatz ist ein Anhang mit rund zehn **Fallstudien** aus Organisationen in vielen Branchen und Ländern. Nach den Verlagsangaben gehören dazu unter anderem:

- ein Beratungsunternehmen, das Führung als internen Dienst organisiert,
- eine organisationsweite Transformation bei einem Telekommunikationsanbieter,
- ein Handelsunternehmen, das den Ansatz der dünnsten möglichen Plattform umsetzt,
- ein Sportartikelhersteller auf dem Weg von ausgelagerter IT zu eigener Plattformkompetenz,
- eine Regierungsorganisation, die Enabling Teams als vor Ort eingesetzte Teams nutzt, um Ansätze zuerst intern zu erproben und dann im gesamten öffentlichen Sektor zu verbreiten.

Auffällig ist, dass viele Organisationen das Modell nicht nur für Softwareteams, sondern für die **ganze Organisation** nutzen, als Alternative zu starren Zielbetriebsmodellen.

### Neues Vorwort und Nachwort

Die Autoren reflektieren, wie sich das Modell seit 2019 verbreitet hat, auch in Bereiche, an die sie ursprünglich nicht gedacht hatten, und welche Prinzipien hinter den sichtbaren Mustern wirklich zählen.

### KI-gestützte Organisationen

Die zweite Auflage greift die Frage auf, was KI für Teamstrukturen bedeutet. Nach den verfügbaren Beschreibungen argumentieren die Autoren, dass **klare Domänengrenzen und eingegrenzte Arbeitsbereiche** auch helfen, Vertrauen in KI-Agenten aufzubauen: Ein Agent, der in einem klar umrissenen Kontext arbeitet, ist leichter zu steuern und zu prüfen als einer, der überall eingreifen kann.

Das passt zu den DORA-Befunden aus der Accelerate-Zusammenfassung: KI wirkt als Verstärker, und Teams mit lose gekoppelten Architekturen und schnellen Rückkopplungsschleifen profitieren, während eng gekoppelte Organisationen kaum Nutzen sehen. Team Topologies liefert die organisatorische Seite dieser Voraussetzungen.

Hinweis: Die Angaben zu den Inhalten der zweiten Auflage stammen aus Verlags- und Veranstaltungsbeschreibungen; die Details der Fallstudien habe ich nicht im Original geprüft.

Quellen: [IT Revolution: Team Topologies, 2nd Edition](https://itrevolution.com/?p=78490) · [IT Revolution: Real-World Lessons](https://itrevolution.com/articles/team-topologies-2nd-edition-real-world-lessons-from-the-global-business-community/) · [Team Topologies: Launch der zweiten Auflage](https://teamtopologies.com/all-events/2025/9/25/team-topologies-second-edition-book-launch-meet-the-authors-and-discover-success-stories)

## Kritik und Einordnung

Team Topologies hat sich in wenigen Jahren zu einem Standardvokabular für Organisationsdesign in der Softwareentwicklung entwickelt. Begriffe wie Stream-aligned Team, Plattformteam und kognitive Last tauchen heute in Stellenanzeigen, Architekturentscheidungen und Umorganisationen auf.

### Stärken

- **Einfaches, einprägsames Modell:** vier Typen, drei Modi. Das lässt sich in einer Besprechung erklären und auf einem Whiteboard zeichnen.
- **Kognitive Last als Maßstab:** ein menschlicher Begriff, der technische Entscheidungen begründet.
- **Conways Gesetz als Werkzeug:** nicht nur Beobachtung, sondern Gestaltungsmittel.
- **Verbindung von Technik und Organisation:** Das Buch schließt die Lücke zwischen DDD, Accelerate und Organisationsentwicklung.
- **Plattform als Produkt:** Der Gedanke, interne Plattformen wie Produkte für interne Kunden zu behandeln, hat die Plattformtechnik stark geprägt.
- **Visuelle Sprache:** Die standardisierten Formen und Farben machen Organisationsdiagramme vergleichbar.

### Kritikpunkte

**1. Zu einfach für große Organisationen.** Vier Typen und drei Modi reichen für die Zusammenarbeit zwischen Teams, aber wenig für Fragen wie Budgetierung, Karrierepfade, Führungsstrukturen oder Abhängigkeiten zu Fachbereichen außerhalb der IT.

**2. Gefahr der Umbenennung.** Viele Organisationen benennen bestehende Teams um, ohne ihre Arbeitsweise zu ändern: Das alte Infrastrukturteam heißt nun Plattformteam, bleibt aber ein Ticket-Abarbeiter. Das ist Thomas' und Hunts Cargo-Kult.

**3. Kognitive Last ist schwer messbar.** Das Konzept ist überzeugend, aber in der Praxis bleibt es meist bei Selbsteinschätzungen der Teams.

**4. Wenig Empirie.** Anders als Accelerate beruht das Buch auf Beratungserfahrung und Fallbeispielen, nicht auf systematischen Daten. Die neuen Fallstudien der zweiten Auflage sind anschaulich, aber keine Belege im statistischen Sinn.

**5. Plattformteams als Engpass.** Ein schlecht geführtes Plattformteam kann zum größten Engpass der Organisation werden. Die Autoren warnen davor, aber die Gefahr bleibt groß, besonders wenn die Nutzung der Plattform verpflichtend ist.

**6. Wenig zu Fachlichkeit.** Wie man Bruchlinien entlang der Domäne konkret findet, bleibt knapp. Dafür braucht man Evans, Event Storming oder Khononov.

### Gesamturteil

Team Topologies ist das Buch, das die organisatorischen Einsichten der ganzen Reihe in ein praktisches Modell überführt. Wer verstanden hat, warum Brooks Kommunikation für den Engpass hält, warum Evans Bounded Contexts an Teams knüpft und warum Accelerate lose Kopplung misst, findet hier die Werkzeuge, um das in einer Organisation umzusetzen.

## Bezüge zur Reihe

Team Topologies bündelt die organisatorischen Fäden, die sich durch die ganze Reihe ziehen.

| Idee in Team Topologies | Vorläufer in der Reihe |
|---|---|
| Kommunikation als Engpass, Teamgröße | Brooks: n(n−1)/2, Turmbau zu Babel; McConnell: Projektgröße |
| Conways Gesetz, umgekehrtes Conway-Manöver | Accelerate: lose gekoppelte Architektur; Evans: Context Maps |
| Kognitive Last | Ousterhout: Komplexität; McConnell und Brooks mit Dijkstra |
| Bruchlinie entlang der Domäne | Evans: Bounded Contexts; Kleppmann: Sharding; Beck: Kopplung relativ zur Änderung |
| Ein Team besitzt jedes System | Evans: ein Kontext, ein Team; Nygard: Dienste besitzen ihre Daten |
| Team-API | Ousterhout: einfache Schnittstellen; GOOS: Rollen aus Sicht des Aufrufers |
| Plattformteam, X-as-a-Service | Nygard: Plattformteams; Accelerate: Teams wählen Werkzeuge selbst |
| Thinnest Viable Platform | Thomas und Hunt: Konfiguration mit Maß; Fowler: Speculative Generality vermeiden |
| Enabling Teams | Thomas und Hunt: Wissensportfolio; Brooks: Werkzeugmacher |
| Interaktionsmodi | Evans: Partnership, Customer/Supplier, Open Host Service |
| Betrieb als Sensor | Nygard: Transparenz; Accelerate: Monitoring |
| Strukturen weiterentwickeln | Fowler: Refactoring; Beck: Design als Investition; Brooks: Software wachsen lassen |
| Spotify-Modell nicht kopieren | Thomas und Hunt: Cargo-Kulte |

## Diskussionsfragen

1. **Deine Organisation:** Welche der vier Teamtypen gibt es bei euch, und welche Teams passen in keinen davon?
2. **Conways Gesetz:** Wo spiegelt eure Systemarchitektur eure Organisationsstruktur, im Guten oder im Schlechten?
3. **Kognitive Last:** Welches Team bei euch trägt die meiste extrinsische Last, etwa durch Infrastruktur, Deployment oder Fremdsysteme?
4. **Plattform:** Ist eure Plattform ein Produkt für interne Kunden oder ein Ticket-System mit neuem Namen?
5. **Interaktionsmodi:** Welche Teambeziehungen sind als X-as-a-Service gedacht, laufen aber faktisch als dauerhafte Collaboration?
6. **Bruchlinien:** Welche Bruchlinie würdest du in eurem größten Monolithen zuerst ziehen, und warum?
7. **Stabilität:** Wie lange bleiben Teams bei euch in derselben Zusammensetzung? Hilft oder schadet das?
8. **KI und Teams:** Würden klare Domänengrenzen in eurer Organisation helfen, KI-Agenten sicher einzusetzen?
