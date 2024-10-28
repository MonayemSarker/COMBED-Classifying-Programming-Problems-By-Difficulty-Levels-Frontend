import { jwtDecode } from 'jwt-decode';

export function decodeToken(token: any) {
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}

export function isTokenExpired(exp: any) {
    if (!exp) return true;
    const currentTime = Math.floor(Date.now() / 1000); // in seconds
    return exp < currentTime;
}