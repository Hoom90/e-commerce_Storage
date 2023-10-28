<script setup>
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

const { emit } = getCurrentInstance()

let name ,sellerName ,company ,purchasePrice ,salesPrice ,profit ,amount ,unit ,finalProfit ,date;

const setName = () =>{
    name = document.querySelector("#name").value
}

const setSellerName = () =>{
    sellerName = document.querySelector("#sellerName").value
}

const setCompany = () =>{
    company = document.querySelector("#company").value
}

const setPurchasePrice = ()=>{
    purchasePrice= document.querySelector("#purchasePrice").value
}

const setSalesPrice = () =>{
    salesPrice = document.querySelector("#salesPrice").value
}

const setprofit = () =>{
    document.querySelector("#profit").innerText = profit
}

const setAmount = () =>{
    amount = document.querySelector("#name").value
}

const setUnit = () =>{
    unit = document.querySelector("#unit").value
}

const setFinalProfit = () =>{
    document.querySelector("#finalProfit").innerText = finalProfit
}
</script>
<template>
    <div class="lg:w-2/3 lg:border rounded lg:p-[20px] flex flex-col gap-1">
        <div class="flex justify-end">
            <div class="flex flex-col w-[150px]">
                <div class="border rounded px-1 text-center flex items-center" @keyup="setDate">
                    <input type="text" class="w-full outline-none text-center" placeholder="روز" maxlength="2"/>/
                    <input type="text" class="w-full outline-none text-center" placeholder="ماه" maxlength="2"/>/
                    <input type="text" class="w-full outline-none text-center" placeholder="سال" maxlength="4"/>
                </div>
            </div>
        </div>
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="calculator">
                <p>نام<span class="text-red-500">(اجباری)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام کالا" id="name" @input="setName"/>
            </div>
            <div class="flex flex-col col-span-1" @keyup="calculator">
                <p>فروشنده<span class="text-red-500">(اجباری)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام فروشنده" id="sellerName" @input="setSellerName"/>
            </div>
        </div>
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="calculator">
                <p>شرکت<span class="text-red-500">(اجباری)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام شرکت کالا" id="company" @input="setCompany"/>
            </div>
            <div class="flex flex-col col-span-2" @keyup="calculator">
                <p>قیمت خرید<span class="text-red-500">(اجباری)(ریال)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت خرید فی کالا" id="purchasePrice" @input="setPurchasePrice"/>
            </div>
        </div>
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="calculator">
                <p>قیمت فروش<span class="text-red-500">(اجباری)(ریال)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت فروش فی کالا" id="salesPrice" @input="setSalesPrice"/>
            </div>
            <div class="flex flex-col col-span-1">
                <span>سود</span>
                <div class="border p-[5px] bg-gray-300 rounded-md px-1 text-center" id="profit">سود فی کالا (ریال)</div>
            </div>
        </div>
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="calculator">
                <p>مقدار<span class="text-red-500">(اجباری)</span></p>
                <div class="flex justify-between border rounded">
                    <input type="text" class="outline-none px-1 w-full border-l" dir="ltr" placeholder="0" @input="setAmount"/>
                    <select class="cursor-pointer outline-none bg-transparent" id="unit" @input="setUnit">
                        <option value="عدد">عدد</option>
                        <option value="کیلوگرم">کیلوگرم</option>
                        <option value="گرم">گرم</option>
                    </select>
                </div>
            </div>
            <div class="flex flex-col col-span-1">
                <span>سود x مقدار</span>
                <div class="border p-[5px] bg-gray-300 rounded-md px-1 text-center" id="finalProfit">سود محموله (ریال)</div>
            </div>
        </div>
    </div>
</template>
<style scoped>
input {
  padding: 5px;
}
</style>