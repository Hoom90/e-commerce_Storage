<script setup>
import store from '../store';

import { ref } from 'vue'
import CloseIconSVG from '../assets/removeIcon.svg'
import SearchIconSVG from '../assets/searchIcon.svg'
import PlusIconSVG from '../assets/addIcon.svg'
import MinusIconSVG from '../assets/reduceIcon.svg'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import router from '../config'
import axios from 'axios'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

const dbData = ref(null)
const balanceData = ref(null)
const message = ref(null)
const loading = ref(false)

let name = ref(null)
let amount = ref(null)
let type = ref(null)
let credit = ref(null)
const getData = async () => {
    loading.value = true
    await getDBData()
    await getBalanceData()
    loading.value = false
}

// Get All Items
const getDBData = async () =>{
    await axios.get(serverURL + "/api/itemTransaction/")
    .then((res)=>{
        dbData.value = res.data;
    })
    .catch(function (error) {
        console.log(error)
        loading.value = false
        message.value = error
    })
}

// Get Last Balance 
const getBalanceData = async() =>{
    balanceData.value = null
    await axios.get(serverURL + "/api/balanceTransaction/" + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD'))
    .then((Response)=>{
        if(Response.data.length !=0 ){
            balanceData.value = Response.data[0]
        }
        else{
            balanceData.value = {
                'balance': null,
            }
        }
    })
    .catch(function (error) {
        console.log(error);
        loading.value = false
        message.value = error
    })
}

const putData = async () => {
    loading.value = true
    let id , price , body , dbAmount , profit;
    if(!amount.value){
        loading.value = false
        return;
    }
    dbData.value.forEach(item => {
        if(name.value === item.name){
            id = item._id
            price = item.price
            dbAmount = item.amount
            profit = item.profit
        }
    });
    if(amount.value > dbAmount){
        loading.value = false
        message.value = 'مقدار غیر مجاز!'
        return;
    }
    let income = parseInt(price) * parseInt(amount.value)
    let outcome = '0'
    let balance = balanceData.value.balance ? (parseInt(balanceData.value.balance) + (income)).toString() : (income).toString()
    let description = 'فروش کالا'
    if(credit.value){
        description = 'نسیه کالا به ' + credit.value
    }
    amount.value = dbAmount - amount.value
    body = {
        'income': income,
        'outcome': outcome,
        'balance': balance,
        'description' : description,
        'profit' : profit,
        'amount': amount.value.toString(),
        'date': dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    }
    await axios.put(serverURL + "/api/itemTransaction/" + id, body,{headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    }})
    .catch((error) => {
        console.log(error);
        message.value = error
    }).finally(
        loading.value = false,
        router.push('/')
    )
}

const searchBox = ref(null)
const searchWord = () => {
    // Declare variables
    let filter, li, a, i, txtValue;
    filter = searchBox.value.value.toUpperCase();
    li = document.querySelectorAll('#itemData');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

const handleClickData = (index) => {
    name.value = dbData.value[index].name
    // amount.value = dbData.value[index].amount
    amount.value = '0'
    let length = dbData.value.length
    for (let i = 0; i < length; i++) {
        document.querySelector('button[name=item' + i + ']').classList.replace("border-blue-500", "border-gray-200")
    }
    document.querySelector('button[name=item' + index + ']').classList.replace('border-gray-200', 'border-blue-500');
}

const handleIncrease = () =>{
    if(amount.value){
        amount.value = parseInt(amount.value) + 1
    }
}

const handleDecrease = () =>{
    if(amount.value){
        if(amount.value > 0){
            amount.value = parseInt(amount.value) - 1
        }
    }
}

getData()
</script>
<template>
    <!-- add new sells or return -->
    <div class="w-full py-[20px] relative">
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="max-w-[400px] mx-auto my-[20px] border rounded-md p-[10px]">
            <!-- header -->
            <div class="flex justify-center">
                <div class="flex items-center">
                    <RouterLink to="/warehouse" class="flex gap-1 items-center hover:bg-red-500 hover:text-white border border-red-500 rounded-md p-2">
                        <img :src="CloseIconSVG" alt="CloseIconSVG">
                    </RouterLink>
                </div>
                <div class="flex w-full justify-center">
                    <span class="flex justify-center my-3 text-[20px] font-bold">ثبت فروش/عودت</span>
                </div>
            </div>

            <!-- search -->
            <div class="flex flex-col gap-1 my-1" v-if="dbData != null">
                <!-- search input -->
                <div class="flex gap-1 items-center border rounded px-1">
                    <input type="text" ref="searchBox" class="outline-none min-w-[300px] w-full"
                        placeholder="جستجو در بین کالاهای موجود" @keyup="searchWord">
                    <img :src="SearchIconSVG" alt="SearchIconSVG">
                </div>
                <!-- search result -->
                <div
                    class="w-full grid overflow-y-scroll max-h-[200px]">
                    <button class="border" :class="item.amount == '0' ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white ' : 'border-gray-200 hover:bg-[#c9c9c9] odd:bg-[#f6f6f6]'" v-for="(item, index) in dbData"
                        @click="handleClickData(index)" :name="'item' + index" id="itemData" v-bind:key='index'>
                        <div class='flex justify-between gap-1 p-[10px] text-[12px] truncate'>
                            <span>{{ item.name }}</span>
                            <span dir="ltr">{{ item.amount == "0" ? 'ناموجود' : item.amount}}</span>
                        </div>
                    </button>
                </div>
            </div>
            <div class="flex justify-center gap-1 my-1 border rounded-md p-3" v-if="dbData != null && dbData.length == 0">
                هیچ کالایی یافت نشد
            </div>

            <!-- form -->
            <div>
                <div class="flex flex-col">
                    <p>
                        <span>نام</span><span class="text-red-500">*</span>
                    </p>
                    <input type="text" class="border rounded outline-none px-1" placeholder="نام کالا" v-model="name" disabled>
                </div>
                <div class="flex flex-col">
                    <span>تعداد</span>
                    <div class="flex gap-1">
                        <button @click="handleIncrease" class="rounded p-2 bg-blue-500 text-white">
                            <img :src="PlusIconSVG" alt="PlusIconSVG">
                        </button>
                        <input type="text" class="border rounded outline-blue-300 px-1 text-center" placeholder="تعداد کالا" v-model="amount" :disabled="amount ? false : true">
                        <button @click="handleDecrease" class="rounded p-2 text-center bg-red-500 text-white">
                            <img :src="MinusIconSVG" alt="MinusIconSVG">
                        </button>
                    </div>
                </div>
                <div class='flex flex-col gap-1'>
                    <span>نسیه</span>
                    <input type="text" class="border rounded outline-blue-300 px-1" placeholder="به چه کسی نسیه داده شده است" v-model="credit" :disabled="amount ? false : true">
                </div>
            </div>

            <div class="w-full flex justify-end items-center mt-[10px]">
                <button @click="putData"
                    class="border bg-blue-500 hover:bg-blue-600 text-white p-1 w-1/2 lg:w-[200px] rounded">ثبت</button>
            </div>
        </div>
    </div>
    <Loading v-if="loading"></Loading>
</template>

<style scoped>
input {
    padding: 5px
}</style>