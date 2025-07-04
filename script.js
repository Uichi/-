// script.js

//1.ランダムにおみくじ画像のパスと対応するaltテキストを返す処理
const OMIKUJI_ALT_TEXTS = [
    "大凶の画像", "凶の画像", "末吉の画像", "小吉の画像", "中吉の画像", "吉の画像", "大吉の画像"
];
const NUM_OMIKUJI_IMAGES = OMIKUJI_ALT_TEXTS.length;
const BEST_RESULT_INDEX = 6;

function getRandomImageInfo(){
    const number = Math.floor(Math.random() * NUM_OMIKUJI_IMAGES);
    const imagePath = "./" + number.toString() + ".png";
    return {
        path: imagePath,
        alt: OMIKUJI_ALT_TEXTS[number],
        index: number
    };
}

// ★新規追加: パーティクル生成関数★
function createParticles(containerElement, count = 20) {
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-container');
    containerElement.insertBefore(particleContainer, containerElement.firstChild); // omikuji要素の最初の子要素として追加

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 8 + 4; // 4pxから12pxのランダムなサイズ
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`; // 横方向の開始位置をランダムに
        particle.style.animationDelay = `${Math.random() * 0.5}s`; // アニメーション開始をずらす
        particle.style.animationDuration = `${Math.random() * 1 + 1.5}s`; // アニメーション時間をずらす

        particleContainer.appendChild(particle);
    }

    // アニメーション終了後にパーティクルコンテナを削除
    setTimeout(() => {
        particleContainer.remove();
    }, 2000); // アニメーション時間に合わせて調整
}


function playOmikuji(){
    const bgm = document.getElementById('bgm');
    const drawSound = document.getElementById('draw-sound');
    const resultImage = document.querySelector("#js-result");
    const omikujiContainer = document.querySelector(".omikuji");
    const omikujiButton = document.querySelector("#js-button");

    omikujiButton.disabled = true;

    resultImage.classList.remove('is-final-result');
    omikujiContainer.classList.remove('show-lights', 'best-result');

    // 既存のパーティクルがあれば削除
    const existingParticles = omikujiContainer.querySelector('.particle-container');
    if (existingParticles) {
        existingParticles.remove();
    }


    if (drawSound) {
        drawSound.currentTime = 0;
        drawSound.play();
    }

    if (bgm && bgm.paused) {
        bgm.play().catch(e => console.error("BGM再生エラー:", e));
    }

    const finalOmikujiResult = getRandomImageInfo();

    let intervalCount = 0;
    const maxIntervals = 20;
    const timer = setInterval(function(){
        resultImage.classList.add('is-changing');
        setTimeout(() => {
            let currentImagePath;
            let currentAltText;
            if (intervalCount < maxIntervals - 1) {
                const tempResult = getRandomImageInfo();
                currentImagePath = tempResult.path;
                currentAltText = tempResult.alt;
            } else {
                currentImagePath = finalOmikujiResult.path;
                currentAltText = finalOmikujiResult.alt;
            }
            resultImage.setAttribute("src", currentImagePath);
            resultImage.setAttribute("alt", currentAltText);
            resultImage.classList.remove('is-changing');
        }, 50);

        intervalCount++;
        if (intervalCount >= maxIntervals) {
            clearInterval(timer);
            
            resultImage.setAttribute("src", finalOmikujiResult.path);
            resultImage.setAttribute("alt", finalOmikujiResult.alt);

            if (finalOmikujiResult.index === BEST_RESULT_INDEX) {
                omikujiContainer.classList.add('best-result');
                createParticles(omikujiContainer, 30); // ★最高の運勢の時にパーティクルを生成★
            }

            resultImage.classList.add('is-final-result');
            omikujiContainer.classList.add('show-lights');

            setTimeout(() => {
                omikujiButton.disabled = false;
            }, 1500);
        }
    },100);
}

document.addEventListener('DOMContentLoaded', () => {
    const bgm = document.getElementById('bgm');
    const toggleBgmButton = document.getElementById('toggle-bgm-button');
    const resetButton = document.getElementById('reset-button');

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

    document.querySelector("#js-result").setAttribute("src", "./omikuzi.png");
    document.querySelector("#js-result").setAttribute("alt", "おみくじの箱");

    document.querySelector("#js-button").addEventListener("click", playOmikuji);

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            document.querySelector("#js-result").setAttribute("src", "./omikuzi.png");
            document.querySelector("#js-result").setAttribute("alt", "おみくじの箱");
            document.querySelector(".omikuji").classList.remove('show-lights', 'best-result');
            document.querySelector("#js-result").classList.remove('is-final-result');
            document.querySelector("#js-button").disabled = false;
            // リセット時にもパーティクルコンテナがあれば削除
            const existingParticles = document.querySelector('.omikuji .particle-container');
            if (existingParticles) {
                existingParticles.remove();
            }
        });
    }
});