const app = Vue.createApp({
    name: 'App',

    data() {
        return {
            isCameraOpen: false,
            isLoading: true,
            isPhotoTaken: false,
            stream: null,
            videoDevices: {},
            width: 1280,
            height: 720
        }
    },

    methods: {
        toggleCamera() {
            if(!this.isCameraOpen) {
                console.log("Opening Camera....");
                this.isCameraOpen = true;
                this.isPhotoTaken = false;
                this.createCameraElement();
            }
            else if(this.isCameraOpen) {
                console.log("Closing Camera....");
                this.isCameraOpen = false;
                this.stopCameraStream();
            }
        },

        getDevices(devicesInfo) {
            console.log(devicesInfo);
            // for(let i in devicesInfo){
            //     if(devicesInfo[i].kind === 'videoinput'){
            //         console.log(devicesInfo[i]);
            //         // this.videoDevices = {...this.videoDevices, devicesInfo[i]};
            //     }
            // }   
        },

        createCameraElement() {
            this.isLoading = true;
            const constraints = {
				audio: false,
                video: {
                    width: {
                      min: 1280,
                    },
                    height: {
                      min: 720,
                    }
                  }
			};
            navigator.mediaDevices
            .getUserMedia(constraints)
            .then(stream => {
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

    mounted() {
        // this.$refs.canvas.clientWidth = this.$refs.camera.clientWidth;
        // this.$refs.canvas.clientHeight = this.$refs.camera.clientHeight;
        navigator.mediaDevices.enumerateDevices().then(devices => console.log(devices));
        this.createCameraElement();
    }
});
app.mount('#app');