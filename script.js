// //1.ランダムにおみくじ画像のパスを返す処理
// function getRandomImage(){
//     const number=Math.floor(Math.random()*7);
//     const imagePath ="./" + number.toString() + ".png";
//     return imagePath
// }

// function playOmikuji(){
//     const bgm = document.getElementById('bgm'); // BGM要素を取得
//     // const drawSound = document.getElementById('draw-sound'); // 効果音要素を取得（追加する場合）

//     // おみくじを引くときに効果音を鳴らす（オプション）
//     // if (drawSound) {
//     //     drawSound.currentTime = 0; // 最初から再生
//     //     drawSound.play();
//     // }

//     // BGMがまだ再生されていない場合のみ再生を開始
//     if (bgm && bgm.paused) {
//         bgm.play().catch(e => console.error("BGM再生エラー:", e)); // エラーハンドリングを追加
//     }

//     const timer = setInterval(function(){
//         document.querySelector("#js-result").setAttribute("src",getRandomImage());
//     },100);

//     setTimeout(function(){
//         clearInterval(timer)
//     },3000);
// }

// document.querySelector("#js-button").addEventListener("click",playOmikuji)
// document.getElementById('bgm').play();
//1.ランダムにおみくじ画像のパスを返す処理
function getRandomImage(){
    const number = Math.floor(Math.random() * 7);
    const imagePath = "./" + number.toString() + ".png";
    return imagePath
}

function playOmikuji(){
    const drawSound = document.getElementById('draw-sound');

    if (drawSound) {
        drawSound.currentTime = 0;
        drawSound.play();
    }

    const timer = setInterval(function(){
        document.querySelector("#js-result").setAttribute("src",getRandomImage());
    },100);

    setTimeout(function(){
        clearInterval(timer);
    },5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const bgm = document.getElementById('bgm');
    const toggleBgmButton = document.getElementById('toggle-bgm-button');

    // BGM ON/OFFボタンのイベントリスナー
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