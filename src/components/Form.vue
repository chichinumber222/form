<template>
  <div class="form">
    <h2>Форма</h2>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="username">Имя пользователя:</label>
        <input
          id="username"
          v-model="formValues.username"
          @blur="validateField('username')"
          type="text"
        />
        <div class="error" v-if="errors.username.length">
          <div v-for="(msg, idx) in errors.username" :key="idx">
            {{ msg }}
          </div>
        </div>
      </div>
      <div>
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="formValues.email"
          @blur="validateField('email')"
          type="text"
        />
        <div class="error" v-if="errors.email.length">
          <div v-for="(msg, idx) in errors.email" :key="idx">
            {{ msg }}
          </div>
        </div>
      </div>
      <button type="submit">Отправить</button>
    </form>
    <div v-if="loading">Загрузка...</div>
    <div v-if="error">
      <p>Ошибка: {{ error }}</p>
    </div>
    <div v-if="data">
      <p>Ответ от сервера: {{ data }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useFormValidation } from '../composables/useFormValidation'
import { useApi } from '../composables/useApi'

export default defineComponent({
  name: 'Form',
  setup() {
    const formValues = reactive({
      username: '',
      email: ''
    })

    const rules = {
      username: [
        { rule: 'required', message: 'Поле "Имя пользователя" обязательно' },
        { rule: 'minLength', value: 3, message: 'Минимум 3 символа' }
      ],
      email: [
        { rule: 'required', message: 'Поле "Email" обязательно' },
        { rule: 'email', message: 'Неверный формат email' }
      ]
    }

    const {
      errors,
      isFormValid,
      validateField,
      validateAll
    } = useFormValidation(formValues, rules)

    const { data, error, loading, status, fetchData } = useApi()

    const onSubmit = () => {
      validateAll()

      if (isFormValid.value) {
        fetchData({
          url: 'https://jsonplaceholder.typicode.com/posts',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            username: formValues.username,
            email: formValues.email
          }
        })
      }
    }

    return {
      formValues,
      errors,
      isFormValid,
      validateField,
      data,
      error,
      loading,
      status,
      onSubmit
    }
  }
})
</script>

<style scoped>
.form {
  width: 300px;
  margin: 0 auto;
}

.form label {
  display: block;
  margin-bottom: 4px;
}

.form input {
  margin-bottom: 8px;
  width: 100%;
  box-sizing: border-box;
}

.error {
  color: red;
  font-size: 0.9em;
  margin-bottom: 8px;
}
</style>