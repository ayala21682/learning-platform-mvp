import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import Navbar from '../components/Navbar';
import { getPrompts, getAllPrompts, deletePrompt } from '../services/api';

export default function History() {
  const [prompts, setPrompts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const toast = useRef(null);
  const location = useLocation();

  const getPreviewText = (text) => {
    const content = text ? text.replace(/\s+/g, ' ').trim() : 'אין תשובה זמינה';
    if (content.length <= 140) return content;
    return `${content.slice(0, 140).trim()}...`;
  };

  useEffect(() => {
    if (location.state?.selectedLesson) {
      setSelected(location.state.selectedLesson);
    }
  }, [location.state]);

  const fetchPrompts = () => {
    setLoading(true);
    (viewAll ? getAllPrompts() : getPrompts())
      .then((res) => setPrompts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPrompts(); }, [viewAll]);

  const handleDelete = async (id) => {
    try {
      await deletePrompt(id);
      toast.current.show({ severity: 'success', summary: 'נמחק', detail: 'הפרומפט נמחק בהצלחה' });
      fetchPrompts();
    } catch {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן למחוק' });
    }
  };

  return (
    <div className="lessons-page app-shell">
      <Toast ref={toast} position="top-left" />
      <Navbar />
      <div className="global-container">
        <div className="section-title">מאגר שיעורים</div>
        <div className="flex gap-2 mb-3">
          <Button label="השיעורים שלי" icon="pi pi-user" severity={viewAll ? "secondary" : "primary"} onClick={() => setViewAll(false)} />
          <Button label="כל השיעורים" icon="pi pi-users" severity={viewAll ? "primary" : "secondary"} onClick={() => setViewAll(true)} />
        </div>
        <div className="history-grid-container">
          {loading ? (
            <div className="flex justify-content-center p-6 custom-card" style={{ minHeight: '220px' }}>
              <ProgressSpinner style={{ width: '3rem', height: '3rem' }} />
            </div>
          ) : prompts.length === 0 ? (
            <div className="empty-state custom-card">
              אין עדיין שיעורים. בחרי קטגוריה, שלחי הנחיה וקבלי שיעור מותאם למערכת.
            </div>
          ) : (
            <div className="lesson-grid history-grid">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="lesson-card custom-card history-card">
                  <div className="lesson-category">{prompt.category_name || 'כללי'} • {prompt.subcategory_name || 'אין תת-קטגוריה'}</div>
                  {viewAll && <div className="lesson-creator">נוצר על ידי: {prompt.user_name} {prompt.user_last_name}</div>}
                  <h3 className="lesson-title">{prompt.prompt}</h3>
                  <p className="lesson-text preview-text">{getPreviewText(prompt.response?.answer)}</p>
                  <div className="lesson-meta">
                    <span className="status-badge">{new Date(prompt.created_at).toLocaleDateString('he-IL')}</span>
                    <Button label="הצג שיעור" icon="pi pi-eye" size="small" severity="secondary" onClick={() => setSelected(prompt)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog header="פרטי שיעור" visible={!!selected} onHide={() => setSelected(null)} style={{ width: '500px', direction: 'rtl' }} breakpoints={{ '640px': '90vw' }}>
        {selected && (
          <div className="flex flex-column gap-3">
            <div>
              <Tag value="נושא" severity="info" />
              <p style={{ marginTop: '8px' }}>{selected.prompt}</p>
            </div>
            <div>
              <Tag value="קטגוריה" severity="success" />
              <p style={{ marginTop: '8px' }}>{selected.category_name || 'כללי'} / {selected.subcategory_name || 'אין תת-קטגוריה'}</p>
            </div>
            {viewAll && (
              <div>
                <Tag value="יוצר" severity="warning" />
                <p style={{ marginTop: '8px' }}>{selected.user_name}</p>
              </div>
            )}
            <div>
              <Tag value="תוכן" severity="success" />
              <p style={{ marginTop: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{selected.response?.answer}</p>
            </div>
            <small className="text-color-secondary">מודל: {selected.response?.model} | טוקנים: {selected.response?.tokens_used}</small>
          </div>
        )}
      </Dialog>
    </div>
  );
}
