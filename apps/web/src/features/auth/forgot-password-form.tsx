'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md border-border/80 bg-card/80 backdrop-blur-2xl shadow-2xl">
      <CardHeader className="space-y-2 text-center pb-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your registered work email to receive password reset instructions
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {submitted ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-bounce" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                Reset Link Dispatched
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                We sent a secure password reset link to <strong className="text-foreground">{email}</strong>.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Registered Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="alex.rivera@enterprise.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 text-xs h-10"
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full h-10 text-xs font-semibold">
              Send Reset Link
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/60 py-4 text-xs">
        <Link href="/login" className="flex items-center gap-1.5 font-semibold text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to login</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
