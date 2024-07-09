<template>
  <PageProvider languageProps="../views/Home/Profile/locale/index">
    <profileCard />
  </PageProvider>
</template>

<script lang="ts" setup>
import PageProvider from '@/common/PageProvider/PageProvider.vue';
import profileCard from './component/ProfileCard.vue'
</script>

<style>
</style>