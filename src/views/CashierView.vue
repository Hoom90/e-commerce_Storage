<script setup>
import store from '../store';
import router from '../config';

import { onMounted, ref } from 'vue'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import RemoveIconSVG from '../assets/removeIcon.svg'
import axios from 'axios'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

let dbData = []

const balanceData = ref({income:'',debt:'',current:''})
const historyData = ref(null)
const loading = ref(false)
const message = ref(null)

let id = ref(null)
let receiverNameIn = ref(null)
let receiverNameOut = ref(null)
let paidIn = ref(null)
let paidOut = ref(null)
let descriptionIn = ref(null)
let descriptionOut = ref(null)
let typeIn = ref(null)
let typeOut = ref(null)

onMounted(()=>{
    typeIn.value = 'کارتخوان1'
    typeOut.value = 'کارت به کارت'
})

const getData = async() => {
    balanceData.value = {income:'',debt:'',current:''}
    historyData.value = null
    loading.value = true
    await getBalance()
    await getBalanceLogs()
    calculateTodayBalance()
    formatHistoryData()
    loading.value = false
}

// Get Today Transactions
const getBalance = async () =>{
    await axios.get(serverURL + "/api/balanceTransaction/"+ dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
      (res)=>{
        dbData = res.data
      }
    )
    .catch(function (error) { console.log(error),loading.value = false,message.value=error})
}

// Get All Histories
const getBalanceLogs = async () =>{
    await axios.get(serverURL + '/api/balanceHistories/' + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
        (res)=>{
            historyData.value = res.data
      }
    )
    .catch((error) =>{ console.log(error),loading.value = false,message.value = error})
}

//POST
const postExpense = async() => {
    if(receiverNameOut.value == null){
        message.value ="مالک حساب نباید خالی باشد"
        return
    }
    if(paidOut.value == null){
        message.value ="مبلغ نباید خالی باشد"
        return
    }
    if(descriptionOut.value == null){
        message.value = "توضیحات نباید خالی باشد"
        return
    }
    const body = {
        receiverName : receiverNameOut.value,
        paid: paidOut.value,
        description: descriptionOut.value,
        type: typeOut.value,
        date: dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD'),
    };
    loading.value = true;
    await axios.post(serverURL + "/api/balanceTransaction/expense",body,{
        headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        }
    })
    .then(
        receiverNameOut.value = null,
        paidOut.value = null,
        descriptionOut.value = null,
        getData()
    )
    .catch((error) => {
        console.log(error);
        message.value = error
    })
    .finally(
        loading.value = false
    )
}

// POST
const postEarning = async() =>{
    if(receiverNameIn.value == null){
        message.value ="مالک حساب را وارد کنید"
        return
    }
    if(paidIn.value == null){
        message.value ="مبلغ را وارد کنید"
        return
    }
    if(descriptionIn.value == null){
        descriptionIn.value ="ورودی خارج از سیستم"
    }
    const body = {
        receiverName : receiverNameIn.value,
        paid: paidIn.value,
        description: descriptionIn.value,
        type: typeIn.value,
        date: dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD'),
    };
    // console.log(body);
    loading.value = true;
    await axios.post(serverURL + "/api/balanceTransaction/earning",body,{
        headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        }
    })
    .then(
        paidIn.value = null,
        receiverNameIn.value = null,
        descriptionIn.value = null,
        getData()
    )
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
    let id = historyData.value[index]._id
    let fk = historyData.value[index].fk
    const body = {
        id,
        fk,
    };
    const headers= {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    };
    loading.value = true
    await axios.delete(serverURL + "/api/balanceTransaction/" + id,{headers,data:body})
    .then(
        document.querySelector('div[name=data'+index+']').classList.replace('grid','hidden'),
        getData()
    )
    .catch((error) => {
        console.log(error);
        loading.value = false
        message.value = error
    }).finally(
        loading.value = false,
    )
}


const calculateTodayBalance = () =>{
    let current = 0 , income = 0 , debt = 0;
    dbData.forEach(item => {
        if(parseInt(item.action) > 0){
            income += parseInt(item.action)
        }
        if(parseInt(item.action) < 0){
            debt += parseInt(item.action)
        }
        current += parseInt(item.action)
    });
    income = income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    debt = (debt*-1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    current = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    balanceData.value = {
        income,
        debt,
        current,
    }
}

const formatHistoryData = () =>{
    let temp = []
    historyData.value.forEach(item =>{
        item.amount = item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        temp.push(item)
    })
    historyData.value = temp
}

const IsDeleteActive = (index) => {
    if(historyData.value[index].description == '') return false
    else return true
}

getData()
</script>
<template>
    <main class="flex flex-col pt-[25px] justify-center items-center relative">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between -z-10">
            <span>صندوق</span>
        </div>
        <button class="absolute w-full flex justify-between top-0 right-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>

        <div class="w-[90%]">
            <div class="border rounded p-[20px]">
                <!-- header -->
                <div class="flex flex-col md:flex-row justify-center items-center md:justify-between">
                    <span>درآمد امروز: {{ balanceData.income }} (ریال)</span>
                    <span>بدهی امروز: <span dir="ltr">{{ balanceData.debt }}</span> (ریال)</span>
                    <p>وضعیت دخل امروز: <span dir="ltr">{{ balanceData.current }}</span> (ریال)</p>
                </div>
                <!-- table -->
                <div class="w-full h-[350px] mx-auto">
                    <div class="grid grid-flow-col grid-cols-12 border-b bg-white">
                        <div class="py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-3">نام کاربر</div>
                        <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-3">هزینه ها</div>
                        <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-2">نوع پرداخت</div>
                        <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-3">توضیحات</div>
                        <div class="border-r col-span-1"></div>
                    </div>
                    <div class="flex flex-col">
                        <!-- items -->
                        <div v-if="historyData != null" class="overflow-auto">
                        <div v-for="(data,index) in historyData" class="grid grid-flow-col grid-cols-12 border-b odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" :name="'data'+index" v-bind:key="index">
                            <div class="flex justify-center items-center text-[12px] truncate col-span-3 p-2 px-3">{{ data.receiverName }}</div>
                            <div class="border-r flex justify-center items-center text-[12px] truncate col-span-3 p-2 px-3" dir='ltr'>(ریال) {{ data.amount }}</div>
                            <div class="border-r flex justify-center items-center text-[12px] truncate col-span-2 p-2 px-3"> {{ data.type }}</div>
                            <div class="border-r flex justify-center items-center text-[12px] truncate col-span-3 p-2 px-3">{{ data.description ? data.description : '-'}}</div>
                            <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-1">
                                <button class="bg-red-500 p-1 rounded-md text-white hover:bg-red-600 shadow-lg hover:shadow-none" v-if="IsDeleteActive(index)" @click="deleteData(index)">
                                    <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                                </button>
                            </div>
                        </div>
                        </div>
                        <!-- form -->
                        <div class="grid grid-flow-col grid-cols-12 border-b">
                            <div class="flex justify-center items-center text-[12px] truncate col-span-3">
                                <input type="text" class="w-full p-1 px-2 outline-none placeholder:text-center text-center" placeholder="نام" v-model="receiverNameOut"></div>
                            <div class="border-r flex justify-center items-center text-[12px] truncate col-span-3">
                                <input type="text" class="w-full p-1 px-2 outline-none placeholder:text-center text-center" placeholder="هزینه" v-model="paidOut"></div>
                            <div class="border-r flex justify-center items-center text-[12px] truncate col-span-2">
                                <select v-model="typeOut" class="w-full p-1 px-2 outline-none placeholder:text-center text-center">
                                    <option value="کارت به کارت">کارت به کارت</option>
                                    <option value="چک1">چک1</option>
                                    <option value="چک2">چک2</option>
                                    <option value="نقدی">نقدی</option>
                                </select>
                            </div>
                            <div class="border-r flex justify-center items-center text-[12px] truncate col-span-3">
                                <input type="text" class="w-full p-1 px-2 outline-none placeholder:text-center text-center" placeholder="توضیحات" v-model="descriptionOut"></div>
                            <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-1">
                                <button class="bg-blue-500 p-2 px-3 rounded-md text-white hover:bg-blue-600 shadow-lg hover:shadow-none" @click="postExpense">ذخیره</button></div>
                        </div>
                    </div>
                </div>
                <!-- footer -->
                <div class="bg-white w-full fixed bottom-0 right-0 border-t p-[20px] grid grid-cols-1 justify-center items-center gap-4 lg:absolute lg:-bottom-20 lg:grid-cols-12">
                    <div class="grid grid-flow-col grid-cols-4 items-center gap-1 lg:col-span-3">
                        <span>حساب:</span>
                        <input type="text" placeholder="نام مالک حساب" class="outline-none border rounded col-span-3" v-model="receiverNameIn">
                    </div>
                    <div class="grid grid-flow-col grid-cols-4 items-center gap-1 lg:col-span-4">
                        <span>مقدار:</span>
                        <div class="flex border rounded px-2 w-full col-span-3">
                            <div class="flex items-center justify-center border-l w-3/4">
                                <input type="text" placeholder="0" class="outline-none border-l w-full" v-model="paidIn" dir="ltr">
                                <span>(ریال)</span>
                            </div>
                            <select v-model="typeIn" class="w-1/4 outline-none">
                                <option value="کارتخوان1">کارتخوان1</option>
                                <option value="کارتخوان2">کارتخوان2</option>
                                <option value="بیسیم1">بیسیم1</option>
                                <option value="بیسیم2">بیسیم2</option>
                                <option value="چک1">چک1</option>
                                <option value="چک2">چک2</option>
                                <option value="نقدی">نقدی</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-flow-col grid-cols-4 items-center gap-1 lg:col-span-3">
                        <span>توضیحات:</span>
                        <input type="text" v-model="descriptionIn" placeholder="توضیحات" class="border rounded px-2 w-full outline-none col-span-3">
                    </div>
                    <div class="w-full lg:col-span-2">
                        <button class="bg-blue-500 text-white p-1 px-3 rounded w-full hover:bg-blue-600 shadow-md hover:shadow-none" @click="postEarning">ثبت ورودی</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <Loading v-if="loading"></Loading>
</template>

<style scoped>
input{
    padding:5px;
}
</style>
