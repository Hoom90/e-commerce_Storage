<script setup>
import store from '../store';
import router from '../config';

import { ref } from 'vue'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import RemoveIconSVG from '../assets/removeIcon.svg'
import axios from 'axios'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

const balanceData = ref({
  'income':null,
  'outcome':null,
  'balance':null
})
const transactionData = ref(null)
const loading = ref(false)
const message = ref(null)

let id = ref(null)
let personName = ref(null)
let cost = ref(null)
let description = ref(null)
let card = ref(null)
let cash = ref(null)
const getData = async() => {
    balanceData.value = {
        'income':null,
        'outcome':null,
        'balance':null
    }
    transactionData.value = null
    loading.value = true
    await getBalance()
    await getBalanceLogs()
    loading.value = false
}

// Get Last Balance
const getBalance = async () =>{
    await axios.get(serverURL + "/api/balanceTransaction/"+ dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
      (res)=>{
        balanceData.value = res.data
        calculateBalance()
      }
    )
    .catch(function (error) { console.log(error),loading.value = false,message.value=error})
}

const calculateBalance = () =>{
    let income = 0 , outcome = 0 ,balance=0
    balanceData.value.forEach(item => {
        income += parseInt( item.income)
        outcome += parseInt( item.outcome)
    });
    if(parseInt(outcome) < 0){
        balance = parseInt(income) + parseInt(outcome)
    }
    else{
        balance = parseInt(income) - parseInt(outcome)
    }
    balanceData.value = {
        income,
        outcome,
        balance,
        'date' : dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    }
}

// Get All Logs
const getBalanceLogs = async () =>{
    await axios.get(serverURL + '/api/balanceHistories/' + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
        (res)=>{
            if(res.data.length != 0){
                transactionData.value = res.data
            }
      }
    )
    .catch((error) =>{ console.log(error),loading.value = false,message.value = error})
}

//POST
const postOutcome = async() => {
    message.value = null
    loading.value = true;
    let outcome = '-' + cost.value
    let balance = balanceData.value.balance ? (parseInt(balanceData.value.balance) - parseInt(outcome)).toString() : (-parseInt(outcome)).toString()
    let body = {
        "income": '0',
        "outcome": outcome,
        "balance": balance,
        "personName": personName.value,
        "cost": cost.value,
        "description": description.value,
        "date" : dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    };
    await axios.post(serverURL + "/api/balanceTransaction/",body,{
        headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        personName.value = null
        cost.value = null
        description.value = null
        getData();
    })
    .catch((error) => {
        console.log(error);
        message.value = error
    })
    .finally(
        loading.value = false
    )
}

// POST
const postIncome = async() =>{
    loading.value = true;
    if(card.value == null){
        card.value = 0
    }
    else if(cash.value == null){
        cash.value = 0
    }
    let income = (parseInt(card.value) + parseInt(cash.value)).toString()
    let balance = balanceData.value.balance ? (parseInt(balanceData.value.balance) + parseInt(income)).toString() : (parseInt(income)).toString()
    const body = {
        "income": income,
        "outcome": '0',
        "balance": balance,
        "card": card.value,
        "cash": cash.value,
        'description':'واریز به صندوق',
        "date" : dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD'),
    };
    await axios.post(serverURL + "/api/balanceTransaction/",body,{
        headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        cash.value = null
        card.value = null
        getData();
    })
    .catch((error) => {
        console.log(error);
        message.value = error
    })
    .finally(
        loading.value = false
    )
}

// DELETE
const deleteData = async (index) =>{
    loading.value = true
    let id = transactionData.value[index]._id
    let income ='0',outcome ='0',balance ='0'
    let cost  = transactionData.value[index].cost ? transactionData.value[index].cost : '0'
    let card = transactionData.value[index].card ? transactionData.value[index].card : '0'
    let cash = transactionData.value[index].cash ? transactionData.value[index].cash : '0'
    if(cost === '0'){
        income = (- parseInt(card) + parseInt(cash)).toString()
        outcome = '0'
    }
    else{
        income = '0'
        outcome = (- parseInt(cost)).toString()
    }
    const body = {
        income,
        outcome,
        balance,
        "logicalDelete": "true",
        "date":dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD'),
    };
    await fetch(serverURL + "/api/balanceTransaction/" + id,{
        method: "DELETE",
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
    .then(res => {
        if(!res.ok){
            console.log(res.statusText);
            loading.value = false
            message.value = res.statusText
        }
        else{
            loading.value = false,
            document.querySelector('div[name=data'+index+']').classList.replace('grid','hidden'),
            getData()
        }
    })
}

getData()

</script>
<template>
    <main class="flex flex-col pt-[25px] justify-center items-center relative">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between -z-10">
            <span>صندوق</span>
        </div>
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <!-- <div v-if="!isTodayClose" id="notebook"> -->
        <div id="notebook">
            

            <div class="flex flex-col md:flex-row justify-center items-center md:justify-between p-[20px]">
                <span>درآمد امروز: {{ balanceData.income ? balanceData.income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0' }} تومان</span>
                <span>بدهی امروز: <span dir="ltr">{{ balanceData.outcome ? balanceData.outcome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0' }}</span> تومان</span>
                <p>وضعیت دخل امروز: <span dir="ltr">{{ balanceData.balance ? balanceData.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0' }}</span> تومان</p>
            </div>

            <ul class="text-[12px] px-[20px]">
                <li class="text-red-500">* حذف تراکنش <span class="underline underline-offset-8">خرید و فروش کالا</span> باعث بهم ریختگی آمار انبار و صندوق میشود!</li>
            </ul>

            <!-- table -->
            <div class="w-[90%] md:m-5 md:mx-10 md:h-[50vh] lg:h-[55vh] mx-auto mb-40">
                <div class="grid grid-flow-col grid-cols-12 border-b bg-white">
                    <div class="py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-4">نام کاربر</div>
                    <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-3">هزینه ها</div>
                    <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-4">توضیحات</div>
                    <div class="border-r col-span-1"></div>
                </div>
                <div class="flex flex-col">
                    <div v-if="transactionData != null" class="max-h-[500px] overflow-auto">
                      <div v-for="(data,index) in transactionData" class="grid grid-flow-col grid-cols-12 border-b odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" :name="'data'+index" v-bind:key="index">
                          <div class="flex justify-center items-center text-[12px] truncate col-span-4 p-2 px-3">{{ data.personName ? data.personName : "شما" }}</div>
                          <div class="border-r flex justify-center items-center text-[12px] truncate col-span-3 p-2 px-3" dir='ltr'>{{ data.cost ? data.cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : (parseInt(data.cash) + parseInt(data.card)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")  }} تومان</div>
                          <div class="border-r flex justify-center items-center text-[12px] truncate col-span-4 p-2 px-3">{{ data.description }}</div>
                          <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-1">
                              <button class="bg-red-500 p-1 rounded-md text-white hover:bg-red-600 shadow-lg hover:shadow-none" @click="deleteData(index)">
                                <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                              </button>
                          </div>
                      </div>
                    </div>
                    <div class="grid grid-flow-col grid-cols-12 border-b">
                        <div class="flex justify-center items-center text-[12px] truncate col-span-4">
                            <input type="text" class="w-full p-1 px-2 outline-none placeholder:text-center text-center" placeholder="نام" v-model="personName"></div>
                        <div class="border-r flex justify-center items-center text-[12px] truncate col-span-3">
                            <input type="text" class="w-full p-1 px-2 outline-none placeholder:text-center text-center" placeholder="هزینه" v-model="cost"></div>
                        <div class="border-r flex justify-center items-center text-[12px] truncate col-span-4">
                            <input type="text" class="w-full p-1 px-2 outline-none placeholder:text-center text-center" placeholder="توضیحات" v-model="description"></div>
                        <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-1">
                            <button class="bg-blue-500 p-2 px-3 rounded-md text-white hover:bg-blue-600 shadow-lg hover:shadow-none" @click="postOutcome">ذخیره</button></div>
                    </div>
                    <div class="grid gap-1 mt-1 text-red-500 text-[12px]" v-if="message">
                        <span>پر کردن نام الزامیست</span>
                        <span>پر کردن هزینه الزامیست</span>
                        <span>پر کردن توضیحات الزامیست</span>
                    </div>

                </div>
            </div>
            <!-- footer -->
            <div class="hidden bg-white w-full md:grid grid-cols-1 md:grid-cols-3 justify-center items-center gap-4 px-[20px]">
                <div class="flex items-center justify-between gap-1 w-full col-span-1">
                    <span>کارتخوان:</span>
                    <input type="text" maxlength="15" class="border rounded-md h-[30px] w-4/5 px-2 outline-none" placeholder="0" dir="ltr" v-model="card"> تومان
                </div>
                <div class="flex items-center justify-between gap-1 w-full col-span-1">
                    <span>نقدی:</span>
                    <input type="text" maxlength="15" class="border rounded-md h-[30px] w-4/5 px-2 outline-none" placeholder="0" dir="ltr" v-model="cash"> تومان
                </div>
                <div class="col-span-1 w-full">
                    <button class="bg-blue-500 text-white p-1 px-3 rounded-md w-full lg:w-fit hover:bg-blue-600 shadow-md hover:shadow-none" @click="postIncome">لحاظ تغییرات</button>
                </div>
            </div>
            <!-- footer -->
            <div class="bg-white w-full md:hidden fixed bottom-0 py-[20px] grid grid-cols-1 md:grid-cols-4 justify-center items-center gap-4 px-[20px]">
                <div class="flex items-center justify-between gap-1 w-full col-span-1">
                    <span>کارتخوان:</span>
                    <input type="text" maxlength="15" class="border rounded-md h-[30px] w-4/5 px-2 outline-none" placeholder="0" dir="ltr" v-model="card"> تومان
                </div>
                <div class="flex items-center justify-between gap-1 w-full col-span-1">
                    <span>نقدی:</span>
                    <input type="text" maxlength="15" class="border rounded-md h-[30px] w-4/5 px-2 outline-none" placeholder="0" dir="ltr" v-model="cash"> تومان
                </div>
                <div class="col-span-1 w-full">
                    <button class="bg-blue-500 text-white p-1 px-3 rounded-md w-full lg:w-fit hover:bg-blue-600 shadow-md hover:shadow-none" @click="postIncome">لحاظ تغییرات</button>
                </div>
            </div>
        </div>
    </main>
    <Loading v-if="loading"></Loading>
</template>
