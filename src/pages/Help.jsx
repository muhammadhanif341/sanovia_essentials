import { Container, Section } from '@/components/layout/primitives';
import { PageHead } from '@/components/layout/PageHead';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';
import { WhatsApp } from '@/components/icons';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { whatsappLink } from '@/utils/whatsapp';

/** Help shell. Shipping/returns/payment copy must come from the client — nothing is invented here. */
export default function Help() {
  useDocumentTitle('Help');
  return (
    <>
      <PageHead overline="Help" title="How can we help?" />
      <Section surface="dark" pad="tight">
        <Container size="narrow">
          <div className="sv-stack">
            <Text size="body-l" muted>
              Shipping, returns and payment details will live here once they are confirmed. For now, the fastest way to
              reach us is WhatsApp.
            </Text>
            <div>
              <Button href={whatsappLink()} external iconBefore={<WhatsApp size={18} />}>
                Message us on WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
