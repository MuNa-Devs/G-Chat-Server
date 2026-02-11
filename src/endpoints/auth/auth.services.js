import bcrypt from 'bcrypt';
import pool from '../api_utils/db.js';
import {
    DatabaseOrServerError,
    DBIntegrityError,
    DuplicateUser,
    InvalidUser,
    RegistrationFailed
} from '../../error_classes/defined_errors.js';

export async function registerUser({ username, email, password }) {
    let pswd_hashed;

    // Hash password
    try {
        pswd_hashed = await bcrypt.hash(password, 10)
    }
    catch (err) {
        throw new RegistrationFailed()
    }

    // Save user details
    try {
        const result = await pool.query(
            `
            INSERT INTO users (username, email, password)
            VALUES
                ($1, $2, $3)
            RETURNING id
        `,
            [username, email, pswd_hashed]
        );

        return result.rows[0];
    }
    catch (err) {
        if (err.code === '23505')
            throw new DuplicateUser() // duplicate user

        throw new DatabaseOrServerError() // other error
    }
}

export async function authorizeUser({ email, password }){
    try{
        const result = await pool.query(
            `
            SELECT
                u.id,
                u.email,
                u.password
            FROM users u
            WHERE u.email = $1;
            `,
            [email]
        );

        if (result.rowCount === 0)
            throw new InvalidUser();

        if (result.rowCount > 1){
            console.error("Data integrity issue: duplicate emails found", email);
            throw new DBIntegrityError();
        }

        const check = await bcrypt.compare(password, result.rows[0].password);

        if (!check)
            throw new InvalidUser();

        return { id: result.rows[0].id, email: result.rows[0].email };
    }
    catch (err){
        if (err.is_expected)
            throw err;

        console.error("Unexpected error in authorizeUser:", err);
        throw new DatabaseOrServerError();
    }
}