import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query } from 'firebase/firestore';

// --- Firebase Configuration (Combined for single-file execution) ---
const firebaseConfig = {
    apiKey: "AIzaSyB4-unm8Z03o3XXgjjlZcIY2tiSskqO2Xc",
    authDomain: "project-1-f9e5b.firebaseapp.com",
    projectId: "project-1-f9e5b",
    storageBucket: "project-1-f9e5b.appspot.com",
    messagingSenderId: "272340259942",
    appId: "1:272340259942:web:a5a5a302342e0b4eb389a7",
    measurementId: "G-EKL8BPFSG1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Header Component (Combined for single-file execution) ---
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

export default function AlbumDetailView({ album, onBack }) {
    const [tracks, setTracks] = useState([]);
    
    useEffect(() => {
        if (!album || !album.id) return; // Guard against missing album id

        const tracksCollection = collection(db, `items/${album.id}/tracks`);
        const q = query(tracksCollection);
        const unsubscribe = onSnapshot(q, snapshot => {
            const sorted = snapshot.docs
                .map(doc => ({ id: doc.id, data: doc.data() }))
                .sort((a, b) => (a.data.createdAt?.toDate() || 0) - (b.data.createdAt?.toDate() || 0));
            setTracks(sorted);
        });
        return () => unsubscribe();
    }, [album]); // Depend on the whole album object

    // Render a loading or placeholder state if album data is not yet available
    if (!album || !album.data) {
        return (
             <div className="flex flex-col h-screen bg-[#202225] text-gray-300 items-center justify-center">
                <p>Loading album...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#202225] text-gray-300">
            <Header title={album.data.title} onBack={onBack} showBackButton={true} />
            <main className="flex-grow p-8 overflow-y-auto no-scrollbar">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                        <img src={album.data.imageUrl} className="w-full h-auto object-cover rounded-lg shadow-2xl mb-4" />
                        <h2 className="text-3xl font-bold text-white">{album.data.title}</h2>
                        <p className="text-lg text-gray-400">{album.data.artist}</p>
                        <p className="text-sm text-gray-500 mt-1">{tracks.length} tracks</p>
                    </div>
                    <div className="w-full md:w-2/3 lg:w-3/4">
                        <div className="space-y-2">
                            {tracks.map((track, index) => (
                                <div key={track.id} className="flex items-center p-2 rounded-md hover:bg-gray-700 text-gray-400">
                                    <div className="w-8 text-right mr-4">{index + 1}</div>
                                    <div className="flex-grow text-white">{track.data.fileName}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
                            <p className="text-gray-500">Drag & Drop Audio Files Here to Add Tracks</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
