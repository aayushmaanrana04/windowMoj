<script lang="ts">
import {
    afterUpdate,
    onMount
} from "svelte";
import myWindow, {
    WindowSCreen,
    removeS
} from '$lib'
import {
    page
} from "$app/stores";
import {
    id,
    windowData
} from "$lib/store";

let data: any;
let instance;
let ss = '';
let ls = '';
let error = '';
let isVideo = false;
let isWindow = false;
let coordData = '0,0';
let h,w = 0;
let mx,my = 0;

let clear = $page.url.searchParams.has('clear');

async function getMedia() {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
        });
        const video = document.querySelector("video");
        if (video) {
            isVideo = true;
            video.width = window.screen.availWidth;
            video.height = window.screen.availHeight;
            // video?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
            };

            setInterval(() => {
                updateVideo()
            }, 10)

            // video ? .setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
        } else {
            throw "error with video element"
        }
        /* use the stream */
    } catch (err) {
        error = err;
        /* handle the error */
    }
}

onMount(async () => {
    isWindow = true;
    // data = new myWindow();   
    instance = new WindowSCreen();
    instance.setWindowData({
        screenX,
        screenY,
        monitorHeight: screen.availHeight,
        monitorWidth: screen.availWidth,
        height: innerHeight,
        width: innerWidth,
    })

    ss = String(sessionStorage.getItem('winId'));
    ls = String(localStorage.getItem('windows'));

    setInterval(() => {
        update()
    }, 1000)
    // addEventListener('resize',()=>console.log('fired'))

    // await getMedia();
    if (clear) {
        removeS();
    }
});

const update = () => {
    if (isWindow) {
        const svg = document.querySelector("svg");
        svg?.setAttribute('viewBox', `0 0 ${window.screen.availWidth} ${window.screen.availHeight}`);
        svg ?.setAttribute('height', `${screen.availHeight}`);
        svg ?.setAttribute('width', `${screen.availWidth}`);
        h = screen.availHeight;
        w = screen.availWidth;

        svg ?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
        instance.update({
            screenLeft,
            screenTop,
            monitorHeight: screen.availHeight,
            monitorWidth: screen.availWidth,
            height:innerHeight,
            width: innerWidth,
        })
        if(localStorage.getItem('windows')){

            console.table(JSON.parse(String(localStorage.getItem('windows'))))
        }

        getAllPos();

    }
}

const updateVideo = () => {
    if (isWindow) {
        if (isVideo) {
            const video = document.querySelector("video");
            video ?.setAttribute('style', `transform: translate(-${window.screenX}px, -${window.screenY}px)`);
            console.log('run')
        }
    }
}

const getAllPos = () => {
    if (localStorage.getItem('windows')) {

        let data = JSON.parse(String(localStorage.getItem('windows')));
        let coords = '';
        data.forEach(element => {
            let pos = {
                x: 0,
                y: 0
            };
            pos.x = element.screenLeft + element.width/2;
            pos.y = element.screenTop + element.height/2;
            coords += `${pos.x},${pos.y} `
        });

        coordData = coords;
    }
}
</script>

<div style='position:relative;z-index:20'>

    <span>{error}</span>
    <br/>
    <span>windowId:{instance?.id}</span>
    <br/>
    <span>windowData:{JSON.stringify(instance?.windowData)}</span>
    <br/>
    <span>{coordData}</span>
    <button on:click={removeS}>clear</button>
    <button on:click={update}>update</button>
</div>
<!-- <video class="videoElement"></video> -->

<svg height={h} width={w} style="border:1px solid black; background:red; z-index:0">
    <!-- Replace these coordinates with your desired points -->
    <polyline points={coordData} stroke-width='20px' stroke="black" fill="none" />
    <line x1="0" y1="0" x2="2000" y2="2000" style="stroke:rgb(255,0,0);stroke-width:2;" />
</svg>
