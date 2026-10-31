'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  Search, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  ArrowRight, 
  X, 
  Send, 
  Paperclip, 
  Inbox, 
  Zap, 
  User, 
  ChevronRight,
  ShieldCheck,
  BarChart3
} from 'lucide-react';

type Priority = 'low' | 'medium' | 'high';
type Status = 'open' | 'in-progress' | 'closed';

interface TicketItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  category: string;
  author: string;
  createdAt: string;
  aiSuggestedFix?: string;
}

const INITIAL_TICKETS: TicketItem[] = [
  {
    id: 'TK-8491',
    title: 'Payment webhook failing with 500 error on Stripe charge',
    description: 'When users complete checkout via Stripe checkout session, the /api/webhook/stripe endpoint responds with status 500 Internal Server Error due to payload signature verification.',
    priority: 'high',
    status: 'open',
    category: 'Billing & Webhooks',
    author: 'sarah_tech',
    createdAt: '25 mins ago',
    aiSuggestedFix: 'Ensure express.raw({ type: "application/json" }) is mounted prior to bodyParser on your webhook route to preserve raw buffer signature.',
  },
  {
    id: 'TK-7210',
    title: 'Cannot upload PDF invoices over 5MB in user settings',
    description: 'Whenever I try to upload my company VAT registration certificate (approx 6.2MB), the modal displays "Network Error" without specific details.',
    priority: 'medium',
    status: 'in-progress',
    category: 'File Upload & Storage',
    author: 'michael_chen',
    createdAt: '2 hours ago',
    aiSuggestedFix: 'Adjust the client upload chunk size or proxy nginx client_max_body_size to 25MB for multipart payload headers.',
  },
  {
    id: 'TK-6104',
    title: 'Requesting SSO & SAML 2.0 integration for Okta workspace',
    description: 'Our security compliance team requires SAML 2.0 single sign-on with Okta identity provider before onboarding our customer support representatives.',
    priority: 'low',
    status: 'open',
    category: 'Authentication & SSO',
    author: 'david_sec',
    createdAt: '5 hours ago',
    aiSuggestedFix: 'Provide customer with enterprise metadata XML URL and Okta application ACS endpoint.',
  },
  {
    id: 'TK-5032',
    title: 'Two-factor authentication (2FA) SMS delivery latency',
    description: 'Users located in the EU region are reporting 8-10 minute delays receiving 2FA SMS verification codes during peak login hours.',
    priority: 'high',
    status: 'closed',
    category: 'Security & SMS Gateway',
    author: 'anna_ops',
    createdAt: '1 day ago',
    aiSuggestedFix: 'Switched European Twilio toll-free routing pool to high-priority transactional SMS alpha sender ID.',
  },
  {
    id: 'TK-4819',
    title: 'AI ticket auto-categorization model response time spike',
    description: 'The semantic classification model response time increased from 180ms to 920ms during peak hours between 14:00 - 16:00 UTC.',
    priority: 'medium',
    status: 'in-progress',
    category: 'AI Pipeline',
    author: 'marcus_ai',
    createdAt: '1 day ago',
    aiSuggestedFix: 'Scale Redis inference cache cluster and batch token embeddings asynchronously.',
  },
];

export default function HomePage() {
  const [tickets, setTickets] = useState<TicketItem[]>(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | Status>('all');
  const [selectedPriority, setSelectedPriority] = useState<'all' | Priority>('all');
  const [activeTicket, setActiveTicket] = useState<TicketItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Ticket Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');

  // Stats
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const inProgress = tickets.filter(t => t.status === 'in-progress').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    return { total, open, inProgress, closed };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, selectedStatus, selectedPriority]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newTicket: TicketItem = {
      id: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      status: 'open',
      category: 'General Technical Inquiry',
      author: 'You',
      createdAt: 'Just now',
      aiSuggestedFix: 'Ticket received and queued for intelligent AI classification and automated triage routing.',
    };

    setTickets([newTicket, ...tickets]);
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-0.5 shadow-md shadow-blue-500/20">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                  HelpMe
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                  <Sparkles className="w-3 h-3 text-blue-500" /> AI Support
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Triage Operational</span>
            </div>
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-600/20 transition-all"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero & Command Overview */}
      <section className="bg-white dark:bg-zinc-900/40 border-b border-zinc-200/80 dark:border-zinc-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <Zap className="w-4 h-4" /> Real-time Support Ticket Intelligence
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
                AI-Powered Support Desk
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Automated issue triage, priority routing, and instant AI diagnosis suggestions for modern teams.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Ticket</span>
              </button>
            </div>
          </div>

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase">
                <span>Total Tickets</span>
                <Inbox className="w-4 h-4 text-zinc-400" />
              </div>
              <p className="text-2xl font-black text-zinc-950 dark:text-white mt-2">{stats.total}</p>
              <p className="text-[11px] text-zinc-500 mt-1">In active queue</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40">
              <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase">
                <span>Open Issues</span>
                <AlertCircle className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-blue-700 dark:text-blue-300 mt-2">{stats.open}</p>
              <p className="text-[11px] text-blue-600/80 dark:text-blue-400 mt-1">Awaiting triage</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40">
              <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase">
                <span>In Progress</span>
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-black text-purple-700 dark:text-purple-300 mt-2">{stats.inProgress}</p>
              <p className="text-[11px] text-purple-600/80 dark:text-purple-400 mt-1">Under investigation</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase">
                <span>Resolved</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-2">{stats.closed}</p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400 mt-1">98.4% SLA adherence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Ticket Queue Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-4">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket title, ID, or keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status pills */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl text-xs font-semibold">
              {(['all', 'open', 'in-progress', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1 rounded-lg capitalize transition-all ${
                    selectedStatus === s
                      ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>

            {/* Priority filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Ticket List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-3">
            <Inbox className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">No Tickets Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No support tickets matched your search query. Try clearing the filter or create a new ticket.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const priorityColors = {
                high: 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200/80',
                medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80',
                low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80',
              };

              const statusColors = {
                open: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/80',
                'in-progress': 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/80',
                closed: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200/80',
              };

              return (
                <div
                  key={ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                  className="group bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-zinc-400">
                        #{ticket.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${priorityColors[ticket.priority]}`}>
                        {ticket.priority === 'high' && <Flame className="w-3 h-3 inline mr-1 text-red-500" />}
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${statusColors[ticket.status]}`}>
                        {ticket.status}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        • {ticket.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ticket.title}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {ticket.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-zinc-400 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">{ticket.author}</p>
                      <p className="text-[11px] text-zinc-400">{ticket.createdAt}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Ticket Details Inspector Drawer / Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">
            
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-400">#{activeTicket.id}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {activeTicket.status}
                </span>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div>
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  {activeTicket.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <span>Reported by <strong>{activeTicket.author}</strong></span>
                  <span>•</span>
                  <span>{activeTicket.createdAt}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                {activeTicket.description}
              </div>

              {/* AI Insight Box */}
              {activeTicket.aiSuggestedFix && (
                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI Copilot Suggested Diagnosis & Resolution</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {activeTicket.aiSuggestedFix}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Status: {activeTicket.status}</span>
              <button
                onClick={() => setActiveTicket(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">Submit Support Ticket</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Payment webhook returning 500 status"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide steps to reproduce, error codes, and details..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`py-2 text-xs font-semibold rounded-xl border capitalize transition-all ${
                        newPriority === p
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-600/20"
                >
                  Create Ticket
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800 py-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} HelpMe AI Support Ticket System</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-white">Login</Link>
            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-white">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
