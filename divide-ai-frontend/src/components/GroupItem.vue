<template>
  <div class="group-item" :class="{ 'expandido': isExpanded }">
    <div class="group-header" @click="toggleExpand">
      <div class="header-info">
        <h4>{{ group.name }}</h4>
      </div>
      <div class="header-status">
        <span :class="['status', group.status.toLowerCase()]">{{ group.status }}</span>
        <svg class="seta-icone" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
    </div>

    <div class="group-body" @click="toggleExpand">
      <span>Descrição do grupo:</span>
      <span class="group-description">{{ group.description }}</span>
    </div>

    <div v-if="isExpanded" class="despesas-content">
      <div v-if="loadingExpenses" class="state-message">Carregando despesas...</div>
      <div v-else-if="expensesError" class="state-message error-text">{{ expensesError }}</div>
      <div v-else-if="expenses.length === 0" class="state-message">Nenhuma despesa registrada.</div>
      <ul v-else class="despesas-lista">
        <li v-for="expense in expenses" :key="expense.id">
          <span>{{ expense.description }}</span>
          <span class="valor">R$ {{ formatCurrency(expense.amount) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '@/services/api';

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
});

const formatCurrency = (value) => {
  if (!value) return '0,00'; 
  
  const numberValue = parseFloat(value); 
  return numberValue.toFixed(2).replace('.', ',');
};

const isExpanded = ref(false);
const expenses = ref([]);
const loadingExpenses = ref(false);
const expensesError = ref(null);

const fetchExpenses = async () => {
  if (expenses.value.length > 0) return;
  loadingExpenses.value = true;
  expensesError.value = null;
  try {
    const response = await apiClient.get(`/groups/${props.group.id}/expenses?_=${new Date().getTime()}`);
    expenses.value = response.data;
  } catch (error) {
    console.error(`Erro ao buscar despesas do grupo ${props.group.id}:`, error);
    expensesError.value = 'Não foi possível carregar as despesas.';
  } finally {
    loadingExpenses.value = false;
  }
};

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    fetchExpenses();
  }
};
</script>

<style scoped>
.group-item {
  background-color: var(--color-card-bg); 
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
h4 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}
.status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: bold;
}
.status.inativo {
  color: #E74C3C;
  background-color: rgba(239, 68, 68, 0.1);
}
.status.ativo {
  color: #38D39F;
  background-color: rgba(34, 197, 94, 0.1);
}
.group-body {
  color: var(--color-text-soft);
}
.group-description {
  font-weight: bold;
  color: var(--color-text); 
  margin-left: 0.5rem;
}
.header-status {
    display: flex;
    align-items: center;
    gap: 1rem;
}


.seta-icone {
    color: var(--color-text-soft);
    transition: transform 0.3s ease;
}
.group-item.expandido .seta-icone {
    transform: rotate(180deg);
}
.despesas-content {
    overflow: hidden;
    transition: max-height 0.4s ease-out;
    max-height: 0;
    border-top: 1px solid rgba(148, 163, 184, 0.2); 
    margin-top: 0;
    padding-top: 0;
}
.group-item.expandido .despesas-content {
    max-height: 500px;
    transition: max-height 0.4s ease-in;
    margin-top: 1.5rem;
    padding-top: 1rem;
}
.despesas-lista {
    list-style: none;
    padding: 0;
    margin: 0;
}
.despesas-lista li {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    color: var(--color-text-soft); 
}
.despesas-lista li .valor {
    font-weight: bold;
    color: var(--text-primary); 
}
.state-message {
  text-align: center;
  padding: 1rem 0;
  color: var(--color-text-soft); 
}
.error-text {
  color: #E74C3C; 
}
</style>