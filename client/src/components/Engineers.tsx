import Engineer from "./Engineer";

interface engineerPerson {
  allEngineers: string[];
}

export default function Engineers(engineers: engineerPerson) {
  return (
    <div className="engineer">
      <ul>
        {engineers.allEngineers.map((e) => {
          return <Engineer e={e} />;
        })}
      </ul>
    </div>
  );
}
