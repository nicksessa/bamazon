var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "zaq1@WSXcde3",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  showInventory();
  buyStuff();
});

function showInventory() {
  var SQL = "SELECT * FROM products";
  connection.query(SQL, function(err, res) {
    console.log(res);
    console.table(res);
    connection.end();
  }
}

function buyStuff() {
  inquirer.prompt([
    {
      name: "itemID",
      type: "input",
      message: "Select the ID of the item you wish to purchase. ",
      validate: function ( value ) {
        if (isNanvalue === false) {
          return true;
        };
        return false || "You need to enter a number";
      },
      filter: Number
    },
    {
      name: "quantity",
      type: "input",
      message: "How many? ",
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number
    }
  ])
  .then(function(answer) {
    // Check inventory
    var SQL = "SELECT item_id, product_name, stock_quantity FROM products WHERE item_id = " + answer.itemID;
    connection.query(SQL, function(err, res) {
      if (err) throw err;
      var totalAvailable = res.stock_quantity;
      if (totalAvailable < answer.quantity) {
        console.log("Insufficient quantity!");
        return;
      } else {
         // subtract the quantity ordered from the totalAvailable
         var newTotal = res.stock_quantity - answer.quantity;

         //  then update the db
         var updateSQL = "UPDATE products SET stock_quantity=" + newTotal + " WHERE item_id=" + answer.itemID;
         connection.query(updateSQL, function(err, res2) {
           if (err) throw err;
           console.log("Item purchased!")
         });

         // show the total price: quantity * price
         var totalPrice = answer.quantity * res.price;
         console.log("Total Price: $" + totalPrice)
      }
    })
  });
}






// example:
{
    type: "input",
    name: "quantity",
    message: "How many do you need",
    validate: function( value ) {
      var valid = !isNaN(parseFloat(value));
      return valid || "Please enter a number";
    },
    filter: Number
  },



