
export function genParentalAuthCode() {
    let code = '';
    for (let i = 1; i <= 10; i++) {
        code += randomNumber(0, 9).toString();
    }
    function randomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return code;
}
