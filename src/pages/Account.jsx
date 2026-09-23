import { useState } from 'react';
import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text, Heading } from '@/components/ui/Typography';
import { TextField } from '@/components/ui/Field';
import { WhatsApp } from '@/components/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { whatsappLink } from '@/utils/whatsapp';

/**
 * Account shell — real, accessible sign-in/create-account markup (proper labels,
 * autocomplete, validation) so a backend can be wired straight into these forms later,
 * but there is no backend yet, so submitting one is honest about that rather than
 * faking success. Ordering never requires an account — the WhatsApp flow already IS
 * the guest checkout — and Wishlist already works today, without one (per-device only).
 */
export default function Account() {
  useDocumentTitle('Account');
  const [mode, setMode] = useState('signin');
  const [status, setStatus] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    setStatus(
      mode === 'signin'
        ? "Accounts aren't connected yet, so we can't sign you in — order or ask a question on WhatsApp instead, we'll know it's you from your number."
        : "Accounts aren't connected yet, so we can't create one — you don't need one to order. Message us on WhatsApp and we'll take it from there."
    );
  };

  return (
    <>
      <PageHead overline="Account" title="Your account" />
      <Section surface="dark" pad="tight">
        <Container size="narrow">
          <div className="sv-stack" style={{ '--gap': 'var(--space-8)' }}>
            <div className="sv-stack" style={{ '--gap': 'var(--space-5)' }}>
              <div className="sv-cluster" style={{ '--gap': 'var(--space-3)' }} role="group" aria-label="Account access">
                <Button
                  variant={mode === 'signin' ? 'primary' : 'ghost'}
                  size="sm"
                  aria-pressed={mode === 'signin'}
                  onClick={() => {
                    setMode('signin');
                    setStatus(null);
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant={mode === 'signup' ? 'primary' : 'ghost'}
                  size="sm"
                  aria-pressed={mode === 'signup'}
                  onClick={() => {
                    setMode('signup');
                    setStatus(null);
                  }}
                >
                  Create account
                </Button>
              </div>

              <form className="sv-stack" style={{ '--gap': 'var(--space-4)' }} onSubmit={submit} noValidate>
                {mode === 'signup' && (
                  <TextField label="Name" name="name" type="text" autoComplete="name" required />
                )}
                <TextField label="Email" name="email" type="email" autoComplete="email" required />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                />
                <div>
                  <Button type="submit">{mode === 'signin' ? 'Sign in' : 'Create account'}</Button>
                </div>
                {status && (
                  <Text className="t-small" role="status" style={{ maxWidth: 'var(--measure)' }}>
                    {status}
                  </Text>
                )}
              </form>
            </div>

            <div className="sv-stack" style={{ '--gap': 'var(--space-3)' }}>
              <Heading level={2} size="h3">
                Ordering doesn't need an account
              </Heading>
              <Text muted>
                Every order goes through WhatsApp, guest or not — we confirm price, delivery and payment with you
                there. Order history will live here once accounts are connected; until then, your WhatsApp chat is
                the record.
              </Text>
              <div>
                <Button href={whatsappLink()} external iconBefore={<WhatsApp size={18} />}>
                  Message us on WhatsApp
                </Button>
              </div>
            </div>

            <div className="sv-stack" style={{ '--gap': 'var(--space-3)' }}>
              <Heading level={2} size="h3">
                Wishlist works today
              </Heading>
              <Text muted>No account needed — pieces you save are kept on this device.</Text>
              <div>
                <Button to="/wishlist" variant="ghost" size="sm">
                  View your wishlist
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
