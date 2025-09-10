<template>
    <TheHeader />
    <main class="dashboard-container">
      <section class="summary-grid">
        <SummaryCard title="Resumo Geral">
          <div v-if="loadingSummary">Carregando...</div>
          <div v-else-if="summaryError" class="error-text">{{ summaryError }}</div>
          <div v-else class="summary-details">
            <p class="debt">💰 Você deve R$ 50,00</p>
            <p class="credit">✅ Vão te pagar R$ 120,00</p>
          </div>
        </SummaryCard>

        <SummaryCard title="Grupos">
           <div v-if="loadingGroups">...</div>
           <p v-else class="group-count">{{ groups.length }} grupos ativos</p>
        </SummaryCard>

        <SummaryCard title="Divisão" />
      </section>
  
      <section class="my-groups">
        <h2>Meus Grupos</h2>
        <div v-if="loadingGroups" class="state-message">Carregando grupos...</div>
        <div v-else-if="groupsError" class="state-message error-text">{{ groupsError }}</div>
        <div v-else-if="groups.length === 0" class="state-message">Você ainda não tem grupos.</div>
        <div v-else class="groups-list">
          <GroupItem v-for="group in groups" :key="group.id" :group="group" />
        </div>
      </section>
    </main>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/services/api';
import TheHeader from '@/components/TheHeader.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import GroupItem from '@/components/GroupItem.vue';

const groups = ref([]);

const loadingGroups = ref(false);

const groupsError = ref(null);

const fetchDashboardData = async () => {
  loadingGroups.value = true;
  groupsError.value = null;

  try {
    const [groupsResponse] = await Promise.all([
      apiClient.get('/Groups'), 
      /*apiClient.get('/dashboard/summary') */
    ]);

    groups.value = groupsResponse.data;
    /*summary.value = summaryResponse.data;*/

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    groupsError.value = 'Não foi possível carregar os grupos.';
    /*summaryError.value = 'Não foi possível carregar o resumo.';*/
  } finally {
    loadingGroups.value = false;
    /*loadingSummary.value = false;*/
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
  
<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.summary-details p {
  margin: 0.5rem 0;
}
.debt {
  color: var(--accent-red); 
}
.credit {
  color: var(--accent-green); 
}
.group-count {
  font-size: 1.5rem;
  font-weight: bold;
}
.my-groups h2 {
  margin-bottom: 1.5rem;
}
.groups-list {
  display: grid;
  gap: 1.5rem;
}
.state-message {
  text-align: center;
  padding: 2rem;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.error-text {
  color: var(--accent-red);
}
</style>