const data = require("./INST_INFO");
const INST_INFO = data.INST_INFO;

// 키워드 추출을 위한 정규식 객체를 생성
// 케이|K뱅크|국민|우리|하나 ...
function getRegExp() {
  let regText = "";

  const keys = Object.keys(INST_INFO);

  keys.sort( (a, b)  => {
    return b.length - a.length;
  }); // 길이가 긴 패턴순으로 정렬

  for (let i = 0; i < keys.length; i++) {
    regText += keys[i] + "|";
  }

  // 마지막에 위치한 "|" 제거한 후 정규식 객체 생성
  return new RegExp(regText.slice(0, regText.length - 1), "gi");
}

// 정규식 패턴
const regExpObj = getRegExp();
const regAcctNum = /(\d-\d+-\d+-?\d+)|(\d{1,8}\s\d+\s\d+\s?\d+)|(\d{7,15})/g;
const regMoney = /([1-9]\d{0,6}\s{0,1}원)|((\d{1},)?\d{1,3},\d{3}\s{0,1}원)|((\d{1},)?\d{1,3},\d{3})|([1-9]\d{0,2}만원)/g;

/**
 * 정규식을 활용하여 기관코드, 계좌번호, 금액을 추출하여 객체 형태로 반환
 *
 * @param {String} text    클립보드에서 가져온 텍스트
 * @returns {Object}       {instCode(금융기관코드), instAccount(계좌번호), txAmt(금액)}
 */
function getResult(text) {
  let instCode = "";
  let instAccount = "";
  let txAmt = "";

  // 개행 공백으로 교체
  const noLineText = text.replace(/\n/g, " ");

  // 금액 추출
  const moneyArr = noLineText.match(regMoney) || [];
  if (moneyArr && moneyArr.length > 0) {
    if (moneyArr[0] && moneyArr[0].indexOf("만원") > 0) {
      txAmt = String(Number(moneyArr[0].replace(/만원/g, "")) * 10000);
    } else {
      txAmt = moneyArr[0].replace(/[,원]/g, "") || "";
    }
  }

  // 금액 추출 후 금액 공백으로 교체
  const noMoneyText = noLineText.replace(regMoney, " ");

  // 계좌번호 추출
  const rawAcctArr = noMoneyText.match(regAcctNum) || [];
  const rawAcctArrSorted = rawAcctArr.sort(function (a, b) {
      return b.length - a.length;
    }); // 길이순 정렬 (핸드폰 번호 등 우선도 낮추기 위해)

  const cleanAcctArr = rawAcctArrSorted.map((acct) => acct.replace(/\D/g, ""));

  instAccount = cleanAcctArr[0] || "";
  // 은행명 추출
  const matchNames = noMoneyText.match(regExpObj) || [];

  if (matchNames.length > 1 && instAccount !== "") {
    // 은행명으로 추정되는 키워드가 2개 이상이고 계좌번호가 있을 때
    // 계좌번호 인덱스와 가장 가까운 키워드를 은행명으로 추출
    let minDistance = 1000; // 최대 클립보드 문자 길이 1000
    const incodeAcctNumText = noMoneyText.replace(rawAcctArr[0], "α"); // 인덱스 거리 계산의 정확도를 위해 계좌번호를 구획문자로 교체
    for (let i = 0; i < matchNames.length; i++) {
      const incodeNameText = incodeAcctNumText.replace(matchNames[i], "β"); // 인덱스 거리 계산의 정확도를 위해 은행명을 구획문자로 교체
      const distance = Math.abs(
        incodeNameText.indexOf("α") - incodeNameText.indexOf("β")
      );
      if (distance < minDistance) {
        minDistance = distance;
        const fstKeyName = matchNames[i] || "";
        instCode = INST_INFO[matchNames[i].toUpperCase()] || "";
      }
    }
  } else {
    const fstKeyName = matchNames[0] || "";
    instCode = INST_INFO[fstKeyName.toUpperCase()] || "";
  }

  return {
    instCode: instCode, // 금융기관 코드
    instAccount: instAccount, // 계좌번호
    txAmt: txAmt // 금액
  };
}

exports.getResult = getResult;
