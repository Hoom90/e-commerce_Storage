<script setup>
import chasierIcon from "../assets/svg/attach.svg"
import storageIcon from "../assets/svg/bag.svg"
import statusIcon from "../assets/svg/badge.svg"
import logout from "../assets/svg/logout.svg"
import { onMounted, computed, reactive } from 'vue'
import store from '../store';
import router from '../config';
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)
const loggedIn = computed(() => {
  return store.state.auth.status.loggedIn;
})

const state = reactive({
  sidebar: false,
})

const links = reactive([
  {
    title: 'صندوق',
    url: '/',
    img: chasierIcon,
  },
  {
    title: 'انبارداری',
    url: '/warehouse',
    img: storageIcon,
  },
  {
    title: 'آمار',
    url: '/status',
    img: statusIcon,
  },
])

onMounted(() => {
  if (loggedIn) {
    router.push('/');
  }
})

const handleDropdown = () => {
  state.sidebar = !state.sidebar
}

const handleLogout = () => {
  store.dispatch('auth/logout')
  router.push('/login');
}

</script>
<template>
  <div class="fixed top-0 bg-slate-50 w-full shadow-[0px_3px_5px_#c9c9c9] z-10">
    <div class="flex justify-between items-center gap-5 py-5 px-8">

      <div class="flex justify-center items-center gap-3">
        <button @click="handleDropdown" class="p-2 border rounded hover:border-blue-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <span class="font-bold text-[20px]">دفتر حسابها</span>
      </div>
  
      <div class="flex items-center gap-4">
        <span>تاریخ امروز:</span>
        <span>{{ dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD') }}</span>
      </div>
  
      <div class="fixed top-0 right-0 bg-slate-50 -z-10 h-screen">
        <div class="h-[calc(100vh-80px)] mt-20 shadow-[0px_3px_3px_#c9c9c9] z-10 flex flex-col transition-all ease-in-out" :class="state.sidebar ? 'w-[150px]' : 'w-[50px]'">
          <div class="flex bg-slate-50 h-full flex-col">
            <RouterLink :to="item.url" active-class="bg-blue-500"
              class="border-b hover:bg-blue-600 text-center flex justify-around items-center transition-all"
              :class="state.sidebar ? 'px-3' : 'px-0'" v-for="item in links" :title="item.title">
              <img :src="item.img" :alt="item.img">
              <span :class="state.sidebar ? 'block' : 'hidden'" class="font-bold">{{ item.title }}</span>
            </RouterLink>
            <div class="h-full"></div>
            <button class="p-3 flex justify-around items-center hover:bg-red-500 hover:text-white"
              :class="state.sidebar ? 'px-3' : 'px-0'" @click="handleLogout" title="خروج">
              <img :src="logout" alt="logout">
              <span :class="state.sidebar ? 'block' : 'hidden'">خروج</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>



  <div class="overflow-auto mt-20 p-5 transition-all ease-in-out mr-12">
    <div class="h-[calc(100vh-120px)] max-w-[1200px] mx-auto">
      <slot></slot>
    </div>
  </div>
</template>
<style>
/* scrollbar */
::-webkit-scrollbar {
    width: 0;
}
</style>




