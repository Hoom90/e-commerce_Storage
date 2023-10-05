<script setup>
import axios from 'axios';
import { ref } from 'vue'
import Loading from '../commons/loading.vue'
import serverURL from '../router/serverAddress'
import AuthService from "../services/auth.service";
import router from '../router'

const dbData = ref(null)
const dbData2 = ref(null)
const loading = ref(false)
const init = ref(true)

const historyData = ref([])
const balanceData = ref([])
const logsData = ref([])

let logs = ref(null)
let balance = ref(null)

const getData = async() => {
    loading.value = true
    initializeVariables()
    await getLogs()
    await getBalance()
    await setBalance()
    await setLog()
    await setHistory()
    loading.value = false
}

const initializeVariables = () =>{
    dbData.value = null
    dbData2.value = null
    historyData.value = []
    balanceData.value = []
    logsData.value = []
    logs.value = null
    balance.value = null
}

// Get All Balance Logs
const getLogs = async () =>{
    await axios.get(serverURL + "/api/balanceLogs/").then(Response =>{
        dbData.value = Response.data
    })
    .catch(function (error) { console.log(error), loading.value = false})
}

// Get Last Balance
const getBalance = async () =>{
    await axios.get(serverURL + "/api/balanceTransaction/").then((Response)=>{
        dbData2.value = Response.data
    })
    .catch(function (error) { console.log(error), loading.value = false})
}

const setHistory = async() => {
    const sample = [];
    await dbData.value.forEach(item => {
        if (!sample.includes(item.date)) {
        historyData.value.push(item);
        sample.push(item.date);
        }
    });
}

const setBalance = async()=>{
    const sample = [];
    await dbData2.value.forEach( item =>{
        if (!sample.includes(item.date)) {
            balanceData.value.push(item);
            sample.push(item.date);
        }
    })
}

const setLog = async() =>{
    await dbData.value.forEach(item => {
        logsData.value.push(item);
    });
}

const patchData = async (index) =>{
    loading.value = true
    let id , item , isBalance = false
    for(let i=0;i<logs.value.length;i++){
        if(i=== index){
            id = logs.value[i]._id
            if(logs.value[i].personName){
                isBalance = false
            }
            item = logs.value[i]
        }
    }
    let name , description , cash , card , type , cost , income , outcome , balance
    if(isBalance){
        type = document.querySelector('#type'+index).value
        if(type == 'cash'){
            cash = document.querySelector('#cost'+index).value
            if(cash > item.cash){
                balance += cash
            }
            else if(cash < item.cash){
                balance -= cash
            }
            else{
                balance = balance
            }
        }
        else{
            card = document.querySelector('#cost'+index).value
            if(card > item.card){
                balance += card
            }
            else if(card < item.card){
                balance -= card
            }
            else{
                balance = balance
            }
        }
        income = document.querySelector('#cost'+index).value
    }
    else{
        name = document.querySelector('#personName'+index).value
        description = document.querySelector('#description'+index).value
        cost = document.querySelector('#cost'+index).value
        outcome = '0'
    }
    let body = {
        'personName': name,
        'cost': cost,
        'description': description,
        'cash': cash,
        'card': card,
        'income': income,
        'outcome': outcome,
        'balance' : balance,
    }
    axios.patch(serverURL + "/api/balanceLogs/" + id, body,
    {
        headers: {
        'Authorization': 'Bearer ' +  sessionStorage.getItem('token'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    })
    .catch(function (error) {
        console.log(error);
    }).finally(
        loading.value = false,
        await getData()
    )
}

const handleSelectedDate = (date) =>{
    logs.value = []
    balance.value = null
    logsData.value.forEach(item =>{
        if(date == item.date && (item.card || item.cash) ){
            balance.value = item
        }
    })
    logsData.value.forEach(item =>{
        if(date == item.date){
            logs.value.push(item)
        }
    })
}

const handleLogs = (index) =>{
    let isVisible = document.getElementById("form"+index).classList.contains('hidden')
    if(isVisible){
        document.getElementById("form"+index).classList.replace('hidden','grid')
    }
    else{
        document.getElementById("form"+index).classList.replace('grid','hidden')
    }
}

getData()

</script>
<template>
    <main class="flex flex-col pt-[25px] justify-center items-center">
        <div class=" w-full px-5 flex items-center gap-1">
            <span class="text-[24px]">آمار</span>
            <span>&#62;</span>
            <div>دخل و خرج ها</div>
        </div>
        <div class='grid grid-flow-row grid-cols-6 gap-1 w-full px-[20px] h-[75vh]'>
          <!-- closed accounts -->
          <div :class="logs ? 'col-span-1 overflow-y-auto border h-full' : 'col-span-6 overflow-y-auto border h-full'">
              <div class="border-b bg-white">
                  <div class="py-2 px-3 flex justify-center items-center truncate">تاریخ</div>
              </div>
              <div class="flex flex-col" v-if="historyData != null" id='historyDataContainer'>
                  <div v-for="(item,index) in historyData" class="grid grid-flow-col border-b odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key='index'>
                      <button class="flex justify-center items-center truncate p-2 px-3" @click="handleSelectedDate(item.date)">{{ item.date }}</button>
                  </div>
              </div>
          </div>

          <!-- table -->
          <div :class="logs ? 'col-span-5 h-full border' : ''" v-if="logs">
            <div v-if="balance" class="flex flex-col">
                <div class="flex justify-center items-center gap-10 border-b p-3">
                    <div class="flex gap-3">
                        <span>نقد:</span>
                        <span>{{ balance.cash }} تومان</span>
                    </div>
                    <div class="flex gap-3">
                        <span>کارت به کارت:</span>
                        <span>{{ balance.card }} تومان</span>
                    </div>
                    <span class="text-red-500">{{ balance.date }}</span>
                </div>
            </div>
            <div class="h-[90%]"> 
                <!-- header -->
                <div class="grid grid-flow-col border-b bg-white">
                    <div class="py-2 px-3 flex justify-center">نام کاربر</div>
                    <div class="py-2 px-3 flex justify-center">هزینه ها</div>
                    <div class="py-2 px-3 flex justify-center">توضیحات</div>
                </div>
                <!-- body -->
                <div id="table">
                    <div v-for="(data,index) in logs" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" :name="'persons' + index" v-bind:key='index'>
                        <button @click="handleLogs(index)" class="grid grid-flow-col grid-cols-3 w-full p-1 border-b">
                            <span>{{ data.personName ? data.personName : "شما" }}</span>
                            <span v-if='data.cost'>{{ data.cost }} تومان</span>
                            <span v-if='data.cash || data.card'>
                            {{ (data.cash ? parseInt(data.cash) : 0) + (data.card ? parseInt(data.card) : 0) }} تومان
                            </span>
                            <span>{{ data.description ? data.description : 'نقدی و کارت' }}</span>
                        </button>
                        <div class="hidden gap-1 my-1 bg-white" :id="'form'+index">
                            <div class="grid grid-flow-col grid-cols-3 gap-1 my-1 bg-white">
                                <input type="text" v-if="data.personName" class="bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش نام" :id="'personName'+index">
                                <input type="text" class="bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش هزینه" :id="'cost'+index">
                                <select v-if="!data.cost" class="bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" :id="'type'+index">
                                    <option value="card">کارتی</option>
                                    <option value="cash">نقدی</option>
                                </select>
                                <input type="text" v-if="data.description" class="bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش توضیحات" :id="'description'+index">
                            </div>
                            <button class="bg-blue-500 hover:bg-blue-600 p-2 text-white" @click="patchData(index)">ذخیره تغییرات</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </main>
    <Loading :loading="loading"></Loading>
</template>
<style scoped>

</style>