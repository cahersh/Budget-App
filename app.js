// BUDGET CONTROLLER
var budgetController = (function() {
    
    // Some Code
    
})();

// UI CONTROLLER
var UIController = (function() {
    
    // Some code

})();

// GLOBAL APP CONTROLLER
// controls what happens based on events
var controller = (function(budgetCtrl, UICtrl) {

    var ctrlAddItem = function () {
        // 1. Get the field input data

        // 2. Add item to the budget controller

        // 3. Add item to the UI

        // 4. Calculate the budget

        // 5. Display budget on the UI

        console.log('It works');
    }

    //Add button event listener
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    // Enter key press event listener
    document.addEventListener('keypress', function(event) {
        // if Enter key was pressed
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);