import { useState } from 'react';
import { Container, Section } from '@/components/layout/primitives';
import { Heading, Overline, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { WhatsApp } from '@/components/icons';
import { whatsappLink } from '@/utils/whatsapp';
import { announce } from '@/utils/a11y';
import './newsletter.css';


/**
 * Newsletter — there is no email backend in a static SPA, and pretending one exists would be
 * exactly the kind of invented feature the rest of the site avoids. "First access to drops"
 * is delivered the way everything else here is: a WhatsApp message, prefilled with whatever
 * the visitor typed, opened for them to send. Motion: minimal entrance — one fade, no split-text.
 */
export function Newsletter() {
  const [email, setEmail] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    const text = trimmed
      ? `Hi Sanovia! Please add me to the drop list — ${trimmed}.`
      : 'Hi Sanovia! Please add me to the drop list.';
    announce('Opening WhatsApp…');
    window.open(whatsappLink(text), '_blank', 'noopener,noreferrer');
  };

  return (
    <Section surface="dark" aria-labelledby="newsletter-title">
      <Container size="narrow">
        <form className="newsletter" onSubmit={submit} data-reveal="fade">
          <Overline accent>Stay close</Overline>
          <Heading level={2} size="h1" id="newsletter-title">
            Get first access to new drops.
          </Heading>
          <Text size="body-l" muted className="t-measure newsletter__body">
            Leave your email (or skip it) and we&rsquo;ll open WhatsApp with a message ready to send — that&rsquo;s
            the only "list" that exists here.
          </Text>
          <div className="newsletter__row">
            <TextField
              label="Email (optional)"
              className="newsletter__field"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="whatsapp" className="newsletter__submit" iconBefore={<WhatsApp size={18} />}>
              Join on WhatsApp
            </Button>
          </div>
        </form>
      </Container>
    </Section>
  );
}
