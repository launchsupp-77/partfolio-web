# Contact Form Setup Guide

This guide explains how to set up the contact form to actually send emails and WhatsApp messages.

## Option 1: PHP Backend (Recommended for shared hosting)

### Setup Steps:
1. **Upload files** to your web server with PHP support
2. **Configure email settings** in `contact-handler.php`
3. **Test the form** - it will send emails to `supplaunch@gmail.com`

### Files needed:
- `contact-handler.php` - Handles form submissions
- `index.html` - Your portfolio
- `script.js` - Form handling
- `style.css` - Styling

### How it works:
- Form submits to `contact-handler.php`
- PHP script sends email to your inbox
- Logs submissions to `contact_log.txt`
- Returns success/error response

## Option 2: Node.js Backend (For VPS/Cloud)

### Setup Steps:
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure email in `server.js`:**
   - Update email credentials
   - Set up Gmail App Password

3. **Start server:**
   ```bash
   npm start
   ```

4. **Update JavaScript:**
   - Change API endpoint to your server URL

### Environment Variables:
```bash
EMAIL_USER=supplaunch@gmail.com
EMAIL_PASS=your_app_password
PORT=3000
```

## Option 3: EmailJS (No backend needed)

### Setup Steps:
1. **Sign up** at [EmailJS.com](https://www.emailjs.com)
2. **Create email service** (Gmail, Outlook, etc.)
3. **Create email template**
4. **Update JavaScript** with your credentials:

```javascript
const serviceID = 'your_service_id';
const templateID = 'your_template_id';
const publicKey = 'your_public_key';
```

## Option 4: Third-party Services

### Formspree:
1. Sign up at [Formspree.io](https://formspree.io)
2. Create form endpoint
3. Update form action in HTML

### Netlify Forms:
1. Deploy to Netlify
2. Add `netlify` attribute to form
3. Forms automatically handled

## WhatsApp Integration

### Current Setup:
- Form opens WhatsApp with pre-filled message
- Direct link to your WhatsApp: `+966 504877945`

### Advanced WhatsApp (Business API):
1. **Get WhatsApp Business API** access
2. **Set up webhook** endpoint
3. **Update JavaScript** with API credentials

## Testing Your Form

### Local Testing:
1. **Open `index.html`** in browser
2. **Fill out contact form**
3. **Submit form** - check console for errors
4. **Verify email** received

### Production Testing:
1. **Deploy to web server**
2. **Test form submission**
3. **Check email inbox**
4. **Verify WhatsApp link**

## Troubleshooting

### Common Issues:
- **CORS errors** - Make sure server allows cross-origin requests
- **Email not sending** - Check email credentials and server configuration
- **Form not submitting** - Check JavaScript console for errors
- **WhatsApp not opening** - Verify phone number format

### Debug Steps:
1. **Check browser console** for JavaScript errors
2. **Check server logs** for backend errors
3. **Test email credentials** separately
4. **Verify form validation** is working

## Security Considerations

### Important:
- **Validate all inputs** on server side
- **Sanitize data** before sending emails
- **Use HTTPS** in production
- **Rate limit** form submissions
- **Protect against spam**

### Recommended:
- Add CAPTCHA to form
- Implement rate limiting
- Use environment variables for credentials
- Log all submissions for monitoring

## Support

If you need help setting up the form:
1. Check the console for errors
2. Verify server configuration
3. Test email credentials
4. Contact for assistance

---

**Note:** The form is currently configured to work with the PHP backend. Make sure your web server supports PHP and has mail() function enabled.
