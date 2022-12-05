export const getRegionAddr = ({ addr, semiAddr }) => {
  const addrArray = addr.split(" ");
  const addrAry = addrArray.slice(1, addrArray.length);

  const region = {};
  // const region = new Map();
  region.addr = addr;
  region.semiAddr = semiAddr;

  const district = addrArray[0];
  // region.set("district", district);
  region.district = district;

  const regSi = new RegExp("시$", "g");
  const [si] = addrAry.filter((adres) => regSi.test(adres));
  // region.set("si", si === undefined ? "" : si);
  region.si = si === undefined ? "" : si;

  const regGun = new RegExp("군$", "g");
  const [gun] = addrAry.filter((adres) => regGun.test(adres));
  // region.set("gun", gun === undefined ? "" : gun);
  region.gun = gun === undefined ? "" : gun;

  const regGu = new RegExp("구$", "g");
  const [gu] = addrAry.filter((adres) => regGu.test(adres));
  // region.set("gu", gu === undefined ? "" : gu);
  region.gu = gu === undefined ? "" : gu;

  const regEup = new RegExp("읍$", "g");
  const [eup] = addrAry.filter((adres) => regEup.test(adres));
  // region.set("eup", eup === undefined ? "" : eup);
  region.eup = eup === undefined ? "" : eup;

  const regMyeon = new RegExp("면$", "g");
  const [myeon] = addrAry.filter((adres) => regMyeon.test(adres));
  // region.set("myeon", myeon === undefined ? "" : myeon);
  region.myeon = myeon === undefined ? "" : myeon;

  const regDong = new RegExp("동$", "g");
  const [dong] = addrAry.filter((adres) => regDong.test(adres));
  // region.set("dong", dong === undefined ? "" : dong);
  region.dong = dong === undefined ? "" : dong;

  const regLi = new RegExp("리$", "g");
  const [li] = addrAry.filter((adres) => regLi.test(adres));
  // region.set("li", li === undefined ? "" : li);
  region.li = li === undefined ? "" : li;

  return region;
};

export const getAddr = (addr) => {
  const addrRes = getRegionAddr({ addr });
  delete addrRes.addr;
  return Object.values(addrRes)
    .filter((value) => value && value != "")
    .join(" ");
};

export const getKoreanAddr = (region) => {
  switch (region) {
    case "Seoul":
      return "서울";
    case "Busan":
      return "부산";
    case "Daegu":
      return "대구";
    case "Incheon":
      return "인천";
    case "Gwangju":
      return "광주";
    case "Daejeon":
      return "대전";
    case "Ulsan":
      return "울산";
    case "Sejong-si":
      return "세종특별자치시"; // 세종
    case "Gyeonggi-do":
      return "경기";
    case "Gangwon-do":
      return "강원";
    case "Chungcheongbuk-do":
      return "충북";
    case "Chungcheongnam-do":
      return "충남";
    case "Jeollabuk-do":
      return "전북";
    case "Jellanam-do":
      return "전남";
    case "Gyeongsangbuk-do":
      return "경북";
    case "Gyeongsangnam-do":
      return "경남";
    case "Jeju-do":
      return "제주특별자치도"; // 제주
  }
};
