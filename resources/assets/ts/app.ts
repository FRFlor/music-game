import './bootstrap'
import Vue from 'vue'
import Vuetify from 'vuetify'
// @ts-ignore
import VueYouTube from 'vue-youtube'

import AppComponent from './components/AppComponent.vue'

Vue.use(Vuetify);
Vue.use(VueYouTube);

new Vue({
    el: '#app',
    render: h => h(AppComponent)
});
