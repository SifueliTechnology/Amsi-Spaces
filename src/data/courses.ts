// Courses tab + homepage "Tools & courses" seed data. Simple shape so this
// file can be edited directly to change what shows on both the homepage and
// /resources?tab=courses without touching any component code.
// Placeholder entries — swap for real affiliate partners once signed.

export interface CourseEntry {
  name: string;
  blurb: string;
  price?: string;
  href: string;
}

export const courses: CourseEntry[] = [
  {
    name: 'Off-Plan Investing 101',
    blurb: 'A partner-run video course for first-time buyers.',
    href: '/go/course-offplan-101',
  },
  {
    name: 'Understanding Payment Plans',
    blurb: 'A short course on schedule vs ratio payment plans.',
    href: '/go/course-payment-plans',
  },
];
