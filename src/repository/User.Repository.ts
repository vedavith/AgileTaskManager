import UserModel from "../models/User.Model";

class UserRepository {
    private users: UserModel[] = [];

    create(user: UserModel) {
        this.users.push(user);
    }

    findAll(includeDeleted: boolean): UserModel[] {
        const users = includeDeleted
            ? this.users
            : this.users.filter(user => !user.isDeleted);

        return [...users];
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

    softDelete(id: string) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            const user = this.users[index];
            this.users[index] = {
                ...user,
                isDeleted: true,
                deletedAt: new Date().toISOString()
            };

            return this.users[index];
        }
        return null;
    }

    hardDelete(id: string) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
        return null;
    }
}

export default new UserRepository();