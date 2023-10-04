import UserManager from "../dao/usersManager.js";

class UserService {
    constructor() {
        this.userManager = new UserManager();
    }

    // Obtener un usuario por su ID
    async getUserById(uid) {
        try {
            return await this.userManager.getUserById(uid);
        } catch (error) {
            throw error;
        }
    }

    // Subir documentos asociados a un usuario
    async uploadDocuments(uid, files) {
        try {
            return await this.userManager.uploadDocuments(uid, files);
        } catch (error) {
            throw error;
        }
    }

    // Cambiar el rol de un usuario
    async changeUserRole(uid) {
        try {
            return await this.userManager.changeUserRole(uid);
        } catch (error) {
            throw error;
        }
    }

    // Obtener la lista de usuarios
    async getUsersList() {
        try {
            return await this.userManager.getUsersList();
        } catch (error) {
            throw error;
        }
    }

    // Eliminar usuarios inactivos
    async deleteInactiveUsers() {
        try {
            return await this.userManager.deleteInactiveUsers();
        } catch (error) {
            throw error;
        }
    }

    // Cambiar manualmente el rol de un usuario
    async manualChangeRole(userId, newRole) {
        try {
            return await this.userManager.manualChangeRole(userId, newRole);
        } catch (error) {
            throw error;
        }
    }

    // Eliminar manualmente a un usuario
    async manualDeleteUser(userId) {
        try {
            return await this.userManager.manualDeleteUser(userId);
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;