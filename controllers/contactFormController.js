const nodemailer = require('nodemailer');
const UnifiedForm = require('../models/unifiedForm');

// Unified form submission function
exports.submitForm = async (req, res) => {
  try {
    const formType = req.body.formType;

    // Prepare the form data to save in the database
    const formData = {
      formType: formType,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      city: req.body.city,
      companyName: req.body.companyName,
      typeOfBusiness: req.body.typeOfBusiness,
      budget: req.body.budget,
      advertiseMessage: req.body.advertiseMessage,
      distributionPoint: req.body.distributionPoint,
      shippingAddress: req.body.shippingAddress,
      footTraffic: req.body.footTraffic,
      ageRange: req.body.ageRange,
      beveragesPerMonth: req.body.beveragesPerMonth,
      reason: req.body.reason,
      subject: req.body.subject,
      message: req.body.message,
      isForEvent: req.body.isForEvent || false,
      agreeToShare: req.body.agreeToShare || false
    };

    // Validation for advertise form
    if (formType === 'advertise' && (!req.body.companyName || !req.body.typeOfBusiness || !req.body.budget)) {
      return res.status(400).json({ message: 'Company Name, Type of Business, and Budget are required for advertisement form.' });
    }

    // Validation for distribute form
    if (formType === 'distribute' && (!req.body.distributionPoint || !req.body.beveragesPerMonth)) {
      return res.status(400).json({ message: 'Distribution Point and Beverages Per Month are required for distribute form.' });
    }

    // Validation for contact form
    if (formType === 'contact' && (!req.body.subject || !req.body.message)) {
      return res.status(400).json({ message: 'Subject and Message are required for the contact form.' });
    }

    // Save form data to MongoDB
    const newForm = new UnifiedForm(formData);
    await newForm.save();

    // Nodemailer setup to send notification emails
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configure email details with form data
    let emailBody = `Thank you ${req.body.firstName} ${req.body.lastName}, your ${formType} form has been submitted successfully!\n\nHere are the details you submitted:\n`;

    // Include submitted form data in the email body based on form type
    if (formType === 'advertise') {
      emailBody += `
      - First Name: ${req.body.firstName}
      - Last Name: ${req.body.lastName}
      - Email: ${req.body.email}
      - Phone Number: ${req.body.phoneNumber}
      - Company Name: ${req.body.companyName}
      - Type of Business: ${req.body.typeOfBusiness}
      - Budget: ${req.body.budget}
      - Advertise Message: ${req.body.advertiseMessage}`;
    } else if (formType === 'distribute') {
      emailBody += `
      - First Name: ${req.body.firstName}
      - Last Name: ${req.body.lastName}
      - Email: ${req.body.email}
      - Phone Number: ${req.body.phoneNumber}
      - Distribution Point: ${req.body.distributionPoint}
      - Shipping Address: ${req.body.shippingAddress}
      - Foot Traffic: ${req.body.footTraffic}
      - Age Range: ${req.body.ageRange}
      - Company Name: ${req.body.companyName}
      - Type of Business: ${req.body.typeOfBusiness}
      - Beverages per Month: ${req.body.beveragesPerMonth}`;
    } else if (formType === 'contact') {
      emailBody += `
      - First Name: ${req.body.firstName}
      - Last Name: ${req.body.lastName}
      - Email: ${req.body.email}
      - Phone Number: ${req.body.phoneNumber}
      - Subject: ${req.body.subject}
      - Message: ${req.body.message}`;
    }

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email, // Send confirmation to the user
      subject: `Form Submission Confirmation - ${formType}`,
      text: emailBody
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Only send the response after the email has been successfully sent
    res.status(201).json({ message: 'Form submitted and email sent successfully!' });
  } catch (error) {
    // Handle error while sending email or submitting the form
    console.error('Error during form submission or email sending:', error);
    res.status(500).json({ message: 'Failed to submit form or send email', error });
  }
};
