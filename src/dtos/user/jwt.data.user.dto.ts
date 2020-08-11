export class JwtDataUserDto {
    role: "user";
    userId: number;
    username: string;
    exp: number;
    ip: string;
    ua: string;

    toPlainObject() {
        return  {
            role: this.role,
            userId: this.userId,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua,
        }
    }
}