import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyAdminToken(req) {
    let token = null;

    // Try standard Authorization header
    const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    // Try custom header
    if (!token) {
        token = req.headers.get('x-access-token');
    }

    // Try URL query parameter
    if (!token) {
        try {
            const url = new URL(req.url);
            token = url.searchParams.get('token');
        } catch (e) {
            // Ignore URL parsing errors
        }
    }

    if (!token) {
        return { error: "Missing token in headers and query" };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { decoded };
    } catch (err) {
        return { error: `JWT Verification failed: ${err.message}` };
    }
}
