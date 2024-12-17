document.addEventListener('DOMContentLoaded', function() {
    // Get all checkboxes and recipe cards
    // DOMContentLoaded event, works only when the initial HTML document has been fully loaded
    const filterCheckboxes = document.querySelectorAll('.filters-section input[type="checkbox"]');
    const recipeCards = document.querySelectorAll('.recipe-list-card');
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');


    // Map checkbox IDs to their filter categories
    // Ex: breakfast and lunch belong in the mealType category
    const filterCategories = {
        breakfast: 'mealType',
        lunch: 'mealType',
        dinner: 'mealType',
        dessert: 'mealType',
        italian: 'cuisine',
        asian: 'cuisine',
        mexican: 'cuisine',
        european: 'cuisine',
        vegetarian: 'dietary',
        vegan: 'dietary',
        glutenfree: 'dietary',
        quick: 'time',
        medium: 'time',
        long: 'time'
    };


    // Store the current state of filters
    let activeFilters = {
        mealType: [],
        cuisine: [],
        dietary: [],
        time: []
    };
    
 
     // If there's a tag in the URL, find and check the corresponding checkbox
     if (tagFromURL) {
         const checkbox = document.querySelector(`#${tagFromURL}`);
         if (checkbox) {
             checkbox.checked = true;
             const category = filterCategories[tagFromURL];
             if (category) {
                 activeFilters[category].push(tagFromURL);
                 filterRecipes(); // Apply the filter
             }
         }
     }


    function filterRecipes() {
        recipeCards.forEach(card => {
            // Start by assuming we'll show the card
            let shouldShow = true; 

            // Get card data and convert to lowercase for consistent comparison
            const cardMealType = card.dataset.mealType.toLowerCase();
            const cardCuisine = card.dataset.cuisine.toLowerCase();
            const cardDietary = card.dataset.dietary.toLowerCase();
            const cardTime = parseInt(card.dataset.time);

           // If there are meal type filters selected (like breakfast, lunch, dinner)
            if (activeFilters.mealType.length > 0) {
                if (!activeFilters.mealType.includes(cardMealType)) {
                    shouldShow = false; // Hide if it doesn't match the meal type
                }
            }

            // Only check cuisine if the card hasn't already been hidden
            if (shouldShow && activeFilters.cuisine.length > 0) {
                if (!activeFilters.cuisine.includes(cardCuisine)) {
                    shouldShow = false;
                }
            }

            // Only check dietary if the card hasn't already been hidden
            if (shouldShow && activeFilters.dietary.length > 0) {
                // Special handling for 'none' dietary restriction
                if (cardDietary === 'none' && cardDietary === 'none') {
                    shouldShow = false;
                } else if (!activeFilters.dietary.includes(cardDietary)) {
                    shouldShow = false;
                }
            }

            // Only check time if the card hasn't already been hidden
            if (shouldShow && activeFilters.time.length > 0) {
                const timeMatch = activeFilters.time.some(filter => {
                    switch(filter) {
                        case 'quick': return cardTime <= 30;
                        case 'medium': return cardTime > 30 && cardTime <= 60;
                        case 'long': return cardTime > 60;
                        default: return false;
                    }
                });
                if (!timeMatch) {
                    shouldShow = false;
                }
            }

            // Apply visibility
            card.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    // For when the user clicks the checkboxes:
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() { 
            const category = filterCategories[this.id];
            
            if (this.checked) {
                activeFilters[category].push(this.id); // Finds which category the checkbox belongs to and adds that filter to the active filters list
            } else {
                activeFilters[category] = activeFilters[category]
                    .filter(filter => filter !== this.id);
            }
            
            filterRecipes();
            
        });
    });

    // Clear filters functionality
    clearButton.addEventListener('click', function() {
        // Reset checkboxes
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset filters
        activeFilters = {
            mealType: [],
            cuisine: [],
            dietary: [],
            time: []
        };
        
        // Show all recipes
        filterRecipes();
    });
});