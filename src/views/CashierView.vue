<script setup>
import addTransitionComp from "./cashierView/addTransactionComp.vue"
import closeBalanceComp from "./cashierView/closeBalanceComp.vue"
import { onMounted, ref , reactive } from 'vue'
import Loading from '../components/loading.vue'
import RemoveIconSVG from '../assets/removeIcon.svg'
import axios from 'axios'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

let dbData = []

const state = reactive({
    income:{
        receiverNameIn:null,
        paidIn:null,
        descriptionIn:null,
        typeIn:null,
    },
    outcome:{
        receiverNameOut:null,
        paidOut:null,
        descriptionOut:null,
        typeOut:null,
    },
    modal:false,
    closeBalance:false,
})

const balanceData = ref({ income: '', debt: '', current: '' })
const historyData = ref(null)
const loading = ref(false)
const message = ref(null)
let id = ref(null)


onMounted(() => {
    state.income.typeIn = 'کارتخوان1'
    state.outcome.typeOut = 'کارت به کارت'
})

const getData = async () => {
    balanceData.value = { income: '', debt: '', current: '' }
    historyData.value = null
    loading.value = true
    await getBalance()
    await getBalanceLogs()
    calculateTodayBalance()
    formatHistoryData()
    loading.value = false
}

// Get Today Transactions
const getBalance = async () => {
    await axios.get(import.meta.env.VITE_BASE_URL + "/balanceTransaction/" + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
        (res) => {
            dbData = res.data
        }
    )
        .catch(function (error) { console.log(error), loading.value = false, message.value = error })
}

// Get All Histories
const getBalanceLogs = async () => {
    await axios.get(import.meta.env.VITE_BASE_URL + "/balanceHistories/" + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
        (res) => {
            historyData.value = res.data
            // [
            //     { id: 0, receiverName: 'محمد مهدوی', amount: '20,000', type: 'فروش', description: 'مرغ بهاران 2,150 گرم' },
            //     { id: 1, receiverName: 'محمد مهدوی', amount: '-40,000', type: 'خرید', description: 'تعمیر یخچال مغازه' },
            //     { id: 2, receiverName: 'محمد مهدوی', amount: '22,000', type: 'کارت به کارت' },
            //     { id: 3, receiverName: 'محمد مهدوی', amount: '25,000,000', type: 'کارت به کارت' },
            //     { id: 4, receiverName: 'محمد مهدوی', amount: '-5,000', type: 'خرید', description: 'نان تافتون 10 عدد' },
            //     { id: 4, receiverName: 'محمد مهدوی', amount: '-5,000', type: 'خرید', description: 'نان تافتون 10 عدد' },
            //     { id: 4, receiverName: 'محمد مهدوی', amount: '-5,000', type: 'خرید', description: 'نان تافتون 10 عدد' },
            //     { id: 4, receiverName: 'محمد مهدوی', amount: '-5,000', type: 'خرید', description: 'نان تافتون 10 عدد' },
            //     { id: 4, receiverName: 'محمد مهدوی', amount: '-5,000', type: 'خرید', description: 'نان تافتون 10 عدد' },
            //     { id: 4, receiverName: 'محمد مهدوی', amount: '-5,000', type: 'خرید', description: 'نان تافتون 10 عدد' },
            // ]
        }
    )
        .catch((error) => { console.log(error), loading.value = false, message.value = error })
}

//POST
const postExpense = async () => {
    if (newTransaction.outcome.receiverNameOut == null) {
        message.value = "مالک حساب نباید خالی باشد"
        return
    }
    if (newTransaction.outcome.paidOut == null) {
        message.value = "مبلغ نباید خالی باشد"
        return
    }
    if (newTransaction.outcome.descriptionOut == null) {
        message.value = "توضیحات نباید خالی باشد"
        return
    }
    const body = {
        receiverName: newTransaction.outcome.receiverNameOut,
        paid: newTransaction.outcome.paidOut,
        description: newTransaction.outcome.descriptionOut,
        type: newTransaction.outcome.typeOut,
        date: dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD'),
    };
    loading.value = true;
    await axios.post(import.meta.env.VITE_BASE_URL + "/balanceTransaction/expense", body, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
        .then(
            newTransaction.outcome.receiverNameOut = null,
            newTransaction.outcome.paidOut = null,
            newTransaction.outcome.descriptionOut = null,
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
const postEarning = async () => {
    if (newTransaction.income.receiverNameIn == null) {
        message.value = "مالک حساب را وارد کنید"
        return
    }
    if (newTransaction.income.paidIn == null) {
        message.value = "مبلغ را وارد کنید"
        return
    }
    if (newTransaction.income.descriptionIn == null) {
        newTransaction.income.descriptionIn = "ورودی خارج از سیستم"
    }
    const body = {
        receiverName: newTransaction.income.receiverNameIn,
        paid: newTransaction.income.paidIn,
        description: newTransaction.income.descriptionIn,
        type: newTransaction.income.typeIn,
        date: dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD'),
    };
    // console.log(body);
    loading.value = true;
    await axios.post(import.meta.env.VITE_BASE_URL + "/balanceTransaction/earning", body, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
        .then(
            newTransaction.income.paidIn = null,
            newTransaction.income.receiverNameIn = null,
            newTransaction.income.descriptionIn = null,
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
const deleteData = async (index) => {
    let id = historyData.value[index]._id
    let fk = historyData.value[index].fk
    const body = {
        id,
        fk,
    };
    const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    };
    loading.value = true
    await axios.delete(import.meta.env.VITE_BASE_URL + "/balanceTransaction/" + id, { headers, data: body })
        .then(
            document.querySelector('div[name=data' + index + ']').classList.replace('grid', 'hidden'),
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


const calculateTodayBalance = () => {
    let current = 0, income = 0, debt = 0;
    dbData.forEach(item => {
        if (parseInt(item.action) > 0) {
            income += parseInt(item.action)
        }
        if (parseInt(item.action) < 0) {
            debt += parseInt(item.action)
        }
        current += parseInt(item.action)
    });
    income = income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    debt = (debt * -1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    current = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    balanceData.value = {
        income,
        debt,
        current,
    }
}

const formatHistoryData = () => {
    let temp = []
    historyData.value.forEach(item => {
        item.amount = item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        temp.push(item)
    })
    historyData.value = temp
}

const IsDeleteActive = (index) => {
    // if(historyData.value[index].description == '') return false
    // else return true
}

getData()
</script>
<template>
    <main class="relative">
        <button class="absolute w-full flex justify-between top-0 right-0 bg-red-500 text-white p-2 text-[12px]"
            v-if="message" @click="() => { message = null }">
            {{ message }}
            <i>x</i>
        </button>

        <div class="flex justify-between border rounded">
            <p class="text-[24px] p-1 px-3">صندوق</p>
            <button class="bg-teal-500 text-white p-1 px-3 rounded-l hover:bg-teal-600 shadow-md hover:shadow-none"
                @click="state.closeBalance = !state.closeBalance">بستن دخل</button>
        </div>

        <div class="w-full h-full lg:flex gap-3 my-3">
            <div class="lg:w-1/3 lg:order-2 mb-3 lg:mb-0">
                <button
                    class="bg-blue-500 text-white p-1 px-3 rounded hover:bg-blue-600 shadow-md hover:shadow-none w-full mb-3 h-[50px]"
                    @click="state.modal = !state.modal">ثبت تراکنش</button>
                <div class="border rounded min-h-[100px] p-3">
                    <p class="flex justify-between"><span>درآمد امروز: </span><span>{{ balanceData.income }}
                            (ریال)</span></p>
                    <p class="flex justify-between"><span>بدهی امروز: </span><span>{{ balanceData.debt }} (ریال)</span>
                    </p>
                    <p class="flex justify-between"><span>وضعیت دخل امروز: </span><span>{{ balanceData.current }}
                            (ریال)</span></p>
                </div>
            </div>
            <div class="w-full border rounded lg:order-1">
                <div class="flex text-center">
                    <div class="py-2 px-3 w-full"
                        v-for="item in ['نام کاربر', 'هزینه ها (ریال)', 'نوع پرداخت', 'توضیحات']">{{ item }}</div>
                </div>
                <div v-if="historyData != null" class="overflow-auto">
                    <div v-for="(item,index) in historyData"
                        class="flex border-t text-center hover:bg-[#e9e9e9] relative" :key="item.id">
                        <div class="py-2 px-3 w-full">{{ item.receiverName }}</div>
                        <div class="py-2 px-3 w-full" dir="ltr">{{ item.amount }}</div>
                        <div class="py-2 px-3 w-full"> {{ item.type }}</div>
                        <div class="py-2 px-3 w-full">{{ item.description ? item.description : '-' }}</div>
                        <button
                            class="bg-red-500 p-1 rounded-md text-white hover:bg-red-600 shadow-lg hover:shadow-none"
                            v-if="IsDeleteActive(index)" @click="deleteData(index)">
                            <!-- <button class="absolute top-[50%] right-3 translate-y-[-50%] bg-red-500 p-1 rounded-md text-white hover:bg-red-600 shadow-lg hover:shadow-none" @click="deleteData(id)"> -->
                            <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <Loading v-if="loading"></Loading>

    <addTransitionComp v-if="state.modal" :income="state.income" :outcome="state.outcome"
        @closeForm="(value) => state.modal = value" @postEarning="postEarning" @postExpense="postExpense" />

    <closeBalanceComp v-if="state.closeBalance" @close="(value) => state.closeBalance = value"/>
</template>

<style scoped>
input {
    padding: 5px;
}</style>
