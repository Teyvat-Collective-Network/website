<script lang="ts">
    import { page } from "$app/stores";
    import Callout from "$lib/components/Callout.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Modal from "$lib/components/Modal.svelte";

    const loaded: Record<string, boolean> = {};
    const data: Record<string, any> = {};
    const anticache: Record<string, string> = {};

    let open: string = "";

    let files: string[] = $page.data.files;

    function ext(file: string) {
        return file.toLowerCase().match(/\.([^\.]+)$/)![1];
    }

    async function load(file: string) {
        open = file;
        if (loaded[file]) return;

        let req: Response;

        try {
            switch (ext(file)) {
                case "png":
                    anticache[file] = new Array(24)
                        .fill(0)
                        .map(() => "0123456789ABCDEF"[Math.floor(Math.random() * 16)])
                        .join("");
                    break;
                case "txt":
                    req = await fetch(`/files/${file}`);
                    if (!req.ok) throw 0;
                    data[file] = await req.text();
                    break;
                case "json":
                    req = await fetch(`/files/${file}`);
                    if (!req.ok) throw 0;
                    data[file] = await req.json();
                    break;
            }
        } catch {
            data[file] = 0;
        }

        loaded[file] = true;
    }

    async function edit(file?: string | null) {
        if (!file) return;

        const url = prompt(`Input a URL. The contents of '${file}' will be set by fetching this URL.`);
        if (!url) return;

        const req = await fetch(`/admin/upload?${new URLSearchParams({ file, url })}`, { method: "POST" });

        if (req.ok) {
            if (!files.includes(file)) files = [...files, file].sort();
            loaded[file] = false;
            delete data[file];
            alert("OK");
        } else alert(`Error: ${req.status}`);
    }

    async function del(file: string) {
        if (!confirm(`Are you sure you want to delete ${file}? This action cannot be undone!`)) return;

        const req = await fetch(`/admin/upload?${new URLSearchParams({ file })}`, { method: "DELETE" });

        if (req.ok) {
            delete loaded[file];
            delete data[file];
            files = files.filter((x: string) => x !== file);
        } else alert(`Error: ${req.status}`);
    }
</script>

<div class="container">
    <h1>Files</h1>
    <div class="col no-center gap-1">
        {#each files.sort() as file}
            <div class="row gap-1">
                <button class="tp blue-text" on:click={() => load(file)}><Icon icon="visibility" /></button>
                <button class="tp green-text" on:click={() => edit(file)}><Icon icon="edit" /></button>
                <button class="tp red-text" on:click={() => del(file)}><Icon icon="delete" /></button>
                <code>{file}</code>
            </div>

            {#if loaded[file]}
                {@const ex = ext(file)}
                <Modal open={open === file} on:close={() => (open = "")}>
                    <Loading done={loaded[file]}>
                        {#if data[file] === 0}
                            <Callout style="red">
                                <p>An error occurred loading this file's content!</p>
                            </Callout>
                        {:else if ["png"].includes(ex)}
                            <div class="col">
                                <img src="/files/{file}?{anticache[file]}" alt="Dynamic Content" />
                            </div>
                        {:else if ["txt"].includes(ex)}
                            <pre>{data[file]}</pre>
                        {:else if ["json"].includes(ex)}
                            <pre>{JSON.stringify(data[file], undefined, 4)}</pre>
                        {/if}
                    </Loading>
                </Modal>
            {/if}
        {/each}
        <div>
            <button class="green-button" on:click={() => edit(prompt("Enter the filename of the file to create."))}><Icon icon="add" /></button>
        </div>
    </div>
</div>
