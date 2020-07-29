import { assign } from 'xstate';


 export const auth = {
       states: {
            started: {
                invoke: {
                    id: 'doLogin',
                    src: async (context, event) => { 
                        const { username, password, router } = event;                        
                        if(username !== 'hello' && password !== '123'){
                            throw new Error('Wrong Username or Password');
                        } else {                                
                            router.push("/");
                        }                           
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
};