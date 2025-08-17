import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// ==================================================================================
// Lib: Firebase Configuration (Combined into one file)
// ==================================================================================
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
const auth = getAuth(app);
const db = getFirestore(app);

// ==================================================================================
// UI Component: Header
// ==================================================================================
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

// ==================================================================================
// UI Component: Album & Folder Cards
// ==================================================================================
const AlbumCard = ({ item, onClick, onContextMenu }) => (
    <div className="w-48 space-y-2 cursor-pointer group item-fade-in" onClick={onClick} onContextMenu={onContextMenu}>
        <img src={item.data.imageUrl} className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform" onError={(e) => e.target.src='https://placehold.co/200x200/333/fff?text=Error'} />
        <div className="text-white"><h3 className="font-bold">{item.data.title}</h3><p className="text-sm text-gray-400">{item.data.artist}</p></div>
    </div>
);

const FolderCard = ({ item, onClick, onContextMenu }) => (
    <div className="w-48 space-y-2 cursor-pointer group item-fade-in" onClick={onClick} onContextMenu={onContextMenu}>
        <div className="w-full h-48 rounded-lg shadow-lg bg-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform"><svg className="h-24 w-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></div>
        <div className="text-white"><h3 className="font-bold">{item.data.title}</h3><p className="text-sm text-gray-400">Folder</p></div>
    </div>
);

// ==================================================================================
// Album Detail View Component
// ==================================================================================
function AlbumDetailView({ album, onBack }) {
    const [tracks, setTracks] = useState([]);
    
    useEffect(() => {
        if (!album || !album.id) return;

        const tracksCollection = collection(db, `items/${album.id}/tracks`);
        const q = query(tracksCollection);
        const unsubscribe = onSnapshot(q, snapshot => {
            const sorted = snapshot.docs
                .map(doc => ({ id: doc.id, data: doc.data() }))
                .sort((a, b) => (a.data.createdAt?.toDate() || 0) - (b.data.createdAt?.toDate() || 0));
            setTracks(sorted);
        });
        return () => unsubscribe();
    }, [album]);

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

// ==================================================================================
// Main Application Component
// ==================================================================================
export default function App() {
    const [view, setView] = useState('grid');
    const [items, setItems] = useState([]);
    const [navigationStack, setNavigationStack] = useState([{ id: 'root', title: 'project_1' }]);
    const [currentAlbum, setCurrentAlbum] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: null, target: null });

    const currentFolder = navigationStack[navigationStack.length - 1];

    useEffect(() => {
        const itemsCollection = collection(db, 'items');
        const q = query(itemsCollection);
        const unsubscribe = onSnapshot(q, snapshot => {
            const allItems = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
            const filtered = allItems.filter(item => item.data.parentId === currentFolder.id);
            const sorted = filtered.sort((a, b) => (a.data.createdAt?.toDate() || 0) - (b.data.createdAt?.toDate() || 0));
            setItems(sorted);
        });
        return () => unsubscribe();
    }, [currentFolder]);

    const navigateTo = (folder) => {
        setNavigationStack(prev => [...prev, { id: folder.id, title: folder.data.title }]);
    };

    const navigateBack = () => {
        if (view === 'album') {
            setView('grid');
        } else if (navigationStack.length > 1) {
            setNavigationStack(prev => prev.slice(0, -1));
        }
    };
    
    const showAlbumView = (album) => {
        setCurrentAlbum(album);
        setView('album');
    };

    const handleContextMenu = (e, type, target = null) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, type, target });
    };

    const hideContextMenu = useCallback(() => {
        setContextMenu(prev => ({ ...prev, visible: false }));
    }, []);

    useEffect(() => {
        window.addEventListener('mousedown', hideContextMenu);
        return () => window.removeEventListener('mousedown', hideContextMenu);
    }, [hideContextMenu]);

    if (view === 'album') {
        return <AlbumDetailView album={currentAlbum} onBack={navigateBack} />;
    }

    return (
        <div className="flex flex-col h-screen bg-[#202225] text-gray-300">
            <Header title={currentFolder.title} onBack={navigateBack} showBackButton={navigationStack.length > 1} />
            <main className="flex-grow p-8 overflow-y-auto no-scrollbar" onContextMenu={(e) => handleContextMenu(e, 'background')}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                    {items.map(item => (
                        item.data.type === 'album' 
                            ? <AlbumCard key={item.id} item={item} onClick={() => showAlbumView(item)} onContextMenu={(e) => handleContextMenu(e, 'item', item)} />
                            : <FolderCard key={item.id} item={item} onClick={() => navigateTo(item)} onContextMenu={(e) => handleContextMenu(e, 'item', item)} />
                    ))}
                </div>
            </main>
            {contextMenu.visible && (
                 <div style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed bg-gray-900 text-white w-56 rounded-lg shadow-xl p-2 z-50">
                    {contextMenu.type === 'background' && (
                        <>
                            <a href="#" className="flex items-center px-3 py-2 text-sm hover:bg-indigo-600 rounded-md">Add Album</a>
                            <a href="#" className="flex items-center px-3 py-2 text-sm hover:bg-indigo-600 rounded-md">Add Folder</a>
                        </>
                    )}
                     {contextMenu.type === 'item' && (
                        <>
                            <a href="#" className="flex items-center px-3 py-2 text-sm hover:bg-indigo-600 rounded-md">Rename</a>
                            <a href="#" className="flex items-center px-3 py-2 text-sm hover:bg-indigo-600 rounded-md">Edit</a>
                            <div className="border-t border-gray-700 my-2"></div>
                            <a href="#" className="flex items-center px-3 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white rounded-md">Delete</a>
                        </>
                    )}
                 </div>
            )}
        </div>
    );
}