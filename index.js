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
    // init();
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