<script setup>
import { ref } from 'vue'
import Loading from './loading.vue'
import serverURL from '../router/serverAddress'
import AuthService from "../services/auth.service";

const dbData = ref(null)
const dbDates = ref(null)
const hasData = ref(true)
const loading = ref(false)
const init = ref(true)

let selectedDateOutcome = ref([])
let selectedDateIncome = ref(null)

async function getData() {
    dbData.value =null
    hasData.value = true
    loading.value = true
    await fetch(serverURL + "/api/balanceTransaction/")
    .then((res) => {
            if (!res.ok) {
                hasData.value = false
                loading.value = false
                openError.value = true
                errorMessage.value = "مشکلی رخ داد دوباره تلاش کنید!"
            }
            hasData.value = true
            loading.value = false
            return res.json();
        })
        .then((data) => {
            if (data.length != 0) {
                hasData.value = true
                dbData.value = data;
                init.value = false
                loading.value = false
            }
            else {
                hasData.value = false
                loading.value = false
            }
            if(dbData.value != null){
                const temp = [];
                for (let i = 0; i < dbData.value.length; i++) {
                    const currentDate = dbData.value[i].date;
                    let isDuplicate = false;
                    
                    // بررسی تکراری بودن تاریخ
                    for (let j = 0; j < dbData.value.length; j++) {
                        if (i !== j && currentDate === dbData.value[j].date) {
                        isDuplicate = true;
                        break;
                        }
                    }
                    
                    // اضافه کردن تاریخ به آرایه temp
                    if (isDuplicate && !temp.includes(currentDate)) {
                        temp.push(currentDate);
                    }
                }
                dbDates.value = temp
            }
        })
}

const patchData = async (index,index2) =>{
    hasData.value = true
    loading.value = true
    let id = ''
    if(index != null){
        for(let i=0;i<selectedDateOutcome.value.length;i++){
            if(i=== index){
                id = selectedDateOutcome.value[i]._id
            }
        }
    }
    else if(index2 != null){
        id = selectedDateIncome.value.data._id
    }
    let body = null
    if(index != null){
        let name = document.querySelector('#personName'+index).value
        let cost = document.querySelector('#cost'+index).value
        let description = document.querySelector('#description'+index).value
        body = {
            'personName': name,
            'cost': cost,
            'description': description,
        }
    }
    if(index2 != null){
        let cash = document.querySelector('#cash'+index2).value
        let card = document.querySelector('#card'+index2).value
        body = {
            'cash': cash,
            'card': card,
        }
    }
    await fetch(serverURL + "/api/balanceTransaction/" + id, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            if (!res.ok) {
                hasData.value = false
                loading.value = false
                openError.value = true
                errorMessage.value = "مشکلی رخ داد دوباره تلاش کنید!"
            }
            hasData.value = true
            loading.value = false
            return res.json();
        })
        .then(async() => {
                dbData.value =null
                getData()
                selectedDateIncome.value = null
                selectedDateOutcome.value = []
                flag.value= false
                alert("عملیات باموفقیت انجام شد")
            }
        );
}

const handleSelectedDate = (date) =>{
    selectedDateOutcome.value = []
    selectedDateIncome.value = null
    for(let i=0;i<dbData.value.length;i++){
        if(date === dbData.value[i].date){
            if(dbData.value[i].cash || dbData.value[i].card){
                selectedDateIncome.value = {
                    'data' :dbData.value[i],
                    'index': i
                }
            }
            else{
                selectedDateOutcome.value.push(dbData.value[i]) 
            }
        }
    }
}

let flag = ref(false)
const handleOutcome = (index) =>{
    if(!flag.value){
        document.querySelector('[name="persons' + index + '"]').children[1].classList.replace('hidden','grid')
        flag.value = true
    }
    else{
        document.querySelector('[name="persons' + index + '"]').children[1].classList.replace('grid','hidden')
        flag.value = false
    }
}

let flag2 = ref(false)
const handleIncome = (index) =>{
    if(!flag2.value){
        document.querySelector('[name="cashier' + index + '"]').children[1].classList.replace('hidden','grid')
        flag2.value = true
    }
    else{
        document.querySelector('[name="cashier' + index + '"]').children[1].classList.replace('grid','hidden')
        flag2.value = false
    }
}

getData()

</script>
<template>
    <main class="flex flex-col pt-[20px] justify-center items-center">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between">
            <span>آمار</span>
        </div>
        <!-- closed accounts -->
        <div class="w-[90%] m-10 overflow-y-auto">
            <div>حسابهای بسته شده و جاری</div>
            <div class="grid border-b bg-white">
                <div class="py-2 px-3 flex justify-center items-center text-[12px] truncate">تاریخ</div>
            </div>
            <div class="flex flex-col">
                <div v-if="dbDates != null" v-for="date in dbDates" class="grid grid-flow-col border-b odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]">
                    <button class="flex justify-center items-center text-[12px] truncate p-2 px-3" @click="handleSelectedDate(date)">{{ date }}</button>
                </div>
            </div>
        </div>
        <div class="grid grid-flow-col border-b bg-white w-[90%]">
            <div class="py-2 px-3 flex justify-center">نام کاربر</div>
            <div class="py-2 px-3 flex justify-center">هزینه ها</div>
            <div class="py-2 px-3 flex justify-center">توضیحات</div>
        </div>
        <div v-if="selectedDateOutcome" v-for="(date,index) in selectedDateOutcome" class="w-[90%] odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" :name="'persons' + index">
            <button @click="handleOutcome(index)" class="grid grid-flow-col grid-cols-3 w-full p-1 border-b">
                <span>{{ date.personName }}</span>
                <span>{{ date.cost }}</span>
                <span>{{ date.description }}</span>
            </button>
            <div class="hidden gap-1 my-1 bg-white">
                <div class="grid grid-flow-col grid-cols-3 gap-1 my-1 bg-white">
                    <input type="text" class=" bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش نام" :id="'personName'+index">
                    <input type="text" class=" bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش هزینه" :id="'cost'+index">
                    <input type="text" class=" bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش توضیحات" :id="'description'+index">
                </div>
                <button class="bg-blue-500 hover:bg-blue-600 p-2 text-white" @click="patchData(index)">ذخیره تغییرات</button>
            </div>
        </div>
        <div v-if="selectedDateIncome" class="flex flex-col w-[25%] mt-3" :name="'cashier' + selectedDateIncome.index">
            <button class="flex justify-between w-full hover:bg-[#f6f6f6] border-t border-b py-1" @click="handleIncome(selectedDateIncome.index)">
                <div class="flex gap-3">
                    <span>نقد</span>
                    <span>{{ selectedDateIncome.data.cash }}</span>
                </div>
                <div class="flex gap-3">
                    <span>کارت به کارت</span>
                    <span>{{ selectedDateIncome.data.card }}</span>
                </div>
            </button>
            <div class="hidden gap-1 my-1 w-full">
                <div class="grid grid-flow-col grid-cols-2 gap-1 my-1">
                    <input type="text" class=" bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش نقد" :id="'cash'+selectedDateIncome.index">
                    <input type="text" class=" bg-transparent outline-none border border-blue-500 placeholder:text-center text-center p-1" placeholder="ویرایش کارت" :id="'card'+selectedDateIncome.index">
                </div>
                <button class="bg-blue-500 hover:bg-blue-600 p-2 text-white" @click="patchData(null,selectedDateIncome.index)">ذخیره تغییرات</button>
            </div>
        </div>
    </main>
    <Loading :loading="loading"></Loading>
</template>
