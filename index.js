//npm init
//npm install - my sql, inquirer
//mysql connection/connect

var mysql= require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
host: 'localhost',

port: "3306",

user: "root",

passsword: "password",
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
        message: "Would you like to view [VIEW DEPARTMENTS], [VIEW ROLES], [VIEW EMPLOYEES], [ADD DEPARTMENT], [ADD ROLES]. [ADD EMPLOYEES], [EXIT]?",
        choices: ["VIEW_DEPARTMENTS", "VIEW_ROLES", "VIEW_EMPLOYEES", "EXIT"],
    }).then(function(answer) {
        if (answer.menu ==="VIEW_DEPARTMENTS") {
            viewDepartments();
        }else if (answer.menu === "VIEW_ROLES") {
            viewRoles();
        }else if (answer.menu === "VIEW_EMPLOYEES") {
            viewEmployees();
        }        if (answer.menu ==="ADD_DEPARTMENTS") {
            addDepartment();
        }else if (answer.menu === "ADD_ROLES") {
            addRoles();
        }else if (answer.menu === "ADD_EMPLOYEES") {
            addEmployees();
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
    connection.query(`select title, salary, name from rolles 
    inner join department on roles.department_id=department.id`, function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}
//view employess - select * from employee
function viewEmployees(){
    connection.query(`select first_name, last_name, title, salary, name from employee 
    inner join roles on employee.role_id=roles.id
    inner join department on roles.department_id=department.id`, function(err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
};

//selct title, slary, name from role
//ninner join department on role.deaprtment_id=department.id;

//selct first_nae. last_name, titile, salary, name from employee
//inner join role on viewEmployees.role_id=role.id 
//inner join department on role.department_id=department.id

// update initial prompt and ask use what they want to input
// add department
//  a) ask the user for a name 
//  b) insert name into department
// add role
//  a) get all departments
//  b) ask user which department
//  c) ask the user for title and salary
//  d) insert title, salary, department_id into role
// add employee
//  a) get all roles
//  b) ask user which role
//  c) ask user for first_name, last_name
//  d) insert first_name, last_name, role_id into employee