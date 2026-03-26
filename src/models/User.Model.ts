
class UserModel {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;

    constructor(id: string, name: string, email: string, password: string, createdAt?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = new Date().toISOString();
        
    }
}

export default UserModel;