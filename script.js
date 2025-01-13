let startTime, endTime;

function calculateDuration(currentTime, endTime) {
    const diff = endTime - currentTime;
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('current-time').textContent = timeString;
    
    if (startTime && endTime) {
        const currentDate = now.getTime();
        const endDateTime = new Date();
        const [endHours, endMinutes] = endTime.split(':');
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);
        
        if (currentDate <= endDateTime.getTime()) {
            const duration = calculateDuration(currentDate, endDateTime.getTime());
            document.getElementById('duration-left').textContent = `Time Remaining: ${duration}`;
            document.getElementById('status').textContent = "Time is running!";
            document.getElementById('status').className = 'running';
        } else {
            document.getElementById('duration-left').textContent = "Time's up!";
            document.getElementById('status').textContent = "Session ended";
            document.getElementById('status').className = 'ended';
        }
    }
}

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    errorElement.classList.remove('hidden');
    
    setTimeout(() => {
        errorElement.classList.remove('show');
        errorElement.classList.add('hidden');
    }, 3000);
}

document.getElementById('startButton').addEventListener('click', () => {
    startTime = document.getElementById('startTime').value;
    endTime = document.getElementById('endTime').value;
    
    if (!startTime || !endTime) {
        showError('Please set both start and end time');
        return;
    }

    const [startHours, startMinutes] = startTime.split(':');
    const [endHours, endMinutes] = endTime.split(':');
    const start = parseInt(startHours) * 60 + parseInt(startMinutes);
    const end = parseInt(endHours) * 60 + parseInt(endMinutes);

    if (start >= end) {
        showError('End time must be after start time');
        return;
    }

    document.getElementById('error-message').classList.add('hidden');
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('clock-screen').classList.remove('hidden');
    updateTime();
});

document.getElementById('resetButton').addEventListener('click', () => {
    document.getElementById('clock-screen').classList.add('hidden');
    document.getElementById('setup-screen').classList.remove('hidden');
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    startTime = null;
    endTime = null;
});

setInterval(updateTime, 1000);

document.getElementById('startTime').addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        document.getElementById('endTime').focus();
    }
});

document.getElementById('startTime').addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
        document.getElementById('endTime').focus();
    }
});
