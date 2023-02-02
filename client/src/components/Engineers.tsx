interface engineerPerson {
  allEngineers: string[];
}

export default function Engineers(engineers: engineerPerson) {
  return (
    <div className="engineer">
      <ul>
        {engineers.allEngineers.map((e) => {
          return <li key={e}> {e} </li>;
        })}
      </ul>
    </div>
  );
}
