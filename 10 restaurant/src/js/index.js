let click = true;
let reservationNumber = 1;
let hour = 8;
let endTime = 22;
let min = 1;

let data = [];

class Restaurant {
  constructor(soloTable, duoTable, quadTable) {
    // this.soloTable = soloTable;
    // this.duoTable = duoTable;
    // this.quadTable = quadTable;
    this.checkTable = [
      {
        tableKinds: "soloTable",
        tableNum: 0,
        tableChair: soloTable[0].getElementsByClassName("chair-item")[0],
        tableStatus: "이용가능",
      },
      {
        tableKinds: "soloTable",
        tableNum: 1,
        tableChair: soloTable[0].getElementsByClassName("chair-item")[1],
        tableStatus: "이용가능",
      },
      {
        tableKinds: "soloTable",
        tableNum: 2,
        tableChair: soloTable[0].getElementsByClassName("chair-item")[2],
        tableStatus: "이용가능",
      },
      {
        tableKinds: "duoTable",
        tableNum: 3,
        tableChair: duoTable[0].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
      {
        tableKinds: "duoTable",
        tableNum: 4,
        tableChair: duoTable[1].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
      {
        tableKinds: "duoTable",
        tableNum: 5,
        tableChair: duoTable[2].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
      {
        tableKinds: "quadTable",
        tableNum: 6,
        tableChair: quadTable[0].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
      {
        tableKinds: "quadTable",
        tableNum: 7,
        tableChair: quadTable[1].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
      {
        tableKinds: "quadTable",
        tableNum: 8,
        tableChair: quadTable[2].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
      {
        tableKinds: "quadTable",
        tableNum: 9,
        tableChair: quadTable[3].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
      {
        tableKinds: "quadTable",
        tableNum: 10,
        tableChair: quadTable[4].getElementsByClassName("chair-item"),
        tableStatus: "이용가능",
      },
    ];
  }

  clock() {
    let displayBusinessTime = document.getElementsByClassName("time")[0];
    displayBusinessTime.innerText = `${hour < 10 ? `0${hour}` : hour}:${
      min < 10 ? `0${min}` : min
    }:00`;
    min += 1;

    if (min >= 60) {
      min = 0;
      hour += 1;
    }
  }
}

class RestaurantGuests {
  // reservationNumber, numOfPeople, nowStatus(대기, 식사, 식사완료, 거절)
  constructor(reservationNumber, numOfPeople, nowStatus) {
    this.reservationNumber = reservationNumber;
    this.numOfPeople = numOfPeople;
    this.nowStatus = nowStatus;
    this.mealTime = 0;
    this.mealTable = -1;
  }
}

// 식사 인원 입력용 input 관련 이벤트
function clickBtn() {
  const inputBox = document.getElementById("식사인원");
  numOfPeople = parseInt(inputBox.value, 10);
  inputBox.value = "";
  document.getElementById("경고문구").innerHTML = "";
  if (hour >= endTime) {
    document.getElementById(
      "경고문구"
    ).innerHTML = `<strong>※ 영업이 종료되었습니다.</strong>`;
    return;
  }

  if (numOfPeople >= 5) {
    document.getElementById(
      "경고문구"
    ).innerHTML = `<strong>※ 코로나로 인해 5인 이상은 예약을 받고 있지 않습니다.</strong>`;
    data.push(new RestaurantGuests(reservationNumber, numOfPeople, "거절"));
    return;
  } else if (numOfPeople >= 0) {
    data.push(new RestaurantGuests(reservationNumber, numOfPeople, "대기중"));
    reservationNumber += 1;
  } else {
    document.getElementById(
      "경고문구"
    ).innerHTML = `<strong>※ 0 이상 5 미만의 숫자를 입력해 주세요.</strong>`;
  }

  createTable();
}

function createTable() {
  let tableBodyData = [];
  for (const iterator of data) {
    if (iterator.nowStatus == "대기중") {
      tableBodyData.push(`
            <tr>
                <td>${iterator.reservationNumber}</td>
                <td>${iterator.numOfPeople}</td>
                <td class="waiting">${iterator.nowStatus}</td>
            </tr>
            `);
    } else if (iterator.nowStatus == "거절") {
      tableBodyData.push(`          
            <tr>
                <td>${iterator.reservationNumber}</td>
                <td>${iterator.numOfPeople}</td>
                <td class="reject">${iterator.nowStatus}</td>
            </tr>
            `);
    } else {
      tableBodyData.push(`
            <tr>
                <td>${iterator.reservationNumber}</td>
                <td>${iterator.numOfPeople}</td>
                <td>${iterator.nowStatus}</td>
            </tr>
            `);
    }
  }
  document.querySelector(".reservation-table > tbody").innerHTML =
    tableBodyData.join("");
}

// 영업 개시 버튼 클릭 이벤트
function clickStartBtn() {
  const soloTable = document.getElementsByClassName("bar-table");
  const duoTable = document.getElementsByClassName("rec-table");
  const quadTable = document.getElementsByClassName("circle-table");

  let restaurant = new Restaurant(soloTable, duoTable, quadTable);

  let timer = setInterval(() => {
    restaurant.clock();

    // 좌석 점유 상태
    for (const guest of data) {
      //점유코드
      if (guest.nowStatus == "대기중") {
        if (guest.numOfPeople == 1) {
          for (const table of restaurant.checkTable) {
            if (
              table.tableKinds == "soloTable" &&
              table.tableStatus == "이용가능" &&
              guest.nowStatus == "대기중"
            ) {
              table.tableChair.classList.add("on");
              table.tableStatus = "이용불가능";
              guest.nowStatus = "식사중";
              guest.mealTable = table.tableNum;
            }
          }
        }
        if (guest.numOfPeople == 2) {
          for (const table of restaurant.checkTable) {
            if (
              table.tableKinds == "duoTable" &&
              table.tableStatus == "이용가능" &&
              guest.nowStatus == "대기중"
            ) {
              table.tableChair[0].classList.add("on");
              table.tableChair[1].classList.add("on");
              table.tableStatus = "이용불가능";
              guest.nowStatus = "식사중";
              guest.mealTable = table.tableNum;
            }
          }
        }
        if (guest.numOfPeople == 3 || guest.numOfPeople == 4) {
          for (const table of restaurant.checkTable) {
            if (
              table.tableKinds == "quadTable" &&
              table.tableStatus == "이용가능" &&
              guest.nowStatus == "대기중"
            ) {
              for (let num = 0; num < guest.numOfPeople; num++) {
                table.tableChair[num].classList.add("on");
              }
              table.tableStatus = "이용불가능";
              guest.nowStatus = "식사중";
              guest.mealTable = table.tableNum;
            }
          }
        }
      }

      if (guest.nowStatus == "식사중" && guest.mealTime < 60) {
        guest.mealTime += 1;
      } else if (guest.mealTime >= 60 && guest.nowStatus == "식사중") {
        guest.nowStatus = "식사완료";
        restaurant.checkTable[guest.mealTable].tableStatus = "이용가능";
        if (guest.numOfPeople == 1) {
          restaurant.checkTable[guest.mealTable].tableChair.classList.remove(
            "on"
          );
        } else {
          for (let num = 0; num < guest.numOfPeople; num++) {
            restaurant.checkTable[guest.mealTable].tableChair[
              num
            ].classList.remove("on");
          }
        }
      }
    }
    createTable();
    if (hour >= endTime) {
      clearInterval(timer);
    }
  }, 1000);
}

function sort(key) {
  if (click) {
    click = false;
    var sortedData = data.sort((a, b) =>
      a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
    );
  } else {
    click = true;
    var sortedData = data.sort((a, b) =>
      a[key] > b[key] ? -1 : a[key] < b[key] ? 1 : 0
    );
  }

  let tableBodyData = [];

  for (const iterator of sortedData) {
    if (iterator.nowStatus == "대기중") {
      tableBodyData.push(`
            <tr>
                <td>${iterator.reservationNumber}</td>
                <td>${iterator.numOfPeople}</td>
                <td class="waiting">${iterator.nowStatus}</td>
            </tr>
            `);
    } else if (iterator.nowStatus == "거절") {
      tableBodyData.push(`          
            <tr>
                <td>${iterator.reservationNumber}</td>
                <td>${iterator.numOfPeople}</td>
                <td class="reject">${iterator.nowStatus}</td>
            </tr>
            `);
    } else {
      tableBodyData.push(`
            <tr>
                <td>${iterator.reservationNumber}</td>
                <td>${iterator.numOfPeople}</td>
                <td>${iterator.nowStatus}</td>
            </tr>
            `);
    }
  }

  document.querySelector(".reservation-table > tbody").innerHTML =
    tableBodyData.join("");
}

const typeNumOfPeople = document.getElementById("예약버튼");
typeNumOfPeople.addEventListener("click", clickBtn);

const businessStartBtn = document.getElementById("영업개시");
businessStartBtn.addEventListener("click", clickStartBtn);
