export default function parseError(err) {
    if (err instanceof Error) {
        //standart Error
        if (!err.errors) {
            err.errors = [err.message];
        } else {
            //mongoose validation error
            const error = new Error('Input validation error.');
            error.errors = Object.fromEntries(Object.values(err.errors).map( e => [ e.path, e.message ]));
            return error;
        }
    } else if (Array.isArray(err)) {
        //express-validator Error
        const error = new Error('Input validation error.');
        error.errors = Object.fromEntries(err.map(e => [e.path, e.msg]));
        return error;
    }
    return err;
}