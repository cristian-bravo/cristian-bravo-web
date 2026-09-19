import assert from 'node:assert/strict';
import test from 'node:test';

const environmentKeys = [
  'NODE_ENV',
  'EMAIL_TEST_TRANSPORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_TO',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
];

const restoreEnvironment = (previous) => {
  for (const key of environmentKeys) {
    const value = previous.get(key);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
};

const rawMessage = (delivery) => {
  assert.ok(Buffer.isBuffer(delivery.message), 'the stream transport must retain the MIME message in memory');
  return delivery.message.toString('utf8');
};

test('offline mail fixture preserves a safe envelope and never uses the network', async () => {
  const previous = new Map(environmentKeys.map((key) => [key, process.env[key]]));

  try {
    // These process-level keys take precedence over .env/.env.local when the
    // module loads, so no local credentials can be read by this fixture.
    Object.assign(process.env, {
      NODE_ENV: 'test',
      EMAIL_TEST_TRANSPORT: 'stream',
      EMAIL_USER: 'mailer-fixture@example.invalid',
      EMAIL_PASS: 'test-only-password',
      EMAIL_TO: 'recipient-fixture@example.invalid',
      SMTP_HOST: '',
      SMTP_PORT: '',
      SMTP_SECURE: '',
    });

    const { getSmtpErrorMessage, sendProjectEmail, sendSimpleEmail, verifySmtpTransport } = await import(
      '../src/server/email/sendEmail.ts'
    );

    // A stream transport has no remote server by design. Nodemailer therefore
    // returns false from verify(), which proves this fixture cannot connect out.
    assert.equal(await verifySmtpTransport(), false);

    const simpleDelivery = await sendSimpleEmail({
      from_name: 'Ada <script>alert(1)</script>',
      reply_to: 'reply-simple@example.invalid',
      message: 'Hello <script>alert(1)</script>',
      consultationType: 'Website',
      contact: '+593 99 123 4567',
    });
    const simpleRaw = rawMessage(simpleDelivery);

    assert.deepEqual(simpleDelivery.envelope, {
      from: 'mailer-fixture@example.invalid',
      to: ['recipient-fixture@example.invalid'],
    });
    assert.match(simpleRaw, /^Subject: Nueva consulta desde CYSTEMS/m);
    assert.match(simpleRaw, /^Reply-To: reply-simple@example\.invalid/m);
    // The text/plain alternative intentionally preserves literal text; this
    // assertion targets the rendered HTML alternative, where it must be safe.
    assert.ok(simpleRaw.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));

    const pdf = Buffer.from('%PDF-1.7\n1 0 obj\n<<>>\nendobj\n%%EOF\n', 'utf8');

    const projectDelivery = await sendProjectEmail({
      fullName: 'Project <script>alert(1)</script>',
      email: 'reply-project@example.invalid',
      company: 'Fixture company',
      phone: '+593 99 123 4567',
      country: 'Ecuador',
      projectType: 'Web application',
      projectLevel: 'Standard',
      pageRange: '1-5',
      designLevel: 'Custom',
      scope: 'Fixture scope',
      features: 'Authentication',
      integrations: 'None',
      hosting: 'Managed',
      branding: 'Existing',
      contentPlan: 'Provided',
      timeline: 'Flexible',
      references: 'https://example.invalid',
      uploadedFiles: 'proposal.pdf',
      brief: 'Brief <script>alert(1)</script>',
      specialRequirements: 'None',
      attachment: {
        filename: 'proposal.pdf',
        content: pdf,
        contentType: 'application/pdf',
      },
    });
    const projectRaw = rawMessage(projectDelivery);

    assert.deepEqual(projectDelivery.envelope, {
      from: 'mailer-fixture@example.invalid',
      to: ['recipient-fixture@example.invalid'],
    });
    assert.match(projectRaw, /^Subject: Nueva solicitud de proyecto desde CYSTEMS/m);
    assert.match(projectRaw, /^Reply-To: reply-project@example\.invalid/m);
    assert.ok(projectRaw.includes('application/pdf'));
    assert.ok(projectRaw.includes('proposal.pdf'));
    assert.ok(projectRaw.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));

    await assert.rejects(
      sendSimpleEmail({
        from_name: 'Fixture',
        reply_to: 'reply-simple@example.invalid\r\nBcc: attacker@example.invalid',
        message: 'This must not be delivered.',
        consultationType: 'Website',
        contact: '+593 99 123 4567',
      }),
      { message: 'INVALID_MAIL_DATA' }
    );

    const emailUser = process.env.EMAIL_USER;
    process.env.EMAIL_USER = '';
    await assert.rejects(
      sendSimpleEmail({
        from_name: 'Fixture',
        reply_to: 'reply-simple@example.invalid',
        message: 'This must not be delivered.',
        consultationType: 'Website',
        contact: '+593 99 123 4567',
      }),
      { message: 'SMTP_NOT_CONFIGURED' }
    );
    process.env.EMAIL_USER = emailUser;

    assert.equal(
      getSmtpErrorMessage(new Error('smtp.example.invalid credential details'), 'en'),
      'We could not send your message from the server. Please try again.'
    );
  } finally {
    restoreEnvironment(previous);
  }
});
