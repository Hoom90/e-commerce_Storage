<script setup>
import { ref } from 'vue'
import Loading from '../commons/loading.vue'
import serverURL from '../router/serverAddress'
import error from '../commons/error.vue'
import CloseIcon from '../commons/removeIcon.vue'
import Search from '../commons/searchIcon.vue'
import AuthService from "../services/auth.service"
import PlusIcon from '../commons/addIcon.vue'
import MinusIcon from '../commons/reduceIcon.vue'
import router from '../router'
import route from '../router'
import axios from 'axios'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

let name = ref(null)
let amount = ref(null)
let type = ref(null)

const dbData = ref(null)
const balanceData = ref(null)
const loading = ref(false)
const openError = ref(false)
const errorMessage = ref(null)
const getData = async () => {
    loading.value = true
    await axios.get(serverURL + "/api/itemTransaction/")
        .then((res)=>{
            dbData.value = res.data;
        })
        .catch(function (error) {
            console.log(error);
        })
    await axios.get(serverURL + "/api/balanceTransaction/").then((Response)=>{
        balanceData.value = Response.data
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(
            loading.value = false
        )
}

const putData = async () => {
    // loading.value = true
    let id , price , body , dbAmount;
    if(!amount.value)return;
    dbData.value.forEach(item => {
        if(name.value === item.name){
            id = item._id
            price = item.price
            dbAmount = item.amount
        }
    });
    let income = balanceData.value.income
    let outcome = balanceData.value.outcome
    let balance = balanceData.value.balance
    let tempVal = parseInt(price) * (parseInt(amount.value) - parseInt(dbAmount))
    if(tempVal < 0){
        tempVal = tempVal * -1
        income = (parseInt(income) + parseInt(tempVal)).toString()
        balance = (parseInt(balance) + parseInt(tempVal)).toString()
        if(outcome > 0){
            outcome = (parseInt(outcome) - parseInt(tempVal)).toString()
        }
        else{
            outcome = outcome
        }
    }
    else if(tempVal > 0){
        if(parseInt(balance) - parseInt(tempVal) > 0){
            income = (parseInt(income) - parseInt(tempVal)).toString()
            balance = (parseInt(balance) - parseInt(tempVal)).toString()
            if(outcome > 0){
                outcome = (parseInt(outcome) + parseInt(tempVal)).toString()
            }
            else{
                outcome = outcome
            }
        }
        else{
            console.log('low budget');
            // low budget
            return
        }
    }
    else{
        income = income
        outcome = outcome
        balance = balance
    }
    body = {
        'income': income,
        'outcome': outcome,
        'balance': balance,
        'amount': amount.value.toString(),
        'date': dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    }
    console.log(body);
    // axios.put(serverURL + "/api/itemTransaction/" + id, body,{headers: {
    //     'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    // }})
    // .catch(function (error) {
    //     console.log(error);
    // }).finally(
    //     loading.value = false,
    //     router.push('/')
    // )
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
    amount.value = dbData.value[index].amount
    let length = dbData.value.length
    for (let i = 0; i < length; i++) {
        document.querySelector('button[name=item' + i + ']').classList.replace("border-blue-500", "border-gray-200")
    }
    document.querySelector('button[name=item' + index + ']').classList.replace('border-gray-200', 'border-blue-500');
}

const updateOpenError = (value) => {
    openError.value = value
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
    <div class="w-full p-[20px]">
        <div class="max-w-[400px] mx-auto my-[20px] border rounded-md p-[10px]">
            <!-- header -->
            <div class="flex justify-center">
                <div class="flex items-center">
                    <RouterLink to="/" class="flex gap-1 items-center hover:bg-red-500 hover:text-white border border-red-500 rounded-md p-2">
                        <CloseIcon/>
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
                    <Search/>
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
            <div class="flex justify-center gap-1 my-1 border rounded-md p-3" v-if="dbData == null">
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
                            <PlusIcon/>
                        </button>
                        <input type="text" class="border rounded outline-blue-300 px-1 text-center" placeholder="تعداد کالا" v-model="amount" :disabled="amount ? false : true">
                        <button @click="handleDecrease" class="rounded p-2 text-center bg-red-500 text-white">
                            <MinusIcon/>
                        </button>
                    </div>
                </div>
            </div>

            <div class="w-full flex justify-end items-center mt-[10px]">
                <button @click="putData"
                    class="border bg-blue-500 hover:bg-blue-600 text-white p-1 w-1/2 lg:w-[200px] rounded">ثبت</button>
            </div>
        </div>
    </div>
    <Loading :loading="loading"></Loading>
    <error :errorMessage="errorMessage" :openError="openError" @update="updateOpenError"></error>
</template>

<style scoped>
input {
    padding: 5px
}</style>