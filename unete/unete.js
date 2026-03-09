// ── Formulario de registro — unete.html ────────────────────────────────────

const $form     = document.querySelector(".modern-form");
const $btn      = document.getElementById("submit-btn");
const $btnText  = document.getElementById("btn-text");
const $feedback = document.getElementById("form-feedback");

// Muestra un mensaje de retroalimentación con estilos según el tipo
function showFeedback(message, type) {
    const styles = {
        success: { bg: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" },
        error:   { bg: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5" },
        loading: { bg: "#ede9fe", color: "#4c1d95", border: "1px solid #c4b5fd" },
    };
    const s = styles[type];
    $feedback.style.display  = "block";
    $feedback.style.background = s.bg;
    $feedback.style.color    = s.color;
    $feedback.style.border   = s.border;
    $feedback.textContent    = message;
}

// Maneja el envío del formulario
$form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showFeedback("⚠️ Por favor completa el reCAPTCHA antes de enviar.", "error");
        return;
    }

    $btn.disabled = true;
    $btnText.textContent = "ENVIANDO...";
    showFeedback("⏳ Enviando tu solicitud...", "loading");

    try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
            method: this.method,
            body: formData,
            headers: { "Accept": "application/json" }
        });

        const data = await response.json();

        if (response.ok) {
            this.reset();
            grecaptcha.reset();
            showFeedback("✅ ¡Gracias por aplicar al club! Nos pondremos en contacto contigo pronto.", "success");
            $btnText.textContent = "¡ENVIADO!";
        } else {
            let errorMsg = "Hubo un problema al enviar el formulario.";
            if (data.errors && data.errors.length > 0) {
                errorMsg = data.errors.map(e => e.message || e.code).join(", ");
            } else if (data.error) {
                errorMsg = data.error;
            }
            showFeedback("❌ Error: " + errorMsg + " Intenta de nuevo.", "error");
            grecaptcha.reset();
            $btn.disabled = false;
            $btnText.textContent = "ENVIAR";
        }
    } catch (networkError) {
        showFeedback("❌ Sin conexión a internet. Revisa tu red e intenta de nuevo.", "error");
        grecaptcha.reset();
        $btn.disabled = false;
        $btnText.textContent = "ENVIAR";
    }
});
