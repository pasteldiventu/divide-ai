<template>
  <button @click="toggleTheme" class="theme-switcher">
    {{ isDarkMode ? 'Modo Claro' : 'Modo Escuro' }}
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDarkMode = ref(false);

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme); // Salva a preferência
};

// Ao carregar o componente, verifica se há um tema salvo
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    isDarkMode.value = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
});
</script>

<style scoped>
.theme-switcher {
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-card-bg);
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  z-index: 1000;
}
</style>