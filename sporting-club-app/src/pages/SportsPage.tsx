import React, { useState } from 'react';
import { useSports } from '@/hooks/useSportingClub';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Trash2, Users } from 'lucide-react';

const SportsPage: React.FC = () => {
  const { sports, addSport, deleteSport, loading, error, isInitialized } = useSports();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    maxMembers: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Sport name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    if (formData.maxMembers && isNaN(Number(formData.maxMembers))) {
      errors.maxMembers = 'Max members must be a number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const sportData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      ...(formData.maxMembers && { maxMembers: Number(formData.maxMembers) }),
    };

    const result = await addSport(sportData);
    if (result) {
      setFormData({ name: '', description: '', category: '', maxMembers: '' });
      setFormErrors({});
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    await deleteSport(id);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', category: '', maxMembers: '' });
    setFormErrors({});
    setShowForm(false);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sports</h1>
          <p className="text-muted-foreground">Manage sports offered by your club</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          {showForm ? 'Cancel' : 'Add Sport'}
        </Button>
      </div>

      {/* Add Sport Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Sport</CardTitle>
            <CardDescription>Create a new sport for your club members</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Sport Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Football"
                    className={formErrors.name ? 'border-destructive' : ''}
                  />
                  {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className={formErrors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Team Sports">Team Sports</SelectItem>
                      <SelectItem value="Individual Sports">Individual Sports</SelectItem>
                      <SelectItem value="Racquet Sports">Racquet Sports</SelectItem>
                      <SelectItem value="Water Sports">Water Sports</SelectItem>
                      <SelectItem value="Combat Sports">Combat Sports</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the sport"
                  className={formErrors.description ? 'border-destructive' : ''}
                  rows={3}
                />
                {formErrors.description && <p className="text-sm text-destructive">{formErrors.description}</p>}
              </div>

              <div className="md:w-1/2 space-y-2">
                <Label htmlFor="maxMembers">Max Members (Optional)</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                  placeholder="e.g., 25"
                  min="1"
                  className={formErrors.maxMembers ? 'border-destructive' : ''}
                />
                {formErrors.maxMembers && <p className="text-sm text-destructive">{formErrors.maxMembers}</p>}
              </div>

              <div className="flex gap-2">
                <Button type="submit">Add Sport</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Sports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Sports ({sports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading sports...</span>
            </div>
          ) : sports.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sports added yet.</p>
              <p className="text-sm text-muted-foreground">Click "Add Sport" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sports.map((sport) => (
                <Card key={sport.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{sport.name}</CardTitle>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Sport</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{sport.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(sport.id, sport.name)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {sport.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">{sport.description}</p>
                    {sport.maxMembers && (
                      <p className="text-sm text-muted-foreground">
                        Max Members: {sport.maxMembers}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Added: {sport.createdAt.toLocaleDateString()}
                    </p>
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

export default SportsPage;