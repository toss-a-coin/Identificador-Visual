const mediaDevices = [
    {deviceId: '', kind: 'audioinput', label: '', groupId: '73976940b5ee5ec53d5d64bf7beed98398670d612591632e3ab27a98b4b21d11'},
    {deviceId: 'ef3a8074987db44146b18db1428dd8578950a0b4f7c6db8fa7e938272dfcfb12', kind: 'videoinput', label: 'WEB CAM (1b3f:1167)', groupId: '73976940b5ee5ec53d5d64bf7beed98398670d612591632e3ab27a98b4b21d11'},
    {deviceId: '50fc10cdbbd94d2271a0584690618b4938d54f18a704946000fe4004fd54aca0', kind: 'videoinput', label: 'USB2.0 HD UVC WebCam (13d3:56a2)', groupId: 'c6e05d15d772938c047d73f5d94f177053c151092cb6f39275fb2d48136fccdd'},
    {deviceId: '47bf8b2fbf2c383f599afd83073afdc9b013cf9eab1462a25aae4358603cf223', kind: 'videoinput', label: 'Streamlabs OBS Virtual Webcam', groupId: '8f352ba7028fa244ed848d6a7eee09a3f5959e8d7ede599aaca75179b611e154'},
    {deviceId: 'bb1cbdae7568882e1f0753cb9907713c05c43f4aafdc8b7edb49c14cc96551ac', kind: 'videoinput', label: 'OBS Virtual Camera', groupId: 'b1804f1ffc72cd716b20268a97bbfb3945c1e74'},
    {deviceId: '', kind: 'audiooutput', label: '', groupId: 'e158638513f027b89879b8ada3a296685bee8cd314d695b38bf6e7a886e9e93b'},
];
const resolution = {width:{min: 1280}, height:{ min: 720}};
const app = Vue.createApp({
    name: 'App',

    template: `
        <div>
            <div v-show="isLoading">
                <span>Loading ...</span>
            </div>

            <select v-model="deviceSelected">
                <option 
                v-for="videoDevice in videoDevices" 
                :value="videoDevice"
                >
                    {{videoDevice.label}}
                </option>
            </select>

            <div v-show="!isLoading && !isPhotoTaken">
                <video ref="camera"  with autoplay></video>
                <button class="btn" @click="takePhoto">Take Photo</button>
            </div>

            <div v-show="isPhotoTaken">
                <canvas ref="canvas" :width="width" :height="height" id="photoTaken"></canvas>
                <div class="canvas-btn">
                    <button  @click="reDoPhoto">Try Again</button>
                    <a id="downloadPhoto" download="my-photo.png">
                        <button  @click="downloadImg">Download </button>
                    </a>
                </div>
            </div>
        </div>
    `,

    data() {
        return {
            isCameraOpen: false,
            isLoading: true,
            isPhotoTaken: false,
            stream: null,
            videoDevices: null,
            deviceSelected: null,
            width: 1280,
            height: 720
        }
    },

    watch: {
        deviceSelected: {
            handler: function(value) {
                this.deviceSelected = value;
                this.createCameraElement();
            }
        }
    },

    methods: {
        getDevices(devicesInfo) {
            let tempDevices = [];
            for(let i in devicesInfo){
                if(devicesInfo[i].kind === 'videoinput')
                    tempDevices = [...tempDevices, devicesInfo[i]];
            }
            this.videoDevices = tempDevices;
        },

        createCameraElement() {
            this.isLoading = true;
            const constraints = {
				audio: false,
                video: {resolution, deviceId: this.deviceSelected ? {exact: this.deviceSelected} : undefined}
            };
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                this.isLoading = false;
                this.$refs.camera.srcObject = stream;
                this.stream = stream;
            })
            .catch(error => {
                alert("May the browser didn't support or there is some errors.");
            });
        },

        stopCameraStream() {
            let tracks = this.$refs.camera.srcObject.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
            this.$refs.camera.srcObject = null;
            this.isCameraOpen = false;
        },

        takePhoto() {
            if(!this.isPhotoTaken) {
                const FLASH_TIMEOUT = 50;
        
                setTimeout(() => {
                }, FLASH_TIMEOUT);
              }
              
              this.isPhotoTaken = true;
              
              const context = this.$refs.canvas.getContext('2d');
              context.drawImage(this.$refs.camera, 0, 0, this.width, this.height);
            //   this.stopCameraStream();
        },

        reDoPhoto() {
            this.isPhotoTaken = false;
        },

        downloadImg() {
            console.log("Hola mundo");
            const download = document.getElementById("downloadPhoto");
            const canvas = document.getElementById('photoTaken').toDataURL('image/png')
                .replace("image/png", "image/octet-stream");
            download.setAttribute("href", canvas);
        }
    },

    beforeMount() {
        // this.getDevices(mediaDevices);
        navigator.mediaDevices.enumerateDevices().then(this.getDevices());
    },

    mounted() {
        // this.$refs.canvas.clientWidth = this.$refs.camera.clientWidth;
        // this.$refs.canvas.clientHeight = this.$refs.camera.clientHeight;
        // navigator.mediaDevices.enumerateDevices().then();
        // this.createCameraElement();
    }
});
app.mount('#app');