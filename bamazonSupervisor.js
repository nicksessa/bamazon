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
      choices: ["View Products Sales by Department", "Create New Department", "Quit"]
    })
    .then(function (answer) {
      if (answer.choice === "View Products Sales by Department") {
        viewProductSales();
      } else if (answer.choice === "Create New Department") {
        createNewDepartment();
      } else if (answer.choice === "Quit") {
        connection.end();
        return;
      }
    })
}

function viewProductSales() {
  var SQL = `select 
  b.department_id, 
  b.department_name, 
  b.over_head_costs, 
  total_sales,
  sum(total_sales - b.over_head_costs) as total_profit
from departments b
  left join (select a.department_name, sum(a.product_sales) as total_sales 
  from products a 
  group by a.department_name) as x on x.department_name = b.department_name
group by b.department_id, total_sales;
`

  connection.query(SQL, function (err, res) {
    if (err) throw err;
    console.table(res)
    // The connection has to stay open if we call the menu again.
    // Otherwise, we can end it here if we don't call the menu and simply exit.
    //connection.end();
    mainMenu()
  });
}

function createNewDepartment() {
  inquirer.prompt([
    {
      name: "departmentName",
      type: "input",
      message: "Department Name: "

    },
    {
      name: "overHeadCosts",
      type: "input",
      message: "Over Head Costs: ",
      validate: function (value) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number
    }
  ])
    .then(function (answer) {
      var SQL = connection.query(
        'INSERT INTO departments SET ?',
        {
          department_name: answer.departmentName,
          over_head_costs: answer.over_head_costs
        },
        function (err, res) {
          if (err) throw err;
          console.log("Row added")
          var SQL = 'SELECT * FROM products' + mysql.escape(answer.departmentName)
          connection.query(SQL, function (err2, res2) {
            if (err2) throw err2;
            console.table(res2)
            mainMenu()
          })
          // The connection has to stay open if we call the menu again.
          // Otherwise, we can end it here if we don't call the menu and simply exit.
          //connection.end();
        });
    })
}
