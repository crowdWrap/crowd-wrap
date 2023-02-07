export default function Engineer(props: { name: string }) {
  return <li key={props.name}> {props.name} </li>;
}
