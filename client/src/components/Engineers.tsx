export default function Engineers({
  engineers,
}: {
  engineers: Array<{ engineer: string }>;
}) {
  return (
    <div className="engineer">
      <ul>
        {engineers.map((e) => {
          return <li key={e.engineer}> {e.engineer} </li>;
        })}
      </ul>
    </div>
  );
}
