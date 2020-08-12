export class LoginInfoUserDto {
    userId: number;
    username: string;
    token: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;

    constructor(id: number, un: string, token: string, rt: string, rte: string) {
        this.userId = id;
        this.username = un;
        this.token = token;
        this.refreshToken = rt;
        this.refreshTokenExpiresAt = rte;
    }
  
}