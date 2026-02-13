'use client';
//import Image from "next/image";
import styles from '@/app/components/ui/contact/contact.module.css';
import {useState} from "react";
import {useMutation} from "@/hooks/useApi";
import type {EmailResponse} from "@/lib/types";
import FlashMessage from '@/app/components/ui/FlashMessage';

export default function Contact() {
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [flashMessage, setFlashMessage] = useState<{type: 'success' | 'error', message: string, id: number} | null>(null);

  const {mutate: sendEmail, loading: isSendingEmail, data: emailResponse, error: emailError } = useMutation<typeof emailFormData, EmailResponse>('post', '/contact-email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handling submit");
    console.log('emailFormData', emailFormData);
    console.log('loading', isSendingEmail);
    console.log('data', emailResponse);
    console.log('error', emailError);

    try {
      const result = await sendEmail(emailFormData);
      console.log('Email sent result:', result);
      
      if (result?.success) {
        setFlashMessage({
          type: 'success',
          message: result.message || 'Email sent successfully!',
          id: Date.now()
        });
      } else {
        setFlashMessage({
          type: 'error',
          message: 'Error sending email, please double-check your email and try again',
          id: Date.now()
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setFlashMessage({
        type: 'error',
        message: 'Error sending email, please double-check your email and try again',
        id: Date.now()
      });
    }
  };

  return (
    <>
    <div
  className={`${styles.container} min-h-screen flex flex-col items-center justify-center p-8 text-white font-sans`}
    >
        <h1 className={`${styles.title}`}>
        Contact Us
        </h1>
        {flashMessage && (
        <FlashMessage 
          key={flashMessage.id}
          type={flashMessage.type} 
          message={flashMessage.message}
          onClose={() => setFlashMessage(null)}
        />
      )}
       <form className="relative z-10 flex flex-col gap-6 w-full max-w-md" onSubmit={handleSubmit}>
       <label className={`${styles.label} flex flex-col text-lg font-bold`}>
          Name:
          <input
          type="text"
          className={`${styles.input} mt-2 w-full p-3 text-base focus:outline-none`}
          required
          placeholder="Your Name"
          onChange={(e) => setEmailFormData(prev => ({ ...prev, name: e.target.value }))}
        />
        </label>
        <label className={`${styles.label} flex flex-col text-lg font-bold`}>
          Email:
          {/* can possibly add for a check that we are using school emails */}
           <input
          type="text"
          className={`${styles.input} mt-2 w-full p-3 text-base focus:outline-none`}
          required
          placeholder="email@example.com"
          onChange={(e) => setEmailFormData(prev => ({ ...prev, email: e.target.value }))}
        />
        </label>
        {/* shows error message */}
        {/* {error && <p style = {{color: 'red', marginTop: '0.5rem'}}>{error}</p>} */}
        <label className={`${styles.label} flex flex-col text-lg font-bold`}>
          Message:
          <textarea 
          className={`${styles.textarea}  mt-2 w-full p-3 text-base focus:outline-none resize-none h-32`} 
          placeholder="Your message here..."
          required
          onChange={(e) => setEmailFormData(prev => ({ ...prev, message: e.target.value }))}
          />
        </label>
      <button
        type="submit"
        className={`${styles.button} mx-auto px-8 py-4 text-lg font-bold cursor-pointer`}
        disabled={isSendingEmail}
      >
        {isSendingEmail ? 'Sending...' : 'Submit'}
      </button>
      </form>
    </div>
  </>
  );
}