<script>

  let name = "";

  let email = "";

  let password = "";

  async function registerUser() {

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

    console.log(data);

    alert("Registration successful");

    window.location.href = "/login";

  }

</script>

<h1>Create Account</h1>

<input
  bind:value={name}
  placeholder="Enter name"
/>

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

<button onclick={registerUser}>
  Register
</button>

<p>

  Already have an account?

  <a href="/login">
    Login
  </a>

</p>