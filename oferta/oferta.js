// ── Carruseles de eventos — oferta.html ────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

    // Botones "anterior" (←): desplaza el grid hacia la izquierda
    document.querySelectorAll('.carousel-btn.prev').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const grid = this.parentElement.querySelector('.cards-grid');
            const card = grid.querySelector('.card');
            grid.scrollBy({ left: -(card.offsetWidth + 28), behavior: 'smooth' });
        });
    });

    // Botones "siguiente" (→): desplaza el grid hacia la derecha
    document.querySelectorAll('.carousel-btn.next').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const grid = this.parentElement.querySelector('.cards-grid');
            const card = grid.querySelector('.card');
            grid.scrollBy({ left: card.offsetWidth + 28, behavior: 'smooth' });
        });
    });

    // Click en tarjeta: abre el link guardado en data-url
    document.querySelectorAll('.card[data-url]').forEach(function (card) {
        card.addEventListener('click', function () {
            window.open(this.dataset.url, '_blank');
        });
    });

});
