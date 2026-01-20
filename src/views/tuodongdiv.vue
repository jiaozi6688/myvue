<template>
    <div class="tuodongdiv">
        <li draggable="true"></li>
        <li draggable="true"></li>
        <li draggable="true"></li>
        <li draggable="true"></li>
    </div>
</template>
<script lang="ts" setup>
// 挂载完成
import { onMounted } from 'vue'

onMounted(() => {
    const list: any = document.querySelector('.tuodongdiv');
    console.log('list:', list);

    // 记录拖动的li元素
    let draggingLi = null;
    list.ondragstart = function (e: any) {
        setTimeout(() => {
            // 给拖拽的元素添加moving类名
            // e.target 就是拖拽的元素
            // .classList.add('moving') 给拖拽的元素添加moving类名
            e.target.classList.add('moving');
        }, 0);
        // 记录当前拖拽的元素
        draggingLi = e.target;
        console.log('draggingLi:', draggingLi);
        
    }
})

</script>
<style scoped>
.tuodongdiv {
    display: flex;
    flex-wrap: wrap;
    width: 1200px;
    height: 400px;
    background-color: #f5f5f5;

    li {
        list-style: none;
        width: 100px;
        height: 100px;
        background-color: #856363;
        margin-left: 10px;
        margin-top: 10px;
        gap: 10px;
    }
}
</style>
