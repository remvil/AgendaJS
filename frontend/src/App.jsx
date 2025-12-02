import React, { useState, useEffect } from 'react';
import { Header, EventList, EventModal, ConfirmModal, FilterBar } from './components';
import CalendarPage from './pages/CalendarPage';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_URL = `${API_BASE}/events`;

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
	const [currentView, setCurrentView] = useState('list'); // 'list' or 'calendar'
	const [events, setEvents] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [filters, setFilters] = useState({ startDate: '', endDate: '', type: 'all', company: '' });
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentEvent, setCurrentEvent] = useState(emptyEvent);
	const [showModal, setShowModal] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmTarget, setConfirmTarget] = useState(null);

	// Build query params from filters
	const buildQueryParams = (pageNum = 1) => {
		const params = new URLSearchParams();
		if (filters.startDate) params.append('startDate', filters.startDate);
		if (filters.endDate) params.append('endDate', filters.endDate);
		if (filters.type && filters.type !== 'all') params.append('type', filters.type);
		if (filters.company) params.append('company', filters.company);
		params.append('page', pageNum);
		params.append('limit', 10);
		return params.toString();
	};

	// Reset to page 1 when filters change
	useEffect(() => {
		setPage(1);
		setEvents([]);
		fetchEvents(1, true);
	}, [filters]);

	// Fetch events with pagination
	const fetchEvents = async (pageNum = 1, isReset = false) => {
		try {
			if (pageNum === 1) {
				setLoading(true);
			} else {
				setIsLoadingMore(true);
			}

			const query = buildQueryParams(pageNum);
			const res = await fetch(`${API_URL}?${query}`);
			const data = await res.json();

			if (pageNum === 1 || isReset) {
				setEvents(data.events);
			} else {
				setEvents((prev) => [...prev, ...data.events]);
			}

			setHasMore(data.hasMore);
			setPage(pageNum);
		} catch (error) {
			console.error('Errore nel caricamento:', error);
		} finally {
			setLoading(false);
			setIsLoadingMore(false);
		}
	};

	// Initial load
	useEffect(() => {
		fetchEvents(1, true);
		fetchCompanies();
	}, []);

	// Fetch distinct companies
	const fetchCompanies = async () => {
		try {
			const res = await fetch(`${API_BASE}/companies/distinct`);
			const data = await res.json();
			setCompanies(data);
		} catch (error) {
			console.error('Errore nel caricamento aziende:', error);
		}
	};

	// Load next page
	const loadMore = async () => {
		if (!isLoadingMore && hasMore) {
			await fetchEvents(page + 1);
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
				// Reset and refetch first page
				setPage(1);
				await fetchEvents(1, true);
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
				<Header onNewEvent={openNewEventDialog} currentView={currentView} onViewChange={setCurrentView} />

				{currentView === 'calendar' ? (
					<CalendarPage />
				) : (
					<>
						<FilterBar filters={filters} onChange={setFilters} companies={companies} />
						<EventList
							events={events}
							onEdit={openEditDialog}
							onDelete={deleteEvent}
							onRequestDelete={requestDelete}
							onLoadMore={loadMore}
							isLoadingMore={isLoadingMore}
							hasMore={hasMore}
						/>
					</>
				)}
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
