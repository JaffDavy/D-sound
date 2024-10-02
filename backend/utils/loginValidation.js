import Joi from "joi";

// Define the validation schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .min(8)
        .max(20)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[a-z]/, 'lowercase')
        .pattern(/\d/, 'digit')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
        .required(),
});

// Function to check for missing and unexpected keys
function checkMissingAndUnexpectedKeys(expectedKeys, dataKeys) {
    const missingKeys = expectedKeys.filter(key => !dataKeys.includes(key));
    const unexpectedKeys = dataKeys.filter(key => !expectedKeys.includes(key));

    if (missingKeys.length > 0) {
        throw new Error(`Missing required keys: ${missingKeys.join(', ')}`);
    }
    if (unexpectedKeys.length > 0) {
        throw new Error(`Unexpected keys found: ${unexpectedKeys.join(', ')}`);
    }
}

// Middleware function for login validation
export default function loginValidation(req, res, next) {
    const data = req.body;

    // Update the expected keys for login validation
    const expectedKeys = ["email", "password"];
    const dataKeys = Object.keys(data);

    try {
        checkMissingAndUnexpectedKeys(expectedKeys, dataKeys);
    } catch (error) {
        return res.status(400).send({
            message: error.message
        });
    }

    // Validate login data using Joi
    const { error } = loginSchema.validate(data);

    if (error) {
        return res.status(400).send({
            message: "Validation error",
            details: error.details[0].message
        });
    }

    next();
}
