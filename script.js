const DEFAULT_NAME = "[Internal User Name]";
const DEFAULT_EMAIL = "[Internal User Email]";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const fab = document.getElementById("support-fab");
const modal = document.getElementById("ticket-modal");
const closeBtn = document.querySelector(".ticket-modal__close");
const form = document.getElementById("ticket-form");
const fileInput = document.getElementById("file-input");
const warning = document.getElementById("file-warning");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const historyBody = document.getElementById("ticket-history-body");

const contactInput = document.getElementById("contact-field");

const CONTACT_VALUE = `${DEFAULT_NAME} - ${DEFAULT_EMAIL}`;
contactInput.value = CONTACT_VALUE;

const tickets = [];
let ticketCounter = 1;

function toggleModal(show) {
  const shouldShow = show ?? modal.getAttribute("aria-hidden") === "true";
  modal.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  fab.style.display = shouldShow ? "none" : "inline-flex";
}

fab.addEventListener("click", () => toggleModal(true));
closeBtn.addEventListener("click", () => toggleModal(false));
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    toggleModal(false);
  }
});

fileInput.addEventListener("change", () => {
  warning.textContent = "";
  const files = Array.from(fileInput.files);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_FILE_SIZE) {
    warning.textContent =
      "Total file size exceeds 5 MB. Please reduce the number of files.";
    fileInput.value = "";
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (warning.textContent !== "") {
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const typeValue = form.elements["type"].value;
  const subjectValue = form.elements["subject"].value;

  alert("Ticket submitted successfully!");
  form.reset();
  contactInput.value = CONTACT_VALUE;
  warning.textContent = "";

  addTicket({
    user: CONTACT_VALUE,
    type: typeValue,
    subject: subjectValue,
    progress: "Pending",
  });

  toggleModal(false);
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;
    setActiveTab(target);
  });
});

function setActiveTab(target) {
  tabButtons.forEach((btn) => {
    const isTarget = btn.dataset.tab === target;
    btn.classList.toggle("active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  tabPanels.forEach((panel) => {
    const isTarget = panel.id === `${target}-panel`;
    panel.classList.toggle("active", isTarget);
    panel.toggleAttribute("hidden", !isTarget);
  });
}

function formatDate(date) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function addTicket({ user, type, subject, progress = "Pending" }) {
  tickets.unshift({
    id: ticketCounter++,
    user,
    apps: "Portal Behn Meyer",
    type,
    subject,
    progress,
    date: formatDate(new Date()),
  });
  renderTickets();
}

function getTypeBadgeClass(type) {
  const typeMap = {
    bug: "badge-type-bug",
    support: "badge-type-support",
    feature: "badge-type-feature",
  };
  return typeMap[type.toLowerCase()] || "badge-type-support";
}

function getStatusBadgeClass(status) {
  const statusMap = {
    pending: "badge-status-pending",
    "in progress": "badge-status-in-progress",
    resolved: "badge-status-resolved",
    closed: "badge-status-closed",
  };
  return statusMap[status.toLowerCase()] || "badge-status-pending";
}

function renderTickets() {
  if (!tickets.length) {
    historyBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="6">No tickets submitted yet.</td>
      </tr>
    `;
    return;
  }

  historyBody.innerHTML = tickets
    .map(
      (ticket) => `
        <tr>
          <td>${ticket.user}</td>
          <td>${ticket.subject}</td>
          <td>${ticket.apps || "N/A"}</td>
          <td><span class="badge ${getTypeBadgeClass(ticket.type)}">${ticket.type}</span></td>
          <td><span class="badge ${getStatusBadgeClass(ticket.progress)}">${ticket.progress}</span></td>
          <td>${ticket.date}</td>
        </tr>
      `
    )
    .join("");
}

renderTickets();

