import UserModel from "../models/User.Model";

class UserRepository {
    private users: UserModel[] = [];

    create(user: UserModel) {
        this.users.push(user);
    }

    findAll() {
        return this.users;
    }

    findByID(id: string) {
        return this.users.find(user => user.id === id);
    }

    findByEmail(email: string) {
        return this.users.find(user => user.email === email);
    }

    update(id: string, updatedUser: any) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updatedUser };
            return this.users[index];
        }
        return null;
    }

    delete(id: string) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
        return null;
    }
}

export default new UserRepository();