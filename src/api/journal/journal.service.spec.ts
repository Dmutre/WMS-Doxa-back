import { Test, TestingModule } from '@nestjs/testing';
import { UserAction } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateUserActionData,
  FindUserActionsParams,
  UserActionOrderColumn,
} from 'src/lib/types/journal/user-action';
import { JournalService } from './journal.service';

describe('JournalService', () => {
  let journalService: JournalService;
  let prismaService: PrismaService;

  const mockUserAction: UserAction = {
    id: '1',
    userId: null,
    payload: { key: 'value' },
    action: 'create',
    ip: '14.2.32.124',
    createdAt: new Date(),
  };

  const mockPrismaService = {
    userAction: {
      create: jest.fn(() => Promise.resolve(mockUserAction)),
      findUnique: jest.fn(() => Promise.resolve(mockUserAction)),
      update: jest.fn(() => Promise.resolve(mockUserAction)),
      delete: jest.fn(() => Promise.resolve(mockUserAction)),
      findMany: jest.fn(() => Promise.resolve([mockUserAction])),
      count: jest.fn(() => Promise.resolve(1)),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    journalService = module.get<JournalService>(JournalService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(journalService).toBeDefined();
  });

  describe('createUserAction', () => {
    it('should record user action', async () => {
      const createUserActionDto: CreateUserActionData = {
        userId: null,
        ip: '127.0.0.1',
        action: 'create',
        payload: { key: 'value' },
      };

      const result = await journalService.createUserAction(createUserActionDto);
      expect(result).toEqual(mockUserAction);
      expect(prismaService.userAction.create).toHaveBeenCalledWith({
        data: createUserActionDto,
      });
    });
  });

  describe('findUserActions', () => {
    it('should return a list of user actions', async () => {
      const params: FindUserActionsParams = {
        ip: '135.11.23.45',
        userId: null,
        createdAtFrom: new Date(),
        createdAtTo: new Date(),
        action: 'create',
        page: 1,
        pageSize: 10,
        orderBy: UserActionOrderColumn.CREATED_AT,
        orderDirection: 'asc',
      };

      const result = await journalService.findUserActions(params);
      expect(result).toEqual({
        data: [mockUserAction],
        total: 1,
      });
      expect(prismaService.userAction.findMany).toHaveBeenCalled();
      expect(prismaService.userAction.count).toHaveBeenCalled();
    });
  });
});
