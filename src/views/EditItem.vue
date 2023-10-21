<script setup>
import store from '../store';

import { onMounted, ref } from 'vue'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import ArrowIconSVG from '../assets/arrowLeftIcon.svg'
import router from '../config'
import route from '../config'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
import axios from 'axios'
dayjs.extend(jalaliday)

const dbData = ref({
    name:'',
    weight:'',
    basePrice:'',
    price:'',
    profit:'',
    amount:'',
    billId:'',
    date:'',
})
const balanceData = ref(null);
const message = ref(null)
const loading = ref(false)
const openError = ref(false)
const errorMessage = ref(null)

onMounted(()=>{
    getData()
})

const getData = async () => {
    loading.value = true;
  await getItem();
  await getBalance();
  loading.value = false;
};

// Get One by Id
const getItem = async () => {
  await axios.get(serverURL + "/api/itemTransaction/" + route.currentRoute.value.params.id)
        .then((res)=>{
            dbData.value = res.data;
    })
    .catch((error) => {
        console.log(error);
        loading.value = false
        message.value = error
    })
};

// Get Last Balance
const getBalance = async () => {
  await axios
    .get(
      serverURL +
        "/api/balanceTransaction/" +
        dayjs().calendar("jalali").locale("fa").format("YYYY-MM-DD")
    )
    .then((res) => {
      balanceData.value = res.data;
      calculateBalance();
    })
    .catch(function (error) {
      console.log(error), (loading.value = false), (message.value = error);
    });
};

const calculateBalance = () => {
  let income = 0,
    outcome = 0,
    balance = 0;
  balanceData.value.forEach((item) => {
    income += parseInt(item.income);
    outcome += parseInt(item.outcome);
  });
  if (parseInt(outcome) < 0) {
    balance = parseInt(income) + parseInt(outcome);
  } else {
    balance = parseInt(income) - parseInt(outcome);
  }
  balanceData.value = {
    income,
    outcome,
    balance,
    date: dayjs().calendar("jalali").locale("fa").format("YYYY/MM/DD"),
  };
};

const patchData  = async() =>{
    loading.value = true
    let name = document.getElementById('name')
    let weight = document.getElementById('weight')
    let basePrice = document.getElementById('basePrice')
    let price = document.getElementById('price')
    let profit = document.getElementById('profit')
    let amount = document.getElementById('amount')
    let billId = document.getElementById('billId')
    let date = document.getElementById('year').value + '/' + document.getElementById('month').value + '/' + document.getElementById('day').value
    const body = {
        'name': name.value,
        'weight': weight.value,
        'basePrice': basePrice.value,
        'price': price.value,
        'profit': profit.value,
        'amount': amount.value,
        'billId': billId.value,
        'date': date,
        'update' : dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD'),
    }
    await axios.patch(serverURL + "/api/itemTransaction/" + route.currentRoute.value.params.id, body, {
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        }
    })
    .catch((error) => {
        console.log(error);
        loading.value = false
        message.value = error
    }).finally(
        loading.value = false,
        router.push('/warehouse')
    )
}

// customed DELETE
const deleteData  = async() =>{
    loading.value = true
    let basePrice =  document.getElementById('basePrice')
    let amount =  document.getElementById('amount')
    const body = {
        'income': "0",
        'outcome': (-(parseInt(basePrice.value) * parseInt(amount.value))).toString(),
        'balance': (parseInt(balanceData.value.balance) + parseInt(parseInt(basePrice.value) * parseInt(amount.value))).toString(),
        'description' : 'برگشت کالا',
        'logicalDelete': "true",
        'date': dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    }
    await fetch (serverURL + "/api/itemTransaction/" + route.currentRoute.value.params.id,{
        method: "DELETE",
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            "Content-Type": "application/json",
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
            router.push('/warehouse')
        }
    })
}

const calculator = () =>{
    let price = document.getElementById('price')
    let basePrice =  document.getElementById('basePrice')
    let profit = document.getElementById('profit')
    let profitxamount = document.getElementById('profitxamount')
    if(price.value != null && basePrice.value != null){
        profit.value = parseInt(price.value) - parseInt(basePrice.value)
        if(parseInt(profit.value) < 0){
            if(profit.classList.contains("border-gray-50")){
                profit.classList.replace("border-gray-50","border-red-500")
            }
            else{
                profit.classList.replace("border-green-500","border-red-500")
            }
        }
        else{
            if(profit.classList.contains("border-gray-50")){
                profit.classList.replace("border-gray-50","border-green-500")
            }
            else{
                profit.classList.replace("border-red-500","border-green-500")
            }
        }
    }
    else{
        profit.classList.replace("border-red-500","border-gray-50")
        profit.classList.replace("border-green-500","border-gray-50")
    }
    if(price.value != null && basePrice.value != null && amount.value != null){
        profitxamount.value = parseInt(profit.value) * parseInt(amount.value)
        if(parseInt(profitxamount.value) < 0){
            if(profitxamount.classList.contains("border-gray-50")){
                profitxamount.classList.replace("border-gray-50","border-red-500")
            }
            else{
                profitxamount.classList.replace("border-green-500","border-red-500")
            }
        }
        else{
            if(profitxamount.classList.contains("border-gray-50")){
                profitxamount.classList.replace("border-gray-50","border-green-500")
            }
            else{
                profitxamount.classList.replace("border-red-500","border-green-500")
            }
        }
    }
    else{
        profitxamount.classList.replace("border-red-500","border-gray-50")
        profitxamount.classList.replace("border-green-500","border-gray-50")
    }
}

getData()
</script>
<template>
    <!-- edit -->
    <div class="w-full p-[20px] relative">
        <button class="absolute w-[97%] flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="max-w-[800px] mx-auto my-[20px] border rounded-md p-[10px] ">

            <div class="flex justify-center">
                <div class="flex items-center">
                    <RouterLink to="/warehouse"
                        class="flex gap-1 items-center hover:bg-blue-500 w-[100px] hover:text-white border border-blue-500 rounded-md px-2 p-1">
                        <img :src="ArrowIconSVG" alt="ArrowIconSVG">
                        برگشتن
                    </RouterLink>
                </div>
                <div class="flex w-full justify-center">
                    <span class="flex justify-center my-3 text-[20px] font-bold text-center" v-if="dbData != null">ویرایش
                        <br />{{ dbData.name }}</span>
                </div>
            </div>

            <div class="flex flex-col mt-3">
                <p>
                    <span>نام</span>
                </p>
                <div class="w-full">
                    <input type="text" class="border rounded outline-none px-1 w-full" placeholder="نام کالا" id="name" :value="dbData.name">
                </div>
            </div>
            <div class="md:grid grid-flow-col grid-cols-5 gap-1">
                <div class="flex flex-col col-span-2" @keyup="calculator">
                    <span>قیمت خرید</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت خرید فی کالا" id="basePrice" :value="dbData.basePrice">
                </div>
                <div class="flex flex-col col-span-2" @keyup="calculator">
                    <span>قیمت فروش</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت فروش فی کالا" id="price" :value="dbData.price">
                </div>
                <div class="flex flex-col">
                    <span>سود</span>
                    <input type="text" class="border border-gray-50 rounded-md outline-none px-1 text-center"
                        placeholder="سود فی کالا" name="profit" id="profit" disabled :value="dbData.profit">
                </div>
            </div>
            <div class="md:grid grid-flow-col grid-cols-5 gap-1">
                <div class="flex flex-col col-span-2">
                    <span>وزن</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="وزن فی کالا" id="weight" :value="dbData.weight">
                </div>
                <div class="flex flex-col col-span-2" @keyup="calculator">
                    <span>تعداد</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="تعداد کالا" id="amount" :value="dbData.amount">
                </div>
                <div class="flex flex-col">
                    <span>سود در تعداد</span>
                    <input type="text" class="border border-gray-50 rounded-md outline-none px-1 text-center"
                        placeholder="سود محموله" name="profitxamount" id="profitxamount" disabled :value="parseInt(dbData.amount) * parseInt(dbData.profit)">
                </div>
            </div>
            <div class="md:grid grid-flow-col grid-cols-5 gap-1">
                <div class="flex flex-col col-span-4">
                    <span>فاکتور</span>
                    <input type="text" class="border rounded outline-none px-1" id="billId" placeholder="مشخصات فاکتور" :value="dbData.billId">
                </div>
                <div class="flex flex-col">
                    <span>تاریخ</span>
                    <div class="border rounded px-1 text-center flex items-center" @keyup="setDate">
                        <input type="text" class="w-full outline-none text-center" placeholder="روز" maxlength="2" id="day" :value="dbData.date.split('/')[2]">/
                        <input type="text" class="w-full outline-none text-center" placeholder="ماه" maxlength="2" id="month" :value="dbData.date.split('/')[1]">/
                        <input type="text" class="w-full outline-none text-center" placeholder="سال" maxlength="4" id="year" :value="dbData.date.split('/')[0]">
                    </div>
                </div>
            </div>


            <div class="w-full flex flex-col md:flex-row lg:justify-between gap-1 items-center mt-[10px]">
                <button @click="deleteData"
                class="border border-red-500 hover:bg-red-600 text-red-500 order-2 md:order-1 hover:text-white p-1 w-full lg:w-[100px] rounded">حذف</button>
            <button @click="patchData"
                class="border bg-blue-500 hover:bg-blue-600 order-1 md:order-2 text-white p-1 w-full lg:w-[200px] rounded">ذخیره</button>
        </div>
    </div>
</div>
<Loading v-if="loading"></Loading>
</template>
<style scoped>
input{
    padding: 5px;
}</style>