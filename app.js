// BUDGET CONTROLLER
var budgetController = (function() {
    // Expense constructor
    var Expense  = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Income constructor
    var Income  = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, desc, val) {
            // Variable Declarations
            var newItem, ID;

            // Create new ID
            // ID = last ID + 1
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            // if length is 0, ID is 0
            else {
                ID = 0;
            }
            

            // Create new item based on 'inc' or 'exp' type
            if(type === 'exp') {
                newItem = new Expense(ID, desc, val);
            }
            if(type === 'inc') {
                newItem = new Income(ID, desc, val);
            }
            
            // Push it into data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// UI CONTROLLER
var UIController = (function() {
    // Store HTML classes in object
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }  
        },

        addListItem: function(obj, type) {
            // Variable Declarations
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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

    // Setup event listeners
    var setupEventListeners = function() {
        // DOM variable has access to UIController's DOMstring variable
        var DOM = UICtrl.getDOMstrings();

        //Add button event listener
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Enter key press event listener
        document.addEventListener('keypress', function(event) {
            // if Enter key was pressed
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };
    

    var ctrlAddItem = function () {
        // Variable Declaration
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate the budget

        // 5. Display budget on the UI

    };

    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Initializes application
controller.init();