import checkPasswordStrength from "../../tools/pswd_strength.js";
import {
    InvalidEmail,
    MissingData 
} from "../../error_classes/defined_errors.js";

export function validateRegUser(req, res, next) {
    const { username, email, password } = req.body;

    // Check for empty fields
    if (!username || !email || !password) {
        throw new MissingData();
    }

    // Verify email
    if (!(/^[a-zA-Z\d._%+-]+@(([a-z]+\.)?gitam\.(in|edu))$/u.test(email))) {
        throw new InvalidEmail();
    }

    // Password strentgh
    const pswd_strength = checkPasswordStrength(password);

    if (!pswd_strength.ok) {
        throw new pswd_strength.error;
    }

    next();
}

export function validateLoginUser(req, res, next){
    const {email, password} = req.body;

    // Check for empty fields
    if (!email || !password){
        throw new MissingData();
    }

    // Verify email
    if (!(/^[a-zA-Z\d._%+-]+@(([a-z]+\.)?gitam\.(in|edu))$/u.test(email))) {
        throw new InvalidEmail();
    }

    next();
}