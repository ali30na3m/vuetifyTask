<template>
  <PageProvider languageProps="../views/Home/SubPages/Dashboard/locale/index">
    <weatherCard />
  </PageProvider>
</template>

<script lang="ts" setup>
import weatherCard from './component/weatherCard.vue'
import PageProvider from '@/common/PageProvider/PageProvider.vue';
</script>

<style>
</style>
