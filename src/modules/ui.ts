import { ConfigModule } from "./config";
import { TicketManager, TicketRecord, TicketType } from "./ticketManager";
import { LottieModule } from "./lottie";
import { ModalFactory } from "./modalFactory";

const enum TabKey {
  Create = "create",
  History = "history",
}

type UIElements = {
  fab: HTMLButtonElement;
  modal: HTMLElement;
  closeBtn: HTMLButtonElement;
  form: HTMLFormElement;
  fileInput: HTMLInputElement;
  warning: HTMLElement;
  contactInput: HTMLInputElement;
  tabButtons: NodeListOf<HTMLButtonElement>;
  tabPanels: NodeListOf<HTMLElement>;
  historyBody: HTMLElement;
};

export const WidgetUI = (() => {
  let elements: UIElements | null = null;

  const createAndAppendModal = (): HTMLElement => {
    const widget = document.querySelector(".ticket-widget");
    if (!widget) {
      throw new Error("Widget container not found");
    }
    const modal = ModalFactory.createModal();
    widget.appendChild(modal);
    return modal;
  };

  const queryElements = (): UIElements => {
    const fab = document.getElementById("support-fab") as HTMLButtonElement | null;
    let modal = document.getElementById("ticket-modal") as HTMLElement | null;

    // Create modal if it doesn't exist
    if (!modal) {
      modal = createAndAppendModal();
    }

    const closeBtn = modal.querySelector(".ticket-modal__close") as HTMLButtonElement | null;
    const form = modal.querySelector("#ticket-form") as HTMLFormElement | null;
    const fileInput = modal.querySelector("#file-input") as HTMLInputElement | null;
    const warning = modal.querySelector("#file-warning") as HTMLElement | null;
    const contactInput = modal.querySelector("#contact-field") as HTMLInputElement | null;
    const tabButtons = modal.querySelectorAll<HTMLButtonElement>(".tab-btn");
    const tabPanels = modal.querySelectorAll<HTMLElement>(".tab-panel");
    const historyBody = modal.querySelector("#ticket-history-body") as HTMLElement | null;

    if (
      !fab ||
      !modal ||
      !closeBtn ||
      !form ||
      !fileInput ||
      !warning ||
      !contactInput ||
      tabButtons.length === 0 ||
      tabPanels.length === 0 ||
      !historyBody
    ) {
      throw new Error("Widget elements missing from DOM");
    }

    return {
      fab,
      modal,
      closeBtn,
      form,
      fileInput,
      warning,
      contactInput,
      tabButtons,
      tabPanels,
      historyBody: historyBody as HTMLElement,
    };
  };

  const toggleModal = (show?: boolean) => {
    if (!elements) return;
    const { modal, fab } = elements;
    const shouldShow = typeof show === "boolean" ? show : modal.getAttribute("aria-hidden") === "true";
    modal.setAttribute("aria-hidden", shouldShow ? "false" : "true");
    fab.style.display = shouldShow ? "none" : "inline-flex";
  };

  const bindModalEvents = () => {
    if (!elements) return;
    const { fab, modal, closeBtn } = elements;
    fab.addEventListener("click", () => toggleModal(true));
    closeBtn.addEventListener("click", () => toggleModal(false));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        toggleModal(false);
      }
    });
  };

  const setActiveTab = (target: TabKey) => {
    if (!elements) return;
    elements.tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === target;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    elements.tabPanels.forEach((panel) => {
      const isActive = panel.id === `${target}-panel`;
      panel.classList.toggle("active", isActive);
      panel.toggleAttribute("hidden", !isActive);
    });
  };

  const bindTabEvents = () => {
    if (!elements) return;
    elements.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab as TabKey;
        setActiveTab(tab);
      });
    });
  };

  const bindFileValidation = () => {
    if (!elements) return;
    const { fileInput, warning } = elements;
    const { maxFileSize, maxFiles } = ConfigModule.getConfig();

    fileInput.addEventListener("change", () => {
      warning.textContent = "";
      const files = Array.from(fileInput.files ?? []);
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      if (files.length > maxFiles) {
        warning.textContent = `Maximum ${maxFiles} files allowed. Please reduce the number of files.`;
        fileInput.value = "";
        return;
      }

      if (totalSize > maxFileSize) {
        warning.textContent = `Total file size exceeds ${maxFileSize / (1024 * 1024)} MB. Please reduce the file size.`;
        fileInput.value = "";
        return;
      }
    });
  };

  const renderTickets = () => {
    if (!elements) return;
    const { historyBody } = elements;
    const { emptyStateText } = ConfigModule.getConfig();
    const list = TicketManager.list();

    if (!list.length) {
      historyBody.innerHTML = `<tr class="empty-row"><td colspan="7">${emptyStateText}</td></tr>`;
      return;
    }

    const rows = list
      .map(
        (ticket: TicketRecord) => `
          <tr>
            <td>${ticket.id}</td>
            <td>${ticket.user}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.apps}</td>
            <td><span class="badge ${getTypeBadgeClass(ticket.type)}">${ticket.type}</span></td>
            <td><span class="badge ${getStatusBadgeClass(ticket.status)}">${ticket.status}</span></td>
            <td>${ticket.date}</td>
          </tr>
        `,
      )
      .join("");

    historyBody.innerHTML = rows;
  };

  const getTypeBadgeClass = (type: TicketType): string => {
    const map: Record<TicketType, string> = {
      "Bug Report": "badge-type-bug",
      Support: "badge-type-support",
      "Feature Request": "badge-type-feature",
      Others: "badge-type-others",
    };
    return map[type] ?? "badge-type-support";
  };

  const getStatusBadgeClass = (status: TicketRecord["status"]): string => {
    const map: Record<TicketRecord["status"], string> = {
      Pending: "badge-status-pending",
      "In Progress": "badge-status-in-progress",
      Resolved: "badge-status-resolved",
      Closed: "badge-status-closed",
    };
    return map[status] ?? "badge-status-pending";
  };

  const bindFormSubmit = () => {
    if (!elements) return;
    const { form, warning, contactInput, fileInput } = elements;
    const { successMessage, defaultName, defaultEmail, apiUrl, sharedSecret, appsLabel } = ConfigModule.getConfig();

    const userDisplay = `${defaultName} - ${defaultEmail}`;
    contactInput.value = userDisplay;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (warning.textContent) {
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const subject = String(formData.get("subject") ?? "").trim();
      const type = String(formData.get("type") ?? "Support") as TicketType;
      const message = String(formData.get("message") ?? "").trim();
      const files = Array.from(fileInput.files ?? []);

      const payload = new FormData();
      payload.set("email", defaultEmail);
      payload.set("username", defaultName);
      payload.set("subject", subject);
      payload.set("messages", message);
      payload.set("type", type);
      payload.set("apps", appsLabel);
      files.forEach((file) => payload.append("files", file));

      const headers: Record<string, string> = {};
      if (sharedSecret) {
        headers["x-shared-secret"] = sharedSecret;
      }

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers,
          body: payload,
        });

        if (!response.ok) {
          warning.textContent = `Failed to submit ticket. (${response.status})`;
          return;
        }

        TicketManager.addTicket({
          user: contactInput.value,
          subject,
          type,
        });

        alert(successMessage);
        form.reset();
        contactInput.value = userDisplay;
        warning.textContent = "";
        renderTickets();
        toggleModal(false);
      } catch (error) {
        console.error(error);
        warning.textContent = "Network error while submitting ticket.";
      }
    });
  };

  const initLottie = () => {
    const lottieContainer = document.getElementById("lottie-container");
    if (lottieContainer) {
      LottieModule.init(lottieContainer);
    }
  };

  const init = () => {
    elements = queryElements();
    initLottie();
    bindModalEvents();
    bindTabEvents();
    bindFileValidation();
    bindFormSubmit();
    renderTickets();
  };

  return {
    init,
  };
})();

