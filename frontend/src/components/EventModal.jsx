import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function EventModal({ isOpen, isEditing, event, onClose, onSave }) {
	const [showMarkdownTooltip, setShowMarkdownTooltip] = useState(false);

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
							Nome Azienda
						</label>
						<input
							type="text"
							value={event.companyName || ''}
							onChange={(e) =>
								onSave({ ...event, companyName: e.target.value }, false)
							}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
							placeholder="Es: Company ltd"
						/>
					</div>

					<div>
						<div className="flex items-center gap-2 mb-2 relative">
							<label className="block text-sm font-medium text-gray-700">
								Note (Markdown)
							</label>
							<div className="relative">
								<button
									type="button"
									onMouseEnter={() => setShowMarkdownTooltip(true)}
									onMouseLeave={() => setShowMarkdownTooltip(false)}
									className="text-gray-400 hover:text-gray-600 p-0.5 transition-colors"
									title="Informazioni Markdown"
								>
									<Info size={16} />
								</button>

								{/* Floating Tooltip */}
								{showMarkdownTooltip && (
									<div className="absolute top-6 left-0 bg-gray-800 text-white text-sm rounded-lg shadow-lg p-3 w-max z-50">
										<p className="font-semibold mb-2">Sintassi Markdown:</p>
										<ul className="space-y-1 text-xs">
											<li><code className="bg-gray-700 px-1.5 py-0.5 rounded">**testo**</code> = <strong>bold</strong></li>
											<li><code className="bg-gray-700 px-1.5 py-0.5 rounded">*testo*</code> = <em>italic</em></li>
											<li><code className="bg-gray-700 px-1.5 py-0.5 rounded">- elemento</code> = lista</li>
											<li><code className="bg-gray-700 px-1.5 py-0.5 rounded"># Titolo</code> = titolo</li>
										</ul>
									</div>
								)}
							</div>
						</div>
						<div className="space-y-2">
							<textarea
								value={event.notes || ''}
								onChange={(e) => onSave({ ...event, notes: e.target.value }, false)}
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm"
								placeholder="Supporta Markdown: **bold** *italic* - lista"
								rows="4"
							/>
							{event.notes && (
								<div className="bg-gray-50 p-3 rounded border border-gray-200">
									<p className="text-xs font-semibold text-gray-600 mb-2">Anteprima:</p>
									<div className="prose prose-sm max-w-none">
										<ReactMarkdown remarkPlugins={[remarkGfm]}>
											{event.notes}
										</ReactMarkdown>
									</div>
								</div>
							)}
						</div>
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
