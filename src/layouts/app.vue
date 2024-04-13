<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import desktop from "./desktop.vue"
import mobile from "./mobile.vue"
const route = useRoute();
// This is a computed property that will return the name of the current route
const layout = computed(() => {
    const layout = route?.meta?.layout;
    if (layout) {
        if(layout.name == mobile) return mobile
        else if(layout.name == desktop) return desktop
        else return layout
    }
    return 'div';
});
</script>

<template>
    <component :is="layout">
        <Router-view />
    </component>
</template>