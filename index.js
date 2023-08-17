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
    let tableData = [];
    tableData = [
        Object.keys(data[0]), 
        ...data.map(val => Object.values(val))
    ];
    const answers = await inquirer.prompt([
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
const viewEmployees = async function () {
    const results = await db.query("SELECT * FROM employee");
    const dbData = results[0];
    showTable(dbData);
};

// // Add Employee Function
const addEmployee = async function () {
    const roleResults = await db.query("SELECT * FROM role");
    const employeeResults = await db.query("SELECT * FROM employee");
    const roleData = roleResults[0];
    const employeeData = employeeResults[0];
    const roleArr = [];

    for (let role of roleData) {
        roleArr.push(role.title);
    };

    const employeeName = await inquirer.prompt([
        {
            message: "What is the employee's first name?",
            type: "input",
            name: "first_name"
        },
        {
            message: "What is the employee's last name?",
            type: "input",
            name: "last_name"
        }
    ]);
    const roleAssign = await inquirer.prompt([
        {
            message: "What is the employee's role?",
            type: "list",
            choices: roleArr,
            name: "role"
        }
    ]);
    const choiceData = employeeData.map((row) => ({
        name: row.first_name + " " + row.last_name,
        value: row
    }))
    choiceData.push({
        name: "No manager",
        value: { id: null }
    });

    const assignManager = await inquirer.prompt([
        {
            message: "Who is the employee's manager?",
            type: "list",
            choices: choiceData,
            name: "manager"
        }
    ])

    for (let role of roleData) {
        if (roleAssign.role === role.title) {
            employeeData.role_id = role.id;
        }
    }
    employeeName.manager_id = assignManager.manager.id;

    const firstName = employeeName.first_name;
    const lastName = employeeName.last_name;

    await inquirer.prompt([
        {
            message: `Added ${firstName} ${lastName} to the database`,
            type: "input",
            name: "enter"
        }
    ]);
    await showTable([employeeName]);
    await db.query("INSERT INTO employee SET ?", employeeName);
};

// Update Employee Role Function
const updateEmployee = async function () {
    const roleResults = await db.query("SELECT * FROM role");
    const employeeResults = await db.query("SELECT * FROM employee");
    const roleData = roleResults[0];
    const employeeData = employeeResults[0];

    const choiceData = employeeData.map((row) => ({
        name: row.first_name + " " + row.last_name,
        value: row
    }));

    const employeeChange = await inquirer.prompt([
        {
            message: "Which employee's role would you like to update?",
            type: "list",
            choices: choiceData,
            name: "name"
        }
    ]);
    const choiceData2 = roleData.map((row) => ({
        name: row.title,
        value: row
    }));
    const roleChange = await inquirer.prompt([
        {
            message: "Which role do you want to assign the selected employee?",
            type: "list",
            choices: choiceData2,
            name: "title"
        }
    ]);
    const employeeFirstName = employeeChange.name.first_name;
    const employeeLastName = employeeChange.name.last_name;
    const employeeManagerID = employeeChange.name.manager_id;
    const employeeID = employeeChange.name.id;
    const roleAssign = roleChange.title.id;

    const displayToTable = 
    {
        first_name: employeeFirstName,
        last_name: employeeLastName,
        role_id: roleAssign,
        manager_id: employeeManagerID
    }

    await inquirer.prompt([
        {
            message: `Updated ${employeeFirstName} ${employeeLastName}'s Role`,
            type: "input",
            name: "enter"
        }
    ]);
    await showTable([displayToTable]);
    await db.query(`
    UPDATE employee
    SET role_id = ?
    WHERE id = ?`,
    [roleAssign, employeeID]);
};
// View All Roles Function
// Add Role Function
// View All Departments Function

const init = async function () {
    figlet("Employee Tracker", async function (err, data) {
        if (err) {
            console.log("Error");
            console.dir(err);
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