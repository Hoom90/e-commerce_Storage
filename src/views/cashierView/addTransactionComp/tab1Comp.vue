<script setup>
import { reactive,computed } from 'vue';

const props = defineProps(['income'])
const emits = defineEmits(['postEarning'])
const state = reactive({
    income:{
        receiverNameIn:null,
        typeIn:null,
        paidIn:null,
        descriptionIn:null,
    }
})

state.income = computed(()=>{return props.income})
</script>
<template>
    <div class="mb-3">
        <span>حساب:</span>
        <input type="text" placeholder="نام مالک حساب" class="w-full p-1 px-2 outline-none border rounded" v-model="state.income.receiverNameIn">
    </div>
    <div class="mb-3">
        <span>مقدار:</span>
        <div class="grid gap-3">
            <select v-model="state.income.typeIn" class="w-full p-1 px-2 outline-none bg-transparent border rounded">
                <option v-for="item in ['کارتخوان1', 'کارتخوان2', 'بیسیم1', 'بیسیم2', 'چک1', 'چک2', 'نقدی']" :value="item">{{ item }}</option>
            </select>
            <div class="flex items-center border rounded w-full">
                <input type="text" placeholder="0" class="w-full p-1 px-2 outline-none border-l" v-model="state.income.paidIn" dir="ltr">
                <span>(ریال)</span>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <span>توضیحات:</span>
        <textarea type="text" v-model="state.income.descriptionIn" placeholder="توضیحات" rows="5" class="border rounded p-2 w-full outline-none col-span-3 resize-none"></textarea>
    </div>
    <div>
        <button type="button" class="bg-blue-500 text-white p-2 px-3 rounded w-full hover:bg-blue-600 shadow-md hover:shadow-none" @click="emits('postEarning', state.income)">ذخیره</button>
    </div>
</template>