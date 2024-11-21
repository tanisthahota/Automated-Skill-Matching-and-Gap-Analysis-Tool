export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  matchRate: number;
  posted: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'recruiter';
}

export interface Resume {
  id: string;
  fileName: string;
  uploadDate: string;
  skills: string[];
  matchRate: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  matchRate: number;
  posted: string;
  applicationStatus?: {
    applied: boolean;
    status?: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
    applicationDate?: string;
    resumeName?: string;
  };
}

export interface ApplicationStatus {
  applied: boolean;
  status?: 'Pending' | 'Under Review' | 'Accepted' | 'Rejected';
  applicationDate?: string;
  resumeName?: string;
}
export interface Skill {
  id: string;
  name: string;
  type: string;
}

export interface Resume {
  id: string;
  userId: string;
  skillName: string;
  skillType: string;
  fileName: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  date: string;
}

export interface Skill {
  name: string;
  match: number;
}

export interface JobDescription {
  id: string;
  name: string;
  location: string;
  role: string;
  skillName: string;
}
export interface JobListProps {
  jobs: Job[];
  onApply: (jobId: string) => Promise<void>;
  onShowDetails: (job: Job) => void;
}

export interface CourseRecommendation {
  Skill_Name: string;
  Job_Name: string;
  matchRate: number;
}

export interface SkillMatch {
  id: string;
  resumeId: string;
  jobDescriptionId: string;
  matchStatus: string;
  skillGap: string;
}

export interface CourseRecommendation {
  id: string;
  skillGap: string;
  courseName: string;
  courseLink: string;
}