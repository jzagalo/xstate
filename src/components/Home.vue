<template>
  <div>
      <h1> HOME </h1>
      <h2 v-if="current.matches('list.loading')">
        Loading ...
      </h2>
       <div style="{color: 'red'}" v-if="current.matches('list.fail')">
          Error Loading Stories {{context.error.toString() }}
      </div>
       <div v-if="current.matches('list.success')">
          <p v-for="story in context.stories"  :key="story.id">
            <a  :href="story.url" >
              {{ story.title}}
            </a>
          </p>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import cartMachine from '@/state';
import { interpret } from 'xstate';

@Component
export default class Home extends Vue {

  private loadService = interpret(cartMachine);
  private current = cartMachine.initialState;
  private context = cartMachine.context;

  private created(){
    this.loadService.onTransition(state => {
       this.current = state;
       this.context = state.context;
    })
    .start();
    this.loadService.send('LOAD_STORIES');
  }

}
</script>

