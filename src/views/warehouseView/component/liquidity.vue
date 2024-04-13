<script setup>
const props = defineProps(['data'])
</script>
<template>
    <div class="w-full text-[12px]">
        <!-- <div class="flex gap-1 text-red-500 px-3 border-b">
                    <img :src="InfoIconSVG" alt="i">
                    <span>نام کالا ، فروشنده ، نقدینگی قابل جستجو میباشد</span>
                </div> -->
        <!-- header -->
        <div class="flex h-[50px] text-center">
            <div class="flex items-center justify-center w-full"
                v-for="item in ['رکورد', 'نام', 'فروشنده', 'تعداد(عدد)', 'تاریخ دریافت', 'نقدینگی']">{{ item }}</div>
        </div>
        <!-- content -->
        <div class="flex flex-col" id="tableData">

            <RouterLink :to="'/warehouse/' + data._id" v-for="(data, index) in props.data" class="flex border-b hover:bg-gray-50 cursor-pointer" :key="index">
                <div class="py-2 px-3 flex justify-center items-center w-1/6">{{ index + 1 }}</div>
                <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">{{ data.name }}</div>
                <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r bg-green-200">{{ data.sellerName
                    }}</div>
                <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">{{ data.amount }}</div>
                <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">
                    <span dir='ltr'>{{ data.date.replace('-', '/').replace('-', '/') }}</span>
                </div>
                <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r bg-green-200">{{
                    data.liquidity.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</div>
            </RouterLink>

        </div>
    </div>
</template>