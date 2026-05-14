import { useState, useEffect, useRef } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import Navbar from '../components/Navbar';
import { getUsers, getCategories, createCategory, deleteCategory, createSubcategory, deleteSubcategory, getSubcategoriesByCategory, getPrompts, deletePrompt } from '../services/api';

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const toast = useRef(null);

  const fetchAll = () => {
    getUsers().then((res) => setUsers(res.data));
    getCategories().then((res) => setCategories(res.data));
    getPrompts().then((res) => setPrompts(res.data));
  };

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    if (filterCategory) {
      getSubcategoriesByCategory(filterCategory.id).then((res) => setSubcategories(res.data));
    } else {
      setSubcategories([]);
    }
  }, [filterCategory]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await createCategory({ name: newCategory });
      toast.current.show({ severity: 'success', summary: 'נוסף', detail: 'קטגוריה נוספה' });
      setNewCategory('');
      fetchAll();
    } catch {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן להוסיף' });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      toast.current.show({ severity: 'success', summary: 'נמחק' });
      fetchAll();
    } catch {
      toast.current.show({ severity: 'error', summary: 'שגיאה' });
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim() || !selectedCategoryForSub) return;
    try {
      await createSubcategory({ name: newSubcategory, category_id: selectedCategoryForSub.id });
      toast.current.show({ severity: 'success', summary: 'נוסף', detail: 'תת-קטגוריה נוספה' });
      setNewSubcategory('');
      if (filterCategory?.id === selectedCategoryForSub.id) {
        getSubcategoriesByCategory(filterCategory.id).then((res) => setSubcategories(res.data));
      }
    } catch {
      toast.current.show({ severity: 'error', summary: 'שגיאה' });
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await deleteSubcategory(id);
      toast.current.show({ severity: 'success', summary: 'נמחק' });
      if (filterCategory) {
        getSubcategoriesByCategory(filterCategory.id).then((res) => setSubcategories(res.data));
      }
    } catch {
      toast.current.show({ severity: 'error', summary: 'שגיאה' });
    }
  };

  const roleTemplate = (row) => <Tag value={row.role === 'admin' ? 'מנהל' : 'משתמש'} severity={row.role === 'admin' ? 'warning' : 'info'} />;
  const dateTemplate = (row) => new Date(row.created_at).toLocaleDateString('he-IL');
  const catActionsTemplate = (row) => <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDeleteCategory(row.id)} />;
  const subActionsTemplate = (row) => <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDeleteSubcategory(row.id)} />;
  const promptActionsTemplate = (row) => <Button icon="pi pi-trash" size="small" severity="danger" onClick={() => handleDeletePrompt(row.id)} />;
  const promptUserTemplate = (row) => row.user_name || 'לא ידוע';
  const promptCategoryTemplate = (row) => `${row.category_name || 'כללי'} / ${row.subcategory_name || ''}`;

  const handleDeletePrompt = async (id) => {
    try {
      await deletePrompt(id);
      toast.current.show({ severity: 'success', summary: 'נמחק', detail: 'השיעור נמחק בהצלחה' });
      fetchAll();
    } catch {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'לא ניתן למחוק' });
    }
  };

  return (
    <div className="admin-page app-shell">
      <Toast ref={toast} position="top-left" />
      <Navbar />
      <div className="global-container">
        <div className="section-title">לוח ניהול</div>
        <TabView>
          <TabPanel header="משתמשים" leftIcon="pi pi-users ml-2">
            <DataTable value={users} paginator rows={10} emptyMessage="אין משתמשים">
              <Column field="name" header="שם" />
              <Column field="phone" header="טלפון" />
              <Column header="תפקיד" body={roleTemplate} />
              <Column header="תאריך הצטרפות" body={dateTemplate} />
            </DataTable>
          </TabPanel>

          <TabPanel header="קטגוריות" leftIcon="pi pi-list ml-2">
            <div className="flex gap-2 mb-3">
              <InputText value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="שם קטגוריה חדשה" />
              <Button label="הוסף" icon="pi pi-plus" onClick={handleAddCategory} />
            </div>
            <DataTable value={categories} emptyMessage="אין קטגוריות">
              <Column field="name" header="שם" />
              <Column header="פעולות" body={catActionsTemplate} />
            </DataTable>
          </TabPanel>

          <TabPanel header="תת-קטגוריות" leftIcon="pi pi-sitemap ml-2">
            <div className="flex gap-2 mb-3">
              <Dropdown value={selectedCategoryForSub} options={categories} onChange={(e) => setSelectedCategoryForSub(e.value)} optionLabel="name" placeholder="בחר קטגוריה" />
              <InputText value={newSubcategory} onChange={(e) => setNewSubcategory(e.target.value)} placeholder="שם תת-קטגוריה" />
              <Button label="הוסף" icon="pi pi-plus" onClick={handleAddSubcategory} />
            </div>
            <div className="mb-3">
              <Dropdown value={filterCategory} options={categories} onChange={(e) => setFilterCategory(e.value)} optionLabel="name" placeholder="סנן לפי קטגוריה" showClear />
            </div>
            <DataTable value={subcategories} emptyMessage="בחר קטגוריה לצפייה">
              <Column field="name" header="שם" />
              <Column header="פעולות" body={subActionsTemplate} />
            </DataTable>
          </TabPanel>

          
        </TabView>
      </div>
    </div>
  );
}
