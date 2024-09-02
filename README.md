# Obsidian Law Article HighLighter

## Description

This project is an Obsidian plugin called "Obsidian Law Article Highlighter". It provides functionality to recognize law articles using regular expressions, highlight them, create hyperlinks to law articles, and preview them with iframes. The plugin aims to enhance the experience of working with law-related content in Obsidian.

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
-   [ ] Hyperlinks for each norm in a chain of paragraphs starting with "§§" or "Artt." (Example: §§ 311 II, 280 I, 241 II BGB)
-   [ ] The RegEx for journals must also recognize official journal collections such as BGHZ 31, 242. This list is quite comprehensive, so I can provide a predefined list of such journals if it makes it easier.
-   [x] Display text in hyperlinks for chains of paragraphs should be the same as the input, so if "§§ 311 II, [...]" is entered, "311 II" is also the display text.
-   [x] Tests with Vitest
-   [x] Refactor
-   [ ] Fix findAndLinkJournalReferences and findAndLinkCaseReferences. All test cases still fail.
