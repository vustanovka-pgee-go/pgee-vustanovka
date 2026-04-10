/* ---------- ДАННИ ЗА ЧАСТИТЕ ---------- */
const data = {
    barrel: {
        title: "Дървена цев",
        text: "Издълбана от масивно черешово дърво. Формата е груба и несиметрична.",
        video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    bands: {
        title: "Железни обръчи",
        text: "Металните обръчи намаляват риска от разцепване при изстрел."
    }
};

/* ---------- ИЗБОР НА ЧАСТ ---------- */
function selectPart(key) {
    const part = data[key];
    
    // Актуализираме текст и заглавие
    document.getElementById("title").innerText = part.title;
    document.getElementById("text").innerText = part.text;

    const media = document.getElementById("media");
    media.innerHTML = "";

    if (part.video) {
        media.innerHTML = `
            <iframe width="100%" height="220"
            src="${part.video}"
            allowfullscreen></iframe>`;
    }
}

/* ---------- КАРТА ---------- */
const map = L.map('map').setView([30,10],2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19
}).addTo(map);

/* ---------- FIREBASE CONFIG ---------- */

const firebaseConfig = {
    apiKey: "AIzaSyAW6tZDfcVLnZT6jVtnj0Ji0r5Nb7mLto8",
    authDomain: "pgee-bulgarian-cherry-cannon.firebaseapp.com",
    databaseURL: "https://pgee-bulgarian-cherry-cannon-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pgee-bulgarian-cherry-cannon",
    storageBucket: "pgee-bulgarian-cherry-cannon.firebasestorage.app",
    messagingSenderId: "565401637525",
    appId: "1:565401637525:web:67885ec130b03b55c7419c",
    measurementId: "G-4L16SGPB4X"

};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ---------- ВЗИМА ЛОКАЦИЯ НА ПОТРЕБИТЕЛЯ ---------- */
fetch("https://ipapi.co/json/")
.then(res => res.json())
.then(data => {
    const lat = data.latitude;
    const lon = data.longitude;
    const userRef = db.ref("visitors").push();
    userRef.set({ lat: lat, lon: lon });
    userRef.onDisconnect().remove();
});

/* ---------- ПОКАЗВА ВСИЧКИ ТОЧКИ ---------- */
const markers = [];
db.ref("visitors").on("value", snapshot => {
    const count = snapshot.numChildren();
    document.getElementById("onlineCount").innerText = count;

    /* маха старите точки */
    markers.forEach(m => map.removeLayer(m));
    markers.length = 0;

    /* добавя новите */
    snapshot.forEach(child => {
        const v = child.val();
        const marker = L.circleMarker([v.lat, v.lon], {
            radius: 6,
            color: "#ff9800",
            fillColor: "#ff9800",
            fillOpacity: 0.8
        }).addTo(map);
        markers.push(marker);
    });
});

/* ---------- ЛОГИКА ЗА СТРАНИЦА 2 (ВЪЗСТАНОВКИ) ---------- */
/* ---------- ЛОГИКА ЗА СТРАНИЦА 2 (ВЪЗСТАНОВКИ) ---------- */
let isPage2 = false;

function togglePages() {
    const p1 = document.getElementById('app');
    const p2 = document.getElementById('page2');
    const btn = document.getElementById('togglePageBtn');
    const video = document.getElementById('reconVideo');
    const audio = document.getElementById('reconAudio');

    if (!isPage2) {
        p1.style.display = 'none';
        p2.style.display = 'block';
        btn.innerText = '⬅ Обратно към модела';
        
        // ГАРАНТИРАНО ЗАМРЪЗНАЛ В НАЧАЛОТО
        video.pause(); 
        video.currentTime = 0; 
    } else {
        p1.style.display = 'grid';
        p2.style.display = 'none';
        btn.innerText = '🎬 Към Възстановки';
        
        video.pause();
        audio.pause();
    }
    isPage2 = !isPage2;
}

function playAudioResponse(file) {
    const audio = document.getElementById('reconAudio');
    const video = document.getElementById('reconVideo');
    
    // Спираме всичко текущо преди нов избор
    audio.pause();
    video.pause();

    audio.src = file;
    video.currentTime = 0; // Връща героя в начална позиция
    
    // Пускаме ги заедно
    audio.play();
    video.play();

    // МАГИЯТА: Когато аудиото свърши, видеото замръзва веднага
    audio.onended = function() {
        video.pause();
        console.log("Аудиото приключи, видеото замръзна.");
    };
}

// Ръчни контроли, ако потребителят иска просто да спре/пусне
function manualPlay() {
    const video = document.getElementById('reconVideo');
    video.play();
}

function manualPause() {
    const video = document.getElementById('reconVideo');
    const audio = document.getElementById('reconAudio');
    video.pause();
    audio.pause(); // Ако спираш видеото, спираш и гласа
}

function playAudioResponse(file) {
    const audio = document.getElementById('reconAudio');
    const video = document.getElementById('reconVideo');
    
    audio.src = file;
    
    // Когато се натисне въпрос, видеото тръгва отначало синхронизирано със звука
    video.currentTime = 0; 
    video.play();
    audio.play();
}