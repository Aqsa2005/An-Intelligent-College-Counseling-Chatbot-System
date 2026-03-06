document.addEventListener('DOMContentLoaded', () => {

  const currentPath = window.location.pathname;

  // Set current date in journal
  const journalDateEl = document.getElementById('journalDate');
  if (journalDateEl) {
    const d = new Date();
    journalDateEl.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  // Login Handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('username').value;
      const passwordInput = document.getElementById('password').value;
      
      const users = JSON.parse(localStorage.getItem('icc_users')) || [];
      const userMatch = users.find(u => u.username === usernameInput && u.password === passwordInput);
      
      if (userMatch) {
        localStorage.setItem('icc_currentUser', JSON.stringify(userMatch));
        window.location.href = 'dashboard.html';
      } else {
        const err = document.getElementById('loginError');
        err.style.display = 'block';
      }
    });

    // small redirect if logged in already (optional)
    if(localStorage.getItem('icc_currentUser')) {
      window.location.href = 'dashboard.html';
    }
  }

  // Register Handling
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const id = document.getElementById('regCollegeId').value;
      const email = document.getElementById('regEmail').value;
      const username = document.getElementById('regUsername').value;
      const password = document.getElementById('regPassword').value;

      const users = JSON.parse(localStorage.getItem('icc_users')) || [];
      if(users.some(u => u.username === username)) {
        alert("Username already exists!");
        return;
      }

      users.push({ name, id, email, username, password });
      localStorage.setItem('icc_users', JSON.stringify(users));
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    });
  }

  // Dashboard Logic
  if (currentPath.includes('dashboard.html') || document.getElementById('logoutBtn')) {
    const currentUser = JSON.parse(localStorage.getItem('icc_currentUser'));
    if (!currentUser) {
      window.location.href = 'login.html';
    } else {
      const nameDisplay = document.getElementById('userNameDisplay');
      if (nameDisplay) nameDisplay.textContent = currentUser.name;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('icc_currentUser');
        window.location.href = 'login.html';
      });
    }
  }

  // Chart Rendering
  const moodChartCtx = document.getElementById('moodChart');
  if (moodChartCtx) {
    const ctx = moodChartCtx.getContext('2d');
    
    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Mood Level',
          data: [5, 6.5, 5.5, 7.5, 8.5, 7, 8],
          borderColor: '#4f46e5',
          backgroundColor: gradient,
          borderWidth: 3,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#4f46e5',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const mapMode = (val) => {
                  if(val <= 2.5) return 'Sad';
                  if(val <= 5) return 'Anxious';
                  if(val <= 7.5) return 'Calm';
                  return 'Happy';
                };
                return ' ' + mapMode(context.parsed.y) + ' (' + context.parsed.y + '/10)';
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2.5,
              callback: function(value) {
                if(value === 0) return 'Sad';
                if(value === 2.5) return 'Anxious';
                if(value === 5) return 'Calm';
                if(value === 7.5) return 'Happy';
                if(value === 10) return 'Great';
                return '';
              }
            },
            grid: { color: '#e2e8f0', drawBorder: false }
          },
          x: {
            grid: { display: false, drawBorder: false }
          }
        }
      }
    });
  }

  // Mini Wellness Tool Interactions
  const playBtn = document.getElementById('playMeditateBtn');
  if (playBtn) {
    let isPlaying = false;
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playBtn.classList.add('playing');
      } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playBtn.classList.remove('playing');
      }
    });
  }

});

