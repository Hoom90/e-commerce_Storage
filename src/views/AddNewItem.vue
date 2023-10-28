<script setup>
import store from '../store';

import ArrowIconSVG from "../assets/arrowLeftIcon.svg";
import SearchIconSVG from "../assets/searchIcon.svg";
import { ref } from "vue";
import Loading from "../components/loading.vue";
import serverURL from "../config/serverAddress";
import router from "../config";
import Form1 from '../components/form1.vue'
import axios from "axios";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

let name = ref(null);
let weight = ref('گرم');
let basePrice = ref(0);
let price = ref(0);
let profit = ref(null);
let amount = ref(null);
let billId = ref(null);
let date = ref(ref(dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD')));

const dbData = ref(null);
const balanceData = ref(null);
const loading = ref(false);
const message = ref(null);
const init = ref(true);

const getData = async () => {
  loading.value = true;
  await getItems();
  // await getBalance();
  loading.value = false;
};

// Get All Data
const getItems = async () => {
  await axios
    .get(serverURL + "/api/itemTransaction/")
    .then((res) => {
        dbData.value = res.data;
    })
    .catch(function (error) {
      console.log(error);
      message.value = error;
      loading.value = false;
    });
};

// Get Last Balance
const getBalance = async () => {
  await axios
    .get(
      serverURL +
        "/api/balanceTransaction/" +
        dayjs().calendar("jalali").locale("fa").format("YYYY-MM-DD")
    )
    .then((res) => {
      console.log(res.data);
      balanceData.value = res.data;
      // calculateBalance();
    })
    .catch(function (error) {
      console.log(error), (loading.value = false), (message.value = error);
    });
};

const calculateBalance = () => {
  let income = 0,
    outcome = 0,
    balance = 0;
  balanceData.value.forEach((item) => {
    income += parseInt(item.income);
    outcome += parseInt(item.outcome);
  });
  if (parseInt(outcome) < 0) {
    balance = parseInt(income) + parseInt(outcome);
  } else {
    balance = parseInt(income) - parseInt(outcome);
  }
  balanceData.value = {
    income,
    outcome,
    balance,
    date: dayjs().calendar("jalali").locale("fa").format("YYYY/MM/DD"),
  };
};

const postData = async () => {
  loading.value = true;
  let debtBalance = document.getElementById('debtBalance').innerText.replace(',','')
  let debtPay = document.getElementById('debtPay').value.replace(',','')
  let outcome = parseInt(debtBalance) - parseInt(debtPay)
  let balance = balanceData.value.balance ? parseInt(balanceData.value.balance) - outcome : -outcome
  const body = {
    'outcome': (-outcome).toString(),
    'balance': balance.toString(),
    'card': (debtPay * -1).toString(),
    'description': 'خرید کالا',
    'name': name.value,
    'weight': weight.value,
    'basePrice': basePrice.value,
    'price': price.value,
    'profit': profit.value.toString(),
    'amount': amount.value,
    'billId': billId.value,
    'date': date.value,
  };
  // console.log(body);
  await axios
    .post(serverURL + "/api/itemTransaction", body, {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
    .then(res =>{
      router.push("/warehouse")
    })
    .catch((error) => {
      console.log(error);
      message.value = error;
    })
    .finally((loading.value = false));
};

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
};

let day = ref(dayjs().calendar('jalali').locale('fa').format('DD'));
let month = ref(dayjs().calendar('jalali').locale('fa').format('MM'));
let year = ref(dayjs().calendar('jalali').locale('fa').format('YYYY'));
const setDate = () => {
  date.value = year.value + "/" + month.value + "/" + day.value;
};

const duplicateItemData = (index) => {
  document
    .querySelector("input[name=profit]")
    .classList.replace("border-red-500", "border-gray-50");
  document
    .querySelector("input[name=profit]")
    .classList.replace("border-green-500", "border-gray-50");
  document
    .querySelector("input[name=profitxamount]")
    .classList.replace("border-red-500", "border-gray-50");
  document
    .querySelector("input[name=profitxamount]")
    .classList.replace("border-green-500", "border-gray-50");
  name.value = null;
  weight.value = null;
  basePrice.value = null;
  price.value = null;
  profit.value = null;
  amount.value = null;
  profitxamount.value = null;
  billId.value = null;
  date.value = null;
  day.value = null;
  month.value = null;
  year.value = null;
  setDuplicatedData(index);
  calculateInitDebt()
  let length = dbData.value.length;
  for (let i = 0; i < length; i++) {
    document
      .querySelector("button[name=item" + i + "]")
      .classList.replace("border-blue-500", "border-gray-200");
  }
  document
    .querySelector("button[name=item" + index + "]")
    .classList.replace("border-gray-200", "border-blue-500");
};

const setDuplicatedData = (index) => {
  name.value = dbData.value[index].name;
  weight.value =
    dbData.value[index].weight == "null" ? "" : dbData.value[index].weight;
  basePrice.value =
    dbData.value[index].basePrice == "null"
      ? ""
      : dbData.value[index].basePrice;
  price.value =
    dbData.value[index].price == "null" ? "" : dbData.value[index].price;
  amount.value =
    dbData.value[index].amount == "null" ? "" : dbData.value[index].amount;
  billId.value =
    dbData.value[index].billId == "null" ? "" : dbData.value[index].billId;
  date.value =
    dbData.value[index].date == "null" ? "" : dbData.value[index].date;
  day.value =
    dbData.value[index].date == "null"
      ? ""
      : dbData.value[index].date.split("/")[2];
  month.value =
    dbData.value[index].date == "null"
      ? ""
      : dbData.value[index].date.split("/")[1];
  year.value =
    dbData.value[index].date == "null"
      ? ""
      : dbData.value[index].date.split("/")[0];
  if (price.value != null && basePrice.value != null) {
    profit.value = parseInt(price.value) - parseInt(basePrice.value);
  }
  if (price.value != null && basePrice.value != null && amount.value != null) {
    profitxamount.value = parseInt(profit.value) * parseInt(amount.value);
  }
};

const profitxamount = ref(null);
const calculator = () => {
  if (price.value != null && basePrice.value != null) {
    profit.value = parseInt(price.value) - parseInt(basePrice.value);
    if (parseInt(profit.value) < 0) {
      if (
        document
          .querySelector("input[name=profit]")
          .classList.contains("border-gray-50")
      ) {
        document
          .querySelector("input[name=profit]")
          .classList.replace("border-gray-50", "border-red-500");
      } else {
        document
          .querySelector("input[name=profit]")
          .classList.replace("border-green-500", "border-red-500");
      }
    } else {
      if (
        document
          .querySelector("input[name=profit]")
          .classList.contains("border-gray-50")
      ) {
        document
          .querySelector("input[name=profit]")
          .classList.replace("border-gray-50", "border-green-500");
      } else {
        document
          .querySelector("input[name=profit]")
          .classList.replace("border-red-500", "border-green-500");
      }
    }
  } else {
    document
      .querySelector("input[name=profit]")
      .classList.replace("border-red-500", "border-gray-50");
    document
      .querySelector("input[name=profit]")
      .classList.replace("border-green-500", "border-gray-50");
  }
  if (price.value != null && basePrice.value != null && amount.value != null) {
    profitxamount.value = parseInt(profit.value) * parseInt(amount.value);
    if (parseInt(profitxamount.value) < 0) {
      if (
        document
          .querySelector("input[name=profitxamount]")
          .classList.contains("border-gray-50")
      ) {
        document
          .querySelector("input[name=profitxamount]")
          .classList.replace("border-gray-50", "border-red-500");
      } else {
        document
          .querySelector("input[name=profitxamount]")
          .classList.replace("border-green-500", "border-red-500");
      }
    } else {
      if (
        document
          .querySelector("input[name=profitxamount]")
          .classList.contains("border-gray-50")
      ) {
        document
          .querySelector("input[name=profitxamount]")
          .classList.replace("border-gray-50", "border-green-500");
      } else {
        document
          .querySelector("input[name=profitxamount]")
          .classList.replace("border-red-500", "border-green-500");
      }
    }
  } else {
    document
      .querySelector("input[name=profitxamount]")
      .classList.replace("border-red-500", "border-gray-50");
    document
      .querySelector("input[name=profitxamount]")
      .classList.replace("border-green-500", "border-gray-50");
  }
};

const calculateInitDebt = () =>{
  !amount.value ? amount.value = '1' : amount.value
  let result = parseInt(basePrice.value) * parseInt(amount.value)
  document.getElementById('debtBalance').innerText = formatData(result)
  document.getElementById('debtPay').value = formatData(result)
  document.getElementById('debtPay').disabled = false
}

const formatData = (data) => {
  if(data){
    return (data = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  }
};

const handleErrorClose = () =>{
  message.value = null;
}

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
          <div class="">
            <div class="flex gap-1 items-center rounded px-1">
              <input type="text" id="TableSearchBox" class="outline-none min-w-[300px] w-full" placeholder="جستجو در بین کالاهای موجود" @input="searchWord"/>
              <img :src="SearchIconSVG" alt="SearchIconSVG" />
            </div>
            <!-- search result -->
            <div class="w-full grid overflow-y-scroll max-h-[80px]">
              <button class="border border-gray-200 hover:bg-[#c9c9c9]" v-for="(item, index) in dbData" @click="duplicateItemData(index)"
                :name="'item' + index" id="itemData" v-bind:key="index">
                <div class="flex justify-between gap-1 p-[10px] text-[12px]">
                  <span>{{ item.name }}</span>
                  <span dir="ltr">{{ item.salesPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
                </div>
              </button>
            </div>
          </div>
          <div class="flex justify-center gap-1 my-1 border rounded-md p-2" v-if="dbData.length == 0">
            هیچ کالایی یافت نشد
          </div>
        </div>
        <!-- form -->
        <Form1/>
        <!-- <div class="lg:w-2/3 lg:border rounded lg:p-[20px]">
          <div class="flex flex-col">
            <p>نام<span class="text-red-500">*</span></p>
            <input
              type="text"
              class="border rounded outline-none px-1"
              placeholder="نام کالا"
              v-model="name"
            />
          </div>
          <div class="md:grid grid-flow-col grid-cols-5 gap-1">
            <div class="flex flex-col col-span-2" @keyup="calculator">
              <p>قیمت خرید<span class="text-red-500">*</span></p>
              <input
                type="text"
                class="border rounded outline-none px-1 text-center"
                placeholder="قیمت خرید فی کالا"
                v-model="basePrice"
                @input="calculateInitDebt"
              />
            </div>
            <div class="flex flex-col col-span-2" @keyup="calculator">
              <p>قیمت فروش<span class="text-red-500">*</span></p>
              <input
                type="text"
                class="border rounded outline-none px-1 text-center"
                placeholder="قیمت فروش فی کالا"
                v-model="price"
              />
            </div>
            <div class="flex flex-col">
              <span>سود</span>
              <input
                type="text"
                class="border border-gray-50 rounded-md outline-none px-1 text-center"
                placeholder="سود فی کالا"
                name="profit"
                v-model="profit"
                disabled
              />
            </div>
          </div>
          <div class="md:grid grid-flow-col grid-cols-5 gap-1">
            <div class="flex flex-col col-span-2">
              <span>وزن</span>
              <input
                type="text"
                class="border rounded outline-none px-1 text-center"
                placeholder="وزن فی کالا"
                v-model="weight"
              />
            </div>
            <div class="flex flex-col col-span-2" @keyup="calculator">
              <p>تعداد<span class="text-red-500">*</span></p>
              <input
                type="text"
                class="border rounded outline-none px-1 text-center"
                placeholder="تعداد کالا"
                v-model="amount"
                @input="calculateInitDebt"
              />
            </div>
            <div class="flex flex-col">
              <span>سود در تعداد</span>
              <input
                type="text"
                class="border border-gray-50 rounded-md outline-none px-1 text-center"
                placeholder="سود محموله"
                name="profitxamount"
                v-model="profitxamount"
                disabled
              />
            </div>
          </div>
          <div class="md:grid grid-flow-col grid-cols-5 gap-1">
            <div class="flex flex-col col-span-4">
              <span>فاکتور</span>
              <input
                type="text"
                class="border rounded outline-none px-1"
                placeholder="مشخصات فاکتور"
                v-model="billId"
              />
            </div>
            <div class="flex flex-col">
              <span>تاریخ</span>
              <div
                class="border rounded px-1 text-center flex items-center"
                @keyup="setDate"
              >
                <input
                  type="text"
                  class="w-full outline-none text-center"
                  placeholder="روز"
                  v-model="day"
                  maxlength="2"
                />/
                <input
                  type="text"
                  class="w-full outline-none text-center"
                  placeholder="ماه"
                  v-model="month"
                  maxlength="2"
                />/
                <input
                  type="text"
                  class="w-full outline-none text-center"
                  placeholder="سال"
                  v-model="year"
                  maxlength="4"
                />
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <!-- footer -->
      <div class="w-full flex items-center mt-[10px] text-center">
        <div class="grid grid-flow-col grid-cols-2 items-center gap-1 w-full mb-1">
          <span>بدهی:</span>
          <span id="debtBalance" class="text-white bg-red-500 p-[5px]">0</span>
          <span>تومان</span>
        </div>
        <div class="grid grid-flow-col grid-cols-2 items-center gap-1 w-full">
          <span>پرداخت:</span>
          <input type="text" value="0" id="debtPay" class="text-center border border-blue-500" disabled>
          <span>تومان</span>
        </div>
        <div class="w-full flex justify-center lg:justify-end">
          <button
            @click="postData"
            class="border bg-blue-500 hover:bg-blue-600 text-white p-[5px] w-1/2 rounded"
          >
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
