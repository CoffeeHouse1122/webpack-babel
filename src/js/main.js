import "../css/style.css"

// axios
const $axios = axios.create({
  method: "post",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  timeout: 30000,
});

// request拦截器
$axios.interceptors.request.use(
  (config) => {

    if (
      config.method === "post" &&
      config.headers["Content-Type"] !== "multipart/form-data"
    ) {
      config.data = Qs.stringify(config.data);
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// respone拦截器
$axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let axiosFunc = {
  getPreCount: async function () {
    let res = await $axios.post("/api/yuyue/count");
    if (res.code == 0) {
      console.log(`预约人数：${res.data.num}`)
      let preCount = Math.floor(res.data.num / 10000);
      if(preCount >= 50) {
        $(".reached, .progress").addClass("cur")
      }
    }
  },
}

$(function () {
    // 首屏视频
    var isAndroid = navigator.userAgent.indexOf("Android") > -1 || navigator.userAgent.indexOf("Linux") > -1;
    var videoHTML;
    if (isAndroid) {
      videoHTML = ""
    } else {
      videoHTML = `<video src="./public/media/kv.mp4" id="videoKv" x5-video-player-type="h5" preload="metadata" playsinline="true" webkit-playsinline="true" x-webkit-airplay="true" x5-video-orientation="portraint" autoplay="" loop="" muted="muted" poster=""></video>`;
    }
    $(".videoBox").html(videoHTML);

    axiosFunc.getPreCount()
    
})