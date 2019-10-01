// BUDGET CONTROLLER
var budgetController = (function() {
    // Expense constructor
    var Expense  = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    //adds calcPercentage to Expense prototype - calculates expense percentage
    Expense.prototype.calcPercentage = function(totalIncome) {
        // prevent divide by zero
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else{
            this.percentage = -1;
        }   
    };

    // Returns the expense percentage
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

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

        // Purpose: deletes item from the data object
        // Inputs: type = inc or exp, id = which element to delete
        deleteItem: function(type, id) {
            var ids, index;

            // map all IDs to the ids variable
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            // index = the array location where id is stored in the array
            index = ids.indexOf(id);

            // if index exists, remove the index from data object
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        // Calculates the percentage for each expense
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },

        // Returns the expense percentage
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });

            return allPerc;
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
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    // formats amounts. ex: 23510 => $23,510.00
    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        
        num = Math.abs(num);

        // amounts should have two decimal points
        num = num.toFixed(2);

        // Comma for thousands
        numSplit = num.split('.');
        int = numSplit[0];
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // 23510 => 23,510
        }

        dec = numSplit[1];

        // + or - before number
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    // forEach function for node list
    var nodeListForEach = function(list, callback) {
        for (var i = 0; i <list.length; i++) {
            callback(list[i], i);
        }
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // parseFloat - converts string to number
            }  
        },

        // Adds income/expense to the DOM
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // Removes income/expense from the DOM
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID); // el = income/expense id to remove
            el.parentNode.removeChild(el); // Move to parent and remove child
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
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            // Only show percentage when the percentage is greater than zero
            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        // Display the expense percentages on the UI
        displayPercentages: function(percentages) {
            var fields;
            fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                }
                else {
                    current.textContent = '---'
                }
            })
        },

        // Displays month and year
        displayMonth: function() {
            var now, year, month, months;
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year; 
        },

        // Changes active input display to red when expense
        changedType: function() {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        // Event listener for changing between + and -
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updatePercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with new percentages
        UICtrl.displayPercentages(percentages);
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

            // 6. Calculate and update percentages
            updatePercentages();
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
            ID = parseInt(splitID[1]);
        }

        // 1. Delete the item from the data structure
        budgetCtrl.deleteItem(type, ID);

        // 2. Delete the item from the UI
        UICtrl.deleteListItem(itemID);

        // 3. Calculate and update budget
        updateBudget();

        // 4. Calculate and update percentages
        updatePercentages();
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
            UICtrl.displayMonth();
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