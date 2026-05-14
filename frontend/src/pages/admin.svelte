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

<div class="admin-container">
  <div class="admin-header">
    <h1>👨‍💼 Admin Panel</h1>
    <div class="dashboard-actions">
      <a href="/dashboard" style="text-decoration: none;">
        <button class="btn-secondary">
          ← Back to Dashboard
        </button>
      </a>
      <button class="btn-secondary" on:click={logout}>
        🚪 Logout
      </button>
    </div>
  </div>

  <div class="admin-layout">
    <div class="admin-users">
      <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); background: rgba(37, 99, 235, 0.1);">
        <h3 style="margin: 0; color: var(--text-primary);">👥 Users ({users.length})</h3>
      </div>

      <div class="user-list">
        {#if users.length === 0}
          <div class="empty-state" style="padding: 2rem;">
            <p class="text-muted">No users found</p>
          </div>
        {:else}
          {#each users as user}
            <div 
              class="user-item {selectedUser?.id === user.id ? 'active' : ''}"
              on:click={() => getUserTodos(user)}
              role="button"
              tabindex="0"
            >
              <div class="user-info">
                <div class="user-name">{user.name}</div>
                <div class="user-email">{user.email}</div>
                <span class="badge badge-primary" style="margin-top: 0.5rem;">
                  {user.role}
                </span>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <div class="admin-details">
      {#if selectedUser}
        <h2 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem;">
          ℹ️ User Details
        </h2>

        <div class="user-detail-item">
          <div class="detail-label">Full Name</div>
          <div class="detail-value">{selectedUser.name}</div>
        </div>

        <div class="user-detail-item">
          <div class="detail-label">Email Address</div>
          <div class="detail-value">{selectedUser.email}</div>
        </div>

        <div class="user-detail-item">
          <div class="detail-label">User Role</div>
          <div class="detail-value">
            <span class="badge {selectedUser.role === 'admin' ? 'badge-primary' : 'badge-success'}">
              {selectedUser.role}
            </span>
          </div>
        </div>

        <button 
          class="btn-danger w-full" 
          on:click={() => deleteUser(selectedUser.id)}
        >
          🗑️ Delete User
        </button>

        <div class="admin-todos">
          <h3>📋 User's Tasks</h3>

          {#if userTodos.length === 0}
            <div class="empty-state" style="padding: 2rem 0;">
              <p class="text-muted">No tasks yet</p>
            </div>
          {:else}
            {#each userTodos as todo}
              <div class="todo-item">
                <div class="todo-content">
                  <div class="todo-title">{todo.title}</div>
                  <div class="todo-description">
                    Status: 
                    <span class="badge {todo.status === 'completed' ? 'badge-success' : 'badge-primary'}">
                      {todo.status}
                    </span>
                  </div>
                </div>
              </div>
            {/each}
          {/if}
        </div>
      {:else}
        <div class="empty-state" style="padding: 4rem 2rem;">
          <h3>👈 Select a user</h3>
          <p class="text-muted">Click on a user from the list to view their details and tasks</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(#app) {
    background: var(--dark-bg);
    min-height: 100vh;
  }
</style>