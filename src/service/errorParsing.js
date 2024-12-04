export default function parseError(err) {
    if (err instanceof Error) {
        //standart Error
        if (!err.errors) {
            err.errors = [err.message];
        } else {
            //mongoose validation error
            const error = new Error('Input validation error.');
            error.errors = (Object.values(err.errors).map( e => e.message ).join(' '));
            // error.errors = Object.fromEntries(Object.values(err.errors).map( e => [ e.path, e.message ]));
            return error;
        }
    }
    return err;
}