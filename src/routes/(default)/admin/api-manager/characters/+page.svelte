<script lang="ts">
    import api from "$lib/api";
    import A from "$lib/components/A.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Image from "$lib/components/Image.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import { token } from "$lib/stores";
    import type { Attribute, Character } from "$lib/types";
    import { onMount } from "svelte";

    let attributes: Record<string, Record<string, Attribute>>;
    let characters: Character[];

    async function reload(full = false) {
        if (full) {
            attributes = null as any;
            characters = null as any;
        }

        attributes = await api($token, `GET /attributes`);
        characters = await api($token, `GET /characters`);
    }

    onMount(() => reload(true));

    async function editCharacter(id: string, key: string, string: string) {
        const value = prompt(string);
        if (!value) return;

        await api($token, `PATCH /characters/${id}`, { [key]: value }).catch(alert);
        await reload();
    }

    async function removeShortName(id: string) {
        await api($token, `PATCH /characters/${id}`, { short: null }).catch(alert);
        await reload();
    }

    async function editCharacterAttribute(id: string, type: string, string: string) {
        const value = prompt(string);
        if (!value) return;

        await api($token, `PATCH /characters/${id}`, { attributes: { [type]: value } }).catch(alert);
        await reload();
    }

    async function deleteCharacterAttribute(id: string, type: string) {
        await api($token, `PATCH /characters/${id}`, { attributes: { [type]: null } }).catch(alert);
        await reload();
    }

    async function createAttribute() {
        const type = prompt("Enter the type for the attribute.");
        if (!type) return;

        const id = prompt("Enter the ID for the attribute.");
        if (!id) return;

        const name = prompt("Enter the name for the attribute.");
        if (!name) return;

        const emoji = prompt("Enter the emoji (full Discord-format string) for the attribute.");
        if (!emoji) return;

        await api($token, `POST /attributes/${type}/${id}`, { name, emoji }).catch(alert);
        await reload();
    }

    async function deleteAttribute(type: string, id: string) {
        if (!confirm(`Are you sure you want to delete the ${type} attribute with ID ${id}? This action cannot be undone.`)) return;

        await api($token, `DELETE /attributes/${type}/${id}`).catch(alert);
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
                    <td><span class="row"><Image src="/files/{character.id}.png" alt="{character.name}'s Icon" style="height: 1.5em" /></span></td>
                    <td>
                        <div class="row gap-1">
                            <A class="row" on:click={() => editCharacter(character.id, "id", `Enter ${character.name}'s new ID.`)}><Icon icon="edit" /></A>
                            <code>{character.id}</code>
                        </div>
                    </td>
                    <td>
                        <div class="row gap-1">
                            <A class="row" on:click={() => editCharacter(character.id, "name", `Enter ${character.name}'s new name.`)}><Icon icon="edit" /></A>
                            {character.name}
                        </div>
                    </td>
                    <td>
                        <div class="row gap-1">
                            <A class="row" on:click={() => editCharacter(character.id, "short", `Enter ${character.name}'s new short-form name.`)}>
                                <Icon icon="edit" />
                            </A>
                            {#if character.short}
                                <A class="row red-text" on:click={() => removeShortName(character.id)}><Icon icon="delete" /></A>
                                {character.short}
                            {:else}
                                <span class="text-2">(none)</span>
                            {/if}
                        </div>
                    </td>
                    {#each attributeTypes as type}
                        <td>
                            <div class="row gap-1">
                                <A class="row" on:click={() => editCharacterAttribute(character.id, type, `Enter ${character.name}'s new ${type}.'`)}>
                                    <Icon icon="edit" />
                                </A>
                                {#if character.attributes[type]}
                                    <A class="row red-text" on:click={() => deleteCharacterAttribute(character.id, type)}><Icon icon="delete" /></A>
                                    {character.attributes[type]}
                                {:else}
                                    <span class="text-2">(none)</span>
                                {/if}
                            </div>
                        </td>
                    {/each}
                </tr>
            {/each}
        </table>
    </div>
</Loading>
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
                <div class="row">
                    <A class="row red-text" on:click={() => deleteAttribute(type, id)}><Icon icon="delete" /></A>
                </div>
            {/each}
        {/each}
    </Loading>
</div>
<br />
<button class="row" on:click={createAttribute}><Icon icon="add" /> Create Attribute</button>

<style lang="scss">
    #attributes {
        display: grid;
        grid-template-columns: auto auto auto 1fr;
        gap: 10px 25px;
    }
</style>
