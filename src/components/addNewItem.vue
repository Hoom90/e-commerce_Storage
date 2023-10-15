<script setup>
import { ref , getCurrentInstance , defineProps } from 'vue'
import ArrowIconSVG from '../assets/arrowLeftIcon.svg'
import SearchIconSVG from '../assets/searchIcon.svg'
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

const { emit } = getCurrentInstance()

const props = defineProps({
    modal: {
        required: true,
    },
    data:{
        require: true,
    },
    billId:{
        require: true,
    },
    date:{
        require: true,
    }
});

let name = ref(null)
let weight = ref(null)
let basePrice = ref(null)
let price = ref(null)
let profit = ref(null)
let amount = ref(null)
let billId = ref(null)
let date = ref(null)

const dbData = ref(props.data)
const modal = ref(props.modal)
const item = ref(null)

const saveData = () =>{
    item.value = {
        name : name.value,
        weight: weight.value === 'null' ? "" :weight.value,
        basePrice: basePrice.value === 'null' ? "" :basePrice.value,
        price: price.value === 'null' ? "" :price.value,
        profit: profit.value.toString() === 'null' ? "" :profit.value.toString(),
        amount: amount.value === 'null' ? "" :amount.value,
        billId: props.billId,
        date: props.date,
    }
    emit('set:item',item)
    handleModal()
}

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

const duplicateItemData = (index) => {
    document.querySelector("input[name=profit]").classList.replace("border-red-500", "border-gray-50")
    document.querySelector("input[name=profit]").classList.replace("border-green-500", "border-gray-50")
    document.querySelector("input[name=profitxamount]").classList.replace("border-red-500", "border-gray-50")
    document.querySelector("input[name=profitxamount]").classList.replace("border-green-500", "border-gray-50")
    name.value = null
    weight.value = null
    basePrice.value = null
    price.value = null
    profit.value = null
    amount.value = null
    profitxamount.value = null
    billId.value = null
    date.value = null
    day.value = null
    month.value = null
    year.value = null
    setDuplicatedData(index)
    let length = dbData.value.length
    for (let i = 0; i < length; i++) {
        document.querySelector('button[name=item' + i + ']').classList.replace("border-blue-500", "border-gray-200")
    }
    document.querySelector('button[name=item' + index + ']').classList.replace('border-gray-200', 'border-blue-500');
}

const setDuplicatedData =(index) =>{
    name.value = dbData.value[index].name
    weight.value = dbData.value[index].weight == 'null' ? "" : dbData.value[index].weight
    basePrice.value = dbData.value[index].basePrice == 'null' ? "" : dbData.value[index].basePrice
    price.value = dbData.value[index].price == 'null' ? "" : dbData.value[index].price
    amount.value = dbData.value[index].amount == 'null' ? "" : dbData.value[index].amount
    billId.value= dbData.value[index].billId == 'null' ? "" : dbData.value[index].billId
    date.value = dbData.value[index].date == 'null' ? "" : dbData.value[index].date 
    day.value = dbData.value[index].date == 'null' ? "" : dbData.value[index].date.split('/')[2]
    month.value = dbData.value[index].date == 'null' ? "" : dbData.value[index].date.split('/')[1]
    year.value = dbData.value[index].date == 'null' ? "" : dbData.value[index].date.split('/')[0]
    if(price.value != null && basePrice.value != null){
        profit.value = parseInt(price.value) - parseInt(basePrice.value)
    }
    if(price.value != null && basePrice.value != null && amount.value != null){
        profitxamount.value = parseInt(profit.value) * parseInt(amount.value)
    }
}

const profitxamount = ref(null)
const calculator = () => {
    if (price.value != null && basePrice.value != null) {
        profit.value = parseInt(price.value) - parseInt(basePrice.value)
        if (parseInt(profit.value) < 0) {
            if (document.querySelector("input[name=profit]").classList.contains("border-gray-50")) {
                document.querySelector("input[name=profit]").classList.replace("border-gray-50", "border-red-500")
            }
            else {
                document.querySelector("input[name=profit]").classList.replace("border-green-500", "border-red-500")
            }
        }
        else {
            if (document.querySelector("input[name=profit]").classList.contains("border-gray-50")) {
                document.querySelector("input[name=profit]").classList.replace("border-gray-50", "border-green-500")
            }
            else {
                document.querySelector("input[name=profit]").classList.replace("border-red-500", "border-green-500")
            }
        }
    }
    else {
        document.querySelector("input[name=profit]").classList.replace("border-red-500", "border-gray-50")
        document.querySelector("input[name=profit]").classList.replace("border-green-500", "border-gray-50")
    }
    if (price.value != null && basePrice.value != null && amount.value != null) {
        profitxamount.value = parseInt(profit.value) * parseInt(amount.value)
        if (parseInt(profitxamount.value) < 0) {
            if (document.querySelector("input[name=profitxamount]").classList.contains("border-gray-50")) {
                document.querySelector("input[name=profitxamount]").classList.replace("border-gray-50", "border-red-500")
            }
            else {
                document.querySelector("input[name=profitxamount]").classList.replace("border-green-500", "border-red-500")
            }
        }
        else {
            if (document.querySelector("input[name=profitxamount]").classList.contains("border-gray-50")) {
                document.querySelector("input[name=profitxamount]").classList.replace("border-gray-50", "border-green-500")
            }
            else {
                document.querySelector("input[name=profitxamount]").classList.replace("border-red-500", "border-green-500")
            }
        }
    }
    else {
        document.querySelector("input[name=profitxamount]").classList.replace("border-red-500", "border-gray-50")
        document.querySelector("input[name=profitxamount]").classList.replace("border-green-500", "border-gray-50")
    }
}

const calculateInitDebt = () =>{
  !amount.value ? amount.value = '1' : amount.value
  let result = parseInt(basePrice.value) * parseInt(amount.value)
  document.getElementById('debtBalance').innerText = formatData(result)
}

const formatData = (data) => {
  if(data){
    return (data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }
};

const handleModal = () =>{
    emit('update:modal', false);
}
</script>
<template>
    <!-- add new bill item -->
    <div class="w-full p-[20px]" v-if="modal">
        <div class="max-w-[800px] mx-auto my-[20px] border rounded-md p-[10px]">
            <!-- header -->
            <div class="flex justify-center">
                <div class="flex items-center">
                    <button @click="handleModal" class="flex gap-1 items-center hover:bg-blue-500 hover:text-white border border-blue-500 rounded-md px-2 p-1">
                        <img :src="ArrowIconSVG" alt="ArrowIconSVG">
                    </button>
                </div>
                <div class="flex w-full justify-center">
                    <span class="flex justify-center my-3 text-[20px] font-bold">افزودن اطلاعات کالا</span>
                </div>
            </div>
            <!-- body -->
            <div>
                <!-- search -->
                <div class="flex flex-col gap-1 my-1">
                    <div class="flex gap-1 items-center border rounded px-1">
                        <input type="text" ref="searchBox" class="outline-none min-w-[300px] w-full" placeholder="جستجو در بین کالاهای موجود" @keyup="searchWord">
                        <img :src="SearchIconSVG" alt="SearchIconSVG">
                    </div>
                    <!-- search result -->
                    <div
                        class="w-full grid overflow-y-scroll max-h-[300px]">
                        <button class="border border-gray-200 hover:bg-[#c9c9c9] odd:bg-[#f6f6f6]" v-for="(item, index) in dbData" v-bind:key="index"
                            @click="duplicateItemData(index)" :name="'item' + index" id="itemData">
                            <div class='flex justify-between gap-1 p-[10px] text-[12px] truncate'>
                                <span>{{ item.name }}</span>
                                <span dir="ltr">{{ item.price ? "تومان " + item.price  : "بدون قیمت"}}</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div class="flex justify-center gap-1 my-1 border rounded-md p-2" v-if="dbData.length == 0">
                    هیچ کالایی یافت نشد
                </div>
                <!-- form -->
                <div>
                    <div class="flex flex-col">
                        <p>نام<span class="text-red-500">*</span></p>
                        <input type="text" class="border rounded outline-none px-1" placeholder="نام کالا" v-model="name">
                    </div>
                    <div class="md:grid grid-flow-col grid-cols-5 gap-1">
                        <div class="flex flex-col col-span-2" @keyup="calculator">
                            <p>قیمت خرید<span class="text-red-500">*</span></p>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت خرید فی کالا" v-model="basePrice" @input="calculateInitDebt">
                        </div>
                        <div class="flex flex-col col-span-2" @keyup="calculator">
                            <p>قیمت فروش<span class="text-red-500">*</span></p>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت فروش فی کالا" v-model="price">
                        </div>
                        <div class="flex flex-col">
                            <span>سود</span>
                            <input type="text" class="border border-gray-50 rounded-md outline-none px-1 text-center" placeholder="سود فی کالا" name="profit" v-model="profit" disabled>
                        </div>
                    </div>
                    <div class="md:grid grid-flow-col grid-cols-5 gap-1">
                        <div class="flex flex-col col-span-2">
                            <span>وزن</span>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="وزن فی کالا" v-model="weight">
                        </div>
                        <div class="flex flex-col col-span-2" @keyup="calculator">
                            <p>تعداد<span class="text-red-500">*</span></p>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="تعداد کالا"
                                v-model="amount" @input="calculateInitDebt">
                        </div>
                        <div class="flex flex-col">
                            <span>سود در تعداد</span>
                            <input type="text" class="border border-gray-50 rounded-md outline-none px-1 text-center" placeholder="سود محموله" name="profitxamount" v-model="profitxamount" disabled>
                        </div>
                    </div>
                </div>
            </div>
            <!-- footer -->
            <div class="w-full grid grid-flow-col grid-cols-2 gap-3 text-center items-center mt-[10px]">
                <div class="grid grid-flow-col grid-cols-2 items-center gap-1 w-full mb-1">
                    <span>بدهی:</span>
                    <span id="debtBalance" class="text-white bg-red-500 p-[5px]">0</span>
                    <span>تومان</span>
                </div>
                <div class="flex justify-end">
                    <button @click="saveData"
                        class="border bg-blue-500 hover:bg-blue-600 text-white p-1 w-1/2 lg:w-[200px] rounded">افزودن به فاکتور</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
input{
    padding: 5px;
}</style>