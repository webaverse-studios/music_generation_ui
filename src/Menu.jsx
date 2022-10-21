import "./App.css";

export default function Menu(props) {
  return (
    <div>
      {}
      <button
        className={
          props.menu === "musika" ? "button-selected" : "button-unselected"
        }
        onClick={() => {
          if (props.generating) {
            return;
          }

          props.setMenu("musika");
        }}
      >
        Musika
      </button>
      <button
        className={
          props.menu === "mumbert" ? "button-selected" : "button-unselected"
        }
        onClick={() => {
          if (props.generating) {
            return;
          }

          props.setMenu("mumbert");
        }}
      >
        Mumbert
      </button>
    </div>
  );
}
