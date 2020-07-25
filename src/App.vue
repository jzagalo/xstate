<template>
  <div id="app">
    <button @click="send('TOGGLE')">
        {{ current.matches("inactive") ? "Off" : "On" }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Machine, interpret } from "xstate";


@Component
export default class App extends Vue {

  private toggleMachine = Machine({
    id: 'toggle',
    context: {},
    initial: 'inactive',
    states: {
      inactive: {
        on: {
          TOGGLE: 'active'
        },
      },
      active: {
        on: {
          TOGGLE: 'inactive'
        }
      },   
    },
  });

  private toggleService = interpret(this.toggleMachine);
  private current = this.toggleMachine.initialState;
  private context = this.toggleMachine.context;

  private created(){
    this.toggleService.onTransition(state => {
      this.current  = state;
      this.context = state.context;
    }). 
    start();   
  }

  private send(event: any){    
    this.toggleService.send(event);
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
