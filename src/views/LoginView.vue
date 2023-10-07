<script setup>
import { computed, onMounted, ref } from 'vue'
import router from '../config';
import store from '../store';
import Loading from '../components/loading.vue'
import error from '../components/error.vue'

const user = { username: '', password: '' }
const usernameError = ref(false)
const passwordError = ref(false)
const usernameIsEmpty = ref(true)
const passwordIsEmpty = ref(true)

const loading = ref(false)
const errorMessage = ref(null)
const openError = ref(false)

const loggedIn = computed(() => {
  return store.state.auth.status.loggedIn;
})

onMounted(() => {
  if (loggedIn) {
    router.push('/');
  }
})

const login = () => {
  if (user.username == '') {
    usernameError.value = true
    document.querySelector("input[name=username]").classList.add("border-red-500")
  }
  else if(user.password == '') {
    passwordError.value = true
    document.querySelector("input[name=password]").classList.add("border-red-500")
  }
  else {
    loading.value = true;
    if (user.username != '' && user.password != '') {
      store.dispatch('auth/login', user).then(
        () => {
          loading.value = false;
          router.push('/');
        },
        error => {
          if (error.toString() === 'Username or Password Not Correct!') {
            errorMessage.value = 'نام کاربری یا رمز عبور درست نمیباشد.'
          }
          if (error.toString() === "Error: An error has occurred. Please try again later.") {
            errorMessage.value = 'مشکلی برامون پیش اومد. دوباره تلاش کنید.'
          }
          loading.value = false;
        }
      );
    }
  }
}

const authorizeInput = () => {
  if (user.password) {
    passwordIsEmpty.value = false
  }
  if (!user.password) {
    passwordIsEmpty.value = true
  }
  if (user.username) {
    usernameIsEmpty.value = false
  }
  if (!user.username) {
    usernameIsEmpty.value = true
  }
  if (document.querySelector("input[name=password]").classList.contains("border-red-500") && user.password != '') {
    document.querySelector("input[name=password]").classList.remove("border-red-500")
    passwordError.value = false
  }
}

const updateOpenError = (value) => {
    openError.value = value
}

window.addEventListener('keydown', (event) =>{
  if (event.key === 'Enter') {
    login()
  }
})
</script>

<template>
  <div class="flex flex-col gap-5 p-[20px] h-screen justify-center items-center" @change="authorizeInput">
    <div class="flex flex-col gap-5 w-full justify-center items-center">
      <div class="font-bold text-[24px]">
        خوش آمدید
      </div>
      <div class="flex flex-col gap-2 max-w-[300px] w-full">
        <div class="relative">
          <input type="text" name="username"
            class="w-full border rounded px-2 p-2 focus:border-[#49b779] focus:outline-none"
            v-model="user.username">
          <span v-if="usernameIsEmpty" class="floating-label">نام کاربری</span>
        </div>
        <div class="relative">
          <input type="password" name="password"
            class="w-full border rounded px-2 p-2 focus:border-[#49b779] focus:outline-none"
            v-model="user.password" dir="ltr">
          <span v-if="passwordIsEmpty" class="floating-label">رمز عبور</span>
        </div>
      </div>
      <button type="button" v-on:click="login()"
        class="bg-[#49B779] font-bold rounded text-white max-w-[100px] w-full px-2 p-2">ورود</button>
    </div>
  </div>
  <Loading :loading="loading"></Loading>
  <error :errorMessage="errorMessage"  :openError="openError" @update="updateOpenError"></error>
</template>
<style scoped>
.floating-label {
  font-size: 16px;
  color: #cccccc;
  position: absolute;
  pointer-events: none;
  top: 10px;
  right: 10px;
  transition: all 0.1s ease;
}

input:focus~.floating-label {
  top: -8px;
  right: 5px;
  font-size: 11px;
  opacity: 1;
  color: #49b779;
  background: white
}
</style>