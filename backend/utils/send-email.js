import juice from 'juice';
import path from 'node:path';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import { convert } from 'html-to-text';
import { fileURLToPath } from 'node:url';
import { createChild } from '#utils/logger.js';
import { getTransporter } from '#helpers/email-transport.js';

const logger = createChild({ service: 'email' });
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, 'templates');

export const sendEmail = async (email, subject, payload, templateName) => {
  try {
    const templatePath = path.join(templatesDir, templateName);

    const sourceDir = await fs.readFile(templatePath, 'utf8');
    const compiledTemplate = Handlebars.compile(sourceDir);
    // 1. Generate HTML with data
    let html = compiledTemplate(payload);

    // 2. Inline CSS (Crucial for Gmail/Outlook)
    html = juice(html);

    // 3. Generate Plain Text (Crucial for Spam filters)
    const text = convert(html, {
      wordwrap: 130,
      selectors: [
        { selector: 'h1', options: { uppercase: false } },
        { selector: 'h2', options: { uppercase: false } },
        { selector: 'h3', options: { uppercase: false } },
        {
          selector: 'a',
          options: { linkBrackets: false }, //removes [ ] around URL
        },
      ],
    });

    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: subject,
      html: html,
      text: text,
    };

    const transporter = getTransporter();
    await transporter.sendMail(emailOptions);
  } catch (error) {
    logger.error(`email error: ${error.message}`);
  }
};
