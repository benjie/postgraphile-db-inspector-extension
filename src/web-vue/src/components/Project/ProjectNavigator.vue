<template>
  <v-container>
    <schema-navigator
    ></schema-navigator> 
  </v-container>
</template>

<script>
  import SchemaNavigator from '@/components/Schema/SchemaNavigator'

  export default {
    name: 'ProjectNavigator',
    props: {
    },
    components: {
      SchemaNavigator,
    },
  }
</script>

<style>

</style>
