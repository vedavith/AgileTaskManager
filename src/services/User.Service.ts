import UserModel from "../models/User.Model";
import UserRepository from "../repository/User.Repository";
import ValidationError from "../errors/Validation.Error";

class UserService {
  private users: UserModel[] = [];

  async createUser(user: UserModel): Promise<UserModel> {
    this.validateUser(user);
    if (this.isDuplicateEmail(user.email)) {
      throw new ValidationError('Email is already in use');
    }
    UserRepository.create(user);
    return user;
  }

  async getAllUsers(): Promise<UserModel[]> {
    return UserRepository.findAll();
  }

  async getUserById(id: string): Promise<UserModel | undefined> {
    return UserRepository.findByID(id);
  }

  async updateUser(id: string, updatedUser: UserModel): Promise<UserModel | null> {
    this.validateUser(updatedUser);
    return UserRepository.update(id, updatedUser);
  }

  async deleteUser(id: string): Promise<UserModel | null> {
        return UserRepository.delete(id);
  }

  private isDuplicateEmail(email: string, excludeId?: string): boolean {
    const users = UserRepository.findAll();
    return users.some(user => 
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