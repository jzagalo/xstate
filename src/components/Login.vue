<template>
  <div class="">
    <h1> Login </h1>
    <h3 style="color:red" v-if="current.matches('auth.fail')">
       {{ context.error }}
    </h3>
    <div>
        <input type="text" placeholder="username" v-model="formData.username" />
    </div>
    <div>
        <input type="password" placeholder="password" v-model="formData.password" />
    </div>
    <div>
        <button v-on:click="doLogin"> Login </button>
    </div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import { interpret } from 'xstate';
import cartMachine from '../state';

@Component
export default class Login extends Vue {

  private formData = { username: '', password: '' };
  private loginService = interpret(cartMachine);
  private current = cartMachine.initialState;
  private context = cartMachine.context;

  private created() {
    this.loginService.onTransition(state => {
      this.current = state;
      this.context = state.context;
    }).start();
  }

  private doLogin() {
    const username = this.formData.username;
    const password = this.formData.password;
    this.loginService.send('LOGIN', {username, password, router: this.$router });
  }

}
</script>


<style scoped lang="scss">

</style>
