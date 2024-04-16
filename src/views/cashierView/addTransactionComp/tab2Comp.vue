<script setup>
import { computed, reactive } from 'vue';

const props = defineProps(['outcome'])
const emits = defineEmits(['postExpense'])
const state = reactive({
    outcome: {
        receiverNameOut: null,
        typeOut: null,
        paidOut: null,
        descriptionOut: null,
    },
})

state.outcome = computed(()=>{return props.outcome})

</script>
<template>
    <div class="mb-3">
        <span>نام:</span>
        <input type="text" class="w-full p-1 px-2 outline-none border rounded" placeholder="نام" v-model="state.outcome.receiverNameOut">
    </div>
    <div class="mb-3">
        <span>مقدار:</span>
        <div class="grid gap-3">
            <select v-model="state.outcome.typeOut" class="w-full p-1 px-2 outline-none border rounded">
                <option v-for="item in ['کارت به کارت', 'چک1', 'چک2', 'نقدی']" :value="item">{{ item }}</option>
            </select>
            <div class="flex items-center border rounded w-full">
                <input type="text" class="w-full p-1 px-2 outline-none border-l" placeholder="هزینه" v-model="state.outcome.paidOut">
                <span>(ریال)</span>
            </div>
        </div>
    </div>
    <div class="mb-3">
        <span>توضیحات:</span>
        <textarea type="text" v-model="state.outcome.descriptionOut" placeholder="توضیحات" rows="5" class="border rounded p-2 w-full outline-none col-span-3 resize-none"></textarea>
    </div>
    <div>
        <button type="button" class="bg-blue-500 text-white p-2 px-3 rounded w-full hover:bg-blue-600 shadow-md hover:shadow-none" @click="emits('postExpense', state.outcome)">ذخیره</button>
    </div>
</template>