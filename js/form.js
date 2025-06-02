document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('birthdayForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = encodeURIComponent(document.getElementById('name').value);
    const age = encodeURIComponent(document.getElementById('age').value);
    const message = encodeURIComponent(document.getElementById('message').value);

    // Generate a unique link with query params
    const cardUrl = `${window.location.origin}/card.html?name=${name}&age=${age}&message=${message}`;
    // Show or copy this link for sharing
    alert("Share this card link: " + cardUrl);
  });
  
  // Add subtle animations to form elements
  const inputs = document.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
  
  // Add animation to balloons
  const balloons = document.querySelectorAll('.balloon');
  
  balloons.forEach((balloon, index) => {
    // Random initial position
    const randomDelay = Math.random() * 2;
    balloon.style.animationDelay = `${randomDelay}s`;
  });
});