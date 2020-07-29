import Vue from 'vue'
import App from './App.vue'
import store from './store'
import {BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import VueRouter from 'vue-router';
import routes from '@/route';


Vue.config.productionTip = false
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.replace({ path: '/login' });

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
