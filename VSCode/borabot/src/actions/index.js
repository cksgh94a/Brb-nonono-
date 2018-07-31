export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
// export const SET_DIFF = 'SET_DIFF';

export function login() {
    return {
        type: LOGIN
    };
}

export function logout() {
    return {
        type: LOGOUT
    };
}

// export function setDiff(value) {
//     return {
//         type: SET_DIFF,
//         diff: value
//     };
// }
