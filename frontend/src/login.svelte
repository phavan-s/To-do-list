<script>
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  let email = "";
  let password = "";

  async function loginUser(){

    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
    console.log(data);

    localStorage.setItem("accessToken", data.accessToken);

  }

</script>

<main>


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

</main>

<style>
  
</style>