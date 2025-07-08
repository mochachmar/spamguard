
export interface Notification {
  id: number;
  type: 'Warning' | 'Info' | 'Alert';
  description: string;
  date: string;
}

export interface Message {
  id: string;
  sender: string;
  category: 'Spam' | 'Non-Spam';
  fraudType?: 'Phishing' | 'Malware' | 'Scams' | 'Other' | 'N/A';
  date: string;
  status: 'Detected' | 'Not Detected';
  content: string;
  fromEmail: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  context: string;
  time: string;
}
