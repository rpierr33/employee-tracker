const db = require("../db/connection");
const inquirer = require('inquirer');
const fs = require("fs");
const mysql = require('mysql2');
require('console.table');


const promptMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit']

        }])
        .then
}

