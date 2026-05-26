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

    const resultEl = document.getElementById("result-total")
    const resultPerEl = document.getElementById("result-per-time")

    const monthsRaw = document.getElementById("months").value
    const weightRaw = document.getElementById("weight").value

    // バリデーション
    if (monthsRaw === "" || weightRaw === "") {
        resultEl.innerHTML = "<strong>月齢と体重を入力してください</strong>"
        resultPerEl.innerHTML = ""
        return
    }

    const months = parseInt(monthsRaw, 10)
    const weight = parseFloat(weightRaw)
    const food = document.querySelector('input[name="food"]:checked').value
    const times = parseInt(document.querySelector('input[name="times"]:checked').value, 10)

    const result = calcFood(months, weight, food)

    if (result === -1) {
        resultEl.innerHTML = "この月齢には対応していません"
        resultPerEl.innerHTML = ""
    } else {
        resultEl.innerHTML = `1日にあげる餌は <strong>約${result}g</strong> です`
        resultPerEl.innerHTML = `1回にあげる餌は <strong>約${Math.round(result / times)}g</strong> です`
    }
})