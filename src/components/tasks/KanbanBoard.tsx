'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  Check, 
  Filter, 
  ArrowUpDown, 
  Zap, 
  Grid3X3, 
  MoreHorizontal,
  Plus,
  MessageCircle,
  Paperclip,
  ThumbsUp,
  User,
  GripVertical,
  Edit2,
  Save,
  X
} from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'
import { useLanguage } from '@/contexts/LanguageContext'

interface KanbanBoardProps {
  mode: DashboardMode
}

interface Task {
  id: string
  title: string
  status: 'started' | 'not-started' | 'done'
  priority: 'P1' | 'P2' | 'P3'
  assignedUser?: {
    name: string
    avatar: string
  }
  dateRange?: string
  comments?: number
  attachments?: number
  likes?: number
  category?: string
  image?: string
  columnId: string
}

const sampleTasks: Task[] = [
  // November Column
  {
    id: '1',
    title: 'New user templates',
    status: 'started',
    priority: 'P1',
    assignedUser: { name: 'John Doe', avatar: '/api/placeholder/32/32' },
    dateRange: 'Dec 2-7',
    comments: 2,
    attachments: 1,
    columnId: 'november'
  },
  {
    id: '2',
    title: 'Mobile app',
    status: 'started',
    priority: 'P1',
    assignedUser: { name: 'Jane Smith', avatar: '/api/placeholder/32/32' },
    dateRange: 'Dec 4',
    comments: 5,
    attachments: 3,
    image: 'mobile-app-preview',
    columnId: 'november'
  },
  {
    id: '3',
    title: 'New pricing',
    status: 'started',
    priority: 'P2',
    assignedUser: { name: 'Mike Johnson', avatar: '/api/placeholder/32/32' },
    dateRange: 'Dec 6-10',
    comments: 1,
    attachments: 2,
    columnId: 'november'
  },
  
  // December Column
  {
    id: '4',
    title: 'Back-end speed enhancements',
    status: 'started',
    priority: 'P1',
    assignedUser: { name: 'Sarah Wilson', avatar: '/api/placeholder/32/32' },
    dateRange: 'Jan 4',
    comments: 3,
    attachments: 4,
    columnId: 'december'
  },
  {
    id: '5',
    title: 'Custom reporting',
    status: 'not-started',
    priority: 'P2',
    assignedUser: { name: 'Tom Brown', avatar: '/api/placeholder/32/32' },
    dateRange: 'Jan 8-12',
    comments: 1,
    attachments: 2,
    columnId: 'december'
  },
  {
    id: '6',
    title: 'Offline mode',
    status: 'not-started',
    priority: 'P1',
    assignedUser: { name: 'Lisa Davis', avatar: '/api/placeholder/32/32' },
    dateRange: 'Jan 15',
    comments: 4,
    attachments: 1,
    columnId: 'december'
  },
  {
    id: '7',
    title: 'User community launch',
    status: 'started',
    priority: 'P2',
    assignedUser: { name: 'Alex Green', avatar: '/api/placeholder/32/32' },
    dateRange: 'Jan 20-25',
    comments: 7,
    attachments: 5,
    image: 'community-preview',
    columnId: 'december'
  },
  
  // January Column
  {
    id: '8',
    title: 'Upgrade payment options',
    status: 'not-started',
    priority: 'P1',
    assignedUser: { name: 'Emma White', avatar: '/api/placeholder/32/32' },
    dateRange: 'Feb 1-5',
    comments: 2,
    attachments: 3,
    columnId: 'january'
  },
  {
    id: '9',
    title: 'In-product education',
    status: 'not-started',
    priority: 'P2',
    assignedUser: { name: 'David Lee', avatar: '/api/placeholder/32/32' },
    dateRange: 'Feb 8',
    comments: 1,
    attachments: 1,
    columnId: 'january'
  },
  {
    id: '10',
    title: 'App design refresh',
    status: 'not-started',
    priority: 'P3',
    assignedUser: { name: 'Anna Taylor', avatar: '/api/placeholder/32/32' },
    dateRange: 'Feb 12-18',
    comments: 3,
    attachments: 2,
    columnId: 'january'
  },
  
  // Done Column
  {
    id: '11',
    title: 'Mobile notifications',
    status: 'done',
    priority: 'P1',
    assignedUser: { name: 'Chris Miller', avatar: '/api/placeholder/32/32' },
    dateRange: 'Nov 15-20',
    comments: 2,
    attachments: 1,
    columnId: 'done'
  },
  {
    id: '12',
    title: 'Localization',
    status: 'done',
    priority: 'P2',
    assignedUser: { name: 'Maria Garcia', avatar: '/api/placeholder/32/32' },
    dateRange: 'Nov 22-28',
    comments: 4,
    attachments: 3,
    columnId: 'done'
  },
  {
    id: '13',
    title: 'New product line',
    status: 'done',
    priority: 'P1',
    assignedUser: { name: 'James Wilson', avatar: '/api/placeholder/32/32' },
    dateRange: 'Nov 30',
    comments: 6,
    attachments: 4,
    columnId: 'done'
  },
  {
    id: '14',
    title: 'Accessibility updates',
    status: 'done',
    priority: 'P3',
    assignedUser: { name: 'Rachel Kim', avatar: '/api/placeholder/32/32' },
    dateRange: 'Dec 1-3',
    comments: 1,
    attachments: 2,
    columnId: 'done'
  }
]

const columns = [
  { id: 'november', title: 'November' },
  { id: 'december', title: 'December' },
  { id: 'january', title: 'January' },
  { id: 'done', title: 'Done' }
]

function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-500 text-white'
      case 'P2': return 'bg-orange-500 text-white'
      case 'P3': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'started': return 'bg-blue-500 text-white'
      case 'not-started': return 'bg-gray-500 text-white'
      case 'done': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'started': return 'Started'
      case 'not-started': return 'Not started'
      case 'done': return 'Done'
      default: return status
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'shadow-lg rotate-2 opacity-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Task Image (if exists) */}
      {task.image === 'mobile-app-preview' && (
        <div className="mb-3 -mx-4 -mt-4">
          <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
            <div className="w-16 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xs text-gray-600">📱</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {task.image === 'community-preview' && (
        <div className="mb-3 -mx-4 -mt-4">
          <div className="h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-t-lg flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      )}

      {/* Task Title */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm leading-tight">
          {task.status === 'done' && <Check className="h-4 w-4 text-green-500 inline mr-2" />}
          {task.title}
        </h4>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center space-x-2 mb-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {getStatusText(task.status)}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {/* Assigned User and Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-3 w-3 text-white" />
          </div>
          <span className="text-xs text-gray-600">{task.assignedUser?.name}</span>
        </div>
        {task.dateRange && (
          <span className="text-xs text-gray-500">{task.dateRange}</span>
        )}
      </div>

      {/* Engagement Metrics */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {task.comments && (
            <div className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-3 w-3" />
              <span className="text-xs">{task.comments}</span>
            </div>
          )}
          {task.attachments && (
            <div className="flex items-center space-x-1 text-gray-500">
              <Paperclip className="h-3 w-3" />
              <span className="text-xs">{task.attachments}</span>
            </div>
          )}
          {task.likes && (
            <div className="flex items-center space-x-1 text-gray-500">
              <ThumbsUp className="h-3 w-3" />
              <span className="text-xs">{task.likes}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function KanbanBoard({ mode }: KanbanBoardProps) {
  const { t } = useLanguage()
  const [tasks, setTasks] = useState(sampleTasks)
  const [completedToday, setCompletedToday] = useState(2)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [columnTitles, setColumnTitles] = useState({
    november: t.tasks.columns.november,
    december: t.tasks.columns.december, 
    january: t.tasks.columns.january,
    done: t.tasks.columns.done
  })
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  const handleEditColumnTitle = (columnId: string) => {
    setEditingColumn(columnId)
    setEditTitle(columnTitles[columnId as keyof typeof columnTitles])
  }

  const handleSaveColumnTitle = (columnId: string) => {
    if (editTitle.trim()) {
      setColumnTitles(prev => ({
        ...prev,
        [columnId]: editTitle.trim()
      }))
    }
    setEditingColumn(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingColumn(null)
    setEditTitle('')
  }

  const handleKeyPress = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === 'Enter') {
      handleSaveColumnTitle(columnId)
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeTask = tasks.find(task => task.id === active.id)
    if (!activeTask) return

    // Determine new column based on over element
    let newColumnId = activeTask.columnId
    
    // Check if we're dropping on a column
    if (over.id === 'november' || over.id === 'december' || over.id === 'january' || over.id === 'done') {
      newColumnId = over.id as string
    } else {
      // Check if we're dropping on another task
      const overTask = tasks.find(task => task.id === over.id)
      if (overTask) {
        newColumnId = overTask.columnId
      }
    }

    if (newColumnId !== activeTask.columnId) {
      // Update task status based on new column
      const newStatus = newColumnId === 'done' ? 'done' : 
                       newColumnId === 'november' ? 'started' :
                       newColumnId === 'december' ? 'started' :
                       newColumnId === 'january' ? 'not-started' : 'started'

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === active.id ? { ...task, columnId: newColumnId, status: newStatus } : task
        )
      )

      // Update completed today counter
      if (newColumnId === 'done' && activeTask.columnId !== 'done') {
        setCompletedToday(prev => prev + 1)
      } else if (activeTask.columnId === 'done' && newColumnId !== 'done') {
        setCompletedToday(prev => Math.max(0, prev - 1))
      }
    }
  }

  const getTasksForColumn = (columnId: string) => {
    return tasks.filter(task => task.columnId === columnId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <span className="text-sm text-gray-600">{completedToday} tasks completed today</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Check className="h-4 w-4" />
            <span>All tasks</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Zap className="h-4 w-4" />
            <span>Rules</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Grid3X3 className="h-4 w-4" />
            <span>Fields</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {columns.map((column) => {
            const columnTasks = getTasksForColumn(column.id)
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 group">
                  {/* Column Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2 flex-1">
                      {editingColumn === column.id ? (
                        <div className="flex items-center space-x-2 flex-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyPress(e, column.id)}
                            className="font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-0.5"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveColumnTitle(column.id)}
                            className="p-1 text-green-600 hover:text-green-700"
                            title={t.tasks.saveColumnTitle}
                          >
                            <Save className="h-3 w-3" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:text-red-700"
                            title={t.tasks.cancelEdit}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 flex-1">
                          <h3 className="font-semibold text-gray-900">{columnTitles[column.id as keyof typeof columnTitles]}</h3>
                          <button
                            onClick={() => handleEditColumnTitle(column.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title={t.tasks.editColumnTitle}
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="p-4 space-y-4 min-h-[200px]">
                    <SortableContext items={columnTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                      {columnTasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} />
                      ))}
                    </SortableContext>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg rotate-2 opacity-90">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 text-sm leading-tight mb-3">
                {activeTask.status === 'done' && <Check className="h-4 w-4 text-green-500 inline mr-2" />}
                {activeTask.title}
              </h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}