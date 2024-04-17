<script setup>
import { ref } from "vue";
import Form1 from '../../components/form1.vue'
let item = {
  name:'',
  sellerName:'',
  company:'',
  purchasePrice:'',
  salesPrice:'',
  amount:'',
  unit:'',
  date:'',
  paid:'',
  type:'',
  description:'',
}
const instance = getCurrentInstance()
const axiosApi = instance.appContext.config.globalProperties.$axiosApi
const dbData = ref(null);
const loading = ref(false);
const message = ref(null);
const init = ref(true);

//#region API
const getData = async () => {
  loading.value = true;
  await axiosApi.get(apiPath.storage.getSingleItem)
    .then((res) => {
        dbData.value = res.data;
    })
    .catch(function (error) {
      console.log(error);
      message.value = error;
      loading.value = false;
    });
  loading.value = false;
}
const postData = async () => {
  loading.value = true;
  const body = item
  await axiosApi.post(apiPath.storage.getSingleItem, body, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
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

//#region duplicate date
const duplicateItemData = (index) => {
  setDuplicatedData(index);
  setDuplicateEffect(index)
};

const setDuplicatedData = (index) => {
  item = {
    name:dbData.value[index].name,
    sellerName:dbData.value[index].sellerName,
    company:dbData.value[index].company,
    purchasePrice:dbData.value[index].purchasePrice,
    salesPrice:dbData.value[index].salesPrice,
    amount:dbData.value[index].amount,
    unit:dbData.value[index].unit,
    date:dbData.value[index].date,
    paid:dbData.value[index].amount*dbData.value[index].purchasePrice,
    type:"چک",
    description:'',
  }
};

const setDuplicateEffect =(index) =>{
  let result = item.purchasePrice * item.amount
  document.querySelectorAll('#FullDebt')[0].innerText = formatData(result)
  document.querySelectorAll('#Paid')[0].value = formatData(result)
  let length = dbData.value.length;
  for (let i = 0; i < length; i++) {
    document.querySelector("button[name=item" + i + "]").classList.replace("border-blue-500", "border-gray-200");
  }
  document.querySelector("button[name=item" + index + "]").classList.replace("border-gray-200", "border-blue-500");
  document.querySelector("#Name").value = item.name
  document.querySelector("#SellerName").value = item.sellerName
  document.querySelector("#Company").value = item.company
  document.querySelector("#PurchasePrice").value = item.purchasePrice
  document.querySelector("#SalesPrice").value = item.salesPrice
  document.querySelector("#Amount").value = item.amount
  document.querySelector("#Unit").value = item.unit
  document.querySelector("#Profit").innerText = item.salesPrice - item.purchasePrice
  document.querySelector("#FinalProfit").innerText = (item.salesPrice - item.purchasePrice) * item.amount
  document.querySelector("#day").value = item.date.split('-')[2]
  document.querySelector("#month").value = item.date.split('-')[1]
  document.querySelector("#year").value = item.date.split('-')[0]
}
//#endregion

//#region basic methods
const searchWord = () => {
  // Declare variables
  let filter, li, a, i, txtValue;
  let search = document.querySelector('#TableSearchBox')
  filter = search.value.toUpperCase();
  li = document.querySelectorAll("#itemData");
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

const formatData = (data) => {
  if(data){
    return (data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }
}

const handleErrorClose = () =>{
  message.value = null;
}
//#endregion

//#region set prop methods
const setName = () =>{
    item.name = document.querySelector("#Name").value
}

const setSellerName = () =>{
    item.sellerName = document.querySelector("#SellerName").value
}

const setCompany = () =>{
    item.company = document.querySelector("#Company").value
}

const setPurchasePrice = ()=>{
    item.purchasePrice= document.querySelector("#PurchasePrice").value
}

const setSalesPrice = () =>{
    item.salesPrice = document.querySelector("#SalesPrice").value
}

const setprofit = () =>{
    document.querySelector("#Profit").innerText = calculateProfit().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const setAmount = () =>{
    item.amount = document.querySelector("#Amount").value
}

const setUnit = () =>{
    item.unit = document.querySelector("#Unit").value
}

const setFinalProfit = () =>{
    document.querySelector("#FinalProfit").innerText = calculateFinalProfit().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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

const setDate = () =>{
    item.date = setYear() + "-" + setMonth() + "-" + setDay();
}

const setPaid = () =>{
  item.paid = document.querySelector("#Paid").value.replace(',','').replace(',','').replace(',','').replace(',','')
}

const setType = () =>{
  item.type = document.querySelector("#Type").value
}

const setDescription = () =>{
  item.description = document.querySelector("#Description").value
}

const setFullDebt = (value) =>{
  document.getElementById("FullDebt").innerText = formatData(value)
}

const calculateAmountUnit = () =>{
  setAmount()
  setUnit()
}

const calculatePaid = (value)=>{
  if(!value){ 
    setPaid()
  }
  else {
    document.querySelector("#Paid").value = formatData(value)
    item.paid = value
  }
}

const calculateFullDebtPaidTypeDate = () =>{
  if(item.purchasePrice == null || item.purchasePrice == '')return
  if(item.amount == null || item.amount == '')return
  let result = item.purchasePrice * item.amount
  setFullDebt(result)
  calculatePaid(result)
  setType()
  setDate()
}

const calculateProfit = () =>{
    if(item.purchasePrice == null)return
    if(item.salesPrice == null)return
    return item.salesPrice - item.purchasePrice
}

const calculateFinalProfit = () =>{
    if(item.amount == null)return
    return calculateProfit() * item.amount
}

//#endregion

getData();
</script>
<template>
  <!-- single add -->
  <div class="w-full p-[20px] relative">
    <button class="absolute w-[97%] flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="handleErrorClose">
      {{ message }}
      <i>x</i>
    </button>
    <div class="mx-auto mt-[20px] border rounded-md p-[10px]">
      <!-- header -->
      <div class="flex justify-center relative">
        <div class="absolute top-[10px] right-0">
          <RouterLink to="/warehouse" class="flex gap-1 items-center bg-white hover:bg-blue-500 hover:text-white border border-blue-500 rounded-md px-2 p-1">
            <img :src="ArrowIconSVG" alt="ArrowIconSVG" />
            برگشتن به انبارداری
          </RouterLink>
        </div>
        <div class="flex w-full justify-center">
          <span class="flex justify-center my-3 text-[20px] font-bold">افزودن تک کالا</span>
        </div>
      </div>
      <!-- body -->
      <div class="h-[340px] flex flex-col lg:flex-row gap-1 overflow-auto">
        <!-- search -->
        <div class="lg:w-1/3 border rounded">
          <!-- search input -->
          <div class="h-[90%]" v-if="dbData.length != 0">
            <div class="flex gap-1 items-center rounded px-1">
              <input type="text" id="TableSearchBox" class="outline-none min-w-[300px] w-full" placeholder="جستجو در بین کالاهای موجود" @input="searchWord"/>
              <img :src="SearchIconSVG" alt="SearchIconSVG" />
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
          <div class="flex justify-center items-center h-full gap-1 rounded-md p-2" v-if="dbData.length == 0">
            هیچ کالایی یافت نشد
          </div>
        </div>
        <!-- form -->
        <div class="lg:w-2/3 lg:border rounded lg:p-[20px] flex flex-col gap-1">
          <!-- date -->
          <div class="flex justify-end">
            <div class="flex flex-col w-[150px]">
              <div class="border rounded px-1 text-center flex items-center" @keyup="setDate">
                  <input type="text" class="w-full outline-none text-center" :value="dayjs().calendar('jalali').locale('fa').format('DD')" id="day" placeholder="روز" maxlength="2"/>/
                  <input type="text" class="w-full outline-none text-center" :value="dayjs().calendar('jalali').locale('fa').format('MM')" id="month" placeholder="ماه" maxlength="2"/>/
                  <input type="text" class="w-full outline-none text-center" :value="dayjs().calendar('jalali').locale('fa').format('YYYY')" id="year" placeholder="سال" maxlength="4"/>
              </div>
            </div>
          </div>
          <!-- Name SellerName -->
          <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1">
              <p>نام<span class="text-red-500">(اجباری)</span></p>
              <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام کالا" id="Name" @input="setName"/>
            </div>
            <div class="flex flex-col col-span-1">
              <p>فروشنده<span class="text-red-500">(اجباری)</span></p>
              <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام فروشنده" id="SellerName" @input="setSellerName"/>
            </div>
          </div>
          <!-- Compnay PurchasePrice -->
          <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1">
              <p>شرکت<span class="text-red-500">(اجباری)</span></p>
              <input type="text" class="border rounded outline-none px-1 text-center" placeholder="نام شرکت کالا" id="Company" @input="setCompany"/>
            </div>
            <div class="flex flex-col col-span-2" @keyup="setprofit(),calculateFinalProfit(),calculateFullDebtPaidTypeDate()">
              <p>قیمت خرید<span class="text-red-500">(اجباری)(ریال)</span></p>
              <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت خرید فی کالا" id="PurchasePrice" @input="setPurchasePrice" dir="ltr"/>
            </div>
          </div>
          <!-- SalesPrice Profit -->
          <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="setprofit(),calculateFinalProfit()">
              <p>قیمت فروش<span class="text-red-500">(اجباری)(ریال)</span></p>
              <input type="text" class="border rounded outline-none px-1 text-center" placeholder="قیمت فروش فی کالا" id="SalesPrice" @input="setSalesPrice" dir="ltr"/>
            </div>
            <div class="flex flex-col col-span-1">
              <span>سود</span>
              <div class="border p-[5px] bg-gray-300 rounded-md px-1 text-center" id="Profit" dir="ltr">سود فی کالا (ریال)</div>
            </div>
          </div>
          <!-- Amount Unit FinalProfit -->
          <div class="md:grid grid-flow-col grid-cols-2 gap-1">
            <div class="flex flex-col col-span-1" @keyup="calculateFinalProfit">
              <p>مقدار<span class="text-red-500">(اجباری)</span></p>
              <div class="flex justify-between border rounded">
                  <input type="text" class="outline-none px-1 w-full border-l bg-transparent" dir="ltr" placeholder="0" id="Amount" @input="setAmount(),calculateFullDebtPaidTypeDate(),calculateAmountUnit(),setFinalProfit()"/>
                  <select class="cursor-pointer outline-none bg-transparent" id="Unit" @input="setUnit">
                      <option value="عدد">عدد</option>
                      <option value="کیلوگرم">کیلوگرم</option>
                      <option value="گرم">گرم</option>
                  </select>
              </div>
            </div>
            <div class="flex flex-col col-span-1">
              <span>سود x مقدار</span>
              <div class="border p-[5px] bg-gray-300 rounded-md px-1 text-center" id="FinalProfit">سود محموله (ریال)</div>
            </div>
          </div>
        </div>
      </div>
      <!-- footer -->
      <div class="w-full flex flex-col lg:flex-row gap-1 lg:gap-0 items-center mt-[10px] text-center">
        <div class="grid grid-flow-col grid-cols-3 items-center gap-1 w-full lg:mb-1">
          <span>هزینه کل کالا:</span>
          <span id="FullDebt" class="text-white bg-red-500 p-[5px]">0</span>
          <span>ریال</span>
        </div>
        <div class="grid grid-flow-col grid-cols-3 lg:flex items-center gap-1 w-full">
          <span>پرداخت:</span>
          <div class="flex flex-col lg:flex-row border border-blue-500 w-full">
            <input type="text" value="0" id="Paid" class="outline-none border-blue-500 border-b lg:border-l lg:border-b-0" dir="ltr" @input="setPaid">
            <select id="Type" class="outline-none" @input="setType">
              <option value="چک">چک</option>
              <option value="نقدی">نقدی</option>
              <option value="کارتخوان">کارتخوان</option>
              <option value="کارت به کارت">کارت به کارت</option>
            </select>
          </div>
          <span>ریال</span>
        </div>
        <div class="grid grid-flow-col grid-cols-3 lg:grid-cols-2 items-center gap-1 w-full">
          <span>توضیحات:</span>
          <input type="text" id="Description" class="text-center border border-blue-500" @input="setDescription">
        </div>
        <div class="w-full flex lg:justify-end">
          <button @click="postData" class="border bg-blue-500 hover:bg-blue-600 text-white p-[5px] w-full lg:w-2/3 rounded">
            ذخیره
          </button>
        </div>
      </div>
    </div>
  </div>
  <Loading v-if="loading"></Loading>
</template>

<style scoped>
input {
  padding: 5px;
}
</style>
