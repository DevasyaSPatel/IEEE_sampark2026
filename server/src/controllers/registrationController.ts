
import { Request, Response } from 'express';
import { GoogleSheetService } from '../../../src/lib/googleSheets/service';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const formData = req.body;

        // Validation (Basic)
        if (!formData.email || !formData.name) {
            res.status(400).json({ message: "Email and Name are required" });
            return;
        }

        // Call Service
        const result = await GoogleSheetService.appendUserRegistration(formData);

        if (result) {
            // Success
            res.status(200).json({
                success: true,
                message: "Registration submitted! Please wait for admin approval to receive your credentials.",
                // username: result.username // Do not return creds immediately if approval needed
            });
        } else {
            res.status(500).json({ message: "Failed to register user (Service Error)" });
        }

    } catch (error: any) {
        console.error("Registration Controller Error:", error);
        res.status(500).json({
            message: `Registration failed: ${error.message || 'Unknown error'}`
        });
    }
};
