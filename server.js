// Import Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
//console.table call once somewhere in the beginning of the app
const cTable = require("console.table");
const yellow = "\x1b[33m";
const blue = "\x1b[34m";

const reset = "\x1b[0m";

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    //  MySQL password
    password: "password",
    database: "employeeTracker_db",
  },
  console.log(`Connected to the employeeTracker_db database🚀\n`)
);

db.connect(function (err) {
  if (err) throw err;
  console.log("**************************************");
  console.log("*                                    *");
  console.log("*      💥 EMPLOYEE MANAGER 💥        *");
  console.log("*                                    *");
  console.log(`**************************************\n\n`);
  questions();
});

// Starting Question
function questions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "intro",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.intro) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          console.log("Good-Bye!👋");
          db.end();
          break;
      }
    })
    .catch((err) => console.error(err));
}

// View Departments
function viewDepartments() {
  const sql = `SELECT department.id, department.name AS Department FROM department;`;
  console.log(yellow + `\n Here is a list of all the Departments: \n` + reset);
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}

// View Roles
function viewRoles() {
  const sql = `SELECT roles.id, roles.title AS role, roles.salary, department.name AS department FROM roles INNER JOIN department ON (department.id = roles.department_id);`;
  console.log(yellow + `\n Here is a list of all the Roles: \n` + reset);
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}

// View Employees
function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN roles ON (roles.id = employee.role_id) INNER JOIN department ON (department.id = roles.department_id) ORDER BY employee.id;`;

  console.log(yellow + `\n Here is a list of all the Employees: \n` + reset);
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}

// Add Departments
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department(name) VALUES('${answer.department}');`;
      db.query(sql, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(
          yellow + `\n Added ${answer.department} to the database.\n` + reset
        );
        db.query(`SELECT * FROM department`, (err, results) => {
          err ? console.error(err) : console.table(results);
          questions();
        });
      });
    });
}
