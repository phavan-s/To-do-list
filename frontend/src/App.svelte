<script>

  import {
    Router
  } from "@mateothegreat/svelte5-router";

  import Login from "./pages/login.svelte";

  import Register from "./pages/register.svelte";

  import Dashboard from "./pages/dashboard.svelte";

  import Admin from "./pages/admin.svelte";

  const routes = [

    {
      path: "/",
      component: Register
    },

    {
      path: "/login",
      component: Login
    },

    {
      path: "/register",
      component: Register
    },

    {
      path: "/dashboard",
      component: Dashboard
    },

    {
      path: "/admin",
      component: Admin
    }

  ];

</script>

<Router {routes} />