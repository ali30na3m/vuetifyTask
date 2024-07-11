<template>
  <PageProviderVue languageProps="../views/Home/Dashboard/locale/index">
    <DashboardCard />
  </PageProviderVue>
</template>

<script lang="ts" setup>
import PageProviderVue from '@/common/PageProvider/PageProvider.vue'
import DashboardCard from './component/DashboardCard.vue'

</script>
