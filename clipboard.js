var data = require("./INST_INFO");
var INST_INFO = data.INST_INFO;

// 키워드 추출을 위한 정규식 객체를 생성
// 케이|K뱅크|국민|우리|하나 ...
function getRegExp() {
  var regText = "";

  for (var key in INST_INFO) {
    regText += key + "|";
  }

  // 마지막에 위치한 "|" 제거한 후 정규식 객체 생성
  return new RegExp(regText.substr(0, regText.length - 1), "gi");
}

// 정규식 패턴
var regHyphenPtn = /(\-|\,)/g;
var regBlankPtn = /(\n|\r|\s)/g;
var regNumLen = /\d{7,15}/g;
var regMoney = /\d+원/g;
var regExpObj = getRegExp();
var regClean = /[^a-z|A-Z|0-9|ㄱ-ㅎ|가-힣]/g; // 영문, 숫자, 한글 이외 모두 제외

/**
 * 정규식을 활용하여 기관코드, 계좌번호, 금액을 추출하여 객체 형태로 반환
 *
 * @param {String} text    클립보드에서 가져온 텍스트
 * @returns {Object}       {instCode(금융기관코드), instAccount(계좌번호), txAmt(금액)}
 */
function getResult(text) {
  var instName = ""; // 금융기관명 (테스트를 위해 임시 추가)
  var instCode = "";
  var instAccount = "";
  var txAmt = "";

  // 하이픈, 쉼표 제거
  var adjustText = text.replace(regHyphenPtn, "");

  // 금액 추출
  var moneyArr = adjustText.match(regMoney) || [];
  if (moneyArr && moneyArr.length > 0) {
    txAmt = moneyArr[0] || "";
  }

  // 금액 추출 후 금액. 공백, 개행 제거
  var noMoneyText = adjustText
    .replace(regMoney, "")
    .replace(regBlankPtn, "")
    .replace(regClean, "");

  // 계좌번호 추출
  var acctArr = noMoneyText.match(regNumLen) || [];
  acctArr && acctArr.sort((a, b) => b.length - a.length); // 길이순 정렬 (핸드폰 번호 등 우선도 낮추기 위해)
  instAccount = acctArr[0] || "";
  var instAccountIdx = noMoneyText.indexOf(instAccount);

  // 은행명 추출
  var matchNames = noMoneyText.match(regExpObj) || [];

  if (matchNames.length > 1 && instAccount !== "") {
    // 은행명으로 추정되는 키워드가 2개 이상이고 계좌번호가 있을 때
    // 계좌번호 인덱스와 가장 가까운 키워드를 은행명으로 추출
    var minDistance = 1000; // 최대 클립보드 문자 길이 1000
    for (var i = 0; i < matchNames.length; i++) {
      var incodeAcctNumText = noMoneyText.replace(instAccount, "@"); // 인덱스 거리 계산의 정확도를 위해 한자리 문자로 교체
      var incodeNameText = incodeAcctNumText.replace(matchNames[i], "#"); // 인덱스 거리 계산의 정확도를 위해 한자리 문자로 교체
      var distance = Math.abs(
        incodeNameText.indexOf("#") - incodeNameText.indexOf("@")
      );
      if (distance < minDistance) {
        minDistance = distance;
        var fstKeyName = matchNames[i] || "";
        instName = fstKeyName;
        instCode = INST_INFO[matchNames[i].toUpperCase()] || "";
      }
    }
  } else {
    var fstKeyName = matchNames[0] || "";
    instName = fstKeyName;
    instCode = INST_INFO[fstKeyName.toUpperCase()] || "";
  }

  return {
    // instName: instName, // 금융기관명 (테스트를 위해 임시 추가)
    instCode: instCode, // 금융기관 코드
    instAccount: instAccount, // 계좌번호
    txAmt: txAmt, // 금액
  };
}

exports.getResult = getResult;
