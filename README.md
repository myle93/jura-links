# Obsidian Law Article HighLighter
## Description

This project is an Obsidian plugin called "Obsidian Law Article Highlighter". It provides functionality to recognize law articles using regular expressions, highlight them, create hyperlinks to law articles, and preview them with iframes. The plugin aims to enhance the experience of working with law-related content in Obsidian.
## Todo

- [ ] Update Readme
- [x] Regex for law article recognition
- [x] Highlight for law articles
- [x] Hyperlink for law articles
- [x] RegEx muss auch Umlaute erkennen.
  		- so gibt es zum Beispiel die EuGVÜ als EU-Verordnung. Hier erkennt der Code bisher nur bis zu "EuGV". Einen Code zur Umwandlung der Umlaute gibt es bereits, aber die RegEx muss sie auch erkennen.
- [ ] Weitere Verfeinerung des RegEx für Gesetze, um auch Gesetzesbereiche wie §§ 358 - 360 BGB zu erkennen. Dabei soll die erste und die letzte Norm verlinkt werden.
- [ ] Hyperlinks für jede Norm in einer Paragraphenkette die mit "§§" oder "Artt." beginnt (Beispiel: §§ 311 II, 280 I, 241 II BGB)
- [ ] RegEx der Zeitschriften muss auch amtliche Zeitschriftensammlungen wie BGHZ 31, 242 erkennen. Diese Liste ist recht abschließend, sodass ich da auch eine vordefinierte Liste an solchen Zeitschriften geben kann, falls es das leichter macht.
- [ ] Preview of law articles with small iframe
- [ ] Generalize hyperlinks
- [ ] Anzeigetext in den Hyperlinks bei Paragraphenketten gleicht der Eingabe, also §§ 311 II, [...] BGB wird eingegeben und 311 II ist auch Anzeigetext.
- [ ] Tests
- [ ] Refactor