export default function Engineer(props: { person: string }) {
  return <li key={props.person}> {props.person} </li>;
}
