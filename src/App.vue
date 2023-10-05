<script setup>
import { onMounted, ref , computed } from 'vue'
import store from './store';
import router from './router';
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

const flag = ref(false)
const handleDropdown = () => {
  if (flag.value) {
    document.querySelector("div[name=menu]").classList.replace('flex', 'hidden')
    flag.value = false
  }
  else {
    document.querySelector("div[name=menu]").classList.replace('hidden', 'flex')
    flag.value = true
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

    <div class="fixed top-0 bg-[#49b779] w-full h-[10svh] border-b flex justify-between items-center gap-5 px-[20px]">      
      <div class="md:hidden">
        <button @click="handleDropdown" class="p-2 border rounded">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <div class="hidden absolute top-[10svh] py-[10px] bg-white w-full" name="menu">
          <RouterLink to="/" exact-active-class="bg-blue-500" class="p-2 px-3 border-b">میزکار</RouterLink>
          <RouterLink to="/warehouse" exact-active-class="bg-blue-500" class="p-2 px-3 border-b">ثبت کالا</RouterLink>
          <RouterLink to="/cashier" exact-active-class="bg-blue-500" class="p-2 px-3 border-b">صندوق</RouterLink>
          <RouterLink to="/status" exact-active-class="bg-blue-500" class="p-2 px-3 border-b">آمار</RouterLink>
        </div>
      </div>
        دفتر حسابها
      <div class="flex items-center gap-4">
        <span>{{ dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD') }}</span>
        <button class="bg-white rounded p-1 px-2 hover:bg-gray-100" @click="handleLogout">خروج</button>
      </div>
    </div>

    <div class="mt-[10svh] w-full flex h-[90svh]">
      <div class="bg-white h-full shadow-[0px_10px_10px_#c9c9c9] z-10 flex flex-col">
        <div class="hidden md:flex bg-white h-full flex-col">
          <RouterLink to="/" active-class="bg-blue-500" class="p-2 px-3 border-b hover:bg-blue-600 text-center">میزکار</RouterLink>
          <RouterLink to="/warehouse" active-class="bg-blue-500" class="p-2 px-3 border-b hover:bg-blue-600 text-center">ثبت کالا</RouterLink>
          <RouterLink to="/cashier" active-class="bg-blue-500" class="p-2 px-3 border-b hover:bg-blue-600 text-center">صندوق</RouterLink>
          <RouterLink to="/status" active-class="bg-blue-500" class="p-2 px-3 border-b hover:bg-blue-600 text-center">آمار</RouterLink>
        </div>
      </div>
      <div class="w-full overflow-auto">
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