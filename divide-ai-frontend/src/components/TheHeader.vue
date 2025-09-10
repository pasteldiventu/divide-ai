<template>
    <header class="main-header">
      <div class="container">
        <h1>Divide Aí</h1>
        <button class="new-expense-btn">+ Nova Despesa</button>
      </div>
    </header>
  </template>
  
  <style scoped>
  .main-header {
    background-color: var(--color-card-bg); 
    color: var(--text-header); 
    padding: 1rem 2rem;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  .new-expense-btn {
    background-color: var(--color-action); 
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
  }
  </style>