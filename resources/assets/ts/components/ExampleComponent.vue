<template>
    <div>
        <h1>Vue Typescript is Working!</h1>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'

    @Component
    export default class ExampleComponent extends Vue {
        mounted(): void {
            console.log('Component mounted.')
        }
    }
</script>
