import React, { useState } from 'react';
import { CONFIG } from '../../utils/config';

export const MailClient: React.FC = () => {
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SENT'>('IDLE');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('SENDING');
        setTimeout(() => {
            setStatus('SENT');
            setTimeout(() => setStatus('IDLE'), 3000);
        }, 1500);
    };

    return (
        <div className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="mr-2">{'>'}</span> MAIL_CLIENT
            </h2>

            <div className="border border-terminal-dim p-4 max-w-4xl">
                <div className="flex border-b border-terminal-dim pb-2 mb-4">
                    <span className="w-24 text-terminal-dim">To:</span>
                    <span>{CONFIG.personal.email}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center">
                        <span className="w-24 text-terminal-dim">Subject:</span>
                        <input
                            type="text"
                            className="bg-transparent border-b border-terminal-dim focus:border-terminal-green outline-none flex-1 text-terminal-green"
                            placeholder="Connection Request"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <textarea
                            className="w-full h-32 bg-transparent border border-terminal-dim p-2 focus:border-terminal-green outline-none resize-none"
                            placeholder="Enter message body..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={status !== 'IDLE'}
                            className="border border-terminal-green px-4 py-1 hover:bg-terminal-green hover:text-terminal-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'IDLE' && '[ SEND_MAIL ]'}
                            {status === 'SENDING' && '[ ENCRYPTING... ]'}
                            {status === 'SENT' && '[ SENT_SUCCESSFULLY ]'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
