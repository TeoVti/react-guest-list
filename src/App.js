import './App.css';
import { useEffect, useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [allGuests, setAllGuests] = useState(undefined);

  const baseUrl = 'http://localhost:5000';

  async function fetchGuests() {
    const response = await fetch(`${baseUrl}/`);
    const data = await response.json();
    setAllGuests(data);
  }

  useEffect(() => {
    fetchGuests();
  }, []);

  const submitName = async () => {
    await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName }),
    });
    fetchGuests();
  };

  console.log(allGuests);

  if (allGuests === undefined) {
    return (
      <>
        <br />
        <br />
        <br />
        <br />
        <br />
        Loading..........................
      </>
    );
  }

  return (
    <div>
      <input
        onChange={(event) => setFirstName(event.target.value)}
        placeholder="First Name"
        type="text"
      />
      <input
        onChange={(event) => setLastName(event.target.value)}
        placeholder="Last Name"
        type="text"
      />
      <button type="submit" className="search" onClick={submitName}>
        Submit
      </button>

      <ol>
        {allGuests.map((guest) => (
          <li key={guest.id}>
            <button
              onClick={async () => {
                const response = await fetch(`${baseUrl}/${guest.id}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    attending: guest.attending === true ? false : true,
                  }),
                });
                fetchGuests();
              }}
            >
              {' '}
              {guest.attending === true ? '✅' : '❌'}
            </button>
            {guest.firstName + ' ' + guest.lastName}
            <button
              onClick={async () => {
                const response = await fetch(`${baseUrl}/${guest.id}`, {
                  method: 'DELETE',
                });
                fetchGuests();
              }}
            >
              X
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
