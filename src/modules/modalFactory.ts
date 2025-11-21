import logoIcon from "../image/bm-icon.svg?url";

export const ModalFactory = (() => {
  const createModal = (): HTMLElement => {
    const modal = document.createElement("div");
    modal.id = "ticket-modal";
    modal.className = "ticket-modal";
    modal.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "ticket-modal__content";
    content.setAttribute("role", "dialog");
    content.setAttribute("aria-modal", "true");

    // Header with logo
    const header = document.createElement("div");
    header.className = "ticket-modal__header";

    const headerTitle = document.createElement("div");
    headerTitle.className = "ticket-modal__title-wrapper";

    const logo = document.createElement("img");
    logo.src = logoIcon;
    logo.alt = "Behn Meyer Logo";
    logo.className = "ticket-modal__logo";

    const title = document.createElement("h2");
    title.textContent = "Behn Meyer - Ticketing Support Widget";

    headerTitle.appendChild(logo);
    headerTitle.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.className = "ticket-modal__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "&times;";

    header.appendChild(headerTitle);
    header.appendChild(closeBtn);

    // Tabs
    const tabs = document.createElement("div");
    tabs.className = "ticket-modal__tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Ticket sections");

    const createTabBtn = document.createElement("button");
    createTabBtn.className = "tab-btn active";
    createTabBtn.type = "button";
    createTabBtn.dataset.tab = "create";
    createTabBtn.setAttribute("role", "tab");
    createTabBtn.setAttribute("aria-selected", "true");
    createTabBtn.setAttribute("aria-controls", "create-panel");
    createTabBtn.id = "tab-create";
    createTabBtn.textContent = "Create Ticket";

    const historyTabBtn = document.createElement("button");
    historyTabBtn.className = "tab-btn";
    historyTabBtn.type = "button";
    historyTabBtn.dataset.tab = "history";
    historyTabBtn.setAttribute("role", "tab");
    historyTabBtn.setAttribute("aria-selected", "false");
    historyTabBtn.setAttribute("aria-controls", "history-panel");
    historyTabBtn.id = "tab-history";
    historyTabBtn.textContent = "My Tickets";

    tabs.appendChild(createTabBtn);
    tabs.appendChild(historyTabBtn);

    // Body
    const body = document.createElement("div");
    body.className = "ticket-modal__body";

    // Create Ticket Panel
    const createPanel = document.createElement("div");
    createPanel.className = "tab-panel active";
    createPanel.id = "create-panel";
    createPanel.setAttribute("role", "tabpanel");
    createPanel.setAttribute("aria-labelledby", "tab-create");

    const form = document.createElement("form");
    form.id = "ticket-form";
    form.setAttribute("novalidate", "");

    // Username - Email field
    const userLabel = document.createElement("label");
    userLabel.className = "combined-field";
    const userLabelText = document.createElement("span");
    userLabelText.className = "label-text";
    userLabelText.textContent = "Username - Email";
    const userInput = document.createElement("input");
    userInput.type = "text";
    userInput.id = "contact-field";
    userInput.name = "contact";
    userInput.placeholder = "[Internal User Name] - [Internal User Email]";
    userInput.readOnly = true;
    userInput.required = true;
    userLabel.appendChild(userLabelText);
    userLabel.appendChild(userInput);

    // Type field
    const typeLabel = document.createElement("label");
    const typeLabelText = document.createTextNode("Type");
    const typeSelect = document.createElement("select");
    typeSelect.name = "type";
    typeSelect.required = true;
    typeSelect.innerHTML = `
      <option value="">Select Report Type...</option>
      <option value="bug">Bug Report</option>
      <option value="support">Support</option>
      <option value="feature">Feature Request</option>
    `;
    typeLabel.appendChild(typeLabelText);
    typeLabel.appendChild(typeSelect);

    // Subject field
    const subjectLabel = document.createElement("label");
    const subjectLabelText = document.createTextNode("Subject");
    const subjectInput = document.createElement("input");
    subjectInput.type = "text";
    subjectInput.name = "subject";
    subjectInput.required = true;
    subjectLabel.appendChild(subjectLabelText);
    subjectLabel.appendChild(subjectInput);

    // Message field
    const messageLabel = document.createElement("label");
    const messageLabelText = document.createTextNode("Message");
    const messageTextarea = document.createElement("textarea");
    messageTextarea.name = "message";
    messageTextarea.rows = 4;
    messageTextarea.required = true;
    messageLabel.appendChild(messageLabelText);
    messageLabel.appendChild(messageTextarea);

    // Additional File field
    const fileLabel = document.createElement("label");
    fileLabel.className = "optional-field";
    const fileLabelText = document.createElement("span");
    fileLabelText.className = "label-text";
    fileLabelText.innerHTML = 'Additional File <span class="optional-label">(optional)</span>';
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "file-input";
    fileInput.name = "files";
    fileInput.multiple = true;
    const fileWarning = document.createElement("small");
    fileWarning.id = "file-warning";
    fileWarning.className = "file-warning";
    fileLabel.appendChild(fileLabelText);
    fileLabel.appendChild(fileInput);
    fileLabel.appendChild(fileWarning);

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Submit Ticket";

    form.appendChild(userLabel);
    form.appendChild(typeLabel);
    form.appendChild(subjectLabel);
    form.appendChild(messageLabel);
    form.appendChild(fileLabel);
    form.appendChild(submitBtn);
    createPanel.appendChild(form);

    // History Panel
    const historyPanel = document.createElement("div");
    historyPanel.className = "tab-panel";
    historyPanel.id = "history-panel";
    historyPanel.setAttribute("role", "tabpanel");
    historyPanel.setAttribute("aria-labelledby", "tab-history");
    historyPanel.hidden = true;

    const historyDiv = document.createElement("div");
    historyDiv.className = "ticket-history";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["User", "Subject", "Apps", "Type", "Status", "Date"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    const tbody = document.createElement("tbody");
    tbody.id = "ticket-history-body";
    const emptyRow = document.createElement("tr");
    emptyRow.className = "empty-row";
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 6;
    emptyCell.textContent = "No tickets submitted yet.";
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    historyDiv.appendChild(table);
    historyPanel.appendChild(historyDiv);

    body.appendChild(createPanel);
    body.appendChild(historyPanel);

    content.appendChild(header);
    content.appendChild(tabs);
    content.appendChild(body);
    modal.appendChild(content);

    return modal;
  };

  return {
    createModal,
  };
})();

