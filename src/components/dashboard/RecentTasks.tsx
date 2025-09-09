'use client'

import { CheckCircle, Circle, Clock, AlertCircle, Plus } from 'lucide-react'
import { DashboardMode } from '@/types/dashboard'
import { useState } from 'react'

interface RecentTasksProps {
  mode: DashboardMode
}

interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
  dueDate?: string
}

const privateTasks: Task[] = [
  { id: '1', title: 'Morning workout', priority: 'high', status: 'completed' },
  { id: '2', title: 'Read 30 pages', priority: 'medium', status: 'in-progress' },
  { id: '3', title: 'Call family', priority: 'high', status: 'todo', dueDate: 'Today' },
  { id: '4', title: 'Plan weekend trip', priority: 'low', status: 'todo' },
]

const workTasks: Task[] = [
  { id: '1', title: 'Client presentation', priority: 'high', status: 'completed' },
  { id: '2', title: 'Follow up with leads', priority: 'medium', status: 'in-progress' },
  { id: '3', title: 'Update project timeline', priority: 'high', status: 'todo', dueDate: 'Today' },
  { id: '4', title: 'Team meeting prep', priority: 'low', status: 'todo' },
]

export default function RecentTasks({ mode }: RecentTasksProps) {
  const [tasks, setTasks] = useState(mode === 'private' ? privateTasks : workTasks)
  const [newTask, setNewTask] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'todo' : 'completed'
        return { ...task, status: newStatus }
      }
      return task
    }))
  }

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        title: newTask,
        priority: 'medium',
        status: 'todo'
      }
      setTasks([...tasks, newTaskObj])
      setNewTask('')
      setShowAddTask(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowAddTask(!showAddTask)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </button>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all
          </button>
        </div>
      </div>

      {showAddTask && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <button
              onClick={addTask}
              className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <button onClick={() => toggleTaskStatus(task.id)}>
              {getStatusIcon(task.status)}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </p>
              {task.dueDate && (
                <p className="text-xs text-red-600">{task.dueDate}</p>
              )}
            </div>
            {getPriorityIcon(task.priority)}
          </div>
        ))}
      </div>
    </div>
  )
}
