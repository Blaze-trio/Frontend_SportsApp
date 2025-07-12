import React, { useState, useEffect } from 'react';
import { useSubscriptions, useMembers, useSports } from '@/hooks/useSportingClub';
import { sportingClubService } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, UserCheck, X, Users, Trophy } from 'lucide-react';

interface MemberWithSports {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sports: Array<{ id: string; name: string; category: string }>;
}

const SubscriptionsPage: React.FC = () => {
  const { subscriptions, subscribeMemberToSport, cancelSubscription, loading: subscriptionsLoading, error, isInitialized } = useSubscriptions();
  const { members, loading: membersLoading } = useMembers();
  const { sports, loading: sportsLoading } = useSports();
  
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [membersWithSports, setMembersWithSports] = useState<MemberWithSports[]>([]);
  const [formError, setFormError] = useState('');

  // Load members with their sports
  useEffect(() => {
    const loadMembersWithSports = async () => {
      if (!isInitialized || members.length === 0) return;

      const membersData = await Promise.all(
        members.map(async (member) => {
          const memberWithSports = await sportingClubService.getMemberWithSports(member.id);
          return {
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            sports: memberWithSports?.sports?.filter(sport => sport !== undefined).map(sport => ({
              id: sport.id,
              name: sport.name,
              category: sport.category
            })) || [],
          };
        })
      );
      setMembersWithSports(membersData);
    };

    loadMembersWithSports();
  }, [members, subscriptions, isInitialized]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedMember || !selectedSport) {
      setFormError('Please select both a member and a sport');
      return;
    }

    const result = await subscribeMemberToSport(selectedMember, selectedSport);
    if (result) {
      setSelectedMember('');
      setSelectedSport('');
      setShowForm(false);
    }
  };

  const handleCancelSubscription = async (memberId: string, sportId: string) => {
    await cancelSubscription(memberId, sportId);
  };

  const resetForm = () => {
    setSelectedMember('');
    setSelectedSport('');
    setFormError('');
    setShowForm(false);
  };

  // Get available sports for selected member (sports they're not subscribed to)
  const getAvailableSports = () => {
    if (!selectedMember) return sports;
    
    const memberSports = membersWithSports.find(m => m.id === selectedMember)?.sports || [];
    const memberSportIds = memberSports.map(s => s.id);
    
    return sports.filter(sport => !memberSportIds.includes(sport.id));
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const isLoading = subscriptionsLoading || membersLoading || sportsLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">Manage member sport subscriptions</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="gap-2"
          disabled={members.length === 0 || sports.length === 0}
        >
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Subscription'}
        </Button>
      </div>

      {/* Show message if no members or sports */}
      {(members.length === 0 || sports.length === 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <Trophy className="h-5 w-5" />
              <p className="font-medium">
                {members.length === 0 && sports.length === 0 
                  ? 'You need to add members and sports before creating subscriptions.'
                  : members.length === 0 
                  ? 'You need to add members before creating subscriptions.'
                  : 'You need to add sports before creating subscriptions.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Subscription Form */}
      {showForm && members.length > 0 && sports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Subscription</CardTitle>
            <CardDescription>Subscribe a member to a sport</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member *</label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName} ({member.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sport *</label>
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSports().map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.name} ({sport.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}

              {selectedMember && getAvailableSports().length === 0 && (
                <p className="text-sm text-orange-600">
                  This member is already subscribed to all available sports.
                </p>
              )}

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={!selectedMember || !selectedSport || getAvailableSports().length === 0}
                >
                  Subscribe Member
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Members with Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Member Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading subscriptions...</span>
            </div>
          ) : membersWithSports.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No members found.</p>
              <p className="text-sm text-muted-foreground">Add some members first to manage subscriptions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {membersWithSports.map((member) => (
                <Card key={member.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {member.firstName} {member.lastName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <Badge variant="outline">
                        {member.sports.length} sport{member.sports.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {member.sports.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Not subscribed to any sports</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {member.sports.map((sport) => (
                          <div key={sport.id} className="flex items-center gap-1">
                            <Badge variant="secondary" className="gap-1">
                              {sport.name}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5">
                                    <X className="h-3 w-3" />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel {member.firstName} {member.lastName}'s subscription to {sport.name}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleCancelSubscription(member.id, sport.id)}>
                                      Cancel Subscription
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsPage;