// BUDGET CONTROLLER
var budgetController = (function() {
    
    // Some Code
    
})();

// UI CONTROLLER
var UIController = (function() {
    // Store HTML classes in object
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }  
        },
        // exposes private variable to public
        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
// controls what happens based on events
var controller = (function(budgetCtrl, UICtrl) {
    // DOM variable has access to UIController's DOMstring variable
    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function () {
        // 1. Get the field input data
        var input = UICtrl.getInput();
        console.log(input);
        // 2. Add item to the budget controller

        // 3. Add item to the UI

        // 4. Calculate the budget

        // 5. Display budget on the UI

    }

    //Add button event listener
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Enter key press event listener
    document.addEventListener('keypress', function(event) {
        // if Enter key was pressed
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);