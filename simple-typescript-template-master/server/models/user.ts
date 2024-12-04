type Role = "user" | "moderator" | "admin"

export class User {
    private userId: number;
    private username:string;
    private password:string;
    private role: Role

    constructor(userId: number, username: string, password: string, role: Role) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.role = role;
    }
    public get getUsername():string{
        return this.username
    }
    
    public get getUserId():number{
        return this.userId
    }
}