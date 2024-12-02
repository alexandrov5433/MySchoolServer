



async function login(req, res) {
    
}

async function register(req, res) {
    console.log(req.headers);
    res.status(200);
    res.end();
}

export const user = {
    login,
    register
};