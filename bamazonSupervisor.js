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
  var SQL = "SELECT "

  connection.query(SQL, function(err, res) {
    if (err) throw err;
    console.log("Row added")
    connection.end();
  });

}

/*
-- make the whole thing a string using backticks?

-- **************************************************************************
select 
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

-- **************************************************************************

the following does not work.  use the sql above.
select 
  a.department_id, 
  a.department_name, 
  b.over_head_costs, 
  a.product_sales,
  sum(a.product_sales - b.over_head_costs) as total_profit
from
  products a
inner join departments b on a.department_name = b.department_name;
group by a.department_name


maybe this:

var SQL = require('sql-template-strings')
 
var id = 1234
 
var query = (SQL
            `SELECT fname, lname, email
             FROM users
             WHERE id = ${id}`
            )


or use:

var SQL = `SELECT * \
FROM table`


*/

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
      validate: function( value ) {
        var valid = !isNaN(parseFloat(value));
        return valid || "Please enter a number";
      },
      filter: Number
    }
  ])
  .then(function(answer) {
    var SQL = "INSERT INTO departments(department_name, over_head_costs) VALUES ?";
    var values = [
      answer.departmentName,
      answer.over_head_costs
    ];
    connection.query(SQL, [values], function(err, res) {
      if (err) throw err;
      console.log("Row added")
      connection.end();
  });
}
