<template>
  <header class="main-header">
    <div class="container">
      <h1>Divide Aí</h1>

      <div class="actions">
        <button class="new-expense-btn">+ Nova Despesa</button>
        <button class="new-group-btn">+ Novo Grupo</button>
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<script setup>
import ThemeSwitcher from './ThemeSwitcher.vue';

</script>

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

/* Ações alinhadas à direita */
.actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.new-expense-btn {
  background-color: var(--color-action);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.new-expense-btn:hover {
  background-color: #20c997;
}

/* Botão de grupo com estilo diferente */
.new-group-btn {
  background-color: transparent;
  color: var(--color-action);
  border: 2px solid var(--color-action);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.new-group-btn:hover {
  background-color: var(--color-action);
  color: white;
}
</style>
