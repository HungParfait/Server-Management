import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);
let color = '#011589'
export default new Vuetify({
    theme: {
        light: {
            primary: color,
        },
    }
});
