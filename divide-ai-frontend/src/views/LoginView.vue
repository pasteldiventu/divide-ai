<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">Divide Aí</h1>
      <p class="subtitle">Faça login para continuar</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            id="email" 
            type="email" 
            v-model="email" 
            placeholder="seu.email@exemplo.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            id="password" 
            type="password" 
            v-model="password" 
            placeholder="Sua senha" 
            required 
          />
        </div>

        <button type="submit" class="btn-login">Entrar</button>
      </form>

      <div class="links">
        <a href="#">Esqueceu a senha?</a>
        <a href="#">Criar conta</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  console.log('Tentando fazer login com:');
  console.log('Email:', email.value);
  console.log('Senha:', password.value);
  
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: email.value,
      password: password.value,
    });
    console.log('Login bem-sucedido!', response.data.access_token);
    // Salvar o token (localStorage, Pinia, etc.) e redirecionar
  } catch (error) {
    console.error('Falha no login:', error.response?.data?.message || error.message);
    // Mostrar uma mensagem de erro para o usuário
  }
  
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
}

.login-card {
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

.login-form {
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

.btn-login {
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

.btn-login:hover {
  filter: brightness(1.1);
}
.btn-login:active {
  transform: scale(0.98);
}

.links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
}

.links a {
  color: var(--color-secondary);
  text-decoration: none;
  font-size: 0.9rem;
}

.links a:hover {
  text-decoration: underline;
}
</style>