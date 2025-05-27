"use client";

import { LoginForm } from "@/components/login-form"
import Image from "next/image";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // for Next.js
import { me } from '@/lib/api/authApi'; // adjust path as needed

export default function LoginPage() {
    const router = useRouter();

  const [checking, setChecking] = useState(true); // block render until done

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await me();
        if (res.success && res.data) {
          router.replace('/dashboard'); // ✅ redirect before showing login
        } else {
          setChecking(false);
        }
      } catch {
        setChecking(false); // not logged in
      }
    };

    checkLogin();
  }, []);

  if (checking) return null;


  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">

            <Image
                className="dark:invert"
                src="/NoteX.svg"
                alt="Next.js logo"
                width={50}
                height={8}
                priority
              />

        </a>
        <LoginForm />
      </div>
    </div>
  )
}
