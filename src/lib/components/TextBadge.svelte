<script lang="ts">
    export let label: string;
</script>

<div id="text-badge" class="row">
    <span>{label}</span>
    <span><slot /></span>
</div>

<style lang="scss">
    #text-badge {
        :first-child {
            background-color: rgb(var(--accent-less));
            border-radius: 5px 0 0 5px;
        }

        :last-child {
            background-color: rgb(var(--accent));
            border-radius: 0 5px 5px 0;
        }

        span {
            padding: 2px 10px;
            margin: 0;
        }
    }
</style>
