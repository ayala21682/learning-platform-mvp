import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const items = [
    { label: 'למידה', icon: 'pi pi-book', command: () => navigate('/learn') },
    { label: 'קורסים', icon: 'pi pi-th-large', command: () => navigate('/courses') },
    { label: 'מאגר שיעורים', icon: 'pi pi-history', command: () => navigate('/history') },
    ...(user?.role === 'admin' ? [{ label: 'ניהול', icon: 'pi pi-cog', command: () => navigate('/admin') }] : []),
  ];

  const end = (
    <div className="flex align-items-center gap-3">
      <Avatar label={user?.role === 'admin' ? 'מ' : `${user?.name?.[0] || ''}${user?.last_name?.[0] || ''}`} shape="circle" />
      <span className="font-medium">שלום {user?.role === 'admin' ? 'מנהל' : `${user?.name} ${user?.last_name || ''}`}</span>
      <Button label="התנתק" icon="pi pi-sign-out" size="small" severity="secondary" onClick={() => { logoutUser(); navigate('/login'); }} />
    </div>
  );

  const start = (
    <div className="app-brand">
      תלמיד
      <small>פלטפורמת שיעורים דיגיטלית</small>
    </div>
  );

  return <Menubar model={items} start={start} end={end} style={{ direction: 'rtl', width: '100%', justifyContent: 'space-between' }} />;
}
