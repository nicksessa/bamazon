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


function mainMenu() {
  inquirer.prompt(
    {
      name: "choice",
      type: "list",
      message: "Select an option:",
      choices: ["View Products Sales by Department", "Create New Department"]
    })
    .then (function(answer) {
      if (answer.choice === "View Products Sales by Department") {
        viewProductSales();
      } else if (answer.choice === "Create New Department") {
        createNewDepartment();
      } else {
        return;
      }
    }
  });
}

function viewProductSales() {

}

function createNewDepartment() {

}
