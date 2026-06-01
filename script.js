// JSONを読み込む
async function loadJson(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`読み込み失敗: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("JSONの読み込みエラー:", error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const food_info = await loadJson("./food_info.json");
  if (!food_info) return;

  // 商品一覧に追加
  const select = document.getElementById("food");

  food_info.forEach((food) => {
    const option = document.createElement("option");
    option.value = food.id;
    option.textContent = food.name;
    select.appendChild(option);
  });

  // 選択商品が切り替わったとき
  select.addEventListener("change", () => {
    const selectedId = select.value;
    // IDで商品を検索
    const selectedFood = food_info.find((food) => food.id === selectedId);
    const link = document.getElementById("food-link");

    if (selectedFood && select.url) {
      link.href = select.url;
      link.removeAttribute("hidden");
    } else {
      link.href = "#";
      link.setAttribute("hidden", "");
    }

    // 入力取得・表示
    document
      .getElementById("calcForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        const resultTotal = document.getElementById("result-total");
        const resultPerTime = document.getElementById("result-per-time");
        const resultWarning = document.getElementById("result-warning");

        const ageRaw = document.getElementById("age").value;
        const monthsRaw = document.getElementById("months").value;
        const weightRaw = document.getElementById("weight").value;

        // バリデーション
        if (ageRaw === "" || monthsRaw === "" || weightRaw === "") {
          resultWarning.innerHTML = "<b>年齢と体重を入力してください</b>";
          resultPerTime.innerHTML = "";
          resultTotal.innerHTML = "";
          return;
        }

        const age = parseInt(ageRaw, 10);
        const months = parseInt(monthsRaw, 10);
        const weight = parseFloat(weightRaw);
        const status = document.querySelector(
          'input[name="status"]:checked',
        ).value;
        const food = selectedFood.id;
        const times = parseInt(
          document.querySelector('input[name="times"]:checked').value,
          10,
        );

        const feedingAmounts = calcFood(age, months, weight, status, food);
        const minFeedingAmounts = feedingAmounts[0];
        const maxFeedingAmounts = feedingAmounts[1];

        if (food == "unselected") {
          resultWarning.innerHTML = "<b>餌を選んでください</b>";
          resultPerTime.innerHTML = "";
          resultTotal.innerHTML = "";
        } else if (minFeedingAmounts == -1 && maxFeedingAmounts == -1) {
          resultWarning.innerHTML = "<b>この年齢には対応していません</b>";
          resultPerTime.innerHTML = "";
          resultTotal.innerHTML = "";
        } else if (maxFeedingAmounts == -1) {
          resultPerTime.innerHTML = `約<b>${Math.round(minFeedingAmounts / times)}</b>g`;
          resultTotal.innerHTML = `約<b>${minFeedingAmounts}</b>g`;
        } else {
          resultPerTime.innerHTML = `約<b>${Math.round(minFeedingAmounts / times)}-${Math.round(maxFeedingAmounts / times)}</b>g`;
          resultTotal.innerHTML = `約<b>${minFeedingAmounts}-${maxFeedingAmounts}</b>g`;
        }
      });
  });
});

// 計算
function calcFood(age, months, weight, status, food) {
  // 結果が一つの値なら、値をfeedingAmounts[0]に格納しfeedingAmounts[1]に-1を代入する
  // 結果が範囲なら、最小値をfeedingAmounts[0]、最大値をfeedingAmounts[1]に代入する
  let feedingAmounts = [];
  const isKitten = age == 0 || (age == 1 && months == 0);

  switch (food) {
    case "neko_genki_fish_mix_dry":
      feedingAmounts = calcNekoGenkiFishMixDry(age, months, weight);
      break;

    case "kalkan_tuna_wet_kitten":
      if (isKitten) {
        feedingAmounts = calcKalkanTunaWetKitten(months, weight);
      }
      break;
    case "beauty_pro_dry_kitten":
      if (isKitten) {
        feedingAmounts = calcBeautyProDryKitten(months, weight);
      }
      break;
    default:
      feedingAmounts = [-1, -1];
  }

  return feedingAmounts;
}

function calcNekoGenkiFishMixDry(age, months, weight) {
  const foodAmountPerWeight = {
    2: [45, 65], // 2kg台、以下同様
    3: [65, 80],
    4: [80, 95],
    5: [95, 110],
    6: [110, 120],
  };

  if (status == "pregnancy") {
    // 妊娠期
    return calcNekoGenkiFishMixDryPregnancy(age, weight, foodAmountPerWeight);
  } else if (status == "nursing") {
    // 授乳期
    return calcNekoGenkiFishMixDryNursing(age, weight, foodAmountPerWeight);
  } else if (age == 0) {
    // 幼猫
    return calcNekoGenkiFishMixDryKitten(months);
  } else if (1 <= age && age <= 6) {
    // 成猫
    return calcNekoGenkiFishMixDryAdult(age, weight, foodAmountPerWeight);
  } else if (age >= 7) {
    // シニア
    return calcNekoGenkiFishMixDrySenior(age, weight, foodAmountPerWeight);
  } else {
    return [-1, -1];
  }
}

function calcNekoGenkiFishMixDryPregnancy(age, weight, foodAmountPerWeight) {
  const minFeedingRate = 1.2;
  const maxFeedingRate = 1.5;

  let feedingAmounts = foodAmountPerWeight[Math.trunc(weight)];
  feedingAmounts[0] *= minFeedingRate;
  feedingAmounts[1] *= maxFeedingRate;

  return feedingAmounts;
}

function calcNekoGenkiFishMixDryNursing(age, weight, foodAmountPerWeight) {
  const minFeedingRate = 2;
  const maxFeedingRate = 3;

  let feedingAmounts = foodAmountPerWeight[Math.trunc(weight)];
  feedingAmounts[0] *= minFeedingRate;
  feedingAmounts[1] *= maxFeedingRate;

  return feedingAmounts;
}

function calcNekoGenkiFishMixDryKitten(months) {
  if (1 <= months && months < 3) {
    return [35, 65];
  } else if (3 <= months && months < 6) {
    return [65, 85];
  } else if (6 <= months && months < 9) {
    return [80, 95];
  } else if (9 <= months && months < 12) {
    return [85, 110];
  } else {
    return [-1, -1];
  }
}

function calcNekoGenkiFishMixDryAdult(age, weight, foodAmountPerWeight) {
  return foodAmountPerWeight[Math.trunc(weight)];
}

function calcNekoGenkiFishMixDrySenior(age, weight, foodAmountPerWeight) {
  const minFeedingRate = 0.8;
  const maxFeedingRate = 1;

  let feedingAmounts = foodAmountPerWeight[Math.trunc(weight)];
  feedingAmounts[0] *= minFeedingRate;
  feedingAmounts[1] *= maxFeedingRate;

  return feedingAmounts;
}

function calcKalkanTunaWetKitten(months) {
  if (2 <= months && months < 3) {
    return [309, -1];
  } else if (3 <= months && months < 4) {
    return [369, -1];
  } else if (4 <= months && months < 6) {
    return [420, -1];
  } else if (6 <= months && months <= 12) {
    return [372, -1];
  } else {
    return [-1, -1];
  }
}

function calcBeautyProDryKitten(months, weight) {
  if (1 <= months && months < 6) {
    const feedingAmount = weight * 30 + 35;
    return [feedingAmount, -1];
  } else if (6 <= months && months <= 12) {
    const feedingAmount = weight * 5 + 81;
    return [feedingAmount, -1];
  } else {
    return [-1, -1];
  }
}
