 DROP DATABASE tickly_system

-- CREATE DATABASE tickly_system;

USE  tickly_system;
GO

-- Create COMPANIES table
CREATE TABLE COMPANIES (
  id CHAR(4) PRIMARY KEY DEFAULT SUBSTRING(CONVERT(VARCHAR(40), NEWID()), 1, 4),
  name VARCHAR(255) UNIQUE,
  location VARCHAR(255),
  owner VARCHAR(255),
  contact_person_email VARCHAR(255)
);

-- Insert dummy data into COMPANIES
INSERT INTO COMPANIES (id, name, location, owner, contact_person_email) VALUES
('C001', 'Company One', 'New York, NY', 'John Doe', 'john.doe@companyone.com'),
('C002', 'Company Two', 'San Francisco, CA', 'Jane Smith', 'jane.smith@companytwo.com');

-- Create USERS table
CREATE TABLE USERS (
  id CHAR(4) PRIMARY KEY DEFAULT SUBSTRING(CONVERT(VARCHAR(40), NEWID()), 1, 4),
  email VARCHAR(255) UNIQUE,
  role VARCHAR(20),
  is_Active BIT,
  password VARCHAR(255),
  phone_number VARCHAR(20),
  name VARCHAR(255),
  created_at DATETIME,
  rating INT,
  company_id CHAR(4),
  FOREIGN KEY (company_id) REFERENCES COMPANIES(id)
);

-- Insert dummy data into USERS
INSERT INTO USERS (id, email, role, is_Active, password, phone_number, name, created_at, rating, company_id) VALUES
('U001', 'alice.agent@companyone.com', 'agent', 1, 'password123', '555-1234', 'Alice Agent', GETDATE(), 5, 'C001'),
('U002', 'bob.superagent@companyone.com', 'superAgent', 1, 'password123', '555-5678', 'Bob SuperAgent', GETDATE(), 5, 'C001'),
('U003', 'charlie.client@companyone.com', 'client', 1, 'password123', '555-9101', 'Charlie Client', GETDATE(), 4, 'C001'),
('U004', 'dave.agent@companytwo.com', 'agent', 1, 'password123', '555-1122', 'Dave Agent', GETDATE(), 3, 'C002'),
('U005', 'eve.superagent@companytwo.com', 'superAgent', 1, 'password123', '555-3344', 'Eve SuperAgent', GETDATE(), 5, 'C002'),
('U006', 'frank.client@companytwo.com', 'client', 1, 'password123', '555-5566', 'Frank Client', GETDATE(), 2, 'C002');

-- Create TICKETS table
CREATE TABLE TICKETS (
  ticket_id CHAR(4) PRIMARY KEY DEFAULT SUBSTRING(CONVERT(VARCHAR(40), NEWID()), 1, 4),
  company_id CHAR(4),
  date DATETIME,
  subject VARCHAR(255),
  client_id CHAR(4),
  agent_id CHAR(4),
  status VARCHAR(20),
  category VARCHAR(50),
  description TEXT,
  rating INT,
  FOREIGN KEY (company_id) REFERENCES COMPANIES(id),
  FOREIGN KEY (client_id) REFERENCES USERS(id),
  FOREIGN KEY (agent_id) REFERENCES USERS(id)
);

-- Insert dummy data into TICKETS
INSERT INTO TICKETS (ticket_id, company_id, date, subject, client_id, agent_id, status, category, description, rating) VALUES
('T001', 'C001', GETDATE(), 'Issue with product', 'U003', 'U001', 'open', 'product', 'There is an issue with the product.', 4),
('T002', 'C002', GETDATE(), 'Billing question', 'U006', 'U004', 'resolved', 'billing', 'Question about the latest bill.', 5);

-- Create MESSAGES table
CREATE TABLE MESSAGES (
  message_id CHAR(4) PRIMARY KEY DEFAULT SUBSTRING(CONVERT(VARCHAR(40), NEWID()), 1, 4),
  ticket_id CHAR(4),
  sender_id CHAR(4),
  message_text TEXT,
  timestamp DATETIME,
  FOREIGN KEY (ticket_id) REFERENCES TICKETS(ticket_id),
  FOREIGN KEY (sender_id) REFERENCES USERS(id)
);

-- Insert dummy data into MESSAGES
INSERT INTO MESSAGES (message_id, ticket_id, sender_id, message_text, timestamp) VALUES
('M001', 'T001', 'U003', 'I have an issue with the product I purchased.', GETDATE()),
('M002', 'T001', 'U001', 'Could you please provide more details about the issue?', GETDATE()),
('M003', 'T002', 'U006', 'I have a question about my latest bill.', GETDATE()),
('M004', 'T002', 'U004', 'Sure, I can help with that. What specifically is your question?', GETDATE());
