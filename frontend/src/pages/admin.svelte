<script>

  import { onMount } from "svelte";

  onMount(() => {

  const token =
    localStorage.getItem("accessToken");

  const role =
    localStorage.getItem("role");

  if (!token || role !== "admin") {

    window.location.href = "/login";

    return;

  }

  getUsers();

});
    

  let users = [];

  let selectedUser = null;

  let userTodos = [];

  async function getUsers() {

    const response = await fetch(
      "http://localhost:3000/api/users",
      {
        headers: {

          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`

        }
      }
    );

    const data = await response.json();

    users = data;

  }

  async function getUserTodos(user) {

    selectedUser = user;

    const response = await fetch(
      `http://localhost:3000/api/users/${user.id}/todos`,
      {
        headers: {

          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`

        }
      }
    );

    const data = await response.json();

    console.log(data);

    userTodos = data;

  }

  async function deleteUser(id) {

    const confirmDelete =
      confirm("Delete this user?");

    if (!confirmDelete) return;

    await fetch(
      `http://localhost:3000/api/users/${id}`,
      {
        method: "DELETE",

        headers: {

          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`

        }
      }
    );

    getUsers();

    userTodos = [];

    selectedUser = null;

  }

  onMount(() => {

    onMount(() => {

  if (role !== "admin") {

    alert("Access denied");

    window.location.href = "/dashboard";

    return;

  }

  getUsers();

});

  });

  
  function logout() {

  localStorage.removeItem("accessToken");

  localStorage.removeItem("role");

  window.location.href = "/login";

}


</script>

<h1>Admin Panel</h1>

<button onclick={logout}>
  Logout
</button>

<a href="/dashboard">

  <button>
    Back to Dashboard
  </button>

</a>

<h2>Users</h2>

<div>

  {#each users as user}

    <div>

      <h3>{user.name}</h3>

      <p>{user.email}</p>

      <p>Role: {user.role}</p>

      <button
        onclick={() => getUserTodos(user)}
      >
        View Todos
      </button>

      <button
        onclick={() => deleteUser(user.id)}
      >
        Delete User
      </button>

    </div>

  {/each}

</div>

{#if selectedUser}

  <hr>

  <h2>
    {selectedUser.name}'s Todos
  </h2>

  {#if userTodos.length === 0}

    <p>No todos found.</p>

  {:else}

    <ul>

      {#each userTodos as todo}

        <li>

          {todo.title}
          -
          {todo.status}

        </li>

      {/each}

    </ul>

  {/if}

{/if}