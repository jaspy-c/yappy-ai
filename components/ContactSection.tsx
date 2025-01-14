import Link from 'next/link'
import React from 'react'

export const ContactSection = () => {
  return (
    <div className='flex flex-col items-center justify-between text-center'>
      <div className='text-6xl font-bold p-3 tracking-tight text-balance'>Contact Us</div>
      <div className='text-lg font-semibold text-balance'>support@yappy-ai.com</div>
      <div className='flex flex-col space-y-2 mt-8'>
        <Link href='/privacy-policy' className="hover:text-blue-500">
          <div className='text-lg font-semibold text-balance'>Privacy Policy</div>
        </Link>
        <Link href='/terms-of-service' className="hover:text-blue-500">
          <div className='text-lg font-semibold text-balance'>Terms of Service</div>
        </Link>
      </div>
    </div>
  )
}
