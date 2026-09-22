import { Container } from './primitives';
import { TextLink } from '@/components/ui/TextLink';
import { Logo } from '@/components/media/Logo';
import { footerNav } from '@/data/navigation';
import { site } from '@/data/site';
import { whatsappLink } from '@/utils/whatsapp';
import './chrome.css';

/**
 * Footer. The oversized cropped wordmark is decorative (aria-hidden) and will be
 * replaced by the real logo asset. All links are real, labelled, and reachable.
 */
export function Footer() {
  return (
    <footer className="sv-footer" data-surface="darker">
      <Container>
        <div className="sv-footer__top">
          <div className="sv-stack" style={{ '--gap': 'var(--space-4)' }}>
            <Logo variant="lockup" />
            <p className="t-body-l t-muted t-measure">{site.tagline}</p>
          </div>

          <nav className="sv-footer__cols" aria-label="Footer">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h2 className="t-overline t-muted">{col.heading}</h2>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <TextLink plain to={link.to}>
                        {link.label}
                      </TextLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="t-overline t-muted">Order</h2>
              <ul>
                <li>
                  <TextLink plain external href={whatsappLink()}>
                    WhatsApp
                  </TextLink>
                </li>
                <li>
                  <TextLink plain external href={site.instagram.url}>
                    Instagram
                  </TextLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="sv-footer__legal t-small t-muted">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>{site.whatsapp.display}</p>
        </div>
      </Container>
      <div className="sv-footer__mark" aria-hidden="true">
        Sanovia
      </div>
    </footer>
  );
}
