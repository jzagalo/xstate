import { Machine } from 'xstate';

export const createStoryMachine = story =>
    Machine({
        id: 'story',
        initial: 'init',
        context: {
            story,
            error: undefined,
        },
        states: {
            init: {},
        },
        on: {
            
        }
    });