import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue';
import Story from '@/components/Story.vue';

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/story/:id', component: Story, name: 'story' },
];

export default routes;
