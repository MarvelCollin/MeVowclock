document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        settingsToggle: document.getElementById('settings-toggle'),
        sidebar: document.getElementById('settings-sidebar'),
        closeSidebar: document.getElementById('close-sidebar'),
        showCatsCheckbox: document.getElementById('show-cats'),
        catCanvas: document.getElementById('catCanvas'),
        overlay: document.getElementById('sidebar-overlay'),
        startButton: document.getElementById('startButton'),
        resetDefaults: document.getElementById('resetDefaults') // Added resetDefaults
    };

    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Missing element: ${key}`);
            return; 
        }
    }

    const defaultData = {
        prosesPengumpulan: [
            "CTRL + S DISEMUA APLIKASI YANG DIKERJAKAN",
            "**PERIKSA KEMBALI** APAKAH EXTENSIONNYA BENAR SESUAI DENGAN SOAL",
            "TUTUP SEMUA APLIKASI",
            "**ZIP** SEMUA FILENYA",
            "UPLOAD DI **WEBSITE + FTP**",
            "**DOWNLOAD ULANG**",
            "PERIKSA KEMBALI KEPADA **ASSISTANT LAB** UNTUK FTP",
            "**FINALIZE**"
        ]
    };

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    if (!getCookie('prosesPengumpulan')) {
        setCookie('prosesPengumpulan', JSON.stringify(defaultData.prosesPengumpulan), 1);
    }

    function openSidebar() {
        elements.sidebar.classList.add('active');
        elements.overlay.classList.add('active');
        elements.settingsToggle.style.display = 'none';
        elements.settingsToggle.style.opacity = '0';
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

    elements.showCatsCheckbox.addEventListener('change', (e) => {
        elements.catCanvas.style.display = e.target.checked ? 'block' : 'none';
    });

    const notesContainer = document.querySelector('.notes-container');
    const notesSections = document.querySelectorAll('.notes-section');

    if (notesContainer && notesSections.length > 0) {
        const pengerjaanNotes = document.querySelector('.notes-section ol').innerHTML;
        const pengumpulanNotes = document.querySelectorAll('.notes-section ol')[1].innerHTML;

        notesContainer.innerHTML = `
        
            <div class="config-section">
                <h4>Proses Pengumpulan</h4>
                <ol class="config-list">
                    ${pengumpulanNotes}
                </ol>
            </div>
        `;

        notesSections.forEach(section => {
            section.style.display = 'none';
        });
    }

    function addConfigItem(input, list, storageKey) {
        const text = input.value.trim().toUpperCase(); 
        if (!text) return;

        const li = document.createElement('li');
        li.innerHTML = `
            ${text}
            <button class="delete-item"><i class="fas fa-times"></i></button>
        `;

        list.appendChild(li);
        input.value = '';

        const items = Array.from(list.children).map(item => item.textContent.trim());
        setCookie(storageKey, JSON.stringify(items), 1);

        li.querySelector('.delete-item').addEventListener('click', () => {
            li.remove();
            const updatedItems = Array.from(list.children).map(item => item.textContent.trim());
            setCookie(storageKey, JSON.stringify(updatedItems), 1);
        });

        updateNotesList(); 
    }


    const pengumpulanInput = document.getElementById('newProsesPengumpulan');
    const pengumpulanList = document.getElementById('prosesPengumpulanList');
    document.getElementById('addProsesPengumpulan').addEventListener('click', () => {
        addConfigItem(pengumpulanInput, pengumpulanList, 'prosesPengumpulan');
    });

    function loadSavedItems() {
        const pengumpulan = JSON.parse(getCookie('prosesPengumpulan')) || defaultData.prosesPengumpulan;
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

            li.querySelector('.delete-item').addEventListener('click', () => {
                li.remove();
                const updatedItems = Array.from(pengumpulanList.children).map(item => {
                    const text = item.querySelector('.text').innerHTML.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
                    return text;
                });
                setCookie('prosesPengumpulan', JSON.stringify(updatedItems), 1);
                updateNotesList();
            });
        });
    }

    loadSavedItems();
    updateNotesList();

    function toggleSettingsVisibility(show) {
        elements.settingsToggle.style.opacity = show ? '1' : '0';
        elements.settingsToggle.style.visibility = show ? 'visible' : 'hidden';
    }

    toggleSettingsVisibility(false);

    if (elements.startButton) {
        elements.startButton.addEventListener('click', () => {
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
    }

    if (elements.resetDefaults) {
        elements.resetDefaults.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset to default settings?')) {
                const uppercasedDefaults = defaultData.prosesPengumpulan.map(item => item.toUpperCase());
                setCookie('prosesPengumpulan', JSON.stringify(uppercasedDefaults), 1);
                loadSavedItems();
                updateNotesList();
            }
        });
    }

    function updateNotesList() {
        const pengumpulanList = document.getElementById('pengumpulanList');
        
        if (pengumpulanList) {
            const pengumpulan = JSON.parse(getCookie('prosesPengumpulan') || '[]');

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
            const uppercasedDefaults = defaultData.prosesPengumpulan.map(item => item.toUpperCase());
            setCookie('prosesPengumpulan', JSON.stringify(uppercasedDefaults), 1);
            loadSavedItems();
            updateNotesList();
        }
    });

    setInterval(() => {
        updateTime();
    }, 1000);
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
    } else {
      document.getElementById("duration-left").textContent = "Time's up!";
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
