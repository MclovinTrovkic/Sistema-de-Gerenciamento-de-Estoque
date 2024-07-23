const jwt = require('jsonwebtoken');
const { secretKey } = require('../config');
const bcrypt = require('bcryptjs');

// Função não esquecer de ver se vai dar bom
exports.generateToken = (payload) => {
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};


exports.comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};