import Card from "../components/Card";

function Mine() {
  return (
    <div className="max-w-2xl p-6   ">
      <div className="flex flex-col gap-6">
        <Card days="50" payback="500" level="1" cost="100 - 5000" />
        <Card days="50" payback="500" level="2" cost="100 - 5000" />
        <Card days="50" payback="500" level="3" cost="100 - 5000" />
        <Card days="50" payback="500" level="4" cost="100 - 5000" />
        <Card days="50" payback="500" level="5" cost="100 - 5000" />
      </div>
    </div>
  );
}

export default Mine;
