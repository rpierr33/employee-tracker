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
            choices: 
            [
                'view all departments', 
                'view all roles', 
                'view all employees', 
                'add a department', 
                'add a role', 
                'add an employee', 
                'update an employee role', 
                'exit']

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
                `SELECT * FROM department;`,
                (err, results) => {
                    console.table(results);
                    promptMenu();
            });
        };    

        
        const selectRoles = () => {
            Connection.query(
                `SELECT * FROM role;`,
                (err, results) => {
                    console.table(results);
                    promptMenu();
                });

        };
        const selectEmployees = () => {
            Connection.query(
                `SELECT E.id, E.first_name, E.last_name, R.title, D.name 
                AS department, R.salary, 
                CONCAT(M.first_name,' ',M.last_name) 
                AS manager FROM employee 
                E JOIN role R ON E.role_id = R.id 
                JOIN department D ON R.department_id = D.id 
                LEFT JOIN employee M ON E.manager_id = M.id;`,
                (err, results) => {
                    console.table(results);
                    promptMenu();
            });
        };    




        const promptAddDepartment = () => {
            inquirer.prompt([{
                type: 'input',
                name: 'name',
                message: 'Name the department you would like to add',
                validate: departmentName => {
                    if (departmentName) {
                        return true;
                    } else {
                        console.log('Please enter the name of your department!');
                        return false;
                    }
                }
            }])
                .then(name => {
                    Connection.promise().query(
                        "INSERT INTO department SET ?", name);
                    selectDepartments();
                })
        }

        const promptAddRole = () => {
            return connection.promise().query(
            "SELECT department.id, department.name FROM department;"
            )
            .then(([departments]) => {
                let departmentChoice = departments.map(({
                    id,
                    name
                }) => ({
                    name: name,
                    value: id
                }));

                inquirer.prompt(
                    [{
                        type: 'input',
                        name: 'title',
                        message: 'Enter the name of your title (Required)',
                        validate: titleName => {
                            if (titleName) {
                                return true;
                            } else {
                                console.log('Please enter title name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department are you from?',
                        choices: departmentChoice
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'Enter your salary (Required)',
                        validate: salary => {
                            if (salary) {
                                return true;
                            } else {
                                console.log('Please enter your salary!');
                                return false;
                            }
                        }
                    }   
                ]
            )
            .then(({title, depaartment, salary}) => {
                const query = connection.query(
                    "INSERT INTO department SET ?",
                    {
                        title: title,
                        department_id: department,
                        salary: salary
                    },
                    function (err, res) {
                        if (err) throw err;
                    }
                
            )
            })
            .then(() => selectRoles())
        })
        
    };


        const promptAddEmployee = () => {
        return connection.promise().query(
            "SELECT R.id, R.title FROM role R;"
    )
            .then(([employees]) => {
                let titleChoices = employees.map(({
                    id,
                    title

                }) => ({
                    value: id,
                    name: title
                }))

        connection.promise().query(
            "SELECT E.id,  CONCATE(E.first_name, ' ', E.last_name) AS manager FROM employee E;"
            ).then(([managers]) => {
                let managerChoices = managers.map(({
                    id,
                    manager
                }) => ({
                    value: id,
                    name: manager
                }));

                inquirer.prompt(
                    [{
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the employees first name (Required)',
                        validate: firstName => {
                            if (firstName) {
                                return true;
                            } else {
                                console.log("Please enter the employee's first name!");
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "What is the employee's last name (Required)",
                        validate: lastName => {
                            if (lastName) {
                                return true;
                            } else {
                                console.log("Please enter the employee's last name!");
                                return false;
                            }
                        }
                    },

                    {
                        type: 'list',
                        name: 'role',
                        message: "Which is the employee's role?",
                        choices: titleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager",
                        choices: managerChoices
                    },  
                ]
            )
            .then(({firstName, lastName, role, manager}) => {
                const query = connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: firstName,
                        last_name: lastName,
                        role_id: role,
                        manager_id: manager
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log({role, manager})
                    }
                
            )
            })
            .then(() => selectEmployees())
        })
        })
        
    };
        


        const promptUpdateRole = () => {
            return connection.promise().query(
            )
        };










//         inquirer.prompt(
//             [{
//                 type: 'input',
//                 name: 'title',
//                 message: 'Enter the name of your title (Required)',
//                 validate: titleName => {
//                     if (departmentName) {
//                         return true;
//                     } else {
//                         console.log('Please enter title name!');
//                         return false;
//                     }
//                 }
//             },
//             {
//                 type: 'list';
//                 name: 'department',
//                 message: 'Which department are you from?',
//                 choices: departmentChoice
//             },
//             {
//                 type: 'input';
//                 name: 'title',
//                 message: 'Enter the name of your title (Required)',
//                 validate: salary => {
//                     if (salary) {
//                         return true;
//                     } else {
//                         console.log('Please enter your salary!');
//                         return false;
//                     }
//                 }
//             }   
//         ]
//     )
//     .then(name => {
//         Connection.promise().query(
//             "INSERT INTO department SET ?",


// };