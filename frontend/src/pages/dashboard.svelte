<script>

  import { onMount } from "svelte";
  
  let taskInput = "";

  let aiMode = false;

  let suggestions = [];

  let todos = [];

  let loadingAI = false;
  
  let todoTitle = "";

  let todoDescription = "";

  let loading = false;

  let error = "";

  let role = localStorage.getItem("role");
  let dailySummary = "";
  let loadingSummary = false;
  let typingTimer = null;

  onMount(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    getTodos();
  });

  $: pendingTodos =
  todos.filter(todo =>
    todo.status !== "completed"
  );

$: completedTodos =
  todos.filter(todo =>
    todo.status === "completed"
  );

  const handleAdd = async () => {
    if (!taskInput.trim()) return;
    todoTitle = taskInput;
    await createTodo();
    taskInput = "";
  };

  async function generateSuggestions() {
    if (!taskInput.trim()) return;
    loadingAI = true;
    error = "";
    suggestions = [];
    try {
      const response = await fetch("/api/users/generate-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ prompt: taskInput })
      });
      const data = await response.json();
      if (!response.ok) {
        error = data.message || "Failed to generate tasks";
        return;
      }
      suggestions = data.tasks || [];
    } catch (err) {
      error = "Failed to generate AI suggestions";
      console.error(err);
    } finally {
      loadingAI = false;
    }
  }

  function handleInput() {
    if (!aiMode) return;
    clearTimeout(typingTimer);
    suggestions = [];
    if (taskInput.trim().length < 3) return;
    typingTimer = setTimeout(() => {
      generateSuggestions();
    }, 600);
  }

  function handleAiModeToggle() {
    suggestions = [];
    clearTimeout(typingTimer);
  }

  async function fetchDailySummary() {
    loadingSummary = true;
    try {
      const response = await fetch("/api/users/daily-summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      const data = await response.json();
      if (data.success) {
        dailySummary = data.summary;
      }
    } catch (err) {
      console.error(err);
    } finally {
      loadingSummary = false;
    }
  }

  async function getTodos() {

    loading = true;
    error = "";

    try {
      const response = await fetch(
        "/api/todos",
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
        "/api/todos",
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
      suggestions = [];
      taskInput = "";

      getTodos();
    } catch (err) {
      error = "Failed to create todo";
      console.error(err);
    }

  }

  async function selectSuggestion(suggestion) {
    todoTitle = suggestion;
    suggestions = [];
    taskInput = "";
    await createTodo();
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(
        `/api/todos/${id}`,
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
        `/api/todos/${todo.id}`,
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
        `/api/todos/${id}`,
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
      <div class="left-panel">

        <!-- Daily Summary (top) -->
        <div class="daily-summary-section">
          <div class="daily-summary-header">
            <span>📊 Daily Summary</span>
            <button
              class="summary-refresh-btn"
              on:click={fetchDailySummary}
              disabled={loadingSummary}
              title="Refresh summary"
            >
              {#if loadingSummary}
                <span class="ai-spinner"></span>
              {:else}
                ↻
              {/if}
            </button>
          </div>
          <div class="daily-summary-body">
            {#if loadingSummary}
              <p class="summary-muted">Generating your summary...</p>
            {:else if dailySummary}
              <p>{dailySummary}</p>
            {:else}
              <p class="summary-muted">Click ↻ to generate your daily productivity summary.</p>
            {/if}
          </div>
        </div>

        <!-- Create Task (below summary) -->
        <div class="dashboard-section">
          <h2>➕ Create Task</h2>

          {#if error}
            <div class="error-message">{error}</div>
          {/if}

          <label class="ai-toggle-label" style="margin-bottom: 0.75rem;">
            <input
              type="checkbox"
              bind:checked={aiMode}
              on:change={handleAiModeToggle}
            />
            <span class="ai-toggle-track">
              <span class="ai-toggle-thumb"></span>
            </span>
            <span class="ai-toggle-text">✨ AI MODE</span>
            {#if loadingAI}
              <span class="ai-spinner"></span>
            {/if}
          </label>

          <div class="form-group input-with-dropdown">
            <label for="taskInput">
              {#if aiMode}Describe what you need{:else}Task Title{/if}
            </label>
            <div style="display: flex; gap: 0.5rem;">
              <input
                id="taskInput"
                bind:value={taskInput}
                on:input={handleInput}
                type="text"
                placeholder={aiMode ? "e.g. Plan a team meeting" : "What do you need to do?"}
                autocomplete="off"
              />
              {#if !aiMode}
                <button
                  class="btn-primary"
                  on:click={handleAdd}
                  disabled={!taskInput.trim()}
                >
                  Add
                </button>
              {/if}
            </div>
            {#if aiMode && (loadingAI || suggestions.length > 0)}
              <div class="ai-dropdown">
                {#if loadingAI}
                  <div class="ai-dropdown-loading">
                    <span class="ai-spinner"></span>
                    Generating suggestions...
                  </div>
                {:else}
                  {#each suggestions as suggestion}
                    <button class="ai-dropdown-item" on:click={() => selectSuggestion(suggestion)}>
                      {suggestion}
                    </button>
                  {/each}
                {/if}
              </div>
            {/if}
          </div>

          {#if !aiMode}
            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                bind:value={todoDescription}
                placeholder="Add details about your task..."
              ></textarea>
            </div>
          {/if}
        </div>

      </div>
    {/if}

    <div class="dashboard-section right-panel">
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

  :global(.dashboard-content) {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .left-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .right-panel {
    min-width: 0;
  }

  @media (max-width: 800px) {
    :global(.dashboard-content) {
      grid-template-columns: 1fr;
    }
  }

  .ai-toggle-label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    margin-top: 0.5rem;
    user-select: none;
  }

  .ai-toggle-label input[type="checkbox"] {
    display: none;
  }

  .ai-toggle-track {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 20px;
    background: var(--bg-secondary, #2a2a3e);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    transition: background 0.25s;
    flex-shrink: 0;
  }

  .ai-toggle-label input[type="checkbox"]:checked ~ .ai-toggle-track {
    background: var(--primary-color, #6c63ff);
    border-color: var(--primary-color, #6c63ff);
  }

  .ai-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background: rgba(255,255,255,0.5);
    border-radius: 50%;
    transition: left 0.25s, background 0.25s;
  }

  .ai-toggle-label input[type="checkbox"]:checked ~ .ai-toggle-track .ai-toggle-thumb {
    left: 18px;
    background: white;
  }

  .ai-toggle-text {
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--text-secondary, #888);
    transition: color 0.25s;
  }

  .ai-toggle-label:has(input:checked) .ai-toggle-text {
    color: var(--primary-color, #6c63ff);
  }

  .ai-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: var(--primary-color, #6c63ff);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .input-with-dropdown {
    position: relative;
  }

  .ai-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-secondary, #1e1e2e);
    border: 1px solid rgba(108, 99, 255, 0.35);
    border-top: none;
    border-radius: 0 0 8px 8px;
    z-index: 100;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }

  .ai-dropdown-item {
    display: block;
    width: 100%;
    padding: 0.65rem 0.9rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: var(--text-primary, #e0e0e0);
    font-size: 0.9rem;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .ai-dropdown-item:last-child {
    border-bottom: none;
  }

  .ai-dropdown-item:hover {
    background: rgba(108, 99, 255, 0.14);
    color: var(--primary-color, #6c63ff);
  }

  .ai-dropdown-loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 0.9rem;
    color: var(--text-secondary, #888);
    font-size: 0.88rem;
  }

  .daily-summary-section {
    margin-top: 1.25rem;
    background: var(--bg-secondary, #1e1e2e);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    overflow: hidden;
  }

  .daily-summary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1rem;
    background: rgba(108, 99, 255, 0.08);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: var(--primary-color, #6c63ff);
  }

  .summary-refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 26px;
    padding: 0 0.4rem;
    background: transparent;
    border: 1px solid rgba(108, 99, 255, 0.3);
    border-radius: 6px;
    color: var(--primary-color, #6c63ff);
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .summary-refresh-btn:hover:not(:disabled) {
    background: rgba(108, 99, 255, 0.15);
  }

  .summary-refresh-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .daily-summary-body {
    padding: 0.85rem 1rem;
    min-height: 56px;
  }

  .daily-summary-body p {
    margin: 0;
    font-size: 0.92rem;
    line-height: 1.65;
    color: var(--text-primary, #e0e0e0);
  }

  .summary-muted {
    color: var(--text-secondary, #888) !important;
    font-style: italic;
  }
</style>