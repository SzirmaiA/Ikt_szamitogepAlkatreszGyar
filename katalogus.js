// Egyszerű termékkeresés és szűrés – nincs szükség könyvtárra.
const cards = [...document.querySelectorAll('.catalog-card')];
const grid = document.getElementById('catalogGrid');
const search = document.getElementById('searchInput');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const sortOrder = document.getElementById('sortOrder');
const categories = [...document.querySelectorAll('.category-checkbox')];
const count = document.getElementById('resultCount');
const empty = document.getElementById('emptyState');

function filterProducts() {
  const term = search.value.trim().toLocaleLowerCase('hu');
  const min = minPrice.value === '' ? 0 : Number(minPrice.value);
  const max = maxPrice.value === '' ? Infinity : Number(maxPrice.value);
  const selected = categories.filter(box => box.checked).map(box => box.value);
  const visible = cards.filter(card => {
    const price = Number(card.dataset.price);
    return card.dataset.search.includes(term) && price >= min && price <= max &&
      (selected.length === 0 || selected.includes(card.dataset.category));
  });
  visible.sort((a, b) => {
    if (sortOrder.value === 'price-asc') return Number(a.dataset.price) - Number(b.dataset.price);
    if (sortOrder.value === 'price-desc') return Number(b.dataset.price) - Number(a.dataset.price);
    if (sortOrder.value === 'name') return a.dataset.name.localeCompare(b.dataset.name, 'hu');
    return cards.indexOf(a) - cards.indexOf(b);
  });
  cards.forEach(card => card.hidden = true);
  visible.forEach(card => { card.hidden = false; grid.appendChild(card); });
  count.textContent = `${visible.length} termék található`;
  empty.hidden = visible.length !== 0;
}
function resetFilters() {
  search.value = '';
  minPrice.value = '';
  maxPrice.value = '';
  sortOrder.value = 'default';
  categories.forEach(box => box.checked = false);
  filterProducts();
}
[search, minPrice, maxPrice, sortOrder, ...categories].forEach(input =>
  input.addEventListener('input', filterProducts));
['resetTop', 'resetFilters', 'resetEmpty'].forEach(id =>
  document.getElementById(id).addEventListener('click', resetFilters));
filterProducts();
