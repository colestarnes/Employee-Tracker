var mysql = require("mysql");
var inquirer = require("inquirer");
// var consoleTable = require("console.table");
// const { start } = require("repl");

//  create connection
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "db_employee"
});
//connect to mySQL
connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View employee(s)", "View role(s)", "View department(s)", "Add employee", "Add role", "Add department", "Remove employee", "Remove role", "Remove department", "Update employee role", "EXIT"]
    }).then(function (answer) {
        if (answer.action === "EXIT") { 
            console.clear();
            connection.end()
        }
        else if (answer.action === "View department(s)") {
            viewDepartments()
        }
        else if (answer.action === "View employee(s)") {
            viewEmployees()
        }
        else if (answer.action === "View role(s)") {
            viewRoles()
        } else if (answer.action === "Add department") {
            addDepartment()
        } else if (answer.action === "Add role") {
            addRole()
        } else if (answer.action === "Add employee") {
            addEmployee()
        }

    })
}


// functions


function addEmployee() {
    inquirer.prompt([
        {
            name: "firstName",
            message: "What is employee's first name?",
            type: "input"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is employee's last name?"
        },
        {
            name: "role",
            type: "input",
            message: "What is the employees role? (enter Role ID)"
        }
    ]).then(function (answer) {
        var roleID = connection.query("SELECT id FROM role")
        var roleName = connection.query("SELECT title FROM role")
        if (answer.role === roleID) {
            return roleName
        } if (roleName === ! "Manager") {
            managerQuestion()
        }
        returnToMenu();
    })
}

function managerQuestion() {
    inquirer.prompt([
        {
            name: "manager",
            type: "input",
            message: "Who is the employees manager? (enter Manager ID)"
        }
    ])
}

function viewDepartments() {
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        returnToMenu();
    })
}

function viewRoles() {
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        returnToMenu();
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("Here are all employees in the database.");
        returnToMenu();
    })

};

function returnToMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "return",
            message: "Press 'OK' to go back",
            choices: ["OK"]
        }
    ]).then(response => {
        if (response.return === "OK") {
            console.clear();
            start();
        }
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "theDepartment",
            message: "What would you like to name the department?"
        }
    ]).then(response => {
        connection.query("INSERT INTO department SET ?", {
            name: response.theDepartment
        }),
            function (err, res) {
                if (err) throw err;
                console.log("Added " + res.affectedRows + " department!");
                viewDepartments();
            }
    })
};

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "theRole",
            message: "What role would you like to add?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for with this role?"
        },
        {
            type: "input",
            name: "department",
            message: "Which department does this role fall under? (Enter Department ID)"
        }
    ]).then(response => {
        connection.query("INSERT INTO role SET ?", {
            title: response.theRole,
            salary: response.salary,
            department_id: response.department
        }),
            function (err, res) {
                if (err) throw err;
                console.log("Added " + res.affectedRows + " as a role!");
            }
        returnToMenu();
    }
    )
};

function removeEmployee() {
    inquirer.prompt([
        {
            name: "whichEmployee",
            type: "list",
            message: "Which employee?",
            choices: [viewEmployees()]
        }
    ]).then(answer => {
        ("REMOVE ? FROM employee")
    })
}