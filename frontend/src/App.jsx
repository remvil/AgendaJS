import React, { useState, useEffect } from 'react';
import { Header, EventList, EventModal, ConfirmModal } from './components';

const API_URL = '/api/events';

const emptyEvent = {
	title: '',
	date: '',
	time: '',
	type: 'meeting',
	stakeholder: '',
	recruiterName: '',
	notes: '',
};

function App() {
	const [events, setEvents] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [currentEvent, setCurrentEvent] = useState(emptyEvent);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmTarget, setConfirmTarget] = useState(null);

	useEffect(() => {
		fetchEvents();
	}, []);

	const fetchEvents = async () => {
		try {
			const res = await fetch(API_URL);
			const data = await res.json();
			setEvents(data);
		} catch (error) {
			console.error('Errore nel caricamento:', error);
		} finally {
			setLoading(false);
		}
	};

	const addEvent = async () => {
		if (currentEvent.title && currentEvent.date && currentEvent.time) {
			try {
				const res = await fetch(API_URL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(currentEvent),
				});
				const newEvent = await res.json();
				setEvents([...events, newEvent]);
				resetForm();
			} catch (error) {
				console.error('Errore nel salvataggio:', error);
			}
		}
	};

	const updateEvent = async () => {
		if (currentEvent.title && currentEvent.date && currentEvent.time) {
			try {
				const res = await fetch(`${API_URL}/${currentEvent._id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(currentEvent),
				});
				const updatedEvent = await res.json();
				setEvents(events.map((e) => (e._id === currentEvent._id ? updatedEvent : e)));
				resetForm();
			} catch (error) {
				console.error('Errore nell\'aggiornamento:', error);
			}
		}
	};

	const deleteEvent = async (id) => {
		try {
			await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
			setEvents(events.filter((e) => e._id !== id));
		} catch (error) {
			console.error('Errore nella cancellazione:', error);
		}
	};

	const requestDelete = (event) => {
		setConfirmTarget(event);
		setConfirmOpen(true);
	};

	const confirmDelete = async () => {
		if (!confirmTarget) return setConfirmOpen(false);
		await deleteEvent(confirmTarget._id);
		setConfirmTarget(null);
		setConfirmOpen(false);
	};

	const cancelDelete = () => {
		setConfirmTarget(null);
		setConfirmOpen(false);
	};

	const openNewEventDialog = () => {
		setCurrentEvent(emptyEvent);
		setIsEditing(false);
		setShowModal(true);
	};

	const openEditDialog = (event) => {
		setCurrentEvent(event);
		setIsEditing(true);
		setShowModal(true);
	};

	const resetForm = () => {
		setCurrentEvent(emptyEvent);
		setIsEditing(false);
		setShowModal(false);
	};

	const handleModalSave = (updatedEvent, submit) => {
		setCurrentEvent(updatedEvent);
		if (submit) {
			if (isEditing) {
				updateEvent();
			} else {
				addEvent();
			}
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
				<div className="text-2xl text-indigo-600">Caricamento...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-4xl mx-auto">
				<Header onNewEvent={openNewEventDialog} />
				<EventList
					events={events}
					onEdit={openEditDialog}
					onDelete={deleteEvent}
					onRequestDelete={requestDelete}
				/>
			</div>

			<EventModal
				isOpen={showModal}
				isEditing={isEditing}
				event={currentEvent}
				onClose={resetForm}
				onSave={handleModalSave}
			/>

			<ConfirmModal
				isOpen={confirmOpen}
				title="Eliminare evento"
				message={confirmTarget ? `Sei sicuro di eliminare "${confirmTarget.title}"?` : 'Sei sicuro?'}
				onCancel={cancelDelete}
				onConfirm={confirmDelete}
			/>
		</div>
	);
}

export default App;
