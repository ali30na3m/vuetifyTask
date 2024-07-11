<template>
    <PageProvider languageProps="../views/Home/Logout/locale/index">
        <logoutCard />
</PageProvider>
</template>

<script lang="ts" setup>
import PageProvider from '@/common/PageProvider/PageProvider.vue'
import logoutCard from './component/logoutCard.vue'
</script>

<style>
</style>