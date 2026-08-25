import Passport from '../components/Passport';
import AddVisitForm from '../components/AddVisitForm';

export default function PassportPage() {
  return (
    <div className="page">
      <h1 className="sr-only">Travel passport</h1>
      <Passport />
      <AddVisitForm />
    </div>
  );
}
