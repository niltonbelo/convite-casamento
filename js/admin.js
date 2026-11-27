
// ======================================
// CONFIGURAÇÃO DO SUPABASE
// ======================================

const SUPABASE_URL = "https://kjcttibxlgctbuyqfggt.supabase.co";
const SUPABASE_KEY = "sb_publishable_wTpM0lYX6FvQpslzYVUgQg_5QeIzxww";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ======================================
// ELEMENTOS DA PÁGINA
// ======================================

const loginPanel = document.getElementById("loginPanel");
const adminPanel = document.getElementById("adminPanel");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const statusElement = document.getElementById("status");
const welcomeElement = document.getElementById("welcome");
const messagesElement = document.getElementById("messages");
const rsvpsElement = document.getElementById("rsvps");
const exportRSVPsButton = document.getElementById("exportRSVPs");
const acceptedCountElement = document.getElementById("acceptedCount");
const declinedCountElement = document.getElementById("declinedCount");
const peopleCountElement = document.getElementById("peopleCount");
const totalCountElement = document.getElementById("totalCount");
// ======================================
// LOGIN COM GITHUB
// ======================================

loginButton.addEventListener("click", async () => {
  statusElement.textContent = "A redirecionar para o GitHub...";

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });

  if (error) {
    statusElement.textContent = "Erro no login: " + error.message;
  }
});

// ======================================
// VERIFICAR AUTORIZAÇÃO
// ======================================

async function checkSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    statusElement.textContent = "Erro ao verificar sessão.";
    return;
  }

  if (!data.session) {
    showLogin();
    return;
  }

  const user = data.session.user;

  const { data: authorized, error: adminError } =
    await supabaseClient.rpc("is_admin");

  if (adminError) {
    showLogin();
    statusElement.textContent =
      "Não foi possível verificar as permissões: " +
      adminError.message;
    return;
  }

  if (!authorized) {
    showLogin();
    statusElement.textContent =
      "A tua conta entrou com sucesso, mas ainda não está autorizada. " +
      "O teu ID de utilizador é: " + user.id;
    return;
  }

  showAdmin(user);
}

// ======================================
// MOSTRAR PAINEL
// ======================================

function showLogin() {
  loginPanel.hidden = false;
  adminPanel.hidden = true;
}

function showAdmin(user) {
  loginPanel.hidden = true;
  adminPanel.hidden = false;

  welcomeElement.textContent =
    "Sessão iniciada: " +
    (user.user_metadata.full_name ||
     user.user_metadata.name ||
     user.email ||
     "Administrador");

  loadMessages();
  loadRSVPs();
}

// ======================================
// CARREGAR MENSAGENS
// ======================================

async function loadMessages() {
  messagesElement.textContent = "A carregar mensagens...";

  const { data, error } = await supabaseClient
    .from("guest_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    messagesElement.textContent =
      "Erro ao carregar mensagens: " + error.message;
    return;
  }

  messagesElement.replaceChildren();

  if (!data || data.length === 0) {
    messagesElement.textContent = "Ainda não existem mensagens.";
    return;
  }

  data.forEach((message) => {
    const card = document.createElement("article");
    card.className = "message";

    const name = document.createElement("strong");
    name.textContent = message.guest_name;

    const date = document.createElement("div");
    date.className = "muted";
    date.textContent =
      new Date(message.created_at).toLocaleString("pt-PT");

    const content = document.createElement("p");
    content.textContent = message.message;

    const state = document.createElement("div");
    state.className = "muted";
    state.textContent =
      message.status === "approved" ? "Aprovada" : "Pendente";

    card.append(name, date, content, state);

    if (message.status === "pending") {
      const approveButton = document.createElement("button");
      approveButton.className = "approve";
      approveButton.textContent = "Aprovar";

      approveButton.addEventListener("click", () => {
        updateMessage(message.id, "approved");
      });

      card.appendChild(approveButton);
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.textContent = "Eliminar";

    deleteButton.addEventListener("click", () => {
      deleteMessage(message.id);
    });

    card.appendChild(deleteButton);
    messagesElement.appendChild(card);
  });
}

// ======================================
// CARREGAR CONFIRMAÇÕES DE PRESENÇA
// ======================================
// ======================================
// EXPORTAR CONFIRMAÇÕES PARA EXCEL
// ======================================

async function exportRSVPs() {
  const { data, error } = await supabaseClient
    .from("guest_rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    alert("Erro ao exportar confirmações: " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("Ainda não existem confirmações para exportar.");
    return;
  }

  const headers = [
    "Nome do convidado",
    "Confirmação",
    "Número de pessoas",
    "Data da resposta"
  ];

  const rows = data.map((rsvp) => [
    rsvp.guest_name,
    rsvp.attendance,
    rsvp.guest_count,
    new Date(rsvp.created_at).toLocaleString("pt-PT")
  ]);

  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csvContent = [
    headers.map(escapeCSV).join(";"),
    ...rows.map(row => row.map(escapeCSV).join(";"))
  ].join("\r\n");

  const blob = new Blob(
    ["\uFEFF" + csvContent],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "confirmacoes-casamento.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}
async function loadRSVPs() {
  rsvpsElement.textContent = "A carregar confirmações...";

  const { data, error } = await supabaseClient
    .from("guest_rsvps")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    rsvpsElement.textContent =
      "Erro ao carregar confirmações: " + error.message;
    return;
  }
  // Calcular estatísticas das confirmações
const accepted = data.filter(
  (rsvp) => rsvp.attendance === "Sim, estarei presente"
);

const declined = data.filter(
  (rsvp) => rsvp.attendance === "Não poderei estar presente"
);

const totalPeople = accepted.reduce(
  (sum, rsvp) => sum + Number(rsvp.guest_count),
  0
);

// Actualizar os indicadores
acceptedCountElement.textContent = accepted.length;
declinedCountElement.textContent = declined.length;
peopleCountElement.textContent = totalPeople;
totalCountElement.textContent = data.length;

  rsvpsElement.replaceChildren();

  if (!data || data.length === 0) {
    rsvpsElement.textContent =
      "Ainda não existem confirmações de presença.";
    return;
  }

  data.forEach((rsvp) => {
    const card = document.createElement("article");
    card.className = "message";

    const name = document.createElement("strong");
    name.textContent = rsvp.guest_name;

    const attendance = document.createElement("p");
    attendance.textContent =
      "Confirmação: " + rsvp.attendance;

    const count = document.createElement("p");
    count.textContent =
      "Número de pessoas: " + rsvp.guest_count;

    const date = document.createElement("div");
    date.className = "muted";
    date.textContent =
      new Date(rsvp.created_at).toLocaleString("pt-PT");

    card.append(name, attendance, count, date);

    rsvpsElement.appendChild(card);
  });
}
// ======================================
// APROVAR MENSAGEM
// ======================================

async function updateMessage(id, newStatus) {
  if (!confirm("Queres aprovar esta mensagem?")) return;

  const { error } = await supabaseClient
    .from("guest_messages")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    alert("Não foi possível aprovar: " + error.message);
    return;
  }

  loadMessages();
}

// ======================================
// ELIMINAR MENSAGEM
// ======================================

async function deleteMessage(id) {
  if (!confirm("Tens a certeza de que queres eliminar esta mensagem?")) {
    return;
  }

  const { error } = await supabaseClient
    .from("guest_messages")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Não foi possível eliminar: " + error.message);
    return;
  }

  loadMessages();
}

// ======================================
// EVENTO DO BOTÃO DE EXPORTAÇÃO
// ======================================

exportRSVPsButton.addEventListener("click", exportRSVPs);
// ======================================
// TERMINAR SESSÃO
// ======================================

logoutButton.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Erro ao terminar sessão: " + error.message);
    return;
  }

  showLogin();
  statusElement.textContent = "Sessão terminada.";
});

// ======================================
// INICIALIZAÇÃO
// ======================================

supabaseClient.auth.onAuthStateChange(() => {
  checkSession();
});

checkSession();
