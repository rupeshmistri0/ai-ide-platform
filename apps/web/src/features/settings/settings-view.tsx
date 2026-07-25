'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/use-auth-store';
import {
  User,
  ShieldCheck,
  Users,
  CreditCard,
  Sparkles,
  Save,
  CheckCircle2,
  Key,
  SlidersHorizontal,
} from 'lucide-react';

export function SettingsView() {
  const { user, updateUser } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'alex.rivera@enterprise.ai');
  const [twoFA, setTwoFA] = useState<boolean>(Boolean(user?.twoFactorEnabled ?? true));
  const [apiKey, setApiKey] = useState('sk-ent-98402948204981029481');
  const [model, setModel] = useState('gemini-1.5-pro');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, twoFactorEnabled: twoFA });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage your account profile, team access, security policies, and AI preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-10 text-xs">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">AI Setup</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-4">
          <Card className="border-border/80">
            <form onSubmit={handleSave}>
              <CardHeader>
                <CardTitle className="text-base">Personal Profile</CardTitle>
                <CardDescription className="text-xs">
                  Update your public avatar and contact info
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="flex items-center gap-4 pb-2 border-b border-border/50">
                  <Avatar className="h-16 w-16 border-2 border-primary/40">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="text-lg bg-primary/20 text-primary">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <Button variant="outline" size="sm" type="button" className="h-8 text-xs">
                      Change Avatar
                    </Button>
                    <p className="text-[10px] text-muted-foreground">
                      JPG, PNG or GIF. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Display Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-xs h-9"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-border/60 py-3">
                {saved ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Changes saved
                  </span>
                ) : <span />}
                <Button type="submit" variant="gradient" size="sm" className="h-8 text-xs gap-1">
                  <Save className="h-3.5 w-3.5" /> Save Profile
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="mt-4">
          <Card className="border-border/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Team Members & Roles</CardTitle>
                <CardDescription className="text-xs">
                  Manage active collaborators in AI Engineering Platform
                </CardDescription>
              </div>
              <Button variant="gradient" size="sm" className="h-8 text-xs">
                + Invite Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {[
                { name: 'Alex Rivera', email: 'alex.rivera@enterprise.ai', role: 'Owner' },
                { name: 'Sarah Chen', email: 'sarah.c@enterprise.ai', role: 'Admin' },
                { name: 'David Kim', email: 'david.k@enterprise.ai', role: 'Developer' },
              ].map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-accent/20"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-semibold text-foreground block">{member.name}</span>
                      <span className="text-[11px] text-muted-foreground">{member.email}</span>
                    </div>
                  </div>
                  <Badge variant="indigo" className="text-[10px]">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-4">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-base">Security & Authentication</CardTitle>
              <CardDescription className="text-xs">
                Configure two-factor authentication and active sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-accent/20">
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground block">
                    Two-Factor Authentication (2FA)
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    Require authenticator app code on login
                  </span>
                </div>
                <Switch checked={twoFA} onCheckedChange={setTwoFA} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="mt-4">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-base">Subscription & Usage</CardTitle>
              <CardDescription className="text-xs">
                Current plan: <strong className="text-purple-400">Enterprise Pro</strong> ($299/mo)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-card border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">Monthly AI Inference Tokens</span>
                  <Badge variant="indigo">28% Used</Badge>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[28%] bg-gradient-to-r from-purple-500 to-indigo-400" />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  1,420,500 of 5,000,000 quota used. Resets on Aug 1, 2026.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Configuration */}
        <TabsContent value="ai" className="mt-4">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                AI Model & API Preferences
              </CardTitle>
              <CardDescription className="text-xs">
                Configure default reasoning engines and system keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Default Reasoning Model</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (2M Context)' },
                    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
                    { id: 'gpt-4o', name: 'GPT-4o (OpenAI)' },
                    { id: 'deepseek-r1', name: 'DeepSeek-R1 (Math/Logic)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setModel(m.id)}
                      className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                        model === m.id
                          ? 'border-purple-500 bg-purple-500/10 text-foreground'
                          : 'border-border/60 bg-accent/20 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground flex items-center gap-1">
                  <Key className="h-3.5 w-3.5 text-muted-foreground" /> Platform API Key
                </label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
