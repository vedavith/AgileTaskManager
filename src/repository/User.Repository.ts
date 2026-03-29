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

    update(id: string, safeUpdate: Partial<UserModel>) {
        const index = this.users.findIndex(user => user.id === id);

        if (index === -1) {
            return null;
        }

        let existingUser = this.users[index];
        const updatedUser = {
            ...existingUser,
            ...safeUpdate,
            updatedAt: new Date().toISOString()
        };

        this.users[index] = updatedUser;
        return updatedUser;
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