import React from 'react';

export const AlbumCard = ({ item, onClick, onContextMenu }) => (
    <div className="w-48 space-y-2 cursor-pointer group item-fade-in" onClick={onClick} onContextMenu={onContextMenu}>
        <img src={item.data.imageUrl} className="w-full h-48 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform" onError={(e) => e.target.src='https://placehold.co/200x200/333/fff?text=Error'} />
        <div className="text-white"><h3 className="font-bold">{item.data.title}</h3><p className="text-sm text-gray-400">{item.data.artist}</p></div>
    </div>
);

export const FolderCard = ({ item, onClick, onContextMenu }) => (
    <div className="w-48 space-y-2 cursor-pointer group item-fade-in" onClick={onClick} onContextMenu={onContextMenu}>
        <div className="w-full h-48 rounded-lg shadow-lg bg-gray-700 flex items-center justify-center group-hover:scale-105 transition-transform"><svg className="h-24 w-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></div>
        <div className="text-white"><h3 className="font-bold">{item.data.title}</h3><p className="text-sm text-gray-400">Folder</p></div>
    </div>
);
