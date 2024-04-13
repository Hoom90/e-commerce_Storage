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

    <div class="flex justify-start items-center gap-3 py-5 px-8">
      <button @click="handleDropdown" class="p-2 border rounded hover:border-blue-500">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <span class="font-bold text-[20px]">دفتر حسابها</span>
    </div>

    <div v-if="state.sidebar" class="absolute top-20 left-0 w-screen h-screen transition-all ease-in-out" @click="handleDropdown">
      <div class="flex flex-col w-full shadow-[0px_3px_5px_#c9c9c9] transition-all ease-in-out duration-500">
        <div class="flex bg-slate-50 h-full w-full flex-col">
          <div class=" my-5 mx-8 p-3 border rounded">
            <p>کاربر: محمد مهدوی</p>
            <div class="flex items-center gap-4 mt-3">
              <span>تاریخ امروز:</span>
              <span>{{ dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD') }}</span>
            </div>
          </div>
          <RouterLink :to="item.url" active-class="bg-blue-500"
            class="border-b hover:bg-blue-600 text-center w-full flex justify-start items-center transition-all px-8"
            :class="state.sidebar ? 'px-3' : 'px-0'" v-for="item in links" :title="item.title">
            <img :src="item.img" :alt="item.img">
            <span class="font-bold">{{ item.title }}</span>
          </RouterLink>
          <div class="h-full"></div>
          <button class="flex justify-start items-center w-full hover:bg-red-500 hover:text-white px-8"
            :class="state.sidebar ? 'px-3' : 'px-0'" @click="handleLogout" title="خروج">
            <img :src="logout" alt="logout">
            <span>خروج</span>
          </button>
        </div>
      </div>
    </div>

  </div>



  <div class="overflow-auto mr-auto transition-all ease-in-out mt-20 p-5">
    <div class="w-full h-[calc(100vh-120px)]">
      <slot></slot>
    </div>
  </div>
</template>