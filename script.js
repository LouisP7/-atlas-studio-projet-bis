const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const form = document.querySelector('.contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.innerHTML = '<p style="color:#9c8cff;font-weight:600;">Merci ! Votre message a bien été envoyé, nous vous répondons sous 24h.</p>';
});
