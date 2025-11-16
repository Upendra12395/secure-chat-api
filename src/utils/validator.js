const { z } = require("zod");

const MIN_LENGTH = 9;

const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/`~+=;']/;

const passwordSchema = z
    .string()
    .min(MIN_LENGTH, { message: `Password must be at least ${MIN_LENGTH} characters.` })
    .refine((val) => hasUppercase.test(val), { message: "Password must contain at least one uppercase letter." })
    .refine((val) => hasLowercase.test(val), { message: "Password must contain at least one lowercase letter." })
    .refine((val) => hasNumber.test(val), { message: "Password must contain at least one number." })
    .refine((val) => hasSpecial.test(val), { message: "Password must contain at least one special character." });

function validatePassword(password) {
    const result = passwordSchema.safeParse(password);
    if (result.success) {
        return { valid: true, errors: null };
    } else {
        const messages = Array.from(new Set(result.error.issues.map((i) => i.message)));
        return { valid: false, errors: messages };
    }
}

module.exports = { validatePassword };
