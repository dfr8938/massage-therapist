// src/pages/ClientDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaComment, FaStar, FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';

export default function ClientDashboard() {
  const { currentUser } = useAuth();
  const [clients] = useState(() => JSON.parse(sessionStorage.getItem('clients') || '[]'));
  const [services] = useState(() => [
    { id: 1, name: 'Классический массаж', duration: 60, price: 3000 },
    { id: 2, name: 'Спортивный массаж', duration: 90, price: 4500 },
    { id: 3, name: 'Лимфодренажный', duration: 60, price: 3500 },
  ]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherIsTyping, setOtherIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const [clientNotifications, setClientNotifications] = useState([]);

  const [bookingStep, setBookingStep] = useState('form');
  const [booking, setBooking] = useState({
    serviceId: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    document.title = `Личный кабинет • ${currentUser.name}`;
  }, [currentUser]);

  // Уведомления
  useEffect(() => {
    const savedNotifications = JSON.parse(sessionStorage.getItem(`notifications_${currentUser.id}`) || '[]');
    setClientNotifications(savedNotifications);
  }, [currentUser.id]);

  // Загрузка данных
  useEffect(() => {
    const savedAppointments = JSON.parse(sessionStorage.getItem('appointments') || '[]');
    const savedReviews = JSON.parse(sessionStorage.getItem('reviews') || '[]');
    const savedChat = JSON.parse(sessionStorage.getItem('chat_messages') || '[]');

    setAppointments(savedAppointments.filter(a => a.client_id === currentUser.id));
    setReviews(savedReviews.filter(r => r.client_id === currentUser.id));
    setChat(savedChat);

    // Прокрутка чата
    if (showChat) {
      const el = document.getElementById('chat-box');
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [showChat]);

  // Онлайн статус
  useEffect(() => {
    setIsOnline(true);
    sessionStorage.setItem('user_online', currentUser.id);
    sessionStorage.setItem('last_seen_' + currentUser.id, new Date().toISOString());

    const entryMessage = {
      id: Date.now(),
      type: 'system',
      text: 'Клиент вошёл в чат',
      timestamp: new Date().toISOString(),
    };

    const savedChat = JSON.parse(sessionStorage.getItem('chat_messages') || '[]');
    const updatedChat = [...savedChat, entryMessage];
    setChat(updatedChat);
    sessionStorage.setItem('chat_messages', JSON.stringify(updatedChat));

    const handleUnload = () => {
      setIsOnline(false);
      sessionStorage.removeItem('user_online');
      sessionStorage.setItem('last_seen_' + currentUser.id, new Date().toISOString());

      const exitMessage = {
        id: Date.now() + 1,
        type: 'system',
        text: 'Клиент вышел из чата',
        timestamp: new Date().toISOString(),
      };

      const finalChat = [...updatedChat, exitMessage];
      sessionStorage.setItem('chat_messages', JSON.stringify(finalChat));
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [currentUser.id]);

  // Следим за "печатает…"
  useEffect(() => {
    if (newMessage) {
      setIsTyping(true);
      sessionStorage.setItem('user_typing', currentUser.id);
    } else {
      setIsTyping(false);
      sessionStorage.removeItem('user_typing');
    }
  }, [newMessage]);

  useEffect(() => {
    const check = () => {
      const typing = sessionStorage.getItem('user_typing');
      setOtherIsTyping(typing === 'admin');
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  // Следим за онлайном админа
  useEffect(() => {
    const check = () => {
      const online = sessionStorage.getItem('user_online') === 'admin';
      const last = sessionStorage.getItem('last_seen_admin');
      setIsOnline(online);
      setLastSeen(last);
    };
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  const confirmBooking = () => {
    const newAppointment = {
      id: Date.now(),
      client_id: currentUser.id,
      service_id: Number(booking.serviceId),
      date: booking.date,
      time: booking.time,
      status: 'Ожидание',
    };

    const service = services.find(s => s.id == booking.serviceId);

    const updated = [
      {
        ...newAppointment,
        service_name: service?.name || 'Услуга'
      },
      ...appointments
    ];

    setAppointments(updated);
    sessionStorage.setItem('appointments', JSON.stringify(updated));
    setBookingStep('success');
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const formatted = newMessage
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:#4f46e5;text-decoration:underline;">$1</a>');

    const msg = {
      id: Date.now(),
      text: formatted,
      sender: 'client',
      timestamp: new Date().toISOString(),
      isHtml: true,
    };

    const updated = [...chat, msg];
    setChat(updated);
    setNewMessage('');
    sessionStorage.setItem('chat_messages', JSON.stringify(updated));

    const el = document.getElementById('chat-box');
    if (el) el.scrollTop = el.scrollHeight;
  };

  const clearChat = () => {
    if (window.confirm('Очистить чат?')) {
      setChat([]);
      sessionStorage.setItem('chat_messages', JSON.stringify([]));
    }
  };

  const emojis = ['😊', '👍', '❤️', '🎉', '👏', '🙏', '🔥', '💡', '🚀', '💯'];
  const [showEmoji, setShowEmoji] = useState(false);
  const insertEmoji = (e) => setNewMessage(p => p + e);

  return (
    <div style={styles.container}>
      {/* Уведомления */}
      {clientNotifications.map(n => (
        <div key={n.id} style={{ ...styles.notification, backgroundColor: n.type === 'error' ? '#fee2e2' : '#dcfce7' }}>
          {n.text}
          <button onClick={() => {
            const filtered = clientNotifications.filter(nn => nn.id !== n.id);
            setClientNotifications(filtered);
            sessionStorage.setItem(`notifications_${currentUser.id}`, JSON.stringify(filtered));
          }} style={styles.closeNotif}>✕</button>
        </div>
      ))}

      <h1>Личный кабинет, {currentUser.name}</h1>

      {/* Запись */}
      {bookingStep === 'form' && (
        <section>
          <h2>Записаться на приём</h2>
          <select value={booking.serviceId} onChange={e => setBooking({ ...booking, serviceId: e.target.value })} style={styles.input}>
            <option value="">Выберите услугу</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name} — {s.price}₽</option>)}
          </select>
          <input type="date" value={booking.date} onChange={e => setBooking({ ...booking, date: e.target.value })} style={styles.input} />
          <input type="time" value={booking.time} onChange={e => setBooking({ ...booking, time: e.target.value })} style={styles.input} />
          <button onClick={confirmBooking} style={styles.button}>Записаться</button>
        </section>
      )}

      {bookingStep === 'success' && (
        <div style={styles.success}>
          <h2>✅ Запись оформлена!</h2>
          <p>Ожидайте подтверждения от администратора.</p>
          <button onClick={() => setBookingStep('form')} style={styles.button}>К записям</button>
        </div>
      )}

      {/* Записи */}
      <section>
        <h2><FaCalendarAlt /> Мои записи</h2>
        {appointments.length === 0 ? (
          <p>Нет записей</p>
        ) : (
          <ul>
            {appointments.map(a => (
              <li key={a.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                <strong>{a.service_name}</strong> — {new Date(a.date).toLocaleDateString('ru-RU')}, {a.time} <br />
                <span style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '999px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  backgroundColor:
                    a.status === 'Подтверждена' ? '#dcfce7' :
                    a.status === 'Завершена' ? '#dbeafe' :
                    a.status === 'Отменена' ? '#fee2e2' : '#fef9c3',
                  color:
                    a.status === 'Подтверждена' ? '#166534' :
                    a.status === 'Завершена' ? '#1e40af' :
                    a.status === 'Отменена' ? '#991b1b' : '#854d0e',
                }}>{a.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Отзывы */}
      <section>
        <h2><FaStar /> Мои отзывы</h2>
        {reviews.map(r => (
          <div key={r.id} style={{ border: '1px solid #eee', padding: '1rem', margin: '0.5rem 0', borderRadius: '8px' }}>
            <p>{r.text}</p>
            <small>Рейтинг: {r.rating} ⭐</small>
          </div>
        ))}
      </section>

      {/* Чат */}
      <button onClick={() => setShowChat(true)} style={styles.chatButton}>💬 Чат с мастером</button>

      {showChat && (
        <div style={styles.chatModal}>
          <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
              <h3>
                Чат с мастером
                <span style={styles.onlineStatus}>
                  <span style={{ ...styles.dot, backgroundColor: isOnline ? '#10b981' : '#94a3b8' }}></span>
                  {isOnline ? 'В сети' : lastSeen ? `Был в сети ${new Date(lastSeen).toLocaleTimeString('ru-RU')}` : 'Неизвестно'}
                </span>
              </h3>
              <button onClick={() => setShowChat(false)} style={styles.closeButton}>✕</button>
            </div>

            <div id="chat-box" style={styles.chatBox}>
              {chat.length === 0 ? (
                <p style={styles.emptyChat}>Пока нет сообщений</p>
              ) : (
                chat.map(msg => {
                  if (msg.type === 'system') {
                    return <div key={msg.id} style={styles.systemMessage}><small>{msg.text}</small></div>;
                  }
                  return (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.chatMessage,
                        ...(msg.sender === 'client' ? styles.clientMsg : styles.adminMsg),
                        textAlign: msg.sender === 'client' ? 'right' : 'left',
                      }}
                    >
                      <div style={styles.msgBubble}>
                        <div
                          style={styles.msgText}
                          dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                        <small style={styles.msgTime}>
                          {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  );
                })
              )}
              {otherIsTyping && <div style={styles.typingIndicator}><small>Печатает…</small></div>}
            </div>

            <div style={styles.chatInputContainer}>
              <div style={styles.formatHint}>
                <small>Формат: *жирный*, _курсив_, [текст](ссылка)</small>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Напишите сообщение..."
                  style={styles.chatInput}
                />
                <button onClick={() => setShowEmoji(!showEmoji)} style={styles.emojiButton}>😊</button>
                {showEmoji && (
                  <div style={styles.emojiPicker}>
                    {emojis.map(e => (
                      <span key={e} style={styles.emojiItem} onClick={() => insertEmoji(e)}>{e}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={sendMessage} style={styles.sendButton}>Отправить</button>
              <button onClick={clearChat} style={styles.clearChatButton}>🗑 Очистить</button>
            </div>
          </div>
        </div>
      )}

      {/* Связь */}
      <section>
        <h2>Связь</h2>
        <div style={styles.contactButtons}>
          <a href="https://wa.me/79255616201" target="_blank" rel="noreferrer" style={styles.contactBtn}><FaWhatsapp /> WhatsApp</a>
          <a href="https://t.me/katya_massage" target="_blank" rel="noreferrer" style={styles.contactBtn}><FaTelegram /> Telegram</a>
          <a href="mailto:gorelovaee01@gmail.com" style={styles.contactBtn}><FaEnvelope /> Email</a>
        </div>
      </section>
    </div>
  );
}

// === СТИЛИ ===
const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
  },
  success: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    maxWidth: '350px',
    padding: '1rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#991b1b',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeNotif: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    marginLeft: '1rem',
  },

  // --- ЧАТ ---
  chatButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
    zIndex: 1000,
  },
  chatModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  chatContainer: {
    width: '90%',
    maxWidth: '500px',
    maxHeight: '70vh',
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  chatHeader: {
    padding: '1rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  onlineStatus: {
    fontSize: '0.85rem',
    marginLeft: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  },
  chatBox: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    backgroundColor: '#f9fafb',
  },
  emptyChat: {
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: '2rem',
  },
  chatMessage: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 1rem',
  },
  msgBubble: {
    display: 'inline-block',
    maxWidth: '80%',
    padding: '0.75rem 1rem',
    borderRadius: '18px',
    marginBottom: '0.25rem',
  },
  msgText: {
    margin: '0 0 0.25rem 0',
    lineHeight: '1.5',
  },
  msgTime: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textAlign: 'right',
  },
  clientMsg: {},
  'clientMsg > div': {
    backgroundColor: '#4f46e5',
    color: 'white',
    borderTopRightRadius: '4px',
  },
  adminMsg: {},
  'adminMsg > div': {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    borderTopLeftRadius: '4px',
  },
  systemMessage: {
    textAlign: 'center',
    margin: '1rem 0',
    fontSize: '0.8rem',
    color: '#64748b',
    fontStyle: 'italic',
  },
  typingIndicator: {
    textAlign: 'left',
    marginLeft: '1.5rem',
    fontSize: '0.9rem',
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: '0.25rem',
  },
  chatInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    gap: '0.5rem',
    backgroundColor: 'white',
    borderTop: '1px solid #e2e8f0',
  },
  formatHint: {
    fontSize: '0.8rem',
    color: '#94a3b8',
    fontStyle: 'italic',
    marginLeft: '0.5rem',
  },
  chatInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '1rem',
    outline: 'none',
  },
  emojiButton: {
    position: 'absolute',
    right: '50px',
    bottom: '16px',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    fontSize: '1.2rem',
  },
  emojiPicker: {
    position: 'absolute',
    bottom: '60px',
    right: '1rem',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '0.75rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  emojiItem: {
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '8px',
  },
  'emojiItem:hover': {
    backgroundColor: '#e2e8f0',
  },
  sendButton: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  clearChatButton: {
    padding: '0.5rem',
    backgroundColor: '#f87171',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },

  // --- СВЯЗЬ ---
  contactButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '2rem',
  },
  contactBtn: {
    flex: 1,
    padding: '0.875rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '500',
  },
};
