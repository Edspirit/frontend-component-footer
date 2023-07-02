import React from "react";
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

class SiteFooter extends React.Component {
  constructor(props) {
    super(props);
    this.externalLinkClickHandler = this.externalLinkClickHandler.bind(this);
    this.state = {
      result: undefined,
      footerLegal: undefined,
      footerNav: undefined,
    };
  }

  componentDidMount() {
    const { config } = this.context;
    if (config.AC_INSTANCE_CONFIG_API_URL && config.LMS_BASE_URL) {
      this.fetchFooterData();
    } else {
      console.warn("AC_INSTANCE_CONFIG_API_URL is not defined");
    }
  }

  externalLinkClickHandler(event) {
    const label = event.currentTarget.getAttribute("href");
    const eventName = EVENT_NAMES.FOOTER_LINK;
    const properties = {
      category: "outbound_link",
      label,
    };
    sendTrackEvent(eventName, properties);
  }

  fetchFooterData() {
    fetch(
      `${this.context.config.LMS_BASE_URL}${this.context.config.AC_INSTANCE_CONFIG_API_URL}`
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          result: JSON.parse(response),
          footerLegal: JSON.parse(JSON.parse(response)?.footer_legal_links),
          footerNav: JSON.parse(JSON.parse(response)?.footer_nav_links),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { supportedLanguages, onLanguageSelected, logo, intl } = this.props;
    const showLanguageSelector =
      supportedLanguages?.length > 0 && onLanguageSelected;
    const { config } = this.context;

    return (
      <footer role="contentinfo" className="footer d-flex border-top py-3 px-4">
        <div className="container-fluid d-flex">
          <div className="footer-wrapper">
            <div className="footer-nav">
              <div className="footer-nav-links">
                <ul className="list-unstyled p-0 m-0 nav-list">
                  {this.state.footerNav?.map((nav) => (
                    <li key={nav?.title}>
                      <a href={nav?.link}>{nav?.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-legal-links">
                <ul className="list-unstyled p-0 m-0 nav-list">
                  {this.state.footerLegal?.map((nav) => (
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
                    `${config.LMS_BASE_URL}${this.state.result?.edspirit_logo}` ||
                    logoPlaceholder
                  }
                  alt="edX Logo"
                />
              </a>
              <a href="https://open.edx.org">
                <img
                  className="openEdx-logo"
                  src={
                    this.state.result?.openedx_logo
                      ? `${config.LMS_BASE_URL}${this.state.result.openedx_logo}`
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
  }
}

SiteFooter.contextType = AppContext;

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
