import { marked } from "marked";

const overrides = {
    u: "jsdihfiueathmocieuryhtmcoidmhgcoidsfhngvoergiouhcwiorynvfoiwerutyniouerwtynoiweng",
    mentions: {
        u: "dfsghjdfghslicuhngiulnhcsgrnilhusgcfhnisgcfhnilnhlicreahniulfscgdnhiulscghnluiscgf",
        r: "resutyhgsioergunhigfscudhnouisgcfdhnouixafhonuimxafhmouixaghnugeaxronhuegrohmuigrecoh",
        c: "asdiunyccinguoashnuilacgfhnuliafxdnhuilgcasfdhnuilcgafsdhnuilagchniluagcfshniulagcs",
        h: "hsgfdcmohgfcsuidohumcigseoiscugrdohiunmscgdohuimsgcdfoimhugscdfoihumsgcdfoihmugscdfiomhu",
        e: "fxaredoiugemcroiutgcvioreuncgiuanrepgociunerpoiucngpaoiruncpgoaiunrdpcogindpcoiunpora",
    },
};

marked.use({
    breaks: true,
    tokenizer: {
        link(src) {
            {
                const match = src.match(/^__(.+?)__/);

                if (match) {
                    const trimmed = match[1].trim();

                    return {
                        type: "link",
                        href: overrides.u,
                        raw: match[0],
                        text: trimmed,
                        tokens: [{ type: "text", raw: marked.parse(trimmed), text: marked.parse(trimmed).slice(3, -5) }],
                    };
                }
            }

            {
                const match = src.match(/^<(@[!&]?|#)\d+>/);

                if (match)
                    return {
                        type: "link",
                        href: overrides.mentions[match[0].startsWith("<@&") ? "r" : match[0].startsWith("<@") ? "u" : "c"],
                        raw: match[0],
                        text: "",
                        tokens: [],
                    };
            }

            {
                const match = src.match(/^@(everyone|here)/);

                if (match)
                    return {
                        type: "link",
                        href: overrides.mentions[match[0][1] as "h" | "e"],
                        raw: match[0],
                        text: "",
                        tokens: [],
                    };
            }

            return false;
        },
    },
    renderer: {
        link(href, title, text) {
            if (href === overrides.u) return `<span class="u">${text}</span>`;
            if (href === overrides.mentions.u)
                return `<span class="mention with-icon"><span class="material-symbols-outlined">alternate_email</span> user</span>`;
            if (href === overrides.mentions.r)
                return `<span class="mention with-icon"><span class="material-symbols-outlined">alternate_email</span> role</span>`;
            if (href === overrides.mentions.c) return `<span class="mention with-icon"><span class="material-symbols-outlined">tag</span> channel</span>`;
            if (href === overrides.mentions.h)
                return `<span class="mention with-icon"><span class="material-symbols-outlined">alternate_email</span> here</span>`;
            if (href === overrides.mentions.e)
                return `<span class="mention with-icon"><span class="material-symbols-outlined">alternate_email</span> everyone</span>`;

            return `<a href=${JSON.stringify(href)} ${title ? `title=${JSON.stringify(`${title}&#10;&#10;(${href})`)}` : ""} target="_blank">${text}</a>`;
        },
    },
});

export default marked;
