import React from 'react';
import { Calendar } from 'lucide-react';
import { EventItem } from './EventItem';

export function EventList({ events, onEdit, onDelete, onRequestDelete }) {
	if (events.length === 0) {
		return (
			<div className="bg-white rounded-xl shadow-md p-12 text-center">
				<Calendar className="mx-auto text-gray-300 mb-4" size={64} />
				<p className="text-gray-500 text-lg">Nessun evento in agenda</p>
				<p className="text-gray-400 text-sm mt-2">
					Clicca su "Nuovo" per aggiungere un evento
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{events.map((event) => (
				<EventItem
					key={event._id}
					event={event}
					onEdit={onEdit}
					onRequestDelete={onRequestDelete || onDelete}
				/>
			))}
		</div>
	);
}
