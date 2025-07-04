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

// パーティクル生成関数
function createParticles(containerElement, count = 20) {
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particle-container');
    containerElement.insertBefore(particleContainer, containerElement.firstChild);

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        particle.style.animationDuration = `${Math.random() * 1 + 1.5}s`;

        particleContainer.appendChild(particle);
    }

    setTimeout(() => {
        particleContainer.remove();
    }, 2000);
}

// ★新規追加: 光の筋生成関数★
function createLightStreaks(containerElement, count = 10) {
    const backgroundEffectContainer = document.createElement('div');
    backgroundEffectContainer.classList.add('background-effect-container');
    // bodyの最初の子要素として追加し、おみくじボックスの背後になるようにする
    document.body.insertBefore(backgroundEffectContainer, document.body.firstChild);

    for (let i = 0; i < count; i++) {
        const streak = document.createElement('div');
        streak.classList.add('light-streak');
        streak.style.left = `${Math.random() * 100}%`; // 横方向の開始位置をランダムに
        streak.style.animationDelay = `${Math.random() * 3}s`; // アニメーション開始をずらす
        streak.style.animationDuration = `${Math.random() * 2 + 3}s`; // アニメーション時間をずらす
        backgroundEffectContainer.appendChild(streak);
    }

    // エフェクト終了（またはリセット時）にコンテナを削除するために、参照を保持しない
    // playOmikujiの初期化とresetButtonの処理で削除する
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
    document.body.classList.remove('best-result-bg'); // ★新規追加: bodyの背景クラスもリセット★

    // 既存のパーティクルがあれば削除
    const existingParticles = omikujiContainer.querySelector('.particle-container');
    if (existingParticles) {
        existingParticles.remove();
    }
    // ★新規追加: 既存の背景エフェクトがあれば削除★
    const existingBgEffect = document.body.querySelector('.background-effect-container');
    if (existingBgEffect) {
        existingBgEffect.remove();
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
                createParticles(omikujiContainer, 30);
                document.body.classList.add('best-result-bg'); // ★新規追加: bodyに背景クラス追加★
                createLightStreaks(document.body, 15); // ★新規追加: 光の筋を生成★
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
            // ★新規追加: リセット時に背景エフェクトも削除★
            const existingBgEffect = document.body.querySelector('.background-effect-container');
            if (existingBgEffect) {
                existingBgEffect.remove();
            }
            document.body.classList.remove('best-result-bg'); // ★新規追加: bodyの背景クラスもリセット★
        });
    }
});