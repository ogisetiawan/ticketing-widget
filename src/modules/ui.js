import { ConfigModule } from "./config";
import { TicketManager } from "./ticketManager";
import { LottieModule } from "./lottie";
import { ModalFactory } from "./modalFactory";
export const WidgetUI = (() => {
    let elements = null;
    const createAndAppendModal = () => {
        const widget = document.querySelector(".ticket-widget");
        if (!widget) {
            throw new Error("Widget container not found");
        }
        const modal = ModalFactory.createModal();
        widget.appendChild(modal);
        return modal;
    };
    const queryElements = () => {
        const fab = document.getElementById("support-fab");
        let modal = document.getElementById("ticket-modal");
        // Create modal if it doesn't exist
        if (!modal) {
            modal = createAndAppendModal();
        }
        const closeBtn = modal.querySelector(".ticket-modal__close");
        const form = modal.querySelector("#ticket-form");
        const fileInput = modal.querySelector("#file-input");
        const warning = modal.querySelector("#file-warning");
        const contactInput = modal.querySelector("#contact-field");
        const tabButtons = modal.querySelectorAll(".tab-btn");
        const tabPanels = modal.querySelectorAll(".tab-panel");
        const historyBody = modal.querySelector("#ticket-history-body");
        if (!fab ||
            !modal ||
            !closeBtn ||
            !form ||
            !fileInput ||
            !warning ||
            !contactInput ||
            tabButtons.length === 0 ||
            tabPanels.length === 0 ||
            !historyBody) {
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
            historyBody: historyBody,
        };
    };
    const toggleModal = (show) => {
        if (!elements)
            return;
        const { modal, fab } = elements;
        const shouldShow = typeof show === "boolean" ? show : modal.getAttribute("aria-hidden") === "true";
        modal.setAttribute("aria-hidden", shouldShow ? "false" : "true");
        fab.style.display = shouldShow ? "none" : "inline-flex";
    };
    const bindModalEvents = () => {
        if (!elements)
            return;
        const { fab, modal, closeBtn } = elements;
        fab.addEventListener("click", () => toggleModal(true));
        closeBtn.addEventListener("click", () => toggleModal(false));
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                toggleModal(false);
            }
        });
    };
    const setActiveTab = (target) => {
        if (!elements)
            return;
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
        if (!elements)
            return;
        elements.tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const tab = button.dataset.tab;
                setActiveTab(tab);
            });
        });
    };
    const bindFileValidation = () => {
        if (!elements)
            return;
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
        if (!elements)
            return;
        const { historyBody } = elements;
        const { emptyStateText } = ConfigModule.getConfig();
        const list = TicketManager.list();
        if (!list.length) {
            historyBody.innerHTML = `<tr class="empty-row"><td colspan="7">${emptyStateText}</td></tr>`;
            return;
        }
        const rows = list
            .map((ticket) => `
          <tr>
            <td>${ticket.id}</td>
            <td>${ticket.user}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.apps}</td>
            <td><span class="badge ${getTypeBadgeClass(ticket.type)}">${ticket.type}</span></td>
            <td><span class="badge ${getStatusBadgeClass(ticket.status)}">${ticket.status}</span></td>
            <td>${ticket.date}</td>
          </tr>
        `)
            .join("");
        historyBody.innerHTML = rows;
    };
    const getTypeBadgeClass = (type) => {
        const map = {
            "Bug Report": "badge-type-bug",
            Support: "badge-type-support",
            "Feature Request": "badge-type-feature",
            Others: "badge-type-others",
        };
        return map[type] ?? "badge-type-support";
    };
    const getStatusBadgeClass = (status) => {
        const map = {
            Pending: "badge-status-pending",
            "In Progress": "badge-status-in-progress",
            Resolved: "badge-status-resolved",
            Closed: "badge-status-closed",
        };
        return map[status] ?? "badge-status-pending";
    };
    const showToast = (message, duration) => {
        let toastElement = document.querySelector('.toast');
        if (!toastElement) {
            toastElement = document.createElement('div');
            toastElement.className = 'toast';
            document.body.appendChild(toastElement);
        }
        toastElement.textContent = message;
        setTimeout(() => {
            toastElement.classList.add('show');
        }, 10);
        setTimeout(() => {
            hideToast(toastElement);
        }, duration);
    };
    const hideToast = (toastElement) => {
        if (!toastElement)
            return;
        toastElement.classList.remove('show');
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 400);
    };
    const bindFormSubmit = () => {
        if (!elements)
            return;
        const { form, warning, contactInput, fileInput } = elements;
        const { successMessage, defaultName, defaultEmail, apiUrl, sharedSecret, appsLabel } = ConfigModule.getConfig();
        const userDisplay = `${defaultName} - ${defaultEmail}`;
        contactInput.value = userDisplay;
        const setLoading = (isLoading) => {
            const submitButton = form?.querySelector('button[type="submit"]');
            if (!submitButton)
                return;
            submitButton.disabled = isLoading;
            if (isLoading) {
                if (!submitButton.dataset.originalText) {
                    submitButton.dataset.originalText = submitButton.innerHTML;
                }
                submitButton.classList.add('loading');
                submitButton.innerHTML = `
              <span class="spinner"></span>
              Submitting...
          `;
            }
            else {
                submitButton.classList.remove('loading');
                submitButton.innerHTML = submitButton.dataset.originalText || 'Submit Ticket';
            }
        };
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
            const type = String(formData.get("type") ?? "Support");
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
            const headers = {};
            if (sharedSecret) {
                headers["x-shared-secret"] = sharedSecret;
            }
            setLoading(true);
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
                showToast(successMessage, 4000);
                form.reset();
                contactInput.value = userDisplay;
                warning.textContent = "";
                renderTickets();
                toggleModal(false);
            }
            catch (error) {
                console.error(error);
                warning.textContent = "Network error while submitting ticket.";
            }
            finally {
                setLoading(false);
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
