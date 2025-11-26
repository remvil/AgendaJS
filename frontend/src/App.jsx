import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, X, Trash2 } from 'lucide-react';

const API_URL = '/api/events';

function App() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentEvent, setCurrentEvent] = useState({ 
    title: '', 
    date: '', 
    time: '', 
    type: 'meeting' 
  });

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
        setCurrentEvent({ title: '', date: '', time: '', type: 'meeting' });
        setShowModal(false);
      } catch (error) {
        console.error('Errore nel salvataggio:', error);
      }
    }
  };

  const deleteEvent = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e._id !== id));
    } catch (error) {
      console.error('Errore nella cancellazione:', error);
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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-3 rounded-xl">
                <Calendar className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Agenda</h1>
                <p className="text-gray-500 text-sm">Gestisci eventi e colloqui</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              Nuovo
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    event.type === 'meeting' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
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
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        event.type === 'meeting' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {event.type === 'meeting' ? 'Evento' : 'Colloquio'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500 text-lg">Nessun evento in agenda</p>
            <p className="text-gray-400 text-sm mt-2">Clicca su "Nuovo" per aggiungere un evento</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nuovo Evento</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titolo</label>
                <input
                  type="text"
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Es: Riunione importante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={currentEvent.date}
                  onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ora</label>
                <input
                  type="time"
                  value={currentEvent.time}
                  onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={currentEvent.type}
                  onChange={(e) => setCurrentEvent({...currentEvent, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="meeting">Evento</option>
                  <option value="interview">Colloquio</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Annulla
              </button>
              <button
                onClick={addEvent}
                className="flex-1 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all shadow-md"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
