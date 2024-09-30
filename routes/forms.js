const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const FormController = require('../controllers/contactFormController'); // Correct path to controller

// POST route for form submissions
router.post(
  '/',
  // Add validation rules here
  [
    // These are basic validation rules; adjust them based on your form fields
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').not().isEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    // Add additional checks for other fields if necessary
  ],
  async (req, res) => {
    // Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation fails, send errors back as a response
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Use the unified form submission function for all form types
      await FormController.submitForm(req, res);
    } catch (error) {
      console.error('Error in form submission:', error); // Logs the error in the console
      res.status(500).json({ message: 'Error handling form submission', error: error.message || error });
    }
  }
);

module.exports = router;
