/* ==========================================================
   CONFIGURAÇÃO DO CONVITE — edite os valores nesta secção.
   WhatsApp: indicativo de Angola +244, sem "+" nem espaços.
   Data/hora: formato ISO local: AAAA-MM-DDTHH:MM:SS
   ========================================================== */
const CONFIG = {
  groom: "Irfânia",
  bride: "Nilton",
  weddingDate: "2027-06-11T14:00:00",
  dateLabel: "11 de Junho de 2027",
  introDateLabel: "11 . JUNHO . 2027",
  footerDateLabel: "11 . 06 . 2027",
  ceremony: {
    time: "14h00",
    venue: "Paroquia Santa Cruz, Madeira, Luanda",
    mapsUrl: "https://maps.app.goo.gl/nkeQR6uKmtR9SRaC9"
  },
  reception: {
    time: "21h00",
    venue: "Salao NB, Luanda",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Espa%C3%A7o+Exemplo+Luanda"
  },
  dressCode: "Formal / Elegante",
  whatsappNumber: "244931770322", // SUBSTITUA pelo número que receberá as confirmações.
  rsvpDeadline: "Confirme até 01 de Maio de 2027",
  whatsappIntro: "Olá! Estou a responder ao convite de casamento de"
};

const $ = (id) => document.getElementById(id);
const couple = `${CONFIG.bride} & ${CONFIG.groom}`;

function applyConfiguration() {
  ["introNames", "heroNames", "welcomeNames"].forEach(id => {
    const el = $(id);
    if (el) el.textContent = couple;
  });
  $("introDate").textContent = CONFIG.introDateLabel;
  $("heroDate").textContent = CONFIG.dateLabel;
  $("footerDate").textContent = CONFIG.footerDateLabel;
  $("ceremonyTime").textContent = CONFIG.ceremony.time;
  $("ceremonyVenue").textContent = CONFIG.ceremony.venue;
  $("ceremonyMap").href = CONFIG.ceremony.mapsUrl;
  $("receptionTime").textContent = CONFIG.reception.time;
  $("receptionVenue").textContent = CONFIG.reception.venue;
  $("receptionMap").href = CONFIG.reception.mapsUrl;
  $("dressCode").textContent = CONFIG.dressCode;
  $("rsvpDeadline").textContent = CONFIG.rsvpDeadline;
}

function openInvitation() {
  $("introScreen").classList.add("is-hidden");
  $("invitation").classList.add("is-open");
  $("invitation").setAttribute("aria-hidden", "false");
  document.body.classList.add("invitation-open");
  // A reprodução só é iniciada após o clique do utilizador (regra dos navegadores).
  playMusic();
}

const audio = $("backgroundMusic");
async function playMusic() {
  try {
    await audio.play();
    $("musicToggle").setAttribute("aria-pressed", "true");
    $("musicToggle").setAttribute("aria-label", "Pausar música");
    $("musicLabel").textContent = "PAUSAR";
  } catch {
    $("musicLabel").textContent = "MÚSICA";
  }
}
function toggleMusic() {
  if (audio.paused) playMusic();
  else {
    audio.pause();
    $("musicToggle").setAttribute("aria-pressed", "false");
    $("musicToggle").setAttribute("aria-label", "Reproduzir música");
    $("musicLabel").textContent = "MÚSICA";
  }
}

function updateCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const remaining = target - Date.now();
  if (!Number.isFinite(target)) return;
  if (remaining <= 0) {
    $("days").textContent = "000";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    $("countdownNote").textContent = "Hoje é o grande dia! Vamos celebrar o amor.";
    return;
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  $("days").textContent = String(days).padStart(3, "0");
  $("hours").textContent = String(hours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");
}

function submitRSVP(event) {
  event.preventDefault();
  const name = $("guestName").value.trim();
  const attendance = $("attendance").value;
  const count = $("guestCount").value;
  const feedback = $("formFeedback");

  if (name.length < 2) {
    feedback.textContent = "Por favor, introduza o seu nome completo (mínimo de 2 caracteres).";
    $("guestName").focus();
    return;
  }
  if (!attendance) {
    feedback.textContent = "Por favor, seleccione a sua confirmação de presença.";
    $("attendance").focus();
    return;
  }
  if (!/^244\d{9}$/.test(CONFIG.whatsappNumber)) {
    feedback.textContent = "O número de WhatsApp ainda não está configurado. Actualize CONFIG.whatsappNumber no ficheiro js/script.js.";
    return;
  }

  const message = [
    `${CONFIG.whatsappIntro} ${couple}.`,
    "",
    `Nome: ${name}`,
    `Confirmação: ${attendance}`,
    `Número de pessoas: ${count}`,
    `Data: ${CONFIG.dateLabel}`
  ].join("\n");

  const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  feedback.textContent = "A abrir o WhatsApp para enviar a sua confirmação…";
  window.open(whatsappURL, "_blank", "noopener,noreferrer");
}

$("openInvitation").addEventListener("click", openInvitation);
$("musicToggle").addEventListener("click", toggleMusic);
$("rsvpForm").addEventListener("submit", submitRSVP);
applyConfiguration();
updateCountdown();
window.setInterval(updateCountdown, 1000);
