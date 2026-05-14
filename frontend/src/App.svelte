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

<style>
  :global(:root) {
    --primary-color: #2563eb;
    --primary-dark: #1e40af;
    --primary-light: #3b82f6;
    --secondary-color: #7c3aed;
    --secondary-dark: #6d28d9;
    --success-color: #10b981;
    --error-color: #ef4444;
    --warning-color: #f59e0b;
    --dark-bg: #0f172a;
    --darker-bg: #020617;
    --card-bg: #1e293b;
    --input-bg: #334155;
    --border-color: #475569;
    --text-primary: #f1f5f9;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
  }
</style>