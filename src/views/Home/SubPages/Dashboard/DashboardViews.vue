<template>
  <PageProviderVue languageProps="../views/Home/Dashboard/locale/index">
    <CardDashboard />
  </PageProviderVue>
</template>

<script lang="ts" setup>
import PageProviderVue from '@/common/PageProvider/PageProvider.vue'
import CardDashboard from './component/CardDashboard.vue'

</script>
