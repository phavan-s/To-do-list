<script>

  import { onMount } from "svelte";

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


</script>

<h1>Dashboard</h1>
<div>
{#if role === "admin"}

  <a href="/admin">

    <button>
      Admin Panel
    </button>

  </a>

{/if}


{#if role !== "admin"}
  <h2>Add New Task</h2>
  {#if error}
    <div>
      {error}
    </div>
  {/if}
  <div>
    <input
      bind:value={todoTitle}
      placeholder="Task title"
    />
  </div>
  <div>
    <textarea
      bind:value={todoDescription}
      placeholder="Task description (optional)"
    ></textarea>
  </div>
  <button onclick={createTodo}>
    Add Task
  </button>
</div>
{/if}

<h2>Your Tasks</h2>

{#if loading}

  <p>Loading tasks...</p>

{:else if todos.length === 0}

  <p>No tasks yet. Create one above!</p>

{:else}

  <h2>Pending Tasks</h2>

  <ul>

    {#each pendingTodos as todo}

      <li>

        <input
          type="checkbox"
          onclick={() => completeTodo(todo)}
        />

        {todo.title}

        <button onclick={() => updateTodo(todo.id)}>
          Edit
        </button>

        <button onclick={() => deleteTodo(todo.id)}>
          Delete
        </button>

      </li>

    {/each}

  </ul>

  <h2>Completed Tasks</h2>

  <ul>

    {#each completedTodos as todo}

      <li>

        ✅ {todo.title}

      </li>

    {/each}

  </ul>

{/if}