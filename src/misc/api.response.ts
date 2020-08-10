export class ApiResponse {
    status: string;
    statusCode: number;
    message: string | null;

    constructor(status: string, sc: number, msg: string | null = null) {
        this.status = status;
        this.statusCode = sc;
        this.message = msg;
    }
}