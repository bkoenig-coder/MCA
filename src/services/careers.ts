import { supabase } from '../supabase';

export type JobStatus = 'draft' | 'open' | 'closed';
export type ApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'rejected';

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Volunteer', 'Contract'] as const;

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
  deadline: string | null;
  status: JobStatus;
  createdAt: string;
}

export interface JobInput {
  id?: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
  deadline: string | null;
  status: JobStatus;
}

export interface Application {
  id: string;
  jobId: string | null;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  cvUrl: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ApplicationInput {
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  cvUrl: string;
  message: string;
}

const toJob = (r: any): Job => ({
  id: r.id,
  title: r.title ?? '',
  department: r.department ?? '',
  location: r.location ?? '',
  employmentType: r.employment_type ?? '',
  description: r.description ?? '',
  requirements: r.requirements ?? '',
  deadline: r.deadline ?? null,
  status: r.status ?? 'draft',
  createdAt: r.created_at ?? '',
});

const toApplication = (r: any): Application => ({
  id: r.id,
  jobId: r.job_id ?? null,
  jobTitle: r.job_title ?? '',
  name: r.name ?? '',
  email: r.email ?? '',
  phone: r.phone ?? '',
  linkedinUrl: r.linkedin_url ?? '',
  cvUrl: r.cv_url ?? '',
  message: r.message ?? '',
  status: r.status ?? 'new',
  createdAt: r.created_at ?? '',
});

/** True when the careers tables have not been created yet (supabase-careers.sql not run). */
export function isMissingTable(error: any): boolean {
  const code = error?.code || '';
  const msg = String(error?.message || '');
  return code === '42P01' || code === 'PGRST205' || /does not exist|schema cache/i.test(msg);
}

/** Open roles whose deadline has not passed, newest first. */
export async function listOpenJobs(): Promise<Job[]> {
  const { data, error } = await supabase.from('jobs').select('*').eq('status', 'open').order('created_at', { ascending: false });
  if (error) throw error;
  const today = new Date().toISOString().slice(0, 10);
  return (data ?? []).map(toJob).filter((j) => !j.deadline || j.deadline >= today);
}

export async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase.from('jobs').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data ? toJob(data) : null;
}

export async function listAllJobs(): Promise<Job[]> {
  const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toJob);
}

export async function saveJob(input: JobInput): Promise<void> {
  const row = {
    title: input.title.trim(),
    department: input.department.trim(),
    location: input.location.trim(),
    employment_type: input.employmentType,
    description: input.description.trim(),
    requirements: input.requirements.trim(),
    deadline: input.deadline || null,
    status: input.status,
    updated_at: new Date().toISOString(),
  };
  const { error } = input.id
    ? await supabase.from('jobs').update(row).eq('id', input.id)
    : await supabase.from('jobs').insert(row);
  if (error) throw error;
}

export async function setJobStatus(id: string, status: JobStatus): Promise<void> {
  const { error } = await supabase.from('jobs').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw error;
}

export async function listApplications(): Promise<Application[]> {
  const { data, error } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toApplication);
}

export async function setApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  const { error } = await supabase.from('job_applications').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from('job_applications').delete().eq('id', id);
  if (error) throw error;
}

/** Stores the application, then (best effort) emails the team through the existing contact endpoint. */
export async function submitApplication(input: ApplicationInput): Promise<void> {
  const { error } = await supabase.from('job_applications').insert({
    job_id: input.jobId,
    job_title: input.jobTitle,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    linkedin_url: input.linkedinUrl.trim(),
    cv_url: input.cvUrl.trim(),
    message: input.message.trim(),
    status: 'new',
  });
  if (error) throw error;

  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: input.name,
        lastName: '',
        email: input.email,
        subject: `Job application: ${input.jobTitle}`,
        message: [
          `New application for "${input.jobTitle}"`,
          input.phone ? `Phone: ${input.phone}` : null,
          input.linkedinUrl ? `LinkedIn / portfolio: ${input.linkedinUrl}` : null,
          input.cvUrl ? `CV: ${input.cvUrl}` : null,
          '',
          input.message,
          '',
          'Manage applications in the admin dashboard (Careers tab).',
        ].filter((x) => x !== null).join('\n'),
      }),
    });
  } catch {
    /* The application is already saved; the email is only a courtesy notification. */
  }
}
