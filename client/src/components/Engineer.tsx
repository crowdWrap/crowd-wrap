export default function Engineer(props: { e: string }) {
  return <li key={props.e}> {props.e} </li>;
}
