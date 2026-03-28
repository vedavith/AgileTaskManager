
class UserModel {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string | undefined;

    constructor(id: string, name: string, email: string, password: string, createdAt?: string, updatedAt?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = new Date().toISOString();
        this.updatedAt = updatedAt;
    }
}

export default UserModel;