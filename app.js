const db = require("./db/connection");
const inquirer = require('inquirer');
const fs = require("fs");
const mysql = require('mysql2');
const chalkAnimation = require('chalk-animation');
require('console.table');


db.connect((err) => {
    if (err) throw err;
    console.log("connecting to DB");
    console.log("please wait...");
    const rainbow = chalkAnimation.rainbow('Empoyee Manager');
    setTimeout(() => {
        rainbow.stop(); // Animation stops
    }, 5000);
    promptMenu();

    

});


const promptMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: 
            [
                'select departments', 
                'select all roles', 
                'select all employees', 
                'add a department', 
                'add a role', 
                'add an employee', 
                'update an employee role', 
                'delete an employee', 
                'exit']

        }])
        .then(userChoice => {
            console.log('userCHoice', userChoice)
            var thing = {
                menue: 'select all'
            }
            switch (userChoice.menu) {
                case 'select departments':
                    selectDepartments();
                    break;
                case 'select all roles' :
                    selectRoles();
                    break;
                case 'select all employees':
                    selectEmployees();
                    break;
                case 'add a department':
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
                case 'delete an employee':
                    deleteEmployee();
                    break;     
                default:
                    process.exit;
            }
        });
};

        const selectDepartments = () => {
            console.log('Select all departs happening!!!!!')
            db.query(
                `SELECT * FROM department;`,
                (err, results) => {
                    console.table(results);
                    promptMenu();
            });
        };    

        
        const selectRoles = () => {
            console.log('INSIDE SECLECT ROLE FUNCTION!!')
            // name
             //last name
            db.query(
                'SELECT * FROM role;',
                (err, results) => {
                    console.table(results);
                    promptMenu();
                });

        };

        const selectEmployees = () => {
            db.query(
                "SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
                (err, results) => {
                    console.table(results);
                    promptMenu();
            });
        };    




        const promptAddDepartment = () => {
            inquirer.prompt([{
                type: 'input',
                name: 'deptName',
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
                .then(answer => {
                    db.promise().query(
                        "INSERT INTO department (name) VALUES (?)", [answer.deptName]);
                        
                        promptMenu();
                })
        }

        const promptAddRole = () => {
            return db.promise().query(
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

            //.then(({ title, department, salary }) => {
                .then(({ title, department, salary }) => {
                const query = db.promise().query(
                    'INSERT INTO role SET ?',
                    {
                        title: title,
                        department_id: department,
                        salary: salary
                    },
                    function (err, res) {
                        if (err) throw err;
                    }
                )
            }).then(() => selectRoles())

    })
}

const promptAddEmployee = (roles) => {

    return db.promise().query(
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

            db.promise().query(
                "SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employee E;"
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
                                console.log('Please enter the employees first name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the employees last name (Required)',
                        validate: lastName => {
                            if (lastName) {
                                return true;
                            } else {
                                console.log('Please enter the employees last name!');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What is the employees role?',
                        choices: titleChoices
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who is the employees manager?',
                        choices: managerChoices
                    }

                    ])
                    .then(({ firstName, lastName, role, manager }) => {
                        const query = db.query(
                            'INSERT INTO employee SET ?',
                            {
                                first_name: firstName,
                                last_name: lastName,
                                role_id: role,
                                manager_id: manager
                            },
                            function (err, res) {
                                if (err) throw err;
                                console.log({ role, manager })
                            }
                        )
                    })
                    .then(() => selectEmployees())
            })
        })
}

const promptUpdateRole = () => {

    return db.promise().query(
        "SELECT R.id, R.title, R.salary, R.department_id FROM role R;"
    )
        .then(([roles]) => {
            let roleChoices = roles.map(({
                id,
                title

            }) => ({
                value: id,
                name: title
            }));

            inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role do you want to update?',
                        choices: roleChoices
                    }
                ]
            )
                .then(role => {
                    console.log(role);
                    inquirer.prompt(
                        [{
                            type: 'input',
                            name: 'title',
                            message: 'Enter the name of your title (Required)',
                            validate: titleName => {
                                if (titleName) {
                                    return true;
                                } else {
                                    console.log('Please enter your title name!');
                                    return false;
                                }
                            }
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
                        }]
                    )
                        .then(({ title, salary }) => {
                            const query = db.query(
                                'UPDATE role SET title = ?, salary = ? WHERE id = ?',
                                [
                                    title,
                                    salary
                                    ,
                                    role.role
                                ],
                                function (err, res) {
                                    if (err) throw err;
                                }
                            )
                        })
                        .then(() => promptMenu())
                })
        });

};

// const deleteEmployee = () => {
//     console.log('Select all departs happening!!!!!')
//             db.query(
//                 `SELECT * FROM employee;`,
//                 (err, results) => {
//                     console.table(results);
    
//         }   

     
//     router.delete('/employee/:id', (req, res) => {
//         const sql = `DELETE FROM employee WHERE id = ?`;
      
//         db.query(sql, req.params.id, (err, result) => {
//           if (err) {
//             res.status(400).json({ error: res.message });
//           } else if (!result.affectedRows) {
//             res.json({
//               message: 'Employee not found'
//             });
//           } else {
//             res.json({
//               message: 'deleted',
//               changes: result.affectedRows,
//               id: req.params.id
//             });
//           }
//         });
//       });
//        promptMenu();





promptMenu();