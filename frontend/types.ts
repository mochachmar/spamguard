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
}

export interface NotificationItem {
  id: number;
  title: string;
  context: string;
  time: string;
}