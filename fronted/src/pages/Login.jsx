import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate, Link } from 'react-router-dom';
import { login, getMe } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(phone, password);
      const token = res.data.access_token;
      
      // שמור את הטוקן ב-localStorage קודם לכל דבר
      localStorage.setItem('token', token);
      
      const me = await getMe();
      loginUser(token, me.data);
      navigate('/learn');
    } catch {
      // הסר את הטוקן אם יש שגיאה
      localStorage.removeItem('token');
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'טלפון או סיסמה שגויים' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Toast ref={toast} position="top-left" />
      <Card title="התחברות" className="custom-card auth-card" style={{ direction: 'rtl' }}>
        <form onSubmit={handleSubmit} className="flex flex-column gap-4">
          <div className="flex flex-column gap-1">
            <label>מספר טלפון</label>
            <InputText value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05XXXXXXXX" required />
          </div>
          <div className="flex flex-column gap-1">
            <label>סיסמה</label>
            <Password value={password} onChange={(e) => setPassword(e.target.value)} feedback={false} toggleMask required />
          </div>
          <Button label="התחבר" icon="pi pi-sign-in" loading={loading} type="submit" severity="primary" />
          <div className="text-center">
            <span>אין לך חשבון? </span>
            <Link to="/register">הירשם כאן</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
