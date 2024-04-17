<script setup>
import { ref } from 'vue'
let item = {
    name:'',
    sellerName:'',
    company:'',
    purchasePrice:'',
    salesPrice:'',
    amount:'',
    unit:'',
    profit:'',
    date:'',
    update:'',
}

let tempItem
const message = ref(null)
const loading = ref(false)
const openError = ref(false)
const errorMessage = ref(null)
const instance = getCurrentInstance()
const axiosApi = instance.appContext.config.globalProperties.$axiosApi
const getData = async () => {
    loading.value = true;
    await axiosApi.get(apiPath.storage.getSingleItem(route.currentRoute.value.params.id))
    .then((res)=>{
        item = 
        {
            name:res.data.name,
            sellerName:res.data.sellerName,
            company:res.data.company,
            purchasePrice:res.data.purchasePrice,
            salesPrice:res.data.salesPrice,
            amount:res.data.amount,
            unit:res.data.unit,
            profit:res.data.profit,
            date:res.data.date,
            update:'',
        }
        tempItem = item
    })
    .catch((error) => {
        console.log(error);
        loading.value = false
        message.value = error
    })
    loading.value = false;
};

const patchData  = async() =>{
    loading.value = true
    if(tempItem == item){
        loading.value = false
        router.push('/warehouse')
    }
    item.update = dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    const body = item
    await axiosApi.patch(apiPath.storage.editSingleItem(route.currentRoute.value.params.id), body, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    .then(
        router.push('/warehouse')
    )
    .catch((error) => {
        console.log(error);
        loading.value = false
        message.value = error
    }).finally(
        loading.value = false,
    )
}

const deleteData  = async() =>{
    let description = document.querySelector('#description').value
    const body = {
        description: description,
        date: dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')
    }
    const headers= {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }
    loading.value = true
    await axiosApi.delete(apiPath.storage.deleteSingleItem(route.currentRoute.value.params.id),{headers,data:body})
    .then(
        router.push('/warehouse')
    )
    .catch((error) => {
        console.log(error);
        loading.value = false
        message.value = error
    }).finally(
        loading.value = false,
    )
}

//#region set props method
const setName = () =>{
    item.name = document.querySelector("#name").value
}

const setSalesPrice = () =>{
    item.salesPrice = document.querySelector("#salesPrice").value.replace(',','').replace(',','').replace(',','').replace(',','')
}

const setProfit = ()=>{
    item.profit = item.salesPrice - item.purchasePrice
}

const setDay = () =>{
    return document.querySelector("#day").value
}

const setMonth = () =>{
    return document.querySelector("#month").value
    
}

const setYear = () =>{
    return document.querySelector("#year").value
    
}
const calculateDate = () =>{
    item.date = setYear() + '-' + setMonth() + '-' + setDay()
}

const calculateProfit =() =>{
    setProfit()
    document.querySelector("#profit").innerText = item.profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const calculateFinalProfit = () =>{
    document.querySelector("#finalProfit").innerText = (item.profit * item.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
//#endregion

const handleIsModalOpen = () =>{
    let modal = document.querySelector("#IsModalOpen").classList
    if(modal.contains('hidden')){
        modal.replace('hidden','block')
    }
    else{
        modal.replace('block','hidden')
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
        <!-- body -->
        <div class="max-w-[400px] mx-auto my-[20px] border rounded-md p-[10px] ">
            <!-- header -->
            <div class="flex justify-center relative">
                <div class="absolute top-5 right-5 flex items-center">
                    <RouterLink to="/warehouse"
                        class="flex gap-1 items-center hover:bg-blue-500 w-[100px] hover:text-white border border-blue-500 rounded-md px-2 p-1">
                        <img :src="ArrowIconSVG" alt="ArrowIconSVG">
                        برگشتن
                    </RouterLink>
                </div>
                <div class="flex w-full justify-center">
                    <span class="flex justify-center my-3 text-[20px] font-bold text-center" v-if="item != null">ویرایش
                        <br />{{ item.name }}</span>
                </div>
            </div>
            <!-- form -->
            <div class="flex flex-col gap-1">
                <!-- name date -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <div>نام</div>
                        <input type="text" class="border rounded px-1 w-full" placeholder="نام کالا" id="name" :value="item.name" @input="setName">
                    </div>
                    <div class="flex flex-col col-span-1">
                        <div>تاریخ ثبت</div>
                        <div class="flex items-center col-span-1 border rounded" @keyup="calculateDate">
                            <input type="text" class="w-full outline-none text-center bg-transparent" placeholder="نام کالا" id="day" :value="item.date.split('-')[2]">/
                            <input type="text" class="w-full outline-none text-center bg-transparent" placeholder="نام کالا" id="month" :value="item.date.split('-')[1]">/
                            <input type="text" class="w-full outline-none text-center bg-transparent" placeholder="نام کالا" id="year" :value="item.date.split('-')[0]">
                        </div>
                    </div>
                </div>
                <!-- seller company -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>فروشنده</span>
                        <div class="p-[5px] text-center bg-gray-100 rounded-md">{{item.sellerName}}</div>
                    </div>
                    <div class="flex flex-col col-span-1">
                        <span>شرکت</span>
                        <div class="p-[5px] text-center bg-gray-100 rounded-md">{{item.company}}</div>
                    </div>
                </div>
                <!-- purchase sale price -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>قیمت خرید</span>
                        <div class="p-[5px] text-center bg-gray-100 rounded-md">{{item.purchasePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}</div>
                    </div>
                    <div class="flex flex-col col-span-1">
                        <span>قیمت فروش</span>
                        <input type="text" class="border rounded text-center" placeholder="قیمت فروش فی کالا" id="salesPrice" :value="item.salesPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" @input="setSalesPrice(),calculateProfit(),calculateFinalProfit()">
                    </div>
                </div>
                <!-- amount unit -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>تعداد</span>
                        <div class="p-[5px] text-center bg-gray-100 rounded-md">{{item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}</div>
                    </div>
                    <div class="flex flex-col col-span-1">
                        <span>واحد</span>
                        <div class="p-[5px] text-center bg-gray-100 rounded-md">{{item.unit}}</div>
                    </div>
                </div>
                <!-- profit finalprofit -->
                <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                    <div class="flex flex-col col-span-1">
                        <span>سود</span>
                        <div class="p-[5px] text-center bg-gray-100 rounded-md" id="profit">{{item.profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}</div>
                    </div>
                    <div class="flex flex-col col-span-1">
                        <span>سود کل</span>
                        <div class="p-[5px] text-center bg-gray-100 rounded-md" id="finalProfit">{{(item.profit * item.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}}</div>
                    </div>
                </div>
            </div>
            <!-- buttons -->
            <div class="w-full flex flex-col md:flex-row lg:justify-between gap-1 items-center mt-[10px]">
                <button @click="handleIsModalOpen"
                class="border border-red-500 hover:bg-red-600 text-red-500 order-2 md:order-1 hover:text-white p-1 w-1/2 rounded">حذف</button>
                <button @click="patchData"
                    class="border bg-blue-500 hover:bg-blue-600 order-1 md:order-2 text-white p-1 w-1/2 rounded">ذخیره</button>
            </div>
        </div>
    </div>
<Loading v-if="loading"></Loading>
<div class="absolute hidden top-0 left-0 w-full h-screen z-50 bg-white" id="IsModalOpen">
    <div class="flex items-center justify-center h-full p-[20px]">
        <div class="flex flex-col gap-1 border rounded p-[20px]">
            <span class="text-center">توضیحات بیشتر در مورد حذف کالای <br/>"{{item.name}}"</span>
            <input type="text" placeholder="اختیاری" class="border rounded" id="description">
            <div class="flex justify-between gap-1">
                <button class="border border-blue-500 hover:bg-blue-500 hover:text-white w-full rounded p-1" @click="handleIsModalOpen">لغو</button>
                <button class="border border-red-500 hover:bg-red-500 hover:text-white w-full rounded p-1" @click="deleteData">حذف کالا</button>
            </div>
        </div>
    </div>
</div>
</template>
<style scoped>
input{
    padding: 5px;
}</style>