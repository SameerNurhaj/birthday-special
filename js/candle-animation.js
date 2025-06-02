// Function to set up candles based on age
function setupCandles(age) {
  const candlesContainer = document.getElementById('candles-container');
  candlesContainer.innerHTML = ''; // Clear existing candles
  
  // Create exactly 5 candles with spacing
  for (let i = 0; i < 5; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.style.margin = '0 2px'; // Reduced spacing

    // Wick (thread) - should be above the body
    const wick = document.createElement('div');
    wick.className = 'wick';

    // Flame
    const flame = document.createElement('div');
    flame.className = 'flame';
    wick.appendChild(flame);

    candle.appendChild(wick);

    // Candle body
    const candleBody = document.createElement('div');
    candleBody.className = 'candle-body';
    candle.appendChild(candleBody);

    candlesContainer.appendChild(candle);
  }

  // Add achievement display
  if (!document.getElementById('achievement-display')) {
    const achievementDisplay = document.createElement('div');
    achievementDisplay.id = 'achievement-display';
    achievementDisplay.className = 'achievement-display';
    document.querySelector('.cake-container').appendChild(achievementDisplay);
  }
}

// Function to show achievement message with queue system
const achievementQueue = [];
let isShowingAchievement = false;

function showAchievement(message) {
  achievementQueue.push(message);
  if (!isShowingAchievement) {
    showNextAchievement();
  }
}

function showNextAchievement(onLastAchievement) {
  if (achievementQueue.length === 0) {
    isShowingAchievement = false;
    if (typeof onLastAchievement === 'function') {
      onLastAchievement();
    }
    return;
  }

  isShowingAchievement = true;
  const message = achievementQueue.shift();
  const display = document.getElementById('achievement-display');
  const achievement = document.createElement('div');
  achievement.className = 'achievement';
  achievement.textContent = message;
  
  display.appendChild(achievement);

  setTimeout(() => {
    achievement.classList.add('fade-out');
    setTimeout(() => {
      achievement.remove();
      setTimeout(() => showNextAchievement(onLastAchievement), 500);
    }, 800);
  }, 1000);
}

let canBlowCandle = true; // Add this flag at the top (outside the function)

// Function to blow out candles based on audio volume
function blowOutCandles(volume) {
  if (!canBlowCandle) return; // Prevent blowing out too quickly

  const flames = Array.from(document.querySelectorAll('.flame:not(.blown-out)'));
  if (flames.length === 0) return;

  canBlowCandle = false; // Block further blows

  // Randomly decide how many to blow out this time (1 or 2, but not more than remaining)
  const toBlow = Math.min(flames.length, Math.floor(Math.random() * 2) + 1);

  // Shuffle and pick candles to blow out
  for (let i = 0; i < toBlow; i++) {
    const idx = Math.floor(Math.random() * flames.length);
    const flame = flames.splice(idx, 1)[0];
    flame.classList.add('blown-out');
    if (flame.parentElement && flame.parentElement.classList.contains('wick')) {
      flame.parentElement.classList.add('wick-blown');
    }
  }

  // Show achievements based on progress with delays
  const remainingCount = document.querySelectorAll('.flame:not(.blown-out)').length;
  if (remainingCount === 3) {
    setTimeout(() => showAchievement('🌟 Almost there! Just 3 more to go! 🌟'), 500);
  } else if (remainingCount === 1) {
    setTimeout(() => showAchievement('✨ One last candle! You can do it! ✨'), 500);
  }

  // Allow next blow after 1s
  setTimeout(() => {
    canBlowCandle = true;
  }, 1000);

  checkAllCandlesBlown();
}

let balloonsLaunched = false; // Add this at the top of your file

// Launch balloons animation
function launchBalloons(count = 8) {
  for (let i = 0; i < count; i++) {
    const balloon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    balloon.setAttribute("class", "floating-balloon");
    balloon.setAttribute("viewBox", "0 0 40 55");
    balloon.style.left = `${Math.random() * 90}vw`;
    balloon.style.animationDelay = `${Math.random() * 1.5}s`;

    // Random color
    const colors = ["#FFD700", "#FF5E9A", "#5E9AFF", "#FF8FCF"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const ellipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    ellipse.setAttribute("cx", "20");
    ellipse.setAttribute("cy", "25");
    ellipse.setAttribute("rx", "18");
    ellipse.setAttribute("ry", "25");
    ellipse.setAttribute("fill", color);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "18");
    rect.setAttribute("y", "48");
    rect.setAttribute("width", "4");
    rect.setAttribute("height", "10");
    rect.setAttribute("fill", "#e2a4c0");

    balloon.appendChild(ellipse);
    balloon.appendChild(rect);

    document.body.appendChild(balloon);

    // Remove balloon after animation
    setTimeout(() => balloon.remove(), 4500);
  }
}
