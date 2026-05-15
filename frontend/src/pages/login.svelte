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

  let showPassword = false;

  let errorMessage = "";

  async function loginUser() {

    const response = await fetch(
      "/api/login",
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

<div class="auth-container">
  <div class="auth-card">
    <h1>Welcome Back</h1>

    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}

    <div class="form-group">
      <label for="email">Email Address</label>
      <input
        id="email"
        bind:value={email}
        type="email"
        placeholder="name@example.com"
      />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="password-input-wrapper">
        <input
          id="password"
          bind:value={password}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
        />
        <button
          type="button"
          class="password-toggle"
          on:click={() => (showPassword = !showPassword)}
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>
    </div>

    <button class="btn-primary w-full" on:click={loginUser}>
      Sign In
    </button>

    <p class="text-center">
      Don't have an account?<br />
      <a href="/register">
        Create Account
      </a>
    </p>
  </div>
</div>

<style>
  .password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-input-wrapper input {
    padding-right: 2.75rem;
    margin-bottom: 0;
  }

  .password-toggle {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.2rem;
    color: var(--text-secondary);
    transition: var(--transition);
    margin-bottom: 0;
  }

  .password-toggle:hover {
    color: var(--text-primary);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }
</style>