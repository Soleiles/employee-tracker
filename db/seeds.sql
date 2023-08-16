INSERT INTO department (name)
VALUES 
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Sales Lead", 100000, 1),
    ("Salesperson", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 160000, 3),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
    ("Kevin", "Taing", 1, 1),
    ("Tina", "Huynh", 2, null),
    ("Brandon", "Wong", 3, 2),
    ("Samantha", "Eap", 4, null),
    ("David", "Tran", 5, 3),
    ("Andy", "Cao", 6, null),
    ("Vinh", "Phan", 7, 4),
    ("Beka", "Kalandadze", 8, null);
