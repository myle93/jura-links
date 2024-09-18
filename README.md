# Jura-Links
Die effziente Methode, um mit allen jurstischen Nachweisen zu arbeiten.

## Beschreibung

Jura-Links wurde insbesondere für Jurastudierende, aber auch darüber hinaus für alle anderen Personen entwickelt, die sich in ihren Notizen mit Gesetzen und Urteilen befassen.
Dieses Plugin sorgt dafür, dass alle eure angegebenen Normen, Aktenzeichen von Gerichtsurteilen, aber auch Funststellenangaben von Zeitschriften erkannt und mit diversen Gesetzesanbietern verlinkt werden. 
Folgende Gesetzesanbieter werden unterstützt:
- Dejure
- Rewis.io
- Buzer
- LexMea (insbesondere für Studierende geeignet!)
- LexSoft (Quelle für Landesgesetze)

Außerdem bietet Jura-Links ein praktisches Such- und Filterfenster an, um alle dem Plugin bekannten Gesetze zu durchsuchen.

## Wie funktioniert das?
Jura-Links arbeitet mit vorgegebenen Zeichenmustern (sog. *Regular Expressions*), um Gesetzesangaben, Aktenzeichen und Fundstellenangaben erkennen zu können. Wenn es ein Muster erkannt hat, verlinkt es den Text als Markdownlink im Format (Anzeigetext)[Link].

## Project setup

1. Install all dependencies via console:
    ```
    npm i
    ```
2. Compiles and hot-reloads for development:
    ```
    npm run dev
    ```

## Development

    Make sure that all the tests pass before you make a new pull request.
    ```
    npm run test
    ```

## Todo

-   [x] Regex for legal reference recognition.
-   [x] Highlight for legal references.
-   [x] Hyperlink for legal references.
-   [x] RegEx must also recognize german umlauts. - e. g. Art. 1 EuGVÜ
-   [x] Further refinement of the RegEx for laws to also recognize chains of laws like §§ 358 - 360 BGB. The first and last norm should be linked.
-   [x] Hyperlinks for each norm in a chain of paragraphs starting with "§§" or "Art." (Example: §§ 311 II, 280 I, 241 II BGB)
-   [x] The RegEx for journals must also recognize official journal collections such as BGHZ 31, 242. This list is quite comprehensive, so I can provide a predefined list of such journals if it makes it easier.
-   [x] Display text in hyperlinks for chains of paragraphs should be the same as the input, so if "§§ 311 II, [...]" is entered, "311 II" is also the display text.
-   [x] Tests with Vitest
-   [x] Refactor
-   [x] Fix findAndLinkJournalReferences and findAndLinkCaseReferences. All test cases still fail.
