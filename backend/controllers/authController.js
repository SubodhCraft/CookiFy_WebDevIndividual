const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { sendPasswordResetEmail } = require('../services/emailService');

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || 'cookify_secret_key_2024',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const register = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            });
        }

        const user = await User.create({
            username,
            email,
            password,
            fullName
        });

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to CookiFy!',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);

        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            message: 'Login successful! Welcome back!',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user.getPublicProfile()
        });
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user information',
            error: error.message
        });
    }
};

const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const imagePath = `/uploads/profiles/${req.file.filename}`;
        user.profilePicture = imagePath;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated!',
            data: user.getPublicProfile()
        });
    } catch (error) {
        console.error('Update Profile Picture Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile picture',
            error: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Please provide your email address' });
        }

        const user = await User.findOne({ where: { email } });

        // For security, do not reveal if a user exists or not, 
        // BUT we need to handle the case where we actually attempt to send an email.
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account with that email exists, a reset link has been sent.'
            });
        }

        // Generate raw token and its hashed version
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = expires;

        // Save token without triggering password hashing/validation hooks
        await user.save({ validate: false });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

        // Check if email credentials are configured
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        const emailConfigured = emailUser && emailPass;

        if (emailConfigured) {
            try {
                // Send the actual email
                await sendPasswordResetEmail(user.email, resetUrl, user.fullName || user.username);

                return res.status(200).json({
                    success: true,
                    message: 'A password reset link has been sent to your actual email address.'
                });
            } catch (emailError) {
                console.error('❌ Failed to send email via Nodemailer:', emailError.message);
                return res.status(500).json({
                    success: false,
                    message: 'Email delivery failed. Please check backend logs or try again later.'
                });
            }
        } else {
            // Critical fallback for the user: specifically tell them what is missing in the console
            console.log('\n--- EMAIL SERVICE CONFIGURATION MISSING ---');
            if (!emailUser) console.log('❌ process.env.EMAIL_USER is undefined');
            if (!emailPass) console.log('❌ process.env.EMAIL_PASS is undefined');
            console.log('🔗 Link produced anyway (Dev mode):', resetUrl);
            console.log('-------------------------------------------\n');

            return res.status(200).json({
                success: true,
                message: 'Email configuration missing on server. Link logged to console.',
                devResetLink: process.env.NODE_ENV === 'development' ? resetUrl : undefined
            });
        }
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Could not process password reset. Please try again.',
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Hash the incoming raw token to compare with the stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: { [Op.gt]: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Reset link is invalid or has expired. Please request a new one.'
            });
        }

        // Update password and clear reset token fields
        console.log(`[AuthCtrl] Resetting password for: ${user.email}`);
        user.set('password', password);
        console.log(`[AuthCtrl] Password changed status (reset): ${user.changed('password')}`);

        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save();
        console.log(`[AuthCtrl] Password reset and saved successfully for: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully! You can now sign in with your new password.'
        });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Password reset failed. Please try again.',
            error: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Both current and new passwords are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            console.log('Change Password: User not found', userId);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('Change Password: Found user', user.email);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            console.log('Change Password: Current password mismatch for', user.email);
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password explicitly
        console.log(`[AuthCtrl] Attempting password update for: ${user.email}`);
        user.set('password', newPassword);
        console.log(`[AuthCtrl] Password changed status: ${user.changed('password')}`);

        await user.save();
        console.log(`[AuthCtrl] Password saved successfully for: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully!'
        });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update password',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    updateProfilePicture,
    forgotPassword,
    resetPassword,
    changePassword
};
