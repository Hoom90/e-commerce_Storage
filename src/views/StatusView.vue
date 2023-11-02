<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import router from '../config'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

const balanceHistories = ref(null)
const itemHistories = ref(null)
const balanceTransition = ref(null)

const historyDateData = ref([])
const balanceData = ref([])
const selectedDateLogs = ref([])
const selectedDateItemLogs = ref([])

const message = ref(null)
const loading = ref(false)
const init = ref(true)

const dayProfit = ref(null)
const monthProfit = ref(null)
const weekProfit = ref(null)

onMounted(async()=>{
    getData()
})

const getData = async() => {
    loading.value = true
    // await getBalance()
    await getBalanceHistories()
    await getItemHistories()
    loading.value = false
}

// Get All Balance History
const getBalanceHistories = async () =>{
    await axios.get(serverURL + "/api/balanceHistories/").then(res =>{
        let data = res.data
        let sample = [];
        // find All Dates which has History
        data.forEach(item => {
        if (!sample.includes(item.date)) {
            historyDateData.value.push(item);
            sample.push(item.date);
        }
        balanceHistories.value = data
    });
    })
    .catch(function (error) {
        console.log(error),
        loading.value = false,
        message.value = error
    })
}

// Get All Item History
const getItemHistories = async () =>{
    await axios.get(serverURL + "/api/itemHistories/").then(res =>{
        let data = res.data
        let sample = [];
        // find All Dates which has History
        data.forEach(item => {
        itemHistories.value = data
    });
    })
    .catch(function (error) {
        console.log(error),
        loading.value = false,
        message.value = error
    })
}
// Get Balance
// const getBalance = async () =>{
//     await axios.get(serverURL + "/api/balanceTransaction/").then(res=>{
//         let data = res.data
//         const sample = [];
//         data.forEach( item =>{
//             if (!sample.includes(item.date)) {
//                 balanceTransition.value.push(item);
//                 sample.push(item.date);
//             }
//         })
//     })
//     .catch(function (error) {
//         console.log(error),
//         loading.value = false,
//         message.value = error
//     })
// }

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
        message.value = error
    }).finally(
        loading.value = false,
        await getData()
    )
}

const handleSelectedDate = (date) =>{
    let income = 0, debt = 0 ,current = 0
    balanceHistories.value.forEach(item =>{
        if(date == item.date ){
            if(parseInt(item.amount) > 0){
                income += parseInt(item.amount)
            }
            if(parseInt(item.amount) < 0){
                debt += (parseInt(item.amount)*-1)
            }
            current += parseInt(item.amount)
        }
    })
    selectedDateLogs.value = []
    balanceHistories.value.forEach(item =>{
        if(date == item.date ){
            item.description = item.description == '' ? '-' : item.description 
            selectedDateLogs.value.push(item)
        }
    })
    document.querySelector("#selectedDateIncome").innerText = income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    document.querySelector("#selectedDateDebt").innerText = debt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    document.querySelector("#selectedDateCurrent").innerText = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    balanceHistories.value.forEach(item =>{
        if(date == item.date){
            document.querySelector("#selectedDate").innerText = item.date
        }
    })
    selectedDateItemLogs.value = []
    itemHistories.value.forEach(item =>{
        if(date == item.date ){
            selectedDateItemLogs.value.push(item)
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

// .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

</script>
<template>
    <main class="flex flex-col pt-[25px] justify-center items-center relative">
        <div class=" w-full px-5 flex items-center gap-1 -z-10">
            <span class="text-[24px]">آمار</span>
            <span>&#62;</span>
            <div>دخل و خرج ها</div>
        </div>
        <button class="absolute w-full flex justify-between top-0 left-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="grid lg:grid-flow-col lg:grid-cols-6 gap-1 w-full px-[20px] lg:h-[75vh]">

            <!-- history Dates Data -->
            <div class="lg:col-span-1 overflow-y-auto border h-full">
                <div class="border-b bg-white">
                    <div class="py-2 px-3 flex justify-center items-center truncate">تاریخ</div>
                </div>
                <div class="flex flex-col" v-if="historyDateData != null" id='historyDateDataContainer'>
                    <div v-for="(item,index) in historyDateData" class="grid grid-flow-col border-b odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key='index'>
                        <button class="flex justify-center items-center truncate p-2 px-3" @click="handleSelectedDate(item.date)">{{ item.date }}</button>
                    </div>
                </div>
            </div>

            <!-- table -->
            <div class="flex flex-col lg:col-span-5 gap-1">
                <!-- date -->
                <div class="flex justify-center items-center gap-10 border p-1 text-red-500 hover:bg-red-500 hover:text-white" id="selectedDate" dir="ltr">----/--/--</div>
                <!-- income debt current -->
                <div class="border">
                    <div class="border-b flex justify-between bg-blue-100 p-1 px-[20px] hover:bg-blue-200">
                        <span>دخل:</span>
                        <span id="selectedDateCurrent" dir="ltr">-</span>
                        <span>(ریال)</span>
                    </div>
                    <div class="border-b flex justify-between bg-green-100 p-1 px-[20px] hover:bg-green-200">
                        <span>درآمد:</span>
                        <span id="selectedDateIncome">-</span>
                        <span>(ریال)</span>
                    </div>
                    <div class="flex justify-between bg-red-100 p-1 px-[20px] hover:bg-red-200">
                        <span>بدهی:</span>
                        <span id="selectedDateDebt">-</span>
                        <span>(ریال)</span>
                    </div>
                </div>
                <!-- histories -->
                <div class="flex flex-col lg:flex-row gap-1 h-full text-[12px]">
                    <!-- balance history -->
                    <div class="lg:w-1/2 h-full border">
                        <!-- header -->
                        <div class="grid grid-flow-col grid-cols-4 border-b bg-white">
                            <div class="py-2 px-3 flex justify-center">نام کاربر</div>
                            <div class="py-2 px-3 flex justify-center">هزینه ها</div>
                            <div class="py-2 px-3 flex justify-center">نوع پرداخت</div>
                            <div class="py-2 px-3 flex justify-center">توضیحات</div>
                        </div>
                        <!-- body -->
                        <div>
                            <div v-for="(data,index) in selectedDateLogs" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key='index'>
                                <div class="grid grid-flow-col grid-cols-4 border-b text-center">
                                    <span>{{ data.receiverName }}</span>
                                    <span dir="ltr">{{ data.amount }}</span>
                                    <span>{{ data.type }}</span>
                                    <span>{{ data.description }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- item history -->
                    <div class="lg:w-1/2 h-full border">
                        <!-- header -->
                        <div class="grid grid-flow-col grid-cols-5 border-b bg-white">
                            <div class="py-2 px-3 flex justify-center">نام کالا</div>
                            <div class="py-2 px-3 flex justify-center">شرکت</div>
                            <div class="py-2 px-3 flex justify-center">عملیات</div>
                            <div class="py-2 px-3 flex justify-center">تعداد</div>
                            <div class="py-2 px-3 flex justify-center">واحد</div>
                        </div>
                        <!-- body -->
                        <div v-for="(data,index) in selectedDateItemLogs" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" :name="'persons' + index" v-bind:key='index'>
                            <div class="grid grid-flow-col grid-cols-5 border-b text-center">
                                <span>{{ data.item }}</span>
                                <span>{{ data.company }}</span>
                                <span>{{ data.action }}</span>
                                <span>{{ data.newAmount }}</span>
                                <span>{{ data.unit }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <Loading v-if="loading"></Loading>
</template>
<style scoped>

</style>