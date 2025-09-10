<template>
    <div class="group-item">
      <div class="group-header">
        <h4>{{ group.name }}</h4>
        <span :class="['status', group.status.toLowerCase()]">{{ group.status }}</span>
      </div>
      <div class="group-body">
        <span>Total:</span>
        <span class="total-value">R$ {{ group.total.toFixed(2) }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    group: {
      type: Object,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .group-item {
    background-color: var(--color-card-bg); 
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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
  .status.pendente {
    color: var(--accent-red); 
    background-color: rgba(239, 68, 68, 0.1);
  }
  .status.quitado {
    color: var(--accent-green); 
    background-color: rgba(34, 197, 94, 0.1);
  }
  .group-body {
    color: var(--color-text-soft); 
  }
  .total-value {
    font-weight: bold;
    color: var(--color-text);
    margin-left: 0.5rem;
  }
  </style>