import PageHeader from '@/components/PageHeader'

const PrivacyPolicyPage = async () => {
  return (
    <>
      <PageHeader />
      <div className='grid w-full min-h-screen items-center justify-center p-4 border rounded-md bg-gradient-to-r from-amber-100 to-fuchsia-100'>
        <div className='max-w-screen-md'>
          <div className='flex flex-col bg-white shadow-lg rounded p-8 mt-20'>
            <h1 className='text-3xl mb-3 font-bold'>Terms of Service</h1>

            Effective Date: January 12, 2025
            <br></br>

            <h2 className='text-xl my-3 font-bold'>1. Acceptance of Terms</h2>
            By accessing or using the Yappy-AI web application (the &quot;Service&quot;), you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree with these terms, please do not use the Service.

            <h2 className='text-xl my-3 font-bold'>2. User Eligibility</h2>
            You must be at least 18 years of age to use the Service. By using the Service, you confirm that you are 18 years or older. If you are using the Service on behalf of a company or organization, you represent that you have the authority to bind that entity to these Terms of Service.

            <h2 className='text-xl my-3 font-bold'>3. User Accounts</h2>
            To use certain features of the Service, you may need to create an account. You are responsible for maintaining the confidentiality of your account information, including your username and password. You agree to notify us immediately of any unauthorized use of your account.

            <h2 className='text-xl my-3 font-bold'>4. User-Uploaded Content</h2>
            The Service allows you to upload PDF files for analysis by our AI chatbot. You retain ownership of the content you upload, but by using the Service, you grant Yappy-AI a worldwide, non-exclusive, royalty-free license to process and analyze the content to provide the requested services.
            You agree not to upload any content that is illegal, defamatory, infringing, or harmful in any way. Yappy-AI reserves the right to remove any content that violates these Terms of Service.

            <h2 className='text-xl my-3 font-bold'>5. Privacy and Data Security</h2>
            Yappy-AI respects your privacy and is committed to protecting your personal information. Please review our Privacy Policy to understand how we collect, use, and protect your data.
            By using the Service, you acknowledge and consent to the data processing practices described in the Privacy Policy.

            <h2 className='text-xl my-3 font-bold'>6. AI Analysis Limitations</h2>
            The AI chatbot used in the Service is designed to assist with PDF file analysis. However, the analysis results provided by the AI are for informational purposes only and may not always be accurate or complete. Yappy-AI makes no warranties or representations regarding the results of the AI analysis and is not liable for any consequences arising from its use.

            <h2 className='text-xl my-3 font-bold'>7. Prohibited Uses</h2>
            You agree not to use the Service for any unlawful or prohibited activity, including but not limited to:

            Uploading or distributing harmful, fraudulent, or malicious content.
            Violating any applicable law, regulation, or third-party rights.
            Engaging in any activity that could damage, disable, or impair the functionality of the Service.

            <h2 className='text-xl my-3 font-bold'>8. Limitation of Liability</h2>
            Yappy-AI will not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to data loss or damage, business interruption, or any other losses.

            <h2 className='text-xl my-3 font-bold'>9. Termination</h2>
            Yappy-AI reserves the right to suspend or terminate your access to the Service at any time, without notice, for any reason, including if we believe you have violated these Terms of Service.

            <h2 className='text-xl my-3 font-bold'>10. Governing Law</h2>
            These Terms of Service are governed by the laws of the State of California, USA, without regard to its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located in California for any disputes arising out of or related to these terms.

            <h2 className='text-xl my-3 font-bold'>11. Changes to Terms of Service</h2>
            Yappy-AI reserves the right to modify these Terms of Service at any time. We will notify users of significant changes by posting the updated terms on this page with the revised date. Your continued use of the Service after such modifications constitutes your acceptance of the updated terms.

            <h2 className='text-xl my-3 font-bold'>12. Contact Information</h2>
            If you have any questions or concerns about these Terms of Service, please contact us at:
            Email: support@yappy-ai.com
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
