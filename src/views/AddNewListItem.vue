<script setup>
import store from '../store';

import { ref } from 'vue'
import ArrowIconSVG from '../assets/arrowLeftIcon.svg'
import RemoveIconSVG from '../assets/removeIcon.svg'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import AddNewItem from '../components/addNewItem.vue'
import router from '../config'
import axios from 'axios'
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

const billInfo = ref(null)
const date = ref(null)
const costs = ref(0)
const pay = ref(0)

const dbData = ref(null)
const balanceData = ref(null);
const loading = ref(false)
const message = ref(null)
const billData = ref([])
const modal = ref(false)

const getData = async () => {
  loading.value = true;
  await getItems();
  await getBalance();
  loading.value = false;
};

// Get All Data
const getItems = async () => {
  await axios
    .get(serverURL + "/api/itemTransaction/")
    .then((res) => {
      dbData.value = res.data;
    })
    .catch(function (error) {
      console.log(error);
      message.value = error;
      loading.value = false;
    });
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

// POST List
const postData = async () => {
    loading.value = true
    const body = []
    let outcome = costs.value.replace(',','')
    let paid = pay.value.replace(',','')
    body.push({
        'outcome': (-(outcome - paid)).toString(),
        'balance': balanceData.value.balance ? (parseInt(balanceData.value.balance) - (outcome - paid)).toString() : (-(outcome - paid)).toString(),
        'card' : (-paid).toString(),
        'description': 'خرید فاکتور',
        'date': date.value,
    })
    for(let i=0;i<billData.value.length;i++){
        body.push({
            'name': billData.value[i].name,
            'weight': billData.value[i].weight,
            'basePrice': billData.value[i].basePrice,
            'price': billData.value[i].price,
            'profit': billData.value[i].profit,
            'amount': billData.value[i].amount,
            'billId': billData.value[i].billId,
            'date': billData.value[i].date
        })
    }
    await axios.post(serverURL + "/api/itemTransaction/list",body, {
        headers: {
            'Authorization': 'Bearer ' + getWithExpiry('token'),
        }
    })
    .then(res =>{
        router.push("/warehouse")
    })
    .catch((error) => {
      console.log(error);
      message.value = error;
    })
    .finally((loading.value = false));
}

let day = ref(dayjs().calendar('jalali').locale('fa').format('DD'));
let month = ref(dayjs().calendar('jalali').locale('fa').format('MM'));
let year = ref(dayjs().calendar('jalali').locale('fa').format('YYYY'));
const setDate = () => {
    date.value = year.value + '/' + month.value + '/' + day.value
}

const removeItemFromList = (index) =>{
    costs.value = formatData(parseInt(costs.value.replace(',','')) - parseInt(billData.value[index].basePrice))
    billData.value.splice(index, 1);
}

const updateModal = (value) =>{
    modal.value = value
}

const updateItem = (item)=>{
    billData.value.push(item.value)
    if(costs.value != 0){
        costs.value = formatData(parseInt(costs.value.replace(',','')) + (parseInt(item.value.basePrice)*parseInt(item.value.amount)))
    }
    else{
        costs.value = formatData(parseInt(costs.value) + (parseInt(item.value.basePrice)*parseInt(item.value.amount)))
    }
    pay.value = costs.value
}

const formatData = (data) => {
  if(data){
    return (data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }
};

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    store.dispatch("auth/logout");
    router.push("/login");
    return null;
  }
  return item.value;
}

getData()
</script>
<template>
    <!-- multi add -->
    <div class="w-full relative" v-if="!modal">
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="p-[20px]">
            <div class="max-w-[800px] mx-auto my-[20px] border rounded-md p-[10px]">

                <!-- header -->
                <div class="flex justify-center">
                    <div class="flex items-center">
                        <RouterLink to="/warehouse" class="flex gap-1 items-center hover:bg-red-500 hover:text-white border border-red-500 rounded-md p-2">
                            <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                        </RouterLink>
                    </div>
                    <div class="flex w-full justify-center">
                        <span class="flex justify-center my-3 text-[20px] font-bold">فاکتور جدید</span>
                    </div>
                </div>

                <!-- body -->
                <div>
                    <div class="flex gap-1 mb-3">
                        <div class="flex flex-col w-4/5">
                            <span>فاکتور</span>
                            <input type="text" class="border rounded outline-none px-1" placeholder="مشخصات فاکتور" v-model="billInfo" @keyup="setDate">
                        </div>
                        <div class="flex flex-col w-1/5">
                            <span>تاریخ</span>
                            <div class="border rounded px-1 text-center flex items-center" @keyup="setDate">
                                <input type="text" class="w-full outline-none text-center" placeholder="01" v-model="day">/
                                <input type="text" class="w-full outline-none text-center" placeholder="01" v-model="month">/
                                <input type="text" class="w-full outline-none text-center" placeholder="1402" v-model="year">
                            </div>
                        </div>
                    </div>
                    <div v-if="billInfo">
                        <span>لیست کالاهای فاکتور</span>
                        <div class="w-full grid gap-1 overflow-y-scroll max-h-[300px]"
                            v-if="billData != null">
                            <div class="border relative hover:bg-[#c9c9c9] odd:bg-[#f6f6f6]" v-for="(item, index) in billData"
                                :name="'item' + index" id="itemData" v-bind:key="index">
                                <div class='flex justify-between items-center pr-3 text-[12px] truncate'>
                                    <button class="flex justify-between w-11/12">
                                        <span>{{ item.name }}</span>
                                        <span>{{ item.basePrice != null ? "تومان "+item.basePrice : "بدون قیمت"}}</span>
                                    </button>
                                    <button class='bg-red-500 text-white p-1' @click="removeItemFromList(index)">
                                        <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                                    </button>
                                </div>
                            </div>
                            <button @click="() => {modal = true}" class="border bg-blue-500 text-center hover:bg-blue-600 text-white p-[10px]">
                                افزودن کالا
                            </button>
                        </div>
                    </div>
                </div>

                <!-- footer -->
                <div class="w-full flex flex-col md:flex-row items-center mt-[10px] text-center">
                    <div class="grid grid-flow-col grid-cols-2 items-center gap-1 w-full mb-1">
                        <span>جمع کل بدهی:</span>
                        <span class="text-white bg-red-500 p-[5px]" dir="ltr">{{ costs }}</span>
                        <span>تومان</span>
                    </div>
                    <div class="grid grid-flow-col grid-cols-2 items-center gap-1 w-full">
                        <span>پرداخت:</span>
                        <input type="text" v-model="pay" class="text-center border border-blue-500">
                        <span>تومان</span>
                    </div>
                    <div class="w-full flex justify-end mt-[10px] md:mt-0">
                        <button
                            @click="postData"
                            class="border bg-blue-500 hover:bg-blue-600 text-white p-1 w-full rounded"
                        >
                            ذخیره
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AddNewItem v-if="modal" :modal="modal" :data="dbData" :billId="billInfo" :date="date" @update:modal="updateModal" @set:item="updateItem"></AddNewItem>
    <Loading v-if="loading"></Loading>
</template>
<style scoped>
input{
    padding: 5px;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
