import Engineer from "./Engineer";

interface EngineerPerson {
  allEngineers: string[];
}

export default function Engineers(engineers: EngineerPerson) {
  return (
    <div className="engineer">
      <ul>
        {engineers.allEngineers.map((engineer) => (
          <Engineer key={engineer} name={engineer} />
        ))}
      </ul>
    </div>
  );
}
