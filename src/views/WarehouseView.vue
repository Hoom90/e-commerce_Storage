<script setup>
import AddIconSVG from '../assets/addIcon.svg'
import SearchIconSVG from '../assets/searchIcon.svg'
import { onMounted, ref } from 'vue'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import axios from 'axios'

const dbData = ref(null)
const message = ref(null)
const loading = ref(false)
const errorMessage = ref(null)

onMounted(()=>{
    getData()
})

// Get All Items
const getData = async()=> {
    loading.value = true
    await axios.get(serverURL + "/api/itemTransaction/")
    .then((res)=>{
        if(res.data.length != 0){
            dbData.value = res.data;
        }
        else{
            loading.value = false
            message.value = 'کالایی یافت نشد!'
        }
    })
    .catch(function (error) {
        console.log(error);
        message.value = error
    })
    .finally(
        loading.value = false
    )
}

const searchBox2 =ref(null)
const searchData = () => {
    // Declare variables
    let filter, li, a, i, txtValue;
    filter = searchBox2.value.value.toUpperCase();
    li = document.querySelectorAll('#tableData');
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].querySelectorAll("#dataName")[0];
        txtValue = a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

getData()
</script>
<template>
    <main class="flex flex-col pt-[25px] justify-center items-center">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between">
            <span>ثبت کالا</span>
        </div>
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="border w-[90%] mt-3">
            <!-- table tools -->
            <div class="py-[10px] px-[20px] flex justify-between gap-1 w-full border-b">
                <div class="flex gap-1">
                    <RouterLink to="/warehouse/newItem" class="flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 rounded px-2">
                        <img :src="AddIconSVG" alt="AddIconSVG"/>
                    </RouterLink>
                    <div class="border rounded flex justify-center items-center px-1">
                        <input type="text" ref="searchBox2" class="outline-none px-1 bg-transparent min-w-[200px]" placeholder="جستجو" @input="searchData">
                        <img :src="SearchIconSVG" alt="SearchIconSVG">
                    </div>
                </div>
                <div class="flex gap-1">
                    <RouterLink to='/warehouse/newOrder' class="hidden md:flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 rounded px-1">
                        ثبت فروش و عودت کالا
                    </RouterLink><RouterLink to='/warehouse/newOrder' class="flex md:hidden justify-center items-center text-white bg-blue-500 hover:bg-blue-600 rounded px-1">
                        +/-
                    </RouterLink>
                    <RouterLink to='/warehouse/newlist' class="hidden md:flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 rounded px-1">
                        ثبت فاکتور
                    </RouterLink>
                    <RouterLink to='/warehouse/newlist' class="flex md:hidden justify-center items-center text-white bg-blue-500 hover:bg-blue-600 rounded px-1">
                        فاکتور
                    </RouterLink>
                </div>
            </div>
            <!-- table -->
            <div v-if="dbData != null" class="overflow-auto max-h-[400px]">
                <!-- header -->
                <div class="grid grid-flow-col grid-cols-12 border-b">

                    <div class="py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-1">رکورد</div>
                    <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-6 lg:col-span-7">نام
                    </div>
                    <div class="border-r py-2 px-3 hidden lg:flex justify-center items-center text-[12px] truncate lg:col-span-1">وزن
                    </div>
                    <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-3 lg:col-span-1">فی(تومان)
                    </div>
                    <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] col-span-3 truncate lg:col-span-1">تعداد(عدد)
                    </div>
                    <div class="border-r py-2 px-3 hidden lg:flex justify-center items-center text-[12px] truncate lg:col-span-1">تاریخ
                    <br class="block md:hidden"/>دریافت</div>
                    
                </div>
                <!-- content --> 
                <div class="flex flex-col">

                    <RouterLink :to="'/warehouse/' + data._id" v-for="(data, index) in dbData" class="grid grid-flow-col grid-cols-12 border-b min-h-[30px] hover:bg-gray-50 cursor-pointer" id="tableData" v-bind:key="index">
                        <div class="py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-1">{{ index + 1 }}
                        </div>
                        <div id="dataName" class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-6 lg:col-span-7">
                            {{ data.name }}</div>
                        <div class="border-r py-2 px-3 hidden lg:flex justify-center items-center text-[12px] truncate lg:col-span-1">
                            {{ data.weight ? data.weight == 'null' ? "-" : data.weight : "-" }}</div>
                        <div class="border-r py-2 px-3 flex gap-1 justify-center items-center text-[12px] truncate col-span-3 lg:col-span-1">
                            <span class="text-white bg-red-500 p-1">{{ data.basePrice ? data.basePrice == 'null' ? "-" : data.basePrice : "-" }}</span>
                            <span class="text-white bg-green-500 p-1">{{ data.price ? data.price == 'null' ? "-" : data.price : "-" }}</span></div>
                        <div class="border-r py-2 px-3 flex justify-center items-center text-[12px] truncate col-span-3 lg:col-span-1">
                            {{ data.amount ? data.amount == 'null' ? "-" : data.amount : "-" }}</div>
                        <div
                            class="border-r py-2 px-3 hidden lg:flex justify-center items-center text-[12px] truncate lg:col-span-1 flex-col">
                            <span dir='ltr'>{{ data.date ? data.date == 'null' ? "-" : data.date : "-" }}</span>
                        </div>
                    </RouterLink>

                </div>
            </div>
        </div>
    </main>
<Loading v-if="loading"></Loading>
</template>
<style scoped>
input{
    padding: 5px;
}
</style>