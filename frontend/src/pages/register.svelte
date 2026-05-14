<script>

  let name = "";

  let email = "";

  let password = "";

  let showPassword = false;

  let successMessage = "";

  let errorMessage = "";

  async function registerUser() {

    if (!name.trim() || !email.trim() || !password.trim()) {
      errorMessage = "Please fill in all fields";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        errorMessage = data.message || "Registration failed";
        return;
      }

      successMessage = "Registration successful! Redirecting to login...";
      errorMessage = "";

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      errorMessage = "An error occurred. Please try again.";
      console.error(err);
    }

  }

</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>Create Account</h1>

    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="success-message">
        {successMessage}
      </div>
    {/if}

    <div class="form-group">
      <label for="name">Full Name</label>
      <input
        id="name"
        bind:value={name}
        type="text"
        placeholder="John Doe"
      />
    </div>

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

    <button class="btn-primary w-full" on:click={registerUser}>
      Create Account
    </button>

    <p class="text-center">
      Already have an account?<br />
      <a href="/login">
        Sign In
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