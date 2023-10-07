<script setup>
import { ref , getCurrentInstance , defineProps } from 'vue'
import ArrowIconSVG from '../assets/arrowLeftIcon.svg'
import SearchIconSVG from '../assets/searchIcon.svg'

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
    }
});

const dbData = ref(props.data)
const modal = ref(props.modal)
const item = ref(null)

const saveData = () =>{
    let name = document.getElementById('name')
    let weight = document.getElementById('weight')
    let basePrice = document.getElementById('basePrice')
    let price = document.getElementById('price')
    let profit = document.getElementById('profit')
    let amount = document.getElementById('amount')
    let date = document.getElementById('year').value + '/' + document.getElementById('month').value + '/' + document.getElementById('day').value
    item.value = {
        name : name.value,
        weight: weight.value === 'null' ? "" :weight.value,
        basePrice: basePrice.value === 'null' ? "" :basePrice.value,
        price: price.value === 'null' ? "" :price.value,
        profit: profit.value === 'null' ? "" :profit.value,
        amount: amount.value === 'null' ? "" :amount.value,
        billId: props.billId === 'null' ? "" :props.billId,
        date: date === 'null' ? "" :date,
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
    document.getElementById('name').value = dbData.value[index].name
    document.getElementById('weight').value = dbData.value[index].weight == 'null' ? "" : dbData.value[index].weight
    document.getElementById('basePrice').value = dbData.value[index].basePrice == 'null' ? "" : dbData.value[index].basePrice
    document.getElementById('price').value = dbData.value[index].price == 'null' ? "" : dbData.value[index].price
    document.getElementById('amount').value = dbData.value[index].amount == 'null' ? "" : dbData.value[index].amount
    document.getElementById('day').value = dbData.value[index].date == 'null' ? "" : dbData.value[index].date.split('/')[2]
    document.getElementById('month').value = dbData.value[index].date == 'null' ? "" : dbData.value[index].date.split('/')[1]
    document.getElementById('year').value = dbData.value[index].date == 'null' ? "" : dbData.value[index].date.split('/')[0]
    calculator()
    let length = dbData.value.length
    for (let i = 0; i < length; i++) {
        document.querySelector('button[name=item' + i + ']').classList.replace("border-blue-500", "border-gray-200")
    }
    document.querySelector('button[name=item' + index + ']').classList.replace('border-gray-200', 'border-blue-500');
}

const calculator = () => {
    if (price.value != null && basePrice.value != null) {
        let input = document.getElementById("profit").classList
        if (parseInt(price.value) - parseInt(basePrice.value) < 0) {
            profit.value = parseInt(basePrice.value) - parseInt(price.value)
            if (input.contains("border-gray-50")) {
                input.replace("border-gray-50", "border-red-500")
            }
            else {
                input.replace("border-green-500", "border-red-500")
            }
        }
        else if(parseInt(price.value) - parseInt(basePrice.value) > 0) {
            profit.value = parseInt(price.value) - parseInt(basePrice.value)
            if (input.contains("border-gray-50")) {
                input.replace("border-gray-50", "border-green-500")
            }
            else {
                input.replace("border-red-500", "border-green-500")
            }
        }
        else{
            profit.value = parseInt(price.value) - parseInt(basePrice.value)
            if (input.contains("border-green-50")) {
                input.replace("border-green-50","border-gray-50")
            }
            else {
                input.replace("border-red-500","border-gray-50")
            }
        }
    }
    else {
        input.replace("border-red-500", "border-gray-50")
        input.replace("border-green-500", "border-gray-50")
    }
    if (price.value != null && basePrice.value != null && amount.value != null) {
        profitxamount.value = parseInt(profit.value) * parseInt(amount.value)
        let input = document.getElementById("profitxamount").classList
        if (parseInt(profit.value) * parseInt(amount.value) < 0) {
            if (input.contains("border-gray-50")) {
                input.replace("border-gray-50", "border-red-500")
            }
            else {
                input.replace("border-green-500", "border-red-500")
            }
        }
        else if(parseInt(profit.value) * parseInt(amount.value) > 0) {
            if (input.contains("border-gray-50")) {
                input.replace("border-gray-50", "border-green-500")
            }
            else {
                input.replace("border-red-500", "border-green-500")
            }
        }
        else{
            if (input.contains("border-green-500")) {
                input.replace("border-green-500","border-gray-50")
            }
            else {
                input.replace("border-red-500","border-gray-50")
            }
        }
    }
    else {
        input.replace("border-red-500", "border-gray-50")
        input.replace("border-green-500", "border-gray-50")
    }
}

const handleModal = () =>{
    emit('update:modal', false);
}
</script>
<template>
    <!-- add new bill item -->
    <div class="w-full p-[20px]" v-if="modal">
        <div class="max-w-[800px] mx-auto my-[20px] border rounded-md p-[10px]">
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
            <!-- search -->
            <div class="flex flex-col gap-1 my-1">
                <div class="flex gap-1 items-center border rounded px-1">
                    <input type="text" ref="searchBox" class="outline-none min-w-[300px] w-full" placeholder="جستجو در بین کالاهای موجود" @keyup="searchWord">
                    <img :src="SearchIconSVG" alt="SearchIconSVG">
                </div>
                <!-- search result -->
                <div
                    class="w-full grid overflow-y-scroll max-h-[300px]">
                    <button class="border border-gray-200 hover:bg-[#c9c9c9] odd:bg-[#f6f6f6]" v-for="(item, index) in dbData"
                        @click="duplicateItemData(index)" :name="'item' + index" id="itemData">
                        <div class='flex justify-between gap-1 p-[10px] text-[12px] truncate'>
                            <span>{{ item.name }}</span>
                            <span dir="ltr">{{ item.price ? "تومان " + item.price  : "بدون قیمت"}}</span>
                        </div>
                    </button>
                </div>
            </div>

            <div class="flex flex-col">
                <p>
                    <span>نام</span><span class="text-red-500">*</span>
                </p>
                <input type="text" class="border rounded outline-none px-1" placeholder="نام کالا" id="name">
            </div>
            <div class="md:grid grid-flow-col grid-cols-5 gap-1">
                <div class="flex flex-col col-span-2" @keyup="calculator">
                    <span>قیمت خرید</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت خرید فی کالا" id="basePrice">
                </div>
                <div class="flex flex-col col-span-2" @keyup="calculator">
                    <span>قیمت فروش</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت فروش فی کالا" id="price">
                </div>
                <div class="flex flex-col">
                    <span>سود</span>
                    <input type="text" class="border border-gray-50 rounded-md outline-none px-1 text-center" placeholder="سود فی کالا" id="profit" disabled>
                </div>
            </div>
            <div class="md:grid grid-flow-col grid-cols-5 gap-1">
                <div class="flex flex-col col-span-2">
                    <span>وزن</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="وزن فی کالا" id="weight">
                </div>
                <div class="flex flex-col col-span-2" @keyup="calculator">
                    <span>تعداد</span>
                    <input type="text" class="border rounded outline-none px-1 text-center" placeholder="تعداد کالا"
                        id="amount">
                </div>
                <div class="flex flex-col">
                    <span>سود در تعداد</span>
                    <input type="text" class="border border-gray-50 rounded-md outline-none px-1 text-center" placeholder="سود محموله" id="profitxamount" disabled>
                </div>
            </div>
            <div class="grid grid-cols-5 gap-1">
                <div>
                    <span>تاریخ</span>
                    <div class="border rounded px-1 text-center flex items-center" @keyup="setDate">
                        <input type="text" class="w-full outline-none text-center" placeholder="روز" id="day">/
                        <input type="text" class="w-full outline-none text-center" placeholder="ماه" id="month">/
                        <input type="text" class="w-full outline-none text-center" placeholder="سال" id="year">
                    </div>
                </div>
            </div>

            <div class="w-full flex justify-end items-center mt-[10px]">
                <button @click="saveData"
                    class="border bg-blue-500 hover:bg-blue-600 text-white p-1 w-1/2 lg:w-[200px] rounded">افزودن به فاکتور</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
input{
    padding: 5px;
}</style>