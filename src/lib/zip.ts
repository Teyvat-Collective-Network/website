// Apply LZW-compression to a string and return base64 compressed string.
export function zip(s: string) {
    try {
        const dict: Record<string, number> = {};
        const data = (s + "").split("");
        const out: number[] = [];

        let currChar: string;
        let phrase = data[0];
        let code = 256;

        for (let i = 1; i < data.length; i++) {
            currChar = data[i];

            if (dict[phrase + currChar] !== undefined) {
                phrase += currChar;
            } else {
                out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[phrase + currChar] = code;

                code++;
                phrase = currChar;
            }
        }

        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));

        return utoa(out.map((x) => String.fromCharCode(x)).join(""));
    } catch (e) {
        console.error("Failed to zip string, returning empty string:", e);
        return "";
    }
}

// Decompress an LZW-encoded base64 string
export function unzip(zs: string) {
    try {
        const s = atou(zs);
        const dict: Record<number, string> = {};
        const data = (s + "").split("");

        let currChar = data[0];
        let oldPhrase = currChar;
        let out = [currChar];
        let code = 256;
        let phrase: string;

        for (let i = 1; i < data.length; i++) {
            const currCode = data[i].charCodeAt(0);
            if (currCode < 256) {
                phrase = data[i];
            } else {
                phrase = dict[currCode] ? dict[currCode] : oldPhrase + currChar;
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dict[code] = oldPhrase + currChar;
            code++;
            oldPhrase = phrase;
        }

        return out.join("");
    } catch (e) {
        console.error("Failed to unzip string, returning empty string", e);
        return "";
    }
}

// ucs-2 string to base64 encoded ascii
function utoa(s: string) {
    return btoa(unescape(encodeURIComponent(s)));
}
// base64 encoded ascii to ucs-2 string
function atou(s: string) {
    return decodeURIComponent(escape(atob(s)));
}
