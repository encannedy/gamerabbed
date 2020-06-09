var mysql= require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
host: 'localhost',

port: "3306",

user: "root",

password: "password",
database: "Employee_Tracker_db"
});

connection.connect(function(err){
    if (err) throw err;
    start();
})

function start(){
    //promt user - view department, role, employee or exit
    //based on what they choose, call the appropriate function
    inquirer
    .prompt({
        name: "menu",
        type: "list",
        message: "Would you like to view [VIEW DEPARTMENT], [VIEW ROLE], [VIEW EMPLOYEE], [ADD DEPARTMENT], [ADD ROLE], [ADD EMPLOYEE],[UPDATE EMPLOYEE] [EXIT]?",
        choices: ["VIEW_DEPARTMENT", "VIEW_ROLE", "VIEW_EMPLOYEE", "ADD_DEPARTMENT", "ADD_ROLE", "ADD_EMPLOYEE", "UPDATE_EMPLOYEE", "EXIT"]
    }).then(function(answer) {
        if (answer.menu ==="VIEW_DEPARTMENT") {
            viewDepartments();
        }else if (answer.menu === "VIEW_ROLE") {
            viewRoles();
        }else if (answer.menu === "VIEW_EMPLOYEE") {
            viewEmployees();
        }else if (answer.menu ==="ADD_DEPARTMENT") {
            addDepartment();
        }else if (answer.menu === "ADD_ROLE") {
            addRoles();
        }else if (answer.menu === "ADD_EMPLOYEE") {
            addEmployees();
        }else if (answer.menu === "UPDATE_EMPLOYEE") {
            updateEmployees();
       
        }else {
            // exit - close connection
            connection.end();
        }
    });
}
// view departments - selct *from departments
function viewDepartments(){
    connection.query("SELECT * FROM department", function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}
//view roles- selct * from departments
function viewRoles(){
    connection.query(`select title, salary, name from role 
    inner join department on role.department_id=department.id`, function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}
//view employess - select * from employee
function viewEmployees(){
    connection.query(`select first_name, last_name, title, salary, name from employee 
    inner join role on employee.role_id=role.id
    inner join department on role.department_id=department.id`, function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
};

function printResults (err, result) {
    if (err) throw err;
    console.log(result + "error");
    start();
}
async function addDepartment () {
    const department = await inquirer.prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
    connection.query (`insert into department (name) values ('${department.name}')`, printResults ())
  }
  
  function addRoles() {
      connection.query ("select * from department", async function(err, results) {
  
          const departments = results.map ( (result) => ({
              name:result.name, 
              value:result.id
          }) )
  
          const roleData = await inquirer.prompt([
              {
                  name: "title",
                  message: "What is the role title?"
              },
              {
                  name: "salary",
                  message: "What is the salary?"
              },
              {
                  type: "list",
                  name: "department_id",
                  message: "Which Department would you like to place this role?",
                  choices:departments 
              }
          ])
          connection.query (`insert into role (title, salary, department_id) values('${roleData.title}','${roleData.salary}','${roleData.department_id}' )`, printResults)
      })
  }
  
  function addEmployees() {
      connection.query ("select * from role", async function(err, results) {
          const roles = results.map ( (result) => ({
              name:result.title, 
              value:result.id
          }) )
  
          const employeeData = await inquirer.prompt([
              {
                  name: "first_name",
                  message: "What is the first name of the employee"
              },
              {
                  name: "last_name",
                  message: "What is the last name of the employee"
              },
              {
                  type: "list",
                  name: "role_id",
                  message: "What is the employee's role?",
                  choices:roles 
              }
          ])
          connection.query (`insert into employee (first_name, last_name, role_id) values('${employeeData.first_name}','${employeeData.last_name}','${employeeData.role_id}' )`, printResults)
      })
  }
  
  function updateEmployees() {
  
      connection.query("select * from employee", function (err, employees) {
  
          connection.query ("select * from role", async function(err, roles) {
              const roleChoices = roles.map ( (role) => ({
                  name:role.title, 
                  value:role.id
              }) )
  
              const employeeChoices = employees.map ( (employee) => ({
                  name:employee.first_name + " " + employee.last_name, 
                  value:employee.id
              }) )
  
              const updateEmployee = await inquirer.prompt([
                  {
                      type: "list",
                      name: "employee_id",
                      message: "Which employee would you like to udate?",
                      choices:employeeChoices 
                  },
                  {
                      type: "list",
                      name: "role_id",
                      message: "What would you like their new role to be?",
                      choices:roleChoices 
                  }
              ])
              connection.query (`update employee set role_id=${updateEmployee.role_id} where id=${updateEmployee.employee_id}`, printResults)
          })
      })
  }