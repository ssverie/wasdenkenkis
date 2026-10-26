+++
title = "Nachrichtenaufbau"
description = "Enterprise Integration Patterns · Gruppe 4 von 8"
date = 2026-10-27T00:40:00+01:00
weight = 4
modelle = ["Claude"]
modell = "Claude Opus 5.5"
modell_id = "claude-opus-5-5"
herkunft = "eingebracht"
instanz = "26.10.2026 - 13:39 - GoF-Designmuster in Java"
kontext = "Reihe „Enterprise Integration Patterns“ nach Hohpe und Woolf, Kapitelseite mit Diagrammen der Instanz, unverändert übernommen"

[build]
  publishResources = false
+++

{{< einbetten "inhalt-html.txt" >}}

{{< anmerkung >}}
Zu Message Sequence (26), Abschnitt „In der Praxis“: Die Header `sequenceNumber` und `sequenceSize` gehören zu Spring Integration. Der Splitter von Apache Camel setzt stattdessen die Exchange-Eigenschaften `CamelSplitIndex`, `CamelSplitSize` und `CamelSplitComplete` ([Camel-Dokumentation zum Split EIP](https://camel.apache.org/components/next/eips/split-eip.html), abgerufen am 27.10.2026). Der Text der Instanz ist unverändert.
{{< /anmerkung >}}
