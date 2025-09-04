<template>
  <div class="account-container">
    <div class="account-card">
      <h1 class="title">Divide Aí</h1>
      <p class="subtitle">Crie sua conta. É rápido e fácil!</p>
      
      <form @submit.prevent="handleRegister" class="account-form">
        <div class="form-group">
          <label for="name">Nome Completo</label>
          <input 
            id="name" 
            type="text" 
            v-model="form.name" 
            placeholder="Seu nome completo" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            id="email" 
            type="email" 
            v-model="form.email" 
            placeholder="seu.email@exemplo.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            id="password" 
            type="password" 
            v-model="form.password" 
            placeholder="Crie uma senha forte" 
            required 
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input 
            id="confirmPassword" 
            type="password" 
            v-model="form.confirmPassword" 
            placeholder="Repita a senha" 
            required 
          />
        </div>
        
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button type="submit" class="btn-register" :disabled="isLoading">
          {{ isLoading ? 'Criando...' : 'Criar Conta' }}
        </button>
      </form>

      <div class="links">
        <router-link to="/login">Já tem uma conta? Faça Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 1. Importe sua nova instância em vez do 'axios'
import apiClient from '@/services/api'; // O '@' é um atalho para a pasta 'src'

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const isLoading = ref(false);
const errorMessage = ref('');
const router = useRouter();

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'As senhas não coincidem.';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    // 2. Use 'apiClient' e passe apenas o caminho da rota
    const response = await apiClient.post('/users', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password, 
    });

    console.log('Conta criada com sucesso!', response.data);
    
    alert('Conta criada com sucesso! Você será redirecionado para o login.');

    router.push('/login');

  } catch (error) {
    const apiError = error.response?.data?.message || error.message;
    errorMessage.value = `Erro ao criar conta: ${apiError}`;
    console.error('Falha no registro:', apiError);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.account-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
}

.account-card {
  background-color: var(--color-card-bg);
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid var(--color-border);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--color-text-soft);
  margin-bottom: 2rem;
}

.account-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.btn-register {
  background-color: var(--color-action);
  color: white;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  margin-top: 1rem;
}

.btn-register:hover {
  filter: brightness(1.1);
}
.btn-register:active {
  transform: scale(0.98);
}

.btn-register:disabled {
  background-color: var(--color-text-soft);
  cursor: not-allowed;
}

.links {
  margin-top: 1.5rem;
  text-align: center;
}

.links a {
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.9rem;
}

.links a:hover {
  text-decoration: underline;
}

.error-message {
  color: var(--color-action);
  background-color: color-mix(in srgb, var(--color-action) 15%, transparent);
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.9rem;
}
</style>
