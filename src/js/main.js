import '../css/style.css'

// axios
const $axios = axios.create({
  method: "post",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  timeout: 30000,
});
var loading;
// request拦截器
$axios.interceptors.request.use(
  (config) => {
    loading = layer.open({ type: 2 });
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
    layer.close(loading);
    const res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 弹窗
let dialog = {
  close: function () {
    $(".mask").removeClass("on");
    $(".dialog").removeClass("on");
  },
  show: function (type) {
    $(".mask").addClass("on");
    $(`.${type}`).addClass("on");
  },
};

// 请求
let axiosFun = {
  collect: async function (answerObj) {
    var res = await $axios.post("/collect2/index", answerObj);
    if (res.code == 0) {
      dialog.show("dialog-finish");
    } else if (res.code == 201) {
      layer.open({
        content: "必須項目が入力されていません。1～4、6に全てご記入ください",
        btn: "再入力",
      });
    } else if (res.code == 202) {
      layer.open({
        content:
          "確認用のメールアドレスが入力されていない、もしくは確認用のメールアドレスが一致しません。入力内容をご確認ください",
        btn: "再入力",
      });
    } else if (res.code == 204) {
      layer.open({
        content: "送信に失敗しました",
        btn: "閉じる",
      });
    } else if (res.code == 205) {
      layer.open({
        content: "サーバーエラー",
        btn: "閉じる",
      });
    } else if (res.code == 206) {
      layer.open({
        content:
          "同じメールアドレスですでにご応募いただいています。ご不明の点がございましたら、サポート（cs@grayraven.jp)までご連絡ください。",
        btn: "閉じる",
      });
    } else if (res.code == 208) {
      layer.open({
        content: "募集期間外です",
        btn: "閉じる",
      });
    } else if (res.code == 207) {
      $(".start").hide();
      $(".questionnaire").hide();
      $(".end").show();
    } else {
      layer.open({
        content: `error:${res.code}`,
        btn: "閉じる",
      });
    }
  },
};
let answerObj = {
  unRequired1: "",
  unRequired2: "",
  unRequired3: "",
  unRequired4: "",
  unRequired5: [],
  unRequired6: "",
  unRequired7: "",
  required1: "",
  required2: "",
  required3: "",
  required4: "",
  required5: "",
  mail: "",
  dev: "",
  os_type: "",
  os_version: ""
};

$(function () {
  // 页面状态
  if (new Date().getTime() >= new Date("2020/11/15 12:00:00").getTime()) {
    $(".start").hide();
    $(".questionnaire").hide();
    $(".end").show();
  } else {
    if (JSON.parse(sessionStorage.getItem("page")) == "questionnaire") {
      $(".start").hide();
      $(".questionnaire").show();
    } else {
      $(".questionnaire").hide();
      $(".start").show();
    }
  }

  if(JSON.parse(sessionStorage.getItem("os_type")) == "ios") {
    answerObj.os_type = "ios"
    answerObj.os_version = "ios"
    $(".qn-r-4-ios,.qn-r-6-ios").show()
    $(".qn-r-4-Android,.qn-r-6-Android").hide()
  } else {
    answerObj.os_type = "andriod"
    answerObj.os_version = "andriod"
    $(".qn-r-4-Android,.qn-r-6-Android").show()
    $(".qn-r-4-ios,.qn-r-6-ios").hide()

  }

  // 收展
  $(".s2-summaryShowBtn").click(function () {
    if ($(".s2-summaryCon").hasClass("active")) {
      $(".s2-summaryCon").removeClass("active");
    } else {
      $(".s2-summaryCon").addClass("active");
    }
  });

  $(".s2-attentionShowBtn").click(function () {
    if ($(".s2-attentionCon").hasClass("active")) {
      $(".s2-attentionCon").removeClass("active");
    } else {
      $(".s2-attentionCon").addClass("active");
    }
  });

  // 弹窗
  $(".dialog .close, .mask").click(function () {
    dialog.close();
  });

  $(".qn-agreement").click(function () {
    dialog.show("dialog-agreement");
  });

  $(".qn-rules").click(function () {
    dialog.show("dialog-rules");
  });

  // 进入问卷页
  $(".s1-google").click(function () {
    sessionStorage.setItem("page", JSON.stringify("questionnaire"));
    sessionStorage.setItem("os_type", JSON.stringify("andriod"));
    answerObj.os_type = "andriod"
    answerObj.os_version = "andriod"
    $(".qn-r-4-Android,.qn-r-6-Android").show()
    $(".qn-r-4-ios,.qn-r-6-ios").hide()
    $(".start").hide();
    $(".questionnaire").show();
  });

  $(".s1-apple").click(function () {
    sessionStorage.setItem("page", JSON.stringify("questionnaire"));
    sessionStorage.setItem("os_type", JSON.stringify("ios"));
    answerObj.os_type = "ios"
    answerObj.os_version = "ios"
    $(".qn-r-4-ios,.qn-r-6-ios").show()
    $(".qn-r-4-Android,.qn-r-6-Android").hide()
    $(".start").hide();
    $(".questionnaire").show();
  });

  // 返回首页
  $(".questionnaire-goBack").click(function () {
    sessionStorage.setItem("page", JSON.stringify("start"));
    $(".start").show();
    $(".questionnaire").hide();
    answerObj = {
      required4: "",
      mail: "",
      os_type: "",
      os_version: ""
    };
  });

  // 问卷页 - 必填和非必填切换
  $(".qn-liBox li").click(function () {
    let index = Number($(this).index());
    $(this).addClass("cur").siblings().removeClass("cur");
    $(".qb-conBox .qn-con")
      .eq(index)
      .addClass("cur")
      .siblings()
      .removeClass("cur");
  });

  $(".qn-nr-nextBtn").click(function () {
    $(".qn-liBox li").eq(1).addClass("cur").siblings().removeClass("cur");
    $(".qb-conBox .qn-con").eq(1).addClass("cur").siblings().removeClass("cur");
    $("body,html").animate({ scrollTop: 0 }, 0);
  });

  // 表单填写


  // dev
  let reg = new RegExp(/\([^\)]+\)/g);
  answerObj.dev = navigator.userAgent.match(reg)[0];
  // console.log(navigator.userAgent.match(reg)[0]);

  // 协议
  let isAgree = false;
  $("input[name = 'agree']").click(function () {
    if ($(this).data("checked")) {
      $(this).prop("checked", false);
      $(this).data("checked", false);
    } else {
      $(this).prop("checked", true);
      $(this).data("checked", true);
    }
    isAgree = $("input[name = 'agree']:checked").val();
  });

  // nr-1
  $("input[name = 'nr-1']").change(function () {
    let answer = $(this).val();
    if (answer == "その他") {
      $("textarea[name = 'nr-1-other']").prop("disabled", false);
    } else {
      $("textarea[name = 'nr-1-other']").prop("disabled", true);
    }
    answerObj.unRequired1 = answer;
  });

  $("textarea[name = 'nr-1-other']").change(function () {
    let answer = $(this).val();
    answerObj.unRequired1 = answer;
  });

  // nr-2
  $("input[name = 'nr-2']").change(function () {
    let answers = [];
    $("input[name = 'nr-2']:checked").each(function () {
      answers.push($(this).val());
    });
    answerObj.unRequired2 = answers.join(",");
  });

  // nr-3
  $("textarea[name = 'nr-3-other']").change(function () {
    let answer = $(this).val();
    answerObj.unRequired3 = answer;
  });

  // nr-4
  $("input[name = 'nr-4']").change(function () {
    let answer = $(this).val();

    if (answer == "その他") {
      $("textarea[name = 'nr-4-other']").attr("disabled", false);
    } else {
      $("textarea[name = 'nr-4-other']").attr("disabled", true).val("");
    }
    answerObj.unRequired4 = answer;
  });

  $("textarea[name = 'nr-4-other']").change(function () {
    let answer = $(this).val();
    answerObj.unRequired4 = answer;
  });

  // nr-5.1
  let unRequired5Arr = []
  let nr51AnswersArr = [];
  $("input[name = 'nr-5.1']").change(function () {
    let nr51Answers = [];
    $("input[name = 'nr-5.1']:checked").each(function () {
      nr51Answers.push($(this).val());
    });

    if (nr51Answers[nr51Answers.length - 1] == "その他") {
      $("textarea[name = 'nr-5.1-other']").prop("disabled", false);
    } else {
      $("textarea[name = 'nr-5.1-other']").prop("disabled", true).val("");
    }
    let answer = $("textarea[name = 'nr-5.1-other']").val();
    if (answer) {
      nr51Answers[nr51Answers.length - 1] = answer;
    }
    nr51AnswersArr = nr51Answers;
    unRequired5Arr[0] = nr51AnswersArr.join(",");
  });

  $("textarea[name = 'nr-5.1-other']").change(function () {
    let answer = $(this).val();
    nr51AnswersArr[nr51AnswersArr.length - 1] = answer;
    unRequired5Arr[0] = nr51AnswersArr.join(",");
  });

  // nr-5.2
  let nr52AnswersArr = [];
  $("input[name = 'nr-5.2']").change(function () {
    let nr52Answers = [];
    $("input[name = 'nr-5.2']:checked").each(function () {
      nr52Answers.push($(this).val());
    });

    if (nr52Answers[nr52Answers.length - 1] == "その他") {
      $("textarea[name = 'nr-5.2-other']").prop("disabled", false);
    } else {
      $("textarea[name = 'nr-5.2-other']").prop("disabled", true).val("");
    }
    let answer = $("textarea[name = 'nr-5.2-other']").val();
    if (answer) {
      nr52Answers[nr52Answers.length - 1] = answer;
    }
    nr52AnswersArr = nr52Answers;
    unRequired5Arr[1] = nr52AnswersArr.join(",");
  });

  $("textarea[name = 'nr-5.2-other']").change(function () {
    let answer = $(this).val();
    nr52AnswersArr[nr52AnswersArr.length - 1] = answer;
    unRequired5Arr[1] = nr52AnswersArr.join(",");
  });

  // nr-5.3
  let nr53AnswersArr = [];
  $("input[name = 'nr-5.3']").change(function () {
    let nr53Answers = [];
    $("input[name = 'nr-5.3']:checked").each(function () {
      nr53Answers.push($(this).val());
    });

    if (nr53Answers[nr53Answers.length - 1] == "その他") {
      $("textarea[name = 'nr-5.3-other']").prop("disabled", false);
    } else {
      $("textarea[name = 'nr-5.3-other']").prop("disabled", true).val("");
    }
    let answer = $("textarea[name = 'nr-5.3-other']").val();
    if (answer) {
      nr53Answers[nr53Answers.length - 1] = answer;
    }
    nr53AnswersArr = nr53Answers;
    unRequired5Arr[2] = nr53AnswersArr.join(",");
  });

  $("textarea[name = 'nr-5.3-other']").change(function () {
    let answer = $(this).val();
    nr53AnswersArr[nr53AnswersArr.length - 1] = answer;
    unRequired5Arr[2] = nr53AnswersArr.join(",");
  });

  // nr-6
  $("textarea[name = 'nr-6-other']").change(function () {
    let answer = $(this).val();
    answerObj.unRequired6 = answer;
  });

  // nr-7
  $("textarea[name = 'nr-7-other']").change(function () {
    let answer = $(this).val();
    answerObj.unRequired7 = answer;
  });

  // r-1
  $("select[name = 'r-1']").change(function () {
    let answer = $(this).val();
    answerObj.required1 = answer;
  });

  // r-2
  $("select[name = 'r-2']").change(function () {
    let answer = $(this).val();
    answerObj.required2 = answer;
  });

  // r-3
  $("select[name = 'r-3']").change(function () {
    let answer = $(this).val();
    answerObj.required3 = answer;
  });

  // r-4
  $("select[name = 'r-4-ios']").change(function () {
    let answer = $(this).val();
    answerObj.required4 = answer;
  });

  $("select[name = 'r-4-Android']").change(function () {
    let answer = $(this).val();
    answerObj.required4 = answer;
  });

  // r-5
  $("textarea[name = 'r-5-other']").change(function () {
    let answer = $(this).val();
    answerObj.required5 = answer;
  });

  // mail
  let firstMail, comfirmMail;
  $(".qn-r-6-ios input[name = 'firstMail']").change(function () {
    firstMail = $.trim($(this).val());
    let reg = new RegExp(/^([\s\S]+)@([\s\S]+)$/i);
    if (!reg.test(firstMail)) {
      layer.open({
        content: "メールアドレスが正しくありません",
        btn: "再入力",
      });
    }
  });

  $(".qn-r-6-ios input[name = 'comfirmMail']").change(function () {
    comfirmMail = $.trim($(this).val());
    let reg = new RegExp(/^([\s\S]+)@([\s\S]+)$/i);
    if (!reg.test(comfirmMail)) {
      layer.open({
        content: "メールアドレスが正しくありません",
        btn: "再入力",
      });
      return false;
    }

    if (firstMail != comfirmMail) {
      layer.open({
        content:
          "確認用のメールアドレスが入力されていない、もしくは確認用のメールアドレスが一致しません。入力内容をご確認ください",
        btn: "再入力",
      });
      return false;
    }
  });

  $(".qn-r-6-Android input[name = 'firstMail']").change(function () {
    firstMail = $.trim($(this).val());
    let reg = new RegExp(/^([\s\S]+)@gmail.com$/i) ;
    if (!reg.test(firstMail)) {
      layer.open({
        content: "Android端末でクローズドβテストにご参加のお客様は、Gmailアドレスでご応募ください。Gmailアドレス以外のメールアドレスではご参加いただけませんので、ご了承ください。",
        btn: "再入力",
      });
    }
  });

  $(".qn-r-6-Android input[name = 'comfirmMail']").change(function () {
    comfirmMail = $.trim($(this).val());
    let reg = new RegExp(/^([\s\S]+)@gmail.com$/i) ;
    if (!reg.test(comfirmMail)) {
      layer.open({
        content: "Android端末でクローズドβテストにご参加のお客様は、Gmailアドレスでご応募ください。Gmailアドレス以外のメールアドレスではご参加いただけませんので、ご了承ください。",
        btn: "再入力",
      });
      return false;
    }

    if (firstMail != comfirmMail) {
      layer.open({
        content:
          "確認用のメールアドレスが入力されていない、もしくは確認用のメールアドレスが一致しません。入力内容をご確認ください",
        btn: "再入力",
      });
      return false;
    }
  });


  // 提交
  $(".qn-submit").click(function () {
    console.log(answerObj);
    if (!isAgree) {
      layer.open({
        content:
          "「利用規約」と「第2回クローズドβテスト実施概要・注意事項」にご同意いただけない場合は、『パニシング：グレイレイヴン』第2回クローズドβテストにご応募いただけません。ご了承ください。",
        btn: "OK",
      });
      return false;
    }

    if (!firstMail) {
      layer.open({
        content:
          "メールアドレスが入力されていません。AppleIDに登録しているメールアドレスをご入力ください",
        btn: "再入力",
      });
      return false;
    }

    if (!comfirmMail) {
      layer.open({
        content:
          "確認用のメールアドレスが入力されていない、もしくは確認用のメールアドレスが一致しません。入力内容をご確認ください",
        btn: "再入力",
      });
      return false;
    }
    if(answerObj.os_type == "ios") {
      let reg = new RegExp(/^([\s\S]+)@([\s\S]+)$/i);
      if (!reg.test(firstMail)) {
        layer.open({
          content: "メールアドレスが正しくありません",
          btn: "再入力",
        });
        return false;
      }
  
      if (!reg.test(comfirmMail)) {
        layer.open({
          content: "メールアドレスが正しくありません",
          btn: "再入力",
        });
        return false;
      }
    } else {
      let reg = new RegExp(/^([\s\S]+)@gmail.com$/i);
      if (!reg.test(firstMail)) {
        layer.open({
          content: "Android端末でクローズドβテストにご参加のお客様は、Gmailアドレスでご応募ください。Gmailアドレス以外のメールアドレスではご参加いただけませんので、ご了承ください。",
          btn: "再入力",
        });
        return false;
      }
  
      if (!reg.test(comfirmMail)) {
        layer.open({
          content: "Android端末でクローズドβテストにご参加のお客様は、Gmailアドレスでご応募ください。Gmailアドレス以外のメールアドレスではご参加いただけませんので、ご了承ください。",
          btn: "再入力",
        });
        return false;
      }
    }

    if (firstMail != comfirmMail) {
      layer.open({
        content:
          "確認用のメールアドレスが入力されていない、もしくは確認用のメールアドレスが一致しません。入力内容をご確認ください",
        btn: "再入力",
      });
      return false;
    }

    answerObj.mail = comfirmMail

    if(!answerObj.required1 || !answerObj.required2 || !answerObj.required3 || !answerObj.required4) {
      layer.open({
        content: "必須項目が入力されていません。1～4、6に全てご記入ください",
        btn: "閉じる",
      });
      return false
    }

    answerObj.unRequired5 = unRequired5Arr.join(";")

    axiosFun.collect(answerObj);
  });

  // 完成弹窗 - ok
  $(".dialog-ok").click(function () {
    sessionStorage.setItem("page", JSON.stringify("start"));
    $(".start").show();
    $(".questionnaire").hide();
    dialog.close();
    answerObj = {
      required4: "",
      mail: "",
      os_type: "",
      os_version: ""
    };
  });



});
