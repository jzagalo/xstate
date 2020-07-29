import { Machine, interpret, assign } from "xstate";



const cartMachine = Machine({
    id: 'app',
    initial: 'init',
    context: {
        user: undefined,
        error: undefined,        
    },
    states: {
        init: {},
        auth: {
            states: {
                started: {
                    invoke: {
                        id: 'doLogin',
                        src: async (context, event) => { 
                            const { username, password } = event;
                            if(username !== 'hello' && password !== '123'){
                                throw new Error('Wrong Username or Password');
                            }
                            return {username, password};
                        },
                        onDone: {
                            target: 'success',
                            actions: assign({ 
                                user: (context, event) => event.data,
                            }),
                        },
                        onError: {
                            target: 'fail',
                            actions: assign({  
                                error: (context, event) => event.data,
                            }),
                        },
                    },                    
                },
                success: {},
                fail: {},
            },
        },
    }, 
    on: {
        LOGIN: {
            target: 'auth.started'
        }
    }          
});


export default cartMachine;