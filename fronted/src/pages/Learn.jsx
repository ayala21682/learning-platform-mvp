import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import Navbar from '../components/Navbar';
import { getCategories, getSubcategoriesByCategory, getPrompts, createPrompt } from '../services/api';

export default function Learn() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [response, setResponse] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const toast = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res.data);
      if (location.state?.category) {
        const matchedCategory = res.data.find((cat) => cat.id === location.state.category.id);
        setSelectedCategory(matchedCategory || location.state.category);
      }
    });
    fetchPrompts();
  }, [location.state]);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedSubcategory(null);
      getSubcategoriesByCategory(selectedCategory.id).then((res) => {
        setSubcategories(res.data);
        if (location.state?.subcategory) {
          const matchedSubcategory = res.data.find((sub) => sub.id === location.state.subcategory.id);
          setSelectedSubcategory(matchedSubcategory || location.state.subcategory);
        }
      });
    }
  }, [selectedCategory, location.state]);

  const fetchPrompts = () => {
    setHistoryLoading(true);
    getPrompts()
      .then((res) => setPrompts(res.data))
      .finally(() => setHistoryLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedSubcategory || !promptText.trim()) {
      toast.current.show({ severity: 'warn', summary: 'שים לב', detail: 'יש למלא את כל השדות' });
      return;
    }
    setLoading(true);
    setResponse(null);
    try {
      const res = await createPrompt({
        category_id: selectedCategory.id,
        subcategory_id: selectedSubcategory.id,
        prompt: promptText,
      });
      setResponse(res.data.response);
      setSelectedLesson(res.data);
      setPromptText('');
      // הוסף את השיעור החדש לרשימה מיד
      setPrompts(prev => [res.data, ...prev]);
      fetchPrompts(); // וודא סנכרון עם השרת
    } catch {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'אירעה שגיאה, נסה שוב' });
    } finally {
      setLoading(false);
    }
  };

  const openLesson = (lesson) => {
    navigate('/history', { state: { selectedLesson: lesson } });
  };

  return (
    <div className="learning-page app-shell">
      <Toast ref={toast} position="top-left" />
      <Navbar />
      <div className="global-container">
        <div className="hero-banner custom-card">
          <div>
            <h1 className="page-title">מרכז הלמידה שלך</h1>
            <p className="hero-text">צרי שיעור חדש, או בחרי שיעור קיים כדי לראות את התוכן והמפרט שלו במקום אחד.</p>
          </div>
          <div className="stats-panel">
            <div className="stat-card">
              <h3>לימוד מיידי</h3>
              <p>כתבי את הנושא וקבלי שיעור חדש של AI.</p>
            </div>
            <div className="stat-card">
              <h3>מאגר שיעורים</h3>
              <p>כל השיעורים נשמרים כחלק מהספרייה האישית שלך.</p>
            </div>
            <div className="stat-card">
              <h3>ניהול תוכן</h3>
              <p>בחרי שיעורים קודמים וצפי בתוכן שלהם מחדש.</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="lessons-side custom-card" style={{ marginTop: '2rem' }}>
            <div className="section-title">רשימת שיעורים</div>
            {historyLoading ? (
              <div className="flex justify-content-center p-6">
                <ProgressSpinner style={{ width: '2.7rem', height: '2.7rem' }} />
              </div>
            ) : prompts.length === 0 ? (
              <div className="empty-state">עדיין אין שיעורים. צרי שיעור חדש כדי להתחיל.</div>
            ) : (
              <div className="lesson-list">
                {prompts.map((lesson) => (
                  <button
                    type="button"
                    key={lesson.id}
                    className={`lesson-row ${selectedLesson?.id === lesson.id ? 'lesson-row-active' : ''}`}
                    onClick={() => openLesson(lesson)}
                  >
                    <div className="lesson-row-title">{lesson.prompt}</div>
                    <div className="lesson-row-meta">{new Date(lesson.created_at).toLocaleDateString('he-IL')}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lessons-main">
            <Card className="custom-card form-card">
              <div className="section-title">צרי שיעור חדש</div>
              <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                <div className="flex flex-column gap-1">
                  <label>קטגוריה</label>
                  <Dropdown
                    value={selectedCategory}
                    options={categories}
                    onChange={(e) => setSelectedCategory(e.value)}
                    optionLabel="name"
                    placeholder="בחר קטגוריה"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-1">
                  <label>תת-קטגוריה</label>
                  <Dropdown
                    value={selectedSubcategory}
                    options={subcategories}
                    onChange={(e) => setSelectedSubcategory(e.value)}
                    optionLabel="name"
                    placeholder="בחר תת-קטגוריה"
                    disabled={!selectedCategory}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-1">
                  <label>נושא השיעור</label>
                  <InputTextarea
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={7}
                    placeholder="תארי בקצרה את נושא השיעור, מטרה ורצון ללמוד משהו מעשי."
                    className="w-full"
                  />
                </div>
                <Button label="צור שיעור" icon="pi pi-send" loading={loading} type="submit" severity="help" />
              </form>
            </Card>

            {(selectedLesson || response) && (
              <Card className="custom-card lesson-card">
                <div className="section-title">פרטי שיעור</div>
                <h3 className="lesson-title">{selectedLesson ? selectedLesson.prompt : 'שיעור חדש'}</h3>
                <p className="lesson-text">
                  {response ? response.answer : selectedLesson?.response?.answer || 'בחרי שיעור מהרשימה כדי לראות את התוכן.'}
                </p>
                <div className="lesson-meta">
                  <span className="status-badge">{selectedLesson ? new Date(selectedLesson.created_at).toLocaleDateString('he-IL') : 'חדש'}</span>
                  <span className="status-badge">מודל: {response ? response.model : selectedLesson?.response?.model || 'N/A'}</span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
