<template>
    <v-footer class="grey darken-3"
              inset dark app>
        <v-spacer></v-spacer>
        <v-btn class="grey darken-3 mr-5 elevation-0 hidden-xs-only dark-button"
               href="https://www.felipeflor.com"
               target="_blank"
               round>Felipe Flor
        </v-btn>
        <v-btn v-for="link in links"
               :aria-label="link.text"
               :key="link.icon"
               :href="link.destination"
               target="_blank"
               class="white--text dark-button"
               icon>
            <v-icon size="24px">{{ link.icon }}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
    </v-footer>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {ALL_LINKS, Link, LinkType} from '../storage/links';

    @Component
    export default class AppFooter extends Vue {
        protected get links(): Link[] {
            return ALL_LINKS;
        }
    }
</script>
