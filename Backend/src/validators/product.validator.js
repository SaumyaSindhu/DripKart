import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();

}

export const createProductValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title can be maximum 100 characters long"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description can be maximum 1000 characters long"),
  body("priceAmount")
    .notEmpty()
    .withMessage("Price amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Price amount must be a positive number"),
  body("priceCurrency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "JPY", "INR"])
    .withMessage("Price currency must be one of USD, EUR, GBP, JPY, INR"),

  validateRequest
];