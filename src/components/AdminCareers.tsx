import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, Download, ExternalLink, Mail, Phone } from 'lucide-react';
import {
  EMPLOYMENT_TYPES,
  deleteApplication,
  deleteJob,
  isMissingTable,
  listAllJobs,
  listApplications,
  saveJob,
  setApplicationStatus,
  setJobStatus,
  type Application,
  type ApplicationStatus,
  type Job,
  type JobInput,
  type JobStatus,
} from '../services/careers';

const EMPTY_FORM: JobInput = {
  title: '',
  department: '',
  location: 'Vienna, Austria',
  employmentType: 'Volunteer',
  description: '',
  requirements: '',
  deadline: null,
  status: 'draft',
};

const JOB_BADGE: Record<JobStatus, string> = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-amber-50 text-amber-700 border-amber-200',
};
const APP_STATUSES: ApplicationStatus[] = ['new', 'reviewed', 'shortlisted', 'rejected'];
const APP_BADGE: Record<ApplicationStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  reviewed: 'bg-slate-100 text-slate-700 border-slate-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const field = 'w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue';
const lbl = 'block mb-1.5 text-xs uppercase tracking-[0.1em] font-semibold text-slate-600';

const fmt = (iso: string) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '');

function csvCell(v: string) {
  return `"${(v ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
}

export default function AdminCareers() {
  const [tab, setTab] = useState<'roles' | 'applications'>('roles');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [form, setForm] = useState<JobInput | null>(null);
  const [saving, setSaving] = useState(false);
  const [jobFilter, setJobFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openApp, setOpenApp] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [j, a] = await Promise.all([listAllJobs(), listApplications()]);
      setJobs(j);
      setApps(a);
      setMissing(false);
    } catch (e: any) {
      console.error('Careers admin load failed:', e);
      if (isMissingTable(e)) setMissing(true);
      else toast.error('Could not load careers data: ' + (e?.message || 'unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const appCount = useMemo(() => {
    const m: Record<string, number> = {};
    apps.forEach((a) => {
      if (a.jobId) m[a.jobId] = (m[a.jobId] || 0) + 1;
    });
    return m;
  }, [apps]);

  const filteredApps = apps.filter(
    (a) => (jobFilter === 'all' || a.jobId === jobFilter) && (statusFilter === 'all' || a.status === statusFilter)
  );
  const newCount = apps.filter((a) => a.status === 'new').length;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await saveJob(form);
      toast.success(form.id ? 'Role updated' : 'Role saved');
      setForm(null);
      await load();
    } catch (err: any) {
      toast.error('Could not save: ' + (err?.message || 'unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (job: Job) => {
    const next: JobStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      await setJobStatus(job.id, next);
      toast.success(next === 'open' ? 'Role is now live on the Careers page' : 'Role closed');
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Could not change status');
    }
  };

  const onDeleteJob = async (job: Job) => {
    if (!window.confirm(`Delete "${job.title}"? Applications for it are kept.`)) return;
    try {
      await deleteJob(job.id);
      toast.success('Role deleted');
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Could not delete');
    }
  };

  const onAppStatus = async (a: Application, status: ApplicationStatus) => {
    setApps((prev) => prev.map((x) => (x.id === a.id ? { ...x, status } : x)));
    try {
      await setApplicationStatus(a.id, status);
    } catch (err: any) {
      toast.error(err?.message || 'Could not update');
      await load();
    }
  };

  const onDeleteApp = async (a: Application) => {
    if (!window.confirm(`Delete the application from ${a.name}? This cannot be undone.`)) return;
    try {
      await deleteApplication(a.id);
      setApps((prev) => prev.filter((x) => x.id !== a.id));
      toast.success('Application deleted');
    } catch (err: any) {
      toast.error(err?.message || 'Could not delete');
    }
  };

  const exportCsv = () => {
    const head = ['Received', 'Role', 'Name', 'Email', 'Phone', 'LinkedIn', 'CV', 'Status', 'Message'];
    const rows = filteredApps.map((a) => [fmt(a.createdAt), a.jobTitle, a.name, a.email, a.phone, a.linkedinUrl, a.cvUrl, a.status, a.message]);
    const csv = [head, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const el = document.createElement('a');
    el.href = url;
    el.download = `applications-${new Date().toISOString().slice(0, 10)}.csv`;
    el.click();
    URL.revokeObjectURL(url);
  };

  if (missing) {
    return (
      <div className="bg-white border border-amber-200 rounded-2xl p-8 max-w-3xl">
        <h3 className="text-xl font-serif font-semibold text-slate-900 mb-3">Careers needs a one-time database setup</h3>
        <p className="text-slate-600 leading-relaxed">
          The tables for roles and applications do not exist yet. In your Supabase project open <b>SQL Editor</b>, create a new query,
          paste the contents of <code className="px-1.5 py-0.5 bg-slate-100 rounded text-sm">supabase-careers.sql</code> (in the project root) and press <b>Run</b>.
          Then reload this page.
        </p>
        <button onClick={load} className="mt-5 px-5 py-2.5 bg-[#0A1128] text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-brand-blue transition-colors">
          Check again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['roles', 'applications'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all ${tab === id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {id === 'roles' ? `Roles (${jobs.length})` : `Applications (${apps.length})${newCount ? ` · ${newCount} new` : ''}`}
            </button>
          ))}
        </div>
        {tab === 'roles' && !form && (
          <button onClick={() => setForm({ ...EMPTY_FORM })} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A1128] text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-brand-blue transition-colors">
            <Plus size={14} /> New role
          </button>
        )}
        {tab === 'applications' && (
          <button onClick={exportCsv} disabled={!filteredApps.length} className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 bg-white rounded-lg text-xs uppercase tracking-wider font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue transition-colors disabled:opacity-40">
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-500 py-10">Loading...</p>
      ) : tab === 'roles' ? (
        <>
          {form && (
            <form onSubmit={onSave} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5">
              <h3 className="text-xl font-serif font-semibold text-slate-900">{form.id ? 'Edit role' : 'New role'}</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={lbl}>Title *</label>
                  <input required maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} placeholder="e.g. Events and Community Coordinator" />
                </div>
                <div>
                  <label className={lbl}>Department / area</label>
                  <input maxLength={120} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className={field} placeholder="e.g. Culture, Business, Communications" />
                </div>
                <div>
                  <label className={lbl}>Location</label>
                  <input maxLength={120} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
                </div>
                <div>
                  <label className={lbl}>Type</label>
                  <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className={field}>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Apply by (optional)</label>
                  <input type="date" value={form.deadline ?? ''} onChange={(e) => setForm({ ...form, deadline: e.target.value || null })} className={field} />
                </div>
                <div className="md:col-span-2">
                  <label className={lbl}>Description</label>
                  <textarea rows={7} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} placeholder="What the role is about, main tasks, what you offer. Line breaks are kept." />
                </div>
                <div className="md:col-span-2">
                  <label className={lbl}>Requirements</label>
                  <textarea rows={5} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className={field} placeholder="Skills, languages, experience. Line breaks are kept." />
                </div>
                <div>
                  <label className={lbl}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })} className={field}>
                    <option value="draft">Draft (hidden)</option>
                    <option value="open">Open (visible on the Careers page)</option>
                    <option value="closed">Closed (hidden)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#0A1128] text-white rounded-lg text-xs uppercase tracking-wider font-semibold hover:bg-brand-blue transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save role'}
                </button>
                <button type="button" onClick={() => setForm(null)} className="px-6 py-2.5 border border-slate-300 rounded-lg text-xs uppercase tracking-wider font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {jobs.length === 0 && !form ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
              No roles yet. Click <b>New role</b> to add the first one.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
              {jobs.map((job) => (
                <div key={job.id} className="p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h4 className="text-lg font-serif font-semibold text-slate-900">{job.title}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold capitalize ${JOB_BADGE[job.status]}`}>{job.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {[job.department, job.location, job.employmentType].filter(Boolean).join(' · ')}
                      {job.deadline ? ` · apply by ${job.deadline}` : ''}
                      {` · ${appCount[job.id] || 0} application${(appCount[job.id] || 0) === 1 ? '' : 's'}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStatus(job)} title={job.status === 'open' ? 'Close role' : 'Publish role'} className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue">
                      {job.status === 'open' ? <><EyeOff size={14} /> Close</> : <><Eye size={14} /> Publish</>}
                    </button>
                    <button onClick={() => { setForm({ id: job.id, title: job.title, department: job.department, location: job.location, employmentType: job.employmentType, description: job.description, requirements: job.requirements, deadline: job.deadline, status: job.status }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:border-brand-blue hover:text-brand-blue">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => onDeleteJob(job)} className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-red-600 hover:border-red-300 hover:bg-red-50">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <select value={jobFilter} onChange={(e) => setJobFilter(e.target.value)} className={`${field} !w-auto min-w-[14rem]`}>
              <option value="all">All roles</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${field} !w-auto`}>
              <option value="all">All statuses</option>
              {APP_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">{s}</option>
              ))}
            </select>
          </div>

          {filteredApps.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">No applications yet.</div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-200">
              {filteredApps.map((a) => (
                <div key={a.id} className="p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-serif font-semibold text-slate-900">{a.name}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold capitalize ${APP_BADGE[a.status]}`}>{a.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {a.jobTitle || 'Role removed'} &middot; {fmt(a.createdAt)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 text-brand-blue hover:underline"><Mail size={14} /> {a.email}</a>
                        {a.phone && <span className="inline-flex items-center gap-1.5 text-slate-600"><Phone size={14} /> {a.phone}</span>}
                        {a.cvUrl && <a href={a.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-blue hover:underline"><ExternalLink size={14} /> CV</a>}
                        {a.linkedinUrl && <a href={a.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-blue hover:underline"><ExternalLink size={14} /> LinkedIn / portfolio</a>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select value={a.status} onChange={(e) => onAppStatus(a, e.target.value as ApplicationStatus)} className={`${field} !w-auto capitalize`}>
                        {APP_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button onClick={() => onDeleteApp(a)} title="Delete application" className="p-2.5 border border-slate-300 rounded-lg text-red-600 hover:border-red-300 hover:bg-red-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  {a.message && (
                    <div className="mt-4">
                      <p className={`text-sm text-slate-700 leading-relaxed whitespace-pre-line ${openApp === a.id ? '' : 'line-clamp-3'}`}>{a.message}</p>
                      {a.message.length > 220 && (
                        <button onClick={() => setOpenApp(openApp === a.id ? null : a.id)} className="mt-1 text-xs font-semibold text-brand-blue hover:underline">
                          {openApp === a.id ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
