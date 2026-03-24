import React, { useState } from 'react'
import { Search, BookOpen, HelpCircle, MessageSquare, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create a new ticket?',
    answer: 'To create a new ticket, click the "Create Ticket" button in the dashboard. Fill in the title, description, priority, and category. You can also assign it to a team member if needed.',
    category: 'Tickets'
  },
  {
    id: '2',
    question: 'How do I update ticket status?',
    answer: 'Open the ticket detail view and use the status dropdown to change the ticket status. Available statuses are: Open, In Progress, Resolved, and Closed.',
    category: 'Tickets'
  },
  {
    id: '3',
    question: 'How do I add internal notes to a ticket?',
    answer: 'In the ticket detail view, scroll to the "Internal Notes" section. Type your note in the text area and click "Add Note". Internal notes are only visible to HR team members.',
    category: 'Tickets'
  },
  {
    id: '4',
    question: 'How do I view analytics?',
    answer: 'Navigate to the Analytics tab in the sidebar. You\'ll see charts showing ticket statistics, resolution times, and team performance metrics.',
    category: 'Analytics'
  },
  {
    id: '5',
    question: 'How do I search for employees?',
    answer: 'Use the Directory tab to search and filter employees by name, department, or role. You can also view detailed employee information and contact details.',
    category: 'Directory'
  },
  {
    id: '6',
    question: 'How do I manage user roles?',
    answer: 'Go to Role Management in the sidebar (admin only). You can assign roles, set permissions, and manage user access levels.',
    category: 'Roles'
  },
  {
    id: '7',
    question: 'How do I view audit logs?',
    answer: 'Access the Audit Log tab to see a chronological record of all system activities, including ticket changes, user actions, and system events.',
    category: 'Audit'
  },
  {
    id: '8',
    question: 'What are ticket priorities?',
    answer: 'Tickets have three priority levels: Low (green), Medium (yellow), and High (red). High priority tickets are automatically escalated if not addressed within 24 hours.',
    category: 'Tickets'
  },
  {
    id: '9',
    question: 'How do I use the mobile app?',
    answer: 'The HRMS is fully responsive and works on mobile devices. Use the hamburger menu to access navigation on smaller screens.',
    category: 'General'
  },
  {
    id: '10',
    question: 'How do I export ticket data?',
    answer: 'In the Analytics section, you can export ticket reports and statistics. Contact your administrator for custom export requirements.',
    category: 'Analytics'
  }
]

const categories = ['All', 'General', 'Tickets', 'Analytics', 'Directory', 'Roles', 'Audit']

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <HelpCircle className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Help & FAQ</h1>
        </div>
        <p className="text-gray-600">Find answers to common questions and learn how to use the HRMS system</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">User Guide</h3>
            <p className="text-sm text-gray-600">Complete system documentation</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Contact Support</h3>
            <p className="text-sm text-gray-600">Get help from our team</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Video Tutorials</h3>
            <p className="text-sm text-gray-600">Step-by-step video guides</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No FAQs found matching your search.</p>
            </div>
          ) : (
            filteredFAQs.map(faq => (
              <Collapsible key={faq.id}>
                <CollapsibleTrigger
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    </div>
                    {expandedItems.has(faq.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? Contact our support team for personalized assistance.
          </p>
          <Button className="bg-yellow-600 hover:bg-yellow-700">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}