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

// 公共方法
let commonFun = {
  timestampToTime: function () {
    let date = new Date();
    let Y = date.getFullYear() + ".";
    let M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + ".";
    let D = date.getDate() + " ";
    let h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    let m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    let s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return h + m + s;
  },
};

// 整屏
let fullPageFunc = {
  curIndex: 0,
  flag: false,
  pageHeightArr: [],
  sidebarStatus: true,
  wvFlag: false,
  init: function () {
    this.getPageHeight();
    this.noAniSlideToEvent(this.curIndex);
    this.mousewheelEvent();
    this.keydownEvent();
    modulesFun.sidebarShow();
  },
  getPageHeight: function () {
    this.pageHeightArr = [];
    let _this = this;
    $(".home-page").each(function (index, item) {
      if (!_this.pageHeightArr.length) {
        _this.pageHeightArr.push($(".wrapper").height() - $(item).height());
      } else {
        _this.pageHeightArr.push(
          _this.pageHeightArr[index - 1] - $(item).height()
        );
      }
    });
    // console.log(this.pageHeightArr);
  },
  slideToEvent: function (activeIndex) {
    this.curIndex = activeIndex;
    $(".home-wrap").css({
      transform: `translate3d(0px, ${this.pageHeightArr[activeIndex]}px, 0px)`,
      webkitTransform: `translate3d(0px, ${this.pageHeightArr[activeIndex]}px, 0px)`,
      transition: "all 0.4s ease-in-out 0s",
    });
    this.slideChangeEndEvent(activeIndex);
  },
  noAniSlideToEvent: function (activeIndex) {
    this.curIndex = activeIndex;
    $(".home-wrap").css({
      transform: `translate3d(0px, ${this.pageHeightArr[activeIndex]}px, 0px)`,
      webkitTransform: `translate3d(0px, ${this.pageHeightArr[activeIndex]}px, 0px)`,
      transition: "none",
    });
    this.slideChangeEndEvent(activeIndex);
  },
  slideChangeEndEvent: function (activeIndex) {
    this.curIndex = activeIndex;
    $(`.menuMain ul li:nth-child(${activeIndex + 1})`)
      .addClass("cur")
      .siblings()
      .removeClass("cur");
    $(`.sidebar-box .my-bullet:nth-child(${activeIndex + 1})`)
      .addClass("active")
      .siblings()
      .removeClass("active");
    modulesFun.sidebarShow();

    // 世界观部分滚动优化
    if (activeIndex == 2) {
      setTimeout(function (param) {
        modulesFun.enter();
        $(".swiper-container-wv").addClass("cur");
      }, 400);
    } else {
      modulesFun.exit();
      setTimeout(function (param) {
        $(".swiper-container-wv").removeClass("cur");
      }, 500);
    }

    if (!this.wvFlag && activeIndex == 2) {
      $(".page3-guide").show();
      $(".page3-guide").on("click", function (event) {
        event.preventDefault();
        $(".page3-guide").hide();
      });
      setTimeout(function () {
        $(".guide-icon").removeClass("ani_scroll_l").addClass("ani_scroll_r");
        fullPageFunc.wvFlag = true;
      }, 3000);

      setTimeout(function () {
        $(".page3-guide").hide();
        fullPageFunc.wvFlag = true;
      }, 6000);
    }
  },
  mousewheelEvent: function () {
    let _this = this;
    document.body.onmousewheel = function (event) {
      event = event || window.event;
      if (_this.flag) {
        return;
      }
      _this.flag = true;
      console.log("onmousewheel");
      console.log(_this.curIndex);
      if (event.wheelDelta) {
        if (event.wheelDelta < 0) {
          _this.curIndex++;
          if (_this.curIndex >= 5) {
            _this.curIndex = 5;
          }
        } else {
          _this.curIndex--;
          if (_this.curIndex <= 0) {
            _this.curIndex = 0;
          }
        }
      }
      _this.slideToEvent(_this.curIndex);
      setTimeout(function () {
        _this.flag = false;
      }, 500);
    };
    document.body.addEventListener("DOMMouseScroll", function (event) {
      event = event || window.event;
      if (_this.flag) {
        return;
      }
      _this.flag = true;
      console.log("DOMMouseScroll");
      console.log(_this.curIndex);
      if (event.detail) {
        if (event.detail > 0) {
          _this.curIndex++;
          if (_this.curIndex >= 5) {
            _this.curIndex = 5;
          }
        } else {
          _this.curIndex--;
          if (_this.curIndex <= 0) {
            _this.curIndex = 0;
          }
        }
      }
      _this.slideToEvent(_this.curIndex);
      setTimeout(function () {
        _this.flag = false;
      }, 500);
    });
  },
  keydownEvent: function () {
    let _this = this;
    document.onkeydown = function (event) {
      var e = event || window.event || arguments.callee.caller.arguments[0];
      if (_this.flag) {
        return;
      }
      _this.flag = true;
      if ((e && e.keyCode == 38) || (e && e.keyCode == 37)) {
        _this.curIndex--;
        if (_this.curIndex <= 0) {
          _this.curIndex = 0;
        }
        _this.slideToEvent(_this.curIndex);
      }

      if ((e && e.keyCode == 40) || (e && e.keyCode == 39)) {
        _this.curIndex++;
        if (_this.curIndex >= 5) {
          _this.curIndex = 5;
        }
        _this.slideToEvent(_this.curIndex);
      }

      setTimeout(function () {
        _this.flag = false;
      }, 500);
    };
  },
};

// 模块方法
let modulesFun = {
  wvAniClassArr: [
    ["fadeOutLeft", "fadeInLeft"],
    ["fadeOutRight", "fadeInRight"],
    ["fadeOutRight", "fadeInRight"],
    ["fadeOutLeft", "fadeInLeft"],
    ["fadeOutLeft", "fadeInLeft"],
    ["fadeOutRight", "fadeInRight"],
    ["fadeOutLeft", "fadeInLeft"],
  ],
  exit: function (curIndex) {
    this.wvAniClassArr.forEach(function (item, index) {
      if (index + 1 != curIndex) {
        $(`.wv-item${index + 1}`)
          .removeClass(item[1])
          .addClass(item[0]);
      }
    });
    $(`.wv-item${curIndex}`).removeClass("fadeIn").addClass("fadeOut");
    $(".fd-title, .fs-title").removeClass("fadeInDown").addClass("fadeOutUp");
    $(".swiper-pagination-wv").removeClass("fadeInUp").addClass("fadeOutDown");
  },
  enter: function (curIndex) {
    this.wvAniClassArr.forEach(function (item, index) {
      if (index + 1 != curIndex) {
        $(`.wv-item${index + 1}`)
          .removeClass(item[0])
          .addClass(item[1]);
      }
    });
    $(`.wv-item${curIndex}`).removeClass("fadeOut").addClass("fadeIn");
    $(".fd-title, .fs-title").removeClass("fadeOutUp").addClass("fadeInDown");
    $(".swiper-pagination-wv").removeClass("fadeOutDown").addClass("fadeInUp");
  },
  wvOpenDialog: function (curIndex) {
    $(".page3-dialogBox").addClass("on");
    $(`.page3-dialog-wv${curIndex}`).addClass("zoomIn on");
  },
  wvCloseDialog: function (curIndex) {
    $(`.page3-dialog-wv${curIndex}`).removeClass("zoomIn").addClass("zoomOut");
    setTimeout(() => {
      $(`.page3-dialog-wv${curIndex}`).removeClass("zoomOut on");
      $(".page3-dialogBox").removeClass("on");
    }, 300);
  },
  recordOpen: function (name) {
    $(`.tectosome-record-${name} .record-next`).hide();
    $(`.tectosome-record-${name}`).addClass("on");
    $(`.tectosome-record-${name} .record-top`)
      .stop()
      .animate(
        {
          width: "4.7rem",
        },
        500,
        function () {
          $(
            `.tectosome-record-${name} .record-prev, .tectosome-record-${name} .record-close`
          ).show();
          $(`.tectosome-record-${name} .record-con`).show(400);
        }
      );
  },
  recordClose: function (name) {
    $(
      `.tectosome-record-${name} .record-prev, .tectosome-record-${name} .record-close`
    ).hide();
    $(`.tectosome-record-${name} .record-con`).hide();
    $(`.tectosome-record-${name} .record-top`)
      .stop()
      .animate(
        {
          width: "0",
        },
        500,
        function () {
          $(`.tectosome-record-${name} .record-next`).show();
          $(`.tectosome-record-${name}`).removeClass("on");
        }
      );
  },
  sidebarShow: function () {
    // 侧边栏和菜单栏显示问题
    if (document.body.clientWidth > 1600) {
      if (fullPageFunc.curIndex == 0) {
        $(".menuBox").show();
        if (fullPageFunc.sidebarStatus) {
          $(".sidebar-box").removeClass("cur");
        } else {
          $(".sidebar-open").removeClass("cur");
        }
      } else {
        $(".menuBox").hide();
        if (fullPageFunc.sidebarStatus) {
          $(".sidebar-box").addClass("cur");
        } else {
          $(".sidebar-open").addClass("cur");
        }
      }
    } else {
      $(".menuBox").show();
      if (fullPageFunc.sidebarStatus) {
        $(".sidebar-box").removeClass("cur");
      } else {
        $(".sidebar-open").removeClass("cur");
      }
    }
  },
};

$(function () {
  // 首页 - 整屏初始化
  fullPageFunc.init();

  window.onresize = function () {
    fullPageFunc.init();
    $(".page5-bg-wallpaper").css("width", $(".page5").width());
    modulesFun.sidebarShow();

    // 动画更新
    $(".page1-qrcode").removeClass("qrcodeAni");
    $(".page1-scroll").removeClass("scrollAni");
    setTimeout(function () {
      $(".page1-qrcode").addClass("qrcodeAni");
      $(".page1-scroll").addClass("scrollAni");
    }, 300);
  };

  fullPageFunc.noAniSlideToEvent(0);

  // 首页 - 首屏时间
  $(".rec-time").html(commonFun.timestampToTime());
  setInterval(function () {
    $(".rec-time").html(commonFun.timestampToTime());
  }, 1000);

  // 首页 - 文章轮播图
  let swiper_news = new Swiper(".swiper-container-news", {
    observer: true,
    observeParents: true,
    observeSlideChildren: true,
    autoplay: {
      disableOnInteraction: false,
      delay: 5000,
    },
    updateOnWindowResize: true,
    loop: true,
    pagination: {
      el: ".swiper-pagination-news",
    },
  });

  // 首页 - 文章切换
  $(".page2-news-tagBox li").click(function () {
    let index = Number($(this).index());
    $(this).addClass("cur").siblings().removeClass("cur");
    $(".page2-news-conBox ul")
      .eq(index)
      .addClass("cur")
      .siblings()
      .removeClass("cur");
  });

  // 首页 - 构造体轮播图
  let swiper_tectsome = new Swiper(".swiper-container-tectosome", {
    effect: "fade",
    loop: true,
    navigation: {
      nextEl: ".tectosome-next",
      prevEl: ".tectosome-prev",
    },
    thumbs: {
      swiper: {
        el: ".swiper-container-tectosome-thumbs",
        slidesPerView: 4,
        loop: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
      },
    },
    on: {
      slideChangeTransitionStart: function () {
        $("#page4-cv").attr("src", "");
      },
    },
  });

  // 首页 - 构造体个人档案
  $(".record-tag").click(function () {
    let name = $(this).attr("data-name");
    modulesFun.recordOpen(name);
  });

  $(".record-close").click(function () {
    let name = $(this).attr("data-name");
    modulesFun.recordClose(name);
  });

  $(".tectosome-record").hover(
    function () {
      swiper_tectsome.allowTouchMove = false;
    },
    function () {
      swiper_tectsome.allowTouchMove = true;
    }
  );

  // 首页 - 构造体cv播放
  $(".tectosome-cv").click(function () {
    let cvSrc = $(this).attr("data-src");
    $("#page4-cv").attr("src", cvSrc);
    $("#page4-cv")[0].play();
  });

  $(".tectosome-cv").hover(
    function () {
      swiper_tectsome.allowTouchMove = false;
    },
    function () {
      swiper_tectsome.allowTouchMove = true;
    }
  );

  // 首页 - 画廊背景宽度
  $(".page5-bg-wallpaper").css("width", $(".page5").width());

  // 首页 - 画廊移入效果
  $(".page5-w-min").hover(
    function () {
      $(this).addClass("cur");
      $(this).siblings().addClass("other");
    },
    function () {
      $(this).removeClass("cur");
      $(this).siblings().removeClass("other");
    }
  );

  // 首页 - 画廊轮播图
  let swiper_wallpager = new Swiper(".swiper-container-wallpager", {
    effect: "fade",
    loop: true,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: ".wallpager-next",
      prevEl: ".wallpager-prev",
    },
    thumbs: {
      swiper: {
        el: ".swiper-container-wallpager-thumbs",
        slidesPerView: 5,
        spaceBetween: 10,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        observer: true,
        observeParents: true,
      },
    },
  });

  // 首页 - 视频轮播图
  let swiper_video = new Swiper(".swiper-container-video-thumbs", {
    slidesPerView: 5,
    spaceBetween: 10,
    loop: true,
    slideToClickedSlide: true,
    centeredSlides: true,
    observer: true,
    observeParents: true,
    navigation: {
      nextEl: ".video-next",
      prevEl: ".video-prev",
    },
    on: {
      slideChangeTransitionStart: function () {
        let curSrc = $(
          ".swiper-container-video-thumbs .swiper-slide-active span"
        ).attr("data-src");
        $(".page5-video-screen iframe").attr("src", curSrc);
      },
    },
  });

  // 首页 - 壁纸进退场动画
  $(".page5-w-min").click(function () {
    let index = Number($(this).attr("data-id"));
    swiper_wallpager.slideToLoop(index);
    $(".page5-bg-wallpaperBox").addClass("on");
    $(".page5-wallpaperBox .page5-title").addClass("cur");
    $(".page5-wallpaperBox .page5-icon, .page5-wallpaperCon")
      .removeClass("fadeInLeftBig")
      .addClass("fadeOutLeftBig");
    $(
      ".page5-videoBox .page5-title, .page5-videoBox .page5-icon, .page5-videoCon"
    )
      .removeClass("fadeInRightBig")
      .addClass("fadeOutRightBig");
    $(".page5-wallpager-detailBox")
      .removeClass("fadeOutDownBig")
      .addClass("fadeInUpBig");
  });

  $(".page5-wallpager-detailBox .page5-close").click(function () {
    $(".page5-bg-wallpaperBox").removeClass("on");
    $(".page5-wallpaperBox .page5-title").removeClass("cur");
    $(".page5-wallpaperBox .page5-icon, .page5-wallpaperCon")
      .removeClass("fadeOutLeftBig")
      .addClass("fadeInLeftBig");
    $(
      ".page5-videoBox .page5-title, .page5-videoBox .page5-icon, .page5-videoCon"
    )
      .removeClass("fadeOutRightBig")
      .addClass("fadeInRightBig");
    $(".page5-wallpager-detailBox")
      .removeClass("fadeInUpBig")
      .addClass("fadeOutDownBig");
  });

  // 首页 - 视频进退场动画
  $(".page5-v-min").click(function () {
    let index = Number($(this).attr("data-id"));
    swiper_video.slideToLoop(index);
    $(".page5-bg-wallpaperBox").addClass("off");
    $(".page5-videoBox .page5-title").addClass("cur");
    $(
      ".page5-wallpaperBox .page5-title, .page5-wallpaperBox .page5-icon, .page5-wallpaperCon"
    )
      .removeClass("fadeInLeftBig")
      .addClass("fadeOutLeftBig");
    $(".page5-videoBox .page5-icon, .page5-videoCon")
      .removeClass("fadeInRightBig")
      .addClass("fadeOutRightBig");
    $(".page5-video-detailBox")
      .removeClass("fadeOutDownBig")
      .addClass("fadeInUpBig");
  });

  $(".page5-video-detailBox .page5-close").click(function () {
    $(".page5-bg-wallpaperBox").removeClass("off");
    $(".page5-videoBox .page5-title").removeClass("cur");
    $(
      ".page5-wallpaperBox .page5-title, .page5-wallpaperBox .page5-icon, .page5-wallpaperCon"
    )
      .removeClass("fadeOutLeftBig")
      .addClass("fadeInLeftBig");
    $(".page5-videoBox .page5-icon, .page5-videoCon")
      .removeClass("fadeOutRightBig")
      .addClass("fadeInRightBig");
    $(".page5-video-detailBox")
      .removeClass("fadeInUpBig")
      .addClass("fadeOutDownBig");
    $(".page5-video-screen iframe").attr("src", "");
  });

  // 首页 - iframe视频弹窗
  $(".page1-playBtn").click(function () {
    let vUrl = $(this).attr("data-url");
    $(".dialog-iframe iframe").attr("src", vUrl);
    dialog.show("dialog-iframe");
  });

  $(".dialog-close").click(function () {
    dialog.close();
    $(".dialog-iframe iframe").attr("src", "");
  });

  // 首页 - 菜单栏
  let menuLock = false;
  $(".topBar_menuBtn").click(function () {
    if (menuLock) return;
    if ($(this).hasClass("cur")) {
      menuLock = true;
      $(this).removeClass("cur");
      $(".topBar_menuBtn").removeClass("cur");
      $(".menuMain").removeClass("cur");
      setTimeout(function () {
        menuLock = false;
        $(".menuMainBox").removeClass("cur");
      }, 400);
    } else {
      $(this).addClass("cur");
      $(".topBar_menuBtn").addClass("cur");
      $(".menuMain").addClass("cur");
      $(".menuMainBox").addClass("cur");
    }
  });

  $(".menuMain ul li, .sidebar-box .my-bullet").click(function () {
    var i = $(this).index();
    fullPageFunc.slideToEvent(i);
  });

  $(".sidebar-open").click(function () {
    $(this).removeClass("cur");
    $(".sidebar-box").addClass("cur");
    fullPageFunc.sidebarStatus = true;
  });

  $(".sidebar-close").click(function () {
    $(".sidebar-box").removeClass("cur");
    $(".sidebar-open").addClass("cur");
    fullPageFunc.sidebarStatus = false;
  });
});
