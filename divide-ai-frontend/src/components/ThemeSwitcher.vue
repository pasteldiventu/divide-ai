<template>
  <label class="theme-switcher">
    <input type="checkbox" v-model="isDarkMode" @change="toggleTheme" />
    <span class="slider">
      <span class="icon left">☀️</span>
      <span class="icon right">🌙</span>
      <span class="circle"></span>
    </span>
  </label>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDarkMode = ref(false);

const toggleTheme = () => {
  const theme = isDarkMode.value ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

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
  display: flex;
  
  width: 70px;
  height: 34px;
}

.theme-switcher input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: relative;
  cursor: pointer;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  box-sizing: border-box;
  font-size: 16px;
}

.icon {
  z-index: 1;
  pointer-events: none;
}

.circle {
  position: absolute;
  height: 26px;
  width: 26px;
  left: 4px;
  top: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--color-action);
}

input:checked + .slider .circle {
  transform: translateX(36px);
}
</style>
