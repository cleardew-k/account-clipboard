var clipboard = require("./clipboard");

const accts = [
  "100124481075",
  `100
  124
  481075`,
  "100 124 481075",
  "100-124-481075",
  "100124-48-1-0-75",
  "10 01 24 48 107 5",
  "          100124481075     "
]

describe("계좌번호 테스트", () => {
  accts.forEach((acct) => {
    it(acct, () => {
      expect(clipboard.getResult(acct)).toEqual({
        instCode: "",
        instAccount: "100124481075",
        txAmt: ""
      });
    });
  });
});

const amounts = [

]

const testcases = [
  {
    name: "은행명 2개",
    text: "국민은행 아니고 국민증권 100 124 480175로 10,000원 보내줘~!",
    result: {
      instCode: "218",
      instAccount: "100124480175",
      txAmt: "10000"
    }
  },
  {
    name: "부산 장례식장",
    text: "장지: 부산 장례식장\n마음을 전하실 곳: 하나은행 100-1234-5679 김케이",
    result: {
      instCode: "081",
      instAccount: "10012345679",
      txAmt: ""
    }
  },
  {
    name: "부산 장례식장, 해운대 국민은행 옆, 하나은행 이함정",
    text: `장지: 부산 장례식장(소재지: 해운대 국민은행 옆, 051-8282-4444)
    마음을 전하실 곳: 하나은행 100-123456-56790 이함정`,
    result: {
      instCode: "081",
      instAccount: "10012345656790",
      txAmt: "",
    }
  },
  {
    name: "은행명 없는 계좌번호와 금액",
    text: "12341234123 400원",
    result: {
      instCode: "",
      instAccount: "12341234123",
      txAmt: "400"
    }
  },
  {
    name: "국민의당",
    text: "국민의당 김케이 1002447940859(우리)",
    result: {
      instCode: "020",
      instAccount: "1002447940859",
      txAmt: ""
    }
  },
  {
    name: "2만원",
    text: "우리 1002 447 940859 2만원",
    result: {
      instCode: "020",
      instAccount: "1002447940859",
      txAmt: "20000"
    }
  },
  {
    name: "금액이 먼저",
    text: `87840원 나한테 보내주면 돼..
    케이뱅크 100167790107 강현준`,
    result: {
      instCode: "089",
      instAccount: "100167790107",
      txAmt: "87840"
    }
  },
  {
    name: "예금주 계좌정보 사이에 개행",
    text: `예금주:(주)사랑의열매광주 
    기업 029-081822-04-039`,
    result: {
      instCode: "003",
      instAccount: "02908182204039",
      txAmt: ""
    }
  },
  {
    name: "인터파크 입금요청",
    text: `[인터파크_입금요청]
    윤맑은이슬 고객님, 예매완료를 위해 입금 부탁 드립니다.
    ▶상품명: 2021 페퍼톤스 콘서트 ‘TRAVELERS’
    ▶예매번호: T1826244450 [총1장]
    ▶입금기한: 2021-11-10 (수) 23시 59분
    (은행에 따라 23시 30분이후로 온라인 입금이 제한 될 수 있습니다.)
    ▶계좌번호: 우리은행
    26109255418117
    ▶예금주: 인터파크
    ▶입금액: 111,000원
    (나의 예매내역 보기)
    http://inpk.kr/raOA`,
    result: {
      instCode: "020",
      instAccount: "26109255418117",
      txAmt: "111000"
    }
  },
  {
    name: "신랑측 신부측",
    text: `신랑 측 : 1002447940859(KB증권)
          신부 측 : 33312341234(카카오뱅크)`,
    result: {
      instCode: "218",
      instAccount: "1002447940859",
      txAmt: ""
    }
  },
  {
    name: "장소 + 신랑측 신부측",
    text: `[모바일 청첩장]
          장소: 더케이호텔 블루밍홀(국민은행 사거리 인근)
          신랑 측 : 1002447940859(KB증권)
          신부 측 : 33312341234(카카오뱅크)`,
    result: {
      instCode: "218",
      instAccount: "1002447940859",
      txAmt: ""
    }
  },
  {
    name: "핸드폰 번호와 계좌번호 같이 있는 경우",
    text: "국민 김케이 567-7890-1234 12,000 (김케이 010-1234-1234)",
    result: {
      instCode: "004",
      instAccount: "56778901234",
      txAmt: "12000"
    }
  },
  {
    name: "카카오도 가능",
    text: "우리1003447940859카카오도 가능",
    result: {
      instCode: "020",
      instAccount: "1003447940859",
      txAmt: ""
    },
  },
  {
    name: "예금주명이 은행명과 유사",
    text: "신한은행 정제일 1002447940859",
    result: {
      instCode: "088",
      instAccount: "1002447940859",
      txAmt: ""
    }
  },
  {
    name: "예금주명이 은행명과 유사2",
    text: "우리은행1002447940859 이하나",
    result: {
      instCode: "020",
      instAccount: "1002447940859",
      txAmt: ""
    }
  },
  {
    name: "농협 123412341234 광주청소년수련원",
    text: "농협 123412341234 광주청소년수련원",
    result: {
      instCode: "011",
      instAccount: "123412341234",
      txAmt: ""
    }
  },
  {
    name: "미납 상세조회",
    text: `미납 상세조회
    납부: http://m.excard.co.kr
    가상계좌 납부(납부기한 2018-06-05):
    -농협 79001-95221-2713
    -국민 84249-97831-6181
    -하나 83491-06897-5372
    영업소/휴게소(안내소, 무인수납기), 홈페이지(www.excard.co.kr) 납부가능`,
    result: {
      instCode: "011",
      instAccount: "79001952212713",
      txAmt: ""
    }
  },
  {
    name: "신한 1400원, 계좌번호가 없을 때",
    text: "신한 1400원",
    result: {
      instCode: "088",
      instAccount: "",
      txAmt: "1400"
    }
  },
  {
    name: "복잡한 케이스 - 경매",
    text: `경매기간 : 2021 년 2 월23  일~  2월  23일  23시 까지 (경매종료시 경매종료를 해주세요)
    경매품목 :난
    판매자실명 :김민호
    판매자주소 :전남
    판매자전화 :010 3899 9109
    가      격 : 경매시작 1천원 (상승가는 자율적이며,화폐 단위는 천원 또는 만원입니다)
    예 금 주 :김민호
    계좌번호 :새금 9002 1512 8355 1
    택 배 비 : 착불(ㅇ) 선불()`,
    result: {
      instCode: "",
      instAccount: "",
      txAmt: ""
    }
  },
];

testcases.forEach(({ name, text, result }) => {
  it(name, () => {
    expect(clipboard.getResult(text)).toEqual(result);
  });
});
