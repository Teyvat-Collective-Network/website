<div id="outer">
    <div id="inner">
        <slot />
    </div>
</div>

<style lang="scss">
    #outer {
        overflow-x: scroll;
    }

    #inner {
        width: max-content;
    }
</style>
