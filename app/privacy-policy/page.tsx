import PageHeader from '@/components/PageHeader'

const PrivacyPolicyPage = async () => {
  return (
    <>
      <PageHeader />
      <div className='grid w-full min-h-screen items-center justify-center p-4 border rounded-md bg-gradient-to-r from-amber-100 to-fuchsia-100'>
        <div className='max-w-screen-md'>
          <div className='flex flex-col bg-white shadow-lg rounded p-8 mt-20'>
            <h1 className='text-3xl mb-3 font-bold'>Privacy Policy</h1>

              Effective Date: January 12, 2025
              <br></br>
              Yappy-AI (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect the information you provide when using our web application (the “Service”), which enables users to upload PDF files for AI-based analysis. By using our Service, you agree to the terms outlined in this Privacy Policy.

              <h2 className='text-xl my-3 font-bold'>1. Information We Collect</h2>

              We collect the following types of information:

              a. Information You Provide

              Uploaded Files: When you upload PDF files to our Service, the content of those files is temporarily stored and processed by our AI to provide the analysis results.

              Account Information: If you create an account, we may collect your name, email address, and password.

              b. Automatically Collected Information

              Usage Data: Information about how you use our Service, such as timestamps, pages visited, and interaction with features.

              Device Information: Data about your device, including browser type, operating system, and IP address.

              Cookies: We use cookies to enhance your experience. For more information, see Section 6 below.

              <h2 className='text-xl my-3 font-bold'>2. How We Use Your Information</h2>

              We use the information we collect for the following purposes:

              To provide and improve our Service, including processing and analyzing uploaded files.

              To communicate with you, including responding to inquiries or sending updates.

              To maintain the security and functionality of the Service.

              To comply with legal obligations or enforce our Terms of Service.

              <h2 className='text-xl my-3 font-bold'>3. Data Sharing and Disclosure</h2>

              We do not sell your personal data. However, we may share information in the following scenarios:

              Service Providers: We may share data with third-party vendors who assist in operating our Service (e.g., cloud storage or analytics providers). These providers are bound by confidentiality obligations.

              Legal Requirements: We may disclose data if required by law or in response to valid legal requests.

              Business Transfers: In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction.

              <h2 className='text-xl my-3 font-bold'>4. Data Retention</h2>

              Uploaded Files: Files are retained temporarily only for the duration of analysis and are deleted automatically within 12 months after processing.

              Account Information: Retained for as long as your account remains active or as needed to provide the Service.

              Other Data: Retained for purposes such as analytics, security, and legal compliance, as necessary.

              <h2 className='text-xl my-3 font-bold'>5. Your Rights</h2>

              As a California resident, you have rights under the California Consumer Privacy Act (CCPA):

              Access and Portability: You can request a copy of your personal data.

              Deletion: You can request that we delete your data, subject to legal exceptions.

              Opt-Out of Sale: While we do not sell data, you can opt-out of any data sharing practices.

              To exercise your rights, contact us at support@yappy-ai.com.

              <h2 className='text-xl my-3 font-bold'>6. Cookies and Tracking Technologies</h2>

              We use cookies and similar technologies to:

              Remember your preferences.

              Analyze site traffic and usage.

              You can control cookies through your browser settings. Disabling cookies may affect your experience.

              <h2 className='text-xl my-3 font-bold'>7. Data Security</h2>

              We implement industry-standard measures to protect your data, including encryption, secure servers, and regular audits. However, no method of transmission over the internet or electronic storage is 100% secure.

              <h2 className='text-xl my-3 font-bold'>8. Children’s Privacy</h2>

              Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If we become aware of such data, we will delete it.

              <h2 className='text-xl my-3 font-bold'>9. Changes to This Privacy Policy</h2>

              We may update this Privacy Policy from time to time. Changes will be effective when posted, and we will notify users of significant updates. Please review this page periodically.

              <h2 className='text-xl my-3 font-bold'>10. Contact Us</h2>

              If you have any questions or concerns about this Privacy Policy, please contact us at:

              Yappy-AI 
              Email: support@yappy-ai.com
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
