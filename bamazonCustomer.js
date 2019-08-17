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
    console.table(res);
    // The connection has to stay open if we call another function that needs a connection to the db.
    // Otherwise, we can end it here if we don't call anything and simply exit.
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
      var SQL = 'SELECT item_id, product_name, stock_quantity, price, product_sales FROM products WHERE item_id = ' + mysql.escape(answer.itemID);
      //console.log("[SQL] " + SQL)
      connection.query(SQL, function (err, res) {
        if (err) throw err;
        var totalAvailable = parseInt(res[0].stock_quantity);
        if (totalAvailable < parseInt(answer.quantity)) {
          console.log("Insufficient quantity!");
          connection.end();
          return;
        } else {
          // subtract the quantity ordered from the totalAvailable
          var newTotal = parseInt(res[0].stock_quantity) - parseInt(answer.quantity);
          // show the total price: quantity * price
          var totalPrice = answer.quantity * parseFloat(res[0].price);
          // get product_sales
          var productSales = parseFloat(res[0].product_sales);
          var newProductSales = totalPrice + productSales;
          //  then update the db
          var updateSQL = 'UPDATE products SET stock_quantity=' + mysql.escape(newTotal) + ' WHERE item_id=' + mysql.escape(answer.itemID);
          connection.query(updateSQL, function (err, res2) {
            if (err) throw err;
            if (answer.quantity > 1) {
              console.log("Items purchased!")
            } else {
              console.log("Item purchased!")
            }
            console.log("Total Price: $" + totalPrice)
          });
          // now update product_sales
          var updateSQL = 'UPDATE products SET product_sales=' + mysql.escape(newProductSales) + ' WHERE item_id=' + mysql.escape(answer.itemID);
          connection.query(updateSQL, function (err, res2) {
            if (err) throw err;
            console.log("Total Product Sales: $" + newProductSales)
          });
        }
        connection.end();
      })
    });
}
