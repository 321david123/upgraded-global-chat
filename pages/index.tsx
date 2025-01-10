// pages/index.tsx
import { useState, useEffect, FormEvent, useRef } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { Message } from '../types';
<link href="https://fonts.googleapis.com/css2?family=Petit+Formal+Script&display=swap" rel="stylesheet"></link>

import formatTimestamp from '../utils/time'; // Importa la nueva función

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
  
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const msgs: Message[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          text: doc.data().text,
          timestamp: doc.data().timestamp?.toDate() || null,
        }));
  
        setMessages(msgs);
        scrollToBottom();
  
        // Delete older messages if they exceed 100
        if (msgs.length > 100) {
          const excessMessages = snapshot.docs.slice(0, msgs.length - 100); // Get extra messages
          for (const msg of excessMessages) {
            await deleteDoc(doc(db, 'messages', msg.id)); // Delete each excess message
          }
        }
      },
      (error) => {
        console.error('Error while fetching messages:', error);
        setError('Error while loading messages.');
      }
    );
  
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') {
      alert('The message cant be empty');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Enviando mensaje:', message);
      const docRef = await addDoc(collection(db, 'messages'), {
        text: message,
        timestamp: serverTimestamp(),
        // userId: auth.currentUser?.uid || 'anon',
      });
      console.log('Mensaje enviado con ID:', docRef.id);
      setMessage('');
    } catch (error: unknown) {
      console.error('Error al enviar el mensaje: ', error);
      setError('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div style={styles.container}>
<h1
  style={{
    marginBottom: '10px',
    fontSize: '3rem',
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontFamily: '"Petit Formal Script", cursive',
    color: '#ffffff', // White for high contrast
    textAlign: 'center',
    letterSpacing: '1px',
    textShadow: '2px 2px 5px rgba(255, 255, 255, 0.3)', // Subtle glow effect
  }}
>
  Global Chat <span style={{ fontSize: '1.5rem', color: '#aaaaaa' }}>Beta 1</span>
</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.chatBox}>
        {messages.map((msg) => {
          // const isOwnMessage = msg.userId === auth.currentUser?.uid;
          return (
            <div
              key={msg.id}
              style={{
                ...styles.messageContainer,
                // ...(isOwnMessage ? styles.ownMessage : styles.otherMessage),
              }}
            >
              <p style={styles.messageText}>{msg.text}</p>
              {msg.timestamp && (
                <span style={styles.timestamp}>
                {new Date(msg.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} ,{" "} 
                {new Date(msg.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write anything..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#888', marginTop: '20px', marginBottom: '10px' }}>
  Only the latest 100 messages are retained. Older messages will be automatically deleted.
</div>
    </div>
  );
};

// Estilos básicos en línea
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  chatBox: {
    border: '1px solid #ccc',
    padding: '1rem',
    height: '400px',
    overflowY: 'scroll',
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    textAlign: 'left',
    marginBottom: '1rem',
    padding: '0.5rem',
    borderRadius: '8px',
    backgroundColor: '#e6f7ff',
    maxWidth: '80%',
  },
  ownMessage: {
    backgroundColor: '#d1ffd6', // Verde claro para mensajes propios
    alignSelf: 'flex-start',
  },
  otherMessage: {
    backgroundColor: '#e6f7ff', // Azul claro para mensajes de otros
    alignSelf: 'flex-start',
  },
  messageText: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    color: '#333',
  },
  timestamp: {
    fontSize: '0.75rem',
    color: '#666',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    marginRight: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
};

export default Home;