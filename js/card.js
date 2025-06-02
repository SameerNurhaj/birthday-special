document.addEventListener('DOMContentLoaded', () => {
  // Get birthday data from localStorage
  const name = localStorage.getItem('birthdayName') || 'Friend';
  const age = parseInt(localStorage.getItem('birthdayAge') || '0', 10);
  const message = localStorage.getItem('birthdayMessage') || 'Happy Birthday!';
  
  // Set the data in the card
  document.getElementById('recipient-name').textContent = name;
  document.getElementById('recipient-age').textContent = age;
  document.getElementById('birthday-message').textContent = message;
  
  // Update page title
  document.title = `Happy Birthday, ${name}!`;
  
  // Handling the opening of the card
  const preCard = document.getElementById('pre-card');
  const openCardBtn = document.getElementById('open-card-btn');
  const birthdayCard = document.getElementById('card');
  const candlesContainer = document.getElementById('candles-container');
  
  openCardBtn.addEventListener('click', () => {
    // Request microphone permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // Hide pre-card and show the birthday card
          preCard.classList.add('hidden');
          birthdayCard.classList.remove('closed');
          birthdayCard.classList.add('open');
            
          // Start the audio analysis for blow detection
          startBlowDetection(stream);
        })
        .catch(err => {
          console.error('Microphone access denied:', err);
          alert('Microphone access is needed for the candle-blowing feature. You can still view the card, but you won\'t be able to blow out the candles.');
          
          // Show card anyway without blow detection
          preCard.classList.add('hidden');
          birthdayCard.classList.remove('closed');
          birthdayCard.classList.add('open');
        });
    } else {
      // Fallback for browsers that don't support getUserMedia
      alert('Your browser doesn\'t support microphone access. You can still view the card, but you won\'t be able to blow out the candles.');
      
      preCard.classList.add('hidden');
      birthdayCard.classList.remove('closed');
      birthdayCard.classList.add('open');
    }
  });
  
  // card.js
  const params = new URLSearchParams(window.location.search);
  const urlName = params.get('name');
  const urlAge = params.get('age');
  const urlMessage = params.get('message');

  document.getElementById('card-name').textContent = urlName || name;
  document.getElementById('card-age').textContent = urlAge || age;
  document.getElementById('card-message').textContent = urlMessage || message;
});

// Function to create confetti animation when candles are blown out
function createConfetti() {
  const confettiContainer = document.getElementById('confetti-container');
  const colors = ['#FF5E9A', '#5E9AFF', '#FFD700', '#7CFF5E', '#FF5E5E'];
  const shapes = ['circle', 'square', 'triangle'];
  
  // Create 100 confetti pieces for a more festive effect
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random properties
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    // Set styles
    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    
    // Apply different shapes
    if (shape === 'circle') {
      confetti.style.borderRadius = '50%';
    } else if (shape === 'triangle') {
      confetti.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    }
    
    // Random starting position
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `${Math.random() * 50 - 20}%`;
    confetti.style.opacity = '0';
    
    // Random rotation and movement
    const rotation = Math.random() * 360;
    const translateX = Math.random() * 200 - 100;
    const translateY = Math.random() * 200 + 200;
    
    // Add to container
    confettiContainer.appendChild(confetti);
    
    // Animate with random delay
    setTimeout(() => {
      confetti.style.transition = `transform 2s ease-out, opacity 0.3s ease-in`;
      confetti.style.opacity = '1';
      confetti.style.transform = `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`;
      
      // Remove after animation
      setTimeout(() => {
        confetti.style.opacity = '0';
        setTimeout(() => confetti.remove(), 300);
      }, 1800);
    }, Math.random() * 1000);
  }
}