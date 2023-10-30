<script setup>
import AddIconSVG from '../assets/addIcon.svg'
import SearchIconSVG from '../assets/searchIcon.svg'
import InfoIconSVG from '../assets/infoIcon.svg'
import { onMounted, ref } from 'vue'
import Loading from '../components/loading.vue'
import Modal from '../components/wareHouseModal.vue'
import serverURL from '../config/serverAddress'
import axios from 'axios'

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
    await axios.get(serverURL + "/api/itemTransaction/")
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
    <main class="flex flex-col pt-[25px] justify-center items-center relative">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between -z-10">
            <span>ثبت کالا</span>
        </div>
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>

        <div class="w-[90%]">
            <!-- tools -->
            <div class="flex">
                <div class="flex w-1/3 ml-2">
                    <button class="flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 px-2" @click="() =>{IsModalOpen = true}">
                        <img :src="AddIconSVG" alt="+"/>
                    </button>
                    
                    <div class="flex justify-between items-center border w-full px-[10px]">
                        <input type="text" class="outline-none px-1 w-2/3 bg-transparent block" placeholder="جستجوی نام کالا" @input="searchMainTable" id="TableSearchBox">
                        <input type="text" class="outline-none px-1 w-2/3 bg-transparent hidden" placeholder="جستجوی" @input="searchLiquidityTable" id="TableSearchBox">
                        <img :src="SearchIconSVG" alt="SearchIconSVG">
                    </div>
                </div>
                <div class="w-1/3 flex justify-center items-center">
                    <button class="flex justify-center items-center border-b-2 border-blue-500 w-full h-full" id="TableNav" @click="handleTableNav(false)">قیمت</button>
                </div>
                <div class="w-1/3 flex justify-center items-center">
                    <button class="flex justify-center items-center border-b-2 hover:border-blue-500 w-full h-full" id="TableNav" @click="handleTableNav(true)">نقدینگی</button>
                </div>
            </div>

            <!-- body -->
            <div class="w-full mt-3">
                <!-- main table -->
                <div v-if="dbData != null" class="border overflow-auto max-h-[400px] text-[12px] block" id="TableBody">
                    <!-- header -->
                    <div class="flex border-b">

                        <div class="py-2 px-3 flex justify-center items-center w-1/5">رکورد</div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">نام
                        </div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">فی(ریال)
                        </div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">تعداد(عدد)
                        </div>
                        <div class="py-2 px-3 flex justify-center items-center w-1/5 border-r">تاریخ دریافت</div>
                        
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
                <div v-if="dbData != null" class="overflow-auto max-h-[400px] text-[12px] hidden" id="TableBody">
                    <div class="flex items-center justify-start gap-1 text-red-500">
                        <img :src="InfoIconSVG" alt="i">
                        <span>نام کالا ، فروشنده ، نقدینگی قابل جستجو میباشد</span>
                    </div>
                    <div class="border">
                        <!-- header -->
                        <div class="flex border-b">

                            <div class="py-2 px-3 flex justify-center items-center w-1/6">رکورد</div>
                            <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">نام</div>
                            <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">فروشنده</div>
                            <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">تعداد(عدد)</div>
                            <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">تاریخ دریافت</div>
                            <div class="py-2 px-3 flex justify-center items-center w-1/6 border-r">نقدینگی</div>

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