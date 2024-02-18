// Import Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
//console.table call once somewhere in the beginning of the app
const cTable = require("console.table");
const yellow = "\x1b[33m";
const blue = "\x1b[34m";
const red = "\x1b[31m";
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
  console.log(yellow + "**************************************" + reset);
  console.log(red + "*                                    *" + reset);
  console.log(red + "*                                    *" + reset);
  console.log(yellow + "*      💥 EMPLOYEE MANAGER 💥        *" + reset);
  console.log(red + "*                                    *" + reset);
  console.log(red + "*                                    *" + reset);
  console.log(yellow + `**************************************\n\n` + reset);
  questions();
});

// Starting Questions
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
  const sql = `SELECT roles.id, roles.title AS job_title, roles.salary, department.name AS department FROM roles INNER JOIN department ON (department.id = roles.department_id);`;
  console.log(yellow + `\n Here is a list of all the Roles: \n` + reset);
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}

// View Employees
function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS job_title, department.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN roles ON (roles.id = employee.role_id) INNER JOIN department ON (department.id = roles.department_id) ORDER BY employee.id;`;

  console.log(yellow + `\n Here is a list of all the Employees: \n` + reset);
  db.query(sql, (err, res) => {
    err ? console.error(err) : console.table(res);
    questions();
  });
}

// Add Department
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

// Add Role
function addRole() {
  const sql2 = `SELECT * FROM department`;
  db.query(sql2, (error, response) => {
    departmentList = response.map((dpt) => ({
      name: dpt.name,
      value: dpt.id,
    }));
    return inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the role you'd like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department is this role in?",
          choices: departmentList,
        },
      ])
      .then((answers) => {
        const sql = `INSERT INTO roles SET title='${answers.title}', salary= ${answers.salary}, department_id= ${answers.department};`;
        db.query(sql, (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(
            yellow + `\n Added ${answers.title} to the database \n` + reset
          );
          db.query(`SELECT * FROM roles`, (err, results) => {
            err ? console.error(err) : console.table(results);
            questions();
          });
        });
      });
  });
}

// Add Employee
function addEmployee() {
  const sql2 = `SELECT * FROM employee`;
  db.query(sql2, (err, res) => {
    employeeList = res.map((employee) => ({
      name: employee.first_name.concat(" ", employee.last_name),
      value: employee.id,
    }));

    const sql3 = `SELECT * FROM roles`;
    db.query(sql3, (err, res) => {
      roleList = res.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      return inquirer
        .prompt([
          {
            type: "input",
            name: "first",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roleList,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: employeeList,
          },
        ])
        .then((answers) => {
          const sql = `INSERT INTO employee SET first_name='${answers.first}', last_name= '${answers.last}', role_id= ${answers.role}, manager_id=${answers.manager};`;
          db.query(sql, (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(
              yellow +
                `\n Added ${answers.first} ${answers.last} to the database \n` +
                reset
            );
            db.query(`SELECT * FROM employee`, (err, results) => {
              err ? console.error(err) : console.table(results);
              questions();
            });
          });
        });
    });
  });
}
