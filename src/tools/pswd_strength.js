import zxcvbn from "zxcvbn";

const password_rules = [
    {
        test: (p) => /[a-z]/.test(p),
        code: 20
    },
    {
        test: (p) => /[A-Z]/.test(p),
        code: 21
    },
    {
        test: (p) => /\d/.test(p),
        code: 22
    },
    {
        test: (p) => /[!@#$%^&*_]/.test(p),
        code: 23
    },
    {
        test: (p) => p.length >= 8,
        code: 24
    }
];

function layer1(password){
    
    for (const rule of password_rules){
        if (!rule.test(password)){
            return {
                ok: false,
                code: rule.code
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
            code: 25
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