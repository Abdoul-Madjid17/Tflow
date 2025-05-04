import express from 'express';
import { 
  getTasks, 
  getTask, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController.js';

const router = express.Router();

// GET /api/tasks
router.get('/', getTasks);

// GET /api/tasks/:id
router.get('/:id', getTask);

// POST /api/tasks
router.post('/', createTask);

// PUT /api/tasks/:id
router.put('/:id', updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;