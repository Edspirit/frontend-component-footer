import { injectIntl, FormattedMessage } from "@edx/frontend-platform/i18n";
import { sendTrackEvent } from "@edx/frontend-platform/analytics";
import { ensureConfig } from "@edx/frontend-platform/config";
import { Icon } from "@edx/paragon";
import edLogo from "../assets/edspirit-logo.png";
import mobileFooterLogo from "../assets/mobile-footer-logo.svg";
import mobileEdxLogo from "../assets/mobile-edx-logo.svg";
import edxLogo from "../assets/Edx.svg";
import DefaultLogo from "../assets/NavLogo-placeholder.svg";
import { ReactComponent as Linkedin } from "../assets/linkedin.svg";
import { ReactComponent as Facebook } from "../assets/facebook.svg";
import { ReactComponent as Twitter } from "../assets/twitter.svg";
import { ReactComponent as Instagram } from "../assets/instagram.svg";
import useGetFooters from "./useGetFooters";
import ChooseLanguage from "./footer-section/ChooseLanguage";

ensureConfig(["LMS_BASE_URL", "LOGO_TRADEMARK_URL"], "Footer component");

const EVENT_NAMES = {
  FOOTER_LINK: "edx.bi.footer.link",
};

const SiteFooter = ({ supportedLanguages, onLanguageSelected, logo, intl }) => {
  const { footerData } = useGetFooters();
  const externalLinkClickHandler = (event) => {
    const label = event.currentTarget.getAttribute("href");
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: "outbound_link",
      label,
    };
    sendTrackEvent(eventName, properties);
  };

  return (
    <footer className="footer-container">
      <div className="custom-container mb-4 pt-5">
        <div className=" footer-wrapper">
          <div className=" footer-desc-wrapper">
            <div className="d-flex flex-column">
              <div className="logo-container mb-4">
                <img
                  className="h-100"
                  src={footerData?.logo ?? DefaultLogo}
                  alt="footer-logo"
                />
              </div>
              <p>{footerData?.description}</p>
            </div>
          </div>

          <div className=" footer-col1-wrapper">
            <h5 className="mb-2.5">
              {footerData?.links?.sections[0]?.section_title}
            </h5>
            <ul className="list-unstyled">
              {footerData?.links?.sections[0]?.section_links?.map((nav) => (
                <li className="mb-2" key={nav.title}>
                  <a className="custom-link" href={nav.link}>
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className=" footer-col2-wrapper ">
            <h5 className="mb-2.5">
              {footerData?.links?.sections[1]?.section_title}
            </h5>
            <ul className="list-unstyled">
              {footerData?.links?.sections[1]?.section_links?.map((nav) => (
                <li className="mb-2" key={nav.title}>
                  <a className="custom-link" href={nav.link}>
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className=" footer-col3-wrapper ">
            <ChooseLanguage />
            <div className="social-container">
              {footerData?.links?.socials.linkedin && (
                <a
                  href={footerData?.links?.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="social-icon-footer" src={Linkedin} />
                </a>
              )}
              {footerData?.links?.socials.facebook && (
                <a
                  href={footerData?.links?.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="social-icon-footer" src={Facebook} />
                </a>
              )}
              {footerData?.links?.socials.twitter && (
                <a
                  href={footerData?.links?.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="social-icon-footer" src={Twitter} />
                </a>
              )}
              {footerData?.links?.socials.instagram && (
                <a
                  href={footerData?.links?.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="social-icon-footer" src={Instagram} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copy-right-container ">
        <div className="footer-copy-right custom-container d-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center">
            <div className="logo-container mr-2">
              <img className="footer-logo" src={edLogo} alt="footer-logo" />
              <img
                className="mobile-footer-logo  h-100"
                src={mobileFooterLogo}
                alt="footer-logo"
              />
            </div>
            <p className="footer-desc">
              <FormattedMessage
                id="footer.powerdBy.text"
                defaultMessage="Powered by "
              />
              <a className="footer-desc" href="https://edspirit.com/">
                edSPIRIT
              </a>
            </p>
          </div>
          <div className="d-flex edx-wrapper">
            <div className="logo-container mr-2">
              <img
                className="mobile-footer-logo  h-100"
                src={mobileEdxLogo}
                alt="footer-logo-edx"
              />
            </div>
            <p className="footer-desc d-flex align-items-center">
              <FormattedMessage
                id="footer.copyRight.text"
                defaultMessage="edX and Open edX are trademarks of edX LLC. All Rights Reserved"
              />
              <img className="ml-2 desktop-view-edx" src={edxLogo} alt="edx" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default injectIntl(SiteFooter);
