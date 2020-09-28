CREATE DATABASE db_employee; 
USE db_employee; 

CREATE TABLE employee (
id INT AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL, 
last_name VARCHAR(30) NOT NULL, 
role_id INT NOT NULL, 
manager_id INT,  
PRIMARY KEY (id)
); 

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT, 
title VARCHAR(30) NOT NULL, 
salary DECIMAL NOT NULL, 
department_id INT NOT NULL, 
PRIMARY KEY (id)
); 

CREATE TABLE department (
id INT AUTO_INCREMENT, 
title VARCHAR(30),  
PRIMARY KEY (id)
);