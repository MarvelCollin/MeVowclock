document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        settingsToggle: document.getElementById('settings-toggle'),
        sidebar: document.getElementById('settings-sidebar'),
        closeSidebar: document.getElementById('close-sidebar'),
        showCatsCheckbox: document.getElementById('show-cats'),
        catCanvas: document.getElementById('catCanvas'),
        overlay: document.getElementById('sidebar-overlay')
    };

    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Missing element: ${key}`);
            return; 
        }
    }

    const defaultData = {
        prosesPengumpulan: [
            "Ctrl + S disemua aplikasi yang dikerjakan",
            "**Periksa kembali** apakah extensionnya benar sesuai dengan soal",
            "Tutup semua aplikasi",
            "**Zip** semua filenya",
            "Upload di **website + FTP**",
            "**Download ulang**",
            "Periksa kembali kepada **assistant lab** untuk FTP",
            "**Finalize**"
        ]
    };

    if (!localStorage.getItem('prosesPengumpulan')) {
        localStorage.setItem('prosesPengumpulan', JSON.stringify(defaultData.prosesPengumpulan));
    }

    function openSidebar() {
        elements.sidebar.classList.add('active');
        elements.overlay.classList.add('active');
        elements.settingsToggle.style.display = 'none';
        elements.settingsToggle.style.opacity = '0';
        console.log("aa");
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebarFn() { 
        elements.sidebar.classList.remove('active');
        elements.overlay.classList.remove('active');
        elements.settingsToggle.style.opacity = '100';
        elements.settingsToggle.style.display = 'flex'; 
        document.body.style.overflow = '';
    }

    elements.settingsToggle.addEventListener('click', openSidebar);
    elements.closeSidebar.addEventListener('click', closeSidebarFn);
    elements.overlay.addEventListener('click', closeSidebarFn);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebarFn();
        }
    });

    // Cat visibility toggle
    elements.showCatsCheckbox.addEventListener('change', (e) => {
        elements.catCanvas.style.display = e.target.checked ? 'block' : 'none';
    });

    // Replace the notes handling code
    const notesContainer = document.querySelector('.notes-container');
    const notesSections = document.querySelectorAll('.notes-section');

    if (notesContainer && notesSections.length > 0) {
        // Get the content from the original notes
        const pengerjaanNotes = document.querySelector('.notes-section ol').innerHTML;
        const pengumpulanNotes = document.querySelectorAll('.notes-section ol')[1].innerHTML;

        // Create and append new structure to sidear
        notesContainer.innerHTML = `
        
            <div class="config-section">
                <h4>Proses Pengumpulan</h4>
                <ol class="config-list">
                    ${pengumpulanNotes}
                </ol>
            </div>
        `;

        // Hide original notes section in clock screen
        notesSections.forEach(section => {
            section.style.display = 'none';
        });
    }

    // Configuration handling
    function addConfigItem(input, list, storageKey) {
        const text = input.value.trim();
        if (!text) return;

        const li = document.createElement('li');
        li.innerHTML = `
            ${text}
            <button class="delete-item"><i class="fas fa-times"></i></button>
        `;

        list.appendChild(li);
        input.value = '';

        // Save to storage
        const items = Array.from(list.children).map(item => item.textContent.trim());
        localStorage.setItem(storageKey, JSON.stringify(items));

        // Add delete handler
        li.querySelector('.delete-item').addEventListener('click', () => {
            li.remove();
            // Update storage
            const updatedItems = Array.from(list.children).map(item => item.textContent.trim());
            localStorage.setItem(storageKey, JSON.stringify(updatedItems));
        });

        updateNotesList(); 
    }


    const pengumpulanInput = document.getElementById('newProsesPengumpulan');
    const pengumpulanList = document.getElementById('prosesPengumpulanList');
    document.getElementById('addProsesPengumpulan').addEventListener('click', () => {
        addConfigItem(pengumpulanInput, pengumpulanList, 'prosesPengumpulan');
    });

    function loadSavedItems() {
        const pengumpulan = JSON.parse(localStorage.getItem('prosesPengumpulan')) || defaultData.prosesPengumpulan;

        pengumpulanList.innerHTML = '';

        pengumpulan.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="note-content">
                    <span class="number">${index + 1}.</span>
                    <span class="text">${item}</span>
                </div>
                <button class="delete-item"><i class="fas fa-times"></i></button>
            `;
            pengumpulanList.appendChild(li);

            // Add delete event listener
            li.querySelector('.delete-item').addEventListener('click', () => {
                li.remove();
                // Update storage
                const updatedItems = Array.from(pengumpulanList.children).map(item => {
                    const text = item.querySelector('.text').innerHTML.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
                    return text;
                });
                localStorage.setItem('prosesPengumpulan', JSON.stringify(updatedItems));
                updateNotesList();
            });
        });
    }

    loadSavedItems();
    updateNotesList();

    // Add this new function to handle settings visibility
    function toggleSettingsVisibility(show) {
        elements.settingsToggle.style.opacity = show ? '1' : '0';
        elements.settingsToggle.style.visibility = show ? 'visible' : 'hidden';
    }

    // Initially hide settings on setup screen
    toggleSettingsVisibility(false);

    // Update existing startButton click handler
    document.getElementById("startButton").addEventListener("click", () => {
        startTime = document.getElementById("startTime").value;
        endTime = document.getElementById("endTime").value;

        if (!startTime || !endTime) {
            showError("Please set both start and end time");
            return;
        }

        const [startHours, startMinutes] = startTime.split(":");
        const [endHours, endMinutes] = endTime.split(":");
        const start = parseInt(startHours) * 60 + parseInt(startMinutes);
        const end = parseInt(endHours) * 60 + parseInt(endMinutes);

        if (start >= end) {
            showError("End time must be after start time");
            return;
        }

        document.getElementById("error-message").classList.add("hidden");
        document.getElementById("setup-screen").classList.add("hidden");
        document.getElementById("clock-screen").classList.remove("hidden");
        toggleSettingsVisibility(true); 
        updateTime();
    });

    document.getElementById("resetButton").addEventListener("click", () => {
        document.getElementById("clock-screen").classList.add("hidden");
        document.getElementById("setup-screen").classList.remove("hidden");
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        startTime = null;
        endTime = null;
        toggleSettingsVisibility(false); 
    });
    function updateNotesList() {
        const pengumpulanList = document.getElementById('pengumpulanList');
        
        if (pengumpulanList) {
            const pengumpulan = JSON.parse(localStorage.getItem('prosesPengumpulan') || '[]');

            function formatText(text, index) {
                const processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                return `
                    <li>
                        <div class="note-content">
                            <span class="number">${index + 1}.</span>
                            <span class="text">${processedText}</span>
                        </div>
                    </li>`;
            }

            pengumpulanList.innerHTML = pengumpulan
                .map((item, index) => formatText(item, index))
                .join('');
        }
    }

    document.getElementById('resetDefaults').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset to default settings?')) {
            localStorage.setItem('prosesPengumpulan', JSON.stringify(defaultData.prosesPengumpulan));
            loadSavedItems();
            updateNotesList();
        }
    });
});

let startTime, endTime;

function calculateDuration(currentTime, endTime) {
  const diff = endTime - currentTime;
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.getElementById("current-time").textContent = timeString;

  if (startTime && endTime) {
    const currentDate = now.getTime();
    const endDateTime = new Date();
    const [endHours, endMinutes] = endTime.split(":");
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    if (currentDate <= endDateTime.getTime()) {
      const duration = calculateDuration(currentDate, endDateTime.getTime());
      document.getElementById(
        "duration-left"
      ).textContent = `Time Remaining: ${duration}`;
      document.getElementById("status").textContent = "Time is running!";
      document.getElementById("status").className = "running";
    } else {
      document.getElementById("duration-left").textContent = "Time's up!";
      document.getElementById("status").textContent = "Session ended";
      document.getElementById("status").className = "ended";
    }
  }
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = message;
  errorElement.classList.add("show");
  errorElement.classList.remove("hidden");

  setTimeout(() => {
    errorElement.classList.remove("show");
    errorElement.classList.add("hidden");
  }, 3000);
}

document.getElementById("startButton").addEventListener("click", () => {
  startTime = document.getElementById("startTime").value;
  endTime = document.getElementById("endTime").value;

  if (!startTime || !endTime) {
    showError("Please set both start and end time");
    return;
  }

  const [startHours, startMinutes] = startTime.split(":");
  const [endHours, endMinutes] = endTime.split(":");
  const start = parseInt(startHours) * 60 + parseInt(startMinutes);
  const end = parseInt(endHours) * 60 + parseInt(endMinutes);

  if (start >= end) {
    showError("End time must be after start time");
    return;
  }

  document.getElementById("error-message").classList.add("hidden");
  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("clock-screen").classList.remove("hidden");
  updateTime();
});

document.getElementById("resetButton").addEventListener("click", () => {
  document.getElementById("clock-screen").classList.add("hidden");
  document.getElementById("setup-screen").classList.remove("hidden");
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
  startTime = null;
  endTime = null;
});

setInterval(updateTime, 1000);

document.getElementById("startTime").addEventListener("keydown", (e) => {
  if (e.key === "Tab" && !e.shiftKey) {
    e.preventDefault();
    document.getElementById("endTime").focus();
  }
});

document.getElementById("startTime").addEventListener("keydown", (e) => {
  if (e.key === "Tab" && !e.shiftKey) {
    document.getElementById("endTime").focus();
  }
});
