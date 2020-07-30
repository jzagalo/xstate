import { Machine, assign, spawn } from "xstate";
import { auth } from '@/state/auth.js';
import { createStoryMachine } from '@/state/story.js';

const storiesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
const getStoryDataUrl = (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

const fetchStories = async () => {
    const storyIds = await fetch(storiesUrl).then(r => r.json());
    return await Promise.all(storyIds.slice(0,10).map((id: number) => getStoryDataUrl(id))
    .map((url: string) => fetch(url).then(r => r.json())));
}

const cartMachine = Machine({
    id: 'app',
    initial: 'init',
    context: {
        user: undefined,
        error: undefined,
        stories: [],
        selectedStory: undefined,
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
                selected: {},
            },
        },
    },
    on: {
        LOGIN: {
            target: 'auth.started',
        },
        LOAD_STORIES: {
            target: 'list.loading',
        },
        SELECT_STORY: {
            target: 'list.selected',
            actions: assign((context, event) => {
                const newStoryMachine = spawn(createStoryMachine(event));
                return { selectedStory: newStoryMachine }
            }),
        },
    },
});


export default cartMachine;