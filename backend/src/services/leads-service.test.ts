import { LeadsService } from '../services/leads-service';

describe('LeadsService', () => {
  let leadsService: LeadsService;

  beforeEach(() => {
    leadsService = new LeadsService();
  });

  describe('create', () => {
    it('should create a new lead with id and createdAt', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        source: 'website',
      };

      const lead = await leadsService.create(leadData);

      expect(lead).toHaveProperty('id');
      expect(lead).toHaveProperty('createdAt');
      expect(lead.name).toBe('John Doe');
      expect(lead.email).toBe('john@example.com');
      expect(lead.phone).toBe('123456789');
      expect(lead.source).toBe('website');
    });

    it('should generate unique IDs for different leads', async () => {
      const lead1 = await leadsService.create({ name: 'Lead 1' });
      const lead2 = await leadsService.create({ name: 'Lead 2' });

      expect(lead1.id).not.toBe(lead2.id);
    });

    it('should set createdAt to current date', async () => {
      const beforeCreation = new Date().toISOString();
      const lead = await leadsService.create({ name: 'Test Lead' });
      const afterCreation = new Date().toISOString();

      expect(new Date(lead.createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeCreation).getTime()
      );
      expect(new Date(lead.createdAt).getTime()).toBeLessThanOrEqual(
        new Date(afterCreation).getTime()
      );
    });

    it('should accept optional fields', async () => {
      const leadData = {
        name: 'Minimal Lead',
      };

      const lead = await leadsService.create(leadData);

      expect(lead.name).toBe('Minimal Lead');
      expect(lead.email).toBeUndefined();
      expect(lead.phone).toBeUndefined();
      expect(lead.source).toBeUndefined();
    });
  });

  describe('list', () => {
    it('should return empty array initially', async () => {
      const leads = await leadsService.list();

      expect(leads).toEqual([]);
      expect(Array.isArray(leads)).toBe(true);
    });

    it('should return all created leads', async () => {
      await leadsService.create({ name: 'Lead 1' });
      await leadsService.create({ name: 'Lead 2' });
      await leadsService.create({ name: 'Lead 3' });

      const leads = await leadsService.list();

      expect(leads).toHaveLength(3);
      expect(leads[0].name).toBe('Lead 1');
      expect(leads[1].name).toBe('Lead 2');
      expect(leads[2].name).toBe('Lead 3');
    });

    it('should return leads in insertion order', async () => {
      const lead1 = await leadsService.create({ name: 'First' });
      const lead2 = await leadsService.create({ name: 'Second' });

      const leads = await leadsService.list();

      expect(leads[0].id).toBe(lead1.id);
      expect(leads[1].id).toBe(lead2.id);
    });
  });
});
