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
        <div class="max-w-[400px] mx-auto my-[20px] border rounded-md p-[10px] ">

            <div class="flex justify-center relative">
                <div class="absolute top-5 right-5 flex items-center">
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

            <!-- form -->
            <div class="flex flex-col gap-1">
                <!-- name date -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <div>نام</div>
                        <input type="text" class="border rounded px-1 w-full" placeholder="نام کالا" id="name" :value="dbData.name" @input="setName">
                    </div>
                    <div class="flex flex-col col-span-1">
                        <div>تاریخ ثبت</div>
                        <div class="flex items-center col-span-1 border rounded bg-slate-100">
                            <input class="w-full text-center" :value="dbData.date.split('-')[2]" disabled>/
                            <input class="w-full text-center" :value="dbData.date.split('-')[1]" disabled>/
                            <input class="w-full text-center" :value="dbData.date.split('-')[0]" disabled>
                        </div>
                    </div>
                </div>
                <!-- seller company -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>فروشنده</span>
                        <input type="text" class="rounded text-center" :value="dbData.sellerName" disabled>
                    </div>
                    <div class="flex flex-col col-span-1">
                        <span>شرکت</span>
                        <input type="text" class="rounded text-center" :value="dbData.company" disabled>
                    </div>
                </div>
                <!-- purchase sale price -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>قیمت خرید</span>
                        <input type="text" class="rounded text-center" :value="dbData.purchasePrice" disabled>
                    </div>
                    <div class="flex flex-col col-span-1" @keyup="calculator">
                        <span>قیمت فروش</span>
                        <input type="text" class="border rounded text-center" placeholder="قیمت فروش فی کالا" id="salesPrice" :value="dbData.salesPrice" @input="setSalesPrice">
                    </div>
                </div>
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>تعداد</span>
                        <input type="text" class="rounded text-center" disabled :value="dbData.amount">
                    </div>
                    <div class="flex flex-col col-span-1">
                        <span>واحد</span>
                        <input type="text" class="rounded text-center" disabled :value="dbData.unit">
                    </div>
                </div>
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>سود</span>
                        <input type="text" class="rounded text-center" disabled :value="dbData.profit">
                    </div>
                    <div class="flex flex-col col-span-1">
                        <span>سود کل</span>
                        <input type="text" class="rounded text-center" disabled :value="dbData.profit * dbData.amount">
                    </div>
                </div>
            </div>

            <!-- buttons -->
            <div class="w-full flex flex-col md:flex-row lg:justify-between gap-1 items-center mt-[10px]">
                <button @click="deleteData"
                class="border border-red-500 hover:bg-red-600 text-red-500 order-2 md:order-1 hover:text-white p-1 w-1/2 rounded">حذف</button>
                <button @click="patchData"
                    class="border bg-blue-500 hover:bg-blue-600 order-1 md:order-2 text-white p-1 w-1/2 rounded">ذخیره</button>
            </div>
    </div>
</div>
<Loading v-if="loading"></Loading>
</template>
<style scoped>
input{
    padding: 5px;
}</style>