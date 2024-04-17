<script setup>
import { ref } from 'vue'
const dbData = ref(null)
const balanceData = ref(null)
const message = ref(null)
const loading = ref(false)
const instance = getCurrentInstance()
const axiosApi = instance.appContext.config.globalProperties.$axiosApi
let name = ref(null)
let amount = ref(null)
let unit = ref(null)
let credit = ref(null)
let description = ref(null)

//#region API
// GET
const getData = async () => {
    loading.value = true
    await axiosApi.get(apiPath.storage.getAll)
    .then((res)=>{
        dbData.value = res.data;
    })
    .catch(function (error) {
        console.log(error)
        loading.value = false
        message.value = error
    })
    loading.value = false
}
// PUT
const putData = async () => {
    loading.value = true
    let id , price , body , dbAmount , profit;
    if(!amount.value){
        loading.value = false
        return;
    }
    dbData.value.forEach(item => {
        if(name.value === item.name){
            id = item._id
            price = item.salesPrice
            dbAmount = item.amount
            profit = item.profit
        }
    });
    if(parseInt(amount.value) > parseInt(dbAmount)){
        message.value = 'مقدار غیر مجاز!'
        loading.value = false
        return;
    }
    let tempDescription = description.value ? description.value : ''
    body = {
        sold: parseInt(price) * parseInt(amount.value),
        amount: amount.value,
        profit,
        date: dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD'),
        description : tempDescription
    }
    // console.log(body);
    await axiosApi.put(apiPath.storage.orderSingleItem(id), body,{headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
    }})
    .then(
        router.push('/')
    )
    .catch((error) => {
        console.log(error);
        message.value = error
    }).finally(
        loading.value = false,
    )
}
//#endregion

const searchBox = ref(null)
const searchWord = () => {
    // Declare variables
    let filter, li, a, i, txtValue;
    filter = searchBox.value.value.toUpperCase();
    li = document.querySelectorAll('#itemData');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

const handleSelectedItem = (index) => {
    name.value = dbData.value[index].name
    unit.value = dbData.value[index].unit
    amount.value = '0'
    let length = dbData.value.length
    for (let i = 0; i < length; i++) {
        document.querySelector('button[name=item' + i + ']').classList.replace("border-blue-500", "border-gray-200")
    }
    document.querySelector('button[name=item' + index + ']').classList.replace('border-gray-200', 'border-blue-500');
}

const handleIncrease = () =>{
    if(amount.value){
        amount.value = parseInt(amount.value) + 1
    }
}

const handleDecrease = () =>{
    if(amount.value){
        if(amount.value > 0){
            amount.value = parseInt(amount.value) - 1
        }
    }
}

getData()
</script>
<template>
    <!-- add new sells or return -->
    <div class="w-full pt-[20px] relative">
        <button class="absolute w-full flex justify-between top-0 right-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="max-w-[400px] mx-auto border rounded-md p-[10px]">
            <!-- header -->
            <div class="flex justify-center relative">
                <div class="absolute top-2.5 right-1 flex items-center">
                    <RouterLink to="/warehouse" class="flex gap-1 items-center hover:bg-red-500 hover:text-white border border-red-500 rounded-md p-2">
                        <img :src="CloseIconSVG" alt="CloseIconSVG">
                    </RouterLink>
                </div>
                <div class="flex w-full justify-center">
                    <span class="flex justify-center my-3 text-[20px] font-bold">ثبت فروش</span>
                </div>
            </div>

            <!-- body -->
            <div>
                <!-- search -->
                <div>
                    <div class="flex flex-col gap-1 my-1" v-if="dbData.length !=0">
                        <!-- search input -->
                        <div class="flex gap-1 items-center border rounded px-1">
                            <input type="text" ref="searchBox" class="outline-none w-full"
                                placeholder="جستجو نام کالا" @keyup="searchWord">
                            <img :src="SearchIconSVG" alt="SearchIconSVG">
                        </div>
                        <!-- search result -->
                        <div class="w-full flex flex-col overflow-y-scroll h-[180px] border">
                            <button class="border-b h-[40px]" :class="item.amount == '0' ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white ' : 'border-gray-200 hover:bg-[#c9c9c9] odd:bg-[#f6f6f6]'" v-for="(item, index) in dbData"
                                @click="handleSelectedItem(index)" :name="'item' + index" id="itemData" v-bind:key='index'>
                                <div class='grid grid-flow-col grid-cols-4 justify-between gap-1 p-[10px] text-[12px] truncate'>
                                    <span>{{ item.name }}</span>
                                    <span>{{ item.company }}</span>
                                    <span dir="ltr">{{ item.amount }}</span>
                                    <span>{{ item.unit }}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div class="flex justify-center items-center gap-1 my-1 border rounded-md p-3 min-h-[180px]" v-if="dbData.length == 0">
                        هیچ کالایی یافت نشد
                    </div>
                </div>
                <!-- form -->
                <div class="grid gap-1">
                    <input type="text" class="border rounded px-1 text-center" placeholder="نام کالا" v-model="name" disabled>
                    <div class="flex gap-1 justify-center">
                        <button @click="handleIncrease" class="rounded p-2 bg-blue-500 text-white">
                            <img :src="PlusIconSVG" alt="PlusIconSVG">
                        </button>
                        <input type="number" class="border rounded outline-blue-300 px-1 text-center w-full" placeholder="تعداد کالا" v-model="amount" :disabled="amount ? false : true">
                        <input type="text" class="border rounded text-center w-[80px]" placeholder="واحد" v-model="unit" disabled>
                        <button @click="handleDecrease" class="rounded p-2 text-center bg-red-500 text-white">
                            <img :src="MinusIconSVG" alt="MinusIconSVG">
                        </button>
                    </div>
                    <input type="text" class="border rounded outline-blue-300 px-1" placeholder="توضیحات" v-model="description" :disabled="amount ? false : true">
                    <!-- <div class='flex flex-col gap-1 border-y-2 py-1'>
                        <input type="text" class="border rounded outline-blue-300 px-1" placeholder="به چه کسی نسیه داده شده است" v-model="credit" :disabled="amount ? false : true">
                    </div> -->
                </div>
            </div>

            <!-- footer -->
            <div class="w-full flex justify-end items-center mt-[10px]">
                <button @click="putData"
                    class="border bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded">ثبت</button>
            </div>
        </div>
    </div>
    <Loading v-if="loading"></Loading>
</template>

<style scoped>
input {
    padding: 5px
}</style>