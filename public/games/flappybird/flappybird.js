let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408/228 clutching = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -1.5; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.08; //bird gravity (was 0.1, reduced for slower fall)

let gameOver = false;
let score = 0;
let gameState = 'splash'; //splash, playing
let splashTimer = 4000; //4 seconds in milliseconds

window.onload = function() {
    board = document.getElementById("board");
    
    // Mobil uyumluluk için canvas boyutlarını ayarla
    boardWidth = Math.min(window.innerWidth, 360); // Maksimum 360px genişlik
    boardHeight = Math.min(window.innerHeight, 640); // Maksimum 640px yükseklik
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Canvas'ı cihaz piksel oranına göre ölçeklendir
    const dpr = window.devicePixelRatio || 1;
    board.style.width = boardWidth + 'px';
    board.style.height = boardHeight + 'px';
    board.width = boardWidth * dpr;
    board.height = boardHeight * dpr;
    context.scale(dpr, dpr);

    // Kuşun başlangıç pozisyonunu güncelle
    birdX = boardWidth/8;
    birdY = boardHeight/2;
    bird.x = birdX;
    bird.y = birdY;

    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        // Kuş resmi yüklendiğinde bir şey yapmamıza gerek yok, splash ekranı zaten çiziliyor
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Splash ekranını hemen çiz
    drawSplashScreen();

    // Splash ekranı için zamanlayıcı
    setTimeout(() => {
        gameState = 'playing';
        requestAnimationFrame(update);
        setInterval(placePipes, 1500);
    }, splashTimer);

    // Olay dinleyicileri
    document.addEventListener("keydown", moveBird);
    board.addEventListener("click", moveBird); // Fare tıklaması
    board.addEventListener("touchstart", moveBird); // Dokunmatik ekran
}

function drawSplashScreen() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    
    // Başlık
    context.font = "30px sans-serif";
    context.fillText("OTOBOT KUŞU", boardWidth/2, boardHeight/2 - 50);
    
    // Talimatlar
    context.font = "16px sans-serif";
    context.fillText("Bilgisayarda isen boşluk tuşu telefonda isen", boardWidth/2, boardHeight/2 + 20);
    context.fillText("ekrana tıklayarak kuş uçar.", boardWidth/2, boardHeight/2 + 40);
    
    // İyi eğlenceler
    context.font = "14px sans-serif";
    context.fillText("İyi Eğlenceler -Anıl", boardWidth/2, boardHeight/2 + 80);
}

function update() {
    requestAnimationFrame(update);
    
    if (gameState === 'splash') {
        drawSplashScreen();
        return;
    }

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("OYUN BİTTİ", 5, 90);
    }
}

function placePipes() {
    if (gameOver || gameState !== 'playing') {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = boardHeight/3;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (gameState !== 'playing') {
        return;
    }

    if (e.type === "click" || e.type === "touchstart" || e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        //jump
        velocityY = -4; //reduced from -8 to prevent excessive jumping

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }

        // Dokunmatik olaylarda varsayılan davranışı engelle
        if (e.type === "touchstart") {
            e.preventDefault();
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}