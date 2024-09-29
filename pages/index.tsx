// pages/index.tsx
import { useState, useEffect, FormEvent } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { Message } from '../types';

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        timestamp: doc.data().timestamp?.toDate() || null,
      }));
      setMessages(msgs);
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return; // Validación de entrada

    try {
      await addDoc(collection(db, 'messages'), {
        text: message,
        timestamp: serverTimestamp(),
      });
      setMessage('');
    } catch (error) {
      console.error('Error al enviar el mensaje: ', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Chat Global</h1>
      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <p key={msg.id} style={styles.message}>
            {msg.text}
          </p>
        ))}
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Enviar
        </button>
      </form>
    </div>
  );
};

// Estilos básicos en línea (puedes usar CSS o styled-components para estilos más avanzados)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
    color: 'black'
  },
  chatBox: {
    border: '1px solid #ccc',
    padding: '1rem',
    height: '400px',
    overflowY: 'scroll',
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9',
  },
  message: {
    padding: '0.5rem',
    borderBottom: '1px solid #eee',
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
  },
  button: {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Home;