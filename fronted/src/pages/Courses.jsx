import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCategories, getSubcategoriesByCategory } from '../services/api';

export default function Courses() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    categories.forEach((category) => {
      getSubcategoriesByCategory(category.id).then((res) => {
        setSubcategories((prev) => ({ ...prev, [category.id]: res.data }));
      });
    });
  }, [categories]);

  return (
    <div className="courses-page app-shell">
      <Navbar />
      <div className="global-container">
        <div className="hero-banner custom-card">
          <div>
            <h1 className="page-title">קורסים מותאמים אישית</h1>
            <p className="hero-text">בחרי קטגוריה ולמדי שיעורים שמבוססים על התכנים האהובים עליך. הפלטפורמה מסדרת את התוכן וישמור אותו במאגר שיעורים שלך.</p>
          </div>
          <div className="stats-panel">
            <div className="stat-card">
              <h3>למידה לפי נושאים</h3>
              <p>קטגוריות ותת-קטגוריות שמאפשרות למקד את השיעור בצורה חכמה.</p>
            </div>
            <div className="stat-card">
              <h3>גישה מיידית</h3>
              <p>התחלי ללמוד עם כפתור אחד, ותהיי חלק מספריית השיעורים שלך.</p>
            </div>
            <div className="stat-card">
              <h3>שיעורים אישיים</h3>
              <p>השיעורים שנוצרים נשארים אצלך במערכת כהיסטוריה של למידה.</p>
            </div>
          </div>
        </div>

        <div className="section-title" style={{ marginTop: '2rem' }}>קטגוריות זמינות</div>
        <div className="courses-grid">
          {categories.map((category) => (
            <Card key={category.id} className="custom-card course-card" title={category.name}>
              <div className="course-meta">
                <span className="course-label">תת-קטגוריות</span>
                <div className="tags-row">
                  {(subcategories[category.id] || []).map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className="tag-pill"
                      onClick={() => navigate('/learn', { state: { category, subcategory: sub } })}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                label="התחל ללמוד"
                severity="help"
                onClick={() => navigate('/learn', { state: { category, subcategory: (subcategories[category.id] || [])[0] } })}
                disabled={(subcategories[category.id] || []).length === 0}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
