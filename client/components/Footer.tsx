import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { Music2, AtSign } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
     
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/emart-logo.svg" alt="E-Marts Logo" width={100} height={32} className="rounded-full" />
            </div>
            <p className="text-gray-600 text-sm mb-6">
              We get deliveries delivered to you in no time from a wide variety of vendors.
            </p>
           

            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/share/16qUfeinLT/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-lime-600 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/emarts.ng?igsh=MTM4a3YyeXVzZHNwbA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-lime-600 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.tiktok.com/@emarts.ng?_r=1&_t=ZS-92gDCn5GKVE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-lime-600 transition-colors"
                aria-label="TikTok"
              >
                <Music2 size={24} />
              </a>
              <a
                href="https://www.threads.com/@emarts.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-lime-600 transition-colors"
                aria-label="Threads"
              >
                <AtSign size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Contact us
                </a>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Privacy Policy</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  General
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Vendors
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Customers
                </a>
              </li>
            </ul>
          </div>

      
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Terms Of Use</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  General Terms Of Use
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-lime-600 transition-colors">
                  Merchant Terms Of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

      
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © Copyright 2026 | E-Marts Team
          </p>
          <div className="flex gap-4">
            

          </div>
        </div>
      </div>
    </footer>
  );
}
