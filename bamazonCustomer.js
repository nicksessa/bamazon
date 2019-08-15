var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  showInventory();

});

function showInventory() {
  var SQL = "SELECT * FROM products";
  connection.query(SQL, function (err, res) {
    //console.log(res);
    console.table(res);
    //connection.end();
    buyStuff();
  });
}

function buyStuff() {
  inquirer.prompt([
    {
      name: "itemID",
      type: "input",
      message: "Select the ID of the item you wish to purchase. ",
      validate: function (value) {
        if (isNaN(value) === false) {
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
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        };
        return false || "You need to enter a number";
      }
    }
  ])
    .then(function (answer) {
      // Check inventory
      var SQL = 'SELECT item_id, product_name, stock_quantity, price FROM products WHERE item_id = ' + mysql.escape(answer.itemID);
      //console.log("[SQL] " + SQL)
      connection.query(SQL, function (err, res) {
        if (err) throw err;
        //console.log("res.stock_quantity: " + res[0].stock_quantity)
        var totalAvailable = parseInt(res[0].stock_quantity);
        //console.log("total avail: " + totalAvailable)
        //console.log("num to purchase: " + answer.quantity)
        if (totalAvailable < parseInt(answer.quantity)) {
          console.log("Insufficient quantity!");
          return;
        } else {
          // subtract the quantity ordered from the totalAvailable
          var newTotal = parseInt(res[0].stock_quantity) - parseInt(answer.quantity);
          //console.log("newTotal: " + newTotal)
          // show the total price: quantity * price
          var totalPrice = answer.quantity * parseFloat(res[0].price);
          //console.log("res.price: " + parseFloat(res[0].price))
          //console.log("Total Price: $" + totalPrice)
          //  then update the db
          var updateSQL = 'UPDATE products SET stock_quantity=' + mysql.escape(newTotal) + ' WHERE item_id=' + mysql.escape(answer.itemID);
          //console.log("[updateSQL] " + updateSQL)
          connection.query(updateSQL, function (err, res2) {
            if (err) throw err;
            if (answer.quantity > 1) {
              console.log("Items purchased!")
            } else {
              console.log("Item purchased!")
            }
            console.log("Total Price: $" + totalPrice)
          });
        }
        connection.end();
      })
    });
}
