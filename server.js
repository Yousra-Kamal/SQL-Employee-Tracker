// Import Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
//console.table call once somewhere in the beginning of the app
const cTable = require("console.table");

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
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}

// View Roles
function viewRoles() {
  const sql = `SELECT roles.id, roles.title AS role, roles.salary, department.name AS department FROM roles INNER JOIN department ON (department.id = roles.department_id);`;
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}

// View Employees
function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN roles ON (roles.id = employee.role_id) INNER JOIN department ON (department.id = roles.department_id) ORDER BY employee.id;`;
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}
