-- Insert data into department table
INSERT INTO department (name) VALUES
('Engineering'),
('Sales'),
('Marketing'),
('Finance'),
('Human Resources');

-- Insert data into roles table
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 80000.00, 1),
('Sales Manager', 100000.00, 2),
('Marketing Coordinator', 60000.00, 3),
('Financial Analyst', 75000.00, 4),
('HR Specialist', 65000.00, 5);

-- Insert data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, 2),
('Jane', 'Smith', 2, NULL),
('Michael', 'Johnson', 1, 2),
('Emily', 'Davis', 3, 2),
('Sarah', 'Brown', 4, 2);
