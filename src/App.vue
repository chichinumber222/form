<template>
  <div>
    <Form />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Form from './components/Form.vue';

  export default defineComponent({
    name: 'App',
    components: {
      Form,
    },
  });
</script>

