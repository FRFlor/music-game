<template>
    <div>
        <h1>Vue Typescript is Working!</h1>
        <v-btn>Vuetify is Working!</v-btn>
        <v-btn icon><v-icon>fab fa-vuejs</v-icon></v-btn>
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
