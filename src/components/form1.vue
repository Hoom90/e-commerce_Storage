<script setup>
import { ref,getCurrentInstance , defineProps, onMounted } from 'vue'
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

const { emit } = getCurrentInstance()

const props = defineProps({
    item: {
        required: true,
    },
});

let item = ref(props.item)
let name ,sellerName ,company ,purchasePrice ,salesPrice ,profit ,amount ,unit ,finalProfit ,date;

const init = () =>{
    name = item.value.name
    sellerName = item.value.sellerName
    company = item.value.company
    purchasePrice = item.value.purchasePrice
    salesPrice = item.value.salesPrice
    amount = item.value.amount
    unit = item.value.unit
    profit = item.value.profit
    date = item.value.date
}

//#region basic methods
const setName = () =>{
    name = document.querySelector("#name").value
    emit('update:name', name);
}

const setSellerName = () =>{
    sellerName = document.querySelector("#sellerName").value
    emit('update:sellerName', sellerName);
}

const setCompany = () =>{
    company = document.querySelector("#company").value
    emit('update:company', company);
}

const setPurchasePrice = ()=>{
    purchasePrice= document.querySelector("#purchasePrice").value
    emit('update:purchasePrice', purchasePrice);
}

const setSalesPrice = () =>{
    salesPrice = document.querySelector("#salesPrice").value
    emit('update:salesPrice', salesPrice);
}

const setprofit = () =>{
    document.querySelector("#profit").innerText = profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    emit('update:profit', profit);
}

const setAmount = () =>{
    amount = document.querySelector("#amount").value
    emit('update:amount', amount);
}

const setUnit = () =>{
    unit = document.querySelector("#unit").value
    emit('update:unit', unit);
}

const setFinalProfit = () =>{
    document.querySelector("#finalProfit").innerText = finalProfit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const setDate = () =>{
    let day = document.querySelector("#day").value
    let month = document.querySelector("#month").value
    let year = document.querySelector("#year").value

    date = year + "-" + month + "-" + day;
    emit('update:date', date);
}

const calculateProfit = () =>{
    if(purchasePrice == null)return
    if(salesPrice == null)return
    profit = salesPrice - purchasePrice
    setprofit()
}

const calculateFinalProfit = () =>{
    if(profit == null)return
    if(amount == null)return
    finalProfit = profit * amount
    setFinalProfit()
}
//#endregion

init()
</script>
<template>
    <div class="lg:w-2/3 lg:border rounded lg:p-[20px] flex flex-col gap-1">
        <!-- date -->
        <div class="flex justify-end">
            <div class="flex flex-col w-[150px]">
                <div class="border rounded px-1 text-center flex items-center" @keyup="setDate">
                    <input type="text" class="w-full outline-none text-center" id="day" placeholder="روز" maxlength="2"/>/
                    <input type="text" class="w-full outline-none text-center" id="month" placeholder="ماه" maxlength="2"/>/
                    <input type="text" class="w-full outline-none text-center" id="year" placeholder="سال" maxlength="4"/>
                </div>
            </div>
        </div>
        <!-- Name SellerName -->
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1">
                <p>نام<span class="text-red-500">(اجباری)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام کالا" id="name" @input="setName"/>
            </div>
            <div class="flex flex-col col-span-1">
                <p>فروشنده<span class="text-red-500">(اجباری)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام فروشنده" id="sellerName" @input="setSellerName"/>
            </div>
        </div>
        <!-- Compnay PurchasePrice -->
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1">
                <p>شرکت<span class="text-red-500">(اجباری)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام شرکت کالا" id="company" @input="setCompany"/>
            </div>
            <div class="flex flex-col col-span-2" @keyup="calculateProfit(),calculateFinalProfit()">
                <p>قیمت خرید<span class="text-red-500">(اجباری)(ریال)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت خرید فی کالا" id="purchasePrice" @input="setPurchasePrice"/>
            </div>
        </div>
        <!-- SalesPrice Profit -->
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="calculateProfit(),calculateFinalProfit()">
                <p>قیمت فروش<span class="text-red-500">(اجباری)(ریال)</span></p>
                <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت فروش فی کالا" id="salesPrice" @input="setSalesPrice"/>
            </div>
            <div class="flex flex-col col-span-1">
                <span>سود</span>
                <div class="border p-[5px] bg-gray-300 rounded-md px-1 text-center" id="profit">سود فی کالا (ریال)</div>
            </div>
        </div>
        <!-- Amount Unit FinlaProfit -->
        <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="calculateFinalProfit">
                <p>مقدار<span class="text-red-500">(اجباری)</span></p>
                <div class="flex justify-between border rounded">
                    <input type="text" class="outline-none px-1 w-full border-l" dir="ltr" placeholder="0" id="amount" @input="setAmount"/>
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