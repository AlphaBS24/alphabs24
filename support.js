document.addEventListener("DOMContentLoaded", function () {
  // EmailJS ayarları: https://www.emailjs.com saytından alın və bura yazın.
  // Boş qalsa, mesaj e-poçt proqramında hazır şəkildə açılacaq.
  const EMAILJS = {
    publicKey: "YOUR_PUBLIC_KEY",
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
  };
  const TO = "alphabs240@gmail.com";

  const form = document.getElementById("supportForm");
  const statusBox = document.getElementById("status");
  const message = document.getElementById("message");
  const count = document.getElementById("count");

  message.addEventListener("input", () => {
    count.textContent = message.value.length;
  });

  function show(ok, text) {
    statusBox.style.color = ok ? "#0a8f3d" : "#dc2626";
    statusBox.innerHTML =
      '<i class="fa-solid ' +
      (ok ? "fa-circle-check" : "fa-circle-xmark") +
      '"></i> ' +
      text;
  }

  const configured =
    window.emailjs &&
    !EMAILJS.publicKey.startsWith("YOUR_") &&
    !EMAILJS.serviceId.startsWith("YOUR_") &&
    !EMAILJS.templateId.startsWith("YOUR_");

  if (configured) emailjs.init({ publicKey: EMAILJS.publicKey });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const sendBtn = form.querySelector(".send-btn");
    const params = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      subject: document.getElementById("subject").value.trim(),
      message: message.value.trim(),
    };

    if (params.message.length < 10) {
      show(false, "Message is too short (min 10 characters).");
      return;
    }

    // EmailJS qurulmayıbsa: e-poçt proqramı ilə göndər
    if (!configured) {
      const su = encodeURIComponent(params.subject);
      const body = encodeURIComponent(
        "Name: " + params.name + "\nEmail: " + params.email + "\n\n" + params.message,
      );
      if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        window.location.href = "mailto:" + TO + "?subject=" + su + "&body=" + body;
      } else {
        window.open(
          "https://mail.google.com/mail/?view=cm&fs=1&to=" + TO + "&su=" + su + "&body=" + body,
          "_blank",
        );
      }
      show(true, "Opening your email app...");
      return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    emailjs
      .send(EMAILJS.serviceId, EMAILJS.templateId, params)
      .then(() => {
        show(true, "Message sent successfully!");
        form.reset();
        count.textContent = 0;
      })
      .catch((error) => {
        console.error(error);
        show(false, "Failed to send message.");
      })
      .finally(() => {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      });
  });
});