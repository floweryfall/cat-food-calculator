// 計算
function calcFood(months, weight, food) {
    let result
    if (food === "wet_tuna") {
        if (2 <= months && months < 3) {
            result = 309
        } else if (3 <= months && months < 4) {
            result = 369
        } else if (4 <= months && months < 6) {
            result = 420
        } else if (6 <= months && months <= 12) {
            result = 372
        } else {
            result = -1
        }
    } else if (food === "dry") {
        if (1 <= months && months < 6) {
            result = weight * 30 + 35
        } else if (6 <= months && months <= 12) {
            result = weight * 5 + 81
        } else {
            result = -1
        }
    }
    return result
}

// 入力取得・表示
document.getElementById("calcForm").addEventListener("submit", function (event) {
    event.preventDefault()

    const resultTotal = document.getElementById("result-total")
    const resultPerTime = document.getElementById("result-per-time")
    const resultWarning = document.getElementById("result-warning")

    const monthsRaw = document.getElementById("months").value
    const weightRaw = document.getElementById("weight").value

    // バリデーション
    if (monthsRaw === "" || weightRaw === "") {
        resultWarning.innerHTML = "<b>月齢</b>と<b>体重</b>を入力してください"
        resultPerTime.innerHTML = ""
        resultTotal.innerHTML = ""
        return
    }

    const months = parseInt(monthsRaw, 10)
    const weight = parseFloat(weightRaw)
    const food = document.querySelector('input[name="food"]:checked').value
    const times = parseInt(document.querySelector('input[name="times"]:checked').value, 10)

    const result = calcFood(months, weight, food)

    if (result === -1) {
        resultWarning.innerHTML = "この月齢には対応していません"
        resultPerTime.innerHTML = ""
        resultTotal.innerHTML = ""
    } else {
        resultPerTime.innerHTML = `約<b>${Math.round(result / times)}</b>g`
        resultTotal.innerHTML = `約<b>${result}</b>g`
    }
})
