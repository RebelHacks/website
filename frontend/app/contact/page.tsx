'use client';
import Image from "next/image";
// import { useState } from 'react';
import styles from '@/styles/contact.module.css';

export default function Contact() {
    // const [error, setError] = useState(''); // state to show error message
    // const handleSubmit = (e: any) => {
    //     e.preventDefault(); // this prevents the default form submission
    //     const email = e.target.email.value;
    //     if(!email.endsWith('@unlv.nevada.edu')) {
    //         setError('Please use your UNLV email.');
    //         return;
    //     }
    //     setError('');//clear error if email is valid
    //     alert('Form submitted!');
    // }
  return (
    <>
    <div
  className={`${styles.container} min-h-screen flex flex-col items-center justify-center p-8 text-white font-sans`}
    >
        <Image
          src="/images/aceOfSpade.png"
          alt="Ace of Spades"
          width={200}
          height={200}
          style={{
            position: 'fixed',
            top: '3rem',
            right: '6rem',
            zIndex: 9999,
          }}
        /> 
        <Image
          src="/images/diamond.png"
          alt="Diamond"
          width={200}
          height={200}
          style={{
            position: 'fixed',
            top: '10rem',
            left: '6rem',
            zIndex: 9999,
          }}
        />
        <Image
          src="/images/heart.png"
          alt="Heart"
          width={200}
          height={200}
          style={{
            position: 'fixed',
            top: '20rem',
            right: '6rem',
            zIndex: 9999,
          }}
          />
        <h1 className={`${styles.title} text-5xl md:text-4xl sm:text-3xl font-black text-center mb-8`}>
        Contact Us
        </h1>
       <form className="relative z-10 flex flex-col gap-6 w-full max-w-md">{/*onSubmit={handleSubmit}> */}
       <label className={`${styles.label} flex flex-col text-lg font-bold`}>
          Name:
          <input
          type="text"
          className={`${styles.input} mt-2 w-full p-3 text-base focus:outline-none`}
          placeholder="Your Name"
        />
        </label>
        <label className={`${styles.label} flex flex-col text-lg font-bold`}>
          Email:
          {/* can possibly add for a check that we are using school emails */}
           <input
          type="text"
          className={`${styles.input} mt-2 w-full p-3 text-base focus:outline-none`}
          placeholder="email@example.com"
        />
        </label>
        {/* shows error message */}
        {/* {error && <p style = {{color: 'red', marginTop: '0.5rem'}}>{error}</p>} */}
        <label className={`${styles.label} flex flex-col text-lg font-bold`}>
          Message:
          <textarea 
          className={`${styles.textarea} mt-2 w-full p-3 text-base`} 
          placeholder="Your message..." 
          />
        </label>
      <button
      type="submit"
      className={`${styles.button} mx-auto px-8 py-4 text-lg font-bold cursor-pointer`}
      > 
      Send
      </button>
      </form>
    </div>
  </>
  );
}