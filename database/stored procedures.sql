USE  tickly_system;
GO
DROP PROCEDURE IF EXISTS GetUsers;
CREATE PROCEDURE GetUsers
AS
BEGIN
    SELECT 
        u.id AS UserID,
        u.email AS Email,
        u.role AS Role,
        u.is_Active AS IsActive,
        u.phone_number AS PhoneNumber,
        u.name AS Name,
        u.created_at AS CreatedAt,
        u.rating AS Rating,
        c.name AS CompanyName,
        c.location AS CompanyLocation,
        c.owner AS CompanyOwner,
        c.contact_person_email AS CompanyContactPersonEmail
    FROM 
        USERS u
    LEFT JOIN 
        COMPANIES c ON u.company_id = c.id;
END;

EXEC GetUsers;
