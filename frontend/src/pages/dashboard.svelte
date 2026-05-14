<script>

  import { onMount } from "svelte";
  onMount(() => {

  const token =
    localStorage.getItem("accessToken");

  if (!token) {

    window.location.href = "/login";

    return;

  }

  getTodos();

});

  let todos = [];


  let todoTitle = "";

  let todoDescription = "";

  let loading = false;

  let error = "";

  let role = localStorage.getItem("role");

    $: pendingTodos =
  todos.filter(todo =>
    todo.status !== "completed"
  );

$: completedTodos =
  todos.filter(todo =>
    todo.status === "completed"
  );


  async function getTodos() {

    loading = true;
    error = "";

    try {
      const response = await fetch(
        "http://localhost:3000/api/todos",
        {
          headers: {

            Authorization:
              `Bearer ${localStorage.getItem("accessToken")}`

          }
        }
      );

      const data = await response.json();

      console.log(data);

      todos = data.todos;
    } catch (err) {
      error = "Failed to fetch todos";
      console.error(err);
    } finally {
      loading = false;
    }

  }

  async function createTodo() {

    if (!todoTitle.trim()) {
      error = "Please enter a todo title";
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/todos",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${localStorage.getItem("accessToken")}`
          },

          body: JSON.stringify({
            title: todoTitle,
            description: todoDescription
          })
        }
      );

      const data = await response.json();

      console.log(data);

      todoTitle = "";
      todoDescription = "";
      error = "";

      getTodos();
    } catch (err) {
      error = "Failed to create todo";
      console.error(err);
    }

  }

  onMount(() => {

    getTodos();

  });

  async function deleteTodo(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      const data = await response.json();
      console.log(data);
      getTodos();
    } catch (err) {
      error = "Failed to delete todo";
      console.error(err);
    }
  }

  async function completeTodo(todo) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/todos/${todo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${localStorage.getItem("accessToken")}`
          },
          body: JSON.stringify({
            title: todo.title,
            status: "completed"
          })
        }
      );

      const data = await response.json();
      console.log(data);
      getTodos();
    } catch (err) {
      error = "Failed to complete todo";
      console.error(err);
    }
  }

  async function updateTodo(id) {
    const newTitle = prompt("Enter new todo title");
    if (!newTitle) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/todos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${localStorage.getItem("accessToken")}`
          },
          body: JSON.stringify({
            title: newTitle
          })
        }
      );

      const data = await response.json();
      console.log(data);
      getTodos();
    } catch (err) {
      error = "Failed to update todo";
      console.error(err);
    }
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "/login";
  }

</script>

<div class="dashboard-container">
  <div class="dashboard-header">
    <h1>Dashboard</h1>
    <div class="dashboard-actions">
      {#if role === "admin"}
        <a href="/admin" style="text-decoration: none;">
          <button class="btn-secondary">
            👨‍💼 Admin Panel
          </button>
        </a>
      {/if}
      <button class="btn-secondary" on:click={logout}>
        🚪 Logout
      </button>
    </div>
  </div>

  <div class="dashboard-content">
    {#if role !== "admin"}
      <div class="dashboard-section">
        <h2>➕ Create Task</h2>
        
        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}

        <div class="form-group">
          <label for="title">Task Title</label>
          <input
            id="title"
            bind:value={todoTitle}
            type="text"
            placeholder="What do you need to do?"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            bind:value={todoDescription}
            placeholder="Add details about your task..."
          ></textarea>
        </div>

        <button class="btn-primary w-full" on:click={createTodo}>
          Create Task
        </button>
      </div>
    {/if}

    <div class="dashboard-section">
      <h2>📋 Your Tasks</h2>

      {#if loading}
        <div class="text-center">
          <div class="loading mt-2 mb-2" style="margin-left: auto; margin-right: auto;"></div>
          <p class="text-muted">Loading tasks...</p>
        </div>
      {:else if todos.length === 0}
        <div class="empty-state">
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
        </div>
      {:else}
        <div>
          <h3 style="color: var(--success-color); margin-top: 0; margin-bottom: 1rem;">
            🎯 Active Tasks ({pendingTodos.length})
          </h3>

          {#if pendingTodos.length === 0}
            <p class="text-muted text-center" style="padding: 2rem;">All caught up! 🎉</p>
          {:else}
            {#each pendingTodos as todo}
              <div class="todo-item">
                <div class="todo-content">
                  <div class="todo-title">{todo.title}</div>
                  {#if todo.description}
                    <div class="todo-description">{todo.description}</div>
                  {/if}
                </div>
                <div class="todo-actions">
                  <button 
                    class="btn-success btn-small" 
                    on:click={() => completeTodo(todo)}
                    title="Mark as complete"
                  >
                    ✓
                  </button>
                  <button 
                    class="btn-secondary btn-small" 
                    on:click={() => updateTodo(todo.id)}
                    title="Edit task"
                  >
                    ✎
                  </button>
                  <button 
                    class="btn-danger btn-small" 
                    on:click={() => deleteTodo(todo.id)}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </div>
            {/each}
          {/if}

          {#if completedTodos.length > 0}
            <div class="section-divider"></div>
            <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">
              ✅ Completed ({completedTodos.length})
            </h3>

            {#each completedTodos as todo}
              <div class="todo-item completed">
                <div class="todo-content">
                  <div class="todo-title completed">{todo.title}</div>
                </div>
                <button 
                  class="btn-danger btn-small" 
                  on:click={() => deleteTodo(todo.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
            {/each}
          {/if}
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