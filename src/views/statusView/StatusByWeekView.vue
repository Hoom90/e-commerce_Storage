<script setup>
import { onMounted, ref } from 'vue'
const balanceHistories = ref(null)
const itemHistories = ref(null)

const message = ref(null)
const loading = ref(false)

onMounted(async()=>{
    document.querySelector("#selectedDateIncome").innerText = 0
    document.querySelector("#selectedDateDebt").innerText = 0
    document.querySelector("#selectedDateCurrent").innerText = 0
    getData()
})

//#region API
const getData = async() => {
    loading.value = true
    await getBalanceHistories()
    await getItemHistories()
    loading.value = false
}

// Get All Balance History
const getBalanceHistories = async () =>{
    await axiosApi.get("/balanceHistories/").then(res =>{
        let data = res.data
        let sample = [];
        // find All Dates which has History
        data.forEach(item => {
            let temp = 1
            if(parseInt(item.date.split('-')[2]) >= 1 && parseInt(item.date.split('-')[2]) <= 7){
                temp = "هفته 1 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 8 && parseInt(item.date.split('-')[2]) <= 14){
                temp = "هفته 2 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 15 && parseInt(item.date.split('-')[2]) <= 21){
                temp = "هفته 3 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 22 && parseInt(item.date.split('-')[2]) <= 28){
                temp = "هفته 4 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 29 && parseInt(item.date.split('-')[2]) <= 31){
                temp = "هفته 5 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if (!sample.includes(temp)) {
                historyDateData.value.push(temp);
                sample.push(temp);
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
    await axiosApi.get("/itemHistories/").then(res =>{
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
//#endregion

//#region Status Type Is Selected By Day

const selectedDateLogs = ref([])
const selectedDateItemLogs = ref([])
const historyDateData = ref([])


const handleSelectedDate = (date) =>{
    document.querySelector("#selectedWeek").value = date
    let income = 0, debt = 0 ,current = 0
    balanceHistories.value.forEach(item =>{
        let temp = 1
        if(parseInt(item.date.split('-')[2]) >= 1 && parseInt(item.date.split('-')[2]) <= 7){
                temp = "هفته 1 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 8 && parseInt(item.date.split('-')[2]) <= 14){
                temp = "هفته 2 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 15 && parseInt(item.date.split('-')[2]) <= 21){
                temp = "هفته 3 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 22 && parseInt(item.date.split('-')[2]) <= 28){
                temp = "هفته 4 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 29 && parseInt(item.date.split('-')[2]) <= 31){
                temp = "هفته 5 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
        if(date == temp ){
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
        let temp = 1
        if(parseInt(item.date.split('-')[2]) >= 1 && parseInt(item.date.split('-')[2]) <= 7){
                temp = "هفته 1 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 8 && parseInt(item.date.split('-')[2]) <= 14){
                temp = "هفته 2 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 15 && parseInt(item.date.split('-')[2]) <= 21){
                temp = "هفته 3 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 22 && parseInt(item.date.split('-')[2]) <= 28){
                temp = "هفته 4 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 29 && parseInt(item.date.split('-')[2]) <= 31){
                temp = "هفته 5 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
        if(date == temp ){
            item.description = item.description == '' ? '-' : item.description 
            selectedDateLogs.value.push(item)
        }
    })
    document.querySelector("#selectedDateIncome").innerText = income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    document.querySelector("#selectedDateDebt").innerText = debt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    document.querySelector("#selectedDateCurrent").innerText = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    selectedDateItemLogs.value = []
    itemHistories.value.forEach(item =>{
        let temp = 1
        if(parseInt(item.date.split('-')[2]) >= 1 && parseInt(item.date.split('-')[2]) <= 7){
                temp = "هفته 1 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 8 && parseInt(item.date.split('-')[2]) <= 14){
                temp = "هفته 2 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 15 && parseInt(item.date.split('-')[2]) <= 21){
                temp = "هفته 3 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 22 && parseInt(item.date.split('-')[2]) <= 28){
                temp = "هفته 4 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
            if(parseInt(item.date.split('-')[2]) >= 29 && parseInt(item.date.split('-')[2]) <= 31){
                temp = "هفته 5 - برج "+parseInt(item.date.split('-')[1])+" - سال "+item.date.split('-')[0]
            }
        if(date == temp ){
            selectedDateItemLogs.value.push(item)
        }
    })
}

const setWeek = () =>{
  return document.querySelector("#selectedWeek").value
}
//#endregion

</script>
<template>
    <main class="flex flex-col pt-[25px] justify-center items-center relative">
        <div class=" w-full px-5 flex items-center gap-1 -z-10">
            <span class="text-[24px]">آمار</span>
            <span>&#62;</span>
            <div>دخل و خرج ها</div>
            <span>&#62;</span>
            <div>هفتگی</div>
        </div>
        <button class="absolute w-full flex justify-between top-0 left-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="w-full px-[20px]">
            <!-- header -->
            <!-- state nav -->
            <div class="flex mb-[10px]">
                <RouterLink to="/status" class="border-b-2 p-1 px-3 hover:border-blue-500">روزانه</RouterLink>
                <RouterLink to="/status/week" class="border-b-2 p-1 px-3 border-blue-500">هفتگی</RouterLink>
                <RouterLink to="/status/month" class="border-b-2 p-1 px-3 hover:border-blue-500">ماهانه</RouterLink>
                <RouterLink to="/status/year" class="border-b-2 p-1 px-3 hover:border-blue-500">سالانه</RouterLink>
            </div>
            <!-- body -->
            <div class="grid lg:grid-flow-col lg:grid-cols-12 gap-1 w-full lg:h-[70vh]">

                <!-- history Dates Data -->
                <div class="lg:col-span-3 overflow-y-auto border h-full">
                    <div class="flex border-b" @keyup="handleSelectedDate(setWeek())">
                        <img class="border-l p-1" :src="SearchIconSVG" alt="S">
                        <div class="flex p-1 w-full">
                            <input type="text" class="w-full text-center outline-none" id="selectedWeek" placeholder="هفته - برج - سال">
                        </div>
                    </div>
                    <div class="border-b bg-white">
                        <div class="py-2 px-3 flex justify-center items-center truncate">تاریخ</div>
                    </div>
                    <div class="flex flex-col" v-if="historyDateData != null" id='historyDateDataContainer'>
                        <div v-for="(item,index) in historyDateData" class="grid grid-flow-col border-b odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key='index'>
                            <button class="flex justify-center items-center truncate p-2 px-3" @click="handleSelectedDate(item)">{{ item }}</button>
                        </div>
                    </div>
                </div>

                <!-- table -->
                <div class="flex flex-col lg:col-span-9 gap-1">
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
                                        <span dir="ltr">{{ data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
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
                                    <span>{{ data.newAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
                                    <span>{{ data.unit }}</span>
                                </div>
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