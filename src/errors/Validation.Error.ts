import { stat } from "fs";
import { CustomError } from "../middleware/CustomError.Middleware";

class ValidationError extends CustomError { 
    statusCode = 422;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }

    serializeErrors() {
        return [{ message: this.message, code: "VALIDATION_ERROR", statusCode: this.statusCode }];
    }
}

export default ValidationError;