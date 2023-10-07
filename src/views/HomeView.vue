<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Loading from '../components/loading.vue'
import serverURL from '../config/serverAddress'
import AuthService from '../services/auth.service';
import axios from 'axios'
import editIconSVG from '../assets/editIcon.svg'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

const loading = ref(false)
const message = ref(null)

let dbAccountData = ref([])
let dbWarehouseData = ref([])

let personName = ref(null)
let cost = ref(null)
let description = ref(null)
const getData = async() => {
    loading.value = true
    await getAccountancyData()
    await getWarehouseData()
    loading.value = false
}

// Get All Balance Logs
const getAccountancyData = async() =>{
  axios.get(serverURL + '/api/balanceLogs/' + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
    (res)=>{
      dbAccountData.value = res.data
    }
  )
  .catch(function (error) { console.log(error),loading.value = false,message.value = error})
}

// Get All Item Logs
const getWarehouseData = async() =>{
    axios.get(serverURL + "/api/itemLogs/" + dayjs().calendar('jalali').locale('fa').format('YYYY-MM-DD')).then(
    (res)=>{
        dbWarehouseData.value = res.data
    })
  .catch(function (error) { console.log(error),loading.value = false,message.value = error})
}

getData()
</script>
<template>
    <main class="flex flex-col pt-[20px] justify-center items-center">
        <div class="text-[24px] w-full px-5 flex items-center gap-5 justify-between">
            <span>میزکار</span>
        </div>
        <button class="absolute w-full flex justify-between top-0 bg-red-500 text-white p-2 text-[12px]" v-if="message" @click="()=>{message = null}">
            {{message}}
            <i>x</i>
        </button>
        <div class="flex flex-col md:flex-row gap-1 w-[90%] text-center h-[70vh] mt-5">
            <div class="border lg:w-3/12 min-h-[200px] max-h-[300px] lg:max-h-none">
                <RouterLink to="/cashier" class="border-b grid grid-flow-col grid-cols-12 items-center hover:bg-blue-500">
                    <span class='col-span-11'>دخل و خرج امروز</span>
                    <img :src="editIconSVG" alt="editIconSVG">
                </RouterLink>
                <div class="overflow-y-auto" v-if="dbAccountData">
                    <div v-for="(data,index) in dbAccountData" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key='index'>
                        <div class="grid grid-flow-col grid-cols-3 w-full p-1 border-b">
                            <span>{{ data.personName?data.personName:"شما" }}</span>
                            <span v-if='data.cost'>{{ data.cost }}-</span>
                            <span v-if='data.cash || data.card'>
                            {{ (data.cash ? parseInt(data.cash) : 0) + (data.card ? parseInt(data.card) : 0) }}+
                            </span>
                            <span>{{ data.description ? data.description : 'نقدی و کارت' }}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="border lg:w-3/12  min-h-[200px] max-h-[300px] lg:max-h-none">
                <RouterLink to="/warehouse/newOrder" class="border-b grid grid-flow-col grid-cols-12 items-center hover:bg-blue-500">
                    <span class='col-span-11'>فروخته شده های امروز</span>
                    <img :src="editIconSVG" alt="editIconSVG">
                </RouterLink>
                <div class="overflow-y-auto" v-if="dbWarehouseData">
                    <div v-for="(data,index) in dbWarehouseData" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key="index">
                        <div class="grid grid-flow-col grid-cols-12 w-full p-1 border-b">
                            <span class="col-span-11">{{ data.name }}</span>
                            <span>{{ parseInt(data.oldVal) - parseInt(data.newVal) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:w-3/12 flex lg:flex-col justify-between gap-1">
                
                <div class="border min-h-[200px] max-h-[300px] lg:max-h-none">
                    <div class="border-b items-center">سود امروز</div>
                    <!-- <span class='col-span-11'>سود امروز</span> -->
                    <!-- <button class="border-b w-full grid grid-flow-col grid-cols-12 items-center">
                        <editIconVue/>
                    </button> -->
                    <div class="overflow-y-auto" v-if="dbWarehouseData">
                        <!-- <div class="grid grid-flow-col grid-cols-5 border-b bg-white">
                            <div class="py-2 px-3 col-span-4">نام کالا</div>
                            <div class="py-2 px-3">تعداد</div>
                        </div> -->
                        <!-- <div v-for="(data,index) in dbWarehouseData" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key="index">
                            <div class="grid grid-flow-col grid-cols-3 w-full p-1 border-b">
                                <span>{{ data.name }}</span>
                                <span>{{ parseInt(data.oldVal) - parseInt(data.newVal) }}</span>
                            </div>
                        </div> -->
                    </div>
                </div>

                <!-- <div class="border min-h-[200px] max-h-[300px] lg:max-h-none">
                    <button class="border-b w-full grid grid-flow-col grid-cols-12 items-center">
                        <span class='col-span-11'>بدهی امروز</span>
                        <editIconVue/>
                    </button>
                    <div class="overflow-y-auto" v-if="dbWarehouseData">
                        <div class="grid grid-flow-col grid-cols-5 border-b bg-white">
                            <div class="py-2 px-3 col-span-4">نام کالا</div>
                            <div class="py-2 px-3">تعداد</div>
                        </div>
                        <div v-for="(data,index) in dbWarehouseData" class="odd:bg-[#f6f6f6] hover:bg-[#e9e9e9]" v-bind:key="index">
                            <div class="grid grid-flow-col grid-cols-3 w-full p-1 border-b">
                                <span>{{ data.name }}</span>
                                <span>{{ parseInt(data.oldVal) - parseInt(data.newVal) }}</span>
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </main>
    <Loading :loading="loading"></Loading>
</template>
