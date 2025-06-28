const Task = require('../models/Task');

const taskController = {
    addTask: async (req, res) => {
        const { title, description } = req.body;
        try {
            console.log('req.body:', req.body);
            console.log('req.user:', req.user);
            if (!req.user.id) {
                return res.status(401).json({ message: 'Foydalanuvchi ID topilmadi' });
            }
            const task = new Task({
                title,
                description,
                userId: req.user.id,
            });
            await task.save();
            res.status(201).json(task);
        } catch (err) {
            console.error('AddTask xatosi:', err);
            res.status(500).json({ message: 'Task qo‘shishda xatolik', error: err.message });
        }
    },

    updateTask: async (req, res) => {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        try {
            const task = await Task.findOneAndUpdate(
                { _id: id, userId: req.user.id }, // req.user.userId → req.user.id
                { title, description, completed },
                { new: true }
            );
            if (!task) {
                return res.status(404).json({ message: 'Task topilmadi yoki sizga tegishli emas' });
            }
            res.json(task);
        } catch (err) {
            console.error('UpdateTask xatosi:', err);
            res.status(500).json({ message: 'Task yangilashda xatolik', error: err.message });
        }
    },

    deleteTask: async (req, res) => {
        const { id } = req.params;
        try {
            const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id }); // req.user.userId → req.user.id
            if (!task) {
                return res.status(404).json({ message: 'Task topilmadi yoki sizga tegishli emas' });
            }
            res.json({ message: 'Task o‘chirildi' });
        } catch (err) {
            console.error('DeleteTask xatosi:', err);
            res.status(500).json({ message: 'Task o‘chirishda xatolik', error: err.message });
        }
    },

    showOneTask: async (req, res) => {
        const { id } = req.params;
        try {
            const task = await Task.findOne({ _id: id, userId: req.user.id }); // req.user.userId → req.user.id
            if (!task) {
                return res.status(404).json({ message: 'Task topilmadi yoki sizga tegishli emas' });
            }
            res.json(task);
        } catch (err) {
            console.error('ShowOneTask xatosi:', err);
            res.status(500).json({ message: 'Taskni ko‘rishda xatolik', error: err.message });
        }
    },

    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.find({ userId: req.user.id }); // req.user.userId → req.user.id
            res.json(tasks);
        } catch (err) {
            console.error('GetAllTasks xatosi:', err);
            res.status(500).json({ message: 'Tasklarni olishda xatolik', error: err.message });
        }
    },

}
module.exports = taskController