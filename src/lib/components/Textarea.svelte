<script lang="ts">
    export let value: string;
    export let rows: number = 4;

    function handle(e: KeyboardEvent) {
        const { target } = e as any;
        const { selectionStart: start, selectionEnd: end } = target as Record<any, number>;

        if (e.key === "Tab") {
            e.preventDefault();

            if (start === end)
                if (document.execCommand) document.execCommand("insertText", false, "    ");
                else target.setRangeText("    ", start, end, "end");
            else {
                let lineStart = start;
                while (lineStart > 0 && value[lineStart] !== "\n") lineStart--;
                lineStart++;

                let lineEnd = end;
                while (lineEnd < value.length - 1 && value[lineEnd] !== "\n") lineEnd++;

                if (lineStart >= lineEnd) return;

                const lines = value.slice(lineStart, lineEnd).split("\n");
                const replacement = lines.map((x) => (e.shiftKey ? x.replace(/^ {0,4}/, "") : `    ${x}`)).join("\n");

                if (document.execCommand) {
                    target.selectionStart = lineStart;
                    target.selectionEnd = lineEnd;
                    document.execCommand("insertText", false, replacement);
                } else {
                    value = value.slice(0, lineStart) + replacement + value.slice(lineEnd);
                }

                setTimeout(() => {
                    target.selectionStart = e.shiftKey ? start - lines[0].match(/^ {0,4}/)![0].length : start + 4;
                    target.selectionEnd = e.shiftKey ? end - lines.map((x) => x.match(/^ {0,4}/)![0].length).reduce((x, y) => x + y) : end + lines.length * 4;
                });
            }
        } else if (e.key === "Backspace") {
            if (start !== end) return;

            let lineStart = start - 1;
            while (lineStart > 0 && value[lineStart] !== "\n") lineStart--;
            lineStart++;

            const string = value.slice(lineStart, start);
            if (!string.match(/^ +$/)) return;

            let count = string.length % 4 || 4;

            if (document.execCommand) {
                target.selectionStart = start - count;
                target.selectionEnd = start;
                document.execCommand("insertText", false, "-");
            } else {
                value = value.slice(0, start - count) + value.slice(start);
            }

            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start - count;
            });
        }
    }
</script>

<textarea {...$$restProps} bind:value {rows} on:keydown={handle} on:input />

<style lang="scss">
    textarea {
        resize: vertical;
    }
</style>
