import { Machine, assign } from "xstate";
import { auth } from '@/state/auth.js';

const storiesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const getStoryDataUrl = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;


const fetchStories = async () => {
    const storyIds = await fetch(storiesUrl).then(r => r.json());
    const topTenStories = await storyIds.slice(0,10).map((id: number) => getStoryDataUrl(id))
    .map((url: string) => fetch(url).then(r => r.json()));
    console.log({topTenStories});
    return topTenStories;
}



const cartMachine = Machine({
    id: 'app',
    initial: 'init',
    context: {
        user: undefined,
        error: undefined,
        stories: [],
    },
    states: {
        init: {},
        auth,
        list:{
            initial: 'loading',
            states: {
                loading: {
                    invoke: {
                        id: 'fetchStories',
                        src: fetchStories,
                        onDone: {
                            target: 'success',
                            actions: assign({
                                stories: (context, event) => event.data,
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
        },
        LOAD_STORIES: {
            target: 'list.loading',
        },
    },
});


export default cartMachine;