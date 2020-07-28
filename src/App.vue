<template>
  <div id="app">   
    <div>
    <b-tabs content-class="mt-3" v-model="tabIndex" justified>        
        <b-tab title="Selecting Rocket" active>       
          <div v-if="current.matches('selectRocket')">
            <b-form v-on:submit="onNext"> 
              <b-form-group id="input-group-2" label="Rocket:" label-for="input-2">
                <b-form-input
                  id="input-2"
                  v-model="context.rocket"
                  required
                  placeholder="Enter Rocket" ></b-form-input>
              </b-form-group>      
              <b-button type="button" variant="primary" @click="onNext" >Next</b-button>
              <!-- <b-button type="reset" variant="danger">Reset</b-button> -->
            </b-form>    
          </div>      
        </b-tab> 
      
      <b-tab title="Adding Payload">                 
        <b-form v-on:submit="onNext" v-if="current.matches('addingPayload')">          
          <b-form-group id="input-group-2" label="Payload:" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="context.payload"
              required
              placeholder="Enter Rocket" ></b-form-input>
          </b-form-group>      
          <b-button type="button" variant="primary" @click="onNext">Next</b-button>
          <b-button type="button" variant="danger" @click="onPrev">Prev</b-button>
        </b-form> 
      </b-tab>
      <b-tab title="Launching">
        <div v-if="current.matches('launching')">
           We are lauching <strong>{{ current.context.payload}}</strong> on ("*")
           <strong>{{ current.context.rocket }}</strong>(**) in 
           <strong> {{ current.context.timeToLaunch }}</strong> seconds        
        </div>
      </b-tab>  
      <b-tab title="Payload Deployed">
        <div v-if="current.matches('payloadDeployed')">
          Deployed Playload
        </div>
      </b-tab>       
    </b-tabs>
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

  private toggleMachine = Machine({
    id: 'toggle',
    context: {
      payload: '',
      rocket: '',
      timeToLaunch: 3,
    },
    initial: 'selectRocket',
    states: {
      selectRocket: {
        on: {         
          NEXT: {
            target : 'addingPayload',
            cond: 'hasPayload',           
          },
        },
      },
      addingPayload: {
        on: {
          PREV: 'selectRocket',
          NEXT: 'launching',
        }
      },  
      launching: {
        invoke: {
          src: () => (send) => {
            const tim = window.setInterval(() =>{
              send('TICK');
            }, 1000);
            
            return () => { 
              window.clearInterval(tim);              
            };
          },
        },
        on: {   
          TICK:[
            { 
              target: "payloadDeployed",
              cond: 'isDeployable',            
            },
            {
              actions: ['sendTick']
            },
          ],          
        },
      }, 
      payloadDeployed: {},   
    },   
    },       
    {
      guards: {
        hasPayload: (context) => context.rocket.length > 2, 
        isDeployable: (context) => context.timeToLaunch <= 0,   
      },
      actions: {
        sendTick: assign({
          timeToLaunch: ({ timeToLaunch }) => timeToLaunch - 1,
        }),
      },
    });

  private toggleService = interpret(this.toggleMachine);
  private current = this.toggleMachine.initialState;
  private context = this.toggleMachine.context;
  private tabIndex = 1;

  private created(){ 
    this.toggleService.onTransition(state => {
      this.current = state;
      this.context = state.context;
    }).start();   
  }

  private send(event: any){    
    this.toggleService.send(event);
  }

  private onNext(event: any) {      
    event.preventDefault();
    this.send("NEXT");    
    this.tabIndex++;
    console.log(this.current);  
  }  

  private onPrev(event: any) {   
    event.preventDefault();   
    this.send("PREV");    
    this.tabIndex--;
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
