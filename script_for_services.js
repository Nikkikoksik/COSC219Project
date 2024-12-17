// JavaScript to update total price
const foodItems = document.querySelectorAll('input[type="checkbox"]');
const totalPriceElement = document.getElementById('totalPrice');

// Function to calculate the total
function updateTotal() {
    let total = 0;
    foodItems.forEach(item => {
        if (item.checked) {
            total += parseFloat(item.value);
        }
    });
    totalPriceElement.innerText = total + '$';
}

// Event listeners for checkboxes to update total when checked/unchecked
foodItems.forEach(item => {
    item.addEventListener('change', updateTotal);
});
