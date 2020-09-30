var mysql = require("mysql");
var inquirer = require("inquirer");

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
        choices: ["View employee(s)", "View role(s)", "View department(s)", "Add employee", "Add role", "Add department", "Remove employee", "Remove role", "Remove department", "Update employee role", "Update department", "EXIT"]
    }).then(function (answer) {
        console.log(answer)
        if (answer.action === "EXIT") {
            console.clear();
            connection.end()
        } else if (answer.action === "View department(s)") {
            viewDepartments()
        } else if (answer.action === "View employee(s)") {
            viewEmployees()
        } else if (answer.action === "View role(s)") {
            viewRoles()
        } else if (answer.action === "Add department") {
            addDepartment()
        } else if (answer.action === "Add role") {
            addRole()
        } else if (answer.action === "Add employee") {
            addEmployee()
        } else if (answer.action === "Remove employee") {
            removeEmployee()
        } else if (answer.action === "Remove department") {
            removeDepartment()
        } else if (answer.action === "Remove role") {
            removeRole()
        } else if (answer.action === "Update employee role") {
            updateEmployee()
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
        connection.query("INSERT INTO employee SET ?", {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role
        })
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
    ]).then(function (answer) {
        connection.query("INSERT INTO employee SET ?", {
            manager_id: answer.manager
        })
    })
}

function viewDepartments() {
    connection.query("SELECT title FROM department", function (err, res) {
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
            title: response.theDepartment
        }),
            function (err, res) {
                if (err) throw err;
                console.log("Added " + res.affectedRows + " department!");
            }
        returnToMenu();
    })
}

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
}



function removeEmployee() {
    inquirer.prompt([
        {
            name: "whichEmployee",
            type: "input",
            message: "ID of employee you'd like to remove?"
        }
    ]).then(answer => {
        connection.query("DELETE FROM employee WHERE ?", {
            id: answer.whichEmployee
        }), function (err, res) {
            if (err) throw err;
            console.log("Removed  " + res.affectedRows + "!");
        }
        returnToMenu();
    })
}

function removeDepartment() {
    inquirer.prompt([
        {
            name: "whichDepartment",
            type: "input",
            message: "Please enter the department you wish to remove."
        }
    ]).then(answer => {
        connection.query("DELETE FROM department WHERE ?", {
            title: answer.whichDepartment
        }), function (err, res) {
            if (err) throw err;
            console.log("Removed  " + res.affectedRows + "!");
        }
        returnToMenu();
    })
}

function removeRole() {
    inquirer.prompt([
        {
            name: "whichRole",
            type: "input",
            message: "Please enter the role you wish to remove."
        }
    ]).then(answer => {
        connection.query("DELETE FROM role WHERE ?", {
            title: answer.whichRole
        }), function (err, res) {
            if (err) throw err;
            console.log("Removed  " + res.affectedRows + "!");
        }
        returnToMenu();
    })
}

function updateEmployee() {
    inquirer.prompt([
        {
            name: "employee",
            type: "input",
            message: "Who would you like to update? (enter employee ID)"
        },
        {
            name: "toWhat",
            type: "input",
            message: "What is their new role?"
        }

    ]).then(answer => {
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [
            answer.toWhat,
            answer.employee
    ]), function (err, res) {
            if (err) throw err;
            console.log("Updated to  " + res.affectedRows + "!");
        }
        returnToMenu();
    })
}