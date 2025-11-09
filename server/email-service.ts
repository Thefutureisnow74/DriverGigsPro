import axios from 'axios';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'DriverGigsPro <no-reply@drivergigspro.com>' }: SendEmailOptions) {
  if (!process.env.SENDFOX_API_KEY) {
    console.log('SendFox API key not configured, skipping email send');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    // SendFox API endpoint for sending emails
    const response = await axios.post('https://api.sendfox.com/contacts', {
      email: to,
      first_name: to.split('@')[0], // Use email prefix as first name
      lists: [process.env.SENDFOX_LIST_ID || ''], // You'll need a list ID
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SENDFOX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Note: SendFox focuses on list building rather than transactional emails
    // For welcome emails, you'd typically set up an automation in SendFox dashboard
    console.log(`Contact added to SendFox successfully: ${to}`);
    return { success: true, message: 'Subscriber added to SendFox list' };
  } catch (error) {
    console.error('SendFox API error:', error);
    return { success: false, message: 'Failed to add to SendFox', error };
  }
}

// Email templates for different platforms
export const getWelcomeEmailTemplate = (platform: string, email: string) => {
  const platformMessages = {
    'looking-for-drivers': {
      title: 'Looking for Drivers',
      description: 'Connect with qualified drivers instantly',
      benefits: [
        'Access our database of CDL and non-CDL drivers',
        'Pre-screened drivers ready for delivery, logistics, and transportation',
        'Streamlined hiring process',
        'Real-time driver availability'
      ]
    },
    'cdl-driver-gigs': {
      title: 'CDL Driver Gigs',
      description: 'Premium commercial driving opportunities',
      benefits: [
        'High-paying CDL positions',
        'Long-haul and local routes',
        'Benefits and insurance options',
        'Career advancement opportunities'
      ]
    },
    'gigspro-ai': {
      title: 'GigsProAI',
      description: 'AI-powered non-driving gig opportunities',
      benefits: [
        'Remote work opportunities',
        'Flexible scheduling',
        'AI-matched job recommendations',
        'Diverse income streams beyond driving'
      ]
    }
  };

  const platformData = platformMessages[platform as keyof typeof platformMessages] || platformMessages['looking-for-drivers'];

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${platformData.title} Waitlist</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .benefits { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .benefit-item { margin: 10px 0; padding: 5px 0; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .highlight { color: #667eea; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🚀 Welcome to ${platformData.title}!</h1>
        <p>You're now on our exclusive waitlist</p>
      </div>
      
      <div class="content">
        <h2>Hey there, future success story! 👋</h2>
        
        <p>Thanks for joining the <span class="highlight">${platformData.title}</span> waitlist! You've just taken the first step toward ${platformData.description.toLowerCase()}.</p>
        
        <div class="benefits">
          <h3>🎯 What you can expect:</h3>
          ${platformData.benefits.map(benefit => `<div class="benefit-item">✅ ${benefit}</div>`).join('')}
        </div>
        
        <p><strong>Your waitlist position:</strong> You're one of our early supporters, and we'll notify you as soon as ${platformData.title} launches!</p>
        
        <p>In the meantime, if you need immediate access to gig opportunities, check out <a href="https://drivergigspro.com" class="highlight">DriverGigsPro</a> - our flagship platform that's ready now with 449+ verified courier companies.</p>
        
        <div style="text-align: center;">
          <a href="https://drivergigspro.com" class="cta-button">Explore DriverGigsPro Now</a>
        </div>
        
        <p>Stay tuned for updates, and thanks for being part of our journey!</p>
        
        <p>Best regards,<br>
        <strong>The DriverGigsPro Team</strong></p>
      </div>
      
      <div class="footer">
        <p>You're receiving this because you signed up for the ${platformData.title} waitlist.</p>
        <p>© 2025 DriverGigsPro. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};