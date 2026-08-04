const openBook = document.getElementById('openBook');
const closeBook = document.getElementById('closeBook');
const book = document.getElementById('book');
const nextPage = document.getElementById('nextPage');

openBook.addEventListener('click', () => book.classList.add('open'));
closeBook.addEventListener('click', () => book.classList.remove('open'));
book.addEventListener('click', (event) => {
  if (event.target === book) book.classList.remove('open');
});
nextPage.addEventListener('click', () => {
  const page = document.querySelector('.page-right');
  page.querySelector('span').textContent = '02';
  page.querySelector('h3').textContent = 'Prototype studies';
  page.querySelector('p').textContent = 'A visual archive for experiments, prototypes, and ideas that are still finding their final form.';
  nextPage.textContent = 'Close page →';
  nextPage.onclick = () => book.classList.remove('open');
});
