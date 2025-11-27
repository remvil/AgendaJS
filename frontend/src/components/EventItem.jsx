import React from 'react';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export function EventItem({ event, onEdit, onRequestDelete }) {
	const handleRequestDelete = () => {
		// ask parent to open a confirm modal
		if (typeof onRequestDelete === 'function') onRequestDelete(event);
	};
	return (
		<div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4 flex-1">
					<div
						className={`p-3 rounded-lg ${event.type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
							}`}
					>
						{event.type === 'meeting' ? (
							<Calendar className="text-blue-600" size={24} />
						) : (
							<Clock className="text-green-600" size={24} />
						)}
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
						<div className="flex gap-4 text-sm text-gray-500 mt-1">
							<span className="flex items-center gap-1">
								<Calendar size={14} />
								{new Date(event.date).toLocaleDateString('it-IT')}
							</span>
							<span className="flex items-center gap-1">
								<Clock size={14} />
								{event.time}
							</span>
							<span
								className={`px-2 py-0.5 rounded-full text-xs ${event.type === 'meeting'
									? 'bg-blue-100 text-blue-700'
									: 'bg-green-100 text-green-700'
									}`}
							>
								{event.type === 'meeting' ? 'Evento' : 'Colloquio'}
							</span>
						</div>
						{event.type === 'interview' && (event.stakeholder || event.recruiterName) && (
							<div className="flex gap-4 text-sm text-gray-600 mt-2">
								{event.stakeholder && (
									<span>
										<strong>Partecipante:</strong> {event.stakeholder}
									</span>
								)}
								{event.recruiterName && (
									<span>
										<strong>Recruiter:</strong> {event.recruiterName}
									</span>
								)}
							</div>
						)}
						{event.notes && (
							<p className="text-sm text-gray-600 mt-2">
								<strong>Note:</strong> {event.notes}
							</p>
						)}
					</div>
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => onEdit(event)}
						className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-all"
						title="Modifica evento"
					>
						<Edit2 size={20} />
					</button>
					<button
						onClick={handleRequestDelete}
						className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
						title="Elimina evento"
					>
						<Trash2 size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}
