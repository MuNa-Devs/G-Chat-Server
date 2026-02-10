import checkPasswordStrength from "../../tools/pswd_strength";

export function validateUser(req, res, next) {
    const { username, email, password } = req.body;

    // Check for empty fields
    if (!username || !email || !password) {
        res.status(400).json({
            success: false,
            code: 0
        });

        return;
    }

    // Verify email
    if (!(/^[a-zA-Z\d._%+-]+@(([a-z]+\.)?gitam\.(in|edu))$/u.test(email))) {
        res.status(400).json({
            success: false,
            code: 1
        });

        return;
    }

    // Password strentgh
    const pswd_strength = checkPasswordStrength(password);

    if (!pswd_strength.ok) {
        res.status(400).json({
            success: false,
            code: pswd_strength.code
        });

        return;
    }

    next();
}