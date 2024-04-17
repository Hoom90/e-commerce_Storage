<script setup>
import { reactive } from 'vue';
import tab1Comp from "./addTransactionComp/tab1Comp.vue"
import tab2Comp from "./addTransactionComp/tab2Comp.vue"
const props = defineProps(['income','outcome'])
const emits = defineEmits(['closeForm','postEarning','postExpense'])
const state = reactive({
    tabStatus : false,
})
</script>
<template>
    <modalComp @blur="(value) => emits('closeForm',value)" class="bg-white w-[500px] h-[550px] rounded shadow-lg p-10 z-20">
        <p class="text-[24px] font-bold text-center mb-3">ثبت تراکنش جدید</p>

        <div class="flex justify-center items-center">
            <div class="relative flex justify-center items-center gap-10">
                <button type="button" @click="state.tabStatus = !state.tabStatus">ورودی</button>
                <button type="button" @click="state.tabStatus = !state.tabStatus">خروجی</button>
                <div class="border-b border-2 absolute -bottom-1 border-blue-500 transition-all ease-in-out" :class="!state.tabStatus ? '-right-1 w-[50px]' : 'right-[80px] w-[60px]'"></div>
            </div>
        </div>

        <tab1Comp v-if="!state.tabStatus" :income="props.income" @postEarning="(value)=>emits('postEarning',value)"/>
        <tab2Comp v-if="state.tabStatus" :outcome="props.outcome" @postExpense="(value)=>emits('postExpense',value)"/>
    </modalComp>
</template>