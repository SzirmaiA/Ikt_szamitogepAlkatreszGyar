(() => {
  const form = document.getElementById("contactForm");
  const steps = Array.from(form.querySelectorAll(".contact-step"));
  const status = document.getElementById("contactStatus");
  const progress = Array.from(document.querySelectorAll(".contact-progress span"));
  const next = document.getElementById("contactNext");
  const back = document.getElementById("contactBack");
  const submit = document.getElementById("contactSubmit");
  const counter = document.getElementById("contactStepCount");
  const endpoint = document.querySelector('meta[name="contact-api-url"]')?.content.trim() || "";
  let currentStep = 0;

  function showStatus(message, success = false) {
    status.textContent = message;
    status.classList.toggle("success", success);
  }

  function showStep(index) {
    currentStep = index;
    steps.forEach((step, i) => {
      step.hidden = i !== index;
      step.querySelectorAll("input, select, textarea").forEach(field => {
        if (field.name !== "website") field.disabled = i !== index;
      });
    });
    progress.forEach((item, i) => item.classList.toggle("active", i <= index));
    counter.textContent = index === 0 ? "01 / 02" : "02 / 02";
    showStatus("");
  }

  function validateStep(index) {
    const fields = Array.from(steps[index].querySelectorAll("input, select, textarea"))
      .filter(field => field.name !== "website");
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.setAttribute("aria-invalid", "true");
        field.reportValidity();
        field.focus();
        return false;
      }
      field.removeAttribute("aria-invalid");
    }
    return true;
  }

  next.addEventListener("click", () => {
    if (validateStep(0)) showStep(1);
  });
  back.addEventListener("click", () => showStep(0));

  form.addEventListener("input", event => {
    if (event.target instanceof HTMLElement) event.target.removeAttribute("aria-invalid");
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!validateStep(1)) return;
    if (!endpoint) {
      showStatus("A beküldés még nincs beállítva. A GitHubra mentéshez előbb csatlakoztatni kell a biztonságos API-t.");
      return;
    }
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      company: String(data.get("company") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
      consent: data.get("consent") === "on",
      website: String(data.get("website") || "")
    };
    submit.disabled = true;
    submit.firstChild.textContent = "Küldés...";
    showStatus("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || body.ok !== true) {
        throw new Error(body.error || "Nem sikerült menteni az üzenetet.");
      }
      form.reset();
      showStep(0);
      showStatus("Köszönjük! Az üzeneted sikeresen elmentettük.", true);
    } catch (error) {
      showStatus(error instanceof Error ? error.message : "Hiba történt. Próbáld újra később.");
    } finally {
      submit.disabled = false;
      submit.firstChild.textContent = "Üzenet küldése ";
    }
  });

  showStep(0);
})();
