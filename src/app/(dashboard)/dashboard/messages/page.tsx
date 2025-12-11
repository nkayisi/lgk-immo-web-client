"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
  File,
  Smile,
  ArrowLeft,
  Building2,
  MapPin,
  MessageSquare,
  Archive,
  Trash2,
  Star,
  StarOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// =============================================================================
// TYPES
// =============================================================================

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: {
    type: "image" | "file";
    url: string;
    name: string;
  }[];
}

interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string;
    online: boolean;
  };
  property?: {
    id: string;
    title: string;
    price: string;
    image?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
  unreadCount: number;
  isStarred: boolean;
  messages: Message[];
}

// =============================================================================
// DONNÉES FICTIVES
// =============================================================================

const currentUserId = "current-user";

const mockConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      id: "user-1",
      name: "Jean Kabongo",
      online: true,
    },
    property: {
      id: "prop-1",
      title: "Villa moderne avec piscine",
      price: "450,000 USD",
    },
    lastMessage: {
      content: "Bonjour, est-ce que le bien est toujours disponible ?",
      timestamp: "2024-02-15T10:30:00",
      isRead: false,
      senderId: "user-1",
    },
    unreadCount: 2,
    isStarred: true,
    messages: [
      {
        id: "m1",
        content: "Bonjour, je suis intéressé par votre villa.",
        senderId: "user-1",
        timestamp: "2024-02-15T10:00:00",
        status: "read",
      },
      {
        id: "m2",
        content:
          "Bonjour ! Oui, elle est toujours disponible. Souhaitez-vous organiser une visite ?",
        senderId: currentUserId,
        timestamp: "2024-02-15T10:15:00",
        status: "read",
      },
      {
        id: "m3",
        content: "Oui, ce serait parfait. Quelles sont vos disponibilités ?",
        senderId: "user-1",
        timestamp: "2024-02-15T10:25:00",
        status: "read",
      },
      {
        id: "m4",
        content: "Bonjour, est-ce que le bien est toujours disponible ?",
        senderId: "user-1",
        timestamp: "2024-02-15T10:30:00",
        status: "delivered",
      },
    ],
  },
  {
    id: "2",
    participant: {
      id: "user-2",
      name: "Marie Lumumba",
      online: false,
    },
    property: {
      id: "prop-2",
      title: "Appartement de standing",
      price: "1,500 USD/mois",
    },
    lastMessage: {
      content: "Merci pour les informations !",
      timestamp: "2024-02-14T16:45:00",
      isRead: true,
      senderId: "user-2",
    },
    unreadCount: 0,
    isStarred: false,
    messages: [
      {
        id: "m5",
        content: "Bonjour, l'appartement est-il meublé ?",
        senderId: "user-2",
        timestamp: "2024-02-14T14:00:00",
        status: "read",
      },
      {
        id: "m6",
        content:
          "Oui, il est entièrement meublé avec des équipements modernes.",
        senderId: currentUserId,
        timestamp: "2024-02-14T14:30:00",
        status: "read",
      },
      {
        id: "m7",
        content: "Merci pour les informations !",
        senderId: "user-2",
        timestamp: "2024-02-14T16:45:00",
        status: "read",
      },
    ],
  },
  {
    id: "3",
    participant: {
      id: "user-3",
      name: "Pierre Mukendi",
      online: true,
    },
    lastMessage: {
      content: "Je vous envoie les documents demandés.",
      timestamp: "2024-02-13T09:20:00",
      isRead: true,
      senderId: currentUserId,
    },
    unreadCount: 0,
    isStarred: false,
    messages: [
      {
        id: "m8",
        content: "Pouvez-vous m'envoyer les documents de propriété ?",
        senderId: "user-3",
        timestamp: "2024-02-13T09:00:00",
        status: "read",
      },
      {
        id: "m9",
        content: "Je vous envoie les documents demandés.",
        senderId: currentUserId,
        timestamp: "2024-02-13T09:20:00",
        status: "read",
        attachments: [
          {
            type: "file",
            url: "/documents/titre.pdf",
            name: "titre_propriete.pdf",
          },
        ],
      },
    ],
  },
];

// =============================================================================
// COMPOSANTS
// =============================================================================

function ConversationItem({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("fr-FR", { weekday: "short" });
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left",
        isSelected && "bg-emerald-50 hover:bg-emerald-50"
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={conversation.participant.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
            {conversation.participant.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        {conversation.participant.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900 truncate">
              {conversation.participant.name}
            </span>
            {conversation.isStarred && (
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            )}
          </div>
          <span className="text-xs text-slate-400">
            {formatTime(conversation.lastMessage.timestamp)}
          </span>
        </div>

        {conversation.property && (
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
            <Building2 className="w-3 h-3" />
            <span className="truncate">{conversation.property.title}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-sm truncate",
              conversation.unreadCount > 0
                ? "text-slate-900 font-medium"
                : "text-slate-500"
            )}
          >
            {conversation.lastMessage.senderId === currentUserId && (
              <span className="text-slate-400">Vous: </span>
            )}
            {conversation.lastMessage.content}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge className="ml-2 h-5 min-w-5 px-1.5 bg-emerald-500">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <Check className="w-3 h-3 text-slate-400" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3 text-slate-400" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-emerald-500" />;
      default:
        return <Clock className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex", isOwn ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2.5",
          isOwn
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-br-md"
            : "bg-white border border-slate-200 text-slate-900 rounded-bl-md"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg",
                  isOwn ? "bg-white/20" : "bg-slate-50"
                )}
              >
                {attachment.type === "image" ? (
                  <ImageIcon className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
                <span className="text-xs truncate">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            isOwn ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-xs",
              isOwn ? "text-white/70" : "text-slate-400"
            )}
          >
            {formatTime(message.timestamp)}
          </span>
          {isOwn && <StatusIcon />}
        </div>
      </div>
    </motion.div>
  );
}

function ChatHeader({
  conversation,
  onBack,
}: {
  conversation: Conversation;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.participant.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
            {conversation.participant.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h3 className="font-semibold text-slate-900">
            {conversation.participant.name}
          </h3>
          <p className="text-xs text-slate-500">
            {conversation.participant.online ? (
              <span className="text-emerald-600">En ligne</span>
            ) : (
              "Hors ligne"
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="w-5 h-5 text-slate-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="w-5 h-5 text-slate-500" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Info className="w-4 h-4 mr-2" />
              Voir le profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              {conversation.isStarred ? (
                <>
                  <StarOff className="w-4 h-4 mr-2" />
                  Retirer des favoris
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Ajouter aux favoris
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              Archiver
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Conversation["property"] }) {
  if (!property) return null;

  return (
    <div className="mx-4 my-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center">
          <Building2 className="w-6 h-6 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">
            {property.title}
          </p>
          <p className="text-sm text-emerald-600 font-semibold">
            {property.price}
          </p>
        </div>
        <Button variant="outline" size="sm">
          Voir
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Sélectionnez une conversation
        </h3>
        <p className="text-slate-500 max-w-sm">
          Choisissez une conversation dans la liste pour commencer à discuter.
        </p>
      </div>
    </div>
  );
}

function NoConversations() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Aucun message
        </h3>
        <p className="text-slate-500 max-w-sm">
          Vous n&apos;avez pas encore de conversations. Les messages liés à vos
          annonces apparaîtront ici.
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================

export default function MessagesPage() {
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Logique d'envoi du message
    console.log("Send message:", newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        style={{ height: "calc(100vh - 180px)", minHeight: "600px" }}
      >
        <div className="flex h-full">
          {/* Conversations List */}
          <div
            className={cn(
              "w-full md:w-96 border-r border-slate-200 flex flex-col",
              showMobileChat && "hidden md:flex"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
              <h1 className="text-xl font-bold text-slate-900 mb-4">
                Messages
              </h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1">
              {filteredConversations.length === 0 ? (
                <NoConversations />
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isSelected={selectedConversation?.id === conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !showMobileChat && "hidden md:flex"
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <ChatHeader
                  conversation={selectedConversation}
                  onBack={() => setShowMobileChat(false)}
                />

                {/* Property Card */}
                {selectedConversation.property && (
                  <PropertyCard property={selectedConversation.property} />
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === currentUserId}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex items-end gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                    >
                      <Paperclip className="w-5 h-5 text-slate-500" />
                    </Button>
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Écrivez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="min-h-[44px] max-h-32 resize-none pr-12"
                        rows={1}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 bottom-1"
                      >
                        <Smile className="w-5 h-5 text-slate-500" />
                      </Button>
                    </div>
                    <Button
                      variant="primary"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
