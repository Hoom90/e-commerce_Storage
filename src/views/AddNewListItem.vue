<script setup>
import { ref } from 'vue'
import ArrowIconSVG from '../assets/arrowLeftIcon.svg'
import RemoveIconSVG from '../assets/removeIcon.svg'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import AddNewItem from '../components/addNewItem.vue'
import router from '../config'
import axios from 'axios'

const billInfo = ref(null)
const costs = ref(0)
const profits = ref(0)

const dbData = ref(null)
const loading = ref(false)
const message = ref(null)
const billData = ref([])
const modal = ref(false)

// Get All Data
const getData = async()=> {
    loading.value = true
    await axios.get(serverURL + "/api/itemTransaction/")
    .then((res)=>{
        dbData.value = res.data;
    })
    .catch(function (error) {
        console.log(error);
    })
    .finally(
        loading.value = false
    )
}

// Customed POST
const postData = async () => {
    loading.value = true
    let fail = false
    for(let i=0;i<billData.value.length;i++){
        const formData = new FormData()
        formData.append('name', billData.value[i].name)
        formData.append('weight', billData.value[i].weight)
        formData.append('basePrice', billData.value[i].basePrice)
        formData.append('price', billData.value[i].price)
        formData.append('profit', billData.value[i].profit)
        formData.append('amount', billData.value[i].amount)
        formData.append('billId', billData.value[i].billId)
        formData.append('date', billData.value[i].date)
        await fetch(serverURL + "/api/itemTransaction", {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        })
            .then((res) => {
                if (!res.ok) {
                    console.log(res.statusText);
                    message.value = res.statusText
                    loading.value = false
                    fail = true
                }
            })
            if(fail){
                break;
            }
        }
    loading.value = false
    router.push('/warehouse')
}

const removeItemFromList = (index) =>{
    costs.value -= parseInt(billData.value[index].basePrice)
    profits.value -= parseInt(billData.value[index].profit) * parseInt(billData.value[index].amount)
    billData.value.splice(index, 1);
}

const updateModal = (value) =>{
    modal.value = value
}

const updateItem = (item)=>{
    billData.value.push(item.value)
    costs.value += parseInt(item.value.basePrice)
    profits.value += parseInt(item.value.profit) * parseInt(item.value.amount)
}

getData()
</script>
<template>
    <!-- multi add -->
    <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
        {{message}}
        <i>x</i>
    </button>
    <div class="w-full p-[20px]" v-if="!modal">
        <div class="max-w-[800px] mx-auto my-[20px] border rounded-md p-[10px]">

            <!-- header -->
            <div class="flex justify-center">
                <div class="flex items-center">
                    <RouterLink to="/warehouse" class="flex gap-1 items-center hover:bg-red-500 hover:text-white border border-red-500 rounded-md p-2">
                        <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                    </RouterLink>
                </div>
                <div class="flex w-full justify-center">
                    <span class="flex justify-center my-3 text-[20px] font-bold">فاکتور جدید</span>
                </div>
            </div>

            <!-- body -->
            <div>
                <div class="flex flex-col col-span-4 mb-3">
                    <span>فاکتور</span>
                    <input type="text" class="border rounded outline-none px-1" placeholder="مشخصات فاکتور" v-model="billInfo">
                </div>
                <div v-if="billInfo">
                    <span>لیست کالاهای فاکتور</span>
                    <div class="w-full grid gap-1 overflow-y-scroll max-h-[300px]"
                        v-if="billData != null">
                        <div class="border relative hover:bg-[#c9c9c9] odd:bg-[#f6f6f6]" v-for="(item, index) in billData"
                            :name="'item' + index" id="itemData" v-bind:key="index">
                            <div class='flex justify-between items-center pr-3 text-[12px] truncate'>
                                <button class="flex justify-between w-11/12">
                                    <span>{{ item.name }}</span>
                                    <span>{{ item.basePrice != null ? "تومان "+item.basePrice : "بدون قیمت"}}</span>
                                </button>
                                <button class='bg-red-500 text-white p-1' @click="removeItemFromList(index)">
                                    <img :src="RemoveIconSVG" alt="RemoveIconSVG">
                                </button>
                            </div>
                        </div>
                        <button @click="() => {modal = true}" class="border bg-blue-500 text-center hover:bg-blue-600 text-white p-[10px]">
                            افزودن کالا
                        </button>
                    </div>
                </div>
            </div>

            <!-- footer -->
            <div class="w-full flex items-center mt-[10px] justify-between">
                <div class='flex gap-3'>
                    <span>جمع کل:</span>
                    <span dir='ltr'>{{ costs }}</span>
                </div>
                <div class='flex gap-3'>
                    <span>سود:</span>
                    <span dir='ltr'>{{ profits }}</span>
                </div>
                <button @click="postData"
                    class="border bg-blue-500 hover:bg-blue-600 text-white p-1 w-1/2 lg:w-[200px] rounded">ذخیره</button>
            </div>
        </div>
    </div>
    <AddNewItem v-if="modal" :modal="modal" :data="dbData" :billId="billInfo" @update:modal="updateModal" @set:item="updateItem"></AddNewItem>
    <Loading v-if="loading"></Loading>
</template>
<style scoped>
input{
    padding: 5px;
}</style>
