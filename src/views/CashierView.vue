<script setup>
import { onMounted, ref , reactive } from 'vue'
import Loading from '../components/loading.vue'
import RemoveIconSVG from '../assets/removeIcon.svg'
import axios from 'axios'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

let dbData = []

const newTransaction = reactive({
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
})
const state = reactive({
    closeBalance:false,
})

const balanceData = ref({ income: '', debt: '', current: '' })
const historyData = ref(null)
const loading = ref(false)
const message = ref(null)
let id = ref(null)


onMounted(() => {
    newTransaction.income.typeIn = 'کارتخوان1'
    newTransaction.outcome.typeOut = 'کارت به کارت'
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

const modalTab = reactive({
    status:false,
})

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
            <button class="bg-teal-500 text-white p-1 px-3 rounded-l hover:bg-teal-600 shadow-md hover:shadow-none" @click="state.closeBalance = !state.closeBalance">بستن دخل</button>
        </div>

        <div class="w-full h-full lg:flex gap-3 my-3">
            <div class="lg:w-1/3 lg:order-2 mb-3 lg:mb-0">
                <button class="bg-blue-500 text-white p-1 px-3 rounded hover:bg-blue-600 shadow-md hover:shadow-none w-full mb-3 h-[50px]" @click="newTransaction.modal = !newTransaction.modal">ثبت تراکنش</button>
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
                    <div class="py-2 px-3 w-full" v-for="item in ['نام کاربر', 'هزینه ها (ریال)', 'نوع پرداخت', 'توضیحات']">{{ item }}</div>
                </div>
                <div v-if="historyData != null" class="overflow-auto">
                    <div v-for="(item,index) in historyData" class="flex border-t text-center hover:bg-[#e9e9e9] relative" :key="item.id">
                        <div class="py-2 px-3 w-full">{{ item.receiverName }}</div>
                        <div class="py-2 px-3 w-full" dir="ltr">{{ item.amount }}</div>
                        <div class="py-2 px-3 w-full"> {{ item.type }}</div>
                        <div class="py-2 px-3 w-full">{{ item.description ? item.description : '-' }}</div>
                        <button class="bg-red-500 p-1 rounded-md text-white hover:bg-red-600 shadow-lg hover:shadow-none" v-if="IsDeleteActive(index)" @click="deleteData(index)">
                        <!-- <button class="absolute top-[50%] right-3 translate-y-[-50%] bg-red-500 p-1 rounded-md text-white hover:bg-red-600 shadow-lg hover:shadow-none" @click="deleteData(id)"> -->
                            <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <Loading v-if="loading"></Loading>

    <div v-if="newTransaction.modal" class="fixed top-0 left-0 w-screen h-screen z-10">
        <div class="flex justify-center items-center h-full w-full p-5">
            <div class="bg-white w-[500px] h-[500px] rounded shadow-lg p-10 z-20">
                <p class="text-[24px] font-bold text-center mb-3">
                    ثبت تراکنش جدید
                </p>
                <!-- tabs -->
                <div class="flex justify-center items-center">
                    <div class="relative flex justify-center items-center gap-10">
                        <button type="button" @click="modalTab.status = !modalTab.status">ورودی</button>
                        <button type="button" @click="modalTab.status = !modalTab.status">خروجی</button>
                        <div class="border-b border-2 absolute -bottom-1 border-blue-500 transition-all ease-in-out" :class="modalTab.status ? '-right-1 w-[50px]' : 'right-[80px] w-[60px]'"></div>
                    </div>
                </div>
                <!-- tab1 -->
                <div v-if="modalTab.status">
                    <div class="mb-3">
                        <span>حساب:</span>
                        <input type="text" placeholder="نام مالک حساب" class="outline-none border rounded w-full" v-model="newTransaction.income.receiverNameIn">
                    </div>
                    <div class="mb-3">
                        <span>مقدار:</span>
                        <div class="flex gap-3">
                            <select v-model="newTransaction.income.typeIn" class="w-full outline-none bg-transparent border rounded">
                                <option value="کارتخوان1">کارتخوان1</option>
                                <option value="کارتخوان2">کارتخوان2</option>
                                <option value="بیسیم1">بیسیم1</option>
                                <option value="بیسیم2">بیسیم2</option>
                                <option value="چک1">چک1</option>
                                <option value="چک2">چک2</option>
                                <option value="نقدی">نقدی</option>
                            </select>
                            <div class="flex items-center border rounded w-full">
                                <input type="text" placeholder="0" class="outline-none border-l w-full bg-transparent" v-model="newTransaction.income.paidIn" dir="ltr">
                                <span>(ریال)</span>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <span>توضیحات:</span>
                        <textarea type="text" v-model="newTransaction.income.descriptionIn" placeholder="توضیحات" rows="5"
                            class="border rounded p-2 w-full outline-none col-span-3 resize-none"></textarea>
                    </div>
                    <div>
                        <button type="button" class="bg-blue-500 text-white p-2 px-3 rounded w-full hover:bg-blue-600 shadow-md hover:shadow-none" @click="postEarning">ذخیره</button>
                    </div>
                </div>
                <!--tab2 -->
                <div v-if="!modalTab.status">
                    <div class="mb-3">
                        <span>نام:</span>
                        <input type="text" class="w-full p-1 px-2 outline-none border rounded" placeholder="نام" v-model="newTransaction.outcome.receiverNameOut">
                    </div>
                    <div class="mb-3">
                        <span>مقدار:</span>
                        <div class="flex gap-3">
                            <select v-model="newTransaction.outcome.typeOut" class="w-full p-1 px-2 outline-none border rounded">
                                <option value="کارت به کارت">کارت به کارت</option>
                                <option value="چک1">چک1</option>
                                <option value="چک2">چک2</option>
                                <option value="نقدی">نقدی</option>
                            </select>
                            <div class="flex items-center border rounded w-full">
                                <input type="text" class="w-full p-1 px-2 outline-none border-l" placeholder="هزینه" v-model="newTransaction.outcome.paidOut">
                                <span>(ریال)</span>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <span>توضیحات:</span>
                        <textarea type="text" v-model="newTransaction.outcome.descriptionOut" placeholder="توضیحات" rows="5" class="border rounded p-2 w-full outline-none col-span-3 resize-none"></textarea>
                    </div>
                    <div>
                        <button type="button" class="bg-blue-500 text-white p-2 px-3 rounded w-full hover:bg-blue-600 shadow-md hover:shadow-none" @click="postExpense">ذخیره</button>
                    </div>
                </div>
    
            </div>
            
            <div class="absolute w-full h-full bg-[#00000031] z-10" @click="newTransaction.modal = !newTransaction.modal"><!-- close modal action --></div>
        </div>
    </div>

    <div v-if="state.closeBalance" class="absolute top-0 left-0 w-screen h-screen flex justify-center items-center">
        <div class="bg-white w-[300px] h-[280px] rounded shadow-lg p-10 z-20">
            <p class="text-[24px] font-bold mb-3 text-center">
                آیا مطمئن به بستن حساب امروز هستید؟
            </p>
            <div class="flex justify-center items-center gap-3 mt-10">
                <button class="p-1 px-3 bg-blue-500 rounded text-white w-[200px] h-[50px] transition-all hover:scale-105 hover:bg-blue-600">بله</button>
                <button class="p-1 px-3 border border-red-500 bg-white rounded text-red-500 w-[200px] h-[50px] transition-all hover:bg-red-500 hover:text-white hover:scale-105" @click="state.closeBalance = !state.closeBalance">خیر</button>
            </div>
        </div>
        
        <div class="absolute w-full h-full bg-[#00000031] z-10" @click="state.closeBalance = !state.closeBalance"><!-- close modal action --></div>
    </div>
</template>

<style scoped>
input {
    padding: 5px;
}</style>
