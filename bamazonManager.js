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
  mainMenu();
});

function mainMenu () {
  inquirer.prompt(
    {
      name: "choice",
      type: "list",
      message: "Select an option:",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then (function(answer) {
      if (answer.choice === "View Products for Sale") {
        viewProducts();
      } else if (answer.choice === "View Low Inventory") {
        viewLowInventory();
      } else if (answer.choice === "Add to Inventory") {
        addInventory();
      } else {
        addNewProduct();
      }
    }
  });
}

function viewProducts() {
  var SQL = "SELECT * FROM products";
  connection.query(SQL, function(err, res) {
    console.log(res);
    console.table(res);
    connection.end();
  }
}

function viewLowInventory() {
  var SQL = "SELECT * FROM products WHERE stock_quantity < 10";
  connection.query(SQL, function(err, res) {
    console.log(res);
    console.table(res);
    connection.end();
  }
}

function addInventory() {
  inquirer.prompt([
    {
      name: "itemID",
      type: "input",
      message: "Enter the item id of the item: ",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    },
    {
      name: "addQty",
      type: "input",
      message: "Enter the amount to add: ",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    }
  ])
  .then(function(answer) {

    //var newQty = answer.addQty + res.stock_quantity;

    var updateSQL = "UPDATE products SET stock_quantity=stock_quantity" + answer.addQty + " WHERE item_id=" + answer.itemID;
    connection.query(SQL, function(err, res) {
      console.log(res);
      console.table(res);
      connection.end();
    }
  });
}


function addNewProduct() {
  inquirer.prompt([
    {
      name: "productName",
      type: "input",
      message: "Product Name: ",
      
    },
    {
      name: "departmentName",
      type: "input",
      message: "Department: "
    },
    {
      name: "price",
      type: "input",
      message: "Price: "
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number
    },
    {
      name: "qty",
      type: "input",
      message: "Quantity: "
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number
    }
  ])
  .then(function(answer) {
    var SQL = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ?";
    var values = [
      answer.productName,
      answer.departmentName,
      answer.price,
      answer.qty
    ];
    connection.query(SQL, [values], function(err, res) {
      if (err) throw err;
      console.log("Row added")
      connection.end();
  });
}
