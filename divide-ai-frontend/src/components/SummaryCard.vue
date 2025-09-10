<template>
    <div class="summary-card">
      <h3>{{ title }}</h3>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .summary-card {
    background-color: var(--color-card-bg); 
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  h3 {
    margin: 0 0 1rem 0;
    color: var( --color-text); 
    font-weight: 500;
  }
  </style>