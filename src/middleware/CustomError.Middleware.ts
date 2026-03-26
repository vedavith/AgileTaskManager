export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract serializeErrors(): { message: string, field?: string }[];

    constructor(message: string) {
        super(message);
        // Restore prototype chain when extending built-in classes
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
