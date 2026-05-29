// 計算
function calcFood(age, months, weight, status, food) {
    let results = []

    if (food === "neko_genki_fish_mix_dry") {
        results = calcNekoGenkiFishMixDry(age, months, weight)
    } else if (food === "kalkan_tuna_wet_kitten") {
        if (age == 0 || (age == 1 && months == 0)) {
            results[0] = calcKalkanTunaWetKitten(months, weight)
            results[1] = -1
        }
    } else if (food === "beauty_pro_dry_kitten") {
        if (age == 0 || (age == 1 && months == 0)) {
            results[0] = calcBeautyProDryKitten(months, weight)
            results[1] = -1
        }
    } else {
        results = [-1, -1]
    }
    return results
}

function calcNekoGenkiFishMixDry(age, months, weight) {
    const foodAmountPerWeight = {
        2: [45, 65],
        3: [65, 80],
        4: [80, 95],
        5: [95, 110],
        6: [110, 120]
    }

    if (status == "pregnancy") {         // 妊娠期
        return calcNekoGenkiFishMixDryPregnancy(
            age, weight, foodAmountPerWeight
        )
    } else if (status == "nursing") {    // 授乳期
        return calcNekoGenkiFishMixDryNursing(
            age, weight, foodAmountPerWeight
        )
    } else if (age == 0) {                // 幼猫
        return calcNekoGenkiFishMixDryKitten(months)
    } else if (1 <= age && age <= 6) { // 成猫
        return calcNekoGenkiFishMixDryAdult(
            age, weight, foodAmountPerWeight
        )
    } else if (age >= 7) {             // シニア
        return calcNekoGenkiFishMixDrySenior(
            age, weight, foodAmountPerWeight
        )
    } else {
        return [-1, -1]
    }
}

function calcNekoGenkiFishMixDryPregnancy(age, weight, foodAmountPerWeight) {
    const max = 1.5
    const min = 1.2

    let results = foodAmountPerWeight[Math.trunc(weight)]
    results[0] *= min
    results[1] *= max

    return results
}

function calcNekoGenkiFishMixDryNursing(age, weight, foodAmountPerWeight) {
    const max = 3
    const min = 2

    let results = foodAmountPerWeight[Math.trunc(weight)]
    results[0] *= min
    results[1] *= max

    return results
}

function calcNekoGenkiFishMixDryKitten(months) {
    if (1 <= months && months < 3) {
        return [35, 65]
    } else if (3 <= months && months < 6) {
        return [65, 85]
    } else if (6 <= months && months < 9) {
        return [80, 95]
    } else if (9 <= months && months < 12) {
        return [85, 110]
    } else {
        return [-1, -1]
    }
}

function calcNekoGenkiFishMixDryAdult(age, weight, foodAmountPerWeight) {
    return foodAmountPerWeight[Math.trunc(weight)]
}

function calcNekoGenkiFishMixDrySenior(age, weight, foodAmountPerWeight) {
    const max = 1
    const min = 0.8

    let results = foodAmountPerWeight[Math.trunc(weight)]
    results[0] *= min
    results[1] *= max

    return results
}

function calcKalkanTunaWetKitten(months, weight) {
    if (2 <= months && months < 3) {
        return 309
    } else if (3 <= months && months < 4) {
        return 369
    } else if (4 <= months && months < 6) {
        return 420
    } else if (6 <= months && months <= 12) {
        return 372
    } else {
        return -1
    }
}

function calcBeautyProDryKitten(months, weight) {
    if (1 <= months && months < 6) {
        return weight * 30 + 35
    } else if (6 <= months && months <= 12) {
        return weight * 5 + 81
    } else {
        return -1
    }
}

// URL表示
// キーが food の value、値が商品URL
const foodUrls = {
    "neko_genki_fish_mix_dry": "https://jp.unicharmpet.com/ja/products/cat/food-nekogenki-4520699678572.html",
    "kalkan_tuna_wet_kitten": "https://kalkan.jp/products/kitten/pouch-jelly-maguro.html",
    "beauty_pro_dry_kitten": "https://www.npf.co.jp/beautypro/cat/lineup/kitten/index.html",
}

document.getElementById("food").addEventListener("change", function () {
    const link = document.getElementById("food-link")
    const url = foodUrls[this.value]

    if (url) {
        link.href = url
        link.removeAttribute("hidden")
    } else {
        link.href = "#"
        link.setAttribute("hidden", "")
    }
})

// 入力取得・表示
document.getElementById("calcForm").addEventListener("submit", function (event) {
    event.preventDefault()

    const resultTotal = document.getElementById("result-total")
    const resultPerTime = document.getElementById("result-per-time")
    const resultWarning = document.getElementById("result-warning")

    const ageRaw = document.getElementById("age").value
    const monthsRaw = document.getElementById("months").value
    const weightRaw = document.getElementById("weight").value

    // バリデーション
    if (ageRaw === "" || monthsRaw === "" || weightRaw === "") {
        resultWarning.innerHTML = "<b>年齢と体重を入力してください</b>"
        resultPerTime.innerHTML = ""
        resultTotal.innerHTML = ""
        return
    }

    const age = parseInt(ageRaw, 10)
    const months = parseInt(monthsRaw, 10)
    const weight = parseFloat(weightRaw)
    const status = document.querySelector('input[name="status"]:checked').value
    const food = document.getElementById("food").value
    const times = parseInt(document.querySelector('input[name="times"]:checked').value, 10)

    const results = calcFood(age, months, weight, status, food)

    if (food == "unselected") {
        resultWarning.innerHTML = "<b>餌を選んでください</b>"
        resultPerTime.innerHTML = ""
        resultTotal.innerHTML = ""
    } else if (results[0] == -1 && results[1] == -1) {
        resultWarning.innerHTML = "<b>この年齢には対応していません</b>"
        resultPerTime.innerHTML = ""
        resultTotal.innerHTML = ""
    } else if (results[1] == -1) {
        resultPerTime.innerHTML = `約<b>${Math.round(results[0] / times)}</b>g`
        resultTotal.innerHTML = `約<b>${results[0]}</b>g`
    } else {
        resultPerTime.innerHTML = `約<b>${Math.round(results[0] / times)}-${Math.round(results[1] / times)}</b>g`
        resultTotal.innerHTML = `約<b>${results[0]}-${results[1]}</b>g`
    }
})
