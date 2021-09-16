const db = require("../db/connection");
const inquirer = require('inquirer');
const fs = require("fs");
const mysql = require('mysql2');
const Connection = require("mysql2/typings/mysql/lib/Connection");
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
        });
};

        const selectDepartments = () => {
            Connection.query(
                `SELECT * FROM department;`
                (err, results) => {
                    console.table(results);
                    promptMenu();
            }

        )
    };

        const selectRoles = () => {
            Connection.query(
                `SELECT * FROM department;`
                (err, results) => {
                    console.table(results);
                    promptMenu();
                });

        };
        const selectEmployees = () => {
            Connection.query(
                `SELECT candidates.*, parties.name AS party_name, 
                COUNT(candidate_id) 
                AS count FROM votes 
                LEFT JOIN candidates ON votes.candidate_id = candidates.id 
                LEFT JOIN parties ON candidates.party_id = parties.id 
                GROUP BY candidate_id 
                ORDER BY count DESC`;
                (err, results) => {
                    console.table(results);
                    promptMenu();
                });

        };




        prompt.promptAddDepartment = () => {

        };

        prompt.promptAddRole = () => {

        };

        prompt.promptUpdateRole = () => {

        };