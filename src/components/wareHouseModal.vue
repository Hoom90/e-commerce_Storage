<script setup>
import { getCurrentInstance } from 'vue'
import {RouterLink} from 'vue-router'
import ArrowIconSVG from '../assets/arrowLeftIcon.svg'

const { emit } = getCurrentInstance()
const handleIsModalOpen = () =>{
    emit('update:IsModalOpen', false);
}

</script>

<template>
  <div class="absolute w-full h-screen top-0 left-0 z-50 bg-white px-[20px]">
    <div class="flex flex-nowrap justify-center items-center w-full gap-1 h-screen text-white ">
        <button class="flex justify-center items-center bg-red-500 hover:bg-red-600 w-[50px] h-[50px] rounded absolute top-5 right-5" @click="handleIsModalOpen">
            <img :src="ArrowIconSVG" alt="x">
        </button>
        <RouterLink to="/warehouse/newItem" class="flex justify-center items-center bg-blue-500 hover:bg-blue-600 w-[200px] h-[100px] rounded">
            افزودن تک کالا
        </RouterLink>
        <RouterLink to='/warehouse/newlist' class="flex justify-center items-center bg-teal-500 hover:bg-teal-600 w-[200px] h-[100px] rounded">
            افزودن فاکتور
        </RouterLink>
        <RouterLink to='/warehouse/newOrder' class="flex justify-center items-center bg-green-500 hover:bg-green-600 w-[200px] h-[100px] rounded">
            افزودن فروش
        </RouterLink>
    </div>
</div>
</template>