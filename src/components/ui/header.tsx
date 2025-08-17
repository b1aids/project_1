import React from 'react';

const Header = ({ title, onBack, showBackButton }) => (
    <header className="flex items-center justify-between p-4 w-full flex-shrink-0">
        <div className="flex items-center space-x-4">
            {showBackButton && (
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
            )}
            <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></button>
            <button className="p-2 rounded-full hover:bg-gray-700 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
        </div>
    </header>
);

export default Header;
