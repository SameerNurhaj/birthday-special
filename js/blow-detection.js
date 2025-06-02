// Variables for audio analysis
let audioContext;
let analyser;
let microphone;
let javascriptNode;
let canBlow = true;
let blowTimer;
let blowCount = 0;
let lastAchievementTime = 0;
let candleIndex = 0;

// Function to start blow detection
function startBlowDetection(stream) {
  // Create audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Create analyzer
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  
  // Create microphone source
  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(analyser);
  
  // Create processor node
  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
  
  // Initialize candles
  setupCandles(parseInt(localStorage.getItem('birthdayAge') || '1', 10));
  
  // Process audio data
  javascriptNode.onaudioprocess = function() {
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    
    // Get average volume
    let average = getAverageVolume(array);
    
    // Update blow indicator
    updateBlowIndicator(average);
    
    // Detect blow (high volume)
    if (average > 25 && canBlow) {
      canBlow = false;
      blowCount++;

      // Blow out 1 or 2 candles
      blowOutNextCandle();

      // Reset after a timeout
      clearTimeout(blowTimer);
      blowTimer = setTimeout(() => {
        canBlow = true;
      }, 1000);

      // If all candles are blown out, celebrate!
      if (areAllCandlesBlownOut()) {
        celebrateSuccess();
      }
    }
  };
}

// Calculate average volume from frequency data
function getAverageVolume(array) {
  let values = 0;
  const length = array.length;
  
  // Get all frequency values
  for (let i = 0; i < length; i++) {
    values += array[i];
  }
  
  return values / length;
}

// Update the blow indicator based on volume
function updateBlowIndicator(volume) {
  const indicator = document.querySelector('.indicator-bar');
  let percentage = Math.min(volume * 4, 100);
  indicator.style.width = `${percentage}%`;
}

// Function to blow out the next candle in sequence
function blowOutNextCandle() {
  const flames = Array.from(document.querySelectorAll('.flame:not(.blown-out)'));
  if (flames.length === 0) return;

  // Randomly decide how many to blow out this time (1 or 2, but not more than remaining)
  const toBlow = Math.min(flames.length, Math.floor(Math.random() * 2) + 1);

  // Shuffle and pick candles to blow out
  for (let i = 0; i < toBlow; i++) {
    const idx = Math.floor(Math.random() * flames.length);
    const flame = flames.splice(idx, 1)[0];
    flame.classList.add('blown-out');
  }
}

// Check if all candles are blown out
function areAllCandlesBlownOut() {
  const flames = document.querySelectorAll('.flame');
  for (let flame of flames) {
    if (!flame.classList.contains('blown-out')) {
      return false;
    }
  }
  return true;
}
// At the end of blowOutCandles, replace:
checkAllCandlesBlown(); // Check if all candles are blown after each blow
// Celebrate when all candles are blown out
function celebrateSuccess() {
  // Create confetti
  createConfetti();

  // Show final achievement after a delay
  setTimeout(() => {
    showAchievement('🎉 Happy Birthday! Your wish is ready to come true! 🌟');
    // After the achievement fades out, show balloons and message
    setTimeout(() => {
      if (!balloonsLaunched) {
        balloonsLaunched = true;
        launchBalloons(30);
        const msgContainer = document.querySelector('.message-container');
        if (msgContainer) {
          msgContainer.style.display = 'block';
        }
      }
    }, 100); // Adjust this delay to match your achievement fade-out
  }, 100);

  // Remove the blow instructions after success
  setTimeout(() => {
    const blowInstructions = document.querySelector('.blow-instructions');
    if (blowInstructions) {
      blowInstructions.style.opacity = '0';
      setTimeout(() => {
        blowInstructions.style.display = 'none';
      }, 500);
    }
  }, 2000);

  // Stop audio processing
  if (javascriptNode) {
    javascriptNode.disconnect();
    if (microphone) microphone.disconnect();
    if (analyser) analyser.disconnect();
  }
}
