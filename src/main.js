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

// 弹窗
let dialog = {
  lock: false,
  close: function () {
    $(".mask").removeClass("on");
    $(".dialog").removeClass("zoomIn").addClass("zoomOut");
    setTimeout(() => {
      this.lock = false;
      $(".dialog").removeClass("on zoomOut");
    }, 300);
  },
  show: function (type) {
    if (this.lock) return;
    this.lock = true;
    $(".mask").addClass("on");
    $(`.${type}`).addClass("on zoomIn");
  },
};

let commonFunc = {
  bgParallax: function (scrollTop) {
    if (scrollTop <= $(".bg-4").offset().top) {
      return;
    }
    let scrollDistance = scrollTop - $(".bg-4").offset().top;
    var scrollVal = -Math.floor(scrollDistance * 1.1);
    $(".bg-4-num").css({
      "-webkit-transform": "translate3d(0px, " + scrollVal + "px, 0px)",
      transform: "translate3d(0px, " + scrollVal + "px, 0px)",
    });
  },
  tectosomeEnter: function (index) {
    let arr = [0, 1, 2, 3, 4];
    arr.forEach(function (item) {
      if (item < index) {
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".s2-tectosomeContent")
          .addClass("hover-right");
      } else if (item > index) {
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".s2-tectosomeContent")
          .addClass("hover-left");
      } else {
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".s2-tectosomeContent")
          .addClass("hover-active");
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".name")
          .addClass("nameAniClass");
      }
    });
  },
  tectosomeLeave: function (index) {
    let arr = [0, 1, 2, 3, 4];
    arr.forEach(function (item) {
      if (item < index) {
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".s2-tectosomeContent")
          .removeClass("hover-right");
      } else if (item > index) {
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".s2-tectosomeContent")
          .removeClass("hover-left");
      } else {
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".s2-tectosomeContent")
          .removeClass("hover-active");
        $(".s2-tectosomeContainer li")
          .eq(item)
          .find(".name")
          .removeClass("nameAniClass");
      }
    });
  },
  getQueryString: function (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  preNumShow: function (count) {
    count = count.toString();
    let countLen = count.length;
    if (countLen < 6) {
      for (let i = 0; i < 6 - countLen; i++) {
        count = "0" + count;
      }
    }
    let countArr = count.split("");
    for (let i = 0; i < countArr.length; i++) {
      countArr[i] = "num" + countArr[i];
    }
    [].slice.call($(".s1-num")).forEach(function (item, index) {
      $(item)
        .removeClass(function (index, oldclass) {
          return (oldclass.match(/(^|\s)num\S+/g) || []).join(" ");
        })
        .addClass(countArr[index]);
    });
    [].slice.call($(".s3-num")).forEach(function (item, index) {
      $(item)
        .removeClass(function (index, oldclass) {
          return (oldclass.match(/(^|\s)num\S+/g) || []).join(" ");
        })
        .addClass(countArr[index]);
    });
  },
  preNumAni: function (finalNum, totalTime, speed) {
    let curNum = 0;
    let addNum = Math.ceil(finalNum / (totalTime / speed));
    let timer = setInterval(() => {
      curNum += addNum;
      if (curNum >= finalNum) {
        curNum = finalNum;
        clearInterval(timer);
      }
      this.preNumShow(curNum);
    }, speed);
  },
};

let isShare = false;
let isLogin = false;
let preorderCount = 0
let axiosFunc = {
  login: async function (isShare, mail, from_uid) {
    let res = await $axios.post("/yuyue/login", {
      mail: mail,
      from_uid: from_uid,
    });

    if (res.code == 0 && !isShare) {
      dialog.show("dialog-success");
      isLogin = true;
      localStorage.setItem("isLogin", isLogin);
      preorderCount = Number(preorderCount) + 1
      if(preorderCount > 999999) {
        preorderCount = 999999
      }
      commonFunc.preNumShow(preorderCount)
    } else if (res.code == 0 && isShare) {
      isLogin = true;
      this.getShareLink();
      localStorage.setItem("isLogin", isLogin);
      preorderCount = Number(preorderCount) + 1
      if(preorderCount > 999999) {
        preorderCount = 999999
      }
      commonFunc.preNumShow(preorderCount)
    } else if (res.code == 203 && !isShare) {
      dialog.show("dialog-success");
      isLogin = true;
      localStorage.setItem("isLogin", isLogin);
    } else if (res.code == 203 && isShare) {
      isLogin = true;
      this.getShareLink();
      localStorage.setItem("isLogin", isLogin);
    } else if (res.code == 202) {
      alert("正しいメールアドレスを入力してください。");
    } else {
      alert("error");
    }
  },
  getShareLink: async function () {
    let res = await $axios.post("/yuyue/sharelink");
    if (res.code == 0) {
      isShare = true;
      let invite_link =
      location.origin + location.pathname + "?from_uid=" + res.data.from_uid;
      $(".share-input").val(invite_link);
      localStorage.setItem("invite_link", invite_link);
      dialog.close();
      setTimeout(function () {
        dialog.show("dialog-share");
      }, 500);
    } else {
      alert("error");
    }
  },
  getPreCount: async function () {
    let res = await $axios.post("/yuyue/count");
    if (res.code == 0) {
      let preNumArr = [0, 5, 10, 20, 30, 50];
      let preCount = Math.floor(res.data.num / 10000);
      for (var i = preNumArr.length - 1; i >= 0; i--) {
        if (preCount >= preNumArr[i]) {
          $(".s3-progress-0, .s3-progress-1").addClass(
            `reached-${preNumArr[i]}w`
          );
          break;
        }
      }
      preNumArr.forEach(function (item, index) {
        if (index != 0) {
          if (preCount >= item) {
            $(".s3-reward")
              .eq(index - 1)
              .addClass("reached");
          }
        }
      });
      preorderCount = res.data.num > 999999 ? 999999 : res.data.num
      return preorderCount;
    }
  },
  pv: async function (from_uid) {
    let res = await $axios.post("/yuyue/pv", {
      from_uid: from_uid,
    });
    if(res.code) {
      console.log("pv")
    }
  }
};

$(function () {
  // 动态交互
  axiosFunc.getPreCount().then(function (res) {
    setTimeout(function (param) {
      commonFunc.preNumAni(res, 3000, 50);
    }, 1000);
  });

  let mail = "";
  let from_uid = commonFunc.getQueryString("from_uid") || 0;

  axiosFunc.pv(from_uid)

  if (localStorage.getItem("invite_link")) {
    isShare = true;
    $(".share-input").val(localStorage.getItem("invite_link"));
  }
  if(localStorage.getItem("isLogin")) {
    isLogin = true
  }
  $(".s2-getbtn").click(function () {
    dialog.show("dialog-preways");
  });

  $(".s3-email, .preways-mail, .s7-mail").click(function () {
    if (isShare) {
      dialog.close();
      setTimeout(function(){
        dialog.show("dialog-share");
      }, 500)
      return;
    }
    if (isLogin) {
      dialog.close();
      setTimeout(function(){
        dialog.show("dialog-success");
      }, 500)
      return;
    }
    dialog.close();
    setTimeout(function () {
      dialog.show("dialog-mail");
    }, 500);
  });
  
  $(".mail-preBtn").click(function () {
    mail = $.trim($(".mail-input").val());
    if (!mail) {
      alert("メールアドレスを入力してください。");
      return;
    }
    let reg = new RegExp(/^([\s\S]+)@([\s\S]+)$/i);
    if (!reg.test(mail)) {
      alert("正しいメールアドレスを入力してください。");
      return;
    }
    $(".comfirm-mail").html(mail);
    dialog.close();
    setTimeout(function () {
      dialog.show("dialog-comfirm");
    }, 500);
  });

  $(".comfirm-no").click(function () {
    dialog.close();
    setTimeout(function () {
      dialog.show("dialog-mail");
    }, 500);
  });

  $(".comfirm-yes").click(function () {
    dialog.close();
    setTimeout(function () {  
      axiosFunc.login(isShare, mail, from_uid);
    }, 500)
  });

  $(".s4-inviteBtnBox").click(function () {
    if (isShare) {
      dialog.show("dialog-share");
      return;
    }
    if (isLogin) {
      axiosFunc.getShareLink();
    } else {
      dialog.show("dialog-pretips");
    }
  });

  $(".pretips-mail").click(function (param) {
    dialog.close();
    setTimeout(function () {
      dialog.show("dialog-mail");
      isShare = true;
    }, 500);
  });

  $(".dialog-mail .dialog-close, .dialog-comfirm .dialog-close").click(
    function () {
      isShare = false;
    }
  );

  // 分享
  $(".share-twshare").click(function () {
    let twTitle = "超爽快本格3DアクションRPG『パニシング：グレイレイヴン』事前登録受付中！戦友とともに、人類の終焉に立ち向かう旅へ踏み出そう！iPhone 11 Pro Maxや公式グッズがもらえる抽選キャンペーン好評開催中！今すぐ予約しよう！ #パニグレ #事前登録 #戦友招待キャンペーン ";
    let twUrl;
    if (localStorage.getItem("invite_link")) {
      twUrl = localStorage.getItem("invite_link");
    } else {
      twUrl = location.origin + location.pathname;
    }
    let shareURL = `http://twitter.com/intent/tweet?text=${encodeURIComponent(
      twTitle
    )}${encodeURIComponent(twUrl)}`;

    // window.location.href = shareURL;
    window.open(shareURL)
  });

  $(".sidebar-licia").click(function () {
    let twTitle = "超爽快本格3DアクションRPG『パニシング：グレイレイヴン』事前登録受付中！今すぐ予約すると、リリース後にSクラス構造体、限定塗装や意識など、豪華な報酬がもらえる！さらに戦友招待キャンペーンに参加してiPhone 11 Pro Maxやグッズをゲットしよう！#パニグレ #事前登録 ";
    let twUrl = location.origin + location.pathname;
    let shareURL = `http://twitter.com/intent/tweet?text=${encodeURIComponent(
      twTitle
    )}${encodeURIComponent(twUrl)}`;

    // window.location.href = shareURL;
    window.open(shareURL)
  });


  // 静态交互
  // 世界观视差
  let scene = $("#scene").get(0);
  let parallaxInstance = new Parallax(scene);

  // 视差背景
  window.addEventListener("scroll", function () {
    let scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    commonFunc.bgParallax(scrollTop);
  });

  // 左侧导航
  $(".nav-rightbar-bg, .nav-switch").click(function () {
    if ($(".nav-switch").hasClass("cur")) {
      $(
        ".nav-switch,.sidebar-nav, .nav-line, .nav-logo, .sidebar-nav ul li,.nav-goHome "
      ).removeClass("cur");
    } else {
      $(
        ".nav-switch,.sidebar-nav, .nav-line, .nav-logo, .sidebar-nav ul li,.nav-goHome "
      ).addClass("cur");
    }
  });

  $(".sidebar-nav ul li").click(function () {
    let index = Number($(this).index());
    let targetArr = $(".target").toArray();
    let distance = Math.floor($(targetArr[index]).offset().top - 10);
    $("body,html").animate({ scrollTop: distance }, 500);
  });

  // 构造体交互
  $(".s2-move li").hover(
    function (param) {
      let index = Number($(this).index());
      if (
        $(".s2-tectosomeContainer li").eq(index).hasClass("select") ||
        $(".s2-tectosomeContainer li").eq(index).hasClass("noselect")
      ) {
        return false;
      }
      commonFunc.tectosomeEnter(index);
    },
    function () {
      let index = Number($(this).index());
      if (
        $(".s2-tectosomeContainer li").eq(index).hasClass("select") ||
        $(".s2-tectosomeContainer li").eq(index).hasClass("noselect")
      ) {
        return false;
      }
      commonFunc.tectosomeLeave(index);
    }
  );

  $(".s2-move li").click(function (event) {
    let index = Number($(this).index());
    if (
      $(".s2-tectosomeContainer li").eq(index).hasClass("select") ||
      $(".s2-tectosomeContainer li").eq(index).hasClass("noselect")
    ) {
      return;
    }
    $(".s2-title").removeClass("fadeInDown").addClass("fadeOutUp");
    $(".s2-subtitle").removeClass("fadeInLeft").addClass("fadeOutLeft");
    $(".bgBox .bg-2 .bg-page2").addClass("select");
    commonFunc.tectosomeLeave(index);
    $(".s2-tectosomeContainer li")
      .eq(index)
      .addClass("select")
      .siblings()
      .addClass("noselect");
    $(".s2-tectosomeContainer li")
      .eq(index)
      .find(".teamlogo")
      .removeClass("fadeOutUp")
      .show()
      .addClass("fadeInDown");
    $(".s2-tectosomeContainer li")
      .eq(index)
      .find(".introduction")
      .removeClass("fadeOutRight")
      .show()
      .addClass("fadeInLeft");
    $(".s2-tectosomeContainer li")
      .eq(index)
      .find(".cvslogan")
      .removeClass("flipOutY")
      .show()
      .addClass("flipInY");
  });

  $(".s2-tectosomeContainer li .s2-close").click(function (event) {
    let _this = $(".select");
    $(".select")
      .find(".teamlogo")
      .removeClass("fadeInDown")
      .addClass("fadeOutUp");
    $(".select")
      .find(".introduction")
      .removeClass("fadeInLeft")
      .addClass("fadeOutRight");
    $(".select").find(".cvslogan").removeClass("flipInY").addClass("flipOutY");
    $(".select").removeClass("select");
    $(".bgBox .bg-2 .bg-page2").removeClass("select");
    setTimeout(() => {
      $(_this).find(".teamlogo").hide();
      $(_this).find(".introduction").hide();
      $(_this).find(".cvslogan").hide();
      $(_this).siblings().removeClass("noselect");
      $(".s2-title").removeClass("fadeOutUp").addClass("fadeInDown");
      $(".s2-subtitle").removeClass("fadeOutLeft").addClass("fadeInLeft");
    }, 300);
  });

  // page4 - more
  $(".s4-more").click(function (param) {
    dialog.show("dialog-rules3")
  });

  $(".s2-attentionbtn").click(function () {  
    dialog.show("dialog-rules1")
  })

  $(".s3-attention").click(function () {  
    dialog.show("dialog-rules2")
  })

  // tw内嵌页
  var timeLine =
    '<a class="twitter-timeline" data-lang="ja" data-width="100%" data-height="100%" data-chrome="noheader noborders noscrollbar transparent" href="https://twitter.com/punigray_staff">Tweets by LastElysion_pr</a>';
  $(".s6-tw").html(timeLine);

  // 回到顶部
  $(".footer-gotop").click(function () {
    $(".footer-gotop-heart")
      .addClass("gotopAni")
      .find("img")
      .addClass("floatAni");
    $("body,html").animate({ scrollTop: 0 }, 500, "linear", function () {
      $(".footer-gotop-heart")
        .removeClass("gotopAni")
        .find("img")
        .removeClass("floatAni");
    });
  });

  // 弹窗 - wv
  $(".s5-wv").click(function () {
    let index = Number($(this).attr("data-id"));
    dialog.show(`dialog-wv${index}`);
  });

  // 弹窗 - 关闭
  $(".dialog-close").click(function () {
    dialog.close();
  });

  $(".dialog-video .dialog-close").click(function () {
    $(".dialog-video video").attr("src", "");
    dialog.close();
  });

  $(".dialog-iframe .dialog-close").click(function () {
    $(".dialog-iframe iframe").attr("src", "");
    dialog.close();
  });

  // 弹窗 - 技能视频
  $(".skillBox").click(function () {
    let vUrl = $(this).attr("data-v");
    $(".dialog-video video").attr("src", vUrl);
    dialog.show("dialog-video");
  });

  // 弹窗 - iframe视频
  $(".s1-playBtn").click(function () {
    let vUrl = $(this).attr("data-v");
    $(".dialog-iframe iframe").attr("src", vUrl);
    dialog.show("dialog-iframe");
  });

  // 复制
  var clipboard1 = new ClipboardJS(".share-copyBtn");
  clipboard1.on("success", function (e) {
    e.clearSelection();
    alert("コピー成功");
  });
});
