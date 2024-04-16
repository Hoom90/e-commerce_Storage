<script setup>
// import SearchIconSVG from '../../assets/svg/searchIcon.svg'
const props = defineProps(['data'])
</script>
<template>
    <div class="w-full text-[12px] my-3 border rounded">


        <div class="flex justify-between items-center pl-3 border-b">
            <input type="text" class="outline-none bg-transparent block w-full p-3" placeholder="جستجوی نام کالا"
            @input="searchMainTable" id="TableSearchBox">
            <!-- <input type="text" class="outline-none px-1 bg-transparent hidden" placeholder="جستجوی" @input="searchLiquidityTable" id="TableSearchBox"> -->
            <!-- <img :src="SearchIconSVG" alt="SearchIconSVG"> -->
        </div>

        <!-- header -->
        <div class="flex h-[50px] text-center border-b">
            <div class="flex items-center justify-center w-full"
                v-for="item in ['رکورد', 'نام', 'فی(ریال)', 'تعداد(عدد)', 'تعداد(عدد)', 'تاریخ دریافت']">{{ item }}</div>
        </div>

        <!-- content -->
        <template v-if="props?.data?.length > 0">
            <div class="flex flex-col" id="tableData">
    
                <RouterLink :to="'/warehouse/' + data._id" v-for="(data, index) in props.data"
                    class="flex border-b hover:bg-gray-50 cursor-pointer" :key="index">
                    <div class="py-2 px-3 flex justify-center items-center w-1/5">{{ index + 1 }}</div>
                    <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">{{ data.name }}</div>
                    <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r bg-green-200">
                        {{ data.salesPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</div>
                    <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">{{ data.amount }}</div>
                    <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">
                        <span dir='ltr'>{{ data.date.replace('-', '/').replace('-', '/') }}</span>
                    </div>
                </RouterLink>
    
            </div>
        </template>
        <template v-else>
            <p class="text-lg font-bold h-20 flex items-center justify-center">موجودی ای یافت نشد</p>
        </template>
    </div>
</template>