function initGameData() {
    const defaultData = {
        currentLevel: 1,
        points: 0,
        energy: 5,
        lastEnergyUpdate: Date.now(),
        chapterUnlockTimes: {
            2: Date.now() + 24 * 60 * 60 * 1000, // +24 часа
            3: Date.now() + 48 * 60 * 60 * 1000  // +48 часов
        }
    };
    
    localStorage.setItem('gameData', JSON.stringify(defaultData));
    return defaultData;
}

function updateEnergy() {
    const gameData = JSON.parse(localStorage.getItem('gameData')) || initGameData();
    const now = Date.now();
    const timeDiff = now - gameData.lastEnergyUpdate;
    const energyToAdd = Math.floor(timeDiff / (15 * 60 * 1000)); // +1 энергия каждые 15 минут
    
    if (energyToAdd > 0) {
        gameData.energy = Math.min(5, gameData.energy + energyToAdd);
        gameData.lastEnergyUpdate = now;
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }
    
    return gameData.energy;
}

function getEnergy() {
    const gameData = JSON.parse(localStorage.getItem('gameData')) || initGameData();
    updateEnergy();
    return gameData.energy;
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    return {
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
    };
}

function saveGameProgress(level, points) {
    const gameData = JSON.parse(localStorage.getItem('gameData')) || initGameData();
    gameData.currentLevel = Math.max(gameData.currentLevel, level);
    gameData.points = points;
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

function unlockNextChapter(currentChapter) {
    const gameData = JSON.parse(localStorage.getItem('gameData')) || initGameData();
    const nextChapter = currentChapter + 1;
    
    if (!gameData.chapterUnlockTimes[nextChapter]) {
        const unlockTime = Date.now() + 24 * 60 * 60 * 1000; // +24 часа
        gameData.chapterUnlockTimes[nextChapter] = unlockTime;
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }
    
    return nextChapter;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('gameData')) {
        updateEnergy();
    } else {
        initGameData();
    }
});