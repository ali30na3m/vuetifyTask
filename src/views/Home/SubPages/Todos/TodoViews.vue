<template>
  <PageProvider languageProps="../views/Home/SubPages/Dashboard/locale/index" >
    <todosCard />
  </PageProvider>
</template>

<script lang="ts" setup>
import todosCard from './component/todosCard.vue'
import PageProvider from '@/common/PageProvider/PageProvider.vue';
</script>

<style>
</style>