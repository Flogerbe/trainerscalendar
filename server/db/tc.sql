DROP TABLE user;
CREATE TABLE user 
(
   id             char(50) primary key not null,
   nickname       char(50) not null,
   email          char(50) not null,
   password       char(50) not null
);

DROP TABLE role;
CREATE TABLE role 
(
   id         char(50) primary key not null,
   name       char(50) not null
);

DROP TABLE user_role;
CREATE TABLE user_role 
(
   id         char(50) primary key not null,
   user_id    char(50) not null,
   role_id    char(50) not null,
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(role_id) REFERENCES role(id)
);

DROP TABLE training_group;
CREATE TABLE training_group 
(
   id         char(50) primary key not null,
   name       char(50) not null
);

DROP TABLE user_group;
CREATE TABLE user_group 
(
   id         char(50) primary key not null,
   user_id    char(50) not null,
   group_id    char(50) not null,
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(group_id) REFERENCES training_group(id)
);

DROP TABLE user_role_in_group;
CREATE TABLE user_role_in_group 
(
   id         char(50) primary key not null,
   user_id    char(50) not null,
   group_id    char(50) not null,
   role_id    char(50) not null,
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(group_id) REFERENCES training_group(id)
   FOREIGN KEY(role_id) REFERENCES user_role(id)
);

DROP TABLE event;
CREATE TABLE event 
(
   id                 char(50) primary key not null,
   user_id            char(50) not null,
   group_id           char(50) not null,
   date_time          datetime,
   swim_duration      number,
   co_train_duration  number,
   FOREIGN KEY(user_id) REFERENCES user(id),
   FOREIGN KEY(group_id) REFERENCES training_group(id)
);

-- INIT TEST DATA
insert into user (id,nickname,email,password) values('4f569604-4c57-47b5-81b4-ff2281b26ef3','onni','onni.pajumaki@live.fi','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
insert into user (id,nickname,email,password) values('95ffe07b-88bd-483d-ac2e-52d0703c374b','timo','timo.pajumaki@live.com','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');

insert into role (id,name) values('3f56a760-241f-40ae-9823-9bdc00f5f16c','swimmer');
insert into role (id,name) values('7beab832-8472-42d1-9372-690f73e5ae2d','coach');
insert into role (id,name) values('dc963303-bcad-49f7-bf68-e4650e928b18','admin');

insert into user_role (id,user_id,role_id) values('ec7a38f8-b39c-4bab-83a3-b8bb27690e46','4f569604-4c57-47b5-81b4-ff2281b26ef3','3f56a760-241f-40ae-9823-9bdc00f5f16c');
insert into user_role (id,user_id,role_id) values('45c685fc-e37c-4f9a-9664-8be875a21f84','95ffe07b-88bd-483d-ac2e-52d0703c374b','7beab832-8472-42d1-9372-690f73e5ae2d');

insert into user_role_in_group (id,user_id,group_id,role_id) values('fbb6f4f1-f471-48dc-9fef-b58c5e950097','4f569604-4c57-47b5-81b4-ff2281b26ef3','331f3a31a-fbbe-493d-ba26-acc1cedeff63','3f56a760-241f-40ae-9823-9bdc00f5f16c');
insert into user_role_in_group (id,user_id,group_id,role_id) values('f5672da7-1bde-4657-8220-123a6677bb7d','95ffe07b-88bd-483d-ac2e-52d0703c374b','331f3a31a-fbbe-493d-ba26-acc1cedeff63','7beab832-8472-42d1-9372-690f73e5ae2d');

insert into training_group (id,name) values('331f3a31a-fbbe-493d-ba26-acc1cedeff63','ikm 1');
insert into training_group (id,name) values('df90175a-56a6-470e-8bdf-0081a666a3cb','ikm 2');

insert into user_group (id,user_id,group_id) values('74e9c59b-00cf-4a5e-b5e0-de29fdf8ab26','4f569604-4c57-47b5-81b4-ff2281b26ef3','331f3a31a-fbbe-493d-ba26-acc1cedeff63');
insert into user_group (id,user_id,group_id) values('ce3d90b0-b3fc-46fd-8168-5cf5b8dc7b61','95ffe07b-88bd-483d-ac2e-52d0703c374b','331f3a31a-fbbe-493d-ba26-acc1cedeff63');

insert into event (id,user_id,group_id,date_time,swim_duration,co_train_duration) values('d98bdde8-e591-42cf-9146-e598a14f6783','4f569604-4c57-47b5-81b4-ff2281b26ef3','331f3a31a-fbbe-493d-ba26-acc1cedeff63',datetime('now'),60,15);
insert into event (id,user_id,group_id,date_time,swim_duration,co_train_duration) values('4f569604-4c57-47b5-81b4-ff2281b26ef3','4f569604-4c57-47b5-81b4-ff2281b26ef3','331f3a31a-fbbe-493d-ba26-acc1cedeff63',datetime('now'),60,15);
