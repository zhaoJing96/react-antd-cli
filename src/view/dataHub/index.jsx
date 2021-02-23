/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import THREE from '@/common/three';
import { getCanvasIntersects } from '@/common/utils/three'; // three自定义公共方法

let renderer, controls, scene, camera, composer, outlinePass;
let isComposer = false; // 是否组合渲染，现实选中高光效果
let delta = new THREE.Clock().getDelta();//getDelta()方法获得两帧的时间间隔

let modelUrl = require('@/assets/model/SJKPr.glb');
// let modelUrl = 'https://dhwork-sh.oss-cn-shanghai.aliyuncs.com/static/3d-model/SJK/SJKPr.glb';

// three.js加载3D 模型glb
export default function GltfModelPage() {
    const [modelData, setModelData] = useState(null); // 模型对象
    const box = useRef(); // canvas盒子
    // 设置灯光
    function setLight() {
        //- 添加平行光光源
        let lightTop = new THREE.DirectionalLight(0xffffff, 0.1);
        let lightBottom = new THREE.DirectionalLight(0xffffff, 0.1);
        let lightLeft = new THREE.DirectionalLight(0xffffff, 0.6);
        let lightRight = new THREE.DirectionalLight(0xffffff, 0.6);
        let lightBefore = new THREE.DirectionalLight(0xffffff, 0.6);
        let lightAfter = new THREE.DirectionalLight(0xffffff, 0.6);
        lightTop.position.set(4, 6, 4);
        lightBottom.position.set(4, -6, 4);
        lightLeft.position.set(5, 6, 0);
        lightRight.position.set(-5, 6, 0);
        lightBefore.position.set(-1, -1, -1);
        lightAfter.position.set(1, -1, 1);
        scene.add(lightTop);
        scene.add(lightBottom);
        scene.add(lightLeft);
        scene.add(lightRight);
        scene.add(lightBefore);
        scene.add(lightAfter);
        // 光源开启阴影
        lightTop.castShadow = true;
        lightTop.shadow.mapSize = new THREE.Vector2(1024, 1024);
        lightTop.shadow.bias = -0.001;
    }
    // 加载模型、存储模型初始颜色等参数
    function setGltfModel() {
        // 导入GlTF模型
        let gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(modelUrl, (gltf) => {
            gltf.scene.traverse(obj => {
                // 模型Mesh开启阴影
                if (obj.isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
                // 存储模型小零件初始颜色、位置、名称
                let modelObj = null;
                modelObj = {
                    name: obj.name,
                    color: obj.isMesh && obj.material.color,
                    posiX: obj.position.x,
                    posiY: obj.position.y,
                    posiZ: obj.position.z
                }
                obj.userData = { ...modelObj };
            });
            setModelData(gltf.scene);
            scene.add(gltf.scene);
            scene.position.y = -0.15;
        });
    }
    // 设置模型高亮选中
    function setComposer(width, height) {
        // 设置高亮
        composer = new THREE.EffectComposer(renderer); // 配置composer
        let renderPass = new THREE.RenderPass(scene, camera); // 配置通道
        composer.addPass(renderPass); // 将通道加入composer
        outlinePass = new THREE.OutlinePass(new THREE.Vector2(width, height), scene, camera);
        outlinePass.visibleEdgeColor.set('#ffffff'); // 选中颜色
        outlinePass.edgeStrength = 2; // 强度
        outlinePass.edgeGlow = 1.5; // 边缘明暗度
        outlinePass.renderToScreen = true; // 设置这个参数的目的是马上将当前的内容输出
        composer.addPass(outlinePass);
        composer.selectedObjectEffect = function (objs) {
            let selectedObjects = [];
            selectedObjects.push(objs);
            outlinePass.selectedObjects = selectedObjects;
        }
    }
    // 渲染动画
    function renderFn() {
        requestAnimationFrame(renderFn);
        //控制器
        // controls.update(delta);
        THREE.TWEEN.update(); // 补间动画执行
        if (isComposer) {
            // 组合渲染器，渲染高亮
            composer.render(delta);
        } else {
            // 用相机渲染一个场景
            renderer.render(scene, camera);
        }
    }
    // 监听窗体变化、自适应窗体事件
    function onWindowResize() {
        let width = box.current.offsetWidth;
        let height = box.current.offsetHeight;
        camera.left = width / - 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = height / -2;
        // 更新相机投影矩阵，在相机任何参数被改变以后必须被调用
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    // 监听事件 窗体监听、点击事件监听
    useEffect(() => {
        // 监听窗体变化
        box && window.addEventListener('resize', onWindowResize, false);
        // 监听点击事件
        box.current.addEventListener('click', (event) => {
            let selectObj = getCanvasIntersects(event, box.current, camera, scene);
            if (selectObj && selectObj.length > 0) {
                isComposer = true;
                composer.selectedObjectEffect(selectObj[0].object);
            } else {
                isComposer = false;
            }
        });
    }, []);

    // 初始化环境、灯光、相机、渲染器
    useEffect(() => {
        scene = new THREE.Scene();
        // 添加光源
        setLight();
        // 加载模型
        setGltfModel();

        // let axisHelper = new THREE.AxesHelper();
        // scene.add(axisHelper);//坐标辅助线加入到场景中

        // 获取宽高设置相机和渲染区域大小
        let width = box.current.offsetWidth;
        let height = box.current.offsetHeight;
        let k = width / height;
        // 投影相机
        camera = new THREE.PerspectiveCamera(5, k, 0.1, 100);
        camera.position.set(1, 0, 6);
        camera.lookAt(scene.position);

        // 创建一个webGL对象
        renderer = new THREE.WebGLRenderer({
            //增加下面两个属性，可以抗锯齿
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height); // 设置渲染区域尺寸
        renderer.setClearColor(0x333333, 1); // 设置颜色透明度
        // 首先渲染器开启阴影
        renderer.shadowMap.enabled = true;
        box.current.appendChild(renderer.domElement);
        // 监听鼠标事件
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        // 高亮设置
        setComposer(width, height);
        // 渲染
        renderFn();
    }, []);

    return <div className='ui_dataHub_container'>
        <div className="ui_model_container" ref={box}></div>
    </div>;
}