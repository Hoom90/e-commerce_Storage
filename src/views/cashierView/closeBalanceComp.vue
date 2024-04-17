<script setup>
const emits = defineEmits(['close'])
</script>
<template>
    <modalComp @blur="(value) => emits('close',value)" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <div class="bg-white w-[300px] h-[280px] rounded shadow-lg p-10 z-20">
            <p class="text-[24px] font-bold mb-3 text-center">
                آیا مطمئن به بستن حساب امروز هستید؟
            </p>
            <div class="flex justify-center items-center gap-3 mt-10">
                <button class="p-1 px-3 bg-blue-500 rounded text-white w-[200px] h-[50px] transition-all hover:scale-105 hover:bg-blue-600">بله</button>
                <button class="p-1 px-3 border border-red-500 bg-white rounded text-red-500 w-[200px] h-[50px] transition-all hover:bg-red-500 hover:text-white hover:scale-105" @click="emits('close',false)">خیر</button>
            </div>
        </div>
    </modalComp>
</template>