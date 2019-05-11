import Vue from 'vue';
import VueYoutube from 'vue-youtube';

Vue.use(VueYoutube);
import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
