<script setup>
import { ref } from 'vue'
import Loading from '../commons/loading.vue'
import serverURL from '../router/serverAddress'
import AuthService from "../services/auth.service";
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
const openError = ref(false)
const errorMessage = ref(null)

let id = ref(null)
let personName = ref(null)
let cost = ref(null)
let description = ref(null)
let card = ref(null)
let cash = ref(null)
 
// Get All Logs
// Get Last Balance
const getData = async() => {
  balanceData.value = {
    'income':null,
    'outcome':null,
    'balance':null
  }
  transactionData.value = null
  openError.value = false
  loading.value = true
  axios.get(serverURL + "/api/balanceTransaction/ + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')").then(
    (res)=>{
        if(res.data.length != 0) balanceData.value = res.data[res.data.length-1]
    }
  )
  axios.get(serverURL + '/api/balanceLogs/' + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
    (res)=>{
      transactionData.value = res.data
    }
  )
  .catch(function (error) { console.log(error)})
  .finally(loading.value = false);
}

//POST
async function postOutcome() {
    openError.value = false
    errorMessage.value = null
    let income = balanceData.value.income ? balanceData.value.income : '0'
    let outcome = balanceData.value.outcome ? (parseInt(balanceData.value.outcome) + parseInt(cost.value)).toString() : cost.value
    let balance = '0'
    if(balanceData.value.balance){
        if(parseInt(balanceData.value.balance) - parseInt(cost.value) < 0){
            openError.value = true
            errorMessage.value = "موجودی کم است!";
            return
        }
        else{
            balance = (parseInt(balanceData.value.balance) - parseInt(cost.value)).toString()
        }
    }
    else{
        openError.value = true
        errorMessage.value = "موجودی کم است!";
        return
    }
    loading.value = true;
    let body = {
        "income": income,
        "outcome": outcome,
        "balance": balance,
        "personName": personName.value,
        "cost": cost.value,
        "description": description.value,
        "date" : dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    };
    axios.post(serverURL + "/api/balanceTransaction/",body,{
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
    .catch(function (error) {
        console.log(error);
    }).finally(
        loading.value = false
    )
}

// POST
async function postIncome(){
    openError.value = false
    errorMessage.value = null
    loading.value = true;
    if(card.value == null){
        card.value = 0
    }
    if(cash.value == null){
        cash.value = 0
    }
    let income = balanceData.value.balance ? 
        (parseInt(balanceData.value.balance) + (parseInt(card.value) + parseInt(cash.value))).toString() 
        : (parseInt(card.value) + parseInt(cash.value)).toString()
    let outcome = balanceData.value.outcome ? balanceData.value.outcome : '0'
    let balance = '0'
    if(balanceData.value.balance){
        balance = (parseInt(balanceData.value.balance) + (parseInt(card.value) + parseInt(cash.value))).toString()
    }
    else{
        balance = income
    }
    const body = {
        "income": income,
        "outcome": outcome,
        "balance": balance,
        "card": card.value,
        "cash": cash.value,
        "date" : dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD'),
    };
    axios.post(serverURL + "/api/balanceTransaction/",body,{
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
    .catch(function (error) {
        console.log(error);
    }).finally(
        loading.value = false
    )
}

// DELETE
const deleteData = async (index) =>{
    loading.value = true
    let id = transactionData.value[index]._id
    let card = transactionData.value[index].card ? transactionData.value[index].card : '0'
    let cash = transactionData.value[index].cash ? transactionData.value[index].cash : '0'
    let income = (parseInt(card) + parseInt(cash)).toString() == '0' ? balanceData.value.income : (parseInt(balanceData.value.income) + parseInt(card) + parseInt(cash)).toString()
    let outcome = transactionData.value[index].cost ? transactionData.value[index].cost : '0'
    let balance = !transactionData.value[index].card && !transactionData.value[index].cash ? (parseInt(balanceData.value.balance) + parseInt(outcome)).toString() : (parseInt(balanceData.value.balance) - parseInt(income)).toString()
    outcome = transactionData.value[index].cost ? (parseInt(balanceData.value.outcome) - parseInt(transactionData.value[index].cost)).toString() : balanceData.value.outcome
    const body = {
        income,
        outcome,
        balance,
        "logicalDelete": "true",
        "date":dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD'),
    };
    axios.delete(serverURL + "/api/balanceTransaction/" + id,body, {
    headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }
    }).catch(err=>{
        console.log(err);
    })
    .finally(
        loading.value = false,
        document.querySelector('div[name=data'+index+']').classList.replace('grid','hidden'),
        getData()
    )
}

const updateOpenError = (value) => {
    openError.value = value
}

getData()

</script>
<template>
    <main class="flex flex-col pt-[25px] justify-center items-center relative">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between">
            <span>صندوق</span>
        </div>
        <div class="absolute w-full top-0 bg-red-500 text-white p-2 text-[12px]" v-if="errorMessage">
            {{errorMessage}}
        </div>
        <!-- <div v-if="!isTodayClose" id="notebook"> -->
        <div id="notebook">
            

            <div class="flex justify-between p-[20px]">
                <span>درآمد امروز: {{ balanceData.income ? balanceData.income : '0' }} تومان</span>
                <span>خرج امروز: {{ balanceData.outcome ? balanceData.outcome : '0' }} تومان</span>
                <span>موجودی امروز: {{ balanceData.balance ? balanceData.balance : '0' }} تومان</span>
            </div>

            <!-- table -->
            <div class="w-[90%] m-10 h-[48vh]">
                <div class="grid grid-flow-col grid-cols-12 border-b bg-white">
                    <div class="py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-4">نام کاربر</div>
                    <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-3">هزینه ها</div>
                    <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-4">توضیحات</div>
                    <div class="border-r col-span-1"></div>
                </div>
                <div class="flex flex-col">
                    <div v-if="transactionData != null" class="overflow-y-auto">
                      <div v-for="(data,index) in transactionData" class="grid grid-flow-col grid-cols-12 border-b odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" :name="'data'+index" v-bind:key="index">
                          <div class="flex justify-center items-center text-[12px] truncate col-span-4 p-2 px-3">{{ data.personName ? data.personName : "شما" }}</div>
                          <div class="border-r flex justify-center items-center text-[12px] truncate col-span-3 p-2 px-3" dir='ltr'>{{ data.cost ? "- " + data.cost.toLocaleString() : "+ " + (parseInt(data.cash) + parseInt(data.card))  }} تومان</div>
                          <div class="border-r flex justify-center items-center text-[12px] truncate col-span-4 p-2 px-3">{{ data.description ? data.description : 'نقدی و کارتی' }}</div>
                          <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-1">
                              <button class="bg-red-500 p-1 rounded-md text-white hover:bg-red-600 shadow-lg hover:shadow-none" @click="deleteData(index)">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" fill="#ffffff"/></svg>
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
                    <div class="grid gap-1 mt-1 text-red-500 text-[12px]" v-if="openError && !errorMessage">
                        <span>پر کردن نام الزامیست</span>
                        <span>پر کردن هزینه الزامیست</span>
                        <span>پر کردن توضیحات الزامیست</span>
                    </div>

                </div>
            </div>
            <!-- footer -->
            <div class="bg-white w-full h-[10vh] grid grid-cols-1 md:grid-cols-4 justify-center items-center gap-4 px-[20px]">
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
    <Loading :loading="loading"></Loading>
</template>
