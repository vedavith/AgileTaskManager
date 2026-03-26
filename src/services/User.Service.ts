import UserModel from "../models/User.Model";
import ValidationError from "../errors/Validation.Error";

class UserService {
  private users: UserModel[] = [];

  async createUser(user: UserModel): Promise<UserModel> {
    this.validateUser(user);
    if (this.isDuplicateEmail(user.email)) {
      throw new ValidationError('Email is already in use');
    }
    this.users.push(user);
    return user;
  }

  async getUserById(id: string): Promise<UserModel | undefined> {
    return this.users.find(user => user.id === id);
  }

  async updateUser(id: string, updatedUser: UserModel): Promise<UserModel | null> {
    this.validateUser(updatedUser);
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }
    return null;
  }

  async deleteUser(id: string): Promise<UserModel | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
    return null;
  }

  private isDuplicateEmail(email: string, excludeId?: string): boolean {
    return this.users.some(user => 
      user.email === email && (!excludeId || user.id !== excludeId)
    );
  }

  private validateUser(user: UserModel): void {
    if (!user.id || typeof user.id !== 'string') {
      throw new ValidationError('ID is required and must be a string');
    }

    if (!user.name || typeof user.name !== 'string') {
      throw new ValidationError('Name is required and must be a string');
    }

    if (!user.email || typeof user.email !== 'string') {
      throw new ValidationError('Email is required and must be a string');
    }

    if (!this.isValidEmail(user.email)) {
      throw new ValidationError('Email format is invalid');
    }

    if (!user.password || typeof user.password !== 'string') {
      throw new ValidationError('Password is required and must be a string');
    }

    if (user.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default new UserService();