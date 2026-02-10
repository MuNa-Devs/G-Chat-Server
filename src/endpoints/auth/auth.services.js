import bcrypt from 'bcrypt';

import pool from '../../db.js';
import {
    DatabaseOrServerError,
    DuplicateUser,
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

        return result;
    }
    catch (err) {
        if (err.code === '23505')
            throw new DuplicateUser() // duplicate user

        throw new DatabaseOrServerError() // other error
    }
}