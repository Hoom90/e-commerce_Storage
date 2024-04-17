<script setup>
import modalComp from "../components/modalComp.vue"
import inventory from './warehouseView/inventory.vue'
import { onMounted, ref ,reactive } from 'vue'

const state = reactive({
    inventoryData: [],
    liquidityData: [],
    tab:1,
    loading:false,
})

const message = ref(null)
const IsModalOpen = ref(false)
const errorMessage = ref(null)
const stockAmount = ref(0)
const liquidity = ref(0)

onMounted(()=>{
    getData()
    if(state.inventoryData.length > 0){
        calculateLiquidity()
        calculateStockAmount()
    }
})

// Get All Items
const getData = async()=> {
    state.loading = true
    await axios.get(apiPath.storage.getAll)
    .then((res) => {
        state.inventoryData = res.data;
        message.value = 'کالایی یافت نشد!'
    })
    .catch((error) => {
        console.error(error);
        message.value = error
    })
    state.loading = false
}

const calculateLiquidity = () =>{
    let temp = 0
    state.inventoryData.forEach(item => {
        temp = parseInt(temp) + (parseInt(item.basePrice) * parseInt(item.amount))
    });
    liquidity.value = formatData(temp)
}

const calculateStockAmount = () =>{
    let temp = 0
    state.inventoryData.forEach(item =>{
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

</script>
<template>
    <main class="relative h-[80vh]">
        <!-- <button class="absolute w-full flex justify-between top-0 right-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button> -->

        <div class="flex justify-between border rounded">
            <p class="text-[24px] p-1 px-3">ثبت کالا</p>
            <div class="justify-center items-center gap-10 relative hidden sm:flex">
                <button class="flex justify-center items-center w-full h-full" @click="state.tab = 1">قیمت</button>
                <button class="flex justify-center items-center w-full h-full" @click="state.tab = 2">نقدینگی</button>
                <div class="border-b border-2 absolute -bottom-0 border-blue-500 transition-all ease-in-out" :class="state.tab == 1 ? '-right-1 w-[50px]' : 'right-[80px] w-[60px]'"></div>
            </div>
            <button class="flex justify-center items-center text-white rounded-l bg-teal-500 hover:bg-teal-600 px-2" @click="() =>{IsModalOpen = true}">
                <img :src="AddIconSVG" alt="+"/>
                <span>| کالای جدید</span>
            </button>
        </div>

        <div class="grid grid-flow-col grid-cols-2 mt-3 border rounded relative sm:hidden">
            <button class="p-3" @click="state.tab = 1">قیمت</button>
            <button class="p-3" @click="state.tab = 2">نقدینگی</button>
            <div class="border-b border-2 absolute -bottom-0 border-blue-500 transition-all ease-in-out w-1/2" :class="state.tab == 1 ? '-right-0' : 'right-1/2'"></div>
        </div>

        <inventory v-if="state.tab == 1" :data="state.inventoryData"/>
        <!-- <liquidity v-if="state.tab == 2"/> -->
    </main>
    <Loading v-if="state.loading"></Loading>
    <modalComp v-if="IsModalOpen" :IsModalOpen="IsModalOpen" @update:IsModalOpen="updateIsModalOpen">
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
    </modalComp>
</template>