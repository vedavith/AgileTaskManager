
class UserModel {
    id: string;
    name: string;
    email: string;
    password: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string | undefined;
    deletedAt: string | null | undefined;

    constructor(
        id: string,
        name: string,
        email: string,
        password: string,
        isDeleted: boolean = false,
        createdAt?: string,
        updatedAt?: string,
        deletedAt?: string | null) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.isDeleted = isDeleted;
        this.createdAt = new Date().toISOString();
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}

export default UserModel;