<script lang="ts">
  import { Task } from "./task";

  export let task: Task;
</script>

<div class="time">
  {task.schedule.format()}
</div>
<div class="title">
  {task.title}
</div>

<style>
  .time {
    grid-column: 1;
  }

  .title {
    grid-column: 2;
  }
</style>
