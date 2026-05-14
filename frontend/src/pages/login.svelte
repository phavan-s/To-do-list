<script>

  let email = "";

  let password = "";

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

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    window.location.href = "/dashboard";
  }

</script>

<h1>Login</h1>

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