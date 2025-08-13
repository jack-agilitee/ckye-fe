import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    developerStats: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('/api/developer-statistics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/developer-statistics', () => {
    it('should return developer statistics for a workspace', async () => {
      const mockData = [
        {
          id: '1',
          user: 'john-doe',
          workspaceId: 'workspace-123',
          prNumber: 42,
          mergedDate: new Date('2024-01-15'),
          estimatedTime: 5.5,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          user: 'jane-smith',
          workspaceId: 'workspace-123',
          prNumber: 43,
          mergedDate: new Date('2024-01-16'),
          estimatedTime: 3.0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      prisma.$transaction.mockResolvedValue([mockData, 2]);

      const request = new NextRequest('http://localhost:3000/api/developer-statistics?workspaceId=workspace-123&page=1&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('meta');
      expect(data.data).toEqual(mockData);
      expect(data.meta.page).toBe(1);
      expect(data.meta.limit).toBe(10);
      expect(data.meta.total).toBe(2);
      expect(data.meta.workspaceId).toBe('workspace-123');
    });

    it('should return 400 if workspaceId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/developer-statistics');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('workspaceId parameter is required');
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('should handle pagination parameters', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      const request = new NextRequest('http://localhost:3000/api/developer-statistics?workspaceId=workspace-123&page=2&limit=5');
      const response = await GET(request);
      await response.json();

      expect(response.status).toBe(200);
      expect(prisma.$transaction).toHaveBeenCalled();
      const [[findManyCall]] = prisma.$transaction.mock.calls;
      expect(findManyCall).toBe(prisma.developerStats.findMany({
        where: { workspaceId: 'workspace-123' },
        skip: 5,
        take: 5,
        orderBy: { mergedDate: 'desc' },
        select: expect.any(Object)
      }));
    });

    it('should handle sorting parameters', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      const request = new NextRequest('http://localhost:3000/api/developer-statistics?workspaceId=workspace-123&sortBy=estimatedTime&sortOrder=asc');
      await GET(request);

      const [[findManyCall]] = prisma.$transaction.mock.calls;
      expect(findManyCall).toBe(prisma.developerStats.findMany({
        where: { workspaceId: 'workspace-123' },
        skip: 0,
        take: 10,
        orderBy: { estimatedTime: 'asc' },
        select: expect.any(Object)
      }));
    });

    it('should handle database errors gracefully', async () => {
      prisma.$transaction.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/developer-statistics?workspaceId=workspace-123');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch developer statistics');
    });
  });

  describe('POST /api/developer-statistics', () => {
    const validData = {
      user: 'john-doe',
      workspaceId: 'workspace-123',
      prNumber: 42,
      mergedDate: '2024-01-15T10:00:00Z',
      estimatedTime: 5.5
    };

    it('should create a new developer statistic', async () => {
      const createdStat = {
        id: '1',
        ...validData,
        mergedDate: new Date(validData.mergedDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      prisma.developerStats.create.mockResolvedValue(createdStat);

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(createdStat);
      expect(prisma.developerStats.create).toHaveBeenCalledWith({
        data: {
          user: validData.user,
          workspaceId: validData.workspaceId,
          prNumber: validData.prNumber,
          mergedDate: new Date(validData.mergedDate),
          estimatedTime: validData.estimatedTime
        },
        select: expect.any(Object)
      });
    });

    it('should create without estimatedTime', async () => {
      const dataWithoutTime = {
        user: 'john-doe',
        workspaceId: 'workspace-123',
        prNumber: 42,
        mergedDate: '2024-01-15T10:00:00Z'
      };

      const createdStat = {
        id: '1',
        ...dataWithoutTime,
        estimatedTime: null,
        mergedDate: new Date(dataWithoutTime.mergedDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      prisma.developerStats.create.mockResolvedValue(createdStat);

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(dataWithoutTime),
      });

      const response = await POST(request);
      
      expect(response.status).toBe(201);
      expect(prisma.developerStats.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          estimatedTime: null
        }),
        select: expect.any(Object)
      });
    });

    it('should return 400 for missing user', async () => {
      const invalidData = { ...validData };
      delete invalidData.user;

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('User (GitHub username) is required');
      expect(prisma.developerStats.create).not.toHaveBeenCalled();
    });

    it('should return 400 for missing workspaceId', async () => {
      const invalidData = { ...validData };
      delete invalidData.workspaceId;

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Workspace ID is required');
    });

    it('should return 400 for invalid prNumber', async () => {
      const invalidData = { ...validData, prNumber: 'not-a-number' };

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('PR number is required and must be a number');
    });

    it('should return 400 for invalid mergedDate', async () => {
      const invalidData = { ...validData, mergedDate: 'invalid-date' };

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid merged date format');
    });

    it('should return 400 for invalid estimatedTime', async () => {
      const invalidData = { ...validData, estimatedTime: 'not-a-number' };

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Estimated time must be a number');
    });

    it('should handle unique constraint violations', async () => {
      const error = new Error('Unique constraint failed');
      error.code = 'P2002';
      prisma.developerStats.create.mockRejectedValue(error);

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.error).toBe('A developer stat with these unique fields already exists');
    });

    it('should handle database errors gracefully', async () => {
      prisma.developerStats.create.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/developer-statistics', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create developer statistics');
    });
  });
});