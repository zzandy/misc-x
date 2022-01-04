<script lang="ts">
  import { Task } from './task';
  import TaskDisplay from './TaskDisplay.svelte';

  export let title = 'hello';
  export let tasks: Task[];
</script>

<div>
  Hello {title}!

  <div class="action">Add new</div>
  <div class="tasks">
    {#each tasks as task}
      <TaskDisplay {task} />
    {/each}
  </div>
</div>

<style>
  .tasks {
    display: grid;
    grid-template-columns: 1fr 5fr;
  }
</style>
