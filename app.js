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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        // Calculates the total expense, total income, budget, and percentage
        calculateBudget: function() {
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget = income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calcualte percentage of expense/income
            // Only calc percentage if income > 0 - prevent divide by zero
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }
        },

        // Returns total expense, total income, budget, and percentage
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // parseFloat - converts string to number
            }  
        },

        addListItem: function(obj, type) {
            // Variable Declarations
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if(type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // Clears input fields once item is added
        clearFields: function() {
            var fields, fieldsArr;

            // fields is a list
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // converts fields list to array
            fieldsArr = Array.prototype.slice.call(fields);

            // for each element in fields array, set each to empty string
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            // set focus to first element in array
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            
            // Only show percentage when the percentage is greater than zero
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

        // Event listener for deleting income/expense - using event delegation
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };

    var ctrlAddItem = function () {
        // Variable Declaration
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // Input checks
        // description can't be empty string
        // value can't be Not a Number
        // value must be greater than 0
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields in the UI
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        // Gets the income/expense id for the item to delete
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        // Only move forward if itemID <> ""
        if (itemID){
            // itemID format = "inc-x" or "exp-x"
            // split inc/exp and number (x)
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
        }
    }

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display budget on the UI
        UICtrl.displayBudget(budget);
    }

    return {
        init: function() {
            console.log('Application has started');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1       
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Initializes application
controller.init();