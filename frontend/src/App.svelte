<script>
	import routes from 'page'
	import Home from './routes/Home.svelte';
	import Login from "./routes/Login.svelte";

    import store from './stores/token';
    import router from "page";

    import AdminPage from "./routes/AdminPage.svelte";
    import AllUsers from "./routes/AllUsers.svelte";

	let page;
	let params;

    document.title="Planion";

    /**
     * Setting different routes for different pages, as the landing page will be the login page
     */

    router('/', (ctx) => page = (Login))
	routes('/home', (ctx) => page = (Home));
	routes('/login', (ctx) => page = (Login));
	routes('/all-users', (ctx) => page = (AllUsers));
	routes('/admin-page', (ctx) => page = (AdminPage));

	routes.start();

    function checkLogin() {
        if ($store.token == ''){
            routes.redirect('/login');
        }
    }
    //This will check if the user is logged in
    checkLogin();

</script>
<svelte:component this={page} params={params}/>

<main>

</main>

<style>

</style>