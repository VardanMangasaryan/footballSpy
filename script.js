// Football Spy Game - Main Script

// ============================================
// FALLBACK PLAYERS (used if API fails)
// ============================================
const footballPlayers = {
  easy: [
    "Lionel Messi","Cristiano Ronaldo","Neymar","Kylian Mbappé","Erling Haaland",
    "Mohamed Salah","Karim Benzema","Robert Lewandowski","Harry Kane","Luka Modrić",
    "Kevin De Bruyne","Sadio Mané","Virgil van Dijk","Luis Suárez","Antoine Griezmann",
    "Gareth Bale","Eden Hazard","Sergio Ramos","Gerard Piqué","Andrés Iniesta",
    "Xavi Hernández","Ronaldinho","Zinedine Zidane","David Beckham","Thierry Henry",
    "Ronaldo Nazário","Didier Drogba","Samuel Eto'o","Wayne Rooney","Zlatan Ibrahimović",
    "Manuel Neuer","Gianluigi Buffon","Iker Casillas","Marcelo","Dani Alves",
    "Paolo Maldini","Carles Puyol","Steven Gerrard","Frank Lampard","Andrea Pirlo",
    "Raúl González","Fernando Torres","David Villa","Arjen Robben","Franck Ribéry"
  ],

  medium: [
    "Mesut Özil","Angel Di María","Carlos Tevez","Mario Götze","Marco Reus",
    "Alexis Sánchez","Ivan Rakitić","Arturo Vidal","Radamel Falcao","James Rodríguez",
    "Yaya Touré","David Silva","Vincent Kompany","Diego Godín","Thomas Müller",
    "Toni Kroos","Casemiro","Sergio Busquets","Joshua Kimmich","N'Golo Kanté",
    "Romelu Lukaku","Pierre-Emerick Aubameyang","Memphis Depay","Hakim Ziyech","Riyad Mahrez",
    "Bruno Fernandes","Bernardo Silva","João Félix","Jude Bellingham","Pedri",
    "Gavi","Bukayo Saka","Vinícius Júnior","Rodrygo","Phil Foden",
    "Declan Rice","Jack Grealish","Mason Mount","Kai Havertz","Marcus Rashford",
    "Jadon Sancho","Frenkie de Jong","Matthijs de Ligt","Achraf Hakimi","Theo Hernández"
  ],

  hard: [
    "Wesley Sneijder","Robin van Persie","Ruud van Nistelrooy","Patrick Kluivert","Hernán Crespo",
    "Juan Román Riquelme","Pavel Nedvěd","Clarence Seedorf","Michael Ballack","Claude Makélélé",
    "Edgar Davids","Fernando Redondo","Esteban Cambiasso","Xabi Alonso","Bastian Schweinsteiger",
    "Philipp Lahm","Javier Mascherano","Raphaël Varane","Pepe","Thiago Silva",
    "Leonardo Bonucci","Giorgio Chiellini","Aymeric Laporte","Rúben Dias","Marquinhos",
    "Jan Oblak","Thibaut Courtois","Alisson Becker","Ederson","David de Gea",
    "Petr Čech","Oliver Kahn","Edwin van der Sar","Keylor Navas","Claudio Bravo",
    "Dirk Kuyt","Park Ji-sung","Dimitar Berbatov","Miroslav Klose","Diego Forlán",
    "Santi Cazorla","Juan Mata","David Alaba","Henrikh Mkhitaryan","Shinji Kagawa"
  ],

  veryHard: [
    "Dusan Tadić","Sergej Milinković-Savić","Nicolò Barella","Federico Chiesa","Lorenzo Insigne",
    "Ciro Immobile","Gerard Moreno","Iago Aspas","Florian Wirtz","Dominik Szoboszlai",
    "Martin Ødegaard","Alexander Isak","Darwin Núñez","Cody Gakpo","Gabriel Martinelli",
    "Randal Kolo Muani","Gonçalo Ramos","Pedro Neto","Takefusa Kubo","Heung-min Son",
    "Lucas Paquetá","Ever Banega","Granit Xhaka","Thomas Partey","Moises Caicedo",
    "Enzo Fernández","Cole Palmer","Nicolás Otamendi","Lisandro Martínez","Cristian Romero",
    "Jules Koundé","Dayot Upamecano","Milan Škriniar","Kalidou Koulibaly","Antonio Rüdiger",
    "José Giménez","Stefan de Vrij","João Cancelo","Kyleiël Dewsbury-Hall","Youri Tielemans",
    "Teun Koopmeiners","Dani Olmo","Pablo Sarabia","Ángel Correa","Matheus Nunes"
  ]
}
// ============================================
// GAME STATE
// ============================================
let gameState = {
    totalPlayers: 4,
    currentPlayer: 1,
    spyIndex: -1,
    footballPlayer: "",
    difficulty: "medium"
};

// ============================================
// DOM ELEMENTS
// ============================================
const screens = {
    start: document.getElementById('start-screen'),
    reveal: document.getElementById('reveal-screen'),
    role: document.getElementById('role-screen'),
    discussion: document.getElementById('discussion-screen')
};

const elements = {
    playerCountInput: document.getElementById('player-count'),
    difficultySelect: document.getElementById('difficulty'),
    difficultyHint: document.getElementById('difficulty-hint'),
    startBtn: document.getElementById('start-btn'),
    revealBtn: document.getElementById('reveal-btn'),
    hideBtn: document.getElementById('hide-btn'),
    restartBtn: document.getElementById('restart-btn'),
    themeBtn: document.getElementById('theme-btn'),
    currentPlayerNum: document.getElementById('current-player-num'),
    totalPlayers: document.getElementById('total-players'),
    revealText: document.getElementById('reveal-text'),
    roleContent: document.getElementById('role-content'),
    roleCard: document.getElementById('role-card')
};

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
}

// ============================================
// DIFFICULTY LOGIC
// ============================================
const difficultyLevels = ['easy', 'medium', 'hard', 'veryHard'];

function getPlayersForDifficulty(level) {
    if (level === 'random') return [];
    
    const levelIndex = difficultyLevels.indexOf(level);
    let players = [];
    
    // Include all levels up to and including the selected level
    for (let i = 0; i <= levelIndex; i++) {
        players = players.concat(footballPlayers[difficultyLevels[i]]);
    }
    
    return players;
}

function getRandomPlayerByDifficulty(level) {
    const players = getPlayersForDifficulty(level);
    return players[Math.floor(Math.random() * players.length)];
}

async function fetchRandomPlayerFromAPI() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://api.randomfootballer.com/random-footballer', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error('API response not ok');
        }
        
        const data = await response.json();
        
        if (data.player) {
            return data.player;
        }
        
        throw new Error('Could not parse player name from API');
    } catch (error) {
        console.log('API fetch failed, using fallback:', error.message);
        // Fallback to veryHard level (all players)
        return getRandomPlayerByDifficulty('veryHard');
    }
}

function updateDifficultyHint() {
    const level = elements.difficultySelect.value;
    
    if (level === 'random') {
        elements.difficultyHint.textContent = 'Fetches from API (any footballer in the world!)';
        return;
    }
    
    const players = getPlayersForDifficulty(level);
    const levelIndex = difficultyLevels.indexOf(level);
    
    const levelNames = ['easy', 'medium', 'hard', 'very hard'];
    const includedLevels = levelNames.slice(0, levelIndex + 1).join(' + ');
    
    elements.difficultyHint.textContent = `${players.length} players (${includedLevels})`;
}
// ============================================
// ============================================
// GAME LOGIC
// ============================================
function getRandomSpyIndex(totalPlayers) {
    return Math.floor(Math.random() * totalPlayers) + 1;
}

async function startGame() {
    const playerCount = parseInt(elements.playerCountInput.value);
    const difficulty = elements.difficultySelect.value;
    
    // Validate player count
    if (isNaN(playerCount) || playerCount < 3 || playerCount > 10) {
        alert('Please enter a number between 3 and 10');
        return;
    }
    
    // Initialize game state
    gameState.totalPlayers = playerCount;
    gameState.currentPlayer = 1;
    gameState.spyIndex = getRandomSpyIndex(playerCount);
    gameState.difficulty = difficulty;
    
    // Get random football player based on difficulty
    if (difficulty === 'random') {
        // Show loading state for API call
        elements.startBtn.classList.add('loading');
        elements.startBtn.disabled = true;
        
        gameState.footballPlayer = await fetchRandomPlayerFromAPI();
        
        elements.startBtn.classList.remove('loading');
        elements.startBtn.disabled = false;
    } else {
        gameState.footballPlayer = getRandomPlayerByDifficulty(difficulty);
    }
    
    // Update UI and show reveal screen
    updateRevealScreen();
    showScreen('reveal');
}

function updateRevealScreen() {
    elements.currentPlayerNum.textContent = gameState.currentPlayer;
    elements.totalPlayers.textContent = gameState.totalPlayers;
    elements.revealText.textContent = `Player ${gameState.currentPlayer}`;
}

function revealRole() {
    const isSpy = gameState.currentPlayer === gameState.spyIndex;
    
    // Update role card styling
    elements.roleCard.classList.toggle('spy', isSpy);
    
    // Generate role content
    if (isSpy) {
        elements.roleContent.innerHTML = `
            <div class="role-icon">🕵️</div>
            <div class="role-title">You are the SPY!</div>
            <p class="role-label">You don't know the football player.</p>
            <p class="role-label">Try to blend in during the discussion!</p>
        `;
    } else {
        elements.roleContent.innerHTML = `
            <div class="role-icon">⚽</div>
            <div class="role-title">You are NOT the spy</div>
            <p class="role-label">The football player is:</p>
            <p class="player-name">${gameState.footballPlayer}</p>
        `;
    }
    
    showScreen('role');
}

function hideAndPass() {
    gameState.currentPlayer++;
    
    if (gameState.currentPlayer > gameState.totalPlayers) {
        // All players have seen their roles
        showScreen('discussion');
    } else {
        // Move to next player
        updateRevealScreen();
        showScreen('reveal');
    }
}

function restartGame() {
    // Reset game state
    gameState = {
        totalPlayers: 4,
        currentPlayer: 1,
        spyIndex: -1,
        footballPlayer: "",
        difficulty: "medium"
    };
    
    // Reset UI
    elements.roleCard.classList.remove('spy');
    showScreen('start');
}

// ============================================
// THEME TOGGLE
// ============================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    elements.themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('theme', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    elements.themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// ============================================
// EVENT LISTENERS
// ============================================
elements.startBtn.addEventListener('click', startGame);
elements.revealBtn.addEventListener('click', revealRole);
elements.hideBtn.addEventListener('click', hideAndPass);
elements.restartBtn.addEventListener('click', restartGame);
elements.themeBtn.addEventListener('click', toggleTheme);
elements.difficultySelect.addEventListener('change', updateDifficultyHint);

// Reset game buttons in reveal/role screens
document.querySelectorAll('.reset-game-btn').forEach(btn => {
    btn.addEventListener('click', restartGame);
});

// Handle Enter key on player count input
elements.playerCountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        startGame();
    }
});

// Initialize theme and difficulty hint on load
loadTheme();
updateDifficultyHint();
