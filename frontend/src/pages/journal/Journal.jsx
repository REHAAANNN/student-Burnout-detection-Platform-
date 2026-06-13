import { useEffect, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Button } from '../../components/ui/Button'
import { TextArea } from '../../components/ui/TextArea'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Loader } from '../../components/common/Loader'
import { EmptyState } from '../../components/common/EmptyState'
import { journalService } from '../../services/journalService'
import { useAuthStore } from '../../store/authStore'
import { formatDate } from '../../utils'
import { BookOpen } from 'lucide-react'

/**
 * Journal page
 */
export const Journal = () => {
  const [entries, setEntries] = useState([])
  const [newEntry, setNewEntry] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setIsLoading(true)
        const data = await journalService.getEntries(user?.id || user?._id)
        setEntries(data)
      } catch (error) {
        toast.error('Failed to load entries')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()

    if (!newEntry.trim()) {
      toast.error('Please write something')
      return
    }

    setIsSaving(true)
    try {
      const entry = await journalService.saveEntry(newEntry, user?.id || user?._id)
      setEntries([entry, ...entries])
      setNewEntry('')
      toast.success('Entry saved successfully!')
    } catch (error) {
      toast.error('Failed to save entry')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await journalService.deleteEntry(id)
        setEntries(entries.filter((e) => e.id !== id))
        toast.success('Entry deleted')
      } catch (error) {
        toast.error('Failed to delete entry')
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Journal</h1>
          <p className="text-gray-600 dark:text-gray-400">Express yourself and track your feelings</p>
        </div>

        {/* Write New Entry */}
        <Card className="shadow-md-soft">
          <CardHeader>
            <CardTitle>Write a New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <TextArea
                label="What's on your mind?"
                placeholder="Write freely about your feelings, thoughts, or experiences..."
                maxLength={5000}
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                showCharCount
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Entries List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Entries</h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No entries yet"
              description="Start journaling to express your thoughts and feelings. This is your safe space."
              action={<p className="text-sm text-gray-500">Write your first entry above</p>}
            />
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md-soft transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(entry.date)}
                      </p>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-danger-600 hover:text-danger-700 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
