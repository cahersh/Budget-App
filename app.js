var budgetController = (function() {
    
    //private
    var x = 23;
    //private
    var add = function(a) {
        return x + a;
    }
    //public
    //works because of closures - has access to x and add variables
    return {
        publicTest: function(b) {
            return add(b);
        }
    }
    
})();


var UIController = (function() {
    // Some code

})();


var controller = (function(budgetCtrl, UICtrl) {
    var z = budgetCtrl.publicTest(5);
    return {
        anotherPublic: function() {
            console.log(z);
        }
    }
})(budgetController, UIController);