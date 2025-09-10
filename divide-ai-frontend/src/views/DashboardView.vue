<template>
    <TheHeader />
    <main class="dashboard-container">
      <section class="summary-grid">
        <SummaryCard title="Resumo Geral">
          <div class="summary-details">
            <p class="debt">💰 Você deve R$ 50,00</p>
            <p class="credit">✅ Vão te pagar R$ 120,00</p>
          </div>
        </SummaryCard>
        <SummaryCard title="Grupos">
           <p class="group-count">3 grupos ativos</p>
        </SummaryCard>
        <SummaryCard title="Divisão" />
      </section>
  
      <section class="my-groups">
        <h2>Meus Grupos</h2>
        <div class="groups-list">
          <GroupItem v-for="group in groups" :key="group.id" :group="group" />
        </div>
      </section>
    </main>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import TheHeader from '@/components/TheHeader.vue';
  import SummaryCard from '@/components/SummaryCard.vue';
  import GroupItem from '@/components/GroupItem.vue';
  
  // Dados mocados (virão da sua API NestJS no próximo passo)
  const groups = ref([
    { id: 1, name: 'Churrasco 30/08', total: 350.00, status: 'Pendente' },
    { id: 2, name: 'Conta da Casa', total: 780.00, status: 'Quitado' },
  ]);
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
  </style>