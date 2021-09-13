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
        .then(userChoice => {
            switch (userChoice.choice.menu) {
                case 'view all departments':
                    selectDepartments();
                    break;
                case 'view all roles':
                    selectRoles();
                    break;
                case 'view all employees':
                    selectEmployees();
                    break;
                case 'add a departments':
                    promptAddDepartment();
                    break;
                case 'add a role':
                    promptAddRole();
                    break;
                case 'add an employee':
                    promptAddEmployee();
                    break;
                    case 'update an employee role':
                    promptUpdateRole();
                    break;    
                default:
                    process.exit;
            }
        })
}

