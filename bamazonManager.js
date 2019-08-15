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
  mainMenu();
});

function mainMenu() {
  inquirer.prompt(
    {
      name: "choice",
      type: "list",
      message: "Select an option:",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
    })
    .then(function (answer) {
      if (answer.choice === "View Products for Sale") {
        viewProducts();
      } else if (answer.choice === "View Low Inventory") {
        viewLowInventory();
      } else if (answer.choice === "Add to Inventory") {
        addInventory();
      } else if (answer.choice === "Add New Product") {
        addNewProduct();
      } else {
        connection.end();
        return
      }
    });
}

function viewProducts() {
  var SQL = "SELECT * FROM products";
  connection.query(SQL, function (err, res) {
    if (err) throw err;
    //console.log(res);
    console.table(res);
    //connection.end();
    mainMenu()
  })
}

function viewLowInventory() {
  var SQL = 'SELECT * FROM products WHERE stock_quantity < 50';
  connection.query(SQL, function (err, res) {
    if (err) throw err;
    //console.log(res);
    //console.log("result length: " + res.length)
    if (res.length == 0) {
      console.log("\nNo items need to be restocked.\n")
    } else {
      console.table(res);
    }

    //connection.end();
    mainMenu()
  })
}

function addInventory() {
  inquirer.prompt([
    {
      name: "itemID",
      type: "input",
      message: "Enter the item id of the item: ",
      validate: function (value) {
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
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    }
  ])
    .then(function (answer) {

      // first check to see if the item id exists
      var item = answer.itemID;

      var SQL = 'SELECT * FROM products WHERE item_id=' + mysql.escape(item)

      connection.query(SQL, function (err, res) {
        if (err) throw err;
        if (res.length == 0) {
          console.log("Invalid ID.  Please select a valid ID.")
          addInventory()
        } else {
          console.table(res)
          var newQty = parseInt(answer.addQty) + parseInt(res[0].stock_quantity);
          //console.log("old quantity: " + res[0].stock_quantity)
          //console.log("new quantity: " + newQty)
          var updateSQL = 'UPDATE products SET stock_quantity=' + mysql.escape(newQty) + ' WHERE item_id=' + mysql.escape(answer.itemID);
          //console.log("SQL: " + updateSQL)
          connection.query(updateSQL, function (err, res) {
            if (err) throw err;
            //console.log(res);
            //console.table(res);
            //connection.end();
            connection.query(SQL, function (err2, res2) {
              if (err2) throw err2;
              console.table(res2)
              mainMenu()
            })

          })

        };
      })
    })
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
      message: "Price: ",
      validate: function (value) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number
    },
    {
      name: "qty",
      type: "input",
      message: "Quantity: ",
      validate: function (value) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number
    }
  ])
    .then(function (answer) {

      var SQL = connection.query(
        'INSERT INTO products SET ?',
        {
          product_name: answer.productName,
          department_name: answer.departmentName,
          price: answer.price,
          stock_quantity: answer.qty
        },
        function (err, res) {
          if (err) throw err;
          console.log("Row added")
          //connection.end();
          var SQL = 'SELECT * FROM products WHERE product_name=' + mysql.escape(answer.productName)
          connection.query(SQL, function (err2, res2) {
            if (err2) throw err2;
            console.table(res2)
            mainMenu()
          })
        });
    })
}
