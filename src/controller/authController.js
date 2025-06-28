const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    signup: async (req, res) => {
        try {
            const { username, surname, email, password, role } = req.body;

            if (!username || !surname || !email || !password) {
                return res.status(400).json({ message: "Barcha qatorlarni to‘ldiring" });
            }

            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(403).json({ message: "Bu email allaqachon mavjud" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                surname,
                email,
                password: hashedPassword,
                role: role || 100
            });

            await newUser.save();

            const { password: _, ...userData } = newUser._doc;

            if (!process.env.JWT_SECRET_KEY) {
                return res.status(500).json({ message: "JWT secret key is not configured" });
            }

            const token = JWT.sign(
                { id: newUser._id, role: newUser.role },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '12h' }
            );

            res.status(201).json({
                message: "Ro‘yxatdan o‘tish muvaffaqiyatli",
                user: userData,
                token
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Hamma qatorlarni to‘ldiring" });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "Email topilmadi" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Parol noto‘g‘ri" });
            }

            const { password: _, ...userData } = user._doc;

            if (!process.env.JWT_SECRET_KEY) {
                return res.status(500).json({ message: "JWT secret key is not configured" });
            }

            const token = JWT.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '12h' }
            );

            res.status(200).json({
                message: "Login muvaffaqiyatli",
                user: userData,
                token
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },

    updateUser :async (req, res) => {
        try {
            const { username, surname, email, password } = req.body;
            const userId = req.user.id;

            if (!username && !surname && !email && !password) {
                return res.status(400).json({ message: "Hech bo‘lmaganda bitta maydonni yangilang" });
            }

            const updateData = {};
            if (username) updateData.username = username;
            if (surname) updateData.surname = surname;
            if (email) {
                const emailExists = await User.findOne({ email, _id: { $ne: userId } });
                if (emailExists) {
                    return res.status(403).json({ message: "Bu email allaqachon mavjud" });
                }
                updateData.email = email;
            }
            if (password) updateData.password = await bcrypt.hash(password, 12);

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
            }

            const { password: _, ...userData } = updatedUser._doc;

            const token = JWT.sign(
                { id: updatedUser._id, role: updatedUser.role },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '12h' }
            );

            res.status(200).json({
                message: "Foydalanuvchi ma'lumotlari yangilandi",
                user: userData,
                token
            });
        } catch (error) {
            console.error('UpdateUser xatosi:', error);
            res.status(500).json({
                message: 'Foydalanuvchi ma\'lumotlarini yangilashda xatolik',
                error: error.message
            });
        }
    },

}

module.exports = authController;