import { DejureUrl } from "../types/url";
import { LawProviderOptions } from "../types/providerOption";
import { caseRegex, journalRegex, lawChainRegex, lawRegex } from "./regex";
import { getLawUrlByProviderOptions } from "./urlHelper";

function findAndLinkLawReferences(
    fileContent: string,
    lawProviderOptions: LawProviderOptions = {
        firstOption: "dejure",
        secondOption: "lexsoft",
        thirdOption: "lexmea",
        forthOption: "buzer",
        fifthOption: "rewis",
    }
): string {
    if (!lawRegex.test(fileContent)) return fileContent;

    return fileContent.replace(lawRegex, (match, ...args) => {
        const groups = args[args.length - 1];
        let gesetz = groups.gesetz.trim().toLowerCase();
        gesetz = gesetz === "brüssel-ia-vo" ? "eugvvo" : gesetz;

        let lawMatch = groups.p2;
        const replaceNorm = (normGroup: string, norm: string) => {
            const link = getHyperlinkForLawIfExists(normGroup.trim(), gesetz, norm.trim(), lawProviderOptions);
            lawMatch = lawMatch.replace(normGroup, link);
        };

        replaceNorm(groups.normgr_first, groups.norm_first);
        if (groups.norm_last) replaceNorm(groups.normgr_last, groups.norm_last);

        if (groups.p1 !== "§") {
            lawMatch = lawMatch.replace(lawChainRegex, (chainMatch: any, ...chainArgs: (string | any)[]) => {
                const chainGroups = chainArgs[chainArgs.length - 1];
                replaceNorm(chainGroups.normgr, chainGroups.norm);
                return chainMatch;
            });
        }

        return match.replace(groups.p2, lawMatch);
    });
}

function findAndLinkCaseReferences(fileContent: string): string {
    return fileContent.replace(caseRegex, match => {
        const encodedMatch = encodeURIComponent(match);
        return `[${match}](${DejureUrl.CASE}${encodedMatch})`;
    });
}

function findAndLinkJournalReferences(fileContent: string): string {
    return fileContent.replace(journalRegex, match => {
        const encodedMatch = encodeURIComponent(match);
        return `[${match}](${DejureUrl.JOURNAL}${encodedMatch})`;
    });
}

function getHyperlinkForLawIfExists(
    normGroup: string,
    gesetz: string,
    norm: string,
    lawProviderOptions: LawProviderOptions
): string {
    const lawUrl = getLawUrlByProviderOptions(gesetz, norm, lawProviderOptions);
    return lawUrl ? `[${normGroup}](${lawUrl})` : normGroup;
}

export {
    findAndLinkLawReferences,
    findAndLinkCaseReferences,
    findAndLinkJournalReferences,
};
