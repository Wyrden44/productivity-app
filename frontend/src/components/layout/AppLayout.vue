<script setup lang="ts">
import NavBar from '../NavBar.vue'
import FooterItem from '../FooterItem.vue'
</script>

<template>
    <div class="min-h-screen flex flex-col flex-1">
        <NavBar />

        <main class="min-h-screen p-6 overflow-auto flex flex-col items-center">
            <slot />
        </main>

        <FooterItem />
    </div>
</template>
