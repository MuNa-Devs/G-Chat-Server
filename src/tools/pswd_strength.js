import zxcvbn from "zxcvbn";
import { 
    LowEntropyPassword, 
    MissingData, 
    MissingLowercase, 
    MissingSpecialChar, 
    MissingUppercase, 
    ShortPassword 
} from "../error_classes/defined_errors.js";

const password_rules = [
    {
        test: (p) => /[a-z]/.test(p),
        error: MissingLowercase
    },
    {
        test: (p) => /[A-Z]/.test(p),
        error: MissingUppercase
    },
    {
        test: (p) => /\d/.test(p),
        error: MissingData
    },
    {
        test: (p) => /[!@#$%^&*_]/.test(p),
        error: MissingSpecialChar
    },
    {
        test: (p) => p.length >= 8,
        error: ShortPassword
    }
];

function layer1(password){
    
    for (const rule of password_rules){
        if (!rule.test(password)){
            return {
                ok: false,
                error: rule.error
            };
        }
    }

    return {ok: true};
}

function layer2(password){
    const score = zxcvbn(password).score;

    if (score < 3){
        return {
            ok: false,
            error: LowEntropyPassword
        };
    }

    return {ok: true};
}

function layer3(password){
    
    return {ok: true};
}

export default function checkPasswordStrength(password){
    let strength_check = layer1(password);
    
    if (strength_check.ok)
        strength_check = layer2(password);

    // if (strength_check.ok)
    //     strength_check = layer3(password);

    return strength_check;
}