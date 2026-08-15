import { useState } from 'react';
import { useTravel } from '../context/TravelContext';

const initialForm = {
  destinationName: '',
  country: '',
  date: '',
  notes: '',
  photoPreview: ''
};

export default function AddVisitForm() {
  const { addVisit } = useTravel();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photoPreview: previewUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {};
    if (!form.destinationName.trim()) nextErrors.destinationName = 'Destination name is required.';
    if (!form.country.trim()) nextErrors.country = 'Country is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    addVisit({
      destinationName: form.destinationName.trim(),
      country: form.country.trim(),
      date: form.date,
      notes: form.notes.trim(),
      photo: form.photoPreview
    });

    setForm(initialForm);
    setErrors({});
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h3>Add a New Visit</h3>

      <label>
        Destination name
        <input
          placeholder="e.g. Paris"
          value={form.destinationName}
          onChange={(e) => setForm({ ...form, destinationName: e.target.value })}
        />
        {errors.destinationName && <small className="error-text">{errors.destinationName}</small>}
      </label>

      <label>
        Country
        <input
          placeholder="e.g. France"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />
        {errors.country && <small className="error-text">{errors.country}</small>}
      </label>

      <label>
        Visit date
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
      </label>

      <label>
        Notes
        <textarea placeholder="Trip notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </label>

      <label>
        Photo (optional)
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
      </label>

      {form.photoPreview && <img className="preview-image" src={form.photoPreview} alt="Preview" />}

      <button type="submit">Save Visit</button>
    </form>
  );
}
