import { Machine, interpret, assign } from "xstate";
import { auth } from '@/state/auth.js';



const cartMachine = Machine({
    id: 'app',
    initial: 'init',
    context: {
        user: undefined,
        error: undefined,        
    },
    states: {
        init: {},
        auth,
    },    
    on:{
        LOGIN: {
            target: 'auth.started'
        }
    },
           
});


export default cartMachine;