<template>
    <div class="tuodongdiv-container">
        <h1>拖动页面</h1>
        <div class="tuodongdiv">
            <p draggable="true" @dragstart="tuodong" @dragend="tuodongwc">1</p>
            <p draggable="true" @dragstart="tuodong" @dragend="tuodongwc">2</p>
            <p draggable="true" @dragstart="tuodong" @dragend="tuodongwc">3</p>
            <p @dragover="tuodongover" @drop="tuodongdrop">4</p>
            <p @dragover="tuodongover" @drop="tuodongdrop">5</p>
            <p @dragover="tuodongover" @drop="tuodongdrop">6</p>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'

ElMessage.success('操作成功！')

function tuodong(e: any) {
    e.dataTransfer?.setData('text', e.target?.innerHTML);
    console.log('拖动了的内容', e.dataTransfer?.getData('text'));
}
function tuodongwc(e: any) {
    console.log('拖动结束了', e.target);
}

function tuodongover(e: any) {
    e.preventDefault();
    // 阻止默认事件，否则会触发浏览器的默认行为，比如打开链接
    // 可以在drop事件中处理拖动到目标元素的操作
}
function tuodongdrop(e: any) {
    e.preventDefault();
    console.log('放到了', e.target.innerHTML);
    e.target.innerHTML = e.dataTransfer?.getData('text');
    console.log(e);
}

</script>
<style scoped>
.tuodongdiv {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 1200px;
    height: 400px;
    background-color: #f5f5f5;
}

p {
    width: 100px;
    height: 100px;
    background-color: #dfd5d5;
}

.message-box {
    width: 300px;
    height: 50px;
    background-color: aqua;
}
</style>
