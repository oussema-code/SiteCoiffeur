document.querySelector('.menu-icon').addEventListener('click', function() {
  document.querySelector('.nav-links').classList.toggle('active');
});

document.querySelectorAll('.nav-item').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Check if the href starts with '#' (indicating an in-page section)
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector('.nav-links').classList.remove('active');
      const section = document.querySelector(href);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If href does not start with '#', it's a link to another page (e.g., /pageAccueil/index.html)
    // Let the browser handle the navigation by not preventing default behavior
    else {
      document.querySelector('.nav-links').classList.remove('active');
      // Default navigation will occur (no e.preventDefault())
    }
  });
});

// Booking page logic
if (document.querySelector('.booking-section')) {
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get('service');
  const team = urlParams.get('team');
  const selectedService = document.getElementById('selected-service');
  const selectedTeam = document.getElementById('selected-team');
  const resumeService = document.getElementById('resume-service');
  const resumeTeam = document.getElementById('resume-team');
  const resumePrice = document.getElementById('resume-price');
  const totalPrice = document.getElementById('total-price');
  const confirmBtn = document.getElementById('confirm-btn');
  const timeSlotsContainer = document.getElementById('time-slots');
  const calendarDays = document.getElementById('calendar-days');
  const calendarMonthYear = document.getElementById('calendar-month-year');
  const prevMonth = document.getElementById('prev-month');
  const nextMonth = document.getElementById('next-month');
  const resumeTime = document.getElementById('resume-time');

  if (service && team) {
    selectedService.textContent = service;
    resumeService.textContent = service;
    selectedTeam.textContent = team;
    resumeTeam.textContent = team;
    const price = urlParams.get('price') || '15'; // Default price if not passed
    resumePrice.textContent = `${price} TND`;
    totalPrice.textContent = `${price} TND`;

    // Calendar logic
    let currentDate = new Date();
    currentDate.setDate(1); // Start of the month

    function renderCalendar() {
      calendarMonthYear.textContent = currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      calendarDays.innerHTML = '';

      // Add day names
      const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      dayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        dayElement.style.fontWeight = 'bold';
        calendarDays.appendChild(dayElement);
      });

      // Add empty days for alignment
      for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarDays.appendChild(emptyDay);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        if (new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString() === new Date().toDateString()) {
          dayElement.classList.add('selected');
        }
        dayElement.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
          dayElement.classList.add('selected');
          renderTimeSlots(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        });
        calendarDays.appendChild(dayElement);
      }
    }

    prevMonth.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    nextMonth.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    renderCalendar();

    // Mock backend response for time slots
    async function fetchTimeSlots(selectedDate, team) {
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const dateStr = `${day}/${month}/${year}`;
      const currentTime = new Date();
      currentTime.setHours(14, 15, 0, 0); // Current time: 02:15 PM CET

      // Simulate API response
      let availableTimes = [];
      if (dateStr === '4/6/2025') { // June 4, 2025
        availableTimes = ['15:30', '22:30', '23:00']; // Times after 02:15 PM
      } else if (dateStr === '5/6/2025') { // June 5, 2025
        availableTimes = ['15:30', '22:30', '23:00'];
      }

      return new Promise(resolve => {
        setTimeout(() => resolve(availableTimes), 500); // Simulate network delay
      });
    }

    function renderTimeSlots(selectedDate) {
      timeSlotsContainer.innerHTML = '<p>Chargement des horaires...</p>';
      fetchTimeSlots(selectedDate, team).then(availableTimes => {
        timeSlotsContainer.innerHTML = '';
        if (availableTimes.length === 0) {
          timeSlotsContainer.innerHTML = '<p>Aucun horaire disponible pour cette date.</p>';
          return;
        }

        availableTimes.forEach(time => {
          const button = document.createElement('button');
          button.className = 'time-slot';
          button.textContent = time;
          button.addEventListener('click', function() {
            document.querySelectorAll('.time-slot').forEach(s => s.style.backgroundColor = '#fff');
            this.style.backgroundColor = '#d4a017';
            this.style.color = '#fff';
            resumeTime.textContent = time;
            confirmBtn.style.display = 'block';
            confirmBtn.href = `confirmation.html?service=${encodeURIComponent(service)}&team=${encodeURIComponent(team)}&time=${encodeURIComponent(time)}&price=${encodeURIComponent(price)}&date=${encodeURIComponent(selectedDate.toISOString().split('T')[0])}`;
          });
          timeSlotsContainer.appendChild(button);
        });
      });
    }

    // Initial render for today
    renderTimeSlots(new Date());
  }
}

// Confirmation page logic
if (document.querySelector('.confirmation-section')) {
  const urlParams = new URLSearchParams(window.location.search);
  const service = urlParams.get('service');
  const team = urlParams.get('team');
  const time = urlParams.get('time');
  const price = urlParams.get('price');
  const date = urlParams.get('date');
  document.getElementById('conf-service').textContent = service;
  document.getElementById('conf-team').textContent = team;
  document.getElementById('conf-time').textContent = time;
  document.getElementById('conf-price').textContent = `${price} TND`;
  document.getElementById('conf-date').textContent = new Date(date).toLocaleDateString('fr-FR');

  document.getElementById('submit-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    if (name && email && phone) {
      alert('Réservation confirmée! Merci ' + name + '.');
      window.location.href = 'index.html';
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  });
}