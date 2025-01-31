/*The code below does the following:
1. Listens for the DOM to load (DOMContentLoaded even)
2. Sets up event listeners for filter checkboxes and a "Clear Filters" button
3. Filters recipe cards based on the selected filters   
4. Handles URL parameters to apply filters when the page loads
*/
document.addEventListener('DOMContentLoaded', function() {
    // Get all checkboxes and recipe cards
    const filterCheckboxes = document.querySelectorAll('.filters-section input[type="checkbox"]'); /* List of all filter checkboxes */
    const recipeCards = document.querySelectorAll('.recipe-list-card');/* List of all recipe cards on the page */
    const clearButton = document.getElementById('clear-filters'); /* Button for clearing filters*/


  
    //A mapping of checkbox IDs to their respective filter categories (e.g., breakfast → mealType)
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


    // Store the currently active filters for each category (e.g., mealType: ['breakfast'])
    let activeFilters = {
        mealType: [],
        cuisine: [],
        dietary: [],
        time: []
    };
    
     // Check URL for tag parameter
     const urlParams = new URLSearchParams(window.location.search);
     const tagFromURL = urlParams.get('tag');
 
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
            // Default to showing all cards when no filters are active
            let shouldShow = true;

            // Get card data and convert to lowercase for consistent comparison
            const cardMealType = card.dataset.mealType.toLowerCase();
            const cardCuisine = card.dataset.cuisine.toLowerCase();
            const cardDietary = card.dataset.dietary.toLowerCase();
            const cardTime = parseInt(card.dataset.time);

            // If there are meal type filters active, check if the card matches
            if (activeFilters.mealType.length > 0) {
                // Convert actuveFilters.mealType to lowercase for comparison
                const mealTypeFilters = activeFilters.mealType.map(filter => filter.toLowerCase);
                if (!activeFilters.mealType.includes(cardMealType)) {
                    shouldShow = false;
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
                if (cardDietary === 'none') {
                    shouldShow = false;
                } else if (!activeFilters.dietary.includes(cardDietary)) {
                    shouldShow = false;
                }
            }

            // Only check time if the card hasn't already been hidden
            if (shouldShow && activeFilters.time.length > 0) {
                const timeMatch = activeFilters.time.some(filter => {
                    switch (filter) {
                        case 'quick': return cardTime <= 30;
                        case 'medium': return cardTime > 30 && cardTime <= 60;
                        case 'long': return cardTime > 60;
                        default: return false;
                    }
                });
                shouldShow = timeMatch; // Simplify the assignment
            }

            // Apply visibility
            card.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    // Add click event listener to checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = filterCategories[this.id];
            
            if (this.checked) {
                activeFilters[category].push(this.id);
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