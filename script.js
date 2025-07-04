//1.ランダムにおみくじ画像のパスを返す処理
function getRandomImage(){
    const number = Math.floor(Math.random() * 7);
    const imagePath = "./" + number.toString() + ".png";
    return imagePath
}

function playOmikuji(){
    const bgm = document.getElementById('bgm');
    const drawSound = document.getElementById('draw-sound');
    const resultImage = document.querySelector("#js-result");
    const omikujiContainer = document.querySelector(".omikuji"); // .omikuji要素を取得

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
            resultImage.setAttribute("src", getRandomImage());
            resultImage.classList.remove('is-changing');
        }, 50);

        intervalCount++;
        if (intervalCount >= maxIntervals) {
            clearInterval(timer);
            // 最終結果が表示された後にアニメーションクラスを付与
            resultImage.classList.add('is-final-result');
            omikujiContainer.classList.add('show-lights'); // 結果が出たときに光のクラスを追加

            // ★この setTimeout ブロックを削除しました。光が出っぱなしになります。★
            // setTimeout(() => {
            //     omikujiContainer.classList.remove('show-lights');
            // }, 1000);
        }
    },100);
}

document.addEventListener('DOMContentLoaded', () => {
    const bgm = document.getElementById('bgm');
    const toggleBgmButton = document.getElementById('toggle-bgm-button');

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
    document.querySelector("#js-button").addEventListener("click", playOmikuji);
});