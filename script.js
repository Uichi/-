//1.ランダムにおみくじ画像のパスと対応するaltテキストを返す処理
// おみくじ画像が0.pngから6.pngまであると仮定し、対応するaltテキストを定義
const OMIKUJI_ALT_TEXTS = [
    "大吉の画像", "中吉の画像", "小吉の画像", "吉の画像", "末吉の画像", "凶の画像", "大凶の画像"
];
const NUM_OMIKUJI_IMAGES = OMIKUJI_ALT_TEXTS.length; // 画像の枚数とaltテキストの数を合わせる

function getRandomImageInfo(){
    const number = Math.floor(Math.random() * NUM_OMIKUJI_IMAGES);
    const imagePath = "./" + number.toString() + ".png";
    return {
        path: imagePath,
        alt: OMIKUJI_ALT_TEXTS[number]
    };
}

function playOmikuji(){
    const bgm = document.getElementById('bgm');
    const drawSound = document.getElementById('draw-sound');
    const resultImage = document.querySelector("#js-result");
    const omikujiContainer = document.querySelector(".omikuji");
    const omikujiButton = document.querySelector("#js-button"); // ボタン要素を取得

    // おみくじを引いている間はボタンを無効化
    omikujiButton.disabled = true;

    // 既存のアニメーションクラスをリセット
    resultImage.classList.remove('is-final-result');
    // おみくじを引く前に光のクラスを削除 (再度引く場合はリセットされる)
    omikujiContainer.classList.remove('show-lights');
    
    if (drawSound) {
        drawSound.currentTime = 0;
        drawSound.play();
    }

    if (bgm && bgm.paused) {
        bgm.play().catch(e => console.error("BGM再生エラー:", e));
    }

    let intervalCount = 0;
    const maxIntervals = 20; // 2秒で表示
    const timer = setInterval(function(){
        resultImage.classList.add('is-changing');
        setTimeout(() => {
            const { path } = getRandomImageInfo(); // 画像パスのみ取得
            resultImage.setAttribute("src", path);
            resultImage.classList.remove('is-changing');
        }, 50);

        intervalCount++;
        if (intervalCount >= maxIntervals) {
            clearInterval(timer);
            // 最終結果を取得し、画像とalt属性を設定
            const finalResult = getRandomImageInfo();
            resultImage.setAttribute("src", finalResult.path);
            resultImage.setAttribute("alt", finalResult.alt); // alt属性を設定

            // 最終結果が表示された後にアニメーションクラスを付与
            resultImage.classList.add('is-final-result');
            omikujiContainer.classList.add('show-lights'); // 結果が出たときに光のクラスを追加

            // 数秒後にボタンを再度有効化（クールダウン）
            setTimeout(() => {
                omikujiButton.disabled = false;
            }, 1500); // 1.5秒後にボタンを有効化
        }
    },100);
}

document.addEventListener('DOMContentLoaded', () => {
    const bgm = document.getElementById('bgm');
    const toggleBgmButton = document.getElementById('toggle-bgm-button');
    const resetButton = document.getElementById('reset-button'); // リセットボタン要素を取得

    if (toggleBgmButton) {
        toggleBgmButton.addEventListener('click', () => {
            if (bgm.paused) {
                bgm.play().catch(e => console.error("BGM再生エラー:", e));
                toggleBgmButton.textContent = "BGM OFF";
            } else {
                bgm.pause();
                toggleBgmButton.textContent = "BGM ON";
            }
        });
    }

    // 初期画像とalt属性を設定
    document.querySelector("#js-result").setAttribute("src", "./omikuzi.png");
    document.querySelector("#js-result").setAttribute("alt", "おみくじの箱");

    document.querySelector("#js-button").addEventListener("click", playOmikuji);

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            document.querySelector("#js-result").setAttribute("src", "./omikuzi.png");
            document.querySelector("#js-result").setAttribute("alt", "おみくじの箱");
            document.querySelector(".omikuji").classList.remove('show-lights');
            document.querySelector("#js-result").classList.remove('is-final-result');
            document.querySelector("#js-button").disabled = false; // ボタンを有効化
        });
    }
});