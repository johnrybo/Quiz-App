"use strict";
class GameOverView {
    constructor() {
        this.gameWrapper = document.createElement("div");
        this.gameWrapper.classList.add("over-view", "game-wrapper");
        this.highScore = document.createElement("div");
        this.highScore.classList.add("view-highscore");
        this.restartGame = document.createElement("button");
        this.restartGame.classList.add("all-buttons");
        this.restartGame.innerHTML = "PLAY AGAIN";
        this.gameWrapper.appendChild(this.highScore);
        this.gameWrapper.appendChild(this.restartGame);
    }
    run() {
        this.gameWrapper.appendChild(gameState.soundBar);
        this.gameWrapper.appendChild(gameState.logoImage);
        gameState.logoImage.classList.add("logo-img-absolute");
        this.updateText();
        this.getHighScoreFromLS();
        document.body.appendChild(this.gameWrapper);
        this.restartGame.addEventListener("click", () => {
            location.reload();
        });
    }
    hide() {
        document.body.removeChild(this.gameWrapper);
    }
    updateText() {
        let scoreLS = JSON.parse(localStorage.getItem("score"));
        if (gameState.winner == gameState.playerName) {
            this.highScore.innerHTML =
                "Good job, " +
                    scoreLS.player +
                    ". Feast your eyes on your score: " +
                    scoreLS.score;
        }
        else {
            this.highScore.innerText = gameState.winner + " won!";
        }
    }
    getHighScoreFromLS() {
        let highScoreLS = JSON.parse(localStorage.getItem("highscore"));
        let highScoreTable = document.createElement("table");
        let th1 = document.createElement("th");
        let th2 = document.createElement("th");
        th1.innerText = "Name";
        th2.innerText = "Score";
        highScoreTable.appendChild(th1);
        highScoreTable.appendChild(th2);
        let highScoreTop5;
        if (highScoreLS !== null) {
            highScoreLS.sort((a, b) => a.score - b.score);
            highScoreTop5 = highScoreLS.slice(0, 5);
        }
        else {
            highScoreTop5 = [];
        }
        for (const hs of highScoreTop5) {
            let tr = document.createElement("tr");
            let cell1 = document.createElement("td");
            let cell2 = document.createElement("td");
            cell1.innerHTML = hs.player;
            cell2.innerHTML = hs.score;
            tr.appendChild(cell1);
            tr.appendChild(cell2);
            highScoreTable.appendChild(tr);
        }
        this.highScore.append(highScoreTable);
    }
}
class GameView {
    constructor() {
        this.gameWrapper = document.createElement("div");
        this.gameWrapper.classList.add("game-wrapper", "left");
        this.leader = new Leader();
        this.min = 1;
        this.max = 100;
        this.correctNumber = this.leader.correctNumber;
        this.inputWrapper = document.createElement("div");
        this.inputField = document.createElement("input");
        this.userNumber = this.getUserInput();
        this.textBox = document.createElement("span");
        this.textBox.classList.add("textBox");
        this.textBox.innerText = "Guess a number between 1-100!";
        this.guessButton = document.createElement("button");
        this.guessButton.classList.add("all-buttons");
        this.guessButton.innerHTML = "Guess";
        this.guessCountElement = document.createElement("span");
        this.guessCountElement.innerText = "Guess count: ";
        this.guessCountElement.classList.add("guess-counter");
        this.inputWrapper.appendChild(this.inputField);
        this.inputWrapper.appendChild(this.guessButton);
        this.inputWrapper.classList.add("input-wrapper");
        this.opponents = [
            new Opponent("Mr Tweedle-Dumb", "dumb", "/images/stickman-1.png"),
            new Opponent("Mr Random Rambo", "random", "/images/stickman-3.png"),
            new Opponent("Mr Smarty-Pants", "smart", "/images/stickman-2.png"),
        ];
        this.opponentWrapper = document.createElement("div");
        this.opponentWrapper.classList.add("opponents");
        for (const op of this.opponents) {
            this.opponentWrapper.appendChild(op.wrapper);
        }
        this.timeIsUp = false;
        this.timerElement = document.createElement("p");
        this.timerElement.classList.add("timer");
        this.s = 10;
        this.ms = 0;
        this.countDown = 0;
        this.gameWrapper.appendChild(this.textBox);
        this.gameWrapper.appendChild(this.inputWrapper);
        this.gameWrapper.appendChild(this.guessCountElement);
        this.gameWrapper.appendChild(this.leader.wrapper);
        this.gameWrapper.appendChild(this.timerElement);
        this.gameWrapper.appendChild(this.opponentWrapper);
    }
    run() {
        this.guessCountElement.innerText = "Guess count: " + String(gameState.guessCount);
        this.gameWrapper.appendChild(gameState.soundBar);
        this.gameWrapper.appendChild(gameState.logoImage);
        gameState.logoImage.classList.remove("logo-img-start");
        gameState.logoImage.classList.add("logo-img-absolute");
        document.body.appendChild(this.gameWrapper);
        console.log(this.correctNumber);
        this.startTimer();
        setInterval(() => {
            if (this.timeIsUp) {
                this.stopTimer;
                this.userNumber = 0;
                this.getUserAnswer();
                this.getOpponentAnswers();
                this.timeIsUp = false;
            }
        }, 1000);
        this.guessButton.addEventListener("click", () => {
            this.stopTimer();
            this.getUserAnswer();
            if (this.userNumber != this.correctNumber) {
                setTimeout(() => {
                    this.getOpponentAnswers();
                }, 2000);
            }
            this.inputField.value = "";
        });
        window.addEventListener("keydown", (e) => {
            if (e.defaultPrevented) {
                return;
            }
            if (e.key === "Enter") {
                this.stopTimer();
                this.gameWrapper.appendChild(this.opponentWrapper);
                this.getUserAnswer();
                if (this.userNumber != this.correctNumber) {
                    setTimeout(() => {
                        this.getOpponentAnswers();
                    }, 2000);
                }
                this.inputField.value = "";
            }
            else {
                return;
            }
            e.preventDefault();
        });
    }
    hide() {
        document.body.removeChild(this.gameWrapper);
    }
    runNextRound() {
        this.startTimer();
        this.printLeaderResponse(gameState.playerName + ", please guess again!");
        setInterval(() => {
            if (this.timeIsUp) {
                this.stopTimer;
                this.userNumber = 0;
                this.gameWrapper.appendChild(this.opponentWrapper);
                this.getUserAnswer();
                setTimeout(() => {
                    this.getOpponentAnswers();
                }, 2000);
                this.timeIsUp = false;
            }
        }, 1000);
    }
    updateMinMax(guess) {
        if (this.leader.response === "higher" && guess >= this.min) {
            this.min = guess + 1;
        }
        else if (this.leader.response === "lower" && guess <= this.max) {
            this.max = guess - 1;
        }
        else {
            return;
        }
    }
    stopTimer() {
        this.guessButton.style.opacity = "0";
        this.timeIsUp = false;
        this.gameWrapper.removeChild(this.timerElement);
        clearInterval(this.countDown);
    }
    startTimer() {
        this.guessButton.style.opacity = "1";
        this.s = 10;
        this.timeIsUp = false;
        this.gameWrapper.appendChild(this.timerElement);
        this.countDown = setInterval(() => {
            this.timer();
        }, 10);
    }
    timer() {
        if (this.ms === 0) {
            this.ms = 99;
            this.s -= 1;
        }
        this.ms -= 1;
        this.timerElement.innerText = String(this.s) + ":" + String(this.ms);
        if (this.s < 5) {
            this.timerElement.style.color = "red";
        }
        else {
            this.timerElement.style.color = "black";
        }
        if (this.s === 0 && this.ms === 0) {
            clearInterval(this.countDown);
            this.timeIsUp = true;
        }
    }
    getUserInput() {
        const input = Number(this.inputField.value);
        if (input > 100 || isNaN(input)) {
            return 12345;
        }
        else {
            return input;
        }
    }
    getUserAnswer() {
        this.updateGuessCount();
        this.userNumber = this.getUserInput();
        if (this.userNumber === this.correctNumber) {
            setTimeout(() => {
                this.printWinnerMessage(gameState.playerName);
                this.updateLocalStorage();
            }, 1500);
        }
        const response = this.leader.getResponse(this.userNumber, String(localStorage.getItem("name")));
        this.printLeaderResponse(response);
        this.updateMinMax(this.userNumber);
    }
    printWinnerMessage(opponentName) {
        const winnerText = document.createElement("h4");
        winnerText.classList.add("xtext");
        winnerText.innerHTML = opponentName + ", you are the winner!";
        gameState.winner = opponentName;
        this.gameWrapper.appendChild(winnerText);
        setTimeout(() => {
            gameState.updateView("over");
        }, 500);
    }
    getOpponentAnswers() {
        for (let i = 0; i < this.opponents.length; i++) {
            let op = this.opponents[i];
            setTimeout(() => {
                if (op) {
                    if ((op === null || op === void 0 ? void 0 : op.personality) === "dumb") {
                        op.getDumbGuess(this.userNumber, this.correctNumber);
                    }
                    else if (op.personality === "random") {
                        op.getRandomGuess();
                    }
                    else {
                        op.getSmartGuess(this.min, this.max);
                    }
                    const response = this.leader.getResponse(op.guess, op.name);
                    this.printLeaderResponse(response);
                    this.updateMinMax(op.guess);
                    setTimeout(() => {
                        if ((op === null || op === void 0 ? void 0 : op.guess) === this.correctNumber) {
                            this.printWinnerMessage(op.name);
                        }
                    }, 1000);
                    if (i === 2 && (op === null || op === void 0 ? void 0 : op.guess) != this.correctNumber) {
                        setTimeout(() => {
                            this.runNextRound();
                        }, 2000);
                    }
                }
            }, 2000 * i);
        }
    }
    updateGuessCount() {
        gameState.guessCount++;
        this.guessCountElement.innerText = "Guess count: " + String(gameState.guessCount);
    }
    printLeaderResponse(response) {
        if (this.leader.responseWrapper.childNodes.length === 1) {
            this.leader.responseWrapper.innerHTML = "";
        }
        const responseWrapper = document.createElement("div");
        responseWrapper.classList.add("response-bubble");
        const responseElem = document.createElement("p");
        responseElem.innerText = response;
        responseWrapper.appendChild(responseElem);
        this.leader.responseWrapper.appendChild(responseWrapper);
        this.leader.wrapper.appendChild(this.leader.responseWrapper);
    }
    updateLocalStorage() {
        let players = JSON.parse(localStorage.getItem("highscore"));
        let player = localStorage.getItem("name");
        let score = gameState.guessCount;
        let playerObject = {
            player: player,
            score: score,
        };
        if (players == null) {
            players = [playerObject];
        }
        else {
            players.push(playerObject);
        }
        localStorage.setItem("score", JSON.stringify(playerObject));
        localStorage.setItem("highscore", JSON.stringify(players));
    }
}
class Leader {
    constructor() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("leader");
        this.wrapper.innerHTML =
            '<img src="./images/gamemaster.png "width= 100%">';
        this.responseWrapper = document.createElement("div");
        this.responseWrapper.classList.add("leader-response");
        this.response = "";
        this.responseText = "";
        this.correctNumber = this.getCorrectNumber();
    }
    getCorrectNumber() {
        return Math.floor(Math.random() * (100 - 1) + 1);
    }
    getResponse(guess, name) {
        if (guess === 12345) {
            return name + ", hey stupid, guess a number between 1 - 100!";
        }
        if (guess > this.correctNumber) {
            this.response = "lower";
            return name + ", please guess a lower number!";
        }
        else if (guess < this.correctNumber && guess !== 0) {
            this.response = "higher";
            return name + ", please guess a higher number!";
        }
        else if (guess === 0) {
            this.response = "higher";
            return name + ", your time ran out!";
        }
        else {
            this.response = "correct";
            return name + ", you are correct!";
        }
    }
}
class Opponent {
    constructor(name, personality, imageSrc) {
        this.wrapper = document.createElement("div");
        this.image = document.createElement("img");
        this.textElement = document.createElement("div");
        this.nameElement = document.createElement("p");
        this.guessElement = document.createElement("p");
        this.guessElement.innerText = "-";
        this.textElement.classList.add("text-element");
        this.guessElement.classList.add("bold-numbers");
        this.wrapper.classList.add("opponent");
        this.imageSrc = imageSrc;
        this.image.src = this.imageSrc;
        this.image.classList.add("opponent-image");
        this.name = name;
        this.personality = personality;
        this.nameElement.innerText = this.name;
        this.guess = 0;
        this.textElement.appendChild(this.nameElement);
        this.textElement.append(this.guessElement);
        this.wrapper.appendChild(this.image);
        this.wrapper.appendChild(this.textElement);
    }
    getDumbGuess(previousGuess, correctNumber) {
        if (previousGuess > correctNumber) {
            this.guess = previousGuess - 1;
        }
        else {
            this.guess = previousGuess + 1;
        }
        setTimeout(() => {
            this.printGuess();
        }, 0);
    }
    getRandomGuess() {
        const min = Math.ceil(1);
        const max = Math.floor(100);
        this.guess = Math.floor(Math.random() * (max - min) + min);
        setTimeout(() => {
            this.printGuess();
        }, 0);
    }
    getSmartGuess(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        this.guess = Math.floor(Math.random() * (max - min) + min);
        setTimeout(() => {
            this.printGuess();
        }, 0);
    }
    printGuess() {
        this.guessElement.innerText = String(this.guess);
    }
}
class StartView {
    constructor() {
        this.gameWrapper = document.createElement("div");
        this.gameWrapper.classList.add("game-wrapper", "start-view");
        this.gameInstructions = document.createElement("p");
        this.enterNameText = document.createElement("p");
        this.startGameButton = document.createElement("button");
        this.startGameButton.classList.add("all-buttons");
        this.presentOpponent = document.createElement("div");
        this.presentOpponent1 = document.createElement("span");
        this.presentOpponent2 = document.createElement("span");
        this.presentOpponent3 = document.createElement("span");
        this.presentOpponent.classList.add("present-opponent");
        this.presentOpponent1.classList.add("start-opponent");
        this.presentOpponent2.classList.add("start-opponent");
        this.presentOpponent3.classList.add("start-opponent");
        this.presentOpponent.classList.add("present-opponent1", "present-opponent2", "present-opponent3");
        this.presentOpponent1.innerHTML =
            '<img src="./images/stickman-1.png" width="30%" ">' +
                "<br>" +
                "Mr Tweedle-Dumb. Not too clever and seems a bit overly cautious, as their guesses never stray too far from their previous one.";
        this.presentOpponent2.innerHTML =
            '<img src="./images/stickman-2.png" width="26%" ">' +
                "<br>" +
                "Mr Smarty-Pants. The most clever out of the bunch and fancies themself your true competition. An astute thinker coupled with good memory who will provide you a real challenge in the race.";
        this.presentOpponent3.innerHTML =
            '<img src="./images/stickman-3.png" width="30%" ">' +
                "<br>" +
                "Mr Random Rambo. More action! Less thinking! Will pick any number that happens to appear in their headspace. No logic, all luck.";
        this.startGameButton.innerHTML = "START GAME";
        this.inputName = document.createElement("input");
        this.inputName.classList.add("nameInput");
        this.gameInstructions.classList.add("gameInstructions");
        this.gameInstructions.innerText =
            "Your goal in this game is to discover the correct number, hidden somewhere between 1-100. Start your guessing game by picking any number in that range. The game leader will then let you know if you've hit the mark or if you need to guess again and prompt you to go higher or lower. You're up against three opponents who will also take turns guessing. I'm not sure if telling you this is cheating, but you're all looking for the same number and you can use their guesses to your advantage.";
        this.enterNameText.classList.add("name");
        this.enterNameText.innerHTML = "Enter your name:";
        document.body.appendChild(this.gameWrapper);
    }
    run() {
        this.gameWrapper.appendChild(gameState.soundBar);
        this.gameWrapper.appendChild(gameState.logoImage);
        this.gameWrapper.appendChild(this.presentOpponent);
        this.presentOpponent.appendChild(this.presentOpponent1);
        this.presentOpponent.appendChild(this.presentOpponent2);
        this.presentOpponent.appendChild(this.presentOpponent3);
        this.gameWrapper.appendChild(this.gameInstructions);
        this.gameWrapper.appendChild(this.enterNameText);
        this.gameWrapper.appendChild(this.inputName);
        this.gameWrapper.appendChild(this.startGameButton);
        gameState.logoImage.classList.add("logo-img-start");
        document.body.appendChild(this.gameWrapper);
        this.startGameButton.addEventListener("click", () => {
            gameState.playerName = this.inputName.value;
            localStorage.setItem("name", gameState.playerName);
            gameState.updateView("game");
        });
    }
    hide() {
        document.body.removeChild(this.gameWrapper);
    }
}
class GameState {
    constructor() {
        this.currentView = "start";
        this.startView = new StartView();
        this.gameView = new GameView();
        this.gameOverView = new GameOverView();
        this.playerName = "";
        this.winner = "";
        this.guessCount = 0;
        this.soundBar = document.createElement("div");
        this.soundBar.innerHTML = "Music:";
        this.soundBar.classList.add("sound-bar");
        this.playButton = document.createElement("button");
        this.playButton.innerHTML = "On";
        this.playButton.classList.add("sound-buttons");
        this.backgroundMusic = new Audio("./Music/takeonme.mp3");
        this.pauseButton = document.createElement("button");
        this.pauseButton.innerHTML = "Off";
        this.pauseButton.classList.add("sound-buttons");
        this.soundBar.appendChild(this.playButton);
        this.soundBar.appendChild(this.pauseButton);
        this.logoImage = document.createElement("img");
        this.logoImage.src = "./images/logo.png";
        this.playButton.addEventListener("click", () => {
            this.backgroundMusic.play();
        });
        this.pauseButton.addEventListener("click", () => {
            this.backgroundMusic.pause();
        });
    }
    runGame() {
        if (this.currentView === "start") {
            this.startView.run();
        }
        if (this.currentView === "game") {
            this.gameView.run();
        }
        if (this.currentView === "over") {
            this.gameOverView.run();
        }
    }
    updateView(view) {
        this.currentView = view;
        if (this.currentView === "start") {
            this.gameOverView.hide();
            this.startView.run();
        }
        else if (this.currentView === "game") {
            this.startView.hide();
            this.gameView.run();
        }
        else if (this.currentView === "over") {
            this.gameView.hide();
            this.gameOverView.run();
        }
    }
}
const gameState = new GameState();
window.addEventListener("load", () => {
    gameState.runGame();
});
class User {
}
//# sourceMappingURL=bundle.js.map