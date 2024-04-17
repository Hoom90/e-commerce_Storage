<script setup>
import { ref } from 'vue'
let items = []
let tempItems = {
    cost:'',
    paid:'',
    type:'',
    date:'',
    description:''
}
const instance = getCurrentInstance()
const axiosApi = instance.appContext.config.globalProperties.$axiosApi
const dbData = ref(null)
const loading = ref(false)
const message = ref(null)
const modal = ref(false)
const FullDebt = ref(0)

//#region API
// GET
const getData = async () => {
  loading.value = true;
    await axiosApi.get(apiPath.storage.getAll)
    .then((res) => {
        dbData.value = res.data;
    })
    .catch(function (error) {
        console.log(error);
        message.value = error;
        loading.value = false;
    });
  loading.value = false;
};
// POST List
const postData = async () => {
    loading.value = true
    setSellerName()
    setCost()
    setPaid()
    setType()
    setDate()
    setDescription()
    const body = []
    body.push(tempItems)
    items.forEach(item => {
        body.push(item)
    })
    // console.log(body);
    await axiosApi.post(apiPath.storage.addListItem,body, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    })
    .then(
        router.push("/warehouse")
    )
    .catch((error) => {
      console.log(error);
      message.value = error;
    })
    .finally((loading.value = false));
}
//#endregion

//#region set props
const setSellerName = () =>{
    tempItems.sellerName = document.querySelector("#sellerName").value
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

const setDate = () => {
    tempItems.date = setYear() + '-' + setMonth() + '-' + setDay()
}

const setCost = () =>{
    tempItems.cost = calculateFullDebt().toString()
}

const setFullDebt =()=>{
    FullDebt.value = calculateFullDebt().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const setPaid = () =>{
    tempItems.paid = document.querySelector("#Paid").value
}

const setType = () =>{
    tempItems.type = document.querySelector("#Type").value
}

const setDescription = () =>{
    tempItems.description = document.querySelector("#Description").value
}

const setItems = (value) =>{
    items.push(value)
}

const calculateFullDebt = () =>{
    let result = 0
    for(let i=0;i<items.length;i++){
        let res = items[i].purchasePrice * items[i].amount
        result = result + res
    }
    return result
}

const updateItems = (item)=>{
    setItems(item.value)
    setFullDebt()
    setCost()
}

const removeItems = (index) =>{
    let FullDebt = FullDebt.value
    FullDebt.value = (parseInt(FullDebt.replace(',','') - parseInt(items[index].purchasePrice))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    items.splice(index, 1);
    console.log(items);
    document.querySelector("div[name=item"+index+"]").classList.add('hidden')
}
//#endregion

//#region form actions
const updateModal = (value) =>{
    modal.value = value
}

const handleIsModalOpen = () =>{
    if(modal.value){
        modal.value = false
    }
    else{
        modal.value = true
    }
}
//#endregion

getData()
</script>
<template>
    <!-- multi add -->
    <div class="max-w-[1000px] mx-auto relative" v-if="!modal">
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="p-[20px]">
            <div class=" border rounded-md min-h-[500px] relative">
                <!-- header -->
                <div class="px-[20px]">
                    <!-- title returnLink -->
                    <div class="flex justify-center relative">
                        <div class="absolute top-5 right-5 flex items-center">
                            <RouterLink to="/warehouse" class="flex gap-1 items-center hover:bg-red-500 hover:text-white border border-red-500 rounded-md p-2">
                                <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                            </RouterLink>
                        </div>
                        <div class="flex w-full justify-center">
                            <span class="flex justify-center my-3 text-[20px] font-bold">فاکتور جدید</span>
                        </div>
                    </div>
                    <!-- sellername date -->
                    <div class="flex justify-center gap-1 mb-3">
                        <div class="flex flex-col w-2/3">
                            <span>فروشنده</span>
                            <input type="text" class="border rounded px-1" placeholder="نام فروشنده" id="sellerName" @input="setSellerName()" :value="tempItems.sellerName">
                        </div>
                        <div class="flex flex-col w-1/3 max-w-[150px]">
                            <span>تاریخ</span>
                            <div class="border rounded px-1 text-center flex items-center" @keyup="setDate">
                                <input type="text" class="w-full outline-none text-center" id="day" :value="dayjs().calendar('jalali').locale('fa').format('DD')">/
                                <input type="text" class="w-full outline-none text-center" id="month" :value="dayjs().calendar('jalali').locale('fa').format('MM')">/
                                <input type="text" class="w-full outline-none text-center" id="year" :value="dayjs().calendar('jalali').locale('fa').format('YYYY')">
                            </div>
                        </div>
                    </div>
                    <button @click="handleIsModalOpen" class="w-full border bg-blue-500 text-center hover:bg-blue-600 text-white p-[5px]">
                        افزودن کالا
                    </button>
                </div>
                <!-- body -->
                <div class="px-[20px]">
                    <div class="w-full grid gap-1 overflow-y-scroll max-h-[150px] lg:max-h-[250px] border">
                        <div class="border relative hover:bg-[#c9c9c9] odd:bg-[#f6f6f6]" v-for="(item, index) in items" :name="'item' + index" id="itemData" v-bind:key="index">
                            <div class='flex justify-between items-center pr-3 text-[12px] truncate'>
                                <div class="grid lg:grid-flow-col lg:grid-cols-6 justify-between w-11/12">
                                    <span>{{ item.name }}</span>
                                    <span>{{ item.company }}</span>
                                    <span>{{ item.purchasePrice }} (ریال)</span>
                                    <span>{{ item.amount }}</span>
                                    <span>{{ item.unit }}</span>
                                    <span>{{ item.amount * item.purchasePrice }} (ریال)</span>
                                </div>
                                <button class='bg-red-500 text-white p-1' @click="removeItems(index)">
                                    <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- footer -->
                <div class="absolute px-[20px] w-full bottom-2 grid lg:grid-flow-col lg:grid-cols-7 gap-1 text-center bg-white">
                    <div class="grid grid-flow-col grid-cols-3 lg:flex items-center gap-1 lg:col-span-2">
                        <span>هزینه کل:</span>
                        <span class="text-white w-full bg-red-500 p-[5px]">{{FullDebt}}</span>
                        <span>ریال</span>
                    </div>
                    <div class="grid grid-flow-col grid-cols-3 lg:grid-cols-5 items-center gap-1 lg:col-span-2">
                        <span>پرداخت:</span>
                        <div class="flex flex-col lg:flex-row border border-blue-500 w-full lg:col-span-3">
                            <input type="text" value="0" id="Paid" class="outline-none border-blue-500 border-b lg:border-l lg:border-b-0 lg:w-2/3" dir="ltr" @input="setPaid">
                            <select id="Type" class="outline-none lg:w-1/3" @input="setType">
                                <option value="چک">چک</option>
                                <option value="نقدی">نقدی</option>
                                <option value="کارتخوان">کارتخوان</option>
                                <option value="کارت به کارت">کارت به کارت</option>
                            </select>
                        </div>
                        <span>ریال</span>
                    </div>
                    <div class="grid grid-flow-col grid-cols-3 lg:flex items-center gap-1 lg:col-span-2">
                        <span>توضیحات:</span>
                        <input type="text" id="Description" class="text-center border w-full border-blue-500" @input="setDescription">
                    </div>
                    <div class="flex items-center justify-center w-full lg:col-span-1">
                        <button @click="postData" class="border bg-blue-500 hover:bg-blue-600 text-white p-[5px] w-full rounded">
                            ذخیره
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AddNewItem v-if="modal" :data="dbData" @update:modal="updateModal" @set:item="updateItems"></AddNewItem>
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
