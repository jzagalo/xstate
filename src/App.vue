<template>
  <div id="app"> 
     <div v-if="current.matches('closed')" >
       <p> Closed <button @click="() => send('OPEN')">OPEN </button></p>
     </div>
     <div v-if="current.matches('opening')" >
       <p> Opening </p>
     </div>
     <div v-if="current.matches('open')" >
      <p> Opened <button @click="() => send('CLOSE')">CLOSE</button> </p>
     </div>
      <div v-if="current.matches('closing')" >
       <p> closing </p>
     </div>
     <div v-if="current.matches('error')" >
       <p> Error <button @click="() => send('RESET')">RESET</button> </p>
     </div>
  </div>
</template>

<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import { Machine, interpret, assign } from "xstate";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

 
@Component
export default class App extends Vue {
  private openCartAnimation = () => new Promise((resolve, reject) => { setTimeout(() => resolve(true), 3000)});
  private closeCartAnimation = () => new Promise((resolve, reject) => { setTimeout(() => resolve(false), 3000)});  

  private cartMachine = Machine({
    id: 'cartComponent',
    initial: 'closed',
    states: {
      closed: {
        on: {
          OPEN: 'opening',
        },
      },
      opening: {
        invoke: {
          src: this.openCartAnimation,
          onDone: 'open',
          onError: 'error',
        },      
      },
      open: {
        on: {
           CLOSE: 'closing',
        },         
      },
      closing: {
        invoke: {
          src: this.closeCartAnimation,
          onDone: 'closed',
          onError: 'error',          
        },     
      },
      error: {
        on: {
          RESET: 'closed'
        },
      },
    },           
  });

  private cartService = interpret(this.cartMachine);
  private current = this.cartMachine.initialState;
  private context = this.cartMachine.context;
  private tabIndex = 1;

  private created(){ 
    this.cartService.onTransition(state => {
      this.current = state;
      this.context = state.context;
    }).start();   
  }

  private send(event: any){    
    this.cartService.send(event);
  }

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
