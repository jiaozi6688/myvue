<template >
</template>
<script setup lang="ts">
import message from '@/components/modal/message'
</script>
<style scoped>
.message-box{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 300px;
    height: 100px;
    background-color: rgba(0,0,0,0.5);
    color: #fff;
    text-align: center;
    line-height: 100px;
}
.message-error{
    background-color: red;
}
</style>