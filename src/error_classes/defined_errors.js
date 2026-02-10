import AppError from "./AppError.js";

export class MissingData extends AppError{

    constructor(){
        super(
            "Missing required data", 
            400, 
            "MISSING_DATA"
        );
    }
}

export class InvalidEmail extends AppError{

    constructor(){
        super(
            "Wrong email format",
            400,
            "INVALID_EMAIL"
        );
    }
}

export class WeakPassword extends AppError{

    constructor(){
        super(
            "Password is too weak",
            400,
            "WEAK_PASSWORD"
        );
    }
}

export class MissingLowercase extends AppError {
    constructor() {
        super(
            "Password must contain a lowercase letter",
            400,
            "WEAK_PASSWORD_LOWERCASE"
        );
    }
}

export class MissingUppercase extends AppError {
    constructor() {
        super(
            "Password must contain an uppercase letter",
            400,
            "WEAK_PASSWORD_UPPERCASE"
        );
    }
}

export class MissingDigit extends AppError {
    constructor() {
        super(
            "Password must contain a digit",
            400,
            "WEAK_PASSWORD_DIGIT"
        );
    }
}

export class MissingSpecialChar extends AppError {
    constructor() {
        super(
            "Password must contain a special character",
            400,
            "WEAK_PASSWORD_SPECIAL"
        );
    }
}

export class ShortPassword extends AppError {
    constructor() {
        super(
            "Password is too short",
            400,
            "WEAK_PASSWORD_SHORT"
        );
    }
}

export class LowEntropyPassword extends AppError {
    constructor() {
        super(
            "Password entropy is too low",
            400,
            "WEAK_PASSWORD_ENTROPY"
        );
    }
}

export class RegistrationFailed extends AppError {
    constructor() {
        super(
            "User registration failed",
            500,
            "REGISTRATION_FAILED"
        );
    }
}

export class DuplicateUser extends AppError {
    constructor() {
        super(
            "User with email already exists",
            409,
            "DUPLICATE_USER"
        );
    }
}

export class DatabaseOrServerError extends AppError {
    constructor() {
        super(
            "Database or server error",
            500,
            "DATABASE_ERROR"
        );
    }
}