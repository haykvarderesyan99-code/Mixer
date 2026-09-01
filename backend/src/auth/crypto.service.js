export class CryptoService {
    constructor(crypto) {
        this.crypto = crypto;
    }

    async createOTP() {
        return String(this.crypto.randomInt(0, 1_000_000)).padStart(6, "0");
    }
}
