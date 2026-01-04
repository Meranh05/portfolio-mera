"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MailOpen, Trash2, Clock, User, MessageSquare, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useClickEffect } from "@/hooks/use-click-effect"
import { getMessages, markMessageAsRead, deleteMessage, type ContactMessage } from "@/lib/portfolio-store"

function MessagesPageContent() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const { createParticles } = useClickEffect()

  useEffect(() => {
    setMessages(getMessages())
  }, [])

  const handleRefresh = (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    setMessages(getMessages())
    toast.success("Đã làm mới danh sách!")
  }

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.read) {
      const newMessages = await markMessageAsRead(message.id)
      setMessages(newMessages)
    }
  }

  const handleDeleteMessage = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    createParticles(e, "confetti")
    const newMessages = await deleteMessage(id)
    setMessages(newMessages)
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
    toast.success("Đã xóa tin nhắn!")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tin nhắn liên hệ</h1>
            <p className="text-muted-foreground">
              {messages.length} tin nhắn • {unreadCount} chưa đọc
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Message List */}
          <div className="space-y-4">
            {messages.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Chưa có tin nhắn nào</p>
                </CardContent>
              </Card>
            ) : (
              messages.map((message) => (
                <Card
                  key={message.id}
                  className={`bg-card border-border cursor-pointer transition-all hover:border-primary/50 ${selectedMessage?.id === message.id ? "ring-2 ring-primary" : ""
                    } ${!message.read ? "border-l-4 border-l-primary" : ""}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${message.read ? "bg-secondary" : "bg-primary/20"
                            }`}
                        >
                          {message.read ? (
                            <MailOpen className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Mail className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${message.read ? "text-foreground" : "text-primary"}`}>
                              {message.name}
                            </h3>
                            {!message.read && <Badge className="bg-primary/20 text-primary text-xs">Mới</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{message.subject}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={(e) => handleDeleteMessage(e, message.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Message Detail */}
          {selectedMessage && (
            <Card className="bg-card border-border h-fit sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  Chi tiết tin nhắn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Từ:</span>
                    <span className="text-foreground font-medium">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Chủ đề:</span>
                    <span className="text-foreground">{selectedMessage.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thời gian:</span>
                    <span className="text-foreground">{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="text-sm text-muted-foreground mb-2 block">Nội dung:</label>
                  <div className="bg-secondary rounded-lg p-4 text-foreground whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={() => (window.location.href = `mailto:${selectedMessage.email}`)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Trả lời
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                    Đóng
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesPageContent />
    </Suspense>
  )
}
