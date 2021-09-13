require = require('esm')(module);
module.exports = require('./server.js');




const db = require("../db/connection");
const { prompt } = require("inquirer");

class Query {
  // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    return db
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
      );
  }

  findAllManagers() {
    return db
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name FROM employee WHERE employee.manager_id IS NULL;"
      );
  }

  findAllRoles() {
    return db.promise().query("SELECT * FROM role");
  }

  findAllDepartments() {
    return db.promise().query("SELECT * FROM department");
  }

  viewAllByDepartments() {
    return db
      .promise()
      .query(
        "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY department.name;"
      );
  }

  viewAllByManagers() {
    return db
      .promise()
      .query(
        "SELECT CONCAT(employee.first_name,' ',employee.last_name)AS Employee,role.title AS Role,CONCAT(e.first_name,' ',e.last_name)AS Manager FROM employee JOIN role ON role.id=employee.role_id LEFT JOIN employee e ON e.id=employee.manager_id WHERE employee.manager_id IS NOT NULL"
      );
  }

  viewAllByRole() {
    return db
      .promise()
      .query(
        "SELECT CONCAT(employee.first_name,' ',employee.last_name)AS Employee,role.title AS Role FROM employee JOIN role ON role.id=employee.role_id"
      );
  }

  async addEmployee(rolesArr, managersArr) {
    // let result = await db.promise();
    let res = await prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name ",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name ",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role? ",
        choices: rolesArr,
      },
      {
        name: "manager",
        type: "list",
        message: "Who is the Employee's manager?",
        choices: managersArr,
      },
    ]);

    let query = await db.promise().query("INSERT INTO employee SET ?", {
      first_name: res.firstName,
      last_name: res.lastName,
      manager_id: res.manager,
      role_id: res.role,
    });
    return query;
    //get number forms of the role/manager ids somehow, maybe .indexOf
  }

  async removeEmployee(employeesArr) {
    let res = await prompt([
      {
        type: "list",
        name: "removeMe",
        message: "Which Employee would you like to remove?",
        choices: employeesArr,
      },
    ]);

    let query = await db.promise().query("DELETE FROM employee WHERE `id` = ?", [res.removeMe]);
    return query;
  }

  async updateEmployeeRole(rolesArr, employeesArr) {
    let res = await prompt([
      {
        type: "list",
        name: "updateMe",
        message: "Which Employee would you like to update?",
        choices: employeesArr,
      },
      {
        type: "list",
        name: "role",
        message: "What is the Employee's new role? ",
        choices: rolesArr,
      },
    ]);

    let query = await db.promise().query("UPDATE employee SET `role_id`=? WHERE `id` = ?", [res.role, res.updateMe]);
    return query;
  }

  async updateEmployeeManager(employeesArr, managersArr) {
    let res = await prompt([
      {
        type: "list",
        name: "updateMe",
        message: "Which Employee would you like to update?",
        choices: employeesArr,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the Employee's new manager? ",
        choices: managersArr,
      },
    ]);

    let query = await db
      .promise()
      .query("UPDATE employee SET `manager_id`=? WHERE `id` = ?", [res.manager, res.updateMe]);
    return query;
  }

  async addRole(deptArr) {
    let res = await prompt([
      {
        type: "input",
        name: "roleName",
        message: "What role do you want to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of this role?",
      },
      {
        type: "list",
        name: "deptId",
        message: "Which department does this role belong to?",
        choices: deptArr,
      },
    ]);

    let query = await db.promise().query("INSERT INTO role SET ?", {
      title: res.roleName,
      salary: res.salary,
      department_id: res.deptId,
    });
    return query;
  }

  async addDepartment() {
    let res = await prompt([
      {
        type: "input",
        name: "deptName",
        message: "What department do you want to add?",
      },
    ]);
    let query = await db.promise().query("INSERT INTO department SET ?", { name: res.deptName });
    return query;
  }
}

module.exports = Query;
/* Requirement Checklist
    `Features
    -✅ View All Employees, <<<<<<<<<<
    -✅ View All Managers,
    -✅ View All Departments, <<<<<<<<<<
    -✅ View All Roles, <<<<<<<<<<<<<<<<
    -✅ View Employees By Role,
    -✅ View Employees By Manager,
    -✅ View Employees By Department,
    -✅ Add Employee, <<<<<<<<<<<<<<<<<
    -✅ Remove Employee,
    -✅ Update Employee Role, <<<<<<<<<<<
    -✅ Update Employee Manager,
    -✅ Add Role, <<<<<<<<<<<<<<<<<<<<<<<
    -✅ Remove Role,
    -✅ Add Department, <<<<<<<<<<<<<<<<<
    -✅ Remove Department,
    -✅ Exit the Application,`;
    `Requirements
    view all departments, 
    view all roles, 
    view all employees, 
    add a department, 
    add a role, 
    add an employee, 
    update an employee role`;
*/