// three.js相关公共方法
import * as THREE from 'three';

/**
 * 获取与射线相交的对象数组
 * @param {*} event 事件event
 * @param {*} domNode canvas DOM节点
 * @param {*} camera 相机对象
 * @param {*} scene 场景对象
 */
export function getCanvasIntersects(event, domNode, camera, scene) {
    // 声明 raycaster 和 mouse 变量
    let rayCaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    event.preventDefault();
    // 判断canvas画布是否是整个屏幕
    if (domNode) {
        // domNode画布所在的div，通过整个scene所在的容器来界定的
        let getBoundingClientRect = domNode.getBoundingClientRect(); // 方法返回元素的大小及其相对于视口的位置
        mouse.x = ((event.clientX - getBoundingClientRect.left) / domNode.offsetWidth) * 2 - 1;
        mouse.y = -((event.clientY - getBoundingClientRect.top) / domNode.offsetHeight) * 2 + 1;
    } else {
        // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
    rayCaster.setFromCamera(mouse, camera);
    // 返回射线选中的对象 第二个参数如果不填 默认是false，设置为true检测所有后代
    let intersects = rayCaster.intersectObjects(scene.children, true);
    //返回选中的对象数组
    return intersects;
}