import type { Client, Interaction, Negotiation } from './types';
import { PlaceHolderImages } from './placeholder-images';

const randomAvatar = () => {
    const avatars = PlaceHolderImages.filter(img => img.id.startsWith('avatar'));
    return avatars[Math.floor(Math.random() * avatars.length)].imageUrl;
}

export const CLIENTS: Client[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', company: 'Innovate Corp', avatarUrl: randomAvatar(), status: 'Negotiating', tags: ['enterprise', 'q2-target'], createdAt: '2023-05-10' },
  { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', company: 'Tech Solutions', avatarUrl: randomAvatar(), status: 'Won', tags: ['smb', 'fast-close'], createdAt: '2023-04-22' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.b@example.com', company: 'Data Systems', avatarUrl: randomAvatar(), status: 'Lead', tags: ['new-lead'], createdAt: '2023-05-18' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', company: 'Future Gadgets', avatarUrl: randomAvatar(), status: 'Contacted', tags: ['follow-up'], createdAt: '2023-05-01' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan.h@example.com', company: 'SecureNet', avatarUrl: randomAvatar(), status: 'Lost', tags: ['competitor'], createdAt: '2023-03-15' },
  { id: '6', name: 'Fiona Glenanne', email: 'fiona.g@example.com', company: 'Global Exports', avatarUrl: randomAvatar(), status: 'Negotiating', tags: ['international', 'high-value'], createdAt: '2023-05-05' },
  { id: '7', name: 'George Costanza', email: 'george.c@example.com', company: 'Vandelay Industries', avatarUrl: randomAvatar(), status: 'Lead', tags: ['new-lead'], createdAt: '2023-05-20' },
  { id: '8', name: 'Hannah Abbott', email: 'hannah.a@example.com', company: 'Magic Foods', avatarUrl: randomAvatar(), status: 'Contacted', tags: ['referral'], createdAt: '2023-05-12' },
];

export const INTERACTIONS: Interaction[] = [
  { id: 'int1', clientId: '1', date: '2023-05-15', notes: 'Initial demo call. Client was impressed with features A and B. Follow up next week with a quote.', summary: 'Positive demo call.' },
  { id: 'int2', clientId: '2', date: '2023-04-25', notes: 'Contract signed. Onboarding scheduled.', summary: 'Deal closed.' },
  { id: 'int3', clientId: '4', date: '2023-05-03', notes: 'Sent follow-up email with pricing information. Awaiting response.', summary: 'Emailed pricing.' },
  { id: 'int4', clientId: '6', date: '2023-05-11', notes: 'Negotiation call. Discussed pricing tiers and support packages.', summary: 'Price negotiation.' },
];

export const NEGOTIATIONS: Negotiation[] = [
  { id: 'neg1', clientId: '1', clientName: 'Alice Johnson', status: 'Active', agreementDetails: 'Discussing Enterprise Plan with 15% discount.', lastUpdated: '2023-05-15' },
  { id: 'neg2', clientId: '6', clientName: 'Fiona Glenanne', status: 'Active', agreementDetails: 'Finalizing terms for global license.', lastUpdated: '2023-05-11' },
  { id: 'neg3', clientId: '2', clientName: 'Bob Williams', status: 'Closed - Won', agreementDetails: 'SMB Plan, 2-year contract.', lastUpdated: '2023-04-25' },
  { id: 'neg4', clientId: '5', clientName: 'Ethan Hunt', status: 'Closed - Lost', agreementDetails: 'Client chose competitor due to pricing.', lastUpdated: '2023-03-15' },
  { id: 'neg5', clientId: '4', clientName: 'Diana Prince', status: 'Pending', agreementDetails: 'Awaiting client feedback on initial proposal.', lastUpdated: '2023-05-03' },
];
