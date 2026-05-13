import { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', last_name: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.current.show({ severity: 'success', summary: 'נרשמת בהצלחה', detail: 'כעת תוכל להתחבר' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: err.response?.data?.detail || 'שגיאה בהרשמה' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <Toast ref={toast} position="top-left" />
      <Card title="הרשמה" className="custom-card auth-card" style={{ direction: 'rtl' }}>
        <form onSubmit={handleSubmit} className="flex flex-column gap-4">
          <div className="flex flex-column gap-1">
            <label>שם פרטי (בעברית)</label>
            <InputText value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ישראל" required />
          </div>
          <div className="flex flex-column gap-1">
            <label>שם משפחה (בעברית)</label>
            <InputText value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} placeholder="ישראלי" required />
          </div>
          <div className="flex flex-column gap-1">
            <label>מספר טלפון</label>
            <InputText value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05XXXXXXXX" required />
          </div>
          <div className="flex flex-column gap-1">
            <label>סיסמה</label>
            <Password value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} toggleMask required />
          </div>
          <Button label="הירשם" icon="pi pi-user-plus" loading={loading} type="submit" severity="primary" />
          <div className="text-center">
            <span>כבר יש לך חשבון? </span>
            <Link to="/login">התחבר כאן</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
