<script>
  import { onMount } from "svelte";

  onMount(() => {

  const token =
    localStorage.getItem("accessToken");

  if (token) {

    window.location.href = "/dashboard";

  }

});

  let email = "";

  let password = "";

  let errorMessage = "";

  async function loginUser() {

    const response = await fetch(
      "http://localhost:3000/api/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      errorMessage = data.message || "Login failed";
      return;
    }

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      data.refreshToken
    );

    localStorage.setItem(
      "role",
      data.role
    );

    if (data.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/dashboard";
    }
  }

</script>

<h1>Login</h1>

{#if errorMessage}
  <div style="color: red; margin-bottom: 10px;">
    {errorMessage}
  </div>
{/if}

<input
  bind:value={email}
  type="email"
  placeholder="Enter email"
/>

<input
  bind:value={password}
  type="password"
  placeholder="Enter password"
/>

<button on:click={loginUser}>
  Login
</button>

<p>
  New user?

  <a href="/register">
    Create Account
  </a>
</p>