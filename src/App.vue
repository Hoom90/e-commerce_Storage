<script setup>
import { onMounted, ref , computed } from 'vue'
import store from './store';
import router from './config';
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

const loggedIn = computed(() => {
  return store.state.auth.status.loggedIn;
})

onMounted(()=>{
  if (loggedIn) {
    router.push('/');
  }
})

const handleDropdown = () => {
  if (document.getElementById("dropdown").classList.contains('hidden')) {
    document.getElementById("dropdown").classList.replace('hidden', 'flex')
    document.getElementById("container").classList.add('-z-10')
  }
  else {
    document.getElementById("dropdown").classList.replace('flex', 'hidden')
    document.getElementById("container").classList.remove('-z-10')
  }
}

const handleLogout = () =>{
  store.dispatch('auth/logout')
  router.push('/login');
}

</script>
<template>
  <div class="w-full overflow-auto" v-if="!loggedIn">
    <RouterView></RouterView>
  </div>
  <div class="overflow-hidden" v-else>

    <div class="fixed top-0 bg-slate-50 w-full h-[10svh] shadow-[0px_3px_5px_#c9c9c9] flex justify-between items-center gap-5 px-[20px]">      
      <div class="md:hidden">
        <button @click="handleDropdown" class="p-2 border rounded">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <div class="hidden absolute left-0 top-[10svh] bg-slate-50 shadow-[0px_5px_5px_#c9c9c9] w-full px-[20px]" id="dropdown" @click="handleDropdown">
          <RouterLink to="/" exact-active-class="bg-blue-500" class="p-2 px-3 border-b">صندوق</RouterLink>
          <RouterLink to="/warehouse" exact-active-class="bg-blue-500" class="p-2 px-3 border-b">انبارداری</RouterLink>
          <RouterLink to="/status" exact-active-class="bg-blue-500" class="p-2 px-3 border-b">آمار</RouterLink>
        </div>
      </div>
        دفتر حسابها
      <div class="flex items-center gap-4">
        <span>{{ dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD') }}</span>
        <button class="bg-white border border-red-500 rounded p-1 px-2 hover:bg-red-500 hover:text-white" @click="handleLogout">خروج</button>
      </div>
    </div>

    <div class="mt-[10svh] w-full flex h-[90svh]">
      <div class="bg-white h-full shadow-[0px_3px_3px_#c9c9c9] z-10 flex flex-col">
        <div class="hidden md:flex bg-slate-50 h-full flex-col">
          <RouterLink to="/" active-class="bg-blue-500" class="p-2 px-3 border-b hover:bg-blue-600 text-center">صندوق</RouterLink>
          <RouterLink to="/warehouse" active-class="bg-blue-500" class="p-2 px-3 border-b hover:bg-blue-600 text-center">انبارداری</RouterLink>
          <RouterLink to="/status" active-class="bg-blue-500" class="p-2 px-3 border-b hover:bg-blue-600 text-center">آمار</RouterLink>
        </div>
      </div>
      <div class="w-full overflow-auto" id="container">
        <RouterView></RouterView>
      </div>
    </div>
  </div>
</template>
<style scoped>
  /* scrollbar */
  ::-webkit-scrollbar {
  width: 0;
}
</style>