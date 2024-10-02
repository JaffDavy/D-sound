import Joi from "joi";

const registrationValidationSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(100)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .min(8)
        .max(20)
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/[a-z]/, 'lowercase')
        .pattern(/\d/, 'digit')
        .pattern(/[!@#$%^&*(),.?":{}|<>]/, 'special character')
        .required(),
});

// Middleware function for registration validation
export default function registrationValidation(req, res, next) {
    const { error } = registrationValidationSchema.validate(req.body);

    if (error) {
        return res.status(400).send({
            message: "Validation error",
            details: error.details[0].message,
        });
    }

    next();
}
