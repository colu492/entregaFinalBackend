import UserService from "../services/usersService.js";
import userModel from "../models/user.model.js";
import emailConfig from "../config/emailConfig.js";
import dotenv from 'dotenv';
dotenv.config()

// Instancia del servicio de usuario
const usersService = new UserService()


const UsersController = {

  // Mostrar el formulario de documentos del usuario
  async formDocs(req, res) {
    try {
      const { user } = req.session;
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.render('accountInfo', { user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Subir documentos del usuario
  async envDocs(req, res) {
    try {
      const user = await usersService.uploadDocuments(req.params.uid, req.files);
      res.status(200).json({ message: 'Documentos subidos correctamente', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Cambiar el rol del usuario a premium
  async changeRole(req, res) {
    try {
      const user = await usersService.changeUserRole(req.params.uid);
      res.status(200).json({ message: 'Usuario actualizado a premium', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  // Obtener la lista de usuarios y renderizar la vista
  async usersList(req, res) {
    try {
      const users = await usersService.getUsersList();
      res.render('usersList', { users });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Eliminar usuarios inactivos
  async deleteIna(req, res) {
    try {
      await usersService.deleteInactiveUsers();
      res.status(200).json({ message: 'Usuarios inactivos eliminados correctamente' });
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },


  // Cambiar manualmente el rol de un usuario
  async manualChangeRole(req, res) {
    try {
      const { userId } = req.params;
      const { newRole } = req.body

      await usersService.manualChangeRole(userId, newRole);
      res.json({ success: true, message: 'Rol cambiado con éxito' });
    } catch (error) {
      console.error('Error al cambiar el rol:', error);
      res.json({ success: false, message: 'Error al cambiar el rol' });
    }
  },

  // Eliminar manualmente un usuario
  async manualDeleteUser(req, res) {
    try {
      const { userId } = req.params;

      await usersService.manualDeleteUser(userId);
      res.json({ success: true, message: 'Usuario eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.json({ success: false, message: 'Error al eliminar el usuario' });
    }
  },
};


export default UsersController;