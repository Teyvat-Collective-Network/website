<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import ConfirmCancel from "$lib/components/ConfirmCancel.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { alerts, token } from "$lib/stores";
    import type { Attribute, Character, Guild } from "$lib/types";
    import { withAudit } from "$lib/utils";
    import { onMount } from "svelte";

    let attributes: Record<string, Record<string, Attribute>>;
    let characters: Character[];
    let guilds: Guild[];

    async function reload(full = false) {
        if (full) {
            attributes = null as any;
            characters = null as any;
        }

        attributes = await api($token, `GET /attributes`);
        characters = await api($token, `GET /characters`);
        guilds = await api($token, `GET /guilds`);
    }

    onMount(() => reload(true));

    let createCharObj = { modal: false, id: "", name: "", short: "", attributes: {} as Record<string, string>, reason: "" };

    function createCharacter() {
        createCharObj = { modal: true, id: "", name: "", short: "", attributes: Object.fromEntries(attributeTypes.map((type) => [type, ""])), reason: "" };
    }

    async function confirmCreateCharacter() {
        const { id, name, short, attributes } = createCharObj;

        try {
            await api($token, `POST /characters/${id}`, {
                name,
                short: short || null,
                attributes: Object.fromEntries(Object.entries(attributes).filter(([, x]) => x)),
            });

            createCharObj.modal = false;
        } catch (error) {
            alert(error);
        }

        await reload();
    }

    let editCharObj = { modal: false, old: "", id: "", name: "", short: "", attributes: {} as Record<string, string>, reason: "" };

    function editCharacter(id: string) {
        const char = characters.find((x) => x.id === id);
        if (!char) return alert("That character could not be found. Try reloading the page.");

        editCharObj = {
            modal: true,
            old: id,
            id,
            name: char.name,
            short: char.short || "",
            attributes: {
                ...Object.fromEntries(attributeTypes.map((type) => [type, ""])),
                ...char.attributes,
            },
            reason: "",
        };
    }

    async function confirmEditCharacter() {
        const { old, id, name, short, attributes, reason } = editCharObj;

        try {
            await api(
                $token,
                `PATCH /characters/${old}`,
                {
                    id,
                    name,
                    short: short || null,
                    attributes: Object.fromEntries(Object.entries(attributes).map(([x, y]) => [x, y || null])),
                },
                reason,
            );

            editCharObj.modal = false;
        } catch (error) {
            alert(error);
        }

        await reload();
    }

    async function deleteCharacter(id: string) {
        await withAudit(async (reason) => await api($token, `DELETE /characters/${id}`, undefined, reason).catch(alert), false);
        await reload();
    }

    function noDelete() {
        alerts.nodelete.update((x) => x + 1);
        setTimeout(() => alerts.nodelete.update((x) => x - 1), 1500);
    }

    let createAttrObj = { modal: false, type: "", id: "", name: "", emoji: "", reason: "" };

    function createAttribute() {
        createAttrObj = { modal: true, type: "", id: "", name: "", emoji: "", reason: "" };
    }

    async function confirmCreateAttribute() {
        const { type, id, name, emoji, reason } = createAttrObj;

        try {
            await api($token, `POST /attributes/${type}/${id}`, { name, emoji }, reason);
            createAttrObj.modal = false;
        } catch (error) {
            alert(error);
        }

        await reload();
    }

    let editAttrObj = { modal: false, type: "", old: "", id: "", name: "", emoji: "", reason: "" };

    async function editAttribute(type: string, id: string) {
        editAttrObj = { modal: true, type, old: id, id, ...attributes[type][id], reason: "" };
    }

    async function confirmEditAttribute() {
        const { type, old, id, name, emoji, reason } = editAttrObj;

        if (!reason && id === old && name === attributes[type][id].name && emoji === attributes[type][id].emoji) return (editAttrObj.modal = false);

        try {
            await api($token, `PATCH /attributes/${type}/${old}`, { id: id === old ? undefined : id, name, emoji }, reason);
            editAttrObj.modal = false;
        } catch (error) {
            alert(error);
        }

        await reload();
    }

    async function deleteAttribute(type: string, id: string) {
        await withAudit(async (reason) => await api($token, `DELETE /attributes/${type}/${id}`, undefined, reason).catch(alert), false);
        await reload();
    }

    $: attributeTypes = Object.keys(attributes ?? {}).sort();
</script>

<b><A to="/admin/api-manager">Return to main page</A></b>
<br /><br />
<hr />
<h3>Characters</h3>
<Loading done={characters}>
    <div class="hscroll panel">
        <table>
            <tr>
                <th />
                <th>Icon</th>
                <th>ID</th>
                <th>Name</th>
                <th>Short Name</th>
                {#each attributeTypes as type}
                    <th><code>{type}</code></th>
                {/each}
            </tr>
            {#each characters.sort((x, y) => x.id.localeCompare(y.id)) as character}
                <tr>
                    <td>
                        <div class="row gap-1">
                            <A class="row" on:click={() => editCharacter(character.id)}><Icon icon="edit" /></A>
                            {#if guilds?.some((guild) => guild.mascot === character.id)}
                                <A class="row text-3" on:click={noDelete}><Icon icon="delete" /></A>
                            {:else}
                                <A class="row red-text" on:click={() => deleteCharacter(character.id)}><Icon icon="delete" /></A>
                            {/if}
                        </div>
                    </td>
                    <td><span class="row"><Image src="/files/{character.id}.png" alt="{character.name}'s Icon" style="height: 1.5em" /></span></td>
                    <td>
                        <code>{character.id}</code>
                    </td>
                    <td>
                        {character.name}
                    </td>
                    <td>
                        {#if character.short}
                            {character.short}
                        {:else}
                            <span class="text-2">(none)</span>
                        {/if}
                    </td>
                    {#each attributeTypes as type}
                        <td>
                            {#if character.attributes[type]}
                                {attributes[type][character.attributes[type]].name} &mdash; <code>{character.attributes[type]}</code>
                            {:else}
                                <span class="text-2">(none)</span>
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </table>
    </div>
</Loading>
<br />
<button class="row" on:click={createCharacter}><Icon icon="add" /> Create Character</button>
<br />
<h3 class="short">Character Attributes</h3>
<div id="attributes">
    <Loading done={attributes}>
        {#each attributeTypes as type}
            <h5 style="grid-column: 1 / 5"><code>{type}</code> Attributes</h5>
            {#each Object.entries(attributes[type]).sort(([x], [y]) => x.localeCompare(y)) as [id, attribute]}
                <span><b>ID:</b> <code>{id}</code></span>
                <span><b>Name:</b> {attribute.name}</span>
                <span><b>Emoji:</b> <code>{attribute.emoji}</code></span>
                <div class="row gap-1">
                    <A class="row" on:click={() => editAttribute(type, id)}><Icon icon="edit" /></A>
                    <A class="row red-text" on:click={() => deleteAttribute(type, id)}><Icon icon="delete" /></A>
                </div>
            {/each}
        {/each}
    </Loading>
</div>
<br />
<button class="row" on:click={createAttribute}><Icon icon="add" /> Create Attribute</button>

{#each [createCharObj, editCharObj] as obj, index}
    <Modal bind:open={obj.modal} confirmClose={!!(obj.id || obj.name || obj.short || Object.values(obj.attributes).some((x) => x) || obj.reason)}>
        <h3 class="short">{index ? "Edit" : "Create"} Character</h3>
        <div class="inputs">
            <b>ID:</b>
            <input type="text" class="bg-1 mono" bind:value={obj.id} />
            <b>Name:</b>
            <input type="text" class="bg-1" bind:value={obj.name} />
            <b>Short Name:</b>
            <input type="text" class="bg-1" bind:value={obj.short} />
            {#each attributeTypes as type}
                <b><code>{type}</code>:</b>
                <select class="bg-1" bind:value={obj.attributes[type]}>
                    <option value="">(none)</option>
                    {#each Object.entries(attributes[type]) as [id, { name }]}
                        <option value={id}>{name}</option>
                    {/each}
                </select>
            {/each}
            <b>Audit Log Reason:</b>
            <input type="text" class="bg-1" placeholder="Optional." bind:value={obj.reason} />
        </div>
        <br />
        <ConfirmCancel save={obj.modal} bind:cancel={obj.modal} valid={obj.id && obj.name} confirm={index ? confirmEditCharacter : confirmCreateCharacter} />
    </Modal>
{/each}

{#each [createAttrObj, editAttrObj] as obj, index}
    <Modal bind:open={obj.modal} confirmClose={!!(obj.type || obj.id || obj.name || obj.emoji || obj.reason)}>
        <h3 class="short">{index ? "Edit" : "Create"} Attribute</h3>
        <div class="inputs">
            <b>Type:</b>
            <input type="text" class="{index ? 'bg-2 text-2' : 'bg-1'} mono" bind:value={obj.type} disabled={!!index} />
            <b>ID:</b>
            <input type="text" class="bg-1 mono" bind:value={obj.id} />
            <b>Name:</b>
            <input type="text" class="bg-1" bind:value={obj.name} />
            <b>Emoji:</b>
            <input type="text" class="bg-1 mono" placeholder="Enter the full Discord emoji string." bind:value={obj.emoji} />
            <b>Audit Log Reason:</b>
            <input type="text" class="bg-1" placeholder="Optional." bind:value={obj.reason} />
        </div>
        <br />
        <ConfirmCancel
            save={obj.modal}
            bind:cancel={obj.modal}
            valid={obj.type && obj.id && obj.name && obj.emoji}
            confirm={index ? confirmEditAttribute : confirmCreateAttribute}
        />
    </Modal>
{/each}

<style lang="scss">
    #attributes {
        display: grid;
        grid-template-columns: auto auto auto 1fr;
        gap: 10px 25px;
    }

    .inputs {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px 25px;
    }
</style>
