import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ConnectedNav } from './Nav';
import * as mutations from '../store/mutations';
import { HeaderComponent } from './Header';


export const PrivacyComponent = () => (
  <div>
    <ConnectedNav />
    <HeaderComponent />
    <div className="card border-0 flex-grow-0 flex align-items-center justify-content-center">
      <div className="card-body">
        <h5 className="card-title">Privacy Policy:</h5>
        <h3>What information do we collect?</h3>
        <p>
          We collect information from you when you register on our site, place an order, or fill out a form.
          When ordering or registering on our site, as appropriate, you may be asked to enter your: name, e-mail address, mailing address. You may, however, visit our site anonymously.
        </p>
        <h3>Do we disclose any information to outside parties?</h3>
        <p>
          We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
        </p>
        <h3>What do we use your information for?</h3>
        <p>
          – To personalize your experience (Your information helps us to better respond to your individual needs.)
          (Your information helps us to better respond to your individual needs.)
          – To improve our website
          (We continually strive to improve our website offerings based on the information and feedback we receive from you.)

        </p>
        <h3>How do we protect your information?</h3>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information when you place an order
          We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems, and are required to keep the information confidential.
          After a transaction, your private information (credit cards, PayPal information, social security numbers, financials, etc.) will not be stored on our servers.
        </p>
        <h3>Your Consent</h3>
        <p>
          By using our site, you consent to our websites privacy policy.
        </p>

      </div>
    </div>
  </div>
);
