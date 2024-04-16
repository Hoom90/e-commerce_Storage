<script setup>
const props = defineProps(['class'])
const emits = defineEmits(['blur'])
</script>
<template>
    <div class="fixed top-0 left-0 w-screen h-screen z-10">
        <div class="flex justify-center items-center h-full w-full p-5">
            <div :class="props.class ?? ''">
                <slot/>
            </div>

            <div class="absolute w-full h-full bg-[#00000031] z-10" @click="emits('blur',false)"><!-- close modal action --></div>
        </div>
    </div>
</template>