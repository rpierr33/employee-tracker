INSERT INTO department 
(name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role 
(title, salary, department_id)
VALUES ("Sales Lead",90000,1),
("Salesperson",65000,1),
("Lead Engineer",130000,2),
("Software Engineer", 110000, 2),
("Accountant", 105000, 3),
("Legal Team Lead", 210000, 4),
("Lawyer", 170000, 4);

INSERT INTO employee 
(first_name, last_name, manager_id, role_id)
VALUES
  ('Ronald', 'Firbank', 1, 1),
  ('Virginia', 'Woolf', 1, 1),
  ('Piers', 'Gaveston', 1, 0),
  ('Charles', 'LeRoi', 2, 1),
  ('Katherine', 'Mansfield', 2, 1),
  ('Dora', 'Carrington', 3, 0),
  ('Edward', 'Bellamy', 3, 0),
  ('Montague', 'Summers', 3, 1),
  ('Octavia', 'Butler', 3, 1),
  ('Unica', 'Zurn', NULL, 1);
  
  