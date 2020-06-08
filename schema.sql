drop database if exists Employee_Tracker_db;

create database Employee_Tracker_db;

use Employee_Tracker_db;

create table department (
    id int(10) auto_increment not null primary key,
    name varchar(30)  not null
);

create table role (
    id int(10) primary key auto_increment not null,
    title varchar(30) not null,
    salary decimal not null ,
    department_id int not null
);

create table employee (
    id int(10) primary key auto_increment not null,
    first_name varchar(30) not null not null,
    last_name varchar(30),
    role_id int
);