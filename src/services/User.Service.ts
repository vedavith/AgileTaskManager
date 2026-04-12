import UserModel from "../models/User.Model";
import UserRepository from "../repository/User.Repository";
import ValidationError from "../errors/Validation.Error";

class UserService {
  async createUser(user: UserModel): Promise<UserModel> {
    this.validateUser(user, false);
    if (this.isDuplicateEmail(user.email)) {
      throw new ValidationError('Email is already in use');
    }
    UserRepository.create(user);
    return user;
  }

  async getAllUsers(includeDeleted: boolean): Promise<UserModel[]> {
    return UserRepository.findAll(includeDeleted);
  }

  async getUserById(id: string): Promise<UserModel | undefined> {
    return UserRepository.findByID(id);
  }

  async deleteUser(id: string): Promise<UserModel | null> {
    const user = UserRepository.findByID(id);
    if (!user) {
      return null;
    }

    if (user.isDeleted) {
      return user;
    }

    return UserRepository.softDelete(id);
  }

  async permanentlyDeleteUser(id: string): Promise<UserModel | null> {
    const user = UserRepository.findByID(id);

    if (!user) return null;

    if (!user.isDeleted) {
      throw new Error("User must be soft deleted before permanent deletion");
    }

    return UserRepository.hardDelete(id);
  }

  async restoreUser(id: string): Promise<UserModel | null> {
    const user = UserRepository.findByID(id); // include deleted

    if (!user) {
      return null;
    }

    if (!user.isDeleted) {
      throw new Error("User is already active");
    }

    return UserRepository.restore(id);
  }

  async updateUser(id: string, updatedUser: any): Promise<UserModel | null> {
    const safeUpdate: any = {};

    if (this.isDuplicateEmail(updatedUser.email)) {
      throw new ValidationError('Email is already in use');
    }

    // whitelist fields
    if (updatedUser.name !== undefined) safeUpdate.name = updatedUser.name;
    if (updatedUser.email !== undefined && this.isDuplicateEmail(updatedUser.email)) safeUpdate.email = updatedUser.email;
    if (updatedUser.password !== undefined) safeUpdate.password = updatedUser.password;
    this.validateUser(safeUpdate, true);
    return UserRepository.update(id, safeUpdate);
  }

  private isDuplicateEmail(email: string, excludeId?: string): boolean {
    const users = UserRepository.findAll(false);
    return users.some(user =>
        user.email === email && (!excludeId || user.id !== excludeId)
    );
  }

  private validateUser(user: any, isUpdate: boolean = false): void {

    // ID validation (only for create)
    if (!isUpdate && (!user.id || typeof user.id !== 'string')) {
      throw new ValidationError('ID is required and must be a string');
    }

    // Name validation
    if (!isUpdate || user.name !== undefined) {
      if (!user.name || typeof user.name !== 'string') {
        throw new ValidationError('Name must be a valid string');
      }
    }

    // Email validation
    if (!isUpdate || user.email !== undefined) {
      if (!user.email || typeof user.email !== 'string') {
        throw new ValidationError('Email must be a valid string');
      }

      if (!this.isValidEmail(user.email)) {
        throw new ValidationError('Email format is invalid');
      }
    }

    // Password validation
    if (!isUpdate || user.password !== undefined) {
      if (!user.password || typeof user.password !== 'string') {
        throw new ValidationError('Password must be a string');
      }

      if (user.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default new UserService();