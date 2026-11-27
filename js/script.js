/* ==========================================================
   CONFIGURAÇÃO DO CONVITE — edite os valores nesta secção.
   WhatsApp: indicativo de Angola +244, sem "+" nem espaços.
   Data/hora: formato ISO local: AAAA-MM-DDTHH:MM:SS
   ========================================================== */
const CONFIG = {
  groom: "Irfânia",
  bride: "Nilton",
  groomFullName: "Irfânia Diogo da Cruz",
  brideFullName: "Nilton Belo dos Santos da Costa",
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
  // Manter os nomes abreviados na capa e no cabeçalho
["introNames", "heroNames"].forEach(id => {
  const el = $(id);
  if (el) el.textContent = couple;
});

// Apresentar os nomes completos apenas na secção de boas-vindas
const welcomeNames = $("welcomeNames");

if (welcomeNames) {
  welcomeNames.textContent =
  `${CONFIG.brideFullName}\n&\n${CONFIG.groomFullName}`;
}
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


async function submitRSVP(event) {
  event.preventDefault();

  const name = $("guestName").value.trim();
  const attendance = $("attendance").value;
  const count = Number($("guestCount").value);
  const feedback = $("formFeedback");
  const button = event.submitter;

  if (name.length < 2) {
    feedback.textContent = "Por favor, introduza o seu nome completo.";
    $("guestName").focus();
    return;
  }

  if (!attendance) {
    feedback.textContent = "Por favor, seleccione a sua confirmação de presença.";
    $("attendance").focus();
    return;
  }

  if (![1, 2].includes(count)) {
    feedback.textContent = "Seleccione um número válido de pessoas.";
    return;
  }

  feedback.textContent = "A guardar a sua confirmação...";

  if (button) button.disabled = true;

  try {
    const { error } = await guestbookClient
      .from("guest_rsvps")
      .insert({
        guest_name: name,
        attendance: attendance,
        guest_count: count
      });

    if (error) throw error;

    feedback.textContent =
      "Confirmação enviada com sucesso! Agradecemos a sua resposta.";

    $("rsvpForm").reset();

  } catch (error) {
    console.error("Erro ao guardar confirmação:", error);
    feedback.textContent =
      "Não foi possível guardar a confirmação. Tente novamente.";
  } finally {
    if (button) button.disabled = false;
  }
}


$("openInvitation").addEventListener("click", openInvitation);
$("musicToggle").addEventListener("click", toggleMusic);
$("rsvpForm").addEventListener("submit", submitRSVP);
applyConfiguration();
updateCountdown();
window.setInterval(updateCountdown, 1000);

/* ==========================================================
   LIVRO DE MENSAGENS — SUPABASE
   ========================================================== */

const SUPABASE_URL = "https://kjcttibxlgctbuyqfggt.supabase.co";
const SUPABASE_KEY = "sb_publishable_wTpM0lYX6FvQpslzYVUgQg_5QeIzxww";

const guestbookClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

// Carregar apenas mensagens aprovadas pelos noivos
async function loadApprovedMessages() {
  const container = $("approvedMessages");

  try {
    const { data, error } = await guestbookClient
      .from("guest_messages")
      .select("guest_name, message, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    container.innerHTML = "";

    if (!data || data.length === 0) {
      container.innerHTML =
        '<p class="guestbook-empty">Ainda não existem mensagens publicadas. Seja o primeiro a deixar uma palavra especial!</p>';
      return;
    }

    data.forEach(item => {
      const article = document.createElement("article");
      article.className = "guestbook-message";

      const name = document.createElement("strong");
      name.textContent = item.guest_name;

      const message = document.createElement("p");
      message.textContent = item.message;

      const date = document.createElement("small");
      date.textContent = new Date(item.created_at).toLocaleDateString("pt-PT");

      article.append(name, message, date);
      container.appendChild(article);
    });

  } catch (error) {
    console.error("Erro ao carregar mensagens:", error);
    container.innerHTML =
      '<p class="guestbook-empty">Não foi possível carregar as mensagens neste momento.</p>';
  }
}

// Enviar uma nova mensagem
async function submitGuestbookMessage(event) {
  event.preventDefault();

  const nameInput = $("messageGuestName");
  const messageInput = $("guestMessage");
  const feedback = $("guestbookFeedback");
  const button = event.submitter;

  const guestName = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (guestName.length < 2 || message.length < 3) {
    feedback.textContent = "Preencha correctamente o seu nome e a mensagem.";
    return;
  }

  feedback.textContent = "A enviar a sua mensagem...";

  if (button) button.disabled = true;

  try {
    const { error } = await guestbookClient
      .from("guest_messages")
      .insert({
        guest_name: guestName,
        message: message
      });

    if (error) throw error;

    feedback.textContent =
      "Mensagem enviada com sucesso! Será publicada depois da aprovação dos noivos.";

    $("guestbookForm").reset();

  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    feedback.textContent =
      "Não foi possível enviar a mensagem. Verifique a ligação e tente novamente.";

  } finally {
    if (button) button.disabled = false;
  }
}

// Activar o formulário e carregar mensagens
const guestbookForm = $("guestbookForm");

if (guestbookForm) {
  guestbookForm.addEventListener("submit", submitGuestbookMessage);
  loadApprovedMessages();
}
/* ==========================================================
   ANIMAÇÕES AO PERCORRER A PÁGINA
   ========================================================== */

function setupScrollReveal() {
  const elementsToReveal = document.querySelectorAll(
    ".welcome, .countdown > div, .countdown-note, .gallery-item, .dress-code, .guestbook-card, .rsvp-card, .footer > *"
  );

  elementsToReveal.forEach(element => {
    element.classList.add("scroll-reveal");
  });

  if (!("IntersectionObserver" in window)) {
    elementsToReveal.forEach(element => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  });

  elementsToReveal.forEach(element => {
    observer.observe(element);
  });
}

setupScrollReveal();


/* =========================================
   CALENDÁRIO INTERACTIVO DO CASAMENTO
   ========================================= */

/* =========================================
   CALENDÁRIO FIXO DO CASAMENTO
   ========================================= */

function setupWeddingCalendar() {
  const monthTitle = document.getElementById("calendarMonth");
  const daysContainer = document.getElementById("calendarDays");

  if (!monthTitle || !daysContainer) return;

  const year = 2027;
  const month = 5; // Junho (Janeiro = 0)
  const weddingDay = 11;

  monthTitle.textContent = "Junho de 2027";
  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // A semana começa na segunda-feira
  const startingDay = (firstDay + 6) % 7;

  // Espaços antes do primeiro dia
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    daysContainer.appendChild(emptyDay);
  }

  // Criar os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";

    const dayNumber = document.createElement("span");
    dayNumber.textContent = day;

    if (day === weddingDay) {
      dayElement.classList.add("wedding-day");
      dayElement.setAttribute(
        "aria-label",
        "11 de Junho de 2027 — Dia do casamento"
      );
    }

    dayElement.appendChild(dayNumber);
    daysContainer.appendChild(dayElement);
  }
}

setupWeddingCalendar();
