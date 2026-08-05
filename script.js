// --- 1. Музыканы реттеу ---
const bgMusic = document.getElementById('bgMusic');
const musicToggleBtn = document.getElementById('musicToggleBtn');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicToggleBtn.classList.remove('playing');
    } else {
        bgMusic.play().then(() => {
            musicToggleBtn.classList.add('playing');
        }).catch(err => {
            console.log("Музыка автоойнату бұғатталды: ", err);
        });
    }
    isPlaying = !isPlaying;
}

musicToggleBtn.addEventListener('click', toggleMusic);

document.addEventListener('click', function initAudio() {
    if (!isPlaying) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggleBtn.classList.add('playing');
        }).catch(() => {});
    }
    document.removeEventListener('click', initAudio);
}, { once: true });


// --- 2. Bottom Sheet (Күнтізбе модалін ашу/жабу) ---
function openBottomSheet() {
    document.getElementById('sheetOverlay').classList.add('active');
    document.getElementById('bottomSheet').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBottomSheet() {
    document.getElementById('sheetOverlay').classList.remove('active');
    document.getElementById('bottomSheet').classList.remove('active');
    document.body.style.overflow = '';
}


// --- 3. Смартфон күнтізбесіне сақтау ---
function addToGoogleCalendar() {
    const title = encodeURIComponent("Абылайхан & Толқын - Үйлену тойы");
    const details = encodeURIComponent("Абылайхан мен Толқынның үйлену тойына шақыру. «Меруерт» мейрамханасы.");
    const location = encodeURIComponent("Көкшетау қ., «Меруерт» мейрамханасы");
    const dates = "20260927T100000Z/20260927T180000Z";

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(url, '_blank');
}

function downloadICSFile() {
    const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Invitation//KK
BEGIN:VEVENT
SUMMARY:Абылайхан & Толқын - Үйлену тойы
DESCRIPTION:Абылайхан мен Толқынның үйлену тойына шақыру.
LOCATION:Көкшетау қ.\, «Меруерт» мейрамханасы
DTSTART:20260927T100000Z
DTEND:20260927T180000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding-27-09-2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// --- 4. Картаға скролл жасау ---
function scrollToMap() {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }
}


// --- 5. Таймер Кері Санау (27 қыркүйек 2026 ж., 15:00) ---
function updateTimer() {
    const weddingDate = new Date(2026, 8, 27, 15, 0, 0);
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
}

setInterval(updateTimer, 1000);
updateTimer();


// --- 6. Динамикалық қонақ қосу/жою ---
function addGuestInput() {
    const container = document.getElementById('guestsContainer');
    const count = container.querySelectorAll('.guest-input-row').length + 1;

    const row = document.createElement('div');
    row.className = 'guest-input-row';
    
    row.innerHTML = `
        <input type="text" class="form-input guest-name-input" placeholder="Қонақ №${count} Аты-жөні">
        <button type="button" class="remove-guest-btn" onclick="removeGuestInput(this)" title="Жою">✕</button>
    `;
    container.appendChild(row);
}

function removeGuestInput(btn) {
    btn.parentElement.remove();
}

let submitted = false;

function handleFormSubmit() {
    const inputs = document.querySelectorAll('.guest-name-input');
    const names = [];

    inputs.forEach(input => {
        const val = input.value.trim();
        if (val) names.push(val);
    });

    document.getElementById('combinedGuestNames').value = names.join(', ');

    submitted = true;
    const btn = document.getElementById('submitBtn');
    btn.innerText = 'Жіберілуде...';
    btn.style.opacity = '0.7';
    btn.disabled = true;
}

function showSuccess() {
    document.getElementById('googleCustomForm').style.display = 'none';
    document.getElementById('formSuccessMessage').style.display = 'block';
}


// --- 7. Leaflet Картасы (Көкшетау, «Меруерт» б/з) ---
const lat = 53.288683;
const lng = 69.390562;

const map = L.map('leaflet-map', {
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false
}).setView([lat, lng], 16);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
}).addTo(map);

const customIcon = L.divIcon({
    className: 'custom-pin',
    html: `<div style="background:#aa8c72; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.25); border:2px solid #fff;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
           </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34]
});

const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
marker.bindPopup("<b style='font-family:sans-serif;'>«Меруерт» мейрамханасы</b><br>г. Кокшетау").openPopup();