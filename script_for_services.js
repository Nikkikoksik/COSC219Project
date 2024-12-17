const foodItems = document.querySelectorAll('input[type="checkbox"]');
const totalPriceElement = document.getElementById('totalPrice');

function updateTotal() {
    let total = 0;
    foodItems.forEach(item => {
        if (item.checked) {
            total += parseFloat(item.value);
        }
    });
    totalPriceElement.innerText = total + '$';
}
foodItems.forEach(item => {
    item.addEventListener('change', updateTotal);
});
