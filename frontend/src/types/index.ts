export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  password: string;
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

export interface JobDescription {
  id: string;
  name: string;
  location: string;
  role: string;
  skillName: string;
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