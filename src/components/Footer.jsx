import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { injectIntl, intlShape } from "@edx/frontend-platform/i18n";
import { sendTrackEvent } from "@edx/frontend-platform/analytics";
import { ensureConfig } from "@edx/frontend-platform/config";
import { AppContext } from "@edx/frontend-platform/react";

import messages from "./Footer.messages";
import LanguageSelector from "./LanguageSelector";
import logoPlaceholder from "../assets/org-logo-place-holder.svg";
ensureConfig(["LMS_BASE_URL", "LOGO_TRADEMARK_URL"], "Footer component");

const EVENT_NAMES = {
  FOOTER_LINK: "edx.bi.footer.link",
};

const SiteFooter = ({ supportedLanguages, onLanguageSelected, logo, intl }) => {
  const [result, setResult] = useState(undefined);
  const [footerLegal, setFooterLegal] = useState(undefined);
  const [footerNav, setFooterNav] = useState(undefined);

  const { config } = useContext(AppContext);

  useEffect(() => {
    if (config && config.AC_INSTANCE_CONFIG_API_URL && config.LMS_BASE_URL) {
      fetch(`${config.LMS_BASE_URL}${config.AC_INSTANCE_CONFIG_API_URL}`)
        .then((response) => response.json())
        .then((response) => {
          setResult(JSON.parse(response));
          setFooterLegal(JSON.parse(JSON.parse(response)?.footer_legal_links));
          setFooterNav(JSON.parse(JSON.parse(response)?.footer_nav_links));
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.warn("AC_INSTANCE_CONFIG_API_URL is not defined");
    }
  }, [config]);

  const externalLinkClickHandler = (event) => {
    const label = event.currentTarget.getAttribute("href");
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: "outbound_link",
      label,
    };
    sendTrackEvent(eventName, properties);
  };

  const showLanguageSelector =
    supportedLanguages?.length > 0 && onLanguageSelected;

  return (
    <footer role="contentinfo" className="footer d-flex border-top py-3 px-4">
      <div className="container-fluid d-flex">
        <div className="footer-wrapper">
          <div className="footer-nav">
            <div className="footer-nav-links">
              <ul className="list-unstyled p-0 m-0 nav-list">
                {footerNav?.map((nav) => (
                  <li key={nav?.title}>
                    <a href={nav?.link}>{nav?.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="footer-legal-links">
              <ul className="list-unstyled p-0 m-0 nav-list">
                {footerLegal?.map((nav) => (
                  <li key={nav?.title}>
                    <a href={nav?.link}>{nav?.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="logo-wrapper">
            <a href="https://edspirit.com" aria-label="edspirit logo">
              <img
                className="edspirit-logo"
                src={
                  `${config.LMS_BASE_URL}${result?.edspirit_logo}` ||
                  logoPlaceholder
                }
                alt="edX Logo"
              />
            </a>
            <a href="https://open.edx.org">
              <img
                className="openEdx-logo"
                src={
                  result?.openedx_logo
                    ? `${config.LMS_BASE_URL}${result.openedx_logo}`
                    : config.LOGO_TRADEMARK_URL || logoPlaceholder
                }
                alt={intl.formatMessage(messages["footer.logo.altText"])}
              />
            </a>
          </div>
        </div>
        <div className="flex-grow-1" />
        {showLanguageSelector && (
          <LanguageSelector
            options={supportedLanguages}
            onSubmit={onLanguageSelected}
          />
        )}
      </div>
    </footer>
  );
};

SiteFooter.propTypes = {
  intl: intlShape.isRequired,
  logo: PropTypes.string,
  onLanguageSelected: PropTypes.func,
  supportedLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};

SiteFooter.defaultProps = {
  logo: undefined,
  onLanguageSelected: undefined,
  supportedLanguages: [],
};

export default injectIntl(SiteFooter);
export { EVENT_NAMES };
