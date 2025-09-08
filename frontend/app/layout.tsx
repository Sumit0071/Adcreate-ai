import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google"
import FacebookLogin from 'react-facebook-login';

const geistSans = Geist( {
  variable: "--font-geist-sans",
  subsets: ["latin"],
} );

const geistMono = Geist_Mono( {
  variable: "--font-geist-mono",
  subsets: ["latin"],
} );

export const metadata: Metadata = {
  title: "Adcreate AI - AI-Powered Ad Creative Generator",
  description: "Generate high-converting ad creatives with AI. Create engaging ad copy and stunning images tailored to your business needs.",
};

export default function RootLayout( {
  children,
}: Readonly<{
  children: React.ReactNode;
}> ) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {/* <FacebookLogin appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!} autoLoad={false}  fields="name,email,picture" callback={()=>{}}/> */}
            {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
