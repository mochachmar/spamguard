
import React, { useState } from 'react';
import { NotificationItem } from '../../types';
import { BellIcon, CloseIcon } from '../icons/InterfaceIcons';

const initialNotifications: NotificationItem[] = [
    { id: 1, title: 'System Alert', context: 'Context: Unusual login attempts detected. Action: IP address blocked. Outcome: Potential threat neutralized.', time: '10:30 AM - A critical system alert was triggered due to unusual activity. Our system automatically blocked the suspicious IP address to prevent potential threats.' },
    { id: 2, title: 'New Feature Available', context: 'Context: New feature release. Action: Feature automatically enabled. Outcome: Improved spam detection.', time: 'Yesterday, 2:45 PM - Our new feature, "Enhanced Spam Detection", is now available. This feature uses advanced algorithms to identify and filter out spam more effectively.' },
    { id: 3, title: 'Account Update', context: 'Context: Account settings updated. Action: Password reset and email preferences changed. Outcome: Account security enhanced.', time: '2 days ago, 9:15 AM - Your account settings have been successfully updated. Changes include password reset and email preferences.' },
    { id: 4, title: 'Security Notice', context: 'Context: Third-party service vulnerability. Action: Patches applied. Outcome: Data security maintained.', time: '3 days ago, 4:00 PM - A security notice regarding a potential vulnerability in a third-party service was issued. Our system has applied necessary patches to ensure your data remains secure.' },
    { id: 5, title: 'System Maintenance', context: 'Context: Scheduled maintenance. Action: System maintenance completed. Outcome: Services fully operational.', time: '4 days ago, 11:20 AM - Scheduled system maintenance was completed successfully. All services are now fully operational.' },
    { id: 6, title: 'New Report Available', context: 'Context: Weekly spam report. Action: Report generated. Outcome: Insights into spam activity.', time: '5 days ago, 9:00 AM - A new report detailing spam activity for the last week is now available. You can view the report in the "Reports" section.' },
    { id: 7, title: 'Account Verification', context: 'Context: Account verification. Action: Verification completed. Outcome: Full access granted.', time: '6 days ago, 10:00 AM - Your account verification process is complete. All features are now fully accessible.' },
    { id: 8, title: 'System Upgrade', context: 'Context: System upgrade. Action: Upgrade completed. Outcome: Improved performance and security.', time: '7 days ago, 1:15 PM - A system upgrade was performed to enhance performance and security. No disruptions were reported.' },
    { id: 9, title: 'New User Guide', context: 'Context: New user guide. Action: Guide published. Outcome: User onboarding support.', time: '8 days ago, 8:45 AM - A new user guide is available to help you get started with our services. Access it from the "Help" section.' },
    { id: 10, title: 'Feedback Request', context: 'Context: Feedback request. Action: Feedback requested. Outcome: User feedback collection.', time: '9 days ago, 5:20 PM - We value your feedback! Please share your thoughts on our services to help us improve.' },
];


const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState(initialNotifications);

    const removeNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>
            <div className="space-y-4">
                {notifications.map(notification => (
                    <div key={notification.id} className="bg-white p-5 rounded-lg shadow-sm flex items-start space-x-4">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <BellIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold text-gray-800">{notification.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.context}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                        </div>
                        <button onClick={() => removeNotification(notification.id)} className="text-gray-400 hover:text-gray-600">
                            <CloseIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
                {notifications.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No new notifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
