INSERT INTO department (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead",100000,1),
("Salesperson",80000,1),
("Lead Engineer",150000,2),
("Software Engineer", 120000, 2),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Honey","Corradino",null,6),
 ("Ranique","Crayden",null,3),
 ("Robby","Rucklidge",null,1),
 ("Appolonia","Dagworthy",1,4),
 ("Jereme","Sugarman",1,2),
 ("Ariadne","Cherrie",1,5),
 ("Norris","Arpur",2,7),
 ("Mala","Oldrey",2,5),
 ("Dori","Vasiliev",2,5),
 ("Elwira","Mullinder",3,2),
 ("Carlo","Vinden",3,4),
 ("Margarita","Flukes",3,5),
 ("Randi","Shafto",3,7),
 ("Julienne","Fysh",3,7);
  