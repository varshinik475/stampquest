import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AddVisitForm from '../src/components/AddVisitForm';

const { addVisitMock } = vi.hoisted(() => ({
  addVisitMock: vi.fn()
}));

vi.mock('../src/context/TravelContext', () => ({
  useTravel: () => ({ addVisit: addVisitMock })
}));

describe('AddVisitForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('announces required field validation without submitting', async () => {
    const user = userEvent.setup();
    render(<AddVisitForm />);

    await user.click(screen.getByRole('button', { name: 'Save Visit' }));

    expect(screen.getByText('Destination name is required.')).toBeInTheDocument();
    expect(screen.getByText('Country is required.')).toBeInTheDocument();
    expect(addVisitMock).not.toHaveBeenCalled();
  });

  it('submits trimmed visit details and resets the form', async () => {
    const user = userEvent.setup();
    render(<AddVisitForm />);

    await user.type(screen.getByLabelText('Destination name'), '  Lisbon  ');
    await user.type(screen.getByLabelText('Country'), '  Portugal  ');
    await user.type(screen.getByLabelText('Visit date'), '2026-08-25');
    await user.type(screen.getByLabelText('Notes'), '  Sunset walk  ');
    await user.click(screen.getByRole('button', { name: 'Save Visit' }));

    expect(addVisitMock).toHaveBeenCalledWith({
      destinationName: 'Lisbon',
      country: 'Portugal',
      date: '2026-08-25',
      notes: 'Sunset walk',
      photo: ''
    });
    expect(screen.getByLabelText('Destination name')).toHaveValue('');
  });
});
