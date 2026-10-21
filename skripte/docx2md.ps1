# Wandelt eine .docx-Datei wortgetreu in Markdown um (Text unverändert).
# Übernimmt: Überschriften (Title/Heading1-3), nummerierte und Aufzählungslisten,
# Links, Fett/Kursiv, Tabellen. Absätze mit Formatvorlage "Subtitle" werden kursiv.
#
# Aufruf:  powershell -File skripte\docx2md.ps1 -Docx <datei.docx> [-Ebene 1]
#   -Ebene: um wie viele Stufen Überschriften tiefer gesetzt werden (Heading1 -> ## bei 1)
param(
  [Parameter(Mandatory = $true)][string]$Docx,
  [int]$Ebene = 1
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
$R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

$zip = [System.IO.Compression.ZipFile]::OpenRead((Resolve-Path $Docx))
function Lies($name) {
  $e = $zip.GetEntry($name); if (-not $e) { return $null }
  $sr = New-Object System.IO.StreamReader($e.Open()); $t = $sr.ReadToEnd(); $sr.Close(); $t
}
[xml]$doc = Lies 'word/document.xml'
$relsText = Lies 'word/_rels/document.xml.rels'
$numText = Lies 'word/numbering.xml'
$zip.Dispose()

$ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
$ns.AddNamespace('w', $W); $ns.AddNamespace('r', $R)

# Link-Ziele
$links = @{}
if ($relsText) { foreach ($m in [regex]::Matches($relsText, 'Id="(rId\d+)"[^>]*Target="([^"]+)"')) { $links[$m.Groups[1].Value] = $m.Groups[2].Value } }

# Listenart je numId (decimal = nummeriert, sonst Aufzählung)
$listenArt = @{}
if ($numText) {
  [xml]$num = $numText
  $nsN = New-Object System.Xml.XmlNamespaceManager($num.NameTable); $nsN.AddNamespace('w', $W)
  foreach ($n in $num.SelectNodes('//w:num', $nsN)) {
    $id = $n.GetAttribute('numId', $W)
    $abs = $n.SelectSingleNode('w:abstractNumId/@w:val', $nsN).Value
    $fmt = $num.SelectSingleNode("//w:abstractNum[@w:abstractNumId='$abs']/w:lvl[@w:ilvl='0']/w:numFmt/@w:val", $nsN)
    $listenArt[$id] = if ($fmt) { $fmt.Value } else { 'bullet' }
  }
}

function Maskiere([string]$t) { $t -replace '([\\`*_~|<>\[\]])', '\$1' }

function Lauftext($knoten) {
  $sb = New-Object System.Text.StringBuilder
  foreach ($k in $knoten.ChildNodes) {
    if ($k.LocalName -eq 'r') {
      $t = (($k.SelectNodes('w:t|w:tab|w:br', $ns) | ForEach-Object { if ($_.LocalName -eq 't') { $_.InnerText } elseif ($_.LocalName -eq 'tab') { ' ' } else { ' ' } }) -join '')
      if ($t.Length -eq 0) { continue }
      $t = Maskiere $t
      $fett = $k.SelectSingleNode('w:rPr/w:b[not(@w:val="0") and not(@w:val="false")]', $ns)
      $kursiv = $k.SelectSingleNode('w:rPr/w:i[not(@w:val="0") and not(@w:val="false")]', $ns)
      if ($t.Trim().Length -gt 0) {
        if ($fett) { $t = "**$t**" }
        if ($kursiv) { $t = "*$t*" }
      }
      [void]$sb.Append($t)
    } elseif ($k.LocalName -eq 'hyperlink') {
      $rid = $k.GetAttribute('id', $R); $text = Lauftext $k
      if ($rid -and $links.ContainsKey($rid)) { [void]$sb.Append("[$text]($($links[$rid]))") } else { [void]$sb.Append($text) }
    } elseif ($k.LocalName -in @('ins', 'smartTag', 'sdt', 'sdtContent', 'fldSimple')) {
      [void]$sb.Append((Lauftext $k))
    }
  }
  # aneinanderstoßende Fett-Läufe verbinden ("**a****b**" -> "**ab**")
  $sb.ToString() -replace '\*\*\*\*', ''
}

$aus = New-Object System.Collections.Generic.List[string]
$zaehler = @{}; $letzteListe = $null
foreach ($knoten in $doc.SelectSingleNode('//w:body', $ns).ChildNodes) {
  if ($knoten.LocalName -eq 'p') {
    $text = (Lauftext $knoten).Trim()
    if ($text.Length -eq 0) { continue }
    $stil = $knoten.SelectSingleNode('w:pPr/w:pStyle/@w:val', $ns)
    $stil = if ($stil) { $stil.Value } else { '' }
    $numId = $knoten.SelectSingleNode('w:pPr/w:numPr/w:numId/@w:val', $ns)
    if ($stil -eq 'ListNumber' -and -not $numId) { $art = 'decimal'; $nid = 'ListNumber' }
    elseif ($stil -eq 'ListBullet' -and -not $numId) { $art = 'bullet'; $nid = 'ListBullet' }
    elseif ($numId) { $nid = $numId.Value; $art = $listenArt[$nid] }
    else { $nid = $null }

    if ($nid) {
      if ($letzteListe -ne $nid) { if ($aus.Count -and $aus[$aus.Count - 1] -ne '') { $aus.Add('') }; $zaehler[$nid] = 0 }
      $zaehler[$nid]++
      $marke = if ($art -eq 'decimal') { "$($zaehler[$nid])." } else { '-' }
      $aus.Add("$marke $text"); $letzteListe = $nid; continue
    }
    if ($letzteListe) { $aus.Add(''); $letzteListe = $null }

    if ($stil -match '^(Title|Heading(\d))$') {
      $stufe = if ($stil -eq 'Title') { 1 } else { [int]$Matches[2] }
      $aus.Add(('#' * [Math]::Min(6, $stufe + $Ebene)) + ' ' + ($text -replace '\\', '')); $aus.Add('')
    } elseif ($stil -eq 'Subtitle') {
      $aus.Add("*$text*"); $aus.Add('')
    } else {
      $aus.Add($text); $aus.Add('')
    }
  } elseif ($knoten.LocalName -eq 'tbl') {
    if ($letzteListe) { $aus.Add(''); $letzteListe = $null }
    $zeilen = $knoten.SelectNodes('w:tr', $ns); $erste = $true
    foreach ($tr in $zeilen) {
      $zellen = $tr.SelectNodes('w:tc', $ns) | ForEach-Object { ((($_.SelectNodes('w:p', $ns) | ForEach-Object { (Lauftext $_).Trim() }) -join ' ') -replace '\|', '\|') }
      $aus.Add('| ' + ($zellen -join ' | ') + ' |')
      if ($erste) { $aus.Add('|' + ((@('---') * @($zellen).Count) -join '|') + '|'); $erste = $false }
    }
    $aus.Add('')
  }
}
# Doppelte Leerzeilen zusammenfassen
$ergebnis = ($aus -join "`n") -replace "\n{3,}", "`n`n"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ergebnis.Trim()
