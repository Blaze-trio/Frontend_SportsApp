import { useState, useEffect, useCallback } from 'react';
import { sportingClubService, SportingClubDB } from '@/lib/db';

type Sport = SportingClubDB['sports']['value'];
type Member = SportingClubDB['members']['value'];
type Subscription = SportingClubDB['subscriptions']['value'];

export const useSportingClub = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await sportingClubService.init();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setIsLoading(false);
      }
    };

    initDB();
  }, []);

  const executeOperation = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    if (!isInitialized) {
      setError('Database not initialized');
      return null;
    }

    try {
      setError(null);
      return await operation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      return null;
    }
  }, [isInitialized]);

  return {
    isInitialized,
    isLoading,
    error,
    setError,
    executeOperation,
  };
};

export const useSports = () => {
  const { executeOperation, ...rest } = useSportingClub();
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSports = useCallback(async () => {
    setLoading(true);
    const result = await executeOperation(() => sportingClubService.getAllSports());
    if (result) setSports(result);
    setLoading(false);
  }, [executeOperation]);

  const addSport = useCallback(async (sportData: Omit<Sport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await executeOperation(() => sportingClubService.addSport(sportData));
    if (result) {
      await loadSports();
    }
    return result;
  }, [executeOperation, loadSports]);

  const deleteSport = useCallback(async (id: string) => {
    const result = await executeOperation(() => sportingClubService.deleteSport(id));
    if (result !== null) {
      await loadSports();
    }
    return result;
  }, [executeOperation, loadSports]);

  useEffect(() => {
    if (rest.isInitialized) {
      loadSports();
    }
  }, [rest.isInitialized, loadSports]);

  return {
    ...rest,
    sports,
    loading,
    loadSports,
    addSport,
    deleteSport,
  };
};

export const useMembers = () => {
  const { executeOperation, ...rest } = useSportingClub();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const result = await executeOperation(() => sportingClubService.getAllMembers());
    if (result) setMembers(result);
    setLoading(false);
  }, [executeOperation]);

  const addMember = useCallback(async (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await executeOperation(() => sportingClubService.addMember(memberData));
    if (result) {
      await loadMembers();
    }
    return result;
  }, [executeOperation, loadMembers]);

  const deleteMember = useCallback(async (id: string) => {
    const result = await executeOperation(() => sportingClubService.deleteMember(id));
    if (result !== null) {
      await loadMembers();
    }
    return result;
  }, [executeOperation, loadMembers]);

  useEffect(() => {
    if (rest.isInitialized) {
      loadMembers();
    }
  }, [rest.isInitialized, loadMembers]);

  return {
    ...rest,
    members,
    loading,
    loadMembers,
    addMember,
    deleteMember,
  };
};

export const useSubscriptions = () => {
  const { executeOperation, ...rest } = useSportingClub();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    const result = await executeOperation(() => sportingClubService.getAllSubscriptions());
    if (result) setSubscriptions(result.filter(sub => sub.status === 'active'));
    setLoading(false);
  }, [executeOperation]);

  const subscribeMemberToSport = useCallback(async (memberId: string, sportId: string) => {
    const result = await executeOperation(() => 
      sportingClubService.subscribeMemberToSport(memberId, sportId)
    );
    if (result) {
      await loadSubscriptions();
    }
    return result;
  }, [executeOperation, loadSubscriptions]);

  const cancelSubscription = useCallback(async (memberId: string, sportId: string) => {
    const result = await executeOperation(() => 
      sportingClubService.cancelSubscription(memberId, sportId)
    );
    if (result) {
      await loadSubscriptions();
    }
    return result;
  }, [executeOperation, loadSubscriptions]);

  const getMemberSubscriptions = useCallback(async (memberId: string) => {
    return await executeOperation(() => sportingClubService.getMemberSubscriptions(memberId));
  }, [executeOperation]);

  useEffect(() => {
    if (rest.isInitialized) {
      loadSubscriptions();
    }
  }, [rest.isInitialized, loadSubscriptions]);

  return {
    ...rest,
    subscriptions,
    loading,
    loadSubscriptions,
    subscribeMemberToSport,
    cancelSubscription,
    getMemberSubscriptions,
  };
};
