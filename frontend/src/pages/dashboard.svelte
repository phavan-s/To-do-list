<script>
    import { onMount } from "svelte";
    onMount(() => {
        getTodos();
    });

  let todos = [];
  
  async function getTodos() {

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

  todos = data;

}

</script>


<main>
    <h1>Todo Dashboard</h1>

<ul>

  {#each todos as todo}

    <li>{todo.title}</li>

  {/each}

</ul>
</main>