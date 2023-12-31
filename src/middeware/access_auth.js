import { verify_access_token } from '../utils/jwt.js';

const nasabah = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'nasabah') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
};

const admin = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'admin') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const sysadmin = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'admin_master') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const manager = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'manager') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const officer = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'officer') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const admins = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'admin' && decoded.role.toLowerCase() !== 'admin_master' && decoded.role.toLowerCase() !== 'manager' && decoded.role.toLowerCase() !== 'officer') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const approval = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() !== 'admin' && decoded.role.toLowerCase() !== 'officer') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const internals = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            } else if (decoded.role.toLowerCase() === 'nasabah') {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'access denied'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

const is_login = (req, res, next) => {
    let access_token = req.headers.authorization
    if (!access_token) {
        return res.status(401).json({
            status: 401,
            message: 'failed',
            info: 'no detected token'
        });
    }

    try {
        access_token = access_token.split(' ')[1];
        verify_access_token(access_token, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 401,
                    message: 'failed',
                    info: 'expired token'
                });
            }
            req.token = decoded
            next()
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            status: 500,
            message: 'failed',
            info: 'server error'
        });
    }
}

export { nasabah, admin, sysadmin, manager, officer, admins, internals, is_login, approval }