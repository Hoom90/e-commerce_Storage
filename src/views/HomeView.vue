<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import AuthService from '../services/auth.service';
import axios from 'axios'
import editIconSVG from '../assets/editIcon.svg'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

const loading = ref(false)
const message = ref(null)

let dbAccountData = ref([])
let dbWarehouseData = ref([])

let profit = ref(null)
let debt = ref(null)
let balance = ref(null)
let mostSell = ref(null)
const getData = async() => {
    loading.value = true
    await getAccountancyData()
    await getWarehouseData()
    setProfit()
    setDebt()
    setBalance()
    setMostSell()
    loading.value = false
}

// Get All Balance Logs
const getAccountancyData = async() =>{
  await axios.get(serverURL + '/api/balanceHistories/' + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
    (res)=>{
        if(res.data.length != 0){
            dbAccountData.value = res.data
        }
        else{
            dbAccountData.value = null
        }
    }
  )
  .catch(function (error) { console.log(error),loading.value = false,message.value = error})
}

// Get All Item Logs
const getWarehouseData = async() =>{
    await axios.get(serverURL + "/api/itemLogs/" + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
    (res)=>{
        if(res.data.length != 0){
            dbWarehouseData.value = res.data
        }
        else{
            dbWarehouseData.value = null
        }
    })
  .catch(function (error) { console.log(error),loading.value = false,message.value = error})
}

const setProfit = () =>{
    profit.value =0
    if(dbAccountData.value){
        for (let i = 0; i < dbAccountData.value.length; i++) {
            if(parseInt(dbAccountData.value[i].card) > 0){
                profit.value = parseInt(profit.value) + parseInt(dbAccountData.value[i].card)
            }
            else if(parseInt(dbAccountData.value[i].cash) > 0){
                profit.value = parseInt(profit.value) + parseInt(dbAccountData.value[i].cash)
            }
            else if(parseInt(dbAccountData.value[i].cost) > 0){
                profit.value = parseInt(profit.value) + parseInt(dbAccountData.value[i].cost)
            }
        }     
    }
}

const setDebt = () =>{
    debt.value =0
    if(dbAccountData.value){
        for (let i = 0; i < dbAccountData.value.length; i++) {
            if(parseInt(dbAccountData.value[i].card) < 0){
                debt.value = parseInt(debt.value) - parseInt(dbAccountData.value[i].card)
            }
            else if(parseInt(dbAccountData.value[i].cash) < 0){
                debt.value = parseInt(debt.value) - parseInt(dbAccountData.value[i].cash)
            }
            else if(parseInt(dbAccountData.value[i].cost) < 0){
                debt.value = parseInt(debt.value) - parseInt(dbAccountData.value[i].cost)
            }
        }        
        debt.value = debt.value.toString()
    }
}

const setBalance = () =>{
    balance.value = 0
    balance.value = profit.value - debt.value
}

const setMostSell = () =>{
    let topSells = []
    mostSell.value = null
    if(dbWarehouseData.value){
        for (let i = 0; i < dbWarehouseData.value.length; i++) {
            if(dbWarehouseData.value[i].oldVal){
                let amount = parseInt(dbWarehouseData.value[i].oldVal) - parseInt(dbWarehouseData.value[i].newVal)
                let temp = {
                    'name': dbWarehouseData.value[i].name,
                    'amount': amount
                }
                topSells.push(temp)
            }
        }
        mostSell.value = topSells
    }
}

getData()
</script>
<template>
    <main class="flex flex-col pt-[20px] justify-center items-center">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between">
            <span>میزکار</span>
        </div>
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="flex flex-col md:flex-row gap-4 md:gap-1 w-[90%] text-center h-[70vh] mt-5">
            <div class="border lg:w-3/12 min-h-[200px] overflow-auto lg:max-h-none bg-white">
                <RouterLink to="/cashier" class="border-b grid grid-flow-col grid-cols-12 items-center hover:bg-blue-500 hover:text-white">
                    <span class='col-span-11'>دخل و خرج امروز</span>
                    <img :src="editIconSVG" alt="editIconSVG">
                </RouterLink>
                <div class="overflow-y-auto" v-if="dbAccountData">
                    <div v-for="(data,index) in dbAccountData" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key='index'>
                        <div class="grid grid-flow-col grid-cols-5 w-full p-1 border-b">
                            <span class="col-span-2 text-[12px] truncate">{{ data.personName ? data.personName:"شما" }}</span>
                            <span v-if='data.cost' dir="ltr">{{ data.cost }}</span>
                            <span v-if='data.cash || data.card' dir="ltr">
                            {{ (data.cash ? parseInt(data.cash) : 0) + (data.card ? parseInt(data.card) : 0) }}
                            </span>
                            <span class="col-span-2 text-[12px] truncate">{{ data.description }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="!dbAccountData" class="h-[80%] flex justify-center items-center">
                    تراکنشی ندارید
                </div>
            </div>
            
            <div class="border lg:w-3/12 min-h-[200px] overflow-auto lg:max-h-none bg-white">
                <RouterLink to="/warehouse/newOrder" class="border-b grid grid-flow-col grid-cols-12 items-center hover:bg-blue-500 hover:text-white">
                    <span class='col-span-11'>تراکنش انبار امروز</span>
                    <img :src="editIconSVG" alt="editIconSVG">
                </RouterLink>
                <div class="overflow-y-auto" v-if="dbWarehouseData">
                    <div v-for="(data,index) in dbWarehouseData" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key="index">
                        <div class="grid grid-flow-col grid-cols-12 w-full p-1 border-b">
                            <span :class="data.oldVal?'col-span-11':'col-span-12'">{{ data.name ? data.name : data.description }}</span>
                            <span v-if="data.oldVal">{{ parseInt(data.oldVal) - parseInt(data.newVal) }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="!dbWarehouseData" class="h-[80%] flex justify-center items-center">
                    کالایی جابه جا نشده است
                </div>
            </div>

            <div class="border lg:w-3/12 min-h-[200px] overflow-auto lg:max-h-none bg-white" v-if="mostSell">
                <div class="border-b items-center">درصد فروش روز</div>
                <div class="overflow-y-auto">
                    <div v-for="(data,index) in mostSell" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key="index">
                        <div class="grid grid-flow-col justify-between px-[20px] border-b">
                            <span>{{ data.name }}</span>
                            <span>{{ data.amount }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:w-3/12 flex flex-col lg:flex-col gap-1">
                
                <div class="border" v-if="profit">
                    <div class="border-b items-center">فروش و درآمد امروز</div>
                    <div class="bg-[#f6f6f6] hover:bg-[#e9e9e9]">
                        {{ profit }}
                    </div>
                </div>

                <div class="border" v-if="debt">
                    <div class="border-b items-center">بدهی امروز</div>
                    <div class="bg-[#f6f6f6] hover:bg-[#e9e9e9]">
                        {{ debt }}
                    </div>
                </div>

                <div class="border" v-if="balance">
                    <div class="border-b items-center">حساب امروز</div>
                    <div class="text-white" :class="balance < 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'" dir="ltr">
                        {{ balance }}
                    </div>
                </div>

            </div>
        </div>
    </main>
    <Loading v-if="loading"></Loading>
</template>
