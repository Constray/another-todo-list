import Vue from 'vue'
import App from './App.vue'
import bootstrap from 'bootstrap';
import BootstrapVue from 'bootstrap-vue'
import store from "@/store";

Vue.use(BootstrapVue);
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    bootstrap,
    store,
    beforeCreate() {
        this.$store.commit('initialiseStore');
    }
}).$mount('#app')
