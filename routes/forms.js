const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const FormController = require('../controllers/contactFormController'); // Correct path to controller

// POST route for form submissions
router.post(
  '/',
  // Add validation rules here
  [
    // General validation
    check('firstName').not().isEmpty().withMessage('First name is required'),
    check('lastName').not().isEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('formType').not().isEmpty().withMessage('Form type is required'),
    check('formType').custom(value => {
      const validTypes = ['advertise', 'distribute', 'contact'];
      if (!validTypes.includes(value)) {
        throw new Error('Invalid form type');
      }
      return true;
    }),

    // Advertise-specific fields validation
    check('companyName').if(check('formType').equals('advertise')).not().isEmpty().withMessage('Company name is required for advertise form'),
    check('typeOfBusiness').if(check('formType').equals('advertise')).not().isEmpty().withMessage('Type of business is required for advertise form'),
    check('budget').if(check('formType').equals('advertise')).not().isEmpty().withMessage('Budget is required for advertise form'),

    // Distribute-specific fields validation
    check('distributionPoint').if(check('formType').equals('distribute')).not().isEmpty().withMessage('Distribution Point is required for distribute form'),
    check('beveragesPerMonth').if(check('formType').equals('distribute')).not().isEmpty().withMessage('Beverages per Month is required for distribute form'),

    // Contact-specific fields validation
    check('subject').if(check('formType').equals('contact')).not().isEmpty().withMessage('Subject is required for contact form'),
    check('message').if(check('formType').equals('contact')).not().isEmpty().withMessage('Message is required for contact form'),
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
