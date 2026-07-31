'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Tag, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useLabels } from '@/hooks/useLabels';
import { useTasks } from '@/hooks/useTasks';

const COLOR_OPTIONS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

export default function LabelsPage() {
  const { labels = [], isLoading, createLabel, updateLabel, deleteLabel, isCreating, isUpdating } = useLabels();
  const { tasks = [] } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);

  const [name, setName] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const handleOpenCreate = () => {
    setEditingLabel(null);
    setName('');
    setColor('#3B82F6');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (label) => {
    setEditingLabel(label);
    setName(label.name || '');
    setColor(label.color || '#3B82F6');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingLabel) {
      await updateLabel(editingLabel.id, {
        name: name.trim(),
        color,
      });
    } else {
      await createLabel({
        name: name.trim(),
        color,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this label?')) {
      await deleteLabel(id);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Labels</h1>
          <p className="text-muted-foreground mt-1">Categorize your tasks with colorful tags</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus size={18} />
          New Label
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : labels.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Tag size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-lg font-semibold mb-1">No Labels Found</p>
            <p className="text-sm text-muted-foreground mb-6">Create labels like Bug, Feature, Urgent, or Personal.</p>
            <Button onClick={handleOpenCreate}>Create Label</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {labels.map((label) => {
            const usageCount = tasks.filter(
              (t) => Array.isArray(t.labels) && (t.labels.includes(label.id) || t.labels.includes(label.name))
            ).length;

            return (
              <Card key={label.id} className="group hover:border-primary/50 transition-all p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm flex items-center gap-1.5"
                      style={{ backgroundColor: label.color || '#3B82F6' }}
                    >
                      <Tag size={12} />
                      {label.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleOpenEdit(label)}>
                      <Edit2 size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleDelete(label.id)}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Used in <strong className="text-foreground">{usageCount}</strong> {usageCount === 1 ? 'task' : 'tasks'}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingLabel ? 'Edit Label' : 'Create New Label'}</DialogTitle>
            <DialogDescription>Set a name and badge color for your tag.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Label Name</label>
              <input
                type="text"
                placeholder="e.g. Design, Urgent, Feature"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Badge Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      color === c ? 'scale-125 ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating || !name.trim()}>
                {isCreating || isUpdating ? 'Saving...' : editingLabel ? 'Save Changes' : 'Create Label'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
