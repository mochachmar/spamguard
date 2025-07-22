export interface Notification {
  id: number;
  type: 'Warning' | 'Info' | 'Alert';
  description: string;
  date: string;
}

export interface Message {
  id: string;
  category: 'Fraud' | 'SPAM' | 'Hoax' | 'Mencurigakan';
  fraudType: 'Phishing' | 'Malware' | 'Scams' | 'Other';
  date: string;
  content: string;
  imageUrl?: string; 
}

export interface NotificationItem {
  id: number;
  title: string;
  context: string;
  time: string;
}

export interface BotSettings {
  minCharLength: number;
  activeHours: { 
    start: number; 
    end: number;   
  };
  botActions?: {
    deleteMessage: boolean;
    blockUser: boolean;
    deleteAllMessages: boolean;
    reportToTelegram: boolean;
    restrictUser: boolean;
  };
  enableMessageNotifications?: boolean;
}

