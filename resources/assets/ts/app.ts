import './bootstrap'
import Vue from 'vue'
import Vuetify from 'vuetify'
import ExampleComponent from './components/ExampleComponent.vue'

Vue.use(Vuetify);

new Vue({
    el: '#app',
    render: h => h(ExampleComponent)
});
