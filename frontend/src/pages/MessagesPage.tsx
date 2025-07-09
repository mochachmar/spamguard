
import React, { useState } from 'react';
import { Message } from '../../types';
import { SearchIcon, ChevronDownIcon } from '../components/icons/InterfaceIcons';

const mockMessages: Message[] = [
    { id: 'MSG001', sender: 'Jack', category: 'Spam', date: '2024-01-15', status: 'Detected', fromEmail: 'jack.s@example.com', content: 'Hello, I hope this message finds you well. I am writing to you regarding our upcoming meeting scheduled for next week. Please find attached the agenda for your review. Let me know if you have any questions or need further clarification. Best regards, Alice' },
    { id: 'MSG002', sender: 'Sinder', category: 'Suspicious', date: '2024-01-16', status: 'Not Detected', fromEmail: 'sinder@corp.com', content: 'This is a legitimate business proposal.' },
    { id: 'MSG003', sender: 'Jackleon', category: 'Spam', date: '2024-01-17', status: 'Detected', fromEmail: 'jackleon.scam@phish.net', content: 'URGENT: Your account has been compromised! Click here to verify.' },
    { id: 'MSG004', sender: 'Sindefire', category: 'Suspicious', date: '2024-01-18', status: 'Not Detected', fromEmail: 'sindefire@workplace.io', content: 'Reminder: Team meeting at 3 PM today.' },
    { id: 'MSG005', sender: 'Juventus', category: 'Spam', date: '2024-01-19', status: 'Detected', fromEmail: 'juventus.lotto@winner.org', content: 'Congratulations! You have won a lottery.' },
    { id: 'MSG006', sender: 'Airref', category: 'Suspicious', date: '2024-01-20', status: 'Not Detected', fromEmail: 'support@airref.com', content: 'Your support ticket has been updated.' },
    { id: 'MSG007', sender: 'Popol', category: 'Spam', date: '2024-01-21', status: 'Detected', fromEmail: 'popol.deals@shopnow.biz', content: 'Exclusive deals just for you! 90% OFF!' },
    { id: 'MSG008', sender: 'Kupa', category: 'Suspicious', date: '2024-01-22', status: 'Not Detected', fromEmail: 'kupa.news@newsletter.com', content: 'Your weekly newsletter is here.' },
    { id: 'MSG009', sender: 'Roger', category: 'Spam', date: '2024-01-23', status: 'Detected', fromEmail: 'roger.ph@malwarelink.co', content: 'Download this file for important information.' },
    { id: 'MSG010', sender: 'Wonder', category: 'Suspicious', date: '2024-01-24', status: 'Not Detected', fromEmail: 'noreply@wonder.app', content: 'Your password has been successfully reset.' },
    { id: 'MSG011', sender: 'Another User', category: 'Suspicious', date: '2024-01-25', status: 'Not Detected', fromEmail: 'user@example.com', content: 'Following up on our conversation.' },
    { id: 'MSG012', sender: 'Spammy McSpamface', category: 'Spam', date: '2024-01-26', status: 'Detected', fromEmail: 'buy.now@spam.com', content: 'You are pre-approved for a loan!' },
    { id: 'MSG013', sender: 'Prince Najim', category: 'Spam', date: '2024-01-27', status: 'Detected', fromEmail: 'prince.najim@royal-wealth.net', content: 'Greetings, I have a business proposition worth millions for you.' },
    { id: 'MSG014', sender: 'ShipFast', category: 'Suspicious', date: '2024-01-28', status: 'Not Detected', fromEmail: 'tracking@shipfast.com', content: 'Your package with tracking number SF123456 has been dispatched.' },
    { id: 'MSG015', sender: 'Jane Doe', category: 'Suspicious', date: '2024-01-29', status: 'Not Detected', fromEmail: 'jane.doe@personal.com', content: 'Hey, are you free for a call sometime this week?' },
    { id: 'MSG016', sender: 'IT Support', category: 'Spam', date: '2024-01-30', status: 'Detected', fromEmail: 'support@your-service-update.com', content: 'Action Required: Your mailbox is almost full. Upgrade now to avoid service disruption.' },
    { id: 'MSG017', sender: 'QuickMeds', category: 'Spam', date: '2024-01-31', status: 'Detected', fromEmail: 'deals@quickmeds-rx.info', content: 'Unbelievable discounts on all your favorite medication. Order now!' },
    { id: 'MSG018', sender: 'The Coffee Club', category: 'Suspicious', date: '2024-02-01', status: 'Not Detected', fromEmail: 'newsletter@thecoffeeclub.com', content: 'February Brews: Discover our new single-origin roasts.' },
    { id: 'MSG019', sender: 'SocialConnect', category: 'Suspicious', date: '2024-02-02', status: 'Not Detected', fromEmail: 'notification@socialconnect.com', content: 'You have a new friend request from John Smith.' },
    { id: 'MSG020', sender: 'Secure Bank', category: 'Spam', date: '2024-02-03', status: 'Detected', fromEmail: 'alert@secure-bank-inc.com', content: 'We have detected a suspicious login attempt on your account. Please login here to verify your identity.' },
    { id: 'MSG021', sender: 'Project Team', category: 'Suspicious', date: '2024-02-04', status: 'Not Detected', fromEmail: 'project-updates@work.com', content: 'The project timeline has been updated. Please see the attached document.' },
    { id: 'MSG022', sender: 'Online Casino', category: 'Spam', date: '2024-02-05', status: 'Detected', fromEmail: 'winner@online-casino-paradise.net', content: 'Claim your 200 free spins today! No deposit required.' },
    { id: 'MSG023', sender: 'HR Department', category: 'Suspicious', date: '2024-02-06', status: 'Not Detected', fromEmail: 'hr@yourcompany.com', content: 'Reminder: Please submit your timesheets for the previous month.' },
    { id: 'MSG024', sender: 'Cloud Storage', category: 'Spam', date: '2024-02-07', status: 'Detected', fromEmail: 'action@cloud-storage-team.com', content: 'Your cloud storage is full. Your files will be deleted in 24 hours unless you upgrade.' },
    { id: 'MSG025', sender: 'Local Gym', category: 'Suspicious', date: '2024-02-08', status: 'Not Detected', fromEmail: 'info@localgym.com', content: 'New Year, New You! Check out our new class schedule.' },
    { id: 'MSG026', sender: 'IRS', category: 'Spam', date: '2024-02-09', status: 'Detected', fromEmail: 'notice@irs-tax-collection.org', content: 'Final Warning: There is a warrant for your arrest due to unpaid taxes. Contact us immediately.' },
    { id: 'MSG027', sender: 'Travel Deals', category: 'Spam', date: '2024-02-10', status: 'Detected', fromEmail: 'fly@cheap-air-tickets.biz', content: 'Error fare to Hawaii! Book now for only $99.' }
];

const StatusBadge: React.FC<{ status: Message['status'] | Message['category'] }> = ({ status }) => {
    const isSpamOrDetected = status === 'Spam' || status === 'Detected';
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full leading-tight";
    const styles = isSpamOrDetected ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
    return <span className={`${baseClasses} ${styles}`}>{status}</span>;
}

const MessageDetails: React.FC<{ message: Message | null }> = ({ message }) => {
    if (!message) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm h-full flex items-center justify-center">
                <p className="text-gray-500">Select a message to see details</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Message Details</h3>
            <div className="space-y-3 text-sm">
                <p className="text-gray-900"><span className="font-semibold text-gray-900">From:</span> {message.fromEmail}</p>
                <p className="text-gray-900"><span className="font-semibold text-gray-900">Date:</span> {message.date}</p>
                <p className="text-gray-900"><span className="font-semibold text-gray-900">Category:</span> {message.category}</p>
                <p className="text-gray-900"><span className="font-semibold text-gray-900">Status:</span> {message.status}</p>
            </div>
            <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">Message Content</h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border">{message.content}</p>
            </div>
            <div className="mt-6 bg-gray-50 p-4 rounded-md border flex items-center justify-center">
                 <img src="https://picsum.photos/seed/document/300/400" alt="Document preview" className="rounded-md shadow-md"/>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
                <button className="px-4 py-2 bg-slate-700 text-white text-sm font-medium rounded-md hover:bg-slate-600">Edit</button>
                <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-500">Delete</button>
            </div>
        </div>
    );
};


const MessagesPage: React.FC = () => {
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(mockMessages[0]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="mt-1 text-gray-600">View all messages received and processed by the system.</p>
            </div>
            <div className="flex gap-8">
                <div className="w-full lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-sm flex flex-col">
                        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-200">
                            <div className="relative w-full sm:w-auto flex-grow max-w-xs">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input type="text" placeholder="Search messages" className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" />
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Category <ChevronDownIcon className="h-4 w-4" /></button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Fraud Type <ChevronDownIcon className="h-4 w-4" /></button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Date <ChevronDownIcon className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="overflow-auto max-h-[calc(100vh-24rem)]">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        {['Message ID', 'Sender', 'Category', 'Date of Receipt', 'Status', 'Action'].map(header => (
                                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mockMessages.map((message) => (
                                        <tr key={message.id} className={`${selectedMessage?.id === message.id ? 'bg-indigo-50' : ''} hover:bg-gray-50`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{message.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.sender}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={message.category} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{message.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={message.status} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setSelectedMessage(message)} className="text-indigo-600 hover:text-indigo-900">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block w-1/3">
                     <MessageDetails message={selectedMessage} />
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
