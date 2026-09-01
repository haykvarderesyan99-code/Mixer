export class BcryptService {
    constructor(bcrypt) {
        this.bcrypt = bcrypt;
    }
    async hash(password) {
        return await this.bcrypt.hash(password, 10);
    }

    async compare(password, enteredPassword) {
        return await this.bcrypt.compare(password, enteredPassword);
    }
}
