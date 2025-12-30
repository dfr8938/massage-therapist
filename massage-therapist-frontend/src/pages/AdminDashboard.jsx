// src/pages/AdminDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUserFriends, FaEnvelope, FaCalendarCheck, FaWallet, FaChevronRight, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);

  const token = localStorage.getItem('token');

  // Модалки
  const [showAddService, setShowAddService] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editService, setEditService] = useState(null); // { id, name, price, ... }
  const [editClient, setEditClient] = useState(null); // { id, name, phone, email }

  // Формы
  const [newService, setNewService] = useState({ name: '', price: '', duration: '', description: '' });
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '' });

  // Загрузка данных
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [statsRes, appsRes, msgsRes, clientsRes, servicesRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/stats', { headers }),
          fetch('http://localhost:5000/api/admin/appointments?limit=5', { headers }),
          fetch('http://localhost:5000/api/admin/messages?limit=5', { headers }),
          fetch('http://localhost:5000/api/admin/clients', { headers }),
          fetch('http://localhost:5000/api/admin/services', { headers }),
        ]);

        const statsData = await statsRes.json();
        const appsData = await appsRes.json();
        const msgsData = await msgsRes.json();
        const clientsData = await clientsRes.json();
        const servicesData = await servicesRes.json();

        setStats(statsData);
        setAppointments(appsData);
        setMessages(msgsData);
        setClients(clientsData);
        setServices(servicesData);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        alert('Не удалось загрузить данные.');
        navigate('/login');
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, currentUser, navigate]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // === ДОБАВЛЕНИЕ УСЛУГИ ===
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.duration) {
      alert('Название, цена и длительность обязательны');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newService),
      });

      if (res.ok) {
        const added = await res.json();
        setServices([...services, added]);
        setNewService({ name: '', price: '', duration: '', description: '' });
        setShowAddService(false);
      } else {
        const error = await res.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (err) {
      alert('Ошибка подключения');
    }
  };

  // === РЕДАКТИРОВАНИЕ УСЛУГИ ===
  const handleEditService = async (e) => {
    e.preventDefault();
    const { id, name, price, duration, description } = editService;
    if (!name || !price || !duration) {
      alert('Заполните все обязательные поля');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price, duration, description }),
      });

      if (res.ok) {
        const updated = await res.json();
        setServices(services.map(s => s.id === id ? updated : s));
        setEditService(null);
      } else {
        const error = await res.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (err) {
      alert('Ошибка подключения');
    }
  };

  // === ДОБАВЛЕНИЕ КЛИЕНТА ===
  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.phone) {
      alert('Имя и телефон обязательны');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });

      if (res.ok) {
        const added = await res.json();
        setClients([...clients, added]);
        setNewClient({ name: '', phone: '', email: '' });
        setShowAddClient(false);
      } else {
        const error = await res.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (err) {
      alert('Ошибка подключения');
    }
  };

  // === РЕДАКТИРОВАНИЕ КЛИЕНТА ===
  const handleEditClient = async (e) => {
    e.preventDefault();
    const { id, name, phone, email } = editClient;
    if (!name || !phone) {
      alert('Имя и телефон обязательны');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, email }),
      });

      if (res.ok) {
        const updated = await res.json();
        setClients(clients.map(c => c.id === id ? updated : c));
        setEditClient(null);
      } else {
        const error = await res.json();
        alert(`Ошибка: ${error.error}`);
      }
    } catch (err) {
      alert('Ошибка подключения');
    }
  };

  // === УДАЛЕНИЕ КЛИЕНТА ===
  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Удалить клиента? Это действие нельзя отменить.')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setClients(clients.filter(c => c.id !== clientId));
      } else {
        alert('Не удалось удалить');
      }
    } catch (err) {
      alert('Ошибка подключения');
    }
  };

  if (!stats) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Hero */}
      <section style={{ ...styles.hero, ...animatedStyles(isVisible, 0) }}>
        <h1 style={styles.heroTitle}>Админ-панель</h1>
        <p style={styles.heroText}>Добро пожаловать, Админ 👋 Управляйте клиентами, услугами, записями и сообщениями.</p>
      </section>

      <div style={styles.content}>
        {/* Статистика */}
        <div style={styles.grid}>
          <DashboardCard title="Клиенты" value={stats.clients} icon={<FaUserFriends size={28} color="#4f46e5" />} color="#4f46e5" delay={0.2} />
          <DashboardCard title="Сообщения" value={stats.messages} icon={<FaEnvelope size={28} color="#06b6d4" />} color="#06b6d4" delay={0.3} />
          <DashboardCard title="Подтверждённые" value={stats.confirmedAppointments} icon={<FaCalendarCheck size={28} color="#10b981" />} color="#10b981" delay={0.4} />
          <DashboardCard title="Средний рейтинг" value={`${stats.averageRating.toFixed(1)} ⭐`} icon={<FaWallet size={28} color="#f59e0b" />} color="#f59e0b" delay={0.5} />
        </div>

        {/* Кнопки действий */}
        <div style={styles.actions}>
          <button onClick={() => setShowAddService(true)} style={styles.btnPrimary}>
            <FaPlus /> Добавить услугу
          </button>
          <button onClick={() => setShowAddClient(true)} style={styles.btnPrimary}>
            <FaPlus /> Добавить клиента
          </button>
        </div>

        {/* Услуги */}
        <section style={{ ...styles.section, ...animatedStyles(isVisible, 0.6) }}>
          <h2 style={styles.sectionTitle}>Услуги</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Название</th>
                <th>Цена</th>
                <th>Длительность</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id}>
                  {editService?.id === s.id ? (
                    <EditServiceForm
                      service={editService}
                      onChange={setEditService}
                      onSave={handleEditService}
                      onCancel={() => setEditService(null)}
                    />
                  ) : (
                    <>
                      <td>{s.name}</td>
                      <td>{s.price} ₽</td>
                      <td>{s.duration} мин</td>
                      <td>{s.description || '—'}</td>
                      <td style={styles.actionCell}>
                        <button onClick={() => setEditService(s)} style={styles.btnEdit}>
                          <FaEdit size={14} /> Ред.
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Клиенты */}
        <section style={{ ...styles.section, ...animatedStyles(isVisible, 0.7) }}>
          <h2 style={styles.sectionTitle}>Клиенты</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Посещений</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id}>
                  {editClient?.id === c.id ? (
                    <EditClientForm
                      client={editClient}
                      onChange={setEditClient}
                      onSave={handleEditClient}
                      onCancel={() => setEditClient(null)}
                    />
                  ) : (
                    <>
                      <td>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>{c.email || '—'}</td>
                      <td>{c.visit_count}</td>
                      <td style={styles.actionCell}>
                        <button onClick={() => setEditClient(c)} style={styles.btnEdit}>
                          <FaEdit size={14} /> Ред.
                        </button>
                        <button onClick={() => handleDeleteClient(c.id)} style={styles.btnDelete}>
                          <FaTrash size={14} /> Удалить
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Последние записи */}
        <section style={{ ...styles.section, ...animatedStyles(isVisible, 0.8) }}>
          <h2 style={styles.sectionTitle}>Последние записи</h2>
          {appointments.length === 0 ? (
            <p style={styles.empty}>Нет записей</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th>Услуга</th>
                  <th>Дата</th>
                  <th>Время</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td>{appt.client_name || appt.client?.name}</td>
                    <td>{appt.service_name}</td>
                    <td>{formatDate(appt.date)}</td>
                    <td>{appt.time}</td>
                    <td style={styles.actionCell}><FaChevronRight size={16} color="#94a3b8" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Сообщения */}
        <section style={{ ...styles.section, ...animatedStyles(isVisible, 0.9) }}>
          <h2 style={styles.sectionTitle}>Новые сообщения</h2>
          {messages.length === 0 ? (
            <p style={styles.empty}>Нет сообщений</p>
          ) : (
            <div style={styles.messages}>
              {messages.map(msg => (
                <div key={msg.id} style={styles.message}>
                  <div style={styles.messageHeader}>
                    <strong>{msg.name}</strong>
                    <span style={styles.time}>
                      {new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={styles.messageText}>{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <div style={{ ...styles.backSection, ...animatedStyles(isVisible, 1.0) }}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Назад на сайт</button>
        </div>
      </div>

      {/* Модалка: Добавить услугу */}
      {showAddService && (
        <Modal onClose={() => setShowAddService(false)}>
          <h3 style={styles.modalTitle}>Добавить услугу</h3>
          <form onSubmit={handleAddService} style={styles.form}>
            <input placeholder="Название" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} style={styles.input} required />
            <input type="number" placeholder="Цена (₽)" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} style={styles.input} required />
            <input type="number" placeholder="Длительность (мин)" value={newService.duration} onChange={e => setNewService({ ...newService, duration: e.target.value })} style={styles.input} required />
            <textarea placeholder="Описание (опционально)" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} style={styles.textarea} />
            <div style={styles.modalActions}>
              <button type="button" onClick={() => setShowAddService(false)} style={styles.btnCancel}>Отмена</button>
              <button type="submit" style={styles.btnSave}>Добавить</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Модалка: Добавить клиента */}
      {showAddClient && (
        <Modal onClose={() => setShowAddClient(false)}>
          <h3 style={styles.modalTitle}>Добавить клиента</h3>
          <form onSubmit={handleAddClient} style={styles.form}>
            <input placeholder="Имя" value={newClient.name} onChange={e => setNewClient({ ...newClient, name: e.target.value })} style={styles.input} required />
            <input placeholder="Телефон" value={newClient.phone} onChange={e => setNewClient({ ...newClient, phone: e.target.value })} style={styles.input} required />
            <input placeholder="Email (опционально)" value={newClient.email} onChange={e => setNewClient({ ...newClient, email: e.target.value })} style={styles.input} />
            <div style={styles.modalActions}>
              <button type="button" onClick={() => setShowAddClient(false)} style={styles.btnCancel}>Отмена</button>
              <button type="submit" style={styles.btnSave}>Добавить</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// === ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ===

// Форма редактирования услуги
function EditServiceForm({ service, onChange, onSave, onCancel }) {
  return (
    <form onSubmit={onSave} style={{ display: 'contents' }}>
      <td><input value={service.name} onChange={e => onChange({ ...service, name: e.target.value })} style={styles.inputInline} required /></td>
      <td><input type="number" value={service.price} onChange={e => onChange({ ...service, price: e.target.value })} style={styles.inputInline} required /></td>
      <td><input type="number" value={service.duration} onChange={e => onChange({ ...service, duration: e.target.value })} style={styles.inputInline} required /></td>
      <td><input value={service.description} onChange={e => onChange({ ...service, description: e.target.value })} style={styles.inputInline} /></td>
      <td style={styles.actionCell}>
        <button type="submit" style={{ ...styles.btnEdit, marginRight: '0.5rem' }}>✔️</button>
        <button type="button" onClick={onCancel} style={styles.btnCancel}>❌</button>
      </td>
    </form>
  );
}

// Форма редактирования клиента
function EditClientForm({ client, onChange, onSave, onCancel }) {
  return (
    <form onSubmit={onSave} style={{ display: 'contents' }}>
      <td><input value={client.name} onChange={e => onChange({ ...client, name: e.target.value })} style={styles.inputInline} required /></td>
      <td><input value={client.phone} onChange={e => onChange({ ...client, phone: e.target.value })} style={styles.inputInline} required /></td>
      <td><input value={client.email || ''} onChange={e => onChange({ ...client, email: e.target.value })} style={styles.inputInline} /></td>
      <td>{client.visit_count}</td>
      <td style={styles.actionCell}>
        <button type="submit" style={{ ...styles.btnEdit, marginRight: '0.5rem' }}>✔️</button>
        <button type="button" onClick={onCancel} style={styles.btnCancel}>❌</button>
      </td>
    </form>
  );
}

// Модальное окно
function Modal({ children, onClose }) {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Формат даты
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

// Анимация появления
function animatedStyles(visible, delay = 0) {
  return visible
    ? {
        opacity: 1,
        transform: 'translateY(0)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }
    : {
        opacity: 0,
        transform: 'translateY(30px)',
      };
}

// === СТИЛИ ===
const styles = {
  // ... (все стили как выше, плюс новое)
  inputInline: {
    padding: '0.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '0.95rem',
    width: '100%',
    boxSizing: 'border-box',
  },
  btnEdit: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnDelete: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  btnCancel: {
    padding: '0.875rem',
    backgroundColor: '#f8fafc',
    color: '#4f46e5',
    border: '2px solid #4f46e5',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1.1rem',
  },
  btnSave: {
    padding: '0.875rem 1.75rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1.1rem',
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#1e293b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    minHeight: '100px',
    resize: 'vertical',
  },
  // ... остальные стили — как в предыдущей версии
};

// Глобальные стили — те же
const styleEl = document.createElement('style');
styleEl.textContent = `
  th, td {
    text-align: left;
    padding: 1.2rem;
    border-bottom: 1px solid #e2e8f0;
  }
  th {
    background-color: #f8fafc;
    font-weight: 700;
    color: #475569;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  tr:hover td {
    background-color: #f1f5f9;
    border-color: #bfdbfe;
  }
  tr:last-child td {
    border-bottom: none;
  }
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(79, 70, 229, 0.35);
  }
  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; gap: 1.5rem; }
    .actions { flex-direction: column; }
  }
`;
styleEl.id = 'admin-dashboard-styles';
if (!document.head.querySelector('#admin-dashboard-styles')) {
  document.head.appendChild(styleEl);
}
