import Alert from './src/index.vue';
import Mount from '../../src';

export default {
    info(options) {
        const alert = new Mount(Alert).mount();
        alert.add(options);
    }
}