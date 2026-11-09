export type Message = {
  id: string
  content: string
  senderId: string
  senderDisplayName: string
  senderImageUrl: string
  recipientId: string
  recipientDisplayName: string
  recipientImageUrl: string
  dateRead?: string
  messageSent: string
  currentUserSender?: boolean
}