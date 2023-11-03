<script setup>
import { ref , getCurrentInstance , defineProps } from 'vue'
import ArrowIconSVG from '../assets/arrowLeftIcon.svg'
import SearchIconSVG from '../assets/searchIcon.svg'
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

const { emit } = getCurrentInstance()

const props = defineProps({
    data:{
        require: true,
    },
});

let name = ref(null)
let company = ref(null)
let purchasePrice = ref(null)
let salesPrice = ref(null)
let profit = ref(0)
let amount = ref(null)
let unit = ref('عدد')
let profitxamount = ref(0)

const dbData = ref(props.data)
const modal = ref(props.modal)
const item = ref(null)

const saveData = () =>{
    item.value = {
        name : name.value,
        company: company.value,
        purchasePrice: purchasePrice.value,
        salesPrice: salesPrice.value,
        profit: profit.value.toString(),
        amount: amount.value,
        unit: unit.value,
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
    name.value = dbData.value[index].name
    company.value = dbData.value[index].company
    purchasePrice.value = dbData.value[index].purchasePrice
    salesPrice.value = dbData.value[index].salesPrice
    amount.value = dbData.value[index].amount
    unit.value= dbData.value[index].unit
    profit.value = parseInt(salesPrice.value) - parseInt(purchasePrice.value)
    profitxamount.value = parseInt(profit.value) * parseInt(amount.value)
    let length = dbData.value.length
    for (let i = 0; i < length; i++) {
        document.querySelector('button[name=item' + i + ']').classList.replace("border-blue-500", "border-gray-200")
    }
    document.querySelector('button[name=item' + index + ']').classList.replace('border-gray-200', 'border-blue-500');
    document.getElementById('debtBalance').innerText = formatData(parseInt(purchasePrice.value) * parseInt(amount.value))
}

const calculator = () => {
    if(purchasePrice.value == null) return
    if(salesPrice.value == null) return
    profit.value = parseInt(salesPrice.value) - parseInt(purchasePrice.value)
    if(amount.value == null) return
    profitxamount.value = parseInt(profit.value) * parseInt(amount.value)
}

const calculateInitDebt = () =>{
  !amount.value ? amount.value = '1' : amount.value
  let result = parseInt(purchasePrice.value) * parseInt(amount.value)
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
    <div class="w-full p-[20px]">
        <div class="mx-auto my-[20px] border rounded-md p-[10px]">
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
            <div class="h-[340px] flex flex-col lg:flex-row gap-3 overflow-auto">
                <!-- search -->
                <div class="lg:w-1/3 border flex flex-col gap-1 my-1" v-if="dbData.length != 0">
                    <div class="flex gap-1 items-center px-1">
                        <input type="text" ref="searchBox" class="outline-none min-w-[300px] w-full" placeholder="جستجو در بین کالاهای موجود" @keyup="searchWord">
                        <img :src="SearchIconSVG" alt="SearchIconSVG">
                    </div>
                    <!-- search result -->
                    <div class="flex flex-col overflow-y-scroll h-full w-full">
                        <button class="border border-gray-200 hover:bg-[#c9c9c9] max-h-[40px]" v-for="(item, index) in dbData" @click="duplicateItemData(index)"
                            :name="'item' + index" id="itemData" v-bind:key="index">
                            <div class="flex justify-between gap-1 p-[10px] text-[12px]">
                            <span>{{ item.name }}</span>
                            <span dir="ltr">{{ item.salesPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
                            </div>
                        </button>
                    </div>
                </div>
                <div class="lg:w-1/3 flex justify-center items-center border rounded-md" v-if="dbData.length == 0">
                    هیچ کالایی یافت نشد
                </div>
                <!-- form -->
                <div class="lg:w-2/3 lg:border rounded lg:p-[20px] flex flex-col gap-1">
                    <!-- name -->
                    <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                        <div class="flex flex-col col-span-2">
                            <p>نام<span class="text-red-500">(اجباری)</span></p>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام کالا" v-model="name"/>
                        </div>
                    </div>
                    <!-- company purchase -->
                    <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                        <div class="flex flex-col col-span-1">
                            <p>شرکت<span class="text-red-500">(اجباری)</span></p>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام شرکت کالا" v-model="company"/>
                        </div>
                        <div class="flex flex-col col-span-1" @keyup="calculator">
                            <p>قیمت خرید<span class="text-red-500">(اجباری)</span></p>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت خرید فی کالا" v-model="purchasePrice" @input="calculateInitDebt">
                        </div>
                    </div>
                    <!-- sales profit -->
                    <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                        <div class="flex flex-col col-span-1" @keyup="calculator">
                            <p>قیمت فروش<span class="text-red-500">(اجباری)</span></p>
                            <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت فروش فی کالا" v-model="salesPrice">
                        </div>
                        <div class="flex flex-col col-span-1">
                            <span>سود</span>
                            <div class="flex items-center">
                                <div class="border border-gray-50 rounded-md outline-none px-1 text-center w-full">
                                    {{profit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}} (ریال)
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- amount unit final -->
                    <div class="md:grid grid-flow-col grid-cols-2 gap-1">
                        <div class="flex flex-col col-span-1">
                            <p>مقدار<span class="text-red-500">(اجباری)</span></p>
                            <div class="flex justify-between border rounded">
                                <input type="text" class="outline-none px-1 w-full border-l" dir="ltr" placeholder="0" v-model="amount" @input="calculateInitDebt(),calculator()"/>
                                <select class="cursor-pointer outline-none bg-transparent" v-model="unit">
                                    <option value="عدد">عدد</option>
                                    <option value="کیلوگرم">کیلوگرم</option>
                                    <option value="گرم">گرم</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex flex-col col-span-1">
                            <span>سود x مقدار</span>
                            <div class="flex items-center">
                                <div class="border border-gray-50 rounded-md outline-none px-1 text-center w-full">
                                    {{profitxamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}} (ریال)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- footer -->
            <div class="w-full flex gap-3 text-center items-center mt-[10px]">
                <div class="flex w-full items-center gap-1 mb-1">
                    <span>بدهی:</span>
                    <span id="debtBalance" class="text-white bg-red-500 p-[5px]">0</span>
                    <span>تومان</span>
                </div>
                <div class="flex w-full justify-end">
                    <button @click="saveData"
                        class="border bg-blue-500 hover:bg-blue-600 text-white p-1 w-full rounded">افزودن به فاکتور</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
input{
    padding: 5px;
}</style>