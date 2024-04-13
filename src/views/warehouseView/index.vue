<script setup>
import AddIconSVG from '../assets/addIcon.svg'
import SearchIconSVG from '../assets/searchIcon.svg'
import InfoIconSVG from '../assets/infoIcon.svg'
import { onMounted, ref ,reactive } from 'vue'
import Loading from '../components/loading.vue'
import Modal from '../components/wareHouseModal.vue'
import axios from 'axios'
import apiPath from '../composables/api-path'

const state = reactive({
    tab:false,
})

const dbData = ref(null)
const message = ref(null)
const loading = ref(false)
const IsModalOpen = ref(false)
const errorMessage = ref(null)
const stockAmount = ref(0)
const liquidity = ref(0)

onMounted(()=>{
    init()
})

const init = async() =>{
    loading.value = true
    dbData.value = null
    stockAmount.value = 0
    liquidity.value = 0
    await getData()
    if(dbData.value){
        calculateLiquidity()
        calculateStockAmount()
    }
    loading.value = false
}

// Get All Items
const getData = async()=> {
    await axios.get(apiPath.storage.getAll)
    .then((res)=>{
        if(res.data.length != 0){
            dbData.value = res.data;
        }
        else{
            loading.value = false
            message.value = 'کالایی یافت نشد!'
        }
    })
    .catch(function (error) {
        console.log(error);
        message.value = error
        loading.value = false
    })
}

const calculateLiquidity = () =>{
    let temp = 0
    dbData.value.forEach(item => {
        temp = parseInt(temp) + (parseInt(item.basePrice) * parseInt(item.amount))
    });
    liquidity.value = formatData(temp)
}

const calculateStockAmount = () =>{
    let temp = 0
    dbData.value.forEach(item =>{
     temp = parseInt(temp) + parseInt(item.amount)
    })
    stockAmount.value = formatData(temp)
}

// turn string to currency
const formatData = (data) => {
  return (data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
};

const searchMainTable = () => {
    let filter,table, li, a, i, txtValue;
    let search = document.querySelectorAll('#TableSearchBox')[0]
    filter = search.value.toUpperCase();
    table = document.querySelectorAll('#tableData')[0];
    li = table.children
    for (i = 0; i < li.length; i++) {
        a = li[i].children[1];
        txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

const searchLiquidityTable = () =>{
    let filter,table, li, a, i, txtValue;
    let search = document.querySelectorAll('#TableSearchBox')[1]
    filter = search.value.toUpperCase();
    table = document.querySelectorAll('#tableData')[1];
    li = table.children
    for (i = 0; i < li.length; i++) {
        a = li[i].children[1];
        txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            a = li[i].children[2];
            txtValue = a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                a = li[i].children[5];
            txtValue = a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
            }
        }
    }
}

const handleTableNav = (flag) =>{
    let tables = document.querySelectorAll('#TableBody')
    let tableNavs = document.querySelectorAll('#TableNav')
    let tableSearchBoxs = document.querySelectorAll('#TableSearchBox')
    if(flag){
        tables[0].classList.replace('block','hidden')
        tables[1].classList.replace('hidden','block')

        tableNavs[0].classList.replace('border-blue-500','hover:border-blue-500')
        tableNavs[1].classList.replace('hover:border-blue-500','border-blue-500')

        tableSearchBoxs[0].classList.replace('block','hidden')
        tableSearchBoxs[1].classList.replace('hidden','block')
    }
    else{
        tables[0].classList.replace('hidden','block')
        tables[1].classList.replace('block','hidden')

        tableNavs[0].classList.replace('hover:border-blue-500','border-blue-500')
        tableNavs[1].classList.replace('border-blue-500','hover:border-blue-500')

        tableSearchBoxs[0].classList.replace('hidden','block')
        tableSearchBoxs[1].classList.replace('block','hidden')
    }
}

const updateIsModalOpen = (value) =>{
    IsModalOpen.value = value
}

init()
</script>
<template>
    <main class="relative h-[80vh]">
        <!-- <button class="absolute w-full flex justify-between top-0 right-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button> -->

        <div class="flex justify-between border rounded">
            <p class="text-[24px] p-1 px-5">ثبت کالا</p>
            <div class="flex justify-center items-center gap-10 relative">
                <button class="flex justify-center items-center w-full h-full" @click="state.tab = !state.tab">قیمت</button>
                <button class="flex justify-center items-center w-full h-full" @click="state.tab = !state.tab">نقدینگی</button>
                <div class="border-b border-2 absolute -bottom-0 border-blue-500 transition-all ease-in-out" :class="state.tab ? '-right-1 w-[50px]' : 'right-[80px] w-[60px]'"></div>
            </div>
            <div class="flex">
                
                <button class="flex justify-center items-center text-white rounded-l bg-blue-500 hover:bg-blue-600 px-2" @click="() =>{IsModalOpen = true}">
                    <img :src="AddIconSVG" alt="+"/>
                    <span>| کالای جدید</span>
                </button>
            </div>
        </div>

        <div class="my-3 border">
            <!-- main table -->
            <div v-if="state.tab" class="w-full text-[12px]">
                
                <!-- header -->
                <div class="flex h-[50px] text-center">
                    <div class="flex items-center justify-center w-full" v-for="item in ['رکورد','نام','فی(ریال)','تعداد(عدد)','تعداد(عدد)','تاریخ دریافت']">{{item}}</div>
                </div>
                <div class="flex justify-between items-center border px-[10px]">
                    <input type="text" class="outline-none px-1 bg-transparent block w-[200px]" placeholder="جستجوی نام کالا" @input="searchMainTable" id="TableSearchBox">
                    <!-- <input type="text" class="outline-none px-1 bg-transparent hidden" placeholder="جستجوی" @input="searchLiquidityTable" id="TableSearchBox"> -->
                    <img :src="SearchIconSVG" alt="SearchIconSVG">
                </div>
                <!-- content --> 
                <div class="flex flex-col" id="tableData">

                    <RouterLink :to="'/warehouse/' + data._id" v-for="(data, index) in dbData" class="flex border-b hover:bg-gray-50 cursor-pointer" v-bind:key="index">
                        <div class="py-2 px-3 flex justify-center items-center w-1/5">{{ index + 1 }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">{{ data.name }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r bg-green-200">
                            {{ data.salesPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">{{ data.amount }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">
                            <span dir='ltr'>{{ data.date.replace('-','/').replace('-','/') }}</span>
                        </div>
                    </RouterLink>

                </div>
            </div>
            <!-- liquidity table -->
            <div v-if="!state.tab" class="w-full text-[12px]">
                <!-- <div class="flex gap-1 text-red-500 px-3 border-b">
                    <img :src="InfoIconSVG" alt="i">
                    <span>نام کالا ، فروشنده ، نقدینگی قابل جستجو میباشد</span>
                </div> -->
                <!-- header -->
                <div class="flex h-[50px] text-center">
                    <div class="flex items-center justify-center w-full" v-for="item in ['رکورد','نام','فروشنده','تعداد(عدد)','تاریخ دریافت','نقدینگی']">{{ item }}</div>
                </div>
                <!-- content --> 
                <div class="flex flex-col" id="tableData">

                    <RouterLink :to="'/warehouse/' + data._id" v-for="(data, index) in dbData" class="flex border-b hover:bg-gray-50 cursor-pointer" v-bind:key="index">
                        <div class="py-2 px-3 flex justify-center items-center w-1/6">{{ index + 1 }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">{{ data.name }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r bg-green-200">{{ data.sellerName }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">{{ data.amount }}</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">
                            <span dir='ltr'>{{ data.date.replace('-','/').replace('-','/') }}</span>
                        </div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r bg-green-200">{{ data.liquidity.replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</div>
                    </RouterLink>

                </div>
            </div>
        </div>
    </main>
<Loading v-if="loading"></Loading>
<Modal v-if="IsModalOpen" :IsModalOpen="IsModalOpen" @update:IsModalOpen="updateIsModalOpen"></Modal>
</template>
<style scoped>
input{
    padding: 5px;
}
</style>