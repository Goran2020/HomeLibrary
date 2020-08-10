export class LoginInfoUserDto {
    userId: number;
    username: string;
    token: string;

    constructor(id: number, un: string, token: string) {
        this.userId = id;
        this.username = un;
        this.token = token;
    }
  
}