<template>
  <div id="app"> 
      <!-- <Login /> -->
      <router-view default="{name: 'login'}"></router-view> 
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import Login from '@/components/Login.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
 
@Component({
  components: {
    Login,
  }
})
export default class App extends Vue {
  
}

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
