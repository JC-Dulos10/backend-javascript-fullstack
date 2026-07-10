"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema, target = "body") {
    return (req, res, next) => {
        // Validate the incoming payload before it reaches the controller/service layer.
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: result.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        // Express' `req.query` can be implemented as a getter-only property depending on the runtime/types.
        // Avoid direct assignment; instead merge validated data into it.
        if (target === 'query') {
            Object.assign(req.query, result.data);
        }
        else {
            req[target] = result.data;
        }
        next();
    };
}
