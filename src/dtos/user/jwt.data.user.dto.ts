export class JwtDataUserDto {
    userId: number;
    username: string;
    exp: number;
    ip: string;
    ua: string;

    toPlainObject() {
        return  {
            userId: this.userId,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua,
        }
    }
}