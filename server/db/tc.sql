DROP TABLE event;
DROP TABLE user_role_in_group;
DROP TABLE user_training_group;
DROP TABLE training_group;
DROP TABLE user_role;
DROP TABLE role;
DROP TABLE user;

CREATE TABLE user 
(
   id             char(50) primary key not null,
   nickname       char(50) not null,
   email          char(50) not null,
   password       char(50) not null
);

CREATE TABLE role 
(
   id         char(50) primary key not null,
   name       char(50) not null
);

CREATE TABLE user_role 
(
   id         char(50) primary key not null,
   user_id    char(50) not null,
   role_id    char(50) not null,
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(role_id) REFERENCES role(id)
);

CREATE TABLE training_group 
(
   id         char(50) primary key not null,
   name       char(50) not null
);

CREATE TABLE user_training_group 
(
   id         char(50) primary key not null,
   user_id    char(50) not null,
   group_id    char(50) not null,
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(group_id) REFERENCES training_group(id)
);

CREATE TABLE user_role_in_group 
(
   id         char(50) primary key not null,
   user_id    char(50) not null,
   group_id    char(50) not null,
   role_id    char(50) not null,
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(group_id) REFERENCES training_group(id)
   FOREIGN KEY(role_id) REFERENCES role(id)
);

CREATE TABLE event 
(
   id                 char(50) primary key not null,
   user_id            char(50) not null,
   group_id           char(50) not null,
   date_time          datetime,
   swim_duration      number,
   co_train_duration  number,
   stress_level  number,
   nutrition  number,
   sleep  number,
   remarks  char(1000),
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(group_id) REFERENCES training_group(id)
);

-- INIT TEST DATA
insert into user (id,nickname,email,password) values('4f569604-4c57-47b5-81b4-ff2281b26ef3','swimmer1','swimmer1@ikm1.fi','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
insert into user (id,nickname,email,password) values('95ffe07b-88bd-483d-ac2e-52d0703c374b','coach_ikm1','coach@ikm1.fi','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');

insert into role (id,name) values('3f56a760-241f-40ae-9823-9bdc00f5f16c','swimmer');
insert into role (id,name) values('7beab832-8472-42d1-9372-690f73e5ae2d','coach');
insert into role (id,name) values('4264a680-adf0-4054-908e-688bfbe1a7d5','user');
insert into role (id,name) values('dc963303-bcad-49f7-bf68-e4650e928b18','admin');

--insert into user_role (id,user_id,role_id) values('ec7a38f8-b39c-4bab-83a3-b8bb27690e46','4f569604-4c57-47b5-81b4-ff2281b26ef3','4264a680-adf0-4054-908e-688bfbe1a7d5');
--insert into user_role (id,user_id,role_id) values('45c685fc-e37c-4f9a-9664-8be875a21f84','95ffe07b-88bd-483d-ac2e-52d0703c374b','7beab832-8472-42d1-9372-690f73e5ae2d');

insert into training_group (id,name) values('1301e470-acc2-406d-a6f6-22777c672963','ikm 1');
insert into training_group (id,name) values('df90175a-56a6-470e-8bdf-0081a666a3cb','ikm 2');

insert into user_role_in_group (id,user_id,group_id,role_id) values('fbb6f4f1-f471-48dc-9fef-b58c5e950097','4f569604-4c57-47b5-81b4-ff2281b26ef3','1301e470-acc2-406d-a6f6-22777c672963','3f56a760-241f-40ae-9823-9bdc00f5f16c');
insert into user_role_in_group (id,user_id,group_id,role_id) values('f5672da7-1bde-4657-8220-123a6677bb7d','95ffe07b-88bd-483d-ac2e-52d0703c374b','1301e470-acc2-406d-a6f6-22777c672963','7beab832-8472-42d1-9372-690f73e5ae2d');

insert into user_training_group (id,user_id,group_id) values('74e9c59b-00cf-4a5e-b5e0-de29fdf8ab26','4f569604-4c57-47b5-81b4-ff2281b26ef3','1301e470-acc2-406d-a6f6-22777c672963');
insert into user_training_group (id,user_id,group_id) values('74e9c59b-00cf-4a5e-b5e0-de29fdf8ab27','4f569604-4c57-47b5-81b4-ff2281b26ef3','1301e470-acc2-406d-a6f6-22777c672963');
insert into user_training_group (id,user_id,group_id) values('ce3d90b0-b3fc-46fd-8168-5cf5b8dc7b61','95ffe07b-88bd-483d-ac2e-52d0703c374b','1301e470-acc2-406d-a6f6-22777c672963');

insert into event (id,user_id,group_id,date_time,swim_duration,co_train_duration, stress_level, nutrition, sleep, remarks) values('d98bdde8-e591-42cf-9146-e598a14f6783','4f569604-4c57-47b5-81b4-ff2281b26ef3','1301e470-acc2-406d-a6f6-22777c672963',datetime('now'),60,15,3,4,4,'kivaa');
