import { Link } from 'react-router-dom';
import { AppointmentCalendarModule } from '../../components/appointments/AppointmentCalendarModule';

export default function BookAppointment() {
  return (
    <div className="w-full pb-8">
      <div className="themesflat-container">
        <div className="pt-6 pb-4">
          <Link to="/appointments" className="text-[16px] hover:underline">
            ← Back to appointments
          </Link>
        </div>
        <AppointmentCalendarModule />
      </div>
    </div>
  );
}
