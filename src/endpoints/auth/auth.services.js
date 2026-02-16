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

export async function authorizeUser({ email, password }) {
    try {
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

        if (result.rowCount > 1) {
            console.error("Data integrity issue: duplicate emails found", email);
            throw new DBIntegrityError();
        }

        const check = await bcrypt.compare(password, result.rows[0].password);

        if (!check)
            throw new InvalidUser();

        return { id: result.rows[0].id, email: result.rows[0].email };
    }
    catch (err) {
        if (err.is_expected)
            throw err;

        console.error("Unexpected error in authorizeUser:", err);
        throw new DatabaseOrServerError();
    }
}

export const verifyOtpService = async (email, otp) => {

    const result = await pool.query(
        "SELECT otp FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    if (user.verification_otp !== otp) {
        throw new Error("Invalid OTP");
    }

    if (new Date(user.otp_expiry) < new Date()) {
        throw new Error("OTP expired");
    }

    await pool.query(
        `UPDATE users
     SET is_verified = true,
         verification_otp = NULL,
         otp_expiry = NULL
     WHERE email = $1`,
        [email]
    );

    return { message: "Email verified successfully!" };
};

export async function storeOtp(otp, expiry, email) {
    try {
        const result = await pool.query(
            `
            UPDATE users 
            SET 
                otp = $1,
                otp_expiry = $2
            
            WHERE email = $3
            RETURNING id;
            `,
            [otp, expiry, email]
        );

        if (result.rowCount === 0) {
            throw new InvalidUser();
        }

        return result.rows[0];
    }
    catch (err) {
        console.error("Unexpected DB error for user", email, err);
        throw new DatabaseOrServerError();
    }
}