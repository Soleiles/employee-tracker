const inquirer = require('inquirer');
const { table } = require('table');
const mysql = require('mysql2/promise');
const figlet = require('figlet');

let db;

const config = {
  border: {
    topBody: `─`,
    topJoin: `┬`,
    topLeft: `┌`,
    topRight: `┐`,

    bottomBody: `─`,
    bottomJoin: `┴`,
    bottomLeft: `└`,
    bottomRight: `┘`,

    bodyLeft: `│`,
    bodyRight: `│`,
    bodyJoin: `│`,

    joinBody: `─`,
    joinLeft: `├`,
    joinRight: `┤`,
    joinJoin: `┼`
  }
};

mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        database: 'hr_db'
    }
).then((connection) => {
    db = connection;
    console.log('Successfully connected to hr_db');
    init();
});

async function showTable(data) {
    let table = [];
    tableData = [
        Object.keys(data[0]), 
        ...data.map(val => Object.values(val))
    ];
    const answers = await inquirer.createPromptModule([
        {
            message: "\n" + table(tableData, config),
            type: "input",
            name: 'name'
        }
    ]);
}

const menu = async function () {
    const menuList = await inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            name: "options",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department"
            ]
        }
    ])
    if (menuList.options === "View All Employees") {
        await viewEmployees();
        await menu();
    } else if (menuList.options === "Add Employee") {
        await addEmployee();
        await menu();
    } else if (menuList.options === "Update Employee Role") {
        await updateEmployee();
        await menu();
    } else if (menuList.options === "View All Roles") {
        await viewRoles();
        await menu();
    } else if (menuList.options === "Add Role") {
        await addRole();
        await menu();
    } else if (menuList.options === "View All Departments") {
        await viewDepartments();
        await menu();
    } else {
        await addDeparment();
        await menu();
    } 
};

// View All Employees Function
// Add Employee Function
// Update Employee Role Function
// View All Roles Function
// Add Role Function
// View All Departments Function

const init = async function () {
    figlet("Employee Tracker", async function (err, data) {
        if (err) {
            console.log("Error");
            return;
        }
        await inquirer.prompt([
            {
                message: "\n" + data + "\nPress Enter to Continue",
                type: "input",
                name: "name"
            }
        ]);
        await menu();
    })
}