import React from 'react';
import { X } from 'lucide-react';

export function EventModal({ isOpen, isEditing, event, onClose, onSave }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-gray-800">
						{isEditing ? 'Modifica Evento' : 'Nuovo Evento'}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 p-1"
					>
						<X size={24} />
					</button>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Titolo
						</label>
						<input
							type="text"
							value={event.title}
							onChange={(e) =>
								onSave({ ...event, title: e.target.value }, false)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
							placeholder="Es: Riunione importante"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Data
						</label>
						<input
							type="date"
							value={event.date}
							onChange={(e) => onSave({ ...event, date: e.target.value }, false)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Ora
						</label>
						<input
							type="time"
							value={event.time}
							onChange={(e) => onSave({ ...event, time: e.target.value }, false)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Tipo
						</label>
						<select
							value={event.type}
							onChange={(e) => {
								const newType = e.target.value;
								const updated = { ...event, type: newType };
								// clear interview-only fields when switching away from interview
								if (newType !== 'interview') {
									updated.stakeholder = '';
									updated.recruiterName = '';
								}
								onSave(updated, false);
							}}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
						>
							<option value="meeting">Evento</option>
							<option value="interview">Colloquio</option>
						</select>
					</div>

					{event.type === 'interview' && (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Partecipante/Stakeholder
								</label>
								<input
									type="text"
									value={event.stakeholder || ''}
									onChange={(e) =>
										onSave({ ...event, stakeholder: e.target.value }, false)
									}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
									placeholder="Es: Giovanni Rossi"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nome Recruiter
								</label>
								<input
									type="text"
									value={event.recruiterName || ''}
									onChange={(e) =>
										onSave({ ...event, recruiterName: e.target.value }, false)
									}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
									placeholder="Es: Maria Bianchi"
								/>
							</div>
						</>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Note
						</label>
						<textarea
							value={event.notes || ''}
							onChange={(e) => onSave({ ...event, notes: e.target.value }, false)}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
							placeholder="Aggiungi note importanti..."
							rows="3"
						/>
					</div>
				</div>

				<div className="flex gap-3 mt-6">
					<button
						onClick={onClose}
						className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
					>
						Annulla
					</button>
					<button
						onClick={() => onSave(event, true)}
						className="flex-1 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all shadow-md"
					>
						{isEditing ? 'Aggiorna' : 'Salva'}
					</button>
				</div>
			</div>
		</div>
	);
}
